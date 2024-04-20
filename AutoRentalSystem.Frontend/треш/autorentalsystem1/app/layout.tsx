import "./globals.css";
import Navbar from "@/components/Navbar";

export const metadata = {
  title: "AutoRentalSystem",
  description: "Сервис аренды автомобилей",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ru">
      <body className="bg-gray-50 min-h-screen font-sans text-gray-800">
        <Navbar />
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          {children}
        </main>
      </body>
    </html>
  );
}
