import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { fetchAllShowtimes, deleteShowtime } from "../service/AdminService";
import { type Showtime } from "../service/AdminService";
import { IoAddCircleOutline, IoTrashOutline } from "react-icons/io5";

function AdminListShows() {
  const navigate = useNavigate();
  const [shows, setShows] = useState<Showtime[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadShows = async () => {
      try {
        const data = await fetchAllShowtimes();
        setShows(data);
      } catch (e) {
        console.error("Failed to load shows", e);
      } finally {
        setLoading(false);
      }
    };
    loadShows();
  }, []);

  const handleDelete = async (id: number) => {
    if (!window.confirm("Are you sure you want to delete this show?")) return;
    try {
      await deleteShowtime(id);
      setShows(shows.filter((show) => show.id !== id));
    } catch (e) {
      console.error("Failed to delete show", e);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <p className="text-slate-500">Loading shows...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-800 tracking-tight">List Shows</h1>
          <p className="text-slate-500 mt-1 text-sm font-medium">Manage all your showtimes.</p>
        </div>
        <button
          onClick={() => navigate("/admin/shows/add")}
          className="flex items-center gap-2 h-12 px-6 rounded-full font-bold text-white bg-gradient-to-r from-purple-600 to-indigo-600 shadow-[0_8px_24px_rgba(124,58,237,0.25),inset_0_1px_2px_rgba(255,255,255,0.3)] hover:scale-[1.02] transition-all duration-300 text-sm"
        >
          <IoAddCircleOutline className="w-5 h-5" />
          Add Show
        </button>
      </div>

      <div className="rounded-2xl bg-white/60 backdrop-blur-xl border border-white/80 shadow-[0_8px_24px_rgba(0,0,0,0.04),inset_0_1px_2px_rgba(255,255,255,0.8)] overflow-hidden">
        <table className="w-full">
          <thead className="bg-white/50 border-b border-white/50">
            <tr>
              <th className="text-left px-6 py-4 text-xs font-bold text-slate-700">ID</th>
              <th className="text-left px-6 py-4 text-xs font-bold text-slate-700">Movie</th>
              <th className="text-left px-6 py-4 text-xs font-bold text-slate-700">Theater</th>
              <th className="text-left px-6 py-4 text-xs font-bold text-slate-700">Date</th>
              <th className="text-left px-6 py-4 text-xs font-bold text-slate-700">Time</th>
              <th className="text-left px-6 py-4 text-xs font-bold text-slate-700">Seats</th>
              <th className="text-left px-6 py-4 text-xs font-bold text-slate-700">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/40">
            {shows.map((show) => (
              <tr key={show.id} className="hover:bg-white/40 transition-colors duration-300">
                <td className="px-6 py-4 text-xs text-slate-700">{show.id}</td>
                <td className="px-6 py-4 text-xs text-slate-800 font-semibold">{show.movieTitle || "Unknown Movie"}</td>
                <td className="px-6 py-4 text-xs text-slate-700">{show.theater?.name || "Unknown Theater"}</td>
                <td className="px-6 py-4 text-xs text-slate-700">{show.showDate}</td>
                <td className="px-6 py-4 text-xs text-slate-700">{show.showTime}</td>
                <td className="px-6 py-4 text-xs text-slate-700">{show.availableSeats}</td>
                <td className="px-6 py-4">
                  <button
                    onClick={() => handleDelete(show.id)}
                    className="p-2 text-red-600 hover:bg-red-500/10 rounded-lg transition-all duration-300"
                  >
                    <IoTrashOutline className="w-5 h-5" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {shows.length === 0 && (
          <div className="p-12 text-center">
            <p className="text-slate-600 text-sm font-medium">No shows available. Add one to get started!</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default AdminListShows;
