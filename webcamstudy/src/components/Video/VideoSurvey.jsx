import React, { useState } from 'react';
import './VideoTask.css';

const VideoSurvey = ({ onSubmit }) => {
  const [selectedAnswer, setSelectedAnswer] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    const result = {
      selectedAnswer,
      timestamp: new Date().toISOString()
    };
    onSubmit?.(result);
  };

  return (
    <div className="video-task-survey-container">
      <form onSubmit={handleSubmit} className="video-task-survey-form">
        <h2 className="video-task-survey-title">Video Comprehension Question</h2>
        <h3 className="video-task-survey-question">Did the blue team score in the video?</h3>
        <div className="video-task-radio-group">
          {['Yes', 'No'].map(option => (
            <label key={option} className="video-task-radio-label">
              <input
                type="radio"
                name="videoAnswer"
                value={option}
                checked={selectedAnswer === option}
                onChange={(e) => setSelectedAnswer(e.target.value)}
                className="video-task-radio"
                data-re-aoi-name="VideoAwnser"
              />
              {option}
            </label>
          ))}
        </div>
        <button
          type="submit"
          data-re-aoi-name="VideoSubmit"
          disabled={!selectedAnswer}
          className="video-task-survey-button"
          style={{
            opacity: selectedAnswer ? 1 : 0.5,
            cursor: selectedAnswer ? 'pointer' : 'not-allowed'
          }}
        >
          Continue
        </button>
      </form>
    </div>
  );
};

export default VideoSurvey;