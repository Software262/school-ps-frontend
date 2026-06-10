import { useState } from 'react';
import { useLoadPupitreByStudent } from '@/features/load-pupitre-by-student/hooks/useLoadPupitreByStudent';
import { useLoadPupitresByGrade } from '@/features/load-pupitres-by-grade/hooks/useLoadPupitresByGrade';
import { useBulkUpdatePupitre } from '@/features/bulk-update-pupitre/hooks/useBulkUpdatePupitre';
import { SearchSection } from '@/features/classroom/components/SearchSection';
import { PupitreTable } from '@/features/classroom/components/PupitreTable';
import { UpdatePupitreForm } from '@/features/update-pupitre/components/UpdatePupitreForm';
import { BulkUpdateForm } from '@/features/bulk-update-pupitre/components/BulkUpdateForm';
import { SuccessModal } from '@/shared/ui/molecules/SuccessModal';
import './ClassroomPage.css';

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
    <div className="classroom-view">
      <div className="page-title">
        <h1>Salón de Tesorería</h1>
        <p>Control del mobiliario asignado</p>
      </div>

      <div className="card">
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
          Busque por código de estudiante o seleccione un curso para ver el listado completo.
        </div>
        <SearchSection
          grados={grados}
          loading={loading}
          onBuscar={(codigo, grado) => {
            void handleBuscar(codigo, grado);
          }}
        />
      </div>

      {mensajeError && <div className="error-alert">{mensajeError}</div>}

      {mostrarTabla && (
        <div className="card">
          {mostrarBotonCurso && (
            <div className="bulk-update-section">
              <button
                className="btn-orange"
                onClick={() => {
                  setMostrarBulkForm(true);
                  setEstudianteEditando(null);
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
          isOpen={!!estudianteEditando}
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
          isOpen={mostrarBulkForm}
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
