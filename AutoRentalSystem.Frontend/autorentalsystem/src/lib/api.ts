import { redirect } from "next/navigation";

const API_URL = process.env.NEXT_PUBLIC_API_URL;


export async function apiFetch(endpoint: string, options: RequestInit = {}) {
  const res = await fetch(`${API_URL}${endpoint}`, {
    ...options,
    headers: { "Content-Type": "application/json", ...(options.headers || {}) },
    credentials: "include",
  });

  const text = await res.text();
  let data: any = null;
  try {
    data = text && text.startsWith("{") ? JSON.parse(text) : null;
  } catch (e) {
    console.error("JSON parse error:", e, text);
  }

  if (!res.ok) {
  if (res.status === 401 && typeof window !== "undefined") {
    const currentPath = window.location.pathname;

    // 🧠 добавляем проверку — не редиректим, если уже на логине или регистрации
    if (currentPath !== "/login" && currentPath !== "/register") {
      console.warn("⚠️ Сессия истекла. Перенаправляем на логин...");
      document.cookie = "";
      window.location.href = "/login";
    }
  }

  const err: any = new Error(
    data?.error || data?.message || `HTTP error! status: ${res.status}`
  );
  err.status = res.status;
  err.data = data || text;
  throw err;
}


  return data;
}


  // Логин
  export const login = (body: any) =>
      apiFetch("/Auth/login", { method: "POST", body: JSON.stringify(body) });

  export const register = (body: any) =>
  apiFetch("/Auth/register", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });


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
    return apiFetch("/Bookings/Create", {
      method: "POST",
      body: JSON.stringify(booking),
    });
  };

  // Получение всех бронирований текущего пользователя
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

  export const getAllBookings = async (pageNumber = 1, pageSize = 50) => {
    // Можно передавать сортировку, если нужно
    return apiFetch(`/Bookings/all?PageNumber=${pageNumber}&PageSize=${pageSize}`);
  };


  //Штрафи
export const getMyFines = async () => {
  const data = await apiFetch("/Fines/my-fines"); // apiFetch автоматически добавит API_URL и credentials
  return Array.isArray(data.items) ? data.items : [];
};

export const payFine = async (id: number) => {
  await apiFetch(`/Fines/${id}/pay`, { method: "POST" });
};

