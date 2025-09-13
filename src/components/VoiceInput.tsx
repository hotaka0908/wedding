import React from 'react';
import { useVoiceRecognition } from '../hooks/useVoiceRecognition';

interface VoiceInputProps {
  onTranscript: (transcript: string) => void;
}

export function VoiceInput({ onTranscript }: VoiceInputProps) {
  const { isListening, transcript, startListening, stopListening, resetTranscript } = useVoiceRecognition();

  React.useEffect(() => {
    if (transcript && !isListening) {
      onTranscript(transcript);
      resetTranscript();
    }
  }, [transcript, isListening, onTranscript, resetTranscript]);

  const handleStartListening = () => {
    resetTranscript();
    startListening();
  };

  return (
    <div className="voice-input">
      <button
        onClick={isListening ? stopListening : handleStartListening}
        className={`voice-button ${isListening ? 'listening' : ''}`}
        disabled={!('SpeechRecognition' in window || 'webkitSpeechRecognition' in window)}
      >
        <span>
          {isListening ? '🔴 録音中...' : (
            <>
              タップで<br />
              音声入力
            </>
          )}
        </span>
      </button>


      {!('SpeechRecognition' in window || 'webkitSpeechRecognition' in window) && (
        <p className="error-message">
          このブラウザは音声認識に対応していません
        </p>
      )}
    </div>
  );
}