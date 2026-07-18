function Footer() {
    return (
        <footer className="w-full relative z-10 border-t border-black/[0.06] bg-slate-50/50 backdrop-blur-xl">
            <div className="max-w-7xl mx-auto px-6 py-12">

                <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
                    {/* Brand Section */}
                    <div className="col-span-1 md:col-span-2">
                        <div className="flex items-center gap-2 mb-4">
                            <span className="text-2xl font-black bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent">Q</span>
                            <span className="text-xl font-bold text-slate-800">QuickShow</span>
                        </div>
                        <p className="text-sm text-slate-500 max-w-xs leading-relaxed">
                            Experience the magic of cinema with QuickShow. Your one-stop destination for the latest movie trailers, ticketing, and showtimes.
                        </p>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h4 className="text-sm font-black text-slate-800 mb-4">Platform</h4>
                        <ul className="space-y-3 text-sm text-slate-500">
                            <li className="hover:text-purple-600 cursor-pointer transition-colors">Movies</li>
                            <li className="hover:text-purple-600 cursor-pointer transition-colors">Theaters</li>
                            <li className="hover:text-purple-600 cursor-pointer transition-colors">Coming Soon</li>
                        </ul>
                    </div>

                    {/* Support */}
                    <div>
                        <h4 className="text-sm font-black text-slate-800 mb-4">Support</h4>
                        <ul className="space-y-3 text-sm text-slate-500">
                            <li className="hover:text-purple-600 cursor-pointer transition-colors">FAQ</li>
                            <li className="hover:text-purple-600 cursor-pointer transition-colors">Privacy Policy</li>
                            <li className="hover:text-purple-600 cursor-pointer transition-colors">Contact Us</li>
                        </ul>
                    </div>
                </div>

                {/* Bottom Bar */}
                <div className="pt-8 border-t border-black/[0.04] flex flex-col md:flex-row justify-between items-center gap-4">
                    <p className="text-xs text-slate-400">© 2026 QuickShow. All rights reserved.</p>
                    <div className="flex gap-6 text-xs text-slate-500">
                        <span className="hover:text-slate-900 cursor-pointer">Instagram</span>
                        <span className="hover:text-slate-900 cursor-pointer">Twitter</span>
                        <span className="hover:text-slate-900 cursor-pointer">Facebook</span>
                    </div>
                </div>
            </div>
        </footer>
    );
}

export default Footer;