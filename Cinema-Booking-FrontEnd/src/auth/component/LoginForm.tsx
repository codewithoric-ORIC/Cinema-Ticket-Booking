import { Link, useNavigate } from "react-router-dom";
import { type FormEvent, useState } from "react";
import type { AuthDto } from "../dto/AuthDto.ts";
import { loginApicall, setRoleName, setLogeedInUsername, setUser, setToken } from "../service/AuthService.ts";
import { IoEyeOffOutline, IoEyeOutline, IoLockClosedOutline } from "react-icons/io5";
import { LuUser } from "react-icons/lu";

export default function LoginForm() {
    const navigate = useNavigate();
    const [username, setUsername] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const [showPassword, setShowPassword] = useState<boolean>(false);
    const [error, setError] = useState<string>('');
    const [success, setSuccess] = useState<string>('');
    const [loading, setLoading] = useState<boolean>(false);

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setError('');
        setSuccess('');
        setLoading(true);

        const loginData: AuthDto = {
            username: username,
            password: password
        };

        try {
            const response = await loginApicall(loginData);
            const { username: responseUsername, role, email, userId, phoneNumber, token } = response.data;

            if (responseUsername) setLogeedInUsername(responseUsername);
            if (role) setRoleName(role);
            if (token) setToken(token);
            setUser({ username: responseUsername, email: email, userId: userId, role: role, phoneNumber: phoneNumber });

            setSuccess(response.data.message || 'Login Successful!');
            setTimeout(() => {
                if (role === "ROLE_ADMIN") navigate("/admin");
                else navigate('/');
            }, 1500);
        } catch (error: any) {
            console.error("Login error:", error);
            const errorMsg =
                error.response?.data?.message ||
                error.response?.data ||
                (error.message === "Network Error" ? "Backend server is not running! Please start the backend first." : "Login Failed");
            setError(errorMsg);
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="w-full max-w-md mx-auto p-8 rounded-[2.5rem] mt-35 bg-slate-500/[0.05] backdrop-blur-2xl border border-black/[0.06] shadow-[0_24px_60px_-15px_rgba(0,0,0,0.08),inset_0_1px_2px_rgba(255,255,255,0.7)] mb-37">
            <div className="text-center mb-8">
                <h2 className="text-3xl font-black text-slate-800 tracking-tight">Welcome Back</h2>
                <p className="text-sm font-medium text-slate-500 mt-1.5">
                    Access your secure liquid dashboard
                </p>
            </div>

            {error && <div className="p-3 mb-4 text-xs font-bold text-red-600 bg-red-100 rounded-full text-center border border-red-200">{error}</div>}
            {success && <div className="p-3 mb-4 text-xs font-bold text-green-600 bg-green-100 rounded-full text-center border border-green-200">{success}</div>}

            <form onSubmit={handleSubmit} className="flex flex-col gap-5">
                <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-bold uppercase tracking-wider text-slate-500 ml-4">Username</label>
                    <div className="relative flex items-center group">
                        <input type="text" required value={username} onChange={(e) => setUsername(e.target.value)} placeholder="John Doe"
                            className="h-12 w-full pl-11 pr-4 rounded-full bg-slate-500/[0.05] text-slate-800 placeholder-slate-400 border border-black/[0.05] backdrop-blur-md focus:border-purple-500/40 focus:bg-white focus:outline-none shadow-[0_2px_8px_rgba(0,0,0,0.01)] transition-all duration-300 text-sm" />
                        <LuUser className="absolute left-4 w-4 h-4 text-slate-400 group-focus-within:text-purple-500 transition-colors" />
                    </div>
                </div>

                <div className="flex flex-col gap-1.5">
                    <div className="flex justify-between items-center px-4">
                        <label className="text-xs font-bold uppercase tracking-wider text-slate-500">Password</label>
                        <a href="#" className="text-xs font-bold text-purple-600 hover:text-purple-700 transition-colors">Forgot?</a>
                    </div>
                    <div className="relative flex items-center group">
                        <input type={showPassword ? "text" : "password"} required value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••"
                            className="h-12 w-full pl-11 pr-12 rounded-full bg-slate-500/[0.05] text-slate-800 placeholder-slate-400 border border-black/[0.05] backdrop-blur-md focus:border-purple-500/40 focus:bg-white focus:outline-none shadow-[0_2px_8px_rgba(0,0,0,0.01)] transition-all duration-300 text-sm" />
                        <IoLockClosedOutline className="absolute left-4 w-4 h-4 text-slate-400 group-focus-within:text-purple-500 transition-colors" />
                        <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-4 text-slate-400 hover:text-slate-600 focus:outline-none transition-colors">
                            {showPassword ? <IoEyeOffOutline className="w-4 h-4" /> : <IoEyeOutline className="w-4 h-4" />}
                        </button>
                    </div>
                </div>

                <div className="flex items-center gap-2 ml-4 my-1">
                    <input type="checkbox" id="remember" className="checkbox checkbox-xs rounded-md border-slate-300 checked:border-purple-500 [--chkbg:theme(colors.purple.500)] [--chkfg:white]" />
                    <label htmlFor="remember" className="text-xs font-semibold text-slate-600 select-none cursor-pointer">Keep me logged in</label>
                </div>

                <button type="submit" disabled={loading}
                    className="group relative h-12 w-full rounded-full font-bold text-sm tracking-wide text-white bg-gradient-to-r from-purple-600 to-indigo-600 shadow-[0_8px_24px_rgba(124,58,237,0.25),inset_0_1px_1px_rgba(255,255,255,0.3)] hover:scale-[1.02] hover:shadow-[0_12px_32px_rgba(124,58,237,0.35)] active:scale-98 transition-all duration-300 ease-out overflow-hidden cursor-pointer">
                    <span className="absolute inset-x-0 top-0 h-[40%] bg-gradient-to-b from-white/20 to-transparent rounded-t-full pointer-events-none"></span>
                    <span className="absolute -inset-full bg-gradient-to-r from-transparent via-white/20 to-transparent transform -skew-x-12 transition-all duration-1000 group-hover:left-full ease-out"></span>
                    <span className="relative z-10">{loading ? "Signing In..." : "Sign In"}</span>
                </button>
            </form>

            <p className="text-center text-xs font-semibold text-slate-500 mt-6">
                Don't have an account?{' '}
                <Link to="/register" className="text-purple-600 hover:text-purple-700 font-bold transition-colors">
                    Create one free
                </Link>
            </p>
        </div>
    );
}
