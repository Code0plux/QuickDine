import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import api from "../api";
import Navbar from "../components/Navbar";
import { getRole } from "../utils/auth";

const getEndTime = (time) => {
    const [h, m] = time.split(":").map(Number);
    const d = new Date();
    d.setHours(h + 1, m, 0);
    return d.toTimeString().slice(0, 5);
};

const generateSlots = () => {
    const slots = [];
    let h = 12, m = 0;
    while (!(h === 24 && m === 0)) {
        const label = `${String(h % 24).padStart(2, "0")}:${String(m).padStart(2, "0")}`;
        const totalMin = h * 60 + m;
        const category =
            totalMin < 16 * 60 + 30 ? "Lunch" :
            totalMin < 18 * 60 + 30 ? "Snacks" : "Dinner";
        slots.push({ label, category });
        m += 30;
        if (m === 60) { m = 0; h++; }
    }
    return slots;
};

const ALL_SLOTS = generateSlots();
const CATEGORIES = ["Lunch", "Snacks", "Dinner"];
const CATEGORY_COLOR = {
    Lunch:  "text-orange-500 border-orange-300 bg-orange-50",
    Snacks: "text-amber-500 border-amber-300 bg-amber-50",
    Dinner: "text-rose-500 border-rose-300 bg-rose-50",
};
const SLOT_ACTIVE = {
    Lunch:  "bg-orange-500 text-white border-orange-500",
    Snacks: "bg-amber-500 text-white border-amber-500",
    Dinner: "bg-rose-500 text-white border-rose-500",
};

function RestaurantDetails() {
    const { id } = useParams();
    const [restaurant, setRestaurant] = useState([]);
    const [time, setTime] = useState("");
    const [date, setDate] = useState("");
    const [guest, setGuest] = useState(null);
    const [tables, setTables] = useState([]);
    const [searched, setSearched] = useState(false);
    const [booking, setBooking] = useState(null);
    const [error, setError] = useState("");
    const [searchError, setSearchError] = useState("");
    const [activeCategory, setActiveCategory] = useState("Lunch");
    const role = getRole();

    useEffect(() => {
        api.get(`/restaurants/${id}`).then(res => setRestaurant(res.data.Data));
    }, [id]);

    const search = async () => {
        setSearchError("");
        if (!date || !time || !guest) return setSearchError("Please select date, time, and number of guests.");
        try {
            const result = await api.get(`/restaurants/${id}/table?date=${date}&time=${time}&guest=${guest}`);
            setTables(result.data);
            setSearched(true);
        } catch {
            setSearchError("Failed to fetch tables. Please try again.");
        }
    };

    const bookTable = async (tab) => {
        setError("");
        try {
            await api.post("/bookings/", {
                table_id: tab.table_id,
                res_id: restaurant[0].restaurant_id,
                date, time,
                end: getEndTime(time),
                guest
            });
            setBooking(tab.table_number);
            setTables([]);
        } catch (e) {
            setError(e.response?.data?.message || "Booking failed. Please try again.");
        }
    };

    const r = restaurant[0];
    const categorySlots = ALL_SLOTS.filter(s => s.category === activeCategory);
    const guestOptions = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, "11+"];

    return (
        <div className="min-h-screen bg-orange-50">
            <Navbar />

            {/* Booking success modal */}
            {booking && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm animate-backdropIn">
                    <div className="bg-white border border-orange-100 rounded-2xl p-10 flex flex-col items-center gap-5 max-w-sm w-full mx-4 shadow-xl animate-scaleIn">
                        <div className="relative flex items-center justify-center">
                            <div className="absolute w-16 h-16 rounded-full bg-green-200 opacity-60 animate-pingOnce" />
                            <div className="w-16 h-16 rounded-full bg-green-50 flex items-center justify-center relative z-10">
                                <svg className="w-8 h-8 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" className="animate-checkDraw" />
                                </svg>
                            </div>
                        </div>
                        <div className="text-center animate-fadeIn stagger-1">
                            <p className="text-gray-900 font-semibold text-lg">Booking Confirmed!</p>
                            <p className="text-gray-400 text-sm mt-1">Table {booking} has been reserved for you</p>
                            <p className="text-gray-300 text-xs mt-1">{date} at {time}</p>
                        </div>
                        <button
                            onClick={() => setBooking(null)}
                            className="w-full bg-orange-500 hover:bg-orange-400 active:bg-orange-600 text-white font-medium py-2.5 rounded-xl transition-all duration-200 cursor-pointer text-sm btn-press animate-fadeIn stagger-2"
                        >
                            Done
                        </button>
                    </div>
                </div>
            )}

            {r && (
                <div>
                    {/* Hero */}
                    <div className="relative h-56 bg-orange-100 overflow-hidden">
                        {r.cover_img ? (
                            <img src={r.cover_img} alt={r.restaurant_name} className="w-full h-full object-cover" />
                        ) : (
                            <div className="w-full h-full bg-orange-100" />
                        )}
                        <div className="absolute inset-0 bg-gradient-to-t from-white/90 via-white/40 to-transparent" />
                        <div className="absolute bottom-6 left-6 animate-slideRight">
                            <h1 className="text-gray-900 text-2xl font-bold tracking-tight">{r.restaurant_name}</h1>
                            <div className="flex gap-4 mt-1 text-gray-500 text-sm flex-wrap">
                                <span>{r.address}</span>
                                <span>{r.phone}</span>
                                <span>{r.email}</span>
                            </div>
                        </div>
                    </div>

                    <div className="max-w-4xl mx-auto px-6 py-8">
                        <div className="bg-white border border-orange-100 rounded-2xl overflow-hidden mb-8 shadow-sm animate-fadeIn">
                            <div className="grid grid-cols-1 md:grid-cols-2">
                                <div className="h-56 md:min-h-full bg-orange-50 overflow-hidden">
                                    {r.cover_img ? (
                                        <img src={r.cover_img} alt={r.restaurant_name} className="w-full h-full object-cover" />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center text-5xl">🍴</div>
                                    )}
                                </div>

                                <div className="p-6 flex flex-col gap-5">
                                    <h2 className="text-orange-500 text-xs font-semibold uppercase tracking-widest">Reserve a Table</h2>

                                    <div className="flex flex-col gap-1.5">
                                        <label className="text-xs font-medium text-gray-400 uppercase tracking-widest">Date</label>
                                        <input
                                            type="date" value={date}
                                            min={new Date().toISOString().split("T")[0]}
                                            max={new Date(Date.now() + 20 * 24 * 60 * 60 * 1000).toISOString().split("T")[0]}
                                            onChange={(e) => setDate(e.target.value)}
                                            className="w-full bg-orange-50 border border-orange-200 text-gray-800 rounded-xl p-3 text-sm focus:outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-100 cursor-pointer transition-all duration-200"
                                        />
                                        {date && <p className="text-orange-500 text-xs mt-1">{new Date(date + "T00:00:00").toDateString()}</p>}
                                    </div>

                                    <div className="flex flex-col gap-2">
                                        <label className="text-xs font-medium text-gray-400 uppercase tracking-widest">Guests</label>
                                        <div className="flex flex-wrap gap-2">
                                            {guestOptions.map(g => (
                                                <button
                                                    key={g} onClick={() => setGuest(g === "11+" ? 11 : g)}
                                                    className={`w-10 h-10 rounded-lg text-sm font-medium border transition-all duration-150 cursor-pointer btn-press
                                                        ${guest === (g === "11+" ? 11 : g)
                                                            ? "bg-orange-500 border-orange-500 text-white scale-105"
                                                            : "bg-orange-50 border-orange-200 text-gray-600 hover:border-orange-400"}`}
                                                >
                                                    {g}
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="border-t border-orange-100 p-6 flex flex-col gap-4">
                                <label className="text-xs font-medium text-gray-400 uppercase tracking-widest">Time</label>
                                <div className="flex gap-2">
                                    {CATEGORIES.map(cat => (
                                        <button
                                            key={cat} onClick={() => setActiveCategory(cat)}
                                            className={`px-4 py-1.5 rounded-full text-xs font-semibold border transition-all duration-150 cursor-pointer btn-press
                                                ${activeCategory === cat ? CATEGORY_COLOR[cat] : "bg-white border-orange-200 text-gray-400 hover:border-orange-300"}`}
                                        >
                                            {cat}
                                        </button>
                                    ))}
                                </div>
                                <div className="flex flex-wrap gap-2">
                                    {categorySlots.map(s => (
                                        <button
                                            key={s.label} onClick={() => setTime(s.label)}
                                            className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-all duration-150 cursor-pointer btn-press
                                                ${time === s.label
                                                    ? SLOT_ACTIVE[s.category]
                                                    : "bg-white border-orange-200 text-gray-500 hover:border-orange-400"}`}
                                        >
                                            {s.label}
                                        </button>
                                    ))}
                                </div>

                                {searchError && (
                                    <div className="animate-slideDown bg-red-50 border border-red-200 rounded-xl px-4 py-3 flex items-center gap-3">
                                        <div className="w-1.5 h-1.5 rounded-full bg-red-400 shrink-0" />
                                        <p className="text-red-500 text-sm">{searchError}</p>
                                    </div>
                                )}

                                <button
                                    onClick={search}
                                    className="self-start bg-orange-500 hover:bg-orange-400 active:bg-orange-600 text-white font-medium px-6 py-2.5 rounded-xl transition-all duration-200 cursor-pointer text-sm btn-press"
                                >
                                    Search Tables
                                </button>
                            </div>
                        </div>

                        {error && (
                            <div className="animate-slideDown mb-6 bg-red-50 border border-red-200 rounded-xl px-4 py-3 flex items-center gap-3">
                                <div className="w-1.5 h-1.5 rounded-full bg-red-400 shrink-0" />
                                <p className="text-red-500 text-sm">{error}</p>
                            </div>
                        )}

                        {searched && tables.length === 0 && (
                            <div className="text-center py-12 animate-fadeIn">
                                <p className="text-4xl mb-3">🪑</p>
                                <p className="text-gray-400 text-sm">No available tables for the selected time</p>
                            </div>
                        )}

                        {tables.length > 0 && (
                            <div className="animate-slideUp">
                                <h2 className="text-orange-500 font-semibold text-xs uppercase tracking-widest mb-4">Available Tables</h2>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    {tables.map((tab, i) => (
                                        <div
                                            key={tab.table_id}
                                            className="bg-white border border-orange-100 rounded-2xl p-5 flex items-center justify-between hover:border-orange-300 hover:shadow-sm hover:-translate-y-px transition-all duration-200 animate-fadeIn"
                                            style={{ animationDelay: `${i * 60}ms` }}
                                        >
                                            <div>
                                                <p className="text-gray-900 font-medium">Table {tab.table_number}</p>
                                                <p className="text-gray-400 text-sm mt-0.5">Seats up to {tab.capacity} guests</p>
                                            </div>
                                            <button
                                                onClick={() => bookTable(tab)}
                                                disabled={role === "owner"}
                                                className="bg-orange-500 hover:bg-orange-400 active:bg-orange-600 text-white font-medium px-5 py-2 rounded-xl transition-all duration-200 text-sm cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed btn-press"
                                            >
                                                {role === "owner" ? "View only" : "Reserve"}
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}

export default RestaurantDetails;
