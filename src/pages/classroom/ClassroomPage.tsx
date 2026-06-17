import { useState } from 'react';
import './Classroom.css';
import { useLoadPupitreByStudent } from '@/features/load-pupitre-by-student/hooks/useLoadPupitreByStudent';
import { useLoadPupitresByGrade } from '@/features/load-pupitres-by-grade/hooks/useLoadPupitresByGrade';
import { useBulkUpdatePupitre } from '@/features/bulk-update-pupitre/hooks/useBulkUpdatePupitre';
import { usePupitreComplementario } from '@/features/load-pupitre-complementario/hooks/usePupitreComplementario';
import { SearchSection } from '@/features/classroom/components/SearchSection';
import { PupitreTable } from '@/features/classroom/components/PupitreTable';
import { UpdatePupitreForm } from '@/features/update-pupitre/components/UpdatePupitreForm';
import { BulkConfirmModal } from '@/features/bulk-update-pupitre/components/BulkConfirmModal';
import { SuccessModal } from '@/shared/ui/molecules/SuccessModal';
import './ClassroomPage.css';

const formatCurrency = (amount: number) =>
  new Intl.NumberFormat('es-CO', {
    style: 'currency',
    currency: 'COP',
    minimumFractionDigits: 0,
  }).format(amount);

interface TableRow {
  id: number;
  estudiante_id: number;
  documento: string;
  nombre_estudiante: string;
  grado: string;
  estado: string;
  docente_titular?: string;
}

export default function ClassroomPage() {
  const { fetchPupitre, loading: loadingE } = useLoadPupitreByStudent();
  const { fetchPupitresByGrade, grados, loading: loadingG } = useLoadPupitresByGrade();
  const { bulkUpdate, loading: loadingBulk } = useBulkUpdatePupitre();
  const complementario = usePupitreComplementario();

  const [tableData, setTableData] = useState<TableRow[]>([]);
  const [mostrarTabla, setMostrarTabla] = useState(false);
  const [mensajeError, setMensajeError] = useState<string | null>(null);
  const [mensajeExito, setMensajeExito] = useState<string | null>(null);
  const [estudianteEditando, setEstudianteEditando] = useState<TableRow | null>(null);
  const [gradoActual, setGradoActual] = useState<number | null>(null);
  const [selectedIds, setSelectedIds] = useState<Set<number>>(() => new Set());
  const [mostrarConfirmBulk, setMostrarConfirmBulk] = useState(false);

  const loading = loadingE || loadingG || loadingBulk;

  const handleBuscar = async (codigo: string, gradoSeleccionado: number | null) => {
    setMensajeError(null);
    setTableData([]);
    setMostrarTabla(false);
    setEstudianteEditando(null);
    setSelectedIds(new Set());

    if (codigo) {
      const data = await fetchPupitre(codigo.trim());
      if (data) {
        setTableData([{ ...data, id: data.id }]);
        setMostrarTabla(true);
        setGradoActual(null);
      } else {
        setMensajeError('No se encontró ningún estudiante con ese código');
      }
    } else if (gradoSeleccionado) {
      const data = await fetchPupitresByGrade(gradoSeleccionado);
      if (data && data.length > 0) {
        setTableData(data.map((p) => ({ ...p, id: p.id })));
        setMostrarTabla(true);
        setGradoActual(gradoSeleccionado);
      } else {
        setMensajeError('No se encontraron estudiantes en este curso');
      }
    }
  };

  const handleToggleSelect = (estudianteId: number) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(estudianteId)) {
        next.delete(estudianteId);
      } else {
        next.add(estudianteId);
      }
      return next;
    });
  };

  const handleExitoUpdate = async () => {
    if (gradoActual) {
      const data = await fetchPupitresByGrade(gradoActual);
      if (data) setTableData(data.map((p) => ({ ...p, id: p.id })));
    } else if (estudianteEditando) {
      const data = await fetchPupitre(estudianteEditando.documento);
      if (data) setTableData([{ ...data, id: data.id }]);
    }
    setEstudianteEditando(null);
    setMensajeExito('Estado de pago actualizado exitosamente');
  };

  const handleConfirmarBulk = async () => {
    if (!gradoActual || selectedIds.size === 0) return;

    const result = await bulkUpdate(gradoActual, Array.from(selectedIds));
    if (result) {
      setMostrarConfirmBulk(false);
      setMensajeExito(
        `Se confirmaron ${result.total_actualizados.toString()} pago(s) exitosamente`,
      );
      setSelectedIds(new Set());
      const data = await fetchPupitresByGrade(gradoActual);
      if (data) setTableData(data.map((p) => ({ ...p, id: p.id })));
    }
  };

  const estudiantesSeleccionados = tableData.filter((row) => selectedIds.has(row.estudiante_id));

  return (
    <div
      className="classroom-view"
      style={{ padding: '0 32px 32px 32px', maxWidth: '1200px', margin: '0 auto' }}
    >
      <div className="page-title" style={{ paddingTop: '10px' }}>
        <h1>Salón de Tesorería</h1>
        <p>Control del pago de mantenimiento de pupitre</p>
      </div>

      {complementario && (
        <div className="card complementario-card">
          <div className="complementario-label">{complementario.nombre}</div>
          <div className="complementario-value">{formatCurrency(complementario.valor)}</div>
          <div className="complementario-year">Año {complementario.anio.toString()}</div>
        </div>
      )}

      <SearchSection
        grados={grados}
        loading={loading}
        onBuscar={(codigo, grado) => {
          void handleBuscar(codigo, grado);
        }}
      />

      {mensajeError && <div className="error-alert">{mensajeError}</div>}

      {mostrarTabla && (
        <div className="card">
          {gradoActual && selectedIds.size > 0 && (
            <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '12px' }}>
              <button
                type="button"
                className="btn-primary"
                onClick={() => {
                  setMostrarConfirmBulk(true);
                }}
                disabled={loadingBulk}
              >
                Confirmar pago ({selectedIds.size.toString()} seleccionados)
              </button>
            </div>
          )}
          <PupitreTable
            data={tableData}
            selectedIds={gradoActual ? selectedIds : undefined}
            onToggleSelect={gradoActual ? handleToggleSelect : undefined}
            onConfirmarPago={(row) => {
              setEstudianteEditando(row);
            }}
          />
        </div>
      )}

      {estudianteEditando && (
        <UpdatePupitreForm
          isOpen={!!estudianteEditando}
          estudiante_id={estudianteEditando.estudiante_id}
          nombre={estudianteEditando.nombre_estudiante}
          estadoActual={estudianteEditando.estado}
          valorComplementario={complementario?.valor}
          onCancelar={() => {
            setEstudianteEditando(null);
          }}
          onExito={() => {
            void handleExitoUpdate();
          }}
        />
      )}

      {mostrarConfirmBulk && (
        <BulkConfirmModal
          estudiantes={estudiantesSeleccionados.map((e) => ({
            estudiante_id: e.estudiante_id,
            documento: e.documento,
            nombre_estudiante: e.nombre_estudiante,
            grado: e.grado,
          }))}
          valorUnitario={complementario?.valor ?? 0}
          loading={loadingBulk}
          onCancelar={() => {
            setMostrarConfirmBulk(false);
          }}
          onConfirmar={() => {
            void handleConfirmarBulk();
          }}
        />
      )}

      <SuccessModal
        isOpen={!!mensajeExito}
        mensaje={mensajeExito ?? ''}
        onClose={() => {
          setMensajeExito(null);
        }}
      />
    </div>
  );
}
