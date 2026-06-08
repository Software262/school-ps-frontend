import { useState } from 'react';

interface Props {
  studentName: string;
  onSave: (status: boolean, obs: string) => void;
  onCancel: () => void;
}

export const UpdateStatusModal = ({ studentName, onSave, onCancel }: Props) => {
  const [isPending, setIsPending] = useState(true);
  const [obs, setObs] = useState('');

  return (
    <div className="update-status-container">
      <h3>☕ Actualizar Estado - {studentName}</h3>
      <div className="form-group">
        <label>Estado de Deuda</label>
        <div className="status-buttons">
          <button
            className={`btn-status ${isPending ? 'active-pending' : ''}`}
            onClick={() => {
              setIsPending(true);
            }}
          >
            <span className="dot dot-black"></span> Pendiente
          </button>
          <button
            className={`btn-status ${!isPending ? 'active-cancelled' : ''}`}
            onClick={() => {
              setIsPending(false);
            }}
          >
            <span className="dot dot-gray"></span> Cancelada
          </button>
        </div>
      </div>
      <div className="form-group">
        <label>Observaciones</label>
        <textarea
          value={obs}
          onChange={(e) => {
            setObs(e.target.value);
          }}
          placeholder="Opcional"
        />
      </div>
      <div className="actions">
        <button
          className="btn-cancel"
          onClick={() => {
            onCancel();
          }}
        >
          Cancelar
        </button>
        <button
          className="btn-save"
          onClick={() => {
            onSave(!isPending, obs);
          }}
        >
          Guardar
        </button>
      </div>
    </div>
  );
};
