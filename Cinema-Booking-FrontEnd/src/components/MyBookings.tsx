import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { IoArrowBack, IoTicket, IoCalendarOutline, IoTimeOutline, IoCloseCircleOutline, IoCheckmarkCircleOutline } from "react-icons/io5";
import { getBookings, cancelBooking } from "../service/BookingService";

interface Booking {
    id: string;
    movie: {
        id: number;
        title: string;
    };
    date: string;
    day: string;
    time: string;
    seats: string[];
    totalPrice: number;
    bookingDate: string;
    status: 'confirmed' | 'cancelled';
}

function MyBookings() {
    const [bookings, setBookings] = useState<Booking[]>([]);

    useEffect(() => {
        // Load bookings from localStorage
        const loadedBookings = getBookings();
        setBookings(loadedBookings);
    }, []);

    const handleCancelBooking = (id: string) => {
        if (window.confirm('Are you sure you want to cancel this booking?')) {
            cancelBooking(id);
            // Refresh the bookings list
            setBookings(getBookings());
        }
    };

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    return (
        <div className="w-full min-h-screen bg-slate-100 overflow-x-hidden relative pt-24 pb-20">
            {/* Background Glows */}
            <div className="absolute top-1/4 left-[-5%] w-[500px] h-[500px] bg-purple-500/15 rounded-full blur-[140px] pointer-events-none"></div>
            <div className="absolute top-2/3 right-[-5%] w-[500px] h-[500px] bg-indigo-500/15 rounded-full blur-[140px] pointer-events-none"></div>

            <div className="relative z-10 max-w-6xl mx-auto px-6">
                <div className="flex items-center gap-4 mb-8">
                    <Link to="/" className="flex items-center gap-2 text-slate-500 hover:text-purple-600 font-bold text-sm transition-colors cursor-pointer group">
                        <IoArrowBack className="w-4 h-4 transform group-hover:-translate-x-1 transition-transform"></IoArrowBack>
                        <span>Back</span>
                    </Link>
                </div>

                <div className="mb-8 space-y-2">
                    <div className="inline-flex items-center px-4 py-1.5 rounded-full bg-purple-600/[0.08] border border-purple-500/20 shadow-sm backdrop-blur-md">
                        <span className="text-xs font-bold uppercase tracking-widest text-purple-700">My Bookings</span>
                    </div>
                    <h1 className="text-4xl font-black text-slate-800 tracking-tight leading-none">
                        Your Tickets
                    </h1>
                    <p className="text-slate-500 text-sm font-medium max-w-xl leading-relaxed">
                        View and manage all your movie ticket bookings.
                    </p>
                </div>

                {bookings.length === 0 ? (
                    // Empty State
                    <div className="w-full rounded-[2.5rem] bg-white/40 backdrop-blur-2xl p-12 text-center">
                        <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-purple-100 flex items-center justify-center">
                            <IoTicket className="w-12 h-12 text-purple-600"></IoTicket>
                        </div>
                        <h2 className="text-2xl font-black text-slate-800 mb-2">No Bookings Yet</h2>
                        <p className="text-slate-500 mb-8 max-w-md mx-auto">
                            You haven't booked any movie tickets yet. Start exploring movies to book your first show!
                        </p>
                        <Link
                            to="/movies"
                            className="group relative inline-flex h-12 px-8 rounded-full text-sm font-bold text-white
                                       bg-gradient-to-r from-purple-600 to-indigo-600
                                       shadow-[0_4px_12px_rgba(124,58,237,0.15),inset_0_1px_1px_rgba(255,255,255,0.3)]
                                       hover:scale-105 hover:shadow-[0_8px_20px_rgba(124,58,237,0.25)]
                                       active:scale-98
                                       transition-all duration-300 ease-out overflow-hidden cursor-pointer"
                        >
                            <span className="absolute inset-x-0 top-0 h-[40%] bg-gradient-to-b from-white/20 to-transparent rounded-t-full pointer-events-none"></span>
                            <span className="absolute -inset-full bg-gradient-to-r from-transparent via-white/20 to-transparent transform -skew-x-12 transition-all duration-1000 group-hover:left-full ease-out"></span>
                            <span className="relative z-10">Browse Movies</span>
                        </Link>
                    </div>
                ) : (
                    // Bookings List
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        {bookings.map((booking) => (
                            <div
                                key={booking.id}
                                className={`relative rounded-[2.5rem] p-6 backdrop-blur-xl border transition-all duration-300 ${
                                    booking.status === 'cancelled'
                                        ? 'bg-red-50/40 border-red-200/60 opacity-75'
                                        : 'bg-white/40 border-white/80 hover:shadow-lg'
                                }`}
                            >
                                {/* Status Badge */}
                                <div className="absolute top-4 right-4">
                                    <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold ${
                                        booking.status === 'cancelled'
                                            ? 'bg-red-100 text-red-700'
                                            : 'bg-green-100 text-green-700'
                                    }`}>
                                        {booking.status === 'cancelled' ? (
                                            <IoCloseCircleOutline className="w-3 h-3"></IoCloseCircleOutline>
                                        ) : (
                                            <IoCheckmarkCircleOutline className="w-3 h-3"></IoCheckmarkCircleOutline>
                                        )}
                                        {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                                    </span>
                                </div>

                                {/* Ticket Icon */}
                                <div className="w-16 h-16 mb-4 rounded-full bg-gradient-to-br from-purple-500/20 to-indigo-500/20 flex items-center justify-center">
                                    <IoTicket className="w-8 h-8 text-purple-600"></IoTicket>
                                </div>

                                {/* Movie Title */}
                                <h3 className="text-xl font-black text-slate-800 mb-3">{booking.movie.title}</h3>

                                {/* Booking Details */}
                                <div className="space-y-3 mb-6">
                                    <div className="flex items-center gap-2 text-sm">
                                        <IoCalendarOutline className="w-4 h-4 text-purple-600"></IoCalendarOutline>
                                        <span className="text-slate-500 font-semibold">Date:</span>
                                        <span className="text-slate-800 font-bold">{booking.day}, {booking.date}</span>
                                    </div>
                                    <div className="flex items-center gap-2 text-sm">
                                        <IoTimeOutline className="w-4 h-4 text-purple-600"></IoTimeOutline>
                                        <span className="text-slate-500 font-semibold">Time:</span>
                                        <span className="text-slate-800 font-bold">{booking.time}</span>
                                    </div>
                                    <div className="flex items-center gap-2 text-sm">
                                        <IoTicket className="w-4 h-4 text-purple-600"></IoTicket>
                                        <span className="text-slate-500 font-semibold">Seats:</span>
                                        <span className="text-slate-800 font-bold">{booking.seats.join(", ")}</span>
                                    </div>
                                </div>

                                {/* Price & Booking Date */}
                                <div className="flex justify-between items-center pt-4 border-t border-slate-200/60 mb-4">
                                    <div className="text-xs text-slate-500">
                                        Booked on {formatDate(booking.bookingDate)}
                                    </div>
                                    <div className="text-xl font-black text-purple-600">
                                        {booking.totalPrice.toLocaleString()} MMK
                                    </div>
                                </div>

                                {/* Actions */}
                                {booking.status === 'confirmed' && (
                                    <button
                                        onClick={() => handleCancelBooking(booking.id)}
                                        className="w-full h-10 rounded-full text-sm font-bold text-red-600
                                                   bg-red-50 border border-red-200
                                                   hover:bg-red-100 hover:border-red-300
                                                   transition-all duration-300 flex items-center justify-center gap-2"
                                    >
                                        <IoCloseCircleOutline className="w-4 h-4"></IoCloseCircleOutline>
                                        Cancel Booking
                                    </button>
                                )}
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}

export default MyBookings;
