import { Search, Info } from 'lucide-react';
import { useState, type SubmitEvent } from 'react';
import { Button } from '@/shared/ui/atoms/Button';
import { Input } from '@/shared/ui/atoms/Input';
import type { GradeInfo } from '@/features/load-pupitres-by-grade/types';

interface SearchSectionProps {
  grados: GradeInfo[];
  loading: boolean;
  onBuscar: (codigo: string, gradoSeleccionado: number | null) => void;
}

export const SearchSection = ({ grados, loading, onBuscar }: SearchSectionProps) => {
  const [codigo, setCodigo] = useState('');
  const [gradoSeleccionado, setGradoSeleccionado] = useState<number | null>(null);

  const handleSubmit = (e: SubmitEvent) => {
    e.preventDefault();
    onBuscar(codigo, gradoSeleccionado);
    setCodigo('');
    setGradoSeleccionado(null);
  };

  return (
    <div
      style={{
        padding: '24px',
        backgroundColor: '#fff',
        borderRadius: '12px',
        border: '1px solid #e5e7eb',
        boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)',
      }}
    >
      <h3
        style={{
          fontSize: '1.25rem',
          fontWeight: 600,
          color: '#111827',
          marginBottom: '20px',
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
        }}
      >
        <Search size={22} /> Filtros de búsqueda
      </h3>

      <div
        style={{
          backgroundColor: '#f9fafb',
          padding: '12px 16px',
          borderRadius: '8px',
          border: '1px dashed #d1d5db',
          marginBottom: '20px',
          color: '#4b5563',
          fontSize: '0.875rem',
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
        }}
      >
        <Info size={18} color="#6b7280" />
        <span>Busque por código de estudiante o seleccione un curso.</span>
      </div>

      <form onSubmit={handleSubmit}>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: '20px',
            alignItems: 'end',
          }}
        >
          <Input
            label="Código"
            placeholder="Ej. 123456789"
            value={codigo}
            onChange={(e) => {
              setCodigo(e.target.value);
              setGradoSeleccionado(null);
            }}
          />

          <div className="input-container">
            <label
              style={{
                display: 'block',
                fontSize: '0.875rem',
                fontWeight: 500,
                color: '#374151',
                marginBottom: '8px',
              }}
            >
              Curso
            </label>
            <select
              style={{
                width: '100%',
                padding: '10px',
                borderRadius: '8px',
                border: '1px solid #d1d5db',
                backgroundColor: '#fff',
                fontSize: '1rem',
              }}
              value={gradoSeleccionado ?? ''}
              onChange={(e) => {
                setGradoSeleccionado(Number(e.target.value));
                setCodigo('');
              }}
            >
              <option value="">Seleccione un curso</option>
              {grados.map((g) => (
                <option key={g.id} value={g.id}>
                  {g.nombre}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '24px' }}>
          <Button
            type="submit"
            disabled={loading || (!codigo && !gradoSeleccionado)}
            style={{
              backgroundColor: '#991b1b',
              color: 'white',
              padding: '10px 24px',
              borderRadius: '8px',
              border: 'none',
              cursor: 'pointer',
            }}
          >
            {loading ? 'Buscando...' : 'Buscar'}
          </Button>
        </div>
      </form>
    </div>
  );
};
