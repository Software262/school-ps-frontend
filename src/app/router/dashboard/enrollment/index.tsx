import { createFileRoute } from '@tanstack/react-router';
import { EnrollmentSearch } from '@/pages/enrollment/EnrollmentSearchPage';

export const Route = createFileRoute('/dashboard/enrollment/')({
  component: EnrollmentSearch,
});
