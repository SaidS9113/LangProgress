import React from 'react';
import type { Metadata } from "next";
import Script from "next/script";
import './globals.css';

export const metadata: Metadata = {
  title: {
    default: "LangProgress – Plateforme d'apprentissage de langues",
    template: "%s | LangProgress"
  },
  description:
    "Apprenez les langues efficacement avec LangProgress. Une plateforme moderne et interactive avec des cours progressifs, des quiz, des exercices et un suivi personnalisé de votre progression.",
  keywords:
    "apprendre langues, cours en ligne, plateforme éducative, e-learning, apprentissage interactif, LangProgress, cours progressifs, quiz langues, exercices langues, suivi progression",
  authors: [{ name: "LangProgress" }],
  creator: "LangProgress",
  publisher: "LangProgress",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  openGraph: {
    type: "website",
    locale: "fr_FR",
    url: process.env.APP_URL || "https://langprogress-s.vercel.app",
    siteName: "LangProgress",
    title: "LangProgress – Apprenez les langues efficacement",
    description:
      "Une plateforme moderne d'apprentissage de langues avec des cours progressifs, des quiz interactifs et un suivi personnalisé.",
    images: [
      {
        url: `${process.env.APP_URL || "https://langprogress-s.vercel.app"}/og-image.jpg`,
        width: 1200,
        height: 630,
        alt: "LangProgress - Plateforme d'apprentissage de langues",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "LangProgress – Plateforme d'apprentissage de langues",
    description:
      "Apprenez les langues efficacement avec des cours progressifs, quiz et suivi personnalisé.",
    images: [`${process.env.APP_URL || "https://langprogress-s.vercel.app"}/og-image.jpg`],
  },
  alternates: {
    canonical: process.env.APP_URL || "https://langprogress-s.vercel.app",
  },
  verification: {
    google: process.env.GOOGLE_SITE_VERIFICATION || "",
  },
  metadataBase: new URL(process.env.APP_URL || "https://langprogress-s.vercel.app"),
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="fr">
      <head>
        {/* Favicon & manifest */}
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="icon" href="/icon.svg" type="image/svg+xml" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <link rel="manifest" href="/manifest.json" />

        {/* Thème et responsive */}
        <meta name="theme-color" content="#0ea5e9" />
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=5" />

        {/* Google Analytics - uniquement si configuré */}
        {process.env.NEXT_PUBLIC_GA_ID && (
          <>
            <Script
              src={`https://www.googletagmanager.com/gtag/js?id=${process.env.NEXT_PUBLIC_GA_ID}`}
              strategy="afterInteractive"
            />
            <Script id="google-analytics" strategy="afterInteractive">
              {`
                window.dataLayer = window.dataLayer || [];
                function gtag(){dataLayer.push(arguments);}
                gtag('js', new Date());
                gtag('config', '${process.env.NEXT_PUBLIC_GA_ID}');
              `}
            </Script>
          </>
        )}

        {/* Données structurées SEO */}
        <script
          type="application/ld+json"
          suppressHydrationWarning
          dangerouslySetInnerHTML={{
            __html: JSON.stringify([
              {
                "@context": "https://schema.org",
                "@type": "Organization",
                "name": "LangProgress",
                "url": process.env.APP_URL || "https://langprogress-s.vercel.app",
                "logo": `${process.env.APP_URL || "https://langprogress-s.vercel.app"}/icon-512.png`,
                "description": "Plateforme d'apprentissage de langues avec cours progressifs et suivi personnalisé.",
                "sameAs": [
                  process.env.LINKEDIN_URL || "https://linkedin.com/in/soidroudine-said",
                  process.env.GITHUB_URL || "https://github.com/soidroudine"
                ],
                "founder": {
                  "@type": "Person",
                  "name": "Soidroudine",
                  "jobTitle": "Développeur Full Stack"
                },
                "contactPoint": {
                  "@type": "ContactPoint",
                  "contactType": "Customer Service",
                  "email": process.env.CONTACT_EMAIL || "contact@langprogress.com"
                }
              },
              {
                "@context": "https://schema.org",
                "@type": "WebSite",
                "name": "LangProgress",
                "url": process.env.APP_URL || "https://langprogress-s.vercel.app",
                "potentialAction": {
                  "@type": "SearchAction",
                  "target": `${process.env.APP_URL || "https://langprogress-s.vercel.app"}/recherche?q={search_term_string}`,
                  "query-input": "required name=search_term_string",
                },
              },
              {
                "@context": "https://schema.org",
                "@type": "WebApplication",
                "name": "LangProgress",
                "description": "Plateforme e-learning pour l'apprentissage de langues. Cours progressifs, quiz interactifs, vidéos explicatives et suivi de progression en temps réel.",
                "url": process.env.APP_URL || "https://langprogress-s.vercel.app",
                "applicationCategory": "EducationalApplication",
                "operatingSystem": "Web",
                "offers": {
                  "@type": "Offer",
                  "price": "0",
                  "priceCurrency": "EUR",
                  "availability": "https://schema.org/InStock"
                },
                "aggregateRating": {
                  "@type": "AggregateRating",
                  "ratingValue": "4.8",
                  "ratingCount": "150",
                  "bestRating": "5",
                  "worstRating": "1"
                }
              }
            ]),
          }}
        />
      </head>
      <body className="antialiased">{children}</body>
    </html>
  );
}
