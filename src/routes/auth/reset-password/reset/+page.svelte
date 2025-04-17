<script lang="ts">
  import { requestResetSchema } from '$lib/validations';
	import { Eye, EyeOff } from 'lucide-svelte';
  import { z } from 'zod';

  let newPassword = $state('');
  let confirmPassword = $state('');
  let error = '';
  let success = '';

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

  async function handleSubmit() {
    console.log('handleSubmit called');

    try {
      console.log('Validating new password and confirm password');
      const validation = z.object({
        newPassword: z.string().min(8, 'La contraseña debe tener al menos 8 caracteres'),
        confirmPassword: z.string().min(8, 'La contraseña debe tener al menos 8 caracteres')
      }).safeParse({ newPassword, confirmPassword });

      console.log('Validation result:', validation);

      if (!validation.success) {
        console.log('Validation failed:', validation.error);
        error = 'La contraseña y la confirmación no coinciden';
        return;
      }

      console.log('Validation passed');

      console.log('Getting token from URL');
      const token = window.location.search.split('token=')[1];
      console.log('Token:', token);
      if (!token) {
        console.error('Token no encontrado en la URL');
        return;
      }

      console.log('Sending request to update password');
      const response = await fetch('/auth/reset-password/reset', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ token, newPassword, confirmPassword })
      });

      console.log('Response:', response);

      const data = await response.json();
      console.log('Data:', data);

      if (response.ok) {
        console.log('Password updated successfully');
        success = 'Contraseña actualizada con éxito';
      } else {
        console.log('Error updating password:', data.error);
        error = data.error || 'Ha ocurrido un error. Por favor, inténtalo de nuevo.';
      }
    } catch (err) {
      console.log('Error:', err);
      error = 'Ha ocurrido un error. Por favor, inténtalo de nuevo.';
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

    <div class="form-control">
      <!-- <label for="newPassword" class="label">
        <span class="label-text">Nueva contraseña</span>
      </label> -->
      <!-- <input 
        type="password" 
        id="newPassword" bind:value={newPassword} class="input input-bordered w-full" /> -->
    </div>

    <div class="form-control">
      <!-- <label for="confirmPassword" class="label">
        <span class="label-text">Confirmar contraseña</span>
      </label> -->
      <!-- <input type="password" id="confirmPassword" bind:value={confirmPassword} class="input input-bordered w-full" /> -->
    </div>

    <button 
      type="submit" 
      class="btn variant-filled-primary">
      Actualizar contraseña
    </button>
  </form>

</div>