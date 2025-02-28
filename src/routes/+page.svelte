<script lang="ts">
	import { goto, invalidateAll } from '$app/navigation';
	import { Eye, EyeOff } from 'lucide-svelte';

	let username = $state('');
	let password = $state('');
	// let mensaje: string | null = null;
	// let mensajeExito: string | null = null;
  let mensaje = $state<string | null>(null);
  let mensajeExito = $state<string | null>(null);
	let formValid = $state(false); // Estado de validación del formulario
	let loading = $state(false); // Estado de loading


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
        credentials: 'include', // Enviar cookies para mantener la sesión
        body: JSON.stringify({ username, password })
      });

      const data = await res.json();

      if (res.ok) {
        console.log("🔵 Login exitoso, invalidando caché...");
        localStorage.setItem('token', data.token);   
        
        await invalidateAll(); // Recargar `+layout.server.ts` para obtener `locals.user`
        goto('/dashboard');
      } else {
        mensaje = data.error;        
      }
    } catch (error) {
      mensaje = 'Error en el servidor';      
    } finally {
      loading = false;
    }
  }

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
  
	$effect(() => {
		const token = localStorage.getItem('token');
		if (token) goto('/dashboard');

		const urlParams = new URLSearchParams(window.location.search);
		if (urlParams.get('registered') === 'true') {
			mensajeExito = 'Usuario creado exitosamente. Ingrese sus credenciales para continuar.'; // Asignar mensaje de éxito
		}
	});

</script>

<div class="flex flex-col items-center justify-center">

	<h1 class="text-2xl font-bold">Iniciar sesión</h1>

  <form method="POST" onsubmit={handleSubmit} class="flex flex-col w-80">
    
    {#if mensajeExito}
		  <p class="text-green-500 text-center">{mensajeExito}</p> <!-- Mostrar mensaje de éxito -->
	  {/if}

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
        class="absolute inset-y-0 right-0 px-3 flex items-center text-gray-400 hover:text-gray-500"
        onclick={togglePasswordVisibility}>
        {#if showPassword}
          <Eye strokeWidth={1.25}/>
        {:else}
          <EyeOff strokeWidth={1.25}/>
        {/if}
      </button>
    </div>

    <button
      type="submit"
      class="btn variant-filled-primary"
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
	<p>¿No tienes cuenta? <a href="/signup" class="text-primary-500 hover:text-primary-400">Regístrate</a></p>
</div>
