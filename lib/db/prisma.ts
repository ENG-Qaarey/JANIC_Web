import { Pool } from "pg";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "@prisma/client";

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
  pool: Pool | undefined;
};

function getConnectionString(): string {
  try {
    const { getCloudflareContext } = require("@opennextjs/cloudflare");
    const ctx = getCloudflareContext();
    if (ctx?.env?.HYPERDRIVE?.connectionString) {
      return ctx.env.HYPERDRIVE.connectionString;
    }
  } catch {
    // Outside request context
  }

  return (
    process.env.DATABASE_URL ||
    "postgresql://neondb_owner:npg_pQjr4A0VTwYf@ep-dawn-sea-b40enbve-pooler.c-6.us-east-2.aws.neon.tech/neondb?sslmode=require&channel_binding=require"
  );
}

function createPrismaClient() {
  const connectionString = getConnectionString();
  const pool =
    globalForPrisma.pool ??
    new Pool({
      connectionString,
      ssl: { rejectUnauthorized: false },
    });
  const adapter = new PrismaPg(pool);

  return {
    pool,
    prisma: new PrismaClient({
      adapter,
      log: process.env.NODE_ENV === "development" ? ["warn", "error"] : ["error"],
    }),
  };
}

if (!globalForPrisma.prisma) {
  const { pool, prisma: newPrisma } = createPrismaClient();
  globalForPrisma.pool = pool;
  globalForPrisma.prisma = newPrisma;
}

export const prisma = globalForPrisma.prisma;
export default prisma;