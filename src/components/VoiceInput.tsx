import React from 'react';
import { useVoiceRecognition } from '../hooks/useVoiceRecognition';
import { AudioUtils } from '../utils/audioUtils';

interface VoiceInputProps {
  onTranscript: (_transcript: string) => void;
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
    // タップ音を再生
    AudioUtils.playTapSound();
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
        {isListening ? '🔴 録音中...' : (
          <>
            タップで<br />
            音声入力
          </>
        )}
      </button>


      {!('SpeechRecognition' in window || 'webkitSpeechRecognition' in window) && (
        <p className="error-message">
          このブラウザは音声認識に対応していません
        </p>
      )}
    </div>
  );
}