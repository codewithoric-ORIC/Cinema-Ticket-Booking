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
    movie?: Movie;
    movieId?: number;
    movieTitle?: string;
    showDate: string;
    showTime: string;
    availableSeats: number;
    seats?: Array<{
        id: number;
        seatNumber: string;
        rowChar: string;
        col: number;
        price: number;
        isBooked: boolean;
        isReserved: boolean;
    }>;
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
    // Generate dates for next 7 days
    const generateDates = () => {
      const dates = [];
      const today = new Date();
      for (let i = 0; i < 7; i++) {
        const date = new Date(today);
        date.setDate(today.getDate() + i);
        dates.push(date.toISOString().split('T')[0]);
      }
      return dates;
    };

    const DATES = generateDates();

    const mockMovies = getMockMovies();
    const mockTheaters = [
      { id: 1, name: "Grand Cinema", location: "Downtown", totalSeats: 100 },
      { id: 2, name: "Cineplex", location: "Mall", totalSeats: 150 }
    ];

    // Get the requested movie, or create a dummy if not found
    let requestedMovie = mockMovies.find(m => m.id === movieId);
    if (!requestedMovie) {
      requestedMovie = {
        id: movieId,
        title: "Movie",
        description: "A great movie",
        rating: 8.0,
        imageUrl: "",
        duration: 120,
        genre: "Action",
        year: 2024,
        releaseDate: new Date().toISOString().split('T')[0],
        isActive: true,
        cast: [],
        trailers: []
      };
    }

    // Generate showtimes specifically for this movie
    const showtimes: Showtime[] = [
      {
        id: movieId * 10 + 1,
        theater: mockTheaters[0],
        showDate: DATES[0],
        showTime: "14:00",
        availableSeats: 50
      },
      {
        id: movieId * 10 + 2,
        theater: mockTheaters[0],
        showDate: DATES[0],
        showTime: "18:00",
        availableSeats: 45
      },
      {
        id: movieId * 10 + 3,
        theater: mockTheaters[1],
        showDate: DATES[1],
        showTime: "20:00",
        availableSeats: 30
      },
      {
        id: movieId * 10 + 4,
        theater: mockTheaters[1],
        showDate: DATES[2],
        showTime: "16:00",
        availableSeats: 60
      }
    ];

    // Assign the requested movie to all showtimes
    return showtimes.map(st => ({
      ...st,
      movie: requestedMovie
    }));
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

export const fetchAllTheaters = async (): Promise<Theater[]> => {
  try {
    const response = await api.get("/theaters");
    return response.data;
  } catch (e) {
    return [
      { id: 1, name: "Grand Cinema", location: "Downtown", totalSeats: 100 },
      { id: 2, name: "Cineplex", location: "Mall", totalSeats: 150 }
    ];
  }
};

export const fetchMoviesByTheaterId = async (theaterId: number): Promise<Movie[]> => {
  try {
    const response = await api.get(`/movies/theater/${theaterId}`);
    return response.data;
  } catch (e) {
    const movies = getMockMovies();
    return movies;
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

export interface FavouriteResponse {
    id: number;
    movie: Movie;
}

export const fetchUserFavourites = async (): Promise<Movie[]> => {
    try {
        const response = await api.get(`/favourites`);
        return response.data.map((fav: FavouriteResponse) => fav.movie);
    } catch (e) {
        console.error("Failed to load favourites:", e);
        return [];
    }
};
