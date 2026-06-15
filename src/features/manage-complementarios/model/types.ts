export interface TipoComplementario {
  id: number;
  nombre: string;
  estado: boolean;
  sub_tipo_complementario: number | null;
  padre_nombre: string | null;
}

export interface CreateTipoComplementarioRequest {
  nombre: string;
  sub_tipo_complementario?: number | null;
}

export interface UpdateTipoComplementarioRequest {
  nombre?: string;
  estado?: boolean;
  sub_tipo_complementario?: number | null;
}

export interface Complementario {
  id: number;
  nombre: string;
  anio: number;
  valor: number;
  estado_complemento: string;
  tipo_complementario_id: number;
  tipo_complementario_nombre: string;
}

export interface CreateComplementarioRequest {
  nombre: string;
  anio: number;
  valor: number;
  estado_complemento: string;
  tipo_complementario_id: number;
}

export interface UpdateComplementarioRequest {
  nombre?: string;
  anio?: number;
  valor?: number;
  estado_complemento?: string;
  tipo_complementario_id?: number;
}
