import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import Link from 'next/link';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Gestión TI - Panalia / Propasac / Pastired',
  description: 'Sistema de Inventario y Trazabilidad',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es">
      <body className={inter.className + " bg-gray-100 text-gray-900"}>
        <div className="flex min-h-screen">
          <aside className="w-64 bg-white shadow-md hidden md:block">
            <div className="p-6 border-b">
                <h2 className="text-xl font-bold text-green-800">TI GESTIÓN</h2>
            </div>
            <nav className="p-4">
                <Link href="/" className="block py-2 px-4 mb-2 hover:bg-green-50 rounded text-gray-700">📊 Dashboard</Link>
                <Link href="/inventario" className="block py-2 px-4 mb-2 hover:bg-green-50 rounded text-gray-700">📦 Inventario</Link>
                <Link href="/activos-propios" className="block py-2 px-4 mb-2 hover:bg-green-50 rounded text-gray-700">🏢 Activos Propios</Link>
                <Link href="/registrar" className="block py-2 px-4 mb-2 hover:bg-green-50 rounded text-gray-700">➕ Registrar</Link>
            </nav>
          </aside>
          <main className="flex-1 overflow-auto">
            {children}
          </main>
        </div>
      </body>
    </html>
  );
}