import { describe, expect, it } from 'vitest';
import {
  calculateSimilarity,
  findBestMatch,
  normalizeJapaneseName
} from './nameMatching';

describe('normalizeJapaneseName', () => {
  it('空白や全角を正規化し小文字に変換する', () => {
    expect(normalizeJapaneseName(' Ｔａｎａｋａ 太郎　')).toBe('tanaka太郎');
  });
});

describe('calculateSimilarity', () => {
  it('完全一致は1.0を返す', () => {
    expect(calculateSimilarity('佐藤花子', '佐藤花子')).toBe(1);
  });

  it('ひらがなとカタカナが一致すれば1.0を返す', () => {
    expect(calculateSimilarity('さとうはなこ', 'サトウハナコ')).toBe(1);
  });

  it('一致しない場合は0.0を返す', () => {
    expect(calculateSimilarity('佐藤花子', '田中太郎')).toBe(0);
  });
});

describe('findBestMatch', () => {
  it('最も高い類似度の名前を返す', () => {
    const guests = ['サトウハナコ', 'タナカタロウ', 'スズキイチロウ'];
    expect(findBestMatch('さとうはなこ', guests)).toEqual({
      name: 'サトウハナコ',
      similarity: 1
    });
  });

  it('閾値を満たさない場合はnullを返す', () => {
    const guests = ['佐藤花子', '田中太郎', '鈴木一郎'];
    expect(findBestMatch('unknown', guests)).toBeNull();
  });
});
