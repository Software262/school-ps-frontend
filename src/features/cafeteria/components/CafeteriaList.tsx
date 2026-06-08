import { useState, useRef, useEffect } from 'react';
import { Search, FileDown } from 'lucide-react';
import { useLoadDebtors } from '@/features/load-cafeteria-debtors/hooks';
import { useSearchCafeteriaStudent } from '@/features/search-cafeteria-student/hooks';
import { AddDebtView } from '@/features/add-cafeteria-debt/components';
import { useAddDebt } from '@/features/add-cafeteria-debt/hooks';
import { useClearDebts } from '@/features/clear-cafeteria-debts/hooks';
import { useExportReport } from '@/features/export-cafeteria-report/hooks';
import type { GeneralStudent } from '../model/types';
import { Loader2 } from 'lucide-react';
import './CafeteriaList.css';

export const CafeteriaList = () => {
  const { debtors, grades, loading, refetch } = useLoadDebtors();
  const { results: searchResults, search, clear: clearSearch } = useSearchCafeteriaStudent();
  const { submit: submitDebt } = useAddDebt(refetch);
  const { clear: clearDebts } = useClearDebts(refetch);
  const { download: downloadReport } = useExportReport();

  const [searchQuery, setSearchQuery] = useState('');
  const [gradoFilter, setGradoFilter] = useState('all');
  const [selectedIds, setSelectedIds] = useState<number[]>([]);
  const [view, setView] = useState<'list' | 'add'>('list');
  const [targetStudent, setTargetStudent] = useState<GeneralStudent | null>(null);

  const searchRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const timer = setTimeout(() => {
      const gradoId = gradoFilter === 'all' ? undefined : Number(gradoFilter);
      void search(searchQuery, gradoId);
    }, 300);
    return () => {
      clearTimeout(timer);
    };
  }, [searchQuery, gradoFilter, search]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        clearSearch();
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [clearSearch]);

  const handleBulkClear = async () => {
    try {
      await clearDebts(selectedIds, 1);
      setSelectedIds([]);
    } catch {
      alert('Error en la operación masiva');
    }
  };

  const handleAddDebt = async (obs: string) => {
    if (obs.length < 5 || !targetStudent) {
      alert('La observación es obligatoria y debe ser descriptiva.');
      return;
    }
    try {
      await submitDebt({
        estudiante_id: targetStudent.id,
        periodo_id: 1,
        usuario_id: 1,
        observaciones: obs,
      });
      setView('list');
      clearSearch();
    } catch {
      alert('Error al agregar deuda');
    }
  };

  const toggleSelectAll = () => {
    if (selectedIds.length === debtors.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(debtors.map((d) => d.id));
    }
  };

  if (view === 'add' && targetStudent) {
    return (
      <AddDebtView
        student={targetStudent}
        onSave={handleAddDebt}
        onCancel={() => {
          setView('list');
        }}
      />
    );
  }

  return (
    <div className="cafeteria-page">
      <header className="page-header">
        <div className="header-main-row">
          <div>
            <h1>Módulo de Cafetería</h1>
            <p>Gestión de deudores activos</p>
          </div>
          <button
            className="btn-export"
            onClick={() => {
              void downloadReport();
            }}
          >
            <FileDown size={18} /> Exportar Reporte
          </button>
        </div>
      </header>

      <section className="filter-card" ref={searchRef}>
        <div className="filter-row">
          <div className="search-box">
            <Search size={18} className="search-icon" />
            <input
              className="main-search"
              placeholder="Buscar estudiante..."
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
              }}
            />
          </div>
          <select
            className="grado-select"
            value={gradoFilter}
            onChange={(e) => {
              setGradoFilter(e.target.value);
            }}
          >
            <option value="all">Filtrar por Grado</option>
            {grades.map((g) => (
              <option key={g.id} value={g.id}>
                {g.nombre}
              </option>
            ))}
          </select>
          <button
            className="btn-search"
            onClick={() => {
              const gradoId = gradoFilter === 'all' ? undefined : Number(gradoFilter);
              void search(searchQuery, gradoId);
            }}
          >
            Buscar
          </button>
        </div>

        {searchResults.length > 0 && (
          <div className="search-results-dropdown">
            {searchResults.map((s) => (
              <div
                key={String(s.id)}
                className="search-result-item"
                onClick={() => {
                  setTargetStudent(s);
                  setView('add');
                }}
              >
                <span className="res-name">{s.nombre}</span>
                <span className="text-action">Asignar Deuda +</span>
              </div>
            ))}
          </div>
        )}
      </section>

      <div className="table-wrapper">
        <table className="modern-table">
          <thead>
            <tr>
              <th>
                <input
                  type="checkbox"
                  onChange={toggleSelectAll}
                  checked={selectedIds.length === debtors.length && debtors.length > 0}
                />
              </th>
              <th>ESTUDIANTE</th>
              <th>GRADO</th>
              <th>OBSERVACIÓN</th>
              <th className="text-center">ESTADO</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={5} className="text-center py-10">
                  <Loader2 className="animate-spin" /> Cargando...
                </td>
              </tr>
            ) : (
              debtors.map((item) => (
                <tr key={item.id} className={selectedIds.includes(item.id) ? 'active-row' : ''}>
                  <td>
                    <input
                      type="checkbox"
                      checked={selectedIds.includes(item.id)}
                      onChange={() => {
                        setSelectedIds((prev) =>
                          prev.includes(item.id)
                            ? prev.filter((i) => i !== item.id)
                            : [...prev, item.id],
                        );
                      }}
                    />
                  </td>
                  <td className="text-bold">{item.nombre}</td>
                  <td>{item.grado}</td>
                  <td className="text-observation" title={item.observaciones ?? ''}>
                    {item.observaciones}
                  </td>
                  <td className="text-center">
                    <span className="badge bg-red">Deuda</span>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {selectedIds.length > 0 && (
        <div className="footer-actions-right">
          <button
            className="btn-manage"
            onClick={() => {
              void handleBulkClear();
            }}
            disabled={loading}
          >
            {loading ? 'Procesando...' : `Poner a Paz y Salvo (${String(selectedIds.length)})`}
          </button>
        </div>
      )}
    </div>
  );
};
