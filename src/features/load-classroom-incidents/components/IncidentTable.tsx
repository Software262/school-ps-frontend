import { Check, Eye, Inbox, X } from 'lucide-react';
import { useState } from 'react';
import type {
  IncidenciaConEstudiante,
  TipoIncidencia,
} from '@/features/classroom-holder/model/types';
import './IncidentTable.css';

interface Props {
  incidencias: IncidenciaConEstudiante[];
  onResolve: (incidencia: IncidenciaConEstudiante) => void;
  isLoading?: boolean;
  hasLoadedIncidents?: boolean;
}

const incidentTypeLabels: Record<TipoIncidencia, string> = {
  danio_material: 'Daño',
  otro: 'Otro',
  inasistencia: 'Inasistencia',
  indisciplina: 'Indisciplina',
};

const formatDate = (date: string): string =>
  new Intl.DateTimeFormat('es-CO', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).format(new Date(date));

export const IncidentTable = ({
  incidencias,
  onResolve,
  isLoading = false,
  hasLoadedIncidents = false,
}: Props) => {
  const [selectedIncident, setSelectedIncident] = useState<IncidenciaConEstudiante | null>(null);

  if (isLoading) {
    return (
      <div className="incident-empty-state">
        <div className="incident-empty-icon" aria-hidden="true">
          <Inbox size={34} />
        </div>
        <h3>Cargando incidencias</h3>
        <p>Estamos consultando la informacion del estudiante seleccionado.</p>
      </div>
    );
  }

  if (incidencias.length === 0) {
    return (
      <div className="incident-empty-state">
        <div className="incident-empty-icon" aria-hidden="true">
          <Inbox size={34} />
        </div>
        <h3>
          {hasLoadedIncidents ? 'No existen incidencias registradas' : 'Cargando incidencias'}
        </h3>
        <p>
          {hasLoadedIncidents
            ? 'Cuando registre una nueva incidencia, aparecera en este listado.'
            : 'Estamos preparando el listado general de incidencias.'}
        </p>
      </div>
    );
  }

  return (
    <>
      <div className="incident-table-wrapper">
        <div className="incident-table-scroll">
          <table className="incident-table">
            <thead>
              <tr>
                <th className="incident-table-th">Codigo</th>
                <th className="incident-table-th">Estudiante</th>
                <th className="incident-table-th">Curso</th>
                <th className="incident-table-th">Tipo</th>
                <th className="incident-table-th">Descripcion</th>
                <th className="incident-table-th">Fecha</th>
                <th className="incident-table-th">Estado</th>
                <th className="incident-table-th incident-table-actions-head">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {incidencias.map((incidencia) => {
                const studentName = incidencia.estudiante_nombre;

                return (
                  <tr key={incidencia.id} className="incident-table-tr">
                    <td className="incident-table-td incident-table-code">
                      {incidencia.estudiante_id}
                    </td>
                    <td className="incident-table-td incident-table-student">{studentName}</td>
                    <td className="incident-table-td">{incidencia.grado_nombre ?? 'Sin curso'}</td>
                    <td className="incident-table-td">
                      {incidentTypeLabels[incidencia.tipo_incidencia]}
                    </td>
                    <td className="incident-table-td incident-table-description">
                      {incidencia.descripcion}
                    </td>
                    <td className="incident-table-td">{formatDate(incidencia.fecha)}</td>
                    <td className="incident-table-td">
                      <span
                        className={
                          incidencia.esta_abierta
                            ? 'status-badge--pending'
                            : 'status-badge--resolved'
                        }
                      >
                        {incidencia.esta_abierta ? 'Pendiente' : 'Resuelto'}
                      </span>
                    </td>
                    <td className="incident-table-td">
                      <div className="incident-actions">
                        <button
                          type="button"
                          className="incident-action-button"
                          onClick={() => {
                            setSelectedIncident(incidencia);
                          }}
                          aria-label="Ver incidencia"
                          title="Ver incidencia"
                        >
                          <Eye size={16} aria-hidden="true" />
                        </button>
                        <button
                          type="button"
                          className="incident-action-button incident-action-button--resolve"
                          onClick={() => {
                            onResolve(incidencia);
                          }}
                          disabled={!incidencia.esta_abierta}
                          aria-label="Resolver incidencia"
                          title="Resolver incidencia"
                        >
                          <Check size={16} aria-hidden="true" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {selectedIncident && (
        <div className="incident-modal-backdrop" role="presentation">
          <section
            className="incident-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="incident-modal-title"
          >
            <div className="incident-modal-header">
              <div>
                <p className="incident-modal-eyebrow">Incidencia #{String(selectedIncident.id)}</p>
                <h2 id="incident-modal-title">Detalle de incidencia</h2>
              </div>
              <button
                type="button"
                className="incident-modal-close"
                onClick={() => {
                  setSelectedIncident(null);
                }}
                aria-label="Cerrar detalle"
              >
                <X size={18} aria-hidden="true" />
              </button>
            </div>

            <dl className="incident-detail-grid">
              <div>
                <dt>Codigo</dt>
                <dd>{selectedIncident.estudiante_id}</dd>
              </div>
              <div>
                <dt>Estudiante</dt>
                <dd>{selectedIncident.estudiante_nombre}</dd>
              </div>
              <div>
                <dt>Curso</dt>
                <dd>{selectedIncident.grado_nombre ?? 'Sin curso'}</dd>
              </div>
              <div>
                <dt>Tipo</dt>
                <dd>{incidentTypeLabels[selectedIncident.tipo_incidencia]}</dd>
              </div>
              <div>
                <dt>Fecha</dt>
                <dd>{formatDate(selectedIncident.fecha)}</dd>
              </div>
              <div>
                <dt>Estado</dt>
                <dd>{selectedIncident.esta_abierta ? 'Pendiente' : 'Resuelto'}</dd>
              </div>
              <div className="incident-detail-description">
                <dt>Descripcion</dt>
                <dd>{selectedIncident.descripcion}</dd>
              </div>
            </dl>
          </section>
        </div>
      )}
    </>
  );
};
