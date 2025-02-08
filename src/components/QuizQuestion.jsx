import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useDispatch, useSelector } from "react-redux";
import { submitAnswer, nextQuestion, addLive } from "../store/QuizSlice.js";
import Confetti from "react-confetti";
import { useNavigate } from "react-router-dom";

const QuizQuestion = () => {
  const dispatch = useDispatch();
  const { questions, currentQuestionIndex, loading, score, lives } = useSelector(
    (state) => state.quiz
  );

  const nav = useNavigate();

  const [lifeLoss, setLifeLoss] = useState(false);
  const [timer, setTimer] = useState(15); // 10-second timer
  const [timerRunning, setTimerRunning] = useState(true); // Track if timer is active
  const [bonusLife, setBonusLife] = useState(false); // Animation for bonus life
  const [selected, setSelected] = useState(null);
  const [showCelebration, setShowCelebration] = useState(false);
  const [confettiPieces, setConfettiPieces] = useState(150);
  const [isCorrect, setIsCorrect] = useState(null);
  const [showSolution, setShowSolution] = useState(false);
  const [backgroundGlow, setBackgroundGlow] = useState(false);
  const [cardShake, setCardShake] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [correctAnswer, setCorrectAnswer] = useState(null);

  useEffect(() => {
    const questionKey = `question-${currentQuestionIndex}`;
    const storedStartTime = localStorage.getItem(questionKey);
    const now = Date.now();
    let timeLeft = 10; // Default timer value
  
    if (storedStartTime) {
      const elapsedTime = Math.floor((now - parseInt(storedStartTime)) / 1000);
      timeLeft = Math.max(10 - elapsedTime, 0); // Prevent negative values
    } else {
      localStorage.setItem(questionKey, now); // Store time if not present
    }
  
    setTimer(timeLeft);
    setTimerRunning(true);
  
    if (timeLeft === 0) {
      setTimerRunning(false);
      return;
    }
  
    const countdown = setInterval(() => {
      setTimer((prev) => {
        if (prev <= 1) {
          clearInterval(countdown);
          setTimerRunning(false);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  
    return () => clearInterval(countdown);
  }, [currentQuestionIndex]); // Runs when a new question is loaded
   
  
  useEffect(() => {
    setTimeout(() => {
      if (lives <= 0) {
        nav('/failure'); // Ensure you have a failure page created
      }
    }, 800);
  }, [lives, nav]);

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

  if (currentQuestionIndex >= questions.length) {
    nav('/results');
    return;
  }
  

  const currentQuestion = questions[currentQuestionIndex];

  useEffect(() => {
    const storedData = localStorage.getItem(`submitted-${currentQuestionIndex}`);
  
    if (storedData) {
      try {
        const parsedData = JSON.parse(storedData);
        if (parsedData) {
          setSelected(currentQuestion.options[parsedData.selectedIndex]);
          setIsSubmitted(parsedData.submitted);
          setCorrectAnswer(parsedData.correctAnswer);
          setIsCorrect(currentQuestion.options[parsedData.selectedIndex]?.is_correct || false);
        }
      } catch (error) {
        console.error("Error parsing stored submission:", error);
      }
    } else {
      // Reset state if there's no stored submission
      setSelected(null);
      setIsSubmitted(false);
      setCorrectAnswer(null);
      setIsCorrect(null);
    }
  }, [currentQuestionIndex, questions]);   
  
  const handleSubmit = () => {
    if (selected !== null && !isSubmitted) {
      const isAnswerCorrect = selected.is_correct;
      dispatch(submitAnswer({ selectedAnswer: selected }));
  
      setIsCorrect(isAnswerCorrect);
      setIsSubmitted(true);
      setBackgroundGlow(true);
  
      if (isAnswerCorrect) {
        setShowCelebration(true);
        console.log(timerRunning)
        if (timerRunning == true) {
          dispatch(addLive()); // Increase life
          setBonusLife(true); // Trigger animation
          setTimeout(() => setBonusLife(false), 2000); // Reset animation
        }

      } else {
        setCardShake(true);
        setLifeLoss(true);
        setTimeout(() => setLifeLoss(false), 500);
      }
  
      setTimerRunning(false); 

      const correctOpt = currentQuestion.options.find((opt) => opt.is_correct);
      setCorrectAnswer(correctOpt);
  
      // Store submission in localStorage
      const selectedIndex = currentQuestion.options.findIndex(opt => opt.description === selected.description);
      localStorage.setItem(
        `submitted-${currentQuestionIndex}`,
        JSON.stringify({ selectedIndex, submitted: true, correctAnswer: correctOpt })
      );
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
    dispatch(nextQuestion());
  };

  const handleViewSolution = () => {
    setShowSolution((prev) => !prev);
  };

  const cleanText = (text) => text.replace(/\*/g, ''); 

  return (
    <div className={`relative flex items-center justify-center min-h-screen p-4 bg-sky-200`}>
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
          <div className="absolute top-4 right-8 flex items-center space-x-4">
            {/* Timer UI */}
            { !isSubmitted && timerRunning && (<motion.div 
              className={`px-4 py-2 rounded-md text-white font-semibold ${timerRunning ? "bg-blue-500" : "bg-gray-500"}`}
              animate={{ scale: timerRunning ? [1, 1.2, 1] : 1 }}
              transition={{ duration: 0.5, repeat: Infinity }}
            >
              ⏳ {timer}s
            </motion.div>)}

            {/* Bonus Life Animation */}
            {showCelebration && bonusLife && (
              <motion.div 
                className="bg-green-400 px-6 py-2 rounded text-sm font-medium text-white"
                animate={{ scale: [1, 1.3, 1], opacity: [1, 0.5, 1] }}
                transition={{ duration: 0.5 }}
              >
                +1 ❤️
              </motion.div>
            )}
          </div>

          <motion.div 
            className="absolute -top-4 left-8 bg-red-400 px-6 py-2 rounded text-sm font-medium text-white"
            animate={{ scale: lifeLoss ? [1, 1.2, 1] : 1, opacity: lifeLoss ? [1, 0.5, 1] : 1 }}
            transition={{ duration: 0.5 }}
          >
            ❤️ Lives: {lives}
          </motion.div>


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
                    ${ isSubmitted ? option.is_correct ? "border-green-500 bg-green-200 text-green-800" : "" : ""}`}
                  disabled={isSubmitted}
                >
                  {option.description}
                  {isSubmitted  && selected === option && isCorrect !== null && (
                    <motion.span initial={{ opacity: 0, scale: 0.5 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.3 }}>
                      {isCorrect ? "✔️" : "❌"}
                    </motion.span>
                  )}
                  {option.is_correct && isSubmitted && !isCorrect && <span className="ml-2">✔️</span>}
                </motion.button>
              ))}
            </div>
          </motion.div>

          {isCorrect === null ? (
            <motion.button onClick={handleSubmit} disabled={!selected} className="mx-auto block px-8 py-2 rounded-full bg-sky-200 text-sky-800">
              Submit
            </motion.button>
          ) : (
            <div className="flex justify-center gap-4 mt-6">
              <motion.button disabled={showCelebration} onClick={handleViewSolution} className="px-6 py-2 bg-gray-500 text-white rounded-lg">
                {showSolution ? "Hide Solution" : "View Solution"}
              </motion.button>
              <motion.button onClick={handleNextQuestion} className="px-6 py-2 bg-blue-500 text-white rounded-lg">
                Next Question
              </motion.button>
            </div>
          )}
          {showSolution && !showCelebration && <div className="mt-6 p-4 bg-gray-100 rounded-lg border border-gray-300">{cleanText(currentQuestion.solution)}</div>}
        </motion.div>
      </motion.div>
    </div>
  );
};

export default QuizQuestion;
