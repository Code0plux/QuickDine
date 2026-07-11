import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../api";
import Navbar from "../components/Navbar";

function RestaurantBookings() {
    const { id } = useParams();
    const [bookings, setBookings] = useState([]);
    const today = new Date().toISOString().split("T")[0];
    const [date, setDate] = useState(today);

    const fetchBookings = async () => {
        const res = await api.get(`/restaurants/myrestaurants/${id}/bookings?date=${date}`);
        setBookings(res.data.result);
    };

    useEffect(() => { fetchBookings(); }, [id]);

    const grouped = bookings.reduce((acc, b) => {
        const slot = b.booking_time ? b.booking_time.slice(0, 5) : "Unscheduled";
        if (!acc[slot]) acc[slot] = [];
        acc[slot].push(b);
        return acc;
    }, {});

    const slots = Object.keys(grouped).sort();

    return (
        <div className="min-h-screen bg-orange-50">
            <Navbar />
            <div className="max-w-5xl mx-auto px-6 py-10">

                <div className="mb-8">
                    <h1 className="text-orange-600 text-2xl font-bold tracking-tight">Bookings</h1>
                    <p className="text-orange-400 text-sm mt-1">View table reservations by time slot</p>
                </div>

                {/* Filter bar */}
                <div className="bg-white border border-orange-200 rounded-2xl p-5 mb-8 flex gap-4 items-end flex-wrap shadow-sm">
                    <div className="flex flex-col gap-1.5 flex-1 min-w-[180px]">
                        <label className="text-xs font-semibold text-orange-500 uppercase tracking-widest">Date</label>
                        <input
                            type="date"
                            value={date}
                            onChange={(e) => setDate(e.target.value)}
                            className="bg-orange-50 border border-orange-200 rounded-xl px-4 py-3 text-gray-800 text-sm outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-200 transition-all duration-200"
                        />
                    </div>
                    <button
                        onClick={fetchBookings}
                        className="bg-orange-500 hover:bg-orange-400 active:bg-orange-600 text-white font-semibold px-8 py-3 rounded-xl transition-all duration-200 cursor-pointer text-sm shadow-sm"
                    >
                        Filter
                    </button>
                </div>

                {slots.length === 0 ? (
                    <div className="text-center py-24 text-orange-300 text-sm">No bookings for this date</div>
                ) : (
                    <div className="flex flex-col gap-10">
                        {slots.map((slot) => (
                            <div key={slot}>
                                {/* Time slot header */}
                                <div className="flex items-center gap-3 mb-4">
                                    <span className="bg-orange-500 text-white text-xs font-bold px-4 py-1.5 rounded-full shadow-sm">
                                        {slot}
                                    </span>
                                    <div className="flex-1 h-px bg-orange-200" />
                                    <span className="text-xs text-orange-400 font-medium">{grouped[slot].length} table(s)</span>
                                </div>

                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                                    {grouped[slot].map((b, i) => {
                                        const isBooked = b.booking_status === "Booked";
                                        return (
                                            <div
                                                key={b.table_id}
                                                className={`bg-white rounded-2xl p-5 flex flex-col gap-3 transition-all duration-200 animate-fadeIn shadow-sm border ${
                                                    isBooked ? "border-red-200 hover:border-red-300" : "border-orange-100 hover:border-orange-300"
                                                }`}
                                                style={{ animationDelay: `${i * 50}ms` }}
                                            >
                                                <div className="flex items-center justify-between">
                                                    <p className="text-gray-900 font-semibold text-sm">Table {b.table_number}</p>
                                                    <span className={`text-xs font-semibold px-3 py-1 rounded-full border ${
                                                        isBooked
                                                            ? "bg-red-50 text-red-500 border-red-200"
                                                            : "bg-green-50 text-green-600 border-green-200"
                                                    }`}>
                                                        {isBooked ? "Booked" : "Available"}
                                                    </span>
                                                </div>
                                                <div className="flex flex-col gap-1.5 text-gray-400 text-xs">
                                                    <span>Capacity: <span className="text-gray-600 font-medium">{b.capacity}</span></span>
                                                    <span>Customer: <span className="text-gray-600 font-medium">{b.name || "—"}</span></span>
                                                    <span>Time: <span className="text-orange-500 font-medium">{b.booking_time || "—"}</span></span>
                                                </div>
                                                {isBooked && (
                                                    <div className="mt-1 h-1 w-full rounded-full bg-red-100">
                                                        <div className="h-1 w-full rounded-full bg-red-400" />
                                                    </div>
                                                )}
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}

export default RestaurantBookings;
