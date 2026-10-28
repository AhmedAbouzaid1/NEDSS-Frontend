const CONSCRIPT_OR_PRISONER_KEYS = ['conscript', 'prisoner', 'مجند', 'سجين'];

export function isConscriptOrPrisonerCategory(category: any): boolean {
  return [category?.code, category?.englishName, category?.arabicName].some(
    (value) => value != null && CONSCRIPT_OR_PRISONER_KEYS.includes(String(value).trim().toLowerCase())
  );
}
