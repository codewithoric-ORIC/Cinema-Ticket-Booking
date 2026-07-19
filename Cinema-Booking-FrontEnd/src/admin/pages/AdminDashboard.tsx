import { useEffect, useState } from "react";
import { fetchAllMovies, fetchAllShowtimes, fetchAllBookings } from "../service/AdminService";
import { fetchCurrentMovies, type Movie } from "../../service/MovieService";
import AdminBadge from "../components/AdminBadge";

function AdminDashboard() {
  const [movieCount, setMovieCount] = useState(0);
  const [showCount, setShowCount] = useState(0);
  const [bookingCount, setBookingCount] = useState(0);
  const [currentMovies, setCurrentMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        const [movies, shows, bookings, currentMoviesData] = await Promise.all([
          fetchAllMovies(),
          fetchAllShowtimes(),
          fetchAllBookings(),
          fetchCurrentMovies(),
        ]);
        setMovieCount(movies.length);
        setShowCount(shows.length);
        setBookingCount(bookings.length);
        setCurrentMovies(currentMoviesData);
      } catch (e) {
        console.error("Failed to load dashboard data", e);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <p className="text-slate-500">Loading dashboard...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <AdminBadge text="Admin Dashboard" />
          <h1 className="text-2xl font-extrabold text-slate-800 tracking-tight mt-3">Dashboard</h1>
          <p className="text-slate-500 mt-1 text-sm font-medium">Welcome back! Here's what's happening.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3  gap-5">
        <div className="rounded-2xl bg-white/60 backdrop-blur-xl border border-white/80 p-6 shadow-[0_8px_24px_rgba(0,0,0,0.04),inset_0_1px_2px_rgba(255,255,255,0.8)] hover:shadow-[0_16px_48px_-12px_rgba(124,58,237,0.15),inset_0_1px_2px_rgba(255,255,255,0.9)] transition-all duration-300 hover:-translate-y-1">
          <div className="text-3xl font-extrabold bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent">
            {movieCount}
          </div>
          <div className="text-xs font-semibold text-slate-600 mt-2 tracking-wide">Total Movies</div>
        </div>

        <div className="rounded-2xl bg-white/60 backdrop-blur-xl border border-white/80 p-6 shadow-[0_8px_24px_rgba(0,0,0,0.04),inset_0_1px_2px_rgba(255,255,255,0.8)] hover:shadow-[0_16px_48px_-12px_rgba(124,58,237,0.15),inset_0_1px_2px_rgba(255,255,255,0.9)] transition-all duration-300 hover:-translate-y-1">
          <div className="text-3xl font-extrabold bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent">
            {showCount}
          </div>
          <div className="text-xs font-semibold text-slate-600 mt-2 tracking-wide">Total Shows</div>
        </div>

        <div className="rounded-2xl bg-white/60 backdrop-blur-xl border border-white/80 p-6 shadow-[0_8px_24px_rgba(0,0,0,0.04),inset_0_1px_2px_rgba(255,255,255,0.8)] hover:shadow-[0_16px_48px_-12px_rgba(124,58,237,0.15),inset_0_1px_2px_rgba(255,255,255,0.9)] transition-all duration-300 hover:-translate-y-1">
          <div className="text-3xl font-extrabold bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent">
            {bookingCount}
          </div>
          <div className="text-xs font-semibold text-slate-600 mt-2 tracking-wide">Total Bookings</div>
        </div>
      </div>

      {/* Current Movies Section with Table */}
      {currentMovies.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-extrabold text-slate-800 tracking-tight">Now Showing</h2>
          </div>

          <div className="rounded-2xl bg-white/40 backdrop-blur-2xl border border-white/80 p-5 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-white/60">
                    <th className="text-left py-3 px-4 text-xs font-bold text-slate-600 uppercase tracking-wider">Movie</th>
                    <th className="text-left py-3 px-4 text-xs font-bold text-slate-600 uppercase tracking-wider">Genre</th>
                    <th className="text-left py-3 px-4 text-xs font-bold text-slate-600 uppercase tracking-wider">Rating</th>
                    <th className="text-left py-3 px-4 text-xs font-bold text-slate-600 uppercase tracking-wider">Duration</th>
                    <th className="text-left py-3 px-4 text-xs font-bold text-slate-600 uppercase tracking-wider">Release Date</th>
                  </tr>
                </thead>
                <tbody>
                  {currentMovies.map((movie) => (
                    <tr key={movie.id} className="border-b border-white/40 hover:bg-white/30 transition-colors">
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-3">
                          <img
                            src={movie.imageUrl}
                            alt={movie.title}
                            className="w-12 h-16 rounded-lg object-cover"
                            onError={(e) => {
                              (e.target as HTMLImageElement).src = "https://placehold.co/48x64/e2e8f0/64748b?text=No+Image";
                            }}
                          />
                          <div>
                            <h3 className="text-sm font-bold text-slate-800">{movie.title}</h3>
                            <p className="text-xs text-slate-500 line-clamp-1 max-w-xs">{movie.description}</p>
                          </div>
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <span className="px-2.5 py-1 rounded-full bg-purple-100/70 text-purple-700 text-xs font-bold">
                          {movie.genre}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-1">
                          <span className="text-xs font-bold text-amber-700">⭐ {movie.rating.toFixed(1)}</span>
                        </div>
                      </td>
                      <td className="py-3 px-4 text-sm text-slate-600">{movie.duration} min</td>
                      <td className="py-3 px-4 text-sm text-slate-600">
                        {new Date(movie.releaseDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default AdminDashboard;
