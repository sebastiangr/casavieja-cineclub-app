<script lang="ts">
  import '../app.postcss';
  import { LightSwitch } from '@skeletonlabs/skeleton';
  import { initializeStores } from '@skeletonlabs/skeleton';
  import ConnectionStatus from '$lib/components/ConnectionStatus.svelte';
  import type { User } from '$lib/stores/userStore';

  // Inicializar stores globales de Skeleton UI
  initializeStores();

  
  // let { children, user } = $props();
  // let { children, user } = $props<{ children: any, user: User | null }>(); // 📌 Aquí obtenemos 'user' de los props  
  // console.log("🧐 User in layout props:", user);

  let props = $props<{ children: any; user: User | null }>(); // 📌 Obtener los props correctamente
  console.log("🔴 Props en layout.svelte:", props); // 🔍 Verifica todo el objeto props
  console.log("🔴 User Props en layout.svelte:", props.data.user);



  let { children, data } = props; // Extraer 'data' correctamente
  let user = data.user; // 📌 Ahora sí extraemos el usuario correctamente
  console.log("🟡 User en layout.svelte (Corregido):", user); // 🔍 Ahora debería mostrar correctamente el usuario

  function showUserStore() {
    console.log("Show user:", user);
  }

</script>

<header class="p-4 bg-gray-800 text-white flex justify-between">
  {#if user}
    <div>
      <span>{user.fullName} ({user.username})</span>
      <a href="/logout" class="ml-4 text-red-400">Cerrar sesión</a>
    </div>
  {:else}
    <a href="/" class="text-blue-400">Iniciar sesión</a>
  {/if}
</header>


<div class="absolute top-0 right-0 p-4">
  <div class="flex flex-row">
	  <LightSwitch />
    <button onclick={showUserStore} class="block ml-4 w-auto">Mostrar userStore</button>
  </div>
</div>

<div class="flex items-center justify-center min-h-screen">
	{@render children()}
</div>

<div class="absolute bottom-0 left-0 p-4">
	<ConnectionStatus />
</div>