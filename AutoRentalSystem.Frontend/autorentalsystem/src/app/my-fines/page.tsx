"use client";

import { useEffect, useState } from "react";
import { getMyFines, payFine } from "@/lib/api"; // Создай функцию в api.ts
import dayjs from "dayjs";

export default function MyFinesPage() {
  const [fines, setFines] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Фильтры
  const [statusFilter, setStatusFilter] = useState<string>("All");
  const [minAmount, setMinAmount] = useState<number | "">("");
  const [maxAmount, setMaxAmount] = useState<number | "">("");

  // Сортировка
  const [sortBy, setSortBy] = useState<"dateIssued" | "amount">("dateIssued");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");

  useEffect(() => {
    getMyFines()
      .then(setFines)
      .finally(() => setLoading(false));
  }, []);

  const handlePay = async (id: number) => {
    await payFine(id);
    setFines((prev) => prev.map(f => f.id === id ? { ...f, status: "Paid" } : f));
  };

  if (loading)
    return <p className="text-center text-gray-500 mt-10">Завантаження...</p>;

  if (fines.length === 0)
    return <p className="text-center text-gray-500 mt-10">Немає штрафів</p>;

  // Фильтрация
  let filteredFines = fines.filter(f => {
    if (statusFilter !== "All" && f.status !== statusFilter) return false;
    if (minAmount !== "" && f.amount < minAmount) return false;
    if (maxAmount !== "" && f.amount > maxAmount) return false;
    return true;
  });

  // Сортировка
  filteredFines = filteredFines.sort((a, b) => {
    const valA = sortBy === "dateIssued" ? dayjs(a.dateIssued).valueOf() : a.amount;
    const valB = sortBy === "dateIssued" ? dayjs(b.dateIssued).valueOf() : b.amount;
    return sortOrder === "asc" ? valA - valB : valB - valA;
  });

  return (
    <div className="max-w-5xl mx-auto mt-10 bg-white p-6 rounded-xl shadow-md">
      <h1 className="text-2xl font-bold mb-6 text-gray-800">Мої штрафи</h1>

      {/* Фильтры и сортировка */}
      <div className="flex flex-wrap gap-4 mb-6">
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="border rounded-lg p-2 text-gray-800"
        >
          <option value="All">Всі статуси</option>
          <option value="Paid">Оплачено</option>
          <option value="Unpaid">Не оплачено</option>
        </select>

        <input
          type="number"
          placeholder="Мін. сума"
          value={minAmount}
          onChange={(e) => setMinAmount(e.target.value ? parseFloat(e.target.value) : "")}
          className="border rounded-lg p-2 w-24 text-gray-800"
        />
        <input
          type="number"
          placeholder="Макс. сума"
          value={maxAmount}
          onChange={(e) => setMaxAmount(e.target.value ? parseFloat(e.target.value) : "")}
          className="border rounded-lg p-2 w-24 text-gray-800"
        />

        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value as any)}
          className="border rounded-lg p-2 text-gray-800"
        >
          <option value="dateIssued">Сортувати за датою</option>
          <option value="amount">Сортувати за сумою</option>
        </select>

        <select
          value={sortOrder}
          onChange={(e) => setSortOrder(e.target.value as any)}
          className="border rounded-lg p-2 text-gray-800"
        >
          <option value="asc">За зростанням</option>
          <option value="desc">За спаданням</option>
        </select>
      </div>

      <div className="space-y-4">
        {filteredFines.length === 0 && (
          <p className="text-gray-500">Немає штрафів з такими параметрами</p>
        )}
        {filteredFines.map(f => (
          <div
            key={f.id}
            className="border rounded-lg p-4 flex justify-between items-center hover:shadow-md transition-shadow"
          >
            <div>
              <p className="font-semibold text-gray-800">Сума: {f.amount} ₴</p>
              <p className="text-gray-600 text-sm">{dayjs(f.dateIssued).format("DD.MM.YYYY")}</p>
              <p className="text-gray-700 mt-1">{f.description}</p>
            </div>

            <div className="flex flex-col items-end gap-2">
              <span
                className={`text-sm font-medium ${
                  f.status === "Paid" ? "text-green-600" : "text-red-600"
                }`}
              >
                {f.status === "Paid" ? "Оплачено" : "Не оплачено"}
              </span>
              {f.status !== "Paid" && (
                <button
                  onClick={() => handlePay(f.id)}
                  className="bg-blue-600 text-white px-3 py-1 rounded-lg hover:bg-blue-700 transition-colors text-sm"
                >
                  Оплатити
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
