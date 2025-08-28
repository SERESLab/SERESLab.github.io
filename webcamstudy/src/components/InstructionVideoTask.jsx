import React, { useEffect, useRef, useState } from 'react';

const INSTRUCTION_VIDEOS = [
  {
    src: require('../assets/monkey_business.mp4'), // You'll need to add this video file
    type: 'video/mp4',
  },
];

function pickRandomVideo() {
  return INSTRUCTION_VIDEOS[Math.floor(Math.random() * INSTRUCTION_VIDEOS.length)];
}

const InstructionVideoTask = ({ onVideoEnded }) => {
  const [video] = useState(() => pickRandomVideo());
  const [showCross, setShowCross] = useState(true);
  const [showInstruction, setShowInstruction] = useState(false);
  const [videoLoadError, setVideoLoadError] = useState(false);
  const [plyrReady, setPlyrReady] = useState(false);
  const videoRef = useRef(null);

  // Preload Plyr CSS to prevent layout shifts
  useEffect(() => {
    const plyrCss = document.createElement('link');
    plyrCss.rel = 'stylesheet';
    plyrCss.href = 'https://cdn.plyr.io/3.7.8/plyr.css';
    plyrCss.onload = () => setPlyrReady(true);
    document.head.appendChild(plyrCss);

    return () => {
      if (document.head.contains(plyrCss)) {
        document.head.removeChild(plyrCss);
      }
    };
  }, []);

  useEffect(() => {
    // First show cross for 1 second
    const crossTimer = setTimeout(() => {
      setShowCross(false);
      setShowInstruction(true);
    }, 1000);

    // Then show instruction for 1 second  
    const instructionTimer = setTimeout(() => {
      setShowInstruction(false);
    }, 2000);

    return () => {
      clearTimeout(crossTimer);
      clearTimeout(instructionTimer);
    };
  }, []);

  useEffect(() => {
    if (showCross || showInstruction || !plyrReady) return;

    const script = document.createElement('script');
    script.src = 'https://cdn.plyr.io/3.7.8/plyr.polyfilled.js';
    script.async = true;
    script.onload = () => {
      if (!videoRef.current) return;

      // Apply initial sizing before Plyr initialization
      const videoElement = videoRef.current;
      videoElement.style.width = '90%';
      videoElement.style.height = '90%';
      videoElement.style.maxWidth = '1000px';
      videoElement.style.maxHeight = '80vh';

      try {
        // eslint-disable-next-line no-undef
        const player = new window.Plyr(videoRef.current, {
          controls: ['play', 'progress', 'current-time', 'mute', 'volume'],
          ratio: null, // Maintain original video ratio
          fullscreen: { enabled: false }, // Disable fullscreen to maintain our sizing
        });

        player.on('ready', () => {
          // Ensure sizing is maintained after Plyr initialization
          const plyrContainer = videoElement.closest('.plyr');
          if (plyrContainer) {
            plyrContainer.style.width = '90%';
            plyrContainer.style.height = '90%';
            plyrContainer.style.maxWidth = '1000px';
            plyrContainer.style.maxHeight = '80vh';
          }
          
          player.play().catch((error) => {
            console.log('Autoplay failed, trying without muted:', error);
            // Fallback: try to play without muted attribute
            if (videoRef.current) {
              videoRef.current.muted = false;
              player.play().catch((fallbackError) => {
                console.log('Fallback play also failed:', fallbackError);
              });
            }
          });
        });

        player.on('error', () => {
          setVideoLoadError(true);
        });

        player.on('ended', () => {
          if (onVideoEnded) {
            onVideoEnded();
          }
        });
      } catch (error) {
        console.error('Error initializing Plyr:', error);
        setVideoLoadError(true);
      }
    };

    script.onerror = () => {
      console.error('Failed to load Plyr script');
      setVideoLoadError(true);
    };

    document.body.appendChild(script);

    return () => {
      if (document.body.contains(script)) {
        document.body.removeChild(script);
      }
    };
  }, [showCross, showInstruction, plyrReady, video.src, onVideoEnded]);

  return (
    <div style={styles.container}>
      {showCross ? (
        <div style={styles.crossContainer}>
          <div style={styles.cross}>+</div>
        </div>
      ) : showInstruction ? (
        <div style={styles.instructionContainer}>
          <h2 style={styles.instructionText}>
            Follow the instructions given in the video
          </h2>
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
              onLoadedMetadata={() => {
                // Ensure size is maintained when metadata loads
                if (videoRef.current) {
                  const video = videoRef.current;
                  video.style.width = '90%';
                  video.style.height = '90%';
                  video.style.maxWidth = '1000px';
                  video.style.maxHeight = '80vh';
                }
              }}
            >
              <source src={video.src} type={video.type} />
              Your browser does not support the video tag.
            </video>
          )}
        </div>
      )}

      <style>{`
        .plyr {
          width: 90% !important;
          height: 90% !important;
          max-width: 1000px !important;
          max-height: 80vh !important;
        }
        .plyr__video-wrapper {
          width: 100% !important;
          height: 100% !important;
        }
        .plyr video {
          width: 100% !important;
          height: 100% !important;
          object-fit: contain !important;
        }
      `}</style>
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
  instructionContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    height: '100vh',
    width: '100vw',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 9999,
    backgroundColor: '#fff',
  },
  instructionText: {
    fontSize: '32px',
    textAlign: 'center',
    fontWeight: 'normal',
    margin: 0,
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
    background: '#fff',
    objectFit: 'contain',
  },
  errorContainer: {
    textAlign: 'center',
    padding: '40px',
    backgroundColor: '#f8f9fa',
    border: '1px solid #e9ecef',
    borderRadius: '8px',
    maxWidth: '500px',
  }
};

export default InstructionVideoTask;