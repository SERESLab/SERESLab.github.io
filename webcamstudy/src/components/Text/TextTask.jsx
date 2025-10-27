import React, { useState, useEffect, useRef, useImperativeHandle, forwardRef } from 'react';
import './TextTask.css';

const TEXTS = [
  {
    id: 1,
    text: `In addition, a study was made of the planet's surface, which is covered by an ocean dotted with innumerable flat, low-lying islands whose combined area is less than that of Europe, although the diameter of Solaris is a fifth greater than Earth's. These expanses of barren, rocky territory, irregularly distributed, are largely concentrated in the southern hemisphere.`,
    question: "What is the planet's surface like?",
    answers: [
      'It has many low-lying islands.',
      'It has an island the size of Europe.',
      'It is a rocky area of around 600 square miles.',
      'It is mostly desert-like.'
    ],
    correctAnswer: 'It has many low-lying islands.'
  },
  {
    id: 2,
    text: `The discovery of Solaris dated from about 100 years before I was born. The planet orbits two suns: a red sun and a blue sun. For 45 years after its discovery, no spacecraft had visited Solaris. At that time, the Gamow-Shapley theory — that life was impossible on planets which are satellites of two solar bodies — was firmly believed. The orbit is constantly being modified by variations in the gravitational pull in the course of its revolutions around the two suns.`,
    question: "How many suns does Solaris orbit around?",
    answers: [
      'Four',
      'Two',
      'One',
      'None'
    ],
    correctAnswer: 'Two'
  }
];

const formatText = (text, ref) => {
  if (!ref.current) return;
  let sentenceCount = 1;
  let wordCount = 1;
  let character_id = 0;
  let cleanedText = text.replace(/\n+/g, ' ');
  let words = cleanedText.match(/[\w'']+|[.,!?;:"""—-]|\s+/g) || [];
  ref.current.innerHTML = '';
  words.forEach(word => {
    let isWord = /\w/.test(word);
    let isSpace = /^\s+$/.test(word);
    let wordBlock = document.createElement("span");
    wordBlock.classList.add("word-block");
    if (isWord) {
      wordBlock.setAttribute("data-re-aoi-name", `s${sentenceCount}-w${wordCount}`);
    }
    word.split('').forEach(char => {
      let charSpan = document.createElement("span");
      charSpan.textContent = isSpace ? '' : char;
      charSpan.setAttribute("data-re-aoi-name", character_id++);
      charSpan.classList.add(isSpace ? "space" : "letter");
      wordBlock.appendChild(charSpan);
    });
    ref.current.appendChild(wordBlock);
    if (isWord) wordCount++;
    if (/[.!?]$/.test(word)) sentenceCount++;
  });
};

const TextTask = forwardRef(({ onComplete }, ref) => {
  const [showCross, setShowCross] = useState(true);
  const [showInstruction, setShowInstruction] = useState(false);
  const [step, setStep] = useState(0); // 0: text1, 1: q1, 2: text2, 3: q2
  const [answers, setAnswers] = useState({ 1: '', 2: '' });
  const textRefs = [useRef(null), useRef(null)];

  useEffect(() => {
    // Show cross for 1s, then instruction for 1s, then show texts/questions
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
    if (!showCross && !showInstruction && (step === 0 || step === 2)) {
      formatText(TEXTS[step === 0 ? 0 : 1].text, textRefs[step === 0 ? 0 : 1]);
    }
  }, [showCross, showInstruction, step]);

  // Progress through text/question steps
  const handleContinue = (e) => {
    e.preventDefault();
    setStep(step + 1);
  };

  // Handle radio button selection
  const handleRadio = (id, value) => {
    setAnswers(prev => {
      const updated = { ...prev, [id]: value };
      // If on last question and both answers are filled, signal completion
      if (step === 3 && updated[2] && typeof onComplete === 'function') {
        onComplete();
      }
      return updated;
    });
  };

  // Expose getResults to parent via ref
  useImperativeHandle(ref, () => ({
    getResults: () => TEXTS.map(t => ({
      textId: t.id,
      selectedAnswer: answers[t.id],
      correctAnswer: t.correctAnswer,
      isCorrect: answers[t.id] === t.correctAnswer,
      timestamp: new Date().toISOString()
    })),
    isComplete: () => step === 3 && answers[2]
  }));

  return (
    <div className="text-task-container">
      {showCross ? (
        <div className="cross-container">
          <div className="cross">+</div>
        </div>
      ) : showInstruction ? (
        <div className="instruction-container">
          <h2 className="instruction-text">
            Please read the following texts carefully
          </h2>
        </div>
      ) : step === 0 ? (
        <form onSubmit={handleContinue} className="text-task-form">
          <div className="text-block">
            <div
              ref={textRefs[0]}
              className="formatted-text"
            />
          </div>
          <div className="button-row">
            <button type="submit" className="text-task-button">Continue</button>
          </div>
        </form>
      ) : step === 1 ? (
        <form onSubmit={handleContinue} className="text-task-form">
          <div className="text-block">
            <h3 className="question">{TEXTS[0].question}</h3>
            <div className="radio-group">
              {TEXTS[0].answers.map(option => (
                <label key={option} className="radio-label">
                  <input
                    type="radio"
                    name="textAnswer1"
                    value={option}
                    checked={answers[1] === option}
                    onChange={() => handleRadio(1, option)}
                    className="radio"
                    data-re-aoi-name="TextAwnser1"
                  />
                  {option}
                </label>
              ))}
            </div>
          </div>
          <div className="button-row">
            <button
              type="submit"
              disabled={!answers[1]}
              className="text-task-button"
              data-re-aoi-name="TextSubmit"
            >
              Continue
            </button>
          </div>
        </form>
      ) : step === 2 ? (
        <form onSubmit={handleContinue} className="text-task-form">
          <div className="text-block">
            <div
              ref={textRefs[1]}
              className="formatted-text"
            />
          </div>
          <div className="button-row">
            <button type="submit" className="text-task-button">Continue</button>
          </div>
        </form>
      ) : step === 3 ? (
        <div className="text-task-form">
          <div className="text-block">
            <h3 className="question">{TEXTS[1].question}</h3>
            <div className="radio-group">
              {TEXTS[1].answers.map(option => (
                <label key={option} className="radio-label">
                  <input
                    type="radio"
                    name="textAnswer2"
                    value={option}
                    checked={answers[2] === option}
                    onChange={() => handleRadio(2, option)}
                    data-re-aoi-name="TextQuestion2"
                    className="radio"
                  />
                  {option}
                </label>
              ))}
            </div> 
          </div>
          {/* No button here; Next Task button from App.jsx will appear */}
        </div>
      ) : null}
    </div>
  );
});

export default TextTask;
