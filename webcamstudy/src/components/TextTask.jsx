import React, { useEffect, useRef, useState } from 'react';

const TEXTS = [
  // textTask.html
  `Twas brillig, and the slithy toves
Did gyre and gimble in the wabe:
All mimsy were the borogoves,
And the mome raths outgrabe.

“Beware the Jabberwock, my son!
The jaws that bite, the claws that catch!
Beware the Jubjub bird, and shun
The frumious Bandersnatch!”

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

“And hast thou slain the Jabberwock?
Come to my arms, my beamish boy!
O frabjous day! Callooh! Callay!”
He chortled in his joy.

’Twas brillig, and the slithy toves
Did gyre and gimble in the wabe:
All mimsy were the borogoves,
And the mome raths outgrabe.`,
  // textTask2.html
  `This time Alice waited patiently until it chose to speak again.
In a minute or two the Caterpillar took the hookah out of its mouth and yawned once or twice, and shook itself.
Then it got down off the mushroom, and crawled away in the grass, merely remarking as it went, “One side will make you grow taller, and the other side will make you grow shorter.”
“One side of what? The other side of what?” thought Alice to herself.
“Of the mushroom,” said the Caterpillar, just as if she had asked it aloud; and in another moment it was out of sight.
Alice remained looking thoughtfully at the mushroom for a minute, trying to make out which were the two sides of it; and as it was perfectly round, she found this a very difficult question.
However, at last she stretched her arms round it as far as they would go, and broke off a bit of the edge with each hand.
“And now which is which?” she said to herself, and nibbled a little of the right-hand bit to try the effect: the next moment she felt a violent blow underneath her chin: it had struck her foot!
She was a good deal frightened by this very sudden change, but she felt that there was no time to be lost, as she was shrinking rapidly; so she set to work at once to eat some of the other bit.
Her chin was pressed so closely against her foot, that there was hardly room to open her mouth; but she did it at last, and managed to swallow a morsel of the lefthand bit.`,
  // textTask3.html
  `As soon as she had made out the proper way of nursing it, (which was to twist it up into a sort of knot, and then keep tight hold of its right ear and left foot, so as to prevent its undoing itself,) she carried it out into the open air. “If I don’t take this child away with me,” thought Alice, “they’re sure to kill it in a day or two: wouldn’t it be murder to leave it behind?” She said the last words out loud, and the little thing grunted in reply (it had left off sneezing by this time). “Don’t grunt,” said Alice; “that’s not at all a proper way of expressing yourself.”

The baby grunted again, and Alice looked very anxiously into its face to see what was the matter with it. There could be no doubt that it had a very turn-up nose, much more like a snout than a real nose; also its eyes were getting extremely small for a baby: altogether Alice did not like the look of the thing at all. “But perhaps it was only sobbing,” she thought, and looked into its eyes again, to see if there were any tears.

No, there were no tears. “If you’re going to turn into a pig, my dear,” said Alice, seriously, “I’ll have nothing more to do with you. Mind now!” The poor little thing sobbed again (or grunted, it was impossible to say which), and they went on for some while in silence.

Alice was just beginning to think to herself, “Now, what am I to do with this creature when I get it home?” when it grunted again, so violently, that she looked down into its face in some alarm. This time there could be no mistake about it: it was neither more nor less than a pig, and she felt that it would be quite absurd for her to carry it further.

So she set the little creature down, and felt quite relieved to see it trot away quietly into the wood. “If it had grown up,” she said to herself, “it would have made a dreadfully ugly child: but it makes rather a handsome pig, I think.” And she began thinking over other children she knew, who might do very well as pigs, and was just saying to herself, “if one only knew the right way to change them—” when she was a little startled by seeing the Cheshire Cat sitting on a bough of a tree a few yards off.`
];

function pickRandomText() {
  return TEXTS[Math.floor(Math.random() * TEXTS.length)];
}

const TextTask = () => {
  const [text] = useState(() => pickRandomText());
  const formattedTextRef = useRef(null);

  useEffect(() => {
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
  }, [text]);

  return (
    <div className="textTask" style={{
      textAlign: 'center',
      fontFamily: 'Arial, sans-serif',
      height: '100%',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center'
    }}>
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
          lineHeight: 2
        }}
      />
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

export default TextTask;