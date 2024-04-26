"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Edit3 } from "lucide-react";
import AdminLayout from "@/components/DashboardLayout";

type Props = {
  user: {
    id: number;
    userName: string;
    email: string;
    role: "User" | "Admin";
    status: "Active" | "Blocked";
    registeredAt?: string;
    phone?: string | null;
    driverLicenseNumber?: string | null;
  };
};

export const ProfileCardAdmin: React.FC<Props> = ({ user }) => {
  const router = useRouter();

  return (
    <AdminLayout noContainer>
      <div className="max-w-4xl mx-auto mt-12 bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden">
        {/* Верхня панель */}
        <div className="relative bg-gradient-to-r from-indigo-500 to-purple-500 h-40">
          <button
            onClick={() => router.back()}
            className="absolute top-4 left-4 flex items-center gap-2 bg-white/20 hover:bg-white/30 text-white px-3 py-1.5 rounded-full transition"
          >
            <ArrowLeft size={18} />
            <span className="hidden sm:inline">Назад</span>
          </button>

          <div className="absolute -bottom-12 left-8 flex items-center gap-4">
            <div className="w-24 h-24 rounded-full bg-gray-200 border-4 border-white flex items-center justify-center text-4xl font-bold text-indigo-600">
              {user.userName.charAt(0).toUpperCase()}
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-800">{user.userName}</h2>
              <p className="text-gray-500">{user.email}</p>
            </div>
          </div>

          {/* Кнопка редагування */}
          <button
            onClick={() => router.push(`/profile/edit?id=${user.id}`)}
            className="absolute bottom-4 right-4 flex items-center gap-2 bg-white text-indigo-600 hover:bg-gray-100 font-medium px-3 py-2 rounded-full shadow transition"
          >
            <Edit3 size={18} />
            Редагувати
          </button>
        </div>

        {/* Основна інформація */}
        <div className="mt-16 px-8 pb-8">
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-2">Основна інформація</h3>
              <div className="space-y-2 text-gray-700">
                <p><span className="font-semibold">ID:</span> {user.id}</p>
                <p><span className="font-semibold">Телефон:</span> {user.phone || "не вказано"}</p>
                <p><span className="font-semibold">Водійське посвідчення:</span> {user.driverLicenseNumber || "не вказано"}</p>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-2">Акаунт</h3>
              <div className="space-y-2 text-gray-700">
                <p>
                  <span className="font-semibold">Роль:</span>{" "}
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-semibold ${
                      user.role === "Admin"
                        ? "bg-blue-100 text-blue-800"
                        : "bg-gray-100 text-gray-800"
                    }`}
                  >
                    {user.role === "Admin" ? "Адмін" : "Користувач"}
                  </span>
                </p>
                <p>
                  <span className="font-semibold">Статус:</span>{" "}
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-semibold ${
                      user.status === "Active"
                        ? "bg-green-100 text-green-800"
                        : "bg-red-100 text-red-800"
                    }`}
                  >
                    {user.status === "Active" ? "Активний" : "Заблокований"}
                  </span>
                </p>
                {user.registeredAt && (
                  <p>
                    <span className="font-semibold">Дата реєстрації:</span>{" "}
                    {new Date(user.registeredAt).toLocaleDateString()}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Додатковий блок */}
          <div className="mt-8 border-t pt-6 text-gray-600 text-sm">
            <p>
              👁 Перегляд від імені адміністратора. Ви можете бачити дані всіх користувачів, 
              редагувати або блокувати акаунти.
            </p>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};
