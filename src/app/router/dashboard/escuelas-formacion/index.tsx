import { createFileRoute } from '@tanstack/react-router';
import EscuelasFormacionPage from '@/pages/escuelas-formacion/EscuelasFormacionPage';

export const Route = createFileRoute('/dashboard/escuelas-formacion/')({
  component: () => <EscuelasFormacionPage />,
});
