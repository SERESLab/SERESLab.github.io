import React, { useEffect, useRef, useState } from 'react';

const VIDEOS = [
  {
    src: require('../assets/Fumble.mp4'),
    type: 'video/mp4',
  },
  {
    src: require('../assets/clip2.mp4'),
    type: 'video/mp4',
  },
  {
    src: require('../assets/clip3.mp4'),
    type: 'video/mp4',
  },
];

function pickRandomVideo() {
  return VIDEOS[Math.floor(Math.random() * VIDEOS.length)];
}

const VideoTask = () => {
  const [video] = useState(() => pickRandomVideo());
  const [showCross, setShowCross] = useState(true);
  const videoRef = useRef(null);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowCross(false);
    }, 10000); // 10s

    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (showCross) return;

    const plyrCss = document.createElement('link');
    plyrCss.rel = 'stylesheet';
    plyrCss.href = 'https://cdn.plyr.io/3.7.8/plyr.css';
    document.head.appendChild(plyrCss);

    const script = document.createElement('script');
    script.src = 'https://cdn.plyr.io/3.7.8/plyr.polyfilled.js';
    script.async = true;
    script.onload = () => {
      // eslint-disable-next-line no-undef
      new window.Plyr(videoRef.current, {
        controls: ['play', 'progress', 'current-time', 'mute', 'volume'],
      });
    };
    document.body.appendChild(script);

    return () => {
      document.head.removeChild(plyrCss);
      document.body.removeChild(script);
    };
  }, [showCross]);

  return (
    <div
      className="videoTask"
      style={{
        height: '100vh',
        width: '100vw',
        display: 'flex',
        flexDirection: 'column',
        position: 'relative',
        backgroundColor: '#fff',
        overflow: 'hidden', // Prevent scrollbars
        boxSizing: 'border-box',
      }}
    >
      {showCross ? (
        <div style={styles.crossContainer}>
          <div style={styles.cross}>+</div>
        </div>
      ) : (
        <>
          {/* Video Section - Takes up 60% of viewport height */}
          <div
            style={{
              flex: '0 0 60vh',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              padding: '10px',
              boxSizing: 'border-box',
            }}
          >
            <video
              ref={videoRef}
              controls
              crossOrigin="anonymous"
              playsInline
              style={{
                width: '90%',
                height: '90%',
                maxWidth: '800px',
                border: '1px solid #ccc',
                borderRadius: 5,
                boxShadow: '0 4px 8px rgba(0,0,0,0.2)',
                background: '#000',
                objectFit: 'contain',
              }}
            >
              <source src={video.src} type={video.type} />
              Your browser does not support the video tag.
            </video>
          </div>

          {/* Survey Section - Takes up 40% of viewport height */}
          <div
            style={{
              flex: '0 0 40vh',
              width: '100%',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              padding: '10px',
              boxSizing: 'border-box',
            }}
          >
            <iframe
              src="https://unlcorexmuw.qualtrics.com/jfe/form/SV_6YFOhCRXbWEtLxQ?block=video"
              style={{
                width: '95%',
                height: '100%',
                border: 'none',
                borderRadius: '5px',
              }}
              title="Video Survey"
            />
          </div>
        </>
      )}
    </div>
  );
};

const styles = {
  crossContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    height: '100vh',
    width: '100vw',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
    zIndex: 9999,
  },
  cross: {
    fontSize: '100px',
    fontWeight: 'bold',
    color: '#000',
  },
};

export default VideoTask;
