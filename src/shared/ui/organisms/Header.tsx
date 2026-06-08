import { useState } from 'react';
import { useNavigate } from '@tanstack/react-router';
import { Menu, X, LogOut, User } from 'lucide-react';
import type { LoginUser } from '@/features/auth/api/authApi';

interface HeaderProps {
  sidebarOpen: boolean;
  onToggleSidebar: () => void;
}

export function Header({ sidebarOpen, onToggleSidebar }: HeaderProps) {
  const navigate = useNavigate();
  const [currentUser] = useState<LoginUser | null>(() => {
    const userStr = localStorage.getItem('auth_user');
    if (userStr) {
      try {
        return JSON.parse(userStr) as LoginUser;
      } catch (err) {
        console.error('Error parsing user session:', err);
      }
    }
    return null;
  });

  const handleLogout = () => {
    localStorage.removeItem('auth_token');
    localStorage.removeItem('auth_user');
    void navigate({ to: '/' });
  };

  return (
    <header className="bg-white border-b px-6 py-4 shrink-0" style={{ borderColor: '#d0d0ce' }}>
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-4 flex-1">
          <button
            onClick={onToggleSidebar}
            className="p-2 rounded-lg transition-colors cursor-pointer"
            style={{ color: '#8E2A25' }}
            onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#E9E9E7')}
            onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
          >
            {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
          <div className="flex-1">
            <p className="text-sm font-medium" style={{ color: '#333333' }}>
              Bienvenido al Sistema de Paz y Salvo - Cambridge School
            </p>
          </div>
        </div>

        {/* User profile info / Logout */}
        {currentUser && (
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2.5">
              <div
                className="w-9 h-9 rounded-full bg-slate-100 border flex items-center justify-center text-slate-700"
                style={{ borderColor: '#d0d0ce' }}
              >
                <User className="w-4.5 h-4.5" />
              </div>
              <div className="flex flex-col leading-none">
                <span className="text-sm font-semibold text-slate-800">{currentUser.username}</span>
                <span className="text-xs text-slate-500 mt-0.5">{currentUser.rol}</span>
              </div>
            </div>

            <button
              onClick={handleLogout}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium text-red-600 transition-colors hover:bg-red-50 cursor-pointer"
            >
              <LogOut className="w-4 h-4" />
              Salir
            </button>
          </div>
        )}
      </div>
    </header>
  );
}
