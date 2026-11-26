const CONSCRIPT_OR_PRISONER_KEYS = ['conscript', 'prisoner', 'مجند', 'سجين'];
const PRISONER_KEYS = ['prisoner', 'سجين', 'مسجون'];

function matchesCategory(category: any, keys: string[]): boolean {
  return [category?.code, category?.englishName, category?.arabicName].some(
    (value) => value != null && keys.includes(String(value).trim().toLowerCase())
  );
}

export function isConscriptOrPrisonerCategory(category: any): boolean {
  return matchesCategory(category, CONSCRIPT_OR_PRISONER_KEYS);
}

export function isPrisonerCategory(category: any): boolean {
  return matchesCategory(category, PRISONER_KEYS);
}
