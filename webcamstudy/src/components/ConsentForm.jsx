import React from 'react';

const ConsentForm = () => {
  return (
    <div className="container" style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      height: '100%',
      fontFamily: 'Arial, sans-serif',
      boxSizing: 'border-box',
    }}>
      <h2>Demographic Information</h2>
      <iframe 
        src="https://unlcorexmuw.qualtrics.com/jfe/form/SV_3QwHelT1w9lmD3w" 
        height="800px" 
        width="600px"
        title="Consent Form"
      />
    </div>
  );
};

export default ConsentForm;