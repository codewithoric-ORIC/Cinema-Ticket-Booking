import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import {
  IoArrowBack,
  IoTicket,
  IoCalendarOutline,
  IoTimeOutline,
  IoLocationOutline,
} from "react-icons/io5";
import { fetchUserBookings, type ApiBooking } from "../service/BookingService";
import { isLoggedIn } from "../auth/service/AuthService";

function MyBookings() {
  const [bookings, setBookings] = useState<ApiBooking[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadBookings = async () => {
      setLoading(true);
      if (isLoggedIn()) {
        try {
          const data = await fetchUserBookings();
          setBookings(data);
        } catch (e) {
          console.error("Failed to load API bookings", e);
        }
      }
      setLoading(false);
    };

    loadBookings();
  }, []);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (loading) {
    return (
      <div className="w-full min-h-screen bg-slate-100 overflow-x-hidden relative pt-24 pb-20">
        <div className="flex items-center justify-center pt-20">
          <p className="text-slate-500 font-medium">Loading bookings...</p>
        </div>
      </div>
    );
  }

  if (!isLoggedIn()) {
    return (
      <div className="w-full min-h-screen bg-slate-100 overflow-x-hidden relative pt-24 pb-20">
        <div className="relative z-10 max-w-6xl mx-auto px-6 text-center">
          <div className="w-full rounded-[2.5rem] bg-white/40 backdrop-blur-2xl p-12">
            <h2 className="text-2xl font-black text-slate-800 mb-2">Please Log In</h2>
            <p className="text-slate-500 mb-8 max-w-md mx-auto">
              You need to be logged in to view your bookings.
            </p>
            <Link
              to="/login"
              className="group relative inline-flex h-12 px-8 rounded-full text-sm font-bold text-white
                                 bg-gradient-to-r from-purple-600 to-indigo-600
                                 shadow-[0_4px_12px_rgba(124,58,237,0.15),inset_0_1px_1px_rgba(255,255,255,0.3)]
                                 hover:scale-105 hover:shadow-[0_8px_20px_rgba(124,58,237,0.25)]
                                 active:scale-98
                                 transition-all duration-300 ease-out overflow-hidden cursor-pointer"
            >
              <span className="relative z-10">Log In</span>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full min-h-screen bg-slate-100 overflow-x-hidden relative pt-24 pb-20">
      {/* Background Glows */}
      <div className="absolute top-1/4 left-[-5%] w-[500px] h-[500px] bg-purple-500/15 rounded-full blur-[140px] pointer-events-none"></div>
      <div className="absolute top-2/3 right-[-5%] w-[500px] h-[500px] bg-indigo-500/15 rounded-full blur-[140px] pointer-events-none"></div>

      <div className="relative z-10 max-w-6xl mx-auto px-6">
        <div className="flex items-center gap-4 mb-8">
          <Link
            to="/"
            className="flex items-center gap-2 text-slate-500 hover:text-purple-600 font-bold text-sm transition-colors cursor-pointer group"
          >
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
              <span className="relative z-10">Browse Movies</span>
            </Link>
          </div>
        ) : (
          // Bookings List
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {bookings.map((booking) => {
              const status = booking.bookingStatus.toLowerCase();
              const movie = booking.showTime.movie;
              const theater = booking.showTime.theater;
              const date = booking.showTime.showDate;
              const time = booking.showTime.showTime;
              const seats = booking.seats.map((s) => `${s.rowChar}${s.col}`);
              const totalPrice = booking.totalAmount;
              const bookingReference = booking.bookingReference;
              const isCancelled = status === "cancelled";

              return (
                <div
                  key={booking.id}
                  className={`relative rounded-[2.5rem] p-6 backdrop-blur-xl border transition-all duration-300 ${
                    isCancelled
                      ? "bg-red-50/40 border-red-200/60 opacity-75"
                      : "bg-white/40 border-white/80 hover:shadow-lg"
                  }`}
                >
                  {/* Status Badge */}
                  <div className="absolute top-4 right-4">
                    <span
                      className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold ${
                        isCancelled
                          ? "bg-red-100 text-red-700"
                          : "bg-green-100 text-green-700"
                      }`}
                    >
                      {status.charAt(0).toUpperCase() + status.slice(1)}
                    </span>
                  </div>

                  {/* Ticket Icon */}
                  <div className="w-16 h-16 mb-4 rounded-full bg-gradient-to-br from-purple-500/20 to-indigo-500/20 flex items-center justify-center">
                    <IoTicket className="w-8 h-8 text-purple-600"></IoTicket>
                  </div>

                  {/* Movie Title */}
                  <h3 className="text-xl font-black text-slate-800 mb-3">
                    {movie?.title || "Unknown Movie"}
                  </h3>

                  {/* Booking Details */}
                  <div className="space-y-3 mb-6">
                    {theater && (
                      <div className="flex items-center gap-2 text-sm">
                        <IoLocationOutline className="w-4 h-4 text-purple-600"></IoLocationOutline>
                        <span className="text-slate-500 font-semibold">Theater:</span>
                        <span className="text-slate-800 font-bold">
                          {theater.name}, {theater.location}
                        </span>
                      </div>
                    )}
                    <div className="flex items-center gap-2 text-sm">
                      <IoCalendarOutline className="w-4 h-4 text-purple-600"></IoCalendarOutline>
                      <span className="text-slate-500 font-semibold">Date:</span>
                      <span className="text-slate-800 font-bold">{date}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <IoTimeOutline className="w-4 h-4 text-purple-600"></IoTimeOutline>
                      <span className="text-slate-500 font-semibold">Time:</span>
                      <span className="text-slate-800 font-bold">{time}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <IoTicket className="w-4 h-4 text-purple-600"></IoTicket>
                      <span className="text-slate-500 font-semibold">Seats:</span>
                      <span className="text-slate-800 font-bold">{seats.join(", ")}</span>
                    </div>
                    {bookingReference && (
                      <div className="flex items-center gap-2 text-sm">
                        <IoTicket className="w-4 h-4 text-purple-600"></IoTicket>
                        <span className="text-slate-500 font-semibold">Booking Ref:</span>
                        <span className="text-slate-800 font-bold">{bookingReference}</span>
                      </div>
                    )}
                  </div>

                  {/* Price & Booking Date */}
                  <div className="flex justify-end items-center pt-4 border-t border-slate-200/60">
                    <div className="text-xl font-black text-purple-600">
                      {totalPrice.toLocaleString()} MMK
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

export default MyBookings;
