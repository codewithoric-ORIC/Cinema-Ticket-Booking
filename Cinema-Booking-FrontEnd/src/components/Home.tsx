import {useState, useEffect} from "react";
import {useNavigate} from "react-router-dom";
import {
    IoCalendarOutline,
    IoTimeOutline,
    IoTicketOutline,
    IoChevronBackOutline,
    IoChevronForwardOutline
} from "react-icons/io5";
import MovieList from "./MovieList";
import UpcomingReleases from "./UpcomingReleases";
import MovieTrailers from "./MovieTrailers";
import {fetchCurrentMovies, type Movie} from "../service/MovieService";

function Home() {
    const navigate = useNavigate();
    const [currentIndex, setCurrentIndex] = useState<number>(0);
    const [isAnimating, setIsAnimating] = useState<boolean>(false);
    const [featuredMovies, setFeaturedMovies] = useState<Movie[]>([]);
    const [loading, setLoading] = useState(true);
    const currentMovie = featuredMovies[currentIndex];

    useEffect(() => {
        const loadFeaturedMovies = async () => {
            try {
                const data = await fetchCurrentMovies();
                setFeaturedMovies(data.slice(0, 3)); // Take first 3 current movies as featured
            } catch (error) {
                console.error("Failed to load featured movies:", error);
            } finally {
                setLoading(false);
            }
        };
        loadFeaturedMovies();
    }, []);

    const formatDate = (dateStr: string): string => {
        const date = new Date(dateStr);
        return date.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
    };

    const formatTime = (duration: number): string => {
        const hours = Math.floor(duration / 60);
        const minutes = duration % 60;
        return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')} PM`;
    };

    useEffect(() => {
        const animationFrame = requestAnimationFrame(() => {
            setIsAnimating(true);
        });

        const timer = setTimeout(() => {
            setIsAnimating(false);
        }, 600);

        return () => {
            cancelAnimationFrame(animationFrame);
            clearTimeout(timer);
        };
    }, [currentIndex]);

    useEffect(() => {
        const autoPlayTimer = setInterval(() => {
            if (!isAnimating && featuredMovies.length > 0) {
                setCurrentIndex((prev) => (prev + 1) % featuredMovies.length);
            }
        }, 5000);
        return () => clearInterval(autoPlayTimer);
    }, [currentIndex, isAnimating, featuredMovies]);

    const nextSlide = () => {
        if (isAnimating || featuredMovies.length === 0) return;
        setCurrentIndex((prev) => (prev + 1) % featuredMovies.length);
    };

    const prevSlide = () => {
        if (isAnimating || featuredMovies.length === 0) return;
        setCurrentIndex((prev) => (prev - 1 + featuredMovies.length) % featuredMovies.length);
    };

    if (loading) {
        return (
            <div className="w-full min-h-screen bg-slate-50 flex items-center justify-center">
                <p className="text-sm text-slate-500">Loading home page...</p>
            </div>
        );
    }

    if (!currentMovie) {
        return (
            <div className="w-full min-h-screen bg-slate-50 flex items-center justify-center">
                <p className="text-sm text-slate-500">No movies available</p>
            </div>
        );
    }

    return (
        <div className="w-full min-h-screen bg-slate-50 overflow-x-hidden">
            <section
                className="w-full min-h-screen relative flex items-center px-6 pt-28 pb-20 transition-all duration-1000 ease-in-out bg-cover bg-center overflow-hidden"
                style={{backgroundImage: `url(${currentMovie.imageUrl})`}}
            >
                <div className="absolute inset-0 backdrop-blur-xl bg-white/40 transition-all duration-90"/>
                <div className="absolute inset-0 bg-gradient-to-t from-white via-white/80 to-white/40"/>

                <div
                    className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center w-full max-w-7xl mx-auto">
                    <div className="lg:col-span-7 flex flex-col justify-center space-y-6 order-2 lg:order-1">
                        <div className="inline-flex items-center self-start px-4 py-1.5 rounded-full
                                        bg-purple-600/[0.08] border border-purple-500/20 shadow-sm backdrop-blur-md">
                            <span
                                className="text-xs font-bold uppercase tracking-widest text-purple-700">Now Showing</span>
                        </div>

                        <h1 className={`text-4xl md:text-5xl lg:text-6xl font-black text-slate-900 tracking-tight leading-none
                                        transition-all duration-500 transform ease-out
                                        ${isAnimating ? 'opacity-0 -translate-y-4 blur-xs' : 'opacity-100 translate-y-0 blur-none'}`}>
                            {currentMovie.title}
                        </h1>

                        <p className={`text-base text-slate-600 font-semibold leading-relaxed max-w-2xl
                                       transition-all duration-500 delay-75 transform ease-out
                                       ${isAnimating ? 'opacity-0 -translate-y-2' : 'opacity-100 translate-y-0'}`}>
                            {currentMovie.description}
                        </p>

                        <div className={`flex flex-wrap gap-4 pt-2 transition-all duration-500 delay-150 transform ease-out
                                        ${isAnimating ? 'opacity-0 scale-95' : 'opacity-100 scale-100'}`}>
                            <div className="flex items-center gap-2.5 px-5 py-3 rounded-2xl
                                            bg-white/60 border border-white/40 backdrop-blur-xl
                                            shadow-[0_8px_20px_rgba(0,0,0,0.03),inset_0_1px_2px_rgba(255,255,255,0.6)]">
                                <IoTimeOutline className="w-5 h-5 text-purple-600"/>
                                <div className="flex flex-col">
                                    <span
                                        className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Showtime</span>
                                    <span className="text-sm font-bold text-slate-800">{formatTime(currentMovie.duration)}</span>
                                </div>
                            </div>

                            <div className="flex items-center gap-2.5 px-5 py-3 rounded-2xl
                                            bg-white/60 border border-white/40 backdrop-blur-xl
                                            shadow-[0_8px_20px_rgba(0,0,0,0.03),inset_0_1px_2px_rgba(255,255,255,0.6)]">
                                <IoCalendarOutline className="w-5 h-5 text-indigo-600"/>
                                <div className="flex flex-col">
                                    <span
                                        className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Date</span>
                                    <span className="text-sm font-bold text-slate-800">{formatDate(currentMovie.releaseDate)}</span>
                                </div>
                            </div>
                        </div>

                        <div className="pt-4">
                            <button onClick={() => navigate('/theaters')} className="group relative h-12 px-8 rounded-full font-bold text-sm tracking-wide text-white
                                               bg-gradient-to-r from-purple-600 to-indigo-600
                                               shadow-[0_8px_24px_rgba(124,58,237,0.25),inset_0_1px_1px_rgba(255,255,255,0.3)]
                                               hover:scale-105 hover:shadow-[0_16px_32px_rgba(124,58,237,0.35)]
                                               active:scale-98
                                               transition-all duration-300 ease-out overflow-hidden flex items-center gap-2 cursor-pointer">
                                <span
                                    className="absolute inset-x-0 top-0 h-[40%] bg-gradient-to-b from-white/20 to-transparent rounded-t-full pointer-events-none"></span>
                                <span
                                    className="absolute -inset-full bg-gradient-to-r from-transparent via-white/20 to-transparent transform -skew-x-12 transition-all duration-1000 group-hover:left-full ease-out"></span>
                                <IoTicketOutline className="w-4 h-4" />
                                <span className="relative z-10">Book Tickets Now</span>
                            </button>
                        </div>
                    </div>

                    <div className="lg:col-span-5 flex flex-col items-center order-1 lg:order-2">
                        <div className="relative w-full max-w-[340px] aspect-[2/3] group rounded-[2.5rem] p-3
                                        bg-white/40 backdrop-blur-xl border border-white/80
                                        shadow-[0_32px_64px_-20px_rgba(0,0,0,0.08),inset_0_1px_2px_rgba(255,255,255,0.5)]">

                            <div className="w-full h-full rounded-[2.5rem] overflow-hidden relative
                                bg-slate-500/[0.06] backdrop-blur-xl
                                border border-black/[0.06]
                                shadow-[0_8px_24px_rgba(0,0,0,0.04),inset_0_1px_2px_rgba(255,255,255,0.8)]">

                                <img
                                    key={currentMovie.id}
                                    src={currentMovie.imageUrl}
                                    alt={currentMovie.title}
                                    className={`w-full h-full object-cover transform transition-all duration-700 ease-[cubic-bezier(0.34,1.56,0.64,1)]
                                        ${isAnimating ? 'scale-95 opacity-40 blur-xs' : 'scale-100 opacity-100 blur-none'}
                                        group-hover:scale-105`}
                                />

                                <div
                                    className="absolute inset-0 bg-gradient-to-t from-black/10 via-transparent to-transparent pointer-events-none"/>
                            </div>

                            <button
                                onClick={prevSlide}
                                className="absolute left-6 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full flex items-center justify-center
                                           bg-slate-500/[0.06] backdrop-blur-xl border border-black/[0.06]
                                           text-slate-100 opacity-0 group-hover:opacity-100
                                           shadow-[0_4px_12px_rgba(0,0,0,0.05),inset_0_1px_1px_rgba(255,255,255,0.8)]
                                           hover:bg-slate-500/[0.1] hover:scale-110 active:scale-95
                                           transition-all duration-300 cursor-pointer z-20"
                            >
                                <IoChevronBackOutline className="w-5 h-5" />
                            </button>

                            <button
                                onClick={nextSlide}
                                className="absolute right-6 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full flex items-center justify-center
                                           bg-slate-500/[0.06] backdrop-blur-xl border border-black/[0.06]
                                            text-slate-100 opacity-0 group-hover:opacity-100
                                            shadow-[0_4px_12px_rgba(0,0,0,0.05),inset_0_1px_1px_rgba(255,255,255,0.8)]
                                           hover:bg-slate-500/[0.1] hover:scale-110 active:scale-95
                                           transition-all duration-300 cursor-pointer z-20"
                            >
                                <IoChevronForwardOutline className="w-5 h-5" />
                            </button>

                            <div className="absolute -bottom-6 flex gap-2 left-1/2 -translate-x-1/2">
                                {featuredMovies.map((_, idx) => (
                                    <button
                                        key={idx}
                                        onClick={() => !isAnimating && setCurrentIndex(idx)}
                                        className={`h-2 rounded-full transition-all duration-300 cursor-pointer ${
                                            idx === currentIndex ? 'w-6 bg-purple-600' : 'w-2 bg-slate-300 hover:bg-slate-400'
                                        }`}
                                    />
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <div className="relative z-20 bg-slate-50 overflow-hidden pb-24">
                <div
                    className="absolute top-1/4 left-[10%] w-80 h-80 bg-purple-400/15 rounded-full blur-[100px] pointer-events-none"/>
                <div
                    className="absolute bottom-1/3 right-[5%] w-96 h-96 bg-indigo-400/20 rounded-full blur-[120px] pointer-events-none"/>
                <div
                    className="absolute top-1/2 left-1/3 w-72 h-72 bg-pink-400/10 rounded-full blur-[90px] pointer-events-none"/>

                <div className="flex flex-col gap-12 pt-8">

                    <div className="w-full">
                        <MovieList/>
                    </div>

                    <div className="w-full">
                        <MovieTrailers/>
                    </div>

                    <div className="w-full">
                        <UpcomingReleases/>
                    </div>

                </div>
            </div>
        </div>
    );
}

export default Home;
