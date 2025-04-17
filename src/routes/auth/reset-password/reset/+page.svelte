<script lang="ts">
  import { requestResetSchema, signupSchema } from '$lib/validations';
	import { Eye, EyeOff } from 'lucide-svelte';
  import { z } from 'zod';

  let newPassword = $state('');
  let confirmPassword = $state('');
  let error = '';
  let success = '';
  let showForm = $state(true);

  interface FormData {
    newPassword: string;
    confirmPassword: string;
  }
  
  let form = $state<FormData>({
    newPassword: '',
    confirmPassword: ''
  });

  let errors = $state<Partial<Record<keyof FormData, string>>>({});
  let loading = $state(false);

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
    console.log('handleSubmit called');
    loading = true;

    // Validar el formulario
    // if (!validateForm()) {      
    //   loading = false;
    //   console.log('Form validation failed:', errors);
    //   return;
    // }

    // Validar que las contraseñas coincidan
    if (form.newPassword !== form.confirmPassword) {
      errors.confirmPassword = 'Las contraseñas no coinciden';
      loading = false;
      return;
    }

    // Validar la longitud de la contraseña
    if (form.newPassword.length < 8 || form.confirmPassword.length < 8) {
      errors.newPassword = 'La contraseña debe tener al menos 8 caracteres';      
      loading = false;
      return;
    }

    try {
      // Enviar solicitud para cambiar la contraseña
      const token = window.location.search.split('token=')[1];
      const response = await fetch('/auth/reset-password/reset', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ token, newPassword: form.newPassword, confirmPassword: form.confirmPassword })
      });

      const data = await response.json();

      if (response.ok) {
        // Mostrar mensaje de éxito y ocultar formulario
        success = 'La contraseña se ha cambiado con éxito';
        loading = false;
        // Ocultar formulario
        showForm = false;
      } else {
        error = data.error || 'Ha ocurrido un error. Por favor, inténtalo de nuevo.';
        loading = false;
      }
    } catch (err) {
      console.log('Error:', err);
      error = 'Ha ocurrido un error. Por favor, inténtalo de nuevo.';
      loading = false;
    }
    // try {
    //   console.log('Validating new password and confirm password');
    //   const validation = z.object({
    //     newPassword: z.string().min(8, 'La contraseña debe tener al menos 8 caracteres'),
    //     confirmPassword: z.string().min(8, 'La contraseña debe tener al menos 8 caracteres')
    //   }).safeParse({ newPassword, confirmPassword });

    //   console.log('Validation result:', validation);

    //   if (!validation.success) {
    //     console.log('Validation failed:', validation.error);
    //     error = 'La contraseña y la confirmación no coinciden';
    //     return;
    //   }

    //   console.log('Validation passed');

    //   console.log('Getting token from URL');
    //   const token = window.location.search.split('token=')[1];
    //   console.log('Token:', token);
    //   if (!token) {
    //     console.error('Token no encontrado en la URL');
    //     return;
    //   }

    //   console.log('Sending request to update password');
    //   const response = await fetch('/auth/reset-password/reset', {
    //     method: 'POST',
    //     headers: {
    //       'Content-Type': 'application/json'
    //     },
    //     body: JSON.stringify({ token, newPassword, confirmPassword })
    //   });

    //   console.log('Response:', response);

    //   const data = await response.json();
    //   console.log('Data:', data);

    //   if (response.ok) {
    //     console.log('Password updated successfully');
    //     success = 'Contraseña actualizada con éxito';
    //   } else {
    //     console.log('Error updating password:', data.error);
    //     error = data.error || 'Ha ocurrido un error. Por favor, inténtalo de nuevo.';
    //   }
    // } catch (err) {
    //   console.log('Error:', err);
    //   error = 'Ha ocurrido un error. Por favor, inténtalo de nuevo.';
    // }
  }

  // SHOW/HIDE PASSWORD
  let showPassword = $state(false);
  let showConfirmPassword = $state(false);
  let timeoutIdPassword = $state<NodeJS.Timeout | null>(null);
  let timeoutIdConfirmPassword = $state<NodeJS.Timeout | null>(null);
  
  function togglePasswordVisibility(field: 'password' | 'confirmPassword') {
    if (field === 'password') {
      if (timeoutIdPassword) {
        clearTimeout(timeoutIdPassword);
        timeoutIdPassword = null;
      }
      
      showPassword = true;
      timeoutIdPassword = setTimeout(() => {
        showPassword = false;
        timeoutIdPassword = null;
      }, 2000);
    } else {
      if (timeoutIdConfirmPassword) {
        clearTimeout(timeoutIdConfirmPassword);
        timeoutIdConfirmPassword = null;
      }
      
      showConfirmPassword = true;
      timeoutIdConfirmPassword = setTimeout(() => {
        showConfirmPassword = false;
        timeoutIdConfirmPassword = null;
      }, 2000);
    }
  }
</script>

<!-- TODO: Añadir mensaje de éxito, y deshabilitar formulario. -->
<!-- TODO: Editar estilos de formulario y botón. -->
<!-- TODO: Añadir mensajes de validación de contraseña como en el signup. -->

<div class="flex flex-col items-center justify-center">

  <h1 class="text-2xl font-bold">Reestablecer contraseña</h1>

  <form onsubmit={handleSubmit} class="flex flex-col w-80">

    <div class="relative">
      <input
        id="password"
        type={showPassword ? 'text' : 'password'}
        placeholder="Contraseña"
        class="input"
        required 
        bind:value={newPassword} />

      <button
        type="button"
        class="absolute inset-y-0 right-0 px-3 flex items-center text-surface-400 hover:text-surface-300"
        onclick={() => togglePasswordVisibility('password')}>
        {#if showPassword}
          <Eye strokeWidth={1.25}/>
        {:else}
          <EyeOff strokeWidth={1.25}/>
        {/if}
      </button>
    </div>
    {#if errors.newPassword}
      <p class="text-red-500 text-sm">{errors.newPassword}</p>
    {/if}

    <div class="relative">
      <input
        id="confirmPassword"
        type={showConfirmPassword ? 'text' : 'password'}
        placeholder="Confirmar contraseña"
        class="input"
        required 
        bind:value={confirmPassword} />

      <button
        type="button"
        class="absolute inset-y-0 right-0 px-3 flex items-center text-surface-400 hover:text-surface-300"
        onclick={() => togglePasswordVisibility('confirmPassword')}>
        {#if showConfirmPassword}
          <Eye strokeWidth={1.25}/>
        {:else}
          <EyeOff strokeWidth={1.25}/>
        {/if}
      </button>
    </div>    
    {#if errors.confirmPassword}
      <p class="text-red-500 text-sm">{errors.confirmPassword}</p>
    {/if}

    <button 
      type="submit" 
      class="btn variant-filled-primary">
      Actualizar contraseña
    </button>
  </form>

</div>