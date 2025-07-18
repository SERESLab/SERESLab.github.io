import React, { useEffect, useState, useCallback, useMemo } from 'react';

const TASKS = [
  { gridSize: 2, trials: 25 },
  { gridSize: 3, trials: 25 },
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
  const [taskStage, setTaskStage] = useState(0);
  const [trial, setTrial] = useState(0);
  const [grid, setGrid] = useState([]);
  const [completed, setCompleted] = useState(false);
  const [showCross, setShowCross] = useState(true);
  const [imagesLoaded, setImagesLoaded] = useState(false);
  const [results, setResults] = useState([]);

  const currentTask = TASKS[taskStage];
  const { gridSize, trials: maxTrials } = currentTask;

  const rightImagePaths = useMemo(() =>
    importAll(require.context('../assets/images/Right', false, /\.(png|jpe?g|svg)$/)),
    []
  );
  const wrongImagePaths = useMemo(() =>
    importAll(require.context('../assets/images/Wrong', false, /\.(png|jpe?g|svg)$/)),
    []
  );

  const preloadImage = (src) => {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = () => resolve(src);
      img.onerror = reject;
      img.src = src;
    });
  };

  const generateNewGrid = useCallback(async () => {
    const totalCells = gridSize * gridSize;
    let newGrid = getRandomSubset(wrongImagePaths, totalCells).map((src, i) => ({
      src,
      id: i + 1,
      isCorrect: false,
    }));

    const replacedIndex = Math.floor(Math.random() * totalCells);
    newGrid[replacedIndex] = {
      src: rightImagePaths[Math.floor(Math.random() * rightImagePaths.length)],
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
  }, [gridSize, rightImagePaths, wrongImagePaths]);

  useEffect(() => {
    setShowCross(true);
    setImagesLoaded(false);
    generateNewGrid();
  }, [trial, taskStage, generateNewGrid]);

  useEffect(() => {
    if (imagesLoaded) {
      const timer = setTimeout(() => {
        setShowCross(false);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [imagesLoaded]);

  const handleClick = (index) => {
    if (completed || showCross) return;

    const clickedImage = grid[index];
    const isCorrectClick = clickedImage?.isCorrect === true;

    const row = Math.floor(index / gridSize) + 1;
    const column = (index % gridSize) + 1;

    const result = {
      gridSize,
      trial: trial + 1,
      selectedRow: row,
      selectedColumn: column,
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
        const finalResults = [...results, result];
        onSubmit?.(finalResults);
      }
    } else {
      setTrial(newTrial);
    }
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
              Completed!
            </p>
          ) : (
            <div className="grid" style={gridStyle}>
              {grid.map((image, idx) => {
                const row = Math.floor(idx / gridSize) + 1;
                const column = (idx % gridSize) + 1;
                return (
                  <img
                    key={`${trial}-${image.id}`}
                    src={image.src}
                    className="grid-item"
                    data-id={image.id}
                    data-correct={image.isCorrect ? 'T' : 'F'}
                    data-re-aoi-name={`${row}-${column}-${image.isCorrect ? 'correct' : 'incorrect'}`}
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
                );
              })}
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
