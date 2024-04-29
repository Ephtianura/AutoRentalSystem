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
      setMessage("⚠️ Виберіть дати оренди");
      return;
    }

    const days = dayjs(endDate).diff(dayjs(startDate), "day");
    if (days <= 0) {
      setMessage("Дата закінчення має бути пізніше дати початку");
      return;
    }

    const totalPrice = days * car.pricePerDay;

    setLoading(true);
    setMessage(null);

    try {
      await createBooking({
        carId: car.id,
        startDate: new Date(startDate).toISOString(),
        endDate: new Date(endDate).toISOString(),
        totalPrice,
      });

      setMessage("✅ Бронювання успішно створено!");
    } catch (err: any) {
      console.error(err);

      if (err?.data?.message) {
        setMessage(`❌ ${err.data.message}`);
      } else if (err?.status === 403) {
        setMessage("❌ У вас немає прав для створення бронювання.");
      } else {
        setMessage("❌ Помилка під час створення бронювання");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white/90 backdrop-blur-xl border border-gray-200 rounded-2xl p-6 mt-8 shadow-lg space-y-5">
      <h2 className="text-2xl font-semibold text-gray-800 text-center">
        Забронювати автомобіль
      </h2>

      <div className="flex flex-col sm:flex-row gap-5">
        <div className="flex-1">
          <label className="block text-gray-700 font-medium mb-1">
            Дата початку
          </label>
          <input
            type="date"
            className="w-full p-2.5 border border-gray-300 rounded-lg bg-white text-gray-800 shadow-sm 
                       focus:ring-2 focus:ring-primary-ring focus:border-primary 
                       transition-all outline-none"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
          />
        </div>

        <div className="flex-1">
          <label className="block text-gray-700 font-medium mb-1">
            Дата закінчення
          </label>
          <input
            type="date"
            className="w-full p-2.5 border border-gray-300 rounded-lg bg-white text-gray-800 shadow-sm 
                       focus:ring-2 focus:ring-primary-ring focus:border-primary 
                       transition-all outline-none"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
          />
        </div>
      </div>

      <button
        disabled={loading}
        onClick={handleBooking}
        className="w-full py-2.5 mt-3 rounded-lg bg-primary text-white font-semibold 
                   hover:bg-primary-hover active:scale-[0.98] transition-all 
                   disabled:bg-gray-400 disabled:cursor-not-allowed"
      >
        {loading ? "Бронювання..." : "Забронювати"}
      </button>

      {message && (
        <p
          className={`text-center mt-3 font-medium ${
            message.startsWith("✅")
              ? "text-green-600"
              : message.startsWith("⚠️")
              ? "text-yellow-600"
              : "text-red-600"
          }`}
        >
          {message}
        </p>
      )}
    </div>
  );
}
