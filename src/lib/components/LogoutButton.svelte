<script lang="ts">
  import { goto } from '$app/navigation';
  import { invalidateAll } from '$app/navigation';
  import { LogOut } from 'lucide-svelte';

  async function logout() {
    try {
      console.log("🟢 Enviando solicitud de logout...");
      await fetch('/auth/logout', { method: 'POST', credentials: 'include' });

      console.log("🔵 Logout exitoso, invalidando caché...");
      // await invalidateAll(); // Forzar recarga de `+layout.server.ts`
      invalidateAll(); // Forzar recarga de `+layout.server.ts`

      // goto('/'); // Redirigir después de invalidar
      goto('/', { replaceState: true });
    } catch (error) {
      console.error("❌ Error cerrando sesión:", error);
    }
  }

</script>

<button onclick={logout}  type="button" class="btn btn-sm variant-filled-primary">
  <LogOut strokeWidth={1.25} />
  Cerrar sesión
</button>