import { Bot, Gauge } from 'lucide-react';
import { useState } from 'react';
import { BulkLoadPanel } from '@/features/bulk-load-webcolegios';
import {
  WebcolegiosErrorsTable,
  useLoadWebcolegiosScrapingErrors,
} from '@/features/load-webcolegios-scraping-errors';
import { WebcolegiosScrapingHistoryTable } from '@/features/load-webcolegios-scraping-history';
import { useLoadWebcolegiosScrapingHistory } from '@/features/load-webcolegios-scraping-history/hooks';
import {
  ScrapingRunPanel,
  WebcolegiosScrapingResultSummary,
  useRunWebcolegiosScraping,
} from '@/features/run-webcolegios-scraping';
import { SingleLoadPanel } from '@/features/single-load-webcolegios';
import type { WebcolegiosRobotStatus } from '@/features/webcolegios-scraping/model/types';
import './WebcolegiosScrapingPage.css';

const ROBOT_STATUS_LABELS: Record<WebcolegiosRobotStatus, string> = {
  no_connected: 'No conectado',
  connecting: 'Conectando',
  running: 'Ejecutando scraping',
  syncing: 'Sincronizando datos',
  finished: 'Finalizado',
  error: 'Error',
};

const ROBOT_STATUS_DETAIL: Record<WebcolegiosRobotStatus, string> = {
  no_connected: 'El robot está listo para iniciar una nueva conexión.',
  connecting: 'Validando conexión con la plataforma WebColegios.',
  running: 'Extrayendo estudiantes, docentes y documentos asociados.',
  syncing: 'Enviando resultados al proceso de sincronización.',
  finished: 'Proceso terminado. Revisa el resumen y el historial.',
  error: 'No fue posible completar el scraping.',
};

type WebcolegiosTab = 'scraping' | 'bulk' | 'single' | 'history' | 'errors';

const TABS: { id: WebcolegiosTab; label: string }[] = [
  { id: 'scraping', label: 'Scraping WebColegios' },
  { id: 'bulk', label: 'Carga masiva' },
  { id: 'single', label: 'Carga individual' },
  { id: 'history', label: 'Historial' },
  { id: 'errors', label: 'Errores / pendientes' },
];

export const WebcolegiosScrapingPage = () => {
  const [activeTab, setActiveTab] = useState<WebcolegiosTab>('scraping');
  const {
    history,
    status,
    loading: historyLoading,
    clearing: historyClearing,
    error: historyError,
    refetch,
    clearHistory,
  } = useLoadWebcolegiosScrapingHistory();
  const {
    errorsList,
    loading: errorsLoading,
    clearing: errorsClearing,
    error: errorsError,
    refetch: refetchErrors,
    clearErrors,
  } = useLoadWebcolegiosScrapingErrors();

  const refreshTables = async (): Promise<void> => {
    await Promise.all([refetch(), refetchErrors()]);
  };

  const handleClearHistory = async (): Promise<void> => {
    await clearHistory();
    await refetchErrors();
  };

  const handleClearErrors = async (): Promise<void> => {
    await clearErrors();
    await refetch();
  };

  const { fields, errors, loading, robotStatus, result, handleChange, run } =
    useRunWebcolegiosScraping(refreshTables);

  return (
    <div className="webcolegios-view">
      <div className="webcolegios-header">
        <h1>WebColegios — Scraping &amp; Sincronización</h1>
        <p>Conexión y sincronización de estudiantes y docentes desde WebColegios.</p>
      </div>

      <div className="webcolegios-info-band">
        <p>
          Si un estudiante no trae acudiente, se asigna N/A temporalmente. La carga masiva o
          individual permite completar el acudiente real posteriormente.
        </p>
      </div>

      <div className="webcolegios-tabs" role="tablist" aria-label="Módulo WebColegios">
        {TABS.map((tab) => (
          <button
            aria-selected={activeTab === tab.id}
            className={activeTab === tab.id ? 'is-active' : ''}
            key={tab.id}
            onClick={() => {
              setActiveTab(tab.id);
            }}
            role="tab"
            type="button"
          >
            {tab.label}
          </button>
        ))}
      </div>

      {activeTab === 'scraping' && (
        <>
          <div className="webcolegios-grid">
            <ScrapingRunPanel
              errors={errors}
              fields={fields}
              loading={loading}
              onChange={handleChange}
              onRun={run}
            />

            <section
              className={`webcolegios-robot-card status-${robotStatus}`}
              aria-labelledby="webcolegios-robot-title"
            >
              <div className="webcolegios-robot-icon">
                <Bot aria-hidden="true" />
              </div>
              <div>
                <span className="webcolegios-status-eyebrow">Estado del robot</span>
                <h2 id="webcolegios-robot-title">{ROBOT_STATUS_LABELS[robotStatus]}</h2>
                <p>{ROBOT_STATUS_DETAIL[robotStatus]}</p>
              </div>
              <div className="webcolegios-status-footer">
                <Gauge aria-hidden="true" />
                <span>Último estado backend: {status?.ultimo_estado ?? 'Sin registros'}</span>
              </div>
            </section>
          </div>

          <WebcolegiosScrapingResultSummary result={result} />
        </>
      )}

      {activeTab === 'bulk' && <BulkLoadPanel onSuccess={refreshTables} />}

      {activeTab === 'single' && <SingleLoadPanel onSuccess={refreshTables} />}

      {activeTab === 'history' && (
        <WebcolegiosScrapingHistoryTable
          clearing={historyClearing}
          error={historyError}
          history={history}
          loading={historyLoading}
          onClear={handleClearHistory}
        />
      )}

      {activeTab === 'errors' && (
        <WebcolegiosErrorsTable
          clearing={errorsClearing}
          error={errorsError}
          errorsList={errorsList}
          loading={errorsLoading}
          onClear={handleClearErrors}
        />
      )}
    </div>
  );
};
