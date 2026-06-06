import { Outlet, createFileRoute, redirect } from '@tanstack/react-router';
import { DashboardLayout } from '@/shared/ui';

export const Route = createFileRoute('/dashboard')({
  beforeLoad: () => {
    const token = localStorage.getItem('auth_token');

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
