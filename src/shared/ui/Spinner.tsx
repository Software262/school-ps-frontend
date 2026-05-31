interface SpinnerProps {
  size?: number;
  color?: string;
}

export const Spinner = ({
  size = 20,
  color = "var(--brand-primary)",
}: SpinnerProps) => (
  <span
    role="status"
    aria-label="Cargando…"
    style={{
      display: "inline-block",
      width: size,
      height: size,
      border: `2px solid ${color}33`,
      borderTopColor: color,
      borderRadius: "50%",
      animation: "spin 0.7s linear infinite",
      flexShrink: 0,
    }}
  />
);
