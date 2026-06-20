import { useState, useEffect } from 'react';
import { useAuthStore } from '../store/authStore';
import { useNavigate } from 'react-router-dom';
import { Mail, Lock, LogIn, Home } from 'lucide-react';

export default function LoginPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const { login, isLoading, error, isAuthenticated } = useAuthStore();
    const navigate = useNavigate();

    useEffect(() => {
        if (isAuthenticated) {
            navigate('/');
        }
    }, [isAuthenticated, navigate]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await login(email, password);
        } catch (err) {
            // Error handled by store
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-white p-4">
            <div className="w-full max-w-md">
                {/* Main Card with White Background and #BFA15F Borders */}
                <div className="bg-white rounded-2xl border-2 border-[#BFA15F] shadow-xl overflow-hidden">
                    <div className="p-6 sm:p-8">
                        {/* Header Section */}
                        <div className="text-center mb-8">
                            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-[#BFA15F] text-white shadow-md mb-4">
                                <Home className="w-7 h-7" strokeWidth={1.75} />
                            </div>
                            <h2 className="text-2xl sm:text-3xl font-bold text-gray-800">Admin Login</h2>
                            <p className="text-gray-500 text-sm mt-1">Real Estate Management Portal</p>
                        </div>

                        {/* Error Alert */}
                        {error && (
                            <div className="mb-6 alert alert-error shadow-sm border-l-4 border-red-500 bg-red-50 text-red-700 rounded-lg">
                                <span className="text-sm">{error}</span>
                            </div>
                        )}

                        {/* Login Form */}
                        <form onSubmit={handleSubmit} className="space-y-5">
                            {/* Email Field */}
                            <div className="form-control w-full text-black">
                                <label className="label px-0.5 pb-1">
                                    <span className="label font-semibold text-black flex items-center gap-2 text-sm">
                                        <Mail size={16} className="text-[#BFA15F]" />
                                        Email Address
                                    </span>
                                </label>
                                <input
                                    type="email"
                                    placeholder="admin@example.com"
                                    className="input input-bordered w-full bg-white border-2 border-gray-200 focus:border-[#BFA15F] focus:outline-none focus:ring-2 focus:ring-[#BFA15F]/20 transition-all duration-200 rounded-lg py-2 px-4"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    disabled={isLoading}
                                    required
                                />
                            </div>

                            {/* Password Field */}
                            <div className="form-control w-full text-black">
                                <label className="label px-0.5 pb-1">
                                    <span className="label-text font-semibold text-black flex items-center gap-2 text-sm">
                                        <Lock size={16} className="text-[#BFA15F]" />
                                        Password
                                    </span>
                                </label>
                                <input
                                    type="password"
                                    placeholder="••••••••"
                                    className="input input-bordered w-full bg-white border-2 border-gray-200 focus:border-[#BFA15F] focus:outline-none focus:ring-2 focus:ring-[#BFA15F]/20 transition-all duration-200 rounded-lg py-2 px-4"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    disabled={isLoading}
                                    required
                                />
                            </div>

                            {/* Submit Button */}
                            <button
                                type="submit"
                                className="btn w-full bg-[#BFA15F] hover:bg-[#A88B4E] text-white border-0 rounded-lg py-3 h-auto font-semibold text-base gap-2 transition-all duration-200 shadow-md hover:shadow-lg mt-2"
                                disabled={isLoading}
                            >
                                {isLoading ? (
                                    <>
                                        <span className="loading loading-spinner loading-sm"></span>
                                        <span>Authenticating...</span>
                                    </>
                                ) : (
                                    <>
                                        <LogIn size={18} />
                                        <span>Sign In</span>
                                    </>
                                )}
                            </button>
                        </form>

                        {/* Demo Credentials Divider & Info */}
                        <div className="mt-8 pt-4 border-t border-gray-100 text-black">
                            <div className="text-center">
                                <button
                                    onClick={() => navigate('/properties')}
                                    className="inline-flex border border-white text text-sm tracking-widest hover:bg-white hover:text-zinc-900 transition-colors duration-300"
                                >
                                    Not an admin? Explore our properties here
                                </button>                            </div>
                        </div>
                    </div>
                </div>

                {/* Footer note (optional) */}
                <p className="text-center text-gray-400 text-xs mt-6">
                    Secure administration area
                </p>
            </div>
        </div>
    );
}