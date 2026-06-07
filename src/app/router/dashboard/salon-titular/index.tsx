import { createFileRoute } from '@tanstack/react-router';
import { ClassroomHolderPage } from '@/features/classroom-holder';

export const Route = createFileRoute('/dashboard/salon-titular/')({
  component: ClassroomHolderPage,
});
