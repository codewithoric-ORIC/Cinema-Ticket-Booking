import { useState, useEffect } from "react";
import { IoPlayCircle, IoChevronForward, IoFilmOutline } from "react-icons/io5";
import { fetchAllTrailers, type Trailer } from "../service/MovieService";

function MovieTrailers() {
    const [activeIndex, setActiveIndex] = useState<number>(0);
    const [trailers, setTrailers] = useState<Trailer[]>([]);
    const [loading, setLoading] = useState(true);
    const activeTrailer = trailers[activeIndex];

    useEffect(() => {
        const loadTrailers = async () => {
            try {
                const data = await fetchAllTrailers();
                setTrailers(data);
            } catch (error) {
                console.error("Failed to load trailers:", error);
            } finally {
                setLoading(false);
            }
        };
        loadTrailers();
    }, []);

    useEffect(() => {
        const handleMessage = (event: MessageEvent) => {
            if (event.origin !== "https://www.youtube.com") return;

            try {
                const data = JSON.parse(event.data);
                if (data.event === "infoDelivery" && data.info && data.info.playerState === 0) {
                    setActiveIndex((prevIndex) => (prevIndex + 1) % Math.min(trailers.length, 4));
                }
            } catch {
                // Ignore non-JSON messages from YouTube
            }
        };

        window.addEventListener("message", handleMessage);
        return () => window.removeEventListener("message", handleMessage);
    }, [trailers]);

    if (loading) {
        return (
            <section className="w-full max-w-7xl mx-auto px-6 pb-0 relative z-10">
                <div className="flex items-center justify-center py-12">
                    <p className="text-sm text-slate-500">Loading trailers...</p>
                </div>
            </section>
        );
    }

    return (
        <section className="w-full max-w-7xl mx-auto px-6 pb-0 relative z-10">
            <div className="flex items-center justify-between mb-8">
                <div className="flex flex-col gap-1">
                    <h2 className="text-xl md:text-2xl font-black text-slate-800 tracking-tight">
                        Official Movie Trailers
                    </h2>
                    <p className="text-xs text-slate-500 font-medium">Watch the latest clips and featurettes</p>
                </div>

                <button className="flex items-center gap-1 text-xs font-bold text-purple-600 hover:text-indigo-600
                                        bg-purple-500/[0.04] hover:bg-purple-500/[0.08] px-3.5 py-2 rounded-full
                                        transition-all duration-300 group cursor-pointer">
                    View All Clips
                    <IoChevronForward className="w-3.5 h-3.5 transform group-hover:translate-x-1 transition-transform" />
                </button>
            </div>

            {activeTrailer && (
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 max-w-6xl mx-auto">
                    <div className="lg:col-span-8 flex flex-col w-full rounded-[2rem] p-3
                                        backdrop-blur-2xl border border-white/80
                                        shadow-[0_16px_36px_-12px_rgba(0,0,0,0.04),inset_0_1px_1px_rgba(255,255,255,0.7)]">
                        <div className="w-full aspect-[16/9] rounded-[1.6rem] overflow-hidden bg-slate-950 relative shadow-inner border border-black/[0.05]">
                            <iframe
                                key={activeTrailer.id}
                                src={`https://www.youtube.com/embed/${activeTrailer.youtubeId}?autoplay=1&mute=1&enablejsapi=1&rel=0`}
                                title={activeTrailer.title}
                                className="w-full h-full"
                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                allowFullScreen
                            ></iframe>
                        </div>

                        <div className="flex items-center gap-3 px-2 pt-4 pb-1">
                            <div className="w-8 h-8 rounded-xl bg-purple-500/10 flex items-center justify-center shrink-0">
                                <IoFilmOutline className="w-4 h-4 text-purple-600" />
                            </div>
                            <h3 className="text-sm font-extrabold text-slate-800 tracking-tight line-clamp-1">
                                {activeTrailer.title}
                            </h3>
                        </div>
                    </div>

                    <div className="lg:col-span-4 flex flex-col space-y-3 max-h-[420px] lg:max-h-none overflow-y-auto pr-1">
                        {trailers.slice(-4).map((trailer, index) => {
                            const actualIndex = trailers.length - 4 + index;
                            const isActive = actualIndex === activeIndex;
                            return (
                                <button
                                    key={trailer.id}
                                    onClick={() => setActiveIndex(actualIndex)}
                                    className={`w-full flex items-center gap-3.5 p-2.5 rounded-[1.4rem] transition-all duration-300 text-left cursor-pointer border group
                                        ${isActive
                                            ? "bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-md border-transparent"
                                            : "bg-white/50 backdrop-blur-md border-white/80 hover:bg-white/80 hover:translate-x-1 shadow-xs"
                                        }`}
                                >
                                    <div className="w-24 aspect-[16/10] rounded-xl overflow-hidden relative shrink-0 bg-slate-200 shadow-xs">
                                        <img
                                            src={trailer.thumbnailUrl}
                                            alt={trailer.title}
                                            className="w-full h-full object-cover transform group-hover:scale-102 transition-transform duration-500"
                                        />
                                        <div className="absolute inset-0 bg-black/20 flex items-center justify-center">
                                            <IoPlayCircle className={`w-6 h-6 ${isActive ? 'text-white' : 'text-white/80 group-hover:scale-110'} transition-transform`} />
                                        </div>
                                    </div>

                                    <div className="flex flex-col flex-grow min-w-0 pr-1">
                                        <h4 className={`text-xs font-bold line-clamp-2 tracking-tight leading-snug mb-1
                                            ${isActive ? "text-white" : "text-slate-800"}`}>
                                            {trailer.title}
                                        </h4>
                                        <span className={`text-[10px] font-semibold
                                            ${isActive ? "text-purple-200" : "text-slate-400"}`}>
                                            Duration: {trailer.duration} mins
                                        </span>
                                    </div>
                                </button>
                            );
                        })}
                    </div>
                </div>
            )}
        </section>
    );
}

export default MovieTrailers;
