export interface ComplementarioPupitre {
  id: number;
  nombre: string;
  valor: number;
  anio: number;
}

export interface ComplementarioPupitreResponse {
  statusCode: number;
  data: ComplementarioPupitre;
  message: string;
}
