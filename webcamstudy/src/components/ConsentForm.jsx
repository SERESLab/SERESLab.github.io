import React, { useState } from 'react';

const ConsentForm = ({ onSubmit }) => {
  const [formData, setFormData] = useState({
    id: '',
    ageRange: '',
    gender: '',
    otherGender: '',
    ethnicity: '',
    classRank: '',
    major: ''
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
      gender: formData.gender === 'Other' ? formData.otherGender : formData.gender,
      timestamp: new Date().toISOString()
    };
    onSubmit?.(finalData);
  };

  const isFormValid = formData.id && formData.ageRange && formData.gender && 
                     formData.ethnicity && formData.classRank && formData.major;

  return (
    <div style={styles.container}>
      <h2 style={styles.title}>Demographic Information</h2>
      <form onSubmit={handleSubmit} style={styles.form}>
        
        <div style={styles.fieldRow}>
          <label style={styles.sideLabel}>ID:</label>
          <input
            type="number"
            value={formData.id}
            onChange={(e) => handleInputChange('id', e.target.value)}
            style={styles.input}
            required
          />
        </div>

        <div style={styles.fieldRow}>
          <label style={styles.sideLabel}>Age Range:</label>
          <div style={styles.radioGroup}>
            {['18-22', '23-27', '28-32', '33-37', '38-42', '43+'].map(range => (
              <label key={range} style={styles.radioLabel}>
                <input
                  type="radio"
                  name="ageRange"
                  value={range}
                  checked={formData.ageRange === range}
                  onChange={(e) => handleInputChange('ageRange', e.target.value)}
                  style={styles.radio}
                />
                {range}
              </label>
            ))}
          </div>
        </div>

        <div style={styles.fieldRow}>
          <label style={styles.sideLabel}>Gender:</label>
          <div style={styles.optionsContainer}>
            <div style={styles.radioGroup}>
              {['Male', 'Female', 'Prefer not to say', 'Other'].map(gender => (
                <label key={gender} style={styles.radioLabel}>
                  <input
                    type="radio"
                    name="gender"
                    value={gender}
                    checked={formData.gender === gender}
                    onChange={(e) => handleInputChange('gender', e.target.value)}
                    style={styles.radio}
                  />
                  {gender}
                </label>
              ))}
            </div>
            {formData.gender === 'Other' && (
              <input
                type="text"
                placeholder="Please specify"
                value={formData.otherGender}
                onChange={(e) => handleInputChange('otherGender', e.target.value)}
                style={styles.inputSmall}
              />
            )}
          </div>
        </div>

        <div style={styles.fieldRow}>
          <label style={styles.sideLabel}>Ethnicity:</label>
          <select
            value={formData.ethnicity}
            onChange={(e) => handleInputChange('ethnicity', e.target.value)}
            style={styles.select}
            required
          >
            <option value="">Select ethnicity</option>
            <option value="American Indian or Alaska Native">American Indian or Alaska Native</option>
            <option value="Asian">Asian</option>
            <option value="Black or African American">Black or African American</option>
            <option value="Hispanic or Latino">Hispanic or Latino</option>
            <option value="Native Hawaiian or Other Pacific Islander">Native Hawaiian or Other Pacific Islander</option>
            <option value="White">White</option>
            <option value="Two or more races">Two or more races</option>
            <option value="Prefer not to say">Prefer not to say</option>
          </select>
        </div>

        <div style={styles.fieldRow}>
          <label style={styles.sideLabel}>Class Rank:</label>
          <div style={styles.radioGroup}>
            {['Freshman', 'Sophomore', 'Junior', 'Senior', 'Masters', 'PHD', 'Industry'].map(rank => (
              <label key={rank} style={styles.radioLabel}>
                <input
                  type="radio"
                  name="classRank"
                  value={rank}
                  checked={formData.classRank === rank}
                  onChange={(e) => handleInputChange('classRank', e.target.value)}
                  style={styles.radio}
                />
                {rank}
              </label>
            ))}
          </div>
        </div>

        <div style={styles.fieldRow}>
          <label style={styles.sideLabel}>Major:</label>
          <input
            type="text"
            value={formData.major}
            onChange={(e) => handleInputChange('major', e.target.value)}
            style={styles.input}
            required
          />
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
    overflow: 'auto',
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
    maxWidth: '800px', // Increased width to accommodate side-by-side layout
    display: 'flex',
    flexDirection: 'column',
    gap: '15px', // Reduced gap since items are more compact
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
    minWidth: '120px', // Fixed width for consistent alignment
    paddingTop: '8px', // Align with first radio button/input
    textAlign: 'right',
  },
  optionsContainer: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
  },
  input: {
    flex: 1,
    padding: '10px',
    fontSize: '14px',
    border: '1px solid #ccc',
    borderRadius: '4px',
    outline: 'none',
    maxWidth: '300px',
  },
  inputSmall: {
    padding: '8px',
    fontSize: '14px',
    border: '1px solid #ccc',
    borderRadius: '4px',
    outline: 'none',
    maxWidth: '200px',
    marginTop: '5px',
  },
  select: {
    flex: 1,
    padding: '10px',
    fontSize: '14px',
    border: '1px solid #ccc',
    borderRadius: '4px',
    outline: 'none',
    maxWidth: '300px',
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
    alignSelf: 'center', // Center the button
  },
};

export default ConsentForm;