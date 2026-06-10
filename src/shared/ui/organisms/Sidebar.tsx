import { Link } from '@tanstack/react-router';
import {
  Home,
  Shield,
  CreditCard,
  Calendar,
  GraduationCap,
  Armchair,
  FileText,
  Dumbbell,
  Trophy,
  Coffee,
  School,
  Music,
  Building,
  Bot,
} from 'lucide-react';

const modules = [
  { path: '/dashboard', label: 'Dashboard', icon: Home },
  {
    path: '/dashboard/paz-y-salvo',
    label: 'Paz y Salvo Central',
    icon: Shield,
    highlight: true,
  },
  { path: '/dashboard/enrollment', label: 'Matrícula', icon: CreditCard },
  { path: '/dashboard/tuition', label: 'Pensión', icon: Calendar },
  {
    path: '/dashboard/escuelas-formacion',
    label: 'Escuelas de Formación',
    icon: GraduationCap,
  },
  {
    path: '/dashboard/salon-tesoreria',
    label: 'Salón Tesorería',
    icon: Armchair,
  },
  { path: '/dashboard/tests', label: 'Pruebas Internas', icon: FileText },
  { path: '/dashboard/deportes', label: 'Deportes', icon: Dumbbell },
  { path: '/dashboard/ajedrez', label: 'Ajedrez', icon: Trophy },
  { path: '/dashboard/cafeteria', label: 'Cafetería', icon: Coffee },
  { path: '/dashboard/salon-titular', label: 'Salón Titular', icon: School },
  { path: '/dashboard/band', label: 'Banda', icon: Music },
  { path: '/dashboard/rectoria', label: 'Rectoría', icon: Building },
  { path: '/dashboard/webcolegios-scraping', label: 'Sincronización', icon: Bot },
];

interface SidebarProps {
  isOpen: boolean;
}

export function Sidebar({ isOpen }: SidebarProps) {
  return (
    <aside
      className={`${isOpen ? 'w-64' : 'w-0'} bg-white border-r transition-all duration-300 overflow-hidden flex flex-col`}
      style={{ borderColor: '#d0d0ce' }}
    >
      <div
        className="p-4 border-b shrink-0"
        style={{ borderColor: '#d0d0ce', backgroundColor: '#8E2A25' }}
      >
        <h1 className="font-bold text-xl text-white">SchoolPS</h1>
        <p className="text-sm" style={{ color: '#E9E9E7' }}>
          Sistema de Paz y Salvo
        </p>
      </div>
      <nav className="p-4 space-y-1 flex-1 overflow-y-auto">
        {modules.map((module) => {
          const Icon = module.icon;
          return (
            <Link
              key={module.path}
              to={module.path}
              className="flex items-center gap-3 px-3 py-2 rounded-lg transition-colors"
              activeProps={{
                className: module.highlight ? 'border font-semibold' : 'font-semibold',
                style: module.highlight
                  ? {
                      backgroundColor: '#456450',
                      color: '#FFFFFF',
                      borderColor: '#456450',
                    }
                  : { backgroundColor: '#8E2A25', color: '#FFFFFF' },
              }}
              inactiveProps={{
                className: module.highlight ? 'font-semibold' : '',
                style: module.highlight ? { color: '#456450' } : { color: '#333333' },
              }}
            >
              <Icon className="w-5 h-5" />
              <span className="text-sm whitespace-nowrap">{module.label}</span>
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
