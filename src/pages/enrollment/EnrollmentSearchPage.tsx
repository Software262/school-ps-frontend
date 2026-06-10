import { useState, useCallback } from 'react';
import { useNavigate } from '@tanstack/react-router';
import { SearchStudentForm } from '@/features/search-student/components/SearchStudentForm';
import type { StudentSearchItem } from '@/entities/student/model/types';
import { Button } from '@/shared/ui/atoms/Button';
import { StatusBadge } from '@/entities/student/ui/StatusBadge';
import { ManualEnrollmentModal } from '@/features/manual-enrollment/components/ManualEnrollmentModal';
import './Enrollment.css';

export const EnrollmentSearch = () => {
  const navigate = useNavigate();
  const [students, setStudents] = useState<StudentSearchItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState<number | null>(null);

  // Modals state
  const [isManualModalOpen, setIsManualModalOpen] = useState(false);

  const handleSearchStart = useCallback(() => {
    setLoading(true);
  }, []);

  const handleSearchEnd = useCallback(() => {
    setLoading(false);
  }, []);

  const handleSearchSuccess = useCallback((results: StudentSearchItem[]) => {
    setStudents(results);
    setSelectedStudent(null);
  }, []);

  const handleManage = useCallback(() => {
    if (selectedStudent !== null) {
      void navigate({ to: `/dashboard/enrollment/student/${selectedStudent.toString()}/` });
    }
  }, [navigate, selectedStudent]);

  const handleManualSuccess = (studentId: number) => {
    setIsManualModalOpen(false);
    void navigate({ to: `/dashboard/enrollment/student/${studentId.toString()}/` });
  };

  return (
    <div className="enrollment-view">
      <div className="page-title">
        <h1>Módulo de Matrícula</h1>
        <p>Gestión de matrículas y pagos</p>
      </div>
      <div className="enrollment-actions">
        <Button
          variant="primary"
          onClick={() => {
            setIsManualModalOpen(true);
          }}
        >
          Matrícula Manual
        </Button>
      </div>

      <SearchStudentForm
        onSearchStart={handleSearchStart}
        onSearchEnd={handleSearchEnd}
        onSearchSuccess={handleSearchSuccess}
      />

      <div className="table-container">
        <table className="data-table">
          <thead>
            <tr>
              <th style={{ width: '40px' }}></th>
              <th>Código</th>
              <th>Nombre</th>
              <th>Grado</th>
              <th>Período</th>
              <th>Estado</th>
              <th>Pagos Realizados</th>
              <th>Saldo Pendiente</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={8} style={{ textAlign: 'center' }}>
                  Cargando...
                </td>
              </tr>
            ) : students.length === 0 ? (
              <tr>
                <td colSpan={8} style={{ textAlign: 'center' }}>
                  No se encontraron resultados
                </td>
              </tr>
            ) : (
              students.map((student) => (
                <tr
                  key={student.estudiante_id}
                  onClick={() => {
                    setSelectedStudent(student.estudiante_id);
                  }}
                  style={{ cursor: 'pointer' }}
                >
                  <td>
                    <input
                      type="radio"
                      name="studentSelect"
                      checked={selectedStudent === student.estudiante_id}
                      onChange={() => {
                        setSelectedStudent(student.estudiante_id);
                      }}
                    />
                  </td>
                  <td>{student.documento}</td>
                  <td style={{ fontWeight: 500 }}>{student.nombre}</td>
                  <td>{student.grado_nombre}</td>
                  <td>{student.anio.toString()}</td>
                  <td>
                    <StatusBadge status={student.estado_matricula} />
                  </td>
                  <td>{student.pagos_realizados.toString()}</td>
                  <td style={{ fontWeight: 600 }}>${student.saldo_pendiente.toLocaleString()}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {selectedStudent !== null && (
        <div className="selected-banner">
          <p>Ha seleccionado un estudiante. Puede continuar con la gestión de matrícula.</p>
          <Button onClick={handleManage} variant="primary">
            Gestionar
          </Button>
        </div>
      )}

      {/* Manual enrollment modal */}
      <ManualEnrollmentModal
        isOpen={isManualModalOpen}
        onClose={() => {
          setIsManualModalOpen(false);
        }}
        onSuccess={handleManualSuccess}
      />
    </div>
  );
};
