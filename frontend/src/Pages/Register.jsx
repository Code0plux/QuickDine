import { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";

function Register() {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [phone, setPhone] = useState("");
    const [password, setPassword] = useState("");
    const [role, setRole] = useState("customer");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const submit = async () => {
        setError("");
        setLoading(true);
        try {
            const res = await axios.post("http://localhost:3000/auth/register", { name, email, phone, password, role });
            localStorage.setItem("token", res.data.token);
            navigate("/restaurant");
        } catch (err) {
            setError(err.response?.data?.message || "Registration failed. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-orange-50 flex items-center justify-center px-4 py-10">
            <div className="w-full max-w-md animate-scaleIn">
                <div className="mb-8 text-center">
                    <h1 className="text-gray-900 font-bold text-2xl tracking-tight">Quick<span className="text-orange-500">Dine</span></h1>
                    <p className="text-gray-400 text-sm mt-2">Create your account</p>
                </div>

                <div className="bg-white border border-orange-100 rounded-2xl p-8 shadow-sm">
                    <div className="flex flex-col gap-5">
                        {[
                            { label: "Full Name", value: name, set: setName, type: "text", placeholder: "John Doe" },
                            { label: "Email", value: email, set: setEmail, type: "email", placeholder: "you@example.com" },
                            { label: "Phone", value: phone, set: setPhone, type: "text", placeholder: "+1 234 567 8900" },
                            { label: "Password", value: password, set: setPassword, type: "password", placeholder: "••••••••" },
                        ].map(({ label, value, set, type, placeholder }) => (
                            <div key={label} className="flex flex-col gap-1.5">
                                <label className="text-xs font-medium text-gray-400 uppercase tracking-widest">{label}</label>
                                <input type={type} value={value} onChange={(e) => set(e.target.value)} placeholder={placeholder}
                                    className="bg-orange-50 border border-orange-200 rounded-xl px-4 py-3 text-gray-800 text-sm outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-100 transition-all duration-200 placeholder:text-gray-300" />
                            </div>
                        ))}

                        <div className="flex flex-col gap-1.5">
                            <label className="text-xs font-medium text-gray-400 uppercase tracking-widest">Account Type</label>
                            <select value={role} onChange={(e) => setRole(e.target.value)}
                                className="bg-orange-50 border border-orange-200 rounded-xl px-4 py-3 text-gray-800 text-sm outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-100 transition-all duration-200">
                                <option value="customer">Customer</option>
                                <option value="owner">Restaurant Owner</option>
                            </select>
                        </div>

                        {error && (
                            <div className="animate-fadeIn bg-red-50 border border-red-200 rounded-xl px-4 py-3 flex items-center gap-3">
                                <div className="w-1.5 h-1.5 rounded-full bg-red-400 shrink-0"></div>
                                <p className="text-red-500 text-sm">{error}</p>
                            </div>
                        )}

                        <button onClick={submit} disabled={loading}
                            className="bg-orange-500 hover:bg-orange-400 text-white font-semibold py-3 rounded-xl transition-all duration-200 disabled:opacity-50 cursor-pointer mt-1 text-sm">
                            {loading ? "Creating account..." : "Create Account"}
                        </button>
                    </div>

                    <p className="text-center text-gray-400 text-sm mt-6">
                        Already have an account?{" "}
                        <Link to="/" className="text-orange-500 font-medium hover:text-orange-400 transition-colors">Sign in</Link>
                    </p>
                </div>
            </div>
        </div>
    );
}

export default Register;
