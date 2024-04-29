import { ReactNode } from "react";

interface GradientCardProps {
  children: ReactNode;
  className?: string;
  hoverEffect?: boolean;
}

export default function GradientCard({
  children,
  className = "",
  hoverEffect = true,
}: GradientCardProps) {
  return (
    <div
      className={`p-6 rounded-2xl shadow-md border border-white/30 
        bg-gradient-to-br from-primary-100 to-white 
        ${hoverEffect ? "hover:from-primary-200 hover:to-white hover:shadow-xl" : ""} 
        transition-all duration-300 backdrop-blur-sm ${className}`}
    >
      {children}
    </div>
  );
}
