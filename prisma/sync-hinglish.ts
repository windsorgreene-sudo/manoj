/**
 * Pushes Hinglish content into an existing database WITHOUT reseeding (only the *Hinglish columns change).
 *   DATABASE_URL=... npx tsx prisma/sync-hinglish.ts
 */
import "dotenv/config";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../lib/generated/prisma/client";
import { syncHinglish } from "./seed/hinglish-sync";

const db = new PrismaClient({ adapter: new PrismaPg({ connectionString: process.env.DATABASE_URL as string }) });

syncHinglish(db)
  .then((r) => console.log(`Hinglish synced: ${r}`))
  .finally(() => db.$disconnect());
