<script lang="ts">
  import { enhance } from '$app/forms';
  import { requestResetSchema, signupSchema } from '$lib/validations';
	import { MailWarning } from 'lucide-svelte';
  import { z } from 'zod';
  
  let email = $state<string>('');
  let error = $state<string>('');
  let success = $state<string>('');
  let loading = $state(false);

  let errors = $state<Partial<Record<keyof FormData, string>>>({});

  interface FormData {
    email: string;
  }

  let form = $state<FormData>({
    email: ''
  });

  // VALIDATE FORM - ERROR ARRAY
  function validateForm() {
    errors = {};
    try {
      // Validar con Zod
      signupSchema.parse(form);
      return true;
    } catch (err) {
      if (err instanceof z.ZodError) {
        err.errors.forEach(e => {
          const path = e.path[0] as keyof FormData;
          errors[path] = e.message;
        });
      }
      return false;
    }
  }
  
  async function handleSubmit() {
    loading = true;
    error = '';
    // success = '';
    
    try {
      // Validate email
      requestResetSchema.parse({ email });
      
      // Send request to server
      const response = await fetch('/auth/reset-password/request', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email })
      });
      
      const data = await response.json();
      console.log('Respuesta del servidor:', data);
      
      if (response.ok) {
        success = data.success;
        email = '';
        console.log('Valor de success:', success);
      } else {
        error = data.error || 'Ha ocurrido un error. Por favor, inténtalo de nuevo.';
      }
    } catch (err) {
      if (err instanceof z.ZodError) {
        error = err.errors[0].message;
      } else {
        error = 'Ha ocurrido un error. Por favor, inténtalo de nuevo.';
      }
    } finally {
      loading = false;
    }
  }
</script>

<div class="flex flex-col items-center justify-center">

  <h1 class="text-2xl font-bold">Reestablecer contraseña</h1>

  {#if success}
    <div class="text-center flex flex-col items-center gap-2 mt-4 w-80">
      <div class="text-primary-500">
        <MailWarning  strokeWidth={1.75} size={40} stroke="currentColor"/>
      </div>
      <p class="mb-4 mt-4 text-center ">
        {success}<br><br>
        Si no lo ves en tu bandeja de entrada, revisa la carpeta de spam.
      </p>
    </div>
  <!-- Ocultar el formulario si se muestra el mensaje de éxito -->
  {:else}
    <p class="mb-4 mt-4 text-center w-80">Ingresa la dirección de correo electrónico con la que registraste tu cuenta y se te enviará un enlace para restablecer tu contraseña.</p>
    
    <form onsubmit={handleSubmit} class="flex flex-col w-80">

      <div class="relative">
        <input
          type="email"
          id="email"
          bind:value={email}
          class="input input-bordered w-full"
          placeholder="Correo electrónico"
          required
        />
      </div>

      {#if errors.email || error }
        <p class="text-red-500 text-sm">{error || errors.email}</p>
      {/if} 

      <button
        type="submit"
        class="btn variant-filled-primary"
        style="pointer-events: {loading ? 'none' : 'auto'}"
        disabled={loading} >
        {#if loading}
          <span class="loader"></span>
          Enviando...
        {:else}
          Enviar enlace de restablecimiento
        {/if}
      </button>
      
      <hr class="w-full border border-gray-300 my-2">
      <p class="text-center"> <a href="/" class="text-primary-500 hover:text-primary-400">Volver al inicio de sesión</a></p>

    </form>
  {/if}

</div>