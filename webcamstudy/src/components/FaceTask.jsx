import React, { useEffect, useState } from 'react';
import Papa from 'papaparse';

const TASKS = [
  { gridSize: 2, trials: 25 },
  { gridSize: 3, trials: 25 },
];

const RIGHT_IMAGE_COUNT = 62;
const WRONG_IMAGE_COUNT = 8;

function getRandomSubset(array, size) {
  return [...array].sort(() => Math.random() - 0.5).slice(0, size);
}

const FaceTask = () => {
  const [taskStage, setTaskStage] = useState(0); // 0 for 2x2, 1 for 3x3
  const [trial, setTrial] = useState(0);
  const [grid, setGrid] = useState([]);
  const [completed, setCompleted] = useState(false);
  const [showCross, setShowCross] = useState(true);
  const [results, setResults] = useState([]); // store result rows

  const currentTask = TASKS[taskStage];
  const { gridSize, trials: maxTrials } = currentTask;

  const rightImagePaths = Array.from({ length: RIGHT_IMAGE_COUNT }, (_, i) =>
    require(`../assets/images/Right/image-${i + 1}.jpg`)
  );
  const wrongImagePaths = Array.from({ length: WRONG_IMAGE_COUNT }, (_, i) =>
    require(`../assets/images/Wrong/image-${i + 1}.jpg`)
  );

  const generateNewGrid = () => {
    const totalCells = gridSize * gridSize;
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
    setShowCross(true);
    const timer = setTimeout(() => {
      setShowCross(false);
      generateNewGrid();
    }, 1000); // show fixation cross for 1 second

    return () => clearTimeout(timer);
  }, [trial, taskStage]);

  const handleClick = (index) => {
    if (completed || showCross) return;

    const clickedImage = grid[index];
    const isCorrectClick = clickedImage?.isCorrect === true;

    // Record result
    const result = {
      gridSize,
      trial: trial + 1,
      correct: isCorrectClick ? 'Yes' : 'No',
    };
    setResults((prev) => [...prev, result]);

    const newTrial = trial + 1;
    if (newTrial >= maxTrials) {
      if (taskStage === 0) {
        setTaskStage(1);
        setTrial(0);
      } else {
        setCompleted(true);
        downloadCSV([...results, result]); // Include last trial
      }
    } else {
      setTrial(newTrial);
    }
  };

  const downloadCSV = (data) => {
    const csv = Papa.unparse(data, {
      columns: ['gridSize', 'trial', 'correct'],
    });

    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', 'face-task-results.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
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
          {completed ? (
            <p
              id="completion-message"
              style={{
                fontFamily: 'Arial, sans-serif',
                fontSize: 18,
                marginBottom: 20,
              }}
            >
              Completed, results downloaded!
            </p>
          ) : (
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
                    width: `calc(70vh / ${gridSize + 1})`,
                    height: `calc(70vh / ${gridSize + 1})`,
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

// Styles
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
    zIndex: 9999,
    backgroundColor: '#fff',
  },
  cross: {
    fontSize: '100px',
    fontWeight: 'bold',
    color: 'black',
  },
};

export default FaceTask;
