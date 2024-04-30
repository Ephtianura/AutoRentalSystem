"use client";

import { useState } from "react";
import { apiFetch } from "@/lib/api";

type Car = {
  id: number;
  brand: string;
  model: string;
  year: number;
  plateNumber: string;
  vin: string;
  mileage: number;
  status: string;
  pricePerDay: number;
  depositAmount: number;
  fuelType: string;
  transmission: string;
  seats: number;
  imageUrl?: string;
  imageFile?: File; // Для загрузки нового файла
  removeImage?: boolean; // Флаг для удаления текущей картинки
};

export default function CarModal({
  car,
  onClose,
  refresh,
}: {
  car?: Car;
  onClose: () => void;
  refresh: () => void;
}) {
  const [form, setForm] = useState<Car>({
    id: 0,
    brand: "",
    model: "",
    year: 2023,
    plateNumber: "",
    vin: "",
    mileage: 0,
    status: "Available",
    pricePerDay: 0,
    depositAmount: 0,
    fuelType: "",
    transmission: "",
    seats: 4,
    imageUrl: "",
    ...car,
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (key: keyof Car, value: any) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const handleFileChange = (file?: File) => {
    setForm((prev) => ({ ...prev, imageFile: file, removeImage: false }));
  };

  const handleRemoveImage = () => {
    setForm((prev) => ({
      ...prev,
      imageFile: undefined,
      imageUrl: "",
      removeImage: true,
    }));
  };

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("brand", form.brand);
      formData.append("model", form.model);
      formData.append("year", form.year.toString());
      formData.append("plateNumber", form.plateNumber);
      formData.append("vin", form.vin);
      formData.append("mileage", form.mileage.toString());
      formData.append("status", form.status);
      formData.append("pricePerDay", form.pricePerDay.toString());
      formData.append("depositAmount", form.depositAmount.toString());
      formData.append("fuelType", form.fuelType);
      formData.append("transmission", form.transmission);
      formData.append("seats", form.seats.toString());

      if (form.imageFile) {
        formData.append("image", form.imageFile);
      } else if (form.removeImage) {
        formData.append("removeImage", "true");
      }

      if (car) {
        await apiFetch(`/Cars/${car.id}`, {
          method: "PUT",
          body: formData,
        });
      } else {
        await apiFetch("/Cars", {
          method: "POST",
          body: formData,
        });
      }

      refresh();
      onClose();
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-xl max-w-2xl w-full p-6 relative animate-fade-in">
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-500 hover:text-gray-700 text-2xl leading-none"
        >
          &times;
        </button>

        <h2 className="text-2xl font-bold mb-6 text-center text-primary-hover">
          {car ? "Редагувати автомобіль" : "Додати автомобіль"}
        </h2>

        {/* Текущая картинка */}
        {form.imageUrl && !form.removeImage && (
          <div className="col-span-2 flex flex-col items-center mb-4">
            <img
              src={form.imageUrl}
              alt="Car"
              className="w-48 rounded-lg mb-2"
              style={{ height: "auto" }}
            />
            <button
              type="button"
              onClick={handleRemoveImage}
              className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600"
            >
              Видалити фото
            </button>
          </div>
        )}

        <div className="grid grid-cols-2 gap-4">
          {[
            { key: "brand", label: "Марка", type: "text" },
            { key: "model", label: "Модель", type: "text" },
            { key: "year", label: "Рік", type: "number" },
            { key: "plateNumber", label: "Номер авто", type: "text" },
            { key: "vin", label: "VIN", type: "text" },
            { key: "mileage", label: "Пробіг", type: "number" },
            { key: "pricePerDay", label: "Ціна/день", type: "number" },
            { key: "depositAmount", label: "Депозит", type: "number" },
            { key: "fuelType", label: "Тип палива", type: "text" },
            { key: "transmission", label: "Коробка передач", type: "text" },
            { key: "seats", label: "Місць", type: "number" },
          ].map((field: any) => (
            <div key={field.key} className="flex flex-col">
              <label className="mb-1 font-medium">{field.label}</label>
              <input
                type={field.type}
                value={(form as any)[field.key]}
                onChange={(e) =>
                  handleChange(
                    field.key,
                    field.type === "number" ? +e.target.value : e.target.value
                  )
                }
                className="p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-light"
              />
            </div>
          ))}

          {/* Загрузка нового файла */}
          <div className="col-span-2 flex flex-col">
            <label className="mb-1 font-medium">Зображення автомобіля</label>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => handleFileChange(e.target.files?.[0])}
              className="p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-light"
            />
          </div>
        </div>

        <div className="flex justify-end mt-6 gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-300 rounded-lg hover:bg-gray-400 transition"
          >
            Відмінити
          </button>
          <button
            onClick={handleSubmit}
            disabled={loading}
            className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition"
          >
            {loading ? "Завантаження..." : car ? "Зберегти" : "Додати"}
          </button>
        </div>
      </div>
    </div>
  );
}
