"use client";
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/app/hooks/useAuth';

export default function Navbar() {
  const router = useRouter();
  const { user, logout, isAdmin, loading } = useAuth();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleLogout = () => {
    logout();
    router.push('/login');
  };

  if (!mounted) return null;

  if (!user) {
    return null; // No mostrar navbar si no está autenticado
  }

  return (
    <aside className="w-64 bg-white shadow-md hidden md:flex md:flex-col">
      <div className="p-6 border-b">
        <h2 className="text-xl font-bold text-green-800">TI GESTIÓN</h2>
        <p className="text-xs text-gray-600 mt-2">{user.email}</p>
        <p className="text-xs font-bold text-green-700 mt-1">
          {isAdmin() ? '👨‍💼 Admin' : '👁️ Lectura'}
        </p>
      </div>

      <nav className="p-4 flex-1">
        <Link href="/" className="block py-2 px-4 mb-2 hover:bg-green-50 rounded text-gray-700">
          📊 Dashboard
        </Link>
        <Link href="/inventario" className="block py-2 px-4 mb-2 hover:bg-green-50 rounded text-gray-700">
          📦 Inventario
        </Link>
        <Link href="/activos-propios" className="block py-2 px-4 mb-2 hover:bg-green-50 rounded text-gray-700">
          🏢 Activos Propios
        </Link>
        
        {isAdmin() && (
          <>
            <Link href="/registrar" className="block py-2 px-4 mb-2 hover:bg-green-50 rounded text-gray-700">
              ➕ Registrar
            </Link>
            <Link href="/usuarios" className="block py-2 px-4 mb-2 hover:bg-green-50 rounded text-gray-700">
              👥 Gestionar Usuarios
            </Link>
          </>
        )}
      </nav>

      <div className="p-4 border-t">
        <button
          onClick={handleLogout}
          className="w-full py-2 px-4 bg-red-600 text-white rounded hover:bg-red-700 font-bold text-sm"
        >
          🚪 Cerrar Sesión
        </button>
      </div>
    </aside>
  );
}
