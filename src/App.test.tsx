import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';

const mockVoiceState = {
  isListening: false,
  transcript: '',
  startListening: vi.fn(),
  stopListening: vi.fn(),
  resetTranscript: vi.fn()
};

const audioMocks = {
  initializeAudio: vi.fn(),
  playSuccessSound: vi.fn(),
  playErrorSound: vi.fn(),
  playTapSound: vi.fn()
};

vi.mock('./hooks/useVoiceRecognition', () => ({
  useVoiceRecognition: () => mockVoiceState
}));

vi.mock('./utils/audioUtils', () => ({
  AudioUtils: audioMocks
}));

describe('App', () => {
  beforeEach(() => {
    mockVoiceState.isListening = false;
    mockVoiceState.transcript = '';
    mockVoiceState.startListening.mockClear();
    mockVoiceState.stopListening.mockClear();
    mockVoiceState.resetTranscript.mockClear();
    vi.clearAllMocks();
  });

  it('ウェルカム画面から一覧表示に遷移しオーディオを初期化する', async () => {
    const App = (await import('./App')).default;

    render(<App />);

    fireEvent.click(screen.getByText('画面をタップ'));

    await waitFor(() => {
      expect(audioMocks.initializeAudio).toHaveBeenCalledTimes(1);
    });

    expect(screen.getByText('出席済み (0名)')).toBeInTheDocument();
    expect(screen.getByText('未到着 (20名)')).toBeInTheDocument();
  });

  it('音声認識の結果で出席を確定し成功音を再生する', async () => {
    const App = (await import('./App')).default;
    mockVoiceState.transcript = '田中太郎';

    render(<App />);

    fireEvent.click(screen.getByText('画面をタップ'));

    await waitFor(() => {
      expect(audioMocks.playSuccessSound).toHaveBeenCalledTimes(1);
      expect(mockVoiceState.resetTranscript).toHaveBeenCalledTimes(1);
      expect(screen.getByText('出席済み (1名)')).toBeInTheDocument();
    });

    expect(screen.getByText('田中太郎')).toBeInTheDocument();
  });

  it('不一致の音声ではエラー音を再生し人数は増えない', async () => {
    const App = (await import('./App')).default;
    mockVoiceState.transcript = '未知のゲスト';

    render(<App />);

    fireEvent.click(screen.getByText('画面をタップ'));

    await waitFor(() => {
      expect(audioMocks.playErrorSound).toHaveBeenCalledTimes(1);
      expect(screen.getByText('出席済み (0名)')).toBeInTheDocument();
    });

    expect(audioMocks.playSuccessSound).not.toHaveBeenCalled();
  });
});
