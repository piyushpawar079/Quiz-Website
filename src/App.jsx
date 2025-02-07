import { useState, useEffect } from "react";
import { QuizQuestion, IntroCard } from "./components";
import  store  from "./store/store.js";
import { Provider } from 'react-redux';


function App() {
  const [start, setStart] = useState(false);
  
  return (
    <Provider store={store}>
      {!start ? <IntroCard startQuiz={() => setStart(true)} /> : <QuizQuestion />}
    </Provider>
    // <Provider store={store}>
    //   <QuizGame />
    // </Provider>
  );
}

export default App;
