import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { fetchAllMovies, deleteMovie } from "../service/AdminService";
import { type Movie } from "../../service/MovieService";
import { IoAddCircleOutline, IoTrashOutline } from "react-icons/io5";

function AdminListMovies() {
  const navigate = useNavigate();
  const [movies, setMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadMovies = async () => {
      try {
        const data = await fetchAllMovies();
        setMovies(data);
      } catch (e) {
        console.error("Failed to load movies:", e);
      } finally {
        setLoading(false);
      }
    };
    loadMovies();
  }, []);

  const handleDelete = async (id: number) => {
    if (!window.confirm("Are you sure you want to delete this movie?")) return;
    try {
      await deleteMovie(id);
      setMovies(movies.filter((movie) => movie.id !== id));
    } catch (e) {
      console.error("Failed to delete movie:", e);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <p className="text-slate-500 text-lg font-medium">Loading movies...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-800 tracking-tight">Manage Movies</h1>
          <p className="text-slate-500 mt-1 text-sm font-medium">Add, view, or delete movies from your cinema</p>
        </div>
        <button
          onClick={() => navigate("/admin/movies/add")}
          className="flex items-center gap-2 h-12 px-6 rounded-full font-bold text-white bg-gradient-to-r from-purple-600 to-indigo-600 shadow-[0_8px_24px_rgba(124,58,237,0.25),inset_0_1px_2px_rgba(255,255,255,0.3)] hover:scale-[1.02] transition-all duration-300 text-sm"
        >
          <IoAddCircleOutline className="w-5 h-5" />
          Add Movie
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {movies.map((movie) => (
          <div
            key={movie.id}
            className="rounded-2xl bg-white/60 backdrop-blur-xl border border-white/80 p-4 shadow-[0_8px_24px_rgba(0,0,0,0.04),inset_0_1px_2px_rgba(255,255,255,0.8)] hover:shadow-[0_16px_48px_-12px_rgba(124,58,237,0.15),inset_0_1px_2px_rgba(255,255,255,0.9)] transition-all duration-300 hover:-translate-y-1"
          >
            <div className="flex gap-4">
              <div className="flex-shrink-0 w-24">
                <div className="rounded-xl overflow-hidden border border-white/40 shadow-sm">
                  <img
                    src={movie.imageUrl}
                    alt={movie.title}
                    className="w-full aspect-[2/3] object-cover"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = "https://placehold.co/200x300/e2e8f0/64748b?text=No+Image";
                    }}
                  />
                </div>
              </div>
              <div className="flex-1 min-w-0 space-y-2.5">
                <div>
                  <h3 className="text-base font-bold text-slate-800 truncate">{movie.title}</h3>
                  <div className="flex items-center gap-1.5 mt-0.5">
                    <span className="px-2.5 py-0.5 rounded-full bg-purple-100/70 text-purple-700 text-[10px] font-bold">{movie.genre}</span>
                    <span className="text-[10px] text-slate-500 font-medium">{movie.year}</span>
                  </div>
                </div>
                <p className="text-xs text-slate-600 line-clamp-3">{movie.description}</p>
                <div className="flex items-center justify-between pt-1">
                  <div className="flex items-center gap-1.5">
                    <span className="text-xs font-bold text-slate-700">{movie.rating.toFixed(1)}</span>
                    <span className="text-[10px] text-slate-500 font-medium">{movie.duration} min</span>
                  </div>
                  <button
                    onClick={() => handleDelete(movie.id)}
                    className="p-2 text-red-600 hover:bg-red-500/10 rounded-lg transition-all duration-300"
                  >
                    <IoTrashOutline className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
      {movies.length === 0 && (
        <div className="text-center py-12 rounded-2xl bg-white/40 backdrop-blur-xl border border-white/80">
          <p className="text-slate-600 text-sm font-medium">No movies available. Add one to get started!</p>
        </div>
      )}
    </div>
  );
}

export default AdminListMovies;
