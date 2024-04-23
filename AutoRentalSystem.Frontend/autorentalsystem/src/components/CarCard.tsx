"use client";
import Link from "next/link";

export default function CarCard({ car }: { car: any }) {
  return (
    <Link
      href={`/cars/${car.id}`}
      className="block bg-white rounded-2xl shadow-md overflow-hidden hover:shadow-xl transition-shadow duration-300 group"
    >
      <div className="relative h-48 w-full">
        <img
          src={car.imageUrl || "/placeholder-car.jpg"}
          alt={`${car.brand} ${car.model}`}
          className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-300"
        />
      </div>
      <div className="p-4 space-y-1">
        <h3 className="text-xl font-semibold text-gray-800">{car.brand} {car.model}</h3>
        <p className="text-gray-500 text-sm">Год: {car.year}</p>
        <p className="text-gray-500 text-sm">Пробег: {car.mileage} км</p>
        <p className="text-gray-500 text-sm">Топливо: {car.fuelType}</p>
        <p className="text-gray-500 text-sm">Трансмиссия: {car.transmission}</p>
        <p className="text-gray-500 text-sm">Места: {car.seats}</p>
        <p className="text-gray-500 text-sm">Статус: {car.status}</p>
        <p className="text-lg font-bold text-blue-600">{car.pricePerDay}₴ / день</p>
        <p className="text-sm text-gray-600">Депозит: {car.depositAmount}₴</p>
      </div>
    </Link>
  );
}
