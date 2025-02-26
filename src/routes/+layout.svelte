<script lang="ts">
	import Header from './../lib/components/Header.svelte';
  import '../app.postcss';
  import { LightSwitch } from '@skeletonlabs/skeleton';
  import { initializeStores } from '@skeletonlabs/skeleton';
  import ConnectionStatus from '$lib/components/ConnectionStatus.svelte';
  import { type User } from '$lib/types';
  import { userStore } from '$lib/stores/userStore';
	import LogoutButton from '$lib/components/LogoutButton.svelte';
	import { page } from '$app/state';

  // Inicializar stores globales de Skeleton UI
  initializeStores();

  let props = $props<{ children: any; user: User | null }>(); // 📌 Obtener los props correctamente
  console.log("🔴 Props en layout.svelte:", props); // 🔍 Verifica todo el objeto props
  console.log("🔴 User Props en layout.svelte:", props.data.user);

  let { children, data } = props; // Extraer 'data' correctamente  
  let user = $state(props.data.user); // 📌 Hacer user reactivo
  console.log("🟡 User en layout.svelte (Corregido):", user); // 🔍 Ahora debería mostrar correctamente el usuario

  function showUser() {
    console.log("Show user:", page.data.user);
  }

  $effect(() => {
    userStore.set(page.data.user); // ✅ Mantener el store actualizado
    console.log("🟡 userStore en layout:", userStore);
  });  

</script>

<Header />

<div class="flex items-center justify-center min-h-screen">
	{@render children()}
</div>

<div class="absolute bottom-0 left-0 p-4">
	<ConnectionStatus />
</div>