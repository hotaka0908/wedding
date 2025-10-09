import { useState, useCallback, useEffect, useRef } from 'react';
import { Guest } from './types';
import { initialGuests } from './data/guests';
import { findBestMatch } from './utils/nameMatching';
import { AudioUtils } from './utils/audioUtils';
import { useVoiceRecognition } from './hooks/useVoiceRecognition';
import { GuestList } from './components/GuestList';
import './App.css';

function App() {
  const [guests, setGuests] = useState<Guest[]>(initialGuests);
  const guestsRef = useRef(guests);
  const [showWelcomeScreen, setShowWelcomeScreen] = useState<boolean>(true);
  const [isSuccess, setIsSuccess] = useState<boolean>(false);
  const { isListening, transcript, startListening, stopListening, resetTranscript } = useVoiceRecognition();

  useEffect(() => {
    guestsRef.current = guests;
  }, [guests]);

  const MATCH_THRESHOLD = 0.9;

  const handleVoiceTranscript = useCallback((transcriptValue: string) => {
    if (!transcriptValue.trim()) {
      return;
    }

    const currentGuests = guestsRef.current;
    const availableGuests = currentGuests.filter(guest => !guest.isPresent);
    const match = findBestMatch(transcriptValue, availableGuests);

    if (match && match.similarity >= MATCH_THRESHOLD) {
      const matchedGuest = match.guest;

      setGuests(prevGuests =>
        prevGuests.map(guest =>
          guest.id === matchedGuest.id
            ? { ...guest, isPresent: true, checkedInAt: new Date() }
            : guest
        )
      );

      setIsSuccess(true);

      setTimeout(() => {
        setIsSuccess(false);
      }, 3000);

      AudioUtils.playSuccessSound();
      return;
    }

    console.warn('⚠️ マッチング失敗:', {
      transcript: transcriptValue,
      match,
      availableGuests: availableGuests.map(guest => guest.name)
    });

    const shouldPlayErrorSound =
      transcriptValue.length < 2 || !match || match.similarity < MATCH_THRESHOLD / 2;

    if (shouldPlayErrorSound) {
      AudioUtils.playErrorSound();
    }
  }, []);

  const handleToggleAttendance = useCallback((guestId: number) => {
    setGuests(prevGuests =>
      prevGuests.map(guest =>
        guest.id === guestId
          ? {
              ...guest,
              isPresent: !guest.isPresent,
              checkedInAt: guest.isPresent ? undefined : new Date()
            }
          : guest
      )
    );

  }, []);

  const handleWelcomeScreenTap = () => {
    // ウェルカム画面タップ時にAudioContextを初期化
    AudioUtils.initializeAudio();
    setShowWelcomeScreen(false);
  };

  const handleImageTap = () => {
    if (isListening) {
      stopListening();
    } else {
      // タップ音を再生
      AudioUtils.playTapSound();
      resetTranscript();
      startListening();
    }
  };

  // 音声認識結果の処理
  useEffect(() => {
    if (transcript && !isListening) {
      handleVoiceTranscript(transcript);
      resetTranscript();
    }
  }, [transcript, isListening, handleVoiceTranscript, resetTranscript]);

  if (showWelcomeScreen) {
    return (
      <div className="app" onClick={handleWelcomeScreenTap}>
        <div className="welcome-screen">
          <img src="/wave.jpg" alt="Wedding Photo" className="welcome-photo" />
          <h1 className="welcome-title">YUKI & KOTA Wedding</h1>
          <div className="tap-message">画面をタップ</div>
        </div>
      </div>
    );
  }

  return (
    <div className="app">
      <header className="app-header">
        <h1>YUKI & KOTA Wedding</h1>
        <div className="characters-container" onClick={handleImageTap}>
          <img
            src={
              isSuccess
                ? "/pixel3.png"
                : isListening
                  ? "/pixel2.png"
                  : "/pixel1.png"
            }
            alt="Wedding Characters"
            className={`wedding-characters ${isSuccess ? 'success' : ''}`}
          />
          <div className="instruction-text">
            {isSuccess
              ? '来てくれてありがとう〜'
              : isListening
                ? '🔴 録音中...'
                : 'タッチで音声入力'
            }
          </div>
        </div>
      </header>

      <main className="app-main">
        <section className="guest-section">
          <GuestList
            guests={guests}
            onToggleAttendance={handleToggleAttendance}
          />
        </section>
      </main>
    </div>
  );
}

export default App;
