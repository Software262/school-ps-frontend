import { CalendarDays, CreditCard, FileText, GraduationCap, LogOut, X } from 'lucide-react';
import { Badge } from '@/shared/ui/atoms/Badge';
import { Button } from '@/shared/ui/atoms/Button';
import { Spinner } from '@/shared/ui/atoms/Spinner';
import type { Enrollment } from '../model/types';

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString('es-CO', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}

interface EscuelasFormacionTableProps {
  enrollments: Enrollment[];
  visibleEnrollments: Enrollment[];
  loading: boolean;
  filteredProgramName: string | null;
  onClearFilter: () => void;
  programName: (complementario_id: number) => string;
  onPayment: (enrollment: Enrollment) => void;
  onWithdraw: (enrollment: Enrollment) => void;
  onComprobante: (enrollment: Enrollment) => void;
}

export const EscuelasFormacionTable = ({
  enrollments,
  visibleEnrollments,
  loading,
  filteredProgramName,
  onClearFilter,
  programName,
  onPayment,
  onWithdraw,
  onComprobante,
}: EscuelasFormacionTableProps) => {
  return (
    <div className="ef-section">
      <div className="ef-section-header">
        <GraduationCap size={16} style={{ color: 'var(--brand-primary)' }} />
        <h3 className="ef-section-title">Inscripciones del período</h3>
        {filteredProgramName && (
          <button
            type="button"
            className="ef-filter-chip"
            onClick={onClearFilter}
            title="Quitar filtro"
          >
            {filteredProgramName}
            <X size={12} />
          </button>
        )}
      </div>

      {loading && (
        <div className="ef-state">
          <Spinner size={26} />
          <span>Cargando inscripciones…</span>
        </div>
      )}

      {!loading && enrollments.length === 0 && (
        <div className="ef-state ef-state--empty">
          <GraduationCap size={36} style={{ opacity: 0.3 }} />
          <p>No hay inscripciones en este período.</p>
        </div>
      )}

      {!loading && enrollments.length > 0 && visibleEnrollments.length === 0 && (
        <div className="ef-state ef-state--empty">
          <GraduationCap size={36} style={{ opacity: 0.3 }} />
          <p>No hay inscripciones en {filteredProgramName} para este período.</p>
        </div>
      )}

      {!loading && visibleEnrollments.length > 0 && (
        <div className="ef-table-wrap">
          <table className="ef-table">
            <thead>
              <tr>
                <th>Estudiante</th>
                <th>Programa</th>
                <th>Mes</th>
                <th>Estado</th>
                <th>Saldo</th>
                <th>
                  <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                    <CalendarDays size={11} />
                    Inscripción
                  </span>
                </th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {visibleEnrollments.map((e) => (
                <tr key={e.id} className={!e.activo ? 'ef-row--inactive' : ''}>
                  <td className="ef-cell-student">
                    <div>{e.estudiante_nombre}</div>
                    <div style={{ fontSize: 'var(--font-size-xs)', color: 'var(--text-muted)' }}>
                      {e.estudiante_documento}
                    </div>
                  </td>
                  <td>{programName(e.complementario_id)}</td>
                  <td>{e.mes}</td>
                  <td>
                    {!e.activo ? (
                      <Badge variant="gray">Retirado</Badge>
                    ) : e.estado_escuela ? (
                      <Badge variant="green">Paz y Salvo</Badge>
                    ) : (
                      <Badge variant="red">Pendiente</Badge>
                    )}
                  </td>
                  <td>
                    {e.saldo_pendiente > 0 ? `$${e.saldo_pendiente.toLocaleString('es-CO')}` : '—'}
                  </td>
                  <td style={{ color: 'var(--text-muted)', fontSize: 'var(--font-size-xs)' }}>
                    {formatDate(e.fecha_registro)}
                  </td>
                  <td>
                    <div className="ef-row-actions">
                      {e.activo && e.saldo_pendiente > 0 && (
                        <Button
                          variant="secondary"
                          size="sm"
                          onClick={() => {
                            onPayment(e);
                          }}
                          title="Registrar pago"
                        >
                          <CreditCard size={12} />
                          Pago
                        </Button>
                      )}
                      {e.activo && (
                        <Button
                          variant="outline"
                          size="sm"
                          className="ef-btn-withdraw"
                          onClick={() => {
                            onWithdraw(e);
                          }}
                          title="Retirar estudiante"
                        >
                          <LogOut size={12} />
                          Retirar
                        </Button>
                      )}
                      <Button
                        variant="secondary"
                        size="sm"
                        onClick={() => {
                          onComprobante(e);
                        }}
                        title="Ver comprobante"
                      >
                        <FileText size={12} />
                      </Button>
                      {!e.activo && e.motivo_retiro && (
                        <span className="ef-motivo" title={e.motivo_retiro}>
                          {e.motivo_retiro.length > 28
                            ? `${e.motivo_retiro.slice(0, 28)}…`
                            : e.motivo_retiro}
                        </span>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};
