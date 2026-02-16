import { Link } from "react-router-dom";

export default function HomePage() {
  return (
    <div
      className="min-h-[calc(100vh-80px)] flex items-center justify-center bg-cover bg-center relative"
      style={{ backgroundImage: "url('/plaja1.jpg')" }}
    >
      {/* Overlay ușor pentru contrast */}
      <div className="absolute inset-0 bg-black/40" />

      {/* Conținut */}
      <div className="relative z-10 text-center text-white px-6">
        <h1 className="text-5xl font-bold mb-4 drop-shadow-lg">
          Descoperă zboruri către destinația visurilor tale 🌍
        </h1>
        <p className="text-lg mb-8 text-gray-100 max-w-2xl mx-auto">
          Caută, rezervă și gestionează zborurile tale rapid și sigur — totul
          dintr-un singur loc.
        </p>
        <Link
          to="/flights"
          className="bg-blue-600 hover:bg-blue-700 transition px-8 py-3 rounded-lg font-semibold shadow-lg"
        >
          Vezi Zboruri
        </Link>
      </div>
    </div>
  );
}
