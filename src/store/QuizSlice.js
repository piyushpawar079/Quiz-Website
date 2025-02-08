import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

// Function to load state from localStorage
const loadState = () => {
  try {
    const serializedState = localStorage.getItem('quizState');
    return serializedState ? JSON.parse(serializedState) : undefined;
  } catch (error) {
    console.error('Failed to load state:', error);
    return undefined;
  }
};

// Function to save state to localStorage
const saveState = (state) => {
  try {
    localStorage.setItem('quizState', JSON.stringify(state));
  } catch (error) {
    console.error('Failed to save state:', error);
  }
};

// Async Thunk to fetch questions from API
export const fetchQuestions = createAsyncThunk(
  'quiz/fetchQuestions',
  async () => {
    const response = await fetch('/api/Uw5CrX'); // Replace with actual API URL
    const data = await response.json();
    const topic = data.topic;
    const title = data.title;
    return data.questions.map((item) => ({
      question: item.description,
      options: item.options,
      solution: item.detailed_solution,
      content: item.reading_material.content_sections,
      practice: item.reading_material.practice_material,
      title: title,
      topic: topic,
    }));
  }
);

const persistedState = loadState();

const quizSlice = createSlice({
  name: 'quiz',
  initialState: persistedState || {
    questions: [],
    currentQuestionIndex: 0,
    userAnswers: [],
    isCorrect: null,
    title: null,
    topic: null,
    score: 0,
    loading: false,
    error: null,
    lives: 3,
  },
  reducers: {
    submitAnswer: (state, action) => {
      const { selectedAnswer } = action.payload;
      state.userAnswers[state.currentQuestionIndex] = selectedAnswer;
      
      if (selectedAnswer.is_correct) {
        state.score += 4;
        state.isCorrect = true;
      } else {
        state.score -= 1;
        state.lives -= 1;
        state.isCorrect = false;
      }
      saveState(state); // Save updated state to localStorage
    },
    setCurrentQuestionIndex: (state, action) => {
      state.currentQuestionIndex = action.payload;
      saveState(state);
    },
    nextQuestion: (state) => {
      state.currentQuestionIndex += 1;
      saveState(state);
    },
    addLive: (state) => {
      state.lives += 1;
      saveState(state);
    },
    resetQuiz: (state) => {
      state.currentQuestionIndex = 0;
      state.score = 0;
      state.userAnswers = [];
      state.isCorrect = null;
      state.lives = 3;
      saveState(state);
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchQuestions.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchQuestions.fulfilled, (state, action) => {
        state.topic = action.payload[0]?.topic || null;
        state.title = action.payload[0]?.title || null;
        state.questions = action.payload;
        state.loading = false;
        saveState(state);
      })
      .addCase(fetchQuestions.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  },
});

export const { submitAnswer, resetQuiz, nextQuestion, setCurrentQuestionIndex, addLive } = quizSlice.actions;
export default quizSlice.reducer;
