"use client";
import { useEffect, useState } from 'react';
import { supabase } from '@/app/lib/supabase'
import { InventoryItem } from '@/app/types'
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from 'recharts';

export default function Dashboard() {
  const [data, setData] = useState<InventoryItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    const { data, error } = await supabase.from('inventory').select('*');
    if (data) setData(data);
    setLoading(false);
  };

  // Cálculos para dashboard
  const totalItems = data.length;
  const totalValue = data.reduce((acc, item) => acc + (item.valor_con_igv || 0), 0);
  
  // Preparar datos para gráfico Pie (Estado)
  const statusCounts = data.reduce((acc, item) => {
    acc[item.estado] = (acc[item.estado] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const chartDataStatus = Object.keys(statusCounts).map(key => ({ name: key, value: statusCounts[key] }));
  
  const COLORS = ['#2e7d32', '#f57c00', '#d32f2f', '#1976d2'];

  // --- CORRECCIÓN: Preparar datos para gráfico Barras (Empresa) ---
  const empresaChartData = Object.entries(
    data.reduce((acc, item) => {
      const key = item.empresa || 'Sin Empresa';
      acc[key] = (acc[key] || 0) + 1;
      return acc;
    }, {} as Record<string, number>)
  ).map(([name, value]) => ({ name, value }));
  // -------------------------------------------------------------

  if (loading) return <div className="p-10 text-center">Cargando Dashboard...</div>;

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      <h1 className="text-3xl font-bold text-green-800">Dashboard de Activos TI</h1>
      
      {/* Tarjetas de Resumen */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white p-6 rounded shadow border-l-4 border-green-600">
          <h3 className="text-gray-500 text-sm">Total Dispositivos</h3>
          <p className="text-4xl font-bold">{totalItems}</p>
        </div>
        <div className="bg-white p-6 rounded shadow border-l-4 border-blue-600">
          <h3 className="text-gray-500 text-sm">Inversión Total</h3>
          <p className="text-2xl font-bold">${totalValue.toLocaleString('en-US', {minimumFractionDigits:2})}</p>
        </div>
        <div className="bg-white p-6 rounded shadow border-l-4 border-orange-600">
          <h3 className="text-gray-500 text-sm">Proveedor Predominante</h3>
          <p className="text-xl font-bold">LEASING</p>
        </div>
      </div>

      {/* Gráficos */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-4 rounded shadow h-80">
          <h3 className="font-semibold mb-4">Estado de Dispositivos</h3>
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie data={chartDataStatus} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80} label>
                {chartDataStatus.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
        
        <div className="bg-white p-4 rounded shadow h-80">
            <h3 className="font-semibold mb-4">Distribución por Empresa</h3>
             {/* Usamos la variable empresaChartData para evitar errores de tipos */}
             <ResponsiveContainer width="100%" height="100%">
                <BarChart data={empresaChartData}>
                 <XAxis dataKey="name" />
                 <YAxis />
                 <Tooltip />
                 <Bar dataKey="value" fill="#2e7d32" />
               </BarChart>
            </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}