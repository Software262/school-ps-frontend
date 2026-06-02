import { useState } from 'react';
import { DollarSign, X } from 'lucide-react';
import type { PruebaAssignment } from '@/entities/tests/model/types';

interface PaymentModalProps {
  item: PruebaAssignment;
  onClose: () => void;
  onConfirm: (monto: number) => Promise<void>;
}

export function PaymentModal({ item, onClose, onConfirm }: PaymentModalProps) {
  const saldoPendiente = (item.valor ?? 0) - item.valor_pagado;
  const [monto, setMonto] = useState<string>(saldoPendiente.toString());
  const [loading, setLoading] = useState(false);

  const handlePay = async () => {
    const val = parseInt(monto);
    if (isNaN(val) || val <= 0) {
      alert('Ingresa un monto válido');
      return;
    }
    if (val > saldoPendiente) {
      alert('El monto no puede ser mayor al saldo pendiente');
      return;
    }

    setLoading(true);
    try {
      await onConfirm(val);
      onClose();
    } catch (e) {
      console.error(e);
      alert('Error al procesar el pago');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-md overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
          <h3 className="font-semibold text-gray-900 flex items-center gap-2">
            <DollarSign className="w-5 h-5 text-blue-600" />
            Registrar Abono
          </h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6">
          <div className="bg-blue-50 text-blue-800 p-4 rounded-lg mb-6 text-sm">
            Estudiante: <strong>{item.estudianteNombre}</strong>
            <br />
            Prueba: <strong>{item.pruebaNombre}</strong>
            <br />
            Saldo Pendiente: <strong>${saldoPendiente.toLocaleString()}</strong>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Monto a abonar ($)
            </label>
            <input
              type="number"
              value={monto}
              onChange={(e) => {
                setMonto(e.target.value);
              }}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-blue-600 outline-none transition-all"
              placeholder="Ej. 20000"
              autoFocus
            />
          </div>
        </div>

        <div className="px-6 py-4 bg-gray-50 flex justify-end gap-3 border-t border-gray-100">
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors font-medium"
          >
            Cancelar
          </button>
          <button
            onClick={() => {
              void handlePay();
            }}
            disabled={loading}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium shadow-sm disabled:opacity-50"
          >
            {loading ? 'Procesando...' : 'Confirmar Pago'}
          </button>
        </div>
      </div>
    </div>
  );
}
