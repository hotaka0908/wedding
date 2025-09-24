import { Guest } from '../types';
import { useEffect } from 'react';

interface CheckinMessage {
  message: string;
  type: 'success' | 'error' | 'info';
}

interface GuestListProps {
  guests: Guest[];
  onToggleAttendance: (guestId: number) => void;
  checkinMessage?: CheckinMessage | null;
  onCloseMessage?: () => void;
}

export function GuestList({ guests, onToggleAttendance, checkinMessage, onCloseMessage }: GuestListProps) {
  const presentGuests = guests
    .filter(guest => guest.isPresent)
    .sort((a, b) => {
      if (!a.checkedInAt || !b.checkedInAt) return 0;
      return b.checkedInAt.getTime() - a.checkedInAt.getTime();
    });
  const absentGuests = guests.filter(guest => !guest.isPresent);

  // 4秒後の自動消去タイマー
  useEffect(() => {
    if (checkinMessage && onCloseMessage) {
      const timer = setTimeout(() => {
        onCloseMessage();
      }, 4000);

      return () => clearTimeout(timer);
    }
  }, [checkinMessage, onCloseMessage]);

  return (
    <div className="guest-list">
      <h2>出席状況</h2>

      {checkinMessage && onCloseMessage && (
        <div className="checkin-result-inline">
          <div className={`checkin-message ${checkinMessage.type}`}>
            <div className="result-content">
              <span className="result-icon">
                {checkinMessage.type === 'error' ? '❌' :
                 checkinMessage.type === 'info' ? 'ℹ️' : ''}
              </span>
              <span className="result-message">{checkinMessage.message}</span>
            </div>
            <button onClick={onCloseMessage} className="close-button">
              ×
            </button>
          </div>
        </div>
      )}

      <div className="guest-sections">
        <div className="present-section">
          <h3 className="section-title">出席済み ({presentGuests.length}名)</h3>
          <div className="guest-items">
            {presentGuests.map((guest, index) => (
              <div key={guest.id} className="guest-item present">
                <span className={`guest-name ${index === 0 ? 'latest-checkin' : ''}`}>{guest.name}</span>
                <span className="checkin-time">
                  {guest.checkedInAt?.toLocaleTimeString('ja-JP', {
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </span>
                <button
                  onClick={() => onToggleAttendance(guest.id)}
                  className="toggle-button undo"
                >
                  取消
                </button>
              </div>
            ))}
          </div>
        </div>

        <div className="absent-section">
          <h3 className="section-title">未到着 ({absentGuests.length}名)</h3>
          <div className="guest-items">
            {absentGuests.map(guest => (
              <div key={guest.id} className="guest-item absent">
                <span className="guest-name">{guest.name}</span>
                <button
                  onClick={() => onToggleAttendance(guest.id)}
                  className="toggle-button checkin"
                >
                  手動受付
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}