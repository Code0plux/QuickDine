import { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";

function Spinner() {
    return <span className="inline-block w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />;
}

const FIELDS = [
    { label: "Full Name",  key: "name",     type: "text",     placeholder: "Sanjay" },
    { label: "Email",      key: "email",    type: "email",    placeholder: "sanjay@gmail.com" },
    { label: "Phone",      key: "phone",    type: "text",     placeholder: "9344588233" },
    { label: "Password",   key: "password", type: "password", placeholder: "••••••••" },
];

function Register() {
    const [form, setForm] = useState({ name: "", email: "", phone: "", password: "" });
    const [role, setRole] = useState("customer");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const set = (key) => (e) => setForm(p => ({ ...p, [key]: e.target.value }));

    const submit = async () => {
        setError("");
        setLoading(true);
        try {
            const res = await axios.post(`${import.meta.env.VITE_API_BASE_URL}/auth/register`, { ...form, role });
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
            <div className="w-full max-w-md">
                <div className="mb-8 text-center animate-slideDown">
                    <h1 className="text-gray-900 font-bold text-3xl tracking-tight">
                        Quick<span className="text-orange-500">Dine</span>
                    </h1>
                    <p className="text-gray-400 text-sm mt-2">Create your account</p>
                </div>

                <div className="bg-white border border-orange-100 rounded-2xl p-8 shadow-sm animate-scaleIn">
                    <div className="flex flex-col gap-5">
                        {FIELDS.map(({ label, key, type, placeholder }, i) => (
                            <div key={key} className={`flex flex-col gap-1.5 animate-fadeIn stagger-${i + 1}`}>
                                <label className="text-xs font-medium text-gray-400 uppercase tracking-widest">{label}</label>
                                <input
                                    type={type} value={form[key]}
                                    onChange={set(key)} placeholder={placeholder}
                                    className="bg-orange-50 border border-orange-200 rounded-xl px-4 py-3 text-gray-800 text-sm outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-100 transition-all duration-200 placeholder:text-gray-300"
                                />
                            </div>
                        ))}

                        <div className="flex flex-col gap-2 animate-fadeIn stagger-5">
                            <label className="text-xs font-medium text-gray-400 uppercase tracking-widest">Account Type</label>
                            <div className="flex gap-3">
                                {["customer", "owner"].map((r) => (
                                    <button
                                        key={r} onClick={() => setRole(r)}
                                        className={`flex-1 py-2.5 rounded-xl text-sm font-medium border transition-all duration-200 cursor-pointer btn-press capitalize
                                            ${role === r
                                                ? "bg-orange-500 border-orange-500 text-white"
                                                : "bg-orange-50 border-orange-200 text-gray-500 hover:border-orange-400"}`}
                                    >
                                        {r === "customer" ? "Customer" : "Restaurant Owner"}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {error && (
                            <div className="animate-slideDown bg-red-50 border border-red-200 rounded-xl px-4 py-3 flex items-center gap-3">
                                <div className="w-1.5 h-1.5 rounded-full bg-red-400 shrink-0" />
                                <p className="text-red-500 text-sm">{error}</p>
                            </div>
                        )}

                        <button
                            onClick={submit} disabled={loading}
                            className="bg-orange-500 hover:bg-orange-400 active:bg-orange-600 text-white font-semibold py-3 rounded-xl transition-all duration-200 disabled:opacity-60 cursor-pointer mt-1 text-sm flex items-center justify-center gap-2 btn-press"
                        >
                            {loading ? <><Spinner /> Creating account...</> : "Create Account"}
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
