// /Users/mac/Documents/React/Cinema Booking/Cinema-Booking-FrontEnd/src/admin/pages/AdminListCasts.tsx
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { fetchAllCasts, deleteCast } from "../service/AdminService";
import { type Cast } from "../../service/MovieService";
import { IoAddCircleOutline, IoTrashOutline } from "react-icons/io5";
import AdminBadge from "../components/AdminBadge.tsx";

function AdminListCasts() {
    const navigate = useNavigate();
    const [casts, setCasts] = useState<Cast[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadCasts = async () => {
            try {
                const data = await fetchAllCasts();
                setCasts(data);
            } catch (e) {
                console.error("Failed to load casts:", e);
            } finally {
                setLoading(false);
            }
        };
        loadCasts();
    }, []);

    const handleDelete = async (id: number) => {
        if (!window.confirm("Are you sure you want to delete this cast member?")) return;
        try {
            await deleteCast(id);
            setCasts(casts.filter((cast) => cast.id !== id));
        } catch (e) {
            console.error("Failed to delete cast:", e);
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[60vh]">
                <p className="text-slate-500 text-lg font-medium">Loading cast members...</p>
            </div>
        );
    }

    return (
        <div className="space-y-8">
            <div className="flex items-center justify-between">
                <div>
                    <AdminBadge text="Movie Casts & Crew" />
                    <h1 className="text-3xl font-extrabold text-slate-800 tracking-tight">Manage Casts</h1>
                    <p className="text-slate-500 mt-2 font-medium">Add, view, or delete movie cast members</p>
                </div>
                <button
                    onClick={() => navigate("/admin/casts/add")}
                    className="flex items-center gap-2 h-14 px-8 rounded-full font-bold text-white bg-gradient-to-r from-purple-600 to-indigo-600 shadow-[0_8px_24px_rgba(124,58,237,0.25),inset_0_1px_2px_rgba(255,255,255,0.3)] hover:scale-[1.02] transition-all duration-300"
                >
                    <IoAddCircleOutline className="w-6 h-6" />
                    Add Cast Member
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {casts.map((cast) => (
                    <div
                        key={cast.id}
                        className="rounded-[2rem] bg-white/60 backdrop-blur-xl border border-white/80 p-6 shadow-[0_8px_24px_rgba(0,0,0,0.04),inset_0_1px_2px_rgba(255,255,255,0.8)] hover:shadow-[0_16px_48px_-12px_rgba(124,58,237,0.15),inset_0_1px_2px_rgba(255,255,255,0.9)] transition-all duration-300 hover:-translate-y-1"
                    >
                        <div className="rounded-full overflow-hidden border border-white/40 shadow-sm mb-5 w-32 h-32 mx-auto">
                            <img
                                src={cast.avatarUrl}
                                alt={cast.name}
                                className="w-full h-full object-cover"
                                onError={(e) => {
                                    (e.target as HTMLImageElement).src = "https://placehold.co/128x128/e2e8f0/64748b?text=No+Avatar";
                                }}
                            />
                        </div>
                        <div className="space-y-2 text-center">
                            <h3 className="text-lg font-bold text-slate-800">{cast.name}</h3>
                            <p className="text-sm text-slate-500 font-medium">as {cast.characterName}</p>
                            <p className="text-xs text-purple-600 font-semibold">{cast.movieTitle}</p>
                        </div>
                        <div className="flex items-center justify-center pt-4">
                            <button
                                onClick={() => handleDelete(cast.id)}
                                className="p-2.5 text-red-600 hover:bg-red-500/10 rounded-xl transition-all duration-300"
                            >
                                <IoTrashOutline className="w-6 h-6" />
                            </button>
                        </div>
                    </div>
                ))}
            </div>
            {casts.length === 0 && (
                <div className="text-center py-16 rounded-[2rem] bg-white/40 backdrop-blur-xl border border-white/80">
                    <p className="text-slate-600 text-lg font-medium">No cast members available. Add one to get started!</p>
                </div>
            )}
        </div>
    );
}

export default AdminListCasts;