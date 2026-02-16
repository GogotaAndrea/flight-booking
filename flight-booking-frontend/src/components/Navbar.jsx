import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <nav className="bg-white/90 backdrop-blur-sm shadow-md sticky top-0 z-50">
      <div className="container mx-auto flex justify-between items-center px-6 py-3">
        {/* Logo */}
        <Link to="/" className="text-2xl font-bold text-blue-600">
          ✈️ Flight<span className="text-gray-800">Booking</span>
        </Link>

        {/* Meniu */}
        <div className="hidden md:flex gap-8 text-gray-700 font-medium">
          <Link to="/" className="hover:text-blue-600 transition">
            Acasă
          </Link>
          <Link to="/flights" className="hover:text-blue-600 transition">
            Zboruri
          </Link>
          <Link to="/bookings" className="hover:text-blue-600 transition">
            Rezervări
          </Link>
          {/* Plăți doar pentru utilizatorii logați */}
          {user && (
            <Link
              to="/payments-history"
              className="hover:text-blue-600 transition"
            >
              Plăți
            </Link>
          )}
          {/* Statistici – vizibil pentru toți */}
          <Link to="/stats" className="hover:text-blue-600 transition">
            Statistici
          </Link>
        </div>

        {/* Auth */}
        <div className="flex items-center gap-4">
          {user ? (
            <>
              <span className="text-sm text-gray-600">
                Salut, <b>{user.name}</b>
              </span>
              <button
                onClick={handleLogout}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-blue-700 transition"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link
                to="/login"
                className="text-blue-600 font-medium hover:underline"
              >
                Login
              </Link>
              <Link
                to="/register"
                className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-blue-700 transition"
              >
                Register
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
