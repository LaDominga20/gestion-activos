export type AssetStatus = 'Disponible' | 'Asignado' | 'Mantenimiento' | 'Baja';
export type ContractStatus = 'Vigente' | 'Vencido' | 'Por Vencer' | 'Pendiente';
export type UserRole = 'admin' | 'viewer';

export interface User {
  id: string;
  email: string;
  full_name?: string;
  role: UserRole;
  created_at?: string;
}

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
  created_by?: string;
  created_by_name?: string;
  created_at?: string;
  updated_at?: string;
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
