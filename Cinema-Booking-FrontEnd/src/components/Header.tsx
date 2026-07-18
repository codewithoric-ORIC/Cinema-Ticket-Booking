import { useState, useRef, useEffect } from "react";
import { IoSearch, IoHeart, IoLogOut, IoPerson, IoTicket, IoSettingsOutline } from "react-icons/io5";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { isLoggedIn, getLogeedInUsername, logout, isAdmin } from "../auth/service/AuthService";

function Header() {
    const navigate = useNavigate();
    const location = useLocation();

    const menuItems = ['Home', 'Movies', 'Theaters', 'Releases'];
    const [activeItem, setActiveItem] = useState<string>('Home');
    const [loggedIn, setLoggedIn] = useState<boolean>(false);
    const [username, setUsername] = useState<string>('');
    const [showDropdown, setShowDropdown] = useState<boolean>(false);

    const [pillStyle, setPillStyle] = useState({ left: 0, width: 0 });
    const containerRef = useRef<HTMLDivElement>(null);
    const itemRefs = useRef<{ [key: string]: HTMLButtonElement | null }>({});

    useEffect(() => {
        const checkLoginStatus = () => {
            const loggedInStatus = isLoggedIn();
            setLoggedIn(loggedInStatus);
            if (loggedInStatus) {
                setUsername(getLogeedInUsername() || '');
            }
        };

        checkLoginStatus();

        window.addEventListener('storage', checkLoginStatus);
        return () => window.removeEventListener('storage', checkLoginStatus);
    }, [location.pathname]);

    useEffect(() => {
        if (location.pathname === '/') {
            setActiveItem('Home');
        } else if (location.pathname === '/movies') {
            setActiveItem('Movies');
        } else if (location.pathname === '/theaters') {
            setActiveItem('Theaters');
        } else if (location.pathname === '/release') {
            setActiveItem('Releases');
        } else if (location.pathname === '/favourites') {
            setActiveItem('Favourites');
        }
    }, [location.pathname]);

    const handleLogout = () => {
        logout();
        setLoggedIn(false);
        setUsername('');
        navigate('/');
    };

    useEffect(() => {
        const calculatePosition = () => {
            const activeElement = itemRefs.current[activeItem];
            const containerElement = containerRef.current;

            if (activeElement && containerElement) {
                const activeRect = activeElement.getBoundingClientRect();
                const containerRect = containerElement.getBoundingClientRect();

                setPillStyle({
                    left: activeRect.left - containerRect.left,
                    width: activeRect.width,
                });
            }
        };

        const animationFrameId = requestAnimationFrame(calculatePosition);
        return () => cancelAnimationFrame(animationFrameId);
    }, [activeItem]);

    const getMenuItems = () => {
        if (loggedIn) {
            return [...menuItems, 'Favourites'];
        }
        return menuItems;
    };

    const displayMenuItems = getMenuItems();

    return (
        <header className="fixed top-0 left-0 right-0 z-50 h-24 px-4 pt-4 pointer-events-none">
            <nav className="max-w-7xl mx-auto relative z-50 pointer-events-auto">
                <div className="flex items-center justify-between px-6 py-4">

                    <div className="flex items-center gap-0 cursor-pointer" onClick={() => navigate('/')}>
                        <span className="text-2xl font-black bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent drop-shadow-sm">Q</span>
                        <span className="text-xl font-bold text-slate-800 tracking-tight">uickShow</span>
                    </div>

                    <div
                        ref={containerRef}
                        className="relative flex items-center gap-1 px-2 py-1.5 rounded-full
                                   bg-slate-500/[0.06] backdrop-blur-xl
                                   border border-black/[0.06]
                                   shadow-[0_8px_24px_rgba(0,0,0,0.04),inset_0_1px_2px_rgba(255,255,255,0.8)]"
                    >
                        <div
                            className="absolute top-1.5 bottom-1.5 rounded-full
                                       bg-gradient-to-r from-purple-600 to-indigo-600
                                       shadow-[0_4px_12px_rgba(124,58,237,0.25)]
                                       transition-all duration-500 ease-[cubic-bezier(0.25,1,0.5,1)]"
                            style={{
                                left: `${pillStyle.left}px`,
                                width: `${pillStyle.width}px`
                            }}
                        />

                        {displayMenuItems.map((item) => (
                            <button
                                key={item}
                                ref={(el) => { itemRefs.current[item] = el; }}
                                onClick={() => {
                                    setActiveItem(item);
                                    if (item === 'Home') navigate('/');
                                    if (item === 'Movies') navigate('/movies');
                                    if (item === 'Theaters') navigate('/theaters');
                                    if (item === 'Releases') navigate('/release');
                                    if (item === 'Favourites') navigate('/favourites');
                                }}
                                className={`relative z-10 px-6 py-2 text-sm font-semibold rounded-full transition-colors duration-300 ${
                                    activeItem === item
                                        ? 'text-white'
                                        : 'text-slate-600 hover:text-slate-900'
                                }`}
                            >
                                {item === 'Favourites' ? (
                                    <div className="flex items-center gap-1.5">
                                        <IoHeart className="w-4 h-4" />
                                        <span>{item}</span>
                                    </div>
                                ) : item}
                            </button>
                        ))}
                    </div>

                    <div className="flex items-center gap-4">

                        <div className="relative flex items-center group">
                            <input
                                type="text"
                                placeholder="Search movies..."
                                className="h-10 w-48 pl-11 pr-4 rounded-full
                                           bg-white/60 dark:bg-slate-900/[0.04] backdrop-blur-md
                                           text-slate-800 placeholder-slate-500 font-medium
                                           border border-black/[0.08]
                                           focus:border-purple-500 focus:outline-none focus:w-56 focus:bg-white
                                           shadow-[0_4px_12px_rgba(0,0,0,0.03),inset_0_1px_1px_rgba(255,255,255,0.4)]
                                           transition-all duration-500 ease-out text-sm"
                            />
                            <IoSearch
                                className="absolute left-3.5 w-4 h-4 text-slate-600 pointer-events-none
                                           group-focus-within:text-purple-600 group-focus-within:scale-110
                                           transition-all duration-300"
                            />
                        </div>

                        {loggedIn ? (
                            <div className="relative">
                                <button
                                    onClick={() => setShowDropdown(!showDropdown)}
                                    className="group relative h-10 px-4 rounded-full text-sm font-bold text-white
                                               bg-gradient-to-r from-purple-600 to-indigo-600
                                               shadow-[0_4px_12px_rgba(124,58,237,0.15),inset_0_1px_1px_rgba(255,255,255,0.3)]
                                               hover:scale-105 hover:shadow-[0_8px_20px_rgba(124,58,237,0.25)]
                                               active:scale-98
                                               transition-all duration-300 ease-out overflow-hidden cursor-pointer flex items-center gap-2"
                                >
                                    <span className="absolute inset-x-0 top-0 h-[40%] bg-gradient-to-b from-white/20 to-transparent rounded-t-full pointer-events-none"></span>
                                    <span className="absolute -inset-full bg-gradient-to-r from-transparent via-white/20 to-transparent transform -skew-x-12 transition-all duration-1000 group-hover:left-full ease-out"></span>
                                    <div className="relative z-10 flex items-center gap-2">
                                        <div className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center border border-white/30">
                                            <IoPerson className="w-4 h-4 text-white" />
                                        </div>
                                        <span>{username}</span>
                                    </div>
                                </button>

                                {showDropdown && (
                                    <div className="absolute right-0 top-full mt-2 w-48 rounded-[2rem] bg-slate-500/[0.06] backdrop-blur-xl border border-black/[0.06] shadow-xl overflow-hidden">
                                        {isAdmin() && (
                                            <button
                                                onClick={() => { setShowDropdown(false); navigate('/admin/dashboard'); }}
                                                className="w-full px-4 py-3 text-sm font-semibold text-slate-700 hover:bg-purple-600/10 flex items-center gap-2 transition-colors"
                                            >
                                                <IoSettingsOutline className="w-4 h-4" />
                                                <span>Admin Dashboard</span>
                                            </button>
                                        )}
                                        <button
                                            onClick={() => { setShowDropdown(false); navigate('/profile'); }}
                                            className="w-full px-4 py-3 text-sm font-semibold text-slate-700 hover:bg-purple-600/10 flex items-center gap-2 transition-colors"
                                        >
                                            <IoPerson className="w-4 h-4" />
                                            <span>Profile</span>
                                        </button>
                                        <button
                                            onClick={() => { setShowDropdown(false); navigate('/bookings'); }}
                                            className="w-full px-4 py-3 text-sm font-semibold text-slate-700 hover:bg-purple-600/10 flex items-center gap-2 transition-colors"
                                        >
                                            <IoTicket className="w-4 h-4" />
                                            <span>My Bookings</span>
                                        </button>
                                        <button
                                            onClick={() => { setShowDropdown(false); navigate('/favourites'); }}
                                            className="w-full px-4 py-3 text-sm font-semibold text-slate-700 hover:bg-purple-600/10 flex items-center gap-2 transition-colors"
                                        >
                                            <IoHeart className="w-4 h-4" />
                                            <span>Favourites</span>
                                        </button>
                                        <div className="border-t border-black/[0.06]"></div>
                                        <button
                                            onClick={() => { setShowDropdown(false); handleLogout(); }}
                                            className="w-full px-4 py-3 text-sm font-semibold text-red-600 hover:bg-red-500/10 flex items-center gap-2 transition-colors"
                                        >
                                            <IoLogOut className="w-4 h-4" />
                                            <span>Logout</span>
                                        </button>
                                    </div>
                                )}
                            </div>
                        ) : (
                            <Link
                                to="/login"
                                className="group relative h-10 px-6 rounded-full text-sm font-bold text-white
                                           bg-gradient-to-r from-purple-600 to-indigo-600
                                           shadow-[0_4px_12px_rgba(124,58,237,0.15),inset_0_1px_1px_rgba(255,255,255,0.3)]
                                           hover:scale-105 hover:shadow-[0_8px_20px_rgba(124,58,237,0.25)]
                                           active:scale-98
                                           transition-all duration-300 ease-out overflow-hidden cursor-pointer flex items-center justify-center"
                            >
                                <span className="absolute inset-x-0 top-0 h-[40%] bg-gradient-to-b from-white/20 to-transparent rounded-t-full pointer-events-none"></span>
                                <span className="absolute -inset-full bg-gradient-to-r from-transparent via-white/20 to-transparent transform -skew-x-12 transition-all duration-1000 group-hover:left-full ease-out"></span>
                                <span className="relative z-10">Login</span>
                            </Link>
                        )}
                    </div>

                </div>
            </nav>
        </header>
    );
}

export default Header;
