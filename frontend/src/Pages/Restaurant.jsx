import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api";
import Navbar from "../components/Navbar";
import { getRole } from "../utils/auth";

function Restaurant() {
    const navigate = useNavigate();
    const [restaurants, setRes] = useState([]);
    const role = getRole();

    useEffect(() => {
        const get = async () => {
            const res = await api.get("/restaurants");
            setRes(res.data.Data);
        };
        get();
    }, []);

    return (
        <div className="min-h-screen bg-orange-50">
            <Navbar />
            <div className="max-w-6xl mx-auto px-6 py-10">
                <div className="mb-8 animate-fadeIn">
                    <h1 className="text-gray-900 text-2xl font-bold tracking-tight">Restaurants</h1>
                    <p className="text-gray-400 text-sm mt-1">Browse and reserve your table</p>
                </div>

                {restaurants.length === 0 ? (
                    <div className="text-center py-24 text-gray-300 text-sm">No restaurants available</div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                        {restaurants.map((r, i) => (
                            <div key={r.restaurant_id}
                                className="bg-white border border-orange-100 rounded-2xl overflow-hidden hover:border-orange-300 hover:shadow-md hover:shadow-orange-100 transition-all duration-300 flex flex-col animate-fadeIn"
                                style={{ animationDelay: `${i * 60}ms` }}>
                                <div className="h-44 bg-orange-50 overflow-hidden">
                                    {r.cover_img ? (
                                        <img src={r.cover_img} alt={r.restaurant_name} className="w-full h-full object-cover hover:scale-105 transition-transform duration-500" />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center">
                                            <span className="text-gray-300 text-sm">No image</span>
                                        </div>
                                    )}
                                </div>
                                <div className="p-5 flex flex-col gap-3 flex-1">
                                    <div>
                                        <h2 className="text-gray-900 font-semibold text-base">{r.restaurant_name}</h2>
                                        <p className="text-gray-400 text-sm mt-0.5">{r.address}</p>
                                    </div>
                                    <p className="text-gray-300 text-xs">{r.email}</p>
                                    {role === "owner" ? (
                                        <button onClick={() => navigate(`/myrestaurants/${r.restaurant_id}/bookings`)}
                                            className="mt-auto w-full bg-orange-50 hover:bg-orange-100 text-orange-600 text-sm font-medium py-2.5 rounded-xl transition-all duration-200 cursor-pointer border border-orange-200">
                                            View Bookings
                                        </button>
                                    ) : (
                                        <button onClick={() => navigate(`/restaurant/${r.restaurant_id}`)}
                                            className="mt-auto w-full bg-orange-500 hover:bg-orange-400 text-white text-sm font-medium py-2.5 rounded-xl transition-all duration-200 cursor-pointer">
                                            Reserve a Table
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

export default Restaurant;
