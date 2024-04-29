"use client";

import { useState, useEffect } from "react";
import AdminLayout from "@/components/DashboardLayout";
import BookingFilter from "@/components/BookingFilter";
import BookingCard from "@/components/BookingCard";
import BookingModal from "@/components/BookingModal";
import { apiFetch } from "@/lib/api";
import { List, Grid, ChevronUp, ChevronDown } from "lucide-react";

type Booking = {
  id: number;
  status: "Approved" | "Rejected" | "Pending" | "Finished";
  startDate: string;
  endDate: string;
  totalPrice: number;
  car: { id: number; brand: string; model: string; plateNumber: string; imageUrl?: string };
  user: { id: number; userName: string; email: string };
};

export default function AdminBookingsPage() {
  const [allBookings, setAllBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState<"grid" | "list">("list");
  const [filters, setFilters] = useState<Record<string, string>>({});
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);

  // Состояния сортировки
  const [sortField, setSortField] = useState<"status" | "startDate" | "totalPrice">("status");
  const [sortAsc, setSortAsc] = useState(true);

  // Загружаем все бронирования один раз
  const fetchBookings = async () => {
    setLoading(true);
    try {
      const data: { items?: Booking[] } = await apiFetch(`/Bookings/all`);
      setAllBookings(data.items || []);
    } catch (err) {
      console.error(err);
      setAllBookings([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  // Фильтруем на фронте
  const filteredBookings = allBookings.filter(b => {
    if (filters.status && b.status !== filters.status) return false;
    if (filters.user) {
      const search = filters.user.toLowerCase();
      if (!b.user.userName.toLowerCase().includes(search) && !b.user.email.toLowerCase().includes(search)) return false;
    }
    if (filters.startDate && new Date(b.startDate) < new Date(filters.startDate)) return false;
    if (filters.endDate && new Date(b.endDate) > new Date(filters.endDate)) return false;
    if (filters.minPrice && b.totalPrice < +filters.minPrice) return false;
    if (filters.maxPrice && b.totalPrice > +filters.maxPrice) return false;
    return true;
  });

  // Сортировка
  const sortedBookings = [...filteredBookings].sort((a, b) => {
    if (sortField === "status") {
      const statusOrder = ["Pending", "Approved", "Rejected", "Finished"];
      const indexA = statusOrder.indexOf(a.status);
      const indexB = statusOrder.indexOf(b.status);
      return sortAsc ? indexA - indexB : indexB - indexA;
    }
    if (sortField === "startDate") {
      return sortAsc
        ? new Date(a.startDate).getTime() - new Date(b.startDate).getTime()
        : new Date(b.startDate).getTime() - new Date(a.startDate).getTime();
    }
    if (sortField === "totalPrice") {
      return sortAsc ? a.totalPrice - b.totalPrice : b.totalPrice - a.totalPrice;
    }
    return 0;
  });

  return (
    <AdminLayout>
      <h1 className="text-4xl font-extrabold mb-8 text-primary drop-shadow-sm">
        📋 Управління бронюваннями
      </h1>

      <div className="flex gap-6">
        {/* Список/Плитка */}
        <div className="flex-1">
          {loading ? (
            <p className="text-gray-500">Завантаження...</p>
          ) : sortedBookings.length === 0 ? (
            <p className="text-gray-500">Бронювань не знайдено</p>
          ) : viewMode === "grid" ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {sortedBookings.map(b => (
                <BookingCard key={b.id} booking={b} onClick={() => setSelectedBooking(b)} />
              ))}
            </div>
          ) : (
            <div className="flex flex-col gap-4">
              {sortedBookings.map(b => (
                <BookingCard key={b.id} booking={b} onClick={() => setSelectedBooking(b)} view="list" />
              ))}
            </div>
          )}
        </div>

        {/* Фильтры + сортировка */}
        <div className="w-72 flex-shrink-0">
          <div className="flex gap-2 mt-4 mb-4 items-center">
            {/* Сортировка */}
            <select
              value={sortField}
              onChange={e => setSortField(e.target.value as any)}
              className="p-2 border rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-blue-300"
            >
              <option value="status">Статус</option>
              <option value="startDate">Дата</option>
              <option value="totalPrice">Ціна</option>
            </select>

            <button
              onClick={() => setSortAsc(!sortAsc)}
              className="p-2 rounded-lg border bg-white hover:bg-gray-100 transition flex items-center"
              title="Змінити напрям сортування"
            >
              {sortAsc ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
            </button>

            {/* Кнопки списка/плитки */}
            <button
              onClick={() => setViewMode("list")}
              className={`p-2 rounded-lg border transition ${viewMode === "list" ? "bg-blue-100 border-blue-400" : "bg-white"}`}
              title="Список"
            >
              <List size={20} className="text-blue-600" />
            </button>
            <button
              onClick={() => setViewMode("grid")}
              className={`p-2 rounded-lg border transition ${viewMode === "grid" ? "bg-blue-100 border-blue-400" : "bg-white"}`}
              title="Плитка"
            >
              <Grid size={20} className="text-blue-600" />
            </button>
          </div>

          <BookingFilter filters={filters} setFilters={setFilters} />
        </div>
      </div>

      {selectedBooking && (
        <BookingModal booking={selectedBooking} onClose={() => setSelectedBooking(null)} refresh={fetchBookings} />
      )}
    </AdminLayout>
  );
}
