import { PrismaClient } from "@prisma/client";

const SCHEMA_VERSION = "2026-10-11-v8-engagement-controls";
const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
  schemaVersion?: string;
};

// If cached prisma instance lacks new models or is from an earlier schema version, reset it
if (
  globalForPrisma.prisma &&
  (!(globalForPrisma.prisma as any).trainingComment ||
    !(globalForPrisma.prisma as any).researchComment ||
    !(globalForPrisma.prisma as any).projectMember ||
    globalForPrisma.schemaVersion !== SCHEMA_VERSION)
) {
  try {
    (globalForPrisma.prisma as any).$disconnect();
  } catch {}
  globalForPrisma.prisma = undefined;
}

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: process.env.NODE_ENV === "development" ? ["warn", "error"] : ["error"],
  });

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
  globalForPrisma.schemaVersion = SCHEMA_VERSION;
}

export default prisma;
