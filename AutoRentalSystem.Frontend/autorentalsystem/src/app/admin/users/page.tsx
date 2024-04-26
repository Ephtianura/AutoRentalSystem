"use client";

import { useEffect, useState } from "react";
import { apiFetch } from "@/lib/api";
import { useRouter } from "next/navigation";
import AdminLayout from "@/components/DashboardLayout";
import GradientCard from "@/components/GradientCard";

type User = {
  id: number;
  userName: string;
  email: string;
  role: "User" | "Admin";
  status: "Active" | "Blocked";
  registeredAt?: string;
};

export default function AdminUsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState<number | null>(null);
  const [sortBy, setSortBy] = useState<string>("id");
  const [sortDirection, setSortDirection] = useState<"Asc" | "Desc">("Asc");

  const router = useRouter();

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const query = `?SortBy=${sortBy}&SortDirection=${sortDirection}`;
      const data = await apiFetch(`/Users${query}`);
      const usersList = Array.isArray(data?.items) ? data.items : Array.isArray(data) ? data : [];
      setUsers(usersList);
    } catch (err) {
      console.error("Ошибка загрузки пользователей:", err);
      setUsers([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [sortBy, sortDirection]);

  const handleSort = (column: string) => {
    if (sortBy === column) {
      setSortDirection(sortDirection === "Asc" ? "Desc" : "Asc");
    } else {
      setSortBy(column);
      setSortDirection("Asc");
    }
  };

  const handleBlock = async (id: number) => {
    setUpdating(id);
    try {
      await apiFetch(`/Users/${id}/block`, { method: "PUT" });
      fetchUsers();
    } finally {
      setUpdating(null);
    }
  };

  const handleUnblock = async (id: number) => {
    setUpdating(id);
    try {
      await apiFetch(`/Users/${id}/unblock`, { method: "PUT" });
      fetchUsers();
    } finally {
      setUpdating(null);
    }
  };

  const handleRoleChange = async (id: number, role: "User" | "Admin") => {
    setUpdating(id);
    try {
      await apiFetch(`/Users/${id}/update-role`, {
        method: "PUT",
        body: JSON.stringify({ role }),
      });
      fetchUsers();
    } finally {
      setUpdating(null);
    }
  };

  const renderSortArrow = (column: string) => {
    if (sortBy !== column) return null;
    return sortDirection === "Asc" ? " ▲" : " ▼";
  };

  return (
    <AdminLayout>
      <div className="p-6 space-y-6">
        <h1 className="text-4xl font-extrabold text-violet-700 drop-shadow-sm">
          👥 Адмінка користувачів
        </h1>


        {loading ? (
          <p className="text-gray-500">Завантаження користувачів...</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  {["id", "userName", "email", "role", "status"].map((col) => (
                    <th
                      key={col}
                      className="px-4 py-2 text-left text-sm font-medium text-gray-500 cursor-pointer"
                      onClick={() => handleSort(col)}
                    >
                      {col === "id"
                        ? "ID"
                        : col === "userName"
                          ? "Ім'я користувача"
                          : col === "email"
                            ? "Email"
                            : col === "role"
                              ? "Роль"
                              : "Статус"}
                      {renderSortArrow(col)}
                    </th>
                  ))}
                  <th className="px-4 py-2 text-center text-sm font-medium text-gray-500">
                    Дії
                  </th>
                </tr>
              </thead>

              <tbody className="bg-white divide-y divide-gray-200">
                {users.map((u) => (
                  <tr key={u.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-4 py-2 text-sm text-gray-700">{u.id}</td>
                    <td className="px-4 py-2 text-sm text-gray-700">{u.userName}</td>
                    <td className="px-4 py-2 text-sm text-gray-700">{u.email}</td>
                    <td className="px-4 py-2 text-sm text-gray-700">{u.role}</td>
                    <td className="px-4 py-2 text-sm">
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-semibold ${u.status === "Active"
                          ? "bg-green-100 text-green-800"
                          : "bg-red-100 text-red-800"
                          }`}
                      >
                        {u.status}
                      </span>
                    </td>
                    <td className="px-4 py-2 text-sm text-center">
                      <div className="flex flex-nowrap justify-center gap-2 overflow-x-auto">
                        {u.status === "Active" ? (
                          <button
                            onClick={() => handleBlock(u.id)}
                            disabled={updating === u.id}
                            className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600 transition-colors text-sm"
                          >
                            Заблокувати
                          </button>
                        ) : (
                          <button
                            onClick={() => handleUnblock(u.id)}
                            disabled={updating === u.id}
                            className="px-3 py-1 bg-green-500 text-white rounded hover:bg-green-600 transition-colors text-sm"
                          >
                            Розблокувати
                          </button>
                        )}

                        {u.role === "User" ? (
                          <button
                            onClick={() => handleRoleChange(u.id, "Admin")}
                            disabled={updating === u.id}
                            className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors text-sm"
                          >
                            Зробити адміном
                          </button>
                        ) : (
                          <button
                            onClick={() => handleRoleChange(u.id, "User")}
                            disabled={updating === u.id}
                            className="px-3 py-1 bg-gray-500 text-white rounded hover:bg-gray-600 transition-colors text-sm"
                          >
                            Зробити користувачем
                          </button>
                        )}

                        <button
                          onClick={() => router.push(`/profile?id=${u.id}`)}
                          className="px-3 py-1 bg-purple-500 text-white rounded hover:bg-purple-600 transition-colors text-sm"
                        >
                          Переглянути профіль
                        </button>
                      </div>
                    </td>

                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

      </div>
    </AdminLayout>
  );
}
