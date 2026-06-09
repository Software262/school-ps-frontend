import { useCallback, useRef } from 'react';
import { Button } from '@/shared/ui/atoms/Button';
import { Badge } from '@/shared/ui/atoms/Badge';
import type { GenerateResponse } from '@/features/paz-y-salvo/model/types';
import './CertificateResult.css';

interface CertificateResultProps {
  certificate: GenerateResponse;
  onClose: () => void;
}

export const CertificateResult = ({ certificate, onClose }: CertificateResultProps) => {
  const printRef = useRef<HTMLDivElement>(null);

  const handlePrint = useCallback(() => {
    const printWindow = window.open('', '_blank');
    if (!printWindow) return;

    const isStudent = !!certificate.entidad.grado;
    const title = isStudent
      ? 'Certificado de Paz y Salvo Estudiantil'
      : 'Certificado de Paz y Salvo Docente';
    const gradeField =
      isStudent && certificate.entidad.grado
        ? `<div>
          <p class="info-label">Grado</p>
          <p class="info-value">${certificate.entidad.grado}</p>
        </div>`
        : '';

    const cardsHtml = certificate.detalles
      .map(
        (det) => `
          <div class="mod-card ${det.estado === 'ok' ? 'mod-card--ok' : 'mod-card--error'}">
            <div class="mod-card__header">
              <span class="mod-card__name">${det.nombre}</span>
              <span class="mod-badge ${det.estado === 'ok' ? 'mod-badge--ok' : 'mod-badge--error'}">
                ${det.estado === 'ok' ? 'OK' : 'Pendiente'}
              </span>
            </div>
            <p class="mod-card__detail">${det.detalle}</p>
          </div>`,
      )
      .join('');

    const css = `
      @page { margin: 15mm; size: A4; }
      * { box-sizing: border-box; }
      body { font-family: 'Inter', system-ui, sans-serif; padding: 0; margin: 0; color: #1a1a1a; }
      .header { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 20px; border-bottom: 2px solid #e0e0e0; padding-bottom: 12px; }
      .header__left h1 { font-size: 20px; margin: 0; }
      .header__left .codigo { font-size: 12px; color: #888; margin: 2px 0 0; }
      .badge-final { display: inline-block; padding: 4px 14px; border-radius: 20px; font-size: 12px; font-weight: 700; background: #edf7f1; color: #2d7d46; }
      .info-grid { display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 12px; margin-bottom: 24px; background: #f9fafb; border-radius: 8px; padding: 14px 18px; border: 1px solid #e5e7eb; }
      .info-label { font-size: 10px; color: #888; text-transform: uppercase; letter-spacing: 0.5px; margin: 0 0 2px; }
      .info-value { font-weight: 600; font-size: 14px; margin: 0; }
      .mod-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 12px; margin-bottom: 24px; }
      .mod-card { border-radius: 8px; padding: 12px 14px; border: 1px solid #e5e7eb; break-inside: avoid; }
      .mod-card--ok { background: #f0fdf4; border-color: #bbf7d0; }
      .mod-card--error { background: #fef2f2; border-color: #fecaca; }
      .mod-card__header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 6px; }
      .mod-card__name { font-weight: 700; font-size: 13px; }
      .mod-badge { display: inline-block; padding: 1px 8px; border-radius: 10px; font-size: 10px; font-weight: 700; white-space: nowrap; }
      .mod-badge--ok { background: #dcfce7; color: #166534; }
      .mod-badge--error { background: #fee2e2; color: #991b1b; }
      .mod-card__detail { font-size: 11px; color: #666; margin: 0; line-height: 1.4; }
      .footer { margin-top: 8px; padding-top: 12px; border-top: 1px solid #e0e0e0; font-size: 10px; color: #aaa; text-align: center; }
      @media print {
        .no-print { display: none !important; }
        body { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
      }
    `;

    const bodyHtml = `
      <div class="header">
        <div class="header__left">
          <h1>${title}</h1>
          <p class="codigo">Código: ${certificate.codigo}</p>
        </div>
        <span class="badge-final">Paz y Salvo</span>
      </div>
      <div class="info-grid">
        <div>
          <p class="info-label">Nombre</p>
          <p class="info-value">${certificate.entidad.nombre}</p>
        </div>
        <div>
          <p class="info-label">Documento</p>
          <p class="info-value">${certificate.entidad.documento}</p>
        </div>
        ${gradeField}
        <div>
          <p class="info-label">Periodo</p>
          <p class="info-value">${certificate.periodo.nombre}</p>
        </div>
        <div>
          <p class="info-label">Fecha de emisión</p>
          <p class="info-value">${new Date(certificate.fecha).toLocaleDateString('es-CO', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
        </div>
      </div>
      <div class="mod-grid">
        ${cardsHtml}
      </div>
      <div class="footer">
        Este certificado es válido únicamente si se verifica su código en el sistema.
      </div>
    `;

    const printDocument = printWindow.document;
    const style = printDocument.createElement('style');
    style.textContent = css;
    printDocument.head.appendChild(style);
    printDocument.title = `Paz y Salvo - ${certificate.codigo}`;
    printDocument.body.innerHTML = bodyHtml;
    printWindow.print();
  }, [certificate]);

  return (
    <div
      className="card"
      style={{ marginTop: '16px', border: '2px solid var(--status-green-border)' }}
    >
      <div ref={printRef}>
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '16px',
          }}
        >
          <div>
            <h3 style={{ margin: 0, fontSize: '1rem' }}>Certificado de Paz y Salvo</h3>
            <p style={{ margin: '2px 0 0', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
              Código: {certificate.codigo}
            </p>
          </div>
          <Badge variant={certificate.estado_final === 'paz_y_salvo' ? 'green' : 'red'}>
            {certificate.estado_final === 'paz_y_salvo' ? 'Paz y Salvo' : 'Pendiente'}
          </Badge>
        </div>

        <div className="cert-info-grid">
          <div className="cert-info-item">
            <p className="cert-info-label">Nombre</p>
            <p className="cert-info-value">{certificate.entidad.nombre}</p>
          </div>
          <div className="cert-info-item">
            <p className="cert-info-label">Documento</p>
            <p className="cert-info-value">{certificate.entidad.documento}</p>
          </div>
          {certificate.entidad.grado && (
            <div className="cert-info-item">
              <p className="cert-info-label">Grado</p>
              <p className="cert-info-value">{certificate.entidad.grado}</p>
            </div>
          )}
          <div className="cert-info-item">
            <p className="cert-info-label">Periodo Académico</p>
            <p className="cert-info-value">{certificate.periodo.nombre}</p>
          </div>
          <div className="cert-info-item">
            <p className="cert-info-label">Fecha de Generación</p>
            <p className="cert-info-value">
              {new Date(certificate.fecha).toLocaleDateString('es-CO', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
              })}
            </p>
          </div>
        </div>

        <div className="cert-mod-grid">
          {certificate.detalles.map((det) => (
            <div
              key={det.clave}
              className={`cert-mod-card ${det.estado === 'ok' ? 'cert-mod-card--ok' : 'cert-mod-card--error'}`}
            >
              <div className="cert-mod-card__header">
                <span className="cert-mod-card__name">{det.nombre}</span>
                <span
                  className={`cert-mod-badge ${det.estado === 'ok' ? 'cert-mod-badge--ok' : 'cert-mod-badge--error'}`}
                >
                  {det.estado === 'ok' ? 'OK' : 'Pendiente'}
                </span>
              </div>
              <p className="cert-mod-card__detail">{det.detalle}</p>
            </div>
          ))}
        </div>
      </div>
      <div
        style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end', marginTop: '12px' }}
        className="no-print"
      >
        <Button variant="outline" size="sm" onClick={handlePrint}>
          Imprimir
        </Button>
        <Button variant="primary" size="sm" onClick={onClose}>
          Cerrar
        </Button>
      </div>
    </div>
  );
};
