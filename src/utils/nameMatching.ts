import { Guest } from '../types';

function toHiragana(str: string): string {
  return str.replace(/[\u30a1-\u30f6]/g, match => {
    const chr = match.charCodeAt(0) - 0x60;
    return String.fromCharCode(chr);
  });
}

const HONORIFIC_SUFFIXES = [
  'です。',
  'です！',
  'です？',
  'です?',
  'です！',
  'です!',
  'です〜',
  'ですー',
  'ですｰ',
  'です〜！',
  'です〜。',
  'ですー！',
  'ですー。',
  'です〜?',
  'ですー?',
  'です〜？',
  'ですー？',
  'です',
  'です‥',
  'です…'
];

function stripHonorifics(value: string): string {
  let result = value;
  let trimmed = result.trim();
  let changed = true;

  while (changed && trimmed.length) {
    changed = false;
    for (const suffix of HONORIFIC_SUFFIXES) {
      if (trimmed.endsWith(suffix)) {
        trimmed = trimmed.slice(0, trimmed.length - suffix.length);
        changed = true;
      }
    }
  }

  return trimmed.trim();
}

const REMOVE_BRACKETS_REGEX = /\[|\]/g;
const REMOVE_CHARS_REGEX = /[()（）「」『』【】｛｝{}・･=~\-ー－―、。,.!?！？]/g;

function normalizeJapaneseName(name: string): string {
  const stripped = stripHonorifics(
    name
      .normalize('NFKC')
      .toLowerCase()
      .replace(/\s+/g, '')
      .replace(/\u3000/g, '')
      .replace(REMOVE_BRACKETS_REGEX, '')
      .replace(REMOVE_CHARS_REGEX, '')
  );

  return toHiragana(stripped);
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

export function calculateSimilarity(input: string, target: string): number {
  if (!target) {
    return 0;
  }

  const normalizedInput = normalizeJapaneseName(input);
  const normalizedTarget = normalizeJapaneseName(target);

  if (!normalizedInput || !normalizedTarget) {
    return 0;
  }

  if (normalizedInput === normalizedTarget) {
    return 1;
  }

  const distance = levenshteinDistance(normalizedInput, normalizedTarget);
  const maxLength = Math.max(normalizedInput.length, normalizedTarget.length);

  return 1 - distance / maxLength;
}

type MatchCandidate = Pick<Guest, 'id' | 'name' | 'reading'>;

export function findBestMatch(inputName: string, guests: MatchCandidate[]): { guest: MatchCandidate; similarity: number } | null {
  let best: { guest: MatchCandidate; similarity: number } | null = null;
  let secondBest: { guest: MatchCandidate; similarity: number } | null = null;

  for (const guest of guests) {
    const readingSimilarity = calculateSimilarity(inputName, guest.reading);
    const kanjiSimilarity = calculateSimilarity(inputName, guest.name);
    const similarity = Math.max(readingSimilarity, kanjiSimilarity);

    if (!best || similarity > best.similarity) {
      secondBest = best;
      best = { guest, similarity };
    } else if (!secondBest || similarity > secondBest.similarity) {
      secondBest = { guest, similarity };
    }
  }

  if (!best) {
    return null;
  }

  const PRIMARY_THRESHOLD = 0.9;
  const FALLBACK_THRESHOLD = 0.75;
  const GAP_THRESHOLD = 0.15;

  if (best.similarity >= PRIMARY_THRESHOLD) {
    return best;
  }

  if (
    best.similarity >= FALLBACK_THRESHOLD &&
    (!secondBest || best.similarity - secondBest.similarity >= GAP_THRESHOLD)
  ) {
    return best;
  }

  return null;
}
