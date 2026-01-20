'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Brain, Clock, Coffee, Moon, Zap, Heart, CheckCircle, Smile, Calendar, Lightbulb } from 'lucide-react';

import DashboardHeader from '@/app/components/DashboardHeader';
import DashboardSidebar from '@/app/components/DashboardSidebar';

interface User {
  id: string;
  email: string;
  username: string | null;
  isActive: boolean;
  accountType: 'ACTIVE' | 'INACTIVE' | 'PAID_LEGACY';
  subscriptionPlan?: 'SOLO' | 'COACHING' | null;
}

interface HomeworkSend {
  id: string;
  sentAt: string;
  homework: {
    id: string;
    chapterId: number;
    title: string;
  };
}

const mockHomeworkSends: HomeworkSend[] = [
  { id: '1', sentAt: '2026-01-10', homework: { id: 'hw1', chapterId: 1, title: 'Devoir Chapitre A' } },
  { id: '2', sentAt: '2026-01-12', homework: { id: 'hw2', chapterId: 2, title: 'Devoir Chapitre B' } },
];

export default function ConseilsPage() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await fetch('/api/auth/me');
        if (response.ok) {
          const userData = await response.json();
          setUser(userData.user);
        } else {
          router.push('/login');
        }
      } catch (error) {
        console.error('Auth check error:', error);
        router.push('/login');
      } finally {
        setLoading(false);
      }
    };
    checkAuth();
  }, [router]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-500 mx-auto mb-6"></div>
          <p className="text-gray-600 text-lg font-medium">
            Chargement des conseils...
          </p>
        </div>
      </div>
    );
  }

  if (!user) return null;

  const conseils = [
    {
      id: 'memorisation-matin-soir',
      title: 'La mémorisation est optimale au réveil et avant de dormir',
      icon: <Moon className="h-6 w-6 text-indigo-600" />,
      content: [
        'Étudier juste après le réveil ou avant de dormir améliore la rétention de la mémoire.',
        'Profitez de ces moments où le cerveau est calme pour consolider vos apprentissages.',
      ],
      bgColor: 'bg-indigo-50',
      borderColor: 'border-indigo-200',
      iconBg: 'bg-indigo-100',
    },
    {
      id: 'rythme',
      title: 'Ne vous précipitez pas',
      icon: <Clock className="h-6 w-6 text-blue-600" />,
      content: [
        'Prenez le temps de bien comprendre chaque notion avant de passer à la suivante.',
        'Laissez un temps de mémorisation entre deux sessions sur la plateforme.',
      ],
      bgColor: 'bg-blue-50',
      borderColor: 'border-blue-200',
      iconBg: 'bg-blue-100',
    },
    {
      id: 'regularite',
      title: 'La régularité vaut mieux que la quantité',
      icon: <Calendar className="h-6 w-6 text-green-600" />,
      content: [
        'Étudier 15 à 20 minutes chaque jour est plus efficace que 3 heures une seule fois par semaine.',
        'Créez une routine courte mais constante.',
      ],
      bgColor: 'bg-green-50',
      borderColor: 'border-green-200',
      iconBg: 'bg-green-100',
    },
    {
      id: 'pause',
      title: 'Faites des pauses régulières',
      icon: <Coffee className="h-6 w-6 text-orange-600" />,
      content: [
        "Après 30 à 40 minutes d'apprentissage, accordez-vous 5 à 10 minutes de pause.",
        "Cela permet au cerveau de se reposer et d'assimiler plus efficacement.",
      ],
      bgColor: 'bg-orange-50',
      borderColor: 'border-orange-200',
      iconBg: 'bg-orange-100',
    },
    {
      id: 'confiance',
      title: 'Faites-vous confiance',
      icon: <Heart className="h-6 w-6 text-pink-600" />,
      content: [
        'Chaque progrès, même petit, compte.',
        "Ne vous comparez pas : votre rythme d'apprentissage est unique.",
      ],
      bgColor: 'bg-pink-50',
      borderColor: 'border-pink-200',
      iconBg: 'bg-pink-100',
    },
    {
      id: 'repetition-active',
      title: 'Révisez activement',
      icon: <Zap className="h-6 w-6 text-yellow-600" />,
      content: [
        'Essayez de vous rappeler une notion avant de relire la leçon.',
        "L'effort de se souvenir renforce la mémoire beaucoup plus efficacement.",
      ],
      bgColor: 'bg-yellow-50',
      borderColor: 'border-yellow-200',
      iconBg: 'bg-yellow-100',
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Sidebar */}
      <DashboardSidebar
        mobileMenuOpen={mobileMenuOpen}
        setMobileMenuOpen={setMobileMenuOpen}
      />

      {/* Overlay mobile */}
      {mobileMenuOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-20 lg:hidden"
          onClick={() => setMobileMenuOpen(false)}
        ></div>
      )}

      {/* Contenu principal */}
      <div className="lg:ml-64">
        <DashboardHeader
          user={user}
          mobileMenuOpen={mobileMenuOpen}
          setMobileMenuOpen={setMobileMenuOpen}
          homeworkSends={mockHomeworkSends}
        />

        <main className="p-4 lg:p-8">
          {/* En-tête de page */}
          <div className="mb-8">
            <div className="flex items-center gap-3 mb-2">
              <div className="bg-blue-600 p-3 rounded-xl">
                <Lightbulb className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">
                  Conseils pour bien apprendre
                </h1>
                <p className="text-gray-500">
                  Adoptez les bons réflexes pour progresser efficacement
                </p>
              </div>
            </div>
          </div>

          {/* Grille des conseils */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {conseils.map((item) => (
              <div
                key={item.id}
                className={`${item.bgColor} ${item.borderColor} border rounded-xl p-6 hover:shadow-md transition-shadow duration-300`}
              >
                <div className="flex items-center space-x-4 mb-4">
                  <div
                    className={`${item.iconBg} w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0`}
                  >
                    {item.icon}
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900">
                    {item.title}
                  </h3>
                </div>
                <div className="space-y-3">
                  {item.content.map((text, i) => (
                    <div key={i} className="flex items-start space-x-3">
                      <CheckCircle className="h-4 w-4 text-gray-400 mt-1" />
                      <p className="text-gray-700 text-sm leading-relaxed">
                        {text}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* Message de motivation */}
          <div className="mt-10 bg-blue-100 border border-blue-200 rounded-xl p-6 flex items-center space-x-4">
            <Smile className="h-8 w-8 text-blue-700 flex-shrink-0" />
            <p className="text-blue-800 text-sm md:text-base font-medium">
              🌟 Chaque jour est une nouvelle occasion d'apprendre.  
              Prenez plaisir à chaque session, même courte !
            </p>
          </div>
        </main>
      </div>
    </div>
  );
}
