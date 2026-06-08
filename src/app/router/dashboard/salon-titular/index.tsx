import { createFileRoute } from '@tanstack/react-router';
import { ClassroomHolderPage } from '@/pages/classroom-holder/ClassroomHolderPage';

export const Route = createFileRoute('/dashboard/salon-titular/')({
  component: ClassroomHolderPage,
});
