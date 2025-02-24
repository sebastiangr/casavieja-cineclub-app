<script lang="ts">
	import { goto } from '$app/navigation';
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

  // SHOW/HIDE PASSWORD
  let showPassword = $state(false);
  let timeoutId = $state<NodeJS.Timeout | null>(null);
  
  function togglePasswordVisibility() {
    // showPassword = !showPassword;
    if (timeoutId) {
      clearTimeout(timeoutId);
      timeoutId = null;
    }
    
    showPassword = true;
    timeoutId = setTimeout(() => {
      showPassword = false;
      timeoutId = null;
    }, 2000);
  }
</script>

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

    <div class="relative">
      <input
        id="password"
        type={showPassword ? 'text' : 'password'}
        placeholder="Contraseña"
        class="input"
        disabled={loading}
        required 
        oninput={(e) => password = (e.currentTarget as HTMLInputElement).value} />

      <button
        type="button"
        class="absolute inset-y-0 right-0 px-3 flex items-center text-gray-500 hover:text-gray-700"
        onclick={togglePasswordVisibility}>
        {#if showPassword}
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
            <path fill-rule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clip-rule="evenodd" />
          </svg>
        {:else}
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path fill-rule="evenodd" d="M3.707 2.293a1 1 0 00-1.414 1.414l14 14a1 1 0 001.414-1.414l-1.473-1.473A10.014 10.014 0 0019.542 10C18.268 5.943 14.478 3 10 3a9.958 9.958 0 00-4.512 1.074l-1.78-1.781zm4.261 4.26l1.514 1.515a2.003 2.003 0 012.45 2.45l1.514 1.514a4 4 0 00-5.478-5.478z" clip-rule="evenodd" />
            <path d="M12.454 16.697L9.75 13.992a4 4 0 01-3.742-3.741L2.335 6.578A9.98 9.98 0 00.458 10c1.274 4.057 5.065 7 9.542 7 .847 0 1.669-.105 2.454-.303z" />
          </svg>
        {/if}
      </button>
    </div>

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
