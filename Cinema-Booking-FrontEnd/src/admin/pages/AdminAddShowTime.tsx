// /Users/mac/Documents/React/Cinema Booking/Cinema-Booking-FrontEnd/src/admin/pages/AdminAddShowTime.tsx
import { useState, useEffect, type FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { createShowtime, fetchAllMovies, fetchAllTheaters } from '../service/AdminService';
import { type CreateShowtimeRequest } from '../service/AdminTypes';
import { type Movie, type Theater } from '../../service/MovieService';
import { IoArrowBack } from 'react-icons/io5';

function AdminAddShowTime() {
    const navigate = useNavigate();
    const [movies, setMovies] = useState<Movie[]>([]);
    const [theaters, setTheaters] = useState<Theater[]>([]);
    const [formData, setFormData] = useState<CreateShowtimeRequest>({
        movieId: 0,
        theaterId: 0,
        showDate: new Date().toISOString().split('T')[0],
        showTime: '14:00',
        availableSeats: 150,
    });
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
                if (moviesData.length > 0) setFormData(prev => ({ ...prev, movieId: moviesData[0].id }));
                if (theatersData.length > 0) {
                    setFormData(prev => ({ ...prev, theaterId: theatersData[0].id, availableSeats: theatersData[0].totalSeats }));
                }
            } catch (e) {
                console.error('Failed to load data:', e);
            }
        };
        loadData();
    }, []);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: name === 'movieId' || name === 'theaterId' || name === 'availableSeats' ? parseInt(value) : value,
        }));
    };

    const handleTheaterChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const theaterId = parseInt(e.target.value);
        const selectedTheater = theaters.find(t => t.id === theaterId);
        setFormData(prev => ({
            ...prev,
            theaterId: theaterId,
            availableSeats: selectedTheater ? selectedTheater.totalSeats : 150,
        }));
    };

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            await createShowtime(formData);
            navigate('/admin/showtimes');
        } catch (error) {
            console.error('Failed to create showtime:', error);
            alert('Failed to create showtime. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="space-y-8">
            <button
                onClick={() => navigate('/admin/showtimes')}
                className="flex items-center gap-2 text-slate-500 hover:text-purple-600 font-bold text-sm mb-6 transition-colors cursor-pointer group"
            >
                <IoArrowBack className="w-4 h-4 transform group-hover:-translate-x-1 transition-transform" /> Back
            </button>

            <div className="rounded-[2rem] bg-white/60 backdrop-blur-xl border border-white/80 p-8 shadow-[0_8px_24px_rgba(0,0,0,0.04),inset_0_1px_2px_rgba(255,255,255,0.8)]">
                <h1 className="text-3xl font-extrabold text-slate-800 tracking-tight mb-8">Add New Showtime</h1>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <label className="text-sm font-bold text-slate-700">Movie</label>
                            <select
                                name="movieId"
                                value={formData.movieId}
                                onChange={handleChange}
                                className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-white text-slate-800 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                            >
                                {movies.map(movie => (
                                    <option key={movie.id} value={movie.id}>{movie.title}</option>
                                ))}
                            </select>
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-bold text-slate-700">Theater</label>
                            <select
                                name="theaterId"
                                value={formData.theaterId}
                                onChange={handleTheaterChange}
                                className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-white text-slate-800 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                            >
                                {theaters.map(theater => (
                                    <option key={theater.id} value={theater.id}>{theater.name} ({theater.location})</option>
                                ))}
                            </select>
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-bold text-slate-700">Date</label>
                            <input
                                type="date"
                                name="showDate"
                                value={formData.showDate}
                                onChange={handleChange}
                                className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-white text-slate-800 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-bold text-slate-700">Time</label>
                            <input
                                type="time"
                                name="showTime"
                                value={formData.showTime}
                                onChange={handleChange}
                                className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-white text-slate-800 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-bold text-slate-700">Available Seats</label>
                            <input
                                type="number"
                                name="availableSeats"
                                value={formData.availableSeats}
                                onChange={handleChange}
                                min="1"
                                className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-white text-slate-800 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                            />
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full py-4 rounded-xl font-bold text-white bg-gradient-to-r from-purple-600 to-indigo-600 shadow-[0_8px_24px_rgba(124,58,237,0.25),inset_0_1px_2px_rgba(255,255,255,0.3)] hover:scale-[1.01] transition-all duration-300 disabled:opacity-50"
                    >
                        {loading ? 'Creating...' : 'Create Showtime'}
                    </button>
                </form>
            </div>
        </div>
    );
}

export default AdminAddShowTime;