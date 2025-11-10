import React, { useState } from "react";
import ContinueButton from "../ContinueButton";
import gridImage from "../../assets/5point_1920x1080.png";
import "./ValidationGrid.css";

const ValidationGrid = ({ onComplete }) => {
  const [showPrompt, setShowPrompt] = useState(true);

  return (
    <div className="validation-grid-container">
      {showPrompt ? (
        <div className="validation-grid-prompt">
          <p>
            Look at each dot for 1 second in the order reflected in numbers on the
            dots.
          </p>
          <ContinueButton onClick={() => setShowPrompt(false)} />
        </div>
      ) : (
        <>
          <img
            src={gridImage}
            alt="5-point validation grid"
            className="validation-grid-image"
          />
          {/* Show the unified Continue button so the user can advance to the next task */}
          <ContinueButton onClick={() => onComplete?.()} />
        </>
      )}
    </div>
  );
};

export default ValidationGrid;