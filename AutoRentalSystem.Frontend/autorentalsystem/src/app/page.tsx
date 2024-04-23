  "use client";
  import { useEffect, useState } from "react";
  import { getCars } from "@/lib/api";
  import CarCard from "@/components/CarCard";
  import CarFilter from "@/components/CarFilter";

  export default function HomePage() {
    const [cars, setCars] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [filters, setFilters] = useState<any>({});

    useEffect(() => {
      const fetchCars = async () => {
        setLoading(true);
        try {
          const data = await getCars(filters);
          setCars(data.items || data || []);
        } catch {
          setError("Не удалось загрузить список автомобилей.");
        } finally {
          setLoading(false);
        }
      };
      fetchCars();
    }, [filters]);

    return (
      <div className="flex min-h-screen bg-gray-50">
        {/* Левая панель фильтров */}
        <aside className="w-72 xl:w-80 bg-white border-r border-gray-200 p-6 sticky top-0 h-screen overflow-y-auto">
          <CarFilter filters={filters} setFilters={setFilters} />
        </aside>

        {/* Основной контент */}
        <main className="flex-1 px-6 py-10">
          <h1 className="text-3xl font-bold text-gray-800 mb-8 text-center">
            🚗 Доступные автомобили
          </h1>

          {loading ? (
            <p className="text-gray-500 text-center mt-20">Загрузка автомобилей...</p>
          ) : error ? (
            <p className="text-red-500 text-center mt-20">{error}</p>
          ) : cars.length === 0 ? (
            <p className="text-gray-500 text-center">Нет доступных автомобилей</p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {cars.map((car) => (
                <CarCard key={car.id} car={car} />
              ))}
            </div>
          )}
        </main>
      </div>
    );
  }
