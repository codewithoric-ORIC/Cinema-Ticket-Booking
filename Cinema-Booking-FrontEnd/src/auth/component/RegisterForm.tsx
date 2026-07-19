import { Link, useNavigate } from "react-router-dom";
import { type FormEvent, useState } from "react";
import { IoEyeOffOutline, IoEyeOutline, IoLockClosedOutline, IoCallOutline, IoMailOutline, IoPersonOutline } from "react-icons/io5";
import type { RegisterDto } from "../dto/RegisterDto.ts";
import { registerApiCall, setRoleName, setLogeedInUsername, setUser } from "../service/AuthService.ts";

export default function RegisterForm() {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setError('');
        setSuccess('');
        setLoading(true);

        const registerData: RegisterDto = {
            username: name,
            email: email,
            password: password,
            phoneNumber: phone
        };

        try {
            const response = await registerApiCall(registerData);
            const { username: responseUsername, role, email: responseEmail, userId, phoneNumber } = response.data;

            if (responseUsername) setLogeedInUsername(responseUsername);
            if (role) setRoleName(role);
            setUser({ username: responseUsername, email: responseEmail, userId: userId, role: role, phoneNumber: phoneNumber });

            setSuccess(response.data.message || 'Registration Successful!');
            setTimeout(() => navigate('/login'), 1500);
        } catch (err: any) {
            console.error('Registration error:', err);
            const errorMsg =
                err.response?.data?.message ||
                err.response?.data ||
                (err.message === "Network Error" ? "Backend server is not running! Please start the backend first." : "Registration failed. Please try again.");
            setError(errorMsg);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="w-full max-w-md mx-auto p-8 rounded-[2.5rem] mt-15 bg-slate-500/[0.05] backdrop-blur-2xl border border-black/[0.06] shadow-[0_24px_60px_-15px_rgba(0,0,0,0.08),inset_0_1px_2px_rgba(255,255,255,0.7)] mb-20">
            <div className="text-center mb-8">
                <h2 className="text-3xl font-black text-slate-800 tracking-tight">Create Account</h2>
                <p className="text-sm font-medium text-slate-500 mt-1.5">
                    Join QuickShow to explore secure liquid entertainment
                </p>
            </div>

            {error && <div className="p-3 mb-4 text-xs font-bold text-red-600 bg-red-100 rounded-full text-center border border-red-200">{error}</div>}
            {success && <div className="p-3 mb-4 text-xs font-bold text-green-600 bg-green-100 rounded-full text-center border border-green-200">{success}</div>}

            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                {/* Full Name */}
                <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-bold uppercase tracking-wider text-slate-500 ml-4">Full Name</label>
                    <div className="relative flex items-center group">
                        <input
                            type="text"
                            required
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder="John Doe"
                            className="h-12 w-full pl-11 pr-4 rounded-full bg-slate-500/[0.05] text-slate-800 placeholder-slate-400 border border-black/[0.05] backdrop-blur-md focus:border-purple-500/40 focus:bg-white focus:outline-none shadow-[0_2px_8px_rgba(0,0,0,0.01)] transition-all duration-300 text-sm"
                        />
                        <IoPersonOutline className="absolute left-4 w-4 h-4 text-slate-400 group-focus-within:text-purple-500 transition-colors" />
                    </div>
                </div>

                {/* Email */}
                <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-bold uppercase tracking-wider text-slate-500 ml-4">Email Address</label>
                    <div className="relative flex items-center group">
                        <input
                            type="email"
                            required
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="john@example.com"
                            className="h-12 w-full pl-11 pr-4 rounded-full bg-slate-500/[0.05] text-slate-800 placeholder-slate-400 border border-black/[0.05] backdrop-blur-md focus:border-purple-500/40 focus:bg-white focus:outline-none shadow-[0_2px_8px_rgba(0,0,0,0.01)] transition-all duration-300 text-sm"
                        />
                        <IoMailOutline className="absolute left-4 w-4 h-4 text-slate-400 group-focus-within:text-purple-500 transition-colors" />
                    </div>
                </div>

                {/* Phone Number */}
                <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-bold uppercase tracking-wider text-slate-500 ml-4">Phone Number</label>
                    <div className="relative flex items-center group">
                        <input
                            type="tel"
                            required
                            value={phone}
                            onChange={(e) => setPhone(e.target.value)}
                            placeholder="+1 234 567 890"
                            className="h-12 w-full pl-11 pr-4 rounded-full bg-slate-500/[0.05] text-slate-800 placeholder-slate-400 border border-black/[0.05] backdrop-blur-md focus:border-purple-500/40 focus:bg-white focus:outline-none shadow-[0_2px_8px_rgba(0,0,0,0.01)] transition-all duration-300 text-sm"
                        />
                        <IoCallOutline className="absolute left-4 w-4 h-4 text-slate-400 group-focus-within:text-purple-500 transition-colors" />
                    </div>
                </div>

                {/* Password */}
                <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-bold uppercase tracking-wider text-slate-500 ml-4">Password</label>
                    <div className="relative flex items-center group">
                        <input
                            type={showPassword ? "text" : "password"}
                            required
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="••••••••"
                            className="h-12 w-full pl-11 pr-12 rounded-full bg-slate-500/[0.05] text-slate-800 placeholder-slate-400 border border-black/[0.05] backdrop-blur-md focus:border-purple-500/40 focus:bg-white focus:outline-none shadow-[0_2px_8px_rgba(0,0,0,0.01)] transition-all duration-300 text-sm"
                        />
                        <IoLockClosedOutline className="absolute left-4 w-4 h-4 text-slate-400 group-focus-within:text-purple-500 transition-colors" />
                        <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-4 text-slate-400 hover:text-slate-600 focus:outline-none transition-colors"
                        >
                            {showPassword ? <IoEyeOffOutline className="w-4 h-4" /> : <IoEyeOutline className="w-4 h-4" />}
                        </button>
                    </div>
                </div>

                {/* Terms of Service */}
                <div className="flex items-start gap-2 mx-3 mt-1">
                    <input
                        type="checkbox"
                        id="terms"
                        required
                        className="mt-0.5 checkbox checkbox-xs rounded-md border-slate-300 checked:border-purple-500 [--chkbg:theme(colors.purple.500)] [--chkfg:white]"
                    />
                    <label htmlFor="terms" className="text-xs font-semibold text-slate-500 select-none cursor-pointer">
                        I agree to the <a href="#" className="text-purple-600 font-bold hover:text-purple-700 transition-colors">Terms of Service</a> and{" "}
                        <a href="#" className="text-purple-600 font-bold hover:text-purple-700 transition-colors">Privacy Policy</a>
                    </label>
                </div>

                {/* Submit Button */}
                <button
                    type="submit"
                    disabled={loading}
                    className="group relative h-12 w-full mt-2 rounded-full font-bold text-sm tracking-wide text-white bg-gradient-to-r from-purple-600 to-indigo-600 shadow-[0_8px_24px_rgba(124,58,237,0.25),inset_0_1px_1px_rgba(255,255,255,0.3)] hover:scale-[1.02] hover:shadow-[0_12px_32px_rgba(124,58,237,0.35)] active:scale-98 transition-all duration-300 ease-out overflow-hidden cursor-pointer"
                >
                    <span className="absolute inset-x-0 top-0 h-[40%] bg-gradient-to-b from-white/20 to-transparent rounded-t-full pointer-events-none"></span>
                    <span className="absolute -inset-full bg-gradient-to-r from-transparent via-white/20 to-transparent transform -skew-x-12 transition-all duration-1000 group-hover:left-full ease-out"></span>
                    <span className="relative z-10">{loading ? "Creating Account..." : "Create Account"}</span>
                </button>
            </form>

            <p className="text-center text-xs font-semibold text-slate-500 mt-6">
                Already have an account?{' '}
                <Link to="/login" className="text-purple-600 hover:text-purple-700 font-bold transition-colors">
                    Sign in
                </Link>
            </p>
        </div>
    );
}
