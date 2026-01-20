'use client';

import React, { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';

const QUIZ_QUESTIONS = [
  {
    question: "Quelle est la capitale de la France ?",
    options: ["Lyon", "Marseille", "Paris", "Bordeaux"],
    correct: 2
  },
  {
    question: "Combien font 7 x 8 ?",
    options: ["54", "56", "58", "64"],
    correct: 1
  },
  {
    question: "Quelle planète est surnommée la planète rouge ?",
    options: ["Vénus", "Mars", "Jupiter", "Saturne"],
    correct: 1
  }
];

export default function ChapitreQuizPage() {
  const params = useParams();
  const router = useRouter();
  const chapterNum = parseInt(params.chapitres as string);
  
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [score, setScore] = useState(0);
  const [quizCompleted, setQuizCompleted] = useState(false);

  const handleAnswerSelect = (index: number) => {
    if (showResult) return;
    setSelectedAnswer(index);
  };

  const handleSubmit = () => {
    if (selectedAnswer === null) return;
    
    setShowResult(true);
    if (selectedAnswer === QUIZ_QUESTIONS[currentQuestion].correct) {
      setScore(score + 1);
    }
  };

  const handleNext = () => {
    if (currentQuestion < QUIZ_QUESTIONS.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
      setSelectedAnswer(null);
      setShowResult(false);
    } else {
      setQuizCompleted(true);
    }
  };

  const handleRestart = () => {
    setCurrentQuestion(0);
    setSelectedAnswer(null);
    setShowResult(false);
    setScore(0);
    setQuizCompleted(false);
  };

  const goToNextChapter = () => {
    if (chapterNum < 11) {
      router.push(`/chapters/${chapterNum + 1}/introduction`);
    } else {
      router.push('/dashboard');
    }
  };

  return (
    <div className="min-h-screen bg-zinc-900 p-6 lg:p-10">
      <div className="max-w-2xl mx-auto">
        {!quizCompleted ? (
          <>
            <div className="text-center mb-8">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-purple-600/20 mb-4 border-2 border-purple-500/30">
                <span className="text-2xl">❓</span>
              </div>
              <h1 className="text-2xl font-bold text-white mb-2">
                Quiz - Chapitre {chapterNum}
              </h1>
              <p className="text-gray-400">
                Question {currentQuestion + 1} sur {QUIZ_QUESTIONS.length}
              </p>
              <div className="mt-4 p-3 bg-amber-500/10 border border-amber-500/30 rounded-lg">
                <p className="text-amber-400 text-sm">
                  🧪 <strong>Bac à sable</strong> : Ceci est une démo pour tester les fonctionnalités. 
                  Les questions ne sont pas cohérentes avec le contenu du chapitre.
                </p>
              </div>
            </div>

            <div className="mb-8">
              <div className="h-2 bg-gray-700 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-purple-500 rounded-full transition-all duration-300"
                  style={{ width: `${((currentQuestion + 1) / QUIZ_QUESTIONS.length) * 100}%` }}
                />
              </div>
            </div>

            <div className="bg-gray-800/50 rounded-2xl border border-gray-700 p-6 lg:p-8 mb-6">
              <h2 className="text-xl font-semibold text-white mb-6">
                {QUIZ_QUESTIONS[currentQuestion].question}
              </h2>

              <div className="space-y-3">
                {QUIZ_QUESTIONS[currentQuestion].options.map((option, index) => {
                  const isSelected = selectedAnswer === index;
                  const isCorrect = index === QUIZ_QUESTIONS[currentQuestion].correct;
                  
                  let bgClass = 'bg-gray-700/50 hover:bg-gray-700 border-gray-600';
                  if (showResult) {
                    if (isCorrect) {
                      bgClass = 'bg-green-600/20 border-green-500';
                    } else if (isSelected && !isCorrect) {
                      bgClass = 'bg-red-600/20 border-red-500';
                    }
                  } else if (isSelected) {
                    bgClass = 'bg-purple-600/20 border-purple-500';
                  }

                  return (
                    <button
                      key={index}
                      onClick={() => handleAnswerSelect(index)}
                      disabled={showResult}
                      className={`
                        w-full flex items-center gap-4 p-4 rounded-xl border-2 transition-all
                        ${bgClass}
                        ${showResult ? 'cursor-default' : 'cursor-pointer'}
                      `}
                    >
                      <span className={`
                        w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium
                        ${isSelected ? 'bg-purple-600 text-white' : 'bg-gray-600 text-gray-300'}
                      `}>
                        {String.fromCharCode(65 + index)}
                      </span>
                      <span className="text-gray-200 text-left flex-1">{option}</span>
                      {showResult && isCorrect && <span className="text-green-400">✓</span>}
                      {showResult && isSelected && !isCorrect && <span className="text-red-400">✗</span>}
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="flex justify-center gap-4">
              {!showResult ? (
                <button
                  onClick={handleSubmit}
                  disabled={selectedAnswer === null}
                  className="px-8 py-3 bg-purple-600 hover:bg-purple-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white rounded-lg font-medium transition-colors"
                >
                  Valider
                </button>
              ) : (
                <button
                  onClick={handleNext}
                  className="px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors flex items-center gap-2"
                >
                  {currentQuestion < QUIZ_QUESTIONS.length - 1 ? 'Question suivante →' : 'Voir le résultat →'}
                </button>
              )}
            </div>
          </>
        ) : (
          <div className="text-center">
            <div className={`
              inline-flex items-center justify-center w-24 h-24 rounded-full mb-6
              ${score >= 2 ? 'bg-green-600/20 border-2 border-green-500/30' : 'bg-yellow-600/20 border-2 border-yellow-500/30'}
            `}>
              <span className="text-5xl">{score >= 2 ? '🏆' : '📚'}</span>
            </div>

            <h1 className="text-3xl font-bold text-white mb-4">
              {score >= 2 ? 'Félicitations !' : 'Continuez vos efforts !'}
            </h1>

            <p className="text-xl text-gray-300 mb-2">
              Votre score : <span className="font-bold text-blue-400">{score}/{QUIZ_QUESTIONS.length}</span>
            </p>
            <p className="text-gray-400 mb-8">
              {score >= 2 
                ? 'Vous maîtrisez bien ce chapitre !' 
                : 'Revoyez le cours pour améliorer votre score.'}
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={handleRestart}
                className="flex items-center justify-center gap-2 px-6 py-3 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors"
              >
                🔄 Recommencer le quiz
              </button>
              <button
                onClick={goToNextChapter}
                className="flex items-center justify-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
              >
                {chapterNum < 11 ? 'Chapitre suivant →' : 'Terminer →'}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
