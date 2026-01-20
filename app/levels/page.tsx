'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { BookOpen, GraduationCap, ArrowRight, BookMarked, Languages, Clock } from 'lucide-react';
import DashboardHeader from '@/app/components/DashboardHeader';
import DashboardSidebar from '@/app/components/DashboardSidebar';

interface User {
  id: string;
  email: string;
  username: string | null;
  isActive: boolean;
  accountType?: 'ACTIVE' | 'INACTIVE' | 'PAID_LEGACY';
  subscriptionPlan: 'SOLO' | 'COACHING' | null;
  hasActiveSubscription?: boolean;
}

const mockHomeworkSends = [
  { id: '1', sentAt: '2026-01-10', homework: { id: 'hw1', chapterId: 1, title: 'Devoir Chapitre A' } },
  { id: '2', sentAt: '2026-01-12', homework: { id: 'hw2', chapterId: 2, title: 'Devoir Chapitre B' } },
];

export default function NiveauxPage() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const router = useRouter();

  const fetchUserData = async () => {
    try {
      const res = await fetch('/api/auth/me');
      if (res.ok) {
        const data = await res.json();
        setUser(data.user);
      } else {
        router.push('/login');
      }
    } catch (error) {
      console.error('Erreur auth:', error);
      router.push('/login');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUserData();
  }, []);

  const handleAccessModule = (module: 'A' | 'B') => {
    localStorage.setItem('selectedDashboardModule', module);
    router.push('/dashboard');
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin h-12 w-12 border-4 border-blue-600 border-t-transparent rounded-full mx-auto mb-4" />
          <p className="text-gray-600 text-lg">Chargement...</p>
        </div>
      </div>
    );
  }

  if (!user) return null;

  return (
    <div className="min-h-screen bg-gray-50">
      <DashboardSidebar
        mobileMenuOpen={mobileMenuOpen}
        setMobileMenuOpen={setMobileMenuOpen}
      />

      {mobileMenuOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-20 lg:hidden"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}

      <div className="lg:ml-64">
        <DashboardHeader
          user={user}
          mobileMenuOpen={mobileMenuOpen}
          setMobileMenuOpen={setMobileMenuOpen}
          homeworkSends={mockHomeworkSends}
        />

        <main className="p-6 lg:p-10">
          {/* En-tête */}
          <div className="text-center mb-10">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl mb-4 shadow-lg">
              <GraduationCap className="h-8 w-8 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Choisissez votre module
            </h1>
            <p className="text-gray-500">
              Sélectionnez le module que vous souhaitez suivre
            </p>
          </div>

          {/* Liste des modules - Pleine largeur */}
          <div className="max-w-3xl mx-auto space-y-4">
            
            {/* Module A */}
            <div className="bg-white rounded-2xl border border-gray-200 shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden">
              <div className="flex flex-col sm:flex-row items-stretch">
                <div className="bg-gradient-to-br from-blue-500 to-blue-700 p-6 sm:p-8 flex items-center justify-center">
                  <BookOpen className="h-10 w-10 text-white" />
                </div>
                
                <div className="flex-1 p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  <div>
                    <h2 className="text-xl font-bold text-gray-900 mb-1">Module A</h2>
                    <p className="text-gray-500 text-sm">Cours principal - Fondamentaux</p>
                  </div>
                  <button
                    onClick={() => handleAccessModule('A')}
                    className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-xl transition-all duration-200 flex items-center justify-center gap-2 shadow-md hover:shadow-lg"
                  >
                    <span>Accéder</span>
                    <ArrowRight className="h-5 w-5" />
                  </button>
                </div>
              </div>
            </div>

            {/* Module B */}
            <div className="bg-white rounded-2xl border border-gray-200 shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden">
              <div className="flex flex-col sm:flex-row items-stretch">
                <div className="bg-gradient-to-br from-purple-500 to-purple-700 p-6 sm:p-8 flex items-center justify-center">
                  <BookMarked className="h-10 w-10 text-white" />
                </div>
                
                <div className="flex-1 p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  <div>
                    <h2 className="text-xl font-bold text-gray-900 mb-1">Module B</h2>
                    <p className="text-gray-500 text-sm">Cours avancé - Perfectionnement</p>
                  </div>
                  <button
                    onClick={() => handleAccessModule('B')}
                    className="w-full sm:w-auto bg-purple-600 hover:bg-purple-700 text-white font-semibold py-3 px-6 rounded-xl transition-all duration-200 flex items-center justify-center gap-2 shadow-md hover:shadow-lg"
                  >
                    <span>Accéder</span>
                    <ArrowRight className="h-5 w-5" />
                  </button>
                </div>
              </div>
            </div>

            {/* Module C - Bientôt disponible */}
            <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden opacity-60">
              <div className="flex flex-col sm:flex-row items-stretch">
                <div className="bg-gradient-to-br from-amber-500 to-orange-600 p-6 sm:p-8 flex items-center justify-center">
                  <Languages className="h-10 w-10 text-white" />
                </div>
                
                <div className="flex-1 p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  <div>
                    <h2 className="text-xl font-bold text-gray-900 mb-1">Module C</h2>
                    <p className="text-gray-500 text-sm">Cours spécialisé - Expertise</p>
                  </div>
                  <div className="w-full sm:w-auto bg-gray-200 text-gray-500 font-medium py-3 px-6 rounded-xl flex items-center justify-center gap-2 cursor-not-allowed">
                    <Clock className="h-5 w-5" />
                    <span>Bientôt</span>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </main>
      </div>
    </div>
  );
}
