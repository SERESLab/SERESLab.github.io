import React, { useEffect, useState } from 'react';

const TrackingDot = () => {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setVisible(false);
    }, 2000); // 2 seconds

    return () => clearTimeout(timer); // Cleanup on unmount
  }, []);

  if (!visible) return null;

  return (
    <div style={styles.container}>
      <div style={styles.cross}>+</div>
    </div>
  );
};

const styles = {
  container: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: '100vh',
    width: '100vw',
    backgroundColor: '#fff',
  },
  cross: {
    fontSize: '100px',
    fontWeight: 'bold',
    color: '#000',
  },
};

export default TrackingDot;
