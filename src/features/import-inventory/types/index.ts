import type { ReactNode } from 'react';

export type TemplateFormat = 'xlsx' | 'csv';

/** Documentación de una columna esperada en el archivo de importación. */
export interface ImportColumnDoc {
  /** Nombre exacto de la columna en el csv/xlsx. Ej: "nombre". */
  name: string;
  /** Explicación de qué contiene la columna y un ejemplo. */
  description: string;
  /** Si la columna es obligatoria. Por defecto `false`. */
  required?: boolean;
}

export interface ImportRowError {
  row: number;
  nombre: string | null;
  error: string;
}

export interface ImportItemsResult {
  total: number;
  created: number;
  updated: number;
  failed: number;
  errors: ImportRowError[];
}

export interface ImportItemsApiResponse {
  statusCode: number;
  success: boolean;
  data: ImportItemsResult | null;
  message: string;
  details?: unknown;
}

export interface ImportItemsOutcome {
  result: ImportItemsResult;
  message: string;
  success: boolean;
}

export interface ImportInventoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  /** Título del modal. Ej: "Importar instrumentos". */
  title?: string;
  /** Etiqueta del módulo para los textos de ayuda. Ej: "instrumentos", "equipos". */
  itemLabel?: string;
  /**
   * Base del endpoint wrapper que restringe el tipo importado.
   * Ej: "/musical-band" (solo banda), "/sports" (solo deporte).
   * Por defecto usa el inventario genérico ("/inventory").
   */
  basePath?: string;
  /**
   * Texto introductorio propio del módulo. Explica qué se está importando.
   * Si se omite se usa una descripción genérica.
   */
  description?: ReactNode;
  /**
   * Columnas que debe contener el archivo csv/xlsx, documentadas para el módulo.
   * Si se omite se usan las columnas del inventario genérico (incluye
   * `tipo_inventario`). Banda y deporte pasan sus propias columnas, donde el
   * tipo ya está implícito en el módulo.
   */
  columns?: ImportColumnDoc[];
}
