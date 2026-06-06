import type { ReactNode, CSSProperties } from 'react';

export type BadgeVariant = 'green' | 'yellow' | 'red' | 'gray' | 'neutral';

interface BadgeProps {
  variant: BadgeVariant;
  className?: string;
  children: ReactNode;
}

const variantStyles: Record<BadgeVariant, CSSProperties> = {
  green: {
    background: 'var(--status-green-bg)',
    color: 'var(--status-green)',
    border: '1px solid var(--status-green-border)',
  },
  yellow: {
    background: 'var(--status-yellow-bg)',
    color: 'var(--status-yellow)',
    border: '1px solid var(--status-yellow-border)',
  },
  red: {
    background: 'var(--status-red-bg)',
    color: 'var(--status-red)',
    border: '1px solid var(--status-red-border)',
  },
  gray: {
    background: 'var(--status-gray-bg)',
    color: 'var(--status-gray)',
    border: '1px solid var(--status-gray-border)',
  },
  neutral: {
    background: 'var(--status-gray-bg)',
    color: 'var(--status-gray)',
    border: '1px solid var(--status-gray-border)',
  },
};

export const Badge = ({ variant, children, className = '' }: BadgeProps) => (
  <span
    className={className}
    style={{
      ...variantStyles[variant],
      display: 'inline-flex',
      alignItems: 'center',
      gap: 4,
      padding: '2px 8px',
      borderRadius: 99,
      fontSize: 'var(--font-size-xs)',
      fontWeight: 500,
      lineHeight: 1.6,
      whiteSpace: 'nowrap',
    }}
  >
    {children}
  </span>
);
