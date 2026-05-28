/* eslint-disable */
import { createRootRoute, Outlet } from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/react-router-devtools";
import { useState } from "react";
import { Sidebar } from "../../shared/ui/organisms/Sidebar";
import { Header } from "../../shared/ui/organisms/Header";

export const Route = createRootRoute({
  component: RootComponent,
});

function RootComponent() {
  const [sidebarOpen, setSidebarOpen] = useState(true);

  return (
    <div className="flex h-screen" style={{ backgroundColor: '#E9E9E7' }}>
      <Sidebar isOpen={sidebarOpen} />
      
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header sidebarOpen={sidebarOpen} onToggleSidebar={() => setSidebarOpen(!sidebarOpen)} />
        
        <main className="flex-1 overflow-auto p-6">
          <Outlet />
        </main>
      </div>

      <TanStackRouterDevtools />
    </div>
  );
}



