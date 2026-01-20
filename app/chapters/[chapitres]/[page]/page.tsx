import React from 'react';
import { generateAllStaticParams, getLessonByNumbers } from '@/lib/chapters';
import AutoProgressWrapper from '@/app/components/AutoProgressWrapper';

type ParamsType = {
  chapitres: string;
  page: string;
};

type Props = {
  params: Promise<ParamsType>;
};

function NotFoundPage({
  chapNum,
  lessonNum,
  lessonInfo,
}: {
  chapNum: number;
  lessonNum: number;
  lessonInfo: ReturnType<typeof getLessonByNumbers> | null;
}) {
  return (
    <div className="min-h-screen bg-zinc-900 flex items-center justify-center">
      <div className="text-center p-8">
        <h1 className="text-3xl font-bold text-red-400 mb-4"></h1>
        <h2 className="text-xl font-bold text-red-400 mb-4">Leçon non trouvée</h2>

        {lessonInfo ? (
          <div className="text-gray-400 mb-4">
            <p className="mb-2">
              La leçon <strong>&quot;{lessonInfo.title}&quot;</strong> existe dans la configuration
            </p>
            <p className="mb-2">mais le composant n&apos;a pas encore été créé.</p>
          </div>
        ) : (
          <p className="text-gray-400 mb-4">
            Le chapitre {chapNum}, leçon {lessonNum} n&apos;existe pas dans la configuration.
          </p>
        )}

        <p className="text-gray-500 text-sm">
          Chemin recherché : /app/components/chapters/chapter{chapNum}/Lecon{lessonNum}.tsx
        </p>

        <div className="mt-6">
          <a
            href="/chapters/1/1"
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors"
          >
            Retour au début
          </a>
        </div>
      </div>
    </div>
  );
}

async function getComponent(chapitres: string, page: string) {
  const chapNum = parseInt(chapitres, 10);
  const lessonNum = parseInt(page, 10);

  // Vérifier que les paramètres sont des nombres valides
  if (isNaN(chapNum) || isNaN(lessonNum)) {
    console.error(`Paramètres invalides: chapitres=${chapitres}, page=${page}`);
    return () => <NotFoundPage chapNum={chapNum || 0} lessonNum={lessonNum || 0} lessonInfo={null} />;
  }

  try {
    // Import Lecon component: chapter1/Lecon1.tsx, chapter1/Lecon2.tsx, etc.
    const module = await import(
      `@/app/components/chapters/chapter${chapNum}/Lecon${lessonNum}`
    );

    if (
      module.default &&
      (typeof module.default === 'function' || typeof module.default === 'object')
    ) {
      return module.default;
    } else {
      throw new Error('Composant invalide ou manquant dans le module importé');
    }
  } catch (error) {
    console.error(`Erreur de chargement: chapter${chapNum}/Lecon${lessonNum}`, error);

    const lessonInfo = getLessonByNumbers(chapNum, lessonNum);

    return () => <NotFoundPage chapNum={chapNum} lessonNum={lessonNum} lessonInfo={lessonInfo} />;
  }
}

export default async function Page({ params }: Props) {
  const { chapitres, page } = await params;
  const Component = await getComponent(chapitres, page);
  
  return (
    <AutoProgressWrapper>
      <Component />
    </AutoProgressWrapper>
  );
}

export async function generateStaticParams() {
  return generateAllStaticParams();
}
