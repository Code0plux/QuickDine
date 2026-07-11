import { useEffect, useState } from "react";
import api from "../api";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";

function MyRestaurants() {
    const [restaurants, setRestaurants] = useState([]);
    const navigate = useNavigate();

    const fetchRestaurants = async () => {
        const res = await api.get("/restaurants/myrestaurants");
        setRestaurants(res.data.data);
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
                    <button onClick={() => navigate("/restaurants/add")}
                        className="bg-orange-500 hover:bg-orange-400 text-white font-medium px-4 py-2.5 rounded-xl transition-all duration-200 cursor-pointer text-sm">
                        Add Restaurant
                    </button>
                </div>

                {restaurants.length === 0 ? (
                    <div className="text-center py-24 text-gray-300 text-sm">No restaurants yet</div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                        {restaurants.map((r, i) => (
                            <div key={r.restaurant_id}
                                className="bg-white border border-orange-100 rounded-2xl overflow-hidden hover:border-orange-300 hover:shadow-sm transition-all duration-200 animate-fadeIn"
                                style={{ animationDelay: `${i * 60}ms` }}>
                                <div className="h-36 bg-orange-50 overflow-hidden">
                                    {r.cover_img ? (
                                        <img src={r.cover_img} alt={r.restaurant_name} className="w-full h-full object-cover" />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center">
                                            <span className="text-gray-300 text-xs">No image</span>
                                        </div>
                                    )}
                                </div>
                                <div className="p-5 flex flex-col gap-4">
                                    <div>
                                        <h2 className="text-gray-900 font-semibold text-base">{r.restaurant_name}</h2>
                                        <p className="text-gray-400 text-sm mt-0.5">{r.address}</p>
                                    </div>
                                    <div className="flex gap-3">
                                        <button onClick={() => navigate(`/myrestaurants/${r.restaurant_id}/bookings`)}
                                            className="flex-1 bg-orange-50 hover:bg-orange-100 text-orange-600 text-sm font-medium py-2 rounded-xl transition-all duration-200 cursor-pointer border border-orange-200">
                                            View Bookings
                                        </button>
                                        <button onClick={() => navigate(`/myrestaurants/${r.restaurant_id}/edit`)}
                                            className="flex-1 bg-orange-500 hover:bg-orange-400 text-white text-sm font-medium py-2 rounded-xl transition-all duration-200 cursor-pointer">
                                            Edit
                                        </button>
                                        <button onClick={() => deleteRestaurant(r.restaurant_id)}
                                            className="bg-red-50 hover:bg-red-100 text-red-500 border border-red-200 text-sm font-medium px-3 py-2 rounded-xl transition-all duration-200 cursor-pointer">
                                            Delete
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
