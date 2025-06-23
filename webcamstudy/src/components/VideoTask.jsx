import React, { useEffect, useRef, useState } from 'react';

// List of video sources and poster images if needed
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
  const videoRef = useRef(null);

  useEffect(() => {
    // Dynamically load Plyr CSS
    const plyrCss = document.createElement('link');
    plyrCss.rel = 'stylesheet';
    plyrCss.href = 'https://cdn.plyr.io/3.7.8/plyr.css';
    document.head.appendChild(plyrCss);

    // Dynamically load Plyr JS and initialize
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

    // Cleanup
    return () => {
      document.head.removeChild(plyrCss);
      document.body.removeChild(script);
    };
  }, []);

  return (
    <div
      className="videoTask"
      style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100%',
        width: '100%',
        boxSizing: 'border-box',
        padding: '20px',
      }}
    >
      <video
        ref={videoRef}
        controls
        crossOrigin="anonymous"
        playsInline
        style={{
          width: '80vw',
          height: 'auto',
          maxWidth: '900px',
          maxHeight: '80vh',
          border: '1px solid #ccc',
          borderRadius: 5,
          boxShadow: '0 4px 8px rgba(0,0,0,0.2)',
          background: '#000',
        }}
      >
        <source src={video.src} type={video.type} />
        Your browser does not support the video tag.
      </video>
    </div>
  );
};

export default VideoTask;