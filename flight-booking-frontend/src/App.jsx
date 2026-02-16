import { Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import HomePage from "./pages/HomePage";
import FlightsPage from "./pages/FlightsPage";
import BookingsPage from "./pages/BookingsPage";
import BookingFormPage from "./pages/BookingFormPage";
import PaymentsPage from "./pages/PaymentsPage";
import PaymentsHistoryPage from "./pages/PaymentsHistoryPage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import StatsPage from "./pages/StatsPage"; // ✅ nou import
import ProtectedRoute from "./components/ProtectedRoute";

export default function App() {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar />
      <div className="flex-1">
        <Routes>
          {/* Pagini publice */}
          <Route path="/" element={<HomePage />} />
          <Route path="/flights" element={<FlightsPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/stats" element={<StatsPage />} /> {/* ✅ publică */}
          {/* Pagini protejate */}
          <Route
            path="/bookings"
            element={
              <ProtectedRoute>
                <BookingsPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/book"
            element={
              <ProtectedRoute>
                <BookingFormPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/payments/:bookingId"
            element={
              <ProtectedRoute>
                <PaymentsPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/payments-history"
            element={
              <ProtectedRoute>
                <PaymentsHistoryPage />
              </ProtectedRoute>
            }
          />
        </Routes>
      </div>

      <footer className="bg-gray-100 py-4 text-center text-sm text-gray-500">
        © {new Date().getFullYear()} FlightBooking — Toate drepturile rezervate.
      </footer>
    </div>
  );
}
