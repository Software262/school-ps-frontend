import { Modal } from '../atoms/Modal';
import { Button } from '../atoms/Button';

interface SuccessModalProps {
  isOpen: boolean;
  mensaje: string;
  onClose: () => void;
}

export const SuccessModal = ({ isOpen, mensaje, onClose }: SuccessModalProps) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Operación exitosa" width={360}>
      <p style={{ color: '#4b5563', marginBottom: '24px', fontSize: '0.95rem' }}>{mensaje}</p>
      <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
        <Button variant="primary" style={{ backgroundColor: '#7f1d1d' }} onClick={onClose}>
          Aceptar
        </Button>
      </div>
    </Modal>
  );
};
