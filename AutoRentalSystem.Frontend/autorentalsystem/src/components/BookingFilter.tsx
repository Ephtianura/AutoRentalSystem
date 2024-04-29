// BookingFilter.tsx
"use client";
import { Calendar, DollarSign, User, Filter } from "lucide-react";

interface BookingFilterProps {
  filters: Record<string, string>;
  setFilters: React.Dispatch<React.SetStateAction<Record<string, string>>>;
}

const statuses = ["Pending", "Approved", "Rejected", "Finished"];
const statusTranslations: Record<string, string> = {
  Pending: "Очікує",
  Approved: "Підтверджено",
  Rejected: "Відхилено",
  Finished: "Завершено",
};

export default function BookingFilter({ filters, setFilters }: BookingFilterProps) {
  const handleChange = (key: string, value: string) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const resetFilters = () => {
    setFilters({});
  };

  return (
    <div className="bg-white/90 backdrop-blur-md rounded-xl shadow-lg p-6 space-y-6 border border-gray-300">
      <div className="flex items-center gap-2 mb-2">
        <Filter className="text-blue-600" size={20} />
        <h2 className="text-xl font-semibold text-gray-900">Фільтри</h2>
      </div>

      {/* Статус */}
      <div>
        <label className="block text-gray-800 font-medium mb-1">Статус</label>
        <select
          value={filters.status || ""}
          onChange={e => handleChange("status", e.target.value)}
          className="w-full p-2 border border-gray-300 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-300 focus:border-blue-500"
        >
          <option value="">Усі</option>
          {statuses.map(s => (
            <option key={s} value={s}>{statusTranslations[s]}</option>
          ))}
        </select>
      </div>

      {/* Користувач */}
      <div>
        <label className="block text-gray-800 font-medium mb-1 flex items-center gap-1">
          <User size={16} className="text-gray-600" /> Користувач
        </label>
        <input
          type="text"
          placeholder="Ім'я або email"
          value={filters.user || ""}
          onChange={e => handleChange("user", e.target.value)}
          className="w-full p-2 border border-gray-300 rounded-lg text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-300 focus:border-blue-500"
        />
      </div>

      {/* Дати */}
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-gray-800 font-medium mb-1 flex items-center gap-1">
            <Calendar size={16} className="text-gray-600" /> Від
          </label>
          <input
            type="date"
            value={filters.startDate || ""}
            onChange={e => handleChange("startDate", e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-300 focus:border-blue-500"
          />
        </div>
        <div>
          <label className="block text-gray-800 font-medium mb-1 flex items-center gap-1">
            <Calendar size={16} className="text-gray-600" /> До
          </label>
          <input
            type="date"
            value={filters.endDate || ""}
            onChange={e => handleChange("endDate", e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-300 focus:border-blue-500"
          />
        </div>
      </div>

      {/* Ціна */}
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-gray-800 font-medium mb-1 flex items-center gap-1">
            <DollarSign size={16} className="text-gray-600" /> Мін. ціна
          </label>
          <input
            type="number"
            value={filters.minPrice || ""}
            onChange={e => handleChange("minPrice", e.target.value)}
            placeholder="0"
            className="w-full p-2 border border-gray-300 rounded-lg text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-300 focus:border-blue-500"
          />
        </div>
        <div>
          <label className="block text-gray-800 font-medium mb-1 flex items-center gap-1">
            <DollarSign size={16} className="text-gray-600" /> Макс. ціна
          </label>
          <input
            type="number"
            value={filters.maxPrice || ""}
            onChange={e => handleChange("maxPrice", e.target.value)}
            placeholder="10000"
            className="w-full p-2 border border-gray-300 rounded-lg text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-300 focus:border-blue-500"
          />
        </div>
      </div>

      <button
        onClick={resetFilters}
        className="w-full py-2 mt-2 rounded-lg bg-red-500 text-white font-medium hover:bg-red-600 transition-colors"
      >
        Скинути фільтри
      </button>
    </div>
  );
}
