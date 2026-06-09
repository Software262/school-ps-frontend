export interface SearchStudent {
  id: number;
  nombre: string;
  documento: string;
}

export interface SearchTeacher {
  id: number;
  nombre: string;
  documento: string;
  asignatura: string;
}

export interface ModuloStatus {
  clave: string;
  nombre: string;
  estado: 'ok' | 'error';
  detalle: string;
}

export interface StudentStatusResult {
  entidad: {
    id: number;
    nombre: string;
    documento: string;
    grado: string;
  };
  modulos: ModuloStatus[];
  total_modulos: number;
  modulos_ok: number;
  modulos_error: number;
  paz_y_salvo: boolean;
}

export interface GenerateResponse {
  id: number;
  codigo: string;
  estado_final: string;
  fecha: string;
  entidad: {
    nombre: string;
    documento: string;
    grado?: string | null;
  };
  periodo: {
    id: number;
    nombre: string;
  };
  detalles: ModuloStatus[];
}

export interface CertificateDetail {
  id: number;
  codigo: string;
  entidad_tipo: string;
  estado_final: string;
  fecha_generacion: string;
  entidad:
    | {
        id: number;
        nombre: string;
        documento: string;
      }
    | Record<string, never>;
  detalles: {
    modulo: string;
    nombre_modulo: string;
    estado: string;
    detalle: string;
  }[];
}
