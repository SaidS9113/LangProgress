import React from 'react';

type ParamsType = {
  chapitres: string;
};

type Props = {
  params: Promise<ParamsType>;
};

const CHAPTER_TITLES: Record<number, string> = {
  1: "Introduction au module",
  2: "Les bases fondamentales",
  3: "Concepts intermédiaires",
  4: "Approfondissement",
  5: "Techniques avancées",
  6: "Cas pratiques",
  7: "Études de cas",
  8: "Méthodologie",
  9: "Pratique guidée",
  10: "Exercices avancés",
  11: "Révision générale",
};

export default async function ChapitreIntroPage({ params }: Props) {
  const { chapitres } = await params;
  const chapterNum = parseInt(chapitres, 10);
  const title = CHAPTER_TITLES[chapterNum] || `Chapitre ${chapterNum}`;

  return (
    <div className="min-h-screen bg-zinc-900 p-6 lg:p-10">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 mb-6">
            <span className="text-3xl font-bold text-white">{chapterNum}</span>
          </div>
          <h1 className="text-3xl lg:text-4xl font-bold text-white mb-4">
            {title}
          </h1>
          <p className="text-lg text-gray-400">
            Introduction et objectifs du chapitre
          </p>
        </div>

        <div className="bg-gray-800/50 rounded-2xl border border-gray-700 p-6 lg:p-8 mb-8">
          <h2 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
            📚 Ce que vous allez apprendre
          </h2>
          <ul className="space-y-3 text-gray-300">
            <li className="flex items-start gap-3">
              <span className="text-green-400">✓</span>
              <span>Les concepts fondamentaux du chapitre</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-green-400">✓</span>
              <span>Des exercices pratiques pour renforcer vos acquis</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-green-400">✓</span>
              <span>Un quiz pour valider vos connaissances</span>
            </li>
          </ul>
        </div>

        <div className="bg-gray-800/50 rounded-2xl border border-gray-700 p-6 lg:p-8 mb-8">
          <h2 className="text-xl font-semibold text-white mb-4">
            📋 Structure du chapitre
          </h2>
          <div className="space-y-3">
            <div className="flex items-center gap-3 p-3 bg-blue-500/10 rounded-lg border border-blue-500/20">
              <span className="text-blue-400">▶</span>
              <span className="text-gray-300">Vidéo explicative</span>
              <span className="ml-auto text-xs text-gray-500">~5 min</span>
            </div>
            <div className="flex items-center gap-3 p-3 bg-gray-700/30 rounded-lg">
              <span className="text-gray-400">📖</span>
              <span className="text-gray-300">Pages de cours</span>
              <span className="ml-auto text-xs text-gray-500">~15 min</span>
            </div>
            <div className="flex items-center gap-3 p-3 bg-gray-700/30 rounded-lg">
              <span className="text-gray-400">❓</span>
              <span className="text-gray-300">Quiz de validation</span>
              <span className="ml-auto text-xs text-gray-500">~5 min</span>
            </div>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <a
            href={`/chapters/${chapterNum}/video`}
            className="flex items-center justify-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors font-medium"
          >
            ▶ Regarder la vidéo
          </a>
          <a
            href={`/chapters/${chapterNum}/0`}
            className="flex items-center justify-center gap-2 px-6 py-3 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors"
          >
            📖 Aller au cours
          </a>
        </div>
      </div>
    </div>
  );
}
