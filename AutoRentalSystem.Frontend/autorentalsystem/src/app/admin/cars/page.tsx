"use client";

import { useState, useEffect } from "react";
import AdminLayout from "@/components/DashboardLayout";
import CarFilter from "@/components/CarFilter";
import { apiFetch } from "@/lib/api";
import CarCard from "@/components/CarCard";
import { Edit3, Trash2, List, Grid } from "lucide-react";
import { useRouter } from "next/navigation";

type Car = {
  id: number;
  brand: string;
  model: string;
  year: number;
  plateNumber: string;
  vin: string;
  mileage: number;
  status: string;
  pricePerDay: number;
  depositAmount: number;
  fuelType: string;
  transmission: string;
  seats: number;
  imageUrl?: string;
};

export default function AdminCarsPage() {
  const [cars, setCars] = useState<Car[]>([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState<any>({});
  const [viewMode, setViewMode] = useState<"list" | "grid">("list");
  const router = useRouter();

  const fetchCars = async () => {
  setLoading(true);
  try {
    const queryParams = new URLSearchParams(
      Object.entries(filters)
        .filter(([_, v]) => v !== undefined && v !== null && v !== "")
        .map(([k, v]) => [k, String(v)]) // <-- здесь приводим к строке
    ).toString();

    const data = await apiFetch(`/Cars?${queryParams}`);
    setCars(data.items || []);
  } catch (err) {
    console.error("Error loading cars:", err);
    setCars([]);
  } finally {
    setLoading(false);
  }
};


  useEffect(() => {
    fetchCars();
  }, [filters]);

  const handleDelete = async (id: number) => {
    if (!confirm("Ви впевнені, що хочете видалити автомобіль?")) return;
    try {
      await apiFetch(`/Cars/${id}`, { method: "DELETE" });
      fetchCars();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <AdminLayout>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800">Автомобілі</h1>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setViewMode("list")}
            className={`p-2 rounded border ${
              viewMode === "list" ? "bg-gray-200" : "bg-white"
            }`}
          >
            <List size={20} />
          </button>
          <button
            onClick={() => setViewMode("grid")}
            className={`p-2 rounded border ${
              viewMode === "grid" ? "bg-gray-200" : "bg-white"
            }`}
          >
            <Grid size={20} />
          </button>
          <button
            onClick={() => router.push("/admin/cars/add")}
            className="ml-2 px-4 py-2 rounded bg-violet-600 text-white hover:bg-violet-700 transition"
          >
            Додати автомобіль
          </button>
        </div>
      </div>

      <div className="flex gap-6">
        

        {/* Список/Плитка */}
        <div className="flex-1">
          {loading ? (
            <p className="text-gray-500">Завантаження...</p>
          ) : viewMode === "grid" ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {cars.map((car) => (
                <div key={car.id} className="relative group">
                  <CarCard car={car} />
                  <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={() => router.push(`/admin/cars/edit?id=${car.id}`)}
                      className="p-1 bg-blue-500 text-white rounded hover:bg-blue-600"
                    >
                      <Edit3 size={16} />
                    </button>
                    <button
                      onClick={() => handleDelete(car.id)}
                      className="p-1 bg-red-500 text-white rounded hover:bg-red-600"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex flex-col gap-4">
              {cars.map((car) => (
                <div
                  key={car.id}
                  className="flex items-center justify-between bg-white rounded-2xl shadow p-4 hover:shadow-lg transition"
                >
                  <div className="flex items-center gap-4">
                    <img
                      src={car.imageUrl || "/placeholder-car.jpg"}
                      alt={`${car.brand} ${car.model}`}
                      className="w-24 h-16 object-cover rounded-lg"
                    />
                    <div className="space-y-1">
                      <p className="font-semibold text-gray-800">{car.brand} {car.model}</p>
                      <p className="text-sm text-gray-500">Рік: {car.year}</p>
                      <p className="text-sm text-gray-500">Ціна/день: {car.pricePerDay}₴</p>
                      <p className="text-sm text-gray-500">Статус: {car.status}</p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => router.push(`/admin/cars/edit?id=${car.id}`)}
                      className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 transition"
                    >
                      Редагувати
                    </button>
                    <button
                      onClick={() => handleDelete(car.id)}
                      className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600 transition"
                    >
                      Видалити
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
        {/* Фильтры */}
        <div className="w-72 flex-shrink-0">
          <CarFilter filters={filters} setFilters={setFilters} />
        </div>
      </div>
    </AdminLayout>
  );
}
