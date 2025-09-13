import { useEffect } from 'react';

interface CheckinResultProps {
  message: string;
  type: 'success' | 'error' | 'info';
  onClose: () => void;
  autoClose?: boolean;
  duration?: number;
}

export function CheckinResult({
  message,
  type,
  onClose,
  autoClose = true,
  duration = 3000
}: CheckinResultProps) {
  useEffect(() => {
    if (autoClose) {
      const timer = setTimeout(() => {
        onClose();
      }, duration);

      return () => clearTimeout(timer);
    }
  }, [autoClose, duration, onClose]);

  const getIcon = () => {
    switch (type) {
      case 'success':
        return '';
      case 'error':
        return '❌';
      case 'info':
        return 'ℹ️';
      default:
        return '';
    }
  };

  return (
    <div className={`checkin-result ${type}`}>
      <div className="result-content">
        <span className="result-icon">{getIcon()}</span>
        <span className="result-message">{message}</span>
      </div>
      <button onClick={onClose} className="close-button">
        ×
      </button>
    </div>
  );
}