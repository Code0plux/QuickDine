import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../api";
import Navbar from "../components/Navbar";

const CLOUDINARY_URL = import.meta.env.VITE_CLOUDINARY_URL;
const UPLOAD_PRESET = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET;

async function uploadImage(file) {
    const fd = new FormData();
    fd.append("file", file);
    fd.append("upload_preset", UPLOAD_PRESET);
    const res = await fetch(CLOUDINARY_URL, { method: "POST", body: fd });
    const data = await res.json();
    return data.secure_url;
}

function EditRestaurant() {
    const { id } = useParams();
    const navigate = useNavigate();

    const [info, setInfo] = useState({ restaurant_name: "", email: "", phone: "", address: "", cover_img: "" });
    const [tables, setTables] = useState([]);
    const [imageFile, setImageFile] = useState(null);
    const [preview, setPreview] = useState(null);
    const [saving, setSaving] = useState(false);
    const [infoMsg, setInfoMsg] = useState("");
    const [infoErr, setInfoErr] = useState("");
    const [editing, setEditing] = useState({});
    const [tableMsg, setTableMsg] = useState({});
    const [newTable, setNewTable] = useState({ table_number: "", capacity: "" });
    const [addMsg, setAddMsg] = useState("");

    const fetchData = async () => {
        const [resRes, tabRes] = await Promise.all([
            api.get(`/restaurants/${id}`),
            api.get(`/restaurants/${id}/tables`)
        ]);
        const r = resRes.data.Data[0];
        setInfo({ restaurant_name: r.restaurant_name, email: r.email, phone: r.phone, address: r.address, cover_img: r.cover_img || "" });
        setTables(tabRes.data);
    };

    useEffect(() => { fetchData(); }, [id]);

    const handleImagePick = (e) => {
        const file = e.target.files[0];
        if (!file) return;
        setImageFile(file);
        setPreview(URL.createObjectURL(file));
    };

    const saveInfo = async () => {
        setInfoErr(""); setInfoMsg("");
        setSaving(true);
        try {
            let cover_img = info.cover_img;
            if (imageFile) cover_img = await uploadImage(imageFile);
            await api.put(`/restaurants/${id}`, { ...info, cover_img });
            setInfoMsg("Restaurant info updated.");
            setImageFile(null);
            setPreview(null);
            fetchData();
        } catch (e) {
            setInfoErr(e.response?.data?.message || "Failed to save.");
        } finally {
            setSaving(false);
        }
    };

    const startEdit = (t) => setEditing(prev => ({ ...prev, [t.table_id]: { table_number: t.table_number, capacity: t.capacity } }));
    const cancelEdit = (tid) => setEditing(prev => { const n = { ...prev }; delete n[tid]; return n; });

    const saveTable = async (tableId) => {
        setTableMsg(prev => ({ ...prev, [tableId]: "" }));
        try {
            await api.put(`/restaurants/${id}/table/${tableId}`, editing[tableId]);
            setTableMsg(prev => ({ ...prev, [tableId]: "Saved" }));
            cancelEdit(tableId);
            fetchData();
        } catch (e) {
            setTableMsg(prev => ({ ...prev, [tableId]: e.response?.data?.message || "Failed" }));
        }
    };

    const deleteTable = async (tableId) => {
        if (!confirm("Delete this table?")) return;
        try {
            await api.delete(`/restaurants/${id}/table/${tableId}`);
            fetchData();
        } catch (e) {
            alert(e.response?.data?.message || "Failed to delete table.");
        }
    };

    const addTable = async () => {
        setAddMsg("");
        try {
            await api.post(`/restaurants/${id}/table`, { res_id: id, table_number: newTable.table_number, capacity: newTable.capacity });
            setNewTable({ table_number: "", capacity: "" });
            setAddMsg("Table added.");
            await fetchData();
        } catch (e) {
            setAddMsg(e.response?.data?.message || "Failed to add table.");
        }
    };

    const inputCls = "bg-orange-50 border border-orange-200 rounded-xl px-4 py-2.5 text-gray-800 text-sm outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-100 transition-all duration-200";

    return (
        <div className="min-h-screen bg-orange-50">
            <Navbar />
            <div className="max-w-3xl mx-auto px-6 py-10 flex flex-col gap-8">

                <div className="animate-fadeIn">
                    <h1 className="text-gray-900 text-2xl font-bold tracking-tight">Edit Restaurant</h1>
                    <p className="text-gray-400 text-sm mt-1">Update info, image, and tables</p>
                </div>

                {/* Restaurant Info */}
                <div className="bg-white border border-orange-100 rounded-2xl overflow-hidden shadow-sm animate-fadeIn">
                    <div className="relative h-44 bg-orange-50 overflow-hidden">
                        {(preview || info.cover_img) ? (
                            <img src={preview || info.cover_img} alt="cover" className="w-full h-full object-cover" />
                        ) : (
                            <div className="w-full h-full flex items-center justify-center text-gray-300 text-sm">No image</div>
                        )}
                        <label className="absolute bottom-3 right-3 bg-white/90 hover:bg-white border border-orange-200 text-orange-500 text-xs font-medium px-3 py-1.5 rounded-lg cursor-pointer transition-all duration-200 backdrop-blur-sm">
                            Change Image
                            <input type="file" accept="image/*" className="hidden" onChange={handleImagePick} />
                        </label>
                    </div>

                    <div className="p-6 flex flex-col gap-4">
                        <p className="text-orange-500 text-xs font-semibold uppercase tracking-widest">Restaurant Info</p>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            {[
                                { label: "Name", key: "restaurant_name" },
                                { label: "Email", key: "email" },
                                { label: "Phone", key: "phone" },
                                { label: "Address", key: "address" },
                            ].map(({ label, key }) => (
                                <div key={key} className="flex flex-col gap-1.5">
                                    <label className="text-xs text-gray-400 uppercase tracking-widest font-medium">{label}</label>
                                    <input value={info[key]} onChange={e => setInfo(p => ({ ...p, [key]: e.target.value }))} className={inputCls} />
                                </div>
                            ))}
                        </div>

                        {infoErr && <p className="text-red-500 text-sm">{infoErr}</p>}
                        {infoMsg && <p className="text-green-500 text-sm">{infoMsg}</p>}

                        <button onClick={saveInfo} disabled={saving}
                            className="self-start bg-orange-500 hover:bg-orange-400 text-white text-sm font-medium px-6 py-2.5 rounded-xl transition-all duration-200 cursor-pointer disabled:opacity-50">
                            {saving ? "Saving..." : "Save Changes"}
                        </button>
                    </div>
                </div>

                {/* Tables */}
                <div className="bg-white border border-orange-100 rounded-2xl p-6 flex flex-col gap-5 shadow-sm animate-fadeIn">
                    <p className="text-orange-500 text-xs font-semibold uppercase tracking-widest">Tables</p>

                    {tables.length === 0 ? (
                        <p className="text-gray-300 text-sm">No tables yet.</p>
                    ) : (
                        <div className="flex flex-col gap-3">
                            {tables.map(t => (
                                <div key={t.table_id} className="bg-orange-50 border border-orange-100 rounded-xl p-4 flex flex-col gap-3">
                                    {editing[t.table_id] ? (
                                        <div className="flex flex-wrap gap-3 items-end">
                                            <div className="flex flex-col gap-1">
                                                <label className="text-xs text-gray-400 uppercase tracking-widest">Table No.</label>
                                                <input value={editing[t.table_id].table_number}
                                                    onChange={e => setEditing(p => ({ ...p, [t.table_id]: { ...p[t.table_id], table_number: e.target.value } }))}
                                                    className="bg-white border border-orange-200 rounded-lg px-3 py-2 text-gray-800 text-sm outline-none focus:border-orange-500 w-24" />
                                            </div>
                                            <div className="flex flex-col gap-1">
                                                <label className="text-xs text-gray-400 uppercase tracking-widest">Capacity</label>
                                                <input type="number" value={editing[t.table_id].capacity}
                                                    onChange={e => setEditing(p => ({ ...p, [t.table_id]: { ...p[t.table_id], capacity: e.target.value } }))}
                                                    className="bg-white border border-orange-200 rounded-lg px-3 py-2 text-gray-800 text-sm outline-none focus:border-orange-500 w-24" />
                                            </div>
                                            <button onClick={() => saveTable(t.table_id)}
                                                className="bg-orange-500 hover:bg-orange-400 text-white text-sm font-medium px-4 py-2 rounded-lg cursor-pointer transition-all duration-200">
                                                Save
                                            </button>
                                            <button onClick={() => cancelEdit(t.table_id)}
                                                className="bg-white hover:bg-orange-50 text-gray-500 border border-orange-200 text-sm px-4 py-2 rounded-lg cursor-pointer transition-all duration-200">
                                                Cancel
                                            </button>
                                            {tableMsg[t.table_id] && <span className="text-xs text-green-500">{tableMsg[t.table_id]}</span>}
                                        </div>
                                    ) : (
                                        <div className="flex items-center justify-between flex-wrap gap-3">
                                            <div>
                                                <p className="text-gray-900 font-medium text-sm">Table {t.table_number}</p>
                                                <p className="text-gray-400 text-xs mt-0.5">Capacity: {t.capacity}</p>
                                            </div>
                                            <div className="flex gap-2">
                                                <button onClick={() => startEdit(t)}
                                                    className="bg-white hover:bg-orange-50 text-orange-500 border border-orange-200 text-xs font-medium px-3 py-1.5 rounded-lg cursor-pointer transition-all duration-200">
                                                    Edit
                                                </button>
                                                <button onClick={() => deleteTable(t.table_id)}
                                                    className="bg-red-50 hover:bg-red-100 text-red-500 border border-red-200 text-xs font-medium px-3 py-1.5 rounded-lg cursor-pointer transition-all duration-200">
                                                    Delete
                                                </button>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    )}

                    <div className="border-t border-orange-100 pt-5 flex flex-col gap-3">
                        <p className="text-orange-500 text-xs font-semibold uppercase tracking-widest">Add New Table</p>
                        <div className="flex flex-wrap gap-3 items-end">
                            <div className="flex flex-col gap-1">
                                <label className="text-xs text-gray-400 uppercase tracking-widest">Table No.</label>
                                <input value={newTable.table_number} onChange={e => setNewTable(p => ({ ...p, table_number: e.target.value }))}
                                    placeholder="e.g. T5"
                                    className="bg-orange-50 border border-orange-200 rounded-lg px-3 py-2 text-gray-800 text-sm outline-none focus:border-orange-500 w-28 placeholder:text-gray-300" />
                            </div>
                            <div className="flex flex-col gap-1">
                                <label className="text-xs text-gray-400 uppercase tracking-widest">Capacity</label>
                                <input type="number" value={newTable.capacity} onChange={e => setNewTable(p => ({ ...p, capacity: e.target.value }))}
                                    placeholder="e.g. 4"
                                    className="bg-orange-50 border border-orange-200 rounded-lg px-3 py-2 text-gray-800 text-sm outline-none focus:border-orange-500 w-28 placeholder:text-gray-300" />
                            </div>
                            <button onClick={addTable}
                                className="bg-orange-500 hover:bg-orange-400 text-white text-sm font-medium px-5 py-2 rounded-lg cursor-pointer transition-all duration-200">
                                Add Table
                            </button>
                        </div>
                        {addMsg && <p className={`text-xs ${addMsg.includes("added") ? "text-green-500" : "text-red-500"}`}>{addMsg}</p>}
                    </div>
                </div>

                <button onClick={() => navigate("/myrestaurants")}
                    className="self-start text-orange-400 hover:text-orange-600 text-sm transition-colors cursor-pointer">
                    ← Back to My Restaurants
                </button>
            </div>
        </div>
    );
}

export default EditRestaurant;
