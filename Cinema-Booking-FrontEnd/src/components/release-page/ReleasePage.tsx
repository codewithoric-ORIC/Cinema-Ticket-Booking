import {IoNotificationsOutline, IoArrowForward} from "react-icons/io5";

const UPCOMING_MOVIES = [
    {id: 1, title: "Mission: Impossible 8", date: "15 Aug 2026", genre: "Action/Thriller"},
    {id: 2, title: "Avatar: The Way of Water", date: "22 Aug 2026", genre: "Sci-Fi/Adventure"},
    {id: 3, title: "Jurassic World Rebirth", date: "05 Sep 2026", genre: "Action/Sci-Fi"},
    {id: 4, title: "Blade Runner 2099", date: "12 Sep 2026", genre: "Sci-Fi/Drama"}
];

function ReleasePage() {
    return (
        <div className="w-full min-h-screen bg-slate-100 p-6 relative overflow-hidden flex flex-col justify-center">
            {/* Background Colorful Glows */}
            <div className="absolute top-[-10%] left-[-5%] w-[600px] h-[600px] bg-purple-500/10 rounded-full blur-[120px] pointer-events-none" />
            <div className="absolute bottom-[-10%] right-[-5%] w-[600px] h-[600px] bg-blue-500/10 rounded-full blur-[120px] pointer-events-none" />
            <div className="max-w-7xl mx-auto">
                <div className="mb-10 text-start">
                    <h1 className="text-4xl font-black text-slate-900 tracking-tight">Upcoming Releases</h1>
                    <p className="text-slate-500 font-medium text-sm mt-2">Don't miss the next big thing in cinema</p>
                </div>
                {/* 💡 အတန်းလိုက်မဟုတ်တော့ဘဲ Grid ပုံစံလေး ပြောင်းထားပါတယ် */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    {UPCOMING_MOVIES.map((movie) => (
                        <div
                            key={movie.id}
                            className="group relative flex flex-col p-6 rounded-[2rem]
                                       bg-slate-500/[0.06] backdrop-blur-xl border border-black/[0.06]
                                       hover:shadow-2xl hover:shadow-purple-500/10 hover:-translate-y-2
                                       transition-all duration-500 cursor-pointer"
                        >
                            {/* Calendar Badge */}
                            <div className="w-14 h-14 flex flex-col items-center justify-center rounded-2xl bg-white shadow-sm mb-4">
                                <span className="text-[9px] font-black text-purple-600 uppercase">{movie.date.split(" ")[1]}</span>
                                <span className="text-lg font-black text-slate-900">{movie.date.split(" ")[0]}</span>
                            </div>

                            <h3 className="text-base font-black text-slate-900 mb-1">{movie.title}</h3>
                            <p className="text-xs font-bold text-slate-400 mb-6">{movie.genre}</p>

                            <div className="mt-auto flex justify-between items-center">
                                <button className="p-2.5 rounded-full bg-black/[0.03] hover:bg-purple-600 hover:text-white transition-all">
                                    <IoNotificationsOutline className="w-4 h-4" />
                                </button>
                                <button className="w-9 h-9 rounded-full bg-slate-900 text-white flex items-center justify-center hover:bg-purple-600 transition-all">
                                    <IoArrowForward className="w-4 h-4" />
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

export default ReleasePage;