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
  // Add your other two texts here...
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
    let words = cleanedText.match(/[\w'']+|[.,!?;:"""—-]|\s+/g) || [];

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
        height: '100vh',
        width: '100vw',
        display: 'flex',
        flexDirection: 'column',
        fontFamily: 'Arial, sans-serif',
        textAlign: 'center',
        justifyContent: 'center',
        alignItems: 'center',
        position: 'relative',
        backgroundColor: '#fff',
        overflow: 'hidden', // Prevent scrollbars
        boxSizing: 'border-box',
      }}
    >
      {showCross ? (
        <div style={styles.crossContainer}>
          <div style={styles.cross}>+</div>
        </div>
      ) : (
        <>
          {/* Text Section - Takes up 50% of viewport height */}
          <div style={{
            flex: '0 0 50vh',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            padding: '10px',
            boxSizing: 'border-box',
          }}>
            <h3 style={{ 
              margin: '0 0 20px 0',
              fontSize: '18px',
              textAlign: 'center',
            }}>
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
          </div>

          {/* Survey Section - Takes up 50% of viewport height */}
          <div style={{
            flex: '0 0 50vh',
            width: '100%',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            padding: '10px',
            boxSizing: 'border-box',
          }}>
            <iframe
              src="https://unlcorexmuw.qualtrics.com/jfe/form/SV_6YFOhCRXbWEtLxQ?block=text"
              style={{
                width: '90%',
                height: '100%',
                border: 'none',
                borderRadius: '5px',
              }}
              title="Survey"
            />
          </div>
        </>
      )}

      <style>{`
        .word-block {
          display: inline-flex;
          flex-wrap: nowrap;
        }
        .letter {
          font-size: 18px;
        }
        .space {
          width: 3px;
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
    zIndex: 9999,
    backgroundColor: '#fff',
  },
  cross: {
    fontSize: '100px',
    fontWeight: 'bold',
    color: 'black',
  },
};

export default TextTask;
