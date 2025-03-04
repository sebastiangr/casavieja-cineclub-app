<script lang="ts">
  import { signupSchema } from '$lib/validations';
  import { goto } from '$app/navigation';
  import { getToastStore } from '@skeletonlabs/skeleton';
  import { z } from 'zod';
	import { Eye, EyeOff } from 'lucide-svelte';
  
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
  
<div class="flex flex-col items-center justify-center">

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
    
    <!-- TODO: Al hacer tab que no seleccione el botón -->
    <div class="relative">
      <input       
        type={showPassword ? 'text' : 'password'}
        placeholder="Contraseña" 
        class="input" 
        disabled={loading} 
        oninput={(e) => form.password = (e.currentTarget as HTMLInputElement).value}
        />

      <button
        type="button"
        class="absolute inset-y-0 right-0 px-3 flex items-center text-surface-400 hover:text-surface-300"
        onclick={() => togglePasswordVisibility('password')}
        tabindex="-1">
        {#if showPassword}
          <Eye strokeWidth={1.25}/>
        {:else}
          <EyeOff strokeWidth={1.25} />
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
      class="btn variant-filled-primary"
      style="pointer-events: {loading ? 'none' : 'auto'}"
      disabled={loading} >
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
  <p>¿Ya tienes cuenta? <a href="/" class=" text-primary-500 hover:text-primary-400">Inicia sesión</a></p>
</div>