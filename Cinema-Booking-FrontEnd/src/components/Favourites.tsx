import { Link, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { IoArrowBack, IoHeartOutline, IoChevronForward } from "react-icons/io5";
import { fetchUserFavourites, type Movie } from "../service/MovieService";
import { removeFromFavourites } from "../service/MovieService";
import { isLoggedIn } from "../auth/service/AuthService";

function Favourites() {
    const [movies, setMovies] = useState<Movie[]>([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const loadFavourites = async () => {
            if (!isLoggedIn()) {
                setLoading(false);
                return;
            }
            try {
                const data = await fetchUserFavourites();
                setMovies(data);
            } catch (e) {
                console.error("Failed to load favourites", e);
            } finally {
                setLoading(false);
            }
        };
        loadFavourites();
    }, []);

    const handleRemoveFavourite = async (movieId: number, e: React.MouseEvent) => {
        e.stopPropagation();
        try {
            await removeFromFavourites(movieId);
            setMovies(movies.filter(m => m.id !== movieId));
        } catch (e) {
            console.error("Failed to remove favourite:", e);
        }
    };

    if (loading) {
        return (
            <div className="w-full min-h-screen bg-slate-50 overflow-x-hidden relative pt-28 pb-20 flex items-center justify-center">
                <p className="text-slate-500 font-medium">Loading...</p>
            </div>
        );
    }

    return (
        <div className="w-full min-h-screen bg-slate-50 overflow-x-hidden relative pt-28 pb-20">
            {/* Background Glows */}
            <div className="absolute top-1/4 left-[-5%] w-[500px] h-[500px] bg-purple-500/15 rounded-full blur-[140px] pointer-events-none"></div>
            <div className="absolute top-2/3 right-[-5%] w-[500px] h-[500px] bg-indigo-500/15 rounded-full blur-[140px] pointer-events-none"></div>

            <div className="relative z-10 max-w-7xl mx-auto px-6">
                <div className="flex items-center gap-4 mb-8">
                    <Link to="/" className="flex items-center gap-2 text-slate-500 hover:text-purple-600 font-bold text-sm transition-colors cursor-pointer group">
                        <IoArrowBack className="w-4 h-4 transform group-hover:-translate-x-1 transition-transform"></IoArrowBack>
                        <span>Back</span>
                    </Link>
                </div>

                <div className="mb-8 space-y-2">
                    <div className="inline-flex items-center px-4 py-1.5 rounded-full bg-purple-600/[0.08] border border-purple-500/20 shadow-sm backdrop-blur-md mb-4">
                        <span className="text-xs font-bold uppercase tracking-widest text-purple-700">Favourites</span>
                    </div>
                    <h1 className="text-4xl font-black text-slate-900 tracking-tight leading-none">
                        Your Favourite Movies
                    </h1>
                    <p className="text-slate-500 text-sm font-medium max-w-xl leading-relaxed">
                        Here are all the movies you've loved.
                    </p>
                </div>

                {movies.length === 0 ? (
                    // Empty State
                    <div className="w-full rounded-[2.5rem] bg-white/40 backdrop-blur-2xl p-12 text-center">
                        <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-purple-100 flex items-center justify-center">
                            <IoHeartOutline className="w-12 h-12 text-purple-600"></IoHeartOutline>
                        </div>
                        <h2 className="text-2xl font-bold text-slate-800 mb-2">No favourites yet</h2>
                        <p className="text-slate-500 mb-8 max-w-md mx-auto">
                            Start exploring movies and mark your favourites by clicking the heart icon!
                        </p>
                        <Link
                            to="/movies"
                            className="group relative inline-flex h-12 px-8 rounded-full text-sm font-bold text-white
                                       bg-gradient-to-r from-purple-600 to-indigo-600
                                       shadow-[0_4px_12px_rgba(124,58,237,0.15),inset_0_1px_1px_rgba(255,255,255,0.3)]
                                       hover:scale-105 hover:shadow-[0_8px_20px_rgba(124,58,237,0.25)]
                                       active:scale-98
                                       transition-all duration-300 ease-out overflow-hidden cursor-pointer"
                        >
                            <span className="absolute inset-x-0 top-0 h-[40%] bg-gradient-to-b from-white/20 to-transparent rounded-t-full pointer-events-none"></span>
                            <span className="absolute -inset-full bg-gradient-to-r from-transparent via-white/20 to-transparent transform -skew-x-12 transition-all duration-1000 group-hover:left-full ease-out"></span>
                            <span className="relative">Browse Movies</span>
                        </Link>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                        {movies.map((movie) => (
                            <div
                                key={movie.id}
                                className="group relative flex flex-col h-full rounded-[1.8rem] p-3 overflow-hidden
                                           bg-white/60 backdrop-blur-xl
                                           border border-white/80 border-b-black/[0.04]
                                           shadow-[0_4px_12px_rgba(0,0,0,0.02),inset_0_1px_1px_rgba(255,255,255,0.6)]
                                           hover:shadow-[0_20px_40px_-12px_rgba(0,0,0,0.06)]
                                           hover:-translate-y-1 transition-all duration-400 ease-out cursor-pointer"
                            >
                                <div className="absolute inset-x-0 top-0 h-[35%] bg-gradient-to-b from-white/30 via-white/[0.02] to-transparent pointer-events-none z-10"/>

                                <div className="w-full aspect-[4/5] rounded-[1.4rem] overflow-hidden relative mb-3 z-0">
                                    <img
                                        src={movie.imageUrl}
                                        alt={movie.title}
                                        className="w-full h-full object-cover transform scale-100 group-hover:scale-105 transition-transform duration-700 ease-out"
                                    />
                                </div>

                                <div className="flex flex-col flex-grow px-1.5 pb-1.5 relative z-10">
                                    <h3 className="text-base font-bold text-slate-800 line-clamp-1 tracking-tight mb-0.5 group-hover:text-purple-600 transition-colors">
                                        {movie.title}
                                    </h3>

                                    <p className="text-[11px] text-slate-500 font-medium leading-relaxed line-clamp-2 mb-3">
                                        {movie.genre}
                                    </p>

                                    <div className="flex items-center justify-between gap-2 mt-auto">
                                        <button onClick={() => navigate(`/movie/${movie.id}`)} className="group relative h-9 px-6 rounded-xl text-[11px] font-bold text-white
                                           bg-gradient-to-r from-purple-600 to-indigo-600
                                           shadow-[0_4px_12px_rgba(124,58,237,0.15),inset_0_1px_1px_rgba(255,255,255,0.3)]
                                           hover:scale-105 hover:shadow-[0_8px_20px_rgba(124,58,237,0.25)]
                                           active:scale-98
                                           transition-all duration-300 ease-out overflow-hidden cursor-pointer flex items-center justify-center gap-1">

                                            <span className="absolute inset-x-0 top-0 h-[40%] bg-gradient-to-b from-white/20 to-transparent rounded-t-full pointer-events-none"></span>

                                            <span className="absolute -inset-full bg-gradient-to-r from-transparent via-white/20 to-transparent transform -skew-x-12 transition-all duration-1000 group-hover:left-full ease-out"></span>

                                            <span className="relative z-10">View Details</span>
                                            <IoChevronForward className="w-3 h-3 relative z-10" />
                                        </button>

                                        <button onClick={(e) => handleRemoveFavourite(movie.id, e)} className="p-2 rounded-lg bg-red-500/[0.06] border border-red-500/15 hover:bg-red-600 hover:text-white transition-all">
                                            <IoHeartOutline className="w-4 h-4" />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}

export default Favourites;
