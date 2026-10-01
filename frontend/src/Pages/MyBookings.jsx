import { useEffect, useState } from "react";
import api from "../api";
import Navbar from "../components/Navbar";

function SkeletonRow() {
    return (
        <div className="bg-white border border-orange-100 rounded-2xl p-5 flex items-center justify-between gap-4">
            <div className="flex flex-col gap-2 flex-1">
                <div className="h-4 w-1/3 skeleton" />
                <div className="h-3 w-1/2 skeleton" />
            </div>
            <div className="h-7 w-20 skeleton rounded-full" />
        </div>
    );
}

const STATUS = {
    confirm:   { label: "Confirmed", cls: "bg-green-50 text-green-600 border-green-200" },
    cancelled: { label: "Cancelled", cls: "bg-red-50 text-red-500 border-red-200" },
};

function MyBookings() {
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [cancelling, setCancelling] = useState(null);

    const fetchBookings = async () => {
        try {
            const res = await api.get("/bookings/my");
            setBookings(res.data.data);
        } catch {
            setError("Failed to load bookings.");
        } finally {
            setLoading(false);
        }
    };

    const cancel = async (id) => {
        setCancelling(id);
        try {
            await api.patch(`/bookings/my/cancel/${id}`);
            await fetchBookings();
        } catch {
            setError("Failed to cancel booking.");
        } finally {
            setCancelling(null);
        }
    };

    useEffect(() => { fetchBookings(); }, []);

    const statusInfo = (s) => STATUS[s] || { label: s, cls: "bg-orange-50 text-orange-500 border-orange-200" };

    return (
        <div className="min-h-screen bg-orange-50">
            <Navbar />
            <div className="max-w-4xl mx-auto px-6 py-10">
                <div className="mb-8 animate-fadeIn">
                    <h1 className="text-gray-900 text-2xl font-bold tracking-tight">My Bookings</h1>
                    <p className="text-gray-400 text-sm mt-1">Manage your reservations</p>
                </div>

                {error && (
                    <div className="animate-slideDown mb-6 bg-red-50 border border-red-200 rounded-xl px-4 py-3 flex items-center gap-3">
                        <div className="w-1.5 h-1.5 rounded-full bg-red-400 shrink-0" />
                        <p className="text-red-500 text-sm">{error}</p>
                    </div>
                )}

                {loading ? (
                    <div className="flex flex-col gap-3">
                        {Array.from({ length: 4 }).map((_, i) => <SkeletonRow key={i} />)}
                    </div>
                ) : bookings.length === 0 ? (
                    <div className="text-center py-24 animate-fadeIn">
                        <p className="text-5xl mb-4">📋</p>
                        <p className="text-gray-400 text-sm">No bookings yet — go reserve a table!</p>
                    </div>
                ) : (
                    <div className="flex flex-col gap-3">
                        {bookings.map((b, i) => {
                            const { label, cls } = statusInfo(b.booking_status);
                            return (
                                <div
                                    key={b.booking_id}
                                    className="bg-white border border-orange-100 rounded-2xl p-5 flex items-center justify-between flex-wrap gap-4 hover:border-orange-300 hover:shadow-sm hover:-translate-y-px transition-all duration-200 animate-fadeIn"
                                    style={{ animationDelay: `${i * 50}ms` }}
                                >
                                    <div className="flex flex-col gap-1.5">
                                        <p className="text-gray-900 font-medium text-sm">Reservation #{b.booking_id}</p>
                                        <div className="flex gap-5 text-gray-400 text-xs flex-wrap">
                                            <span>📅 {b.booking_date}</span>
                                            <span>🕐 {b.booking_time}</span>
                                            <span>👥 {b.guest_count} guests</span>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <span className={`text-xs font-medium px-3 py-1 rounded-full border ${cls}`}>
                                            {label}
                                        </span>
                                        {b.booking_status === "confirm" && (
                                            <button
                                                onClick={() => cancel(b.booking_id)}
                                                disabled={cancelling === b.booking_id}
                                                className="text-xs border border-orange-200 text-orange-400 hover:border-red-300 hover:text-red-500 px-3 py-1.5 rounded-lg transition-all duration-200 cursor-pointer disabled:opacity-50 btn-press"
                                            >
                                                {cancelling === b.booking_id ? "Cancelling..." : "Cancel"}
                                            </button>
                                        )}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>
        </div>
    );
}

export default MyBookings;
