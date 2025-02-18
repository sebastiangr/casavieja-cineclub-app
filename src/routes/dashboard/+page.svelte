<script lang="ts">
	import { goto } from '$app/navigation';
	import { onMount } from 'svelte';

	let user: { username: string } | null = null;

	// Verificar si el usuario está autenticado
	onMount(async () => {
		const token = localStorage.getItem('token');
		if (!token) return goto('/');

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
		<button on:click={logout} class="btn-primary">Cerrar sesión</button>
	{:else}
		<p>Cargando...</p>
	{/if}
</div>
