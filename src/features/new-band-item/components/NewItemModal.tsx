import { Modal, Spinner } from '@/shared/ui';
import { Button } from '@/shared/ui/atoms/Button';
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

        <ItemFormBody fields={fields} errors={errors} onChange={handleChange} variant="band" />

        <div className="form-actions">
          <Button type="button" variant="secondary" onClick={handleClose} disabled={loading}>
            Cancelar
          </Button>
          <Button type="submit" variant="primary" disabled={loading}>
            {loading ? (
              <>
                <Spinner size={16} color="#fff" /> Guardando…
              </>
            ) : (
              'Crear Instrumento'
            )}
          </Button>
        </div>
      </form>
    </Modal>
  );
};
