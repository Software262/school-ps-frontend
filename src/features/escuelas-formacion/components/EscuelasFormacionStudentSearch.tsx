import { useImperativeHandle, useRef, useState, type Ref, type SubmitEvent } from 'react';
import { Search, UserPlus } from 'lucide-react';
import { Badge } from '@/shared/ui/atoms/Badge';
import { Spinner } from '@/shared/ui/atoms/Spinner';
import type { Student } from '../model/types';
import { useStudentSearch } from '../hooks';

export interface EscuelasFormacionStudentSearchHandle {
  focus: () => void;
}

interface EscuelasFormacionStudentSearchProps {
  ref?: Ref<EscuelasFormacionStudentSearchHandle>;
  onEnroll: (student: Student) => void;
}

export const EscuelasFormacionStudentSearch = ({
  ref,
  onEnroll,
}: EscuelasFormacionStudentSearchProps) => {
  const [searchInput, setSearchInput] = useState('');
  const studentSearch = useStudentSearch();
  const searchInputRef = useRef<HTMLInputElement>(null);
  const searchCardRef = useRef<HTMLDivElement>(null);

  useImperativeHandle(ref, () => ({
    focus() {
      searchCardRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      setTimeout(() => searchInputRef.current?.focus(), 350);
    },
  }));

  async function handleSearch(e: SubmitEvent<HTMLFormElement>) {
    e.preventDefault();
    await studentSearch.search(searchInput);
  }

  function clearSearch() {
    setSearchInput('');
    studentSearch.clear();
  }

  return (
    <div className="filter-card" ref={searchCardRef}>
      <div className="filter-header">
        <Search size={15} style={{ color: 'var(--brand-primary)' }} />
        <h3 className="filter-title">Buscar estudiante</h3>
      </div>
      <div className="filter-info">
        Busque por nombre o documento para inscribir un estudiante en un programa.
      </div>
      <form id="form-search-student" className="filter-form" onSubmit={(e) => void handleSearch(e)}>
        <div className="filter-fields" style={{ gridTemplateColumns: '1fr' }}>
          <div className="form-group" style={{ marginBottom: 0 }}>
            <label className="form-label" htmlFor="ef-search">
              Nombre o documento
            </label>
            <input
              id="ef-search"
              className="form-input"
              type="text"
              placeholder="Ingrese nombre o número de documento"
              value={searchInput}
              onChange={(e) => {
                setSearchInput(e.target.value);
              }}
              ref={searchInputRef}
            />
          </div>
        </div>
        <div className="filter-actions">
          {studentSearch.query && (
            <button type="button" className="btn btn-secondary" onClick={clearSearch}>
              Limpiar
            </button>
          )}
          <button
            id="btn-buscar-estudiante"
            type="submit"
            className="btn btn-primary"
            disabled={searchInput.trim().length < 2 || studentSearch.loading}
          >
            {studentSearch.loading ? <Spinner size={13} color="#fff" /> : <Search size={13} />}
            Buscar
          </button>
        </div>
      </form>

      {studentSearch.error && (
        <div className="alert alert-error" style={{ marginTop: 12 }}>
          {studentSearch.error}
        </div>
      )}
      {!studentSearch.loading &&
        studentSearch.query &&
        studentSearch.students.length === 0 &&
        !studentSearch.error && (
          <p className="ef-empty-search">
            No se encontraron estudiantes con &ldquo;{studentSearch.query}&rdquo;.
          </p>
        )}
      {!studentSearch.loading && studentSearch.students.length > 0 && (
        <div className="ef-student-results">
          {studentSearch.students.map((s) => (
            <div key={s.id} className="ef-student-row">
              <div className="ef-student-info">
                <span className="ef-student-name">{s.nombre}</span>
                <span className="ef-student-doc">Doc: {s.documento}</span>
                {!s.activo && <Badge variant="red">Inactivo</Badge>}
              </div>
              <button
                className="btn btn-primary btn-sm"
                onClick={() => {
                  onEnroll(s);
                }}
                disabled={!s.activo}
              >
                <UserPlus size={13} />
                Inscribir
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
