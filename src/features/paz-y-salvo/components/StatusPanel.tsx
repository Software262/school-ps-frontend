import { useState, useEffect } from 'react';
import { Spinner } from '@/shared/ui/atoms/Spinner';
import { Button } from '@/shared/ui/atoms/Button';
import { Badge } from '@/shared/ui/atoms/Badge';
import { ModuleStatusGrid } from './ModuleStatusGrid';
import { CertificateResult } from './CertificateResult';
import {
  getStudentStatus,
  getTeacherStatus,
  generateStudentPazYSalvo,
  generateTeacherPazYSalvo,
} from '@/features/paz-y-salvo/api/pazYSalvoApi';
import type { StudentStatusResult, GenerateResponse } from '@/features/paz-y-salvo/model/types';

interface StatusPanelProps {
  entityId: number;
  entityType: 'student' | 'teacher';
}

export const StatusPanel = ({ entityId, entityType }: StatusPanelProps) => {
  const [status, setStatus] = useState<StudentStatusResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [certificate, setCertificate] = useState<GenerateResponse | null>(null);
  const [error, setError] = useState('');

  useEffect(() => {
    const load = async () => {
      setStatus(null);
      setCertificate(null);
      setError('');
      setLoading(true);
      try {
        const data =
          entityType === 'student'
            ? await getStudentStatus(entityId)
            : await getTeacherStatus(entityId);
        setStatus(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Error al consultar el estado');
      } finally {
        setLoading(false);
      }
    };

    void load();
  }, [entityId, entityType]);

  const handleGenerate = () => {
    void (async () => {
      setGenerating(true);
      setError('');
      try {
        const data =
          entityType === 'student'
            ? await generateStudentPazYSalvo(entityId)
            : await generateTeacherPazYSalvo(entityId);
        setCertificate(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Error al generar el paz y salvo');
      } finally {
        setGenerating(false);
      }
    })();
  };

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '48px' }}>
        <Spinner size={32} />
        <p style={{ color: 'var(--text-muted)', marginTop: '12px' }}>Consultando módulos...</p>
      </div>
    );
  }

  if (error) {
    return <div className="error-alert">{error}</div>;
  }

  if (!status) return null;

  return (
    <div>
      <div className="card" style={{ marginBottom: '16px' }}>
        <h3 style={{ margin: '0 0 12px', fontSize: '1rem' }}>Información</h3>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
            gap: '12px',
          }}
        >
          <div>
            <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Nombre</p>
            <p style={{ fontWeight: 500 }}>{status.entidad.nombre}</p>
          </div>
          <div>
            <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Documento</p>
            <p style={{ fontWeight: 500 }}>{status.entidad.documento}</p>
          </div>
          {'grado' in status.entidad && (
            <div>
              <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Grado</p>
              <p style={{ fontWeight: 500 }}>{(status.entidad as { grado: string }).grado}</p>
            </div>
          )}
        </div>
      </div>

      <div style={{ display: 'flex', gap: '12px', alignItems: 'center', marginBottom: '12px' }}>
        <span style={{ fontSize: '0.875rem', fontWeight: 600 }}>
          Estado:{' '}
          <Badge variant={status.paz_y_salvo ? 'green' : 'red'}>
            {status.paz_y_salvo ? 'Paz y Salvo' : 'Pendiente'}
          </Badge>
        </span>
        <span style={{ fontSize: '0.8125rem', color: 'var(--text-muted)' }}>
          {status.modulos_ok}/{status.total_modulos} módulos OK
        </span>
        <div style={{ marginLeft: 'auto' }}>
          <Button
            size="sm"
            variant={status.paz_y_salvo ? 'primary' : 'secondary'}
            onClick={handleGenerate}
            disabled={generating || !status.paz_y_salvo}
            title={
              !status.paz_y_salvo
                ? 'Debe estar a paz y salvo en todos los módulos'
                : 'Generar certificado'
            }
          >
            {generating ? <Spinner size={16} /> : 'Generar Paz y Salvo'}
          </Button>
        </div>
      </div>

      <ModuleStatusGrid modulos={status.modulos} />

      {certificate && (
        <CertificateResult
          certificate={certificate}
          onClose={() => {
            setCertificate(null);
          }}
        />
      )}
    </div>
  );
};
