import React, { useEffect, useRef, useState } from 'react';
import InstructionVideoSurvey from './InstructionVideoSurvey';
import './Instructions.css';

const INSTRUCTION_VIDEO = {
    src: require('../../assets/monkey_business.mp4'),
    type: 'video/mp4',
  };


const InstructionVideoTask = ({ onComplete }) => {
  const [video] = useState(() => INSTRUCTION_VIDEO);
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

      // Apply initial sizing before Plyr initialization
      const videoElement = videoRef.current;
      videoElement.classList.add('instruction-video');
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
            plyrContainer.classList.add('instruction-plyr');
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

  // Handle survey completion
  const handleSurveyComplete = (result) => {
    if (typeof onComplete === 'function') {
      onComplete(result);
    }
  };

  return (
    <div className="instruction-task-container">
      {showCross ? (
        <div className="instruction-cross-container">
          <div className="instruction-cross">+</div>
        </div>
      ) : showInstruction ? (
        <div className="instruction-instruction-container">
          <h2 className="instruction-instruction-text">
            Count how many times the players wearing white pass the ball.
          </h2>
        </div>
      ) : step === 0 ? (
        <div className="instruction-video-section">
          {videoLoadError ? (
            <div className="instruction-error-container">
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
              className="instruction-video"
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
        <InstructionVideoSurvey onSubmit={handleSurveyComplete} />
      )}
    </div>
  );
};

export default InstructionVideoTask;