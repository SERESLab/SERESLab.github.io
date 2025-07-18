import React, { useEffect, useRef, useState } from 'react';

const TEXTS = [
  `Twas brillig, and the slithy toves
Did gyre and gimble in the wabe:
All mimsy were the borogoves,
And the mome raths outgrabe.

"Beware the Jabberwock, my son!
The jaws that bite, the claws that catch!
Beware the Jubjub bird, and shun
The frumious Bandersnatch!"

He took his vorpal sword in hand;
Long time the manxome foe he sought—
So rested he by the Tumtum tree
And stood awhile in thought.

And, as in uffish thought he stood,
The Jabberwock, with eyes of flame,
Came whiffling through the tulgey wood,
And burbled as it came!

One, two! One, two! And through and through
The vorpal blade went snicker-snack!
He left it dead, and with its head
He went galumphing back.

"And hast thou slain the Jabberwock?
Come to my arms, my beamish boy!
O frabjous day! Callooh! Callay!"
He chortled in his joy.

'Twas brillig, and the slithy toves
Did gyre and gimble in the wabe:
All mimsy were the borogoves,
And the mome raths outgrabe.`,
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
    }, 1000);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (showCross) return;

    let sentenceCount = 1;
    let wordCount = 1;
    let character_id = 0;
    let formattedTextContainer = formattedTextRef.current;

    let cleanedText = text.replace(/\n+/g, ' ');
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
  }, [text, showCross]);

  return (
    <div style={styles.container}>
      {showCross ? (
        <div style={styles.crossContainer}>
          <div style={styles.cross}>+</div>
        </div>
      ) : (
        <div style={styles.textSection}>
          <h3 style={styles.title}>
            Please read the following text carefully:
          </h3>
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
  textSection: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    padding: '20px',
    boxSizing: 'border-box',
  },
  title: {
    margin: '0 0 40px 0',
    fontSize: '24px',
    textAlign: 'center',
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
