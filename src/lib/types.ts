export interface User {
  id: string;
  username: string;
  email?: string;
  fullName?: string;
}

export interface Message {
  id: string;
  content: string;
  createdAt: string;
  user: {
    id: string;
    username: string;
    fullName?: string;
  };
}

export interface Movie {
  id: number;
  title: string;
  overview: string;
  poster_path: string;
  release_date: string;
  vote_average: number;
  director: string;
}

export interface MovieRecommendation extends Movie {
  recommendedAt: Date;
  recommendedBy: string;
  director : string;
  votes: number; // Contador de votos
  hasVoted: boolean; // Indica si el usuario ya ha votado
}

export interface SearchResponse {
  results: Movie[];
  total_results: number;
  total_pages: number;
}