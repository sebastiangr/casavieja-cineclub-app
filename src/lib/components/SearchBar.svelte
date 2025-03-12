<script lang="ts">
  import { createQuery } from '@tanstack/svelte-query';
  import pkg from 'lodash';
  const { debounce } = pkg;
  import { searchMovies } from '$lib/services/tmdb';
  import { writable } from 'svelte/store';
  import { getMovieDetails } from '$lib/services/tmdb'; // Import the new function
	import { ChevronRight, Search } from 'lucide-svelte';
	import { userStore } from '$lib/stores/userStore';
	import { page } from '$app/state';
	import type { User } from '$lib/types';

  // let user = page.data.user;
  let user: User | null;
  userStore.subscribe((value) => user = value);
  
  let searchTerm = '';
  let error = '';
  const loading = writable(false);
  const searchResults = writable<any[]>([]);
  
  export let onMovieAdded: () => void;

  // Creamos la función debounced fuera de la query
  const debouncedSearch = debounce(async (term: string) => {
    error = '';
    if (term.length >= 2) {
      loading.set(true);
      console.log('Searching for:', term);
      
      try {
        const response = await searchMovies(term);
        console.log('Search results:', response);
        
        searchResults.set(response.results);

        // Obtener los detalles de las películas - mucho más lenta la precarga
        // const detailedResults = await Promise.all(response.results.map(async (movie) => {
        //   const { director } = await getMovieDetails(movie.id);
        //   return { ...movie, director };
        // }));
        // searchResults.set(detailedResults);
      } catch (err) {
        console.error('Search error:', err);
        error = err instanceof Error ? err.message : 'Error en la búsqueda';
        searchResults.set([]);
      } finally {
        loading.set(false);
      }
    } else {
      searchResults.set([]);
    }
  }, 300);

  // Manejador del input
  function handleInput(event: Event) {
    const input = event.target as HTMLInputElement;
    searchTerm = input.value;
    debouncedSearch(input.value);
  }

  // Nueva función para agregar la película a la base de datos
  // TODO: Añadir animación de carga
  async function addMovieToDatabase(movie: any) {
    const userId = user?.id;
    const userFullName = user?.fullName;
    const username = user?.username;

    console.log('Adding movie to database:', movie);
    console.log('User actual:', user);
    console.log('User actual ID:', userId);
    console.log('User actual Full Name:', userFullName);
    console.log('User actual Username:', username);
    // const userId = user.id; // Obtener el ID del usuario que ha iniciado sesión
    const response = await fetch('/peliculas', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        title: movie.title, // Asegurarse de que se envíe el título
        poster_path: movie.poster_path,
        release_date: movie.release_date,
        director: movie.director,
        userId: userId,
        tmdb_id: movie.id,
        recommendedByFullName: userFullName,
        recommendedByUsername: username,
      }),
    });

    onMovieAdded?.(); // Llamar a la función onMovieAdded si está definida

    if (!response.ok) {
      throw new Error('Error al agregar la película a la base de datos');
    }
  }


  // TODO: Borrar
  // movieStore Manejador para agregar la película con recomendación 
  // function addMovieWithRecommendation(movie: any) {
  //   movieStore.addMovie({
  //     ...movie,
  //     recommendedBy,
  //     recommendedAt: new Date(),
  //   });
  //   recommendedBy = ''; // Reset the input after adding
  // }
</script>

<div class="space-y-4 relative w-full md:w-[460px]">

  <!-- SEARCH BAR -->
  <div class="relative">

    <!-- TODO: Borrar!!! -->
    <!-- <input
      type="text"
      bind:value={recommendedBy}
      placeholder="Recomendado por..."
      class="w-full my-5 px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
    />     -->

    <div class="relative w-full md:w-[460px] items-center">
      <div class="absolute inset-y-0 left-0 pl-3 flex items-center text-primary-700 focus-within:text-primary-500 pointer-events-none z-10">
        <Search strokeWidth={1.25} size={26} stroke="currentColor"/>
      </div>
      <input
        type="text"
        value={searchTerm}
        oninput={handleInput}
        placeholder="Buscar película..."
        class="search-input input"
      />
    </div>
    
    {#if $loading}
      <div class="absolute inset-y-0 right-0 pr-3 flex items-center text-primary-700 focus-within:text-primary-500 pointer-events-none z-10">
        <div class="animate-spin h-5 w-5 border-2 border-white rounded-full border-t-transparent"></div>
      </div>
    {/if}

  </div>

  {#if error}
    <div class="p-4 bg-surface-700 border border-red-600 text-red-600 rounded-md text-center">      
      <span>ERROR: {error}</span>
    </div>
  {/if}
  
  <!-- TODO: Impedir añadir una película ya existente en la DB. -->
  <!-- RESULTS -->
  {#if $searchResults.length > 0 && searchTerm.length >= 2}
    <div class="bg-surface-700 border-surface-600 border-[1px] w-full shadow-md rounded-md absolute z-50">
      {#each $searchResults.slice(0, 5) as movie}
        <button
          class="group w-full px-2 py-2 flex items-center gap-4 border-surface-100 border-t-[1px] border-t-surface-600 hover:bg-surface-500 hover:border-surface-600 transition"
          disabled={$loading}
          onclick={async () => {
            loading.set(true); // Start loading indicator
            try {
              const details = await getMovieDetails(movie.id);
              await addMovieToDatabase(details); // Call the new function
              console.log('Movie details:', details);
              searchTerm = ''; // Clear search term input
            } catch (err) {
              console.error('Error adding movie:', err);
            } finally {
              loading.set(false); // Stop loading indicator
            }
          }}
        >
          {#if movie.poster_path}
            <img
              src={`https://image.tmdb.org/t/p/w92${movie.poster_path}`}
              alt={movie.title}
              class="w-12 h-18 object-cover rounded"
            />
          {:else}
            <div class="w-12 h-18 bg-gray-200 rounded flex items-center justify-center">
              <span class="text-gray-400">N/A</span>
            </div>
          {/if}

          <div class="flex-1 text-left">
            <h3 class="font-bold text-primary-500">{movie.title}</h3>
            <p class="text-sm text-surface-300">
              {new Date(movie.release_date).getFullYear()}
            </p>
          </div>

          <div class="text-primary-700 group-hover:text-primary-500">
            <ChevronRight strokeWidth={1.25} size={26} stroke="currentColor"/>
          </div>

        </button>
      {/each}
    </div>
  {:else if searchTerm.length >= 2 && !$loading}
  <div class="bg-surface-700 border-surface-600 border-[1px] w-full shadow-md rounded-md absolute z-50">
    <p class="text-center text-primary-500 p-4">
      No se encontraron resultados para "{searchTerm}"
    </p>
  </div>    
  {/if}
</div>

<style>
  .search-input {
    padding-left: 50px;
  }
</style>