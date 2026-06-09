import { useLoadLoansData } from '@/shared/hooks/useLoadLoansData';
import { loadSportLoans } from '../api/load-sport-loans';

export const useLoadSportLoans = () => useLoadLoansData(loadSportLoans);
