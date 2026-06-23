import { useState, useEffect, useCallback } from 'react';
import { useParams, useSearch } from '@tanstack/react-router';
import { ArrowLeft, User, FileText, Edit, Trash2, Plus, AlertTriangle } from 'lucide-react';

import { useStudentBalance } from '@/features/view-enrollment/hooks/useStudentBalance';
import { Button } from '@/shared/ui/atoms/Button';
import { StatusBadge } from '@/entities/student/ui/StatusBadge';
import { PayEnrollmentForm } from '@/features/pay-enrollment/components/PayEnrollmentForm';
import { ModifyEnrollmentModal } from '@/features/modify-enrollment/components/ModifyEnrollmentModal';
import { AuditHistoryModal } from '@/features/audit-history/components/AuditHistoryModal';
import { useModifyEnrollment } from '@/features/modify-enrollment/hooks/useModifyEnrollment';
import { AssignComplementaryModal } from '@/features/modify-enrollment/components/AssignComplementaryModal';
import { Modal } from '@/shared/ui/atoms/Modal';
import { useToast } from '@/shared/ui';
import { enrollmentApi } from '@/entities/student/api/enrollment';
import './Enrollment.css';

export const EnrollmentDetail = () => {
  const { id } = useParams({ from: '/dashboard/enrollment/student/$id/' });
  const { year } = useSearch({ from: '/dashboard/enrollment/student/$id/' });
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
  const { showToast } = useToast();

  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [confirmData, setConfirmData] = useState<{ detalleId: number; name: string } | null>(null);
  const [enrollLoading, setEnrollLoading] = useState(false);

  const fetchBalance = useCallback(async () => {
    if (!id) return;
    await fetchStudentBalance(Number(id), year);
  }, [id, year, fetchStudentBalance]);

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

  const handleUnlinkClick = (detalleId: number, name: string) => {
    setConfirmData({ detalleId, name });
    setIsConfirmOpen(true);
  };

  const handleConfirmUnlink = async () => {
    if (!confirmData) return;
    try {
      await submitDelete(confirmData.detalleId);
      showToast('Concepto desvinculado exitosamente.', 'success');
      await handleRefresh();
    } catch (e: unknown) {
      showToast(e instanceof Error ? e.message : 'Error al desvincular', 'error');
    } finally {
      setIsConfirmOpen(false);
      setConfirmData(null);
    }
  };

  const handleAutoEnroll = async () => {
    if (!id) return;
    setEnrollLoading(true);
    try {
      const periods = await enrollmentApi.getPeriods();
      const targetYear = balance ? balance.anio : new Date().getFullYear();
      const matchingPeriod = periods.find(
        (p) => new Date(p.periodo_electivo).getFullYear() === targetYear,
      );
      const periodId = matchingPeriod ? matchingPeriod.id : 1;

      await enrollmentApi.registerEnrollment({
        estudiante_id: Number(id),
        periodo_id: periodId,
        anio: targetYear,
      });
      showToast('Estudiante matriculado automáticamente con éxito.', 'success');
      await handleRefresh();
    } catch (e: unknown) {
      console.error(e);
      showToast(e instanceof Error ? e.message : 'Error al matricular al estudiante', 'error');
    } finally {
      setEnrollLoading(false);
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
        <Button
          variant="outline"
          size="sm"
          onClick={() => {
            window.history.back();
          }}
          style={{ display: 'flex', alignItems: 'center', gap: '8px' }}
        >
          <ArrowLeft size={16} /> Volver
        </Button>
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

      {!balance.matricula_registrada ? (
        <div
          className="card warning-banner-container"
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            textAlign: 'center',
            padding: '40px 20px',
            gap: '16px',
            background: 'var(--surface)',
            borderRadius: 'var(--radius-lg)',
            border: '1px solid var(--border)',
          }}
        >
          <AlertTriangle size={48} color="var(--status-yellow)" />
          <div>
            <h3 style={{ margin: '0 0 8px 0', fontSize: '1.1rem', fontWeight: 600 }}>
              Estudiante No Matriculado
            </h3>
            <p style={{ margin: 0, color: 'var(--text-secondary)', fontSize: '0.875rem' }}>
              Este estudiante no tiene una matrícula activa en el año actual ({balance.anio}). Debe
              matricularlo para poder gestionar complementarios o registrar pagos.
            </p>
          </div>
          <Button
            variant="primary"
            onClick={() => {
              void handleAutoEnroll();
            }}
            disabled={enrollLoading}
            style={{ marginTop: '8px' }}
          >
            {enrollLoading ? 'Matriculando...' : 'Matricular Estudiante Antiguo'}
          </Button>
        </div>
      ) : (
        <>
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
                  {balance.estado_matricula !== 'paz_y_salvo' && (
                    <button
                      onClick={() => {
                        openEditModal(
                          'matricula_base',
                          'Matrícula Base',
                          balance.costo_base_matricula,
                        );
                      }}
                      className="btn-link"
                      style={{ padding: '4px' }}
                    >
                      <Edit size={18} />
                    </button>
                  )}
                </div>
              </div>

              {balance.complementarios.map((comp) => {
                const tieneAbonos = comp.valor_pendiente < comp.valor_completo - comp.descuento;
                const isPaid = comp.valor_pendiente === 0;
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
                        {comp.descuento > 0 && (
                          <span
                            style={{
                              color: 'var(--status-green)',
                              marginLeft: '8px',
                              fontWeight: 500,
                            }}
                          >
                            (Descuento: -${comp.descuento.toLocaleString()})
                          </span>
                        )}
                      </p>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <p style={{ fontWeight: 600, fontSize: '1.1rem', margin: 0 }}>
                        ${(comp.valor_completo - comp.descuento).toLocaleString()}
                      </p>
                      {!isPaid && balance.estado_matricula !== 'paz_y_salvo' && (
                        <button
                          onClick={() => {
                            openEditModal(
                              `comp_${comp.complementario_id.toString()}`,
                              comp.tipo_complementario,
                              comp.valor_completo - comp.descuento,
                              comp.detalle_id,
                            );
                          }}
                          className="btn-link"
                          style={{ padding: '4px' }}
                          title="Editar costo"
                        >
                          <Edit size={18} />
                        </button>
                      )}
                      {!isPaid && balance.estado_matricula !== 'paz_y_salvo' && (
                        <button
                          onClick={() => {
                            handleUnlinkClick(comp.detalle_id, comp.tipo_complementario);
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
                      )}
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
          <div
            className={balance.total_pendiente === 0 ? 'success-banner' : 'pending-banner'}
            style={{ padding: '20px' }}
          >
            <p style={{ fontWeight: 700, margin: 0 }}>Saldo Pendiente</p>
            <p style={{ fontWeight: 700, fontSize: '1.25rem', margin: 0 }}>
              ${balance.total_pendiente.toLocaleString()}
            </p>
          </div>

          {/* Registrar Pago Form (Feature) */}
          {balance.estado_matricula !== 'paz_y_salvo' && (
            <PayEnrollmentForm
              key={`${balance.estudiante.id.toString()}-${balance.total_pendiente.toString()}-${balance.pagos_realizados.toString()}`}
              balance={balance}
              onPaymentSuccess={handleRefresh}
            />
          )}
        </>
      )}

      {/* Custom Confirm Modal */}
      <Modal
        isOpen={isConfirmOpen}
        onClose={() => {
          setIsConfirmOpen(false);
        }}
        title="Confirmar Desvinculación"
        width={400}
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <p style={{ margin: 0, fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
            ¿Está seguro de que desea desvincular el concepto <strong>"{confirmData?.name}"</strong>
            ? Esta acción no se puede deshacer.
          </p>
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px' }}>
            <Button
              variant="secondary"
              onClick={() => {
                setIsConfirmOpen(false);
              }}
            >
              Cancelar
            </Button>
            <Button
              variant="primary"
              onClick={() => {
                void handleConfirmUnlink();
              }}
            >
              Desvincular
            </Button>
          </div>
        </div>
      </Modal>

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
