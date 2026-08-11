import React, { useState, useEffect } from 'react';

export const TypewriterEffect = ({
  words = [
    'Artificial Intelligence',
    'Real-Time NLP Scoring',
    'Aspect-Level Breakdown',
    'Instant Review Analytics',
    '98.4% Precision Accuracy'
  ],

  wordColors = [],

  staticPrefix = '',
  staticSuffix = '',
  typingSpeed = 75,
  deletingSpeed = 35,
  delayBetweenWords = 2200,
  className = '',
  textClassName = 'font-extrabold',
  cursorClassName =
  'bg-cyan-400 shadow-[0_0_10px_rgba(34,211,238,0.8)]',
  showCursor = true,
  loop = true
}) => {
  const [wordIndex, setWordIndex] = useState(0);
  const [charIndex, setCharIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    if (!words || words.length === 0) return;

    const currentWord = words[wordIndex % words.length];
    let timer;

    if (!isDeleting) {
      if (charIndex < currentWord.length) {
        timer = setTimeout(() => {
          setCharIndex((prev) => prev + 1);
        }, typingSpeed);
      } else {
        if (loop || wordIndex < words.length - 1) {
          timer = setTimeout(() => {
            setIsDeleting(true);
          }, delayBetweenWords);
        }
      }
    } else {
      if (charIndex > 0) {
        timer = setTimeout(() => {
          setCharIndex((prev) => prev - 1);
        }, deletingSpeed);
      } else {
        setIsDeleting(false);
        setWordIndex((prev) => (prev + 1) % words.length);
      }
    }

    return () => clearTimeout(timer);
  }, [
    charIndex,
    isDeleting,
    wordIndex,
    words,
    typingSpeed,
    deletingSpeed,
    delayBetweenWords,
    loop
  ]);

  const currentWord = words[wordIndex % words.length] || '';
  const displayedText = currentWord.substring(0, charIndex);

  // Color changes according to the current word
  const currentColor =
    wordColors.length > 0
      ? wordColors[wordIndex % wordColors.length]
      : '#E5E7EB';

  return (
    <span
      className={`inline-flex items-center justify-center flex-wrap gap-x-0 ${className}`}
    >
      {staticPrefix && staticPrefix}

      <span
        className={textClassName}
        style={{
          color: currentColor
        }}
      >
        {displayedText}
      </span>

      {showCursor && (
        <span
          className={`inline-block w-[3px] h-[0.9em] ml-1 rounded-full animate-pulse ${cursorClassName}`}
          aria-hidden="true"
        />
      )}

      {staticSuffix && staticSuffix}
    </span>
  );
};

export default TypewriterEffect;