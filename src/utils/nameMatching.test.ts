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

  it('漢字同士が一致する場合も1.0', () => {
    expect(calculateSimilarity('加藤直子', '加藤直子')).toBe(1);
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

  it('漢字入力でも該当ゲストを返す', () => {
    const result = findBestMatch('田中太郎', guests);
    expect(result?.guest.name).toBe('田中太郎');
    expect(result?.similarity).toBe(1);
  });

  it('敬称を含むと一致しない', () => {
    const result = findBestMatch('佐藤花子さんです', guests);
    expect(result).toBeNull();
  });

  it('名前+です で一致させる', () => {
    const result = findBestMatch('田中太郎です', guests);
    expect(result?.guest.name).toBe('田中太郎');
    expect(result?.similarity).toBeGreaterThanOrEqual(0.9);
  });

  it('名前+です 以外の表現は一致しない', () => {
    const result = findBestMatch('田中太郎お願いします', guests);
    expect(result).toBeNull();
  });

  it('わずかな漢字違いでも最有力候補を拾う', () => {
    const fallbackGuests = [
      { id: 1, name: '田中太郎', reading: 'たなかたろう' },
      { id: 2, name: '田口太郎', reading: 'たぐちたろう' }
    ];

    const result = findBestMatch('田中太老', fallbackGuests);
    expect(result?.guest.name).toBe('田中太郎');
    expect(result?.similarity ?? 0).toBeGreaterThanOrEqual(0.75);
  });

  it('対象ゲストがいない場合はnull', () => {
    expect(findBestMatch('さとうはなこ', [])).toBeNull();
  });
});
