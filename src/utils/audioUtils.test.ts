import { beforeEach, describe, expect, it, vi } from 'vitest';
import { AudioUtils } from './audioUtils';

class MockOscillator {
  frequency = { setValueAtTime: vi.fn() };
  type = 'sine';
  connect = vi.fn();
  start = vi.fn();
  stop = vi.fn();
}

class MockGain {
  gain = {
    setValueAtTime: vi.fn(),
    linearRampToValueAtTime: vi.fn()
  };
  connect = vi.fn();
}

let createdOscillators: MockOscillator[] = [];
let constructorSpy: ReturnType<typeof vi.fn>;
let lastContext: MockAudioContext | null = null;

class MockAudioContext {
  destination = {};
  currentTime = 0;
  createOscillator = vi.fn(() => {
    const oscillator = new MockOscillator();
    createdOscillators.push(oscillator);
    return oscillator;
  });

  createGain = vi.fn(() => {
    const gain = new MockGain();
    return gain;
  });

  constructor() {
    lastContext = this;
    constructorSpy();
  }
}

beforeEach(() => {
  createdOscillators = [];
  constructorSpy = vi.fn();
  lastContext = null;
  (AudioUtils as unknown as { audioContext: AudioContext | null }).audioContext = null;
  const audioGlobal = globalThis as any;
  audioGlobal.AudioContext = MockAudioContext;
  delete audioGlobal.webkitAudioContext;
});

describe('AudioUtils', () => {
  it('initializeAudio は AudioContext を一度だけ生成する', () => {
    AudioUtils.initializeAudio();
    AudioUtils.initializeAudio();

    expect(constructorSpy).toHaveBeenCalledOnce();
  });

  it('playSuccessSound は2つのオシレーターを生成し再生する', () => {
    AudioUtils.playSuccessSound();

    expect(lastContext).not.toBeNull();
    expect(lastContext?.createOscillator).toHaveBeenCalledTimes(2);
    expect(lastContext?.createGain).toHaveBeenCalledTimes(1);
    createdOscillators.forEach(oscillator => {
      expect(oscillator.start).toHaveBeenCalled();
      expect(oscillator.stop).toHaveBeenCalled();
    });
  });

  it('playErrorSound は不一致時の効果音を再生する', () => {
    AudioUtils.playErrorSound();

    expect(lastContext).not.toBeNull();
    expect(lastContext?.createOscillator).toHaveBeenCalledTimes(2);
    createdOscillators.forEach(oscillator => {
      expect(oscillator.start).toHaveBeenCalled();
      expect(oscillator.stop).toHaveBeenCalled();
    });
  });
});
