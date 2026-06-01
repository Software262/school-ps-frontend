import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/dashboard/band/')({
  component: () => <h1 className="text-red-500">hola</h1>,
});
