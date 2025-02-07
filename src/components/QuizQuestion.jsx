import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useDispatch, useSelector } from "react-redux";
import { fetchQuestions, submitAnswer, nextQuestion } from "../store/QuizSlice.js";
import Confetti from "react-confetti";

const QuizQuestion = () => {
  const dispatch = useDispatch();
  const { questions, currentQuestionIndex, loading, score } = useSelector(
    (state) => state.quiz
  );

  const [selected, setSelected] = useState(null);
  const [showCelebration, setShowCelebration] = useState(false);
  const [confettiPieces, setConfettiPieces] = useState(150);
  const [isCorrect, setIsCorrect] = useState(null);
  const [showSolution, setShowSolution] = useState(false);
  const [showMaterial, setShowMaterial] = useState(false);
  const [backgroundGlow, setBackgroundGlow] = useState(false);
  const [cardShake, setCardShake] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [correctAnswer, setCorrectAnswer] = useState(null); 

  useEffect(() => {
    let fadeOutInterval;
    if (showCelebration) {
      setConfettiPieces(150);
      setBackgroundGlow(true);

      setTimeout(() => {
        fadeOutInterval = setInterval(() => {
          setConfettiPieces((prev) => {
            if (prev <= 0) {
              clearInterval(fadeOutInterval);
              setShowCelebration(false);
              return 0;
            }
            return prev - 150;
          });
        }, 2000);
      }, 1000);
    }

    return () => clearInterval(fadeOutInterval);
  }, [showCelebration]);

  if (loading) {
    return <div className="flex items-center justify-center min-h-screen bg-sky-200 text-2xl">Loading...</div>;
  }

  if (questions.length === 0) {
    return <div className="flex items-center justify-center min-h-screen bg-sky-200 text-2xl">No questions available</div>;
  }

  const currentQuestion = questions[currentQuestionIndex];
  console.log(currentQuestion.content)

  const handleSubmit = () => {
    if (selected !== null && !isSubmitted) {
      const isAnswerCorrect = selected.is_correct;
      dispatch(submitAnswer({ selectedAnswer: selected }));

      setIsCorrect(isAnswerCorrect);
      setIsSubmitted(true);
      setBackgroundGlow(true);

      if (isAnswerCorrect) {
        setShowCelebration(true);
      } else {
        setCardShake(true);
      }

      // Find and store the correct answer
      const correctOpt = currentQuestion.options.find((opt) => opt.is_correct);
      setCorrectAnswer(correctOpt);
    }
  };

  const handleNextQuestion = () => {
    setIsCorrect(null);
    setShowCelebration(false);
    setShowSolution(false);
    setSelected(null);
    setBackgroundGlow(false);
    setCardShake(false);
    setIsSubmitted(false);
    setCorrectAnswer(null);
    setShowMaterial(false)
    dispatch(nextQuestion());
  };

  const handleViewSolution = () => {
    setShowSolution(true);
    setShowMaterial(false)
  };

  const handleViewMaterial = () => {
    setShowMaterial(true)
    setShowSolution(false)
  };

  return (
    <div className={`relative flex items-center justify-center min-h-screen  p-4 bg-sky-200`}>
      {showCelebration && <Confetti numberOfPieces={confettiPieces} gravity={0.3} />}

      <motion.div
        className={`relative w-[90%] m-16 md:w-[70%] max-w-4xl ${backgroundGlow ? "bg-yellow-200" : ""}`}
        animate={showCelebration ? { rotate: [0, -5, 5, -5, 0] } : {}}
        transition={{ duration: 0.5 }}
      >
        <motion.div
          className={`relative bg-white p-12 rounded-lg transition-all 
            ${backgroundGlow ? "shadow-2xl border-yellow-500" : "shadow-lg"}`}
          style={{
            boxShadow: showCelebration
              ? "0px 0px 50px rgba(255, 215, 0, 0.8)"
              : isCorrect === false
              ? "0px 0px 20px rgba(255, 0, 0, 0.8)"
              : "0px 0px 20px rgba(250, 204, 21, 0.5)",
          }}
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{
            opacity: 1,
            scale: showCelebration ? [1, 1.1, 1] : 1,
            x: cardShake ? [0, -60, 60, -60, 0] : 0,
          }}
          transition={{ duration: 0.3 }}
        >
          <motion.div className="absolute -top-4 right-8 bg-yellow-300 px-6 py-2 rounded text-sm font-medium">
            QUESTION {currentQuestionIndex + 1}/{questions.length} | Score: {score}
          </motion.div>

          {showCelebration && (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: [0, 1.2, 1] }}
              transition={{ duration: 0.5 }}
              className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-6xl font-bold text-yellow-600"
            >
              🎉 Correct! 🎉
            </motion.div>
          )}

          <motion.div className="mt-6 text-center mb-8">
            <h2 className="text-2xl font-medium mb-8" style={{ fontFamily: "Comic Sans MS, cursive" }}>
              {currentQuestion.question}
            </h2>

            <div className="grid gap-4">
              {currentQuestion.options.map((option, index) => (
                <motion.button
                  key={index}
                  onClick={() => !isSubmitted && setSelected(option)}
                  className={`w-full p-4 text-left rounded-lg border-2 flex items-center justify-between transition-colors 
                    ${
                      selected === option
                        ? isCorrect === true
                          ? "bg-green-200 border-green-500 text-green-800"
                          : isCorrect === false
                          ? "bg-red-100 border-red-500 text-red-800"
                          : "bg-pink-100 border-pink-300 text-pink-700"
                        : " border-gray-200 hover:border-pink-300"
                    }
                    ${option === correctAnswer ? "border-green-500 bg-green-200 text-green-800" : ""}`}
                  disabled={isSubmitted}
                >
                  {option.description}
                  {selected === option && isCorrect !== null && (
                    <motion.span initial={{ opacity: 0, scale: 0.5 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.3 }}>
                      {isCorrect ? "" : "❌"}
                    </motion.span>
                  )}
                  {option === correctAnswer && isSubmitted && <span className="ml-2">✔️</span>}
                </motion.button>
              ))}
            </div>
          </motion.div>

          {isCorrect === null ? (
            <motion.button
              onClick={handleSubmit}
              disabled={!selected}
              className={`mx-auto block px-8 py-2 rounded-full text-sm font-medium transition-all
                ${selected ? "bg-sky-200 text-sky-800 cursor-pointer" : "bg-gray-100 text-gray-400 cursor-not-allowed"}`}
            >
              Submit
            </motion.button>
          ) : (
            <div className="flex justify-center gap-4 mt-6">
              <motion.button onClick={handleViewSolution} className="px-6 py-2 bg-gray-500 text-white rounded-lg shadow-md hover:bg-gray-600">
                View Solution
              </motion.button>
              <motion.button onClick={handleViewMaterial} className="px-6 py-2 bg-gray-500 text-white rounded-lg shadow-md hover:bg-gray-600">
                View Reading Material
              </motion.button>
              <motion.button onClick={handleNextQuestion} className="px-6 py-2 bg-blue-500 text-white rounded-lg shadow-md hover:bg-blue-600">
                Next Question
              </motion.button>
            </div>
          )}

          {showSolution && <div className="mt-6 p-4 bg-gray-100 rounded-lg border border-gray-300">{currentQuestion.solution}</div>}
          {showMaterial && (
            <div className="mt-6 p-4 bg-gray-100 rounded-lg border border-gray-300">
              {currentQuestion.content.map((htmlString, index) => {
                const parser = new DOMParser();
                const doc = parser.parseFromString(htmlString, "text/html");
                return <p key={index}>{doc.body.textContent}</p>;
              })}
            </div>
          )}

        </motion.div>
      </motion.div>
    </div>
  );
};

export default QuizQuestion;
