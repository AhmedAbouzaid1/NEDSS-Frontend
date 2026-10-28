export function normalizeArabicNameChars(value: string): string {
  return value.replace(/[أإ]/g, 'ا').replace(/ى/g, 'ي');
}

export function normalizeArabicForSearch(value: unknown): string {
  if (value === null || value === undefined) {
    return '';
  }
  return normalizeArabicNameChars(String(value))
    .replace(/[ً-ٰٟۖ-ۭـ]/g, '')
    .replace(/آ/g, 'ا')
    .replace(/ة/g, 'ه')
    .replace(/ؤ/g, 'و')
    .replace(/ئ/g, 'ي')
    .replace(/[٠-٩]/g, (d) => String(d.charCodeAt(0) - 0x0660))
    .toLowerCase()
    .replace(/\s+/g, ' ')
    .trim();
}

export function arabicSearchWords(query: unknown): string[] {
  return normalizeArabicForSearch(query)
    .split(' ')
    .filter((word) => word.length > 0)
    .map((word) => (word.startsWith('ال') && word.length > 3 ? word.substring(2) : word));
}

export function arabicTextMatches(text: unknown, query: unknown): boolean {
  const words = arabicSearchWords(query);
  if (words.length === 0) {
    return true;
  }
  const normalizedText = normalizeArabicForSearch(text);
  return words.every((word) => normalizedText.includes(word));
}
