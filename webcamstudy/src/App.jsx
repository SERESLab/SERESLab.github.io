import React, { useState, useEffect } from 'react';
import './App.css';

// Import task components
import ConsentForm from './components/ConsentForm';
import TextTask from './components/TextTask';
import VideoTask from './components/VideoTask';
import FaceTask from './components/FaceTask';

function App() {
  const [currentTask, setCurrentTask] = useState(0);
  const [taskFiles, setTaskFiles] = useState([]);
  const [clickCount, setClickCount] = useState(0);
  const [buttonVisible, setButtonVisible] = useState(true);

  useEffect(() => {
    generateTaskSequence();
  }, []);

  const generateTaskSequence = () => {
    const tasks = [
      'ConsentForm',
      'TextTask',
      'VideoTask',
      'FaceTask',
    ];
    setTaskFiles(tasks);
  };

  const incrementTask = () => {
    setClickCount((prev) => prev + 1);
    setCurrentTask((prev) => prev + 1);
    setButtonVisible(false);

    let delay = 0;
    if (clickCount === 0) {
      delay = 15000; // 15 seconds
    } else if (clickCount === 1) {
      delay = 20000; // 20 seconds
    } else {
      delay = 150000; // 2 min 30 seconds
    }

    setTimeout(() => {
      setButtonVisible(true);
    }, delay);
  };

  const renderCurrentTask = () => {
    if (currentTask >= taskFiles.length) {
      return <div>All tasks completed!</div>;
    }

    const taskName = taskFiles[currentTask];

    switch (taskName) {
      case 'ConsentForm':
        return <ConsentForm />;
      case 'TextTask':
        return <TextTask />;
      case 'VideoTask':
        return <VideoTask />;
      case 'FaceTask':
        return <FaceTask />;
      default:
        return <div>Unknown task</div>;
    }
  };

  const isTaskComplete = currentTask >= taskFiles.length;

  return (
    <div id="app">
      <div className="task-container">
        {renderCurrentTask()}
      </div>
      <div className="button-container">
        {!isTaskComplete && buttonVisible && (
          <button 
            id="nextTaskButton" 
            className="button"
            onClick={incrementTask}
          >
            Next Task
          </button>
        )}
      </div>
    </div>
  );
}

export default App;
