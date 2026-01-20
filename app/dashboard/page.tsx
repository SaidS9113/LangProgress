'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { BookOpen, Award, Clock, ChevronRight, GraduationCap, Users } from 'lucide-react';
import DashboardSidebar from '@/app/components/DashboardSidebar';
import DashboardHeader from '@/app/components/DashboardHeader';
import { chapters, chapterLessonToGlobalPage } from '@/lib/chapters';

interface User {
  id: string;
  email: string;
  username: string | null;
  isActive: boolean;
  accountType: 'ACTIVE' | 'INACTIVE' | 'PAID_LEGACY';
  subscriptionPlan: 'SOLO' | 'COACHING' | null;
  completedPages: number[];
  completedQuizzes: number[];
  completedPagesB: number[];
  completedQuizzesB: number[];
  studyTimeSeconds: number;
}

const dashboardChapters = chapters.map(ch => ({
  chapterNumber: ch.chapterNumber,
  title: ch.title,
  allLessons: ch.lessons.map(l => ({
    lessonNumber: l.lessonNumber,
    title: l.title,
  })),
  countableLessons: ch.lessons.map(l => l.lessonNumber),
  hasQuiz: ch.quiz && ch.quiz.length > 0,
}));

const isChapterCompleted = (
  chapterId: number, 
  completedPages: number[], 
  completedQuizzes: number[]
): boolean => {
  const chapter = chapters.find(ch => ch.chapterNumber === chapterId);
  if (!chapter) return false;

  const completedPagesSet = new Set(completedPages);
  // Convert lesson numbers to global page numbers for progress check
  const allLessonsCompleted = chapter.lessons.every(l => {
    const globalPageNum = chapterLessonToGlobalPage(chapterId, l.lessonNumber);
    return completedPagesSet.has(globalPageNum);
  });

  const hasQuiz = chapter.quiz && chapter.quiz.length > 0;
  const quizCompleted = hasQuiz ? completedQuizzes.includes(chapterId) : true;

  return allLessonsCompleted && quizCompleted;
};

const getHomeworkStatuses = (completedPages: number[], completedQuizzes: number[]) => {
  return dashboardChapters.map((ch) => {
    const completed = isChapterCompleted(ch.chapterNumber, completedPages, completedQuizzes);
    return {
      chapterId: ch.chapterNumber,
      title: `Devoir ${ch.title}`,
      status: completed ? 'completed' : 'locked',
      isLocked: !completed,
    };
  });
};

const getDayLabel = (date: Date): string => {
  const days = ['Dim', 'Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam'];
  return days[date.getDay()];
};

const getDateKey = (date: Date): string => {
  return date.toISOString().split('T')[0];
};

const saveProgressionToday = (percentage: number, completedItems: number, totalItems: number) => {
  const today = getDateKey(new Date());
  const progressionHistory = JSON.parse(localStorage.getItem('sandbox_progression_history') || '{}');
  
  progressionHistory[today] = {
    percentage,
    completed: completedItems,
    total: totalItems,
    updatedAt: new Date().toISOString(),
  };
  
  localStorage.setItem('sandbox_progression_history', JSON.stringify(progressionHistory));
};

const getWeekProgressionData = () => {
  const progressionHistory = JSON.parse(localStorage.getItem('sandbox_progression_history') || '{}');
  const weekData = [];
  
  // Get current date and find the Monday of this week
  const today = new Date();
  const currentDay = today.getDay(); // 0 = Sunday, 1 = Monday, etc.
  const daysFromMonday = currentDay === 0 ? 6 : currentDay - 1; // If Sunday, go back 6 days
  
  const monday = new Date(today);
  monday.setDate(today.getDate() - daysFromMonday);
  
  // Generate data for Monday to Sunday
  const dayLabels = ['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim'];
  
  for (let i = 0; i < 7; i++) {
    const date = new Date(monday);
    date.setDate(monday.getDate() + i);
    const dateKey = getDateKey(date);
    const dayData = progressionHistory[dateKey];
    
    weekData.push({
      day: dayLabels[i],
      dateKey,
      percentage: dayData?.percentage || 0,
      completed: dayData?.completed || 0,
      total: dayData?.total || 0,
    });
  }
  
  return weekData;
};

export default function DashboardPage() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [selectedPeriod, setSelectedPeriod] = useState<'week' | 'month'>('week');
  const [studyTimeSeconds, setStudyTimeSeconds] = useState(0);
  const [weekData, setWeekData] = useState<Array<{day: string; dateKey: string; percentage: number; completed: number; total: number}>>([]); 
  const [selectedModule, setSelectedModule] = useState<'A' | 'B'>('A');
  const [showModuleBModal, setShowModuleBModal] = useState(false);
  const [showSidebarCoachingModal, setShowSidebarCoachingModal] = useState(false);
  const [showSidebarCoursModal, setShowSidebarCoursModal] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const savedModule = localStorage.getItem('selectedDashboardModule');
    if (savedModule === 'B' || savedModule === 'A') {
      setSelectedModule(savedModule);
    }
    
    const handleStorageChange = () => {
      const updatedModule = localStorage.getItem('selectedDashboardModule');
      if (updatedModule === 'B' || updatedModule === 'A') {
        setSelectedModule(updatedModule);
      }
    };
    
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  useEffect(() => {
    const stopTimerAndCalculate = () => {
      const startTimeStr = localStorage.getItem('sandbox_study_time_start');
      if (startTimeStr) {
        const startTime = parseInt(startTimeStr, 10);
        const elapsedSeconds = Math.floor((Date.now() - startTime) / 1000);
        
        const validElapsed = Math.min(elapsedSeconds, 43200);
        
        if (validElapsed > 0) {
          const currentTotal = parseInt(localStorage.getItem('sandbox_study_time_total') || '0', 10);
          const newTotal = currentTotal + validElapsed;
          localStorage.setItem('sandbox_study_time_total', newTotal.toString());
          console.log('[Dashboard] Timer arrete. +' + validElapsed + 's. Total: ' + newTotal + 's');
        }
        
        localStorage.removeItem('sandbox_study_time_start');
      }
      
      const totalTime = parseInt(localStorage.getItem('sandbox_study_time_total') || '0', 10);
      setStudyTimeSeconds(totalTime);
    };

    const fetchUser = async () => {
      try {
        stopTimerAndCalculate();
        
        const res = await fetch('/api/auth/me');
        if (!res.ok) {
          router.push('/login');
          return;
        }
        const data = await res.json();
        setUser(data.user);
      } catch (error) {
        router.push('/login');
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [router]);

  useEffect(() => {
    if (user) {
      const totalPages = dashboardChapters.reduce((total, ch) => total + ch.countableLessons.length, 0);
      const totalQuizzes = dashboardChapters.filter(ch => ch.hasQuiz).length;
      const completedPagesCount = user.completedPages.length;
      const completedQuizzesCount = user.completedQuizzes.length;
      const totalItems = totalPages + totalQuizzes;
      const completedItems = completedPagesCount + completedQuizzesCount;
      const percentage = totalItems > 0 ? Math.round((completedItems / totalItems) * 100) : 0;
      
      saveProgressionToday(percentage, completedItems, totalItems);
      
      setWeekData(getWeekProgressionData());
    }
  }, [user]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Chargement de votre dashboard...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  const isModuleB = selectedModule === 'B';
  
  const currentCompletedPages = isModuleB ? user.completedPagesB : user.completedPages;
  const currentCompletedQuizzes = isModuleB ? user.completedQuizzesB : user.completedQuizzes;

  const totalPages = dashboardChapters.reduce((total, ch) => total + ch.countableLessons.length, 0);
  const totalQuizzes = dashboardChapters.filter(ch => ch.hasQuiz).length;
  const completedPagesCount = isModuleB ? 0 : currentCompletedPages.length;
  const completedQuizzesCount = isModuleB ? 0 : currentCompletedQuizzes.length;
  const totalItems = totalPages + totalQuizzes;
  const completedItems = completedPagesCount + completedQuizzesCount;
  const progressPercentage = totalItems > 0 ? Math.round((completedItems / totalItems) * 100) : 0;
  const studyHours = Math.floor(studyTimeSeconds / 3600);
  const studyMinutes = Math.floor((studyTimeSeconds % 3600) / 60);
  const studySeconds = studyTimeSeconds % 60;

  const homeworkStatuses = isModuleB 
    ? dashboardChapters.map(ch => ({ chapterId: ch.chapterNumber, title: `Devoir ${ch.title}`, status: 'locked', isLocked: true }))
    : getHomeworkStatuses(user.completedPages, user.completedQuizzes);

  const homeworkSends = homeworkStatuses
    .filter(h => h.status === 'completed')
    .map((h, index) => ({
      id: String(h.chapterId),
      sentAt: new Date().toISOString().split('T')[0],
      homework: {
        id: `hw${h.chapterId}`,
        chapterId: h.chapterId,
        title: h.title,
      },
    }));

  const getNextPage = () => {
    if (isModuleB) return null;
    
    const completedSet = new Set(user.completedPages);
    for (const chapter of dashboardChapters) {
      for (const lessonNum of chapter.countableLessons) {
        // Convert chapter/lesson to global page number for progress check
        const globalPageNum = chapterLessonToGlobalPage(chapter.chapterNumber, lessonNum);
        if (!completedSet.has(globalPageNum)) {
          const originalLesson = chapter.allLessons.find(l => l.lessonNumber === lessonNum);
          if (originalLesson) {
            return {
              chapterNumber: chapter.chapterNumber,
              pageNumber: lessonNum,
              chapterTitle: chapter.title,
              pageTitle: originalLesson.title,
            };
          }
        }
      }
    }
    return null;
  };

  const nextPage = getNextPage();

  return (
    <div className="min-h-screen bg-gray-50">
      <DashboardSidebar
        mobileMenuOpen={mobileMenuOpen}
        setMobileMenuOpen={setMobileMenuOpen}
        onShowRestrictionModal={() => setShowSidebarCoachingModal(true)}
        onShowModuleBCoursModal={() => setShowSidebarCoursModal(true)}
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
          homeworkSends={homeworkSends}
        />

        <main className="p-4 lg:p-8">
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-gray-900 mb-2">
              Salut, {user.username || 'Étudiant'} !
            </h1>
            <p className="text-gray-500">Prêt à progresser ? Voici votre tableau de bord !</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6 mb-8">
            <div className="bg-white rounded-xl p-6 border border-gray-200">
              <div className="flex items-center space-x-4">
                <div className="relative w-12 h-12">
                  <svg className="w-12 h-12 transform -rotate-90" viewBox="0 0 36 36">
                    <path
                      d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                      fill="none"
                      stroke="#e5e7eb"
                      strokeWidth="2"
                    />
                    <path
                      d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                      fill="none"
                      stroke={progressPercentage === 100 ? "#10b981" : "#1e40af"}
                      strokeWidth="2"
                      strokeDasharray={`${progressPercentage}, 100`}
                      strokeLinecap="round"
                    />
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <GraduationCap className="h-5 w-5 text-gray-600" />
                  </div>
                </div>
                <div>
                  <p className="text-gray-500 text-sm">Progression</p>
                  <p className="text-2xl font-bold text-gray-900">{progressPercentage}%</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl p-6 border border-gray-200">
              <div className="flex items-center space-x-4">
                <div className="relative w-12 h-12">
                  <svg className="w-12 h-12 transform -rotate-90" viewBox="0 0 36 36">
                    <path
                      d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                      fill="none"
                      stroke="#e5e7eb"
                      strokeWidth="2"
                    />
                    <path
                      d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                      fill="none"
                      stroke="#1e40af"
                      strokeWidth="2"
                      strokeDasharray={`${(completedPagesCount / totalPages) * 100}, 100`}
                      strokeLinecap="round"
                    />
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <BookOpen className="h-5 w-5 text-gray-600" />
                  </div>
                </div>
                <div>
                  <p className="text-gray-500 text-sm">Leçons</p>
                  <p className="text-2xl font-bold text-gray-900">{completedPagesCount}/{totalPages}</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl p-6 border border-gray-200">
              <div className="flex items-center space-x-4">
                <div className="relative w-12 h-12">
                  <svg className="w-12 h-12 transform -rotate-90" viewBox="0 0 36 36">
                    <path
                      d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                      fill="none"
                      stroke="#e5e7eb"
                      strokeWidth="2"
                    />
                    <path
                      d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                      fill="none"
                      stroke="#1e40af"
                      strokeWidth="2"
                      strokeDasharray={`${(completedQuizzesCount / totalQuizzes) * 100}, 100`}
                      strokeLinecap="round"
                    />
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <Users className="h-5 w-5 text-gray-600" />
                  </div>
                </div>
                <div>
                  <p className="text-gray-500 text-sm">Quiz</p>
                  <p className="text-2xl font-bold text-gray-900">{completedQuizzesCount}/{totalQuizzes}</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl p-6 border border-gray-200">
              <div className="flex items-center space-x-4">
                <div className="relative w-12 h-12">
                  <svg className="w-12 h-12 transform -rotate-90" viewBox="0 0 36 36">
                    <path
                      d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                      fill="none"
                      stroke="#e5e7eb"
                      strokeWidth="2"
                    />
                    <path
                      d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                      fill="none"
                      stroke="#1e40af"
                      strokeWidth="2"
                      strokeDasharray="75, 100"
                      strokeLinecap="round"
                    />
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <Clock className="h-5 w-5 text-gray-600" />
                  </div>
                </div>
                <div>
                  <p className="text-gray-500 text-sm">Temps d&apos;étude</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {studyHours > 0 ? `${studyHours}h${studyMinutes}m` : studyMinutes > 0 ? `${studyMinutes}m${studySeconds}s` : `${studySeconds}s`}
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
            <div className="lg:col-span-2 space-y-6">
              <div className="bg-white rounded-xl p-6 border border-gray-200">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">Progression</h3>
                    <p className="text-xs text-green-600 mt-1">Suivi en temps réel</p>
                  </div>
                  <select
                    value={selectedPeriod}
                    onChange={(e) => setSelectedPeriod(e.target.value as 'week' | 'month')}
                    className="text-sm text-gray-500 border border-gray-200 rounded-lg px-3 py-1 bg-white"
                  >
                    <option value="week">Cette semaine</option>
                    <option value="month">Ce mois</option>
                  </select>
                </div>

                <div className="relative h-64">
                  <div className="absolute left-0 top-0 h-full flex flex-col justify-between text-xs text-gray-400 pr-4">
                    <span>100</span>
                    <span>75</span>
                    <span>50</span>
                    <span>25</span>
                    <span>0</span>
                  </div>
                  <div className="ml-8 h-full flex items-end justify-between space-x-2">
                    {weekData.map((day, index) => (
                      <div key={index} className="flex flex-col items-center space-y-2">
                        <div className="relative w-8 bg-gray-100 rounded-t-lg overflow-hidden" style={{ height: '216px' }}>
                          <div
                            className="absolute bottom-0 w-full bg-blue-800 rounded-t-lg transition-all duration-1000"
                            style={{ height: `${day.percentage}%` }}
                            title={`${day.completed}/${day.total} (${day.percentage}%)`}
                          />
                        </div>
                        <span className="text-xs text-gray-500 font-medium">{day.day}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="mt-4 flex items-center space-x-2 text-sm text-gray-500">
                  <div className="w-3 h-3 bg-blue-800 rounded" />
                  <span>Progression hebdomadaire</span>
                </div>
              </div>

              <div className="bg-white rounded-xl p-6 border border-blue-200">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-semibold text-gray-900">Reprendre le cours</h3>
                  <span className="text-blue-800 text-sm font-medium">{progressPercentage}% complété</span>
                </div>

                {nextPage ? (
                  <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-6 border border-blue-200">
                    <div className="flex flex-col md:flex-row items-start md:items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <div className="w-12 h-12 bg-blue-800 rounded-xl flex items-center justify-center">
                          <span className="text-white font-bold">{nextPage.chapterNumber}</span>
                        </div>
                        <div>
                          <h4 className="font-semibold text-gray-900 mb-1">
                            Chapitre {nextPage.chapterNumber} - {nextPage.chapterTitle}
                          </h4>
                          <p className="text-sm text-gray-600 flex items-center gap-1">
                            <BookOpen className="h-4 w-4" />
                            {nextPage.pageTitle}
                          </p>
                        </div>
                      </div>
                      <Link
                        href={`/chapters/${nextPage.chapterNumber}/${nextPage.pageNumber}`}
                        onClick={() => {
                          console.log('🚀 DASHBOARD: Clic sur Reprendre - Setting autoOpenCourseSidebar');
                          localStorage.setItem('autoOpenCourseSidebar', 'true');
                          console.log('🚀 DASHBOARD: localStorage set =', localStorage.getItem('autoOpenCourseSidebar'));
                          localStorage.setItem('sandbox_study_time_start', Date.now().toString());
                        }}
                        className="mt-4 md:mt-0 inline-flex items-center space-x-2 bg-blue-800 hover:bg-blue-900 text-white font-semibold px-6 py-3 rounded-lg transition-colors group"
                      >
                        <span>Reprendre</span>
                        <ChevronRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
                      </Link>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Award className="h-8 w-8 text-green-600" />
                    </div>
                    <h4 className="text-xl font-bold text-gray-900 mb-2">Félicitations !</h4>
                    <p className="text-gray-600">Vous avez terminé tous les cours !</p>
                  </div>
                )}
              </div>
            </div>

            <div className="space-y-6">
              <div className="bg-white rounded-xl p-6 border border-gray-200">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-semibold text-gray-900">
                    Devoirs <span className="text-gray-400">({homeworkStatuses.filter(h => h.status === 'completed').length}/{dashboardChapters.length})</span>
                  </h3>
                  <Link href="/homework" className="text-blue-800 text-sm font-medium hover:underline">
                    Voir plus
                  </Link>
                </div>

                <div className="max-h-96 overflow-y-auto pr-2">
                  <div className="space-y-4">
                    {homeworkStatuses.map((homework) => (
                      <div key={homework.chapterId} className="flex items-center justify-between py-2 px-2 rounded-lg hover:bg-gray-50 transition-colors">
                        <div className="flex items-center space-x-3 min-w-0 flex-1">
                          <div className={`w-2 h-2 rounded-full flex-shrink-0 ${
                            homework.status === 'completed' ? 'bg-green-500' : 'bg-gray-300'
                          }`} />
                          <div className="min-w-0 flex-1">
                            <p className={`font-medium text-sm truncate ${
                              homework.status === 'completed' ? 'text-gray-900' : 'text-gray-400'
                            }`}>{homework.title}</p>
                            <p className="text-xs mt-1">
                              {homework.status === 'completed' ? (
                                <span className="text-green-600">Chapitre terminé — Prêt à envoyer</span>
                              ) : (
                                <span className="text-gray-400">Terminez le chapitre</span>
                              )}
                            </p>
                          </div>
                        </div>
                        <div className={`w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 ml-2 ${
                          homework.status === 'completed' ? 'bg-green-500' : 'border-2 border-gray-300'
                        }`}>
                          {homework.status === 'completed' && (
                            <div className="w-2 h-2 bg-white rounded-full" />
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-8 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
            <p className="text-yellow-800 text-sm">
              <strong>Mode Sandbox</strong> - Ceci est une démonstration
              {isModuleB && <span className="ml-2"><strong>Module B</strong> selectionne</span>}
            </p>
          </div>
        </main>
      </div>

      {showModuleBModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-8 w-full max-w-md mx-4 border border-gray-200">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-gray-900">Cours non disponible</h3>
              <button
                onClick={() => setShowModuleBModal(false)}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="text-center py-4">
              <div className="bg-purple-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
                <BookOpen className="h-8 w-8 text-purple-600" />
              </div>
              <h4 className="text-lg font-bold text-gray-900 mb-2">
                Le cours du Module B n'est pas encore disponible
              </h4>
              <p className="text-gray-600 mb-6">
                Le contenu du Module B est en cours de preparation. Veuillez acceder au <strong>Module A</strong> pour voir les cours.
              </p>
              <div className="flex flex-col space-y-3">
                <Link
                  href="/levels"
                  onClick={() => setShowModuleBModal(false)}
                  className="w-full bg-blue-800 hover:bg-blue-900 text-white font-semibold px-6 py-3 rounded-lg transition-all duration-200 text-center"
                >
                  Aller aux Niveaux
                </Link>
                <button
                  type="button"
                  onClick={() => setShowModuleBModal(false)}
                  className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium px-6 py-3 rounded-lg transition-all duration-200"
                >
                  Fermer
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {showSidebarCoachingModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-8 w-full max-w-md mx-4 border border-gray-200">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-gray-900">Acces restreint</h3>
              <button
                onClick={() => setShowSidebarCoachingModal(false)}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="text-center py-4">
              <div className="bg-yellow-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg className="h-8 w-8 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>
              <h4 className="text-lg font-bold text-gray-900 mb-2">
                Fonctionnalite reservee au plan Coaching
              </h4>
              <p className="text-gray-600 mb-6">
                Cette fonctionnalite est reservee aux abonnes du plan <strong>Coaching</strong>.
              </p>
              <p className="text-sm text-gray-500 mb-6">
                Avec le plan Coaching, beneficiez d'un accompagnement personnalise avec un professeur dedie.
              </p>
              <div className="flex flex-col space-y-3">
                <Link
                  href="/subscription"
                  onClick={() => setShowSidebarCoachingModal(false)}
                  className="w-full bg-blue-800 hover:bg-blue-900 text-white font-semibold px-6 py-3 rounded-lg transition-all duration-200 text-center"
                >
                  Decouvrir le plan Coaching
                </Link>
                <button
                  type="button"
                  onClick={() => setShowSidebarCoachingModal(false)}
                  className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium px-6 py-3 rounded-lg transition-all duration-200"
                >
                  Fermer
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {showSidebarCoursModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-8 w-full max-w-md mx-4 border border-gray-200">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-gray-900">Cours non disponible</h3>
              <button
                onClick={() => setShowSidebarCoursModal(false)}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="text-center py-4">
              <div className="bg-purple-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
                <BookOpen className="h-8 w-8 text-purple-600" />
              </div>
              <h4 className="text-lg font-bold text-gray-900 mb-2">
                Le cours du Module B n'est pas encore disponible
              </h4>
              <p className="text-gray-600 mb-6">
                Le contenu du Module B est en cours de preparation. Veuillez retourner dans le <strong>Dashboard</strong> puis <strong>Niveaux</strong> pour acceder au <strong>Module A</strong> et voir les cours.
              </p>
              <div className="flex flex-col space-y-3">
                <Link
                  href="/levels"
                  onClick={() => setShowSidebarCoursModal(false)}
                  className="w-full bg-blue-800 hover:bg-blue-900 text-white font-semibold px-6 py-3 rounded-lg transition-all duration-200 text-center"
                >
                  Aller aux Niveaux
                </Link>
                <button
                  type="button"
                  onClick={() => setShowSidebarCoursModal(false)}
                  className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium px-6 py-3 rounded-lg transition-all duration-200"
                >
                  Fermer
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
