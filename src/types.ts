export interface Guest {
  id: number;
  name: string;
  isPresent: boolean;
  checkedInAt?: Date;
}

export interface SpeechRecognitionResult {
  transcript: string;
  confidence: number;
}

export interface VoiceRecognitionHook {
  isListening: boolean;
  transcript: string;
  startListening: () => void;
  stopListening: () => void;
  resetTranscript: () => void;
}