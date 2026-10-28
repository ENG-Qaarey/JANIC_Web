import { Pool } from "pg";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "@prisma/client";

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
  pool: Pool | undefined;
};

function createPrismaClient() {
  const connectionString = process.env.DATABASE_URL;
  const pool = globalForPrisma.pool ?? new Pool({ connectionString });
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