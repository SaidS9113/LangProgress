'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Globe, Menu, X, ArrowLeft, Mail, Lock, User, Sparkles, Linkedin, Github, Eye, EyeOff } from 'lucide-react';

const fadeInUp = {
  hidden: { opacity: 0, y: 40 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { duration: 0.4, ease: [0, 0, 0.2, 1] as any }
  }
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.05
    }
  }
};

export default function RegisterPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [username, setUsername] = useState('');
  const [selectedModule, setSelectedModule] = useState<'A' | 'B' | ''>('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (password !== confirmPassword) {
      setError('Les mots de passe ne correspondent pas');
      return;
    }

    if (password.length < 6) {
      setError('Le mot de passe doit contenir au moins 6 caractères');
      return;
    }

    if (!selectedModule) {
      setError('Veuillez sélectionner un plan');
      return;
    }

    setLoading(true);

    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          email, 
          password, 
          username: username || null,
          selectedModule
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || 'Erreur lors de l\'inscription');
        setLoading(false);
        return;
      }

      localStorage.setItem('selectedDashboardModule', selectedModule);
      window.location.href = '/dashboard';
    } catch (err) {
      setError('Erreur de connexion au serveur');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white text-gray-900 overflow-x-hidden w-full max-w-full flex flex-col">
      <header className="hidden md:block fixed top-0 w-full z-50 bg-white/95 backdrop-blur-md border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 md:px-8 lg:px-16">
          <div className="flex justify-between items-center h-20">
            <Link href="/" className="flex items-center gap-2">
              <div className="w-10 h-10 bg-gradient-to-br from-sky-500 to-blue-600 rounded-xl flex items-center justify-center">
                <Globe className="w-6 h-6 text-white" />
              </div>
              <span className="text-2xl font-bold text-gray-900">
                Lang<span className="text-sky-500">Progress</span>
              </span>
            </Link>

            <div className="flex items-center gap-4">
              <Link
                href="/"
                className="flex items-center gap-2 text-gray-600 hover:text-gray-900 font-medium transition-colors"
              >
                <ArrowLeft className="w-4 h-4" />
                Retour au site
              </Link>
              <Link
                href="/login"
                className="bg-sky-500 hover:bg-sky-600 text-white px-6 py-2.5 rounded-full font-semibold transition-colors"
              >
                Se connecter
              </Link>
            </div>
          </div>
        </div>
      </header>

      <header className="md:hidden fixed top-0 left-0 right-0 z-50 px-4 pt-4">
        <div className="relative rounded-xl border transition-colors duration-300 bg-sky-500/60 backdrop-blur-xl border-white/10 px-4 py-3 flex justify-between items-center">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center">
              <Globe className="w-5 h-5 text-sky-500" />
            </div>
            <span className="text-xl font-bold text-white">
              LangProgress
            </span>
          </Link>

          <button 
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="w-10 h-10 flex items-center justify-center text-white hover:bg-white/10 rounded-xl transition-colors"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {mobileMenuOpen && (
          <div className="relative rounded-xl border transition-colors duration-300 bg-sky-500/60 backdrop-blur-xl border-white/10 mt-2 py-4 px-4">
            <div className="flex flex-col gap-2">
              <Link
                href="/"
                className="flex items-center gap-2 text-white/80 hover:text-white hover:bg-white/10 font-medium py-3 px-4 rounded-xl transition-colors"
              >
                <ArrowLeft className="w-4 h-4" />
                Retour au site
              </Link>
              <Link
                href="/login"
                className="bg-white text-sky-500 hover:bg-gray-100 px-6 py-3 rounded-xl font-semibold text-center transition-colors"
              >
                Se connecter
              </Link>
            </div>
          </div>
        )}
      </header>

      <main className="flex-1 flex items-center justify-center pt-32 pb-16 px-4">
        <motion.div
          initial="hidden"
          animate="visible"
          variants={staggerContainer}
          className="w-full max-w-md"
        >
          <motion.div 
            variants={fadeInUp}
            className="bg-white rounded-3xl border border-gray-200 p-8 shadow-xl"
          >
            <div className="text-center mb-8">
              <motion.div 
                className="w-16 h-16 bg-gradient-to-br from-sky-500 to-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-4"
                whileHover={{ scale: 1.05, rotate: 5 }}
              >
                <Globe className="w-8 h-8 text-white" />
              </motion.div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Inscription</h1>
              <p className="text-gray-500">Créez votre compte LangProgress</p>
            </div>

            <motion.div 
              variants={fadeInUp}
              className="mb-6 p-4 bg-emerald-50 border border-emerald-200 rounded-2xl"
            >
              <p className="text-emerald-600 text-sm font-semibold mb-1 flex items-center gap-2">
                <Sparkles className="w-4 h-4" />
                Compte gratuit
              </p>
              <p className="text-emerald-700 text-sm">Votre progression sera sauvegardée et commencera à 0%</p>
            </motion.div>

            <form onSubmit={handleSubmit} className="space-y-5">
              <motion.div variants={fadeInUp}>
                <label htmlFor="email" className="block text-sm font-semibold text-gray-700 mb-2">
                  Email *
                </label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-12 pr-4 py-3.5 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent transition-all"
                    placeholder="votre@email.com"
                    required
                  />
                </div>
              </motion.div>

              <motion.div variants={fadeInUp}>
                <label htmlFor="username" className="block text-sm font-semibold text-gray-700 mb-2">
                  Pseudo (optionnel)
                </label>
                <div className="relative">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    id="username"
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="w-full pl-12 pr-4 py-3.5 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent transition-all"
                    placeholder="Votre pseudo"
                  />
                </div>
              </motion.div>

              <motion.div variants={fadeInUp}>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Plan *
                </label>
                <div className="flex gap-4">
                  <motion.button
                    type="button"
                    onClick={() => setSelectedModule('A')}
                    className={`flex-1 py-3.5 px-4 rounded-xl border-2 transition-all font-semibold ${
                      selectedModule === 'A'
                        ? 'bg-sky-500 border-sky-500 text-white shadow-lg shadow-sky-200'
                        : 'bg-gray-50 border-gray-200 text-gray-700 hover:border-sky-300'
                    }`}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    Plan A
                  </motion.button>
                  <motion.button
                    type="button"
                    onClick={() => setSelectedModule('B')}
                    className={`flex-1 py-3.5 px-4 rounded-xl border-2 transition-all font-semibold ${
                      selectedModule === 'B'
                        ? 'bg-purple-500 border-purple-500 text-white shadow-lg shadow-purple-200'
                        : 'bg-gray-50 border-gray-200 text-gray-700 hover:border-purple-300'
                    }`}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    Plan B
                  </motion.button>
                </div>
              </motion.div>

              <motion.div variants={fadeInUp}>
                <label htmlFor="password" className="block text-sm font-semibold text-gray-700 mb-2">
                  Mot de passe *
                </label>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-12 pr-12 py-3.5 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent transition-all"
                    placeholder="••••••••"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </motion.div>

              <motion.div variants={fadeInUp}>
                <label htmlFor="confirmPassword" className="block text-sm font-semibold text-gray-700 mb-2">
                  Confirmer le mot de passe *
                </label>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    id="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="w-full pl-12 pr-12 py-3.5 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent transition-all"
                    placeholder="••••••••"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </motion.div>

              {error && (
                <motion.div 
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="p-4 bg-red-50 border border-red-200 rounded-xl"
                >
                  <p className="text-red-600 text-sm font-medium">{error}</p>
                </motion.div>
              )}

              <motion.button
                variants={fadeInUp}
                type="submit"
                disabled={loading}
                className="w-full py-3.5 px-4 bg-sky-500 hover:bg-sky-600 disabled:bg-sky-300 disabled:cursor-not-allowed text-white font-semibold rounded-xl transition-colors shadow-lg shadow-sky-200"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                {loading ? 'Inscription...' : 'Créer mon compte'}
              </motion.button>
            </form>

            <div className="mt-6 pt-6 border-t border-gray-100 text-center">
              <p className="text-gray-500 text-sm">
                Déjà un compte ?{' '}
                <Link href="/login" className="text-sky-500 hover:text-sky-600 font-semibold transition-colors">
                  Se connecter
                </Link>
              </p>
            </div>
          </motion.div>
        </motion.div>
      </main>

      <footer className="bg-gradient-to-b from-sky-50 to-sky-100 relative overflow-hidden">
        <div className="section-container py-12 relative z-10">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            <Link href="/" className="flex items-center gap-2">
              <div className="w-10 h-10 bg-gradient-to-br from-sky-500 to-blue-600 rounded-xl flex items-center justify-center">
                <Globe className="w-6 h-6 text-white" />
              </div>
              <span className="text-xl font-bold text-gray-900">
                Lang<span className="text-sky-500">Progress</span>
              </span>
            </Link>

            <div className="flex items-center gap-4">
              <a 
                href="https://www.linkedin.com/in/soidroudine-said/" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="w-10 h-10 bg-white rounded-xl flex items-center justify-center text-gray-600 hover:text-sky-500 hover:shadow-lg transition-all"
              >
                <Linkedin className="w-5 h-5" />
              </a>
              <a 
                href="https://github.com/saidSoidroudine" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="w-10 h-10 bg-white rounded-xl flex items-center justify-center text-gray-600 hover:text-sky-500 hover:shadow-lg transition-all"
              >
                <Github className="w-5 h-5" />
              </a>
            </div>

            <p className="text-gray-500 text-sm text-center md:text-right">
              © 2026 LangProgress - Par Said Soidroudine
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
