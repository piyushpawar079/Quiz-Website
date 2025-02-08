import { QuizQuestion, IntroCard, QuizResults } from "./components";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

function App() {
  
  return (
    <Router>
      <Routes>
      <Route path="/" element={<IntroCard />} />
      <Route path="/quiz" element={<QuizQuestion />} />
      <Route path="/results" element={<QuizResults />} />
      </Routes>
    </Router>
    
  );
}

export default App;
