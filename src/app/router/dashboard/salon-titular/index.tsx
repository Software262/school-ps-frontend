/* eslint-disable */
import { createFileRoute, useNavigate } from '@tanstack/react-router';
import { Sidebar } from '../../../../shared/ui/Sidebar';
import { TopBar } from '../../../../shared/ui/TopBar';
import { ClassroomHolderPage } from '../../../../features/classroom-holder/pages/ClassroomHolderPage';

export const Route = createFileRoute('/dashboard/salon-titular/')({
  component: () => {
    const navigate = useNavigate();

    function handleNavigate(id: string) {
      if (id === 'rectoria') void navigate({ to: '/dashboard/rectoria' });
      if (id === 'titular') void navigate({ to: '/dashboard/salon-titular' });
    }

    return (
      <div style={{ display: 'flex', minHeight: '100vh', width: '100vw', backgroundColor: '#f3f4f6' }}>
        <div style={{ width: '260px', flexShrink: 0 }}>
          <Sidebar activeItem="titular" onNavigate={handleNavigate} />
        </div>
        <div style={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
          <TopBar schoolName="Cambridge School" />
          <main style={{ flexGrow: 1, overflowY: 'auto' }}>
            <ClassroomHolderPage />
          </main>
        </div>
      </div>
    );
  },
});