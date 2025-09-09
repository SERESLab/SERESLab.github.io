import React, { useState, useEffect } from "react";
import gridImage from "../../assets/5point_1920x1080.png";
import "./ValidationGrid.css";

const ValidationGrid = ({ onComplete }) => {
  const [showPrompt, setShowPrompt] = useState(true);

  useEffect(() => {
    let timer;
    if (!showPrompt) {
      // Show grid for 6 seconds, then complete
      timer = setTimeout(() => {
        onComplete?.();
      }, 6000);
    }
    return () => clearTimeout(timer);
  }, [showPrompt, onComplete]);

  return (
    <div className="validation-grid-container">
      {showPrompt ? (
        <div className="validation-grid-prompt">
          <p>
            Look at each dot for 1 second in the order reflected in numbers on the
            dots.
          </p>
          <button
            className="validation-grid-start-button"
            onClick={() => setShowPrompt(false)}
          >
            Start
          </button>
        </div>
      ) : (
        <img
          src={gridImage}
          alt="5-point validation grid"
          className="validation-grid-image"
        />
      )}
    </div>
  );
};

export default ValidationGrid;