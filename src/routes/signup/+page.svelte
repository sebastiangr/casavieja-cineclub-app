<script lang="ts">
  import { signupSchema } from '$lib/validations';
  import { goto } from '$app/navigation';
  import { getToastStore } from '@skeletonlabs/skeleton';
  import { z } from 'zod';
  
  interface FormData {
    email: string;
    username: string;
    fullName: string;
    password: string;
    confirmPassword: string;
  }
  
  let form = $state<FormData>({
    email: '',
    username: '',
    fullName: '',
    password: '',
    confirmPassword: ''
  });
  
  let errors = $state<Partial<Record<keyof FormData, string>>>({});
  let mensaje = $state<string | null>(null);
  let loading = $state(false);

  // TODO: Borrar todos los toastStore
  const toastStore = getToastStore();
  
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
  
  async function signup() {
    mensaje = null;
    loading = true;

    // Validar el formulario
    if (!validateForm()) {
      toastStore.trigger({ message: 'Por favor corrige los errores del formulario', background: 'red' });
      loading = false;
      return;
    }

    // Validar que las contraseñas coincidan
    if (form.password !== form.confirmPassword) {
      errors.confirmPassword = 'Las contraseñas no coinciden';
      toastStore.trigger({ message: 'Las contraseñas no coinciden', background: 'red' });
      loading = false;
      return;
    }

    try {
      const res = await fetch('/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: form.email,
          username: form.username,
          fullName: form.fullName,
          password: form.password
        })
      });

      const data = await res.json();

      if (res.ok) {
        toastStore.trigger({ message: 'Registro exitoso, inicia sesión', background: 'green' });
        form = { email: '', username: '', fullName: '', password: '', confirmPassword: '' };
        goto('/?registered=true');
      } else {
        mensaje = data.error || 'Error en el registro';
        toastStore.trigger({ message: mensaje || 'Error desconocido', background: 'red' });
      }
    } catch (error) {
      mensaje = 'Error de conexión';
      toastStore.trigger({ message: mensaje, background: 'red' });
    } finally {
      loading = false;
    }
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
  
<div class="flex flex-col items-center justify-center min-h-screen">

  <h1 class="text-2xl font-bold">Registro</h1>

  <form onsubmit={signup} class="flex flex-col w-80">
    <input       
      type="email" 
      placeholder="Correo" 
      class="input" 
      disabled={loading}             
      oninput={(e) => form.email = (e.currentTarget as HTMLInputElement).value} />
    {#if errors.email}
      <p class="text-red-500 text-sm">{errors.email}</p>
    {/if}    

    <input       
      type="text" 
      placeholder="Nombre de usuario" 
      class="input" 
      disabled={loading} 
      oninput={(e) => form.username = (e.currentTarget as HTMLInputElement).value} />
    {#if errors.username}
      <p class="text-red-500 text-sm">{errors.username}</p>
    {/if}  
    
    <input       
      type="text" 
      placeholder="Nombre (visible para otros usuarios)" 
      class="input" 
      disabled={loading} 
      oninput={(e) => form.fullName = (e.currentTarget as HTMLInputElement).value} />
    {#if errors.fullName}
      <p class="text-red-500 text-sm">{errors.fullName}</p>
    {/if}    
    
    <div class="relative">
      <input       
        type={showPassword ? 'text' : 'password'}
        placeholder="Contraseña" 
        class="input" 
        disabled={loading} 
        oninput={(e) => form.password = (e.currentTarget as HTMLInputElement).value} />

      <button
        type="button"
        class="absolute inset-y-0 right-0 px-3 flex items-center text-gray-500 hover:text-gray-700"
        onclick={() => togglePasswordVisibility('password')}>
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
    {#if errors.password}
      <p class="text-red-500 text-sm">{errors.password}</p>
    {/if}
    
    <div class="relative">
      <input       
        type={showConfirmPassword ? 'text' : 'password'} 
        placeholder="Confirmar contraseña" 
        class="input" 
        disabled={loading} 
        oninput={(e) => form.confirmPassword = (e.currentTarget as HTMLInputElement).value} />

      <button
        type="button"
        class="absolute inset-y-0 right-0 px-3 flex items-center text-gray-500 hover:text-gray-700"
        onclick={() => togglePasswordVisibility('confirmPassword')}>
        {#if showConfirmPassword}
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
    {#if errors.confirmPassword}
      <p class="text-red-500 text-sm">{errors.confirmPassword}</p>
    {/if}
    
    <button 
      type="submit" 
      class="btn-primary btn-signup" 
      style="pointer-events: {loading ? 'none' : 'auto'}" 
      disabled={loading}>
      {#if loading}
        <span class="loader"></span>Creando usuario...
      {:else}
        Crear cuenta
      {/if}
    </button>

    {#if mensaje}
      <p class="text-red-500 text-center">{mensaje}</p>
    {/if}
  </form>

  <hr class="w-full border border-gray-300 my-2">
  <p>¿Ya tienes cuenta? <a href="/" class="text-blue-500">Inicia sesión</a></p>
</div>