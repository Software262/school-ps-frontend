import { useState, useEffect, useRef, useCallback, type SyntheticEvent } from 'react';
import { Spinner } from '@/shared/ui/atoms/Spinner';
import { searchStudents, searchTeachers } from '@/features/paz-y-salvo/api/pazYSalvoApi';
import type { SearchStudent, SearchTeacher } from '@/features/paz-y-salvo/model/types';
import './PazYSalvoSearch.css';

interface PazYSalvoSearchProps {
  onSelectStudent: (id: number) => void;
  onSelectTeacher: (id: number) => void;
}

type SearchType = 'student' | 'teacher';

export const PazYSalvoSearch = ({ onSelectStudent, onSelectTeacher }: PazYSalvoSearchProps) => {
  const [searchType, setSearchType] = useState<SearchType>('student');
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<(SearchStudent | SearchTeacher)[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const debounceRef = useRef<ReturnType<typeof setTimeout>>(undefined);

  const doSearch = useCallback(
    async (term: string) => {
      if (term.length < 2) {
        setResults([]);
        return;
      }
      setLoading(true);
      setError('');
      try {
        const data =
          searchType === 'student' ? await searchStudents(term) : await searchTeachers(term);
        setResults(data);
      } catch {
        setError('Error al buscar');
        setResults([]);
      } finally {
        setLoading(false);
      }
    },
    [searchType],
  );

  useEffect(() => {
    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }

    const term = query.trim();
    if (term.length < 2) {
      return;
    }

    debounceRef.current = setTimeout(() => {
      void doSearch(term);
    }, 300);

    return () => {
      if (debounceRef.current) {
        clearTimeout(debounceRef.current);
      }
    };
  }, [query, doSearch]);

  const handleSubmit = (e: SyntheticEvent) => {
    e.preventDefault();
    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }
    const term = query.trim();
    if (term.length >= 2) {
      void doSearch(term);
    }
  };

  const handleClear = () => {
    setQuery('');
    setResults([]);
    setError('');
  };

  const handleTypeToggle = (type: SearchType) => {
    setSearchType(type);
    handleClear();
  };

  const handleSelect = (item: SearchStudent | SearchTeacher) => {
    setQuery('');
    setResults([]);
    setError('');
    if (searchType === 'student') {
      onSelectStudent(item.id);
    } else {
      onSelectTeacher(item.id);
    }
  };

  const isSearchActive = query.trim().length > 0;

  return (
    <div className="filter-card">
      <div className="filter-header">
        <span className="filter-icon" aria-hidden="true">
          🔍
        </span>
        <h3 className="filter-title">Filtros de búsqueda</h3>
      </div>

      <div className="filter-info">
        Ingrese el documento o nombre del estudiante/docente para consultar su estado
      </div>

      <div style={{ display: 'flex', gap: '8px', marginBottom: '16px' }}>
        <button
          type="button"
          className={`btn btn-sm ${searchType === 'student' ? 'btn-primary' : 'btn-secondary'}`}
          onClick={() => {
            handleTypeToggle('student');
          }}
        >
          Estudiante
        </button>
        <button
          type="button"
          className={`btn btn-sm ${searchType === 'teacher' ? 'btn-primary' : 'btn-secondary'}`}
          onClick={() => {
            handleTypeToggle('teacher');
          }}
        >
          Docente
        </button>
      </div>

      <form className="filter-form" onSubmit={handleSubmit}>
        <div className="filter-fields" style={{ gridTemplateColumns: '1fr' }}>
          <div className="form-group" style={{ marginBottom: 0 }}>
            <label className="form-label" htmlFor="paz-search-input">
              {searchType === 'student'
                ? 'Nombre o documento del estudiante'
                : 'Nombre o documento del docente'}
            </label>
            <input
              id="paz-search-input"
              className="form-input"
              type="text"
              placeholder={
                searchType === 'student'
                  ? 'Ej: Juan Pérez o 12345678'
                  : 'Ej: María Gómez o 87654321'
              }
              value={query}
              onChange={(e) => {
                setQuery(e.target.value);
              }}
              autoFocus
            />
          </div>
        </div>

        <div className="filter-actions">
          {isSearchActive && (
            <button
              type="button"
              className="btn btn-secondary"
              onClick={() => {
                handleClear();
              }}
            >
              Limpiar
            </button>
          )}
          <button
            type="submit"
            className="btn btn-primary"
            disabled={loading || query.trim().length < 2}
          >
            {loading ? <Spinner size={16} /> : '🔍 Buscar'}
          </button>
        </div>
      </form>

      {error && (
        <div className="alert alert-error" style={{ marginTop: '12px' }}>
          {error}
        </div>
      )}

      {loading && (
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 12 }}>
          <Spinner size={16} />
          <span style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>Buscando...</span>
        </div>
      )}

      {results.length > 0 && (
        <div className="table-container" style={{ marginTop: '16px' }}>
          <table className="data-table">
            <thead>
              <tr>
                <th>Documento</th>
                <th>Nombre</th>
                {searchType === 'teacher' && <th>Asignatura</th>}
                <th style={{ width: 100 }}>Acción</th>
              </tr>
            </thead>
            <tbody>
              {results.map((r) => (
                <tr key={r.id}>
                  <td>{r.documento}</td>
                  <td>{r.nombre}</td>
                  {searchType === 'teacher' && <td>{(r as SearchTeacher).asignatura}</td>}
                  <td>
                    <button
                      type="button"
                      className="btn btn-sm btn-primary"
                      onClick={() => {
                        handleSelect(r);
                      }}
                    >
                      Consultar
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {query.trim().length >= 2 && results.length === 0 && !loading && !error && (
        <p style={{ textAlign: 'center', color: 'var(--text-muted)', marginTop: '16px' }}>
          No se encontraron resultados
        </p>
      )}
    </div>
  );
};
