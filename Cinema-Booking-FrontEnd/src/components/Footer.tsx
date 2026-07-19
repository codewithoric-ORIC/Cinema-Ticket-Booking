import { Link } from "react-router-dom";
import {
    IoTicket,
    IoFilm,
    IoHelpCircle,
    IoMail,
    IoCall,
    IoLogoInstagram,
    IoLogoTwitter,
    IoLogoFacebook,
    IoLogoYoutube
} from "react-icons/io5";

function Footer() {
    return (
        <footer className="w-full relative z-10 border-t border-purple-100 bg-gradient-to-b from-white/80 to-slate-50/80 backdrop-blur-2xl">
            <div className="max-w-7xl mx-auto px-6 py-16">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
                    {/* Brand Section */}
                    <div className="col-span-1 lg:col-span-2">
                        <div className="flex items-center gap-3 mb-5">
                            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-600 to-indigo-600 flex items-center justify-center shadow-lg shadow-purple-600/30">
                                <IoTicket className="w-6 h-6 text-white" />
                            </div>
                            <span className="text-2xl font-black bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent">QuickShow</span>
                        </div>
                        <p className="text-sm text-slate-600 max-w-md leading-relaxed mb-6">
                            Experience the magic of cinema with QuickShow. Your one-stop destination for the latest movies, convenient ticketing, and real-time showtimes.
                        </p>
                        <div className="flex gap-4">
                            {[
                                { icon: IoLogoInstagram, href: "#" },
                                { icon: IoLogoTwitter, href: "#" },
                                { icon: IoLogoFacebook, href: "#" },
                                { icon: IoLogoYoutube, href: "#" },
                            ].map((social, idx) => (
                                <a
                                    key={idx}
                                    href={social.href}
                                    className="w-10 h-10 rounded-full bg-white border border-slate-200 flex items-center justify-center text-slate-500 hover:text-purple-600 hover:border-purple-300 hover:bg-purple-50 transition-all hover:scale-105 cursor-pointer"
                                >
                                    <social.icon className="w-5 h-5" />
                                </a>
                            ))}
                        </div>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h4 className="text-sm font-black text-slate-800 mb-5 flex items-center gap-2">
                            <IoFilm className="w-4 h-4 text-purple-600" />
                            Quick Links
                        </h4>
                        <ul className="space-y-3 text-sm">
                            <li>
                                <Link to="/movies" className="flex items-center gap-2 text-slate-600 hover:text-purple-600 transition-colors cursor-pointer">
                                    <span className="w-1.5 h-1.5 rounded-full bg-purple-400" />
                                    Now Showing
                                </Link>
                            </li>
                            <li>
                                <Link to="/release" className="flex items-center gap-2 text-slate-600 hover:text-purple-600 transition-colors cursor-pointer">
                                    <span className="w-1.5 h-1.5 rounded-full bg-purple-400" />
                                    Coming Soon
                                </Link>
                            </li>
                            <li>
                                <Link to="/" className="flex items-center gap-2 text-slate-600 hover:text-purple-600 transition-colors cursor-pointer">
                                    <span className="w-1.5 h-1.5 rounded-full bg-purple-400" />
                                    Home
                                </Link>
                            </li>
                        </ul>
                    </div>

                    {/* Support */}
                    <div>
                        <h4 className="text-sm font-black text-slate-800 mb-5 flex items-center gap-2">
                            <IoHelpCircle className="w-4 h-4 text-purple-600" />
                            Support
                        </h4>
                        <ul className="space-y-3 text-sm">
                            <li>
                                <a href="#" className="flex items-center gap-2 text-slate-600 hover:text-purple-600 transition-colors cursor-pointer">
                                    <span className="w-1.5 h-1.5 rounded-full bg-purple-400" />
                                    FAQ
                                </a>
                            </li>
                            <li>
                                <a href="#" className="flex items-center gap-2 text-slate-600 hover:text-purple-600 transition-colors cursor-pointer">
                                    <span className="w-1.5 h-1.5 rounded-full bg-purple-400" />
                                    Privacy Policy
                                </a>
                            </li>
                            <li className="flex items-center gap-2 text-slate-600 hover:text-purple-600 transition-colors cursor-pointer">
                                <IoMail className="w-4 h-4" />
                                support@quickshow.com
                            </li>
                            <li className="flex items-center gap-2 text-slate-600 hover:text-purple-600 transition-colors cursor-pointer">
                                <IoCall className="w-4 h-4" />
                                +95 9 123 4567
                            </li>
                        </ul>
                    </div>
                </div>

                {/* Bottom Bar */}
                <div className="pt-8 border-t border-slate-200/60 flex flex-col md:flex-row justify-between items-center gap-4">
                    <p className="text-xs text-slate-500 font-medium">
                        © 2026 QuickShow. All rights reserved.
                    </p>
                    <div className="flex gap-8 text-xs text-slate-500">
                        <span className="font-semibold">Made with ❤️ in Myanmar</span>
                    </div>
                </div>
            </div>
        </footer>
    );
}

export default Footer;