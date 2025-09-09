import React, { useRef, useState, useEffect, useCallback } from "react";
import "./App.css";

import ConsentForm from "./components/ConsentForm";
import TextTask from "./components/Text/TextTask";
import SmoothPursuitVideoTask from "./components/SmoothPursuitVideoTask";
import InstructionVideoTask from "./components/InstructionVideoTask";
import InstructionVideoSurvey from "./components/InstructionVideoSurvey";
import VideoTask from "./components/VideoTask";
import VideoSurvey from "./components/VideoSurvey";
import FaceTask from "./components/FaceTask";
import ValidationGrid from "./components/validation_grid/ValidationGrid";

function App() {
  const [currentTask, setCurrentTask] = useState(0);
  const [taskFiles, setTaskFiles] = useState([]);
  const [studyData, setStudyData] = useState({
    consent: null,
    textTask: null,
    smoothPursuitVideoTask: null,
    instructionVideoTask: null,
    videoTask: null,
    faceTask: null,
  });

  // State to track study timing
  const [startTime, setStartTime] = useState(null);

  // State to track video completion
  const [instructionVideoEnded, setInstructionVideoEnded] = useState(false);
  const [videoTaskEnded, setVideoTaskEnded] = useState(false);
  const [smoothPursuitTaskEnded, setSmoothPursuitTaskEnded] = useState(false);
  const [textTaskComplete, setTextTaskComplete] = useState(false);

  const textTaskRef = useRef();

  useEffect(() => {
    generateTaskSequence();
  }, []);

  const generateTaskSequence = () => {
    const tasks = [
      "ValidationGrid",
      'ConsentForm',
      "TextTask",
      "SmoothPursuitVideoTask",
      'InstructionVideoTask',
      'InstructionVideoSurvey',
      'VideoTask',
      'VideoSurvey',
      'FaceTask',
    ];
    setTaskFiles(tasks);
  };

  const handleTaskComplete = (taskType, data) => {
    setStudyData((prev) => ({
      ...prev,
      [taskType]: data,
    }));

    // Set start time when consent form is completed
    if (taskType === "consent") {
      setStartTime(new Date().toISOString());
    }

    // Auto-advance to next task
    setTimeout(() => {
      incrementTask();
    }, 500);
  };

  const incrementTask = () => {
    setCurrentTask((prev) => prev + 1);
    // Reset video end states when moving to next task
    setInstructionVideoEnded(false);
    setVideoTaskEnded(false);
    setSmoothPursuitTaskEnded(false);
    setTextTaskComplete(false); // Reset for next time
  };

  const downloadAllData = useCallback(() => {
    // Create the JSON structure
    const jsonData = {
      id: parseInt(studyData.consent?.id) || 0,
      ageRange: studyData.consent?.ageRange || "",
      gender: studyData.consent?.gender || "",
      ethnicity: studyData.consent?.ethnicity || "",
      education: studyData.consent?.classRank || "",
      major: studyData.consent?.major || "",
      visionStatus: studyData.consent?.visionStatus || "",
      wearsGlasses: studyData.consent?.wearsGlasses || "",
      wearsContactLenses: studyData.consent?.wearsContactLenses || "",
      responses: [],
      startTime: startTime,
      endTime: new Date().toISOString(),
    };

    // Add text task responses (now an array of objects)
    if (Array.isArray(studyData.textTask)) {
      studyData.textTask.forEach((resp, idx) => {
        jsonData.responses.push({
          task: `Text_${resp.textId}`,
          response: resp.selectedAnswer,
          isCorrect: resp.isCorrect,
          correctAnswer: resp.correctAnswer,
          timestamp: resp.timestamp,
        });
      });
    }

    // Add smooth pursuit video task response
    if (studyData.smoothPursuitVideoTask) {
      jsonData.responses.push({
        task: "SmoothPursuitVideo",
        response: studyData.smoothPursuitVideoTask,
        isCorrect: true, // Completion-based task
      });
    }

    // Add instruction video task response
    if (studyData.instructionVideoTask) {
      jsonData.responses.push({
        task: "InstructionVideo",
        response: {
          ballTransfers: studyData.instructionVideoTask.ballTransfers,
          curtainColor: studyData.instructionVideoTask.curtainColor,
          noticedGorilla: studyData.instructionVideoTask.noticedGorilla,
        },
        isCorrect: true, // No right/wrong answers for this task
      });
    }

    // Add video task response
    if (studyData.videoTask?.selectedAnswer) {
      jsonData.responses.push({
        task: "Video",
        response: studyData.videoTask.selectedAnswer,
        isCorrect: determineVideoCorrectness(
          studyData.videoTask.selectedAnswer
        ),
      });
    }

    // Add face task responses
    if (studyData.faceTask && Array.isArray(studyData.faceTask)) {
      // Group results by emotion, gender, and grid size
      const emotions = ["happy", "angry", "sad"];
      const genders = ["male", "female"];
      const gridSizes = [2, 3];

      emotions.forEach((emotion) => {
        genders.forEach((gender) => {
          gridSizes.forEach((gridSize) => {
            const filteredResults = studyData.faceTask.filter(
              (result) =>
                result.emotion === emotion &&
                result.gender === gender &&
                result.gridSize === gridSize
            );

            if (filteredResults.length > 0) {
              const taskName = `Face_${emotion}_${gender}_${gridSize}x${gridSize}`;
              const response = {
                task: taskName,
                response: filteredResults.map((result) => ({
                  trial: result.trial,
                  emotion: result.emotion,
                  gender: result.gender,
                  gridSize: result.gridSize,
                  startTime: result.startTime,
                  endTime: result.endTime,
                  selectedRow: result.selectedRow,
                  selectedColumn: result.selectedColumn,
                  correctRow: result.correctRow,
                  correctColumn: result.correctColumn,
                  isCorrect: result.correct === "Yes",
                })),
                isCorrect: calculateOverallFaceCorrectness(filteredResults),
              };
              jsonData.responses.push(response);
            }
          });
        });
      });
    }

    // Download JSON file
    const jsonString = JSON.stringify(jsonData, null, 2);
    const blob = new Blob([jsonString], {
      type: "application/json;charset=utf-8;",
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `study-results-${jsonData.id}.json`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }, [studyData, startTime]);

  // Auto-download data when all tasks are completed
  useEffect(() => {
    if (currentTask >= taskFiles.length && taskFiles.length > 0) {
      downloadAllData();
    }
  }, [currentTask, taskFiles.length, downloadAllData]);

  // Helper function to determine video task correctness
  const determineVideoCorrectness = (answer) => {
    // Define correct answers for video comprehension
    const correctAnswers = {
      No: true,
      Yes: false,
    };
    return correctAnswers[answer] || false;
  };

  // Helper function to calculate overall face task correctness
  const calculateOverallFaceCorrectness = (results) => {
    if (!results || results.length === 0) return false;
    const correctCount = results.filter(
      (result) => result.correct === "Yes"
    ).length;
    const threshold = Math.ceil(results.length * 0.6); // 60% threshold
    return correctCount >= threshold;
  };

  const renderCurrentTask = () => {
    if (currentTask >= taskFiles.length) {
      window.dispatchEvent(new Event("endmeplease"));
      return (
        <div style={styles.completionContainer}>
          <h2>All tasks completed!</h2>
          <p>Your results have been automatically downloaded.</p>
        </div>
      );
    }

    const taskName = taskFiles[currentTask];

    switch (taskName) {
      case "ConsentForm":
        return (
          <ConsentForm
            onSubmit={(data) => handleTaskComplete("consent", data)}
          />
        );
      case "TextTask":
        return (
          <TextTask
            ref={textTaskRef}
            onComplete={() => setTextTaskComplete(true)}
          />
        );
      case "SmoothPursuitVideoTask":
        return (
          <SmoothPursuitVideoTask
            onSubmit={(data) =>
              handleTaskComplete("smoothPursuitVideoTask", data)
            }
            onTaskComplete={() => setSmoothPursuitTaskEnded(true)}
          />
        );
      case "InstructionVideoTask":
        return (
          <InstructionVideoTask
            onVideoEnded={() => setInstructionVideoEnded(true)}
          />
        );
      case "InstructionVideoSurvey":
        return (
          <InstructionVideoSurvey
            onSubmit={(data) =>
              handleTaskComplete("instructionVideoTask", data)
            }
          />
        );
      case "VideoTask":
        return <VideoTask onVideoEnded={() => setVideoTaskEnded(true)} />;
      case "VideoSurvey":
        return (
          <VideoSurvey
            onSubmit={(data) => handleTaskComplete("videoTask", data)}
          />
        );
      case "FaceTask":
        return (
          <FaceTask onSubmit={(data) => handleTaskComplete("faceTask", data)} />
        );
      case "ValidationGrid":
        return <ValidationGrid onComplete={incrementTask} />;
      default:
        return <div>Unknown task</div>;
    }
  };

  const isTaskComplete = currentTask >= taskFiles.length;
  const currentTaskName = taskFiles[currentTask];

  // Check if current video task has ended
  const isVideoTaskComplete = () => {
    if (currentTaskName === "InstructionVideoTask") {
      return instructionVideoEnded;
    }
    if (currentTaskName === "VideoTask") {
      return videoTaskEnded;
    }
    if (currentTaskName === "SmoothPursuitVideoTask") {
      return smoothPursuitTaskEnded;
    }
    return true; // For non-video tasks, always allow next button
  };

  // Show Next Task button only for tasks that don't have their own Continue button
  // and only when video tasks have ended
  const showNextButton =
    !isTaskComplete &&
    ((currentTaskName === "TextTask" && textTaskComplete) ||
      ![
        "ConsentForm",
        "InstructionVideoSurvey",
        "VideoSurvey",
        "FaceTask",
        "TextTask",
      ].includes(currentTaskName) &&
      isVideoTaskComplete());

  const handleNextTask = () => {
    // If TextTask, collect results before advancing
    if (currentTaskName === "TextTask" && textTaskRef.current) {
      const results = textTaskRef.current.getResults();
      handleTaskComplete("textTask", results);
    } else {
      incrementTask();
    }
  };

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
            onClick={handleNextTask}
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
    height: "100vh",
    width: "100vw",
    display: "flex",
    flexDirection: "column",
    position: "relative",
  },
  taskContainer: {
    flex: 1,
    overflow: "hidden",
  },
  buttonContainer: {
    position: "fixed",
    bottom: "-30px",
    right: "30px",
    zIndex: 1000,
  },
  nextButton: {
    fontSize: "18px",
    backgroundColor: "#3498db",
    color: "white",
    border: "none",
    borderRadius: "5px",
    marginTop: "20px",
    minWidth: "200px",
    boxShadow: "0 4px 8px rgba(0,0,0,0.2)",
    transition: "all 0.3s ease",
  },
  completionContainer: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    height: "100vh",
    gap: "20px",
  },
};

export default App;
