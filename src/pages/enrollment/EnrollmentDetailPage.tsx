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
      <div className="enrollment-view">
        <p style={{ textAlign: 'center', padding: '2rem' }}>
          Cargando información del estudiante...
        </p>
      </div>
    );
  }

  if (!balance) {
    return (
      <div className="enrollment-view">
        <p style={{ textAlign: 'center', padding: '2rem' }}>No se pudo cargar la información.</p>
      </div>
    );
  }

  return (
    <div className="enrollment-view">
      {/* Título de página */}
      <div className="page-title">
        <h1>{balance.estudiante.nombre}</h1>
        <p>Módulo de Matrícula — detalle del estudiante</p>
      </div>

      {/* Navegación */}
      <div className="enrollment-nav">
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
          onClick={() => {
            setIsAuditModalOpen(true);
          }}
        >
          Ver Historial de Auditoría
        </Button>
      </div>

      {/* Card info del estudiante */}
      <div className="card student-info">
        <div className="enrollment-student-header">
          <User size={22} color="var(--text-muted)" />
          <h2>{balance.estudiante.nombre}</h2>
        </div>

        <div className="enrollment-student-grid">
          <div className="info-item">
            <span className="info-label">Código</span>
            <span className="info-value">{balance.estudiante.documento}</span>
          </div>
          <div className="info-item">
            <span className="info-label">Grado</span>
            <span className="info-value">{balance.estudiante.grado_nombre}</span>
          </div>
          <div className="info-item">
            <span className="info-label">Período</span>
            <span className="info-value">{balance.anio.toString()}</span>
          </div>
          <div className="info-item">
            <span className="info-label">Pagos Realizados</span>
            <span className="info-value">{balance.pagos_realizados.toString()}</span>
          </div>
          <div className="info-item">
            <span className="info-label">Estado Actual</span>
            <StatusBadge status={balance.estado_matricula} />
          </div>
        </div>
      </div>

      {/* Card conceptos económicos */}
      <div className="card" style={{ padding: 0, overflow: 'hidden', marginBottom: 0 }}>
        <div className="enrollment-section-header">
          <div className="enrollment-section-header-left">
            <FileText size={18} color="var(--text-muted)" />
            <h3>Conceptos Económicos Parametrizados</h3>
          </div>
          <Button
            variant="outline"
            onClick={() => {
              setIsAssignModalOpen(true);
            }}
          >
            <Plus size={16} />
            Agregar Complemento
          </Button>
        </div>

        <div className="enrollment-concepts">
          {/* Matrícula base */}
          <div className="enrollment-concept-item">
            <div>
              <p className="enrollment-concept-name">Matrícula Base</p>
              <p className="enrollment-concept-desc">Valor base</p>
            </div>
            <div className="enrollment-concept-right">
              <p className="enrollment-concept-value">
                ${balance.costo_base_matricula.toLocaleString()}
              </p>
              <button
                onClick={() => {
                  openEditModal('matricula_base', 'Matrícula Base', balance.costo_base_matricula);
                }}
                className="btn-link"
                style={{ padding: '4px' }}
              >
                <Edit size={16} />
              </button>
            </div>
          </div>

          {/* Complementarios */}
          {balance.complementarios.map((comp) => {
            const tieneAbonos = comp.valor_pendiente < comp.valor_completo - comp.descuento;
            return (
              <div key={comp.detalle_id.toString()} className="enrollment-concept-item">
                <div>
                  <p className="enrollment-concept-name">{comp.tipo_complementario}</p>
                  <p className="enrollment-concept-desc">Concepto complementario</p>
                </div>
                <div className="enrollment-concept-right">
                  <p className="enrollment-concept-value">
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
                    <Edit size={16} />
                  </button>
                  <button
                    onClick={() => {
                      void handleUnlink(comp.detalle_id, comp.tipo_complementario);
                    }}
                    disabled={tieneAbonos}
                    className="enrollment-unlink-btn"
                    title={
                      tieneAbonos
                        ? 'No se puede desvincular un concepto que ya tiene abonos registrados'
                        : 'Desvincular concepto'
                    }
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            );
          })}

          {/* Total */}
          <div className="enrollment-total-row">
            <p className="enrollment-total-label">Total Matrícula</p>
            <p className="enrollment-total-value">${balance.costo_total.toLocaleString()}</p>
          </div>
        </div>
      </div>

      {/* Saldo pendiente */}
      <div className="pending-banner">
        <p style={{ fontWeight: 700, margin: 0 }}>Saldo Pendiente</p>
        <p style={{ fontWeight: 700, fontSize: 'var(--font-size-xl)', margin: 0 }}>
          ${balance.total_pendiente.toLocaleString()}
        </p>
      </div>

      {/* Registrar pago */}
      <PayEnrollmentForm
        key={`${balance.estudiante.id.toString()}-${balance.total_pendiente.toString()}-${balance.pagos_realizados.toString()}`}
        balance={balance}
        onPaymentSuccess={handleRefresh}
      />

      {/* Modales */}
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
