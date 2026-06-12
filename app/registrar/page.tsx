"use client";
import { useEffect, useState } from 'react';
import { supabase } from '@/app/lib/supabase'
import { InventoryItem } from '@/app/types'
import SignatureCanvas from '@/app/components/SignatureCanvas';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/app/hooks/useAuth';

const POLITICAS_EQUIPOS_TI = {
  titulo: "POLÍTICA SOBRE USO Y RESPONSABILIDAD DE EQUIPOS ASIGNADOS POR LA EMPRESA",
  contenido: [
    { s: "I. OBJETIVO", d: "Establecer las condiciones de uso, cuidado y responsabilidad de los equipos asignados por la empresa a los trabajadores para el desempeño de sus funciones, así como los lineamientos aplicables en caso de pérdida, robo o avería." },
    { s: "II. FINALIDAD", d: "Garantizar el uso adecuado y responsable de los equipos, protegiendo los activos de la empresa y estableciendo las responsabilidades del trabajador." },
    { s: "III. ALCANCE", d: "Esta política se aplica a todos los trabajadores de PASTIRED que reciben equipos de la empresa (laptops, teléfonos móviles, etc.)." },
    { s: "IV. FUNDAMENTO LEGAL", d: "Decreto Legislativo N.° 728 y Decreto Supremo N.° 003-97-TR (Ley de Productividad y Competitividad Laboral)." },
    { s: "V. DEFINICIONES CLAVE", d: "Negligencia: Falta de cuidado del trabajador. Robo: Apropiación por terceros (requiere denuncia). Hurto: Apropiación ilícita sin violencia. Caso fortuito: Evento fuera del control del trabajador. Avería: Daño que afecta el funcionamiento." },
    { s: "VI. RESPONSABLES", d: "Recursos Humanos gestiona la entrega y registro. Los Supervisores verifican el uso conforme a lineamientos. Los Trabajadores son responsables del uso exclusivo laboral y de reportar incidencias de inmediato." },
    { s: "VII. LINEAMIENTOS DE ENTREGA", d: "Todo equipo se entrega previa revisión técnica y mediante la firma de un ACTA DE ENTREGA (Anexo 01), donde el trabajador reconoce el buen estado del bien." },
    { s: "VIII. OBLIGACIONES DEL TRABAJADOR", d: "a) Uso exclusivo laboral. b) Uso diligente y responsable. c) Informar pérdida o daño de inmediato. d) No instalar software o realizar modificaciones no autorizadas." },
    { s: "IX. RESPONSABILIDAD Y FALTAS", d: "En caso de robo/hurto: Denuncia policial en menos de 24h. Si se determina negligencia, el trabajador asume el costo proporcional de reposición. El daño por desgaste natural es asumido por la empresa." },
    { s: "X. AUTORIZACIÓN DE DESCUENTO", d: "Mediante el registro de este activo, el trabajador otorga autorización expresa (Anexo 02) para efectuar descuentos en remuneración o beneficios sociales en caso de pérdida o daño por negligencia comprobada." },
    { s: "XI. DISPOSICIONES FINALES", d: "El incumplimiento de esta política es considerado falta disciplinaria grave, pudiendo acarrear sanciones desde amonestaciones hasta la terminación del contrato." }
  ],
  anexo_compromiso: "CONFORMIDAD Y COMPROMISO: Declaro haber recibido el equipo y sus accesorios en perfecto estado de funcionamiento. Me comprometo a darles un uso adecuado, exclusivamente para fines laborales, y a devolverlos en las mismas condiciones al término de mi relación laboral o cuando la empresa lo requiera."
};

export default function Registrar() {
  const router = useRouter();
  const { user, loading: authLoading, isAdmin } = useAuth();
  
  // Estado inicial - HE AGREGADO "area: ''" AQUÍ
   const [formData, setFormData] = useState<Partial<InventoryItem>>({
    area: '', 
    correlativo_interno: '', // <--- Agregar esto
    empresa: '',
    colaborador: '',
    gerencia: '',
    puesto: '',
    codigo: '',
    modelo: '',
    marca: '',
    descripcion: '', // <--- Asegurar que exista
    proveedor: 'LEASING',
    estado: 'Disponible',
    situacion_contrato: 'Vigente'
  });

  const [signature, setSignature] = useState<string | null>(null);
  const [showPolicy, setShowPolicy] = useState(false);
  const [policyAccepted, setPolicyAccepted] = useState(false);

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/login');
    }
    if (!authLoading && user && !isAdmin()) {
      router.push('/');
    }
  }, [authLoading, user, isAdmin, router]);

  const handleSubmit = async (e: React.SyntheticEvent) => {
    e.preventDefault();
    if (!signature) {
      alert("Debe firmar la política de uso.");
      return;
    }

    if (!policyAccepted) {
      alert("Debe marcar la casilla de conformidad con las políticas.");
      return;
    }

    if (!user?.id) {
      alert("No se detectó usuario autenticado. Vuelve a iniciar sesión.");
      return;
    }

    const valorSin = Number(formData.valor_sin_igv ?? 0);
    const tarifaNum = Number(formData.tarifa ?? 0);
    const valorCon = Number(formData.valor_con_igv ?? valorSin * 1.18);

    if (isNaN(valorSin) || isNaN(valorCon) || isNaN(tarifaNum)) {
      alert("Por favor ingrese valores válidos para el valor y la tarifa.");
      return;
    }

    const fechaInicio = formData.fecha_inicio || new Date().toISOString().slice(0, 10);

    const payload = {
      empresa: formData.empresa || '',
      colaborador: formData.colaborador || '',
      gerencia: formData.gerencia || '',
      area: formData.area || '',
      puesto: formData.puesto || '',
      correlativo_interno: formData.correlativo_interno || '',
      codigo: formData.codigo || '',
      modelo: formData.modelo || '',
      marca: formData.marca || '',
      procesador: formData.procesador || null,
      descripcion: formData.descripcion || null,
      proveedor: formData.proveedor || 'LEASING',
      estado: formData.estado || 'Disponible',
      situacion_contrato: formData.situacion_contrato || 'Vigente',
      valor_sin_igv: valorSin,
      valor_con_igv: valorCon,
      tarifa: tarifaNum,
      fecha_inicio: fechaInicio,
      firma: signature,
      acepto_politicas: policyAccepted,
      fecha_aceptacion_politica: new Date().toISOString(),
      // Asegúrate de que estas columnas existan en la tabla 'inventory' de Supabase
      // Si el error persiste, verifica si los nombres en la DB coinciden (ej. 'creado_por')
      created_by: user.id, 
      created_by_name: user.full_name || user.email || null,
    };

    try {
      const { data, error } = await supabase
        .from('inventory')
        .insert([payload])
        .select();

      if (error) {
        console.error("Supabase insert error:", JSON.stringify(error, null, 2));
        console.error("Insert payload:", JSON.stringify(payload, null, 2));
        alert("Error al registrar: " + (error.message || JSON.stringify(error)));
      } else {
        alert("Dispositivo registrado con éxito");
        router.push('/inventario');
      }
    } catch (err: any) {
      console.error("Exception during Supabase insert:", err);
      alert("Error al registrar: " + (err?.message || JSON.stringify(err)));
    }
  };

  if (authLoading || !user) {
    return <div className="p-6 text-center">Cargando...</div>;
  }

  if (!isAdmin()) {
    return <div className="p-6 text-center text-red-600">No tienes permiso para registrar dispositivos</div>;
  }

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
               {/* Sección Dispositivo */}
        <div>
            <h3 className="text-lg font-bold text-green-700 border-b mb-4">Información del Dispositivo</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                
                {/* NUEVO: Correlativo Interno */}
                <div>
                    <label className="block text-sm font-medium mb-1">Correlativo Interno</label>
                    <input 
                        required 
                        type="text" 
                        className="w-full border rounded p-2" 
                        placeholder="Ej: INT-2023-001"
                        value={formData.correlativo_interno}
                        onChange={e => setFormData({...formData, correlativo_interno: e.target.value})} 
                    />
                </div>

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

                {/* NUEVO / MEJORADO: Descripción (Ocupa todo el ancho) */}
                <div className="md:col-span-3">
                    <label className="block text-sm font-medium mb-1">Descripción del Dispositivo</label>
                    <textarea 
                        rows={3}
                        className="w-full border rounded p-2" 
                        placeholder="Ej: Laptop color gris, 16GB RAM, SSD de 512GB..."
                        value={formData.descripcion}
                        onChange={e => setFormData({...formData, descripcion: e.target.value})} 
                    />
                </div>
            </div>
        </div>

         {/* Sección Económica */}
        <div>
            <h3 className="text-lg font-bold text-green-700 border-b mb-4">Datos Económicos</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                    <label className="block text-sm font-medium mb-1">Valor Sin IGV</label>
                    <input
                        required
                        type="number"
                        step="0.01"
                        className="w-full border rounded p-2"
                        value={formData.valor_sin_igv ?? ''}
                        onChange={e => {
                            const valor = e.target.value;
                            const num = valor === '' ? 0 : parseFloat(valor);
                            setFormData(prev => ({
                                ...prev,
                                valor_sin_igv: valor === '' ? undefined : num,
                                valor_con_igv: num * 1.18
                            }));
                        }}
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium mb-1">Valor Con IGV</label>
                    <input
                        readOnly
                        type="text"
                        className="w-full border rounded p-2 bg-gray-100"
                        value={formData.valor_con_igv !== undefined ? formData.valor_con_igv.toFixed(2) : ''}
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium mb-1">Tarifa</label>
                    <input
                        required
                        type="number"
                        step="0.01"
                        className="w-full border rounded p-2"
                        value={formData.tarifa ?? ''}
                        onChange={e => setFormData({
                            ...formData,
                            tarifa: e.target.value === '' ? undefined : parseFloat(e.target.value),
                        })}
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
            <div className="bg-white p-6 rounded-lg w-full max-w-2xl h-[90vh] flex flex-col shadow-2xl">
                <h2 className="text-xl font-bold text-green-800 mb-2">Documento de Política Interna</h2>
                <div className="flex-1 overflow-y-auto bg-gray-50 p-6 border mb-4 text-sm rounded leading-relaxed text-gray-700">
                    <h3 className="font-bold mb-4 text-center text-base underline decoration-green-600">{POLITICAS_EQUIPOS_TI.titulo}</h3>
                    
                    {POLITICAS_EQUIPOS_TI.contenido.map((item, idx) => (
                        <p key={idx} className="mt-2">
                            <strong className="text-green-800">{item.s}:</strong> {item.d}
                        </p>
                    ))}

                    <div className="mt-6 p-4 bg-green-100 border-l-4 border-green-600 italic">
                        {POLITICAS_EQUIPOS_TI.anexo_compromiso}
                    </div>
                </div>

                <div className="mb-4 flex items-start gap-2 bg-yellow-50 p-3 rounded border border-yellow-200">
                    <input 
                        type="checkbox" 
                        id="conformidad" 
                        className="mt-1 h-4 w-4 text-green-600"
                        checked={policyAccepted}
                        onChange={(e) => setPolicyAccepted(e.target.checked)}
                    />
                    <label htmlFor="conformidad" className="text-sm text-gray-700">
                        Doy fe de haber leído las políticas y me comprometo a cumplir con las normas de cuidado y uso del equipo asignado.
                    </label>
                </div>

                <SignatureCanvas onSave={setSignature} disabled={false} />
                <div className="flex gap-2 mt-4">
                    <button onClick={() => setShowPolicy(false)} className="flex-1 bg-gray-300 py-2 rounded">Cancelar</button>
                    <button 
                        onClick={handleSubmit} 
                        disabled={!policyAccepted || !signature}
                        className={`flex-1 py-2 rounded font-bold transition-colors ${
                            policyAccepted && signature ? 'bg-green-600 text-white hover:bg-green-700' : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                        }`}
                    >
                        Confirmar Registro
                    </button>
                </div>
            </div>
        </div>
      )}
    </div>
  );
}