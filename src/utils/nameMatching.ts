import { Guest } from '../types';

function toHiragana(str: string): string {
  return str.replace(/[\u30a1-\u30f6]/g, match => {
    const chr = match.charCodeAt(0) - 0x60;
    return String.fromCharCode(chr);
  });
}

function normalizeJapaneseName(name: string): string {
  return toHiragana(
    name
      .replace(/\s+/g, '')
      .toLowerCase()
      .normalize('NFKC')
  );
}

function levenshteinDistance(a: string, b: string): number {
  if (a === b) {
    return 0;
  }

  if (!a.length) {
    return b.length;
  }

  if (!b.length) {
    return a.length;
  }

  const matrix = Array.from({ length: a.length + 1 }, () =>
    new Array<number>(b.length + 1).fill(0)
  );

  for (let i = 0; i <= a.length; i++) {
    matrix[i][0] = i;
  }
  for (let j = 0; j <= b.length; j++) {
    matrix[0][j] = j;
  }

  for (let i = 1; i <= a.length; i++) {
    for (let j = 1; j <= b.length; j++) {
      const cost = a[i - 1] === b[j - 1] ? 0 : 1;

      matrix[i][j] = Math.min(
        matrix[i - 1][j] + 1,
        matrix[i][j - 1] + 1,
        matrix[i - 1][j - 1] + cost
      );
    }
  }

  return matrix[a.length][b.length];
}

export function calculateSimilarity(input: string, reading: string): number {
  if (!reading) {
    return 0;
  }

  const normalizedInput = normalizeJapaneseName(input);
  const normalizedReading = normalizeJapaneseName(reading);

  if (!normalizedInput || !normalizedReading) {
    return 0;
  }

  if (normalizedInput === normalizedReading) {
    return 1;
  }

  const distance = levenshteinDistance(normalizedInput, normalizedReading);
  const maxLength = Math.max(normalizedInput.length, normalizedReading.length);

  return 1 - distance / maxLength;
}

type MatchCandidate = Pick<Guest, 'id' | 'name' | 'reading'>;

export function findBestMatch(inputName: string, guests: MatchCandidate[]): { guest: MatchCandidate; similarity: number } | null {
  let best: { guest: MatchCandidate; similarity: number } | null = null;

  for (const guest of guests) {
    const similarity = calculateSimilarity(inputName, guest.reading);

    if (!best || similarity > best.similarity) {
      best = { guest, similarity };
    }
  }

  return best;
}
