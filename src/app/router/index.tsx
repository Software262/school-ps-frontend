import { createFileRoute, redirect } from '@tanstack/react-router';
import { LoginPage } from '@/pages/auth/LoginPage';

export const Route = createFileRoute('/')({
  beforeLoad: () => {
    const token = localStorage.getItem('auth_token');

    if (token) {
      return redirect({ to: '/dashboard' });
    }
  },
  component: LoginPage,
});
