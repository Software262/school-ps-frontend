import { Outlet, createFileRoute, redirect } from '@tanstack/react-router';
import { DashboardLayout } from '@/shared/ui';
import { getSessionToken } from '@/shared/auth';

export const Route = createFileRoute('/dashboard')({
  beforeLoad: () => {
    const token = getSessionToken();

    if (!token) {
      throw redirect({ to: '/' });
    }
  },
  component: () => (
    <DashboardLayout>
      <Outlet />
    </DashboardLayout>
  ),
});
