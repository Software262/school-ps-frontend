import { useState, useEffect, useCallback, type SubmitEvent } from 'react';
import { Search } from 'lucide-react';
import { enrollmentApi } from '@/entities/student/api/enrollment';
import type { StudentSearchItem } from '@/entities/student/api/enrollment';
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
  const [loading, setLoading] = useState(false);
  const [filters, setFilters] = useState({ documento: '', nombre: '', date: '' });

  const executeSearch = useCallback(
    async (isInitial = false) => {
      setLoading(true);
      onSearchStart();
      try {
        const data = await enrollmentApi.searchStudents(
          isInitial ? {} : { documento: filters.documento, nombre: filters.nombre },
        );
        onSearchSuccess(data.estudiantes);
      } catch (error) {
        console.error('Error fetching students:', error);
      } finally {
        setLoading(false);
        onSearchEnd();
      }
    },
    [filters.documento, filters.nombre, onSearchStart, onSearchEnd, onSearchSuccess],
  );

  // Fetch initial data on mount
  useEffect(() => {
    let cancelled = false;
    const timer = setTimeout(() => {
      setLoading(true);
      onSearchStart();
      enrollmentApi
        .searchStudents({})
        .then((data) => {
          if (!cancelled) onSearchSuccess(data.estudiantes);
        })
        .catch((error: unknown) => {
          console.error('Error fetching students:', error);
        })
        .finally(() => {
          if (!cancelled) {
            setLoading(false);
            onSearchEnd();
          }
        });
    }, 0);
    return () => {
      cancelled = true;
      clearTimeout(timer);
    };
  }, [onSearchStart, onSearchEnd, onSearchSuccess]);

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
