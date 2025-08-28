import React, { useEffect, useRef, useState } from 'react';

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

function pickRandomText() {
  return TEXTS[Math.floor(Math.random() * TEXTS.length)];
}

const TextTask = () => {
  const [selectedText] = useState(() => pickRandomText());
  const [showCross, setShowCross] = useState(true);
  const [showInstruction, setShowInstruction] = useState(false);
  const formattedTextRef = useRef(null);

  // Store selected text in sessionStorage so TextSurvey can access it
  useEffect(() => {
    sessionStorage.setItem('currentTextTask', JSON.stringify(selectedText));
  }, [selectedText]);

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
    if (showCross || showInstruction) return;

    let sentenceCount = 1;
    let wordCount = 1;
    let character_id = 0;
    let formattedTextContainer = formattedTextRef.current;

    let cleanedText = selectedText.text.replace(/\n+/g, ' ');
    let words = cleanedText.match(/[\w'']+|[.,!?;:"""—-]|\s+/g) || [];

    formattedTextContainer.innerHTML = '';

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

      formattedTextContainer.appendChild(wordBlock);

      if (isWord) {
        wordCount++;
      }

      if (/[.!?]$/.test(word)) {
        sentenceCount++;
      }
    });
  }, [selectedText.text, showCross, showInstruction]);

  return (
    <div style={styles.container}>
      {showCross ? (
        <div style={styles.crossContainer}>
          <div style={styles.cross}>+</div>
        </div>
      ) : showInstruction ? (
        <div style={styles.instructionContainer}>
          <h2 style={styles.instructionText}>
            Please read the following text carefully
          </h2>
        </div>
      ) : (
        <div style={styles.textSection}>
          <div
            ref={formattedTextRef}
            className="formatted-text"
            style={styles.formattedText}
          />
        </div>
      )}

      <style>{`
        .word-block {
          display: inline-flex;
          flex-wrap: nowrap;
        }
        .letter {
          font-size: 1em;
        }
        .space {
          width: 4px;
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
    fontFamily: 'Arial, sans-serif',
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
    zIndex: 9999,
    backgroundColor: '#fff',
  },
  cross: {
    fontSize: '100px',
    fontWeight: 'bold',
    color: 'black',
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
  textSection: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    padding: '20px',
    boxSizing: 'border-box',
  },
  formattedText: {
    display: 'flex',
    flexWrap: 'wrap',
    justifyContent: 'flex-start',
    textAlign: 'left',
    maxWidth: '70%',
    width: '100%',
    lineHeight: 2.5,
    fontSize: '24px',
  },
};

export default TextTask;
