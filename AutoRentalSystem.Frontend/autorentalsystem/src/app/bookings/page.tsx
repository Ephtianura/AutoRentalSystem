// app/bookings/page.tsx
"use client";
import { useEffect, useState } from "react";
import { apiFetch } from "@/lib/api";
import BookingCard from "@/components/BookingCard";

export default function MyBookingsPage() {
  const [bookings, setBookings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBookings = async () => {
      const data = await apiFetch("/Bookings/my-bookings");
      setBookings(data || []);
      setLoading(false);
    };
    fetchBookings();
  }, []);

  if (loading) return <p>Загрузка бронирований...</p>;

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Мои бронирования</h1>
      {bookings.length > 0 ? (
        bookings.map((b) => <BookingCard key={b.id} booking={b} />)
      ) : (
        <p>У вас пока нет бронирований</p>
      )}
    </div>
  );
}
