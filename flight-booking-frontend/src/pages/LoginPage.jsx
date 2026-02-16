import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import userApi from "../api/userApi";

export default function LoginPage() {
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const res = await userApi.login(email, password);
      login(res.data);
      navigate("/");
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || "Email sau parola incorectă.");
    }
  };

  return (
    <div
      className="flex justify-center items-center min-h-screen bg-cover bg-center"
      style={{ backgroundImage: "url('/beach.jpg')" }}
    >
      <div className="bg-white bg-opacity-90 backdrop-blur-sm p-8 rounded-2xl shadow-xl w-96">
        <h2 className="text-3xl font-bold text-blue-700 mb-6 text-center">
          Autentificare
        </h2>

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-gray-700">Email</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full border rounded-lg px-3 py-2 mt-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-gray-700">Parolă</label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full border rounded-lg px-3 py-2 mt-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {error && <p className="text-red-600 text-sm">{error}</p>}

          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition"
          >
            Intră în cont
          </button>
        </form>

        <p className="text-center text-gray-600 mt-4">
          Nu ai cont?{" "}
          <Link to="/register" className="text-blue-600 hover:underline">
            Înregistrează-te
          </Link>
        </p>
      </div>
    </div>
  );
}
