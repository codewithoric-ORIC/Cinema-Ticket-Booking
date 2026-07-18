import { Link } from "react-router-dom";
import { IoArrowBack, IoHeartOutline } from "react-icons/io5";

function Favourites() {
    return (
        <div className="w-full min-h-screen bg-slate-100 overflow-x-hidden relative pt-24 pb-20">
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
                    <div className="inline-flex items-center px-4 py-1.5 rounded-full bg-purple-600/[0.08] border border-purple-500/20 shadow-sm backdrop-blur-md">
                        <span className="text-xs font-bold uppercase tracking-widest text-purple-700">Favourites</span>
                    </div>
                    <h1 className="text-4xl font-black text-slate-800 tracking-tight leading-none">
                        Your Favourite Movies
                    </h1>
                    <p className="text-slate-500 text-sm font-medium max-w-xl leading-relaxed">
                        Here are all the movies you've loved. Coming soon with your personal collection!
                    </p>
                </div>

                {/* Empty State */}
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
            </div>
        </div>
    );
}

export default Favourites;
