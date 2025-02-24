import { writable } from 'svelte/store';

export interface User {
  id: string;
  username: string;
  fullName: string; // Agregado el campo fullName
}

// const userStore = writable<User | null>(null);

// const setUser = (user: User) => {
//   userStore.set(user);
//   return true;
// };

// const clearUser = () => {
//   userStore.set(null);
// };

// export { userStore, setUser, clearUser };

