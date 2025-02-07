import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { motion } from 'framer-motion';
import {fetchQuestions} from '../store/QuizSlice.js'

const IntroCard = ({ startQuiz }) => {
  // Animation variants for floating effect
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchQuestions());
  },[]);

  const floatingAnimation = {
    animate: {
      y: [0, -10, 0],
      transition: {
        duration: 3,
        repeat: Infinity,
        ease: "easeInOut"
      }
    }
  };

  const rotatingAnimation = {
    animate: {
      rotate: [0, 10, -10, 0],
      transition: {
        duration: 5,
        repeat: Infinity,
        ease: "easeInOut"
      }
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-sky-200 p-4">
      <div className="relative w-[90%] md:w-[70%] max-w-4xl">
        {/* Star decorations */}
        <motion.div
          // initial={{ scale: 0 }}
          animate={{ scale: 1, ...rotatingAnimation.animate }}
          className="absolute -left-10 -top-12 w-24 h-24 bg-pink-400 rotate-12"
          style={{ clipPath: 'polygon(50% 0%, 61% 35%, 98% 35%, 68% 57%, 79% 91%, 50% 70%, 21% 91%, 32% 57%, 2% 35%, 39% 35%)' }}
        />
        <motion.div
          // initial={{ scale: 0 }}
          animate={{ scale: 1, ...rotatingAnimation.animate }}
          className="absolute -right-8 -top-8 w-24 h-24 bg-pink-400 -rotate-12"
          style={{ clipPath: 'polygon(50% 0%, 61% 35%, 98% 35%, 68% 57%, 79% 91%, 50% 70%, 21% 91%, 32% 57%, 2% 35%, 39% 35%)' }}
        />
        
        {/* Main card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="relative bg-white p-12 rounded-lg border-2 border-gray-300"
          style={{ 
            // boxShadow: '8px 8px 0px rgba(250, 204, 21, 0.5)',
            borderLeft: '10px solid rgb(250, 204, 21)',
            borderBottom: '10px solid rgb(250, 204, 21)',
          }}
        >
          {/* Quiz label */}
          <motion.div
            // initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1, ...floatingAnimation.animate }}
            className="absolute -top-4 left-1/2 transform -translate-x-1/2 bg-yellow-300 px-8 py-2 rounded text-base font-medium"
            style={{ border: '1px solid rgba(0,0,0,0.1)' }}
          >
            QUIZ
          </motion.div>

          {/* Content */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5, duration: 0.5 }}
            className="mt-6 text-center"
          >
            <h1 className="text-4xl md:text-5xl font-medium mb-6" style={{ fontFamily: 'Comic Sans MS, cursive' }}>
              Animated Sketch
            </h1>
            <p className="text-gray-600 text-lg mb-8">
              I am a cool subtitle, perfect for providing more context about the topic you are going to discuss.
            </p>
          </motion.div>

          {/* Curved arrow decoration */}
          <motion.div
            // initial={{ scale: 0 }}
            animate={{ scale: 1, ...floatingAnimation.animate }}
            className="absolute -left-12 bottom-8 w-16 h-32 border-l-8 border-b-8 rounded-bl-full border-pink-400"
          />

          {/* Arrow button */}
          <motion.div
            // initial={{ scale: 0 }}
            animate={{ scale: 1, ...floatingAnimation.animate }}
            whileHover={{ scale: 1.2 }}
            whileTap={{ scale: 0.9 }}
            className="absolute -right-6 bottom-8 w-12 h-12 bg-pink-400 rounded-full flex items-center justify-center cursor-pointer"
            onClick={startQuiz}
          >
            <span className="text-white font-bold text-xl">→</span>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
};

export default IntroCard;