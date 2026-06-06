import { createFileRoute } from '@tanstack/react-router';
import TuitionPage from '@/pages/tuition/TuitionPage';

export const Route = createFileRoute('/dashboard/tuition/')({
  component: TuitionPage,
});
