import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createMovie } from "../service/AdminService";
import { IoArrowBack, IoCheckmarkCircleOutline, IoCloudUploadOutline } from "react-icons/io5";

function AdminAddMovie() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    rating: "0.0",
    imageUrl: "",
    duration: "0",
    genre: "",
    year: new Date().getFullYear().toString(),
    releaseDate: new Date().toISOString().split("T")[0],
    isActive: true
  });

  // Handle file upload
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          setFormData({ ...formData, imageUrl: event.target.result as string });
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    try {
      await createMovie({
        ...formData,
        rating: parseFloat(formData.rating),
        duration: parseInt(formData.duration),
        year: parseInt(formData.year),
        cast: [],
        trailers: []
      });
      navigate("/admin/movies");
    } catch (e) {
      console.error("Failed to create movie:", e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="flex items-center gap-3">
        <button onClick={() => navigate("/admin/movies")} className="p-2.5 rounded-full bg-white/60 border border-white/80 hover:bg-white/80 transition-all duration-300">
          <IoArrowBack className="w-5 h-5 text-slate-700" />
        </button>
        <div>
          <h1 className="text-2xl font-extrabold text-slate-800 tracking-tight">Add New Movie</h1>
          <p className="text-slate-500 mt-1 text-sm font-medium">Create a new movie to display on the home page</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5 rounded-2xl bg-white/60 backdrop-blur-xl border border-white/80 p-6 shadow-[0_8px_24px_rgba(0,0,0,0.04),inset_0_1px_2px_rgba(255,255,255,0.8)]">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div className="space-y-5">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-2">Movie Title</label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="w-full px-4 py-3 rounded-xl border border-slate-300 bg-white/70 focus:border-purple-500 focus:outline-none transition-all duration-300 text-sm"
                placeholder="Enter movie title"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-2">Description</label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                rows={3}
                className="w-full px-4 py-3 rounded-xl border border-slate-300 bg-white/70 focus:border-purple-500 focus:outline-none transition-all duration-300 text-sm"
                placeholder="Enter movie description"
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-2">Rating</label>
                <input
                  type="number"
                  step="0.1"
                  min="0"
                  max="10"
                  value={formData.rating}
                  onChange={(e) => setFormData({ ...formData, rating: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl border border-slate-300 bg-white/70 focus:border-purple-500 focus:outline-none transition-all duration-300 text-sm"
                  placeholder="8.5"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-2">Duration (min)</label>
                <input
                  type="number"
                  min="1"
                  value={formData.duration}
                  onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl border border-slate-300 bg-white/70 focus:border-purple-500 focus:outline-none transition-all duration-300 text-sm"
                  placeholder="148"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-2">Genre</label>
                <input
                  type="text"
                  value={formData.genre}
                  onChange={(e) => setFormData({ ...formData, genre: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl border border-slate-300 bg-white/70 focus:border-purple-500 focus:outline-none transition-all duration-300 text-sm"
                  placeholder="Sci-Fi"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-2">Year</label>
                <input
                  type="number"
                  min="1900"
                  max={new Date().getFullYear() + 10}
                  value={formData.year}
                  onChange={(e) => setFormData({ ...formData, year: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl border border-slate-300 bg-white/70 focus:border-purple-500 focus:outline-none transition-all duration-300 text-sm"
                  placeholder="2024"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-2">Release Date</label>
              <input
                type="date"
                value={formData.releaseDate}
                onChange={(e) => setFormData({ ...formData, releaseDate: e.target.value })}
                className="w-full px-4 py-3 rounded-xl border border-slate-300 bg-white/70 focus:border-purple-500 focus:outline-none transition-all duration-300 text-sm"
                required
              />
            </div>

            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="isActive"
                checked={formData.isActive}
                onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                className="w-4 h-4 text-purple-600 rounded focus:ring-purple-500"
              />
              <label htmlFor="isActive" className="text-xs font-bold text-slate-700">Movie is Active</label>
            </div>
          </div>

          <div className="space-y-5">
            <div className="rounded-xl bg-white/50 border border-white/50 p-4">
              <label className="block text-xs font-bold text-slate-700 mb-2">Movie Poster</label>
              
              {/* File Upload Option */}
              <div className="mb-3">
                <label className="flex flex-col items-center justify-center gap-1.5 h-28 border-2 border-dashed border-slate-300 rounded-xl bg-slate-100/50 hover:border-purple-500 hover:bg-purple-50/50 cursor-pointer transition-all duration-300">
                  <IoCloudUploadOutline className="w-8 h-8 text-slate-500" />
                  <span className="text-xs font-semibold text-slate-600">Click to upload or drag and drop</span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileUpload}
                    className="hidden"
                  />
                </label>
              </div>

              {/* Or URL Option */}
              <div className="mb-3">
                <label className="block text-[10px] font-semibold text-slate-500 mb-1.5">Or enter an image URL:</label>
                <input
                  type="url"
                  value={formData.imageUrl}
                  onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
                  className="w-full px-3 py-2.5 rounded-lg border border-slate-300 bg-white/70 focus:border-purple-500 focus:outline-none transition-all duration-300 text-xs"
                  placeholder="https://example.com/movie-poster.jpg"
                />
              </div>

              {/* Preview */}
              {formData.imageUrl ? (
                <div className="rounded-lg overflow-hidden border border-white/40 shadow-sm">
                  <img src={formData.imageUrl} alt="Movie Preview" className="w-full aspect-[2/3] object-cover" />
                </div>
              ) : (
                <div className="rounded-lg border border-white/40 bg-slate-100/50 flex items-center justify-center p-8">
                  <p className="text-slate-500 text-center text-xs font-medium">Upload or enter URL to see preview</p>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="flex items-center justify-end gap-3 pt-2">
          <button
            type="button"
            onClick={() => navigate("/admin/movies")}
            className="h-12 px-6 rounded-full font-bold text-slate-700 bg-white/70 border border-white/80 shadow-[0_4px_12px_rgba(0,0,0,0.03),inset_0_1px_2px_rgba(255,255,255,0.8)] hover:bg-white/90 transition-all duration-300 text-sm"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading || !formData.title || !formData.description || !formData.imageUrl}
            className="h-12 px-6 rounded-full font-bold text-white bg-gradient-to-r from-purple-600 to-indigo-600 shadow-[0_8px_24px_rgba(124,58,237,0.25),inset_0_1px_2px_rgba(255,255,255,0.3)] hover:scale-[1.02] transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 text-sm"
          >
            {loading ? "Adding..." : (
              <>
                <IoCheckmarkCircleOutline className="w-5 h-5" />
                Add Movie
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}

export default AdminAddMovie;
