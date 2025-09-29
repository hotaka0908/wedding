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

    const availableGuests = guests.filter(guest => !guest.isPresent);
    const guestNames = availableGuests.map(guest => guest.name);

    const match = findBestMatch(transcript, guestNames);

    if (match && match.similarity >= 0.9) {
      const guest = availableGuests.find(g => g.name === match.name);
      if (guest) {
        setGuests(prevGuests =>
          prevGuests.map(g =>
            g.id === guest.id
              ? { ...g, isPresent: true, checkedInAt: new Date() }
              : g
          )
        );


        // 成功状態を設定
        setIsSuccess(true);

        // 3秒後に通常状態に戻す
        setTimeout(() => {
          setIsSuccess(false);
        }, 3000);

        // 成功時の効果音を再生
        AudioUtils.playSuccessSound();
      }
    } else {
      console.warn('⚠️ マッチング失敗:', { transcript, match, availableGuests: guestNames });

      if (transcript.length < 2) {
        // エラー音を再生
        AudioUtils.playErrorSound();
      } else if (!match || match.similarity < 0.1) {
        // エラー音を再生
        AudioUtils.playErrorSound();
      }
    }
  }, [guests]);

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

  }, [guests]);


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