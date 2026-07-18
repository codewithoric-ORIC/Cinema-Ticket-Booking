import {useState, useEffect} from "react";
import {IoStar, IoChevronForward} from "react-icons/io5";
import {Link, useNavigate} from "react-router-dom";
import {fetchCurrentMovies, type Movie} from "../service/MovieService";

function MovieList() {
    const navigate = useNavigate();
    const [visibleCount, setVisibleCount] = useState<number>(4);
    const [movies, setMovies] = useState<Movie[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadMovies = async () => {
            try {
                const data = await fetchCurrentMovies();
                setMovies(data);
            } catch (error) {
                console.error("Failed to load current movies:", error);
            } finally {
                setLoading(false);
            }
        };
        loadMovies();
    }, []);

    const handleShowMore = () => {
        setVisibleCount((prev) => prev + 4);
    };

    if (loading) {
        return (
            <section className="w-full max-w-7xl mx-auto px-6 md:px-8 py-8">
                <div className="flex items-center justify-center py-12">
                    <p className="text-sm text-slate-500">Loading movies...</p>
                </div>
            </section>
        );
    }

    return (
        <section className="w-full max-w-7xl mx-auto px-6 md:px-8 py-8">

            <div className="flex items-center justify-between mb-8">
                <div className="flex flex-col gap-1">
                    <h2 className="text-xl md:text-2xl font-black text-slate-800 tracking-tight">
                        Now in Theaters
                    </h2>
                    <p className="text-xs text-slate-500 font-medium">Explore current blockbusters</p>
                </div>

                <Link to="/movies" className="flex items-center gap-1 text-xs font-bold text-purple-600 hover:text-indigo-600
                                   bg-purple-500/[0.04] hover:bg-purple-500/[0.08] px-3.5 py-2 rounded-full
                                   transition-all duration-300 group cursor-pointer">
                    View All
                    <IoChevronForward className="w-3.5 h-3.5 transform group-hover:translate-x-1 transition-transform"/>
                </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 max-w-6xl mx-auto">
                {movies.slice(0, visibleCount).map((movie) => (
                    <div
                        key={movie.id}
                        className="group relative flex flex-col h-full rounded-[1.8rem] p-3 overflow-hidden
                                   bg-white/60 backdrop-blur-xl
                                   border border-white/80 border-b-black/[0.04]
                                   shadow-[0_4px_12px_rgba(0,0,0,0.02),inset_0_1px_1px_rgba(255,255,255,0.6)]
                                   hover:shadow-[0_20px_40px_-12px_rgba(0,0,0,0.06)]
                                   hover:-translate-y-1 transition-all duration-400 ease-out"
                    >
                        <div
                            className="absolute inset-x-0 top-0 h-[35%] bg-gradient-to-b from-white/30 via-white/[0.02] to-transparent pointer-events-none z-10"/>

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
                                {movie.description}
                            </p>

                            <div className="flex items-center justify-between gap-2 mt-auto">
                                <button onClick={() => navigate('/theaters')} className="group relative h-9 px-6 rounded-xl text-[11px] font-bold text-white
                                   bg-gradient-to-r from-purple-600 to-indigo-600
                                   shadow-[0_4px_12px_rgba(124,58,237,0.15),inset_0_1px_1px_rgba(255,255,255,0.3)]
                                   hover:scale-105 hover:shadow-[0_8px_20px_rgba(124,58,237,0.25)]
                                   active:scale-98
                                   transition-all duration-300 ease-out overflow-hidden cursor-pointer flex items-center justify-center">

                                    <span
                                        className="absolute inset-x-0 top-0 h-[40%] bg-gradient-to-b from-white/20 to-transparent rounded-t-full pointer-events-none"></span>

                                    <span
                                        className="absolute -inset-full bg-gradient-to-r from-transparent via-white/20 to-transparent transform -skew-x-12 transition-all duration-1000 group-hover:left-full ease-out"></span>

                                    <span className="relative z-10">Get Ticket</span>
                                </button>

                                {movie.rating > 0 && (
                                    <div
                                        className="flex items-center gap-0.5 px-2 h-9 rounded-lg bg-amber-500/[0.06] border border-amber-500/15 shadow-[inset_0_1px_1px_rgba(255,255,255,0.3)] shrink-0">
                                        <IoStar className="w-3 h-3 text-amber-500"/>
                                        <span className="text-[11px] font-bold text-amber-700">{movie.rating}</span>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {movies.length > visibleCount && (
                <div className="flex justify-center mt-8">
                    <button
                        onClick={handleShowMore}
                        className="h-9 px-6 rounded-full text-[11px] font-bold text-slate-600 tracking-wide
                                   bg-white/80 backdrop-blur-md border border-slate-200/60 shadow-xs
                                   hover:bg-purple-600 hover:text-white hover:border-purple-600 hover:shadow-md
                                   active:scale-98 transition-all duration-300 cursor-pointer"
                    >
                        Show More
                    </button>
                </div>
            )}

        </section>
    );
}

export default MovieList;
