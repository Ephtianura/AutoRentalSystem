"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { login } from "@/lib/api";

export default function LoginPage() {
    const router = useRouter();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: any) => {
        e.preventDefault();
        setLoading(true);
        try {
            await login({ email, password });
            // Токен хранится в HttpOnly cookie, проверять его в JS не нужно
            router.push("/");
        } catch (err: any) {
            alert(err.message || "Ошибка авторизации");
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="max-w-md mx-auto mt-20 p-4 border rounded">
            <h1 className="text-xl font-bold mb-4">Вход</h1>
            <input
                placeholder="Email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                className="w-full p-2 mb-2 border"
            />
            <input
                placeholder="Пароль"
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                className="w-full p-2 mb-2 border"
            />
            <button
                type="submit"
                className="w-full p-2 bg-blue-500 text-white rounded"
                disabled={loading}
            >
                {loading ? "Входим..." : "Войти"}
            </button>
        </form>
    );
}
