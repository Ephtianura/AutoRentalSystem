"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { login } from "@/lib/api";
import { useAuth } from "@/context/AuthContext";
import Link from "next/link";

export default function LoginPage() {
  const router = useRouter();
  const { setIsLoggedIn } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null); // <-- сюда будем писать ошибки

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    setLoading(true);
    setError(null); // очищаем старую ошибку
    try {
      const res = await login({ email, password });

      // проверяем, есть ли ошибка в ответе
      if (res.error) {
        setError(res.error); // отображаем текст ошибки на форме
        return;
      }

      setIsLoggedIn(true);
      router.push("/");
    } catch (err: any) {
      setError(err.message || "Помилка авторизації");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 -mt-40">
      <div className="w-full max-w-md bg-white/80 backdrop-blur-md rounded-2xl shadow-xl border border-gray-200 p-8 transition-all">
        <h1 className="text-3xl font-bold text-gray-800 mb-6 text-center">
          Увійти до <span className="text-blue-600">AutoRental</span>
        </h1>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <input
              type="email"
              placeholder="your@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full p-3 rounded-lg border border-gray-300 text-gray-900 placeholder-gray-400
                 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all outline-none bg-white"
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
                 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all outline-none bg-white"
            />
          </div>

          {error && (
            <p className="text-red-500 text-sm mt-1">{"Неправильний логін або пароль"}</p> // <-- выводим ошибку прямо на форме
          )}

          <button
            type="submit"
            disabled={loading}
            className={`w-full py-3 rounded-lg text-white font-semibold transition-all ${
              loading
                ? "bg-blue-400 cursor-not-allowed"
                : "bg-blue-600 hover:bg-blue-700 shadow-md hover:shadow-lg"
            }`}
          >
            {loading ? "Входимо..." : "Увійти"}
          </button>
        </form>

        <div className="text-center mt-6 text-sm text-gray-600">
          Немає акаунту?{" "}
          <Link
            href="/register"
            className="text-blue-600 hover:text-blue-700 font-medium transition-colors"
          >
            Зареєструватися
          </Link>
        </div>
      </div>
    </div>
  );
}
