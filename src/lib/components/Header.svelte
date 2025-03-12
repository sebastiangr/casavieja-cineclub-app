<script lang="ts">
  import LogoutButton from '$lib/components/LogoutButton.svelte';
	import type { User } from '$lib/types';
	import { userStore} from '$lib/stores/userStore';
	import { LightSwitch } from '@skeletonlabs/skeleton';
  import { LogIn } from 'lucide-svelte';
	import UserCard from './UserCard.svelte';
    
  let user: User | null;
  userStore.subscribe((value) => user = value); // Reactividad automática
</script>

<header class="fixed flex justify-center items-center bg-surface-900 w-full h-20 z-50">

  <!-- TODO: Redefine user card -->
  <UserCard />

  <!-- {#if user}
    <div class="hidden md:flex items-center mr-4  ">
      <div class="relative">
        <img
          src={`https://api.dicebear.com/9.x/initials/svg?seed=${user?.fullName}`}          
          alt="User Avatar"
          class="rounded-full w-12 h-12 object-cover"
        />
      </div>
      <div class="text-left pl-3">      
        <h2 class="text-lg font-bold">{user.fullName}</h2>
        <p class="text-sm text-gray-600">@{user.username}</p>
      </div>
    </div>
  {:else} -->
    <!-- TODO: Volver componente -->
    <!-- <button type="button" class="btn btn-sm variant-filled-primary">
      <LogIn strokeWidth={1.25} />
      Iniciar sesión
    </button>
  {/if} -->

  <!-- TODO: Cambiar por logo -->
  {#if user}
    <h1 class="hidden sm:block text-lg font-bold md:text-2xl">Bienvenido, {user.fullName}</h1>
  {/if}

  <!-- {#if user}
    <div class="hidden md:flex flex-row justify-center items-center gap-x-4 ">
      <a href="/dashboard" class="text-primary-500 hover:text-primary-400">Dashboard</a>
      <a href="/messages" class="text-primary-500 hover:text-primary-400">Mensajes</a>      
      <a href="/peliculas" class="text-primary-500 hover:text-primary-400">Películas</a>      
    </div>
  {/if} -->
  
  <div class="flex flex-row items-center">
    {#if user}
      <LogoutButton />
    {/if}
  </div>
</header>

