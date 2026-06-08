import { createFileRoute } from '@tanstack/react-router';
import { SportPage } from '@pages/sport/SportPage';

export const Route = createFileRoute('/dashboard/deportes/')({
  component: SportPage,
});
