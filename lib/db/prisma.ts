import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "@prisma/client";

// Create Prisma client with pg adapter for Workers/Hyperdrive compatibility
function createPrismaClient(connectionString: string) {
  const adapter = new PrismaPg({ connectionString });
  return new PrismaClient({ adapter });
}

// Get connection string: prefer Hyperdrive in Workers, fall back to DATABASE_URL
function getConnectionString(): string {
  // In Cloudflare Workers runtime, Hyperdrive binding is available
  if (typeof process !== "undefined" && typeof window === "undefined") {
    const hyperdriveConn = process.env.HYPERDRIVE?.connectionString;
    if (hyperdriveConn) {
      return hyperdriveConn;
    }
  }
  // Fall back to DATABASE_URL from .env (local dev)
  return process.env.DATABASE_URL || "postgresql://neondb_owner:npg_pQjr4A0VTwYf@ep-dawn-sea-b40enbve-pooler.c-6.us-east-2.aws.neon.tech/neondb?sslmode=require&channel_binding=require";
}

// Export async function for Workers (per-request instantiation)
export async function getPrismaClient() {
  const connectionString = getConnectionString();
  return createPrismaClient(connectionString);
}

// Export for backward compatibility (static generation, local dev)
const connectionString = getConnectionString();
export const prisma = new PrismaClient({ adapter: new PrismaPg({ connectionString }) });