"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { logout } from "@/lib/api";

export default function Navbar() {
  const router = useRouter();

  const handleLogout = async () => {
    await logout();
    router.push("/login");
  };

  return (
    <nav className="bg-white/90 backdrop-blur-md shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-between items-center h-16">
        <div className="flex items-center space-x-6">
          <Link href="/" className="font-bold text-xl text-gray-800 hover:text-blue-600 transition-colors">
            AutoRental
          </Link>
          <Link href="/bookings" className="text-gray-600 hover:text-blue-600 transition-colors">
            Мои бронирования
          </Link>
          <Link href="/profile" className="text-gray-600 hover:text-blue-600 transition-colors">
            Профиль
          </Link>
          <Link href="/admin/users" className="text-gray-600 hover:text-blue-600 transition-colors">
            Админка
          </Link>
        </div>
        <button
          onClick={handleLogout}
          className="bg-red-500 text-white px-4 py-1 rounded-lg hover:bg-red-600 transition-colors"
        >
          Выйти
        </button>
      </div>
    </nav>
  );
}
