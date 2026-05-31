export interface StatusBadgeProps {
  status: string;
  label?: string;
}

export function StatusBadge({ status, label }: StatusBadgeProps) {
  const config: Record<
    string,
    { bg: string; text: string; border: string; dot: string; label: string }
  > = {
    // Paz y salvo / Pagado
    "paz-y-salvo": {
      bg: "#ecfdf5",
      text: "#065f46",
      border: "#6ee7b7",
      dot: "#10b981",
      label: label ?? "Paz y Salvo",
    },
    pagado: {
      bg: "#ecfdf5",
      text: "#065f46",
      border: "#6ee7b7",
      dot: "#10b981",
      label: label ?? "Pagado",
    },
    // Para el módulo de pruebas usa "pagada"
    pagada: {
      bg: "#ecfdf5",
      text: "#065f46",
      border: "#6ee7b7",
      dot: "#10b981",
      label: label ?? "Pagada",
    },
    // Pendiente — naranja cálido
    pendiente: {
      bg: "#fff7ed",
      text: "#9a3412",
      border: "#fdba74",
      dot: "#f97316",
      label: label ?? "Pendiente",
    },
    // Pago parcial — azul índigo
    "pago-parcial": {
      bg: "#eff6ff",
      text: "#1e40af",
      border: "#93c5fd",
      dot: "#3b82f6",
      label: label ?? "Pago parcial",
    },
    // Vencido — rojo intenso
    vencido: {
      bg: "#fef2f2",
      text: "#991b1b",
      border: "#fca5a5",
      dot: "#ef4444",
      label: label ?? "Vencido",
    },
  };

  const defaultStyle = {
    bg: "#f9fafb",
    text: "#374151",
    border: "#d1d5db",
    dot: "#9ca3af",
    label: label ?? status,
  };

  const currentConfig = config[status.toLowerCase()] ?? defaultStyle;

  return (
    <span
      className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold border"
      style={{
        backgroundColor: currentConfig.bg,
        color: currentConfig.text,
        borderColor: currentConfig.border,
      }}
    >
      <span
        className="w-1.5 h-1.5 rounded-full shrink-0"
        style={{ backgroundColor: currentConfig.dot }}
      />
      {currentConfig.label}
    </span>
  );
}
