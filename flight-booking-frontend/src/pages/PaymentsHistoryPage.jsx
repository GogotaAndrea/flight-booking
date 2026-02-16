import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import paymentApi from "../api/paymentApi";

export default function PaymentsHistoryPage() {
  const { user } = useAuth();
  const [payments, setPayments] = useState([]);

  useEffect(() => {
    if (!user) return;

    paymentApi
      .getAll()
      .then((res) => {
        const userPayments = res.data.filter(
          (p) => p.booking.user.id === user.id
        );
        setPayments(userPayments);
      })
      .catch((err) => console.error("Eroare la plăți:", err));
  }, [user]);

  return (
    <div
      className="min-h-screen bg-cover bg-center px-6 py-10"
      style={{ backgroundImage: "url('/beach.jpg')" }}
    >
      <div className="container mx-auto">
        <h1 className="text-3xl font-bold text-white mb-8 text-center">
          Plățile mele
        </h1>

        {payments.length === 0 ? (
          <p className="text-center text-gray-500">
            Nu există plăți înregistrate pentru tine.
          </p>
        ) : (
          <table className="w-full bg-white shadow-lg rounded-xl overflow-hidden">
            <thead className="bg-blue-600 text-white">
              <tr>
                <th className="py-3 px-4 text-left">Zbor</th>
                <th className="py-3 px-4 text-left">Ghișeu</th>
                <th className="py-3 px-4 text-left">Sumă (€)</th>
                <th className="py-3 px-4 text-left">Status</th>
              </tr>
            </thead>
            <tbody>
              {payments.map((p) => (
                <tr key={p.id} className="border-t hover:bg-gray-50">
                  <td className="py-2 px-4">
                    {p.booking.flight.airline} <br />
                    {p.booking.flight.departureAirport} →{" "}
                    {p.booking.flight.arrivalAirport} <br />
                    Loc: {p.booking.seatNumber}
                  </td>
                  <td className="py-2 px-4">{p.method}</td>
                  <td className="py-2 px-4">{p.amount}</td>
                  <td className="py-2 px-4">{p.status}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
