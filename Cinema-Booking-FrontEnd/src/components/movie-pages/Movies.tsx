import { useState, useEffect } from "react";
import { IoStar, IoHeartOutline, IoHeart } from "react-icons/io5";
import { useNavigate } from "react-router-dom";
import { fetchAllMovies, type Movie, checkIsFavourite, addToFavourites, removeFromFavourites } from "../../service/MovieService";
import { isLoggedIn } from "../../auth/service/AuthService";

function Movies() {
  const navigate = useNavigate();
  const [visibleCount, setVisibleCount] = useState<number>(4);
  const [movies, setMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(true);
  const [favourites, setFavourites] = useState<number[]>([]);

  useEffect(() => {
    const loadMoviesAndFavourites = async () => {
      try {
        const data = await fetchAllMovies();
        setMovies(data);
        // Load favourite status for each movie
        const favouriteStatuses = await Promise.all(
          data.map(async (movie) => {
            try {
              const isFav = await checkIsFavourite(movie.id);
              return isFav ? movie.id : null;
            } catch (e) {
                return null;
            }
          })
        );
        setFavourites(favouriteStatuses.filter((id) => id !== null) as number[]);
      } catch (e) {
        console.error("Failed to load movies:", e);
      } finally {
        setLoading(false);
      }
    };
    loadMoviesAndFavourites();
  }, []);

  const handleShowMore = () => {
    setVisibleCount((prev) => prev + 4);
  };

  return (
    <div className="w-full min-h-screen bg-slate-100 overflow-x-hidden relative">
      {/* BACKGROUND ART */}
      <div className="absolute top-1/4 left-[-5%] w-[500px] h-[500px] bg-purple-500/15 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute top-2/3 right-[-5%] w-[500px] h-[500px] bg-indigo-500/15 rounded-full blur-[140px] pointer-events-none" />

      <div className="relative z-10 max-w-7xl mx-auto px-6 pt-28 pb-20">
        {/* PAGE HEADER */}
        <div className="mb-8 space-y-2">
          <div className="inline-flex items-center px-4 py-1.5 rounded-full
                          bg-purple-600/[0.08] border border-purple-500/20 shadow-sm backdrop-blur-md">
            <span className="text-xs font-bold uppercase tracking-widest text-purple-700">Explore</span>
          </div>

          <h1 className="text-4xl font-black text-slate-900 tracking-tight leading-none">
            All Movies Collection
          </h1>

          <p className="text-slate-500 text-sm font-semibold max-w-xl leading-relaxed">
            Discover the latest blockbusters, cinematic masterworks, and your next favorite stories all in one place.
          </p>
        </div>

        {/* 💡 LIQUID GLASS CONTAINER
            (ပြင်ဆင်ချက် - အပြင်ဘက် Container ရဲ့ border-*, shadow-[...,inset_...] တွေကို ဖြုတ်ပေးလိုက်လို့ ပုံစံ ရှင်းရှင်းလေး ဖြစ်သွားပါပြီ) */}
        <div className="w-full -mt-2 rounded-[2.5rem] bg-white/40 backdrop-blur-2xl p-6 md:p-8">
          {loading ? (
            <div className="flex items-center justify-center py-16">
              <p className="text-slate-500">Loading movies...</p>
            </div>
          ) : (
            <>
              {/* MOVIES GRID */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
                {movies.slice(0, visibleCount).map((movie) => (
                  <div
                    key={movie.id}
                    onClick={() => navigate(`/movie/${movie.id}`)}
                    className="group relative flex flex-col h-full rounded-[1.8rem] p-3 overflow-hidden
                               bg-white/60 backdrop-blur-xl
                               border border-white/80 border-b-black/[0.04]
                               shadow-[0_4px_12px_rgba(0,0,0,0.02),inset_0_1px_2px_rgba(255,255,255,0.6)]
                               hover:shadow-[0_20px_40px_-12px_rgba(0,0,0,0.06)]
                               hover:-translate-y-1 transition-all duration-400 ease-out cursor-pointer"
                  >
                    {/* Soft Top Highlight Overlay */}
                    <div className="absolute inset-x-0 top-0 h-[35%] bg-gradient-to-b from-white/30 via-white/[0.02] to-transparent pointer-events-none z-10"/>

                    {/* Image Frame */}
                    <div className="w-full aspect-[4/5] rounded-[1.4rem] overflow-hidden relative mb-3 z-0">
                      <img
                        src={movie.imageUrl}
                        alt={movie.title}
                        className="w-full h-full object-cover transform scale-100 group-hover:scale-105 transition-transform duration-700 ease-out"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = "https://placehold.co/200x300/e2e8f0/64748b?text=No+Image";
                        }}
                      />
                    </div>

                    {/* Text Content */}
                    <div className="flex flex-col flex-grow px-1.5 pb-1.5 relative z-10">
                      <h3 className="text-base font-bold text-slate-800 line-clamp-1 tracking-tight mb-0.5 group-hover:text-purple-600 transition-colors">
                        {movie.title}
                      </h3>

                      <p className="text-[11px] text-slate-500 font-medium leading-relaxed line-clamp-2 mb-3">
                        {movie.description}
                      </p>

                      {/* CARD FOOTER */}
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
                          <span className="absolute inset-x-0 top-0 h-[40%] bg-gradient-to-b from-white/20 to-transparent rounded-t-full pointer-events-none"></span>
                          <span className="absolute -inset-full bg-gradient-to-r from-transparent via-white/20 to-transparent transform -skew-x-12 transition-all duration-1000 group-hover:left-full ease-out"></span>
                          <span className="relative z-10">Get Ticket</span>
                        </button>

                        <div className="flex items-center gap-2">
                          <div className="flex items-center gap-0.5 px-2 h-9 rounded-lg bg-amber-500/[0.06] border border-amber-500/15 shadow-[inset_0_1px_1px_rgba(255,255,255,0.3)] shrink-0">
                            <IoStar className="w-3 h-3 text-amber-500"/>
                            <span className="text-[11px] font-bold text-amber-700">{movie.rating}</span>
                          </div>
                          <button
                            onClick={async (e) => {
                              e.stopPropagation();
                              if (!isLoggedIn()) {
                                alert("Please log in to add favourites!");
                                return;
                              }
                              const isCurrentlyFavourite = favourites.includes(movie.id);
                              try {
                                if (isCurrentlyFavourite) {
                                  await removeFromFavourites(movie.id);
                                  setFavourites(favourites.filter(id => id !== movie.id));
                                } else {
                                  await addToFavourites(movie.id);
                                  setFavourites([...favourites, movie.id]);
                                }
                              } catch (err) {
                                console.error("Failed to toggle favourite:", err);
                              }
                            }}
                            className="p-2 rounded-lg bg-purple-500/[0.06] border border-purple-500/15 hover:bg-purple-600 hover:text-white transition-all"
                          >
                            {favourites.includes(movie.id) ? (
                              <IoHeart className="w-4 h-4" />
                            ) : (
                              <IoHeartOutline className="w-4 h-4" />
                            )}
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* SHOW MORE ACTIONS */}
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
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default Movies;
