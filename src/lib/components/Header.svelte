<script lang="ts">
  import LogoutButton from '$lib/components/LogoutButton.svelte';
  import { page } from '$app/state'; // ✅ Importar desde @app/state
	import { userStore, type User } from '$lib/stores/userStore';
    
  let user: User | null;
  userStore.subscribe((value) => user = value); // ✅ Reactividad automática
</script>

<header class="p-4 bg-gray-800 text-white flex justify-between">
  {#if user}
    <div>
      <span>{user.fullName} ({user.username})</span>
      <LogoutButton />
    </div>
  {:else}
    <a href="/" class="text-blue-400">Iniciar sesión</a>
  {/if}
</header>