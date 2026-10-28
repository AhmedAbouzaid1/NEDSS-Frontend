export const BRUCELLA_DISEASE_GROUP_ID = 9;
export const BRUCELLA_MIN_DAYS_AFTER_FIRST_SERUM = 14;

export interface BrucellaSerumIds {
  firstSerumCheckId: number;
  secondSerumCheckId: number;
  titer160ResultId: number;
}

export interface BrucellaLabCheckLike {
  id?: number | null;
  diseaseGroupId?: any;
  diseaseCheckId?: any;
  diseaseLabTestResultId?: any;
  getSampleDate?: any;
}

export function isBrucellaFirstSerum(ids: BrucellaSerumIds | null, check: BrucellaLabCheckLike): boolean {
  return (
    !!ids &&
    Number(check?.diseaseGroupId) === BRUCELLA_DISEASE_GROUP_ID &&
    Number(check?.diseaseCheckId) === ids.firstSerumCheckId
  );
}

export function isBrucellaSecondSerum(ids: BrucellaSerumIds | null, check: BrucellaLabCheckLike): boolean {
  return (
    !!ids &&
    Number(check?.diseaseGroupId) === BRUCELLA_DISEASE_GROUP_ID &&
    Number(check?.diseaseCheckId) === ids.secondSerumCheckId
  );
}

function toDayKey(value: any): string | null {
  if (!value) {
    return null;
  }
  if (value instanceof Date) {
    const m = `${value.getMonth() + 1}`.padStart(2, '0');
    const d = `${value.getDate()}`.padStart(2, '0');
    return `${value.getFullYear()}-${m}-${d}`;
  }
  const match = /^(\d{4})-(\d{2})-(\d{2})/.exec(`${value}`);
  return match ? `${match[1]}-${match[2]}-${match[3]}` : null;
}

function addDays(dayKey: string, days: number): string {
  const [y, m, d] = dayKey.split('-').map(Number);
  const date = new Date(Date.UTC(y, m - 1, d + days));
  return date.toISOString().substring(0, 10);
}

function display(dayKey: string): string {
  const [y, m, d] = dayKey.split('-');
  return `${d}/${m}/${y}`;
}

export function brucellaSecondSerumError(
  ids: BrucellaSerumIds,
  secondSampleDate: any,
  otherChecks: BrucellaLabCheckLike[]
): string | null {
  const firstSamples = (otherChecks ?? []).filter((c) => isBrucellaFirstSerum(ids, c));
  if (!firstSamples.length) {
    return 'لا يمكن إضافة عينة السيرم (عينة ثانية) قبل إدخال عينة السيرم (عينة أولى) لنفس الحالة';
  }
  const titer160Dates = firstSamples
    .filter((c) => Number(c.diseaseLabTestResultId) === ids.titer160ResultId)
    .map((c) => toDayKey(c.getSampleDate))
    .filter((d): d is string => !!d)
    .sort();
  if (!titer160Dates.length) {
    return 'لا يمكن إضافة عينة السيرم (عينة ثانية) إلا إذا كانت نتيجة عينة السيرم (عينة أولى) = 1/160';
  }
  const firstDate = titer160Dates[0];
  const allowedFrom = addDays(firstDate, BRUCELLA_MIN_DAYS_AFTER_FIRST_SERUM);
  const second = toDayKey(secondSampleDate);
  if (!second || second < allowedFrom) {
    return `لا يمكن إضافة عينة السيرم (عينة ثانية) إلا بعد مرور أسبوعين من تاريخ سحب عينة السيرم (عينة أولى) (${display(firstDate)})، أي بتاريخ سحب ${display(allowedFrom)} أو بعده`;
  }
  return null;
}
