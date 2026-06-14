import { Modal, Spinner } from '@/shared/ui';
import { Button } from '@/shared/ui/atoms/Button';
import type { EditSportItemModalProps } from '../types';
import { EditItemFormBody } from '@/entities/inventory/ui/EditItemFormBody';
import { useEditSportItem } from '../hooks/useEditSportItem';

export const EditSportItemModal = ({
  isOpen,
  item,
  onClose,
  onSuccess,
}: EditSportItemModalProps) => {
  const { fields, errors, loading, handleChange, handleSubmit } = useEditSportItem(item, () => {
    onSuccess();
    onClose();
  });

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Editar Equipo Deportivo" width={520}>
      <form
        className="sport-item-form"
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
