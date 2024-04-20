// app/profile/page.tsx
"use client";
import { useEffect, useState } from "react";
import { apiFetch } from "@/lib/api";

export default function ProfilePage() {
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const fetchUser = async () => {
      const data = await apiFetch("/Users/me"); // допустим есть эндпоинт /Users/me
      setUser(data);
    };
    fetchUser();
  }, []);

  if (!user) return <p>Загрузка профиля...</p>;

  return (
    <div className="bg-white p-6 rounded shadow max-w-md">
      <h1 className="text-2xl font-bold mb-4">Профиль</h1>
      <p>Имя: {user.userName}</p>
      <p>Email: {user.email}</p>
      <p>Роль: {user.role}</p>
      <p>Статус: {user.status}</p>
    </div>
  );
}
