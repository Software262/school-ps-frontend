import type { WebcolegiosScrapingRunResponse } from '../types';

interface WebcolegiosScrapingResultSummaryProps {
  result: WebcolegiosScrapingRunResponse | null;
}

const EMPTY_RESULT: WebcolegiosScrapingRunResponse = {
  total_estudiantes_scrapeados: 0,
  total_docentes_scrapeados: 0,
  estudiantes_insertados: 0,
  estudiantes_actualizados: 0,
  estudiantes_omitidos: 0,
  estudiantes_pendientes: 0,
  docentes_insertados: 0,
  docentes_omitidos: 0,
  errores: 0,
  detalle: [],
};

const SUMMARY_ITEMS = [
  ['total_estudiantes_scrapeados', 'Estudiantes scrapeados'],
  ['total_docentes_scrapeados', 'Docentes scrapeados'],
  ['estudiantes_insertados', 'Estudiantes insertados'],
  ['estudiantes_actualizados', 'Estudiantes actualizados'],
  ['estudiantes_omitidos', 'Estudiantes omitidos'],
  ['estudiantes_pendientes', 'Estudiantes pendientes'],
  ['docentes_insertados', 'Docentes insertados'],
  ['docentes_omitidos', 'Docentes omitidos'],
  ['errores', 'Errores'],
] as const;

export const WebcolegiosScrapingResultSummary = ({
  result,
}: WebcolegiosScrapingResultSummaryProps) => {
  const data = result ?? EMPTY_RESULT;

  return (
    <section className="webcolegios-summary-panel" aria-labelledby="webcolegios-summary-title">
      <div className="webcolegios-section-header">
        <h2 id="webcolegios-summary-title">Resumen del resultado</h2>
      </div>
      <div className="webcolegios-summary-grid">
        {SUMMARY_ITEMS.map(([key, label]) => (
          <div className="webcolegios-summary-item" key={key}>
            <span>{label}</span>
            <strong>{data[key]}</strong>
          </div>
        ))}
      </div>
    </section>
  );
};
