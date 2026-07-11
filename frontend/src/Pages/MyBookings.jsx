import { useEffect, useState } from "react";
import api from "../api";
import Navbar from "../components/Navbar";

function MyBookings() {
    const [bookings, setBookings] = useState([]);
    const [error, setError] = useState("");

    const fetchBookings = async () => {
        try {
            const res = await api.get("/bookings/my");
            setBookings(res.data.data);
        } catch {
            setError("Failed to load bookings.");
        }
    };

    const cancel = async (id) => {
        try {
            await api.patch(`/bookings/my/cancel/${id}`);
            fetchBookings();
        } catch {
            setError("Failed to cancel booking.");
        }
    };

    useEffect(() => { fetchBookings(); }, []);

    const statusStyle = (status) => {
        if (status === "confirm") return "bg-green-50 text-green-600 border border-green-200";
        if (status === "cancelled") return "bg-red-50 text-red-500 border border-red-200";
        return "bg-orange-50 text-orange-500 border border-orange-200";
    };

    const statusLabel = (status) => {
        if (status === "confirm") return "Confirmed";
        if (status === "cancelled") return "Cancelled";
        return status;
    };

    return (
        <div className="min-h-screen bg-orange-50">
            <Navbar />
            <div className="max-w-4xl mx-auto px-6 py-10">
                <div className="mb-8 animate-fadeIn">
                    <h1 className="text-gray-900 text-2xl font-bold tracking-tight">My Bookings</h1>
                    <p className="text-gray-400 text-sm mt-1">Manage your reservations</p>
                </div>

                {error && (
                    <div className="animate-fadeIn mb-6 bg-red-50 border border-red-200 rounded-xl px-4 py-3 flex items-center gap-3">
                        <div className="w-1.5 h-1.5 rounded-full bg-red-400 shrink-0"></div>
                        <p className="text-red-500 text-sm">{error}</p>
                    </div>
                )}

                {bookings.length === 0 ? (
                    <div className="text-center py-24 text-gray-300 text-sm">No bookings found</div>
                ) : (
                    <div className="flex flex-col gap-3">
                        {bookings.map((b, i) => (
                            <div key={b.booking_id}
                                className="bg-white border border-orange-100 rounded-2xl p-5 flex items-center justify-between flex-wrap gap-4 hover:border-orange-300 hover:shadow-sm transition-all duration-200 animate-fadeIn"
                                style={{ animationDelay: `${i * 50}ms` }}>
                                <div className="flex flex-col gap-1.5">
                                    <p className="text-gray-900 font-medium text-sm">Reservation #{b.booking_id}</p>
                                    <div className="flex gap-5 text-gray-400 text-xs flex-wrap">
                                        <span>{b.booking_date}</span>
                                        <span>{b.booking_time}</span>
                                        <span>{b.guest_count} guests</span>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3">
                                    <span className={`text-xs font-medium px-3 py-1 rounded-full ${statusStyle(b.booking_status)}`}>
                                        {statusLabel(b.booking_status)}
                                    </span>
                                    {b.booking_status === "confirm" && (
                                        <button onClick={() => cancel(b.booking_id)}
                                            className="text-xs border border-orange-200 text-orange-400 hover:border-red-300 hover:text-red-500 px-3 py-1.5 rounded-lg transition-all duration-200 cursor-pointer">
                                            Cancel
                                        </button>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}

export default MyBookings;
