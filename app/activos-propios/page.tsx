"use client";
import { useEffect, useState } from 'react';
import type { ActivoPropio } from '@/app/types';

export default function ActivosPropios() {
  const [activos, setActivos] = useState<ActivoPropio[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [supabaseLoaded, setSupabaseLoaded] = useState(false);
  const [supabase, setSupabase] = useState<any>(null);
  const [formData, setFormData] = useState<ActivoPropio>({
    nombre: '',
    marca: '',
    tipo_dispositivo: '',
    caracteristicas: '',
    fecha_compra: '',
    ubicacion: ''
  });
  const [editing, setEditing] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
  const envInvalid = !supabaseUrl || !supabaseAnonKey || supabaseUrl.includes('placeholder') || supabaseAnonKey.includes('placeholder');

  useEffect(() => {
    if (envInvalid) {
      setLoading(false);
      return;
    }

    const initSupabase = async () => {
      const { supabase: sb } = await import('@/app/lib/supabase');
      setSupabase(sb);
      setSupabaseLoaded(true);
      fetchActivos(sb);
    };
    initSupabase();
  }, [envInvalid]);

  const fetchActivos = async (sb: any) => {
    if (envInvalid) {
      setLoading(false);
      return;
    }

    try {
      const { data, error } = await sb.from('activos_propios').select('*').order('fecha_compra', { ascending: false });
      if (error) {
        console.error('Error fetching activos:', error.message || error);
      }
      if (data) setActivos(data);
    } catch (err) {
      console.error('Error fetching activos:', err);
    }
    setLoading(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (envInvalid) {
      alert('No se puede conectar a Supabase. Revisa tus variables de entorno en .env.local.');
      return;
    }

    if (!supabase) {
      alert('Supabase aún no está listo. Recarga la página y vuelve a intentarlo.');
      return;
    }

    const payload = { ...formData } as Omit<ActivoPropio, 'id'>;

    try {
      let error = null;

      if (editing) {
        if (editingId === null) {
          alert('No se puede actualizar el activo: falta el identificador del registro.');
          return;
        }
        const result = await supabase.from('activos_propios').update(payload).eq('id', editingId);
        error = result.error;
      } else {
        const result = await supabase.from('activos_propios').insert([payload]);
        error = result.error;
      }

      if (error) {
        alert('Error al guardar el activo: ' + (error.message || JSON.stringify(error)));
      } else {
        setFormData({
          nombre: '',
          marca: '',
          tipo_dispositivo: '',
          caracteristicas: '',
          fecha_compra: '',
          ubicacion: ''
        });
        setEditing(false);
        setEditingId(null);
        fetchActivos(supabase);
      }
    } catch (err) {
      alert('Error al guardar el activo: ' + (err instanceof Error ? err.message : JSON.stringify(err)));
    }
  };

  const handleEdit = (activo: ActivoPropio) => {
    setFormData({
      nombre: activo.nombre,
      marca: activo.marca,
      tipo_dispositivo: activo.tipo_dispositivo,
      caracteristicas: activo.caracteristicas,
      fecha_compra: activo.fecha_compra,
      ubicacion: activo.ubicacion
    });
    setEditing(true);
    setEditingId(activo.id ?? null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleCancelEdit = () => {
    setFormData({
      nombre: '',
      marca: '',
      tipo_dispositivo: '',
      caracteristicas: '',
      fecha_compra: '',
      ubicacion: ''
    });
    setEditing(false);
    setEditingId(null);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const filteredActivos = activos.filter(activo => {
    const term = searchTerm.toLowerCase();
    return (
      activo.nombre.toLowerCase().includes(term) ||
      activo.marca.toLowerCase().includes(term) ||
      activo.tipo_dispositivo.toLowerCase().includes(term) ||
      activo.ubicacion.toLowerCase().includes(term)
    );
  });

  if (envInvalid) {
    return (
      <div className="p-6 max-w-xl mx-auto bg-yellow-50 border border-yellow-200 rounded shadow p-6">
        <h2 className="text-xl font-semibold text-yellow-900 mb-3">Configuración de Supabase inválida</h2>
        <p className="text-sm text-yellow-800 mb-3">
          Revisa tu archivo <code className="bg-white px-1 rounded">.env.local</code> y asegúrate de tener los valores correctos para <code className="bg-white px-1 rounded">NEXT_PUBLIC_SUPABASE_URL</code> y <code className="bg-white px-1 rounded">NEXT_PUBLIC_SUPABASE_ANON_KEY</code>.
        </p>
        <p className="text-sm text-yellow-800">
          Actualmente estás usando valores de ejemplo o faltan variables. Después de corregirlos, reinicia el servidor de desarrollo.
        </p>
      </div>
    );
  }

  if (!supabaseLoaded) {
    return <div className="p-6">Cargando...</div>;
  }

  return (
    <div className="p-6 max-w-full mx-auto">
      <h1 className="text-2xl font-bold text-green-800 mb-6">Activos Propios</h1>

      {/* Formulario */}
      <form onSubmit={handleSubmit} className="bg-white p-6 rounded shadow mb-6">
        <h2 className="text-xl font-semibold mb-4">{editing ? 'Editar Activo' : 'Registrar Nuevo Activo'}</h2>
        {editing && (
          <p className="text-sm text-blue-700 mb-4">Editando activo {editingId ? `#${editingId}` : '(id no disponible)'}. Cambia los datos y guarda.</p>
        )}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input
            type="text"
            name="nombre"
            placeholder="Nombre del dispositivo"
            value={formData.nombre}
            onChange={handleChange}
            className="border rounded p-2"
            required
          />
          <input
            type="text"
            name="marca"
            placeholder="Marca"
            value={formData.marca}
            onChange={handleChange}
            className="border rounded p-2"
            required
          />
          <input
            type="text"
            name="tipo_dispositivo"
            placeholder="Tipo de dispositivo (ej: Monitor, Teclado, etc.)"
            value={formData.tipo_dispositivo}
            onChange={handleChange}
            className="border rounded p-2"
            required
          />
          <input
            type="date"
            name="fecha_compra"
            value={formData.fecha_compra}
            onChange={handleChange}
            className="border rounded p-2"
            required
          />
          <input
            type="text"
            name="ubicacion"
            placeholder="Ubicación (Oficina, Tienda, Planta, etc.)"
            value={formData.ubicacion}
            onChange={handleChange}
            className="border rounded p-2"
            required
          />
          <textarea
            name="caracteristicas"
            placeholder="Características (color, especificaciones, etc.)"
            value={formData.caracteristicas}
            onChange={handleChange}
            className="border rounded p-2 md:col-span-2"
            rows={3}
            required
          />
        </div>
        <div className="flex flex-col sm:flex-row gap-3 mt-4">
          <button 
            type="submit" 
            className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 font-semibold transition"
          >
            {editing ? '✓ Actualizar Activo' : '✓ Guardar Activo'}
          </button>
          {editing && (
            <button
              type="button"
              onClick={handleCancelEdit}
              className="bg-gray-200 text-gray-800 px-4 py-2 rounded hover:bg-gray-300 font-semibold transition"
            >
              Cancelar edición
            </button>
          )}
        </div>
      </form>

      {/* Buscador */}
      <div className="mb-4">
        <input
          type="text"
          placeholder="🔍 Buscar por nombre, marca, tipo o ubicación"
          className="border rounded p-2 w-full md:w-96"
          value={searchTerm}
          onChange={e => setSearchTerm(e.target.value)}
        />
        <p className="text-sm text-gray-600 mt-1">
          {filteredActivos.length} activo{filteredActivos.length !== 1 ? 's' : ''} encontrado{filteredActivos.length !== 1 ? 's' : ''}
        </p>
      </div>

      {/* Lista de Activos */}
      <div className="bg-white rounded shadow overflow-x-auto">
        {filteredActivos.length === 0 ? (
          <div className="p-6 text-center text-gray-500">
            No hay activos registrados
          </div>
        ) : (
          <table className="min-w-full">
            <thead className="bg-green-50 border-b">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-semibold text-green-800 uppercase tracking-wider">Nombre</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-green-800 uppercase tracking-wider">Marca</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-green-800 uppercase tracking-wider">Tipo</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-green-800 uppercase tracking-wider">Características</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-green-800 uppercase tracking-wider">Fecha Compra</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-green-800 uppercase tracking-wider">Ubicación</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-green-800 uppercase tracking-wider">Acción</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredActivos.map((activo, index) => (
                <tr key={activo.id || index} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap font-medium">{activo.nombre}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{activo.marca}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">{activo.tipo_dispositivo}</td>
                  <td className="px-6 py-4 text-sm">{activo.caracteristicas}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">{new Date(activo.fecha_compra).toLocaleDateString('es-PE')}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">{activo.ubicacion}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <button
                      type="button"
                      onClick={() => handleEdit(activo)}
                      className="text-blue-600 hover:text-blue-800 font-semibold"
                    >
                      Editar
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}