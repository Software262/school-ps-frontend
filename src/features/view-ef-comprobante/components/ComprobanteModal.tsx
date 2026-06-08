import { useCallback, useEffect, useState } from 'react';
import { Printer } from 'lucide-react';
import type { Enrollment, Program } from '@/features/escuelas-formacion/model/types';
import './ComprobanteModal.css';

const ESCUDO_URL = '/escudo.png';

interface ComprobanteModalProps {
  isOpen: boolean;
  onClose: () => void;
  enrollment: Enrollment | null;
  program: Program | null;
  periodoAnio: number;
}

function fmt(iso: string): string {
  return new Date(iso).toLocaleDateString('es-CO', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  });
}

function money(value: number): string {
  return `$${value.toLocaleString('es-CO')}`;
}

export const ComprobanteModal = ({
  isOpen,
  onClose,
  enrollment,
  program,
  periodoAnio,
}: ComprobanteModalProps) => {
  const [printedAt, setPrintedAt] = useState('');

  const handleEsc = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    },
    [onClose],
  );

  useEffect(() => {
    if (!isOpen) return;
    const t = setTimeout(() => {
      setPrintedAt(new Date().toLocaleString('es-CO'));
    }, 0);
    document.addEventListener('keydown', handleEsc);
    document.body.style.overflow = 'hidden';
    return () => {
      clearTimeout(t);
      document.removeEventListener('keydown', handleEsc);
      document.body.style.overflow = '';
    };
  }, [isOpen, handleEsc]);

  if (!isOpen || !enrollment || !program) return null;

  const pagado = enrollment.estado_escuela && enrollment.activo;
  const retirado = !enrollment.activo;
  const abonado = enrollment.valor_acordado - enrollment.saldo_pendiente;
  const folio = String(enrollment.id).padStart(6, '0');

  const estadoLabel = retirado
    ? 'Retirado'
    : enrollment.estado_escuela
      ? 'Paz y Salvo'
      : 'Obligación pendiente';
  const estadoClass = retirado
    ? 'comp-status-badge--gray'
    : enrollment.estado_escuela
      ? 'comp-status-badge--green'
      : 'comp-status-badge--red';

  return (
    <div className="comp-backdrop" onClick={onClose}>
      <div
        className="comp-panel"
        onClick={(e) => {
          e.stopPropagation();
        }}
        role="dialog"
        aria-modal="true"
        aria-label="Comprobante de inscripción"
      >
        <div className="comp-actions no-print">
          <span className="comp-actions-title">Comprobante de inscripción</span>
          <div style={{ display: 'flex', gap: 8 }}>
            <button
              className="btn btn-primary btn-sm"
              onClick={() => {
                window.print();
              }}
            >
              <Printer size={13} />
              Imprimir
            </button>
            <button className="btn btn-secondary btn-sm" onClick={onClose}>
              Cerrar
            </button>
          </div>
        </div>

        <div className="comp-receipt" id="comp-receipt-print">
          {pagado && <div className="comp-watermark">YA FUE HECHO EL PAGO</div>}
          {retirado && <div className="comp-watermark comp-watermark--gray">RETIRADO</div>}

          <div className="comp-header">
            <img
              className="comp-logo-img"
              src={ESCUDO_URL}
              alt="Escudo Cambridge School Pamplona"
            />
            <div className="comp-header-center">
              <div className="comp-school-name">Cambridge School Pamplona</div>
              <div className="comp-title">Derechos de matrícula — Escuela de Formación</div>
            </div>
            <div className="comp-header-right">
              <div className="comp-folio-label">Comprobante N.°</div>
              <div className="comp-folio">{folio}</div>
            </div>
          </div>

          <div className="comp-box">
            <div className="comp-box-row">
              <div className="comp-field comp-field--grow">
                <span className="comp-field-label">Estudiante / Aspirante</span>
                <span className="comp-field-value">{enrollment.estudiante_nombre}</span>
              </div>
              <div className="comp-field">
                <span className="comp-field-label">Documento</span>
                <span className="comp-field-value">{enrollment.estudiante_documento}</span>
              </div>
              <div className="comp-field">
                <span className="comp-field-label">Grado</span>
                <span className="comp-field-value">{enrollment.estudiante_grado}</span>
              </div>
            </div>
            <div className="comp-box-row">
              <div className="comp-field comp-field--grow">
                <span className="comp-field-label">Programa</span>
                <span className="comp-field-value">{program.tipo_complementario}</span>
              </div>
              <div className="comp-field">
                <span className="comp-field-label">Mes de inicio</span>
                <span className="comp-field-value">{enrollment.mes}</span>
              </div>
              <div className="comp-field">
                <span className="comp-field-label">Período</span>
                <span className="comp-field-value">{periodoAnio}</span>
              </div>
            </div>
            <div className="comp-box-row">
              <div className="comp-field">
                <span className="comp-field-label">Fecha de inscripción</span>
                <span className="comp-field-value">{fmt(enrollment.fecha_registro)}</span>
              </div>
              <div className="comp-field comp-field--grow">
                <span className="comp-field-label">Orden de pago</span>
                <span className="comp-field-value comp-field-value--mono">
                  {enrollment.numero_comprobante ?? '—'}
                </span>
              </div>
              <div className="comp-field">
                <span className="comp-field-label">Impreso</span>
                <span className="comp-field-value">{printedAt}</span>
              </div>
            </div>
          </div>

          <table className="comp-table">
            <thead>
              <tr>
                <th>Concepto</th>
                <th>Detalle</th>
                <th>Valor</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Matrícula del programa</td>
                <td>{program.tipo_complementario}</td>
                <td className="comp-table-amount">{money(enrollment.valor_acordado)}</td>
              </tr>
              {abonado > 0 && (
                <tr>
                  <td>Pagos aplicados</td>
                  <td>Abono recibido</td>
                  <td className="comp-table-amount comp-table-amount--green">-{money(abonado)}</td>
                </tr>
              )}
              {enrollment.observaciones && (
                <tr>
                  <td>Observaciones</td>
                  <td colSpan={2} className="comp-table-note">
                    {enrollment.observaciones}
                  </td>
                </tr>
              )}
            </tbody>
          </table>

          <div className="comp-balance-row">
            <span className="comp-balance-label">Saldo pendiente</span>
            <span
              className={`comp-balance-value ${enrollment.saldo_pendiente === 0 ? 'comp-balance-value--zero' : ''}`}
            >
              {money(enrollment.saldo_pendiente)}
            </span>
          </div>

          <div className="comp-footer">
            <div className="comp-status-block">
              <div className={`comp-status-badge ${estadoClass}`}>{estadoLabel}</div>
              {enrollment.motivo_retiro && (
                <p className="comp-motivo">Motivo de retiro: {enrollment.motivo_retiro}</p>
              )}
            </div>
            <div className="comp-sign">
              <div className="comp-sign-line" />
              <span className="comp-sign-label">Firma y sello — Tesorería</span>
            </div>
          </div>

          <p className="comp-legend">
            Este comprobante es un soporte de la obligación del módulo Escuelas de Formación.
            Conserve una copia para sus registros.
          </p>
        </div>
      </div>
    </div>
  );
};
