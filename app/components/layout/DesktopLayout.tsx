'use client';

import { useEffect } from "react";
import SidebarContent from "@/app/components/SidebarContent";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useAutoOpenSidebar } from '@/hooks/useAutoOpenSidebar';

export default function DesktopLayout({ children }: { children: React.ReactNode }) {
  // Utiliser le hook - sidebarOpen correspond à "non collapsed" (sidebar visible)
  const { sidebarOpen, setSidebarOpen } = useAutoOpenSidebar();
  
  // collapsed = !sidebarOpen (inverse de la logique du hook)
  const collapsed = !sidebarOpen;
  const setCollapsed = (value: boolean) => setSidebarOpen(!value);

  return (
    <div className="flex h-screen overflow-hidden relative z-[1]">
      <div
        className={`transition-all duration-300 bg-zinc-900 border-r border-zinc-800
        ${collapsed ? 'w-0' : 'w-70'}
        relative
      `}
      >
        {!collapsed && (
          <div className="h-full flex flex-col">
            <SidebarContent />
          </div>
        )}

        <button
          onClick={() => setCollapsed(!collapsed)}
          className={`
            absolute top-2 -right-4 z-50 
            bg-zinc-800 hover:bg-zinc-700 text-white 
            rounded-full p-1 shadow-md border border-zinc-700
            transition-all duration-300
            ${collapsed ? 'translate-x-4' : ''}
          `}
          title={collapsed ? "Ouvrir le menu" : "Fermer le menu"}
        >
          {collapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
        </button>
      </div>

      <div className="flex-1 overflow-y-auto">
        <div className="p-1">{children}</div>
      </div>
    </div>
  );
}
