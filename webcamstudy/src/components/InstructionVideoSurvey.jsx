import React, { useState } from 'react';

const InstructionVideoSurvey = ({ onSubmit }) => {
  const [ballTransfers, setBallTransfers] = useState('');
  const [noticedShirtChange, setNoticedShirtChange] = useState('');
  const [noticedGorilla, setNoticedGorilla] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    const result = {
      ballTransfers: parseInt(ballTransfers) || 0,
      noticedShirtChange,
      noticedGorilla,
      timestamp: new Date().toISOString()
    };
    onSubmit?.(result);
  };

  const isFormValid = ballTransfers !== '' && noticedShirtChange !== '' && noticedGorilla !== '';

  return (
    <div style={styles.container}>
      <form onSubmit={handleSubmit} style={styles.form}>
        <h2 style={styles.title}>Video Questions</h2>
        
        {/* Ball Transfers Question */}
        <div style={styles.questionGroup}>
          <h3 style={styles.question}>How many ball transfers did you count?</h3>
          <input
            type="number"
            value={ballTransfers}
            onChange={(e) => setBallTransfers(e.target.value)}
            placeholder="Enter number"
            style={styles.numberInput}
            min="0"
          />
        </div>

        {/* Shirt Change Question */}
        <div style={styles.questionGroup}>
          <h3 style={styles.question}>Did you notice a shirt change?</h3>
          <div style={styles.radioGroup}>
            {['Yes', 'No'].map(option => (
              <label key={option} style={styles.radioLabel}>
                <input
                  type="radio"
                  name="shirtChange"
                  value={option}
                  checked={noticedShirtChange === option}
                  onChange={(e) => setNoticedShirtChange(e.target.value)}
                  style={styles.radio}
                />
                {option}
              </label>
            ))}
          </div>
        </div>

        {/* Gorilla Question */}
        <div style={styles.questionGroup}>
          <h3 style={styles.question}>Did you notice a gorilla?</h3>
          <div style={styles.radioGroup}>
            {['Yes', 'No'].map(option => (
              <label key={option} style={styles.radioLabel}>
                <input
                  type="radio"
                  name="gorilla"
                  value={option}
                  checked={noticedGorilla === option}
                  onChange={(e) => setNoticedGorilla(e.target.value)}
                  style={styles.radio}
                />
                {option}
              </label>
            ))}
          </div>
        </div>
        
        <button
          type="submit"
          disabled={!isFormValid}
          style={{
            ...styles.button,
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
  questionGroup: {
    display: 'flex',
    flexDirection: 'column',
    gap: '15px',
  },
  question: {
    fontSize: '20px',
    color: '#2c3e50',
    textAlign: 'center',
    marginBottom: '10px',
  },
  numberInput: {
    padding: '12px',
    fontSize: '16px',
    border: '2px solid #ddd',
    borderRadius: '8px',
    textAlign: 'center',
    maxWidth: '200px',
    alignSelf: 'center',
    outline: 'none',
    transition: 'border-color 0.3s',
  },
  radioGroup: {
    display: 'flex',
    justifyContent: 'center',
    gap: '30px',
  },
  radioLabel: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    fontSize: '18px',
    cursor: 'pointer',
    padding: '10px 15px',
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
    alignSelf: 'center',
  },
};

export default InstructionVideoSurvey;