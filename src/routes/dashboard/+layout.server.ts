import { redirect } from '@sveltejs/kit';
import type { LayoutServerLoad } from './$types';

export const load: LayoutServerLoad = async ({ locals }) => {
  if (!locals.user) {
    console.log("🔴 Acceso no autorizado a /dashboard, redirigiendo...");
    throw redirect(303, '/'); // Redirigir si no hay usuario autenticado
  }

  return { user: locals.user };
};