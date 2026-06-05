import { TeacherList } from '@/features/rectoria/components/TeacherList';
import './RectoriaPage.css';

const RectoriaPage = () => {
  return (
    <main className="rectoria-page" id="main-content">
      <div className="rectoria-page-header">
        <h1 className="rectoria-page-title">Módulo de Rectoría</h1>
        <p className="rectoria-page-subtitle">Estado administrativo de docentes</p>
      </div>

      <TeacherList />
    </main>
  );
};

export default RectoriaPage;
