import React, { useEffect } from 'react';
import Background from './components/Ground';
import Beanstalk from './components/Beanstalk';
import Clouds from './components/Clouds';
import './App.css';
import OrientationWarning from './components/warningvertical/OrientationWarning';
import Plant from './components/Plan';
function App() {
  useEffect(() => {
    setTimeout(() => {
      window.scrollTo({
        top: document.body.scrollHeight,
        behavior: 'instant',
      });
    }, 0);
  }, []);

  return (
    <>
  
    <div className="rotate-container">
      <OrientationWarning />

      <Background />
      {/* <Beanstalk /> */}
        <Plant />
      {/* <Clouds /> */}
   
    </div>
  </>
  );
}

export default App;
