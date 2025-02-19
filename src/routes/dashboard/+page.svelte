<script lang="ts">
	import { goto } from '$app/navigation';
	import { onMount } from 'svelte';
	
  let user = $state<{ username: string } | null>(null);

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

<div class="flex flex-col items-center justify-center min-h-screen">
	{#if user}
		<h1 class="text-2xl font-bold">¡Bienvenido, {user.username}!</h1>
		<button onclick={logout} class="btn-primary">Cerrar sesión</button>
	{:else}
		<p>Cargando...</p>
	{/if}
</div>
