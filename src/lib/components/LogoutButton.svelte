<script lang="ts">
  import { goto } from '$app/navigation';
  import { invalidateAll } from '$app/navigation'; // ✅ Importar invalidateAll()

  // async function logout() {
  //   try {
  //     await fetch('auth/logout', { method: 'POST' });      
  //     localStorage.removeItem('token');
  //     location.reload(); // 🔥 Forzar recarga para limpiar la sesión
  //     goto('/');
  //   } catch (error) {
  //     console.error("Error cerrando sesión:", error);
  //   }
  // }

  // async function logout() {
  //   try {
  //     console.log("🟢 Enviando solicitud de logout...");
  //     const response = await fetch('/auth/logout', { 
  //       method: 'POST',
  //       credentials: 'include'
  //     });

  //     console.log("🔵 Respuesta del servidor:", response);
  //     await invalidateAll(); // 🔥 Forzar actualización del layout sin recargar la página

  //     if (response.ok) {
  //       localStorage.removeItem('token'); // ✅ Borrar token
  //       goto('/'); // ✅ Redirigir manualmente
  //     } else {
  //       console.error("❌ Error en logout:", response.statusText);
  //     }
  //   } catch (error) {
  //     console.error("❌ Error de red:", error);
  //   }
  // }

  async function logout() {
    try {
      console.log("🟢 Enviando solicitud de logout...");
      await fetch('/auth/logout', { method: 'POST', credentials: 'include' });

      console.log("🔵 Logout exitoso, invalidando caché...");
      await invalidateAll(); // 🔥 Forzar recarga de `+layout.server.ts`

      goto('/'); // ✅ Redirigir después de invalidar
    } catch (error) {
      console.error("❌ Error cerrando sesión:", error);
    }
  }

</script>

<button onclick={logout} class="text-red-400">
  Cerrar sesión
</button>