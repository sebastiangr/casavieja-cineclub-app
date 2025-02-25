import { page } from '$app/state';
import { writable } from 'svelte/store';
import type { User } from '$lib/types';

// export interface User {
//   id: string;
//   username: string;
//   fullName: string;
// }


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

