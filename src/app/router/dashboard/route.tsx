import { Outlet, createFileRoute } from '@tanstack/react-router';
import { DashboardLayout } from '@/shared/ui';

export const Route = createFileRoute('/dashboard')({
  component: () => (
    <DashboardLayout>
      <Outlet />
    </DashboardLayout>
  ),
});
