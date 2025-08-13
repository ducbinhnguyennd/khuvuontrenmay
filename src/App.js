import React, { useEffect } from "react";
import Background from "./components/Ground";
import Beanstalk from "./components/Beanstalk";
import Clouds from "./components/Clouds";
import "./App.css";
import OrientationWarning from "./components/warningvertical/OrientationWarning";
import Plant from "./components/Plan";
import LoginTele from "./page/tele/LoginTele/Logintele";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import PrivateRoute from "./router/PrivateRoute";
import Hometele from "./page/tele/HomeTele/HomeTele";
import RegisterTele from "./page/tele/RegisterTele/RegisterTele";
import QuestionList from "./page/tele/Question/Question";
import Friends from "./page/tele/Friends/Friends";
function App() {
  useEffect(() => {
    setTimeout(() => {
      window.scrollTo({
        top: document.body.scrollHeight,
        behavior: "instant",
      });
    }, 0);
  }, []);

  return (
    <>
      <Router>
      <Routes>
        <Route path="/login" element={<LoginTele />} />
        <Route path="/register" element={<RegisterTele />} />
        <Route path="/questions" element={<QuestionList />} />
        <Route path="/friends" element={<Friends/>} />
        <Route
          path="/"
          element={
            <PrivateRoute>
              <Hometele />
            </PrivateRoute>
          }
        />
      </Routes>
    </Router>
    </>
  );
}

export default App;
