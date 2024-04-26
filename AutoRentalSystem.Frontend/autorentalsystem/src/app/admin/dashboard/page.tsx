"use client";

import AdminLayout from "@/components/DashboardLayout";
import GradientCard from "@/components/GradientCard";
import { apiFetch } from "@/lib/api";
import {
    LineChart,
    Line,
    PieChart,
    Pie,
    Cell,
    Tooltip,
    ResponsiveContainer,
    XAxis,
    YAxis,
    Legend,
} from "recharts";
import { useEffect, useState } from "react";

export default function AdminDashboard() {
    const [stats, setStats] = useState<any>(null);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const [usersData, carsData, bookingsData] = await Promise.all([
                    apiFetch("/Users"),
                    apiFetch("/Cars"),
                    apiFetch("/Bookings/all"),
                ]);

                const bookings: Booking[] = bookingsData?.items ?? [];

                // Группировка по месяцам
                const monthNames = ["Січ", "Лют", "Бер", "Квіт", "Трав", "Чер", "Лип", "Сер", "Вер", "Жов", "Лис", "Гру"];
                const monthlyBookings = Array.from({ length: 12 }, (_, i) => ({ month: monthNames[i], count: 0 }));

                bookings.forEach((b: Booking) => {
                    const date = new Date(b.startDate);
                    const month = date.getMonth();
                    monthlyBookings[month].count += 1;
                });

                // Статусы
                const statusMap: Record<Booking["status"], number> = { Approved: 0, Rejected: 0, Pending: 0, Finished: 0 };
                bookings.forEach((b: Booking) => {
                    statusMap[b.status] = (statusMap[b.status] || 0) + 1;
                });
                const statusData = Object.entries(statusMap).map(([name, value]) => ({ name, value }));

                setStats({
                    users: usersData?.items?.length ?? 0,
                    cars: carsData?.items?.length ?? 0,
                    bookings: bookings.length,
                    fines: 0,
                    monthlyBookings,
                    statusData,
                });
            } catch (err) {
                console.error("Error loading admin stats", err);
            }
        };

        fetchStats();
    }, []);



    type Booking = {
        id: number;
        status: "Approved" | "Rejected" | "Pending" | "Finished";
        startDate: string;
        endDate: string;
        totalPrice: number;
        car: { id: number; brand: string; model: string; plateNumber: string };
        contract: any;
    };

    const monthlyBookings = [
        { month: "Січ", count: 40 },
        { month: "Лют", count: 52 },
        { month: "Бер", count: 70 },
        { month: "Квіт", count: 90 },
        { month: "Трав", count: 85 },
        { month: "Чер", count: 120 },
    ];

    const statusData = [
        { name: "Approved", value: 50 },
        { name: "Rejected", value: 10 },
        { name: "Pending", value: 20 },
        { name: "Finished", value: 30 },
    ];

    const COLORS = ["#7C3AED", "#F87171", "#FBBF24", "#34D399"];

    return (
        <AdminLayout>
            <h1 className="text-4xl font-extrabold mb-8 text-violet-700 drop-shadow-sm">
                📊 Панель адміністратора
            </h1>

            {/* Cards */}
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
                {stats ? (
                    <>
                        <StatCard label="Користувачі" value={stats.users} />
                        <StatCard label="Автомобілі" value={stats.cars} />
                        <StatCard label="Бронювання" value={stats.bookings} />
                        <StatCard label="Штрафи" value={stats.fines} />
                    </>
                ) : (
                    <p className="col-span-4 text-gray-500">Завантаження даних...</p>
                )}
            </div>

            {/* Charts */}
            <div className="grid lg:grid-cols-2 gap-10">
                <GradientCard hoverEffect={true}>
                    <h2 className="text-xl font-semibold mb-4 text-violet-700">
                        Динаміка бронювань по місяцях
                    </h2>
                    <ResponsiveContainer width="100%" height={250}>
                        <LineChart data={stats?.monthlyBookings ?? []}>
                            <XAxis dataKey="month" stroke="#A78BFA" />
                            <YAxis stroke="#A78BFA" />
                            <Tooltip />
                            <Line
                                type="monotone"
                                dataKey="count"
                                stroke="#7C3AED"
                                strokeWidth={3}
                                dot={{ r: 5, fill: "#7C3AED" }}
                            />
                        </LineChart>
                    </ResponsiveContainer>

                </GradientCard>

                <GradientCard hoverEffect={true}>
                    <h2 className="text-xl font-semibold mb-4 text-violet-700">
                        Статуси бронювань
                    </h2>
                    <ResponsiveContainer width="100%" height={250}>
                        <PieChart>
                            <Pie
                                data={stats?.statusData ?? []}
                                dataKey="value"
                                nameKey="name"
                                innerRadius={60}
                                outerRadius={100}
                                paddingAngle={5}
                            >
                                {stats?.statusData?.map((_: { name: string; value: number }, i: number) => (
                                    <Cell key={i} fill={COLORS[i % COLORS.length]} />
                                ))}

                            </Pie>
                            <Tooltip />
                            <Legend />
                        </PieChart>
                    </ResponsiveContainer>

                </GradientCard>

            </div>

        </AdminLayout>
    );
}

function StatCard({ label, value }: { label: string; value: number }) {
    return (
        <GradientCard>
            <h3 className="text-gray-500 text-sm font-medium tracking-wide">{label}</h3>
            <p className="text-3xl font-bold text-violet-700 mt-2 drop-shadow-sm">{value}</p>
        </GradientCard>
    );
}
