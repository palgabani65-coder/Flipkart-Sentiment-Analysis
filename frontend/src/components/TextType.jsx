import React, { useState, useEffect } from 'react';

export const TextType = ({
  text,
  texts = [],
  typingSpeed = 75,
  deletingSpeed = 50,
  pauseDuration = 1500,
  showCursor = true,
  cursorCharacter = '|',
  cursorClassName = 'text-[#22D3EE]',
  cursorStyle = { color: '#22D3EE', textShadow: '0 0 8px rgba(34, 211, 238, 0.7)' },
  variableSpeedEnabled = false,
  variableSpeedMin = 60,
  variableSpeedMax = 120,
  cursorBlinkDuration = 0.5,
  className = '',
  style = {}
}) => {
  const textArray = React.useMemo(() => {
    if (texts && texts.length > 0) return texts;
    if (Array.isArray(text)) return text;
    if (typeof text === 'string') return [text];
    return [''];
  }, [text, texts]);

  const [textIndex, setTextIndex] = useState(0);
  const [charIndex, setCharIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    if (!textArray || textArray.length === 0) return;

    const currentString = textArray[textIndex % textArray.length];
    let timer;

    const getRandomSpeed = () => {
      if (!variableSpeedEnabled) return isDeleting ? deletingSpeed : typingSpeed;
      return Math.floor(Math.random() * (variableSpeedMax - variableSpeedMin + 1)) + variableSpeedMin;
    };

    if (!isDeleting) {
      if (charIndex < currentString.length) {
        timer = setTimeout(() => {
          setCharIndex(prev => prev + 1);
        }, getRandomSpeed());
      } else {
        timer = setTimeout(() => {
          setIsDeleting(true);
        }, pauseDuration);
      }
    } else {
      if (charIndex > 0) {
        timer = setTimeout(() => {
          setCharIndex(prev => prev - 1);
        }, deletingSpeed);
      } else {
        setIsDeleting(false);
        setTextIndex(prev => (prev + 1) % textArray.length);
      }
    }

    return () => clearTimeout(timer);
  }, [
    charIndex,
    isDeleting,
    textIndex,
    textArray,
    typingSpeed,
    deletingSpeed,
    pauseDuration,
    variableSpeedEnabled,
    variableSpeedMin,
    variableSpeedMax
  ]);

  const currentString = textArray[textIndex % textArray.length] || '';
  const displayedText = currentString.substring(0, charIndex);

  return (
    <span className={`inline-block ${className}`} style={style}>
      <span>{displayedText}</span>
      {showCursor && (
        <span
          className={`inline-block ml-0.5 font-mono font-normal ${cursorClassName}`}
          style={{
            animation: `blink ${cursorBlinkDuration}s infinite`,
            ...cursorStyle
          }}
        >
          {cursorCharacter}
        </span>
      )}
      <style>{`
        @keyframes blink {
          0%, 100% { opacity: 1; }
          50% { opacity: 0; }
        }
      `}</style>
    </span>
  );
};

export default TextType;
