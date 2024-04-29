"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { getCar } from "@/lib/api";
import CarBookingForm from "@/components/CarBookingForm";

export default function CarDetailsPage() {
  const { id } = useParams();
  const [car, setCar] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const STATUS_UA: Record<string, string> = {
    Available: "Доступний",
    Booked: "Заброньований",
    InMaintenance: "На техобслуговуванні",
    Unavailable: "Недоступний",
  };

  useEffect(() => {
    const fetchCar = async () => {
      try {
        const data = await getCar(Number(id));
        setCar(data);
      } catch (err) {
        console.error(err);
        setError("Не вдалося завантажити інформацію про автомобіль.");
      } finally {
        setLoading(false);
      }
    };
    fetchCar();
  }, [id]);

  if (loading) return <p className="text-center text-[var(--color-gray-light)] mt-20">Завантаження...</p>;
  if (error) return <p className="text-center text-red-500 mt-20">{error}</p>;
  if (!car) return <p className="text-center text-[var(--color-gray-light)] mt-20">Автомобіль не знайдено.</p>;

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-lg overflow-hidden border border-white/30 flex flex-col md:flex-row transition hover:shadow-2xl duration-300">
        {/* Фото */}
        <div className="md:w-1/2 h-72 md:h-auto">
          <img
            src={car.imageUrl || "/placeholder-car.jpg"}
            alt={`${car.brand} ${car.model}`}
            className="object-cover w-full h-full"
          />
        </div>

        {/* Інформація */}
        <div className="md:w-1/2 p-8 flex flex-col justify-between">
          <div>
            <h1 className="text-3xl font-bold text-[var(--color-primary)] mb-2">
              {car.brand} {car.model}
            </h1>
            <p className="text-[var(--color-gray-light)] mb-4">{car.year} рік випуску</p>

            <ul className="space-y-2 text-[var(--color-gray-text)]">
              <li><b>Номер:</b> {car.plateNumber}</li>
              <li><b>VIN:</b> {car.vin}</li>
              <li><b>Пробіг:</b> {car.mileage.toLocaleString()} км</li>
              <li><b>Паливо:</b> {car.fuelType}</li>
              <li><b>Трансмісія:</b> {car.transmission}</li>
              <li><b>Місць:</b> {car.seats}</li>
              <li><b>Стан:</b> {STATUS_UA[car.status] || car.status}</li>
            </ul>
          </div>

          <div className="mt-6">
            <p className="text-2xl font-bold text-[var(--color-primary)] mb-1">
              {car.pricePerDay}₴ / день
            </p>
            <p className="text-[var(--color-gray-text)] text-sm">
              Запорука: {car.depositAmount}₴
            </p>
          </div>
        </div>
      </div>

      {/* Форма бронювання */}
      {car.status === "Available" ? (
        <div className="mt-10">
          <CarBookingForm car={car} />
        </div>
      ) : (
        <p className="text-center mt-8 text-[var(--color-gray-text)]">
          🚫 Цей автомобіль зараз недоступний для бронювання.
        </p>
      )}
    </div>
  );
}
