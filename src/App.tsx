import { useState, useCallback, useEffect } from 'react';
import { Guest } from './types';
import { initialGuests } from './data/guests';
import { findBestMatch } from './utils/nameMatching';
import { AudioUtils } from './utils/audioUtils';
import { useVoiceRecognition } from './hooks/useVoiceRecognition';
import { GuestList } from './components/GuestList';
import './App.css';


function App() {
  const [guests, setGuests] = useState<Guest[]>(initialGuests);
  const [showWelcomeScreen, setShowWelcomeScreen] = useState<boolean>(true);
  const [isSuccess, setIsSuccess] = useState<boolean>(false);
  const { isListening, transcript, startListening, stopListening, resetTranscript } = useVoiceRecognition();

  const handleVoiceTranscript = useCallback((transcript: string) => {
    if (!transcript.trim()) {
      return;
    }

    let wasSuccessful = false;
    let matchForLog: ReturnType<typeof findBestMatch> = null;
    let availableGuestsForLog: string[] = [];
    let shouldPlayErrorSound = false;

    setGuests(prevGuests => {
      const availableGuests = prevGuests.filter(guest => !guest.isPresent);
      const guestNames = availableGuests.map(guest => guest.name);
      const match = findBestMatch(transcript, guestNames);

      availableGuestsForLog = guestNames;
      matchForLog = match;
      shouldPlayErrorSound =
        transcript.length < 2 || !match || match.similarity < 0.1;

      if (match && match.similarity >= 0.9) {
        const matchedGuest = availableGuests.find(g => g.name === match.name);

        if (matchedGuest) {
          wasSuccessful = true;

          return prevGuests.map(guest =>
            guest.id === matchedGuest.id
              ? { ...guest, isPresent: true, checkedInAt: new Date() }
              : guest
          );
        }
      }

      return prevGuests;
    });

    if (wasSuccessful) {
      setIsSuccess(true);

      setTimeout(() => {
        setIsSuccess(false);
      }, 3000);

      AudioUtils.playSuccessSound();
      return;
    }

    console.warn('⚠️ マッチング失敗:', {
      transcript,
      match: matchForLog,
      availableGuests: availableGuestsForLog
    });

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
