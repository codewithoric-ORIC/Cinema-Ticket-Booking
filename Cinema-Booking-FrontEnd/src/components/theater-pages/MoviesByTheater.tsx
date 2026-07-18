import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import {
    IoStar,
    IoArrowBack,
    IoFilmOutline,
    IoLocationOutline
} from "react-icons/io5";
import { fetchMoviesByTheaterId, fetchAllTheaters, type Movie, type Theater } from "../../service/MovieService";

function MoviesByTheater() {
    const { theaterId } = useParams<{ theaterId: string }>();
    const navigate = useNavigate();
    const [movies, setMovies] = useState<Movie[]>([]);
    const [theater, setTheater] = useState<Theater | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadData = async () => {
            if (!theaterId) return;
            try {
                const theaters = await fetchAllTheaters();
                const foundTheater = theaters.find(t => t.id === Number(theaterId));
                if (foundTheater) {
                    setTheater(foundTheater);
                }
                const moviesData = await fetchMoviesByTheaterId(Number(theaterId));
                setMovies(moviesData);
            } catch (e) {
                console.error("Failed to load data:", e);
            } finally {
                setLoading(false);
            }
        };
        loadData();
    }, [theaterId]);

    if (loading) {
        return (
            <div className="w-full min-h-screen bg-slate-100 overflow-x-hidden relative pt-28 pb-20 flex items-center justify-center">
                <p className="text-slate-500 font-medium">Loading...</p>
            </div>
        );
    }

    return (
        <div className="w-full min-h-screen bg-slate-100 overflow-x-hidden relative pt-28 pb-20">
            {/* Background Glows */}
            <div className="absolute top-1/4 left-[-5%] w-[500px] h-[500px] bg-purple-500/15 rounded-full blur-[140px] pointer-events-none" />
            <div className="absolute top-2/3 right-[-5%] w-[500px] h-[500px] bg-indigo-500/15 rounded-full blur-[140px] pointer-events-none" />

            <div className="relative z-10 max-w-7xl mx-auto px-6">
                {/* Back Button */}
                <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-slate-500 hover:text-purple-600 font-bold text-sm mb-8 transition-colors cursor-pointer group">
                    <IoArrowBack className="w-4 h-4 transform group-hover:-translate-x-1 transition-transform" /> Back
                </button>

                {/* Theater Info */}
                {theater && (
                    <div className="mb-8 space-y-2">
                        <div className="flex items-center gap-3">
                            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-purple-600 to-indigo-600 text-white flex items-center justify-center text-2xl shadow-lg shadow-purple-500/20">
                                <IoFilmOutline />
                            </div>
                            <div>
                                <h1 className="text-4xl font-black text-slate-900 tracking-tight">{theater.name}</h1>
                                <div className="flex items-center gap-2 text-slate-500 text-sm font-semibold mt-1">
                                    <IoLocationOutline /> {theater.location}
                                </div>
                            </div>
                        </div>
                        <p className="text-slate-500 text-sm font-semibold">Now Playing at {theater.name}</p>
                    </div>
                )}{/* Movies Grid */}
                <div className="w-full rounded-[2.5rem] bg-white/60 backdrop-blur-xl p-6 md:p-8">
                    {movies.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-16 text-center">
                            <div className="w-24 h-24 rounded-full bg-slate-200 flex items-center justify-center mb-4">
                                <IoFilmOutline className="w-12 h-12 text-slate-400" />
                            </div>
                            <h3 className="text-xl font-bold text-slate-800 mb-2">No Movies Playing Yet</h3>
                            <p className="text-slate-500">Check back later for upcoming movies at this theater!</p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
                            {movies.map((movie) => (
                                <div
                                    key={movie.id}
                                    onClick={() => navigate(`/movie/${movie.id}`, { state: { theaterId: theaterId } })}
                                    className="group relative flex flex-col h-full rounded-[1.8rem] p-3 overflow-hidden cursor-pointer
                             bg-white/80 backdrop-blur-xl
                             border border-white/80 border-b-black/[0.04]
                             shadow-[0_4px_12px_rgba(0,0,0,0.02),inset_0_1px_2px_rgba(255,255,255,0.6)]
                             hover:shadow-[0_20px_40px_-12px_rgba(0,0,0,0.08)]
                             hover:-translate-y-1 transition-all duration-400"
                                >
                                    <div className="absolute inset-x-0 top-0 h-[35%] bg-gradient-to-b from-white/30 via-white/[0.02] to-transparent pointer-events-none z-10"/>

                                    <div className="w-full aspect-[4/5] rounded-[1.4rem] overflow-hidden relative mb-3 z-0">
                                        <img
                                            src={movie.imageUrl}
                                            alt={movie.title}
                                            className="w-full h-full object-cover transform scale-100 group-hover:scale-105 transition-transform duration-700"
                                        />
                                    </div>

                                    <div className="flex flex-col flex-grow px-1.5 pb-1.5 relative z-10">
                                        <h3 className="text-base font-bold text-slate-800 line-clamp-1 tracking-tight mb-0.5 group-hover:text-purple-600 transition-colors">
                                            {movie.title}
                                        </h3>

                                        <p className="text-[11px] text-slate-500 font-medium leading-relaxed line-clamp-2 mb-3">
                                            {movie.description}
                                        </p>

                                        <div className="flex items-center justify-between gap-2 mt-auto">
                                            <button
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    navigate(`/movie/${movie.id}`, { state: { theaterId: theaterId } });
                                                }}
                                                className="group relative h-9 px-6 rounded-xl text-[11px] font-bold text-white
                                   bg-gradient-to-r from-purple-600 to-indigo-600
                                   shadow-[0_4px_12px_rgba(124,58,237,0.15),inset_0_1px_1px_rgba(255,255,255,0.3)]
                                   hover:scale-105 hover:shadow-[0_8px_20px_rgba(124,58,237,0.25)]
                                   active:scale-98
                                   transition-all duration-300 ease-out overflow-hidden flex items-center justify-center"
                                            >
                                                <span className="absolute inset-x-0 top-0 h-[40%] bg-gradient-to-b from-white/20 to-transparent rounded-t-full pointer-events-none"/>
                                                <span className="relative z-10">Get Ticket</span>
                                            </button><div className="flex items-center gap-0.5 px-2 h-9 rounded-lg bg-amber-500/[0.06] border border-amber-500/15 shadow-[inset_0_1px_1px_rgba(255,255,255,0.3)] shrink-0">
                                            <IoStar className="w-3 h-3 text-amber-500"/>
                                            <span className="text-[11px] font-bold text-amber-700">{movie.rating}</span>
                                        </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

export default MoviesByTheater;