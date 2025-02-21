<script lang="ts">
	import { goto } from '$app/navigation';
	import { onMount } from 'svelte';
	
  let user = $state<{ username: string; fullName: string } | null>(null);

	// Verificar si el usuario está autenticado
	async function fetchUser() {
		const token = localStorage.getItem('token');
    if (!token) {
			goto('/');
			return;
		}

    try {
      const res = await fetch('/api/user', {
        headers: { Authorization: `Bearer ${token}` }
      });

      const data = await res.json();
      if (!res.ok) {
        localStorage.removeItem('token');
        goto('/');
      } else {
        user = data;
      }
    } catch (error) {
      console.error('Error al obtener usuario:', error);
      localStorage.removeItem('token');
      goto('/');
    }
	};

  // Llamar a la función de carga dentro del efecto sin `await`
	$effect(() => {
		fetchUser();
	});

	// Cerrar sesión
	function logout() {
		localStorage.removeItem('token');
		goto('/');
	}
</script>


<!-- <div class="fixed top-0 left-0 p-4 bg-black shadow-md w-full flex justify-between items-center">
  {#if user}
    <div class="flex items-center mr-4">
      <div class="relative">
        <img
          src={`https://api.dicebear.com/9.x/initials/svg?seed=${user?.fullName}`}          
          alt="User Avatar"
          class="rounded-full w-12 h-12 object-cover"
        />
      </div>
      <div class="text-left">      
        <h2 class="text-lg font-bold">{user.fullName}</h2>
        <p class="text-sm text-gray-600">@{user.username}</p>
      </div>
    </div>
  {/if}
</div> -->

<div class="flex flex-col items-center justify-center min-h-screen">
	{#if user}
		<h1 class="text-2xl font-bold">¡Bienvenido, {user.fullName}!</h1>
		<p class="text-gray-600">@{user.username}</p>
		<button onclick={logout} class="btn-primary">Cerrar sesión</button>
	{:else}
		<p>Cargando...</p>
	{/if}
</div>
