import type { User } from '$lib/stores/userStore';
import { redirect } from '@sveltejs/kit';
import type { LayoutServerLoad } from './$types';

export const load: LayoutServerLoad = async ({ locals }) => {

  console.log("🟢 locals.user en layout.server.ts:", locals.user); // 📌 Verifica qué se está recibiendo en el servidor
  // if (!locals.user) return { user: null };
  // if (!locals.user) {
  //   console.log("🔴 Acceso no autorizado, redirigiendo...");
  //   throw redirect(303, '/'); 
  // }

  const user = locals.user ?? null; 
  console.log("🔵 User enviado desde layout.server.ts:", user); // 🔍 Verificar qué se está retornando


  return { user }; // 📌 Enviar user correctamente  
  // return {
  //   user: {
  //     id: locals.user.userId,
  //     username: locals.user.username,
  //     fullName: locals.user.fullName
  //   } as User
  // };
};