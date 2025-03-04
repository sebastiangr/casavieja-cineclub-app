<script lang="ts">
  import { page } from '$app/state';  
  import { getModalStore, type ModalSettings as SkeletonModalSettings } from '@skeletonlabs/skeleton';	
  import SearchBar from '$lib/components/SearchBar.svelte';
	import type { Movie, User } from '$lib/types';
	import { userStore } from '$lib/stores/userStore';
	import { CircleX } from 'lucide-svelte';

  // Modal variables
  let showModal = false;
  let movieIdToDelete = '';

  let user = page.data.user;
  console.log('User from page.data:', user.fullName);
  console.log('User from page.data:', user.userId);

  // let user = $state<User | null>(null);
  // userStore.subscribe((value) => user = value); 

  // // let user = page.data.user;
  // console.log('User :', user?.fullName);
  // let userID = user?.id;
  // console.log('User ID:', userID);

  let loading = $state(true);
  let connectionStatus = '';
  // let movies = $state([] as any[]); // Para almacenar las películas desde la base de datos
  // let movies = $state<Movie[]>([]);
  let movies: Movie[] = []; 


  // FUNCIONES MENSAJES / TODO: MOVER A +server.ts
  async function fetchMovies() {
    console.log('Fetching movies...');
    loading = true; // Establecer carga en verdadero antes de fetch
    const response = await fetch('/peliculas');
    console.log('Movies response:', response);
    movies = await response.json();
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
    // showModal = false;
  }  

  async function cancelDelete() {
    // showModal = false;
  }
  
  // Function to delete a movie
  // async function deleteMovie(movieId: String) {
  //   console.log('Movie to Delete:', movieId);
  //   const response = await fetch('/peliculas', {
  //     method: 'DELETE',
  //     body: JSON.stringify({ id: movieId }),
  //     headers: { 'Content-Type': 'application/json' },
  //   });
  //   if (response.ok) {
  //     console.log('Movie deleted:', movieId);
  //     movies = movies.filter(m => m.id !== movieId.toString()); // Convert movieId to string for comparison
  //     fetchMovies();
  //   }
  // }


  // const response = await fetch('/peliculas', {
  //     method: 'POST',
  //     headers: {
  //       'Content-Type': 'application/json',
  //     },
  //     body: JSON.stringify({
  //       title: movie.title, // Asegurarse de que se envíe el título
  //       poster_path: movie.poster_path,
  //       release_date: movie.release_date,
  //       director: movie.director,
  //       userId: userId,
  //     }),
  //   });

  // const response = await fetch(`/peliculas/${movie.id}`, {
  //   method: 'DELETE',
  // });
  // if (response.ok) {
  //   movies = movies.filter(m => m.id !== movie.id); // Eliminar la película del listado
  // }
  
    // Function to delete a movie
  // async function deleteMovie(movieId: number) {
  //   const response = await fetch(`/peliculas/${movieId}`, {
  //     method: 'DELETE',
  //   });
  //   if (response.ok) {
  //     movies = movies.filter(m => m.id !== movieId); // Update movies array without direct mutation
  //   }
  // }

  function handleMovieAdded() {
    fetchMovies(); // Refrescar el listado cuando se agrega una nueva película
  }

  $effect(() => {
    fetchMovies();
  })


  // $effect(() => {
  //   const handle = async () => {
  //     try {
  //       const response = await fetch('/peliculas');
  //       console.log('Pelicula guardada:', response) // Cambiar a la ruta correcta
  //       if (!response.ok) {
  //         throw new Error('Error al cargar las películas');
  //       }
  //       movies = await response.json();
  //     } catch (error: any) {
  //       console.error('Error al cargar las películas:', error);
  //       connectionStatus = error.message;
  //     }
  //   };
  //   handle();
  //   return () => {};
  // });


  

  const modalStore = getModalStore();


  function openDeleteModal(movie: any) {
    modalStore.trigger({
      type: 'component',
      component: 'modalTest',
      // Provide arbitrary metadata to your modal instance:
	    // meta: { title: 'Confirmación', message: '¿Estás seguro que deseas eliminar?', additionalField: 'Pelicula: ' },
      meta: {
        title: 'Confirmación',
        message: '¿Estás seguro que deseas eliminar la pelicula?',
        // additionalField: 'Pelicula: ',
        additionalField: ` ${movie.title}`,
        onConfirm: () => confirmDelete(movie.id),
        onCancel: cancelDelete,
      }
    });
  }

</script>




<div class="flex flex-col align-top items-center w-5/6">
  <SearchBar onMovieAdded={handleMovieAdded} />

  <button
    class="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
    onclick={openDeleteModal}>
    Abrir Modal
  </button>

  <div class="space-y-4 pt-4">
    <!-- {#if movies.length === 0}
      <p class="text-center text-gray-500 py-8">
        Aún no hay películas recomendadas. ¡Sé el primero en añadir una!
      </p>
    {:else} -->

    {#if loading}
      <!-- Mostrar preloader mientras se carga el listado -->
      <div class="flex flex-col items-center justify-center mb-5">
        <!-- <span class="mb-2">Cargando listado...</span> -->
        <div class="loader big"></div>
      </div>
    {:else}    
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {#each movies.reverse() as movie}
          <div class="bg-white rounded-lg shadow-md overflow-hidden relative border-transparent border-2 border-amber-900 hover:border-amber-500 hover:border-2 duration-500 ease-in-out">

            <!-- Botón de eliminar, sólo visible para el usuario que la agregó -->
            {#if movie.recommendedBy === user.userId}              
              <button class="absolute top-0 right-0 flex items-center p-1 m-1 group opacity-80 hover:opacity-100 bg-surface-800 text-primary-700 rounded-full hover:text-primary-500"
                onclick={() => openDeleteModal(movie)} color="red" aria-label="Eliminar">
                <!-- <span class="pr-2 opacity-0 group-hover:opacity-100 transition-opacity">Borrar</span> -->
                <CircleX strokeWidth={1.25} size={26} stroke="currentColor"/>
                <!-- <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg> -->
              </button>
            {/if}

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
              <h3 class="text-primary-500 font-semibold text-lg">{movie.title}</h3>
              <p class="text-sm text-gray-500">
                Director: {movie.director || 'Desconocido'}
              </p>
              <p class="text-sm text-gray-500">
                Votos: {movie.votes}
              </p>
              <p class="text-sm text-gray-500">
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
  </div>
</div>
