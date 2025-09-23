import React, { useEffect, useRef, useState } from 'react';

// 1. Import video files directly at the top
// This is the modern and most reliable way to handle static assets.
import circleVideo from '../assets/smooth-pursuit/Circle.mp4';
import squareVideo from '../assets/smooth-pursuit/Square.mp4';
import infinityVideo from '../assets/smooth-pursuit/Infinity.mp4';
import starVideo from '../assets/smooth-pursuit/Star.mp4';
import triangleVideo from '../assets/smooth-pursuit/Triangle.mp4';
import leftRightVideo from '../assets/smooth-pursuit/left_right.mp4';

// Use the imported variables in your array.
// The 'type' property is no longer needed as we set the src directly.
const SMOOTH_PURSUIT_VIDEOS = [
  { src: circleVideo, name: 'Circle' },
  { src: squareVideo, name: 'Square' },
  { src: infinityVideo, name: 'Infinity' },
  { src: starVideo, name: 'Star' },
  { src: triangleVideo, name: 'Triangle' },
  { src: leftRightVideo, name: 'Left to Right' },
];

const SmoothPursuitVideoTask = ({ onSubmit, onTaskComplete }) => {
  const [currentVideoIndex, setCurrentVideoIndex] = useState(0);
  const [phase, setPhase] = useState('cross'); // 'cross', 'instruction', 'video'
  const [videoEnded, setVideoEnded] = useState(false);
  const [videoError, setVideoError] = useState(false);
  const videoRef = useRef(null);

  const currentVideo = SMOOTH_PURSUIT_VIDEOS[currentVideoIndex];
  const isLastVideo = currentVideoIndex === SMOOTH_PURSUIT_VIDEOS.length - 1;

  // This logic remains the same
  useEffect(() => {
    setPhase('cross');
    setVideoEnded(false);
    setVideoError(false);

    const crossTimer = setTimeout(() => setPhase('instruction'), 1000);
    const instructionTimer = setTimeout(() => setPhase('video'), 2000);

    return () => {
      clearTimeout(crossTimer);
      clearTimeout(instructionTimer);
    };
  }, [currentVideoIndex]);

  // This logic remains the same
  useEffect(() => {
    const video = videoRef.current;
    if (!video || phase !== 'video') return;

    const handleEnded = () => {
      setVideoEnded(true);
      if (isLastVideo) {
        onTaskComplete?.();
      }
    };
    const handleError = (e) => {
      setVideoError(true);
      console.error('Video playback error:', currentVideo.name, e);
    };
    const handleCanPlay = () => {
      setVideoError(false);
      video.play().catch(error => console.warn('Autoplay failed:', error));
    };

    video.addEventListener('ended', handleEnded);
    video.addEventListener('error', handleError);
    video.addEventListener('canplay', handleCanPlay);

    return () => {
      video.removeEventListener('ended', handleEnded);
      video.removeEventListener('error', handleError);
      video.removeEventListener('canplay', handleCanPlay);
    };
  }, [phase, currentVideo, isLastVideo, onTaskComplete]);

  const handleNextVideo = () => {
    if (isLastVideo) {
      const completionData = {
        videosCompleted: SMOOTH_PURSUIT_VIDEOS.length,
        completedAt: new Date().toISOString()
      };
      onSubmit?.(completionData);
      onTaskComplete?.();
    } else {
      setCurrentVideoIndex(prev => prev + 1);
    }
  };

  const renderContent = () => {
    switch (phase) {
      case 'cross':
        return (
          <div style={styles.phaseContainer}>
            <div style={styles.cross}>+</div>
          </div>
        );
      case 'instruction':
        return (
          <div style={styles.phaseContainer}>
            <h2 style={styles.instructionText}>Track the ball in the video</h2>
          </div>
        );
      case 'video':
        return (
          <div style={styles.videoContainer}>
            {videoError ? (
              <div style={styles.errorContainer}>
                <h3>Video Loading Error</h3>
                <p>There was an issue loading: {currentVideo.name}</p>
                <button onClick={handleNextVideo} style={styles.errorButton}>
                  {isLastVideo ? 'Finish Task' : 'Skip to Next Video'}
                </button>
              </div>
            ) : (
              <>
                {/* 2. Set the 'src' attribute directly on the <video> tag */}
                <video
                  ref={videoRef}
                  style={styles.video}
                  src={currentVideo.src}
                  controls
                  muted
                  playsInline
                  preload="auto"
                  controlsList="nodownload nofullscreen noremoteplayback"
                  disablePictureInPicture
                  onContextMenu={(e) => e.preventDefault()}
                  onDoubleClick={(e) => e.preventDefault()}
                >
                  Your browser does not support the video tag.
                </video>
                
                {videoEnded && !isLastVideo && (
                  <button onClick={handleNextVideo} style={styles.nextButton}>
                    Next Video
                  </button>
                )}
              </>
            )}
          </div>
        );
      default:
        return null;
    }
  };

  return <div style={styles.container}>{renderContent()}</div>;
};

// Styles remain the same
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
  phaseContainer: {
    height: '100vh',
    width: '100vw',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  cross: {
    fontSize: '100px',
    fontWeight: 'bold',
    color: '#000',
  },
  instructionText: {
    fontSize: '32px',
    textAlign: 'center',
    fontWeight: 'normal',
    margin: 0,
    color: '#2c3e50',
  },
  videoContainer: {
    height: '100vh',
    width: '100vw',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    padding: '20px',
    boxSizing: 'border-box',
  },
  video: {
    width: '90%',
    height: '80%',
    maxWidth: '1000px',
    maxHeight: '80vh',
    border: 'none',
    background: '#fff',
  },
  nextButton: {
    position: 'absolute',
    bottom: '30px',
    left: '50%',
    transform: 'translateX(-50%)',
    padding: '15px 30px',
    fontSize: '18px',
    backgroundColor: '#3498db',
    color: 'white',
    border: 'none',
    borderRadius: '5px',
    boxShadow: '0 4px 8px rgba(0,0,0,0.2)',
    transition: 'all 0.3s ease',
    cursor: 'pointer',
    minWidth: '200px',
    zIndex: 1000,
  },
  errorContainer: {
    textAlign: 'center',
    padding: '40px',
    backgroundColor: '#f8f9fa',
    border: '1px solid #e9ecef',
    borderRadius: '8px',
    maxWidth: '500px',
  },
  errorButton: {
    padding: '10px 20px',
    fontSize: '16px',
    backgroundColor: '#e74c3c',
    color: 'white',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
    marginTop: '15px',
  },
};

export default SmoothPursuitVideoTask;