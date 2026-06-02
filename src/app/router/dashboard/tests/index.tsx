import { createFileRoute } from '@tanstack/react-router';
import { TestsPage } from '@/pages/tests/TestsPage';

export const Route = createFileRoute('/dashboard/tests/')({
  component: TestsPage,
});
