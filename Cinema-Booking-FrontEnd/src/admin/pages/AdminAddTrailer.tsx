import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { createTrailer, fetchAllMovies } from "../service/AdminService";
import { type Movie } from "../../service/MovieService";
import { IoArrowBack, IoCheckmarkCircleOutline } from "react-icons/io5";

function AdminAddTrailer() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [movies, setMovies] = useState<Movie[]>([]);
  const [formData, setFormData] = useState({
    title: "",
    duration: "",
    youtubeId: "",
    thumbnailUrl: "",
    movieId: ""
  });

  useEffect(() => {
    const loadMovies = async () => {
      try {
        const data = await fetchAllMovies();
        setMovies(data);
      } catch (e) {
        console.error("Failed to load movies:", e);
      }
    };
    loadMovies();
  }, []);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    try {
      await createTrailer({
        title: formData.title,
        duration: formData.duration,
        youtubeId: formData.youtubeId,
        thumbnailUrl: formData.thumbnailUrl,
        movieId: parseInt(formData.movieId)
      });
      navigate("/admin/trailers");
    } catch (e) {
      console.error("Failed to create trailer:", e);
    } finally {
      setLoading(false);
    }
  };

  // Auto-generate thumbnail URL from YouTube ID
  useEffect(() => {
    if (formData.youtubeId && !formData.thumbnailUrl) {
      setFormData(prev => ({
        ...prev,
        thumbnailUrl: `https://img.youtube.com/vi/${formData.youtubeId}/mqdefault.jpg`
      }));
    }
  }, [formData.youtubeId]);

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="flex items-center gap-3">
        <button onClick={() => navigate("/admin/trailers")} className="p-2.5 rounded-full bg-white/60 border border-white/80 hover:bg-white/80 transition-all duration-300">
          <IoArrowBack className="w-5 h-5 text-slate-700" />
        </button>
        <div>
          <h1 className="text-2xl font-extrabold text-slate-800 tracking-tight mt-3">Add New Trailer</h1>
          <p className="text-slate-500 mt-1 text-sm font-medium">Add a new movie trailer</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5 rounded-2xl bg-white/60 backdrop-blur-xl border border-white/80 p-6 shadow-[0_8px_24px_rgba(0,0,0,0.04),inset_0_1px_2px_rgba(255,255,255,0.8)]">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div className="space-y-5">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-2">Trailer Title</label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="w-full px-4 py-3 rounded-xl border border-slate-300 bg-white/70 focus:border-purple-500 focus:outline-none transition-all duration-300 text-sm"
                placeholder="Enter trailer title"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-2">Select Movie</label>
              <select
                value={formData.movieId}
                onChange={(e) => setFormData({ ...formData, movieId: e.target.value })}
                className="w-full px-4 py-3 rounded-xl border border-slate-300 bg-white/70 focus:border-purple-500 focus:outline-none transition-all duration-300 text-sm"
                required
              >
                <option value="">Select a movie</option>
                {movies.map((movie) => (
                  <option key={movie.id} value={movie.id.toString()}>
                    {movie.title}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-2">YouTube Video ID</label>
              <input
                type="text"
                value={formData.youtubeId}
                onChange={(e) => setFormData({ ...formData, youtubeId: e.target.value })}
                className="w-full px-4 py-3 rounded-xl border border-slate-300 bg-white/70 focus:border-purple-500 focus:outline-none transition-all duration-300 text-sm"
                placeholder="e.g. YoHD9XEInc0"
                required
              />
              <p className="text-[10px] text-slate-500 mt-1.5">The ID is the part after v= in YouTube URL (e.g. youtube.com/watch?v=YoHD9XEInc0)</p>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-2">Duration</label>
              <input
                type="text"
                value={formData.duration}
                onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                className="w-full px-4 py-3 rounded-xl border border-slate-300 bg-white/70 focus:border-purple-500 focus:outline-none transition-all duration-300 text-sm"
                placeholder="e.g. 2:28"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-2">Thumbnail URL (Optional)</label>
              <input
                type="url"
                value={formData.thumbnailUrl}
                onChange={(e) => setFormData({ ...formData, thumbnailUrl: e.target.value })}
                className="w-full px-4 py-3 rounded-xl border border-slate-300 bg-white/70 focus:border-purple-500 focus:outline-none transition-all duration-300 text-sm"
                placeholder="Auto-generated from YouTube ID"
              />
            </div>
          </div>

          <div className="space-y-5">
            <div className="rounded-xl bg-white/50 border border-white/50 p-4">
              <label className="block text-xs font-bold text-slate-700 mb-2">Preview Thumbnail</label>
              {formData.thumbnailUrl ? (
                <div className="rounded-lg overflow-hidden border border-white/40 shadow-sm">
                  <img src={formData.thumbnailUrl} alt="Trailer Preview" className="w-full aspect-video object-cover" />
                </div>
              ) : (
                <div className="rounded-lg border border-white/40 bg-slate-100/50 flex items-center justify-center p-8">
                  <p className="text-slate-500 text-center text-xs font-medium">Enter a YouTube ID to see a preview</p>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="flex items-center justify-end gap-3 pt-2">
          <button
            type="button"
            onClick={() => navigate("/admin/trailers")}
            className="h-12 px-6 rounded-full font-bold text-slate-700 bg-white/70 border border-white/80 shadow-[0_4px_12px_rgba(0,0,0,0.03),inset_0_1px_2px_rgba(255,255,255,0.8)] hover:bg-white/90 transition-all duration-300 text-sm"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading}
            className="h-12 px-6 rounded-full font-bold text-white bg-gradient-to-r from-purple-600 to-indigo-600 shadow-[0_8px_24px_rgba(124,58,237,0.25),inset_0_1px_2px_rgba(255,255,255,0.3)] hover:scale-[1.02] transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 text-sm"
          >
            {loading ? "Adding..." : (
              <>
                <IoCheckmarkCircleOutline className="w-5 h-5" />
                Add Trailer
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}

export default AdminAddTrailer;
