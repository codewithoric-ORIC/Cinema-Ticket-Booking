import api from '../api/axios';

export interface Booking {
    id: number;
    user: any;
    showTime: any;
    totalAmount: number;
    bookingStatus: string;
    bookingReference: string;
}

export interface Seat {
    id: number;
    seatNumber: string;
    rowChar: string;
    col: number;
    price: number;
    isBooked: boolean;
    isReserved: boolean;
}

export const saveBooking = async (showTimeId: number, seatIds: number[], totalAmount: number) => {
    const response = await api.post('/bookings', { showTimeId, seatIds, totalAmount });
    return response.data;
};

export const getSoldSeatsForShow = async (showTimeId: number): Promise<Seat[]> => {
    const response = await api.get(`/seats/showtime/${showTimeId}`);
    return response.data;
};

export const getBookings = async () => {
    const response = await api.get('/bookings');
    return response.data;
};

export const getBookingById = async (id: number) => {
    const bookings = await getBookings();
    return bookings.find((booking: Booking) => booking.id === id);
};

export const cancelBooking = async (id: number) => {
    const response = await api.put(`/bookings/${id}/status?status=CANCELLED`);
    return response.data;
};
