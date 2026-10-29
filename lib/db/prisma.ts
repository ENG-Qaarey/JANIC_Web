import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { getCloudflareContext } from "@opennextjs/cloudflare";

type HyperdriveBinding = { connectionString: string };
type RequestContext = { env: unknown; ctx: unknown };

/**
 * Cloudflare freezes a Worker isolate between requests but keeps module-level
 * state. A `pg` pool cached at module scope therefore hands a stale TCP socket
 * to the next request, and that query hangs forever ("The Workers runtime
 * canceled this request because it detected that your Worker's code had hung").
 *
 * So the client must be scoped to a single request. OpenNext stores the
 * Cloudflare context in an AsyncLocalStorage per request, which makes it a
 * safe per-request key (A single client per request also keeps the existing
 * `prisma.user.findMany(...)` call sites working unchanged.
 */
const requestClients = new WeakMap<object, PrismaClient>();

/** Used outside of a request boundary (next dev / next build / node scripts). */
let nodeClient: PrismaClient | undefined;

function createPrismaClient(connectionString: string | undefined): PrismaClient {
  // `maxUses: 1` destroys a pooled connection after a single use, so a socket
  // is never carried over into a later request either.
  const adapter = new PrismaPg({ connectionString, maxUses: 1 });
  return new PrismaClient({
    adapter,
    log: process.env.NODE_ENV === "development" ? ["warn", "error"] : ["error"],
  });
}

function resolveRequestContext(): RequestContext | undefined {
  try {
    return getCloudflareContext() as unknown as RequestContext;
  } catch {
    // Not running inside a Cloudflare request context.
    return undefined;
  }
}

function getPrismaClient(): PrismaClient {
  const context = resolveRequestContext();

  if (!context) {
    nodeClient ??= createPrismaClient(process.env.DATABASE_URL);
    return nodeClient;
  }

  // One client per request: the Cloudflare context object is created per
  // request, so this never hands a stale socket to a later request.
  let client = requestClients.get(context);
  if (!client) {
    const hyperdrive = (context.env as { HYPERDRIVE?: HyperdriveBinding } | undefined)?.HYPERDRIVE;
    client = createPrismaClient(hyperdrive?.connectionString ?? process.env.DATABASE_URL);
    requestClients.set(context, client);
  }
  return client;
}

/**
 * Lazy proxy so the client is created on first query (inside the request
 * context) rather than at module load, while keeping the existing
 * `prisma.user.findMany(...)` call sites working unchanged.
 */
export const prisma = new Proxy({} as PrismaClient, {
  get(_target, prop) {
    const client = getPrismaClient();
    const value = (client as unknown as Record<string | symbol, unknown>)[prop];
    return typeof value === "function" ? value.bind(client) : value;
  },
});

export default prisma;
