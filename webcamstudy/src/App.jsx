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
  
  useEffect(() => {
    // Initialize RealEye SDK in the document head
    const initializeSDK = async () => {
      try {
        // Create and add the script to head
        const script = document.createElement('script');
        script.type = 'module';
        script.innerHTML = `
          import EmbeddedPageSdk from "https://app.realeye.io/sdk/js/testRunnerEmbeddableSdk-1.7.1.js";
          
          window.addEventListener("DOMContentLoaded", () => {
            const debugMode = false;
            const stimulusId = null;
            const forceRun = false;
            
            const reSdk = new EmbeddedPageSdk(debugMode, stimulusId, forceRun);
          });
        `;
        document.head.appendChild(script);
      } catch (error) {
        console.error('Failed to load RealEye SDK:', error);
      }
    };

    initializeSDK();
    generateTaskSequence();
  }, []);

  const generateTaskSequence = () => {
    // Randomly shuffle tasks (same logic as original)
    const tasks = [
      'ConsentForm',
      'TextTask',
      'VideoTask',
      'FaceTask',
    ];

    setTaskFiles(tasks);
  };

  const incrementTask = () => {
    setCurrentTask(prev => prev + 1);
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
        {!isTaskComplete && (
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