import api from "../../api/axios";
import { type Movie, type Trailer, type Cast } from "../../service/MovieService";
import { type CreateShowtimeRequest } from "./AdminTypes";
import {
  initMockData,
  getMockMovies,
  saveMockMovies,
  getMockTrailers,
  saveMockTrailers,
  getMockTheaters,
  saveMockTheaters,
  getMockBookings,
  saveMockBookings
} from "../../service/MockDataStorage";

// Initialize mock data
initMockData();

export interface Theater {
  id: number;
  name: string;
  location: string;
  totalSeats: number;
}

export interface Showtime {
  id: number;
  theater: Theater;
  movieId: number;
  movieTitle: string;
  showDate: string;
  showTime: string;
  availableSeats: number;
}

export interface Booking {
  id: number;
  user: any;
  showtime: Showtime;
  totalAmount: number;
  status: string;
  bookingReference: string;
}

// Get all movies
export const fetchAllMovies = async (): Promise<Movie[]> => {
  try {
    const response = await api.get("/movies");
    return response.data;
  } catch (error) {
    console.error("Error fetching movies:", error);
    throw error;
  }
};

// Create movie
export const createMovie = async (movie: Omit<Movie, "id">): Promise<Movie> => {
  try {
    const response = await api.post("/movies", movie);
    return response.data;
  } catch (e) {
    const movies = getMockMovies();
    const maxId = movies.length > 0 ? Math.max(...movies.map(m => m.id)) : 0;
    const newMovie = { ...movie, id: maxId + 1, cast: [], trailers: [] };
    movies.push(newMovie);
    saveMockMovies(movies);
    return newMovie;
  }
};

// Delete movie
export const deleteMovie = async (id: number): Promise<void> => {
  try {
    await api.delete(`/movies/${id}`);
  } catch (e) {
    let movies = getMockMovies();
    movies = movies.filter(m => m.id !== id);
    saveMockMovies(movies);
  }
};

// Get all trailers
export const fetchAllTrailers = async (): Promise<Trailer[]> => {
  try {
    const response = await api.get("/trailers");
    return response.data;
  } catch (e) {
    return getMockTrailers();
  }
};

// Create trailer
export const createTrailer = async (trailer: {
  title: string;
  duration: string;
  youtubeId: string;
  thumbnailUrl: string;
  movieId: number;
}): Promise<Trailer> => {
  try {
    const response = await api.post("/trailers", trailer);
    return response.data;
  } catch (e) {
    const trailers = getMockTrailers();
    const maxId = trailers.length > 0 ? Math.max(...trailers.map(t => t.id)) : 0;
    const movies = getMockMovies();
    const movie = movies.find(m => m.id === trailer.movieId);
    const newTrailer = { 
      ...trailer, 
      id: maxId + 1,
      movie
    } as any;
    trailers.push(newTrailer);
    saveMockTrailers(trailers);
    return newTrailer;
  }
};

// Delete trailer
export const deleteTrailer = async (id: number): Promise<void> => {
  try {
    await api.delete(`/trailers/${id}`);
  } catch (e) {
    let trailers = getMockTrailers();
    trailers = trailers.filter(t => t.id !== id);
    saveMockTrailers(trailers);
  }
};

// Get all theaters
export const fetchAllTheaters = async (): Promise<Theater[]> => {
  try {
    const response = await api.get("/theaters");
    return response.data;
  } catch (error) {
    console.error("Error fetching theaters:", error);
    throw error;
  }
};

// Create theater
export const createTheater = async (theater: Omit<Theater, "id">): Promise<Theater> => {
  try {
    const response = await api.post("/theaters", theater);
    return response.data;
  } catch (e) {
    const theaters = getMockTheaters();
    const maxId = theaters.length > 0 ? Math.max(...theaters.map(t => t.id)) : 0;
    const newTheater = { ...theater, id: maxId + 1 };
    theaters.push(newTheater);
    saveMockTheaters(theaters);
    return newTheater;
  }
};

// Delete theater
export const deleteTheater = async (id: number): Promise<void> => {
  try {
    await api.delete(`/theaters/${id}`);
  } catch (e) {
    let theaters = getMockTheaters();
    theaters = theaters.filter(t => t.id !== id);
    saveMockTheaters(theaters);
  }
};

export const fetchAllShowtimes = async (): Promise<Showtime[]> => {
  try {
    const response = await api.get('/show-times');
    return response.data;
  } catch (error) {
    console.error("Error fetching showtimes:", error);
    throw error;
  }
};

export const createShowtime = async (request: CreateShowtimeRequest): Promise<Showtime> => {
  try {
    const response = await api.post('/show-times', request);
    return response.data;
  } catch (error) {
    console.error("Error creating showtime:", error);
    throw error;
  }
};

export const deleteShowtime = async (id: number): Promise<void> => {
  try {
    await api.delete(`/show-times/${id}`);
  } catch (error) {
    console.error("Error deleting showtime:", error);
    throw error;
  }
};

// Get all bookings
export const fetchAllBookings = async (): Promise<Booking[]> => {
  try {
    const response = await api.get("/bookings");
    return response.data;
  } catch (e) {
    return getMockBookings();
  }
};

// Update booking status
export const updateBookingStatus = async (id: number, status: string): Promise<Booking> => {
  try {
    const response = await api.put(`/bookings/${id}/status?status=${status}`);
    return response.data;
  } catch (e) {
    const bookings = getMockBookings();
    const booking = bookings.find(b => b.id === id);
    if (booking) {
      booking.status = status;
      saveMockBookings(bookings);
    }
    return booking || bookings[0];
  }
};

// Cast functions
export const fetchAllCasts = async (): Promise<Cast[]> => {
  try {
    const response = await api.get("/casts");
    return response.data;
  } catch (e) {
    return [];
  }
};

export const createCast = async (cast: {
  name: string;
  characterName: string;
  avatarUrl: string;
  movieId: number;
}): Promise<Cast> => {
  try {
    const response = await api.post("/casts", cast);
    return response.data;
  } catch (e) {
    const newCast = { ...cast, id: Date.now(), movieTitle: "" } as Cast;
    return newCast;
  }
};

export const deleteCast = async (id: number): Promise<void> => {
  try {
    await api.delete(`/casts/${id}`);
  } catch (error) {
    console.error("Error deleting cast:", error);
    throw error;
  }
};
