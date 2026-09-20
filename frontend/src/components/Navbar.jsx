import { Link, useNavigate, useLocation } from "react-router-dom";
import { getRole } from "../utils/auth";

function Navbar() {
    const navigate = useNavigate();
    const location = useLocation();
    const role = getRole();

    const logout = () => {
        localStorage.removeItem("token");
        window.location.href = "/";
    };

    const linkCls = (path) =>
        `relative text-sm px-3 py-2 rounded-lg transition-all duration-200 ${
            location.pathname === path
                ? "nav-active bg-orange-50 font-medium"
                : "text-gray-500 hover:text-orange-500 hover:bg-orange-50"
        }`;

    return (
        <nav className="bg-white border-b border-orange-100 px-6 h-16 flex items-center justify-between sticky top-0 z-50 shadow-sm animate-slideDown">
            <Link to="/restaurant" className="text-gray-900 font-bold text-lg tracking-tight select-none">
                Quick<span className="text-orange-500">Dine</span>
            </Link>
            <div className="flex items-center gap-1">
                <Link to="/restaurant" className={linkCls("/restaurant")}>Restaurants</Link>
                {role !== "owner" && (
                    <Link to="/mybookings" className={linkCls("/mybookings")}>My Bookings</Link>
                )}
                {role === "owner" && (
                    <Link to="/myrestaurants" className={linkCls("/myrestaurants")}>My Restaurants</Link>
                )}
                <button
                    onClick={logout}
                    className="ml-3 text-sm bg-orange-500 hover:bg-orange-400 active:bg-orange-600 text-white px-4 py-2 rounded-lg transition-all duration-200 cursor-pointer btn-press"
                >
                    Sign Out
                </button>
            </div>
        </nav>
    );
}

export default Navbar;
