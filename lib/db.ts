import "server-only";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "@/lib/generated/prisma/client";

const globalForPrisma = globalThis as unknown as { prisma?: PrismaClient };

function createClient() {
  const connectionString = process.env.DATABASE_URL;
  if (!connectionString) {
    throw new Error("DATABASE_URL is not set. Copy .env.example to .env and add your Neon connection string.");
  }
  return new PrismaClient({ adapter: new PrismaPg({ connectionString }) });
}

/** Lazily-created singleton so builds without a database don't crash at import time. */
export const db: PrismaClient = new Proxy({} as PrismaClient, {
  get(_target, prop, receiver) {
    if (!globalForPrisma.prisma) globalForPrisma.prisma = createClient();
    return Reflect.get(globalForPrisma.prisma, prop, receiver);
  },
});

export const hasDatabase = () => Boolean(process.env.DATABASE_URL);
