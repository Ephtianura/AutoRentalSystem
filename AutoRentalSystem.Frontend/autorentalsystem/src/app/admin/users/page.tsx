// app/admin/users/page.tsx
"use client";
import { useEffect, useState } from "react";
import { apiFetch } from "@/lib/api";

export default function AdminUsersPage() {
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUsers = async () => {
      const data = await apiFetch("/Users");
      setUsers(data?.items || []);
      setLoading(false);
    };
    fetchUsers();
  }, []);

  if (loading) return <p>Загрузка пользователей...</p>;

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Пользователи</h1>
      <table className="w-full table-auto border-collapse">
        <thead>
          <tr className="bg-gray-200">
            <th className="border px-4 py-2">ID</th>
            <th className="border px-4 py-2">Имя</th>
            <th className="border px-4 py-2">Email</th>
            <th className="border px-4 py-2">Роль</th>
            <th className="border px-4 py-2">Статус</th>
          </tr>
        </thead>
        <tbody>
          {users.map((u) => (
            <tr key={u.id} className="hover:bg-gray-100">
              <td className="border px-4 py-2">{u.id}</td>
              <td className="border px-4 py-2">{u.userName}</td>
              <td className="border px-4 py-2">{u.email}</td>
              <td className="border px-4 py-2">{u.role}</td>
              <td className="border px-4 py-2">{u.status}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
