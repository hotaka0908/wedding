export interface Guest {
  id: number;
  name: string;
  gender: 'male' | 'female';
  isPresent: boolean;
  reading: string;
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
