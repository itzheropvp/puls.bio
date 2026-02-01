import { PrismaPg } from "@prisma/adapter-pg";
import { type Prisma, PrismaClient } from "@prisma/client";

let prisma: ExtendedPrismaClient;

declare global {
  var __db__: ExtendedPrismaClient | undefined;
}

if (!global.__db__) {
  global.__db__ = getClient();
}

// eslint-disable-next-line prefer-const
prisma = global.__db__;

type ExtendedPrismaClient = ReturnType<typeof getClient>;

function getClient() 
{
  console.info("Connecting to database...");

  const adapter = new PrismaPg({
    connectionString: process.env.DATABASE_URL!,
  });

  const client = new PrismaClient({
    adapter,
    log: ["query", "info", "warn", "error"],
  });

  client.$connect();
  return client;
}

export { prisma };
