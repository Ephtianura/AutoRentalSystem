"use client";
import { useState } from "react";
import { createBooking } from "@/lib/api";
import dayjs from "dayjs";

export default function CarBookingForm({ car }: { car: any }) {
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  const handleBooking = async () => {
  if (!startDate || !endDate) {
    setMessage("⚠️ Выберите даты аренды");
    return;
  }

  const days = dayjs(endDate).diff(dayjs(startDate), "day");
  if (days <= 0) {
    setMessage("Дата окончания должна быть позже даты начала");
    return;
  }

  const totalPrice = days * car.pricePerDay;

  setLoading(true);
  setMessage(null);
  try {
    // Конвертируем даты в UTC ISO формат
    await createBooking({
      carId: car.id,
      startDate: new Date(startDate).toISOString(),
      endDate: new Date(endDate).toISOString(),
      totalPrice,
    });

    setMessage("✅ Бронирование успешно создано!");
  } catch (err: any) {
    console.error(err);
    setMessage("❌ Ошибка при создании бронирования");
  } finally {
    setLoading(false);
  }
};


  return (
    <div className="bg-white/80 backdrop-blur-md border rounded-xl p-6 mt-8 shadow-md space-y-4">
      <h2 className="text-xl font-semibold text-gray-800">
        Забронировать автомобиль
      </h2>

      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1">
          <label className="block text-gray-700 font-medium mb-1">Дата начала</label>
          <input
            type="date"
            className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-200"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
          />
        </div>

        <div className="flex-1">
          <label className="block text-gray-700 font-medium mb-1">Дата окончания</label>
          <input
            type="date"
            className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-200"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
          />
        </div>
      </div>

      <button
        disabled={loading}
        onClick={handleBooking}
        className="w-full py-2 mt-2 rounded-lg bg-blue-600 text-white font-medium hover:bg-blue-700 transition disabled:bg-gray-400"
      >
        {loading ? "Бронирование..." : "Забронировать"}
      </button>

      {message && <p className="text-center mt-3 text-gray-700">{message}</p>}
    </div>
  );
}
