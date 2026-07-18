import { useEffect, useState, useRef } from "react";
import { fetchAllMovies, fetchAllShowtimes, fetchAllBookings } from "../service/AdminService";
import { fetchCurrentMovies, type Movie } from "../../service/MovieService";
import { IoChevronBackOutline, IoChevronForwardOutline } from "react-icons/io5";

function AdminDashboard() {
  const [movieCount, setMovieCount] = useState(0);
  const [showCount, setShowCount] = useState(0);
  const [bookingCount, setBookingCount] = useState(0);
  const [currentMovies, setCurrentMovies] = useState<Movie[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [isClient, setIsClient] = useState(false);
  const carouselRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    const loadData = async () => {
      try {
        const [movies, shows, bookings, currentMoviesData] = await Promise.all([
          fetchAllMovies(),
          fetchAllShowtimes(),
          fetchAllBookings(),
          fetchCurrentMovies(),
        ]);
        setMovieCount(movies.length);
        setShowCount(shows.length);
        setBookingCount(bookings.length);
        setCurrentMovies(currentMoviesData);
      } catch (e) {
        console.error("Failed to load dashboard data", e);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  // Helper function to get cards per view safely
  const getCardsPerView = () => {
    if (!isClient) return 3;
    return window.innerWidth >= 1024 ? 3 : window.innerWidth >= 768 ? 2 : 1;
  };

  // Helper function to get card width safely
  const getCardWidth = () => {
    if (!isClient) return 240;
    if (window.innerWidth >= 1024) return 240; // Desktop: 240px
    if (window.innerWidth >= 768) return 280; // Tablet: 280px
    return window.innerWidth - 48; // Mobile: full width minus padding
  };

  const [cardWidth, setCardWidth] = useState(240);
  const cardsPerView = getCardsPerView();

  // Update card width when client is ready or window resizes
  useEffect(() => {
    if (isClient) {
      setCardWidth(getCardWidth());
      const handleResize = () => setCardWidth(getCardWidth());
      window.addEventListener("resize", handleResize);
      return () => window.removeEventListener("resize", handleResize);
    }
  }, [isClient]);

  const handleNext = () => {
    if (!isClient) return;
    if (currentIndex < currentMovies.length - cardsPerView) {
      setCurrentIndex(prev => prev + 1);
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex(prev => prev - 1);
    }
  };

  // Auto-scroll every 5 seconds
  useEffect(() => {
    if (!isClient) return;
    const interval = setInterval(() => {
      const currentCardsPerView = getCardsPerView();
      if (currentIndex < currentMovies.length - currentCardsPerView) {
        handleNext();
      } else {
        setCurrentIndex(0);
      }
    }, 5000);
    return () => clearInterval(interval);
  }, [currentIndex, currentMovies.length, isClient]);

  // Handle window resize to adjust cards per view
  useEffect(() => {
    if (!isClient) return;
    const handleResize = () => {
      const currentCardsPerView = getCardsPerView();
      if (currentIndex > currentMovies.length - currentCardsPerView) {
        setCurrentIndex(Math.max(0, currentMovies.length - currentCardsPerView));
      }
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [currentIndex, currentMovies.length, isClient]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <p className="text-slate-500">Loading dashboard...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-800 tracking-tight">Dashboard</h1>
          <p className="text-slate-500 mt-1 text-sm font-medium">Welcome back! Here's what's happening.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <div className="rounded-2xl bg-white/60 backdrop-blur-xl border border-white/80 p-6 shadow-[0_8px_24px_rgba(0,0,0,0.04),inset_0_1px_2px_rgba(255,255,255,0.8)] hover:shadow-[0_16px_48px_-12px_rgba(124,58,237,0.15),inset_0_1px_2px_rgba(255,255,255,0.9)] transition-all duration-300 hover:-translate-y-1">
          <div className="text-4xl font-extrabold bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent">
            {movieCount}
          </div>
          <div className="text-xs font-semibold text-slate-600 mt-2 tracking-wide">Total Movies</div>
        </div>

        <div className="rounded-2xl bg-white/60 backdrop-blur-xl border border-white/80 p-6 shadow-[0_8px_24px_rgba(0,0,0,0.04),inset_0_1px_2px_rgba(255,255,255,0.8)] hover:shadow-[0_16px_48px_-12px_rrgba(124,58,237,0.15),inset_0_1px_2px_rgba(255,255,255,0.9)] transition-all duration-300 hover:-translate-y-1">
          <div className="text-4xl font-extrabold bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent">
            {showCount}
          </div>
          <div className="text-xs font-semibold text-slate-600 mt-2 tracking-wide">Total Shows</div>
        </div>

        <div className="rounded-2xl bg-white/60 backdrop-blur-xl border border-white/80 p-6 shadow-[0_8px_24px_rgba(0,0,0,0.04),inset_0_1px_2px_rgba(255,255,255,0.8)] hover:shadow-[0_16px_48px_-12px_rgba(124,58,237,0.15),inset_0_1px_2px_rgba(255,255,255,0.9)] transition-all duration-300 hover:-translate-y-1">
          <div className="text-4xl font-extrabold bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent">
            {bookingCount}
          </div>
          <div className="text-xs font-semibold text-slate-600 mt-2 tracking-wide">Total Bookings</div>
        </div>
      </div>

      {/* Current Movies Section with Carousel */}
      {currentMovies.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-extrabold text-slate-800 tracking-tight">Now Showing</h2>
            <div className="flex gap-2">
              <button
                onClick={handlePrev}
                disabled={currentIndex === 0}
                className="p-2.5 rounded-full bg-white/60 backdrop-blur-xl border border-white/80 text-slate-700 hover:bg-purple-600 hover:text-white hover:border-purple-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300"
              >
                <IoChevronBackOutline className="w-5 h-5" />
              </button>
              <button
                onClick={handleNext}
                disabled={currentIndex >= currentMovies.length - cardsPerView}
                className="p-2.5 rounded-full bg-white/60 backdrop-blur-xl border border-white/80 text-slate-700 hover:bg-purple-600 hover:text-white hover:border-purple-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300"
              >
                <IoChevronForwardOutline className="w-5 h-5" />
              </button>
            </div>
          </div>

          <div className="relative overflow-hidden rounded-2xl bg-white/40 backdrop-blur-2xl border border-white/80 p-5">
            <div
              ref={carouselRef}
              className="flex gap-5 transition-transform duration-500 ease-out"
              style={{ transform: `translateX(-${currentIndex * (cardWidth + 20)}px)` }}
            >
              {currentMovies.map((movie) => (
                <div
                  key={movie.id}
                  className="flex-shrink-0 rounded-xl bg-white/60 backdrop-blur-xl border border-white/80 p-3.5 shadow-[0_8px_24px_rgba(0,0,0,0.04),inset_0_1px_2px_rgba(255,255,255,0.8)] hover:shadow-[0_16px_48px_-12px_rgba(124,58,237,0.15),inset_0_1px_2px_rgba(255,255,255,0.9)] transition-all duration-300 hover:-translate-y-1"
                  style={{ width: `${cardWidth}px` }}
                >
                  <div className="w-full aspect-[4/5] rounded-lg overflow-hidden mb-3">
                    <img
                      src={movie.imageUrl}
                      alt={movie.title}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = "https://placehold.co/400x500/e2e8f0/64748b?text=No+Image";
                      }}
                    />
                  </div>
                  <h3 className="text-base font-bold text-slate-800 line-clamp-1">{movie.title}</h3>
                  <p className="text-xs text-slate-500 line-clamp-2 mt-1.5">{movie.description}</p>
                  <div className="flex items-center gap-1.5 mt-3">
                    <div className="px-2.5 py-0.5 rounded-full bg-purple-100/70 text-purple-700 text-[10px] font-bold">
                      {movie.genre}
                    </div>
                    <div className="px-2.5 py-0.5 rounded-full bg-amber-100/70 text-amber-700 text-[10px] font-bold">
                      ⭐ {movie.rating.toFixed(1)}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default AdminDashboard;
