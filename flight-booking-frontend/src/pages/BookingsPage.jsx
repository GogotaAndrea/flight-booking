import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import axios from "axios";

export default function BookingPage() {
  const { user } = useAuth();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchBookings = () => {
    setLoading(true);
    axios
      .get("http://localhost:8080/api/bookings")
      .then((res) => {
        const userBookings = res.data
          .filter((b) => b.user.id === user.id)
          .sort(
            (a, b) =>
              new Date(a.flight.departureTime) -
              new Date(b.flight.departureTime)
          );
        setBookings(userBookings);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Eroare la preluarea rezervărilor:", err);
        setLoading(false);
      });
  };

  useEffect(() => {
    if (user) fetchBookings();
  }, [user]);

  const handleCancel = async (bookingId) => {
    if (!window.confirm("Ești sigur că vrei să anulezi această rezervare?"))
      return;
    try {
      await axios.post(
        `http://localhost:8080/api/bookings/${bookingId}/cancel`
      );
      fetchBookings();
    } catch (err) {
      console.error(err);
      alert("Nu s-a putut anula rezervarea. Încearcă din nou.");
    }
  };

  const handleDelete = async (bookingId) => {
    if (
      !window.confirm(
        "Ești sigur că vrei să ștergi această rezervare definitiv?"
      )
    )
      return;
    try {
      await axios.delete(
        `http://localhost:8080/api/bookings/${bookingId}?userId=${user.id}`
      );
      fetchBookings();
    } catch (err) {
      console.error(err);
      alert("Nu s-a putut șterge rezervarea. Încearcă din nou.");
    }
  };

  if (loading)
    return (
      <div className="text-center mt-10 text-gray-600">
        Se încarcă rezervările...
      </div>
    );

  return (
    <div
      className="min-h-screen bg-cover bg-center px-6 py-10"
      style={{ backgroundImage: "url('/beach.jpg')" }}
    >
      <div className="container mx-auto">
        <h1 className="text-3xl font-bold text-white mb-8 text-center">
          Rezervările mele
        </h1>
        {bookings.length === 0 ? (
          <p className="text-center text-gray-500">
            Nu ai nicio rezervare momentan.
          </p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {bookings.map((b) => (
              <div key={b.id} className="bg-white rounded-2xl shadow-lg p-6">
                <h2 className="text-xl font-semibold text-blue-700 mb-2">
                  {b.flight.airline}
                </h2>
                <p>
                  {b.flight.departureAirport} → {b.flight.arrivalAirport}
                </p>
                <p>Loc: {b.seatNumber}</p>
                <p>
                  Status:{" "}
                  <span
                    className={
                      b.status === "CONFIRMED"
                        ? "text-green-600"
                        : "text-red-600"
                    }
                  >
                    {b.status}
                  </span>
                </p>
                <div className="mt-4 flex justify-between">
                  {b.status !== "CANCELLED" && (
                    <button
                      onClick={() => handleCancel(b.id)}
                      className="text-yellow-600 hover:underline"
                    >
                      Anulează
                    </button>
                  )}
                  <button
                    onClick={() => handleDelete(b.id)}
                    className="text-red-600 hover:underline"
                  >
                    Șterge
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
