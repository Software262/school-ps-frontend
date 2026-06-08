import { useState } from 'react';
import { PazYSalvoSearch, StatusPanel } from '@/features/paz-y-salvo';
import './PazYSalvoPage.css';

const PazYSalvoPage = () => {
  const [selectedStudentId, setSelectedStudentId] = useState<number | null>(null);
  const [selectedTeacherId, setSelectedTeacherId] = useState<number | null>(null);

  return (
    <div className="paz-y-salvo-page fadeIn">
      <div className="page-title">
        <h1>Paz y Salvo</h1>
        <p>Genere certificados de paz y salvo para estudiantes y docentes</p>
      </div>

      <PazYSalvoSearch
        onSelectStudent={(id) => {
          setSelectedStudentId(id);
          setSelectedTeacherId(null);
        }}
        onSelectTeacher={(id) => {
          setSelectedTeacherId(id);
          setSelectedStudentId(null);
        }}
      />

      {selectedStudentId && <StatusPanel entityId={selectedStudentId} entityType="student" />}

      {selectedTeacherId && <StatusPanel entityId={selectedTeacherId} entityType="teacher" />}
    </div>
  );
};

export default PazYSalvoPage;
