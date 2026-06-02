import { Modal, Spinner } from '@/shared/ui';
import { ItemFormBody } from '@/entities/inventory/ui/ItemFormBody';
import { useNewItem } from '../hooks/useNewItem';
import type { NewItemModalProps } from '../types';

export const NewItemModal = ({ isOpen, onClose, onSuccess }: NewItemModalProps) => {
  const { fields, errors, loading, handleChange, handleSubmit, reset } = useNewItem(() => {
    onSuccess();
    onClose();
  });

  const handleClose = () => {
    reset();
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title="Nuevo Instrumento" width={520}>
      <form
        className="item-form"
        onSubmit={(e) => {
          e.preventDefault();
          void handleSubmit();
        }}
        noValidate
      >
        {errors.general && <div className="alert alert-error">{errors.general}</div>}

        <ItemFormBody fields={fields} errors={errors} onChange={handleChange} />

        <div className="form-actions">
          <button
            type="button"
            className="btn btn-secondary"
            onClick={handleClose}
            disabled={loading}
          >
            Cancelar
          </button>
          <button type="submit" className="btn btn-primary" disabled={loading}>
            {loading ? (
              <>
                <Spinner size={16} color="#fff" /> Guardando…
              </>
            ) : (
              'Crear Instrumento'
            )}
          </button>
        </div>
      </form>
    </Modal>
  );
};
