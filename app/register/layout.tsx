import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Inscription',
  description: 'Créez votre compte LangProgress et commencez à apprendre une nouvelle langue. Inscription gratuite, cours progressifs et suivi personnalisé.',
  robots: {
    index: true,
    follow: true,
  },
  openGraph: {
    title: 'Inscription | LangProgress',
    description: 'Rejoignez LangProgress et commencez votre apprentissage.',
    type: 'website',
  },
};

export default function RegisterLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
