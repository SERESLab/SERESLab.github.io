import React, { useEffect, useState, useCallback, useMemo } from 'react';

// Define the task sequence
const TASK_SEQUENCE = [
  // Happy emotion tasks
  { emotion: 'happy', gridSize: 2, gender: 'male', trials: 5 },
  { emotion: 'happy', gridSize: 2, gender: 'female', trials: 5 },
  { emotion: 'happy', gridSize: 3, gender: 'male', trials: 5 },
  { emotion: 'happy', gridSize: 3, gender: 'female', trials: 5 },
  // Angry emotion tasks
  { emotion: 'angry', gridSize: 2, gender: 'male', trials: 5 },
  { emotion: 'angry', gridSize: 2, gender: 'female', trials: 5 },
  { emotion: 'angry', gridSize: 3, gender: 'male', trials: 5 },
  { emotion: 'angry', gridSize: 3, gender: 'female', trials: 5 },
  // Sad emotion tasks
  { emotion: 'sad', gridSize: 2, gender: 'male', trials: 5 },
  { emotion: 'sad', gridSize: 2, gender: 'female', trials: 5 },
  { emotion: 'sad', gridSize: 3, gender: 'male', trials: 5 },
  { emotion: 'sad', gridSize: 3, gender: 'female', trials: 5 },
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

  const currentTask = TASK_SEQUENCE[taskIndex];
  const { emotion, gridSize, gender, trials: maxTrials } = currentTask || {};

  // Import all images for each emotion and gender combination
  const imageLibrary = useMemo(() => {
    const library = {};

    try {
      // Male images
      library.male = {
        angry: importAll(require.context('../assets/images/male/angry', false, /\.(png|jpe?g|svg)$/)),
        happy: importAll(require.context('../assets/images/male/happy', false, /\.(png|jpe?g|svg)$/)),
        other: importAll(require.context('../assets/images/male/other', false, /\.(png|jpe?g|svg)$/)),
        sad: importAll(require.context('../assets/images/male/sad', false, /\.(png|jpe?g|svg)$/)),
      };

      // Female images
      library.female = {
        angry: importAll(require.context('../assets/images/female/angry', false, /\.(png|jpe?g|svg)$/)),
        happy: importAll(require.context('../assets/images/female/happy', false, /\.(png|jpe?g|svg)$/)),
        other: importAll(require.context('../assets/images/female/other', false, /\.(png|jpe?g|svg)$/)),
        sad: importAll(require.context('../assets/images/female/sad', false, /\.(png|jpe?g|svg)$/)),
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
    if (!currentTask) return;

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

    console.log(`Total distractor images for ${gender}:`, distractorImages.length);

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
    }));

    // Replace one random cell with target emotion
    const replacedIndex = Math.floor(Math.random() * totalCells);
    newGrid[replacedIndex] = {
      src: targetImages[Math.floor(Math.random() * targetImages.length)],
      id: replacedIndex + 1,
      isCorrect: true,
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
  }, [currentTask, emotion, gridSize, gender, imageLibrary]);

  // Check if we need to show instruction (first task of each emotion)
  const shouldShowInstruction = useCallback(() => {
    if (taskIndex === 0) return true; // First task overall
    const currentEmotion = TASK_SEQUENCE[taskIndex]?.emotion;
    const previousEmotion = TASK_SEQUENCE[taskIndex - 1]?.emotion;
    return currentEmotion !== previousEmotion;
  }, [taskIndex]);

  useEffect(() => {
    if (completed || !currentTask) return;

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
  }, [trial, taskIndex, generateNewGrid, completed, currentTask, shouldShowInstruction]);

  useEffect(() => {
    if (imagesLoaded && !showInstruction) {
      const timer = setTimeout(() => {
        setShowCross(false);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [imagesLoaded, showInstruction]);

  const handleClick = (index) => {
    if (completed || showCross || showInstruction) return;

    const clickedImage = grid[index];
    const isCorrectClick = clickedImage?.isCorrect === true;

    const row = Math.floor(index / gridSize) + 1;
    const column = (index % gridSize) + 1;

    const result = {
      emotion,
      gender,
      gridSize,
      trial: trial + 1,
      selectedRow: row,
      selectedColumn: column,
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
            return (
              <img
                key={`${taskIndex}-${trial}-${image.id}`}
                src={image.src}
                className="grid-item"
                data-id={image.id}
                data-correct={image.isCorrect ? 'T' : 'F'}
                data-emotion={emotion}
                data-gender={gender}
                data-re-aoi-name={`${row}-${column}-${image.isCorrect ? 'correct' : 'incorrect'}`}
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
    height: '90vh',
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
