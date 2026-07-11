import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../api";
import Navbar from "../components/Navbar";

function AddTable() {
    const { id } = useParams();
    const [tableNumber, setTableNumber] = useState("");
    const [capacity, setCapacity] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const navigate = useNavigate();

    const submit = async () => {
        setError("");
        setLoading(true);
        try {
            await api.post(`/restaurants/${id}/table`, { res_id: id, table_number: tableNumber, capacity });
            navigate("/myrestaurants");
        } catch (err) {
            setError(err.response?.data?.message || "Failed to add table.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-orange-50">
            <Navbar />
            <div className="max-w-lg mx-auto px-6 py-10">
                <div className="mb-8 animate-fadeIn">
                    <h1 className="text-gray-900 text-2xl font-bold tracking-tight">Add Table</h1>
                    <p className="text-gray-400 text-sm mt-1">Add a new table to your restaurant</p>
                </div>

                <div className="bg-white border border-orange-100 rounded-2xl p-6 flex flex-col gap-5 shadow-sm animate-scaleIn">
                    <div className="flex flex-col gap-1.5">
                        <label className="text-xs font-medium text-gray-400 uppercase tracking-widest">Table Number</label>
                        <input value={tableNumber} onChange={(e) => setTableNumber(e.target.value)} placeholder="e.g. 1"
                            className="bg-orange-50 border border-orange-200 rounded-xl px-4 py-3 text-gray-800 text-sm outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-100 transition-all duration-200 placeholder:text-gray-300" />
                    </div>
                    <div className="flex flex-col gap-1.5">
                        <label className="text-xs font-medium text-gray-400 uppercase tracking-widest">Capacity</label>
                        <input type="number" value={capacity} onChange={(e) => setCapacity(e.target.value)} placeholder="e.g. 4"
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
                        {loading ? "Adding..." : "Add Table"}
                    </button>
                </div>
            </div>
        </div>
    );
}

export default AddTable;
