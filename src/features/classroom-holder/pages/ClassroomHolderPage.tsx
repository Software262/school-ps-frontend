import { useEffect, useState } from 'react';
import { ArrowLeft, Plus } from 'lucide-react';
import { IncidentForm } from '../components/IncidentForm';
import { IncidentTable } from '../components/IncidentTable';
import { useClassroomHolder } from '../hooks/useClassroomHolder';
import type { IncidenciaConEstudiante } from '../model/types';
import './ClassroomHolderPage.css';

const DEFAULT_STUDENT_ID = 1;

export const ClassroomHolderPage = () => {
  const [showForm, setShowForm] = useState(false);
  const {
    incidencias,
    isLoading,
    error,
    registrarIncidencia,
    resolverIncidencia,
    buscarEstudiante,
    cargarEstudiante,
  } = useClassroomHolder();

  useEffect(() => {
    void buscarEstudiante(DEFAULT_STUDENT_ID);
  }, []);

  const handleResolve = (incidencia: IncidenciaConEstudiante) => {
    if (!incidencia.esta_abierta) return;

    const confirmed = window.confirm('¿Está seguro de cerrar esta incidencia?');
    if (!confirmed) return;

    void resolverIncidencia(incidencia.id, incidencia.estudiante_id);
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
            <h1 className="chp-title">Salón Titular</h1>
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
        {error && <div className="chp-error-banner">{error}</div>}

        {showForm ? (
          <IncidentForm
            onSubmit={registrarIncidencia}
            onCancel={() => {
              setShowForm(false);
            }}
            onStudentLookup={cargarEstudiante}
            isLoading={isLoading}
          />
        ) : (
          <IncidentTable incidencias={incidencias} onResolve={handleResolve} />
        )}
      </div>
    </div>
  );
};