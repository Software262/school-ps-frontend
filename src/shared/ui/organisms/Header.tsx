import { Menu, X } from "lucide-react";

interface HeaderProps {
  sidebarOpen: boolean;
  onToggleSidebar: () => void;
}

export function Header({ sidebarOpen, onToggleSidebar }: HeaderProps) {
  return (
    <header
      className="bg-white border-b px-6 py-4 shrink-0"
      style={{ borderColor: "#d0d0ce" }}
    >
      <div className="flex items-center gap-4">
        <button
          onClick={onToggleSidebar}
          className="p-2 rounded-lg transition-colors"
          style={{ color: "#8E2A25" }}
          onMouseEnter={(e) =>
            (e.currentTarget.style.backgroundColor = "#E9E9E7")
          }
          onMouseLeave={(e) =>
            (e.currentTarget.style.backgroundColor = "transparent")
          }
        >
          {sidebarOpen ? (
            <X className="w-5 h-5" />
          ) : (
            <Menu className="w-5 h-5" />
          )}
        </button>
        <div className="flex-1">
          <p className="text-sm" style={{ color: "#333333" }}>
            Bienvenido al Sistema de Paz y Salvo - Cambridge School
          </p>
        </div>
      </div>
    </header>
  );
}
