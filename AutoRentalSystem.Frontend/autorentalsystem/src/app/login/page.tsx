"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { login, getUserMe } from "@/lib/api";
import { useAuth } from "@/context/AuthContext";
import Link from "next/link";

export default function LoginPage() {
  const router = useRouter();
  const { setIsLoggedIn, setUserRole } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const res = await login({ email, password });
      if (res.error) {
        setError(res.error);
        return;
      }

      const user = await getUserMe().catch(() => null);
      if (!user) {
        console.warn("Не вдалося завантажити профіль користувача після входу");
        return;
      }

      setIsLoggedIn(true);
      setUserRole(user.role || null);
      router.push("/");
    } catch (err: any) {
      setError(err.message || "Помилка авторизації");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[var(--color-bg-light)] px-4 -mt-16">

      <div className="w-full max-w-md bg-white/70 backdrop-blur-xl border border-white/30 shadow-lg rounded-3xl p-8 transition-all hover:shadow-2xl">
        <h1 className="text-3xl font-bold text-center mb-6 text-[var(--color-gray-text)]">
          Увійти до{" "}
          <span className="text-[var(--color-primary)]">AutoRental</span>
        </h1>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-[var(--color-gray-text)] mb-1">
              Email
            </label>
            <input
              type="email"
              placeholder="your@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full p-3 rounded-xl border border-gray-300 text-gray-900 placeholder-[var(--color-gray-light)]
              focus:border-[var(--color-primary)] focus:ring-2 focus:ring-[var(--color-primary-ring)] outline-none bg-white transition-all"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-[var(--color-gray-text)] mb-1">
              Пароль
            </label>
            <input
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full p-3 rounded-xl border border-gray-300 text-gray-900 placeholder-[var(--color-gray-light)]
              focus:border-[var(--color-primary)] focus:ring-2 focus:ring-[var(--color-primary-ring)] outline-none bg-white transition-all"
            />
          </div>

          {error && <p className="text-red-500 text-sm">{error}</p>}

          <button
            type="submit"
            disabled={loading}
            className={`w-full py-3 rounded-xl text-white font-semibold transition-all shadow-md ${
              loading
                ? "bg-[var(--color-primary)]/60 cursor-not-allowed"
                : "bg-[var(--color-primary)] hover:bg-[var(--color-primary-hover)] hover:shadow-lg"
            }`}
          >
            {loading ? "Входимо..." : "Увійти"}
          </button>
        </form>

        <div className="text-center mt-6 text-sm text-[var(--color-gray-light)]">
          Немає акаунту?{" "}
          <Link
            href="/register"
            className="text-[var(--color-primary)] hover:text-[var(--color-primary-hover)] font-medium transition-colors"
          >
            Зареєструватися
          </Link>
        </div>
      </div>
    </div>
  );
}
