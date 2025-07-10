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
  const [videoLoadError, setVideoLoadError] = useState(false);
  const videoRef = useRef(null);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowCross(false);
    }, 1000);

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
      if (!videoRef.current) return;

      // eslint-disable-next-line no-undef
      const player = new window.Plyr(videoRef.current, {
        controls: ['play', 'progress', 'current-time', 'mute', 'volume'],
      });

      player.on('ready', () => {
        player.play().catch((error) => {
          // Fallback: try to play without muted attribute
          videoRef.current.muted = false;
          player.play();
        });
      });

      player.on('error', () => {
        setVideoLoadError(true);
      });
    };

    document.body.appendChild(script);

    return () => {
      if (document.head.contains(plyrCss)) {
        document.head.removeChild(plyrCss);
      }
      if (document.body.contains(script)) {
        document.body.removeChild(script);
      }
    };
  }, [showCross, video.src]);

  return (
    <div style={styles.container}>
      {showCross ? (
        <div style={styles.crossContainer}>
          <div style={styles.cross}>+</div>
        </div>
      ) : (
        <div style={styles.videoSection}>
          {videoLoadError ? (
            <div style={styles.errorContainer}>
              <h3>Video Loading Error</h3>
              <p>There was an issue loading the video file: {video.src}</p>
              <p>Please check the file format and try again.</p>
            </div>
          ) : (
            <video
              ref={videoRef}
              controls
              autoPlay
              muted
              crossOrigin="anonymous"
              playsInline
              style={styles.video}
              onError={() => setVideoLoadError(true)}
            >
              <source src={video.src} type={video.type} />
              Your browser does not support the video tag.
            </video>
          )}
        </div>
      )}
    </div>
  );
};

const styles = {
  container: {
    height: '100vh',
    width: '100vw',
    display: 'flex',
    flexDirection: 'column',
    position: 'relative',
    backgroundColor: '#fff',
    overflow: 'hidden',
    boxSizing: 'border-box',
  },
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
  videoSection: {
    flex: 1,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    padding: '20px',
    boxSizing: 'border-box',
  },
  video: {
    width: '90%',
    height: '90%',
    maxWidth: '1000px',
    maxHeight: '80vh',
    border: '1px solid #ccc',
    borderRadius: 5,
    boxShadow: '0 4px 8px rgba(0,0,0,0.2)',
    background: '#000',
    objectFit: 'contain',
  },
  errorContainer: {
    textAlign: 'center',
    padding: '40px',
    backgroundColor: '#f8f9fa',
    border: '1px solid #e9ecef',
    borderRadius: '8px',
    maxWidth: '500px',
  },
};

export default VideoTask;
