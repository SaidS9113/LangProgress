'use client';

import React, { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { motion, Variants } from 'framer-motion';
import { Globe, Menu, X, ArrowLeft, Mail, Lock, Rocket, Linkedin, Github, AlertCircle, Eye, EyeOff } from 'lucide-react';

const fadeInUp: Variants = {
  hidden: { opacity: 0, y: 40 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { duration: 0.4, ease: "easeOut" as const }
  }
};

const staggerContainer: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.05
    }
  }
};

function LoginContent() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [inactivityMessage, setInactivityMessage] = useState(false);
  const searchParams = useSearchParams();

  useEffect(() => {
    if (searchParams.get('reason') === 'inactivity') {
      setInactivityMessage(true);
      // Supprimer le paramètre de l'URL après 5 secondes
      setTimeout(() => {
        window.history.replaceState({}, '', '/login');
      }, 5000);
    }
  }, [searchParams]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || 'Erreur de connexion');
        setLoading(false);
        return;
      }

      window.location.href = '/dashboard';
    } catch (err) {
      setError('Erreur de connexion au serveur');
      setLoading(false);
    }
  };

  const handleDemoLogin = async () => {
    setLoading(true);
    setError('');
    
    try {
      // Utiliser l'API dédiée pour la connexion démo (avec tracking visiteur)
      const res = await fetch('/api/demo-login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || 'Erreur de connexion');
        setLoading(false);
        return;
      }

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
                href="/register"
                className="bg-sky-500 hover:bg-sky-600 text-white px-6 py-2.5 rounded-full font-semibold transition-colors"
              >
                S&apos;inscrire
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
                href="/register"
                className="bg-white text-sky-500 hover:bg-gray-100 px-6 py-3 rounded-xl font-semibold text-center transition-colors"
              >
                S&apos;inscrire
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
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Connexion</h1>
              <p className="text-gray-500">Accédez à votre espace LangProgress</p>
            </div>

            <motion.div 
              variants={fadeInUp}
              className="mb-6 p-4 bg-sky-50 border border-sky-200 rounded-2xl"
            >
              <p className="text-sky-600 text-sm font-semibold mb-2 flex items-center gap-2">
                <Rocket className="w-4 h-4" />
                Identifiants de démo
              </p>
              <p className="text-sky-700 text-sm">Email: <code className="bg-sky-100 px-2 py-0.5 rounded-lg font-mono">demo@sandbox.com</code></p>
              <p className="text-sky-700 text-sm">Mot de passe: <code className="bg-sky-100 px-2 py-0.5 rounded-lg font-mono">demo123</code></p>
            </motion.div>

            <form onSubmit={handleSubmit} className="space-y-5">
              <motion.div variants={fadeInUp}>
                <label htmlFor="email" className="block text-sm font-semibold text-gray-700 mb-2">
                  Email
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
                <label htmlFor="password" className="block text-sm font-semibold text-gray-700 mb-2">
                  Mot de passe
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

              {inactivityMessage && (
                <motion.div 
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="p-4 bg-amber-50 border border-amber-200 rounded-xl flex items-center gap-3"
                >
                  <AlertCircle className="w-5 h-5 text-amber-600 flex-shrink-0" />
                  <p className="text-amber-700 text-sm font-medium">
                    Vous avez été déconnecté pour inactivité. Veuillez vous reconnecter.
                  </p>
                </motion.div>
              )}

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
                {loading ? 'Connexion...' : 'Se connecter'}
              </motion.button>
            </form>

            <div className="mt-4">
              <motion.button
                variants={fadeInUp}
                onClick={handleDemoLogin}
                disabled={loading}
                className="w-full py-3.5 px-4 bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-600 hover:to-green-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold rounded-xl transition-all shadow-lg shadow-emerald-200 flex items-center justify-center gap-2"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Rocket className="w-5 h-5" />
                Connexion rapide (Demo)
              </motion.button>
            </div>

            <div className="mt-6 text-center">
              <Link href="/forgot-password" className="text-sky-500 hover:text-sky-600 text-sm font-medium transition-colors">
                Mot de passe oublié ?
              </Link>
            </div>

            <div className="mt-6 pt-6 border-t border-gray-100 text-center">
              <p className="text-gray-500 text-sm">
                Pas encore de compte ?{' '}
                <Link href="/register" className="text-sky-500 hover:text-sky-600 font-semibold transition-colors">
                  Créer un compte
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

export default function LoginPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-sky-500"></div>
      </div>
    }>
      <LoginContent />
    </Suspense>
  );
}
