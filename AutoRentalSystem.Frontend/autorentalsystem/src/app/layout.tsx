import "./globals.css";
import Navbar from "@/components/Navbar";
import { AuthProvider } from "@/context/AuthContext";

export const metadata = {
  title: "AutoRentalSystem",
  description: "Сервис аренды автомобилей",
  // icons: {
  //   icon: "/favicon.png", 
  // },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ru">
      <body className="bg-gray-100 min-h-screen">
        
        <AuthProvider>
            <div className="bg-gray-50 min-h-screen">
          <Navbar />
          <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {children}
    </main>
    </div>
        </AuthProvider>
      </body>
        
    </html>
  );
}
