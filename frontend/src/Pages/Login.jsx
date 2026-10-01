import { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";

function Spinner() {
    return (
        <span className="inline-block w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
    );
}

function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const submit = async () => {
        setError("");
        setLoading(true);
        try {
            const res = await axios.post(`${import.meta.env.VITE_API_BASE_URL}/auth/login`, { email, password });
            localStorage.setItem("token", res.data.token);
            navigate("/restaurant");
        } catch (err) {
            setError(err.response?.data?.message || "Invalid credentials. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    const handleKey = (e) => { if (e.key === "Enter") submit(); };

    return (
        <div className="min-h-screen bg-orange-50 flex items-center justify-center px-4">
            <div className="w-full max-w-md">
                <div className="mb-8 text-center animate-slideDown">
                    <h1 className="text-gray-900 font-bold text-3xl tracking-tight">
                        Quick<span className="text-orange-500">Dine</span>
                    </h1>
                    <p className="text-gray-400 text-sm mt-2">Sign in to your account</p>
                </div>

                <div className="bg-white border border-orange-100 rounded-2xl p-8 shadow-sm animate-scaleIn">
                    <div className="flex flex-col gap-5">
                        <div className="flex flex-col gap-1.5 animate-fadeIn stagger-1">
                            <label className="text-xs font-medium text-gray-400 uppercase tracking-widest">Email</label>
                            <input
                                type="email" value={email}
                                onChange={(e) => setEmail(e.target.value)} onKeyDown={handleKey}
                                placeholder="sanjay@gmail.com"
                                className="bg-orange-50 border border-orange-200 rounded-xl px-4 py-3 text-gray-800 text-sm outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-100 transition-all duration-200 placeholder:text-gray-300"
                            />
                        </div>

                        <div className="flex flex-col gap-1.5 animate-fadeIn stagger-2">
                            <div className="flex items-center justify-between">
                                <label className="text-xs font-medium text-gray-400 uppercase tracking-widest">Password</label>
                                <Link to="/forgot-password" className="text-orange-500 text-xs hover:text-orange-400 transition-colors">
                                    Forgot password?
                                </Link>
                            </div>
                            <input
                                type="password" value={password}
                                onChange={(e) => setPassword(e.target.value)} onKeyDown={handleKey}
                                placeholder="••••••••"
                                className="bg-orange-50 border border-orange-200 rounded-xl px-4 py-3 text-gray-800 text-sm outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-100 transition-all duration-200 placeholder:text-gray-300"
                            />
                        </div>

                        {error && (
                            <div className="animate-slideDown bg-red-50 border border-red-200 rounded-xl px-4 py-3 flex items-center gap-3">
                                <div className="w-1.5 h-1.5 rounded-full bg-red-400 shrink-0" />
                                <p className="text-red-500 text-sm">{error}</p>
                            </div>
                        )}

                        <button
                            onClick={submit} disabled={loading}
                            className="animate-fadeIn stagger-3 bg-orange-500 hover:bg-orange-400 active:bg-orange-600 text-white font-semibold py-3 rounded-xl transition-all duration-200 disabled:opacity-60 cursor-pointer mt-1 text-sm flex items-center justify-center gap-2 btn-press"
                        >
                            {loading ? <><Spinner /> Signing in...</> : "Sign In"}
                        </button>
                    </div>

                    <p className="text-center text-gray-400 text-sm mt-6">
                        Don't have an account?{" "}
                        <Link to="/register" className="text-orange-500 font-medium hover:text-orange-400 transition-colors">
                            Create one
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
}

export default Login;
