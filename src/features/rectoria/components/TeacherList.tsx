/* eslint-disable */
import React, { useState, useEffect, useCallback } from 'react';
import { TeacherCard } from '../../../entities/teacher/ui/TeacherCard';
import { CreateStatusModal } from './CreateStatusModal';
import { UpdateStatusModal } from './UpdateStatusModal';
import { CreateObservationModal } from './CreateObservationModal';
import { Spinner } from '../../../shared/ui/atoms/Spinner';
import { getTeachers } from '../api/rectoriaApi';
import type { Teacher } from '../../../entities/teacher/model/types';
import './TeacherList.css';

export const TeacherList: React.FC = () => {
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Search filters
  const [filterCode, setFilterCode] = useState('');
  const [filterName, setFilterName] = useState('');
  const [searchCode, setSearchCode] = useState('');
  const [searchName, setSearchName] = useState('');

  // Modal state
  const [selectedTeacher, setSelectedTeacher] = useState<Teacher | null>(null);
  const [modal, setModal] = useState<'createStatus' | 'updateStatus' | 'createObs' | null>(null);

  const fetchTeachers = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getTeachers();
      setTeachers(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al cargar los docentes');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    setTimeout(() => { void fetchTeachers(); }, 0);
  }, [fetchTeachers]);

  // Apply search filters
  const filtered = teachers.filter((t) => {
    const matchCode = searchCode ? String(t.id).includes(searchCode.trim()) : true;
    const matchName = searchName
      ? t.nombre.toLowerCase().includes(searchName.trim().toLowerCase())
      : true;
    return matchCode && matchName;
  });

  function handleSearch(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSearchCode(filterCode);
    setSearchName(filterName);
  }

  function handleClearSearch() {
    setFilterCode('');
    setFilterName('');
    setSearchCode('');
    setSearchName('');
  }

  function openModal(type: typeof modal, teacher: Teacher) {
    setSelectedTeacher(teacher);
    setModal(type);
  }

  function closeModal() {
    setModal(null);
    setSelectedTeacher(null);
  }

  const isSearchActive = searchCode !== '' || searchName !== '';

  return (
    <>
      {/* Search / Filter card */}
      <div className="filter-card">
        <div className="filter-header">
          <span className="filter-icon" aria-hidden="true">🔍</span>
          <h3 className="filter-title">Filtros de búsqueda</h3>
        </div>

        <div className="filter-info">
          Ingrese el código o nombre del docente para consultar su estado
        </div>

        <form id="form-search-teachers" className="filter-form" onSubmit={handleSearch}>
          <div className="filter-fields">
            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label" htmlFor="filter-codigo">Código</label>
              <input
                id="filter-codigo"
                className="form-input"
                type="text"
                placeholder="Ingrese código"
                value={filterCode}
                onChange={(e) => { setFilterCode(e.target.value); }}
              />
            </div>
            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label" htmlFor="filter-nombre">Nombre</label>
              <input
                id="filter-nombre"
                className="form-input"
                type="text"
                placeholder="Ingrese nombre"
                value={filterName}
                onChange={(e) => { setFilterName(e.target.value); }}
              />
            </div>
          </div>

          <div className="filter-actions">
            {isSearchActive && (
              <button
                type="button"
                className="btn btn-secondary"
                onClick={handleClearSearch}
              >
                Limpiar
              </button>
            )}
            <button
              id="btn-buscar-docentes"
              type="submit"
              className="btn btn-primary"
            >
              🔍 Buscar
            </button>
          </div>
        </form>
      </div>

      {/* Results */}
      <div className="teacher-list-section">
        {loading && (
          <div className="teacher-list-state">
            <Spinner size={28} />
            <p>Cargando docentes…</p>
          </div>
        )}

        {!loading && error && (
          <div className="teacher-list-state">
            <div className="alert alert-error" style={{ maxWidth: 500 }}>
              ⚠ {error}
            </div>
            <button className="btn btn-secondary" onClick={() => void fetchTeachers()}>
              Reintentar
            </button>
          </div>
        )}

        {!loading && !error && filtered.length === 0 && (
          <div className="teacher-list-empty">
            <span style={{ fontSize: 40 }}>📋</span>
            <p>
              {isSearchActive
                ? 'No se encontraron docentes con ese filtro.'
                : 'No hay docentes registrados aún.'}
            </p>
          </div>
        )}

        {!loading && !error && filtered.length > 0 && (
          <>
            <div className="teacher-list-meta">
              <span>{filtered.length} docente{filtered.length !== 1 ? 's' : ''}</span>
              {isSearchActive && (
                <button
                  className="btn btn-secondary btn-sm"
                  onClick={handleClearSearch}
                >
                  Quitar filtros
                </button>
              )}
            </div>
            <div className="teacher-grid">
              {filtered.map((teacher) => (
                <TeacherCard
                  key={teacher.id}
                  teacher={teacher}
                  onCreateStatus={(t) => { openModal('createStatus', t); }}
                  onUpdateStatus={(t) => { openModal('updateStatus', t); }}
                  onCreateObservation={(t) => { openModal('createObs', t); }}
                />
              ))}
            </div>
          </>
        )}
      </div>

      {/* Modals */}
      <CreateStatusModal
        isOpen={modal === 'createStatus'}
        onClose={closeModal}
        teacher={selectedTeacher}
        onSuccess={() => void fetchTeachers()}
      />
      <UpdateStatusModal
        isOpen={modal === 'updateStatus'}
        onClose={closeModal}
        teacher={selectedTeacher}
        onSuccess={() => void fetchTeachers()}
      />
      <CreateObservationModal
        isOpen={modal === 'createObs'}
        onClose={closeModal}
        teacher={selectedTeacher}
        onSuccess={() => void fetchTeachers()}
      />
    </>
  );
};
