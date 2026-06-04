import { EscuelasFormacionList } from '@/features/escuelas-formacion/components/EscuelasFormacionList';
import './EscuelasFormacionPage.css';

const EscuelasFormacionPage = () => {
  return (
    <main className="ef-page" id="main-content">
      <div className="ef-page-header">
        <h1 className="ef-page-title">Escuelas de Formación</h1>
        <p className="ef-page-subtitle">Gestión de programas formativos</p>
      </div>

      <EscuelasFormacionList />
    </main>
  );
};

export default EscuelasFormacionPage;
