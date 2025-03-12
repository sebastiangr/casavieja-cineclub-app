<script lang="ts">
	import { page } from '$app/state';

  // let user = userStore; // ✅ Obtener usuario autenticado
  let user = page.data.user;

</script>

<div class="flex flex-col items-center justify-center">

  
  <h1>DATOS DE USUARIO</h1>


	{#if user}
    <p class="text-surface-400">Nombre completo: {user.fullName}</p>
		<p class="text-surface-400">Nombre de usuario: @{user.username}</p>
    <!-- TODO: Añadir más datos de usuario  -->
    <!-- <p>Correo electrónico: {user.email}</p>
    <p>Películas recomendadas: </p> -->
	{:else}
		<p>Cargando...</p>
	{/if}

</div>