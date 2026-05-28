/* eslint-disable */
import React from 'react';
import type { Teacher } from '../model/types';
import { Badge } from '../../../shared/ui/Badge';
import './TeacherCard.css';

interface TeacherCardActions {
  onCreateStatus: (teacher: Teacher) => void;
  onUpdateStatus: (teacher: Teacher) => void;
  onCreateObservation: (teacher: Teacher) => void;
}

interface TeacherCardProps extends TeacherCardActions {
  teacher: Teacher;
}

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString('es-CO', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}

export const TeacherCard: React.FC<TeacherCardProps> = ({
  teacher,
  onCreateStatus,
  onUpdateStatus,
  onCreateObservation,
}) => {
  const hasStatus = teacher.status !== null;
  const lastObs = teacher.observations[teacher.observations.length - 1] ?? null;
  const initials = teacher.nombre
    .split(' ')
    .slice(0, 2)
    .map((w) => w[0])
    .join('')
    .toUpperCase();

  return (
    <article className="teacher-card">
      {/* Avatar + Header */}
      <div className="teacher-card-header">
        <div className="teacher-avatar" aria-hidden="true">
          {initials}
        </div>
        <div className="teacher-info">
          <h4 className="teacher-name">{teacher.nombre}</h4>
          <span className="teacher-email">{teacher.correo}</span>
        </div>
        <div className="teacher-status-badge">
          {hasStatus ? (
            <Badge variant="green">✓ Paz y Salvo</Badge>
          ) : (
            <Badge variant="gray">Sin estado</Badge>
          )}
        </div>
      </div>

      {/* Status Detail */}
      {hasStatus && teacher.status && (
        <div className="teacher-status-detail">
          <span className="detail-label">Motivo:</span>
          <span className="detail-value">{teacher.status.motivo_estado}</span>
          <span className="detail-label">Actualizado:</span>
          <span className="detail-value">{formatDate(teacher.status.fecha_actualizacion)}</span>
          <span className="detail-label">Período:</span>
          <span className="detail-value">#{teacher.status.periodo_id}</span>
        </div>
      )}

      {/* Last Observation */}
      {lastObs && (
        <div className="teacher-obs-preview">
          <span className="obs-type-badge">{lastObs.tipo_observacion}</span>
          <p className="obs-desc">{lastObs.descripcion}</p>
          <span className="obs-date">{formatDate(lastObs.fecha)}</span>
        </div>
      )}

      {/* Observation count */}
      {teacher.observations.length > 0 && (
        <div className="teacher-obs-count">
          <span className="obs-count-text">
            {teacher.observations.length} observación{teacher.observations.length !== 1 ? 'es' : ''}
          </span>
        </div>
      )}

      {/* Actions */}
      <div className="teacher-card-actions">
        {!hasStatus ? (
          <button
            id={`btn-create-status-${String(teacher.id)}`}
            className="btn btn-primary btn-sm"
            onClick={() => { onCreateStatus(teacher); }}
          >
            Asignar Estado
          </button>
        ) : (
          <button
            id={`btn-update-status-${String(teacher.id)}`}
            className="btn btn-secondary btn-sm"
            onClick={() => { onUpdateStatus(teacher); }}
          >
            Actualizar Estado
          </button>
        )}
        <button
          id={`btn-create-obs-${String(teacher.id)}`}
          className="btn btn-secondary btn-sm"
          onClick={() => { onCreateObservation(teacher); }}
        >
          + Observación
        </button>
      </div>
    </article>
  );
};
