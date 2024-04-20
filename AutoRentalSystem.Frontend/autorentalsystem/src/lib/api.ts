const API_URL = process.env.NEXT_PUBLIC_API_URL;

export async function apiFetch(endpoint: string, options: RequestInit = {}) {
    const res = await fetch(`${API_URL}${endpoint}`, {
        ...options,
        headers: {
            "Content-Type": "application/json",
            ...(options.headers || {}),
        },
        credentials: "include", // браузер отправляет cookie автоматически
    });

    let data: any = {};
    try {
        if (res.headers.get("Content-Type")?.includes("application/json")) {
            data = await res.json();
        }
    } catch {}

    console.log("📤 API Response:", endpoint, res.status, data);
    return data;
}

// Auth
export const register = (body: any) =>
    apiFetch("/Auth/register", { method: "POST", body: JSON.stringify(body) });

export const login = (body: any) =>
    apiFetch("/Auth/login", { method: "POST", body: JSON.stringify(body) });

export const logout = () =>
    apiFetch("/Auth/logout", { method: "POST" });

// Cars
export const getCars = async (query?: string) => {
    const data = await apiFetch(`/Cars${query || ""}`);
    return Array.isArray(data?.items) ? data.items : [];
};

export const getCar = (id: number) => apiFetch(`/Cars/${id}`);
