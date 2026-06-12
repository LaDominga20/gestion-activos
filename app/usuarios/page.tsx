"use client";
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/app/lib/supabase';
import { useAuth } from '@/app/hooks/useAuth';
import { User } from '@/app/types';

export default function UsuariosPage() {
  const router = useRouter();
  const { user, loading: authLoading, isAdmin } = useAuth();
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [newUser, setNewUser] = useState({
    email: '',
    password: '',
    full_name: '',
    role: 'viewer' as 'admin' | 'viewer',
  });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/login');
    }
    if (!authLoading && user && !isAdmin()) {
      router.push('/');
    }
  }, [authLoading, user, isAdmin, router]);

  useEffect(() => {
    if (user && isAdmin()) {
      fetchUsers();
    }
  }, [user, isAdmin]);

  const fetchUsers = async () => {
    try {
      const { data, error: queryError } = await supabase
        .from('users')
        .select('*')
        .order('created_at', { ascending: false });

      if (queryError) throw queryError;
      setUsers(data || []);
    } catch (err: any) {
      setError('Error al cargar usuarios: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateUser = async () => {
    setError(null);
    setSuccess(null);

    if (!newUser.email || !newUser.password) {
      setError('Email y contraseña son requeridos');
      return;
    }

    if (newUser.password.length < 6) {
      setError('La contraseña debe tener al menos 6 caracteres');
      return;
    }

    setSaving(true);
    try {
      const { data, error: insertError } = await supabase
        .from('users')
        .insert([
          {
            email: newUser.email,
            password: newUser.password, // En producción, usar bcrypt
            full_name: newUser.full_name,
            role: newUser.role,
          },
        ])
        .select();

      if (insertError) throw insertError;

      setSuccess('Usuario creado exitosamente');
      setNewUser({ email: '', password: '', full_name: '', role: 'viewer' });
      setShowCreateForm(false);
      fetchUsers();
    } catch (err: any) {
      setError('Error al crear usuario: ' + err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteUser = async (userId: string) => {
    if (!confirm('¿Estás seguro de que deseas eliminar este usuario?')) return;

    try {
      const { error: deleteError } = await supabase
        .from('users')
        .delete()
        .eq('id', userId);

      if (deleteError) throw deleteError;

      setSuccess('Usuario eliminado exitosamente');
      fetchUsers();
    } catch (err: any) {
      setError('Error al eliminar usuario: ' + err.message);
    }
  };

  if (authLoading || !user) {
    return <div className="p-6 text-center">Cargando...</div>;
  }

  if (!isAdmin()) {
    return <div className="p-6 text-center text-red-600">No tienes permiso para acceder a esta página</div>;
  }

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-green-800">Gestión de Usuarios</h1>
        <button
          onClick={() => setShowCreateForm(true)}
          className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 font-bold"
        >
          ➕ Crear Usuario
        </button>
      </div>

      {error && (
        <div className="mb-4 p-4 bg-red-100 text-red-700 rounded">
          {error}
        </div>
      )}
      {success && (
        <div className="mb-4 p-4 bg-green-100 text-green-700 rounded">
          {success}
        </div>
      )}

      {/* FORMULARIO DE CREACIÓN */}
      {showCreateForm && (
        <div className="bg-white rounded shadow p-6 mb-6">
          <h2 className="text-lg font-bold mb-4">Nuevo Usuario</h2>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Correo Electrónico</label>
              <input
                type="email"
                className="w-full border rounded p-2"
                value={newUser.email}
                onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
                placeholder="usuario@empresa.com"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Contraseña</label>
              <input
                type="password"
                className="w-full border rounded p-2"
                value={newUser.password}
                onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
                placeholder="Mínimo 6 caracteres"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Nombre Completo</label>
              <input
                type="text"
                className="w-full border rounded p-2"
                value={newUser.full_name}
                onChange={(e) => setNewUser({ ...newUser, full_name: e.target.value })}
                placeholder="Nombre del usuario"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Rol</label>
              <select
                className="w-full border rounded p-2"
                value={newUser.role}
                onChange={(e) => setNewUser({ ...newUser, role: e.target.value as 'admin' | 'viewer' })}
              >
                <option value="viewer">👁️ Lectura (Viewer)</option>
                <option value="admin">👨‍💼 Administrador (Admin)</option>
              </select>
            </div>
          </div>

          <div className="mt-4 flex gap-2">
            <button
              onClick={handleCreateUser}
              disabled={saving}
              className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 disabled:opacity-50"
            >
              {saving ? 'Creando...' : '💾 Crear Usuario'}
            </button>
            <button
              onClick={() => setShowCreateForm(false)}
              className="px-4 py-2 border rounded hover:bg-gray-50"
            >
              Cancelar
            </button>
          </div>
        </div>
      )}

      {/* TABLA DE USUARIOS */}
      <div className="bg-white rounded shadow overflow-x-auto">
        <table className="w-full text-sm text-left">
          <thead className="bg-green-700 text-white">
            <tr>
              <th className="p-3">Email</th>
              <th className="p-3">Nombre Completo</th>
              <th className="p-3">Rol</th>
              <th className="p-3">Creado</th>
              <th className="p-3">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={5} className="p-4 text-center">Cargando usuarios...</td>
              </tr>
            ) : users.length === 0 ? (
              <tr>
                <td colSpan={5} className="p-4 text-center text-gray-500">No hay usuarios registrados</td>
              </tr>
            ) : (
              users.map((u) => (
                <tr key={u.id} className="border-b hover:bg-gray-50">
                  <td className="p-3 font-bold">{u.email}</td>
                  <td className="p-3">{u.full_name || '-'}</td>
                  <td className="p-3">
                    <span className={`inline-block px-2 py-1 rounded text-xs font-bold ${
                      u.role === 'admin' 
                        ? 'bg-purple-100 text-purple-800' 
                        : 'bg-blue-100 text-blue-800'
                    }`}>
                      {u.role === 'admin' ? '👨‍💼 Admin' : '👁️ Lectura'}
                    </span>
                  </td>
                  <td className="p-3 text-xs">{u.created_at ? new Date(u.created_at).toLocaleDateString('es-PE') : '-'}</td>
                  <td className="p-3">
                    <button
                      onClick={() => handleDeleteUser(u.id)}
                      className="text-red-600 hover:text-red-800 hover:underline text-xs font-bold"
                    >
                      🗑️ Eliminar
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
