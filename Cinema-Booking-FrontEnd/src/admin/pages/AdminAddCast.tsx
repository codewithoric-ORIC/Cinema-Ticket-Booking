import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { createCast, fetchAllMovies } from "../service/AdminService";
import { type Movie } from "../../service/MovieService";
import { IoArrowBack, IoCheckmarkCircleOutline } from "react-icons/io5";


function AdminAddCast() {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [movies, setMovies] = useState<Movie[]>([]);
    const [formData, setFormData] = useState({
        name: "",
        characterName: "",
        avatarUrl: "",
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
            await createCast({
                name: formData.name,
                characterName: formData.characterName,
                avatarUrl: formData.avatarUrl,
                movieId: parseInt(formData.movieId)
            });
            navigate("/admin/casts");
        } catch (e) {
            console.error("Failed to create cast:", e);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-3xl mx-auto space-y-6">
            <div className="flex items-center gap-3">
                <button onClick={() => navigate("/admin/casts")} className="p-2.5 rounded-full bg-white/60 border border-white/80 hover:bg-white/80 transition-all duration-300">
                    <IoArrowBack className="w-5 h-5 text-slate-700" />
                </button>
                <div>
                    <h1 className="text-2xl font-extrabold text-slate-800 tracking-tight mt-3">Add New Cast Member</h1>
                    <p className="text-slate-500 mt-1 text-sm font-medium">Add a new actor/actress to a movie</p>
                </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5 rounded-2xl bg-white/60 backdrop-blur-xl border border-white/80 p-6 shadow-[0_8px_24px_rgba(0,0,0,0.04),inset_0_1px_2px_rgba(255,255,255,0.8)]">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div className="space-y-5">
                        <div>
                            <label className="block text-xs font-bold text-slate-700 mb-2">Actor/Actress Name</label>
                            <input
                                type="text"
                                value={formData.name}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                className="w-full px-4 py-3 rounded-xl border border-slate-300 bg-white/70 focus:border-purple-500 focus:outline-none transition-all duration-300 text-sm"
                                placeholder="e.g. Leonardo DiCaprio"
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-xs font-bold text-slate-700 mb-2">Character Name</label>
                            <input
                                type="text"
                                value={formData.characterName}
                                onChange={(e) => setFormData({ ...formData, characterName: e.target.value })}
                                className="w-full px-4 py-3 rounded-xl border border-slate-300 bg-white/70 focus:border-purple-500 focus:outline-none transition-all duration-300 text-sm"
                                placeholder="e.g. Cobb"
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
                            <label className="block text-xs font-bold text-slate-700 mb-2">Avatar URL</label>
                            <input
                                type="url"
                                value={formData.avatarUrl}
                                onChange={(e) => setFormData({ ...formData, avatarUrl: e.target.value })}
                                className="w-full px-4 py-3 rounded-xl border border-slate-300 bg-white/70 focus:border-purple-500 focus:outline-none transition-all duration-300 text-sm"
                                placeholder="https://example.com/avatar.jpg"
                                required
                            />
                        </div>
                    </div>

                    <div className="space-y-5">
                        <div className="rounded-xl bg-white/50 border border-white/50 p-4">
                            <label className="block text-xs font-bold text-slate-700 mb-2">Preview Avatar</label>
                            {formData.avatarUrl ? (
                                <div className="rounded-full overflow-hidden border border-white/40 shadow-sm w-40 h-40 mx-auto">
                                    <img src={formData.avatarUrl} alt="Cast Preview" className="w-full h-full object-cover" />
                                </div>
                            ) : (
                                <div className="rounded-full border border-white/40 bg-slate-100/50 flex items-center justify-center w-40 h-40 mx-auto">
                                    <p className="text-slate-500 text-center text-xs font-medium">Enter an avatar URL to see a preview</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                <div className="flex items-center justify-end gap-3 pt-2">
                    <button
                        type="button"
                        onClick={() => navigate("/admin/casts")}
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
                                Add Cast Member
                            </>
                        )}
                    </button>
                </div>
            </form>
        </div>
    );
}

export default AdminAddCast;