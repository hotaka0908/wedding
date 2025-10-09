import { describe, expect, it } from 'vitest';
import { calculateSimilarity, findBestMatch } from './nameMatching';

const guests = [
  { id: 1, name: '佐藤花子', reading: 'さとうはなこ' },
  { id: 2, name: '田中太郎', reading: 'たなかたろう' },
  { id: 3, name: '鈴木一郎', reading: 'すずきいちろう' }
];

describe('calculateSimilarity', () => {
  it('ひらがなとカタカナで同じ読みなら1.0', () => {
    expect(calculateSimilarity('サトウハナコ', 'さとうはなこ')).toBe(1);
  });

  it('一文字異なる場合は0.9未満になる', () => {
    const similarity = calculateSimilarity('さとうはなこ', 'さとうはなき');
    expect(similarity).toBeLessThan(0.9);
  });
});

describe('findBestMatch', () => {
  it('読みが一致するゲストを返す', () => {
    const result = findBestMatch('さとうはなこ', guests);
    expect(result?.guest.name).toBe('佐藤花子');
    expect(result?.similarity).toBe(1);
  });

  it('最も近い候補を返すが類似度は低くなる', () => {
    const result = findBestMatch('さとうたろう', guests);
    expect(result?.guest.name).toBe('佐藤花子');
    expect(result?.similarity).toBeLessThan(1);
  });

  it('対象ゲストがいない場合はnull', () => {
    expect(findBestMatch('さとうはなこ', [])).toBeNull();
  });
});
