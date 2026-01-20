import React from 'react';

type ParamsType = {
  chapitres: string;
};

type Props = {
  params: Promise<ParamsType>;
};

export default async function ChapitreVideoPage({ params }: Props) {
  const { chapitres } = await params;
  const chapterNum = parseInt(chapitres, 10);

  return (
    <div className="min-h-screen bg-zinc-900 p-6 lg:p-10">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-2xl font-bold text-white mb-6 text-center">
          Vidéo du Chapitre {chapterNum}
        </h1>

        <div className="relative bg-black rounded-2xl overflow-hidden aspect-video mb-6 border border-gray-700">
          <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-gray-800 to-gray-900">
            <div className="text-center">
              <div className="w-20 h-20 rounded-full bg-blue-600/20 flex items-center justify-center mx-auto mb-4 border-2 border-blue-500/30">
                <span className="text-4xl">▶</span>
              </div>
              <p className="text-gray-400 text-sm">Vidéo de démonstration</p>
              <p className="text-gray-500 text-xs mt-1">Chapitre {chapterNum} - Module A</p>
            </div>
          </div>

          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4">
            <div className="mb-3">
              <div className="h-1 bg-gray-700 rounded-full overflow-hidden">
                <div className="h-full bg-blue-500 rounded-full w-1/3" />
              </div>
              <div className="flex justify-between text-xs text-gray-400 mt-1">
                <span>1:45</span>
                <span>5:00</span>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <button className="p-2 text-gray-400 hover:text-white">⏮</button>
                <button className="p-3 bg-blue-600 hover:bg-blue-700 text-white rounded-full">
                  ▶
                </button>
                <button className="p-2 text-gray-400 hover:text-white">⏭</button>
              </div>

              <div className="flex items-center gap-2">
                <button className="p-2 text-gray-400 hover:text-white">🔊</button>
                <button className="p-2 text-gray-400 hover:text-white">⛶</button>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-gray-800/50 rounded-xl border border-gray-700 p-6">
          <h2 className="text-lg font-semibold text-white mb-3">À propos de cette vidéo</h2>
          <p className="text-gray-400 mb-4">
            Cette vidéo présente les concepts clés du chapitre {chapterNum}. 
            Regardez attentivement avant de passer aux exercices pratiques.
          </p>
          <div className="flex items-center gap-4 text-sm text-gray-500">
            <span>Durée: 5:00</span>
            <span>•</span>
            <span>Module A</span>
          </div>
        </div>

        <div className="flex justify-center gap-4 mt-8">
          <a
            href={`/chapters/${chapterNum}/introduction`}
            className="flex items-center gap-2 px-5 py-2.5 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors"
          >
            ← Introduction
          </a>
          <a
            href={`/chapters/${chapterNum}/0`}
            className="flex items-center gap-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
          >
            Commencer le cours →
          </a>
        </div>
      </div>
    </div>
  );
}
