import { useState, useCallback } from 'react';
import { Guest } from './types';
import { initialGuests } from './data/guests';
import { findBestMatch } from './utils/nameMatching';
import { VoiceInput } from './components/VoiceInput';
import { GuestList } from './components/GuestList';
import { CheckinResult } from './components/CheckinResult';
import './App.css';

interface CheckinMessage {
  message: string;
  type: 'success' | 'error' | 'info';
}

function App() {
  const [guests, setGuests] = useState<Guest[]>(initialGuests);
  const [checkinMessage, setCheckinMessage] = useState<CheckinMessage | null>(null);

  const handleVoiceTranscript = useCallback((transcript: string) => {
    if (!transcript.trim()) {
      setCheckinMessage({
        message: '音声が認識されませんでした。もう一度お試しください。',
        type: 'error'
      });
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

        setCheckinMessage({
          message: `${guest.name}さん来てくれてありがとう！`,
          type: 'success'
        });
      }
    } else {
      console.warn('⚠️ マッチング失敗:', { transcript, match, availableGuests: guestNames });

      if (transcript.length < 2) {
        setCheckinMessage({
          message: '音声が短すぎます。もう一度はっきりとお名前をお話しください。',
          type: 'error'
        });
      } else if (availableGuests.length === 0) {
        setCheckinMessage({
          message: '全てのゲストが既に受付済みです。',
          type: 'info'
        });
      } else if (!match || match.similarity < 0.1) {
        setCheckinMessage({
          message: `「${transcript}」に該当するゲストが見つかりませんでした。もう一度はっきりとお名前をお話しください。`,
          type: 'error'
        });
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

    const guest = guests.find(g => g.id === guestId);
    if (guest) {
      setCheckinMessage({
        message: guest.isPresent
          ? `${guest.name}様の受付を取り消しました。`
          : `${guest.name}様を手動で受付しました。`,
        type: 'info'
      });
    }
  }, [guests]);

  const handleCloseMessage = () => {
    setCheckinMessage(null);
  };

  return (
    <div className="app">
      <header className="app-header">
        <h1>YUKI & KENTA Wedding</h1>
        <img src="/image.jpg" alt="Wedding Photo" className="wedding-photo" />
      </header>

      <main className="app-main">
        <section className="voice-section">
          <VoiceInput onTranscript={handleVoiceTranscript} />
        </section>

        <section className="guest-section">
          <GuestList
            guests={guests}
            onToggleAttendance={handleToggleAttendance}
          />
        </section>
      </main>

      {checkinMessage && (
        <CheckinResult
          message={checkinMessage.message}
          type={checkinMessage.type}
          onClose={handleCloseMessage}
        />
      )}
    </div>
  );
}

export default App;