import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { motion } from 'framer-motion';
import { fetchQuestions, resetQuiz } from '../store/QuizSlice.js';
import { useNavigate } from 'react-router-dom';

const IntroCard = () => {
  const dispatch = useDispatch();
  const nav = useNavigate();
  const { title, topic, loading } = useSelector((state) => state.quiz);

  useEffect(() => {
    const storedTitle = localStorage.getItem('quizTitle');
    const storedTopic = localStorage.getItem('quizTopic');

    if (!(storedTitle && storedTopic)) {
      dispatch(fetchQuestions());
    }
  }, [dispatch]);

  useEffect(() => {
    if (title && topic) {
      localStorage.setItem('quizTitle', title);
      localStorage.setItem('quizTopic', topic);
    }
  }, [title, topic]);

  const handleStartQuiz = () => {
    localStorage.clear();
    dispatch(resetQuiz());
    nav('/quiz');
  };

  if (loading) {
    return <div className="flex items-center justify-center min-h-screen text-xl font-semibold">Loading...</div>;
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-sky-200 p-4">
      <div className="relative w-[90%] md:w-[70%] max-w-4xl">
        {/* Larger Stars */}
        <motion.div
          animate={{ scale: 1, rotate: [0, 10, -10, 0] }}
          transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute -left-24 -top-24 w-40 h-40 bg-yellow-400 rotate-12"
          style={{
            clipPath: 'polygon(50% 0%, 61% 35%, 98% 35%, 68% 57%, 79% 91%, 50% 70%, 21% 91%, 32% 57%, 2% 35%, 39% 35%)',
          }}
        />

        <motion.div
          animate={{ rotate: [0, 15, -15, 0], scale: [1, 1.1, 1] }}
          transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute -right-28 -top-16 w-40 h-40 bg-yellow-400 shadow-lg"
          style={{
            clipPath:
              'polygon(50% 0%, 60% 20%, 80% 20%, 65% 40%, 75% 60%, 50% 50%, 25% 60%, 35% 40%, 20% 20%, 40% 20%)',
          }}
        />

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="relative bg-white p-12 rounded-lg shadow-2xl border-4 border-gray-300"
          style={{ borderLeft: '12px solid rgb(250, 204, 21)', borderBottom: '12px solid rgb(250, 204, 21)' }}
        >
          <motion.div
            animate={{opacity: 1, y: [0, -10, 0] }}
            transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
            className="absolute -top-4 left-1/2 transform -translate-x-1/2 bg-yellow-400 px-8 py-2 rounded-lg text-lg font-semibold shadow-md"
          >
            QUIZ
          </motion.div>

          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5, duration: 0.5 }} className="mt-6 text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-6 text-purple-700">{title}</h1>
            <p className="text-gray-600 text-lg mb-8 font-medium">
              A Quiz on <span className="font-semibold text-blue-700">{topic}</span>
            </p>
          </motion.div>

          {/* Animated Curved Line on the Left */}
          <motion.div
            animate={{ scale: 1, x: [0, -10, 0], y: [0, -10, 10, 0] }}
            transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
            className="absolute -left-12 bottom-12 w-36 h-10 border-l-[8px] border-b-[8px] border-pink-400 rounded-bl-full rotate-[-10deg]"
          />

          {/* Centered Start Button */}
          <motion.button
            animate={{ scale: 1,  y: [0, -10, 10, 0]}}
            transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            className="mx-auto mt-8 block bg-pink-500 text-white px-6 py-3 rounded-lg text-lg font-semibold shadow-md hover:bg-pink-600 transition-all"
            onClick={handleStartQuiz}
          >
            Start Quiz
          </motion.button>
        </motion.div>
      </div>
    </div>
  );
};

export default IntroCard;
