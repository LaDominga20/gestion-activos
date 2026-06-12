"use client";
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/app/lib/supabase'
import { InventoryItem, AssetStatus } from '@/app/types'
import { useAuth } from '@/app/hooks/useAuth';
import * as XLSX from 'xlsx';

export default function Inventario() {
  const router = useRouter();
  const { user, loading: authLoading, isAdmin } = useAuth();
  const [items, setItems] = useState<InventoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedItem, setSelectedItem] = useState<InventoryItem | null>(null);
  const [editData, setEditData] = useState<InventoryItem | null>(null);
  const [saving, setSaving] = useState(false);

  const estatusOptions: AssetStatus[] = ['Disponible', 'Asignado', 'Mantenimiento', 'Baja'];

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/login');
    }
  }, [authLoading, user, router]);

  useEffect(() => {
    if (user) {
      fetchInventory();
    }
  }, [user]);

  const fetchInventory = async () => {
    const { data, error } = await supabase.from('inventory').select('*').order('created_at', { ascending: false });
    if (data) setItems(data);
    setLoading(false);
  };

  const filteredItems = items.filter(item => {
    const term = searchTerm.toLowerCase();
    return (
      item.colaborador?.toLowerCase().includes(term) ||
      item.codigo?.toLowerCase().includes(term) ||
      item.modelo?.toLowerCase().includes(term) ||
      item.marca?.toLowerCase().includes(term)
    );
  });

  const handleStatusChange = async (id: number, newStatus: string) => {
    const { error } = await supabase
      .from('inventory')
      .update({ estado: newStatus })
      .eq('id', id);

    if (error) {
      alert("Error al actualizar estado");
    } else {
      fetchInventory();
    }
  };

  const openEditModal = (item: InventoryItem) => {
    setSelectedItem(item);
    setEditData({ ...item });
    setShowEditModal(true);
  };

  const handleSaveEdit = async () => {
    if (!editData || !editData.id) return;

    setSaving(true);
    try {
      const { error } = await supabase
        .from('inventory')
        .update({
          empresa: editData.empresa,
          colaborador: editData.colaborador,
          gerencia: editData.gerencia,
          area: editData.area,
          puesto: editData.puesto,
          codigo: editData.codigo,
          modelo: editData.modelo,
          marca: editData.marca,
          procesador: editData.procesador,
          descripcion: editData.descripcion,
          correlativo_interno: editData.correlativo_interno,
          valor_sin_igv: editData.valor_sin_igv,
          valor_con_igv: editData.valor_con_igv,
          tarifa: editData.tarifa,
          proveedor: editData.proveedor,
          sujeto_a: editData.sujeto_a,
          estado: editData.estado,
          fecha_inicio: editData.fecha_inicio,
          fecha_fin: editData.fecha_fin,
          situacion_contrato: editData.situacion_contrato,
        })
        .eq('id', editData.id);

      if (error) {
        alert("Error al guardar cambios: " + error.message);
      } else {
        alert("Registro actualizado exitosamente");
        fetchInventory();
        setShowEditModal(false);
        setSelectedItem(null);
        setEditData(null);
      }
    } finally {
      setSaving(false);
    }
  };

  const handleExportExcel = () => {
    if (filteredItems.length === 0) {
      alert("No hay datos para exportar");
      return;
    }

    const dataToExport = filteredItems.map((item, index) => ({
      "#": index + 1,
      Empresa: item.empresa,
      Código: item.codigo,
      Colaborador: item.colaborador,
      Área: item.area,
      Modelo: item.modelo,
      Marca: item.marca,
      "Valor IGV": item.valor_con_igv,
      Estado: item.estado,
      "Fecha Inicio": item.fecha_inicio,
    }));

    const ws = XLSX.utils.json_to_sheet(dataToExport);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Inventario");
    XLSX.writeFile(wb, "Reporte_Inventario.xlsx");
  };

  const showSignature = (sig: string) => {
    const win = window.open("", "Firma");
    win?.document.write(`<img src="${sig}" />`);
  };

  if (authLoading || !user) {
    return <div className="p-6 text-center">Cargando...</div>;
  }

  return (
    <div className="p-6 max-w-full mx-auto">
      <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
        <div>
          <h1 className="text-2xl font-bold text-green-800">Inventario de Dispositivos</h1>
          <p className="text-sm text-gray-600 mt-1">Rol: {user.role === 'admin' ? '👨‍💼 Administrador' : '👁️ Lectura'}</p>
        </div>
        
        <div className="flex gap-2 w-full md:w-auto">
            <input 
                type="text" 
                placeholder="Buscar por código, usuario..." 
                className="border rounded p-2 flex-1 md:w-64"
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
            />
            <button 
                onClick={handleExportExcel}
                className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 font-bold whitespace-nowrap"
            >
                📥 Exportar Excel
            </button>
        </div>
      </div>

      <div className="bg-white rounded shadow overflow-x-auto">
        <table className="w-full text-sm text-left">
          <thead className="bg-green-700 text-white">
            <tr>
              <th className="p-3">Empresa</th>
              <th className="p-3">Código</th>
              <th className="p-3">Colaborador</th>
              <th className="p-3">Área</th>
              <th className="p-3">Modelo</th>
              <th className="p-3">Valor</th>
              <th className="p-3">Estado</th>
              <th className="p-3">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {loading ? <tr><td colSpan={8} className="p-4 text-center">Cargando...</td></tr> : 
              filteredItems.map(item => (
                <tr key={item.id} className="border-b hover:bg-gray-50">
                  <td className="p-3 font-bold">{item.empresa}</td>
                  <td className="p-3">{item.codigo}</td>
                  <td className="p-3">{item.colaborador}</td>
                  <td className="p-3">{item.area}</td>
                  <td className="p-3">{item.marca} {item.modelo}</td>
                  <td className="p-3">${item.valor_con_igv}</td>
                  
                  <td className="p-3">
                    {isAdmin() ? (
                      <select 
                          value={item.estado}
                          onChange={(e) => handleStatusChange(item.id!, e.target.value)}
                          className="text-xs border rounded p-1 bg-white"
                          style={{ minWidth: "100px" }}
                      >
                          <option value="Disponible">Disponible</option>
                          <option value="Asignado">Asignado</option>
                          <option value="Mantenimiento">Mantenimiento</option>
                          <option value="Baja">Baja</option>
                      </select>
                    ) : (
                      <span className="inline-block px-2 py-1 bg-blue-100 text-blue-800 rounded text-xs">
                        {item.estado}
                      </span>
                    )}
                  </td>

                  <td className="p-3 flex gap-2">
                    {isAdmin() && (
                      <button 
                        onClick={() => openEditModal(item)}
                        className="text-green-600 hover:text-green-800 hover:underline text-xs font-bold"
                      >
                        ✏️ Editar
                      </button>
                    )}
                    <button 
                      onClick={() => showSignature(item.firma || '')} 
                      className="text-blue-600 hover:underline text-xs"
                    >
                      📝 Ver Firma
                    </button>
                  </td>
                </tr>
              ))
            }
            {filteredItems.length === 0 && !loading && (
                <tr><td colSpan={8} className="p-4 text-center text-gray-500">No se encontraron resultados</td></tr>
            )}
          </tbody>
        </table>
      </div>

      {/* MODAL DE EDICIÓN */}
      {showEditModal && editData && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded shadow-lg max-w-2xl w-full max-h-96 overflow-y-auto">
            <div className="p-6">
              <h2 className="text-xl font-bold text-green-800 mb-4">Editar Registro #{editData.id}</h2>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Empresa</label>
                  <input 
                    type="text" 
                    className="w-full border rounded p-2"
                    value={editData.empresa}
                    onChange={(e) => setEditData({...editData, empresa: e.target.value})}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Código</label>
                  <input 
                    type="text" 
                    className="w-full border rounded p-2"
                    value={editData.codigo}
                    onChange={(e) => setEditData({...editData, codigo: e.target.value})}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Colaborador</label>
                  <input 
                    type="text" 
                    className="w-full border rounded p-2"
                    value={editData.colaborador}
                    onChange={(e) => setEditData({...editData, colaborador: e.target.value})}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Área</label>
                  <input 
                    type="text" 
                    className="w-full border rounded p-2"
                    value={editData.area}
                    onChange={(e) => setEditData({...editData, area: e.target.value})}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Marca</label>
                  <input 
                    type="text" 
                    className="w-full border rounded p-2"
                    value={editData.marca}
                    onChange={(e) => setEditData({...editData, marca: e.target.value})}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Modelo</label>
                  <input 
                    type="text" 
                    className="w-full border rounded p-2"
                    value={editData.modelo}
                    onChange={(e) => setEditData({...editData, modelo: e.target.value})}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Estado</label>
                  <select 
                    className="w-full border rounded p-2"
                    value={editData.estado}
                    onChange={(e) => setEditData({...editData, estado: e.target.value as AssetStatus})}
                  >
                    {estatusOptions.map(status => (
                      <option key={status} value={status}>{status}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Valor con IGV</label>
                  <input 
                    type="number" 
                    className="w-full border rounded p-2"
                    value={editData.valor_con_igv || ''}
                    onChange={(e) => setEditData({...editData, valor_con_igv: parseFloat(e.target.value)})}
                  />
                </div>
              </div>

              <div className="mt-6 flex gap-2 justify-end">
                <button 
                  onClick={() => {
                    setShowEditModal(false);
                    setSelectedItem(null);
                    setEditData(null);
                  }}
                  className="px-4 py-2 border rounded hover:bg-gray-50"
                >
                  Cancelar
                </button>
                <button 
                  onClick={handleSaveEdit}
                  disabled={saving}
                  className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 disabled:opacity-50"
                >
                  {saving ? "Guardando..." : "💾 Guardar"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}