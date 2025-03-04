<script lang="ts">
  import { page } from '$app/state';  
  import { getModalStore, type ModalSettings as SkeletonModalSettings } from '@skeletonlabs/skeleton';	
  import SearchBar from '$lib/components/SearchBar.svelte';
	import type { Movie, User } from '$lib/types';
	import { CircleX } from 'lucide-svelte';

  // Modal variables
  let showModal = false;
  let movieIdToDelete = '';

  let user = page.data.user;
  console.log('User from page.data:', user.fullName);
  console.log('User from page.data:', user.userId);

  let loading = $state(true);
  let connectionStatus = '';
  let movies: Movie[] = []; 

  let checkMoviesLength = $state(false);

  // FUNCIONES MENSAJES / TODO: MOVER A +server.ts
  async function fetchMovies() {
    console.log('Fetching movies...');
    loading = true; // Establecer carga en verdadero antes de fetch
    const response = await fetch('/peliculas');
    console.log('Movies response:', response);
    movies = await response.json();
    
    checkMoviesLength = movies.length > 0;
    console.log('More than one movie:', checkMoviesLength);

    console.log('Movies:', movies);
    // messages = await res.json();
    loading = false; // Establecer carga en falso después de fetch
    console.log('Finished fetching movies');
  }
  
  async function confirmDelete(movieId: string) {
    // Eliminar la película
    console.log('Movie to Delete:', movieId);
    const response = await fetch('/peliculas', {
      method: 'DELETE',
      body: JSON.stringify({ id: movieId }),
      headers: { 'Content-Type': 'application/json' },
    });
    if (response.ok) {
      console.log('Movie deleted:', movieId);
      fetchMovies();
    }
  }  

  async function cancelDelete() {
  }

  // MODAL Para eliminar película
  const modalStore = getModalStore();

  function openDeleteModal(movie: any) {
    modalStore.trigger({
      type: 'component',
      component: 'modalDelete',
      meta: {
        title: 'Confirmación',
        message: '¿Estás seguro que deseas eliminar la pelicula?',
        additionalField: ` ${movie.title}`,
        onConfirm: () => confirmDelete(movie.id),
        onCancel: () => cancelDelete(),
      }
    });
  }

  function handleMovieAdded() {
    fetchMovies(); // Refrescar el listado cuando se agrega una nueva película
  }

  $effect(() => {
    fetchMovies();
  })

</script>

<div class="flex flex-col align-top items-center w-5/6 pb-28">
  <SearchBar onMovieAdded={handleMovieAdded} />

  <!-- TODO: Añadir barra de filtros -->
  <!-- TODO: Cambiar estilos card. -->
  <!-- TODO: ¿Implementar la card como componente? -->

  <div class="space-y-4 pt-4">

    {#if checkMoviesLength}

      {#if loading}
      <!-- Mostrar preloader mientras se carga el listado -->
        <div class="flex flex-col items-center justify-center mb-5">
          <!-- <span class="mb-2">Cargando listado...</span> -->
          <div class="loader big"></div>
        </div>
      {:else}    
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-4">
          {#each movies.reverse() as movie}
            <div class="bg-surface-700 rounded-lg shadow-md overflow-hidden relative border-surface-600 border-[1px] hover:border-primary-500 hover:border-[1px] duration-300 ease-in-out">

              <!-- Botón de eliminar, sólo visible para el usuario que la agregó -->
              {#if movie.recommendedBy === user.userId}              
                <button class="absolute top-0 right-0 flex items-center p-1 m-1 group opacity-80 hover:opacity-100 bg-surface-800 text-primary-700 rounded-full hover:text-primary-500"
                  onclick={() => openDeleteModal(movie)} color="red" aria-label="Eliminar">
                  <CircleX strokeWidth={1.25} size={26} stroke="currentColor"/>
                </button>
              {/if}

              <a href={`https://www.themoviedb.org/movie/${movie.tmdb_id}`} target="_blank" rel="noopener noreferrer">
                {#if movie.poster_path}
                  <img
                    src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                    alt={movie.title}
                    class="w-full h-96 object-cover"
                  />
                {/if}
              </a>

              <div class="p-4">
                <div class="text-center pb-2">
                  <h3 class="text-primary-500 font-semibold text-lg">{movie.title}</h3>
                  <p class="text-md font-bold italic text-surface-300">
                    ({(new Date(movie.release_date)).getFullYear() || 'Desconocido'})
                  </p>
                </div>
                <p class="text-sm text-surface-300">
                  Dir: {movie.director || 'Desconocido'}
                </p>
                <p class="text-sm text-surface-300">
                  Votos: {movie.votes}
                </p>
                <p class="text-sm text-surface-300">
                  Recomendada por: <br> {movie.recommendedByFullName || 'N.N.'} @ {movie.recommendedByUsername || 'N.N.'}
                  <!-- TODO: Corregir formato fecha -->
                  <!-- el {new Intl.DateTimeFormat('es-AR', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }).format(movie.recommendedAt)} -->
                </p>

                <!-- TODO: Agregar botón para votar -->
                <!-- <button
                  class="mt-2 bg-blue-500 text-white py-1 px-3 rounded"
                  onclick={() => {
                    movieStore.toggleVote(movie.id);
                  }}
                >
                  {movie.hasVoted ? 'Quitar voto' : 'Votar'}
                </button> -->
              </div>
              
            </div>
          {/each}
        </div>
      {/if}

    {:else}

      <p class="text-center text-gray-500 py-8">
        Aún no hay películas recomendadas. ¡Sé el primero en añadir una!
      </p>

    {/if}

  </div>
</div>