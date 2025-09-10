import React, { useEffect, useRef, useState } from 'react';
import './VideoTask.css'; // Create this CSS file for styles
import VideoSurvey from './VideoSurvey';

const VIDEO = {
    src: require('../../assets/soccer-vid.mp4'),
    type: 'video/mp4',
  };

const VideoTask = ({ onComplete }) => {
  const [video] = useState(() => VIDEO);
  const [showCross, setShowCross] = useState(true);
  const [showInstruction, setShowInstruction] = useState(false);
  const [videoLoadError, setVideoLoadError] = useState(false);
  const [plyrReady, setPlyrReady] = useState(false);
  const [step, setStep] = useState(0); // 0: video, 1: survey
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
 
    const instructionTimer = setTimeout(() => {
      setShowInstruction(false);
    }, 2000);

    return () => {
      clearTimeout(crossTimer);
      clearTimeout(instructionTimer);
    };
  }, []);

  useEffect(() => {
    if (showCross || showInstruction || !plyrReady || step !== 0) return;

    const script = document.createElement('script');
    script.src = 'https://cdn.plyr.io/3.7.8/plyr.polyfilled.js';
    script.async = true;
    script.onload = () => {
      if (!videoRef.current) return;

      const videoElement = videoRef.current;
      videoElement.classList.add('video-task-video');
      try {
        // eslint-disable-next-line no-undef
        const player = new window.Plyr(videoRef.current, {
          controls: ['play', 'progress', 'current-time', 'mute', 'volume'],
          ratio: null,
          fullscreen: { enabled: false },
        });

        player.on('ready', () => {
          const plyrContainer = videoElement.closest('.plyr');
          if (plyrContainer) {
            plyrContainer.classList.add('video-task-plyr');
          }
          player.play().catch((error) => {
            if (videoRef.current) {
              videoRef.current.muted = false;
              player.play().catch(() => {});
            }
          });
        });

        player.on('error', () => {
          setVideoLoadError(true);
        });

        player.on('ended', () => {
          setStep(1); // Move to survey step
        });
      } catch (error) {
        setVideoLoadError(true);
      }
    };

    script.onerror = () => {
      setVideoLoadError(true);
    };

    document.body.appendChild(script);

    return () => {
      if (document.body.contains(script)) {
        document.body.removeChild(script);
      }
    };
  }, [showCross, showInstruction, plyrReady, video.src, step]);

  // Survey logic
const handleSurveySubmit = (result) => {
    if (typeof onComplete === 'function') {
      onComplete(result);
    }
  };

  return (
    <div className="video-task-container">
      {showCross ? (
        <div className="video-task-cross-container">
          <div className="video-task-cross">+</div>
        </div>
      ) : showInstruction ? (
        <div className="video-task-instruction-container">
          <h2 className="video-task-instruction-text">
            Please watch the following video carefully
          </h2>
        </div>
      ) : step === 0 ? (
        <div className="video-task-video-section">
          {videoLoadError ? (
            <div className="video-task-error-container">
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
              className="video-task-video"
              onError={() => setVideoLoadError(true)}
              onLoadedMetadata={() => {
                if (videoRef.current) {
                  videoRef.current.muted = true;
                }
              }}
            >
              <source src={video.src} type={video.type} />
              Your browser does not support the video tag.
            </video>
          )}
        </div>
      ) : (
       <VideoSurvey onSubmit={handleSurveySubmit} />
      )}
    </div>
  );
};

export default VideoTask;
