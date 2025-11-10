import React, { useRef, useState, useEffect, useCallback } from "react";
import "./App.css";

import ConsentForm from "./components/ConsentForm";
import ContinueButton from "./components/ContinueButton";
import TextTask from "./components/Text/TextTask";
import SmoothPursuitVideoTask from "./components/SmoothPursuitVideoTask";
import InstructionVideoTask from "./components/Instruction/InstructionVideoTask";
import VideoTask from "./components/Video/VideoTask";
import FaceTask2x2 from "./components/FaceTask2x2";
import FaceTask3x3 from "./components/FaceTask3x3";
import ValidationGrid from "./components/validation_grid/ValidationGrid";

// Utility to shuffle an array
function shuffle(array) {
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

function App() {
  const [currentTask, setCurrentTask] = useState(0);
  const [taskFiles, setTaskFiles] = useState([]);
  const [randomizedOrder, setRandomizedOrder] = useState([]);
  const [studyData, setStudyData] = useState({
    consent: null,
    textTask: null,
    smoothPursuitVideoTask: null,
    instructionVideoTask: null,
    videoTask: null,
    faceTask2x2: null,
    faceTask3x3: null,
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
    const alwaysFirst = ["ConsentForm", "ValidationGrid"];
    const toRandomize = [
      "TextTask",
      "SmoothPursuitVideoTask",
      "InstructionVideoTask",
      "VideoTask",
      "FaceTask2x2",
      "FaceTask3x3",
    ];
    const randomized = shuffle(toRandomize);
    setRandomizedOrder(randomized);
    setTaskFiles([...alwaysFirst, ...randomized]);
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
      TaskOrder: randomizedOrder, // Add the randomized order to output
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
        response: studyData.instructionVideoTask,
        isCorrect: true, // No right/wrong answers for this task
      });
    }

    // Add video task response (now handled in VideoTask, not VideoSurvey)
    if (studyData.videoTask) {
      jsonData.responses.push({
        task: "Video",
        response: studyData.videoTask.selectedAnswer,
        isCorrect: determineVideoCorrectness(
          studyData.videoTask.selectedAnswer
        ),
        timestamp: studyData.videoTask.timestamp,
      });
    }

    // Add face task 2x2 responses
    if (studyData.faceTask2x2 && Array.isArray(studyData.faceTask2x2)) {
      // Group results by emotion and gender
      const emotions = ["happy", "angry", "sad"];
      const genders = ["male", "female"];

      emotions.forEach((emotion) => {
        genders.forEach((gender) => {
          const filteredResults = studyData.faceTask2x2.filter(
            (result) =>
              result.emotion === emotion &&
              result.gender === gender &&
              result.gridSize === 2
          );

          if (filteredResults.length > 0) {
            const taskName = `Face2x2_${emotion}_${gender}`;
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
    }

    // Add face task 3x3 responses
    if (studyData.faceTask3x3 && Array.isArray(studyData.faceTask3x3)) {
      // Group results by emotion and gender
      const emotions = ["happy", "angry", "sad"];
      const genders = ["male", "female"];

      emotions.forEach((emotion) => {
        genders.forEach((gender) => {
          const filteredResults = studyData.faceTask3x3.filter(
            (result) =>
              result.emotion === emotion &&
              result.gender === gender &&
              result.gridSize === 3
          );

          if (filteredResults.length > 0) {
            const taskName = `Face3x3_${emotion}_${gender}`;
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
  }, [studyData, startTime, randomizedOrder]);

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
    if (currentTask >= taskFiles.length && taskFiles.length > 0) {
      console.log(currentTask, taskFiles.length);
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
            onComplete={(data) => handleTaskComplete("instructionVideoTask", data)}
          />
        );
      case "VideoTask":
        return (
          <VideoTask
            onComplete={(data) => handleTaskComplete("videoTask", data)}
          />
        );
      case "FaceTask2x2":
        return (
          <FaceTask2x2 onSubmit={(data) => handleTaskComplete("faceTask2x2", data)} />
        );
      case "FaceTask3x3":
        return (
          <FaceTask3x3 onSubmit={(data) => handleTaskComplete("faceTask3x3", data)} />
        );
      case "ValidationGrid":
        return <ValidationGrid onComplete={incrementTask} />;
      default:
        return <div>Unknown task</div>;
    }
  };

  const isTaskComplete = currentTask >= taskFiles.length;
  const rawTaskName = taskFiles[currentTask] || "";
  const currentTaskName = (typeof rawTaskName === 'string' && rawTaskName.trim()) || "Initializing";

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
    (((currentTaskName === "TextTask" && textTaskComplete) ||
      (![
        "ConsentForm",
        "FaceTask2x2",
        "FaceTask3x3",
        "TextTask",
        "ValidationGrid",
      ].includes(currentTaskName) &&
      isVideoTaskComplete())));

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
    <div id="app" style={styles.appContainer} data-re-aoi-name="seemeplz">
      <div className="task-container" style={styles.taskContainer} data-re-aoi-name={currentTaskName}>
        {renderCurrentTask()}
      </div>
      {showNextButton && (
        <ContinueButton onClick={handleNextTask} />
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
    overflow: "auto", // allow child content (like ConsentForm) to scroll when taller than the viewport
  },
  // Removed custom next button styles in favor of shared ContinueButton
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
