import { useState, useEffect, useRef } from 'react';
import {
  EscuelasFormacionToolbar,
  EscuelasFormacionProgramCards,
  EscuelasFormacionStudentSearch,
  EscuelasFormacionTable,
  usePrograms,
  usePeriods,
  useEscuelasFormacionStats,
} from '@/features/escuelas-formacion';
import type { EscuelasFormacionStudentSearchHandle } from '@/features/escuelas-formacion';
import { useEnrollments } from '@/features/load-ef-enrollments';
import { EnrollModal } from '@/features/enroll-ef-student';
import { PaymentModal } from '@/features/pay-ef-enrollment';
import { WithdrawModal } from '@/features/withdraw-ef-student';
import { ComprobanteModal } from '@/features/view-ef-comprobante';
import type { Enrollment, Student } from '@/features/escuelas-formacion/model/types';
import '@/features/escuelas-formacion/components/EscuelasFormacionList.css';
import './EscuelasFormacionPage.css';

type ModalType = 'enroll' | 'payment' | 'withdraw' | 'comprobante' | null;

const EscuelasFormacionPage = () => {
  const { programs } = usePrograms();
  const { periods, selectedPeriod, setSelectedPeriod } = usePeriods();
  const { enrollments, loading: loadingEnrollments, fetchEnrollments } = useEnrollments();
  const { activeCount, pendingCount, programStats } = useEscuelasFormacionStats(
    enrollments,
    programs,
  );

  const [programFilter, setProgramFilter] = useState<number | null>(null);
  const [modal, setModal] = useState<ModalType>(null);
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [selectedEnrollment, setSelectedEnrollment] = useState<Enrollment | null>(null);
  const [currentYear] = useState(() => new Date().getFullYear());

  const studentSearchRef = useRef<EscuelasFormacionStudentSearchHandle>(null);

  useEffect(() => {
    if (!selectedPeriod) return;
    const t = setTimeout(() => {
      setProgramFilter(null);
      void fetchEnrollments(selectedPeriod);
    }, 0);
    return () => {
      clearTimeout(t);
    };
  }, [selectedPeriod, fetchEnrollments]);

  function closeModal() {
    setModal(null);
    setSelectedStudent(null);
    setSelectedEnrollment(null);
  }

  function handleWithdrawSuccess() {
    void fetchEnrollments(selectedPeriod);
  }

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

  const visibleEnrollments =
    programFilter === null
      ? enrollments
      : enrollments.filter((e) => e.complementario_id === programFilter);
  const filteredProgramName = programFilter === null ? null : programName(programFilter);

  const selectedPeriodObj = periods.find((p) => String(p.id) === selectedPeriod) ?? null;
  const periodoAnio = selectedPeriodObj
    ? new Date(selectedPeriodObj.periodo_electivo).getFullYear()
    : currentYear;
  const comprobanteProgram = selectedEnrollment
    ? (programs.find((p) => p.id === selectedEnrollment.complementario_id) ?? null)
    : null;

  return (
    <main className="ef-page" id="main-content">
      <div className="ef-page-header">
        <h1 className="ef-page-title">Escuelas de Formación</h1>
        <p className="ef-page-subtitle">Gestión de programas formativos</p>
      </div>

      <EscuelasFormacionToolbar
        periods={periods}
        selectedPeriod={selectedPeriod}
        onPeriodChange={setSelectedPeriod}
        activeCount={activeCount}
        pendingCount={pendingCount}
        onNewEnrollment={() => {
          studentSearchRef.current?.focus();
        }}
      />

      <EscuelasFormacionProgramCards
        programStats={programStats}
        programFilter={programFilter}
        onToggleFilter={(id) => {
          setProgramFilter((cur) => (cur === id ? null : id));
        }}
      />

      <EscuelasFormacionStudentSearch
        ref={studentSearchRef}
        onEnroll={(student: Student) => {
          setSelectedStudent(student);
          setModal('enroll');
        }}
      />

      <EscuelasFormacionTable
        enrollments={enrollments}
        visibleEnrollments={visibleEnrollments}
        loading={loadingEnrollments}
        filteredProgramName={filteredProgramName}
        onClearFilter={() => {
          setProgramFilter(null);
        }}
        programName={programName}
        onPayment={(e) => {
          setSelectedEnrollment(e);
          setModal('payment');
        }}
        onWithdraw={(e) => {
          setSelectedEnrollment(e);
          setModal('withdraw');
        }}
        onComprobante={(e) => {
          setSelectedEnrollment(e);
          setModal('comprobante');
        }}
      />

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
    </main>
  );
};

export default EscuelasFormacionPage;
