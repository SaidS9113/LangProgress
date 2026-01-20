"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useUserProgress } from "@/hooks/useUserProgress";
import { useRouter } from "next/navigation";

type QuizQuestion = {
  question: string;
  choices: string[];
  correctAnswerIndex: number;
};

type QuizProps = {
  quiz: QuizQuestion[];
  chapterNumber?: number;
  onToggleQuizCompletion?: (chapterNumber: number) => void | Promise<void>;
};

const Quiz: React.FC<QuizProps> = ({ quiz, chapterNumber, onToggleQuizCompletion }) => {
  const [selectedAnswers, setSelectedAnswers] = useState<number[]>([]);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [submitted, setSubmitted] = useState(false);
  const [showRecap, setShowRecap] = useState(false);
  const { toggleQuizCompletion: defaultToggleQuizCompletion } = useUserProgress();
  const toggleQuizCompletion = onToggleQuizCompletion || defaultToggleQuizCompletion;
  const router = useRouter();

  const handleAnswerSelect = (answerIndex: number) => {
    const updatedAnswers = [...selectedAnswers];
    updatedAnswers[currentQuestion] = answerIndex;
    setSelectedAnswers(updatedAnswers);

    setTimeout(() => {
      if (currentQuestion < quiz.length - 1) {
        setCurrentQuestion(currentQuestion + 1);
      } else {
        setSubmitted(true);
        
        // Marquer le quiz comme complété si le score est suffisant
        const score = getScore();
        const percentage = Math.round((score / quiz.length) * 100);
        
        console.log(`🎯 [QUIZ] Quiz terminé - Score: ${score}/${quiz.length} (${percentage}%)`);
        console.log(`🎯 [QUIZ] Chapitre: ${chapterNumber}, Seuil: 75%`);
        
        if (percentage >= 75 && chapterNumber !== undefined) {
          console.log(`🏆 Quiz réussi (${percentage}%) - Marquage du chapitre ${chapterNumber} comme complété`);
          toggleQuizCompletion(chapterNumber);
        } else {
          console.log(`📊 [QUIZ] Quiz terminé avec ${percentage}% - Pas de marquage automatique (seuil non atteint)`);
        }
      }
    }, 400);
  };

  const getScore = () =>
    quiz.reduce(
      (score, question, index) =>
        selectedAnswers[index] === question.correctAnswerIndex ? score + 1 : score,
      0
    );

  const handleRestart = () => {
    setSelectedAnswers([]);
    setCurrentQuestion(0);
    setSubmitted(false);
    setShowRecap(false);
  };

  const handleManualComplete = () => {
    if (chapterNumber !== undefined) {
      console.log(`✅ [QUIZ] Marquage manuel du chapitre ${chapterNumber} comme complété`);
      toggleQuizCompletion(chapterNumber);
    }
  };

  const score = getScore();
  const percentage = Math.round((score / quiz.length) * 100);
  const isSuccess = percentage >= 75;
  const hasErrors = selectedAnswers.some(
    (answer, index) => answer !== quiz[index].correctAnswerIndex
  );

  return (
    <div className="w-full space-y-8">
      <motion.h1
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-3xl font-bold text-center text-white mb-8"
      >
        Test de connaissances
      </motion.h1>

      {!submitted ? (
        <AnimatePresence mode="wait">
          <motion.div
            key={currentQuestion}
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            transition={{ duration: 0.4 }}
            className="p-6 bg-gray-700/50 border border-white/10 rounded-2xl shadow-lg backdrop-blur-sm"
          >
            <h2 className="text-lg sm:text-xl font-semibold text-gray-200 mb-4">
              Question {currentQuestion + 1} sur {quiz.length}
            </h2>
            <p className="text-base sm:text-lg font-medium text-white mb-6 leading-relaxed">
              {quiz[currentQuestion].question}
            </p>

            <div className="space-y-4">
              {quiz[currentQuestion].choices.map((choice, index) => {
                const isSelected = selectedAnswers[currentQuestion] === index;

                return (
                  <button
                    key={index}
                    onClick={() => handleAnswerSelect(index)}
                    className={`w-full text-left px-4 py-3 rounded-lg border transition-all font-medium duration-300 ${
                      isSelected
                        ? "bg-amber-600 border-amber-400 text-white shadow-lg"
                        : "bg-gray-600/50 border-gray-500 text-gray-100 hover:bg-gray-600 hover:border-gray-400"
                    }`}
                  >
                    {choice}
                  </button>
                );
              })}
            </div>
          </motion.div>
        </AnimatePresence>
      ) : (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className={`text-center p-8 border rounded-2xl shadow-2xl backdrop-blur-sm ${
            isSuccess
              ? "bg-emerald-900/30 border-emerald-500/30"
              : "bg-orange-900/30 border-orange-500/30"
          }`}
        >
          <p
            className={`text-2xl sm:text-3xl font-semibold mb-4 ${
              isSuccess ? "text-emerald-300" : "text-orange-300"
            }`}
          >
            {isSuccess
              ? "🎉 Excellent travail !"
              : "📚 Continue tes efforts !"}
          </p>

          <p className="text-xl sm:text-2xl text-white font-medium mb-6">
            Score : {score} / {quiz.length} ({percentage}%)
          </p>

          {!isSuccess && (
            <p className="text-base text-gray-300 mb-6 max-w-md mx-auto leading-relaxed">
              Ce n'est pas grave, continue à t'entraîner pour progresser !
            </p>
          )}

          <div className="flex flex-wrap justify-center gap-4 mt-6">
            {/* Bouton de marquage manuel si le score n'est pas suffisant */}
            {!isSuccess && chapterNumber !== undefined && (
              <motion.button
                whileTap={{ scale: 0.95 }}
                onClick={handleManualComplete}
                className="px-6 py-3 bg-blue-600/80 text-white rounded-xl font-semibold hover:bg-blue-700/80 transition-all border border-blue-500/30"
              >
                Marquer comme complété
              </motion.button>
            )}
            
            {hasErrors && (
              <motion.button
                whileTap={{ scale: 0.95 }}
                onClick={() => setShowRecap(!showRecap)}
                className="px-6 py-3 bg-rose-600/80 text-white rounded-xl font-semibold hover:bg-rose-700/80 transition-all border border-rose-500/30"
              >
                {showRecap ? "Masquer les erreurs" : "Voir les erreurs"}
              </motion.button>
            )}

            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={handleRestart}
              className="px-6 py-3 bg-amber-600/80 text-white rounded-xl font-semibold hover:bg-amber-700/80 transition-all border border-amber-500/30"
            >
              Recommencer le quiz
            </motion.button>
          </div>

          {showRecap && (
            <div className="mt-8 text-left space-y-4">
              <h3 className="text-xl font-semibold text-white mb-4 text-center">Récapitulatif :</h3>
              {quiz.map((question, index) => {
                const userAnswer = selectedAnswers[index];
                const isCorrect = userAnswer === question.correctAnswerIndex;
                return (
                  <div
                    key={index}
                    className={`p-4 rounded-lg border backdrop-blur-sm ${
                      isCorrect
                        ? "border-emerald-500/50 bg-emerald-900/20"
                        : "border-rose-500/50 bg-rose-900/20"
                    }`}
                  >
                    <p className="text-white font-medium mb-2">
                      <span className="font-semibold">Question {index + 1} :</span>{" "}
                      {question.question}
                    </p>
                    <p
                      className={`${
                        isCorrect ? "text-emerald-300" : "text-rose-300"
                      } font-semibold mb-1`}
                    >
                      Ta réponse : {question.choices[userAnswer] || "Aucune réponse"}
                    </p>
                    {!isCorrect && (
                      <p className="text-emerald-300 font-medium">
                        Bonne réponse : {question.choices[question.correctAnswerIndex]}
                      </p>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </motion.div>
      )}
    </div>
  );
};

export default Quiz;