"use client";

import React, { useState } from "react";
import { apiFetch } from "@/lib/api";

type Booking = {
  id: number;
  status: "Approved" | "Rejected" | "Pending" | "Finished";
  startDate: string;
  endDate: string;
  totalPrice: number;
  car: { brand: string; model: string; plateNumber: string; imageUrl?: string };
  user: { userName: string; email: string; id: number };
};

const statusTranslations: Record<string, string> = {
  Pending: "В очікуванні",
  Approved: "Прийнято",
  Rejected: "Відхилено",
  Finished: "Завершено",
};

const statusColors: Record<string, string> = {
  Pending: "#FBBF24",     // жёлтый
  Approved: "#34D399",    // зелёный
  Rejected: "#F87171",    // красный
  Finished: "#7C3AED",    // фиолетовый
};

export default function BookingCard({
  booking,
  onClick,
  view = "grid",
  onStatusChange,
}: {
  booking: Booking;
  onClick: () => void;
  view?: "grid" | "list";
  onStatusChange?: () => void;
}) {
  const userInfo = booking.user
    ? `${booking.user.userName} (${booking.user.email})`
    : "Користувач не вказаний";

  const imageUrl = booking.car.imageUrl || "/placeholder-car.webp";
  const statusText = statusTranslations[booking.status] || booking.status;
  const statusColor = statusColors[booking.status] || "#000";

  const [loadingAction, setLoadingAction] = useState(false);

  const handleAction = async (action: "approve" | "reject" | "finish") => {
    if (loadingAction) return;
    setLoadingAction(true);
    try {
      await apiFetch(`/Bookings/${booking.id}/${action}`, { method: "POST" });
      onStatusChange?.();
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingAction(false);
    }
  };

  return (
    <div
      onClick={onClick}
      className={`cursor-pointer bg-white rounded-2xl shadow p-4 hover:shadow-lg transition ${
        view === "list" ? "flex items-center justify-between" : ""
      }`}
    >
      {view === "grid" ? (
        <>
          <img
            src={imageUrl}
            alt={`${booking.car.brand} ${booking.car.model}`}
            className="w-full h-40 object-cover rounded-lg mb-3"
          />
          <p className="text-lg font-semibold text-gray-800">
            {booking.car.brand} {booking.car.model}
          </p>
          <p className="text-sm text-gray-500">{userInfo}</p>
          <p className="text-md font-bold" style={{ color: statusColor }}>
            Статус: {statusText}
          </p>
          <p className="text-md font-bold text-gray-800">Ціна: {booking.totalPrice}₴</p>

          {booking.status === "Pending" && (
            <div className="flex gap-2 mt-2">
              <button
                disabled={loadingAction}
                onClick={(e) => { e.stopPropagation(); handleAction("approve"); }}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                Прийняти
              </button>
              <button
                disabled={loadingAction}
                onClick={(e) => { e.stopPropagation(); handleAction("reject"); }}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
              >
                Відхилити
              </button>
            </div>
          )}
        </>
      ) : (
        <div className="flex items-center gap-4 w-full">
          <img
            src={imageUrl}
            alt={`${booking.car.brand} ${booking.car.model}`}
            className="w-28 h-20 object-cover rounded-lg"
          />
          <div className="flex flex-col flex-1 gap-1">
            <p className="text-lg font-semibold text-gray-800">
              {booking.car.brand} {booking.car.model}
            </p>
            <p className="text-sm text-gray-500">{userInfo}</p>
            <p className="text-md font-bold" style={{ color: statusColor }}>
              Статус: {statusText}
            </p>
            <p className="text-md font-bold text-gray-800">Ціна: {booking.totalPrice}₴</p>
          </div>

          {booking.status === "Pending" && (
            <div className="flex flex-col gap-2 ml-4">
              <button
                disabled={loadingAction}
                onClick={(e) => { e.stopPropagation(); handleAction("approve"); }}
                className="px-3 py-1 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                Прийняти
              </button>
              <button
                disabled={loadingAction}
                onClick={(e) => { e.stopPropagation(); handleAction("reject"); }}
                className="px-3 py-1 bg-red-600 text-white rounded-lg hover:bg-red-700"
              >
                Відхилити
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
