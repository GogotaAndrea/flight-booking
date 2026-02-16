import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import bookingApi from "../api/bookingApi";
import paymentApi from "../api/paymentApi";

export default function PaymentsPage() {
  const { user } = useAuth();
  const [searchParams] = useSearchParams();
  const flightId = searchParams.get("flightId");
  const seat = searchParams.get("seat");
  const navigate = useNavigate();
  const [method, setMethod] = useState("");
  const [flight, setFlight] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!flightId) return;
    // Preluăm zborul pentru afișare
    fetchFlight();
  }, [flightId]);

  const fetchFlight = async () => {
    try {
      const res = await fetch(`http://localhost:8080/api/flights/${flightId}`);
      const data = await res.json();
      setFlight(data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleFinalize = async () => {
    if (!method) {
      setError("Alege un ghișeu!");
      return;
    }

    try {
      // Creează rezervarea
      const bookingRes = await bookingApi.create({
        user: { id: user.id },
        flight: { id: flightId },
        seatNumber: seat,
        status: "CONFIRMED",
      });

      // Creează plata direct
      await paymentApi.create({
        booking: { id: bookingRes.data.id },
        amount: flight.price,
        method,
        status: "CONFIRMED",
      });

      alert("Rezervarea și plata au fost efectuate cu succes!");
      navigate("/bookings");
    } catch (err) {
      console.error(err);
      setError("Eroare la finalizare rezervare. Încearcă din nou.");
    }
  };

  if (!flight)
    return <div className="text-center mt-10">Se încarcă zborul...</div>;

  return (
    <div
      className="flex justify-center items-center min-h-screen bg-cover bg-center"
      style={{ backgroundImage: "url('/beach.jpg')" }}
    >
      <div className="max-w-md bg-white rounded-2xl shadow-lg p-8 w-full mx-4">
        <h2 className="text-2xl font-bold text-blue-700 mb-6 text-center">
          Plata pentru zborul {flight.airline}
        </h2>
        <p>
          <strong>
            {flight.departureAirport} → {flight.arrivalAirport}
          </strong>
        </p>
        <p className="text-gray-500 mb-4">Loc: {seat}</p>

        <div className="mb-4">
          <label className="block text-gray-700 mb-2">Alege ghișeu</label>
          <select
            value={method}
            onChange={(e) => setMethod(e.target.value)}
            className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">-- Alege ghișeul --</option>
            <option value="Ghișeu 1">Ghișeu 1</option>
            <option value="Ghișeu 2">Ghișeu 2</option>
            <option value="Ghișeu 3">Ghișeu 3</option>
          </select>
        </div>
        {error && <p className="text-red-600 mb-2">{error}</p>}
        <button
          onClick={handleFinalize}
          className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition"
        >
          Finalizează rezervarea
        </button>
      </div>
    </div>
  );
}
