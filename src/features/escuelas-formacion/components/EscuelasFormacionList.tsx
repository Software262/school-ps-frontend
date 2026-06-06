import { useState, useEffect, useRef, type SubmitEvent } from 'react';
import {
  Search,
  UserPlus,
  CreditCard,
  LogOut,
  GraduationCap,
  Users,
  ChevronDown,
  Plus,
  CalendarDays,
  FileText,
  X,
} from 'lucide-react';
import { Badge } from '@/shared/ui/atoms/Badge';
import { Spinner } from '@/shared/ui/atoms/Spinner';
import type { Enrollment, Program, Student } from '../model/types';
import { usePrograms, usePeriods, useEnrollments, useStudentSearch } from '../hooks';
import { ComprobanteModal } from './ComprobanteModal';
import { EnrollModal } from './EnrollModal';
import { PaymentModal } from './PaymentModal';
import { WithdrawModal } from './WithdrawModal';
import './EscuelasFormacionList.css';

type ModalType = 'enroll' | 'payment' | 'withdraw' | 'comprobante' | null;

interface ProgramStat extends Program {
  activeCount: number;
  pendingCount: number;
}

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString('es-CO', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}

export const EscuelasFormacionList = () => {
  const { programs } = usePrograms();
  const { periods, selectedPeriod, setSelectedPeriod } = usePeriods();
  const { enrollments, loading: loadingEnrollments, fetchEnrollments } = useEnrollments();
  const studentSearch = useStudentSearch();

  // optional table filter by program (set by clicking a program card)
  const [programFilter, setProgramFilter] = useState<number | null>(null);
  const [searchInput, setSearchInput] = useState('');

  // modals
  const [modal, setModal] = useState<ModalType>(null);
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [selectedEnrollment, setSelectedEnrollment] = useState<Enrollment | null>(null);
  // captured once so render stays pure (no new Date() during render)
  const [currentYear] = useState(() => new Date().getFullYear());

  const searchInputRef = useRef<HTMLInputElement>(null);
  const searchCardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!selectedPeriod) return;
    // defer both state updates to keep the effect body free of synchronous setState.
    // filter is cleared so it does not linger when the user switches periods.
    const t = setTimeout(() => {
      setProgramFilter(null);
      void fetchEnrollments(selectedPeriod);
    }, 0);
    return () => {
      clearTimeout(t);
    };
  }, [selectedPeriod, fetchEnrollments]);

  // program stats derived from enrollment data
  const programStats: ProgramStat[] = programs.map((p) => ({
    ...p,
    activeCount: enrollments.filter((e) => e.complementario_id === p.id && e.activo).length,
    pendingCount: enrollments.filter(
      (e) => e.complementario_id === p.id && e.activo && !e.estado_escuela,
    ).length,
  }));

  function focusSearch() {
    searchCardRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    setTimeout(() => searchInputRef.current?.focus(), 350);
  }

  async function handleSearch(e: SubmitEvent<HTMLFormElement>) {
    e.preventDefault();
    await studentSearch.search(searchInput);
  }

  function clearSearch() {
    setSearchInput('');
    studentSearch.clear();
  }

  function openEnroll(student: Student) {
    setSelectedStudent(student);
    setModal('enroll');
  }

  function openPayment(enrollment: Enrollment) {
    setSelectedEnrollment(enrollment);
    setModal('payment');
  }

  function openWithdraw(enrollment: Enrollment) {
    setSelectedEnrollment(enrollment);
    setModal('withdraw');
  }

  function openComprobante(enrollment: Enrollment) {
    setSelectedEnrollment(enrollment);
    setModal('comprobante');
  }

  function closeModal() {
    setModal(null);
    setSelectedStudent(null);
    setSelectedEnrollment(null);
  }

  // withdraw flow: just refresh the list (the modal closes itself)
  function handleWithdrawSuccess() {
    void fetchEnrollments(selectedPeriod);
  }

  // enroll / payment flow: refresh, then auto-open the printable receipt for that
  // record. mirrors the stakeholder flow — once the obligation or payment is
  // registered, the comprobante appears so it can be printed and handed over.
  function handleObligationSuccess(enrollmentId: number) {
    void (async () => {
      const data = await fetchEnrollments(selectedPeriod);
      const fresh = data.find((e) => e.id === enrollmentId) ?? null;
      setSelectedStudent(null);
      if (fresh) {
        setSelectedEnrollment(fresh);
        setModal('comprobante');
      } else {
        closeModal();
      }
    })();
  }

  function programName(complementario_id: number): string {
    return (
      programs.find((p) => p.id === complementario_id)?.tipo_complementario ??
      `#${String(complementario_id)}`
    );
  }

  const activeCount = enrollments.filter((e) => e.activo).length;
  const pendingCount = enrollments.filter((e) => e.activo && !e.estado_escuela).length;

  // table rows honor the optional program filter set from the cards
  const visibleEnrollments =
    programFilter === null
      ? enrollments
      : enrollments.filter((e) => e.complementario_id === programFilter);
  const filteredProgramName = programFilter === null ? null : programName(programFilter);

  function toggleProgramFilter(id: number) {
    setProgramFilter((current) => (current === id ? null : id));
  }

  // derived values for the comprobante modal
  const selectedPeriodObj = periods.find((p) => String(p.id) === selectedPeriod) ?? null;
  const periodoAnio = selectedPeriodObj
    ? new Date(selectedPeriodObj.periodo_electivo).getFullYear()
    : currentYear;
  const comprobanteProgram = selectedEnrollment
    ? (programs.find((p) => p.id === selectedEnrollment.complementario_id) ?? null)
    : null;

  return (
    <>
      {/* toolbar: period + stats + cta */}
      <div className="ef-toolbar">
        <div className="ef-period-select-wrap">
          <label htmlFor="ef-periodo" className="ef-period-label">
            Período académico
          </label>
          <div className="ef-select-wrapper">
            <select
              id="ef-periodo"
              className="ef-period-select"
              value={selectedPeriod}
              onChange={(e) => {
                setSelectedPeriod(e.target.value);
              }}
            >
              {periods.length === 0 && <option value="">Sin períodos activos</option>}
              {periods.map((p) => (
                <option key={p.id} value={p.id}>
                  {new Date(p.periodo_electivo).getFullYear()} — Período #{p.id}
                </option>
              ))}
            </select>
            <ChevronDown className="ef-select-icon" size={14} />
          </div>
        </div>

        <div className="ef-toolbar-right">
          {selectedPeriod && (
            <div className="ef-stats">
              <span className="ef-stat">
                <Users size={13} />
                {activeCount} inscrito{activeCount !== 1 ? 's' : ''}
              </span>
              {pendingCount > 0 && (
                <span className="ef-stat ef-stat--warn">
                  {pendingCount} pendiente{pendingCount !== 1 ? 's' : ''}
                </span>
              )}
            </div>
          )}
          <button className="btn btn-primary" onClick={focusSearch}>
            <Plus size={14} />
            Nueva Inscripción
          </button>
        </div>
      </div>

      {/* program summary cards — click to filter the table by program */}
      {programStats.length > 0 && (
        <div className="ef-programs-grid">
          {programStats.map((p) => {
            const active = programFilter === p.id;
            return (
              <button
                key={p.id}
                type="button"
                className={`ef-program-card${active ? ' ef-program-card--active' : ''}`}
                onClick={() => {
                  toggleProgramFilter(p.id);
                }}
                aria-pressed={active}
                title={active ? 'Quitar filtro' : `Ver inscripciones de ${p.tipo_complementario}`}
              >
                <div className="ef-program-card-name">{p.tipo_complementario}</div>
                <div
                  className="ef-program-card-cost"
                  title="El valor se configura en el módulo de Matrícula"
                >
                  {p.valor > 0 ? `$${p.valor.toLocaleString('es-CO')}` : 'Gratuito'}
                </div>
                <div className="ef-program-card-meta">
                  <span className="ef-program-card-count">
                    <Users size={11} />
                    {p.activeCount} inscrito{p.activeCount !== 1 ? 's' : ''}
                  </span>
                  {p.pendingCount > 0 && (
                    <span className="ef-program-card-pending">
                      {p.pendingCount} pendiente{p.pendingCount !== 1 ? 's' : ''}
                    </span>
                  )}
                </div>
              </button>
            );
          })}
        </div>
      )}

      {/* student search */}
      <div className="filter-card" ref={searchCardRef}>
        <div className="filter-header">
          <Search size={15} style={{ color: 'var(--brand-primary)' }} />
          <h3 className="filter-title">Buscar estudiante</h3>
        </div>
        <div className="filter-info">
          Busque por nombre o documento para inscribir un estudiante en un programa.
        </div>
        <form
          id="form-search-student"
          className="filter-form"
          onSubmit={(e) => void handleSearch(e)}
        >
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
                    openEnroll(s);
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

      {/* enrollments table */}
      <div className="ef-section">
        <div className="ef-section-header">
          <GraduationCap size={16} style={{ color: 'var(--brand-primary)' }} />
          <h3 className="ef-section-title">Inscripciones del período</h3>
          {filteredProgramName && (
            <button
              type="button"
              className="ef-filter-chip"
              onClick={() => {
                setProgramFilter(null);
              }}
              title="Quitar filtro"
            >
              {filteredProgramName}
              <X size={12} />
            </button>
          )}
        </div>

        {loadingEnrollments && (
          <div className="ef-state">
            <Spinner size={26} />
            <span>Cargando inscripciones…</span>
          </div>
        )}

        {!loadingEnrollments && enrollments.length === 0 && (
          <div className="ef-state ef-state--empty">
            <GraduationCap size={36} style={{ opacity: 0.3 }} />
            <p>No hay inscripciones en este período.</p>
          </div>
        )}

        {!loadingEnrollments && enrollments.length > 0 && visibleEnrollments.length === 0 && (
          <div className="ef-state ef-state--empty">
            <GraduationCap size={36} style={{ opacity: 0.3 }} />
            <p>No hay inscripciones en {filteredProgramName} para este período.</p>
          </div>
        )}

        {!loadingEnrollments && visibleEnrollments.length > 0 && (
          <div className="ef-table-wrap">
            <table className="ef-table">
              <thead>
                <tr>
                  <th>Estudiante</th>
                  <th>Programa</th>
                  <th>Mes</th>
                  <th>Estado</th>
                  <th>Saldo</th>
                  <th>
                    <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                      <CalendarDays size={11} />
                      Inscripción
                    </span>
                  </th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {visibleEnrollments.map((e) => (
                  <tr key={e.id} className={!e.activo ? 'ef-row--inactive' : ''}>
                    <td className="ef-cell-student">
                      <div>{e.estudiante_nombre}</div>
                      <div style={{ fontSize: 'var(--font-size-xs)', color: 'var(--text-muted)' }}>
                        {e.estudiante_documento}
                      </div>
                    </td>
                    <td>{programName(e.complementario_id)}</td>
                    <td>{e.mes}</td>
                    <td>
                      {!e.activo ? (
                        <Badge variant="gray">Retirado</Badge>
                      ) : e.estado_escuela ? (
                        <Badge variant="green">Paz y Salvo</Badge>
                      ) : (
                        <Badge variant="red">Pendiente</Badge>
                      )}
                    </td>
                    <td>
                      {e.saldo_pendiente > 0
                        ? `$${e.saldo_pendiente.toLocaleString('es-CO')}`
                        : '—'}
                    </td>
                    <td style={{ color: 'var(--text-muted)', fontSize: 'var(--font-size-xs)' }}>
                      {formatDate(e.fecha_registro)}
                    </td>
                    <td>
                      <div className="ef-row-actions">
                        {e.activo && e.saldo_pendiente > 0 && (
                          <button
                            className="btn btn-secondary btn-sm"
                            onClick={() => {
                              openPayment(e);
                            }}
                            title="Registrar pago"
                          >
                            <CreditCard size={12} />
                            Pago
                          </button>
                        )}
                        {e.activo && (
                          <button
                            className="btn btn-secondary btn-sm ef-btn-withdraw"
                            onClick={() => {
                              openWithdraw(e);
                            }}
                            title="Retirar estudiante"
                          >
                            <LogOut size={12} />
                            Retirar
                          </button>
                        )}
                        <button
                          className="btn btn-secondary btn-sm"
                          onClick={() => {
                            openComprobante(e);
                          }}
                          title="Ver comprobante"
                        >
                          <FileText size={12} />
                        </button>
                        {!e.activo && e.motivo_retiro && (
                          <span className="ef-motivo" title={e.motivo_retiro}>
                            {e.motivo_retiro.length > 28
                              ? `${e.motivo_retiro.slice(0, 28)}…`
                              : e.motivo_retiro}
                          </span>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* modals */}
      <ComprobanteModal
        isOpen={modal === 'comprobante'}
        onClose={closeModal}
        enrollment={selectedEnrollment}
        program={comprobanteProgram}
        periodoAnio={periodoAnio}
      />
      <EnrollModal
        isOpen={modal === 'enroll'}
        onClose={closeModal}
        student={selectedStudent}
        programs={programs}
        periods={periods}
        onSuccess={handleObligationSuccess}
      />
      <PaymentModal
        isOpen={modal === 'payment'}
        onClose={closeModal}
        enrollment={selectedEnrollment}
        studentName={selectedEnrollment?.estudiante_nombre ?? ''}
        programName={selectedEnrollment ? programName(selectedEnrollment.complementario_id) : ''}
        onSuccess={handleObligationSuccess}
      />
      <WithdrawModal
        isOpen={modal === 'withdraw'}
        onClose={closeModal}
        enrollment={selectedEnrollment}
        studentName={selectedEnrollment?.estudiante_nombre ?? ''}
        programName={selectedEnrollment ? programName(selectedEnrollment.complementario_id) : ''}
        onSuccess={handleWithdrawSuccess}
      />
    </>
  );
};
