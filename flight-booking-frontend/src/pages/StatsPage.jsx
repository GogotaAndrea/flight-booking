import { useEffect, useState } from "react";
import statsApi from "../api/statsApi";

export default function StatsPage() {
  const [popularFlights, setPopularFlights] = useState([]);
  const [cancelledBookings, setCancelledBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [popularRes, cancelledRes] = await Promise.all([
          statsApi.getMostPopularFlights(),
          statsApi.getCancelledBookings(),
        ]);
        setPopularFlights(popularRes.data);
        setCancelledBookings(cancelledRes.data);
      } catch (err) {
        console.error("Eroare la încărcarea statisticilor:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  if (loading)
    return (
      <div className="text-center mt-10 text-gray-600">
        Se încarcă statisticile...
      </div>
    );

  return (
    <div
      className="min-h-screen bg-cover bg-center px-6 py-10"
      style={{ backgroundImage: "url('/beach.jpg')" }}
    >
      <div className="container mx-auto">
        <h1 className="text-3xl font-bold text-white mb-8 text-center">
          Statistici Zboruri
        </h1>

        {/* 🔹 Secțiunea 1: Cele mai populare zboruri */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-10">
          <h2 className="text-2xl font-bold text-blue-700 mb-4 text-center">
            Cele mai populare zboruri
          </h2>

          {popularFlights.length === 0 ? (
            <p className="text-center text-gray-500">
              Nu există date despre zboruri populare momentan.
            </p>
          ) : (
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-blue-600 text-white">
                  <th className="py-2 px-4">#</th>
                  <th className="py-2 px-4">ID Zbor</th>
                  <th className="py-2 px-4">Număr Zbor</th>
                  <th className="py-2 px-4">Rezervări</th>
                </tr>
              </thead>
              <tbody>
                {popularFlights.map(([id, number, count], index) => (
                  <tr key={id} className="border-t hover:bg-gray-50">
                    <td className="py-2 px-4">{index + 1}</td>
                    <td className="py-2 px-4">{id}</td>
                    <td className="py-2 px-4">{number}</td>
                    <td className="py-2 px-4">{count}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        {/* 🔹 Secțiunea 2: Rezervări anulate */}
        <div className="bg-white rounded-2xl shadow-lg p-6">
          <h2 className="text-2xl font-bold text-blue-700 mb-4 text-center">
            Rezervări anulate
          </h2>

          {cancelledBookings.length === 0 ? (
            <p className="text-center text-gray-500">
              Nu există rezervări anulate.
            </p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-blue-600 text-white">
                    <th className="py-2 px-4">ID Rezervare</th>
                    <th className="py-2 px-4">Companie</th>
                    <th className="py-2 px-4">Zbor</th>
                    <th className="py-2 px-4">Loc</th>
                    <th className="py-2 px-4">Data rezervării</th>
                  </tr>
                </thead>
                <tbody>
                  {cancelledBookings.map((b) => (
                    <tr key={b.id} className="border-t hover:bg-gray-50">
                      <td className="py-2 px-4">{b.id}</td>
                      <td className="py-2 px-4">{b.flight.airline}</td>
                      <td className="py-2 px-4">
                        {b.flight.departureAirport} → {b.flight.arrivalAirport}
                      </td>
                      <td className="py-2 px-4">{b.seatNumber}</td>
                      <td className="py-2 px-4">
                        {new Date(b.bookingDate).toLocaleString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
