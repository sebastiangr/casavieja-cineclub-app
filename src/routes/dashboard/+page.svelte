<script lang="ts">
	import { goto } from '$app/navigation';
	import { get } from 'svelte/store';
	
  // let user = $state<{ username: string; fullName: string } | null>(null);

	// Verificar si el usuario está autenticado
	// async function fetchUser() {
	// 	const token = localStorage.getItem('token');
  //   if (!token) {
	// 		goto('/');
	// 		return;
	// 	}

  //   try {
  //     const res = await fetch('/api/user', {
  //       headers: { Authorization: `Bearer ${token}` }
  //     });

  //     const data = await res.json();
  //     if (!res.ok) {
  //       localStorage.removeItem('token');
  //       goto('/');
  //     } else {
  //       user = data;
  //     }
  //   } catch (error) {
  //     console.error('Error al obtener usuario:', error);
  //     localStorage.removeItem('token');
  //     goto('/');
  //   }
	// };

  // Llamar a la función de carga dentro del efecto sin `await`
	// $effect(() => {
	// 	// fetchUser();
	// });



  // const unsubscribe = userStore.subscribe(value => {
  //   console.log('---- VALOR DE USER STORE CAMBIADO ---- :', value);
  //   user = value;
  // });


  // let user = $userStore;
  // console.log('---- DASHBOARD VALOR INICIAL USER ---- :', get(userStore));

  
  // function showUserStore() {
  //   console.log('---- VALOR ACTUAL DE USER STORE ---- :', get(userStore));
  // }

  // function showUsername() {
  //   console.log("Name!!!!");
  // }

	// Cerrar sesión
	function logout() {
		localStorage.removeItem('token');
		goto('/');
	}
</script>


<!-- <div class="fixed top-0 left-0 p-4 bg-black shadow-md w-full flex justify-between items-center">
  {#if user}
    <div class="flex items-center mr-4">
      <div class="relative">
        <img
          src={`https://api.dicebear.com/9.x/initials/svg?seed=${user?.fullName}`}          
          alt="User Avatar"
          class="rounded-full w-12 h-12 object-cover"
        />
      </div>
      <div class="text-left">      
        <h2 class="text-lg font-bold">{user.fullName}</h2>
        <p class="text-sm text-gray-600">@{user.username}</p>
      </div>
    </div>
  {/if}
</div> -->

<div class="flex flex-col items-center justify-center min-h-screen">

  <h1>DASHBOARD VIEW</h1>
  <span>Empty for now...</span>
  <button onclick={logout} class="btn-primary">Cerrar sesión</button>
	<!-- {#if user} -->
		<!-- <h1 class="text-2xl font-bold">¡Bienvenido, {user.fullName}!</h1>
		<p class="text-gray-600">@{user.username}</p> -->
		<!-- <button onclick={logout} class="btn-primary">Cerrar sesión</button> -->
	<!-- {:else} -->
		<p>Cargando...</p>
	<!-- {/if} -->
  <!-- <button onclick={showUserStore} class="btn-primary">Mostrar userStore</button> -->
</div>
