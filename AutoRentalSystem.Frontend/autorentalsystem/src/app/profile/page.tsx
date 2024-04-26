  "use client";

  import { useEffect, useState } from "react";
  import { useSearchParams, useRouter } from "next/navigation";
  import { getUserMe, getUserById } from "@/lib/api";
  import { ProfileCardUser } from "@/components/ProfileCardUser";
  import { ProfileCardAdmin } from "@/components/ProfileCardAdmin";

  type User = {
    id: number;
    userName: string;
    email: string;
    role: "User" | "Admin";
    status: "Active" | "Blocked";
    registeredAt?: string;
    phone?: string | null;
    driverLicenseNumber?: string | null;
  };

  // Мапінг полів з сервера на фронт
  const mapUser = (raw: any): User => ({
    id: raw.id,
    userName: raw.userName,
    email: raw.email,
    role: raw.role,
    status: raw.status,
    registeredAt: raw.registrationDate, // сервер присилає registrationDate
    phone: raw.phone,
    driverLicenseNumber: raw.driverLicenseNumber,
  });

  export default function ProfilePage() {
    const [user, setUser] = useState<User | null>(null);
    const [currentUser, setCurrentUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);


    const searchParams = useSearchParams();
    const router = useRouter();
    const queryId = searchParams.get("id");

    useEffect(() => {
      const fetchUser = async () => {
        setLoading(true);
        try {
          // Поточний користувач
          const meRaw = await getUserMe();
          const me = mapUser(meRaw);
          setCurrentUser(me);

          console.log("CurrentUser:", me);
          console.log("Fetching userId:", queryId);

          let data: User;

          if (queryId && me.role === "Admin") {
            const parsedId = Number(queryId);
            if (!parsedId) throw new Error("Неправильний ID користувача");
            console.log("Fetching user by ID:", parsedId);
            const userRaw = await getUserById(parsedId);
            data = mapUser(userRaw);
          } else {
            data = me;
            if (queryId && me.role !== "Admin") router.replace("/profile");
          }

          setUser(data);
        } catch (err: any) {
          console.error("Помилка при завантаженні профілю:", err);
          if (err.status === 401) router.push("/login");
          else setError(err.data?.message || err.message || "Помилка завантаження профілю");
        } finally {
          setLoading(false);
        }
      };

      fetchUser();
    }, [queryId, router]);

    if (loading)
      return (
        <div className="flex justify-center items-center h-[70vh] text-gray-500 text-lg">
          Завантаження профілю...
        </div>
      );

    if (error)
      return (
        <div className="flex justify-center items-center h-[70vh] text-red-500 text-lg">
          {error}
        </div>
      );

    if (!user) return null;

    return currentUser?.role === "Admin" ? (
      <ProfileCardAdmin user={user} />
    ) : (
      <ProfileCardUser user={user} />
    );
  }
