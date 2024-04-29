"use client";

import { useEffect, useState } from "react";
import { apiFetch } from "@/lib/api";

type Booking = {
  id: number;
  status: string;
  startDate: string;
  endDate: string;
  totalPrice: number;
  car: { brand: string; model: string; plateNumber: string };
  user: { userName: string; email: string; id: number };
};

export default function BookingModal({
  booking,
  onClose,
  refresh,
}: {
  booking: Booking;
  onClose: () => void;
  refresh: () => void;
}) {
  const [fines, setFines] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchFines = async () => {
    try {
      const data = await apiFetch(`/Fines/${booking.id}`);
      setFines(data.items ?? []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFines();
  }, []);

  const handleAction = async (action: "approve" | "reject" | "finish") => {
    try {
      await apiFetch(`/Bookings/${booking.id}/${action}`, { method: "POST" });
      refresh();
      onClose();
    } catch (err) {
      console.error(err);
    }
  };

  const unpaidFines = fines.filter((f) => f.status !== "Paid").length;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-xl max-w-lg w-full p-6 relative">
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-500 hover:text-gray-700 text-2xl leading-none"
        >
          &times;
        </button>

        <h2 className="text-2xl font-bold mb-3 text-center">
          {booking.car.brand} {booking.car.model}
        </h2>

        <div className="space-y-2 text-gray-700">
          <p>
            <span className="font-semibold">Користувач:</span>{" "}
            {booking.user
              ? `${booking.user.userName} (${booking.user.email})`
              : "Невідомий"}
          </p>

          <p>
            <span className="font-semibold">Номер авто:</span>{" "}
            {booking.car.plateNumber}
          </p>

          <p>
            <span className="font-semibold">Статус:</span> {booking.status}
          </p>

          <p>
            <span className="font-semibold">Ціна:</span> {booking.totalPrice}₴
          </p>

          <p>
            <span className="font-semibold">Період:</span>{" "}
            {new Date(booking.startDate).toLocaleDateString()} –{" "}
            {new Date(booking.endDate).toLocaleDateString()}
          </p>

          {!loading && (
            <p>
              <span className="font-semibold">Неоплачені штрафи:</span>{" "}
              {unpaidFines}
            </p>
          )}
        </div>

        <div className="flex justify-end gap-2 mt-5">
          {booking.status === "Pending" && (
            <>
              <button
                onClick={() => handleAction("approve")}
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
              >
                Прийняти
              </button>
              <button
                onClick={() => handleAction("reject")}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
              >
                Відхилити
              </button>
            </>
          )}

          {booking.status === "Approved" && (
            <button
              onClick={() => handleAction("finish")}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Завершити
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
