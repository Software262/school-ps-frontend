import { Modal, Spinner } from '@/shared/ui';
import { Button } from '@/shared/ui/atoms/Button';
import type { EditItemModalProps } from '../types';
import { EditItemFormBody } from '@/entities/inventory/ui/EditItemFormBody';
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

        <EditItemFormBody fields={fields} errors={errors} onChange={handleChange} />

        <div className="form-actions">
          <Button type="button" variant="secondary" onClick={onClose} disabled={loading}>
            Cancelar
          </Button>
          <Button type="submit" variant="primary" disabled={loading}>
            {loading ? (
              <>
                <Spinner size={16} color="#fff" /> Guardando…
              </>
            ) : (
              'Guardar Cambios'
            )}
          </Button>
        </div>
      </form>
    </Modal>
  );
};
