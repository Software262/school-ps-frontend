import { useEffect, useState } from 'react';

/**
 * Devuelve una versión "retrasada" del valor que sólo se actualiza cuando el
 * usuario deja de escribir durante `delay` ms. Útil para no disparar una
 * petición al servidor en cada pulsación de tecla.
 */
export const useDebouncedValue = <T>(value: T, delay = 400): T => {
  const [debounced, setDebounced] = useState(value);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebounced(value);
    }, delay);

    return () => {
      clearTimeout(timer);
    };
  }, [value, delay]);

  return debounced;
};
