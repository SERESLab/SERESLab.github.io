import React, { useEffect, useState, useCallback, useMemo } from 'react';

// Define the task sequence
const TASK_SEQUENCE = [
  // Happy emotion tasks
  { emotion: 'happy', gridSize: 2, gender: 'male', trials: 4 },
  { emotion: 'happy', gridSize: 2, gender: 'female', trials: 4 },
  { emotion: 'happy', gridSize: 3, gender: 'male', trials: 9 },
  { emotion: 'happy', gridSize: 3, gender: 'female', trials: 9 },
  // Angry emotion tasks
  { emotion: 'angry', gridSize: 2, gender: 'male', trials: 4 },
  { emotion: 'angry', gridSize: 2, gender: 'female', trials: 4 },
  { emotion: 'angry', gridSize: 3, gender: 'male', trials: 9 },
  { emotion: 'angry', gridSize: 3, gender: 'female', trials: 9 },
  // Sad emotion tasks
  { emotion: 'sad', gridSize: 2, gender: 'male', trials: 4 },
  { emotion: 'sad', gridSize: 2, gender: 'female', trials: 4 },
  { emotion: 'sad', gridSize: 3, gender: 'male', trials: 9 },
  { emotion: 'sad', gridSize: 3, gender: 'female', trials: 9 },
];

// Function to dynamically import all images from a folder
function importAll(r) {
  let images = {};
  r.keys().forEach((item, index) => {
    images[item.replace('./', '')] = r(item);
  });
  return Object.values(images);
}

function getRandomSubset(array, size) {
  return [...array].sort(() => Math.random() - 0.5).slice(0, size);
}

const FaceTask = ({ onSubmit }) => {
  const [taskIndex, setTaskIndex] = useState(0);
  const [trial, setTrial] = useState(0);
  const [grid, setGrid] = useState([]);
  const [completed, setCompleted] = useState(false);
  const [showCross, setShowCross] = useState(true);
  const [showInstruction, setShowInstruction] = useState(false);
  const [imagesLoaded, setImagesLoaded] = useState(false);
  const [results, setResults] = useState([]);
  //TODO: Fix the faces not being shown in the correct order, positions are correct.
  const [trialStartTime, setTrialStartTime] = useState(null);
  const [correctPositions, setCorrectPositions] = useState([]);

  const currentTask = TASK_SEQUENCE[taskIndex];
  const { emotion, gridSize, gender, trials: maxTrials } = currentTask || {};

  // Generate all possible positions for a grid size
  const generatePositions = useCallback((size) => {
    const positions = [];
    for (let i = 0; i < size * size; i++) {
      positions.push(i);
    }
    // Shuffle the positions to randomize the order
    return positions.sort(() => Math.random() - 0.5);
  }, []);

  // Initialize correct positions when task starts
  useEffect(() => {
    if (currentTask && trial === 0) {
      const positions = generatePositions(gridSize);
      setCorrectPositions(positions);
    }
  }, [currentTask, trial, gridSize, generatePositions]);

  // Import all images for each emotion and gender combination
  const imageLibrary = useMemo(() => {
    const library = {};

    try {
      // Male images
      library.male = {
        angry: importAll(require.context('../assets/images/Male/Mad', false, /\.(png|jpe?g|svg)$/)),
        happy: importAll(require.context('../assets/images/Male/Happy', false, /\.(png|jpe?g|svg)$/)),
        other: importAll(require.context('../assets/images/Male/Other', false, /\.(png|jpe?g|svg)$/)),
        sad: importAll(require.context('../assets/images/Male/Sad', false, /\.(png|jpe?g|svg)$/)),
      };

      // Female images
      library.female = {
        angry: importAll(require.context('../assets/images/Female/Mad', false, /\.(png|jpe?g|svg)$/)),
        happy: importAll(require.context('../assets/images/Female/Happy', false, /\.(png|jpe?g|svg)$/)),
        other: importAll(require.context('../assets/images/Female/Other', false, /\.(png|jpe?g|svg)$/)),
        sad: importAll(require.context('../assets/images/Female/Sad', false, /\.(png|jpe?g|svg)$/)),
      };

      console.log('Image library loaded:', library);
    } catch (error) {
      console.error('Error loading image library:', error);
    }

    return library;
  }, []);

  const preloadImage = (src) => {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = () => resolve(src);
      img.onerror = reject;
      img.src = src;
    });
  };

  const generateNewGrid = useCallback(async () => {
    if (!currentTask || correctPositions.length === 0) return;

    const totalCells = gridSize * gridSize;
    
    // Get target emotion images (correct answers)
    const targetImages = imageLibrary[gender]?.[emotion] || [];

    // Get distractor images (other emotions for the same gender)
    const distractorImages = [];
    ['angry', 'happy', 'other', 'sad'].forEach(e => {
      if (e !== emotion) {
        const emotionImages = imageLibrary[gender]?.[e] || [];
        distractorImages.push(...emotionImages);
      }
    });

    console.log(`Trial ${trial + 1}, using position ${correctPositions[trial]} for ${gender} ${emotion} ${gridSize}x${gridSize}`);

    if (targetImages.length === 0) {
      console.error(`No target images found for ${gender} ${emotion}`);
      return;
    }
    
    if (distractorImages.length === 0) {
      console.error(`No distractor images found for ${gender}`);
      return;
    }

    if (distractorImages.length < totalCells - 1) {
      console.warn(`Not enough distractor images. Need ${totalCells - 1}, have ${distractorImages.length}`);
    }

    // Create grid with distractors
    let newGrid = getRandomSubset(distractorImages, totalCells).map((src, i) => ({
      src,
      id: i + 1,
      isCorrect: false,
      row: Math.floor(i / gridSize) + 1,
      column: (i % gridSize) + 1,
    }));

    // Use the predetermined position for the correct image
    const correctPosition = correctPositions[trial];
    newGrid[correctPosition] = {
      src: targetImages[Math.floor(Math.random() * targetImages.length)],
      id: correctPosition + 1,
      isCorrect: true,
      row: Math.floor(correctPosition / gridSize) + 1,
      column: (correctPosition % gridSize) + 1,
    };

    setGrid(newGrid);
    setImagesLoaded(false);

    try {
      const imagePromises = newGrid.map(image => preloadImage(image.src));
      await Promise.all(imagePromises);
      setImagesLoaded(true);
    } catch (error) {
      console.error('Error loading images:', error);
      setImagesLoaded(true);
    }
  }, [currentTask, emotion, gridSize, gender, imageLibrary, trial, correctPositions]);

  // Check if we need to show instruction (first task of each emotion)
  const shouldShowInstruction = useCallback(() => {
    if (taskIndex === 0) return true; // First task overall
    const currentEmotion = TASK_SEQUENCE[taskIndex]?.emotion;
    const previousEmotion = TASK_SEQUENCE[taskIndex - 1]?.emotion;
    return currentEmotion !== previousEmotion;
  }, [taskIndex]);

  useEffect(() => {
    if (completed || !currentTask || correctPositions.length === 0) return;

    const needsInstruction = trial === 0 && shouldShowInstruction();
    
    if (needsInstruction) {
      // Show instruction for new emotion
      setShowInstruction(true);
      setShowCross(false);
      const instructionTimer = setTimeout(() => {
        setShowInstruction(false);
        setShowCross(true);
        setImagesLoaded(false);
        generateNewGrid();
      }, 2000); // Show instruction for 2 seconds

      return () => clearTimeout(instructionTimer);
    } else {
      // Normal trial flow
      setShowCross(true);
      setImagesLoaded(false);
      generateNewGrid();
    }
  }, [trial, taskIndex, generateNewGrid, completed, currentTask, shouldShowInstruction, correctPositions]);

  useEffect(() => {
    if (imagesLoaded && !showInstruction) {
      const timer = setTimeout(() => {
        setShowCross(false);
        // Record trial start time when grid becomes visible
        setTrialStartTime(new Date().toISOString());
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [imagesLoaded, showInstruction]);

  const handleClick = (index) => {
    if (completed || showCross || showInstruction) return;

    const trialEndTime = new Date().toISOString();
    const clickedImage = grid[index];
    const isCorrectClick = clickedImage?.isCorrect === true;

    const selectedRow = Math.floor(index / gridSize) + 1;
    const selectedColumn = (index % gridSize) + 1;

    // Find the correct image position
    const correctImage = grid.find(img => img.isCorrect);
    const correctRow = correctImage?.row || null;
    const correctColumn = correctImage?.column || null;

    const result = {
      emotion,
      gender,
      gridSize,
      trial: trial + 1,
      startTime: trialStartTime,
      endTime: trialEndTime,
      selectedRow,
      selectedColumn,
      correctRow,
      correctColumn,
      correct: isCorrectClick ? 'Yes' : 'No',
    };
    
    setResults((prev) => [...prev, result]);

    const newTrial = trial + 1;
    if (newTrial >= maxTrials) {
      // Move to next task
      const nextTaskIndex = taskIndex + 1;
      if (nextTaskIndex >= TASK_SEQUENCE.length) {
        // All tasks completed
        setCompleted(true);
        const finalResults = [...results, result];
        onSubmit?.(finalResults);
      } else {
        setTaskIndex(nextTaskIndex);
        setTrial(0);
        // Reset correct positions for the new task
        setCorrectPositions([]);
      }
    } else {
      setTrial(newTrial);
    }
  };

  const getInstructionText = () => {
    if (!currentTask) return '';
    const emotionText = emotion.charAt(0).toUpperCase() + emotion.slice(1);
    return `Find the ${emotionText} face and click on it`;
  };

  const gridStyle = {
    display: 'grid',
    gap: `${5 - gridSize}vw`,
    width: '70vh',
    height: '70vh',
    gridTemplateColumns: `repeat(${gridSize}, 1fr)`,
    gridTemplateRows: `repeat(${gridSize}, 1fr)`,
    justifyContent: 'center',
    alignItems: 'center',
  };

  if (completed) {
    return (
      <div style={styles.completionContainer}>
        <p style={styles.completionText}>Face Recognition Task Completed!</p>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      {showInstruction && (
        <div style={styles.instructionContainer}>
          <div style={styles.instructionText}>
            {getInstructionText()}
          </div>
        </div>
      )}

      {showCross && !showInstruction && (
        <div style={styles.crossContainer}>
          <div style={styles.cross}>+</div>
        </div>
      )}

      {!showCross && !showInstruction && currentTask && (
        <div className="grid" style={gridStyle}>
          {grid.map((image, idx) => {
            const row = Math.floor(idx / gridSize) + 1;
            const column = (idx % gridSize) + 1;
            const rowStr = (row || 0).toString();
            const colStr = (column || 0).toString();
            const taskIdx = taskIndex ?? 0;
            const trialNum = trial ?? 0;
            const isCorrect = image?.isCorrect ?? false;
            const correctness = isCorrect ? 'correct' : 'incorrect';
            const aoName = `face-task-${taskIdx}-trial-${trialNum}-row${rowStr}-col${colStr}-${correctness}`;
            return (
              <img
                key={`${taskIndex}-${trial}-${image.id}`}
                src={image.src}
                className="grid-item"
                data-id={image.id}
                data-correct={isCorrect ? 'T' : 'F'}
                data-emotion={emotion}
                data-gender={gender}
                data-re-aoi-name={aoName}
                alt={`${gender} ${emotion} face`}
                style={{
                  objectFit: 'cover',
                  cursor: 'pointer',
                  border: '2px solid transparent',
                  transition: '0.3s',
                  width: `calc(70vh / ${gridSize + 1})`,
                  height: `calc(70vh / ${gridSize + 1})`,
                }}
                onClick={() => handleClick(idx)}
              />
            );
          })}
        </div>
      )}

      <style>{`
        .grid-item:hover {
          border-color: #3498db;
        }
      `}</style>
    </div>
  );
};

const styles = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    height: '100vh',
    width: '100vw',
    overflow: 'hidden',
    position: 'relative',
    backgroundColor: '#fff',
  },
  crossContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    height: '100vh',
    width: '100vw',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 9999,
    backgroundColor: '#fff',
  },
  cross: {
    fontSize: '100px',
    fontWeight: 'bold',
    color: 'black',
  },
  instructionContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    height: '100vh',
    width: '100vw',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 9999,
    backgroundColor: '#fff',
  },
  instructionText: {
    fontSize: '48px',
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center',
    padding: '40px',
  },
  completionContainer: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    height: '100vh',
    width: '100vw',
    backgroundColor: '#fff',
  },
  completionText: {
    fontFamily: 'Arial, sans-serif',
    fontSize: '24px',
    color: '#333',
    textAlign: 'center',
  },
};

export default FaceTask;
