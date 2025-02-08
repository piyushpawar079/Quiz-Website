import { QuizQuestion, IntroCard, QuizResults, FailureScreen } from "./components";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

function App() {
  
  return (
    <Router>
      <Routes>
      <Route path="/" element={<IntroCard />} />
      <Route path="/quiz" element={<QuizQuestion />} />
      <Route path="/results" element={<QuizResults />} />
      <Route path="/failure" element={<FailureScreen/>}/>
      </Routes>
    </Router>
    
  );
}

export default App;
