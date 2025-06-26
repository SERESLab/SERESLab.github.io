import React, { useEffect, useState } from 'react';

// Settings for each face task variant
const FACE_TASKS = [
  { gridSize: 2, trials: 25 },
  { gridSize: 3, trials: 25 },
  { gridSize: 4, trials: 25 },
];

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
  const [showCross, setShowCross] = useState(true);

  const rightImagePaths = Array.from({ length: RIGHT_IMAGE_COUNT }, (_, i) =>
    require(`../assets/images/Right/image-${i + 1}.jpg`)
  );
  const wrongImagePaths = Array.from({ length: WRONG_IMAGE_COUNT }, (_, i) =>
    require(`../assets/images/Wrong/image-${i + 1}.jpg`)
  );

  const generateNewGrid = () => {
    const totalCells = task.gridSize * task.gridSize;
    let newGrid = getRandomSubset(rightImagePaths, totalCells).map((src, i) => ({
      src,
      id: i + 1,
      isCorrect: false,
    }));

    const replacedIndex = Math.floor(Math.random() * totalCells);
    newGrid[replacedIndex] = {
      src: wrongImagePaths[Math.floor(Math.random() * wrongImagePaths.length)],
      id: replacedIndex + 1,
      isCorrect: true,
    };

    setGrid(newGrid);
  };

  useEffect(() => {
    generateNewGrid();

    const timer = setTimeout(() => {
      setShowCross(false);
    }, 10000); // Hide cross after 10s

    return () => clearTimeout(timer);
  }, []); // Run once on mount

  const handleClick = (index) => {
    if (completed) return;

    const newTrial = trial + 1;
    setTrial(newTrial);

    if (newTrial >= task.trials) {
      setCompleted(true);
    } else {
      generateNewGrid();
    }
  };

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
        position: 'relative',
        backgroundColor: '#fff',
      }}
    >
      {showCross && (
        <div style={styles.crossContainer}>
          <div style={styles.cross}>+</div>
        </div>
      )}

      {!showCross && (
        <>
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
        </>
      )}

      <style>{`
        .grid-item:hover {
          border-color: #3498db;
        }
      `}</style>
    </div>
  );
};

// Styles for the tracking dot (cross)
const styles = {
  crossContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    height: '100vh',
    width: '100vw',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 10,
    backgroundColor: '#fff',
  },
  cross: {
    fontSize: '100px',
    fontWeight: 'bold',
    color: '#000',
  },
};

export default FaceTask;
