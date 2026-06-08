import { useMemo } from 'react';
import type { Enrollment, Program } from '../model/types';

export interface ProgramStat extends Program {
  activeCount: number;
  pendingCount: number;
}

export const useEscuelasFormacionStats = (enrollments: Enrollment[], programs: Program[]) => {
  return useMemo(() => {
    const activeCount = enrollments.filter((e) => e.activo).length;
    const pendingCount = enrollments.filter((e) => e.activo && !e.estado_escuela).length;
    const programStats: ProgramStat[] = programs.map((p) => ({
      ...p,
      activeCount: enrollments.filter((e) => e.complementario_id === p.id && e.activo).length,
      pendingCount: enrollments.filter(
        (e) => e.complementario_id === p.id && e.activo && !e.estado_escuela,
      ).length,
    }));
    return { activeCount, pendingCount, programStats };
  }, [enrollments, programs]);
};
