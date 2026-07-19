import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { fetchAllMovies, fetchAllTheaters, createShowtime } from "../service/AdminService";
import { type Movie } from "../../service/MovieService";
import { type Theater } from "../service/AdminService";
import AdminBadge from "../components/AdminBadge";

function AdminAddShow() {
  const navigate = useNavigate();
  const [movies, setMovies] = useState<Movie[]>([]);
  const [theaters, setTheaters] = useState<Theater[]>([]);
  const [selectedMovie, setSelectedMovie] = useState<string>("");
  const [selectedTheater, setSelectedTheater] = useState<string>("");
  const [showDate, setShowDate] = useState<string>("");
  const [showTime, setShowTime] = useState<string>("");
  const [availableSeats, setAvailableSeats] = useState<string>("100");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const loadData = async () => {
      try {
        const [moviesData, theatersData] = await Promise.all([
          fetchAllMovies(),
          fetchAllTheaters(),
        ]);
        setMovies(moviesData);
        setTheaters(theatersData);
      } catch (e) {
        console.error("Failed to load data", e);
      }
    };
    loadData();
  }, []);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!selectedMovie || !selectedTheater || !showDate || !showTime) return;
    setLoading(true);
    try {
      await createShowtime({
        movieId: parseInt(selectedMovie),
        theaterId: parseInt(selectedTheater),
        showDate,
        showTime,
        availableSeats: parseInt(availableSeats),
      });
      navigate("/admin/shows");
    } catch (e) {
      console.error("Failed to create showtime", e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-xl mx-auto space-y-6">
      <div>
        <AdminBadge text="Add Show" />
        <h1 className="text-2xl font-extrabold text-slate-800 tracking-tight mt-3">Add New Show</h1>
        <p className="text-slate-500 mt-1 text-sm font-medium">Create a new showtime for a movie.</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5 rounded-2xl bg-white/60 backdrop-blur-xl border border-white/80 p-6 shadow-[0_8px_24px_rgba(0,0,0,0.04),inset_0_1px_2px_rgba(255,255,255,0.8)]">
        <div>
          <label className="block text-xs font-bold text-slate-700 mb-2">Movie</label>
          <select
            value={selectedMovie}
            onChange={(e) => setSelectedMovie(e.target.value)}
            className="w-full px-4 py-3 rounded-xl border border-slate-300 bg-white/70 focus:border-purple-500 focus:outline-none transition-all duration-300 text-sm"
            required
          >
            <option value="">Select movie...</option>
            {movies.map((movie) => (
              <option key={movie.id} value={movie.id.toString()}>
                {movie.title}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-700 mb-2">Theater</label>
          <select
            value={selectedTheater}
            onChange={(e) => setSelectedTheater(e.target.value)}
            className="w-full px-4 py-3 rounded-xl border border-slate-300 bg-white/70 focus:border-purple-500 focus:outline-none transition-all duration-300 text-sm"
            required
          >
            <option value="">Select theater...</option>
            {theaters.map((theater) => (
              <option key={theater.id} value={theater.id.toString()}>
                {theater.name} ({theater.location})
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-700 mb-2">Date</label>
          <input
            type="date"
            value={showDate}
            onChange={(e) => setShowDate(e.target.value)}
            className="w-full px-4 py-3 rounded-xl border border-slate-300 bg-white/70 focus:border-purple-500 focus:outline-none transition-all duration-300 text-sm"
            required
          />
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-700 mb-2">Time</label>
          <input
            type="time"
            value={showTime}
            onChange={(e) => setShowTime(e.target.value)}
            className="w-full px-4 py-3 rounded-xl border border-slate-300 bg-white/70 focus:border-purple-500 focus:outline-none transition-all duration-300 text-sm"
            required
          />
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-700 mb-2">Available Seats</label>
          <input
            type="number"
            value={availableSeats}
            onChange={(e) => setAvailableSeats(e.target.value)}
            className="w-full px-4 py-3 rounded-xl border border-slate-300 bg-white/70 focus:border-purple-500 focus:outline-none transition-all duration-300 text-sm"
            min="1"
            required
          />
        </div>

        <div className="flex items-center gap-3 pt-1">
          <button
            type="submit"
            disabled={loading}
            className="flex-1 h-12 rounded-full font-bold text-white bg-gradient-to-r from-purple-600 to-indigo-600 shadow-[0_8px_24px_rgba(124,58,237,0.25),inset_0_1px_2px_rgba(255,255,255,0.3)] hover:scale-[1.02] transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed text-sm"
          >
            {loading ? "Adding..." : "Add Show"}
          </button>
          <button
            type="button"
            onClick={() => navigate("/admin/shows")}
            className="h-12 px-6 rounded-full font-bold text-slate-700 bg-white/70 border border-white/80 shadow-[0_4px_12px_rgba(0,0,0,0.03),inset_0_1px_2px_rgba(255,255,255,0.8)] hover:bg-white/90 transition-all duration-300 text-sm"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}

export default AdminAddShow;
