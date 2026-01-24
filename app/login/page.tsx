"use client";
import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function Login() {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [error, setError] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // MISMA CONTRASEÑA que en el middleware
    const VALID_PASSWORD = "RRHH123.";

    if (password === VALID_PASSWORD) {
      // Crear cookie de sesión (dura 1 hora)
      document.cookie = `auth_token=${VALID_PASSWORD}; max-age=3600; path=/`;
      router.push("/");
    } else {
      setError(true);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded shadow-md w-full max-w-sm">
        <h2 className="text-2xl font-bold text-center mb-6 text-green-800">Acceso Restringido</h2>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Contraseña de Sistema</label>
            <input 
              type="password" 
              className="w-full border rounded p-2" 
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                setError(false);
              }}
              autoFocus
            />
          </div>
          
          {error && <p className="text-red-500 text-sm text-center">Contraseña incorrecta</p>}

          <button type="submit" className="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700 font-bold">
            Ingresar
          </button>
        </form>
        <p className="mt-4 text-xs text-gray-500 text-center">
          Sistema de Gestión TI - Panalia/Propasac/Pastired
        </p>
      </div>
    </div>
  );
}