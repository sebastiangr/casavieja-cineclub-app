import type { Movie, SearchResponse } from "$lib/types";

const TMDB_API_KEY = import.meta.env.VITE_TMDB_API_KEY;
const BASE_URL = 'https://api.themoviedb.org/3';

export async function getMovieDetails(id: number): Promise<Movie> {
  const url = `${BASE_URL}/movie/${id}?api_key=${TMDB_API_KEY}&language=es-ES`;

  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Error fetching movie details: ${response.statusText}`);
  }
  const movie = await response.json();

  const creditsResponse = await fetch(`${BASE_URL}/movie/${id}/credits?api_key=${TMDB_API_KEY}`);
  if (!creditsResponse.ok) {
    throw new Error(`Error fetching movie credits: ${creditsResponse.statusText}`);
  }

  const credits = await creditsResponse.json();
  console.log("Creditos:", credits);
  // movie.director = credits.crew.find((crewMember: { job: string; }) => crewMember.job === 'Director')?.name ?? null;
  // Busca el objeto del director en el array 'crew'
  movie.director = credits.crew.find((crewMember: { job: string; name: string }) => crewMember.job === 'Director')?.name ?? null;
  console.log("Director:", movie.director );

  return movie;
}

export async function checkConnection(): Promise<string> {
  const url = `${BASE_URL}/configuration?api_key=${TMDB_API_KEY}`;
  
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Error connecting to TMDB API: ${response.statusText}`);
  }
  
  return 'Conexión exitosa con el API de TMDB';
}

export async function searchMovies(query: string): Promise<SearchResponse> {
  if (!query) return { results: [], total_results: 0, total_pages: 0 };

  const url = `${BASE_URL}/search/movie?api_key=${TMDB_API_KEY}&query=${encodeURIComponent(query)}&language=es-ES`;

  console.log('Fetching:', url.replace(TMDB_API_KEY, 'API_KEY')); // Log seguro de la URL

  try {
    const response = await fetch(url);

    if (!response.ok) {
      console.error('Error response:', {
        status: response.status,
        statusText: response.statusText
      });
      throw new Error(`Error ${response.status}: ${response.statusText}`);
    }

    const data = await response.json();
    console.log('API Response:', {
      totalResults: data.total_results,
      resultsCount: data.results?.length
    });

    return data;
  } catch (error) {
    console.error('Search error:', error);
    throw error;
  }
}

