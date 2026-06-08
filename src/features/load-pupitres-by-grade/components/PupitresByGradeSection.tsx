import { Search } from 'lucide-react';
import { useState } from 'react';
import { Button } from '@/shared/ui/atoms/Button';
import { PupitreTable } from '@/features/classroom/components/PupitreTable';
import { useLoadPupitresByGrade } from '../hooks/useLoadPupitresByGrade';
import type { PupitreByGrade } from '../types';

interface PupitresByGradeSectionProps {
  onSeleccionar: (pupitre: PupitreByGrade) => void;
}

export const PupitresByGradeSection = ({ onSeleccionar }: PupitresByGradeSectionProps) => {
  const [gradoSeleccionado, setGradoSeleccionado] = useState<number | null>(null);
  const { loading, error, grados, pupitres, fetchPupitresByGrade } = useLoadPupitresByGrade();

  const handleSubmit = async (e: React.SyntheticEvent) => {
    e.preventDefault();
    if (gradoSeleccionado) {
      await fetchPupitresByGrade(gradoSeleccionado);
    }
  };

  return (
    <div className="card" style={{ marginTop: '24px' }}>
      <h3
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          fontSize: '1.1rem',
          marginBottom: '16px',
        }}
      >
        <Search size={20} /> Buscar por Curso
      </h3>

      <form onSubmit={(e) => void handleSubmit(e)}>
        <select
          value={gradoSeleccionado ?? ''}
          onChange={(e) => {
            setGradoSeleccionado(Number(e.target.value));
          }}
        >
          <option value="">Seleccione un curso</option>
          {grados.map((g) => (
            <option key={g.id} value={g.id}>
              {g.nombre}
            </option>
          ))}
        </select>

        <Button type="submit" disabled={loading || !gradoSeleccionado}>
          {loading ? 'Buscando...' : 'Buscar'}
        </Button>
      </form>

      {error && <div className="error">{error}</div>}

      {pupitres.length > 0 && (
        <div style={{ marginTop: '16px' }}>
          <PupitreTable
            data={pupitres}
            onEdit={(p) => {
              onSeleccionar(p as unknown as PupitreByGrade);
            }}
          />
        </div>
      )}
    </div>
  );
};
