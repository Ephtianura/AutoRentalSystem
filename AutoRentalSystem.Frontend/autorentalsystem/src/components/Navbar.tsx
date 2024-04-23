"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { logout } from "@/lib/api";
import { useState, useEffect } from "react";

export default function Navbar() {
  const router = useRouter();
  const { isLoggedIn, setIsLoggedIn, refreshAuth } = useAuth();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleLogout = async () => {
    await logout();
    setIsLoggedIn(false);
    router.push("/login");
  };

  if (!mounted) return null; // пока не замонтирован, не рендерим

  return (
    <nav className="bg-white/90 backdrop-blur-md shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-between items-center h-16">
        <div className="flex items-center space-x-6">
          <Link href="/" className="font-bold text-xl text-gray-800 hover:text-blue-600 transition-colors">
            AutoRental
          </Link>
          <Link href="/my-bookings" className="text-gray-600 hover:text-blue-600 transition-colors">
            Мої бронювання
          </Link>
          <Link href="/profile" className="text-gray-600 hover:text-blue-600 transition-colors">
            Профіль
          </Link>
          <Link href="/admin/users" className="text-gray-600 hover:text-blue-600 transition-colors">
            Адмін панель
          </Link>
        </div>

        {isLoggedIn ? (
          <button
            onClick={handleLogout}
            className="bg-red-500 text-white px-4 py-1 rounded-lg hover:bg-red-600 transition-colors"
          >
            Вийти
          </button>
        ) : (
          <Link
            href="/login"
            className="bg-blue-600 text-white px-4 py-1 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Увійти
          </Link>
        )}
      </div>
    </nav>
  );
}
