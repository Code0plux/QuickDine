import { useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";

function ForgotPassword() {
    const [email, setEmail] = useState("");
    const [token, setToken] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const submit = async () => {
        setError("");
        setLoading(true);
        try {
            const res = await axios.post("http://localhost:3000/auth/forgot-password", { email });
            setToken(res.data.reset_token);
        } catch (err) {
            setError(err.response?.data?.message || "Something went wrong");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-orange-50 flex items-center justify-center px-4">
            <div className="w-full max-w-md animate-scaleIn">
                <div className="mb-8 text-center">
                    <h1 className="text-gray-900 font-bold text-2xl tracking-tight">Quick<span className="text-orange-500">Dine</span></h1>
                    <p className="text-gray-400 text-sm mt-2">Reset your password</p>
                </div>

                <div className="bg-white border border-orange-100 rounded-2xl p-8 shadow-sm">
                    {!token ? (
                        <div className="flex flex-col gap-5">
                            <div className="flex flex-col gap-1.5">
                                <label className="text-xs font-medium text-gray-400 uppercase tracking-widest">Email</label>
                                <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com"
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
                                {loading ? "Sending..." : "Get Reset Token"}
                            </button>
                        </div>
                    ) : (
                        <div className="flex flex-col gap-5 animate-fadeIn">
                            <div className="bg-orange-50 border border-orange-200 rounded-xl p-4">
                                <p className="text-xs text-orange-400 mb-2 uppercase tracking-widest font-medium">Reset Token</p>
                                <p className="text-orange-600 text-sm break-all font-mono">{token}</p>
                            </div>
                            <p className="text-gray-400 text-sm">This token expires in 15 minutes.</p>
                            <button onClick={() => navigate(`/reset-password?token=${token}`)}
                                className="bg-orange-500 hover:bg-orange-400 text-white font-medium py-3 rounded-xl transition-all duration-200 cursor-pointer text-sm">
                                Continue to Reset Password
                            </button>
                        </div>
                    )}

                    <p className="text-center text-gray-400 text-sm mt-6">
                        <Link to="/" className="text-orange-500 font-medium hover:text-orange-400 transition-colors">Back to Sign In</Link>
                    </p>
                </div>
            </div>
        </div>
    );
}

export default ForgotPassword;
