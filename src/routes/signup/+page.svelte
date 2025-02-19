<script lang="ts">
  import { signupSchema } from '$lib/validations';
  import { goto } from '$app/navigation';
  import { getToastStore } from '@skeletonlabs/skeleton';
  import { z } from 'zod';
  
  interface FormData {
    email: string;
    username: string;
    password: string;
    confirmPassword: string;
  }
  
  let form = $state<FormData>({
    email: '',
    username: '',
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
          password: form.password
        })
      });

      const data = await res.json();

      if (res.ok) {
        toastStore.trigger({ message: 'Registro exitoso, inicia sesión', background: 'green' });
        form = { email: '', username: '', password: '', confirmPassword: '' };
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
</script>
  
<!-- TODO: Añadir revelar contraseña. -->
<div class="flex flex-col items-center justify-center min-h-screen">

  <h1 class="text-2xl font-bold">Registro</h1>

  <form onsubmit={signup} class="flex flex-col">
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
      placeholder="Usuario" 
      class="input" 
      disabled={loading} 
      oninput={(e) => form.username = (e.currentTarget as HTMLInputElement).value} />
    {#if errors.username}
      <p class="text-red-500 text-sm">{errors.username}</p>
    {/if}
    
    <input       
      type="password" 
      placeholder="Contraseña" 
      class="input" 
      disabled={loading} 
      oninput={(e) => form.password = (e.currentTarget as HTMLInputElement).value} />
    {#if errors.password}
      <p class="text-red-500 text-sm">{errors.password}</p>
    {/if}
    
    <input       
      type="password" 
      placeholder="Confirmar contraseña" 
      class="input" 
      disabled={loading} 
      oninput={(e) => form.confirmPassword = (e.currentTarget as HTMLInputElement).value} />
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