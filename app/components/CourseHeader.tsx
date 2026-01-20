'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {
    Menu,
    Bell,
    ChevronDown,
    LogOut,
    Home,
    User as UserIcon
} from 'lucide-react';
import Logo from './Logo';

interface CourseHeaderProps {
    mobileMenuOpen: boolean;
    setMobileMenuOpen: (open: boolean) => void;
}

export default function CourseHeader({
    mobileMenuOpen,
    setMobileMenuOpen,
}: CourseHeaderProps) {
    const router = useRouter();
    const [showProfileMenu, setShowProfileMenu] = useState(false);
    const [user, setUser] = useState<{ username: string | null; email: string } | null>(null);

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const res = await fetch('/api/auth/me');
                if (res.ok) {
                    const data = await res.json();
                    setUser(data);
                }
            } catch (error) {
                console.error('Erreur:', error);
            }
        };
        fetchUser();
    }, []);

    const handleLogout = async () => {
        try {
            await fetch('/api/auth/logout', { method: 'POST' });
            window.location.href = '/login';
        } catch (error) {
            console.error('Erreur lors de la déconnexion:', error);
        }
    };

    return (
        <header className="sticky top-0 z-50 bg-gray-900/95 backdrop-blur border-b border-gray-800">
            <div className="px-4 lg:px-6">
                <div className="flex items-center justify-between h-16">
                    {/* Menu mobile + Logo */}
                    <div className="flex items-center gap-4">
                        <button
                            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                            className="lg:hidden p-2 text-gray-400 hover:text-white transition-colors"
                        >
                            <Menu className="w-6 h-6" />
                        </button>
                        
                        <Link href="/dashboard" className="flex items-center gap-2">
                            <Logo />
                            <span className="hidden sm:block text-lg font-semibold text-white">
                                E-Learning <span className="text-blue-400 text-xs">Demo</span>
                            </span>
                        </Link>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-3">
                        {/* Lien Dashboard */}
                        <Link
                            href="/dashboard"
                            className="hidden sm:flex items-center gap-2 px-3 py-2 text-gray-400 hover:text-white transition-colors"
                        >
                            <Home className="w-4 h-4" />
                            <span className="text-sm">Dashboard</span>
                        </Link>

                        {/* Notifications */}
                        <button className="relative p-2 text-gray-400 hover:text-white transition-colors">
                            <Bell className="w-5 h-5" />
                            <span className="absolute top-1 right-1 w-2 h-2 bg-blue-500 rounded-full"></span>
                        </button>

                        {/* Profil */}
                        <div className="relative">
                            <button
                                onClick={() => setShowProfileMenu(!showProfileMenu)}
                                className="flex items-center gap-2 p-2 rounded-lg hover:bg-gray-800 transition-colors"
                            >
                                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                                    <UserIcon className="w-4 h-4 text-white" />
                                </div>
                                <span className="hidden md:block text-sm text-gray-300">
                                    {user?.username || 'Utilisateur'}
                                </span>
                                <ChevronDown className="w-4 h-4 text-gray-400" />
                            </button>

                            {/* Menu déroulant */}
                            {showProfileMenu && (
                                <>
                                    <div 
                                        className="fixed inset-0 z-40"
                                        onClick={() => setShowProfileMenu(false)}
                                    />
                                    <div className="absolute right-0 mt-2 w-56 bg-gray-800 rounded-lg shadow-xl border border-gray-700 py-2 z-50">
                                        <div className="px-4 py-2 border-b border-gray-700">
                                            <p className="text-sm text-white font-medium truncate">
                                                {user?.username || 'Utilisateur Demo'}
                                            </p>
                                            <p className="text-xs text-gray-400 truncate">
                                                {user?.email || 'demo@sandbox.com'}
                                            </p>
                                        </div>

                                        <Link
                                            href="/dashboard"
                                            className="flex items-center gap-3 px-4 py-2 text-gray-300 hover:bg-gray-700 transition-colors"
                                            onClick={() => setShowProfileMenu(false)}
                                        >
                                            <Home className="w-4 h-4" />
                                            Tableau de bord
                                        </Link>

                                        <button
                                            onClick={handleLogout}
                                            className="w-full flex items-center gap-3 px-4 py-2 text-red-400 hover:bg-gray-700 transition-colors"
                                        >
                                            <LogOut className="w-4 h-4" />
                                            Déconnexion
                                        </button>
                                    </div>
                                </>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </header>
    );
}
