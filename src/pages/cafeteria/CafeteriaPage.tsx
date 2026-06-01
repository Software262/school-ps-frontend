/**
 * Author: Danilo Castillejo
 * Role: Developer of the cafeteria module
 */
import React, { useEffect, useState, useRef, useCallback } from 'react';
import { Search, ChevronLeft, ClipboardList, User, Loader2, FileDown } from 'lucide-react';
import { cafeteriaApi } from '../../features/cafeteria/api/cafeteriaApi';
import type { GeneralStudent, Grade } from '../../features/cafeteria/model/types';
import './CafeteriaPage.css';

// Interfaz para deudores que incluye datos de JOIN
interface DebtorRow {
  id: number;
  estudiante_id: number;
  nombre: string;
  documento: string;
  grado: string;
  estado_cafeteria: boolean;
  observaciones: string | null;
}

export const CafeteriaPage: React.FC = () => {
  const [debtors, setDebtors] = useState<DebtorRow[]>([]);
  const [searchResults, setSearchResults] = useState<GeneralStudent[]>([]);
  const [grades, setGrades] = useState<Grade[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [gradoFilter, setGradoFilter] = useState<string>('all');
  const [selectedIds, setSelectedIds] = useState<number[]>([]);
  const [view, setView] = useState<'list' | 'add'>('list');
  const [targetStudent, setTargetStudent] = useState<GeneralStudent | null>(null);
  const [loading, setLoading] = useState(false);
  const [obs, setObs] = useState('');

  const searchRef = useRef<HTMLDivElement>(null);

  const handleSearch = useCallback(async () => {
    try {
      const filter = gradoFilter === 'all' ? undefined : Number(gradoFilter);
      const res = await cafeteriaApi.searchGeneral(searchQuery, filter);
      setSearchResults(res.data);
    } catch {
      console.error('Error en búsqueda');
    }
  }, [searchQuery, gradoFilter]);

  const loadDebtors = useCallback(async () => {
    try {
      const res = await cafeteriaApi.fetchDebtors(1);
      setDebtors(res.data as unknown as DebtorRow[]);
    } catch {
      console.error('Error al cargar deudores');
    }
  }, []);

  useEffect(() => {
    const initData = async (): Promise<void> => {
      setLoading(true);
      try {
        const [debtorsRes, gradesRes] = await Promise.all([
          cafeteriaApi.fetchDebtors(1),
          cafeteriaApi.getGrades(),
        ]);
        setDebtors(debtorsRes.data as unknown as DebtorRow[]);
        setGrades(gradesRes.data);
      } catch {
        console.error('Error al cargar datos iniciales');
      } finally {
        setLoading(false);
      }
    };
    void initData();
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (searchQuery.trim() || gradoFilter !== 'all') {
        void handleSearch();
      } else {
        setSearchResults([]);
      }
    }, 300);
    return () => {
      clearTimeout(timer);
    };
  }, [searchQuery, gradoFilter, handleSearch]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent): void => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setSearchResults([]);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleDownloadReport = async (): Promise<void> => {
    try {
      const response = await cafeteriaApi.exportReport(1);
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute(
        'download',
        `reporte_cafeteria_${new Date().toISOString().split('T')[0]}.csv`,
      );
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch {
      alert('Error al descargar el reporte');
    }
  };

  const handleBulkClear = async (): Promise<void> => {
    setLoading(true);
    try {
      await cafeteriaApi.clearDebts({
        registro_ids: selectedIds,
        usuario_id: 1,
      });
      setSelectedIds([]);
      await loadDebtors();
    } catch {
      alert('Error en la operación masiva');
    } finally {
      setLoading(false);
    }
  };

  const handleAddDebt = async (): Promise<void> => {
    if (obs.length < 5 || !targetStudent) {
      alert('La observación es obligatoria y debe ser descriptiva.');
      return;
    }
    try {
      await cafeteriaApi.addDebt({
        estudiante_id: targetStudent.id,
        periodo_id: 1,
        usuario_id: 1,
        observaciones: obs,
      });
      setView('list');
      setObs('');
      setSearchResults([]);
      await loadDebtors();
    } catch {
      alert('Error al agregar deuda');
    }
  };

  const toggleSelectAll = (): void => {
    if (selectedIds.length === debtors.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(debtors.map((d) => d.id));
    }
  };

  if (view === 'add' && targetStudent) {
    return (
      <div className="cafeteria-page">
        <header className="page-header">
          <div className="header-add-nav">
            <button
              className="btn-back-left"
              onClick={() => {
                setView('list');
              }}
            >
              <ChevronLeft size={20} /> Volver
            </button>
            <h1>Módulo de Cafetería</h1>
          </div>
          <p>Asignar estado administrativo de deuda</p>
        </header>

        <div className="management-card">
          <div className="student-profile">
            <div className="avatar-circle">
              <User size={32} />
            </div>
            <div className="student-details">
              <h2>{targetStudent.nombre}</h2>
              <div className="badge-row">
                <span className="info-tag">CC: {targetStudent.documento}</span>
                <span className="info-tag">Grado: {targetStudent.grado ?? 'N/A'}</span>
                <span className="badge bg-red">Estado: Pendiente</span>
              </div>
            </div>
          </div>
        </div>

        <div className="form-card">
          <div className="form-header">
            <ClipboardList size={20} /> <span>Registrar Nueva Observación</span>
          </div>
          <div className="form-body">
            <textarea
              className="modern-textarea"
              placeholder="Describa el motivo..."
              value={obs}
              onChange={(e) => {
                setObs(e.target.value);
              }}
            />
            <div className="form-footer">
              <button
                className="btn-cancel-flat"
                onClick={() => {
                  setView('list');
                }}
              >
                Cancelar
              </button>
              <button
                className="btn-save-main"
                onClick={() => {
                  void handleAddDebt();
                }}
              >
                Guardar Deuda
              </button>
            </div>
          </div>
        </div>
      </div>
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
              void handleDownloadReport();
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
              void handleSearch();
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
