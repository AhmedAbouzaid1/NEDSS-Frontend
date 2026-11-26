const CONSCRIPT_OR_PRISONER_KEYS = ['conscript', 'prisoner', 'مجند', 'سجين'];
const PRISONER_KEYS = ['prisoner', 'سجين', 'مسجون'];
const STUDENT_KEYS = ['student', 'طالب'];
const OTHER_KEYS = ['other', 'others', 'آخر', 'اخر', 'أخرى', 'اخرى'];
const NO_JOB_KEYS = [
  'child', 'طفل',
  'housewife', 'ربة منزل',
  'retired', 'متقاعد',
  'not working / unemployed', 'unemployed', 'not working', 'لا يعمل',
  'unknown', 'غير معروف',
];

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

export function isStudentCategory(category: any): boolean {
  return matchesCategory(category, STUDENT_KEYS);
}

export function isOtherCategory(category: any): boolean {
  return matchesCategory(category, OTHER_KEYS);
}

export function isNoJobCategory(category: any): boolean {
  return matchesCategory(category, NO_JOB_KEYS);
}
