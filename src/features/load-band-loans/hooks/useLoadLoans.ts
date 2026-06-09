import { useLoadLoansData } from '@/shared/hooks/useLoadLoansData';
import { loadLoans } from '../api/load-loans';

export const useLoadLoans = () => useLoadLoansData(loadLoans);
