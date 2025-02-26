<script lang="ts">
	import { page } from '$app/state';

  // let user = userStore; // ✅ Obtener usuario autenticado
  let user = page.data.user;

</script>

<div class="flex flex-col items-center justify-center min-h-screen">

  <h1>DASHBOARD VIEW</h1>

	{#if user}
		<h1 class="text-2xl font-bold">¡Bienvenido, {user.fullName}!</h1>
		<p class="text-gray-600">@{user.username}</p>
	{:else}
		<p>Cargando...</p>
	{/if}

</div>