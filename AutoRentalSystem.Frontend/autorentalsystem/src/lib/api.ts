const API_URL = process.env.NEXT_PUBLIC_API_URL;
export async function apiFetch(endpoint: string, options: RequestInit = {}) {
    const res = await fetch(`${API_URL}${endpoint}`, {
        ...options,
        headers: {
            "Content-Type": "application/json",
            ...(options.headers || {}),
        },
        credentials: "include",
    });

    const text = await res.text();
    let data: any = null;

    try {
        data = text && text.startsWith("{") ? JSON.parse(text) : null;
    } catch (e) {
        console.error("JSON parse error:", e, text);
    }

    console.log("📤 API Response:", endpoint, res.status, data);

    if (!res.ok) {
        const err: any = new Error(
            data?.error || data?.message || `HTTP error! status: ${res.status}`
        );
        err.status = res.status;
        err.data = data || text; // если JSON нет, сохраняем сырой текст
        throw err;
    }

    return data;
}






// Регистрация
export const register = async (body: any) => {
    const res = await fetch(`${API_URL}/Auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
    });

    // если сервер вернул ошибку
    if (!res.ok) {
        let data: { error?: string } = {};
        try {
            const text = await res.text();
            if (text) data = JSON.parse(text);
        } catch { }
        throw new Error(data.error || `HTTP error! status: ${res.status}`);
    }

    // если сервер вернул пустое тело
    try {
        const text = await res.text();
        if (!text) return {};
        return JSON.parse(text);
    } catch {
        return {};
    }
};

// Логин
export const login = (body: any) =>
    apiFetch("/Auth/login", { method: "POST", body: JSON.stringify(body) });

export const logout = () => apiFetch("/Auth/logout", { method: "POST" });

// Cars
export const getCars = async (filters?: Record<string, any>) => {
  let query = "";

  if (filters && Object.keys(filters).length > 0) {
    const params = new URLSearchParams();

    for (const key in filters) {
      const value = filters[key];
      if (value !== undefined && value !== "") {
        params.append(key, value.toString());
      }
    }

    query = "?" + params.toString();
  }

  const data = await apiFetch(`/Cars${query}`);

  console.log("🚗 cars fetched:", data);

  // API может возвращать разные структуры — обработаем безопасно
  if (Array.isArray(data)) return data;
  if (data?.items) return data.items;
  return [];
};


export const getCar = (id: number) => apiFetch(`/Cars/${id}`);
// Получение одного пользователя
export const getUserMe = async () => apiFetch("/Users/me");
export const getUserById = async (id: number) => apiFetch(`/Users/${id}`);


// Booking API

// Создание бронирования
export const createBooking = async (booking: {
  carId: number;
  startDate: string;
  endDate: string;
  totalPrice: number;
}) => {
  return apiFetch("/Bookings", {
    method: "POST",
    body: JSON.stringify(booking),
  });
};

// Получение всех бронирований текущего пользователя
// src/lib/api.ts
export const getMyBookings = async () => {
  const data = await apiFetch("/Bookings/my-bookings");
  return Array.isArray(data.items) ? data.items : [];
};


// Управление бронированием (для админа)
export const approveBooking = (id: number) =>
  apiFetch(`/Bookings/${id}/approve`, { method: "POST" });

export const rejectBooking = (id: number) =>
  apiFetch(`/Bookings/${id}/reject`, { method: "POST" });

export const finishBooking = (id: number) =>
  apiFetch(`/Bookings/${id}/finish`, { method: "POST" });