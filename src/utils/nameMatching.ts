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

  if (normalized1.includes(normalized2) || normalized2.includes(normalized1)) {
    return 0.8;
  }

  if (hiragana1.includes(hiragana2) || hiragana2.includes(hiragana1)) {
    return 0.75;
  }

  const distance = levenshteinDistance(normalized1, normalized2);
  const hiraganaDistance = levenshteinDistance(hiragana1, hiragana2);

  const maxLength = Math.max(normalized1.length, normalized2.length);
  if (maxLength === 0) return 0;

  const basicSimilarity = 1 - (distance / maxLength);
  const hiraganaSimilarity = 1 - (hiraganaDistance / maxLength);

  return Math.max(basicSimilarity, hiraganaSimilarity);
}

function levenshteinDistance(str1: string, str2: string): number {
  const matrix = Array(str2.length + 1).fill(null).map(() => Array(str1.length + 1).fill(null));

  for (let i = 0; i <= str1.length; i++) {
    matrix[0][i] = i;
  }

  for (let j = 0; j <= str2.length; j++) {
    matrix[j][0] = j;
  }

  for (let j = 1; j <= str2.length; j++) {
    for (let i = 1; i <= str1.length; i++) {
      const indicator = str1[i - 1] === str2[j - 1] ? 0 : 1;
      matrix[j][i] = Math.min(
        matrix[j][i - 1] + 1,
        matrix[j - 1][i] + 1,
        matrix[j - 1][i - 1] + indicator
      );
    }
  }

  return matrix[str2.length][str1.length];
}

export function findBestMatch(inputName: string, guestNames: string[]): { name: string; similarity: number } | null {
  let bestMatch = null;
  let highestSimilarity = 0;

  console.log('🔍 音声認識結果:', inputName);
  console.log('📝 正規化後:', normalizeJapaneseName(inputName));

  for (const name of guestNames) {
    const similarity = calculateSimilarity(inputName, name);
    console.log(`📊 ${name} との類似度: ${similarity.toFixed(3)}`);

    if (similarity > highestSimilarity && similarity >= 0.3) {
      highestSimilarity = similarity;
      bestMatch = { name, similarity };
    }
  }

  console.log('🎯 最良マッチ:', bestMatch);
  return bestMatch;
}