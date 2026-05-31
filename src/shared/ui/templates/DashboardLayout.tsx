import { useState, type ReactNode } from 'react';
import { Sidebar } from '../organisms/Sidebar';
import { Header } from '../organisms/Header';

export const DashboardLayout = ({ children }: { children: ReactNode }) => {
  const [sidebarOpen, setSidebarOpen] = useState(true);

  return (
    <div className="flex h-screen" style={{ backgroundColor: '#E9E9E7' }}>
      <Sidebar isOpen={sidebarOpen} />

      <div className="flex-1 flex flex-col overflow-hidden">
        <Header
          sidebarOpen={sidebarOpen}
          onToggleSidebar={() => {
            setSidebarOpen(!sidebarOpen);
          }}
        />

        <main className="flex-1 overflow-auto p-6">{children}</main>
      </div>
    </div>
  );
};
