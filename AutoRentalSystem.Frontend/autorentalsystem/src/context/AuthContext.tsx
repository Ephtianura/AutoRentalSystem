"use client";

import { createContext, useContext, useState, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { getUserMe } from "@/lib/api";

type AuthContextType = {
  isLoggedIn: boolean;
  setIsLoggedIn: (value: boolean) => void;
  userRole: string | null;
  setUserRole: (role: string | null) => void;
  refreshAuth: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [isLoggedIn, setIsLoggedIn] = useState<boolean | null>(null);
  const [userRole, setUserRole] = useState<string | null>(null);
  const router = useRouter();
  const pathname = usePathname();

  const refreshAuth = async () => {
    try {
      const user = await getUserMe();
      setIsLoggedIn(true);
      setUserRole(user.role || null);
    } catch (err: any) {
      if (err.status === 401) {
        setIsLoggedIn(false);
        setUserRole(null);
        router.replace("/login"); // редирект один раз для всего приложения
      } else {
        setIsLoggedIn(false);
        setUserRole(null);
      }
    }
  };

  useEffect(() => {
    refreshAuth();
  }, []);

  useEffect(() => {
    if (isLoggedIn === true && pathname === "/login") {
      router.replace("/");
    }
  }, [isLoggedIn, pathname, router]);

  if (isLoggedIn === null) {
    return (
      <div className="flex h-screen items-center justify-center text-gray-600">
        Перевірка авторизації...
      </div>
    );
  }

  return (
    <AuthContext.Provider value={{ isLoggedIn, setIsLoggedIn, userRole, setUserRole, refreshAuth }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within AuthProvider");
  return context;
};
