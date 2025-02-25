import { page } from '$app/state';
import { writable } from 'svelte/store';

export interface User {
  id: string;
  username: string;
  fullName: string; // Agregado el campo fullName
}


export const userStore = writable<User | null>(null); // ✅ Store inicializado en null
// export const userStore = writable<User | null>(null);

// export const userStore = $derived(page, ($page) => $page.data.user);
// const userStore = writable<User | null>(null);

// const setUser = (user: User) => {
//   userStore.set(user);
//   return true;
// };

// const clearUser = () => {
//   userStore.set(null);
// };

// export { userStore, setUser, clearUser };

