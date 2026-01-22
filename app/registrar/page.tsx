"use client";
import { useEffect, useState } from 'react';
import { supabase } from '@/app/lib/supabase'
import { InventoryItem } from '@/app/types'
import SignatureCanvas from '@/app/components/SignatureCanvas';
import { useRouter } from 'next/navigation';

export default function Registrar() {
  const router = useRouter();
  
  // Estado inicial - HE AGREGADO "area: ''" AQUÍ
  const [formData, setFormData] = useState<Partial<InventoryItem>>({
    area: '', 
    empresa: '',
    colaborador: '',
    gerencia: '',
    puesto: '',
    codigo: '',
    modelo: '',
    marca: '',
    proveedor: 'LEASING',
    estado: 'Activo',
    situacion_contrato: 'Vigente'
  });

  const [signature, setSignature] = useState<string | null>(null);
  const [showPolicy, setShowPolicy] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!signature) {
      alert("Debe firmar la política de uso.");
      return;
    }

    const { error } = await supabase.from('inventory').insert([{
      ...formData,
      firma: signature,
      valor_sin_igv: Number(formData.valor_sin_igv),
      valor_con_igv: Number(formData.valor_con_igv),
      tarifa: Number(formData.tarifa)
    }]);

    if (error) {
      console.error(error);
      alert("Error al registrar");
    } else {
      alert("Dispositivo registrado con éxito");
      router.push('/inventario');
    }
  };

  // Función auxiliar para calc IGV
  const calcIGV = (val: string) => {
    const num = parseFloat(val) || 0;
    setFormData(prev => ({ ...prev, valor_con_igv: num * 1.18 }));
  };

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <h1 className="text-2xl font-bold text-green-800 mb-6">Registrar Nuevo Dispositivo</h1>
      
      <form onSubmit={handleSubmit} className="bg-white p-8 rounded-lg shadow space-y-6">
        
        {/* Sección Colaborador */}
        <div>
            <h3 className="text-lg font-bold text-green-700 border-b mb-4">Información del Colaborador</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                    <label className="block text-sm font-medium mb-1">Empresa</label>
                    <select required className="w-full border rounded p-2" 
                        value={formData.empresa}
                        onChange={e => setFormData({...formData, empresa: e.target.value})}>
                        <option value="">Seleccione...</option>
                        <option value="PANALIA">PANALIA</option>
                        <option value="PROPASAC">PROPASAC</option>
                        <option value="PASTIRED">PASTIRED</option>
                    </select>
                </div>
                <div>
                    <label className="block text-sm font-medium mb-1">Colaborador</label>
                    <input required type="text" className="w-full border rounded p-2"
                        value={formData.colaborador}
                        onChange={e => setFormData({...formData, colaborador: e.target.value})} />
                </div>
                <div>
                    <label className="block text-sm font-medium mb-1">Gerencia</label>
                    <input required type="text" className="w-full border rounded p-2"
                        value={formData.gerencia}
                        onChange={e => setFormData({...formData, gerencia: e.target.value})} />
                </div>
                
                {/* ----------------------------------------------------------------------- */}
                {/* AQUI ESTA EL CAMBIO PARA EL AREA: ES UN INPUT COMUN Y CORRIENTE */}
                {/* ----------------------------------------------------------------------- */}
                <div>
                    <label className="block text-sm font-medium mb-1">Área</label>
                    <input 
                        required 
                        type="text" 
                        className="w-full border rounded p-2 bg-yellow-50 border-yellow-200" 
                        placeholder="Escriba el área aquí..." 
                        value={formData.area}
                        onChange={e => setFormData({...formData, area: e.target.value})} 
                    />
                </div>
                {/* ----------------------------------------------------------------------- */}

                <div>
                    <label className="block text-sm font-medium mb-1">Puesto</label>
                    <input required type="text" className="w-full border rounded p-2"
                        value={formData.puesto}
                        onChange={e => setFormData({...formData, puesto: e.target.value})} />
                </div>
            </div>
        </div>

        {/* Sección Dispositivo */}
        <div>
            <h3 className="text-lg font-bold text-green-700 border-b mb-4">Información del Dispositivo</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                    <label className="block text-sm font-medium mb-1">Código</label>
                    <input required type="text" className="w-full border rounded p-2" 
                        value={formData.codigo}
                        onChange={e => setFormData({...formData, codigo: e.target.value})} />
                </div>
                <div>
                    <label className="block text-sm font-medium mb-1">Modelo</label>
                    <input required type="text" className="w-full border rounded p-2"
                        value={formData.modelo}
                        onChange={e => setFormData({...formData, modelo: e.target.value})} />
                </div>
                <div>
                    <label className="block text-sm font-medium mb-1">Marca</label>
                    <input required type="text" className="w-full border rounded p-2"
                        value={formData.marca}
                        onChange={e => setFormData({...formData, marca: e.target.value})} />
                </div>
                <div>
                    <label className="block text-sm font-medium mb-1">Procesador</label>
                    <input type="text" className="w-full border rounded p-2"
                        onChange={e => setFormData({...formData, procesador: e.target.value})} />
                </div>
            </div>
        </div>

         {/* Sección Económica */}
        <div>
            <h3 className="text-lg font-bold text-green-700 border-b mb-4">Datos Económicos</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                    <label className="block text-sm font-medium mb-1">Valor Sin IGV</label>
                    <input type="number" step="0.01" className="w-full border rounded p-2"
                        onChange={e => { 
                            const valor = e.target.value; 
                            setFormData({...formData, valor_sin_igv: parseFloat(valor)}); 
                            calcIGV(valor); 
                        }} 
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium mb-1">Valor Con IGV</label>
                    <input readOnly type="number" className="w-full border rounded p-2 bg-gray-100" 
                        value={formData.valor_con_igv ? formData.valor_con_igv.toFixed(2) : ''} 
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium mb-1">Tarifa</label>
                    <input required type="number" className="w-full border rounded p-2"
                        onChange={e => setFormData({...formData, tarifa: parseFloat(e.target.value)})} 
                    />
                </div>
            </div>
        </div>

        <button type="button" onClick={() => setShowPolicy(true)} className="w-full bg-green-600 text-white py-3 rounded hover:bg-green-700 font-bold">
            Continuar a Firma y Política
        </button>
      </form>

      {/* Modal Política */}
      {showPolicy && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 p-4">
            <div className="bg-white p-6 rounded-lg w-full max-w-lg h-[80vh] flex flex-col">
                <h2 className="text-xl font-bold text-green-800 mb-4">Política de Uso</h2>
                <div className="flex-1 overflow-y-auto bg-gray-50 p-4 border mb-4 text-sm">
                    <p><strong>1. RESPONSABILIDAD:</strong> El colaborador es responsable del equipo...</p>
                    <p className="mt-2"><strong>2. USO:</strong> Uso exclusivo empresarial...</p>
                    <p className="mt-2"><strong>3. SEGURIDAD:</strong> Mantener credenciales seguras...</p>
                </div>
                <SignatureCanvas onSave={setSignature} disabled={false} />
                <div className="flex gap-2 mt-4">
                    <button onClick={() => setShowPolicy(false)} className="flex-1 bg-gray-300 py-2 rounded">Cancelar</button>
                    <button onClick={handleSubmit} className="flex-1 bg-green-600 text-white py-2 rounded">Confirmar Registro</button>
                </div>
            </div>
        </div>
      )}
    </div>
  );
}