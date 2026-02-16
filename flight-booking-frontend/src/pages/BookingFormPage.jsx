import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import axios from "axios";
import bookingApi from "../api/bookingApi";
import paymentApi from "../api/paymentApi";

export default function BookingFormPage() {
  const { user } = useAuth();
  const [searchParams] = useSearchParams();
  const flightId = searchParams.get("flightId");

  const [flight, setFlight] = useState(null);
  const [availableSeats, setAvailableSeats] = useState([]);
  const [selectedSeat, setSelectedSeat] = useState("");
  const [selectedMethod, setSelectedMethod] = useState("");
  const [step, setStep] = useState(1); // 1 = alege scaun, 2 = alege ghișeu
  const [error, setError] = useState("");
  const navigate = useNavigate();

  // Preluăm detaliile zborului
  useEffect(() => {
    if (!flightId) return;
    axios
      .get(`http://localhost:8080/api/flights/${flightId}`)
      .then((res) => setFlight(res.data))
      .catch((err) => console.error(err));
  }, [flightId]);

  // Preluăm scaunele disponibile
  useEffect(() => {
    if (!flightId) return;
    axios
      .get(`http://localhost:8080/api/bookings/available-seats/${flightId}`)
      .then((res) => setAvailableSeats(res.data))
      .catch((err) => console.error(err));
  }, [flightId]);

  if (!flight)
    return <div className="text-center mt-10">Se încarcă zborul...</div>;

  const rows = 25;
  const cols = ["A", "B", "C", "D", "E", "F"];
  const seatGrid = [];
  for (let r = 1; r <= rows; r++) {
    const rowSeats = [];
    for (let c of cols) {
      const seat = `${r}${c}`;
      rowSeats.push({ seat, isAvailable: availableSeats.includes(seat) });
    }
    seatGrid.push(rowSeats);
  }

  const handleSeatSelection = (seat) => {
    setSelectedSeat(seat);
    setError("");
  };

  const handleNextStep = () => {
    if (!selectedSeat) {
      setError("Alege un scaun!");
      return;
    }
    setStep(2);
  };

  const handleFinalize = async () => {
    if (!selectedMethod) {
      setError("Alege un ghișeu!");
      return;
    }

    try {
      // Creează rezervarea
      const bookingRes = await bookingApi.create({
        user: { id: user.id },
        flight: { id: flightId },
        seatNumber: selectedSeat,
        status: "CONFIRMED",
      });

      // Creează plata
      await paymentApi.create({
        booking: { id: bookingRes.data.id },
        amount: flight.price,
        method: selectedMethod,
        status: "CONFIRMED",
      });

      alert("Rezervarea și plata au fost efectuate cu succes!");
      navigate("/bookings"); // Duce la Rezervările mele
    } catch (err) {
      console.error(err);
      setError("Eroare la finalizare rezervare. Încearcă din nou.");
      // Reîmprospătează scaunele disponibile
      axios
        .get(`http://localhost:8080/api/bookings/available-seats/${flightId}`)
        .then((res) => setAvailableSeats(res.data));
    }
  };

  return (
    <div
      className="min-h-screen bg-cover bg-center flex justify-center items-start pt-10"
      style={{ backgroundImage: "url('/beach.jpg')" }}
    >
      <div className="max-w-3xl bg-white rounded-2xl shadow-lg p-8 w-full mx-4">
        <h2 className="text-2xl font-bold text-blue-700 mb-4 text-center">
          Rezervă zbor: {flight.airline} ({flight.departureAirport} →{" "}
          {flight.arrivalAirport})
        </h2>
        <p className="text-gray-500 mb-6">Preț: {flight.price} €</p>

        {step === 1 && (
          <>
            <h3 className="font-semibold mb-2">Alege scaunul:</h3>
            <div className="grid grid-rows-25 gap-1 mb-4">
              {seatGrid.map((row, rowIndex) => (
                <div key={rowIndex} className="grid grid-cols-6 gap-1">
                  {row.map(({ seat, isAvailable }) => (
                    <button
                      key={seat}
                      disabled={!isAvailable}
                      onClick={() => handleSeatSelection(seat)}
                      className={`px-2 py-2 rounded text-sm font-semibold ${
                        isAvailable
                          ? selectedSeat === seat
                            ? "bg-blue-600 text-white"
                            : "bg-green-500 text-white hover:bg-green-600"
                          : "bg-gray-300 text-gray-500 cursor-not-allowed"
                      }`}
                    >
                      {seat}
                    </button>
                  ))}
                </div>
              ))}
            </div>
            {error && <p className="text-red-600 mb-2">{error}</p>}
            <button
              onClick={handleNextStep}
              className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition"
            >
              Următor → Alege ghișeu
            </button>
          </>
        )}

        {step === 2 && (
          <>
            <h3 className="font-semibold mb-2">Alege ghișeu:</h3>
            <select
              value={selectedMethod}
              onChange={(e) => {
                setSelectedMethod(e.target.value);
                setError("");
              }}
              className="w-full border rounded-lg px-3 py-2 mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">-- Alege ghișeul --</option>
              <option value="Ghișeu 1">Ghișeu 1</option>
              <option value="Ghișeu 2">Ghișeu 2</option>
              <option value="Ghișeu 3">Ghișeu 3</option>
            </select>
            {error && <p className="text-red-600 mb-2">{error}</p>}
            <button
              onClick={handleFinalize}
              className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition"
            >
              Finalizează rezervarea
            </button>
          </>
        )}
      </div>
    </div>
  );
}
