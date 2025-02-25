<script lang="ts">
  import LogoutButton from '$lib/components/LogoutButton.svelte';
  import { page } from '$app/state'; // ✅ Importar desde @app/state
	import { userStore, type User } from '$lib/stores/userStore';
	import { LightSwitch } from '@skeletonlabs/skeleton';
    
  let user: User | null;
  userStore.subscribe((value) => user = value); // Reactividad automática
</script>

<header class="absolute flex justify-between items-center w-full h-20 pl-8 pr-8 text-white">
  {#if user}
    <div>
      <LogoutButton />
    </div>
    <div class="flex items-center mr-4">
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
  {:else}
    <a href="/" class="text-blue-400">Iniciar sesión</a>
  {/if}
  <LightSwitch />
</header>

