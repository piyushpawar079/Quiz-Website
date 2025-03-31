import { configureStore } from '@reduxjs/toolkit';
import quizReducer from './QuizSlice.js';

const store = configureStore({
  reducer: {
    quiz: quizReducer,
  },
});

export default store;
