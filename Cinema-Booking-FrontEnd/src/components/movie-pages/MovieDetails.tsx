import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import {
    IoStar,
    IoPlay,
    IoTicket,
    IoHeart,
    IoHeartOutline,
    IoArrowBack,
    IoTimeOutline,
    IoFilmOutline,
    IoClose,
} from "react-icons/io5";
import { fetchMovieById, checkIsFavourite, addToFavourites, removeFromFavourites, type Movie, type Trailer } from "../../service/MovieService";
import { fetchAllMovies } from "../../service/MovieService";
import { isLoggedIn } from "../../auth/service/AuthService";

function MovieDetails() {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const [isFavorite, setIsFavorite] = useState<boolean>(false);
    const [movie, setMovie] = useState<Movie | null>(null);
    const [recommendedMovies, setRecommendedMovies] = useState<Movie[]>([]);
    const [loading, setLoading] = useState(true);
    const [showTrailerModal, setShowTrailerModal] = useState<boolean>(false);
    const [selectedTrailer, setSelectedTrailer] = useState<Trailer | null>(null);

    // Format duration from minutes to "Xh Ym"
    const formatDuration = (minutes: number): string => {
        const hours = Math.floor(minutes / 60);
        const mins = minutes % 60;
        return `${hours}h ${mins}m`;
    };

    useEffect(() => {
        window.scrollTo(0, 0);
    }, [id]);

    useEffect(() => {
        const loadData = async () => {
            setLoading(true);
            try {
                if (id) {
                    const movieData = await fetchMovieById(Number(id));
                    setMovie(movieData);
                    
                    const isFav = await checkIsFavourite(Number(id));
                    setIsFavorite(isFav);
                    
                    const allMovies = await fetchAllMovies();
                    setRecommendedMovies(allMovies.filter(m => m.id !== Number(id)).slice(0, 4));
                }
            } catch (e) {
                console.error("Failed to load movie details:", e);
            } finally {
                setLoading(false);
            }
        };
        loadData();
    }, [id]);

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-white/40 backdrop-blur-2xl">
                <p className="text-slate-500 font-medium">Loading...</p>
            </div>
        );
    }

    if (!movie) {
        return <div className="min-h-screen flex items-center justify-center text-slate-800 font-bold">Movie not found!</div>;
    }

    // 💡 Navigate to Select Seat page
    const handleBooking = () => {
        navigate(`/select-seat/${movie.id}`);
    };

    const handleToggleFavorite = async () => {
        if (!id) return;
        if (!isLoggedIn()) {
            alert("Please log in to add favorites!");
            return;
        }
        try {
            if (isFavorite) {
                await removeFromFavourites(Number(id));
                setIsFavorite(false);
            } else {
                await addToFavourites(Number(id));
                setIsFavorite(true);
            }
        } catch (e) {
            console.error("Failed to toggle favourite", e);
            alert("Failed to update favorites. Please try again.");
        }
    };

    const handleWatchTrailer = () => {
        if (movie && movie.trailers && movie.trailers.length > 0) {
            setSelectedTrailer(movie.trailers[0]);
            setShowTrailerModal(true);
        }
    };

    return (
        <div className="w-full min-h-screen bg-white/40 backdrop-blur-2xl relative overflow-x-hidden pt-28 pb-20">
            {/* Background Glows */}
            <div className="absolute top-1/4 left-[-10%] w-[600px] h-[600px] bg-purple-500/10 rounded-full blur-[140px] pointer-events-none" />
            <div className="absolute bottom-10 right-[-10%] w-[500px] h-[500px] bg-indigo-500/10 rounded-full blur-[140px] pointer-events-none" />

            <div className="relative z-10 max-w-6xl mx-auto px-6">

                {/* Back Button */}
                <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-slate-500 hover:text-purple-600 font-bold text-sm mb-6 transition-colors cursor-pointer group">
                    <IoArrowBack className="w-4 h-4 transform group-hover:-translate-x-1 transition-transform"/> Back
                </button>

                {/* Main Split Layout Container */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-start">
                    {/* 📸 Left - Movie Image Poster */}
                    <div className="lg:col-span-5 w-full aspect-[2/3] max-w-[350px] mx-auto lg:mx-0 rounded-[2rem] p-2 bg-white border border-slate-200/60 shadow-sm">
                        <div className="w-full h-full rounded-[1.6rem] overflow-hidden">
                            <img src={movie.imageUrl} alt={movie.title} className="w-full h-full object-cover" />
                        </div>
                    </div>

                    {/* 📝 Right - Movie Information & Booking */}
                    <div className="lg:col-span-7 flex flex-col space-y-6">
                        {/* Movie Info */}
                        <div className="space-y-4">
                            <div className="space-y-2">
                                <h1 className="text-3xl lg:text-4xl font-black text-slate-90 tracking-tight leading-none flex flex-wrap items-baseline gap-2">
                                    {movie.title}
                                    <span className="text-xl font-medium text-slate-400">({movie.year})</span>
                                </h1>
                                <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-amber-500/[0.08] border border-amber-500/10">
                                    <IoStar className="w-3.5 h-3.5 text-amber-500"/>
                                    <span className="text-xs font-bold text-amber-700">{movie.rating} Rating</span>
                                </div>
                            </div>

                            <div className="space-y-1">
                                <h3 className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Storyline</h3>
                                <p className="text-slate-600 font-medium text-sm leading-relaxed max-w-xl">{movie.description}</p>
                            </div>

                            <div className="flex flex-wrap items-center gap-x-6 gap-y-2 pt-1 text-slate-500 text-xs font-semibold">
                                <div className="flex items-center gap-1.5"><IoTimeOutline className="w-4 h-4 text-purple-500" /><span>{formatDuration(movie.duration)}</span></div>
                                <div className="flex items-center gap-1.5"><IoFilmOutline className="w-4 h-4 text-indigo-500" /><span>{movie.genre}</span></div>
                            </div>

                            <div className="flex flex-wrap items-center gap-3 pt-4 border-t border-slate-200/60">
                                <button onClick={handleWatchTrailer} className="h-10 px-5 rounded-xl text-[11px] font-bold text-slate-700 bg-white border border-slate-200 shadow-2xs hover:bg-slate-50 active:scale-98 transition-all flex items-center gap-1.5 cursor-pointer">
                            <IoPlay className="w-3.5 h-3.5 text-purple-600" /> Watch Trailer
                        </button>

                                {/* 💡 Buy Ticket Button */}
                                <button
                                    onClick={handleBooking}
                                    className="group relative h-10 px-6 rounded-xl text-[11px] font-bold text-white
                                               bg-gradient-to-r from-purple-600 to-indigo-600
                                               shadow-[0_4px_12px_rgba(124,58,237,0.15),inset_0_1px_1px_rgba(255,255,255,0.3)]
                                               hover:scale-105 hover:shadow-[0_8px_20px_rgba(124,58,237,0.25)]
                                               active:scale-98 transition-all duration-300 ease-out overflow-hidden flex items-center gap-1.5 cursor-pointer"
                                >
                                    <span className="absolute inset-x-0 top-0 h-[40%] bg-gradient-to-b from-white/20 to-transparent rounded-t-full pointer-events-none" />
                                    <span className="absolute -inset-full bg-gradient-to-r from-transparent via-white/20 to-transparent transform -skew-x-12 transition-all duration-1000 group-hover:left-full ease-out" />
                                    <IoTicket className="w-3.5 h-3.5 text-purple-200" />
                                    <span>Buy Ticket</span>
                                </button>

                                <button onClick={handleToggleFavorite} className={`h-10 w-10 rounded-xl border flex items-center justify-center transition-all active:scale-95 cursor-pointer shadow-2xs ${isFavorite ? "bg-rose-50 border-rose-200 text-rose-500" : "bg-white border-slate-200 text-slate-400 hover:text-rose-500 hover:border-rose-200"}`}>
                                    {isFavorite ? <IoHeart className="w-4 h-4" /> : <IoHeartOutline className="w-4 h-4"/>}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* 👥 Cast & Crew Section */}
                <div className="mt-14 pt-8 border-t border-slate-200/40">
                    <div className="flex items-center justify-between mb-6">
                        <h3 className="text-sm font-bold uppercase tracking-wider text-slate-400">Cast & Crew</h3>
                        <span className="text-[11px] font-bold text-purple-600 bg-purple-50 px-2 py-0.5 rounded-md">{movie.cast.length} People</span>
                    </div>
                    <div className="flex gap-x-6 overflow-x-auto pb-4 pt-1 select-none scrollbar-hide snap-x" style={{ scrollbarWidth: 'none', WebkitOverflowScrolling: 'touch' }}>
                        {movie.cast?.map((actor, index) => (
                            <div key={index} className="flex flex-col items-center text-center gap-2 shrink-0 w-20 snap-start group cursor-pointer">
                                <div className="w-16 h-16 rounded-full overflow-hidden border border-white shadow-xs bg-white p-0.5 transition-transform duration-300 group-hover:scale-105 group-hover:shadow-md">
                                    <img src={actor.avatarUrl} alt={actor.name} className="w-full h-full object-cover rounded-full" />
                                </div>
                                <div className="flex flex-col w-full px-1">
                                    <span className="text-[11px] font-bold text-slate-80 tracking-tight leading-tight transition-colors group-hover:text-purple-600 line-clamp-2">{actor.name}</span>
                                    <span className="text-[9px] font-medium text-slate-400 mt-0.5 leading-tight line-clamp-1">as {actor.characterName}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* 💡 You May Also Like Section */}
                <div className="mt-16 pt-8 border-t border-slate-200/40">
                    <h3 className="text-sm font-bold uppercase tracking-wider text-slate-400 mb-6">You May Also Like</h3>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 w-full">
                        {recommendedMovies.map((movie) => (
                            <div
                                key={movie.id}
                                onClick={() => navigate(`/movie/${movie.id}`)}
                                className="group relative flex flex-col h-full rounded-[1.8rem] p-3 overflow-hidden
                                           bg-white/60 backdrop-blur-xl
                                           border border-white/80 border-b-black/[0.04]
                                           shadow-[0_4px_12px_rgba(0,0,0,0.02),inset_0_1px_2px_rgba(255,255,255,0.6)]
                                           hover:shadow-[0_20px_40px_-12px_rgba(0,0,0,0.08)]
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
                                    <h3 className="text-base font-bold text-slate-80 line-clamp-1 tracking-tight mb-0.5 group-hover:text-purple-600 transition-colors">
                                        {movie.title}
                                    </h3>

                                    <p className="text-[11px] text-slate-500 font-medium leading-relaxed line-clamp-2 mb-3">
                                        {movie.description}
                                    </p>

                                    <div className="flex items-center justify-between gap-2 mt-auto">
                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                navigate(`/movie/${movie.id}`);
                                            }}
                                            className="group relative h-9 px-6 rounded-xl text-[11px] font-bold text-white
                                                       bg-gradient-to-r from-purple-600 to-indigo-600
                                                       shadow-[0_4px_12px_rgba(124,58,237,0.15),inset_0_1px_1px_rgba(255,255,255,0.3)]
                                                       hover:scale-105 hover:shadow-[0_8px_20px_rgba(124,58,237,0.25)]
                                                       active:scale-98
                                                       transition-all duration-300 ease-out overflow-hidden cursor-pointer flex items-center justify-center"
                                        >
                                            <span className="absolute inset-x-0 top-0 h-[40%] bg-gradient-to-b from-white/20 to-transparent rounded-t-full pointer-events-none"/>
                                            <span className="relative z-10">Get Ticket</span>
                                        </button>

                                        <div className="flex items-center gap-0.5 px-2 h-9 rounded-lg bg-amber-500/[0.06] border border-amber-500/15 shadow-[inset_0_1px_1px_rgba(255,255,255,0.3)] shrink-0">
                                            <IoStar className="w-3 h-3 text-amber-500"/>
                                            <span className="text-[11px] font-bold text-amber-700">{movie.rating}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

            </div>

            {/* Trailer Modal */}
            {showTrailerModal && selectedTrailer && (
                <div className="fixed inset-0 bg-black bg-opacity-80 z-50 flex items-center justify-center p-4">
                    <div className="relative w-full max-w-4xl">
                        <button 
                            onClick={() => setShowTrailerModal(false)} 
                            className="absolute -top-12 right-0 text-white hover:text-gray-300 transition-colors"
                        >
                            <IoClose className="w-8 h-8" />
                        </button>
                        <div className="aspect-video w-full">
                            <iframe
                                className="w-full h-full rounded-xl"
                                src={`https://www.youtube.com/embed/${selectedTrailer.youtubeId}?autoplay=1`}
                                title={selectedTrailer.title}
                                frameBorder="0"
                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                allowFullScreen
                            ></iframe>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default MovieDetails;