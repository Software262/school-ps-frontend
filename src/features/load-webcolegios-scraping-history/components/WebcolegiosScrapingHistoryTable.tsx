import { LoaderCircle, Trash2 } from 'lucide-react';
import type { WebcolegiosScrapingHistoryItem } from '../types';

interface WebcolegiosScrapingHistoryTableProps {
  history: WebcolegiosScrapingHistoryItem[];
  loading: boolean;
  clearing: boolean;
  error: string | null;
  onClear: () => Promise<void> | void;
}

const formatDate = (value: string): string => {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return new Intl.DateTimeFormat('es-CO', {
    dateStyle: 'short',
    timeStyle: 'short',
  }).format(date);
};

const getStateClass = (state: string): string => {
  if (state === 'INSERTADO' || state === 'ACTUALIZADO') return 'is-success';
  if (state === 'ERROR') return 'is-error';
  if (state === 'PENDIENTE_DATOS') return 'is-pending';
  return 'is-muted';
};

const getHistoryRowKey = (item: WebcolegiosScrapingHistoryItem): string =>
  [String(item.id ?? item.documento_identidad), item.fecha_ingreso].join('-');

export const WebcolegiosScrapingHistoryTable = ({
  history,
  loading,
  clearing,
  error,
  onClear,
}: WebcolegiosScrapingHistoryTableProps) => {
  const handleClear = () => {
    const confirmed = window.confirm(
      '¿Seguro que deseas eliminar todo el historial de WebColegios?',
    );
    if (confirmed) {
      void onClear();
    }
  };

  return (
    <section className="webcolegios-history-panel" aria-labelledby="webcolegios-history-title">
      <div className="webcolegios-section-header">
        <div>
          <h2 id="webcolegios-history-title">Historial de scraping</h2>
          <p>Registros recientes reportados por el proceso de WebColegios.</p>
        </div>
        <button
          className="webcolegios-clear-button"
          disabled={loading || clearing || history.length === 0}
          onClick={handleClear}
          type="button"
        >
          {clearing ? (
            <LoaderCircle aria-hidden="true" className="webcolegios-button-icon spinning" />
          ) : (
            <Trash2 aria-hidden="true" className="webcolegios-button-icon" />
          )}
          <span>{clearing ? 'Eliminando' : 'Limpiar historial'}</span>
        </button>
      </div>

      {error && <div className="webcolegios-inline-error">{error}</div>}

      <div className="webcolegios-table-wrap">
        <table className="webcolegios-history-table">
          <thead>
            <tr>
              <th>Estado</th>
              <th>Tipo entidad</th>
              <th>Documento</th>
              <th>Observacion</th>
              <th>Fecha</th>
            </tr>
          </thead>
          <tbody>
            {loading && (
              <tr>
                <td colSpan={5}>Cargando historial...</td>
              </tr>
            )}
            {!loading && history.length === 0 && (
              <tr>
                <td colSpan={5}>Aun no hay registros de scraping.</td>
              </tr>
            )}
            {!loading &&
              history.map((item) => (
                <tr key={getHistoryRowKey(item)}>
                  <td>
                    <span className={`webcolegios-state-pill ${getStateClass(item.estado)}`}>
                      {item.estado}
                    </span>
                  </td>
                  <td>{item.tipo_entidad}</td>
                  <td>{item.documento_identidad.length > 0 ? item.documento_identidad : '-'}</td>
                  <td>{item.observacion.length > 0 ? item.observacion : '-'}</td>
                  <td>{formatDate(item.fecha_ingreso)}</td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>
    </section>
  );
};
