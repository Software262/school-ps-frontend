import { createFileRoute, redirect } from '@tanstack/react-router';
import { LoginPage } from '@/pages/auth/LoginPage';
import { getSessionToken } from '@/shared/auth';

export const Route = createFileRoute('/')({
  beforeLoad: () => {
    const token = getSessionToken();

    if (token) {
      return redirect({ to: '/dashboard' });
    }
  },
  component: LoginPage,
});
