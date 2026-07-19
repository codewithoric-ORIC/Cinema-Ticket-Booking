import { useState, useEffect } from "react";
import { fetchAllBookings, updateBookingStatus, type Booking, type BookingSeat } from "../service/AdminService";

function AdminListBookings() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadBookings = async () => {
      try {
        const data = await fetchAllBookings();
        setBookings(data);
      } catch (e) {
        console.error("Failed to load bookings", e);
      } finally {
        setLoading(false);
      }
    };
    loadBookings();
  }, []);

  const handleStatusChange = async (id: number, status: string) => {
    try {
      const updatedBooking = await updateBookingStatus(id, status);
      setBookings(
        bookings.map((booking) => (booking.id === id ? updatedBooking : booking))
      );
    } catch (e) {
      console.error("Failed to update booking status", e);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "CONFIRMED":
        return "text-green-700 bg-green-50";
      case "CANCELLED":
        return "text-red-700 bg-red-50";
      default:
        return "text-yellow-700 bg-yellow-50";
    }
  };

  const getSeatNumbers = (seats: BookingSeat[] = []) => {
    return seats.map(s => `${s.rowChar}${s.col}`).join(", ");
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <p className="text-slate-500">Loading bookings...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-extrabold text-slate-800 tracking-tight">List Bookings</h1>
        <p className="text-slate-500 mt-1 text-sm font-medium">Manage all customer bookings.</p>
      </div>

      <div className="rounded-2xl bg-white/60 backdrop-blur-xl border border-white/80 shadow-[0_8px_24px_rgba(0,0,0,0.04),inset_0_1px_2px_rgba(255,255,255,0.8)] overflow-x-auto">
        <table className="w-full min-w-[800px]">
          <thead className="bg-white/50 border-b border-white/50">
            <tr>
              <th className="text-left px-6 py-4 text-xs font-bold text-slate-700">ID</th>
              <th className="text-left px-6 py-4 text-xs font-bold text-slate-700">Reference</th>
              <th className="text-left px-6 py-4 text-xs font-bold text-slate-700">Movie</th>
              <th className="text-left px-6 py-4 text-xs font-bold text-slate-700">Theater</th>
              <th className="text-left px-6 py-4 text-xs font-bold text-slate-700">Show Time</th>
              <th className="text-left px-6 py-4 text-xs font-bold text-slate-700">Seats</th>
              <th className="text-left px-6 py-4 text-xs font-bold text-slate-700">Amount</th>
              <th className="text-left px-6 py-4 text-xs font-bold text-slate-700">Status</th>
              <th className="text-left px-6 py-4 text-xs font-bold text-slate-700">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/40">
            {bookings.map((booking) => (
              <tr key={booking.id} className="hover:bg-white/40 transition-colors duration-300">
                <td className="px-6 py-4 text-xs text-slate-700">{booking.id}</td>
                <td className="px-6 py-4 text-xs font-semibold text-slate-800">{booking.bookingReference}</td>
                <td className="px-6 py-4 text-xs text-slate-700">{booking.showTime?.movie?.title || "Unknown Movie"}</td>
                <td className="px-6 py-4 text-xs text-slate-700">{booking.showTime?.theater?.name || "Unknown"}</td>
                <td className="px-6 py-4 text-xs text-slate-700">
                  {booking.showTime?.showDate} {booking.showTime?.showTime}
                </td>
                <td className="px-6 py-4 text-xs text-slate-700">{getSeatNumbers(booking.seats)}</td>
                <td className="px-6 py-4 text-xs text-slate-700">{booking.totalAmount.toLocaleString()} MMK</td>
                <td className="px-6 py-4">
                  <span className={`px-3 py-1 rounded-full text-[10px] font-bold ${getStatusColor(booking.bookingStatus)}`}>
                    {booking.bookingStatus}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <select
                    value={booking.bookingStatus}
                    onChange={(e) => handleStatusChange(booking.id, e.target.value)}
                    className="px-3 py-2 rounded-lg border border-slate-300 text-xs bg-white/70 focus:outline-none focus:border-purple-500 transition-all duration-300"
                  >
                    <option value="PENDING">PENDING</option>
                    <option value="CONFIRMED">CONFIRMED</option>
                    <option value="CANCELLED">CANCELLED</option>
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {bookings.length === 0 && (
          <div className="p-12 text-center">
            <p className="text-slate-600 text-sm font-medium">No bookings available yet.</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default AdminListBookings;
