<script lang="ts">
	import { goto } from '$app/navigation';
	import { onMount } from 'svelte';
	import { getToastStore } from '@skeletonlabs/skeleton';

	let username = $state('');
	let password = $state('');
	// let mensaje: string | null = null;
	// let mensajeExito: string | null = null;
  let mensaje = $state<string | null>(null);
  let mensajeExito = $state<string | null>(null);
	let formValid = $state(false); // Estado de validación del formulario
	let loading = $state(false); // Estado de loading

	// TODO: Borrar todos los toastStore
	const toastStore = getToastStore();

	// Validar que los campos no estén vacíos
	function validateForm() {
		if (!username.trim() || !password.trim()) {
			mensaje = 'Por favor, complete todos los campos';
			formValid = false;
			return false;
		}
		mensaje = null;
		formValid = true;
		return true;
	}

  /**
   * Función para manejar el envío del formulario de login.
   * Primero se validan los campos del formulario. Si no son válidos, se muestra un mensaje de error y se sale.
   * Si son válidos, se hace una petición POST a /auth/login con los datos del formulario.
   * Si la petición es exitosa (200), se guarda el token en localStorage y se redirige a /dashboard.
   * Si la petición falla (401, 400, etc.), se muestra un mensaje de error y se sale.
   * En caso de error en el servidor, se muestra un mensaje de error y se sale.
   * @param {SubmitEvent} event - Evento de envío del formulario
   */
  async function handleSubmit(event: SubmitEvent) {
    event.preventDefault(); // Prevent default form submission
    
    if (!validateForm()) return;
    
    mensaje = null;
    loading = true;

    try {
      const res = await fetch('/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
      });

      const data = await res.json();

      if (res.ok) {
        localStorage.setItem('token', data.token);
        toastStore.trigger({ message: 'Login exitoso!!!', background: 'green' });
        goto('/dashboard');
      } else {
        mensaje = data.error;
        toastStore.trigger({ message: data.error, background: 'red' });
      }
    } catch (error) {
      mensaje = 'Error en el servidor';
      toastStore.trigger({ message: 'Error en el servidor', background: 'red' });
    } finally {
      loading = false;
    }
  }

	$effect(() => {
		const token = localStorage.getItem('token');
		if (token) goto('/dashboard');

		const urlParams = new URLSearchParams(window.location.search);
		if (urlParams.get('registered') === 'true') {
			mensajeExito = 'Usuario creado exitosamente. Ingrese sus credenciales para continuar.'; // Asignar mensaje de éxito
		}
	});
</script>

<!-- TODO: Añadir revelar contraseña. -->
<div class="flex flex-col items-center justify-center min-h-screen">

	<h1 class="text-2xl font-bold">Iniciar sesión</h1>

	{#if mensajeExito}
		<p class="text-green-500">{mensajeExito}</p> <!-- Mostrar mensaje de éxito -->
	{/if}

  <form method="POST" onsubmit={handleSubmit} class="flex flex-col">
    <input
      id="username"      
      type="text"
      placeholder="Nombre de usuario"
      class="input"
      disabled={loading}
      required       
      oninput={(e) => username = (e.currentTarget as HTMLInputElement).value} />

    <input
      id="password"
      type="password"
      placeholder="Contraseña"
      class="input"
      disabled={loading}
      required 
      oninput={(e) => password = (e.currentTarget as HTMLInputElement).value} />

    <button
      type="submit"
      class="btn-login btn-primary"
      style="pointer-events: {loading ? 'none' : 'auto'}"
      disabled={loading} >
      {#if loading}
        <span class="loader"></span> Verificando...
      {:else}
        Ingresar
      {/if}
    </button>
  
    {#if mensaje}
      <p class="text-red-500 text-center">{mensaje}</p>
    {/if}
  </form>

  <hr class="w-full border border-gray-300 my-2">

  <hr>
	<p>¿No tienes cuenta? <a href="/signup" class="text-blue-500">Regístrate</a></p>
</div>
