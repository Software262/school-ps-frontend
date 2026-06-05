import { useEffect, useCallback, type ReactNode } from 'react';
import './Modal.css';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
  width?: number;
}

export const Modal = ({ isOpen, onClose, title, children, width = 480 }: ModalProps) => {
  const handleEsc = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    },
    [onClose],
  );

  useEffect(() => {
    if (isOpen) {
      document.addEventListener('keydown', handleEsc);
      document.body.style.overflow = 'hidden';
    }
    return () => {
      document.removeEventListener('keydown', handleEsc);
      document.body.style.overflow = '';
    };
  }, [isOpen, handleEsc]);

  if (!isOpen) return null;

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div
        className="modal-panel"
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
        onClick={(e) => {
          e.stopPropagation();
        }}
        style={{ maxWidth: width }}
      >
        <div className="modal-header">
          <h3 id="modal-title" className="modal-title">
            {title}
          </h3>
          <button className="modal-close" onClick={onClose} aria-label="Cerrar">
            ✕
          </button>
        </div>
        <div className="modal-body">{children}</div>
      </div>
    </div>
  );
};
