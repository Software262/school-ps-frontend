import { Modal, Spinner } from '@/shared/ui';
import type { EditItemModalProps } from '../types';
import { ItemFormBody } from '@/entities/inventory/ui/ItemFormBody';
import { useEditItem } from '../hooks/useEditItem';

export const EditItemModal = ({ isOpen, item, onClose, onSuccess }: EditItemModalProps) => {
  const { fields, errors, loading, handleChange, handleSubmit } = useEditItem(item, () => {
    onSuccess();
    onClose();
  });

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Editar Instrumento" width={520}>
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
          <button type="button" className="btn btn-secondary" onClick={onClose} disabled={loading}>
            Cancelar
          </button>
          <button type="submit" className="btn btn-primary" disabled={loading}>
            {loading ? (
              <>
                <Spinner size={16} color="#fff" /> Guardando…
              </>
            ) : (
              'Guardar Cambios'
            )}
          </button>
        </div>
      </form>
    </Modal>
  );
};
