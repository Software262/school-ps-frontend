import { useState } from 'react';
import { useLoadPupitreByStudent } from '@/features/load-pupitre-by-student/hooks/useLoadPupitreByStudent';
import { useLoadPupitresByGrade } from '@/features/load-pupitres-by-grade/hooks/useLoadPupitresByGrade';
import { useBulkUpdatePupitre } from '@/features/bulk-update-pupitre/hooks/useBulkUpdatePupitre';
import { SearchSection } from '@/features/classroom/components/SearchSection';
import { PupitreTable } from '@/features/classroom/components/PupitreTable';
import { UpdatePupitreForm } from '@/features/update-pupitre/components/UpdatePupitreForm';
import { BulkUpdateForm } from '@/features/bulk-update-pupitre/components/BulkUpdateForm';
import { SuccessModal } from '@/shared/ui/molecules/SuccessModal';

interface TableRow {
  id: number;
  estudiante_id: number;
  documento: string;
  nombre_estudiante: string;
  grado: string;
  estado_pupitre: boolean;
}

export default function ClassroomPage() {
  const { fetchPupitre, loading: loadingE } = useLoadPupitreByStudent();
  const { fetchPupitresByGrade, grados, loading: loadingG } = useLoadPupitresByGrade();
  const { loading: loadingBulk } = useBulkUpdatePupitre();

  const [tableData, setTableData] = useState<TableRow[]>([]);
  const [mostrarTabla, setMostrarTabla] = useState(false);
  const [mostrarBotonCurso, setMostrarBotonCurso] = useState(false);
  const [mensajeError, setMensajeError] = useState<string | null>(null);
  const [mensajeExito, setMensajeExito] = useState<string | null>(null);
  const [estudianteEditando, setEstudianteEditando] = useState<TableRow | null>(null);
  const [mostrarBulkForm, setMostrarBulkForm] = useState(false);
  const [gradoActual, setGradoActual] = useState<number | null>(null);
  const [gradoNombre, setGradoNombre] = useState<string>('');

  const loading = loadingE || loadingG || loadingBulk;

  const handleBuscar = async (codigo: string, gradoSeleccionado: number | null) => {
    setMensajeError(null);
    setTableData([]);
    setMostrarTabla(false);
    setEstudianteEditando(null);
    setMostrarBulkForm(false);

    if (codigo) {
      const data = await fetchPupitre(codigo.trim());
      if (data) {
        setTableData([{ ...data, id: data.id }]);
        setMostrarTabla(true);
        setMostrarBotonCurso(false);
        setGradoActual(null);
        setGradoNombre('');
      } else {
        setMensajeError('No se encontró ningún estudiante con ese código');
      }
    } else if (gradoSeleccionado) {
      const data = await fetchPupitresByGrade(gradoSeleccionado);
      if (data && data.length > 0) {
        setTableData(data.map((p) => ({ ...p, id: p.id })));
        setMostrarTabla(true);
        setMostrarBotonCurso(true);
        setGradoActual(gradoSeleccionado);
        const gradoEncontrado = grados.find((g) => g.id === gradoSeleccionado);
        setGradoNombre(gradoEncontrado?.nombre ?? '');
      } else {
        setMensajeError('No se encontraron estudiantes en este curso');
      }
    }
  };

  const handleExitoUpdate = async (nuevoEstado: boolean) => {
    if (gradoActual) {
      const data = await fetchPupitresByGrade(gradoActual);
      if (data) setTableData(data.map((p) => ({ ...p, id: p.id })));
    } else {
      setTableData((prev) =>
        prev.map((row) =>
          row.estudiante_id === estudianteEditando?.estudiante_id
            ? { ...row, estado_pupitre: nuevoEstado }
            : row,
        ),
      );
    }
    setEstudianteEditando(null);
    setMensajeExito('Estado del pupitre actualizado exitosamente');
  };

  const handleExitoBulk = async (total: number) => {
    setMostrarBulkForm(false);
    setMensajeExito(`Se actualizaron ${total.toString()} pupitres exitosamente`);
    if (gradoActual) {
      const data = await fetchPupitresByGrade(gradoActual);
      if (data) setTableData(data.map((p) => ({ ...p, id: p.id })));
    }
  };

  return (
    <div style={{ padding: '0 32px 32px 32px', maxWidth: '1200px', margin: '0 auto' }}>
      <div style={{ marginBottom: '20px', paddingTop: '10px' }}>
        <h1
          style={{
            fontSize: '1.875rem',
            fontWeight: 700,
            color: '#111827',
            margin: 0,
            marginBottom: '4px',
          }}
        >
          Salón de Tesorería
        </h1>
        <p style={{ fontSize: '1rem', color: '#6b7280', margin: 0 }}>
          Control del mobiliario asignado
        </p>
      </div>

      <SearchSection
        grados={grados}
        loading={loading}
        onBuscar={(codigo, grado) => {
          void handleBuscar(codigo, grado);
        }}
      />

      {mensajeError && (
        <div
          style={{
            marginTop: '16px',
            padding: '12px',
            borderRadius: '6px',
            backgroundColor: 'var(--status-red-bg)',
            color: 'var(--status-red)',
            fontSize: '0.875rem',
          }}
        >
          {mensajeError}
        </div>
      )}

      {mostrarTabla && (
        <div style={{ marginTop: '24px' }}>
          {mostrarBotonCurso && (
            <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '12px' }}>
              <button
                onClick={() => {
                  setMostrarBulkForm(true);
                  setEstudianteEditando(null);
                }}
                style={{
                  backgroundColor: '#f97316',
                  color: 'white',
                  padding: '10px 24px',
                  borderRadius: '8px',
                  border: 'none',
                  cursor: 'pointer',
                }}
              >
                Actualizar Curso Completo
              </button>
            </div>
          )}
          <PupitreTable
            data={tableData}
            onEdit={(row) => {
              setEstudianteEditando(row);
              setMostrarBulkForm(false);
            }}
          />
        </div>
      )}

      {estudianteEditando && (
        <UpdatePupitreForm
          estudiante_id={estudianteEditando.estudiante_id}
          nombre={estudianteEditando.nombre_estudiante}
          estadoActual={estudianteEditando.estado_pupitre}
          onCancelar={() => {
            setEstudianteEditando(null);
          }}
          onExito={(nuevoEstado) => {
            void handleExitoUpdate(nuevoEstado);
          }}
        />
      )}

      {mostrarBulkForm && gradoActual && (
        <BulkUpdateForm
          grado_id={gradoActual}
          grado_nombre={gradoNombre}
          onCancelar={() => {
            setMostrarBulkForm(false);
          }}
          onExito={(total) => {
            void handleExitoBulk(total);
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
