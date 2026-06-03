import { createFileRoute } from '@tanstack/react-router';
import { BandPage } from '@pages/band/BandPage';

export const Route = createFileRoute('/dashboard/band/')({
  component: BandPage,
});
