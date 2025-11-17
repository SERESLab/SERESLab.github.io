import React from 'react';

/**
 * Reusable Continue button fixed to bottom-right corner.
 * Props:
 *  - onClick: function (ignored if type='submit' and form handles submission)
 *  - disabled: boolean (default false)
 *  - type: 'button' | 'submit' (default 'button')
 *  - form: optional form id to associate when outside form
 */
const ContinueButton = ({ onClick, disabled = false, type = 'button', form }) => {
  const style = {
    position: 'fixed',
    bottom: '30px',
    right: '30px',
    fontSize: '18px',
    backgroundColor: '#3498db',
    color: '#ffffff',
    border: 'none',
    borderRadius: '5px',
    padding: '15px 40px',
    minWidth: '140px',
    boxShadow: '0 4px 8px rgba(0,0,0,0.2)',
    transition: 'all 0.3s ease',
    cursor: disabled ? 'not-allowed' : 'pointer',
    opacity: disabled ? 0.5 : 1,
    zIndex: 1000
  };

  return (
    <button
      type={type}
      form={form}
      onClick={onClick}
      disabled={disabled}
      style={style}
      className="continue-button"
    >
      Continue
    </button>
  );
};

export default ContinueButton;
