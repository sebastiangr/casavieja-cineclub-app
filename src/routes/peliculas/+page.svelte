<script lang="ts">
  import { page } from '$app/state';  
  import { getModalStore, type ModalSettings as SkeletonModalSettings } from '@skeletonlabs/skeleton';	
  import SearchBar from '$lib/components/SearchBar.svelte';
	import type { Movie, User } from '$lib/types';
	import { ArrowDownAZ, CalendarArrowDown, ListOrdered, Minus, Plus, X } from 'lucide-svelte';
  import { moviesStore } from '$lib/stores/movies';

  // Modal variables
  let showModal = false;
  let movieIdToDelete = '';

  let user = page.data.user;
  console.log('User from page.data:', user.fullName);
  console.log('User from page.data:', user.userId);

  let loading = $state(true);
  let connectionStatus = '';
  // let movies: Movie[] = []; 
  // Replace the local movies array with the store
  let movies = $state<Movie[]>([]);
  moviesStore.subscribe(value => movies = value);

  let checkMoviesLength = $state(false);

  let sortBy = $state('recent'); // Opciones: 'title', 'votes', 'recent'

  // FUNCIONES MENSAJES / TODO: MOVER A +server.ts
  // OLD-WORKING
  // async function fetchMovies() {
  //   console.log('Fetching movies...');
  //   loading = true; // Establecer carga en verdadero antes de fetch
  //   const response = await fetch('/peliculas');
  //   console.log('Movies response:', response);
  //   movies = await response.json();
    
  //   checkMoviesLength = movies.length > 0;
  //   console.log('More than one movie:', checkMoviesLength);

  //   console.log('Movies:', movies);
  //   // messages = await res.json();
  //   loading = false; // Establecer carga en falso después de fetch
  //   console.log('Finished fetching movies');
  // }


  // NEW FETCHMOVIES
  async function fetchMovies() {
    console.log('Fetching movies...');
    loading = true;
    
    const response = await fetch('/peliculas');
    const newMovies = await response.json();
      // Update hasVoted status for each movie
    for (let movie of newMovies) {
      movie.hasVoted = await checkIfVoted(movie.id);
    }

    // Update the store
    moviesStore.set(newMovies);
    checkMoviesLength = newMovies.length > 0;
    loading = false;
    // movies = await response.json();

    // Verificar si el usuario ha votado en cada película
    // for (let movie of movies) {
    //   movie.hasVoted = await checkIfVoted(movie.id);
    // }

    // checkMoviesLength = movies.length > 0;
    // loading = false;
  }

  // CHEK IF VOTED
  async function checkIfVoted(movieId: string) {
    const response = await fetch(`/api/check-vote?movieId=${movieId}`);
    const data = await response.json();
    return data.hasVoted;
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


  // VOTES
  async function toggleVote(movie: Movie) {
    const response = await fetch('/api/vote', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ movieId: movie.id })
    });

    // const data = await response.json();
    // if (response.ok) {
    //   movie.hasVoted = data.hasVoted;
    //   movie.votes = data.votes;
    //   // movie.votes += data.hasVoted ? 1 : -1;
    //   // fetchMovies();
    // } else {
    //   console.error('Error al votar:', data.error);
    // }
    const data = await response.json();
    if (response.ok) {
      // Update the store
      moviesStore.update(currentMovies => {
        return currentMovies.map(m => 
          m.id === movie.id ? { ...m, hasVoted: data.hasVoted, votes: data.votes } : m
        );
      });
    } else {
      console.error('Error al votar:', data.error);
    }
  }

  // SORTING
  function sortMovies() {
    if (sortBy === 'title') {
      return [...movies].sort((a, b) => a.title.localeCompare(b.title));
    }

    if (sortBy === 'votes') {
      return [...movies].sort((a, b) => b.votes - a.votes);
    }

    if (sortBy === 'recent') {
      // return [...movies].sort((a, b) => new Date(b.recommendedAt).getTime() - new Date(a.recommendedAt).getTime());
      return [...movies].sort((a, b) => 
        new Date(b.recommendedAt).getTime() - new Date(a.recommendedAt).getTime()
      );
    }

    return movies;
  }


  let sortedMovies = $derived(sortMovies());

  // MODAL Para eliminar película
  const modalStore = getModalStore();

  function openDeleteModal(movie: any) {
    modalStore.trigger({
      type: 'component',
      component: 'modalDelete',
      meta: {
        title: 'Eliminar película',
        message: 'Estás seguro que deseas eliminar',
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

<div class="flex flex-col align-top w-5/6 pb-28">

  <div class="flex justify-center item-center">
    <SearchBar onMovieAdded={handleMovieAdded} />
  </div>

  <!-- TODO: Añadir barra de filtros -->
  <!-- TODO: Cambiar estilos card. -->
  <!-- TODO: ¿Implementar la card como componente? -->

    <!-- <select bind:value={sortBy} class="text-primary-500 p-2 border rounded">
      <option value="recent">Más recientes</option>
      <option value="title">Orden alfabético</option>
      <option value="votes">Más votadas</option>
    </select> -->

    <!-- <div class="filterd"> -->


  <hr class="w-full border border-gray-300 my-2">

  <div class="filter-wrapper flex justify-between items-center ">

    <div class="flex items-center">
      <span class="text-surface-400">Orden: {sortBy === 'recent' ? 'Recientes' : sortBy === 'title' ? 'Alfabético' : 'Más votadas'}</span>
    </div>

    <div class="flex">    
      <button class="{sortBy === 'votes' ? 'btn-filter-active' : 'btn-filter'} flex relative p-1 m-1 group text-primary-800 rounded-full hover:text-primary-500"
        color="red" aria-label="Más votadas"
        onclick={() => sortBy = 'votes'} >
        <ListOrdered  strokeWidth={1.25} size={26} stroke="currentColor"/>
        <span class="group-hover:opacity-100 transition-opacity bg-surface-700 p-1 text-sm text-primary-500 rounded-md absolute left-1/2 
        -translate-x-1/2 translate-y-full opacity-0 mt-2 mx-auto w-[100px] z-10">Más votadas</span>
      </button>
      <button class="{sortBy === 'title' ? 'btn-filter-active' : 'btn-filter'} flex relative p-1 m-1 group text-primary-800 rounded-full hover:text-primary-500"
        color="red" aria-label="Orden alfabético"
        onclick={() => sortBy = 'title'} >
        <ArrowDownAZ strokeWidth={1.25} size={26} stroke="currentColor"/>
        <span class="group-hover:opacity-100 transition-opacity bg-surface-700 p-1 text-sm text-primary-500 rounded-md absolute left-1/2 
        -translate-x-1/2 translate-y-full opacity-0 mt-2 mx-auto w-[120px] z-10">Orden alfabético</span>
      </button>
      <button class="{sortBy === 'recent' ? 'btn-filter-active' : 'btn-filter'} flex relative p-1 m-1 group text-primary-800 rounded-full hover:text-primary-500"
        color="red" aria-label="Más recientes"
        onclick={() => sortBy = 'recent'} >
        <CalendarArrowDown strokeWidth={1.25} size={26} stroke="currentColor"/>
        <span class="group-hover:opacity-100 transition-opacity bg-surface-700 p-1 text-sm text-primary-500 rounded-md absolute left-1/2 
        -translate-x-1/2 translate-y-full opacity-0 mt-2 mx-auto w-[100px] z-10">Recientes</span>
      </button>
    </div>

  </div>

  <div class="space-y-4 pt-4">

    {#if checkMoviesLength}

      <!-- {#if loading_vote}
        <div class="loader big"></div>
      {/if} -->


      {#if loading}
      <!-- Mostrar preloader mientras se carga el listado -->
        <div class="flex flex-col items-center justify-center mb-5">
          <!-- <span class="mb-2">Cargando listado...</span> -->
          <div class="loader big"></div>
        </div>
      {:else}    
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-4">
          <!-- {#each movies.reverse() as movie} -->
          <!-- {#each sortMovies() as movie} -->
          {#each sortedMovies as movie}
            <div class="bg-surface-700 rounded-lg shadow-md overflow-hidden relative border-surface-600 border-[1px] hover:border-primary-500 hover:border-[1px] duration-300 ease-in-out">

              <!-- Botón de eliminar, sólo visible para el usuario que la agregó -->
              {#if movie.recommendedBy === user.userId}                      
                <button class="absolute top-0 right-0 flex items-center p-1 m-1 group opacity-80 hover:opacity-100 bg-surface-800 text-primary-700 rounded-full hover:text-primary-500"
                  onclick={() => openDeleteModal(movie)} color="red" aria-label="Eliminar">
                  <X strokeWidth={1.25} size={26} stroke="currentColor"/>
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

              <div class="flex flex-col justify-around pr-4 pl-4 pb-4 pt-0">

                <div class="text-center mb-2 -mt-[10px]">
                  <span class="badge variant-filled-primary rounded">{movie.recommendedByFullName || 'N.N.'}</span>
                </div>

                <div class="text-center pb-2">                  
                  <div class="movie-title flex items-center justify-center align-middle min-h-16 overflow-hidden">
                    <h3 class="text-center text-primary-500 font-semibold text-lg lg:text-xl leading-[1.5rem]">{movie.title}</h3>
                  </div>
                  <p class="text-sm text-surface-300 text-center italic">
                    Dir: {movie.director || 'Desconocido'}
                  </p>
                  <p class="text-md font-bold text-surface-300">
                    ({(new Date(movie.release_date)).getFullYear() || 'Desconocido'})
                  </p>
                  <div class="flex flex-row justify-center items-center align-middle mt-2 mb-4">
                    <span class="ml-1 text-xs text-surface-300 text-center">
                      Agregada el: {new Date(movie.recommendedAt).toLocaleDateString()}
                    </span>
                  </div>
                  
                </div>
                
                <span class="mb-1 text-sm text-surface-300 font-semibold text-center">VOTOS:</span>

                <div class="flex flex-row justify-between align-middle items-center">
                  <button
                    disabled={!movie.hasVoted}
                    onclick={() => toggleVote(movie)}
                    class="btn btn-vote-left w-[50px] h-[50px] variant-filled-primary text-primary-200 ml-2">
                    <Minus strokeWidth={1.75} size={30} stroke="white"/>
                  </button>
                  <div class="flex flex-col votes_total bg-surface-500 w-full h-[50px] justify-center items-center">
                    <!-- <span class="text-[12px]">VOTOS</span> -->
                    <span class="text-2xl font-bold text-center">{movie.votes}</span>
                  </div>
                  <button
                    disabled={movie.hasVoted}
                    onclick={() => toggleVote(movie)}
                    class="btn btn-vote-right w-[50px] h-[50px] variant-filled-primary text-primary-200 ml-2">
                    <Plus strokeWidth={1.75} size={30} stroke="white"/>
                  </button>
                </div>                  

                  <!-- TODO: Rediseñar de la siguiente forma -> dos botones con iconos de + y - para votar y un contador de votos al centro. Los botones se activan o desactivan según se haya votado previamente o no, o también un sólo botón como está actualmente que cambie según el estado.                                     -->
                  <!-- <div class="flex flex-col justify-center relative group items-center">
                    <span class="mr-1 text-sm text-surface-300">Votos:</span> 
                    <span class="text-lg text-surface-300 font-bold group-hover:text-primary-500">{movie.votes}</span>
                    <button
                      onclick={() => toggleVote(movie)}
                      class="btn btn-round w-[40px] h-[40px] variant-filled-primary text-primary-200 group"> -->
                      <!-- <span class="flex group-hover:hidden">{movie.votes}</span> -->
                      <!-- {#if movie.hasVoted}
                        <Minus class="" strokeWidth={1.75} size={30} stroke="white"/>
                      {:else}
                        <Plus class="" strokeWidth={1.75} size={30} stroke="white"/>
                      {/if}
                    </button>
                  </div> -->

                  <!-- <button
                    onclick={() => toggleVote(movie)}
                    class="btn btn-round w-[40px] h-[40px] variant-filled-primary text-primary-200 group">
                    <span class="flex group-hover:hidden">{movie.votes}</span>
                    {#if movie.hasVoted}
                      <Minus class="hidden group-hover:flex" strokeWidth={1.75} size={30} stroke="white"/>
                    {:else}
                      <Plus class="hidden group-hover:flex" strokeWidth={1.75} size={30} stroke="white"/>
                    {/if}
                  </button> -->



              </div>
              
            </div>
          {/each}
        </div>
      {/if}

    {:else}

      <p class="text-center text-surface-300 py-8">
        Aún no hay películas recomendadas. ¡Sé el primero en añadir una!
      </p>

    {/if}

  </div>
</div>

<style>
  .badge {
    color: white !important;
    font-weight: 300;
    letter-spacing: 0.5px;
  }
  .btn-filter-active {
    color: rgba(var(--color-primary-500));
  }
</style>