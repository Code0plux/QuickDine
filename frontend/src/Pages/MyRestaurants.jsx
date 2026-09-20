import { useEffect, useState } from "react";
import api from "../api";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";

function SkeletonCard() {
    return (
        <div className="bg-white border border-orange-100 rounded-2xl overflow-hidden">
            <div className="h-36 skeleton" />
            <div className="p-5 flex flex-col gap-4">
                <div className="h-4 w-2/3 skeleton" />
                <div className="h-3 w-1/2 skeleton" />
                <div className="flex gap-3">
                    <div className="flex-1 h-9 skeleton" />
                    <div className="flex-1 h-9 skeleton" />
                    <div className="w-16 h-9 skeleton" />
                </div>
            </div>
        </div>
    );
}

function MyRestaurants() {
    const [restaurants, setRestaurants] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    const fetchRestaurants = async () => {
        const res = await api.get("/restaurants/myrestaurants");
        setRestaurants(res.data.data);
        setLoading(false);
    };

    useEffect(() => { fetchRestaurants(); }, []);

    const deleteRestaurant = async (id) => {
        if (!confirm("Delete this restaurant?")) return;
        await api.delete(`/restaurants/${id}`);
        fetchRestaurants();
    };

    return (
        <div className="min-h-screen bg-orange-50">
            <Navbar />
            <div className="max-w-5xl mx-auto px-6 py-10">
                <div className="flex items-center justify-between mb-8 animate-fadeIn">
                    <div>
                        <h1 className="text-gray-900 text-2xl font-bold tracking-tight">My Restaurants</h1>
                        <p className="text-gray-400 text-sm mt-1">Manage your listings</p>
                    </div>
                    <button
                        onClick={() => navigate("/restaurants/add")}
                        className="bg-orange-500 hover:bg-orange-400 active:bg-orange-600 text-white font-medium px-4 py-2.5 rounded-xl transition-all duration-200 cursor-pointer text-sm btn-press"
                    >
                        + Add Restaurant
                    </button>
                </div>

                {loading ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                        {Array.from({ length: 4 }).map((_, i) => <SkeletonCard key={i} />)}
                    </div>
                ) : restaurants.length === 0 ? (
                    <div className="text-center py-24 animate-fadeIn">
                        <p className="text-5xl mb-4">🏪</p>
                        <p className="text-gray-400 text-sm">No restaurants yet — add your first one!</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                        {restaurants.map((r, i) => (
                            <div
                                key={r.restaurant_id}
                                className="bg-white border border-orange-100 rounded-2xl overflow-hidden hover:border-orange-300 hover:shadow-md hover:shadow-orange-100 hover:-translate-y-0.5 transition-all duration-300 animate-fadeIn"
                                style={{ animationDelay: `${i * 60}ms` }}
                            >
                                <div className="h-36 bg-orange-50 overflow-hidden">
                                    {r.cover_img ? (
                                        <img src={r.cover_img} alt={r.restaurant_name} className="w-full h-full object-cover hover:scale-105 transition-transform duration-500" />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center text-4xl">🍴</div>
                                    )}
                                </div>
                                <div className="p-5 flex flex-col gap-4">
                                    <div>
                                        <h2 className="text-gray-900 font-semibold text-base">{r.restaurant_name}</h2>
                                        <p className="text-gray-400 text-sm mt-0.5">{r.address}</p>
                                    </div>
                                    <div className="flex gap-3">
                                        <button
                                            onClick={() => navigate(`/myrestaurants/${r.restaurant_id}/bookings`)}
                                            className="flex-1 bg-orange-50 hover:bg-orange-100 text-orange-600 text-sm font-medium py-2 rounded-xl transition-all duration-200 cursor-pointer border border-orange-200 btn-press"
                                        >
                                            Bookings
                                        </button>
                                        <button
                                            onClick={() => navigate(`/myrestaurants/${r.restaurant_id}/edit`)}
                                            className="flex-1 bg-orange-500 hover:bg-orange-400 text-white text-sm font-medium py-2 rounded-xl transition-all duration-200 cursor-pointer btn-press"
                                        >
                                            Edit
                                        </button>
                                        <button
                                            onClick={() => deleteRestaurant(r.restaurant_id)}
                                            className="bg-red-50 hover:bg-red-100 text-red-500 border border-red-200 text-sm font-medium px-3 py-2 rounded-xl transition-all duration-200 cursor-pointer btn-press"
                                        >
                                            🗑
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}

export default MyRestaurants;
