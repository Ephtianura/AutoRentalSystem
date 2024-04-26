"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { logout } from "@/lib/api";
import { useRouter } from "next/navigation";
import clsx from "clsx";
import {
  FiHome,
  FiUsers,
  FiBarChart2,
  FiSettings,
  FiCamera,
  FiBookOpen,
  FiDollarSign,
  FiAlertTriangle,
  FiFileText,
  FiLogOut,
} from "react-icons/fi";

export default function AdminSidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const { userRole, setIsLoggedIn, setUserRole } = useAuth();

  if (userRole !== "Admin") return null;

  const handleLogout = async () => {
    try {
      await logout();
    } catch {}
    setIsLoggedIn(false);
    setUserRole(null);
    router.push("/login");
  };

  const links = [
    { href: "/admin/dashboard", label: "Огляд системи", icon: FiBarChart2 },
    { href: "/admin/users", label: "Користувачі", icon: FiUsers },
    { href: "/admin/cars", label: "Автомобілі", icon: FiCamera },
    { href: "/admin/bookings", label: "Бронювання", icon: FiBookOpen },
    { href: "/admin/fines", label: "Штрафи", icon: FiAlertTriangle },
    { href: "/admin/payments", label: "Платежі", icon: FiDollarSign },
    { href: "/admin/contracts", label: "Контракти", icon: FiFileText },
    { href: "/admin/settings", label: "Налаштування", icon: FiSettings },
  ];

  return (
    <aside className="w-64 h-screen hidden md:flex flex-col bg-white/90 backdrop-blur-md border-r border-gray-200 shadow-lg">
      {/* Header */}
      <div className="px-6 py-5 flex items-center justify-between border-b border-gray-200">
        <Link
          href="/admin/dashboard"
          className="font-extrabold text-2xl text-violet-600 tracking-tight"
        >
          AutoAdmin
        </Link>
      </div>

      {/* Links */}
      <nav className="flex-1 py-6 space-y-1">
        {links.map(({ href, label, icon: Icon }) => (
          <Link
            key={href}
            href={href}
            className={clsx(
              "flex items-center gap-3 px-6 py-3 text-gray-700 rounded-xl mx-2 transition-all duration-200",
              pathname === href
                ? "bg-violet-100 text-violet-700 shadow-sm"
                : "hover:bg-violet-50 hover:text-violet-600"
            )}
          >
            <Icon className="text-lg" />
            <span className="font-medium">{label}</span>
          </Link>
        ))}
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-gray-200">
        <button
          onClick={handleLogout}
          className="flex items-center gap-2 w-full px-4 py-3 text-gray-600 hover:text-red-500 hover:bg-red-50 rounded-xl transition-colors duration-200"
        >
          <FiLogOut className="text-lg" />
          <span className="font-medium">Вийти</span>
        </button>
      </div>
    </aside>
  );
}
