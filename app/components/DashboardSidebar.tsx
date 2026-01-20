'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import { BookOpen, Search, Home, FileText, ClipboardList, Info, X, Lightbulb, BarChart, Lock, CreditCard } from 'lucide-react';

interface DashboardSidebarProps {
    mobileMenuOpen: boolean;
    setMobileMenuOpen: (open: boolean) => void;
    onShowRestrictionModal?: () => void;
    onShowModuleBCoursModal?: () => void;
}

export default function DashboardSidebar({
    mobileMenuOpen,
    setMobileMenuOpen,
    onShowRestrictionModal,
    onShowModuleBCoursModal,
}: DashboardSidebarProps) {
    const pathname = usePathname();
    const router = useRouter();
    const [isDesktop, setIsDesktop] = useState(false);
    const [mounted, setMounted] = useState(false);
    
    const [selectedModule, setSelectedModule] = useState<'A' | 'B'>('A');
    const [userPlan, setUserPlan] = useState<'SOLO' | 'COACHING' | null>(null);
    
    useEffect(() => {
        const savedModule = localStorage.getItem('selectedDashboardModule');
        if (savedModule === 'B' || savedModule === 'A') {
            setSelectedModule(savedModule);
        }
        
        const fetchUserPlan = async () => {
            try {
                const res = await fetch('/api/auth/me');
                if (res.ok) {
                    const data = await res.json();
                    setUserPlan(data.user?.subscriptionPlan || null);
                }
            } catch (error) {
            }
        };
        fetchUserPlan();
        
        setMounted(true);
    }, []);
    
    const [query, setQuery] = useState('');
    const [showResults, setShowResults] = useState(false);
    
    const coursUrl = selectedModule === 'B' ? '/chapters-B/1/1' : '/chapters/1/1';
    
    const devoirsUrl = selectedModule === 'B' ? '/homework-B' : '/homework';
    
    const searchItems = [
        { label: 'Tableau de bord', href: '/dashboard', keywords: ['dashboard', 'tableau'] },
        { label: 'Cours', href: coursUrl, keywords: ['cours', 'chapitre', 'leçon', 'lecon'] },
        { label: 'Coaching', href: '/coaching', keywords: ['coaching', 'support'] },
        { label: 'Devoirs', href: devoirsUrl, keywords: ['devoir', 'devoirs', 'homework'] },
        { label: 'Notice', href: '/guide', keywords: ['notice', 'aide', 'help'] },
        { label: 'Conseil', href: '/tips', keywords: ['conseil', 'astuce', 'tips'] },
        { label: 'Niveaux', href: '/levels', keywords: ['niveaux', 'niveau', 'progression'] },
    ];
    
    const norm = (s: string) => s.toLowerCase();
    const results = query.trim()
        ? searchItems.filter(i =>
            norm(i.label).includes(norm(query)) ||
            i.keywords.some(k => norm(k).includes(norm(query)) || norm(query).includes(norm(k)))
          )
        : [];

    useEffect(() => {
        const checkDesktop = () => {
            setIsDesktop(window.innerWidth >= 1024);
        };
        checkDesktop();
        window.addEventListener('resize', checkDesktop);
        return () => window.removeEventListener('resize', checkDesktop);
    }, []);

    const handleCoursClick = (e: React.MouseEvent) => {
        e.preventDefault();
        
        localStorage.setItem('courseStarted', 'true');
        localStorage.setItem('autoOpenCourseSidebar', 'true');
        
        console.log('🎯 DashboardSidebar: localStorage défini, autoOpenCourseSidebar =', localStorage.getItem('autoOpenCourseSidebar'));
        
        const startTime = Date.now();
        localStorage.setItem('sandbox_study_time_start', startTime.toString());
        
        setMobileMenuOpen(false);
        
        // Navigation avec router.push pour garder le contexte React
        router.push(coursUrl);
    };

    return (
        <div className={`fixed left-0 top-0 h-full w-64 bg-white border-r border-gray-200 transform transition-all duration-300 ease-in-out lg:translate-x-0 z-40 ${mobileMenuOpen ? 'translate-x-0' : '-translate-x-full'} ${mounted ? 'opacity-100' : 'opacity-0'}`}>
            <div className="p-6 bg-white h-full">
                <div className="flex items-center justify-between mb-8">
                    <div className="flex items-center space-x-1">
                        <span className="md:text-xl sm:text-sm font-bold text-gray-900" style={{
                            fontFamily: "'Spectral', serif",
                            fontSize: isDesktop ? "1.4rem" : "1.2rem",
                        }}>LangProgress</span>
                    </div>
                    <button
                        onClick={() => setMobileMenuOpen(false)}
                        className="lg:hidden text-gray-500 hover:text-gray-700"
                    >
                        <X className="h-6 w-6" />
                    </button>
                </div>

                <div className="relative mb-8">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                    <input
                        type="text"
                        value={query}
                        onChange={(e) => { setQuery(e.target.value); setShowResults(true); }}
                        onFocus={() => setShowResults(true)}
                        onBlur={() => setTimeout(() => setShowResults(false), 150)}
                        placeholder="Rechercher..."
                        className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm text-black placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                    {showResults && results.length > 0 && (
                      <div className="absolute z-20 mt-2 w-full bg-white border border-gray-200 rounded-lg shadow-lg max-h-64 overflow-y-auto">
                        {results.map((r) => (
                          <Link
                            key={r.href}
                            href={r.href}
                            className="block px-3 py-2 text-sm text-gray-700 hover:bg-gray-50"
                            onClick={() => { setMobileMenuOpen(false); setShowResults(false); setQuery(''); }}
                          >
                            {r.label}
                          </Link>
                        ))}
                      </div>
                    )}
                </div>

                <nav className="space-y-2">
                    <Link
                        href="/dashboard"
                        className={`flex items-center space-x-3 px-3 py-2 rounded-lg font-medium transition-colors ${pathname === "/dashboard"
                            ? "text-blue-800 bg-blue-100"
                            : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                            }`}
                        onClick={() => setMobileMenuOpen(false)}
                    >
                        <Home className="h-5 w-5" />
                        <span>Tableau de bord</span>
                    </Link>

                    {selectedModule === 'B' ? (
                        <button
                            onClick={() => {
                                console.log('🅱️ Bouton Cours Module B cliqué');
                                localStorage.setItem('courseStarted', 'true');
                                localStorage.setItem('autoOpenCourseSidebar', 'true');
                                setMobileMenuOpen(false);
                                onShowModuleBCoursModal?.();
                            }}
                            className="w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-gray-600 hover:text-gray-900 hover:bg-gray-50 transition-colors"
                        >
                            <BookOpen className="h-5 w-5" />
                            <span>Cours</span>
                        </button>
                    ) : (
                        <button
                            onClick={(e) => {
                                console.log('🅰️ Bouton Cours Module A cliqué');
                                handleCoursClick(e);
                            }}
                            className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg transition-colors ${
                                pathname.startsWith("/chapters")
                                    ? "text-blue-800 bg-blue-100 font-medium"
                                    : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                                }`}
                        >
                            <BookOpen className="h-5 w-5" />
                            <span>Cours</span>
                        </button>
                    )}

                    {userPlan === 'COACHING' ? (
                        <Link
                            href="/coaching"
                            className={`flex items-center space-x-3 px-3 py-2 rounded-lg transition-colors ${
                                pathname === "/coaching"
                                    ? "text-blue-800 bg-blue-100 font-medium"
                                    : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                            }`}
                            onClick={() => setMobileMenuOpen(false)}
                        >
                            <FileText className="h-5 w-5" />
                            <span>Coaching</span>
                        </Link>
                    ) : (
                        <button
                            onClick={() => onShowRestrictionModal?.()}
                            className="w-full flex items-center justify-between px-3 py-2 rounded-lg text-gray-400 hover:bg-gray-50 cursor-pointer transition-colors"
                            title="Réservé au plan Coaching"
                        >
                            <div className="flex items-center space-x-3">
                                <FileText className="h-5 w-5" />
                                <span>Coaching</span>
                            </div>
                            <Lock className="h-4 w-4" />
                        </button>
                    )}

                    <Link
                        href={devoirsUrl}
                        className={`flex items-center space-x-3 px-3 py-2 rounded-lg transition-colors ${
                            pathname === "/homework" || pathname === "/homework-B"
                                ? "text-blue-800 bg-blue-100 font-medium"
                                : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                        }`}
                        onClick={() => setMobileMenuOpen(false)}
                    >
                        <ClipboardList className="h-5 w-5" />
                        <span>Devoirs</span>
                    </Link>

                    <Link
                        href="/guide"
                        className={`flex items-center space-x-3 px-3 py-2 rounded-lg transition-colors ${pathname === "/guide"
                            ? "text-blue-800 bg-blue-100 font-medium"
                            : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                            }`}
                        onClick={() => setMobileMenuOpen(false)}
                    >
                        <Info className="h-5 w-5" />
                        <span>Notice</span>
                    </Link>

                    <Link
                        href="/tips"
                        className={`flex items-center space-x-3 px-3 py-2 rounded-lg transition-colors ${
                            pathname === "/tips"
                                ? "text-blue-800 bg-blue-100 font-medium"
                                : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                        }`}
                        onClick={() => setMobileMenuOpen(false)}
                    >
                        <Lightbulb className="h-5 w-5" />
                        <span>Conseil</span>
                    </Link>

                    <Link
                        href="/levels"
                        className={`flex items-center justify-between px-3 py-2 rounded-lg transition-colors ${
                            pathname === "/levels"
                                ? "text-blue-800 bg-blue-100 font-medium"
                                : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                        }`}
                        onClick={() => setMobileMenuOpen(false)}
                    >
                        <div className="flex items-center space-x-3">
                            <BarChart className="h-5 w-5" />
                            <span>Niveaux</span>
                        </div>
                        <span className="text-[10px] font-semibold bg-green-500 text-white px-1.5 py-0.5 rounded-full">Nouveau</span>
                    </Link>

                    <div className="my-4 border-t border-gray-200"></div>

                    <Link
                        href="/subscription"
                        className={`flex items-center space-x-3 px-3 py-2 rounded-lg transition-colors ${
                            pathname === "/subscription"
                                ? "text-blue-800 bg-blue-100 font-medium"
                                : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                        }`}
                        onClick={() => setMobileMenuOpen(false)}
                    >
                        <CreditCard className="h-5 w-5" />
                        <span>Abonnement</span>
                    </Link>
                </nav>
            </div>
        </div>
    );
}
