import { createFileRoute } from '@tanstack/react-router';
import ClassroomPage from '@/pages/classroom/ClassroomPage';

export const Route = createFileRoute('/dashboard/salon-tesoreria/')({
  component: ClassroomPage,
});
