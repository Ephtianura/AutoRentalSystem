"use client";
import { useEffect, useState } from "react";
import { getCars } from "@/lib/api";
import CarCard from "@/components/CarCard";

export default function HomePage() {
  const [cars, setCars] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCars = async () => {
      try {
        const data = await getCars();
        setCars(data);
      } catch (err: any) {
        setError("Не удалось загрузить список автомобилей.");
      } finally {
        setLoading(false);
      }
    };
    fetchCars();
  }, []);

  if (loading) return <p className="text-gray-500 text-center mt-20">Загрузка автомобилей...</p>;
  if (error) return <p className="text-red-500 text-center mt-20">{error}</p>;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <h1 className="text-3xl font-bold text-gray-800 mb-8 text-center">
        Доступные автомобили
      </h1>
      {cars.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {cars.map((car) => (
            <CarCard key={car.id} car={car} />
          ))}
        </div>
      ) : (
        <p className="text-gray-500 text-center">Нет доступных автомобилей</p>
      )}
    </div>
  );
}
