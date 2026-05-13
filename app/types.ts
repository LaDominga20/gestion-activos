export type AssetStatus = 'Disponible' | 'Asignado' | 'Mantenimiento' | 'Baja';
export type ContractStatus = 'Vigente' | 'Vencido' | 'Por Vencer' | 'Pendiente';

export interface InventoryItem {
  id?: number;
  empresa: string;
  colaborador: string;
  gerencia: string;
  area: string;
  puesto: string;
  codigo: string;
  modelo: string;
  marca: string;
  procesador?: string;
  descripcion?: string;
  correlativo_interno?: string;
  valor_sin_igv?: number;
  valor_con_igv?: number;
  tarifa?: number;
  proveedor?: string;
  sujeto_a?: string;
  estado: AssetStatus;
  fecha_inicio: string;
  fecha_fin?: string;
  situacion_contrato: ContractStatus;
  firma?: string;
}

export interface ActivoPropio {
  id?: number;
  nombre: string;
  marca: string;
  tipo_dispositivo: string;
  caracteristicas: string;
  fecha_compra: string;
  ubicacion: string;
}
