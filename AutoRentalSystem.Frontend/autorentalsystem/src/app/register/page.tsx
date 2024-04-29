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
    await register(payload); // Если API вернёт 400, это уйдёт в catch
    await login({ email, password });
    setIsLoggedIn(true);
    router.push("/");
  } catch (err: any) {
  // Если пришло сообщение от сервера — показываем пользователю
  if (err?.data?.message) {
    setError(err.data.message);
  } 
  // Если статус 400 без message
  else if (err?.status === 400) {
    setError("Некорректні дані або користувач вже існує");
  } 
  // Все остальные ошибки выводим в консоль
  else {
    console.error(err); // только непредвиденные ошибки
    setError("Помилка реєстрації");
  }

  } finally {
    setLoading(false);
  }
};


  return (
    <div className="min-h-screen flex items-center justify-center bg-[var(--color-bg-light)] px-4 relative -translate-y-10">
      <div className="w-full max-w-md bg-white/80 backdrop-blur-md rounded-2xl shadow-xl border border-gray-200 p-8 transition-all">
        <h1 className="text-3xl font-bold text-gray-800 mb-6 text-center">
          Зареєструватися в{" "}
          <span className="text-[var(--color-primary)]">AutoRental</span>
        </h1>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Ім'я
            </label>
            <input
              type="text"
              placeholder="Ваше ім'я"
              value={userName}
              onChange={(e) => setUserName(e.target.value)}
              required
              className="w-full p-3 rounded-lg border border-[var(--color-gray-border)] text-gray-900 placeholder-gray-400
                 focus:border-[var(--color-primary)] focus:ring-2 focus:ring-[var(--color-primary-ring)] transition-all outline-none bg-white"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email
            </label>
            <input
              type="email"
              placeholder="your@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full p-3 rounded-lg border border-[var(--color-gray-border)] text-gray-900 placeholder-gray-400
                 focus:border-[var(--color-primary)] focus:ring-2 focus:ring-[var(--color-primary-ring)] transition-all outline-none bg-white"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Пароль
            </label>
            <input
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full p-3 rounded-lg border border-[var(--color-gray-border)] text-gray-900 placeholder-gray-400
                 focus:border-[var(--color-primary)] focus:ring-2 focus:ring-[var(--color-primary-ring)] transition-all outline-none bg-white"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Дата народження
            </label>
            <input
              type="date"
              value={dateOfBirth}
              onChange={(e) => setDateOfBirth(e.target.value)}
              required
              className="w-full p-3 rounded-lg border border-[var(--color-gray-border)] text-gray-900 placeholder-gray-400
                 focus:border-[var(--color-primary)] focus:ring-2 focus:ring-[var(--color-primary-ring)] transition-all outline-none bg-white"
            />
          </div>

          {error && <p className="text-red-500 text-sm mt-1">{error}</p>}

          <button
            type="submit"
            disabled={loading}
            className={`w-full py-3 rounded-lg text-white font-semibold transition-all ${
              loading
                ? "bg-[var(--color-primary-hover)] opacity-70 cursor-not-allowed"
                : "bg-[var(--color-primary)] hover:bg-[var(--color-primary-hover)] shadow-md hover:shadow-lg active:scale-[0.98]"
            }`}
          >
            {loading ? "Реєструємо..." : "Зареєструватися"}
          </button>
        </form>

        <div className="text-center mt-6 text-sm text-gray-600">
          Вже є акаунт?{" "}
          <Link
            href="/login"
            className="text-[var(--color-primary)] hover:text-[var(--color-primary-hover)] font-medium transition-colors"
          >
            Увійти
          </Link>
        </div>
      </div>
    </div>
  );
}
