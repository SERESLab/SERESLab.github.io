import React, { useState, useEffect } from 'react';

const TextSurvey = ({ onSubmit }) => {
  const [selectedAnswer, setSelectedAnswer] = useState('');
  const [currentTextTask, setCurrentTextTask] = useState(null);

  useEffect(() => {
    // Get the current text task from sessionStorage
    const storedTextTask = sessionStorage.getItem('currentTextTask');
    if (storedTextTask) {
      setCurrentTextTask(JSON.parse(storedTextTask));
    }
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    const result = {
      selectedAnswer,
      correctAnswer: currentTextTask?.correctAnswer,
      isCorrect: selectedAnswer === currentTextTask?.correctAnswer,
      textId: currentTextTask?.id,
      timestamp: new Date().toISOString()
    };
    onSubmit?.(result);
  };

  if (!currentTextTask) {
    return (
      <div style={styles.container}>
        <div>Loading question...</div>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <form onSubmit={handleSubmit} style={styles.form}>
        <h2 style={styles.title}>Text Comprehension Question</h2>
        <h3 style={styles.question}>{currentTextTask.question}</h3>
        
        <div style={styles.radioGroup}>
          {currentTextTask.answers.map(option => (
            <label key={option} style={styles.radioLabel}>
              <input
                type="radio"
                name="textAnswer"
                value={option}
                checked={selectedAnswer === option}
                onChange={(e) => setSelectedAnswer(e.target.value)}
                style={styles.radio}
              />
              {option}
            </label>
          ))}
        </div>
        
        <button
          type="submit"
          disabled={!selectedAnswer}
          style={{
            ...styles.button,
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

const styles = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    height: '100vh',
    width: '100vw',
    fontFamily: 'Arial, sans-serif',
    backgroundColor: '#fff',
    padding: '20px',
    boxSizing: 'border-box',
  },
  form: {
    width: '100%',
    maxWidth: '600px',
    display: 'flex',
    flexDirection: 'column',
    gap: '30px',
  },
  title: {
    fontSize: '28px',
    color: '#2c3e50',
    textAlign: 'center',
    marginBottom: '20px',
  },
  question: {
    fontSize: '20px',
    color: '#2c3e50',
    textAlign: 'center',
    marginBottom: '20px',
  },
  radioGroup: {
    display: 'flex',
    flexDirection: 'column',
    gap: '15px',
  },
  radioLabel: {
    display: 'flex',
    alignItems: 'center',
    gap: '15px',
    fontSize: '18px',
    cursor: 'pointer',
    padding: '10px',
    borderRadius: '5px',
    transition: 'background-color 0.2s',
  },
  radio: {
    margin: 0,
    transform: 'scale(1.2)',
  },
  button: {
    padding: '15px 40px',
    fontSize: '18px',
    backgroundColor: '#3498db',
    color: 'white',
    border: 'none',
    borderRadius: '5px',
    marginTop: '20px',
    minWidth: '140px',
    boxShadow: '0 4px 8px rgba(0,0,0,0.2)',
    transition: 'all 0.3s ease',
  },
};

export default TextSurvey;