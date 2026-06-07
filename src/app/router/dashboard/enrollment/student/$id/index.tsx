import { createFileRoute } from '@tanstack/react-router';
import { EnrollmentDetail } from '@/pages/enrollment/EnrollmentDetailPage';

export const Route = createFileRoute('/dashboard/enrollment/student/$id/')({
  component: EnrollmentDetail,
});
