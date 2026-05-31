import { useState } from 'react';
import type { IncidenciaCreateRequest, TipoIncidencia } from '../model/types';
import './IncidentForm.css';

interface Props {
  onSubmit: (data: IncidenciaCreateRequest) => void;
  onCancel: () => void;
  isLoading: boolean;
}

export const IncidentForm = ({ onSubmit, onCancel, isLoading }: Props) => {
  const [formData, setFormData] = useState({
    estudiante_id: '',
    tipo_incidencia: '' as TipoIncidencia | '',
    fecha: new Date().toISOString().split('T')[0],
    descripcion: '',
  });

  return (
    <div className="incident-form-card">
      <div className="incident-form-title">
        <span className="text-2xl">🏫</span>
        <h2>Registrar Incidencia</h2>
      </div>

      <div className="incident-form-grid">
        <div>
          <label className="incident-form-label">Código Estudiante</label>
          <input
            type="number"
            className="incident-form-input"
            placeholder="Ingrese código"
            value={formData.estudiante_id}
            onChange={(e) => setFormData({...formData, estudiante_id: e.target.value})}
          />
        </div>
        <div>
          <label className="incident-form-label">Curso/Grupo</label>
          <select className="incident-form-input">
            <option>Seleccione curso</option>
            <option>10-A</option>
            <option>11-B</option>
          </select>
        </div>
        <div>
          <label className="incident-form-label">Tipo de Incidencia</label>
          <select
            className="incident-form-input"
            value={formData.tipo_incidencia}
            onChange={(e) => setFormData({...formData, tipo_incidencia: e.target.value as TipoIncidencia})}
          >
            <option value="">Seleccione tipo</option>
            <option value="danio_material">Daño Material</option>
            <option value="indisciplina">Indisciplina</option>
            <option value="inasistencia">Inasistencia</option>
          </select>
        </div>
        <div>
          <label className="incident-form-label">Fecha</label>
          <input
            type="date"
            className="incident-form-input"
            value={formData.fecha}
            onChange={(e) => setFormData({...formData, fecha: e.target.value})}
          />
        </div>
      </div>

      <div className="mb-6">
        <label className="incident-form-label">Descripción</label>
        <textarea
          rows={4}
          className="incident-form-input"
          placeholder="Describa la incidencia..."
          value={formData.descripcion}
          onChange={(e) => setFormData({...formData, descripcion: e.target.value})}
        />
      </div>

      <div className="incident-form-actions">
        <button onClick={onCancel} className="btn-cancel">Cancelar</button>
        <button
          disabled={isLoading}
          onClick={() => onSubmit({
            estudiante_id: Number(formData.estudiante_id),
            tipo_incidencia: formData.tipo_incidencia as TipoIncidencia,
            descripcion: formData.descripcion,
            fecha: new Date(formData.fecha).toISOString()
          })}
          className="btn-primary"
        >
          {isLoading ? 'Registrando...' : 'Registrar'}
        </button>
      </div>
    </div>
  );
};