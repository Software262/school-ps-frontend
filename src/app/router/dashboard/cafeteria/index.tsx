import { createFileRoute } from '@tanstack/react-router';
import { CafeteriaPage } from '../../../../pages/cafeteria/CafeteriaPage';

export const Route = createFileRoute('/dashboard/cafeteria/')({
  component: CafeteriaPage,
});
