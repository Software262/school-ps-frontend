import { Modal, Spinner } from '@/shared/ui';
import { Button } from '@/shared/ui/atoms/Button';
import { ItemFormBody } from '@/entities/inventory/ui/ItemFormBody';
import { useNewSportItem } from '../hooks/useNewSportItem';
import type { NewSportItemModalProps } from '../types';

export const NewSportItemModal = ({ isOpen, onClose, onSuccess }: NewSportItemModalProps) => {
  const { fields, errors, loading, handleChange, handleSubmit, reset } = useNewSportItem(() => {
    onSuccess();
    onClose();
  });

  const handleClose = () => {
    reset();
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title="Nuevo Equipo Deportivo" width={520}>
      <form
        className="item-form"
        onSubmit={(e) => {
          e.preventDefault();
          void handleSubmit();
        }}
        noValidate
      >
        {errors.general && <div className="alert alert-error">{errors.general}</div>}

        <ItemFormBody fields={fields} errors={errors} onChange={handleChange} variant="sport" />

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
              'Crear Equipo'
            )}
          </Button>
        </div>
      </form>
    </Modal>
  );
};
