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
  valor_sin_igv?: number;
  valor_con_igv?: number;
  tarifa?: number;
  proveedor?: string;
  sujeto_a?: string;
  estado: string;
  fecha_inicio: string;
  fecha_fin?: string;
  situacion_contrato: string;
  firma?: string;
}