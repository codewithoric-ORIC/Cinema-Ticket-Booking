import api from '../api/axios';
import { initMockData, getMockMovies, getMockTrailers } from './MockDataStorage';

// Initialize mock data
initMockData();

export interface Cast {
  id: number;
  name: string;
  characterName: string;
  avatarUrl: string;
  movieId: number;
  movieTitle: string;
}

export interface Movie {
  id: number;
  title: string;
  description: string;
  rating: number;
  imageUrl: string;
  duration: number;
  genre: string;
  year: number;
  releaseDate: string;
  isActive: boolean;
  cast: Cast[];
  trailers: Trailer[];
}

export interface Theater {
    id: number;
    name: string;
    location: string;
    totalSeats: number;
}

export interface Showtime {
    id: number;
    theater: Theater;
    showDate: string;
    showTime: string;
    availableSeats: number;
}

export interface Trailer {
  id: number;
  title: string;
  duration: string;
  youtubeId: string;
  thumbnailUrl: string;
  movie?: Movie;
}

export const fetchAllMovies = async (): Promise<Movie[]> => {
  try {
    const response = await api.get('/movies');
    return response.data;
  } catch (e) {
    return getMockMovies();
  }
};

export const fetchCurrentMovies = async (): Promise<Movie[]> => {
  try {
    const response = await api.get('/movies/current');
    return response.data;
  } catch (e) {
    const movies = getMockMovies();
    return movies.filter(m => new Date(m.releaseDate) <= new Date());
  }
};

export const fetchUpcomingMovies = async (): Promise<Movie[]> => {
  try {
    const response = await api.get('/movies/upcoming');
    return response.data;
  } catch (e) {
    const movies = getMockMovies();
    return movies.filter(m => new Date(m.releaseDate) > new Date());
  }
};

export const fetchMovieById = async (id: number): Promise<Movie> => {
  try {
    const response = await api.get(`/movies/${id}`);
    return response.data;
  } catch (e) {
    const movies = getMockMovies();
    const movie = movies.find(m => m.id === id);
    if (!movie) throw new Error("Movie not found");
    return movie;
  }
};

export const fetchShowtimesByMovieId = async (movieId: number): Promise<Showtime[]> => {
  try {
    const response = await api.get(`/show-times/movie/${movieId}`);
    return response.data;
  } catch (e) {
    return [];
  }
};

export const checkIsFavourite = async (movieId: number): Promise<boolean> => {
  try {
    const response = await api.get(`/favourites/check/${movieId}`);
    return response.data;
  } catch (e) {
    return false;
  }
};

export const addToFavourites = async (movieId: number) => {
  try {
    await api.post("/favourites", { movieId });
  } catch (e) {
    console.error("Failed to add to favourites", e);
  }
};

export const removeFromFavourites = async (movieId: number) => {
  try {
    await api.delete(`/favourites/${movieId}`);
  } catch (e) {
    console.error("Failed to remove from favourites", e);
  }
};

export const fetchAllTrailers = async (): Promise<Trailer[]> => {
  try {
    const response = await api.get('/trailers');
    return response.data;
  } catch (e) {
    return getMockTrailers();
  }
};

export const fetchTrailersByMovieId = async (movieId: number): Promise<Trailer[]> => {
  try {
    const response = await api.get(`/trailers/movie/${movieId}`);
    return response.data;
  } catch (e) {
    const trailers = getMockTrailers();
    return trailers.filter(t => t.movie?.id === movieId);
  }
};
