import { Link } from "react-router-dom";
import { IoArrowBack, IoPerson, IoMail, IoCall, IoCalendar } from "react-icons/io5";
import { getLogeedInUsername, getRoleName, getUser } from "../auth/service/AuthService";

function Profile() {
    const user = getUser();
    const username = user?.username || getLogeedInUsername() || "User";
    const email = user?.email || "user@example.com";
    const phone = user?.phoneNumber || "+1 234 567 890";
    const roleName = user?.role || getRoleName() || "ROLE_CUSTOMER";
    const roleDisplay = roleName.replace("ROLE_", "");

    return (
        <div className="w-full min-h-screen bg-slate-100 overflow-x-hidden relative pt-24 pb-20">
            {/* Background Glows */}
            <div className="absolute top-1/4 left-[-5%] w-[500px] h-[500px] bg-purple-500/15 rounded-full blur-[140px] pointer-events-none"></div>
            <div className="absolute top-2/3 right-[-5%] w-[500px] h-[500px] bg-indigo-500/15 rounded-full blur-[140px] pointer-events-none"></div>

            <div className="relative z-10 max-w-4xl mx-auto px-6">
                <div className="flex items-center gap-4 mb-8">
                    <Link to="/" className="flex items-center gap-2 text-slate-500 hover:text-purple-600 font-bold text-sm transition-colors cursor-pointer group">
                        <IoArrowBack className="w-4 h-4 transform group-hover:-translate-x-1 transition-transform"></IoArrowBack>
                        <span>Back</span>
                    </Link>
                </div>

                <div className="mb-8 space-y-2">
                    <div className="inline-flex items-center px-4 py-1.5 rounded-full bg-purple-600/[0.08] border border-purple-500/20 shadow-sm backdrop-blur-md">
                        <span className="text-xs font-bold uppercase tracking-widest text-purple-700">Profile</span>
                    </div>
                    <h1 className="text-4xl font-black text-slate-800 tracking-tight leading-none">
                        Your Profile
                    </h1>
                    <p className="text-slate-500 text-sm font-medium max-w-xl leading-relaxed">
                        Manage your account settings and personal information.
                    </p>
                </div>

                {/* Profile Card */}
                <div className="w-full rounded-[2.5rem] bg-white/40 backdrop-blur-2xl p-8">
                    {/* Avatar and Basic Info */}
                    <div className="flex flex-col md:flex-row items-center gap-8 mb-8 pb-8 border-b border-slate-200/60">
                        <div className="w-32 h-32 rounded-full bg-gradient-to-br from-purple-600 to-indigo-600 flex items-center justify-center shadow-lg">
                            <IoPerson className="w-16 h-16 text-white"></IoPerson>
                        </div>
                        <div className="text-center md:text-left">
                            <h2 className="text-3xl font-black text-slate-800">{username}</h2>
                            <span className="inline-block mt-2 px-4 py-1 rounded-full bg-purple-100 text-purple-700 text-xs font-bold uppercase tracking-wide">
                                {roleDisplay}
                            </span>
                        </div>
                    </div>

                    {/* Account Details */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-6">
                            <div className="bg-white/60 rounded-2xl p-6 border border-white/80">
                                <h3 className="text-sm font-bold uppercase tracking-wider text-slate-400 mb-4">Account Info</h3>
                                
                                <div className="space-y-4">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center">
                                            <IoPerson className="w-5 h-5 text-purple-600"></IoPerson>
                                        </div>
                                        <div>
                                            <p className="text-xs font-semibold text-slate-500">Username</p>
                                            <p className="text-sm font-bold text-slate-800">{username}</p>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center">
                                            <IoMail className="w-5 h-5 text-purple-600"></IoMail>
                                        </div>
                                        <div>
                                            <p className="text-xs font-semibold text-slate-500">Email</p>
                                            <p className="text-sm font-bold text-slate-800">{email}</p>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center">
                                            <IoCall className="w-5 h-5 text-purple-600"></IoCall>
                                        </div>
                                        <div>
                                            <p className="text-xs font-semibold text-slate-500">Phone</p>
                                            <p className="text-sm font-bold text-slate-800">{phone}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="space-y-6">
                            <div className="bg-white/60 rounded-2xl p-6 border border-white/80">
                                <h3 className="text-sm font-bold uppercase tracking-wider text-slate-400 mb-4">Activity</h3>
                                
                                <div className="space-y-4">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center">
                                            <IoCalendar className="w-5 h-5 text-indigo-600"></IoCalendar>
                                        </div>
                                        <div>
                                            <p className="text-xs font-semibold text-slate-500">Member Since</p>
                                            <p className="text-sm font-bold text-slate-800">July 2024</p>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-2 gap-4 mt-4">
                                        <div className="bg-slate-100 rounded-xl p-4 text-center">
                                            <p className="text-2xl font-black text-purple-600">0</p>
                                            <p className="text-xs font-semibold text-slate-500 mt-1">Bookings</p>
                                        </div>
                                        <div className="bg-slate-100 rounded-xl p-4 text-center">
                                            <p className="text-2xl font-black text-purple-600">0</p>
                                            <p className="text-xs font-semibold text-slate-500 mt-1">Favourites</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Edit Profile Button */}
                    <div className="mt-8 flex justify-center">
                        <button
                            className="group relative h-12 px-8 rounded-full text-sm font-bold text-white
                                       bg-gradient-to-r from-purple-600 to-indigo-600
                                       shadow-[0_4px_12px_rgba(124,58,237,0.15),inset_0_1px_1px_rgba(255,255,255,0.3)]
                                       hover:scale-105 hover:shadow-[0_8px_20px_rgba(124,58,237,0.25)]
                                       active:scale-98
                                       transition-all duration-300 ease-out overflow-hidden cursor-pointer"
                        >
                            <span className="absolute inset-x-0 top-0 h-[40%] bg-gradient-to-b from-white/20 to-transparent rounded-t-full pointer-events-none"></span>
                            <span className="absolute -inset-full bg-gradient-to-r from-transparent via-white/20 to-transparent transform -skew-x-12 transition-all duration-1000 group-hover:left-full ease-out"></span>
                            <span className="relative z-10">Edit Profile</span>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Profile;
