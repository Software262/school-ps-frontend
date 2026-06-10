import { useState, type SubmitEvent } from 'react';
import './TuitionManager.css';
import { Button } from '@/shared/ui/atoms/Button';
import { useTuition } from '@/features/manage-tuition/hooks/useTuition';
import { StudentInfoCard } from '@/features/manage-tuition/components/StudentInfoCard';
import { InstallmentsGrid } from '@/features/manage-tuition/components/InstallmentsGrid';
import { TuitionSummary } from '@/features/manage-tuition/components/TuitionSummary';
import { PaymentModal } from '@/features/manage-tuition/components/PaymentModal';
import type { TuitionInstallmentResponse } from '@/entities/tuition/model/types';

export const TuitionManager = () => {
  const [studentId, setStudentId] = useState('');
  const [selectedMonth, setSelectedMonth] = useState<TuitionInstallmentResponse | null>(null);

  const { accountData, loading, errorMsg, fetchStudentData, submitPayment, clearData, refetch } =
    useTuition();

  const handleSearch = (e: SubmitEvent) => {
    e.preventDefault();
    if (studentId.trim()) void fetchStudentData(studentId.trim());
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

      <div className="card search-section">
        <div className="search-header">
          <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
          Filtros de búsqueda
        </div>

        <div className="search-info">
          Ingrese la cédula del estudiante para consultar el estado de pensiones.
        </div>

        {errorMsg && <div className="alert alert-error">{errorMsg}</div>}

        <form className="search-form" onSubmit={handleSearch}>
          <div className="input-group">
            <label>Cédula del Estudiante</label>
            <input
              type="text"
              className="form-input"
              placeholder="Ej: 1023456789"
              value={studentId}
              onChange={(e) => {
                setStudentId(e.target.value);
              }}
              disabled={loading}
            />
          </div>
          <Button type="submit" size="lg" variant="primary" disabled={loading || !studentId.trim()}>
            <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
            {loading ? 'Buscando...' : 'Buscar'}
          </Button>
        </form>
      </div>

      {accountData && (
        <>
          <div className="header-actions">
            <button className="btn-link" onClick={clearData}>
              <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M10 19l-7-7m0 0l7-7m-7 7h18"
                />
              </svg>
              Limpiar Búsqueda
            </button>
            <Button variant="outline">
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

          <StudentInfoCard accountData={accountData} />
          <InstallmentsGrid
            installments={accountData.installments}
            onEditInstallment={handleOpenModal}
          />
          <TuitionSummary installments={accountData.installments} />
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
