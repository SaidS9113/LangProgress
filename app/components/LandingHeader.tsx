import Link from 'next/link';

interface LandingHeaderProps {
  showLogin?: boolean;
  showRegister?: boolean;
}

export default function LandingHeader({ showLogin = true, showRegister = false }: LandingHeaderProps) {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-sm border-b border-gray-100 shadow-sm shadow-gray-200/50">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <a href="..." target="_blank" rel="noopener noreferrer" className="flex items-center gap-3">
            <img
              src="/img/logo-bleu-fonce-point.png"
              alt="Logo"
              className="h-10 w-auto"
            />
            <div className="flex flex-col">
              <span className="text-lg font-bold text-gray-900"></span>
              <span className="text-xs text-gray-500">by <span className="text-blue-600">LangProgress</span></span>
            </div>
          </a>
          <div className="flex items-center gap-3">
            <a
              href="..."
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center px-4 py-2 text-sm font-medium text-gray-600 hover:text-blue-600 transition-colors"
            >
              Site web
            </a>
            {showLogin && (
              <Link
                href="/login"
                className="text-sm font-medium text-gray-600 hover:text-blue-600 transition-colors"
              >
                Se connecter
              </Link>
            )}
            {showRegister && (
              <Link
                href="/checkout"
                className="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-full hover:bg-blue-700 transition-colors"
              >
                S'inscrire
              </Link>
            )}
          </div>
        </div>
      </nav>
    </header>
  );
}
