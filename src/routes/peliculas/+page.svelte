<script lang="ts">
	import { page } from '$app/state';
	import SearchBar from '$lib/components/SearchBar.svelte';
	import { checkConnection } from '$lib/services/tmdb';
	import { movieStore } from '$lib/stores/movies';
  import { QueryClientProvider, QueryClient } from '@tanstack/svelte-query';

  // let user = userStore; // ✅ Obtener usuario autenticado
  let user = page.data.user;
  let connectionStatus = $state<string | null>(null);
  let { children } = $props();


  $effect(() => {
    (async () => {
        try {
            connectionStatus = await checkConnection();
        } catch (error: any) {
            connectionStatus = error.message;
        }
    })();
  });

</script>

<div class="flex flex-col items-center justify-center min-h-screen">

  <h1>PELÍCULAS</h1>

    
  <SearchBar />
    
  <div class="space-y-4">
    <h2 class="text-2xl font-semibold">Películas Recomendadas</h2>
    
    {#if $movieStore.length === 0}
      <p class="text-center text-gray-500 py-8">
        Aún no hay películas recomendadas. ¡Sé el primero en añadir una!
      </p>
    {:else}
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {#each $movieStore as movie}
          <div class="bg-white rounded-lg shadow-md overflow-hidden relative transform transition-transform hover:scale-95">
            <button
              class="absolute top-0 right-0 p-2 text-red-500 hover:text-red-700"
              onclick={() => movieStore.removeMovie(movie.id)}
              aria-label="Remove movie"
            >
              <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
            </button>
            
            <a href={`https://www.themoviedb.org/movie/${movie.id}`} target="_blank" rel="noopener noreferrer">
              {#if movie.poster_path}
                <img
                  src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                  alt={movie.title}
                  class="w-full h-96 object-cover"
                />
              {/if}
            </a>

            <div class="p-4">
              <h3 class="font-semibold text-lg">{movie.title}</h3>
              <p class="text-sm text-gray-500">
                Votos: {movie.votes}
              </p>
              <p class="text-sm text-gray-500">
                Recomendada por: {movie.recommendedBy || 'N.N.'} el {new Intl.DateTimeFormat('es-AR', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }).format(movie.recommendedAt)}
              </p>
              <p class="text-sm text-gray-500">
                Director: {movie.director || 'Desconocido'}
              </p>
              
              <button
                class="mt-2 bg-blue-500 text-white py-1 px-3 rounded"
                onclick={() => {
                  movieStore.toggleVote(movie.id);
                }}
              >
                {movie.hasVoted ? 'Quitar voto' : 'Votar'}
              </button>

            </div>
          </div>
        {/each}
      </div>
    {/if}
  </div>

  <div class="text-center text-gray-500 py-4">
    {#if connectionStatus}
      <p>{connectionStatus}</p>
    {/if}
  </div>

	<!-- {#if user}
		<h1 class="text-2xl font-bold">¡Bienvenido, {user.fullName}!</h1>
		<p class="text-gray-600">@{user.username}</p>
	{:else}
		<p>Cargando...</p>
	{/if} -->

</div>