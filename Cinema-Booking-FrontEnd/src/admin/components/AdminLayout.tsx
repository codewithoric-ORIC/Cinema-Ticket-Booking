import { Link, Outlet, useNavigate, useLocation } from "react-router-dom";
import {
  IoHomeOutline,
  IoTicketOutline,
  IoPersonOutline,
  IoLogOutOutline,
  IoFilmOutline,
  IoPlayCircleOutline,
  IoPeopleOutline,
  IoTimeOutline,
} from "react-icons/io5";
import { logout } from "../../auth/service/AuthService";

function AdminLayout() {
  const navigate = useNavigate();
  const location = useLocation();

  const navItems = [
    { path: "/admin/dashboard", label: "Dashboard", icon: IoHomeOutline },
    { path: "/admin/movies", label: "Manage Movies", icon: IoFilmOutline },
    { path: "/admin/trailers", label: "Manage Trailers", icon: IoPlayCircleOutline },
    { path: "/admin/casts", label: "Manage Casts", icon: IoPeopleOutline },
    { path: "/admin/showtimes", label: "Manage Showtimes", icon: IoTimeOutline },
    { path: "/admin/bookings", label: "List Bookings", icon: IoTicketOutline },
    { path: "/admin/profile", label: "Profile", icon: IoPersonOutline },
  ];

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <div className="flex min-h-screen bg-slate-50 relative overflow-hidden">
      {/* Background Gradient Blobs for Liquid Effect */}
      <div className="absolute top-1/4 left-[10%] w-80 h-80 bg-purple-400/15 rounded-full blur-[100px] pointer-events-none"></div>
      <div className="absolute bottom-1/3 right-[5%] w-96 h-96 bg-indigo-400/20 rounded-full blur-[120px] pointer-events-none"></div>
      <div className="absolute top-1/2 left-1/3 w-72 h-72 bg-pink-400/10 rounded-full blur-[90px] pointer-events-none"></div>

      {/* Sidebar with Liquid Glass Effect */}
      <aside className="w-72 p-4 z-10">
        <div className="h-full rounded-[2rem] bg-white/40 backdrop-blur-xl border border-white/80 shadow-[0_8px_24px_rgba(0,0,0,0.04),inset_0_1px_2px_rgba(255,255,255,0.8)] flex flex-col overflow-hidden">
          {/* Logo Section */}
          <div className="p-6 border-b border-white/30">
            <Link to="/" className="flex items-center gap-2">
              <span className="text-2xl font-black bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent drop-shadow-sm">
                Q
              </span>
              <span className="text-xl font-bold text-slate-800 tracking-tight">uickShow Admin</span>
            </Link>
          </div>

          {/* Navigation */}
          <nav className="p-4 flex-1">
            <ul className="space-y-3">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = location.pathname === item.path;
                return (
                  <li key={item.path}>
                    <Link
                      to={item.path}
                      className={`flex items-center gap-3 px-5 py-3.5 rounded-[1.5rem] font-semibold transition-all duration-300 ${
                        isActive
                          ? "bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-[0_8px_24px_rgba(124,58,237,0.25),inset_0_1px_2px_rgba(255,255,255,0.3)]"
                          : "text-slate-700 hover:bg-white/60 hover:shadow-[0_4px_12px_rgba(0,0,0,0.03),inset_0_1px_2px_rgba(255,255,255,0.8)]"
                      }`}
                    >
                      <Icon className="w-5 h-5" />
                      <span>{item.label}</span>
                    </Link>
                  </li>
                );
              })}
            </ul>
          </nav>

          {/* Logout Button */}
          <div className="p-4 border-t border-white/30">
            <button
              onClick={handleLogout}
              className="flex items-center gap-3 w-full px-5 py-3.5 rounded-[1.5rem] font-semibold text-red-600 hover:bg-red-500/10 transition-all duration-300"
            >
              <IoLogOutOutline className="w-5 h-5" />
              <span>Logout</span>
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content with Liquid Glass Effect */}
      <main className="flex-1 p-6 z-10">
        <div className="h-full w-full rounded-[2rem] bg-white/40 backdrop-blur-xl border border-white/80 shadow-[0_8px_24px_rgba(0,0,0,0.04),inset_0_1px_2px_rgba(255,255,255,0.8)] overflow-auto">
          <div className="p-8">
            <Outlet />
          </div>
        </div>
      </main>
    </div>
  );
}

export default AdminLayout;
