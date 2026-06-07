import { useState, useRef, type ChangeEvent, type DragEvent, type SubmitEvent } from 'react';
import { Upload, AlertCircle, CheckCircle, FileSpreadsheet } from 'lucide-react';
import { Modal } from '@/shared/ui/atoms/Modal';
import { Button } from '@/shared/ui/atoms/Button';
import { Input } from '@/shared/ui/atoms/Input';
import { registerMassiveCsv } from '../api/massiveApi';
import type { MassEnrollmentResponse } from '../types';

interface MassiveEnrollmentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export const MassiveEnrollmentModal = ({
  isOpen,
  onClose,
  onSuccess,
}: MassiveEnrollmentModalProps) => {
  const [periodoId, setPeriodoId] = useState(1);
  const [anio, setAnio] = useState(() => new Date().getFullYear());
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<MassEnrollmentResponse | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const selectedFile = e.target.files[0];
      if (selectedFile.name.toLowerCase().endsWith('.csv')) {
        setFile(selectedFile);
        setError(null);
      } else {
        setError('Por favor, seleccione un archivo CSV válido.');
        setFile(null);
      }
    }
  };

  const handleDragOver = (e: DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: DragEvent) => {
    e.preventDefault();
    if (e.dataTransfer.files.length > 0) {
      const selectedFile = e.dataTransfer.files[0];
      if (selectedFile.name.toLowerCase().endsWith('.csv')) {
        setFile(selectedFile);
        setError(null);
      } else {
        setError('Por favor, seleccione un archivo CSV válido.');
        setFile(null);
      }
    }
  };

  const handleSubmit = async (e: SubmitEvent) => {
    e.preventDefault();
    if (!file) {
      setError('Debe seleccionar un archivo CSV antes de enviar.');
      return;
    }
    setError(null);
    setResult(null);
    setLoading(true);

    try {
      const response = await registerMassiveCsv(periodoId, anio, file);
      setResult(response);
      onSuccess();
    } catch (err: unknown) {
      console.error(err);
      const msg =
        err instanceof Error ? err.message : 'Error al procesar el archivo de matrículas.';
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setFile(null);
    setResult(null);
    setError(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Matrícula Masiva (CSV)" width={600}>
      {!result ? (
        <form
          onSubmit={(e) => {
            void handleSubmit(e);
          }}
          style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}
        >
          {error && (
            <div
              style={{
                padding: '12px',
                borderRadius: '6px',
                backgroundColor: 'var(--status-red-bg)',
                color: 'var(--status-red)',
                fontSize: '0.875rem',
                fontWeight: 500,
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
              }}
            >
              <AlertCircle size={18} />
              {error}
            </div>
          )}

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            <div className="input-container">
              <label className="input-label">Periodo Académico *</label>
              <select
                value={periodoId}
                onChange={(e) => {
                  setPeriodoId(Number(e.target.value));
                }}
                disabled={loading}
                style={{
                  width: '100%',
                  padding: '10px 12px',
                  borderRadius: 'var(--radius-md, 8px)',
                  border: '1px solid var(--border)',
                  backgroundColor: '#fff',
                  fontSize: '1rem',
                  color: 'var(--text-main)',
                  outline: 'none',
                  transition: 'border-color 0.2s',
                  cursor: 'pointer',
                }}
              >
                {[1, 2, 3, 4].map((p) => (
                  <option key={p} value={p}>
                    Periodo {p}
                  </option>
                ))}
              </select>
            </div>

            <Input
              label="Año Lectivo *"
              type="number"
              required
              value={anio}
              onChange={(e) => {
                setAnio(Number(e.target.value));
              }}
              disabled={loading}
            />
          </div>

          <div
            onDragOver={handleDragOver}
            onDrop={handleDrop}
            onClick={() => {
              fileInputRef.current?.click();
            }}
            style={{
              border: '2px dashed var(--border)',
              borderRadius: 'var(--radius-lg, 12px)',
              padding: '32px 16px',
              textAlign: 'center',
              backgroundColor: '#f8fafc',
              cursor: 'pointer',
              transition: 'all 0.2s',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '12px',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = 'var(--primary)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = 'var(--border)';
            }}
          >
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              accept=".csv"
              style={{ display: 'none' }}
              disabled={loading}
            />
            {file ? (
              <>
                <FileSpreadsheet size={40} color="var(--status-green)" />
                <div>
                  <p style={{ fontWeight: 600, margin: '0 0 4px 0', color: 'var(--text-main)' }}>
                    {file.name}
                  </p>
                  <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)', margin: 0 }}>
                    {(file.size / 1024).toFixed(1)} KB — Listo para procesar
                  </p>
                </div>
              </>
            ) : (
              <>
                <Upload size={40} color="var(--text-muted)" />
                <div>
                  <p style={{ fontWeight: 600, margin: '0 0 4px 0', color: 'var(--text-main)' }}>
                    Arrastre su archivo CSV aquí o haga clic para buscar
                  </p>
                  <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)', margin: 0 }}>
                    Solo se admiten archivos .csv con el formato de matrícula
                  </p>
                </div>
              </>
            )}
          </div>

          <div
            style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '8px' }}
          >
            <Button type="button" variant="outline" onClick={onClose} disabled={loading}>
              Cancelar
            </Button>
            <Button type="submit" variant="primary" disabled={loading || !file}>
              {loading ? 'Procesando...' : 'Comenzar Carga'}
            </Button>
          </div>
        </form>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              borderBottom: '1px solid var(--border)',
              paddingBottom: '16px',
            }}
          >
            {result.errors === 0 ? (
              <CheckCircle size={32} color="var(--status-green)" />
            ) : (
              <AlertCircle size={32} color="var(--status-yellow)" />
            )}
            <div>
              <h4 style={{ margin: 0, fontSize: '1.1rem', fontWeight: 600 }}>
                Carga Masiva Completada
              </h4>
              <p style={{ margin: 0, fontSize: '0.875rem', color: 'var(--text-muted)' }}>
                Se procesaron {result.processed} registros en total.
              </p>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px' }}>
            <div
              style={{
                backgroundColor: '#f8fafc',
                padding: '16px',
                borderRadius: '8px',
                textAlign: 'center',
                border: '1px solid var(--border)',
              }}
            >
              <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)', margin: '0 0 4px 0' }}>
                Procesados
              </p>
              <p
                style={{
                  fontSize: '1.75rem',
                  fontWeight: 700,
                  margin: 0,
                  color: 'var(--text-main)',
                }}
              >
                {result.processed}
              </p>
            </div>
            <div
              style={{
                backgroundColor: 'var(--status-green-bg)',
                padding: '16px',
                borderRadius: '8px',
                textAlign: 'center',
                border: '1px solid rgba(16, 185, 129, 0.2)',
              }}
            >
              <p
                style={{
                  fontSize: '0.875rem',
                  color: 'var(--status-green)',
                  margin: '0 0 4px 0',
                  fontWeight: 500,
                }}
              >
                Exitosos
              </p>
              <p
                style={{
                  fontSize: '1.75rem',
                  fontWeight: 700,
                  margin: 0,
                  color: 'var(--status-green)',
                }}
              >
                {result.success}
              </p>
            </div>
            <div
              style={{
                backgroundColor: result.errors > 0 ? 'var(--status-red-bg)' : '#f8fafc',
                padding: '16px',
                borderRadius: '8px',
                textAlign: 'center',
                border:
                  result.errors > 0
                    ? '1px solid rgba(239, 68, 68, 0.2)'
                    : '1px solid var(--border)',
              }}
            >
              <p
                style={{
                  fontSize: '0.875rem',
                  color: result.errors > 0 ? 'var(--status-red)' : 'var(--text-muted)',
                  margin: '0 0 4px 0',
                  fontWeight: 500,
                }}
              >
                Fallidos
              </p>
              <p
                style={{
                  fontSize: '1.75rem',
                  fontWeight: 700,
                  margin: 0,
                  color: result.errors > 0 ? 'var(--status-red)' : 'var(--text-muted)',
                }}
              >
                {result.errors}
              </p>
            </div>
          </div>

          {result.error_details.length > 0 && (
            <div>
              <h5
                style={{
                  margin: '0 0 8px 0',
                  fontWeight: 600,
                  fontSize: '0.875rem',
                  color: 'var(--text-main)',
                }}
              >
                Detalle de Errores:
              </h5>
              <div
                style={{
                  maxHeight: '180px',
                  overflowY: 'auto',
                  border: '1px solid var(--border)',
                  borderRadius: '8px',
                  padding: '12px',
                  backgroundColor: '#fff',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '8px',
                }}
              >
                {result.error_details.map((detail: string, index: number) => (
                  <div
                    key={`massive-err-${index.toString()}`}
                    style={{
                      fontSize: '0.875rem',
                      color: 'var(--status-red)',
                      display: 'flex',
                      gap: '6px',
                      alignItems: 'flex-start',
                    }}
                  >
                    <span style={{ fontWeight: 600 }}>•</span>
                    <span>{detail}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div
            style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '8px' }}
          >
            {result.errors > 0 && (
              <Button type="button" variant="outline" onClick={handleReset}>
                Intentar Nuevamente
              </Button>
            )}
            <Button type="button" variant="primary" onClick={onClose}>
              Finalizar
            </Button>
          </div>
        </div>
      )}
    </Modal>
  );
};
