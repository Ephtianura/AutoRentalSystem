"use client";
import { useState } from "react";

interface FilterProps {
  filters: any;
  setFilters: React.Dispatch<React.SetStateAction<any>>;
}

const transmissions = ["Automatic", "Manual"];
const fuelTypes = ["Petrol", "Diesel", "Electric", "Hybrid"];
const statuses = ["Available", "InRent", "Maintenance", "Booked"];

export default function CarFilter({ filters, setFilters }: FilterProps) {
  const handleChange = (key: string, value: any) => {
    setFilters((prev: any) => ({ ...prev, [key]: value || undefined }));
  };

interface StatusFilterProps {
  statuses: string[]; // список статусов
  filters: {
    Status?: string; // текущее значение фильтра
  };
  handleChange: (field: string, value: string) => void; // функция обработки изменений
}

const statusTranslations: Record<string, string> = {
  Available: "Доступний",
  InRent: "Орендований",
  Maintenance: "На обслуговуванні",
  Booked: "Заброньований",
};

  return (
    <div className="bg-white/90 backdrop-blur-md rounded-xl shadow-lg p-6 space-y-6 border border-gray-300">
      <h2 className="text-xl font-semibold text-gray-900 mb-4">Фільтри</h2>

      {/* Бренд */}
      <div>
        <label className="block text-gray-800 font-medium mb-1">Бренд</label>
        <input
          type="text"
          value={filters.Brand || ""}
          onChange={(e) => handleChange("Brand", e.target.value)}
          placeholder="Наприклад: Toyota"
          className="w-full p-2 border border-gray-300 rounded-lg text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-300 focus:border-blue-500"
        />
      </div>

      {/* Модель */}
      <div>
        <label className="block text-gray-800 font-medium mb-1">Модель</label>
        <input
          type="text"
          value={filters.Model || ""}
          onChange={(e) => handleChange("Model", e.target.value)}
          placeholder="Наприклад: Corolla"
          className="w-full p-2 border border-gray-300 rounded-lg text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-300 focus:border-blue-500"
        />
      </div>

      {/* Годы */}
      <div className="flex gap-3">
        <div className="flex-1">
          <label className="block text-gray-800 font-medium mb-1">Рік от</label>
          <input
            type="number"
            value={filters.YearFrom || ""}
            onChange={(e) => handleChange("YearFrom", e.target.value)}
            placeholder="2000"
            className="w-full p-2 border border-gray-300 rounded-lg text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-300 focus:border-blue-500"
          />
        </div>
        <div className="flex-1">
          <label className="block text-gray-800 font-medium mb-1">Рік до</label>
          <input
            type="number"
            value={filters.YearTo || ""}
            onChange={(e) => handleChange("YearTo", e.target.value)}
            placeholder="2025"
            className="w-full p-2 border border-gray-300 rounded-lg text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-300 focus:border-blue-500"
          />
        </div>
      </div>

      {/* Цена */}
      <div className="flex gap-3">
        <div className="flex-1">
          <label className="block text-gray-800 font-medium mb-1">Мін. цена</label>
          <input
            type="number"
            value={filters.MinPricePerDay || ""}
            onChange={(e) => handleChange("MinPricePerDay", e.target.value)}
            placeholder="0"
            className="w-full p-2 border border-gray-300 rounded-lg text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-300 focus:border-blue-500"
          />
        </div>
        <div className="flex-1">
          <label className="block text-gray-800 font-medium mb-1">Макс. цена</label>
          <input
            type="number"
            value={filters.MaxPricePerDay || ""}
            onChange={(e) => handleChange("MaxPricePerDay", e.target.value)}
            placeholder="1000"
            className="w-full p-2 border border-gray-300 rounded-lg text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-300 focus:border-blue-500"
          />
        </div>
      </div>

      {/* Трансмиссия */}
      <div>
        <label className="block text-gray-800 font-medium mb-1">Трансмісія</label>
        <select
          value={filters.Transmission || ""}
          onChange={(e) => handleChange("Transmission", e.target.value)}
          className="w-full p-2 border border-gray-300 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-300 focus:border-blue-500"
        >
          <option value="">Будь-яка</option>
          {transmissions.map((t) => (
            <option key={t} value={t}>
              {t}
            </option>
          ))}
        </select>
      </div>

      {/* Тип топлива */}
      <div>
        <label className="block text-gray-800 font-medium mb-1">Паливо</label>
        <select
          value={filters.FuelType || ""}
          onChange={(e) => handleChange("FuelType", e.target.value)}
          className="w-full p-2 border border-gray-300 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-300 focus:border-blue-500"
        >
          <option value="">Будь-яке</option>
          {fuelTypes.map((f) => (
            <option key={f} value={f}>
              {f}
            </option>
          ))}
        </select>
      </div>

      {/* Количество мест */}
      <div className="flex gap-3">
        <div className="flex-1">
          <label className="block text-gray-800 font-medium mb-1">Мін. місця</label>
          <input
            type="number"
            value={filters.MinSeats || ""}
            onChange={(e) => handleChange("MinSeats", e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-lg text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-300 focus:border-blue-500"
          />
        </div>
        <div className="flex-1">
          <label className="block text-gray-800 font-medium mb-1">Макс. місця</label>
          <input
            type="number"
            value={filters.MaxSeats || ""}
            onChange={(e) => handleChange("MaxSeats", e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-lg text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-300 focus:border-blue-500"
          />
        </div>
      </div>
      

      {/* Статус */}
      <div>
      <label className="block text-gray-800 font-medium mb-1">Статус</label>
      <select
        value={filters.Status || ""}
        onChange={(e) => handleChange("Status", e.target.value)}
        className="w-full p-2 border border-gray-300 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-300 focus:border-blue-500"
      >
        <option value="">Усі</option>
        {statuses.map((s) => (
          <option key={s} value={s}>
            {statusTranslations[s] || s}
          </option>
        ))}
      </select>
    </div>

      {/* Сброс */}
      <button
        onClick={() => setFilters({})}
        className="w-full py-2 mt-2 rounded-lg bg-red-500 text-white font-medium hover:bg-red-600 transition-colors"
      >
        Скинути фільтри
      </button>
    </div>
  );
}
