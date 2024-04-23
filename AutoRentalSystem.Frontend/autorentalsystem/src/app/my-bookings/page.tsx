"use client";
import { useEffect, useState } from "react";
import { getMyBookings } from "@/lib/api";
import dayjs from "dayjs";

export default function MyBookingsPage() {
  const [bookings, setBookings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Фільтри
  const [statusFilter, setStatusFilter] = useState<string>("All");
  const [minPrice, setMinPrice] = useState<number | "">("");
  const [maxPrice, setMaxPrice] = useState<number | "">("");
  const [startDateFilter, setStartDateFilter] = useState<string>("");

  // Сортування
  const [sortBy, setSortBy] = useState<"startDate" | "totalPrice">("startDate");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");

  useEffect(() => {
    getMyBookings()
      .then(setBookings)
      .finally(() => setLoading(false));
  }, []);

  if (loading)
    return <p className="text-center text-gray-500 mt-10">Завантаження...</p>;

  if (bookings.length === 0)
    return <p className="text-center text-gray-500 mt-10">Немає бронювань</p>;

  // Фільтруємо масив
  let filteredBookings = bookings.filter((b) => {
    if (statusFilter !== "All" && b.status !== statusFilter) return false;
    if (minPrice !== "" && b.totalPrice < minPrice) return false;
    if (maxPrice !== "" && b.totalPrice > maxPrice) return false;
    if (startDateFilter && dayjs(b.startDate).isBefore(dayjs(startDateFilter))) return false;
    return true;
  });

  // Сортування
  filteredBookings = filteredBookings.sort((a, b) => {
    let valA = sortBy === "startDate" ? dayjs(a.startDate).valueOf() : a.totalPrice;
    let valB = sortBy === "startDate" ? dayjs(b.startDate).valueOf() : b.totalPrice;
    return sortOrder === "asc" ? valA - valB : valB - valA;
  });

  return (
    <div className="max-w-5xl mx-auto mt-10 bg-white p-6 rounded-xl shadow-md">
      <h1 className="text-2xl font-bold mb-6 text-gray-800">Мої бронювання</h1>

      {/* Фільтри та сортування */}
      <div className="flex flex-wrap gap-4 mb-6">
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="border rounded-lg p-2 text-gray-800"
        >
          <option value="All">Всі статуси</option>
          <option value="Pending">На розгляді</option>
          <option value="Approved">Підтверджено</option>
          <option value="Rejected">Відхилено</option>
        </select>

        <input
          type="number"
          placeholder="Мін. ціна"
          value={minPrice}
          onChange={(e) => setMinPrice(e.target.value ? parseFloat(e.target.value) : "")}
          className="border rounded-lg p-2 w-24 text-gray-800"
        />
        <input
          type="number"
          placeholder="Макс. ціна"
          value={maxPrice}
          onChange={(e) => setMaxPrice(e.target.value ? parseFloat(e.target.value) : "")}
          className="border rounded-lg p-2 w-24 text-gray-800"
        />

        <input
          type="date"
          value={startDateFilter}
          onChange={(e) => setStartDateFilter(e.target.value)}
          className="border rounded-lg p-2 text-gray-800"
        />

        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value as any)}
          className="border rounded-lg p-2 text-gray-800"
        >
          <option value="startDate">Сортувати за датою</option>
          <option value="totalPrice">Сортувати за ціною</option>
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
        {filteredBookings.length === 0 && (
          <p className="text-gray-500">Немає бронювань з такими параметрами</p>
        )}
        {filteredBookings.map((b) => (
          <div
            key={b.id}
            className="border rounded-lg p-4 flex justify-between items-center hover:shadow-md transition-shadow"
          >
            <div>
              <p className="font-semibold text-gray-800">
                {b.car?.brand} {b.car?.model}
              </p>
              <p className="text-gray-600 text-sm">
                {dayjs(b.startDate).format("DD.MM.YYYY")} —{" "}
                {dayjs(b.endDate).format("DD.MM.YYYY")}
              </p>
              <p className="text-gray-700 mt-1">Ціна: {b.totalPrice} ₴</p>
            </div>
            <span
              className={`text-sm font-medium ${
                b.status === "Pending"
                  ? "text-yellow-500"
                  : b.status === "Approved"
                  ? "text-green-600"
                  : b.status === "Rejected"
                  ? "text-red-600"
                  : "text-blue-600"
              }`}
            >
              {b.status === "Pending" ? "На розгляді" :
               b.status === "Approved" ? "Підтверджено" :
               b.status === "Rejected" ? "Відхилено" :
               b.status === "Finished" ? "Завершено": b.status}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
