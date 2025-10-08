import { act, render, waitFor } from '@testing-library/react';
import { useEffect, useRef } from 'react';
import { describe, expect, it, beforeEach, afterEach, vi } from 'vitest';
import { useVoiceRecognition } from './useVoiceRecognition';

type SpeechListener = ((_event?: any) => void) | null;

class MockSpeechRecognition {
  continuous = false;
  interimResults = false;
  lang = '';
  onresult: SpeechListener = null;
  onstart: SpeechListener = null;
  onend: SpeechListener = null;
  onerror: SpeechListener = null;
  start = vi.fn(() => {
    this.onstart?.();
  });
  stop = vi.fn(() => {
    this.onend?.();
  });

  triggerResult(text: string) {
    if (!this.onresult) return;
    const result: any = {
      isFinal: true,
      0: { transcript: text }
    };
    const event: any = {
      resultIndex: 0,
      results: [result]
    };
    this.onresult(event);
  }
}

let latestInstance: MockSpeechRecognition | null = null;

function HookProbe({ onReady }: { onReady: (_value: ReturnType<typeof useVoiceRecognition>) => void }) {
  const result = useVoiceRecognition();
  const readyRef = useRef(onReady);
  readyRef.current = onReady;

  useEffect(() => {
    readyRef.current(result);
  });

  return null;
}

beforeEach(() => {
  latestInstance = null;
  const speechWindow = window as any;
  speechWindow.SpeechRecognition = class extends MockSpeechRecognition {
    constructor() {
      super();
      latestInstance = this;
    }
  };
  delete speechWindow.webkitSpeechRecognition;
});

afterEach(() => {
  const speechWindow = window as any;
  delete speechWindow.SpeechRecognition;
});

describe('useVoiceRecognition', () => {
  it('音声認識の開始・停止・結果の更新を処理する', async () => {
    let hookValue: ReturnType<typeof useVoiceRecognition> | null = null;

    const { unmount } = render(<HookProbe onReady={value => { hookValue = value; }} />);

    await waitFor(() => {
      expect(hookValue).not.toBeNull();
      expect(latestInstance).not.toBeNull();
    });

    await act(async () => {
      hookValue?.startListening();
    });

    expect(latestInstance?.start).toHaveBeenCalledTimes(1);
    await waitFor(() => {
      expect(hookValue?.isListening).toBe(true);
    });

    await act(async () => {
      latestInstance?.triggerResult('テスト音声');
    });

    await waitFor(() => {
      expect(hookValue?.transcript).toBe('テスト音声');
    });

    await act(async () => {
      hookValue?.resetTranscript();
    });

    await waitFor(() => {
      expect(hookValue?.transcript).toBe('');
    });

    await act(async () => {
      hookValue?.stopListening();
    });

    await waitFor(() => {
      expect(latestInstance?.stop).toHaveBeenCalledTimes(1);
      expect(hookValue?.isListening).toBe(false);
    });

    unmount();
    await waitFor(() => {
      expect(latestInstance?.stop).toHaveBeenCalledTimes(2);
    });
  });
});
