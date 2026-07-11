import { useState } from "react";
import axios from "axios";
import { useNavigate, useSearchParams, Link } from "react-router-dom";

function ResetPassword() {
    const [searchParams] = useSearchParams();
    const [token, setToken] = useState(searchParams.get("token") || "");
    const [password, setPassword] = useState("");
    const [confirm, setConfirm] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const submit = async () => {
        setError("");
        if (password !== confirm) return setError("Passwords do not match");
        setLoading(true);
        try {
            await axios.post("http://localhost:3000/auth/reset-password", { token, password });
            navigate("/");
        } catch (err) {
            setError(err.response?.data?.message || "Reset failed");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-orange-50 flex items-center justify-center px-4">
            <div className="w-full max-w-md animate-scaleIn">
                <div className="mb-8 text-center">
                    <h1 className="text-gray-900 font-bold text-2xl tracking-tight">Quick<span className="text-orange-500">Dine</span></h1>
                    <p className="text-gray-400 text-sm mt-2">Set a new password</p>
                </div>

                <div className="bg-white border border-orange-100 rounded-2xl p-8 shadow-sm">
                    <div className="flex flex-col gap-5">
                        <div className="flex flex-col gap-1.5">
                            <label className="text-xs font-medium text-gray-400 uppercase tracking-widest">Reset Token</label>
                            <input value={token} onChange={(e) => setToken(e.target.value)} placeholder="Paste your reset token"
                                className="bg-orange-50 border border-orange-200 rounded-xl px-4 py-3 text-gray-800 text-sm outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-100 transition-all duration-200 font-mono placeholder:text-gray-300" />
                        </div>
                        <div className="flex flex-col gap-1.5">
                            <label className="text-xs font-medium text-gray-400 uppercase tracking-widest">New Password</label>
                            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••"
                                className="bg-orange-50 border border-orange-200 rounded-xl px-4 py-3 text-gray-800 text-sm outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-100 transition-all duration-200 placeholder:text-gray-300" />
                        </div>
                        <div className="flex flex-col gap-1.5">
                            <label className="text-xs font-medium text-gray-400 uppercase tracking-widest">Confirm Password</label>
                            <input type="password" value={confirm} onChange={(e) => setConfirm(e.target.value)} placeholder="••••••••"
                                className="bg-orange-50 border border-orange-200 rounded-xl px-4 py-3 text-gray-800 text-sm outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-100 transition-all duration-200 placeholder:text-gray-300" />
                        </div>

                        {error && (
                            <div className="animate-fadeIn bg-red-50 border border-red-200 rounded-xl px-4 py-3 flex items-center gap-3">
                                <div className="w-1.5 h-1.5 rounded-full bg-red-400 shrink-0"></div>
                                <p className="text-red-500 text-sm">{error}</p>
                            </div>
                        )}

                        <button onClick={submit} disabled={loading}
                            className="bg-orange-500 hover:bg-orange-400 text-white font-medium py-3 rounded-xl transition-all duration-200 disabled:opacity-50 cursor-pointer text-sm">
                            {loading ? "Resetting..." : "Reset Password"}
                        </button>
                    </div>

                    <p className="text-center text-gray-400 text-sm mt-6">
                        <Link to="/" className="text-orange-500 font-medium hover:text-orange-400 transition-colors">Back to Sign In</Link>
                    </p>
                </div>
            </div>
        </div>
    );
}

export default ResetPassword;
