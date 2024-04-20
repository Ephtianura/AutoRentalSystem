"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { register } from "@/lib/api";

export default function RegisterPage() {
    const router = useRouter();
    const [userName, setUserName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [dateOfBirth, setDateOfBirth] = useState('');

    const handleSubmit = async (e: any) => {
        e.preventDefault();
        try {
            await register({ userName, email, password, dateOfBirth });
            router.push('/login');
        } catch (err: any) {
            alert(err.message);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="max-w-md mx-auto mt-20 p-4 border rounded">
            <h1 className="text-xl font-bold mb-4">Регистрация</h1>
            <input placeholder="Имя" value={userName} onChange={e => setUserName(e.target.value)} className="w-full p-2 mb-2 border"/>
            <input placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} className="w-full p-2 mb-2 border"/>
            <input placeholder="Пароль" type="password" value={password} onChange={e => setPassword(e.target.value)} className="w-full p-2 mb-2 border"/>
            <input placeholder="Дата рождения" type="date" value={dateOfBirth} onChange={e => setDateOfBirth(e.target.value)} className="w-full p-2 mb-2 border"/>
            <button type="submit" className="w-full p-2 bg-green-500 text-white rounded">Зарегистрироваться</button>
        </form>
    );
}
