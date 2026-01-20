'use client';
import { useEffect, useState } from 'react';
import { Menu, X } from 'lucide-react';
import SidebarContent from "@/app/components/SidebarContent";

export default function MobileLayout({ children }: { children: React.ReactNode }) {
  // Sidebar ouverte par défaut sur mobile quand on arrive sur un chapitre
  const [sidebarOpen, setSidebarOpen] = useState(true);

  // Log pour confirmer que MobileLayout est utilisé
  useEffect(() => {
    console.log('📱 MOBILE LAYOUT ACTIF - sidebarOpen:', sidebarOpen);
  }, [sidebarOpen]);

  // Bloquer le scroll quand la sidebar est ouverte
  useEffect(() => {
    if (sidebarOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }

    return () => {
      document.body.style.overflow = '';
    };
  }, [sidebarOpen]);
  return (
    <div className="md:hidden flex flex-col h-screen w-full bg-zinc-950">
<header className="sticky top-0 z-30 bg-gray-900 border-b border-white-100 backdrop-blur-sm">
  <div className="px-4 py-3 flex items-center justify-between">
    <div className="flex items-center gap-3">
      <button 
        onClick={() => setSidebarOpen(!sidebarOpen)} 
        className="p-2 -ml-2 text-gray-400 hover:text-white hover:bg-gray-800 rounded-lg transition-all duration-200 active:scale-95"
        aria-label={sidebarOpen ? "Fermer le menu" : "Ouvrir le menu"}
      >
        {sidebarOpen ? <X size={22} /> : <Menu size={22} />}
      </button>
      
      <div className="flex items-center gap-1">
  <div className="p-1.5 rounded-lg">
    <img
      src="/img/logo_ecrit_blanc-point.png"
      alt="Logo "
      className="w-9 h-8 object-contain "
    />
  </div>
  <h1 className="md:text-xl sm:text-md font-bold text-white" style={{ fontFamily: "'Spectral', serif" }}>
    
  </h1>
</div>

    </div>
    
  </div>
</header>

      <main className="flex-1 overflow-y-auto w-full">
        <div className="w-full h-full">
          {children}
        </div>
      </main>

      {sidebarOpen && (
         <div className="fixed inset-0 z-40 flex">
          <div 
            onClick={() => setSidebarOpen(false)} 
            className="absolute inset-0 bg-black/50 transition-opacity duration-300" 
          />
          <aside className="relative z-50 h-full w-72 bg-gradient-to-b from-zinc-900 to-zinc-800 shadow-xl transform transition-transform duration-300">
            <SidebarContent />
          </aside>
        </div>
      )}
    </div>
  );
}
