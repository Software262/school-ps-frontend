import { useEffect, useState } from 'react';
import { useClassroomHolder } from '../hooks/useClassroomHolder';
import { RestrictedAlert } from '../components/RestrictedAlert';
import { IncidentForm } from '../components/IncidentForm';
import { IncidentTable } from '../components/IncidentTable';
import './ClassroomHolderPage.css';

export const ClassroomHolderPage = () => {
  const [showForm, setShowForm] = useState(false);
  const { incidencias, pazYSalvoStatus, isLoading, registrarIncidencia, resolverIncidencia, buscarEstudiante } = useClassroomHolder();

  useEffect(() => { void buscarEstudiante(1); }, []);

  return (
    <div className="chp-root">
      <header className="chp-header">
        <div>
          <h1 className="chp-title">Salón Titular</h1>
          <p className="chp-subtitle">Registro de incidencias</p>
        </div>
        {!showForm && (
          <button onClick={() => setShowForm(true)} className="btn-new-incident">
            + Nueva Incidencia
          </button>
        )}
      </header>

      <div className="space-y-4">
        <RestrictedAlert />

        {pazYSalvoStatus && (
          <div className={pazYSalvoStatus.cumple_paz_y_salvo ? 'paz-salvo-banner--ok' : 'paz-salvo-banner--fail'}>
            <div className="flex items-center">
              <span className="text-2xl mr-4">{pazYSalvoStatus.cumple_paz_y_salvo ? '✅' : '⚠️'}</span>
              <div>
                <p className="paz-salvo-label">Estado Paz y Salvo</p>
                <p className="paz-salvo-message">{pazYSalvoStatus.mensaje}</p>
              </div>
            </div>
          </div>
        )}
      </div>

      {showForm ? (
        <IncidentForm 
          onSubmit={async (data) => { await registrarIncidencia(data); setShowForm(false); }} 
          onCancel={() => setShowForm(false)} 
          isLoading={isLoading} 
        />
      ) : (
        <IncidentTable 
          incidencias={incidencias} 
          onResolve={(id) => resolverIncidencia(id, 1)} 
        />
      )}
    </div>
  );
};