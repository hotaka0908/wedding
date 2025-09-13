function toHiragana(str: string): string {
  return str.replace(/[\u30a1-\u30f6]/g, function(match) {
    const chr = match.charCodeAt(0) - 0x60;
    return String.fromCharCode(chr);
  });
}

function toKatakana(str: string): string {
  return str.replace(/[\u3041-\u3096]/g, function(match) {
    const chr = match.charCodeAt(0) + 0x60;
    return String.fromCharCode(chr);
  });
}

export function normalizeJapaneseName(name: string): string {
  return name
    .replace(/\s+/g, '')
    .toLowerCase()
    .normalize('NFKC');
}

export function calculateSimilarity(name1: string, name2: string): number {
  const normalized1 = normalizeJapaneseName(name1);
  const normalized2 = normalizeJapaneseName(name2);

  if (normalized1 === normalized2) {
    return 1.0;
  }

  const hiragana1 = toHiragana(normalized1);
  const hiragana2 = toHiragana(normalized2);

  if (hiragana1 === hiragana2) {
    return 0.95;
  }

  const katakana1 = toKatakana(normalized1);
  const katakana2 = toKatakana(normalized2);

  if (katakana1 === katakana2) {
    return 0.95;
  }

  return 0.0;
}


export function findBestMatch(inputName: string, guestNames: string[]): { name: string; similarity: number } | null {
  let bestMatch = null;
  let highestSimilarity = 0;

  for (const name of guestNames) {
    const similarity = calculateSimilarity(inputName, name);

    if (similarity > highestSimilarity && similarity >= 0.9) {
      highestSimilarity = similarity;
      bestMatch = { name, similarity };
    }
  }

  return bestMatch;
}