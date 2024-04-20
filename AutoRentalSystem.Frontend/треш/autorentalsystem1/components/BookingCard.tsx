// app/components/BookingCard.tsx
"use client";

export default function BookingCard({ booking }: { booking: any }) {
  return (
    <div className="border rounded shadow p-4 bg-white mb-4">
      <h3 className="font-bold text-lg mb-1">{booking.car.brand} {booking.car.model}</h3>
      <p>Начало аренды: {new Date(booking.startDate).toLocaleDateString()}</p>
      <p>Конец аренды: {new Date(booking.endDate).toLocaleDateString()}</p>
      <p>Статус: {booking.status}</p>
      <p>Цена: {booking.totalPrice}₴</p>
    </div>
  );
}
