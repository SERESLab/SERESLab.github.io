import React, { useState } from 'react';
import './Instructions.css';

const InstructionVideoSurvey = ({ onSubmit }) => {
  const [ballTransfers, setBallTransfers] = useState('');
  const [curtainColor, setCurtainColor] = useState('');
  const [noticedGorilla, setNoticedGorilla] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    const result = {
      ballTransfers: parseInt(ballTransfers) || 0,
      curtainColor,
      noticedGorilla,
      timestamp: new Date().toISOString()
    };
    onSubmit?.(result);
  };

  const isFormValid = ballTransfers !== '' && curtainColor.trim() !== '' && noticedGorilla !== '';

  return (
    <div className="instruction-survey-container">
      <form onSubmit={handleSubmit} className="instruction-survey-form">
        <h2 className="instruction-survey-title">Video Questions</h2>
        
        {/* Ball Transfers Question */}
        <div className="instruction-survey-question-group">
          <h3 className="instruction-survey-question">How many times did the players wearing white pass the ball?</h3>
          <input
            type="number"
            value={ballTransfers}
            onChange={(e) => setBallTransfers(e.target.value)}
            placeholder="Enter number"
            className="instruction-survey-input"
            min="0"
          />
        </div>

        {/* Curtain Color Question */}
        <div className="instruction-survey-question-group">
          <h3 className="instruction-survey-question">What was the color of the curtain in the background at the end of the video?</h3>
          <input
            type="text"
            value={curtainColor}
            onChange={(e) => setCurtainColor(e.target.value)}
            placeholder="Enter color"
            className="instruction-survey-input"
          />
        </div>

        {/* Gorilla Question */}
        <div className="instruction-survey-question-group">
          <h3 className="instruction-survey-question">Did you notice the gorilla walking through the middle of the frame?</h3>
          <div className="instruction-survey-radio-group">
            {['Yes', 'No'].map(option => (
              <label key={option} className="instruction-survey-radio-label">
                <input
                  type="radio"
                  name="gorilla"
                  value={option}
                  checked={noticedGorilla === option}
                  onChange={(e) => setNoticedGorilla(e.target.value)}
                  className="instruction-survey-radio"
                />
                {option}
              </label>
            ))}
          </div>
        </div>
        
        <button
          type="submit"
          disabled={!isFormValid}
          className="instruction-survey-button"
          style={{
            opacity: isFormValid ? 1 : 0.5,
            cursor: isFormValid ? 'pointer' : 'not-allowed'
          }}
        >
          Continue
        </button>
      </form>
    </div>
  );
};

export default InstructionVideoSurvey;