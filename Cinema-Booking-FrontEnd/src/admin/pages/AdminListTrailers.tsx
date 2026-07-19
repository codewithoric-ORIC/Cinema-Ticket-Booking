import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { fetchAllTrailers, deleteTrailer } from "../service/AdminService";
import { type Trailer } from "../../service/MovieService";
import { IoAddCircleOutline, IoTrashOutline, IoPlayCircleOutline } from "react-icons/io5";
import AdminBadge from "../components/AdminBadge.tsx";

function AdminListTrailers() {
  const navigate = useNavigate();
  const [trailers, setTrailers] = useState<Trailer[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadTrailers = async () => {
      try {
        const data = await fetchAllTrailers();
        setTrailers(data);
      } catch (e) {
        console.error("Failed to load trailers:", e);
      } finally {
        setLoading(false);
      }
    };
    loadTrailers();
  }, []);

  const handleDelete = async (id: number) => {
    if (!window.confirm("Are you sure you want to delete this trailer?")) return;
    try {
      await deleteTrailer(id);
      setTrailers(trailers.filter((trailer) => trailer.id !== id));
    } catch (e) {
      console.error("Failed to delete trailer:", e);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <p className="text-slate-500 text-lg font-medium">Loading trailers...</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <AdminBadge text="Movie Trailers" />
          <h1 className="text-3xl font-extrabold text-slate-800 tracking-tight">Manage Trailers</h1>
          <p className="text-slate-500 mt-2 font-medium">Add, view, or delete movie trailers</p>
        </div>
        <button
          onClick={() => navigate("/admin/trailers/add")}
          className="flex items-center gap-2 h-14 px-8 rounded-full font-bold text-white bg-gradient-to-r from-purple-600 to-indigo-600 shadow-[0_8px_24px_rgba(124,58,237,0.25),inset_0_1px_2px_rgba(255,255,255,0.3)] hover:scale-[1.02] transition-all duration-300"
        >
          <IoAddCircleOutline className="w-6 h-6" />
          Add Trailer
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {trailers.map((trailer) => (
          <div
            key={trailer.id}
            className="rounded-[2rem] bg-white/60 backdrop-blur-xl border border-white/80 p-6 shadow-[0_8px_24px_rgba(0,0,0,0.04),inset_0_1px_2px_rgba(255,255,255,0.8)] hover:shadow-[0_16px_48px_-12px_rgba(124,58,237,0.15),inset_0_1px_2px_rgba(255,255,255,0.9)] transition-all duration-300 hover:-translate-y-1"
          >
            <div className="rounded-[1.25rem] overflow-hidden border border-white/40 shadow-sm mb-5 relative">
              <img
                src={trailer.thumbnailUrl}
                alt={trailer.title}
                className="w-full aspect-video object-cover"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = "https://placehold.co/480x270/e2e8f0/64748b?text=No+Thumbnail";
                }}
              />
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-16 h-16 rounded-full bg-white/80 backdrop-blur flex items-center justify-center shadow-lg">
                  <IoPlayCircleOutline className="w-10 h-10 text-purple-600" />
                </div>
              </div>
            </div>
            <div className="space-y-3">
              <div>
                <h3 className="text-lg font-bold text-slate-800 truncate">{trailer.title}</h3>
                {trailer.movie && (
                  <p className="text-sm text-slate-500 font-medium mt-1">{trailer.movie.title}</p>
                )}
              </div>
              <div className="flex items-center justify-between pt-2">
                <span className="px-3 py-1 rounded-full bg-slate-100/80 text-slate-600 text-xs font-bold">{trailer.duration}</span>
                <button
                  onClick={() => handleDelete(trailer.id)}
                  className="p-2.5 text-red-600 hover:bg-red-500/10 rounded-xl transition-all duration-300"
                >
                  <IoTrashOutline className="w-6 h-6" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
      {trailers.length === 0 && (
        <div className="text-center py-16 rounded-[2rem] bg-white/40 backdrop-blur-xl border border-white/80">
          <p className="text-slate-600 text-lg font-medium">No trailers available. Add one to get started!</p>
        </div>
      )}
    </div>
  );
}

export default AdminListTrailers;
