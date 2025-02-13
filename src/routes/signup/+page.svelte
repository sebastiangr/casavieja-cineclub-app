<script lang="ts">
	import { goto } from '$app/navigation';
	import { getToastStore } from '@skeletonlabs/skeleton';

	let email = '';
	let username = '';
	let password = '';
	let confirmPassword = '';
	let mensaje: string | null = null;

	// Manejo de toasts
	const toastStore = getToastStore();

	async function signup() {
		mensaje = null;

		if (password !== confirmPassword) {
			mensaje = 'Las contraseñas no coinciden';
			toastStore.trigger({ message: 'Las contraseñas no coinciden', background: 'red' });
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
			goto('/');
		} else {
			mensaje = data.error;
			toastStore.trigger({ message: data.error, background: 'red' });
		}
	}
</script>

<!-- TODO: Añadir validaciones de email y username (no vacíos, username mayor a 4 caracteres) -->
<!-- TODO: Añadir validaciones de contraseña (mínimo 6 caracteres, al menos una letra y un número) -->
<!-- TODO: Añadir validaciones de confirmar contraseña (igual a contraseña) -->
<!-- TODO: Borrar formulario al enviar, deshabilitar botón y mostrar spinner -->
<div class="flex flex-col items-center justify-center min-h-screen">
	<h1 class="text-2xl font-bold">Registro</h1>
	<input bind:value={email} type="email" placeholder="Correo" class="input" />
	<input bind:value={username} type="text" placeholder="Usuario" class="input" />
	<input bind:value={password} type="password" placeholder="Contraseña" class="input" />
	<input bind:value={confirmPassword} type="password" placeholder="Confirmar contraseña" class="input" />
	<button on:click={signup} class="btn-primary">Crear cuenta</button>
	{#if mensaje}
		<p class="text-red-500">{mensaje}</p>
	{/if}
	<p>¿Ya tienes cuenta? <a href="/" class="text-blue-500">Inicia sesión</a></p>
</div>
