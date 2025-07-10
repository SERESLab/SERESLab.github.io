import React, { useState, useEffect, useCallback } from 'react';
import './App.css';

// Import task components
import ConsentForm from './components/ConsentForm';
import TextTask from './components/TextTask';
import TextSurvey from './components/TextSurvey';
import VideoTask from './components/VideoTask';
import VideoSurvey from './components/VideoSurvey';
import FaceTask from './components/FaceTask';

function App() {
  const [currentTask, setCurrentTask] = useState(0);
  const [taskFiles, setTaskFiles] = useState([]);
  const [studyData, setStudyData] = useState({
    consent: null,
    textTask: null,
    videoTask: null,
    faceTask: null
  });

  useEffect(() => {
    generateTaskSequence();
  }, []);

  const generateTaskSequence = () => {
    const tasks = [
      'ConsentForm',
      'TextTask',
      'TextSurvey',
      'VideoTask',
      'VideoSurvey',
      'FaceTask',
    ];
    setTaskFiles(tasks);
  };

  const handleTaskComplete = (taskType, data) => {
    setStudyData(prev => ({
      ...prev,
      [taskType]: data
    }));
    
    // Auto-advance to next task
    setTimeout(() => {
      incrementTask();
    }, 500);
  };

  const incrementTask = () => {
    setCurrentTask((prev) => prev + 1);
  };

  const downloadAllData = useCallback(() => {
    // Create the JSON structure
    const jsonData = {
      id: parseInt(studyData.consent?.id) || 0,
      ageRange: studyData.consent?.ageRange || '',
      gender: studyData.consent?.gender || '',
      ethnicity: studyData.consent?.ethnicity || '',
      education: studyData.consent?.classRank || '',
      major: studyData.consent?.major || '',
      responses: [],
      timestamp: new Date().toISOString()
    };

    // Add text task response
    if (studyData.textTask?.selectedAnswer) {
      jsonData.responses.push({
        task: "Text",
        response: studyData.textTask.selectedAnswer,
        isCorrect: determineTextCorrectness(studyData.textTask.selectedAnswer)
      });
    }

    // Add video task response
    if (studyData.videoTask?.selectedAnswer) {
      jsonData.responses.push({
        task: "Video",
        response: studyData.videoTask.selectedAnswer,
        isCorrect: determineVideoCorrectness(studyData.videoTask.selectedAnswer)
      });
    }

    // Add face task responses
    if (studyData.faceTask && Array.isArray(studyData.faceTask)) {
      const face2x2Results = studyData.faceTask.filter(result => result.gridSize === 2);
      const face3x3Results = studyData.faceTask.filter(result => result.gridSize === 3);

      if (face2x2Results.length > 0) {
        const face2x2Response = {
          task: "Face2x2",
          response: face2x2Results.map(result => ({
            selectedRow: result.selectedRow || 1,
            selectedColumn: result.selectedColumn || 1,
            isCorrect: result.correct === 'Yes'
          })),
          isCorrect: calculateOverallFaceCorrectness(face2x2Results)
        };
        jsonData.responses.push(face2x2Response);
      }

      if (face3x3Results.length > 0) {
        const face3x3Response = {
          task: "Face3x3",
          response: face3x3Results.map(result => ({
            selectedRow: result.selectedRow || 1,
            selectedColumn: result.selectedColumn || 1,
            isCorrect: result.correct === 'Yes'
          })),
          isCorrect: calculateOverallFaceCorrectness(face3x3Results)
        };
        jsonData.responses.push(face3x3Response);
      }
    }

    // Download JSON file
    const jsonString = JSON.stringify(jsonData, null, 2);
    const blob = new Blob([jsonString], { type: 'application/json;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `study-results-${jsonData.id}.json`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }, [studyData]);

  // Auto-download data when all tasks are completed
  useEffect(() => {
    if (currentTask >= taskFiles.length && taskFiles.length > 0) {
      downloadAllData();
    }
  }, [currentTask, taskFiles.length, downloadAllData]);

  // Helper function to determine text task correctness
  const determineTextCorrectness = (answer) => {
    // Define correct answers for text comprehension
    const correctAnswers = {
      'Adventure and heroism': true,
      'Love and romance': false,
      'Science and technology': false,
      'Family relationships': false
    };
    return correctAnswers[answer] || false;
  };

  // Helper function to determine video task correctness
  const determineVideoCorrectness = (answer) => {
    // Define correct answers for video comprehension
    const correctAnswers = {
      'Sports performance': true,
      'Educational content': false,
      'Entertainment': false,
      'Documentary footage': false
    };
    return correctAnswers[answer] || false;
  };

  // Helper function to calculate overall face task correctness
  const calculateOverallFaceCorrectness = (results) => {
    if (!results || results.length === 0) return false;
    const correctCount = results.filter(result => result.correct === 'Yes').length;
    const threshold = Math.ceil(results.length * 0.6); // 60% threshold
    return correctCount >= threshold;
  };

  const renderCurrentTask = () => {
    if (currentTask >= taskFiles.length) {
      return (
        <div style={styles.completionContainer}>
          <h2>All tasks completed!</h2>
          <p>Your results have been automatically downloaded.</p>
        </div>
      );
    }

    const taskName = taskFiles[currentTask];

    switch (taskName) {
      case 'ConsentForm':
        return <ConsentForm onSubmit={(data) => handleTaskComplete('consent', data)} />;
      case 'TextTask':
        return <TextTask />;
      case 'TextSurvey':
        return <TextSurvey onSubmit={(data) => handleTaskComplete('textTask', data)} />;
      case 'VideoTask':
        return <VideoTask />;
      case 'VideoSurvey':
        return <VideoSurvey onSubmit={(data) => handleTaskComplete('videoTask', data)} />;
      case 'FaceTask':
        return <FaceTask onSubmit={(data) => handleTaskComplete('faceTask', data)} />;
      default:
        return <div>Unknown task</div>;
    }
  };

  const isTaskComplete = currentTask >= taskFiles.length;
  const currentTaskName = taskFiles[currentTask];
  
  // Show Next Task button only for tasks that don't have their own Continue button
  const showNextButton = !isTaskComplete && 
                         !['ConsentForm', 'TextSurvey', 'VideoSurvey', 'FaceTask'].includes(currentTaskName);

  return (
    <div id="app" style={styles.appContainer}>
      <div className="task-container" style={styles.taskContainer}>
        {renderCurrentTask()}
      </div>
      {showNextButton && (
        <div className="button-container" style={styles.buttonContainer}>
          <button 
            id="nextTaskButton" 
            className="button"
            style={styles.nextButton}
            onClick={incrementTask}
          >
            Next Task
          </button>
        </div>
      )}
    </div>
  );
}

const styles = {
  appContainer: {
    height: '100vh',
    width: '100vw',
    display: 'flex',
    flexDirection: 'column',
    position: 'relative',
  },
  taskContainer: {
    flex: 1,
    overflow: 'hidden',
  },
  buttonContainer: {
    position: 'fixed',
    bottom: '-30px',
    right: '30px',
    zIndex: 1000,
  },
  nextButton: {
    fontSize: '18px',
    backgroundColor: '#3498db',
    color: 'white',
    border: 'none',
    borderRadius: '5px',
    marginTop: '20px',
    minWidth: '200px',
    boxShadow: '0 4px 8px rgba(0,0,0,0.2)',
    transition: 'all 0.3s ease',
  },
  completionContainer: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    height: '100vh',
    gap: '20px',
  },
};

export default App;
