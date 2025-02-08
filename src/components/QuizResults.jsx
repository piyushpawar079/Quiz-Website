import React, { useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { FiChevronDown, FiChevronUp } from "react-icons/fi";

const QuizResults = () => {
  const { questions, userAnswers, score } = useSelector((state) => state.quiz);
  const navigate = useNavigate();
  const [openDetails, setOpenDetails] = useState({});
  const [expandedSections, setExpandedSections] = useState({});

  const toggleDetails = (index) => {
    setOpenDetails((prev) => ({ ...prev, [index]: !prev[index] }));
  };

  const toggleSection = (index, section) => {
    setExpandedSections((prev) => ({
      ...prev,
      [index]: { ...prev[index], [section]: !prev[index]?.[section] },
    }));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-500 to-yellow-200 flex flex-col items-center p-6 text-white">
      {/* Score Section */}
      <div className="bg-white text-indigo-700 shadow-lg rounded-xl p-6 mb-6 text-center w-full max-w-xl">
        <h1 className="text-4xl font-bold">Quiz Results</h1>
        <p className="text-2xl font-semibold mt-2">Final Score: <span className="text-indigo-900">{score}</span></p>
      </div>

      {/* Questions & Answers */}
      <div className="w-full max-w-4xl bg-white text-black p-6 rounded-lg shadow-lg">
        {questions.map((question, index) => {
          const userAnswer = userAnswers[index];
          const correctOption = question.options.find((opt) => opt.is_correct);
          const isOpen = openDetails[index];

          return (
            <div key={index} className="mb-6 p-4 border-b border-gray-300">
              {/* Question & Toggle Button */}
              <div className="flex justify-between items-center w-full">
                <h3 className="text-lg font-semibold flex-1 pr-4">
                  {index + 1}. {question.question}
                </h3>
                <button
                  className="px-4 py-1 bg-indigo-500 text-white rounded-lg shadow-md hover:bg-indigo-600 flex items-center gap-2"
                  onClick={() => toggleDetails(index)}
                >
                  {isOpen ? "Close" : "View Details"}
                  {isOpen ? <FiChevronUp /> : <FiChevronDown />}
                </button>
              </div>

              {/* Display Answers Always */}
              <div className="mt-3 p-3 bg-gray-100 rounded-lg">
                <p className="text-md">
                  <strong>Your Answer:</strong>{" "}
                  <span
                    className={`px-2 py-1 rounded-md ${
                      userAnswer?.is_correct ? "bg-green-200 text-green-700" : "bg-red-200 text-red-700"
                    }`}
                  >
                    {userAnswer?.description || "Not Answered"}
                  </span>
                </p>
                <p className="text-md mt-1">
                  <strong>Correct Answer:</strong>{" "}
                  <span className="px-2 py-1 bg-green-200 text-green-700 rounded-md">
                    {correctOption.description}
                  </span>
                </p>
              </div>

              {/* Expandable Details */}
              {isOpen && (
                <div className="mt-4 bg-gray-50 p-4 rounded-lg shadow-inner">
                  {/* Toggle Solution */}
                  <button
                    className="w-full px-4 py-2 bg-gray-300 rounded-md hover:bg-gray-400 text-black font-semibold flex justify-between items-center"
                    onClick={() => toggleSection(index, "solution")}
                  >
                    {expandedSections[index]?.solution ? "Hide Solution" : "View Solution"}
                    {expandedSections[index]?.solution ? <FiChevronUp /> : <FiChevronDown />}
                  </button>
                  {expandedSections[index]?.solution && (
                    <p className="mt-3 text-gray-800 p-3 bg-gray-200 rounded-md">{question.solution}</p>
                  )}

                  {/* Toggle Reading Material */}
                  <button
                    className="w-full mt-2 px-4 py-2 bg-gray-300 rounded-md hover:bg-gray-400 text-black font-semibold flex justify-between items-center"
                    onClick={() => toggleSection(index, "reading")}
                  >
                    {expandedSections[index]?.reading ? "Hide Reading Material" : "View Reading Material"}
                    {expandedSections[index]?.reading ? <FiChevronUp /> : <FiChevronDown />}
                  </button>
                  {expandedSections[index]?.reading && (
                    <div className="mt-3 text-gray-800 p-3 bg-gray-200 rounded-md">
                      {question.content.map((htmlString, idx) => {
                        const parser = new DOMParser();
                        const doc = parser.parseFromString(htmlString, "text/html");
                        return <p key={idx}>{doc.body.textContent}</p>;
                      })}
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Navigation Buttons */}
      <div className="mt-6 flex gap-4">
        <button
          className="px-6 py-2 bg-indigo-500 text-white rounded-lg shadow-md hover:bg-indigo-600"
          onClick={() => navigate("/")}
        >
          Home
        </button>
      </div>
    </div>
  );
};

export default QuizResults;
