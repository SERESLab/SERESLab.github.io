import React, { useEffect, useState } from 'react';

// Settings for each face task variant
const FACE_TASKS = [
  { gridSize: 2, trials: 25 }, // faceTask2.html
  { gridSize: 3, trials: 25 }, // faceTask3.html
  { gridSize: 4, trials: 25 }, // faceTask4.html
];

// Image counts (adjust if your assets differ)
const RIGHT_IMAGE_COUNT = 62;
const WRONG_IMAGE_COUNT = 8;

function getRandomSubset(array, size) {
  return [...array].sort(() => Math.random() - 0.5).slice(0, size);
}

function pickRandomFaceTask() {
  return FACE_TASKS[Math.floor(Math.random() * FACE_TASKS.length)];
}

const FaceTask = () => {
  const [task] = useState(() => pickRandomFaceTask());
  const [trial, setTrial] = useState(0);
  const [grid, setGrid] = useState([]);
  const [completed, setCompleted] = useState(false);

  // Preload image paths
  const rightImagePaths = Array.from({ length: RIGHT_IMAGE_COUNT }, (_, i) =>
    require(`../assets/images/Right/image-${i + 1}.jpg`)
  );
  const wrongImagePaths = Array.from({ length: WRONG_IMAGE_COUNT }, (_, i) =>
    require(`../assets/images/Wrong/image-${i + 1}.jpg`)
  );

  // Generate a new grid for each trial
  const generateNewGrid = () => {
    const totalCells = task.gridSize * task.gridSize;
    let newGrid = getRandomSubset(rightImagePaths, totalCells).map((src, i) => ({
      src,
      id: i + 1,
      isCorrect: false,
    }));

    // Replace one random image with a wrong one
    const replacedIndex = Math.floor(Math.random() * totalCells);
    newGrid[replacedIndex] = {
      src: wrongImagePaths[Math.floor(Math.random() * wrongImagePaths.length)],
      id: replacedIndex + 1,
      isCorrect: true,
    };

    setGrid(newGrid);
  };

  // Initialize the first grid only once
  useEffect(() => {
    generateNewGrid();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Only run once on mount

  const handleClick = (index) => {
    if (completed) return;
    
    const newTrial = trial + 1;
    setTrial(newTrial);
    
    if (newTrial >= task.trials) {
      setCompleted(true);
    } else {
      // Generate new grid for next trial
      generateNewGrid();
    }
  };

  // Dynamic grid style
  const gridStyle = {
    display: 'grid',
    gap: `${5 - task.gridSize}vw`,
    width: '70vh',
    height: '70vh',
    gridTemplateColumns: `repeat(${task.gridSize}, 1fr)`,
    gridTemplateRows: `repeat(${task.gridSize}, 1fr)`,
    justifyContent: 'center',
    alignItems: 'center',
  };

  return (
    <div
      className="container"
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        height: '90vh',
        width: '100vw',
        overflow: 'hidden',
      }}
    >
      <p
        id="completion-message"
        style={{
          display: completed ? 'block' : 'none',
          fontFamily: 'Arial, sans-serif',
          fontSize: 18,
          marginBottom: 20,
        }}
      >
        Completed, please move onto the next task!
      </p>
      {!completed && (
        <div className="grid" style={gridStyle}>
          {grid.map((image, idx) => (
            <img
              key={`${trial}-${image.id}`}
              src={image.src}
              className="grid-item"
              data-id={image.id}
              data-correct={image.isCorrect ? 'T' : 'F'}
              alt="Game"
              style={{
                objectFit: 'cover',
                cursor: 'pointer',
                border: '2px solid transparent',
                transition: '0.3s',
                width: `calc(70vh / ${task.gridSize + 1})`,
                height: `calc(70vh / ${task.gridSize + 1})`,
              }}
              onClick={() => handleClick(idx)}
            />
          ))}
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

export default FaceTask;