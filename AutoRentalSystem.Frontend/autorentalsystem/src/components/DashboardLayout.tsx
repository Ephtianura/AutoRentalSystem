"use client";

import { ReactNode } from "react";
import Sidebar from "@/components/Sidebar";

type DashboardLayoutProps = {
  children: ReactNode;
  noContainer?: boolean; // новый пропс
};

export default function DashboardLayout({ children, noContainer }: DashboardLayoutProps) {
  return (
    <div className="flex min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 text-gray-800">
      {/* Sidebar */}
      <Sidebar />

      {/* Content */}
      <main className="flex-1 p-6 md:p-10 overflow-y-auto transition-all duration-300">
        {noContainer ? (
          children
        ) : (
          <div className="bg-white/80 backdrop-blur-md rounded-2xl shadow-lg p-8 border border-white/20">
            {children}
          </div>
        )}
      </main>
    </div>
  );
}
