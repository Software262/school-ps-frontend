import { useEffect, useState } from 'react';
import { useNavigate } from '@tanstack/react-router';
import { ArrowLeft, Plus } from 'lucide-react';
import { IncidentForm } from '../components/IncidentForm';
import { IncidentTable } from '../components/IncidentTable';
import { RestrictedAlert } from '../components/RestrictedAlert';
import { useClassroomHolder } from '../hooks/useClassroomHolder';
import type { IncidenciaConEstudiante } from '../model/types';
import './ClassroomHolderPage.css';

const DEFAULT_STUDENT_ID = 1;

export const ClassroomHolderPage = () => {
  const navigate = useNavigate();
  const [showForm, setShowForm] = useState(false);
  const {
    incidencias,
    pazYSalvoStatus,
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
      <button
        type="button"
        className="chp-back-button"
        onClick={() => {
          void navigate({ to: '/dashboard' });
        }}
      >
        <ArrowLeft size={18} aria-hidden="true" />
        Volver
      </button>

      <header className="chp-header">
        <div>
          <h1 className="chp-title">Salón Titular</h1>
          <p className="chp-subtitle">Registro de incidencias</p>
        </div>
        {!showForm && (
          <button
            type="button"
            onClick={() => {
              setShowForm(true);
            }}
            className="btn-new-incident"
          >
            <Plus size={19} aria-hidden="true" />
            Nueva Incidencia
          </button>
        )}
      </header>

      <div className="chp-content-stack">
        <RestrictedAlert />

        {error && <div className="chp-error-banner">{error}</div>}

        {pazYSalvoStatus && (
          <div className={pazYSalvoStatus.cumple_paz_y_salvo ? 'paz-salvo-banner--ok' : 'paz-salvo-banner--fail'}>
            <p className="paz-salvo-label">Estado Paz y Salvo</p>
            <p className="paz-salvo-message">{pazYSalvoStatus.mensaje}</p>
          </div>
        )}

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
