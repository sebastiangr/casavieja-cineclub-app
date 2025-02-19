import { json } from '@sveltejs/kit';
import { prisma } from '$lib/prisma';

export async function GET() {
  try {
    await prisma.$queryRaw`SELECT 1`;
    return json({ dbStatus: 'connected' });
  } catch {
    return json({ dbStatus: 'disconnected' });
  }
}