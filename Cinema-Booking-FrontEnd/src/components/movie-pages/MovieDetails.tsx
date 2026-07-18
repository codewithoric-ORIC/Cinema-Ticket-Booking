import { useParams, useNavigate, useLocation } from "react-router-dom";
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
    IoCalendarOutline,
    IoClose,
    IoLocationOutline
} from "react-icons/io5";
import { fetchMovieById, fetchShowtimesByMovieId, checkIsFavourite, addToFavourites, removeFromFavourites, type Movie, type Showtime, type Trailer, type Theater } from "../../service/MovieService";
import { fetchAllMovies } from "../../service/MovieService";

function MovieDetails() {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const location = useLocation();
    const { theaterId } = location.state || {};
    const [isFavorite, setIsFavorite] = useState<boolean>(false);
    const [selectedTheater, setSelectedTheater] = useState<Theater | null>(null);
    const [selectedDate, setSelectedDate] = useState<string>("");
    const [selectedShowtime, setSelectedShowtime] = useState<Showtime | null>(null);
    const [movie, setMovie] = useState<Movie | null>(null);
    const [showtimes, setShowtimes] = useState<Showtime[]>([]);
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

    // Generate dates for next 7 days
    const generateAvailableDates = () => {
        const dates = [];
        const today = new Date();
        const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
        
        for (let i = 0; i < 7; i++) {
            const date = new Date(today);
            date.setDate(today.getDate() + i);
            dates.push({
                id: i + 1,
                day: days[date.getDay()],
                date: `${date.getDate()} ${date.toLocaleString('default', { month: 'short' })}`,
                fullDate: date.toISOString().split('T')[0]
            });
        }
        return dates;
    };

    const AVAILABLE_DATES = generateAvailableDates();

    // Get unique theaters from showtimes
    const availableTheaters = () => {
        const uniqueTheaters = new Map<number, Theater>();
        showtimes.forEach(st => {
            if (!uniqueTheaters.has(st.theater.id)) {
                uniqueTheaters.set(st.theater.id, st.theater);
            }
        });
        return Array.from(uniqueTheaters.values());
    };

    // Get unique dates from showtimes for selected theater
    const availableDatesFromShowtimes = () => {
        const uniqueDates = new Set<string>();
        const filteredShowtimes = selectedTheater 
            ? showtimes.filter(st => st.theater.id === selectedTheater.id) 
            : showtimes;
        filteredShowtimes.forEach(st => uniqueDates.add(st.showDate));
        return AVAILABLE_DATES.filter(d => uniqueDates.has(d.fullDate));
    };

    // Get showtimes for selected theater and date
    const getShowtimesForDate = (date: string) => {
        const filteredShowtimes = selectedTheater 
            ? showtimes.filter(st => st.theater.id === selectedTheater.id) 
            : showtimes;
        return filteredShowtimes.filter(st => st.showDate === date);
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
                    
                    const showtimesData = await fetchShowtimesByMovieId(Number(id));
                    setShowtimes(showtimesData);

                    // If theaterId is passed in, pre-select that theater
                    if (theaterId) {
                        const theater = showtimesData.find(st => st.theater.id === Number(theaterId))?.theater;
                        if (theater) {
                            setSelectedTheater(theater);
                        }
                    }
                    
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
    }, [id, theaterId]);

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

    // 💡 This is where we pass data to Select Seat
    const handleBooking = () => {
        if (selectedShowtime) {
            const bookedDate = AVAILABLE_DATES.find(d => d.fullDate === selectedShowtime.showDate);
            if (bookedDate) {
                // Pass all necessary data
                navigate(`/select-seat/${movie.id}`, { 
                    state: { 
                        date: bookedDate.date, 
                        day: bookedDate.day,
                        showtime: selectedShowtime,
                        theater: selectedShowtime.theater
                    } 
                });
            }
        }
    };

    const handleToggleFavorite = async () => {
        if (!id) return;
        try {
            if (isFavorite) {
                await removeFromFavourites(Number(id));
                setIsFavorite(false);
            } else {
                await addToFavourites(Number(id));
                setIsFavorite(true);
            }
        } catch (e) {
            console.error("Failed to toggle favourite:", e);
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

            <div className="relative z-10 max-w-5xl mx-auto px-6">

                {/* Back Button */}
                <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-slate-500 hover:text-purple-600 font-bold text-sm mb-6 transition-colors cursor-pointer group">
                    <IoArrowBack className="w-4 h-4 transform group-hover:-translate-x-1 transition-transform"/> Back
                </button>

                {/* Main Split Layout Container */}
                <div className="grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-10 items-center">
                    {/* 📸 Left - Movie Image Poster */}
                    <div className="col-span-1 md:col-span-4 w-full aspect-[2/3] max-w-[280px] mx-auto rounded-[2rem] p-2 bg-white border border-slate-200/60 shadow-sm">
                        <div className="w-full h-full rounded-[1.6rem] overflow-hidden">
                            <img src={movie.imageUrl} alt={movie.title} className="w-full h-full object-cover" />
                        </div>
                    </div>

                    {/* 📝 Right - Movie Information */}
                    <div className="col-span-1 md:col-span-8 flex flex-col space-y-4 md:pl-2">
                        <div className="space-y-2">
                            <h1 className="text-2xl md:text-3xl lg:text-4xl font-black text-slate-90 tracking-tight leading-none flex flex-wrap items-baseline gap-2">
                                {movie.title}
                                <span className="text-lg md:text-xl font-medium text-slate-400">({movie.year})</span>
                            </h1>
                            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-amber-500/[0.08] border border-amber-500/10">
                                <IoStar className="w-3.5 h-3.5 text-amber-500"/>
                                <span className="text-xs font-bold text-amber-700">{movie.rating} Rating</span>
                            </div>
                        </div>

                        <div className="space-y-1">
                            <h3 className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Storyline</h3>
                            <p className="text-slate-600 font-medium text-xs md:text-sm leading-relaxed max-w-xl">{movie.description}</p>
                        </div>

                        <div className="flex flex-wrap items-center gap-x-6 gap-y-2 pt-1 text-slate-500 text-xs font-semibold">
                            <div className="flex items-center gap-1.5"><IoTimeOutline className="w-4 h-4 text-purple-500" /><span>{formatDuration(movie.duration)}</span></div>
                            <div className="flex items-center gap-1.5"><IoFilmOutline className="w-4 h-4 text-indigo-500" /><span>{movie.genre}</span></div>
                        </div>

                        <div className="flex flex-wrap items-center gap-3 pt-4 border-t border-slate-200/60">
                            <button onClick={handleWatchTrailer} className="h-10 px-5 rounded-xl text-[11px] font-bold text-slate-700 bg-white border border-slate-200 shadow-2xs hover:bg-slate-50 active:scale-98 transition-all flex items-center gap-1.5 cursor-pointer">
                        <IoPlay className="w-3.5 h-3.5 text-purple-600" /> Watch Trailer
                    </button>

                            {/* 💡 Buy Ticket Button added to Action Bar */}
                            <button
                                onClick={handleBooking}
                                disabled={!selectedShowtime}
                                className="group relative h-10 px-6 rounded-xl text-[11px] font-bold text-white
                                           bg-gradient-to-r from-purple-600 to-indigo-600
                                           shadow-[0_4px_12px_rgba(124,58,237,0.15),inset_0_1px_1px_rgba(255,255,255,0.3)]
                                           hover:scale-105 hover:shadow-[0_8px_20px_rgba(124,58,237,0.25)]
                                           active:scale-98 transition-all duration-300 ease-out overflow-hidden flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
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

                {/* 🎬 Choose Theater, Date & Book Now Section */}
                <div className="mt-10 pt-8 border-t border-slate-200/40 flex flex-col gap-6">
                    {/* Theater Selection */}
                    <div className="space-y-4 flex-grow max-w-xl">
                        <div className="flex items-center gap-2">
                            <IoLocationOutline className="w-4 h-4 text-purple-600" />
                            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-400">Choose Theater</h3>
                        </div>
                        <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide" style={{ scrollbarWidth: 'none' }}>
                            {availableTheaters().map((theater) => {
                                const isSelected = selectedTheater?.id === theater.id;
                                return (
                                    <button
                                        key={theater.id}
                                        onClick={() => {
                                            setSelectedTheater(theater);
                                            setSelectedDate("");
                                            setSelectedShowtime(null);
                                        }}
                                        className={`flex flex-col items-center justify-center p-2.5 min-w-[120px] h-[72px] rounded-2xl border transition-all duration-300 cursor-pointer text-center select-none
                                            ${isSelected
                                            ? "bg-gradient-to-b from-purple-600 to-indigo-600 border-purple-600 text-white shadow-md shadow-purple-600/10 scale-102"
                                            : "bg-white/80 border-slate-200/60 text-slate-700 hover:border-purple-300 hover:bg-white"
                                        }`}
                                    >
                                        <span className={`text-[10px] font-bold tracking-wide uppercase ${isSelected ? "text-purple-200" : "text-slate-400"}`}>
                                            {theater.location}
                                        </span>
                                        <span className="text-xs font-extrabold tracking-tight mt-1 line-clamp-1">
                                            {theater.name}
                                        </span>
                                    </button>
                                );
                            })}
                        </div>
                    </div>

                    {/* Date Selection */}
                    {selectedTheater && (
                        <div className="space-y-4 flex-grow max-w-xl">
                            <div className="flex items-center gap-2">
                                <IoCalendarOutline className="w-4 h-4 text-purple-600" />
                                <h3 className="text-sm font-bold uppercase tracking-wider text-slate-400">Choose Date</h3>
                            </div>
                            <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide" style={{ scrollbarWidth: 'none' }}>
                                {availableDatesFromShowtimes().map((d) => {
                                    const isSelected = selectedDate === d.fullDate;
                                    return (
                                        <button
                                            key={d.id}
                                            onClick={() => {
                                                setSelectedDate(d.fullDate);
                                                setSelectedShowtime(null);
                                            }}
                                            className={`flex flex-col items-center justify-center p-2.5 min-w-[64px] h-[72px] rounded-2xl border transition-all duration-300 cursor-pointer text-center select-none
                                                ${isSelected
                                                ? "bg-gradient-to-b from-purple-600 to-indigo-600 border-purple-600 text-white shadow-md shadow-purple-600/10 scale-102"
                                                : "bg-white/80 border-slate-200/60 text-slate-700 hover:border-purple-300 hover:bg-white"
                                            }`}
                                        >
                                            <span className={`text-[10px] font-bold tracking-wide uppercase ${isSelected ? "text-purple-200" : "text-slate-400"}`}>
                                                {d.day}
                                            </span>
                                            <span className="text-xs font-extrabold tracking-tight mt-1">
                                                {d.date}
                                            </span>
                                        </button>
                                    );
                                })}
                            </div>
                        </div>
                    )}
                    
                    {/* Showtimes Section */}
                    {selectedTheater && selectedDate && (
                        <div className="space-y-4 flex-grow max-w-xl">
                            <div className="flex items-center gap-2">
                                <IoTimeOutline className="w-4 h-4 text-purple-600" />
                                <h3 className="text-sm font-bold uppercase tracking-wider text-slate-400">Choose Showtime</h3>
                            </div>
                            <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide" style={{ scrollbarWidth: 'none' }}>
                                {getShowtimesForDate(selectedDate).map((st) => {
                                    const isSelected = selectedShowtime?.id === st.id;
                                    return (
                                        <button
                                            key={st.id}
                                            onClick={() => setSelectedShowtime(st)}
                                            className={`flex flex-col items-center justify-center px-5 py-3 rounded-2xl border transition-all duration-300 cursor-pointer text-center select-none min-w-[100px]
                                                ${isSelected
                                                ? "bg-gradient-to-b from-purple-600 to-indigo-600 border-purple-600 text-white shadow-md shadow-purple-600/10 scale-102"
                                                : "bg-white/80 border-slate-200/60 text-slate-700 hover:border-purple-300 hover:bg-white"
                                            }`}
                                        >
                                            <span className="text-xs font-bold tracking-tight">
                                                {st.showTime}
                                            </span>
                                            <span className={`text-[10px] font-medium ${isSelected ? "text-purple-200" : "text-slate-400"} mt-1`}>
                                                {st.theater.name}
                                            </span>
                                        </button>
                                    );
                                })}
                            </div>
                        </div>
                    )}
                    
                    {/* Book Now Button */}
                    <div className="shrink-0 w-full md:w-auto">
                        <button
                            onClick={handleBooking}
                            disabled={!selectedShowtime}
                            className="group relative h-12 w-full md:w-52 rounded-2xl text-xs font-black text-white tracking-wider uppercase
                                       bg-gradient-to-r from-purple-600 to-indigo-600
                                       shadow-[0_6px_20px_rgba(124,58,237,0.2)] hover:scale-102 active:scale-98
                                       transition-all duration-300 overflow-hidden flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                        >
                            <span className="absolute inset-x-0 top-0 h-[40%] bg-gradient-to-b from-white/20 to-transparent rounded-t-full pointer-events-none" />
                            <span className="absolute -inset-full bg-gradient-to-r from-transparent via-white/10 to-transparent transform -skew-x-12 transition-all duration-1000 group-hover:left-full ease-out" />
                            <IoTicket className="w-4 h-4 text-purple-200 group-hover:rotate-12 transition-transform" />
                            <span>Book Now</span>
                        </button>
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