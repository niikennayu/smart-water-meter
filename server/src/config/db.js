import { PrismaClient } from '@prisma/client';
import { PrismaClient as PrismaClientEdge } from '@prisma/client/extension'; // If needed, but usually just standard Client is fine
import { PrismaMariaDb } from '@prisma/adapter-mariadb';
import * as mariadb from 'mariadb';

// Initialize MariaDB Pool
const connectionString = process.env.DATABASE_URL;
const pool = mariadb.createPool(connectionString);

// Initialize Prisma with the MariaDB adapter
const adapter = new PrismaMariaDb(pool);

const prisma = new PrismaClient({
  adapter,
  log: process.env.NODE_ENV === 'development' ? ['query', 'info', 'warn', 'error'] : ['warn', 'error'],
});

// Handle Prisma Client disconnection on app shutdown
process.on('SIGINT', async () => {
  await prisma.$disconnect();
  process.exit(0);
});

process.on('SIGTERM', async () => {
  await prisma.$disconnect();
  process.exit(0);
});

export default prisma;
