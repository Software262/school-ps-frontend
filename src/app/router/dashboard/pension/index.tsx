import { createFileRoute } from '@tanstack/react-router';
import TuitionPage from '@/pages/TuitionPage';

export const Route = createFileRoute('/dashboard/pension/')({
  component: TuitionPage,
});
