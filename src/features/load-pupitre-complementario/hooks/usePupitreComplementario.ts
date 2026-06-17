// hooks/usePupitreComplementario.ts
import { useState, useEffect } from 'react';
import { getPupitreComplementario } from '../api/load-pupitre-complementario';

interface ComplementarioPupitre {
  id: number;
  nombre: string;
  valor: number;
  anio: number;
}

export const usePupitreComplementario = () => {
  const [complementario, setComplementario] = useState<ComplementarioPupitre | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await getPupitreComplementario();
        setComplementario(response.data);
      } catch {
        setComplementario(null);
      }
    };
    void fetchData();
  }, []);

  return complementario;
};
