import { useState, useEffect } from 'react';

const DEFAULT_PHRASES = [
  'Search premium cameras...',
  'Search high-end lenses...',
  'Search pro lighting kits...',
  'Search cinema drones...',
  'Search audio equipment...',
  'Search production gear...'
];

export const useTypewriter = (phrases: string[] = DEFAULT_PHRASES) => {
  const [placeholderText, setPlaceholderText] = useState('');
  const [phraseIndex, setPhraseIndex] = useState(0);
  const [isTyping, setIsTyping] = useState(true);

  useEffect(() => {
    const currentPhrase = phrases[phraseIndex];
    let timeout: NodeJS.Timeout;

    if (isTyping) {
      if (placeholderText.length < currentPhrase.length) {
        timeout = setTimeout(() => {
          setPlaceholderText(currentPhrase.slice(0, placeholderText.length + 1));
        }, 100);
      } else {
        timeout = setTimeout(() => setIsTyping(false), 2000);
      }
    } else {
      if (placeholderText.length > 0) {
        timeout = setTimeout(() => {
          setPlaceholderText(placeholderText.slice(0, placeholderText.length - 1));
        }, 50);
      } else {
        setPhraseIndex((prev) => (prev + 1) % phrases.length);
        setIsTyping(true);
      }
    }

    return () => clearTimeout(timeout);
  }, [placeholderText, isTyping, phraseIndex, phrases]);

  return placeholderText;
};
