<script lang="ts">
	import { goto } from '$app/navigation';
	import { getToastStore } from '@skeletonlabs/skeleton';

	let email = '';
	let username = '';
	let password = '';
	let confirmPassword = '';
	let mensaje: string | null = null;
	let loading = false; // Estado de loading

	// Manejo de toasts
	const toastStore = getToastStore();

	async function signup() {
		mensaje = null;
		loading = true; // Activar loading

		if (password !== confirmPassword) {
			mensaje = 'Las contraseñas no coinciden';
			toastStore.trigger({ message: 'Las contraseñas no coinciden', background: 'red' });
			loading = false; // Desactivar loading
			return;
		}

		const res = await fetch('/auth/signup', {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({ email, username, password })
		});

		const data = await res.json();

		if (res.ok) {
			toastStore.trigger({ message: 'Registro exitoso, inicia sesión', background: 'green' });
			email = ''; // Limpiar campos
			username = '';
			password = '';
			confirmPassword = '';
			goto('/?registered=true'); // Redirigir a la página principal con parámetro
		} else {
			mensaje = data.error;
			toastStore.trigger({ message: data.error, background: 'red' });
		}
		loading = false; // Desactivar loading
	}
</script>

<div class="flex flex-col items-center justify-center min-h-screen">
	<h1 class="text-2xl font-bold">Registro</h1>
	<input bind:value={email} type="email" placeholder="Correo" class="input" disabled={loading}/>
	<input bind:value={username} type="text" placeholder="Usuario" class="input" disabled={loading}/>
	<input bind:value={password} type="password" placeholder="Contraseña" class="input" disabled={loading}/>
	<input bind:value={confirmPassword} type="password" placeholder="Confirmar contraseña" class="input" disabled={loading}/>
	<button on:click={signup} class="btn-primary btn-signup" style="pointer-events: {loading ? 'none' : 'auto'}" disabled={loading}>
		{#if loading}
			<span class="loader"></span>Creando usuario... <!-- Spinner -->
		{:else}
			Crear cuenta
		{/if}
	</button>
	{#if mensaje}
		<p class="text-red-500">{mensaje}</p>
	{/if}
	<p>¿Ya tienes cuenta? <a href="/" class="text-blue-500">Inicia sesión</a></p>
</div>
