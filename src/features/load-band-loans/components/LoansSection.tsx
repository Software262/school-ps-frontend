import { LoansSection as SharedLoansSection } from '@/shared/ui/organisms/LoansSection';
import type { LoansSectionProps } from '@/shared/ui/organisms/LoansSection';

type Props = Omit<LoansSectionProps, 'searchPlaceholder'>;

export const LoansSection = (props: Props) => (
  <SharedLoansSection {...props} searchPlaceholder="Buscar por estudiante o instrumento..." />
);
