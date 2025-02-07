import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { option } from 'framer-motion/client';

// Async Thunk to fetch questions from API
export const fetchQuestions = createAsyncThunk(
  'quiz/fetchQuestions',
  async () => {
    const response = await fetch('/api/Uw5CrX'); // Replace with actual API URL
    const data = await response.json();
    const topic = data.topic
    const title = data.title
    return data.questions.map((item) => ({
      question: item.description,
      options: item.options,  
      solution: item.detailed_solution,
      content: item.reading_material.content_sections,
      practice: item.reading_material.practice_material,
      title: title,
      topic: topic
    }));
  }
);

const quizSlice = createSlice({
  name: 'quiz',
  initialState: {
    questions: [],
    currentQuestionIndex: 0,
    currentCorrectAnswer: '',
    isCorrect: null,
    score: 0,
    loading: false,
    error: null,
  },
  reducers: {
    submitAnswer: (state, action) => {
      const { selectedAnswer } = action.payload;     

      if (selectedAnswer.is_correct) {
        state.score += 4;
        state.isCorrect = true
      }
      else{
        state.score -= 1;
        state.isCorrect = false
      }
    },
    nextQuestion: (state) => {
      state.currentQuestionIndex += 1;
    },
    resetQuiz: (state) => {
      state.currentQuestionIndex = 0;
      state.score = 0;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchQuestions.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchQuestions.fulfilled, (state, action) => {
        state.loading = false;
        state.questions = action.payload;
      })
      .addCase(fetchQuestions.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  }
});

export const { submitAnswer, resetQuiz, nextQuestion } = quizSlice.actions;
export default quizSlice.reducer;
