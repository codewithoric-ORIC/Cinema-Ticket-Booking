import api from '../api/axios';

export interface APISeat {
    id: number;
    seatNumber: string;
    rowChar: string;
    col: number;
    price: number;
    isBooked: boolean;
    isReserved: boolean;
}

export interface Theater {
    id: number;
    name: string;
    location: string;
    totalSeats: number;
}

export interface Movie {
    id: number;
    title: string;
}

export interface BookingSeat {
  id: number;
  seatNumber: string;
  rowChar: string;
  col: number;
  price: number;
}

export interface ShowTime {
  id: number;
  theater: Theater;
  movie?: Movie;
  showDate: string;
  showTime: string;
  availableSeats: number;
  seats?: APISeat[];
}

export interface ApiBooking {
  id: number;
  bookingReference: string;
  totalAmount: number;
  bookingStatus: string;
  showTime: ShowTime;
  seats: BookingSeat[];
}

export interface LocalBooking {
  id: string;
  movie: Movie;
  date: string;
  day: string;
  time: string;
  theater?: Theater;
  seats: string[];
  totalPrice: number;
  bookingDate: string;
  status: 'confirmed' | 'cancelled';
}

const LOCAL_BOOKINGS_KEY = 'localBookings';

function getLocalBookings(): LocalBooking[] {
    try {
        const stored = localStorage.getItem(LOCAL_BOOKINGS_KEY);
        return stored ? JSON.parse(stored) : [];
    } catch {
        return [];
    }
}

function saveLocalBookings(bookings: LocalBooking[]): void {
    try {
        localStorage.setItem(LOCAL_BOOKINGS_KEY, JSON.stringify(bookings));
    } catch {
        console.error("Failed to save local bookings");
    }
}

export const saveBooking = (bookingData: { 
    movie: Movie; 
    date: string; 
    day: string; 
    time: string;
    theater?: Theater; 
    seats: string[]; 
    totalPrice: number 
}) => {
    const bookings = getLocalBookings();
    const newBooking: LocalBooking = {
        id: Date.now().toString(),
        ...bookingData,
        bookingDate: new Date().toISOString(),
        status: 'confirmed'
    };
    bookings.unshift(newBooking);
    saveLocalBookings(bookings);
    return newBooking;
};

export const saveAPIBooking = async (showTimeId: number, seatIds: number[], totalAmount: number) => {
    console.log("saveAPIBooking called with:", { showTimeId, seatIds, totalAmount });
    const response = await api.post('/bookings', { showTimeId, seatIds, totalAmount });
    console.log("saveAPIBooking response:", response.data);
    return response.data;
};

export const getSoldSeatsForShow = async (showTimeId: number): Promise<APISeat[]> => {
    const response = await api.get(`/seats/showtime/${showTimeId}`);
    return response.data;
};

export const fetchUserBookings = async (): Promise<ApiBooking[]> => {
  const response = await api.get('/bookings/user');
  return response.data;
};

export const getBookings = () => {
  return getLocalBookings();
};

export const getBookingById = (id: string) => {
    const bookings = getLocalBookings();
    return bookings.find((booking: LocalBooking) => booking.id === id);
};

export const cancelBooking = (id: string) => {
    const bookings = getLocalBookings();
    const updatedBookings = bookings.map(booking => 
        booking.id === id ? { ...booking, status: 'cancelled' as const } : booking
    );
    saveLocalBookings(updatedBookings);
};
