import { LoaderCircle, Play } from 'lucide-react';

interface RunWebcolegiosScrapingButtonProps {
  label?: string;
  loading: boolean;
  onClick?: () => void;
}

export const RunWebcolegiosScrapingButton = ({
  label = 'Conectar / Ejecutar scraping',
  loading,
  onClick,
}: RunWebcolegiosScrapingButtonProps) => {
  return (
    <button
      className="webcolegios-run-button"
      type={onClick ? 'button' : 'submit'}
      disabled={loading}
      onClick={onClick}
    >
      {loading ? (
        <LoaderCircle className="webcolegios-button-icon spinning" aria-hidden="true" />
      ) : (
        <Play className="webcolegios-button-icon" aria-hidden="true" />
      )}
      <span>{loading ? 'Ejecutando scraping' : label}</span>
    </button>
  );
};
