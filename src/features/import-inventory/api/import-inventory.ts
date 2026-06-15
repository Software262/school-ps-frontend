import { env } from '@/shared/config';
import type { ImportItemsApiResponse, ImportItemsOutcome, TemplateFormat } from '../types';

/**
 * Base por defecto: el endpoint genérico de inventario (acepta cualquier tipo).
 * Banda y deporte pasan su propio wrapper (`/musical-band`, `/sports`) que solo
 * acepta articulos de ese tipo.
 */
const DEFAULT_BASE_PATH = '/inventory';

/**
 * Sube un archivo (csv/xlsx) al endpoint de importación masiva de `basePath`.
 *
 * El backend responde `success: false` con `data` presente cuando hay filas con
 * error pero el archivo sí se procesó: en ese caso devolvemos el resumen para
 * mostrarlo. Solo lanzamos cuando `data` es `null` (archivo inválido o vacío).
 */
export const importInventoryItems = async (
  file: File,
  basePath: string = DEFAULT_BASE_PATH,
): Promise<ImportItemsOutcome> => {
  const formData = new FormData();
  formData.append('file', file);

  const response = await fetch(`${env.baseApi}${basePath}/items/import`, {
    method: 'POST',
    body: formData,
  });

  let body: ImportItemsApiResponse | null;
  try {
    body = (await response.json()) as ImportItemsApiResponse;
  } catch {
    body = null;
  }

  if (body?.data == null) {
    throw new Error(body?.message ?? 'No se pudo importar el inventario. Intenta de nuevo.');
  }

  return { result: body.data, message: body.message, success: body.success };
};

/** Descarga la plantilla de importación de `basePath` en el formato indicado. */
export const downloadInventoryTemplate = async (
  format: TemplateFormat = 'xlsx',
  basePath: string = DEFAULT_BASE_PATH,
): Promise<void> => {
  const response = await fetch(`${env.baseApi}${basePath}/items/template?format=${format}`);

  if (!response.ok) {
    throw new Error('No se pudo descargar la plantilla.');
  }

  const blob = await response.blob();
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement('a');
  anchor.href = url;
  anchor.download = `plantilla_inventario.${format}`;
  document.body.appendChild(anchor);
  anchor.click();
  anchor.remove();
  URL.revokeObjectURL(url);
};
