import { createFileRoute } from '@tanstack/react-router';
import { ChessPage } from '@/pages/ajedrez/ChessPage';

export const Route = createFileRoute('/dashboard/ajedrez/')({
  component: ChessPage,
});
