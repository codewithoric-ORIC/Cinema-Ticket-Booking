import { type Movie, type Trailer } from "./MovieService";
import type { Theater, Showtime, Booking } from "../admin/service/AdminService";

const defaultMovies: Movie[] = [
  {
    id: 1,
    title: "Inception",
    description: "A thief who steals corporate secrets through dream-sharing technology is given the inverse task of planting an idea into the mind of a C.E.O.",
    rating: 8.8,
    imageUrl: "https://upload.wikimedia.org/wikipedia/en/2/2e/Inception_%282010%29_theatrical_release_poster.jpg",
    duration: 148,
    genre: "Sci-Fi",
    year: 2010,
    releaseDate: "2010-07-16",
    isActive: true,
    cast: [],
    trailers: []
  },
  {
    id: 2,
    title: "The Dark Knight",
    description: "When the menace known as the Joker wreaks havoc and chaos on the people of Gotham, Batman must accept one of the greatest psychological and physical tests of his ability to fight injustice.",
    rating: 9.0,
    imageUrl: "https://upload.wikimedia.org/wikipedia/en/8/8a/Dark_Knight.jpg",
    duration: 152,
    genre: "Action",
    year: 2008,
    releaseDate: "2008-07-18",
    isActive: true,
    cast: [],
    trailers: []
  },
  {
    id: 3,
    title: "Interstellar",
    description: "A team of explorers travel through a wormhole in space in an attempt to ensure humanity's survival.",
    rating: 8.6,
    imageUrl: "https://upload.wikimedia.org/wikipedia/en/b/bc/Interstellar_film_poster.jpg",
    duration: 169,
    genre: "Sci-Fi",
    year: 2014,
    releaseDate: "2026-12-25",
    isActive: true,
    cast: [],
    trailers: []
  }
];

const defaultTrailers: Trailer[] = [
  {
    id: 1,
    title: "Inception Official Trailer",
    duration: "2:28",
    youtubeId: "YoHD9XEInc0",
    thumbnailUrl: "https://img.youtube.com/vi/YoHD9XEInc0/mqdefault.jpg",
    movie: defaultMovies[0]
  }
];

const defaultTheaters: Theater[] = [
  { id: 1, name: "Grand Cinema", location: "Downtown", totalSeats: 100 },
  { id: 2, name: "Cineplex", location: "Mall", totalSeats: 150 }
];

const defaultShowtimes: Showtime[] = [
  {
    id: 1,
    movie: defaultMovies[0],
    theater: defaultTheaters[0],
    showDate: "2026-07-16",
    showTime: "18:00",
    availableSeats: 50
  },
  {
    id: 2,
    movie: defaultMovies[1],
    theater: defaultTheaters[1],
    showDate: "2026-07-16",
    showTime: "20:00",
    availableSeats: 75
  }
];

const defaultBookings: Booking[] = [
  {
    id: 1,
    user: { username: "john_doe" },
    showTime: defaultShowtimes[0],
    totalAmount: 25.0,
    bookingStatus: "CONFIRMED",
    bookingReference: "BOOK-001"
  }
];

const STORAGE_KEYS = {
  MOVIES: "mockMovies",
  TRAILERS: "mockTrailers",
  THEATERS: "mockTheaters",
  SHOWTIMES: "mockShowtimes",
  BOOKINGS: "mockBookings"
};

// Helper functions to get/set data from localStorage
function getFromStorage<T>(key: string, defaultValue: T): T {
  try {
    const stored = localStorage.getItem(key);
    return stored ? JSON.parse(stored) : defaultValue;
  } catch {
    return defaultValue;
  }
}

function saveToStorage<T>(key: string, value: T): void {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    console.error("Failed to save to localStorage");
  }
}

// Initialize data in localStorage if not present
export function initMockData(): void {
  if (!localStorage.getItem(STORAGE_KEYS.MOVIES)) {
    saveToStorage(STORAGE_KEYS.MOVIES, defaultMovies);
  }
  if (!localStorage.getItem(STORAGE_KEYS.TRAILERS)) {
    saveToStorage(STORAGE_KEYS.TRAILERS, defaultTrailers);
  }
  if (!localStorage.getItem(STORAGE_KEYS.THEATERS)) {
    saveToStorage(STORAGE_KEYS.THEATERS, defaultTheaters);
  }
  if (!localStorage.getItem(STORAGE_KEYS.SHOWTIMES)) {
    saveToStorage(STORAGE_KEYS.SHOWTIMES, defaultShowtimes);
  }
  if (!localStorage.getItem(STORAGE_KEYS.BOOKINGS)) {
    saveToStorage(STORAGE_KEYS.BOOKINGS, defaultBookings);
  }
}

// Movie functions
export function getMockMovies(): Movie[] {
  return getFromStorage(STORAGE_KEYS.MOVIES, defaultMovies);
}
export function saveMockMovies(movies: Movie[]): void {
  saveToStorage(STORAGE_KEYS.MOVIES, movies);
}

// Trailer functions
export function getMockTrailers(): Trailer[] {
  return getFromStorage(STORAGE_KEYS.TRAILERS, defaultTrailers);
}
export function saveMockTrailers(trailers: Trailer[]): void {
  saveToStorage(STORAGE_KEYS.TRAILERS, trailers);
}

// Theater functions
export function getMockTheaters(): Theater[] {
  return getFromStorage(STORAGE_KEYS.THEATERS, defaultTheaters);
}
export function saveMockTheaters(theaters: Theater[]): void {
  saveToStorage(STORAGE_KEYS.THEATERS, theaters);
}

// Showtime functions
export function getMockShowtimes(): Showtime[] {
  return getFromStorage(STORAGE_KEYS.SHOWTIMES, defaultShowtimes);
}
export function saveMockShowtimes(showtimes: Showtime[]): void {
  saveToStorage(STORAGE_KEYS.SHOWTIMES, showtimes);
}

// Booking functions
export function getMockBookings(): Booking[] {
  return getFromStorage(STORAGE_KEYS.BOOKINGS, defaultBookings);
}
export function saveMockBookings(bookings: Booking[]): void {
  saveToStorage(STORAGE_KEYS.BOOKINGS, bookings);
}
