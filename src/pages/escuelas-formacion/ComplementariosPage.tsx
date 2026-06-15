import { Link } from '@tanstack/react-router';
import { ArrowLeft } from 'lucide-react';
import { ComplementariosManager } from '@/features/manage-complementarios';
import './EscuelasFormacionPage.css';

const ComplementariosPage = () => {
  return (
    <main className="ef-page" id="main-content">
      <div className="ef-page-header">
        <Link to="/dashboard/escuelas-formacion" className="ef-back-link">
          <ArrowLeft size={16} /> Volver a Escuelas de Formación
        </Link>
        <h1 className="ef-page-title">Gestión de Complementarios</h1>
        <p className="ef-page-subtitle">
          Administra los tipos y conceptos complementarios de Escuelas de Formación
        </p>
      </div>

      <ComplementariosManager />
    </main>
  );
};

export default ComplementariosPage;
