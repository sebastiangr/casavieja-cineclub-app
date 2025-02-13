<script lang="ts">
	import { goto } from '$app/navigation';
	import { onMount } from 'svelte';
	import { getToastStore } from '@skeletonlabs/skeleton';

	let email = '';
	let password = '';
	let mensaje: string | null = null;

	// Manejo de toasts
	const toastStore = getToastStore();

	async function login() {
		mensaje = null;

		const res = await fetch('/auth/login', {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({ email, password })
		});

		const data = await res.json();

		if (res.ok) {
			localStorage.setItem('token', data.token);
			toastStore.trigger({ message: 'Login exitoso', background: 'green' });
			goto('/dashboard');
		} else {
			mensaje = data.error;
			toastStore.trigger({ message: data.error, background: 'red' });
		}
	}

	onMount(() => {
		const token = localStorage.getItem('token');
		if (token) goto('/dashboard');
	});
</script>

<!-- TODO: Cambiar email por username -->
<!-- TODO: Agregar validación de campos no vacíos -->
<!-- TODO: Borrar formulario al enviar, deshabilitar botón y mostrar spinner -->
<div class="flex flex-col items-center justify-center min-h-screen">
	<h1 class="text-2xl font-bold">Iniciar sesión</h1>
  <!-- TODO: Cambiar email por username -->
	<input bind:value={email} type="email" placeholder="Correo" class="input" />
	<input bind:value={password} type="password" placeholder="Contraseña" class="input" />
	<button on:click={login} class="btn-primary">Ingresar</button>
	{#if mensaje}
		<p class="text-red-500">{mensaje}</p>
	{/if}
	<p>¿No tienes cuenta? <a href="/signup" class="text-blue-500">Regístrate</a></p>
</div>
