export interface Movie {
  id: number;
  title: string;
  overview: string;
  poster_path: string | null;
  backdrop_path: string | null;
  release_date: string;
  vote_average: number;
}

export interface MovieNote {
  id: string;
  movieId: number;
  movieTitle: string;
  moviePoster: string | null;
  note: string;
  personalImage: string | null;
  rating: number;
  createdAt: string;
  isFavorite: boolean;
}

export interface AppSettings {
  theme: 'light' | 'dark' | 'system';
  sortBy: 'date' | 'rating' | 'title';
}