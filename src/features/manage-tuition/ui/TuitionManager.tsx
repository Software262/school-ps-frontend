import React, { useState } from 'react';
import './TuitionManager.css';
import { tuitionService } from '../../../entities/tuition/api/tuitionService';
import type { TuitionAccountResponse, TuitionInstallmentResponse } from '../../../entities/tuition/model/types';

const MONTH_NAMES = [
  '', 'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
  'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
];

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('es-CO', {
    style: 'currency',
    currency: 'COP',
    minimumFractionDigits: 0
  }).format(amount);
};

export const TuitionManager: React.FC = () => {
  const [studentId, setStudentId] = useState('');
  const [lastDocumento, setLastDocumento] = useState('');
  const [accountData, setAccountData] = useState<TuitionAccountResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedMonth, setSelectedMonth] = useState<TuitionInstallmentResponse | null>(null);
  const [paymentAmount, setPaymentAmount] = useState<string>('');
  const [justification, setJustification] = useState<string>('');
  const [paymentLoading, setPaymentLoading] = useState(false);

  const fetchStudentData = async (documento: string) => {
    try {
      setLoading(true);
      setErrorMsg('');
      const data = await tuitionService.getStudentTuitionByDocumento(documento);
      data.installments.sort((a, b) => a.mes - b.mes);
      setAccountData(data);
      setLastDocumento(documento);
    } catch (error: unknown) {
      setErrorMsg(error instanceof Error ? error.message : 'Error desconocido al cargar datos.');
      setAccountData(null);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e: React.SyntheticEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (studentId.trim()) {
      void fetchStudentData(studentId.trim());
    }
  };

  const handleOpenModal = (installment: TuitionInstallmentResponse) => {
    if (!installment.faltante) return;
    setSelectedMonth(installment);
    setPaymentAmount(installment.saldo_pendiente.toString());
    setJustification('');
    setIsModalOpen(true);
  };

  const handlePayment = async (e: React.SyntheticEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!selectedMonth || !accountData) return;

    const amount = parseFloat(paymentAmount);
    if (isNaN(amount) || amount <= 0) return;

    try {
      setPaymentLoading(true);
      setErrorMsg('');
      await tuitionService.registerPayment({
        estudiante_id: accountData.estudiante_id,
        mes: selectedMonth.mes,
        valor_pagado: amount,
      });
      await fetchStudentData(lastDocumento);
      setIsModalOpen(false);
    } catch (error: unknown) {
      setErrorMsg(error instanceof Error ? error.message : 'No se pudo registrar el pago.');
    } finally {
      setPaymentLoading(false);
    }
  };

  const getStatusInfo = (installment: TuitionInstallmentResponse) => {
    if (!installment.faltante) return { label: 'Pagado', className: 'pagado', color: 'text-green' };
    if (installment.total_pagado_mes > 0) return { label: 'Pago Parcial', className: 'parcial', color: 'text-red' };
    return { label: 'Pendiente', className: 'pendiente', color: 'text-red' };
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
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          Filtros de búsqueda
        </div>

        <div className="search-info">
          Ingrese la cédula del estudiante para consultar el estado de pensiones.
        </div>

        {errorMsg && <div className="error-alert">{errorMsg}</div>}

        <form className="search-form" onSubmit={handleSearch}>
          <div className="input-group">
            <label>Cédula del Estudiante</label>
            <input
              type="text"
              placeholder="Ej: 1023456789"
              value={studentId}
              onChange={(e) => { setStudentId(e.target.value); }}
              disabled={loading}
            />
          </div>
          <button type="submit" className="btn-primary" disabled={loading || !studentId.trim()}>
            <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            {loading ? 'Buscando...' : 'Buscar'}
          </button>
        </form>
      </div>

      {accountData && (
        <>
          <div className="header-actions">
            <button className="btn-link" onClick={() => { setAccountData(null); }}>
              <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              Limpiar Búsqueda
            </button>
            <button className="btn-outline">
              <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Ver Historial de Auditoría
            </button>
          </div>

          <div className="card student-info">
            <div className="info-item">
              <span className="info-label">ID Estudiante</span>
              <span className="info-value">{accountData.estudiante_id}</span>
            </div>
            <div className="info-item">
              <span className="info-label">Estado Global</span>
              <span className="info-value">{accountData.estado_pension_general ? 'Paz y Salvo' : 'Pendiente'}</span>
            </div>
            <div className="info-item">
              <span className="info-label">Valor de la Mensualidad</span>
              <span className="info-value">{formatCurrency(accountData.valor_total_anual)}</span>
            </div>
          </div>

          <div className="card">
            <div className="installments-section-header">
              <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              Estado Mensual - Vista Semaforizada
            </div>

            <div className="installments-grid">
              {accountData.installments.map(instData => {
                const status = getStatusInfo(instData);
                
                return (
                  <div key={`mes-card-${instData.mes.toString()}`} className="installment-card">
                    <div className="installment-header">
                      <span className="installment-month">{MONTH_NAMES[instData.mes]}</span>
                      <div className="badge-container">
                        <span className={`status-badge ${status.className}`}>{status.label}</span>
                        {instData.faltante && (
                          <button className="edit-btn" onClick={() => { handleOpenModal(instData); }} title="Registrar Pago o Ajuste">
                            <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                            </svg>
                          </button>
                        )}
                      </div>
                    </div>
                    <div className="installment-details">
                      <div className="detail-row">
                        <span>Valor cuota:</span>
                        <span>{formatCurrency(instData.valor_total)}</span>
                      </div>
                      <div className="detail-row">
                        <span>Pagado acumulado:</span>
                        <span>{formatCurrency(instData.total_pagado_mes)}</span>
                      </div>
                      <div className={`detail-row saldo ${status.color}`}>
                        <span>Saldo:</span>
                        <span>{formatCurrency(instData.saldo_pendiente)}</span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="card">
            <div className="summary-header">
              <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Resumen Financiero
            </div>
            <div className="summary-cards">
              <div className="summary-card green">
                <div className="summary-label">Total Pagado</div>
                <div className="summary-value">
                  {formatCurrency(accountData.installments.reduce((sum, i) => sum + i.total_pagado_mes, 0))}
                </div>
                <div className="summary-desc">
                  {accountData.installments.filter(i => !i.faltante).length} meses completos
                </div>
              </div>
              <div className="summary-card yellow">
                <div className="summary-label">Pagos Parciales</div>
                <div className="summary-value">
                  {accountData.installments.filter(i => i.faltante && i.total_pagado_mes > 0).length}
                </div>
                <div className="summary-desc">Meses con abonos</div>
              </div>
              <div className="summary-card red">
                <div className="summary-label">Saldo Pendiente Total</div>
                <div className="summary-value">
                  {formatCurrency(accountData.installments.reduce((sum, i) => sum + i.saldo_pendiente, 0))}
                </div>
                <div className="summary-desc">
                  {accountData.installments.filter(i => i.faltante).length} cuotas pendientes
                </div>
              </div>
            </div>
          </div>
        </>
      )}

      {isModalOpen && selectedMonth && accountData && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h3>Registrar Abono - {MONTH_NAMES[selectedMonth.mes]}</h3>
              <button className="close-btn" onClick={() => { setIsModalOpen(false); }}>✕</button>
            </div>
            <form onSubmit={(e) => { void handlePayment(e); }} className="modal-body">
              <div className="input-group">
                <label>Valor a pagar o ajustar (COP)</label>
                <input
                  type="number"
                  value={paymentAmount}
                  onChange={(e) => { setPaymentAmount(e.target.value); }}
                  max={selectedMonth.saldo_pendiente}
                  min="1"
                  required
                  disabled={paymentLoading}
                />
              </div>
              <div className="input-group" style={{ marginTop: '1rem' }}>
                <label>Motivo / Justificación (Obligatorio)</label>
                <textarea
                  value={justification}
                  onChange={(e) => { setJustification(e.target.value); }}
                  required
                  disabled={paymentLoading}
                  placeholder="Ej: Abono en efectivo / Ajuste autorizado"
                  rows={2}
                  style={{ width: '100%', padding: '0.625rem 1rem', borderRadius: '6px', border: '1px solid var(--border-color)', outline: 'none', resize: 'vertical' }}
                />
              </div>
              <p style={{ fontSize: '0.75rem', color: 'var(--text-gray)', marginTop: '0.5rem' }}>
                Saldo actual: {formatCurrency(selectedMonth.saldo_pendiente)}
              </p>
              <div className="modal-footer">
                <button type="button" className="btn-secondary" onClick={() => { setIsModalOpen(false); }} disabled={paymentLoading}>
                  Cancelar
                </button>
                <button type="submit" className="btn-primary" disabled={paymentLoading || !paymentAmount}>
                  {paymentLoading ? 'Guardando...' : 'Guardar Pago'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
