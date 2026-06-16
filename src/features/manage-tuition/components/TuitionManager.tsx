import { useState, useCallback } from 'react';
import './TuitionManager.css';
import { Button } from '@/shared/ui/atoms/Button';
import { useTuition } from '@/features/manage-tuition/hooks/useTuition';
import { StudentInfoCard } from '@/features/manage-tuition/components/StudentInfoCard';
import { InstallmentsGrid } from '@/features/manage-tuition/components/InstallmentsGrid';
import { TuitionSummary } from '@/features/manage-tuition/components/TuitionSummary';
import { PaymentModal } from '@/features/manage-tuition/components/PaymentModal';
import type { TuitionInstallmentResponse } from '@/entities/tuition/model/types';
import { AuditHistoryModal } from '@/features/audit-history/components/AuditHistoryModal';
import { TuitionSearchForm } from '@/features/manage-tuition/components/TuitionSearchForm';
import type { StudentSearchItem } from '@/entities/student/model/types';
import { StatusBadge } from '@/entities/student/ui/StatusBadge';

export const TuitionManager = () => {
  const [selectedMonth, setSelectedMonth] = useState<TuitionInstallmentResponse | null>(null);
  const [isAuditModalOpen, setIsAuditModalOpen] = useState(false);

  // Search State
  const [searchResults, setSearchResults] = useState<StudentSearchItem[]>([]);
  const [selectedStudentInfo, setSelectedStudentInfo] = useState<StudentSearchItem | null>(null);

  const { accountData, loading, errorMsg, fetchStudentData, submitPayment, clearData, refetch } =
    useTuition();

  const handleSearchSuccess = useCallback((results: StudentSearchItem[]) => {
    setSearchResults(results);
  }, []);

  const handleSelectStudentForTuition = (student: StudentSearchItem) => {
    setSelectedStudentInfo(student);
    setSearchResults([]);
    void fetchStudentData(student.documento);
  };

  const handleClearTuition = () => {
    clearData();
    setSelectedStudentInfo(null);
    setSearchResults([]);
  };

  const handleOpenModal = (installment: TuitionInstallmentResponse) => {
    if (!installment.faltante) return;
    setSelectedMonth(installment);
  };

  return (
    <div className="tuition-view">
      <div className="page-title">
        <h1>Módulo de Pensión</h1>
        <p>Gestión de mensualidades</p>
      </div>

      {errorMsg && <div className="alert alert-error">{errorMsg}</div>}

      {!accountData && (
        <>
          <TuitionSearchForm onResults={handleSearchSuccess} />

          {searchResults.length > 0 && (
            <div className="table-container" style={{ marginTop: '20px' }}>
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Código</th>
                    <th>Nombre</th>
                    <th>Grado</th>
                    <th>Estado Matrícula</th>
                    <th style={{ textAlign: 'center' }}>Acción</th>
                  </tr>
                </thead>
                <tbody>
                  {searchResults.map((student) => (
                    <tr key={student.estudiante_id}>
                      <td>{student.documento}</td>
                      <td style={{ fontWeight: 500 }}>{student.nombre}</td>
                      <td>{student.grado_nombre}</td>
                      <td>
                        <StatusBadge status={student.estado_matricula} />
                      </td>
                      <td style={{ textAlign: 'center' }}>
                        <Button
                          variant="primary"
                          size="sm"
                          onClick={() => {
                            handleSelectStudentForTuition(student);
                          }}
                          disabled={loading}
                        >
                          Gestionar Pensión
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </>
      )}

      {accountData && (
        <>
          <div className="header-actions">
            <Button variant="outline" onClick={handleClearTuition}>
              <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M10 19l-7-7m0 0l7-7m-7 7h18"
                />
              </svg>
              Limpiar Búsqueda
            </Button>
            <Button
              variant="outline"
              onClick={() => {
                setIsAuditModalOpen(true);
              }}
            >
              <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              Ver Historial de Auditoría
            </Button>
          </div>

          <StudentInfoCard
            accountData={accountData}
            studentName={selectedStudentInfo?.nombre}
            studentDocument={selectedStudentInfo?.documento}
            studentGrado={selectedStudentInfo?.grado_nombre}
            studentEstado={selectedStudentInfo?.estado_matricula}
          />
          <InstallmentsGrid
            installments={accountData.installments}
            onEditInstallment={handleOpenModal}
          />
          <TuitionSummary installments={accountData.installments} />

          <AuditHistoryModal
            isOpen={isAuditModalOpen}
            onClose={() => {
              setIsAuditModalOpen(false);
            }}
            studentId={accountData.estudiante_id}
            studentName={
              selectedStudentInfo?.nombre ?? `Estudiante #${String(accountData.estudiante_id)}`
            }
          />
        </>
      )}

      {selectedMonth && accountData && (
        <PaymentModal
          selectedMonth={selectedMonth}
          estudianteId={accountData.estudiante_id}
          onClose={() => {
            setSelectedMonth(null);
          }}
          onPaymentSuccess={refetch}
          submitPayment={submitPayment}
        />
      )}
    </div>
  );
};
