import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Checkout - Abonnement',
  description: 'Finalisez votre abonnement LangProgress. Accès illimité aux cours, vidéos et exercices interactifs.',
  robots: {
    index: false, // Page de paiement, pas indexée
    follow: false,
  },
};

export default function CheckoutLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
