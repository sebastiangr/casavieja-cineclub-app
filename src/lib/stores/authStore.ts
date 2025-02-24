import { writable } from 'svelte/store';

// export interface User {
//   username: string;
//   fullName: string;
// }

// export const authStore = writable<User | null>(null);

// export function getAuthUser(callback: (value: User | null) => void) {
//   return authStore.subscribe(callback);
// }

// export function setAuthUser(user: User | null) {
//   authStore.set(user);
// }


// export async function fetchAuthUser(): Promise<void> {
//   try {
//     const userData = localStorage.getItem('user');
//     if (userData) {
//       // Validar que los datos sean un string JSON válido
//       if (typeof userData === 'string' && userData.trim().startsWith('{')) {
//         const user = JSON.parse(userData) as User;
//         // Validar que el objeto tenga las propiedades requeridas
//         if (user && typeof user.username === 'string' && typeof user.fullName === 'string') {
//           authStore.set(user);
//           return;
//         }
//       }
//       // Si los datos no son válidos, limpiar el localStorage
//       localStorage.removeItem('user');
//     }
//     authStore.set(null);
//   } catch (error) {
//     console.error('Error fetching user:', error);
//     localStorage.removeItem('user');
//     authStore.set(null);
//   }
// }
