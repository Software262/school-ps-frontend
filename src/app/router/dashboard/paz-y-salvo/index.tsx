import { createFileRoute } from '@tanstack/react-router';
import PazYSalvoPage from '@/pages/paz-y-salvo/PazYSalvoPage';

export const Route = createFileRoute('/dashboard/paz-y-salvo/')({
  component: PazYSalvoPage,
});
