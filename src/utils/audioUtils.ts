// Web Audio APIを使用したシンプルな効果音システム
export class AudioUtils {
  private static audioContext: AudioContext | null = null;

  // AudioContextを初期化（ユーザーの操作後に実行）
  private static getAudioContext(): AudioContext {
    if (!this.audioContext) {
      this.audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
    }
    return this.audioContext;
  }

  // 成功音を生成・再生
  static playSuccessSound(): void {
    try {
      const context = this.getAudioContext();

      // 音の長さ
      const duration = 0.3;

      // オシレーターを作成（メロディー）
      const oscillator1 = context.createOscillator();
      const oscillator2 = context.createOscillator();

      // ゲインノードを作成（音量調整）
      const gainNode = context.createGain();

      // 周波数設定（C5とE5の和音）
      oscillator1.frequency.setValueAtTime(523.25, context.currentTime); // C5
      oscillator2.frequency.setValueAtTime(659.25, context.currentTime); // E5

      // 波形タイプ
      oscillator1.type = 'sine';
      oscillator2.type = 'sine';

      // 音量エンベロープ（フェードイン・アウト）
      gainNode.gain.setValueAtTime(0, context.currentTime);
      gainNode.gain.linearRampToValueAtTime(0.1, context.currentTime + 0.01);
      gainNode.gain.linearRampToValueAtTime(0.01, context.currentTime + duration);

      // 接続
      oscillator1.connect(gainNode);
      oscillator2.connect(gainNode);
      gainNode.connect(context.destination);

      // 再生
      oscillator1.start(context.currentTime);
      oscillator2.start(context.currentTime);

      // 停止
      oscillator1.stop(context.currentTime + duration);
      oscillator2.stop(context.currentTime + duration);

    } catch (error) {
      console.warn('効果音の再生に失敗しました:', error);
    }
  }

  // タップ音を生成・再生
  static playTapSound(): void {
    try {
      const context = this.getAudioContext();

      // 音の長さ
      const duration = 0.1;

      // オシレーターを作成（短いビープ音）
      const oscillator = context.createOscillator();

      // ゲインノードを作成（音量調整）
      const gainNode = context.createGain();

      // 周波数設定（A4 - 440Hz の軽やかな音）
      oscillator.frequency.setValueAtTime(440, context.currentTime);

      // 波形タイプ
      oscillator.type = 'sine';

      // 音量エンベロープ（短いクリック音）
      gainNode.gain.setValueAtTime(0, context.currentTime);
      gainNode.gain.linearRampToValueAtTime(0.05, context.currentTime + 0.01);
      gainNode.gain.linearRampToValueAtTime(0.01, context.currentTime + duration);

      // 接続
      oscillator.connect(gainNode);
      gainNode.connect(context.destination);

      // 再生
      oscillator.start(context.currentTime);

      // 停止
      oscillator.stop(context.currentTime + duration);

    } catch (error) {
      console.warn('タップ音の再生に失敗しました:', error);
    }
  }

  // AudioContextを初期化（ユーザーの最初のクリック時）
  static initializeAudio(): void {
    try {
      this.getAudioContext();
    } catch (error) {
      console.warn('Audio Context の初期化に失敗しました:', error);
    }
  }
}