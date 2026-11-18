import { createFileRoute } from '@tanstack/react-router';
import BaseFeesPage from '@/pages/enrollment/BaseFeesPage';

export const Route = createFileRoute('/dashboard/enrollment/parametros/')({
  component: () => <BaseFeesPage />,
});
