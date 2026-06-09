import { LoansSection } from '@/shared/ui/organisms/LoansSection';
import type { LoansSectionProps } from '@/shared/ui/organisms/LoansSection';

type Props = Omit<LoansSectionProps, 'searchPlaceholder'>;

export const SportLoansSection = (props: Props) => (
  <LoansSection {...props} searchPlaceholder="Buscar por estudiante o equipo..." />
);
