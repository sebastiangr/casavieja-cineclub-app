// import { writable } from 'svelte/store';
// import type { MovieRecommendation } from '$lib/types';


// function createMovieStore() {
//   const { subscribe, update } = writable<MovieRecommendation[]>([]);
  
//   return {
//     subscribe,
//     addMovie: (movie: MovieRecommendation) => {
//       update(movies => [
//         {
//           ...movie,
//           recommendedAt: new Date(),
//           recommendedBy: movie.recommendedBy, 
//           director: movie.director, // Asegurarse de que el director se incluya
//           votes: 0, // Inicializar el contador de votos en cero
//           // recommendedBy: 'Usuario', // Placeholder por ahora
//         },
//         ...movies
//       ]);
//     },
//     removeMovie: (id: number) => { 
//       update(movies => movies.filter(movie => movie.id !== id));
//     },
//     toggleVote: (id: number) => {
//       update(movies => {
//         const index = movies.findIndex(movie => movie.id === id);
//         if (index !== -1) {
//           movies[index].hasVoted = !movies[index].hasVoted; // Toggle de votos
//           movies[index].votes += movies[index].hasVoted ? 1 : -1; // Incrementar o decrementar seg n sea necesario
//         }
//         return movies;
//       });
//     }
//   };
// }

// export const movieStore = createMovieStore();

import { writable } from 'svelte/store';
import type { Movie } from '$lib/types';

export const moviesStore = writable<Movie[]>([]);