import type { ImportColumnDoc } from './types';

/**
 * Configuración de importación masiva por módulo.
 *
 * Banda y deporte usan endpoints wrapper (`/musical-band`, `/sports`) que ya
 * fijan el `tipo_inventario`, por eso sus columnas NO incluyen esa columna.
 * El inventario genérico (`/inventory`) sí la requiere por fila.
 */
export interface ImportPreset {
  description: string;
  columns: ImportColumnDoc[];
}

const NOMBRE_COLUMN = (example: string): ImportColumnDoc => ({
  name: 'nombre',
  description: `Nombre del artículo. Ej: ${example}.`,
  required: true,
});

const CANTIDAD_COLUMN: ImportColumnDoc = {
  name: 'cantidad_total',
  description: 'Cantidad total de unidades. Número entero mayor o igual a 1.',
  required: true,
};

const OBSERVACION_COLUMN: ImportColumnDoc = {
  name: 'observacion',
  description: 'Notas o detalles adicionales del artículo. Columna opcional.',
  required: false,
};

/** Banda: el tipo de inventario ya es "banda", no se indica por fila. */
export const BAND_IMPORT_PRESET: ImportPreset = {
  description:
    'Sube un archivo .csv o .xlsx para registrar instrumentos de la banda de forma masiva. ' +
    'Cada fila representa un instrumento; el tipo de inventario ya es "banda" en este módulo, ' +
    'por lo que no debes incluir la columna tipo_inventario.',
  columns: [NOMBRE_COLUMN('Trompeta, Tambor, Clarinete'), CANTIDAD_COLUMN, OBSERVACION_COLUMN],
};

/** Deporte: el tipo de inventario ya es "deporte", no se indica por fila. */
export const SPORT_IMPORT_PRESET: ImportPreset = {
  description:
    'Sube un archivo .csv o .xlsx para registrar equipos deportivos de forma masiva. ' +
    'Cada fila representa un equipo; el tipo de inventario ya es "deporte" en este módulo, ' +
    'por lo que no debes incluir la columna tipo_inventario.',
  columns: [NOMBRE_COLUMN('Balón de fútbol, Raqueta, Conos'), CANTIDAD_COLUMN, OBSERVACION_COLUMN],
};

/** Genérico: acepta cualquier tipo, por eso requiere tipo_inventario por fila. */
export const GENERIC_IMPORT_PRESET: ImportPreset = {
  description:
    'Sube un archivo .csv o .xlsx para cargar inventario de forma masiva. Como este es el ' +
    'inventario general, cada fila debe indicar a qué tipo pertenece.',
  columns: [
    {
      name: 'tipo_inventario',
      description: 'Tipo de inventario al que pertenece la fila: banda, deporte o ajedrez.',
      required: true,
    },
    NOMBRE_COLUMN('Trompeta, Balón, Tablero de ajedrez'),
    CANTIDAD_COLUMN,
    OBSERVACION_COLUMN,
  ],
};
