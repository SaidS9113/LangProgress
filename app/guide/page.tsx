'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { BookOpen, Volume2, CheckCircle, Mail, MessageCircle, Users, GraduationCap, Clock, AlertTriangle, Headphones, Send, Phone, Star, Zap, Award, Bell, Heart } from 'lucide-react';
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

export default function NoticePage() {
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
          <p className="text-gray-600 text-lg font-medium">Chargement de la notice...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  const noticeItems = [
    {
      id: 'support-dynamique',
      title: 'Support dynamique',
      icon: <Volume2 className="h-6 w-6 text-blue-600" />,
      content: [
        'Nous avons intégré plus de 530 éléments interactifs à travers les leçons.',
        'Il vous suffit de cliquer sur un élément pour interagir.',
        'Vous pouvez cliquer en illimité pour pratiquer.'
      ],
      bgColor: 'bg-blue-50',
      borderColor: 'border-blue-200',
      iconBg: 'bg-blue-100'
    },
    {
      id: 'validation-pages',
      title: 'Validation des pages et chapitres',
      icon: <CheckCircle className="h-6 w-6 text-green-600" />,
      content: [
        'Pour valider une page, vous devez rester en moyenne 6 secondes dessus.',
        'Lors d\'une actualisation du site ou d\'un retour dans le tableau de bord, vous verrez les pages prises en compte avec un check vert ✅ à côté.',
        'La validation d\'un chapitre est visible lorsque l\'intitulé du chapitre devient bleu.',
        'Vous pouvez aussi valider une page manuellement en cliquant sur le rond associé à la page.'
      ],
      bgColor: 'bg-green-50',
      borderColor: 'border-green-200',
      iconBg: 'bg-green-100'
    },
    {
      id: 'devoirs-automatiques',
      title: 'Devoirs automatiques',
      icon: <Mail className="h-6 w-6 text-orange-600" />,
      content: [
        'L\'envoi de vos devoirs se fait automatiquement si toutes les pages (y compris le quiz) sont complétées.',
        'Cela déclenche l\'envoi automatique de vos devoirs vers votre mail.',
        '⚠️ Pensez à vérifier vos spams si vous ne recevez pas votre devoir.'
      ],
      bgColor: 'bg-orange-50',
      borderColor: 'border-orange-200',
      iconBg: 'bg-orange-100',
      hasWarning: true
    },
    {
      id: 'contact-support',
      title: 'Contact support',
      icon: <MessageCircle className="h-6 w-6 text-purple-600" />,
      content: [
        'Une bulle est disponible à côté du profil.',
        'Vous pouvez poser vos questions ou signaler :',
        '• Un problème technique (bug audio/vidéo)',
        '• Une erreur constatée',
        '• Une demande de nouvelle fonctionnalité',
        'Toutes vos demandes seront envoyées directement et vous recevrez une réponse au plus vite.'
      ],
      bgColor: 'bg-purple-50',
      borderColor: 'border-purple-200',
      iconBg: 'bg-purple-100'
    },
    {
      id: 'coaching',
      title: 'Coaching',
      icon: <Users className="h-6 w-6 text-indigo-600" />,
      content: [
        'Vous pouvez demander un coaching personnalisé.',
        'Selon la complexité de votre difficulté, vous aurez la possibilité d\'un suivi :',
        '• Par messages vocaux',
        '💙 Vous n\'êtes pas seuls ! Nous surveillons votre progression en temps réel.',
        '• Vérification que vos devoirs vous sont bien envoyés',
        '• Suivi de votre progression global',
        '• Ajustement du rythme si cela avance trop vite',
        '• À chaque rendu de devoir, un espace personnalisé est créé pour un suivi optimal'
      ],
      bgColor: 'bg-indigo-50',
      borderColor: 'border-indigo-200',
      iconBg: 'bg-indigo-100'
    },
    {
      id: 'niveaux',
      title: 'Niveaux',
      icon: <GraduationCap className="h-6 w-6 text-pink-600" />,
      content: [
        'De nouveaux niveaux arriveront progressivement :',
        '• Module B',
        '• Module C',
        '• Module D',
        '• Module E',
        'Vous serez notifiés par mail dès leur disponibilité.',
        'Vous pourrez les débloquer en choisissant le niveau qui vous convient.'
      ],
      bgColor: 'bg-pink-50',
      borderColor: 'border-pink-200',
      iconBg: 'bg-pink-100',
      hasNotification: true
    },
    {
      id: 'Rendu-devoirs',
      title: 'Rendu de devoirs',
      icon: <Award className="h-6 w-6 text-teal-600" />,
      content: [
        'À la fin de chaque devoir, vous trouverez les instructions pour le rendu.',
        'Le rendu de devoirs se fait via l\'onglet accessible sur votre tableau de bord (Dashboard).',
        'Vous avez la possibilité de rendre votre devoir sous différents formats : PDF, DOCS, ou tout autre fichier.',
        'Vous pouvez également rendre votre devoir en audio 🎧 ou le rédiger directement en texte via le champ intégré.',
        'Chaque rendu est corrigé puis conservé dans un espace sécurisé auquel vous aurez accès pour assurer un suivi optimal.'
      ],
      bgColor: 'bg-teal-50',
      borderColor: 'border-teal-200',
      iconBg: 'bg-teal-100'
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Sidebar */}
      <DashboardSidebar
        mobileMenuOpen={mobileMenuOpen}
        setMobileMenuOpen={setMobileMenuOpen}
      />

      {/* Mobile Menu Overlay */}
      {mobileMenuOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-20 lg:hidden"
          onClick={() => setMobileMenuOpen(false)}
        ></div>
      )}

      {/* Main Content */}
      <div className="lg:ml-64">
        {/* Header */}
        <DashboardHeader
          user={user}
          mobileMenuOpen={mobileMenuOpen}
          setMobileMenuOpen={setMobileMenuOpen}
          homeworkSends={mockHomeworkSends}
        />

        {/* Main Content */}
        <main className="p-4 lg:p-8">
          {/* Page Header */}
          <div className="mb-8">
            <div className="flex items-center space-x-4 mb-4">
              <div className="bg-blue-600 p-3 rounded-xl">
                <BookOpen className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">
                  Notice d'utilisation
                </h1>
                <p className="text-gray-500">Guide complet pour utiliser la plateforme</p>
              </div>
            </div>
          </div>

          {/* Notice Cards Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {noticeItems.map((item) => (
              <div
                key={item.id}
                className={`${item.bgColor} ${item.borderColor} border rounded-xl p-6 hover:shadow-md transition-shadow duration-300 relative overflow-hidden`}
              >
                {/* Header with Icon and Title */}
                <div className="flex items-center space-x-4 mb-6">
                  <div className={`${item.iconBg} w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0`}>
                    {item.icon}
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-semibold text-gray-900 mb-1">
                      {item.title}
                    </h3>
                    {item.hasNotification && (
                      <div className="flex items-center space-x-2">
                        <Bell className="h-4 w-4 text-pink-500" />
                        <span className="text-sm text-pink-600 font-medium">Notifications activées</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Content */}
                <div className="space-y-3">
                  {item.content.map((text, index) => (
                    <div key={index} className="flex items-start space-x-3">
                      {text.includes('⚠️') ? (
                        <div className="bg-yellow-100 border border-yellow-300 rounded-lg p-3 w-full">
                          <div className="flex items-start space-x-2">
                            <AlertTriangle className="h-5 w-5 text-yellow-600 flex-shrink-0 mt-0.5" />
                            <p className="text-yellow-800 text-sm font-medium">
                              {text.replace('⚠️', '').trim()}
                            </p>
                          </div>
                        </div>
                      ) : text.includes('💙') ? (
                        <div className="bg-blue-100 border border-blue-300 rounded-lg p-3 w-full">
                          <div className="flex items-start space-x-2">
                            <Heart className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" />
                            <p className="text-blue-800 text-sm font-medium">
                              {text.replace('💙', '').trim()}
                            </p>
                          </div>
                        </div>
                      ) : (
                        <>
                          <div className="w-2 h-2 bg-blue-500 rounded-full mt-2.5 flex-shrink-0"></div>
                          <p className="text-gray-700 text-sm leading-relaxed">
                            {text.startsWith('•') ? text.substring(2) : text}
                          </p>
                        </>
                      )}
                    </div>
                  ))}
                </div>

                {/* Special Actions for specific cards */}
                {item.id === 'support-dynamique' && (
                  <div className="mt-6 pt-4 border-t border-blue-200">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <Headphones className="h-5 w-5 text-blue-600" />
                        <span className="text-sm font-medium text-blue-700">+530 éléments interactifs</span>
                      </div>
                      <div className="bg-blue-600 text-white px-3 py-1 rounded-full text-xs font-medium">
                        Illimité
                      </div>
                    </div>
                  </div>
                )}

                {item.id === 'validation-pages' && (
                  <div className="mt-6 pt-4 border-t border-green-200">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <Clock className="h-5 w-5 text-green-600" />
                        <span className="text-sm font-medium text-green-700">Temps minimum : 6 secondes</span>
                      </div>
                      <div className="bg-green-600 text-white px-3 py-1 rounded-full text-xs font-medium">
                        Auto
                      </div>
                    </div>
                  </div>
                )}

                {item.id === 'devoirs-automatiques' && (
                  <div className="mt-6 pt-4 border-t border-orange-200">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <Zap className="h-5 w-5 text-orange-600" />
                        <span className="text-sm font-medium text-orange-700">Envoi automatique</span>
                      </div>
                      <div className="bg-orange-600 text-white px-3 py-1 rounded-full text-xs font-medium">
                        Email
                      </div>
                    </div>
                  </div>
                )}

                {item.id === 'contact-support' && (
                  <div className="mt-6 pt-4 border-t border-purple-200">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <Send className="h-5 w-5 text-purple-600" />
                        <span className="text-sm font-medium text-purple-700">Réponse rapide</span>
                      </div>
                      <div className="bg-purple-600 text-white px-3 py-1 rounded-full text-xs font-medium">
                        24h max
                      </div>
                    </div>
                  </div>
                )}

                {item.id === 'coaching' && (
                  <div className="mt-6 pt-4 border-t border-indigo-200">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <Phone className="h-5 w-5 text-indigo-600" />
                        <span className="text-sm font-medium text-indigo-700">Support disponible</span>
                      </div>
                      <div className="bg-indigo-600 text-white px-3 py-1 rounded-full text-xs font-medium">
                        Personnel
                      </div>
                    </div>
                  </div>
                )}

                {item.id === 'niveaux' && (
                  <div className="mt-6 pt-4 border-t border-pink-200">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <Star className="h-5 w-5 text-pink-600" />
                        <span className="text-sm font-medium text-pink-700">4 nouveaux modules</span>
                      </div>
                      <div className="bg-pink-600 text-white px-3 py-1 rounded-full text-xs font-medium">
                        Bientôt
                      </div>
                    </div>
                  </div>
                )}

                {item.id === 'Rendu-devoirs' && (
                  <div className="mt-6 pt-4 border-t border-teal-200">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <Award className="h-5 w-5 text-teal-600" />
                        <span className="text-sm font-medium text-teal-700">Correction personnalisée</span>
                      </div>
                      <div className="bg-teal-600 text-white px-3 py-1 rounded-full text-xs font-medium">
                        Suivi
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </main>
      </div>
    </div>
  );
}
