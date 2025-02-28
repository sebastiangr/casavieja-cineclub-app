<script lang="ts">
  import { goto } from '$app/navigation';
  import { invalidateAll } from '$app/navigation';
	import { LightSwitch } from '@skeletonlabs/skeleton';
  import { LogOut } from 'lucide-svelte';

  let loading = false; // Estado de carga

  async function logout() {
    loading = true; // Establecer carga en verdadero
    try {
      console.log("🟢 Enviando solicitud de logout...");
      await fetch('/auth/logout', { method: 'POST', credentials: 'include' });

      console.log("🔵 Logout exitoso, invalidando caché...");
      invalidateAll(); // Forzar recarga de `+layout.server.ts`

      goto('/', { replaceState: true });
    } catch (error) {
      console.error("❌ Error cerrando sesión:", error);
    } finally {
      loading = false; // Restablecer estado de carga
    }
  }
</script>

<LightSwitch />
<button onclick={logout} type="button" class="btn btn-sm variant-filled-primary" disabled={loading}>
  {#if loading}
    <span class="loader"></span> Cerrando sesión...
  {:else}
    <LogOut strokeWidth={1.25} />
    Cerrar sesión
  {/if}
</button>
<!-- 
<button class="btn btn-sm variant-filled-primary cursor-pointer" title="Revisar conexión TMDB" onclick={checkTmdbStatus}> 
  <CircleChevronUp strokeWidth={1.25} />
</button> -->
