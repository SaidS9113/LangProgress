'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { FileText, BookOpen, Calendar, Loader2, ChevronDown, ChevronUp, Send, Type, CheckCircle, Eye, Award, X, Lock } from 'lucide-react';
import DashboardSidebar from '@/app/components/DashboardSidebar';
import DashboardHeader from '@/app/components/DashboardHeader';
import { chapters, chapterLessonToGlobalPage } from '@/lib/chapters';

interface User {
  id: string;
  email: string;
  username: string | null;
  isActive: boolean;
  accountType?: 'ACTIVE' | 'INACTIVE' | 'PAID_LEGACY';
  subscriptionPlan?: 'SOLO' | 'COACHING' | null;
  completedPages?: number[];
  completedQuizzes?: number[];
}

interface Submission {
  type: 'TEXT' | 'FILE';
  textContent: string | null;
  files: { name: string; url: string }[] | null;
  status: 'PENDING' | 'REVIEWED' | 'CORRECTED';
  feedback: string | null;
  correctedAt: string | null;
}

interface Homework {
  id: string;
  chapterId: number;
  title: string;
  content: string;
  createdAt: string;
  sentAt: string;
  submission: Submission | null;
}

const statusConfig = {
  PENDING: {
    label: 'Envoyé',
    color: 'bg-green-100 text-green-800 border-green-200',
    description: 'Votre devoir a été envoyé avec succès'
  },
  REVIEWED: {
    label: 'En correction',
    color: 'bg-blue-100 text-blue-800 border-blue-200',
    icon: Eye,
    description: 'Le professeur corrige votre devoir'
  },
  CORRECTED: {
    label: 'Corrigé',
    color: 'bg-purple-100 text-purple-800 border-purple-200',
    icon: Award,
    description: 'Votre devoir a été corrigé'
  },
};

const DEMO_HOMEWORKS: Homework[] = [
  {
    id: '1',
    chapterId: 1,
    title: 'Exercice de lecture - Chapitre A',
    content: 'Lisez le texte suivant et répondez aux questions.\n\n1. Identifiez les éléments principaux du texte.\n2. Résumez le contenu en 3 phrases.\n3. Donnez votre avis sur le sujet traité.',
    createdAt: '2026-01-10T10:00:00Z',
    sentAt: '2026-01-10T10:00:00Z',
    submission: null,
  },
  {
    id: '2',
    chapterId: 2,
    title: 'Exercice pratique - Chapitre B',
    content: 'Complétez les exercices suivants:\n\n1. Exercice de compréhension\n2. Questions de vocabulaire\n3. Rédaction courte (50 mots minimum)',
    createdAt: '2026-01-12T14:00:00Z',
    sentAt: '2026-01-12T14:00:00Z',
    submission: {
      type: 'TEXT',
      textContent: 'Voici ma réponse au devoir...',
      files: null,
      status: 'PENDING',
      feedback: null,
      correctedAt: null,
    },
  },
  {
    id: '3',
    chapterId: 3,
    title: 'Évaluation - Chapitre C',
    content: 'Réalisez l\'évaluation suivante:\n\n- Partie 1: QCM (10 questions)\n- Partie 2: Questions ouvertes\n- Partie 3: Exercice de synthèse',
    createdAt: '2026-01-14T09:00:00Z',
    sentAt: '2026-01-14T09:00:00Z',
    submission: {
      type: 'TEXT',
      textContent: 'Ma réponse complète à l\'évaluation...',
      files: null,
      status: 'CORRECTED',
      feedback: 'Excellent travail ! Vous avez bien compris les concepts. Continuez ainsi.',
      correctedAt: '2026-01-15T16:30:00Z',
    },
  },
  {
    id: '4',
    chapterId: 4,
    title: 'Travail personnel - Chapitre D',
    content: 'Préparez un travail personnel sur le thème du chapitre:\n\n1. Choisissez un sujet en lien avec la leçon\n2. Rédigez une analyse de 100 mots\n3. Proposez 3 exemples concrets',
    createdAt: '2026-01-16T11:00:00Z',
    sentAt: '2026-01-16T11:00:00Z',
    submission: {
      type: 'FILE',
      textContent: null,
      files: [{ name: 'mon_travail.pdf', url: '#' }],
      status: 'REVIEWED',
      feedback: null,
      correctedAt: null,
    },
  },
];

const mockHomeworkSends = [
  { id: '1', sentAt: '2026-01-10', homework: { id: 'hw1', chapterId: 1, title: 'Devoir Chapitre 1' } },
  { id: '2', sentAt: '2026-01-12', homework: { id: 'hw2', chapterId: 2, title: 'Devoir Chapitre 2' } },
];

const isChapterCompleted = (
  chapterId: number, 
  completedPages: number[], 
  completedQuizzes: number[]
): { completed: boolean; pagesCompleted: number; totalPages: number; quizCompleted: boolean; hasQuiz: boolean } => {
  const chapter = chapters.find(ch => ch.chapterNumber === chapterId);
  if (!chapter) return { completed: false, pagesCompleted: 0, totalPages: 0, quizCompleted: false, hasQuiz: false };

  // Lessons (toutes les leçons comptent)
  const countableLessons = chapter.lessons;
  const completedPagesSet = new Set(completedPages);
  
  // Convert lesson numbers to global page numbers for progress check
  const lessonsCompleted = countableLessons.filter(l => {
    const globalPageNum = chapterLessonToGlobalPage(chapterId, l.lessonNumber);
    return completedPagesSet.has(globalPageNum);
  }).length;
  const totalLessons = countableLessons.length;
  const allLessonsCompleted = lessonsCompleted === totalLessons;

  // Quiz
  const hasQuiz = chapter.quiz && chapter.quiz.length > 0;
  const quizCompleted = hasQuiz ? completedQuizzes.includes(chapterId) : true;

  return {
    completed: allLessonsCompleted && quizCompleted,
    pagesCompleted: lessonsCompleted,
    totalPages: totalLessons,
    quizCompleted,
    hasQuiz: !!hasQuiz,
  };
};

export default function DevoirsPage() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [homeworks, setHomeworks] = useState<Homework[]>(DEMO_HOMEWORKS);
  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState<string | null>(null);

  const [submitType, setSubmitType] = useState<{ [key: string]: 'TEXT' | 'FILE' }>({});
  const [textContent, setTextContent] = useState<{ [key: string]: string }>({});
  const [files, setFiles] = useState<{ [key: string]: File[] }>({});
  const [justSubmitted, setJustSubmitted] = useState<{ [key: string]: boolean }>({});

  const fetchUser = async () => {
    try {
      const res = await fetch('/api/auth/me', {
        cache: 'no-store',
        headers: {
          'Cache-Control': 'no-cache, no-store, must-revalidate',
          'Pragma': 'no-cache',
        }
      });
      if (!res.ok) {
        router.push('/login');
        return;
      }
      const data = await res.json();
      console.log('[Devoirs] User loaded:', {
        completedPages: data.user.completedPages,
        completedQuizzes: data.user.completedQuizzes,
      });
      setUser(data.user);
    } catch {
      router.push('/login');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUser();
    
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        console.log('[Devoirs] Page visible, refreshing user data...');
        fetchUser();
      }
    };
    
    document.addEventListener('visibilitychange', handleVisibilityChange);
    
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [router]);

  const handleSubmit = async (homeworkId: string) => {
    const type = submitType[homeworkId] || 'TEXT';
    const content = type === 'TEXT' ? textContent[homeworkId] : files[homeworkId];

    if (!content || (Array.isArray(content) && content.length === 0)) {
      alert('Veuillez remplir le contenu avant de soumettre');
      return;
    }

    setSubmitting(homeworkId);
    await new Promise(resolve => setTimeout(resolve, 1500));

    setHomeworks(prev => prev.map(hw => {
      if (hw.id === homeworkId) {
        return {
          ...hw,
          submission: {
            type,
            textContent: type === 'TEXT' ? (content as string) : null,
            files: type === 'FILE' ? (content as File[]).map(f => ({ name: f.name, url: '#' })) : null,
            status: 'PENDING' as const,
            feedback: null,
            correctedAt: null,
          }
        };
      }
      return hw;
    }));

    setJustSubmitted(prev => ({ ...prev, [homeworkId]: true }));
    setTextContent(prev => ({ ...prev, [homeworkId]: '' }));
    setFiles(prev => ({ ...prev, [homeworkId]: [] }));
    setSubmitting(null);

    setTimeout(() => {
      setJustSubmitted(prev => ({ ...prev, [homeworkId]: false }));
    }, 3000);
  };

  const removeFile = (homeworkId: string, fileIndex: number) => {
    setFiles(prev => ({
      ...prev,
      [homeworkId]: prev[homeworkId].filter((_, idx) => idx !== fileIndex)
    }));
  };

  const formatDate = (dateString: string | null) => {
    if (!dateString) return '';
    return new Date(dateString).toLocaleDateString('fr-FR', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Chargement des devoirs...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

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

        <main className="p-4 lg:p-8">
          <div className="mb-8">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3 mb-2">
                <div className="bg-blue-600 p-3 rounded-xl">
                  <FileText className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">Mes Devoirs</h1>
                  <p className="text-gray-500">Retrouvez ici tous vos devoirs à compléter</p>
                </div>
              </div>
              <button
                onClick={() => fetchUser()}
                className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg text-sm font-medium transition-colors"
              >
                🔄 Rafraîchir
              </button>
            </div>
          </div>

          {homeworks.length === 0 ? (
            <div className="bg-white rounded-2xl shadow-sm p-12 text-center border border-gray-200">
              <div className="text-6xl mb-4">📚</div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Aucun devoir disponible
              </h3>
              <p className="text-gray-500">
                Les devoirs seront disponibles prochainement.
              </p>
            </div>
          ) : (
            <div className="space-y-6">
              {homeworks.map((homework) => {
                const isExpanded = expanded === homework.id;
                const type = submitType[homework.id] || homework.submission?.type || 'TEXT';

                const hasSubmission =
                  homework.submission &&
                  (
                    (homework.submission.type === 'TEXT' && homework.submission.textContent) ||
                    (homework.submission.type === 'FILE' &&
                      (homework.submission.files && homework.submission.files.length > 0))
                  );

                const submissionStatus = homework.submission?.status;
                const StatusConfig = submissionStatus ? statusConfig[submissionStatus] : null;

                const chapterProgress = isChapterCompleted(
                  homework.chapterId,
                  user?.completedPages || [],
                  user?.completedQuizzes || []
                );
                const canSubmit = chapterProgress.completed;

                const showForm = !hasSubmission && !justSubmitted[homework.id] && canSubmit;
                const showLockedMessage = !hasSubmission && !justSubmitted[homework.id] && !canSubmit;
                const showCooldownMessage = justSubmitted[homework.id] && !hasSubmission;

                return (
                  <div
                    key={homework.id}
                    className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-200 hover:border-gray-300 transition-all duration-300"
                  >
                    <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-4 sm:p-6">
                      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-3 sm:space-y-0">
                        <div className="flex items-center space-x-3">
                          <div className="bg-white/20 backdrop-blur-sm p-3 rounded-xl">
                            <BookOpen className="h-6 w-6 text-white" />
                          </div>
                          <div>
                            <h3 className="text-lg sm:text-xl font-bold text-white">
                              Chapitre {homework.chapterId}
                            </h3>
                            <p className="text-white/80 text-sm">
                              {homework.title}
                            </p>
                          </div>
                        </div>

                        {hasSubmission && StatusConfig && (
                          <div className="text-left sm:text-right">
                            <div className={`inline-flex items-center space-x-2 px-4 py-2 rounded-full border ${StatusConfig.color}`}>
                              <span className="text-sm font-semibold">{StatusConfig.label}</span>
                            </div>
                            {homework.submission?.correctedAt ? (
                              <p className="text-white/70 text-xs mt-1">
                                Corrigé le {formatDate(homework.submission.correctedAt)}
                              </p>
                            ) : (
                              <p className="text-white/70 text-xs mt-1">
                                Envoyé le {formatDate(homework.sentAt)}
                              </p>
                            )}
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="p-4 sm:p-6">
                      <div className="bg-gray-50 rounded-xl p-4 mb-4 border border-gray-100">
                        <div className="flex items-start justify-between gap-2">
                          <div className="flex-1 min-w-0">
                            <h4 className="font-semibold text-gray-900 mb-2">📝 Instructions</h4>
                            <div className={`text-gray-600 text-sm leading-relaxed ${isExpanded ? '' : 'line-clamp-3'}`}>
                              {homework.content.split('\n').map((line, idx) => (
                                <p key={idx} className="mb-2">{line || '\u00A0'}</p>
                              ))}
                            </div>
                          </div>
                          <button
                            onClick={() => setExpanded(isExpanded ? null : homework.id)}
                            className="ml-2 flex-shrink-0 text-blue-600 text-sm font-medium flex items-center hover:text-blue-700 transition-colors"
                          >
                            <span className="hidden sm:inline">{isExpanded ? 'Réduire' : 'Développer'}</span>
                            {isExpanded ? (
                              <ChevronUp className="h-4 w-4 ml-1" />
                            ) : (
                              <ChevronDown className="h-4 w-4 ml-1" />
                            )}
                          </button>
                        </div>
                      </div>

                      {showCooldownMessage && (
                        <div className="bg-green-50 border border-green-200 rounded-xl p-4 mb-4">
                          <div className="flex items-start space-x-3">
                            <CheckCircle className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                            <div className="flex-1 min-w-0">
                              <h4 className="font-semibold text-green-800">
                                Votre devoir a été bien envoyé !
                              </h4>
                            </div>
                          </div>
                        </div>
                      )}

                      {showLockedMessage && (
                        <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 mb-4">
                          <div className="flex items-start space-x-3">
                            <Lock className="h-5 w-5 text-amber-600 mt-0.5 flex-shrink-0" />
                            <div className="flex-1 min-w-0">
                              <h4 className="font-semibold text-amber-800">
                                Chapitre non complété
                              </h4>
                              <p className="text-amber-700 text-sm mt-1">
                                Vous devez terminer toutes les leçons et le quiz du chapitre {homework.chapterId} avant de pouvoir envoyer ce devoir.
                              </p>
                              <div className="mt-3 space-y-1 text-sm">
                                <div className="flex items-center gap-2">
                                  {chapterProgress.pagesCompleted === chapterProgress.totalPages ? (
                                    <CheckCircle className="h-4 w-4 text-green-600" />
                                  ) : (
                                    <div className="h-4 w-4 rounded-full border-2 border-amber-400" />
                                  )}
                                  <span className={chapterProgress.pagesCompleted === chapterProgress.totalPages ? 'text-green-700' : 'text-amber-700'}>
                                    Leçons : {chapterProgress.pagesCompleted}/{chapterProgress.totalPages}
                                  </span>
                                </div>
                                {chapterProgress.hasQuiz && (
                                  <div className="flex items-center gap-2">
                                    {chapterProgress.quizCompleted ? (
                                      <CheckCircle className="h-4 w-4 text-green-600" />
                                    ) : (
                                      <div className="h-4 w-4 rounded-full border-2 border-amber-400" />
                                    )}
                                    <span className={chapterProgress.quizCompleted ? 'text-green-700' : 'text-amber-700'}>
                                      Quiz : {chapterProgress.quizCompleted ? 'Complété' : 'Non complété'}
                                    </span>
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>
                        </div>
                      )}

                      {showForm && (
                        <div className="space-y-4">
                          <div className="bg-gray-50 rounded-xl p-4 border border-gray-100">
                            <h4 className="font-semibold text-gray-900 mb-3">📤 Soumettre votre devoir</h4>

                            <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2 mb-4">
                              <button
                                onClick={() => setSubmitType(prev => ({ ...prev, [homework.id]: 'TEXT' }))}
                                className={`flex-1 flex items-center justify-center space-x-2 py-3 px-4 rounded-lg border-2 transition-all text-sm ${type === 'TEXT'
                                  ? 'border-blue-500 bg-blue-50 text-blue-700'
                                  : 'border-gray-200 text-gray-600 hover:border-gray-300 hover:bg-gray-100'
                                  }`}
                              >
                                <Type className="h-5 w-5 flex-shrink-0" />
                                <span>Rédaction texte</span>
                              </button>

                              <button
                                onClick={() => setSubmitType(prev => ({ ...prev, [homework.id]: 'FILE' }))}
                                className={`flex-1 flex items-center justify-center space-x-2 py-3 px-4 rounded-lg border-2 transition-all text-sm ${type === 'FILE'
                                  ? 'border-blue-500 bg-blue-50 text-blue-700'
                                  : 'border-gray-200 text-gray-600 hover:border-gray-300 hover:bg-gray-100'
                                  }`}
                              >
                                <BookOpen className="h-5 w-5 flex-shrink-0" />
                                <span>Fichier / Audio / Image</span>
                              </button>
                            </div>

                            {type === 'TEXT' ? (
                              <textarea
                                value={textContent[homework.id] || ''}
                                onChange={(e) =>
                                  setTextContent((prev) => ({ ...prev, [homework.id]: e.target.value }))
                                }
                                placeholder="Rédigez votre devoir ici..."
                                className="w-full h-40 p-4 bg-white border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none transition-all text-gray-900 placeholder-gray-400"
                              />
                            ) : (
                              <div>
                                <input
                                  type="file"
                                  multiple
                                  onChange={(e) => {
                                    if (!e.target.files) return;
                                    const newFiles = Array.from(e.target.files);
                                    setFiles((prev) => ({
                                      ...prev,
                                      [homework.id]: [...(prev[homework.id] || []), ...newFiles],
                                    }));
                                    e.target.value = '';
                                  }}
                                  accept=".pdf,.doc,.docx,.txt,.mp3,.mp4,image/*"
                                  className="w-full p-4 bg-white border border-gray-200 text-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-sm"
                                />

                                {files[homework.id] && files[homework.id].length > 0 && (
                                  <div className="mt-3 border border-gray-200 rounded-lg p-4 bg-white">
                                    <p className="text-gray-700 font-semibold mb-2 text-sm">Fichiers sélectionnés :</p>
                                    <ul className="space-y-2">
                                      {files[homework.id].map((file, index) => (
                                        <li key={index} className="flex items-center justify-between bg-gray-50 p-2 rounded-lg gap-2">
                                          <span className="text-sm text-gray-700 truncate flex-1 min-w-0">{file.name}</span>
                                          <button
                                            onClick={() => removeFile(homework.id, index)}
                                            className="flex-shrink-0 p-1 text-red-500 hover:bg-red-50 rounded-full transition-colors"
                                            title="Retirer ce fichier"
                                          >
                                            <X className="h-4 w-4" />
                                          </button>
                                        </li>
                                      ))}
                                    </ul>
                                  </div>
                                )}
                              </div>
                            )}

                            <button
                              onClick={() => handleSubmit(homework.id)}
                              disabled={submitting === homework.id}
                              className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 px-6 rounded-lg font-semibold transition-all flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed mt-4"
                            >
                              {submitting === homework.id ? (
                                <>
                                  <Loader2 className="h-5 w-5 animate-spin" />
                                  <span>Soumission en cours...</span>
                                </>
                              ) : (
                                <>
                                  <Send className="h-5 w-5" />
                                  <span>Soumettre le devoir</span>
                                </>
                              )}
                            </button>
                          </div>
                        </div>
                      )}

                      {hasSubmission && (
                        <div className="bg-gray-50 border border-gray-200 rounded-xl p-4 mb-4">
                          <h4 className="font-semibold text-gray-900 mb-2">📋 Votre soumission</h4>
                          {homework.submission?.type === 'TEXT' && (
                            <p className="text-gray-700 text-sm whitespace-pre-wrap">{homework.submission.textContent}</p>
                          )}
                          {homework.submission?.type === 'FILE' && homework.submission.files && (
                            <div className="space-y-2">
                              {homework.submission.files.map((file, idx) => (
                                <div key={idx} className="flex items-center gap-2 text-gray-700 text-sm">
                                  <FileText className="w-4 h-4" />
                                  <span>{file.name}</span>
                                </div>
                              ))}
                            </div>
                          )}
                          
                          {homework.submission?.feedback && (
                            <div className="mt-4 pt-4 border-t border-gray-200">
                              <h5 className="font-semibold text-green-700 mb-2 text-sm">💬 Retour du professeur</h5>
                              <p className="text-gray-700 text-sm">{homework.submission.feedback}</p>
                            </div>
                          )}
                        </div>
                      )}

                      <div className="flex items-center text-sm text-gray-500 mt-4 pt-4 border-t border-gray-100">
                        <Calendar className="h-4 w-4 mr-2 flex-shrink-0" />
                        <span>Devoir reçu le {new Date(homework.sentAt).toLocaleDateString('fr-FR', {
                          day: 'numeric',
                          month: 'long',
                          year: 'numeric'
                        })}</span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
