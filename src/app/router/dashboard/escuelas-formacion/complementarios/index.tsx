import { createFileRoute } from '@tanstack/react-router';
import ComplementariosPage from '@/pages/escuelas-formacion/ComplementariosPage';

export const Route = createFileRoute('/dashboard/escuelas-formacion/complementarios/')({
  component: () => <ComplementariosPage />,
});
