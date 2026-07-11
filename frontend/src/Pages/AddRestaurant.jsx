import { useState } from "react";
import api from "../api";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";

function AddRestaurant() {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [phone, setPhone] = useState("");
    const [address, setAddress] = useState("");
    const [image, setImage] = useState(null);
    const [preview, setPreview] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const navigate = useNavigate();

    const handleImage = (e) => {
        const file = e.target.files[0];
        setImage(file);
        setPreview(URL.createObjectURL(file));
    };

    const uploadToCloudinary = async () => {
        const formData = new FormData();
        formData.append("file", image);
        formData.append("upload_preset", "quickdine");
        const res = await fetch("https://api.cloudinary.com/v1_1/do9yntyim/image/upload", { method: "POST", body: formData });
        const data = await res.json();
        return data.secure_url;
    };

    const submit = async () => {
        setError("");
        setLoading(true);
        try {
            let cover_img = null;
            if (image) cover_img = await uploadToCloudinary();
            await api.post("/restaurants", { name, email, phone, address, cover_img });
            navigate("/myrestaurants");
        } catch (err) {
            setError(err.response?.data?.message || "Failed to add restaurant.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-orange-50">
            <Navbar />
            <div className="max-w-lg mx-auto px-6 py-10">
                <div className="mb-8 animate-fadeIn">
                    <h1 className="text-gray-900 text-2xl font-bold tracking-tight">Add Restaurant</h1>
                    <p className="text-gray-400 text-sm mt-1">Fill in your restaurant details</p>
                </div>

                <div className="bg-white border border-orange-100 rounded-2xl p-6 flex flex-col gap-5 shadow-sm animate-scaleIn">
                    {[
                        { label: "Restaurant Name", value: name, set: setName, type: "text", placeholder: "The Grand Bistro" },
                        { label: "Email", value: email, set: setEmail, type: "email", placeholder: "contact@restaurant.com" },
                        { label: "Phone", value: phone, set: setPhone, type: "text", placeholder: "+1 234 567 8900" },
                        { label: "Address", value: address, set: setAddress, type: "text", placeholder: "123 Main St, City" },
                    ].map(({ label, value, set, type, placeholder }, i) => (
                        <div key={i} className="flex flex-col gap-1.5">
                            <label className="text-xs font-medium text-gray-400 uppercase tracking-widest">{label}</label>
                            <input type={type} value={value} onChange={(e) => set(e.target.value)} placeholder={placeholder}
                                className="bg-orange-50 border border-orange-200 rounded-xl px-4 py-3 text-gray-800 text-sm outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-100 transition-all duration-200 placeholder:text-gray-300" />
                        </div>
                    ))}

                    <div className="flex flex-col gap-1.5">
                        <label className="text-xs font-medium text-gray-400 uppercase tracking-widest">Cover Image</label>
                        <input type="file" accept="image/*" onChange={handleImage}
                            className="bg-orange-50 border border-orange-200 rounded-xl px-4 py-3 text-gray-500 text-sm outline-none file:mr-3 file:bg-orange-500 file:text-white file:border-none file:rounded-lg file:px-3 file:py-1 file:cursor-pointer cursor-pointer transition-all duration-200" />
                        {preview && (
                            <img src={preview} alt="preview" className="mt-2 rounded-xl h-40 w-full object-cover border border-orange-100 animate-fadeIn" />
                        )}
                    </div>

                    {error && (
                        <div className="animate-fadeIn bg-red-50 border border-red-200 rounded-xl px-4 py-3 flex items-center gap-3">
                            <div className="w-1.5 h-1.5 rounded-full bg-red-400 shrink-0"></div>
                            <p className="text-red-500 text-sm">{error}</p>
                        </div>
                    )}

                    <button onClick={submit} disabled={loading}
                        className="bg-orange-500 hover:bg-orange-400 text-white font-medium py-3 rounded-xl transition-all duration-200 disabled:opacity-50 cursor-pointer text-sm">
                        {loading ? "Uploading..." : "Add Restaurant"}
                    </button>
                </div>
            </div>
        </div>
    );
}

export default AddRestaurant;
