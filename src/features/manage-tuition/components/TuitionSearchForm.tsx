import { useState, type SyntheticEvent } from 'react';
import { Search } from 'lucide-react';
import { Button } from '@/shared/ui/atoms/Button';
import { Input } from '@/shared/ui/atoms/Input';
import { searchTuitionStudents } from '@/features/manage-tuition/api/tuitionApi';
import type { StudentSearchItem } from '@/entities/student/model/types';

interface TuitionSearchFormProps {
  onResults: (results: StudentSearchItem[]) => void;
}

export const TuitionSearchForm = ({ onResults }: TuitionSearchFormProps) => {
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleSubmit = async (e: SyntheticEvent) => {
    e.preventDefault();
    if (!query.trim()) return;

    setLoading(true);
    setErrorMsg('');
    try {
      const data = await searchTuitionStudents(query.trim());
      onResults(data.estudiantes);

      if (data.estudiantes.length === 0) {
        setErrorMsg('No se encontraron estudiantes con esos datos.');
      }
    } catch {
      setErrorMsg('Error al conectar con el servidor.');
      onResults([]);
    } finally {
      setLoading(false);
    }
  };

  const canSearch = !loading && query.trim().length > 0;

  return (
    <div className="card">
      <h3 className="search-header">
        <Search size={20} /> Búsqueda de Estudiante
      </h3>
      <div className="search-info">Ingrese el nombre o la cédula del estudiante.</div>

      {errorMsg && (
        <div className="alert alert-error" style={{ marginTop: '12px' }}>
          {errorMsg}
        </div>
      )}

      <form
        onSubmit={(e) => {
          void handleSubmit(e);
        }}
      >
        <div style={{ display: 'flex', gap: '16px', marginTop: '16px', alignItems: 'flex-end' }}>
          <div style={{ flex: 1 }}>
            <Input
              label="Buscar por Nombre o Cédula"
              placeholder="Ej. Juan Pérez o 1023456789"
              value={query}
              onChange={(e) => {
                setQuery(e.target.value);
              }}
              disabled={loading}
            />
          </div>
          <Button type="submit" variant="primary" disabled={!canSearch}>
            <Search size={16} style={{ marginRight: '8px' }} />
            {loading ? 'Buscando...' : 'Buscar'}
          </Button>
        </div>
      </form>
    </div>
  );
};
