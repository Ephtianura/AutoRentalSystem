    "use client";

    import React from "react";
    import { useRouter } from "next/navigation";
    import { ArrowLeft, Edit3 } from "lucide-react";

    type Props = {
    user: {
        id: number;
        userName: string;
        email: string;
        role: "User" | "Admin";
        status: "Active" | "Blocked";
        registeredAt?: string;
        phone?: string | null;
    };
    };

    export const ProfileCardUser: React.FC<Props> = ({ user }) => {
    const router = useRouter();

    return (
        <div className="max-w-4xl mx-auto mt-12 bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden">
        {/* Верхняя панель */}
        <div className="relative bg-gradient-to-r from-sky-500 to-indigo-500 h-40">
            <button
            onClick={() => router.back()}
            className="absolute top-4 left-4 flex items-center gap-2 bg-white/20 hover:bg-white/30 text-white px-3 py-1.5 rounded-full transition"
            >
            <ArrowLeft size={18} />
            <span className="hidden sm:inline">Назад</span>
            </button>

            <div className="absolute -bottom-12 left-8 flex items-center gap-4">
            <div className="w-24 h-24 rounded-full bg-gray-200 border-4 border-white flex items-center justify-center text-4xl font-bold text-sky-600">
                {user.userName.charAt(0).toUpperCase()}
            </div>
            <div>
                <h2 className="text-2xl font-bold text-gray-800">{user.userName}</h2>
                <p className="text-gray-500">{user.email}</p>
            </div>
            </div>

            <button
            onClick={() => router.push(`/profile/edit`)}
            className="absolute bottom-4 right-4 flex items-center gap-2 bg-white text-sky-600 hover:bg-gray-100 font-medium px-3 py-2 rounded-full shadow transition"
            >
            <Edit3 size={18} />
            Редактировать
            </button>
        </div>

        {/* Основной контент */}
        <div className="mt-16 px-8 pb-8">
            <div className="grid md:grid-cols-2 gap-6">
            <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-2">Личная информация</h3>
                <div className="space-y-2 text-gray-700">
                <p><span className="font-semibold">Имя:</span> {user.userName}</p>
                <p><span className="font-semibold">Email:</span> {user.email}</p>
                <p><span className="font-semibold">Телефон:</span> {user.phone || "не указан"}</p>
                </div>
            </div>

            <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-2">Аккаунт</h3>
                <div className="space-y-2 text-gray-700">
                <p>
                    <span className="font-semibold">Статус:</span>{" "}
                    <span
                    className={`px-2 py-1 rounded-full text-xs font-semibold ${
                        user.status === "Active"
                        ? "bg-green-100 text-green-800"
                        : "bg-red-100 text-red-800"
                    }`}
                    >
                    {user.status}
                    </span>
                </p>
                {user.registeredAt && (
                    <p>
                    <span className="font-semibold">Дата регистрации:</span>{" "}
                    {new Date(user.registeredAt).toLocaleDateString()}
                    </p>
                )}
                </div>
            </div>
            </div>

            {/* Дополнительная секция */}
            <div className="mt-8 border-t pt-6 text-gray-600 text-sm">
            <p>
                ✨ Добро пожаловать в ваш личный кабинет! Здесь вы можете обновлять личные данные, 
                следить за бронированиями и управлять своим аккаунтом.
            </p>
            </div>
        </div>
        </div>
    );
    };
