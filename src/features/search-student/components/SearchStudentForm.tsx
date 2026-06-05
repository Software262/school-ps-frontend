import { useState, useCallback, useEffect, useRef, type SubmitEvent } from 'react';
import { Search } from 'lucide-react';
import { useSearchStudents } from '../hooks/useSearchStudents';
import type { StudentSearchItem } from '@/entities/student/model/types';
import { Button } from '@/shared/ui/atoms/Button';
import { Input } from '@/shared/ui/atoms/Input';

interface SearchStudentFormProps {
  onSearchSuccess: (students: StudentSearchItem[]) => void;
  onSearchStart: () => void;
  onSearchEnd: () => void;
}

export const SearchStudentForm = ({
  onSearchSuccess,
  onSearchStart,
  onSearchEnd,
}: SearchStudentFormProps) => {
  const { loading, fetchStudents } = useSearchStudents();
  const [filters, setFilters] = useState({ documento: '', nombre: '', date: '' });
  const mountedRef = useRef(true);

  const executeSearch = useCallback(
    async (isInitial = false) => {
      onSearchStart();
      try {
        const data = await fetchStudents(
          isInitial ? {} : { documento: filters.documento, nombre: filters.nombre },
        );
        if (mountedRef.current && data) {
          onSearchSuccess(data.estudiantes);
        }
      } catch (error) {
        console.error('Error fetching students:', error);
      } finally {
        if (mountedRef.current) {
          onSearchEnd();
        }
      }
    },
    [filters.documento, filters.nombre, onSearchStart, onSearchEnd, onSearchSuccess, fetchStudents],
  );

  useEffect(() => {
    mountedRef.current = true;
    void executeSearch(true);
    return () => {
      mountedRef.current = false;
    };
  }, [executeSearch]);

  const handleSubmit = (e: SubmitEvent) => {
    e.preventDefault();
    void executeSearch(false);
  };

  return (
    <div className="card">
      <h3
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          fontSize: '1.1rem',
          marginBottom: '16px',
        }}
      >
        <Search size={20} /> Filtros de búsqueda
      </h3>
      <div
        style={{
          background: '#f0fdf4',
          border: '1px solid #bbf7d0',
          padding: '12px',
          borderRadius: '8px',
          marginBottom: '16px',
          color: '#166534',
          fontSize: '0.875rem',
        }}
      >
        Ingrese el código o nombre del estudiante y seleccione una fecha para iniciar la búsqueda
      </div>

      <form onSubmit={handleSubmit}>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '16px',
            alignItems: 'end',
          }}
        >
          <Input
            label="Código"
            placeholder="Ej. 123123"
            value={filters.documento}
            onChange={(e) => {
              setFilters({ ...filters, documento: e.target.value });
            }}
          />
          <Input
            label="Nombre"
            placeholder="Ej. Juan"
            value={filters.nombre}
            onChange={(e) => {
              setFilters({ ...filters, nombre: e.target.value });
            }}
          />
          <Input
            label="Fecha"
            type="date"
            value={filters.date}
            onChange={(e) => {
              setFilters({ ...filters, date: e.target.value });
            }}
          />
          <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
            <Button
              type="submit"
              variant="primary"
              style={{ backgroundColor: '#7f1d1d' }}
              disabled={loading}
            >
              <Search size={16} style={{ marginRight: '8px' }} />
              Buscar
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
};
