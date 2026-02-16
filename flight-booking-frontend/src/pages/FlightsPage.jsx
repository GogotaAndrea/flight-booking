import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

export default function FlightsPage() {
  const [flights, setFlights] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios
      .get("http://localhost:8080/api/flights")
      .then((res) => {
        setFlights(res.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Eroare la preluarea zborurilor:", err);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <div className="text-center mt-10 text-gray-600">
        Se încarcă zborurile...
      </div>
    );
  }

  return (
    <div
      className="min-h-screen bg-cover bg-center px-6 py-10"
      style={{ backgroundImage: "url('/beach.jpg')" }}
    >
      <div className="container mx-auto">
        <h1 className="text-3xl font-bold text-white mb-8 text-center">
          Zboruri disponibile
        </h1>

        {flights.length === 0 ? (
          <p className="text-center text-gray-500">
            Nu există zboruri disponibile momentan.
          </p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {flights.map((flight) => (
              <div
                key={flight.id}
                className="bg-white rounded-2xl shadow-lg p-6 flex flex-col justify-between hover:shadow-xl transition"
              >
                <div>
                  <h2 className="text-xl font-semibold text-blue-700 mb-2">
                    {flight.airline}
                  </h2>
                  <p className="text-gray-600">
                    <strong>{flight.departureAirport}</strong> →{" "}
                    <strong>{flight.arrivalAirport}</strong>
                  </p>
                  <p className="text-gray-500 text-sm mt-1">
                    Plecare: {new Date(flight.departureTime).toLocaleString()}
                  </p>
                  <p className="text-gray-500 text-sm">
                    Sosire: {new Date(flight.arrivalTime).toLocaleString()}
                  </p>
                </div>
                <div className="mt-4 flex justify-between items-center">
                  <span className="text-lg font-bold text-blue-700">
                    {flight.price} €
                  </span>
                  <Link
                    to={`/book?flightId=${flight.id}`}
                    className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
                  >
                    Rezervă
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
