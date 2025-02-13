// src/lib/prisma.ts
import { PrismaClient } from '@prisma/client';

// Evitamos instanciar PrismaClient múltiples veces en desarrollo
declare global {
  var prisma: PrismaClient | undefined;
}

export const prisma = globalThis.prisma || new PrismaClient();
if (import.meta.env.DEV) globalThis.prisma = prisma;