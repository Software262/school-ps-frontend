import { Modal, Spinner } from '@/shared/ui';
import { Button } from '@/shared/ui/atoms/Button';
import { useNewChessLoan } from '../hooks/useNewChessLoan';
import type { NewChessLoanModalProps } from '../types';
import './NewChessLoanModal.css';

export const NewChessLoanModal = ({ isOpen, item, onClose, onSuccess }: NewChessLoanModalProps) => {
  const {
    fields,
    errors,
    loading,
    studentQuery,
    studentResults,
    selectedStudent,
    searchingStudents,
    handleStudentSearch,
    handleSelectStudent,
    handleChange,
    handleSubmit,
    reset,
  } = useNewChessLoan(item as never, onSuccess, onClose);

  const handleClose = () => {
    reset();
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title="Nuevo Préstamo de Ajedrez" width={520}>
      {item && (
        <div className="modal-item-info">
          Tablero: <strong>{item.nombre}</strong>
        </div>
      )}
      <form
        className="new-chess-loan-form"
        onSubmit={(e) => {
          e.preventDefault();
          void handleSubmit();
        }}
        noValidate
      >
        {errors.general && <div className="alert alert-error">{errors.general}</div>}

        {/* Buscador de Estudiante */}
        <div className="form-group" style={{ position: 'relative' }}>
          <label className="form-label" htmlFor="ncl-estudiante">
            Estudiante <span aria-hidden="true">*</span>
          </label>
          <input
            id="ncl-estudiante"
            type="text"
            className={`form-input ${errors.estudiante_id ? 'form-input--error' : ''}`}
            placeholder="Buscar por nombre o documento..."
            value={studentQuery}
            onChange={(e) => {
              void handleStudentSearch(e.target.value);
            }}
            autoComplete="off"
          />
          {searchingStudents && <span className="field-hint">Buscando...</span>}
          {errors.estudiante_id && (
            <span className="field-error" role="alert">
              {errors.estudiante_id}
            </span>
          )}

          {studentResults.length > 0 && (
            <ul className="student-dropdown">
              {studentResults.map((s) => (
                <li
                  key={s.id}
                  className="student-dropdown-item"
                  onClick={() => {
                    handleSelectStudent(s);
                  }}
                >
                  <span className="student-name">{s.nombre}</span>
                  <span className="student-doc">{s.documento}</span>
                </li>
              ))}
            </ul>
          )}

          {selectedStudent && (
            <div className="selected-item-info">
              <span>✓</span>
              <span>
                <strong>{selectedStudent.nombre}</strong> — Doc: {selectedStudent.documento}
              </span>
            </div>
          )}
        </div>

        {/* Observación */}
        <div className="form-group">
          <label className="form-label" htmlFor="ncl-observacion">
            Observación
          </label>
          <textarea
            id="ncl-observacion"
            className="form-textarea"
            placeholder="Notas adicionales sobre el préstamo..."
            rows={3}
            value={fields.observacion}
            onChange={(e) => {
              handleChange('observacion', e.target.value);
            }}
          />
        </div>

        {/* Acciones */}
        <div className="form-actions">
          <Button type="button" variant="secondary" onClick={handleClose} disabled={loading}>
            Cancelar
          </Button>
          <Button type="submit" variant="primary" disabled={loading || !item}>
            {loading ? (
              <>
                <Spinner size={16} color="#fff" /> Guardando…
              </>
            ) : (
              'Registrar Préstamo'
            )}
          </Button>
        </div>
      </form>
    </Modal>
  );
};
