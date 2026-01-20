import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Connexion',
  description: 'Connectez-vous à LangProgress pour accéder à votre espace d\'apprentissage personnalisé. Cours de langues interactifs, suivi de progression et quiz.',
  robots: {
    index: true,
    follow: true,
  },
  openGraph: {
    title: 'Connexion | LangProgress',
    description: 'Accédez à votre espace d\'apprentissage LangProgress.',
    type: 'website',
  },
};

export default function LoginLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
