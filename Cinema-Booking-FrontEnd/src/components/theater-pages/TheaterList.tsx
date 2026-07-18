import { useNavigate } from "react-router-dom";
import { IoLocationOutline, IoStar, IoArrowForward, IoFilmOutline } from "react-icons/io5";

const THEATERS_DATA = [
    { id: 1, name: "Junction City Cineplex", location: "Downtown, Yangon", rating: 4.8 },
    { id: 2, name: "Mingalar Cinema Gold", location: "Hledan, Yangon", rating: 4.5 },
    { id: 3, name: "Nay Pyi Daw Cinema", location: "Nay Pyi Daw", rating: 4.2 },
    { id: 4, name: "Ocean Super Center Cinema", location: "Mandalay", rating: 4.6 }
];

function TheaterList() {
    const navigate = useNavigate();

    return (
        // 💡 Movies Page လိုမျိုး background နဲ့ Background Glows များ
        <div className="w-full min-h-screen bg-slate-100 overflow-x-hidden relative pt-28 pb-20">
            <div className="absolute top-1/4 left-[-5%] w-[500px] h-[500px] bg-purple-500/15 rounded-full blur-[140px] pointer-events-none" />
            <div className="absolute top-2/3 right-[-5%] w-[500px] h-[500px] bg-indigo-500/15 rounded-full blur-[140px] pointer-events-none" />

            <div className="relative z-10 max-w-7xl mx-auto px-6">
                {/* Page Title */}
                <div className="mb-8 space-y-2">
                    <h1 className="text-4xl font-black text-slate-900 tracking-tight">Select Theater</h1>
                    <p className="text-slate-500 text-sm font-semibold">Choose your preferred location to watch movies</p>
                </div>

                <div className="w-full rounded-[2.5rem] p-6 md:p-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-6xl mx-auto">
                        {THEATERS_DATA.map((theater) => (
                            <div
                                key={theater.id}
                                onClick={() => navigate(`/select-seat/1`)}
                                /* 💡 Header က Liquid Glass ပုံစံအတိုင်း ပြင်ထားပါတယ် */
                                className="group relative flex flex-col rounded-[1.8rem] p-6
               bg-slate-500/[0.06] backdrop-blur-xl
               border border-black/[0.06]
               shadow-[0_8px_24px_rgba(0,0,0,0.04),inset_0_1px_2px_rgba(255,255,255,0.8)]
               hover:shadow-[0_20px_40px_-12px_rgba(0,0,0,0.08)]
               hover:-translate-y-1 transition-all duration-400 cursor-pointer"
                            >
                                <div className="flex justify-between items-start">
                                    <div className="flex gap-4">
                                        <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-purple-600 to-indigo-600 text-white flex items-center justify-center text-xl shadow-lg shadow-purple-500/20">
                                            <IoFilmOutline />
                                        </div>
                                        <div>
                                            <h3 className="text-base font-black text-slate-800 group-hover:text-purple-600 transition-colors">
                                                {theater.name}
                                            </h3>
                                            <div className="flex items-center gap-1.5 text-slate-500 text-[11px] font-bold mt-1">
                                                <IoLocationOutline /> {theater.location}
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-1 bg-amber-500/10 text-amber-600 px-2.5 py-1 rounded-lg text-[11px] font-black">
                                        <IoStar className="w-3 h-3" /> {theater.rating}
                                    </div>
                                </div>

                                <div className="mt-6 pt-4 border-t border-slate-200/50 flex justify-between items-center">
                                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Available Now</span>
                                    <div className="w-8 h-8 rounded-full bg-slate-900 text-white flex items-center justify-center group-hover:bg-purple-600 transition-all">
                                        <IoArrowForward className="w-4 h-4" />
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

            </div>
        </div>
    );
}

export default TheaterList;