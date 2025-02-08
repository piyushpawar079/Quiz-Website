import React from "react";
import { useDispatch } from "react-redux";
import { resetQuiz } from "../store/QuizSlice";
import { useNavigate } from "react-router-dom";

const FailureScreen = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleRestart = () => {
    dispatch(resetQuiz());
    navigate("/");
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-red-200">
      <h1 className="text-4xl font-bold text-red-700">You ran out of lives! 💀</h1>
      <p className="text-lg mt-4">Better luck next time!</p>
      <button 
        onClick={handleRestart} 
        className="mt-6 px-6 py-2 bg-blue-500 text-white rounded-lg"
      >
        Restart Quiz
      </button>
    </div>
  );
};

export default FailureScreen;
