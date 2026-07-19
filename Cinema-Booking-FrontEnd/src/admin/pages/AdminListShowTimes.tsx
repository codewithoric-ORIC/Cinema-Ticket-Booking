// /Users/mac/Documents/React/Cinema Booking/Cinema-Booking-FrontEnd/src/admin/pages/AdminListShowTimes.tsx
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { fetchAllShowtimes, deleteShowtime, type Showtime } from '../service/AdminService';
import { IoAddCircleOutline, IoTrashOutline} from 'react-icons/io5';
import AdminBadge from "../components/AdminBadge.tsx";

function AdminListShowTimes() {
    const navigate = useNavigate();
    const [showtimes, setShowtimes] = useState<Showtime[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadData = async () => {
            try {
                const showtimesData = await fetchAllShowtimes();
                console.log('Showtimes data:', showtimesData);
                setShowtimes(showtimesData);
            } catch (e) {
                console.error('Failed to load data:', e);
            } finally {
                setLoading(false);
            }
        };
        loadData();
    }, []);

    const handleDelete = async (id: number) => {
        if (!window.confirm('Are you sure you want to delete this showtime?')) return;
        try {
            await deleteShowtime(id);
            setShowtimes(showtimes.filter((st) => st.id !== id));
        } catch (e) {
            console.error('Failed to delete showtime:', e);
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[60vh]">
                <p className="text-slate-500 text-lg font-medium">Loading showtimes...</p>
            </div>
        );
    }

    return (
        <div className="space-y-8">
            <div className="flex items-center justify-between">
                <div>
                    <AdminBadge text="Movie Showtimes" />
                    <h1 className="text-3xl font-extrabold text-slate-800 tracking-tight">Manage Showtimes</h1>
                    <p className="text-slate-500 mt-2 font-medium">Add, view, or delete movie showtimes</p>
                </div>
                <button
                    onClick={() => navigate('/admin/showtimes/add')}
                    className="flex items-center gap-2 h-14 px-8 rounded-full font-bold text-white bg-gradient-to-r from-purple-600 to-indigo-600 shadow-[0_8px_24px_rgba(124,58,237,0.25),inset_0_1px_2px_rgba(255,255,255,0.3)] hover:scale-[1.02] transition-all duration-300"
                >
                    <IoAddCircleOutline className="w-6 h-6" />
                    Add Showtime
                </button>
            </div>

            <div className="rounded-[2rem] bg-white/60 backdrop-blur-xl border border-white/80 shadow-[0_8px_24px_rgba(0,0,0,0.04),inset_0_1px_2px_rgba(255,255,255,0.8)] overflow-hidden">
                <table className="w-full">
                    <thead className="bg-white/50 border-b border-white/30">
                        <tr>
                            <th className="text-left px-6 py-4 text-xs font-bold text-slate-700">Movie</th>
                            <th className="text-left px-6 py-4 text-xs font-bold text-slate-700">Theater</th>
                            <th className="text-left px-6 py-4 text-xs font-bold text-slate-700">Date</th>
                            <th className="text-left px-6 py-4 text-xs font-bold text-slate-700">Time</th>
                            <th className="text-left px-6 py-4 text-xs font-bold text-slate-700">Seats</th>
                            <th className="text-left px-6 py-4 text-xs font-bold text-slate-700">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-white/30">
                        {showtimes.map((showtime) => (
                            <tr key={showtime.id} className="hover:bg-white/60 transition-colors duration-300">
                                <td className="px-6 py-4 text-sm text-slate-800 font-semibold">{showtime.movieTitle || "Unknown Movie"}</td>
                                <td className="px-6 py-4 text-sm text-slate-700">{showtime.theater.name} ({showtime.theater.location})</td>
                                <td className="px-6 py-4 text-sm text-slate-700">{showtime.showDate}</td>
                                <td className="px-6 py-4 text-sm text-slate-700">{showtime.showTime}</td>
                                <td className="px-6 py-4 text-sm text-slate-700">{showtime.availableSeats}</td>
                                <td className="px-6 py-4">
                                    <button
                                        onClick={() => handleDelete(showtime.id)}
                                        className="p-2 text-red-600 hover:bg-red-500/10 rounded-xl transition-all duration-300"
                                    >
                                        <IoTrashOutline className="w-5 h-5" />
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            {showtimes.length === 0 && (
                <div className="text-center py-16 rounded-[2rem] bg-white/40 backdrop-blur-xl border border-white/80">
                    <p className="text-slate-600 text-lg font-medium">No showtimes available. Add one to get started!</p>
                </div>
            )}
        </div>
    );
}

export default AdminListShowTimes;