import { useState, type SubmitEvent } from 'react';
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
    <form className="search-form" onSubmit={handleSubmit}>
      <div className="input-group">
        <label>Código</label>
        <input
          type="text"
          placeholder="Ej. 123456789"
          value={codigo}
          onChange={(e) => {
            setCodigo(e.target.value);
            setGradoSeleccionado(null);
          }}
        />
      </div>

      <div className="input-group">
        <label>Curso</label>
        <select
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

      <button
        type="submit"
        className="btn-primary"
        disabled={loading || (!codigo && !gradoSeleccionado)}
      >
        <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
          />
        </svg>
        {loading ? 'Buscando...' : 'Buscar'}
      </button>
    </form>
  );
};
