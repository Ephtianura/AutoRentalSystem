"use client";

export default function CarCard({ car }: { car: any }) {
  return (
    <div className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition-shadow duration-300 group">
      <div className="relative h-48 w-full">
        <img
          src={car.imageUrl || "/placeholder-car.jpg"}
          alt={`${car.brand} ${car.model}`}
          className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-300"
        />
      </div>
      <div className="p-4">
        <h3 className="text-xl font-semibold text-gray-800">
          {car.brand} {car.model}
        </h3>
        <p className="text-gray-500 text-sm mb-2">Год: {car.year}</p>
        <p className="text-gray-500 text-sm mb-2">Трансмиссия: {car.transmission}</p>
        <p className="text-gray-500 text-sm mb-2">Состояние: {car.status}</p>
        <p className="text-lg font-bold text-blue-600 mb-4">
          {car.pricePerDay}₴ / день
        </p>
        <button className="w-full py-2 rounded-lg bg-blue-600 text-white font-medium hover:bg-blue-700 transition-colors duration-200">
          Забронировать
        </button>
      </div>
    </div>
  );
}
