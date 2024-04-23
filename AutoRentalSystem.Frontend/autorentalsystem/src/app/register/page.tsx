"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { register, login } from "@/lib/api";
import { useAuth } from "@/context/AuthContext";
import Link from "next/link";

export default function RegisterPage() {
  const router = useRouter();
  const { setIsLoggedIn } = useAuth();
  const [userName, setUserName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [dateOfBirth, setDateOfBirth] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const payload = {
      userName,
      email,
      password,
      dateOfBirth: new Date(dateOfBirth).toISOString(),
    };

    try {
      // Сначала регистрация
      await register(payload);

      // Автоматический логин после регистрации
      await login({ email, password });
      setIsLoggedIn(true);

      router.push("/"); // Перенаправляем на главную
    } catch (err: any) {
      setError("Помилка реєстраці");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 via-green-50 to-gray-100 px-4">
      <div className="w-full max-w-md bg-white/80 backdrop-blur-md rounded-2xl shadow-xl border border-gray-200 p-8 transition-all">
        <h1 className="text-3xl font-bold text-gray-800 mb-6 text-center">
          Зареєструватися в <span className="text-green-600">AutoRental</span>
        </h1>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Ім'я</label>
            <input
              type="text"
              placeholder="Ваше ім'я"
              value={userName}
              onChange={(e) => setUserName(e.target.value)}
              required
              className="w-full p-3 rounded-lg border border-gray-300 text-gray-900 placeholder-gray-400
                 focus:border-green-500 focus:ring-2 focus:ring-green-200 transition-all outline-none bg-white"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <input
              type="email"
              placeholder="your@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full p-3 rounded-lg border border-gray-300 text-gray-900 placeholder-gray-400
                 focus:border-green-500 focus:ring-2 focus:ring-green-200 transition-all outline-none bg-white"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Пароль</label>
            <input
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full p-3 rounded-lg border border-gray-300 text-gray-900 placeholder-gray-400
                 focus:border-green-500 focus:ring-2 focus:ring-green-200 transition-all outline-none bg-white"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Дата народження</label>
            <input
              type="date"
              value={dateOfBirth}
              onChange={(e) => setDateOfBirth(e.target.value)}
              required
              className="w-full p-3 rounded-lg border border-gray-300 text-gray-900 placeholder-gray-400
                 focus:border-green-500 focus:ring-2 focus:ring-green-200 transition-all outline-none bg-white"
            />
          </div>

          {error && <p className="text-red-500 text-sm mt-1">{error}</p>}

          <button
            type="submit"
            disabled={loading}
            className={`w-full py-3 rounded-lg text-white font-semibold transition-all ${
              loading
                ? "bg-green-400 cursor-not-allowed"
                : "bg-green-600 hover:bg-green-700 shadow-md hover:shadow-lg"
            }`}
          >
            {loading ? "Реєструємо..." : "Зареєструватися"}
          </button>
        </form>

        <div className="text-center mt-6 text-sm text-gray-600">
          Вже є акаунт?{" "}
          <Link
            href="/login"
            className="text-green-600 hover:text-green-700 font-medium transition-colors"
          >
            Увійти
          </Link>
        </div>
      </div>
    </div>
  );
}
