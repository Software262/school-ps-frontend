import { useState } from 'react';
import { ChevronLeft, ClipboardList, User } from 'lucide-react';
import type { GeneralStudent } from '@/features/cafeteria/model/types';
import '@/features/cafeteria/components/CafeteriaList.css';

interface Props {
  student: GeneralStudent;
  onSave: (obs: string) => Promise<void>;
  onCancel: () => void;
}

export const AddDebtView = ({ student, onSave, onCancel }: Props) => {
  const [obs, setObs] = useState('');

  return (
    <div className="cafeteria-page">
      <header className="page-header">
        <div className="header-add-nav">
          <button className="btn-back-left" onClick={onCancel}>
            <ChevronLeft size={20} /> Volver
          </button>
          <h1>Módulo de Cafetería</h1>
        </div>
        <p>Asignar estado administrativo de deuda</p>
      </header>

      <div className="management-card">
        <div className="student-profile">
          <div className="avatar-circle">
            <User size={32} />
          </div>
          <div className="student-details">
            <h2>{student.nombre}</h2>
            <div className="badge-row">
              <span className="info-tag">CC: {student.documento}</span>
              <span className="info-tag">Grado: {student.grado ?? 'N/A'}</span>
              <span className="badge bg-red">Estado: Pendiente</span>
            </div>
          </div>
        </div>
      </div>

      <div className="form-card">
        <div className="form-header">
          <ClipboardList size={20} /> <span>Registrar Nueva Observación</span>
        </div>
        <div className="form-body">
          <textarea
            className="modern-textarea"
            placeholder="Describa el motivo..."
            value={obs}
            onChange={(e) => {
              setObs(e.target.value);
            }}
          />
          <div className="form-footer">
            <button className="btn-cancel-flat" onClick={onCancel}>
              Cancelar
            </button>
            <button
              className="btn-save-main"
              onClick={() => {
                void onSave(obs);
              }}
            >
              Guardar Deuda
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
