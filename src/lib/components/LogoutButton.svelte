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
      // invalidateAll(); // Forzar recarga de `+layout.server.ts`

      goto('/', { replaceState: true });
    } catch (error) {
      console.error("❌ Error cerrando sesión:", error);
    } finally {
      loading = false; // Restablecer estado de carga
    }
  }
</script>

<!-- <LightSwitch /> -->
<!-- FIXME: Arreglar hover del botón -->

<!-- Versión 1 -->
<div class="absolute logout-button bg-surface-800  border-surface-700 hover:border-surface-600 border-[1px] rounded-md m-2">    
  <button class="flex flex-row items-center p-[6px] text-primary-700 hover:text-primary-500 group" title="Cerrar sesión" onclick={logout}>
    <span class="overflow-hidden max-w-0 opacity-0 group-hover:max-w-[100px] group-hover:opacity-100 transition-all duration-300 group-hover:mr-2 ">Salir</span>
    <LogOut strokeWidth={1.25} size={26} stroke="currentColor"/>        
  </button>
</div>

<!-- Versión 2 -->
<!-- <div class="absolute logout-button bg-surface-800 border-surface-700 hover:border-surface-600 border-[1px] rounded-md m-2">    
  <button class="flex items-center p-[6px] text-primary-700 hover:text-primary-500 group relative" title="Revisar conexión TMDB" onclick={logout}>
    <LogOut strokeWidth={1.25} size={26} stroke="currentColor"/>    
    <span class="absolute right-full overflow-hidden whitespace-nowrap opacity-0 group-hover:opacity-100 transition-all duration-300 mr-2 px-2 bg-surface-800 border border-surface-700 rounded-md">
      Salir
    </span>
  </button>
</div> -->

<style>
  .logout-button {
    right: 1rem;
  }
  /* .logout-button button {
    padding: 6px;
  } */
</style>