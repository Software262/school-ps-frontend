import { env } from '@shared/config';

export const exportCafeteriaReport = async (periodoId: number): Promise<Blob> => {
  const response = await fetch(`${env.baseApi}/cafeteria/export/${String(periodoId)}`);
  if (!response.ok) throw new Error('Error al generar el reporte CSV');
  return response.blob();
};
