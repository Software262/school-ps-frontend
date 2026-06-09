interface ModuleAlertProps {
  icon?: string;
  title?: string;
  message?: string;
}

export const ModuleAlert = ({
  icon = '🔔',
  title = 'Alertas de Vencimiento',
  message = 'El sistema envía alertas automáticas antes del vencimiento de cada préstamo.',
}: ModuleAlertProps) => (
  <div className="band-alert">
    <div className="band-alert-icon">{icon}</div>
    <div className="band-alert-content">
      <h3>{title}</h3>
      <p>{message}</p>
    </div>
  </div>
);
