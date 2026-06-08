import { useState } from 'react';
import { ArrowLeft, Plus } from 'lucide-react';
import { useCloseClassroomIncident } from '@/features/close-classroom-incident';
import { IncidentTable, useLoadClassroomIncidents } from '@/features/load-classroom-incidents';
import { NewIncidentForm } from '@/features/new-classroom-incident';
import type { IncidenciaConEstudiante } from '@/features/classroom-holder/model/types';
import './ClassroomHolderPage.css';

export const ClassroomHolderPage = () => {
  const [showForm, setShowForm] = useState(false);
  const {
    incidents,
    loading: incidentsLoading,
    error: incidentsError,
    hasLoaded,
    refetch: refetchIncidents,
  } = useLoadClassroomIncidents();
  const {
    closeIncident,
    loading: closeLoading,
    error: closeError,
  } = useCloseClassroomIncident(refetchIncidents);

  const handleResolve = (incidencia: IncidenciaConEstudiante) => {
    if (!incidencia.esta_abierta) return;

    const confirmed = window.confirm('Esta seguro de cerrar esta incidencia?');
    if (!confirmed) return;

    void closeIncident(incidencia.id);
  };

  return (
    <div className="chp-root">
      {showForm && (
        <button
          type="button"
          className="chp-back-button"
          onClick={() => {
            setShowForm(false);
          }}
        >
          <ArrowLeft size={18} aria-hidden="true" />
          Volver
        </button>
      )}

      {!showForm && (
        <header className="chp-header">
          <div>
            <h1 className="chp-title">Salon Titular</h1>
            <p className="chp-subtitle">Registro de incidencias</p>
          </div>

          <button
            type="button"
            className="btn-new-incident"
            onClick={() => {
              setShowForm(true);
            }}
          >
            <Plus size={19} aria-hidden="true" />
            Nueva Incidencia
          </button>
        </header>
      )}

      <div className="chp-content-stack">
        {(incidentsError ?? closeError) && (
          <div className="chp-error-banner">{incidentsError ?? closeError}</div>
        )}

        {showForm ? (
          <NewIncidentForm
            onCancel={() => {
              setShowForm(false);
            }}
            onSuccess={() => {
              refetchIncidents();
              setShowForm(false);
            }}
          />
        ) : (
          <IncidentTable
            incidencias={incidents}
            onResolve={handleResolve}
            isLoading={incidentsLoading || closeLoading}
            hasLoadedIncidents={hasLoaded}
          />
        )}
      </div>
    </div>
  );
};
