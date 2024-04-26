// src/hooks/useApi.ts
"use client";

import { useRouter } from "next/navigation";
import { apiFetch as apiFetchRaw } from "@/lib/api";

export const useApi = () => {
  const router = useRouter();

  const apiFetch = async (endpoint: string, options: RequestInit = {}) => {
    try {
      return await apiFetchRaw(endpoint, options);
    } catch (err: any) {
      // если 401/403 — редирект на логин
      if (err.status === 401 || err.status === 403) {
        router.replace("/login");
      }
      throw err;
    }
  };

  return { apiFetch };
};
