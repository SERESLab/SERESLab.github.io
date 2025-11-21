import React, { useState } from 'react';
import ContinueButton from './ContinueButton';

const PostQuestionnaire = ({ onSubmit }) => {
  const [formData, setFormData] = useState({
    difficulty: '',
    hasVisualImpairments: '',
    visualImpairmentsSpecify: '',
    hadReadingProblems: '',
    readingProblemsSpecify: '',
    completedTimely: '',
    thingsLiked: '',
    thingsDisliked: '',
    otherComments: ''
  });

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const finalData = {
      ...formData,
      timestamp: new Date().toISOString()
    };
    onSubmit?.(finalData);
  };

  const isFormValid = formData.difficulty && 
                     formData.hasVisualImpairments && 
                     formData.hadReadingProblems && 
                     formData.completedTimely;

  return (
    <div style={styles.container}>
      <h2 style={styles.title}>Post-Study Questionnaire</h2>
      <form onSubmit={handleSubmit} style={styles.form}>
        
        <div style={styles.fieldRow}>
          <label style={styles.sideLabel}>Overall, how difficult did you find the study?</label>
          <div style={styles.radioGroup}>
            {[1, 2, 3, 4, 5].map(level => (
              <label key={level} style={styles.radioLabel}>
                <input
                  type="radio"
                  name="difficulty"
                  value={level}
                  checked={formData.difficulty === String(level)}
                  onChange={(e) => handleInputChange('difficulty', e.target.value)}
                  style={styles.radio}
                  required
                />
                {level} {level === 1 ? '(Very Easy)' : level === 5 ? '(Very Hard)' : ''}
              </label>
            ))}
          </div>
        </div>

        <div style={styles.fieldRow}>
          <label style={styles.sideLabel}>Do you have any visual impairments?</label>
          <div style={styles.optionsContainer}>
            <div style={styles.radioGroup}>
              {['Yes', 'No'].map(answer => (
                <label key={answer} style={styles.radioLabel}>
                  <input
                    type="radio"
                    name="hasVisualImpairments"
                    value={answer}
                    checked={formData.hasVisualImpairments === answer}
                    onChange={(e) => handleInputChange('hasVisualImpairments', e.target.value)}
                    style={styles.radio}
                    required
                  />
                  {answer}
                </label>
              ))}
            </div>
            {formData.hasVisualImpairments === 'Yes' && (
              <textarea
                placeholder="Please specify"
                value={formData.visualImpairmentsSpecify}
                onChange={(e) => handleInputChange('visualImpairmentsSpecify', e.target.value)}
                style={styles.textarea}
                rows={3}
              />
            )}
          </div>
        </div>

        <div style={styles.fieldRow}>
          <label style={styles.sideLabel}>Did you have any problems reading the text?</label>
          <div style={styles.optionsContainer}>
            <div style={styles.radioGroup}>
              {['Yes', 'No'].map(answer => (
                <label key={answer} style={styles.radioLabel}>
                  <input
                    type="radio"
                    name="hadReadingProblems"
                    value={answer}
                    checked={formData.hadReadingProblems === answer}
                    onChange={(e) => handleInputChange('hadReadingProblems', e.target.value)}
                    style={styles.radio}
                    required
                  />
                  {answer}
                </label>
              ))}
            </div>
            {formData.hadReadingProblems === 'Yes' && (
              <textarea
                placeholder="Please specify"
                value={formData.readingProblemsSpecify}
                onChange={(e) => handleInputChange('readingProblemsSpecify', e.target.value)}
                style={styles.textarea}
                rows={3}
              />
            )}
          </div>
        </div>

        <div style={styles.fieldRow}>
          <label style={styles.sideLabel}>Did you complete the tasks in a reasonably timely manner?</label>
          <div style={styles.radioGroup}>
            {['Yes', 'No'].map(answer => (
              <label key={answer} style={styles.radioLabel}>
                <input
                  type="radio"
                  name="completedTimely"
                  value={answer}
                  checked={formData.completedTimely === answer}
                  onChange={(e) => handleInputChange('completedTimely', e.target.value)}
                  style={styles.radio}
                  required
                />
                {answer}
              </label>
            ))}
          </div>
        </div>

        <div style={styles.fieldRow}>
          <label style={styles.sideLabel}>What are things you liked about this study?</label>
          <textarea
            value={formData.thingsLiked}
            onChange={(e) => handleInputChange('thingsLiked', e.target.value)}
            style={styles.textarea}
            rows={4}
            placeholder="Please share what you liked about the study"
          />
        </div>

        <div style={styles.fieldRow}>
          <label style={styles.sideLabel}>What are things you disliked about this study?</label>
          <textarea
            value={formData.thingsDisliked}
            onChange={(e) => handleInputChange('thingsDisliked', e.target.value)}
            style={styles.textarea}
            rows={4}
            placeholder="Please share what you disliked about the study"
          />
        </div>

        <div style={styles.fieldRow}>
          <label style={styles.sideLabel}>Please write any other comments or concerns</label>
          <textarea
            value={formData.otherComments}
            onChange={(e) => handleInputChange('otherComments', e.target.value)}
            style={styles.textarea}
            rows={4}
            placeholder="Any additional comments or concerns"
          />
        </div>

        <ContinueButton type="submit" disabled={!isFormValid} />
      </form>
    </div>
  );
};

const styles = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'flex-start',
    minHeight: '100vh',
    width: '100%',
    fontFamily: 'Arial, sans-serif',
    backgroundColor: '#fff',
    overflowY: 'auto',
    padding: '20px',
    boxSizing: 'border-box',
  },
  title: {
    marginBottom: '30px',
    fontSize: '24px',
    color: '#2c3e50',
  },
  form: {
    width: '100%',
    maxWidth: '800px',
    display: 'flex',
    flexDirection: 'column',
    gap: '15px',
  },
  fieldRow: {
    display: 'flex',
    alignItems: 'flex-start',
    gap: '20px',
    minHeight: '40px',
  },
  sideLabel: {
    fontSize: '16px',
    fontWeight: 'bold',
    color: '#2c3e50',
    minWidth: '200px',
    paddingTop: '8px',
    textAlign: 'right',
  },
  optionsContainer: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
  },
  textarea: {
    flex: 1,
    padding: '10px',
    fontSize: '14px',
    border: '1px solid #ccc',
    borderRadius: '4px',
    outline: 'none',
    fontFamily: 'Arial, sans-serif',
    resize: 'vertical',
    minHeight: '80px',
  },
  radioGroup: {
    display: 'flex',
    flexDirection: 'column',
    gap: '6px',
  },
  radioLabel: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    fontSize: '14px',
    cursor: 'pointer',
  },
  radio: {
    margin: 0,
  },
};

export default PostQuestionnaire;

