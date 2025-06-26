import React, { useEffect, useRef, useState } from 'react';

const TEXTS = [
  // [Your text content remains unchanged]
  // ...
];

function pickRandomText() {
  return TEXTS[Math.floor(Math.random() * TEXTS.length)];
}

const TextTask = () => {
  const [text] = useState(() => pickRandomText());
  const [showCross, setShowCross] = useState(true);
  const formattedTextRef = useRef(null);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowCross(false);
    }, 10000); // Hide tracking cross after 10 seconds

    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (showCross) return;

    let sentenceCount = 1;
    let wordCount = 1;
    let character_id = 0;
    let formattedTextContainer = formattedTextRef.current;

    let cleanedText = text.replace(/\n+/g, ' ');
    let words = cleanedText.match(/[\w’']+|[.,!?;:"”“—-]|\s+/g) || [];

    formattedTextContainer.innerHTML = '';

    words.forEach(word => {
      let isWord = /\w/.test(word);
      let isSpace = /^\s+$/.test(word);
      let wordBlock = document.createElement("span");
      wordBlock.classList.add("word-block");

      if (isWord) {
        wordBlock.dataset.sentence = sentenceCount;
        wordBlock.dataset.word = wordCount;
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
  }, [text, showCross]);

  return (
    <div
      className="textTask"
      style={{
        textAlign: 'center',
        fontFamily: 'Arial, sans-serif',
        height: '100vh',
        width: '100vw',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        position: 'relative',
        backgroundColor: '#fff',
      }}
    >
      {showCross ? (
        <div style={styles.crossContainer}>
          <div style={styles.cross}>+</div>
        </div>
      ) : (
        <>
          <h3 style={{ margin: '2em 25% 0' }}>
            Please read the following text carefully:
          </h3>
          <div
            ref={formattedTextRef}
            className="formatted-text"
            style={{
              display: 'flex',
              flexWrap: 'wrap',
              justifyContent: 'flex-start',
              textAlign: 'left',
              margin: '40px auto',
              maxWidth: '33%',
              width: '100%',
              lineHeight: 2,
            }}
          />
        </>
      )}

      <style>{`
        .word-block {
          display: inline-flex;
          flex-wrap: nowrap;
        }
        .letter {
          font-size: 1.35em;
        }
        .space {
          width: 0.25vw;
        }
      `}</style>
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
    zIndex: 10,
    backgroundColor: '#fff',
  },
  cross: {
    fontSize: '100px',
    fontWeight: 'bold',
    color: '#000',
  },
};

export default TextTask;
