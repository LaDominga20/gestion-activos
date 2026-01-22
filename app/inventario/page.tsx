"use client";
import { useEffect, useState } from 'react';
import { supabase } from '@/app/lib/supabase'
import { InventoryItem } from '@/app/types'
import * as XLSX from 'xlsx'; // Importar librería para Excel

export default function Inventario() {
  const [items, setItems] = useState<InventoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    fetchInventory();
  }, []);

  const fetchInventory = async () => {
    const { data, error } = await supabase.from('inventory').select('*').order('created_at', { ascending: false });
    if (data) setItems(data);
    setLoading(false);
  };

  // --- 1. LÓGICA DE BÚSQUEDA ---
  const filteredItems = items.filter(item => {
    const term = searchTerm.toLowerCase();
    return (
      item.colaborador?.toLowerCase().includes(term) ||
      item.codigo?.toLowerCase().includes(term) ||
      item.modelo?.toLowerCase().includes(term) ||
      item.marca?.toLowerCase().includes(term)
    );
  });

  // --- 2. LÓGICA DE CAMBIO DE ESTADO ---
  const handleStatusChange = async (id: number, newStatus: string) => {
    const { error } = await supabase
      .from('inventory')
      .update({ estado: newStatus })
      .eq('id', id);

    if (error) {
      alert("Error al actualizar estado");
    } else {
      // Actualizar localmente para refrescar la tabla inmediatamente
      fetchInventory();
    }
  };

  // --- 3. EXPORTAR A EXCEL ---
  const handleExportExcel = () => {
    if (filteredItems.length === 0) {
      alert("No hay datos para exportar");
      return;
    }

    // Preparar datos limpios para el Excel (quitamos campos internos)
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

  return (
    <div className="p-6 max-w-full mx-auto">
      <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
        <h1 className="text-2xl font-bold text-green-800">Inventario de Dispositivos</h1>
        
        {/* Buscador y Exportar */}
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
              <th className="p-3">Estado (Cambiar)</th>
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
                  
                  {/* Dropdown para cambiar estado */}
                  <td className="p-3">
                    <select 
                        value={item.estado}
                        onChange={(e) => handleStatusChange(item.id!, e.target.value)}
                        className="text-xs border rounded p-1 bg-white"
                        style={{ minWidth: "100px" }}
                    >
                        <option value="Activo">Activo</option>
                        <option value="Prestamo">Préstamo</option>
                        <option value="Devuelto">Devuelto</option>
                        <option value="Stock">Stock</option>
                        <option value="Mantenimiento">Mantenimiento</option>
                        <option value="Baja">Baja</option>
                    </select>
                  </td>

                  <td className="p-3">
                    <button onClick={() => showSignature(item.firma || '')} className="text-blue-600 hover:underline text-xs">Ver Firma</button>
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
    </div>
  );
}