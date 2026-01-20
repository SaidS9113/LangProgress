'use client';
import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { BookOpen, CheckCircle2, XCircle, Loader2 } from 'lucide-react';

export default function MerciClient() {
  const searchParams = useSearchParams();
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [message, setMessage] = useState('');

  useEffect(() => {
    const sessionId = searchParams.get('session_id');
    if (!sessionId) {
      setStatus('error');
      setMessage('Session invalide');
      return;
    }

    const verifyPayment = async () => {
      try {
        const response = await fetch('/api/stripe/verify-payment', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ sessionId }),
        });
        const data = await response.json();

        if (response.ok && data.success) {
          setStatus('success');
          setMessage('Paiement confirmé ! Redirection vers votre espace...');
          setTimeout(() => {
            if (data.needsProfileCompletion) {
              window.location.replace('/complete-profile');
            } else {
              window.location.replace('/dashboard');
            }
          }, 1500);
        } else {
          setStatus('error');
          setMessage(data.error || 'Erreur lors de la vérification du paiement');
        }
      } catch (error) {
        setStatus('error');
        setMessage('Erreur de connexion');
        console.error('Payment verification error:', error);
      }
    };

    verifyPayment();
  }, [searchParams]);

  if (status === 'loading') {
    return (
      <div className="merci-page-dark min-h-screen relative overflow-hidden bg-black">
        <style jsx>{`
          .merci-page-dark {
            background-color: #000000 !important;
            color: #ffffff !important;
          }
        `}</style>

        {/* Light effects on sides */}
        <div className="absolute inset-0">
          <div className="absolute top-0 -left-40 w-96 h-full bg-gradient-to-r from-transparent via-blue-500/10 to-transparent blur-3xl"></div>
          <div className="absolute top-0 -right-40 w-96 h-full bg-gradient-to-l from-transparent via-purple-500/10 to-transparent blur-3xl"></div>
          <div className="absolute -top-40 left-1/2 -translate-x-1/2 w-96 h-96 bg-gradient-to-b from-white/5 to-transparent rounded-full blur-3xl"></div>
        </div>

        {/* Grid pattern overlay */}
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' xmlns='http://www.w3.org/2000/svg'%3E%3Cdefs%3E%3Cpattern id='grid' width='60' height='60' patternUnits='userSpaceOnUse'%3E%3Cpath d='M 60 0 L 0 0 0 60' fill='none' stroke='white' stroke-width='0.5' opacity='0.05'/%3E%3C/pattern%3E%3C/defs%3E%3Crect width='100%25' height='100%25' fill='url(%23grid)'/%3E%3C/svg%3E")`
          }}
        ></div>

        <div className="relative z-10 flex flex-col justify-center min-h-screen py-12 sm:px-6 lg:px-8">
          <div className="flex flex-col items-center justify-center sm:mx-auto sm:w-full sm:max-w-md">
            <div className="flex items-center justify-center p-3 rounded-xl bg-opacity-20">
              <BookOpen className="h-8 w-8 text-white" />
            </div>
            <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md px-4">
              <div className="relative">
                <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-2xl blur opacity-30"></div>
                <div className="relative bg-gray-950/90 backdrop-blur-xl py-12 px-6 rounded-2xl border border-gray-800 sm:px-10 text-center">
                  <div className="flex justify-center">
                    <Loader2 className="h-12 w-12 animate-spin text-blue-500" />
                  </div>
                  <h2 className="mt-6 text-xl font-semibold text-white">
                    Vérification du paiement...
                  </h2>
                  <p className="mt-2 text-sm text-gray-400">
                    Veuillez patienter pendant que nous confirmons votre paiement.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (status === 'error') {
    return (
      <div className="merci-page-dark min-h-screen relative overflow-hidden bg-black">
        <style jsx>{`
          .merci-page-dark {
            background-color: #000000 !important;
            color: #ffffff !important;
          }
        `}</style>

        {/* Light effects on sides */}
        <div className="absolute inset-0">
          <div className="absolute top-0 -left-40 w-96 h-full bg-gradient-to-r from-transparent via-blue-500/10 to-transparent blur-3xl"></div>
          <div className="absolute top-0 -right-40 w-96 h-full bg-gradient-to-l from-transparent via-purple-500/10 to-transparent blur-3xl"></div>
          <div className="absolute -top-40 left-1/2 -translate-x-1/2 w-96 h-96 bg-gradient-to-b from-white/5 to-transparent rounded-full blur-3xl"></div>
        </div>

        {/* Grid pattern overlay */}
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' xmlns='http://www.w3.org/2000/svg'%3E%3Cdefs%3E%3Cpattern id='grid' width='60' height='60' patternUnits='userSpaceOnUse'%3E%3Cpath d='M 60 0 L 0 0 0 60' fill='none' stroke='white' stroke-width='0.5' opacity='0.05'/%3E%3C/pattern%3E%3C/defs%3E%3Crect width='100%25' height='100%25' fill='url(%23grid)'/%3E%3C/svg%3E")`
          }}
        ></div>

        <div className="relative z-10 flex flex-col justify-center min-h-screen py-12 sm:px-6 lg:px-8">
          <div className="flex flex-col items-center justify-center sm:mx-auto sm:w-full sm:max-w-md">
            <div className="flex items-center justify-center p-3 rounded-xl bg-opacity-20">
              <BookOpen className="h-8 w-8 text-white" />
            </div>
            <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md px-4">
              <div className="relative">
                <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-2xl blur opacity-30"></div>
                <div className="relative bg-gray-950/90 backdrop-blur-xl py-12 px-6 rounded-2xl border border-gray-800 sm:px-10 text-center">
                  <div className="flex justify-center">
                    <XCircle className="h-12 w-12 text-red-500" />
                  </div>
                  <h2 className="mt-6 text-xl font-semibold text-white">
                    Erreur de paiement
                  </h2>
                  <p className="mt-2 text-sm text-gray-400">{message}</p>
                  <div className="mt-8">
                    <Link
                      href="/checkout"
                      className="group relative w-full flex justify-center items-center py-3 px-4 border border-transparent rounded-lg text-sm font-medium text-white bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900 focus:ring-blue-500 transition-all duration-200"
                    >
                      Réessayer
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="merci-page-dark min-h-screen relative overflow-hidden bg-black">
      <style jsx>{`
        .merci-page-dark {
          background-color: #000000 !important;
          color: #ffffff !important;
        }
      `}</style>

      {/* Light effects on sides */}
      <div className="absolute inset-0">
        <div className="absolute top-0 -left-40 w-96 h-full bg-gradient-to-r from-transparent via-blue-500/10 to-transparent blur-3xl"></div>
        <div className="absolute top-0 -right-40 w-96 h-full bg-gradient-to-l from-transparent via-purple-500/10 to-transparent blur-3xl"></div>
        <div className="absolute -top-40 left-1/2 -translate-x-1/2 w-96 h-96 bg-gradient-to-b from-white/5 to-transparent rounded-full blur-3xl"></div>
      </div>

      {/* Grid pattern overlay */}
      <div
        className="absolute inset-0"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' xmlns='http://www.w3.org/2000/svg'%3E%3Cdefs%3E%3Cpattern id='grid' width='60' height='60' patternUnits='userSpaceOnUse'%3E%3Cpath d='M 60 0 L 0 0 0 60' fill='none' stroke='white' stroke-width='0.5' opacity='0.05'/%3E%3C/pattern%3E%3C/defs%3E%3Crect width='100%25' height='100%25' fill='url(%23grid)'/%3E%3C/svg%3E")`
        }}
      ></div>

      <div className="relative z-10 flex flex-col justify-center min-h-screen py-12 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center justify-center sm:mx-auto sm:w-full sm:max-w-md">
          <div className="flex items-center justify-center p-3 rounded-xl bg-opacity-20">
            <BookOpen className="h-8 w-8 text-white" />
          </div>
          <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md px-4">
            <div className="relative">
              <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-2xl blur opacity-30"></div>
              <div className="relative bg-gray-950/90 backdrop-blur-xl py-12 px-6 rounded-2xl border border-gray-800 sm:px-10 text-center">
                <div className="flex justify-center">
                  <CheckCircle2 className="h-12 w-12 text-green-500" />
                </div>
                <h2 className="mt-6 text-xl font-semibold text-white">
                  Merci pour votre achat !
                </h2>
                <p className="mt-2 text-sm text-gray-400">{message}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
