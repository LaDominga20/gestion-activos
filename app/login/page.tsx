"use client";
import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/app/hooks/useAuth';

export default function Login() {
  const router = useRouter();
  const { login, user, loading: authLoading, error: authError } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (!authLoading && user) {
      if (typeof window !== 'undefined') {
        window.location.href = '/';
      } else {
        router.push('/');
      }
    }
  }, [authLoading, user, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);

    if (!email || !password) {
      setError("Por favor completa todos los campos");
      setIsSubmitting(false);
      return;
    }

    const result = await login(email, password);
    setIsSubmitting(false);

    if (result === true) {
      if (typeof window !== 'undefined') {
        window.location.href = '/';
      } else {
        router.push('/');
      }
    } else {
      // `result` contiene el mensaje de error devuelto por `login`
      setError(result || authError || 'Error al iniciar sesión');
    }
  };

  // Mostrar loading mientras se verifica la sesión
  if (authLoading) {
    return <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded shadow-md">
        <p className="text-center text-gray-700">Cargando sesión...</p>
      </div>
    </div>;
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded shadow-md w-full max-w-sm">
        <h2 className="text-2xl font-bold text-center mb-2 text-green-800">Gestión TI</h2>
        <p className="text-xs text-gray-500 text-center mb-6">Panalia / Propasac / Pastired</p>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Correo Electrónico</label>
            <input 
              type="email" 
              className="w-full border rounded p-2" 
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                setError(null);
              }}
              placeholder="admin@empresa.com"
              autoFocus
              disabled={isSubmitting}
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Contraseña</label>
            <input 
              type="password" 
              className="w-full border rounded p-2" 
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                setError(null);
              }}
              placeholder="Ingresa tu contraseña"
              disabled={isSubmitting}
            />
          </div>
          
          {(error || authError) && (
            <p className="text-red-500 text-sm text-center">{error || authError}</p>
          )}

          <button 
            type="submit" 
            disabled={isSubmitting}
            className="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700 font-bold disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? "Ingresando..." : "Ingresar"}
          </button>
        </form>

        <div className="mt-6 p-3 bg-blue-50 rounded text-xs text-blue-700">
          <p className="font-bold mb-1">📧 Usuarios de Prueba:</p>
          <p><strong>Admin:</strong> admin@empresa.com / admin123</p>
          <p><strong>Viewer:</strong> viewer@empresa.com / viewer123</p>
        </div>
      </div>
    </div>
  );
}