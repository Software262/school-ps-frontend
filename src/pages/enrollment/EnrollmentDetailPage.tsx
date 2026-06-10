import { useState, useEffect, useCallback } from 'react';
import { useParams } from '@tanstack/react-router';
import { ArrowLeft, User, FileText, Edit, Trash2, Plus } from 'lucide-react';

import { useStudentBalance } from '@/features/view-enrollment/hooks/useStudentBalance';
import { Button } from '@/shared/ui/atoms/Button';
import { StatusBadge } from '@/entities/student/ui/StatusBadge';
import { PayEnrollmentForm } from '@/features/pay-enrollment/components/PayEnrollmentForm';
import { ModifyEnrollmentModal } from '@/features/modify-enrollment/components/ModifyEnrollmentModal';
import { AuditHistoryModal } from '@/features/audit-history/components/AuditHistoryModal';
import { useModifyEnrollment } from '@/features/modify-enrollment/hooks/useModifyEnrollment';
import { AssignComplementaryModal } from '@/features/modify-enrollment/components/AssignComplementaryModal';
import './Enrollment.css';

export const EnrollmentDetail = () => {
  const { id } = useParams({ from: '/dashboard/enrollment/student/$id/' });
  const { balance, loading, fetchBalance: fetchStudentBalance } = useStudentBalance();

  // Edit Modal states
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editConcept, setEditConcept] = useState<{
    id: string;
    name: string;
    currentVal: number;
    detalleId?: number;
  } | null>(null);
  const [isAuditModalOpen, setIsAuditModalOpen] = useState(false);
  const [isAssignModalOpen, setIsAssignModalOpen] = useState(false);
  const { submitDelete } = useModifyEnrollment();

  const fetchBalance = useCallback(async () => {
    if (!id) return;
    await fetchStudentBalance(Number(id));
  }, [id, fetchStudentBalance]);

  useEffect(() => {
    const timer = setTimeout(() => {
      void fetchBalance();
    }, 0);
    return () => {
      clearTimeout(timer);
    };
  }, [fetchBalance]);

  const openEditModal = (
    conceptId: string,
    name: string,
    currentVal: number,
    detalleId?: number,
  ) => {
    setEditConcept({ id: conceptId, name, currentVal, detalleId });
    setIsEditModalOpen(true);
  };

  const handleRefresh = async () => {
    await fetchBalance();
  };

  const handleUnlink = async (detalleId: number, name: string) => {
    if (confirm(`¿Está seguro de que desea desvincular el concepto "${name}"?`)) {
      try {
        await submitDelete(detalleId);
        await handleRefresh();
      } catch (e: unknown) {
        alert(e instanceof Error ? e.message : 'Error al desvincular');
      }
    }
  };

  if (loading) {
    return (
      <div style={{ padding: '2rem', textAlign: 'center' }}>
        Cargando información del estudiante...
      </div>
    );
  }

  if (!balance) {
    return (
      <div style={{ padding: '2rem', textAlign: 'center' }}>No se pudo cargar la información.</div>
    );
  }

  return (
    <div className="enrollment-view" style={{ gap: '20px' }}>
      {/* Header and navigation */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          borderBottom: '1px solid var(--border)',
          paddingBottom: '16px',
        }}
      >
        <button
          onClick={() => {
            window.history.back();
          }}
          className="btn-link"
        >
          <ArrowLeft size={16} /> Volver a búsqueda
        </button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => {
            setIsAuditModalOpen(true);
          }}
        >
          Ver Historial de Auditoría
        </Button>
      </div>

      {/* Student Info Card */}
      <div className="card" style={{ marginBottom: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
          <User size={24} color="var(--text-muted)" />
          <h2 style={{ fontSize: '1.25rem', margin: 0 }}>{balance.estudiante.nombre}</h2>
        </div>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
            gap: '16px',
          }}
        >
          <div>
            <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Código</p>
            <p style={{ fontWeight: 500 }}>{balance.estudiante.documento}</p>
          </div>
          <div>
            <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Grado</p>
            <p style={{ fontWeight: 500 }}>{balance.estudiante.grado_nombre}</p>
          </div>
          <div>
            <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Período</p>
            <p style={{ fontWeight: 500 }}>{balance.anio.toString()}</p>
          </div>
          <div>
            <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Pagos Realizados</p>
            <p style={{ fontWeight: 500 }}>{balance.pagos_realizados.toString()}</p>
          </div>
          <div>
            <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Estado Actual</p>
            <StatusBadge status={balance.estado_matricula} />
          </div>
        </div>
      </div>

      {/* Conceptos Económicos */}
      <div className="card" style={{ padding: '0', overflow: 'hidden', marginBottom: 0 }}>
        <div
          style={{
            padding: '16px 20px',
            borderBottom: '1px solid var(--border)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            background: '#f8fafc',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <FileText size={20} color="var(--text-muted)" />
            <h3 style={{ margin: 0, fontSize: '1rem' }}>Conceptos Económicos Parametrizados</h3>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              setIsAssignModalOpen(true);
            }}
          >
            <Plus size={16} />
            Agregar Complemento
          </Button>
        </div>

        <div style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              padding: '16px',
              border: '1px solid var(--border)',
              borderRadius: '8px',
              background: '#fff',
            }}
          >
            <div>
              <p style={{ fontWeight: 600, margin: 0 }}>Matrícula Base</p>
              <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)', margin: 0 }}>
                Valor base
              </p>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <p style={{ fontWeight: 600, fontSize: '1.1rem', margin: 0 }}>
                ${balance.costo_base_matricula.toLocaleString()}
              </p>
              <button
                onClick={() => {
                  openEditModal('matricula_base', 'Matrícula Base', balance.costo_base_matricula);
                }}
                className="btn-link"
                style={{ padding: '4px' }}
              >
                <Edit size={18} />
              </button>
            </div>
          </div>

          {balance.complementarios.map((comp) => {
            const tieneAbonos = comp.valor_pendiente < comp.valor_completo - comp.descuento;
            return (
              <div
                key={comp.detalle_id.toString()}
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  padding: '16px',
                  border: '1px solid var(--border)',
                  borderRadius: '8px',
                  background: '#fff',
                }}
              >
                <div>
                  <p style={{ fontWeight: 600, margin: 0 }}>{comp.tipo_complementario}</p>
                  <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)', margin: 0 }}>
                    Concepto complementario
                  </p>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <p style={{ fontWeight: 600, fontSize: '1.1rem', margin: 0 }}>
                    ${comp.valor_completo.toLocaleString()}
                  </p>
                  <button
                    onClick={() => {
                      openEditModal(
                        `comp_${comp.complementario_id.toString()}`,
                        comp.tipo_complementario,
                        comp.valor_completo,
                        comp.detalle_id,
                      );
                    }}
                    className="btn-link"
                    style={{ padding: '4px' }}
                    title="Editar costo"
                  >
                    <Edit size={18} />
                  </button>
                  <button
                    onClick={() => {
                      void handleUnlink(comp.detalle_id, comp.tipo_complementario);
                    }}
                    disabled={tieneAbonos}
                    style={{
                      background: 'none',
                      border: 'none',
                      cursor: tieneAbonos ? 'not-allowed' : 'pointer',
                      color: tieneAbonos ? '#cbd5e1' : 'var(--status-red, #ef4444)',
                      padding: '4px',
                      opacity: tieneAbonos ? 0.5 : 1,
                    }}
                    title={
                      tieneAbonos
                        ? 'No se puede desvincular un concepto que ya tiene abonos registrados'
                        : 'Desvincular concepto'
                    }
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>
            );
          })}

          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              padding: '16px',
              borderRadius: '8px',
              background: 'var(--status-gray-bg)',
              border: '1px solid var(--status-gray-border)',
              marginTop: '8px',
            }}
          >
            <p style={{ fontWeight: 700, margin: 0, color: 'var(--text-primary)' }}>
              Total Matrícula
            </p>
            <p
              style={{
                fontWeight: 700,
                fontSize: '1.25rem',
                margin: 0,
                color: 'var(--brand-primary)',
              }}
            >
              ${balance.costo_total.toLocaleString()}
            </p>
          </div>
        </div>
      </div>

      {/* Saldo Pendiente */}
      <div className="pending-banner" style={{ padding: '20px' }}>
        <p style={{ fontWeight: 700, margin: 0 }}>Saldo Pendiente</p>
        <p style={{ fontWeight: 700, fontSize: '1.25rem', margin: 0 }}>
          ${balance.total_pendiente.toLocaleString()}
        </p>
      </div>

      {/* Registrar Pago Form (Feature) */}
      <PayEnrollmentForm
        key={`${balance.estudiante.id.toString()}-${balance.total_pendiente.toString()}-${balance.pagos_realizados.toString()}`}
        balance={balance}
        onPaymentSuccess={handleRefresh}
      />

      {/* Edit Modal (Feature) */}
      <ModifyEnrollmentModal
        key={editConcept ? `${editConcept.id}-${editConcept.currentVal.toString()}` : 'closed'}
        isOpen={isEditModalOpen}
        onClose={() => {
          setIsEditModalOpen(false);
        }}
        balance={balance}
        concept={editConcept}
        onEditSuccess={handleRefresh}
      />

      <AuditHistoryModal
        isOpen={isAuditModalOpen}
        onClose={() => {
          setIsAuditModalOpen(false);
        }}
        studentId={balance.estudiante.id}
        studentName={balance.estudiante.nombre}
      />

      <AssignComplementaryModal
        isOpen={isAssignModalOpen}
        onClose={() => {
          setIsAssignModalOpen(false);
        }}
        studentId={balance.estudiante.id}
        year={balance.anio}
        onSuccess={handleRefresh}
      />
    </div>
  );
};
