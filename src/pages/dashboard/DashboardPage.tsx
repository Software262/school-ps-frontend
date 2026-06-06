import { useNavigate } from '@tanstack/react-router';
import {
  CreditCard,
  Calendar,
  GraduationCap,
  Sofa,
  FileText,
  Dumbbell,
  Trophy,
  Coffee,
  School,
  Music,
  Building,
  CheckCircle,
  Clock,
  AlertCircle,
  ArrowRight,
} from 'lucide-react';

export const DashboardPage = () => {
  const navigate = useNavigate();

  const modules = [
    {
      id: 'matricula',
      title: 'Matrícula',
      desc: 'Gestión de matrículas y pagos iniciales',
      icon: CreditCard,
      color: '#1d4ed8',
      bgColor: '#eff6ff',
      borderColor: '#bfdbfe',
      active: true,
    },
    {
      id: 'pension',
      title: 'Pensión',
      desc: 'Control de mensualidades y estados de pago',
      icon: Calendar,
      color: '#047857',
      bgColor: '#ecfdf5',
      borderColor: '#a7f3d0',
    },
    {
      id: 'escuelas',
      title: 'Escuelas de Formación',
      desc: 'Inscripciones y seguimiento de programas',
      icon: GraduationCap,
      color: '#7c3aed',
      bgColor: '#f5f3ff',
      borderColor: '#ddd6fe',
    },
    {
      id: 'tesoreria',
      title: 'Salón Tesorería',
      desc: 'Control del mobiliario asignado',
      icon: Sofa,
      color: '#b45309',
      bgColor: '#fffbeb',
      borderColor: '#fef3c7',
    },
    {
      id: 'pruebas',
      title: 'Pruebas Internas',
      desc: 'Gestión de evaluaciones institucionales',
      icon: FileText,
      color: '#b91c1c',
      bgColor: '#fef2f2',
      borderColor: '#fecaca',
    },
    {
      id: 'deportes',
      title: 'Deportes',
      desc: 'Inventario y préstamos deportivos',
      icon: Dumbbell,
      color: '#3b82f6',
      bgColor: '#eff6ff',
      borderColor: '#dbeafe',
    },
    {
      id: 'ajedrez',
      title: 'Ajedrez',
      desc: 'Control de tableros y piezas de ajedrez',
      icon: Trophy,
      color: '#db2777',
      bgColor: '#fdf2f8',
      borderColor: '#fce7f3',
    },
    {
      id: 'cafeteria',
      title: 'Cafetería',
      desc: 'Estado anual de deuda de cafetería',
      icon: Coffee,
      color: '#c2410c',
      bgColor: '#fff7ed',
      borderColor: '#ffedd5',
    },
    {
      id: 'titular',
      title: 'Salón Titular',
      desc: 'Registro de incidencias del aula',
      icon: School,
      color: '#0f766e',
      bgColor: '#f0fdfa',
      borderColor: '#ccfbf1',
    },
    {
      id: 'banda',
      title: 'Banda',
      desc: 'Préstamos de instrumentos musicales',
      icon: Music,
      color: '#0891b2',
      bgColor: '#ecfeff',
      borderColor: '#cffafe',
    },
    {
      id: 'rectoria',
      title: 'Rectoría',
      desc: 'Estado administrativo de docentes',
      icon: Building,
      color: '#475569',
      bgColor: '#f8fafc',
      borderColor: '#e2e8f0',
    },
  ];

  const handleModuleClick = (moduleId: string) => {
    if (moduleId === 'matricula') {
      void navigate({ to: '/dashboard/enrollment' });
    } else {
      alert(`El módulo "${moduleId.toUpperCase()}" se encuentra en desarrollo por otro equipo.`);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', padding: '4px 0 24px 0' }}>
      {/* Title block */}
      <div>
        <h2
          style={{
            fontSize: '1.75rem',
            fontWeight: 700,
            margin: '0 0 4px 0',
            color: 'var(--text-main)',
          }}
        >
          Dashboard
        </h2>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.925rem', margin: 0 }}>
          Sistema de Gestión de Paz y Salvo Institucional - Cambridge School
        </p>
      </div>

      {/* Main Banner */}
      <div
        style={{
          background: 'linear-gradient(135deg, #1e293b 0%, #0f172a 100%)',
          borderRadius: '12px',
          padding: '32px',
          color: 'white',
          position: 'relative',
          overflow: 'hidden',
          boxShadow: 'var(--shadow-md)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        {/* Subtle mesh background */}
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background:
              'radial-gradient(circle at 80% 50%, rgba(128, 28, 28, 0.15) 0%, rgba(255, 255, 255, 0) 60%)',
            pointerEvents: 'none',
          }}
        />

        <div
          style={{
            zIndex: 1,
            display: 'flex',
            flexDirection: 'column',
            gap: '8px',
            maxWidth: '600px',
          }}
        >
          <h3 style={{ color: 'white', fontSize: '1.5rem', fontWeight: 600, margin: 0 }}>
            Módulo Central de Paz y Salvo
          </h3>
          <p style={{ color: '#94a3b8', fontSize: '0.875rem', margin: 0, lineHeight: '1.6' }}>
            Consulte y administre los paz y salvos de los estudiantes, verifique el estado de las
            obligaciones financieras y autorice certificados de graduación en tiempo real.
          </p>
        </div>

        <div style={{ zIndex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div
            style={{
              width: '48px',
              height: '48px',
              borderRadius: '50%',
              backgroundColor: 'rgba(255, 255, 255, 0.1)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'white',
              cursor: 'pointer',
              transition: 'background-color 0.2s',
            }}
            onClick={() => {
              alert('Módulo Central en desarrollo');
            }}
          >
            <ArrowRight size={20} />
          </div>
        </div>
      </div>

      {/* Stats Cards Row */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
          gap: '20px',
        }}
      >
        {/* Total Estudiantes */}
        <div
          className="card"
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            margin: 0,
            padding: '20px',
          }}
        >
          <div>
            <p
              style={{
                color: 'var(--text-muted)',
                fontSize: '0.75rem',
                fontWeight: 600,
                textTransform: 'uppercase',
                margin: '0 0 6px 0',
              }}
            >
              Total Estudiantes
            </p>
            <h4 style={{ fontSize: '1.75rem', fontWeight: 700, margin: 0 }}>1,234</h4>
          </div>
          <div
            style={{
              color: '#10b981',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <CheckCircle size={28} />
          </div>
        </div>

        {/* Paz y Salvo */}
        <div
          className="card"
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            margin: 0,
            padding: '20px',
          }}
        >
          <div>
            <p
              style={{
                color: 'var(--text-muted)',
                fontSize: '0.75rem',
                fontWeight: 600,
                textTransform: 'uppercase',
                margin: '0 0 6px 0',
              }}
            >
              Paz y Salvo
            </p>
            <h4 style={{ fontSize: '1.75rem', fontWeight: 700, margin: 0 }}>987</h4>
          </div>
          <div
            style={{
              color: '#10b981',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <CheckCircle size={28} />
          </div>
        </div>

        {/* Pendientes */}
        <div
          className="card"
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            margin: 0,
            padding: '20px',
          }}
        >
          <div>
            <p
              style={{
                color: 'var(--text-muted)',
                fontSize: '0.75rem',
                fontWeight: 600,
                textTransform: 'uppercase',
                margin: '0 0 6px 0',
              }}
            >
              Pendientes
            </p>
            <h4 style={{ fontSize: '1.75rem', fontWeight: 700, margin: 0 }}>247</h4>
          </div>
          <div
            style={{
              color: '#f59e0b',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Clock size={28} />
          </div>
        </div>

        {/* Alertas */}
        <div
          className="card"
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            margin: 0,
            padding: '20px',
          }}
        >
          <div>
            <p
              style={{
                color: 'var(--text-muted)',
                fontSize: '0.75rem',
                fontWeight: 600,
                textTransform: 'uppercase',
                margin: '0 0 6px 0',
              }}
            >
              Alertas
            </p>
            <h4 style={{ fontSize: '1.75rem', fontWeight: 700, margin: 0 }}>15</h4>
          </div>
          <div
            style={{
              color: '#ef4444',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <AlertCircle size={28} />
          </div>
        </div>
      </div>

      {/* Grid of System Modules */}
      <div>
        <h3
          style={{
            fontSize: '1.125rem',
            fontWeight: 600,
            margin: '0 0 16px 0',
            color: 'var(--text-main)',
          }}
        >
          Módulos del Sistema
        </h3>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
            gap: '20px',
          }}
        >
          {modules.map((m) => {
            const IconComponent = m.icon;
            return (
              <div
                key={m.id}
                onClick={() => {
                  handleModuleClick(m.id);
                }}
                style={{
                  backgroundColor: 'white',
                  borderRadius: '12px',
                  border: `1px solid ${m.borderColor}`,
                  padding: '24px',
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: '16px',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                  boxShadow: 'var(--shadow-sm)',
                }}
                className="dashboard-module-card"
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-2px)';
                  e.currentTarget.style.boxShadow = 'var(--shadow-md)';
                  e.currentTarget.style.borderColor = m.color;
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'none';
                  e.currentTarget.style.boxShadow = 'var(--shadow-sm)';
                  e.currentTarget.style.borderColor = m.borderColor;
                }}
              >
                <div
                  style={{
                    width: '46px',
                    height: '46px',
                    borderRadius: '10px',
                    backgroundColor: m.bgColor,
                    color: m.color,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                  }}
                >
                  <IconComponent size={22} />
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                  <h4
                    style={{
                      fontSize: '1rem',
                      fontWeight: 600,
                      margin: 0,
                      color: 'var(--text-main)',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px',
                    }}
                  >
                    {m.title}
                  </h4>
                  <p
                    style={{
                      color: 'var(--text-muted)',
                      fontSize: '0.8125rem',
                      margin: 0,
                      lineHeight: '1.4',
                    }}
                  >
                    {m.desc}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
