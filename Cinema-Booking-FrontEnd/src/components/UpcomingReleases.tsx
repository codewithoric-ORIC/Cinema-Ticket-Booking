import { useState, useEffect } from "react";
import { IoCalendarOutline, IoChevronForward } from "react-icons/io5";
import { fetchUpcomingMovies, type Movie } from "../service/MovieService";

function UpcomingReleases() {
    const [movies, setMovies] = useState<Movie[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadMovies = async () => {
            try {
                const data = await fetchUpcomingMovies();
                setMovies(data);
            } catch (error) {
                console.error("Failed to load upcoming movies:", error);
            } finally {
                setLoading(false);
            }
        };
        loadMovies();
    }, []);

    const formatDate = (dateStr: string): string => {
        const date = new Date(dateStr);
        return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    };

    if (loading) {
        return (
            <section className="w-full max-w-7xl mx-auto px-6 py-12 bg-gradient-to-br from-white/40 via-white/20 to-white/10 backdrop-blur-xl rounded-[3rem] border border-white/30">
                <div className="flex items-center justify-center">
                    <p className="text-sm text-slate-500">Loading upcoming releases...</p>
                </div>
            </section>
        );
    }

    return (
        <section className="w-full max-w-7xl mx-auto px-6 py-12 bg-gradient-to-br from-white/40 via-white/20 to-white/10 backdrop-blur-xl rounded-[3rem] border border-white/30">
            <div className="flex items-center justify-between mb-8">
                <div className="flex flex-col gap-1">
                    <h2 className="text-xl md:text-2xl font-black text-slate-800 tracking-tight">
                        Upcoming Releases
                    </h2>
                    <p className="text-xs text-slate-500 font-medium">Get ready for upcoming blockbusters</p>
                </div>

                <button className="flex items-center gap-1 text-xs font-bold text-purple-600 hover:text-indigo-600
                                        bg-purple-500/[0.04] hover:bg-purple-500/[0.08] px-3.5 py-2 rounded-full
                                        transition-all duration-300 group cursor-pointer">
                    See Calendar
                    <IoChevronForward className="w-3.5 h-3.5 transform group-hover:translate-x-1 transition-transform" />
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto">
                {movies.map((movie) => (
                    <div
                        key={movie.id}
                        className="group relative flex flex-col justify-end aspect-[16/10] w-full rounded-[1.8rem] p-4 overflow-hidden
                                    backdrop-blur-2xl border border-white/80
                                    shadow-[0_12px_24px_-10px_rgba(0,0,0,0.03),inset_0_1px_1px_rgba(255,255,255,0.7)]
                                    hover:shadow-[0_24px_48px_-12px_rgba(79,70,229,0.12),inset_0_1px_2px_rgba(255,255,255,0.9)]
                                    hover:-translate-y-1 transition-all duration-400 ease-out"
                    >
                        <div className="absolute inset-0 z-0 bg-slate-100">
                            <img
                                src={movie.imageUrl}
                                alt={movie.title}
                                className="w-full h-full object-cover transform scale-100 group-hover:scale-105 transition-transform duration-700 ease-out"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-slate-900/90 via-slate-900/40 to-transparent" />
                        </div>

                        <div className="absolute inset-x-0 top-0 h-[40%] bg-gradient-to-b from-white/20 via-transparent to-transparent pointer-events-none z-10" />

                        <div className="relative z-10 flex flex-col space-y-1.5 text-white">
                            <span className="text-[10px] font-bold text-indigo-300 uppercase tracking-widest bg-indigo-500/10 border border-indigo-400/20 px-2 py-0.5 rounded-md self-start backdrop-blur-md">
                                {movie.genre}
                            </span>

                            <h3 className="text-base font-extrabold tracking-tight line-clamp-1 group-hover:text-indigo-200 transition-colors">
                                {movie.title}
                            </h3>

                            <div className="flex items-center gap-1.5 text-[11px] text-slate-300 font-semibold pt-1">
                                <IoCalendarOutline className="w-3.5 h-3.5 text-indigo-400" />
                                <span>Releasing: {formatDate(movie.releaseDate)}</span>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </section>
    );
}

export default UpcomingReleases;
