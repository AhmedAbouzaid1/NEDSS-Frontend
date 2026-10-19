export interface MumbariFollowUpVisit {
  hasSymptoms: number | null;
  doubleVision: boolean;
  swallowingOrSpeechDifficulty: boolean;
  droopingEyelids: boolean;
  muscleWeakness: boolean;
}

export interface MumbariContactFollowUp {
  name: string | null;
  age: number | null;
  telephone: string | null;
  sharedFood: number | null;
  relationship: string | null;
  day2: MumbariFollowUpVisit;
  day5: MumbariFollowUpVisit;
  day10: MumbariFollowUpVisit;
}

export type MumbariVisitKey = 'day2' | 'day5' | 'day10';

export const MUMBARI_SYMPTOM_KEYS = ['doubleVision', 'swallowingOrSpeechDifficulty', 'droopingEyelids', 'muscleWeakness'] as const;

const MUMBARI_YES = 1;

function newVisit(): MumbariFollowUpVisit {
  return { hasSymptoms: null, doubleVision: false, swallowingOrSpeechDifficulty: false, droopingEyelids: false, muscleWeakness: false };
}

export function newMumbariContactFollowUp(): MumbariContactFollowUp {
  return {
    name: null,
    age: null,
    telephone: null,
    sharedFood: null,
    relationship: null,
    day2: newVisit(),
    day5: newVisit(),
    day10: newVisit(),
  };
}

export function clearSymptomsIfNone(visit: MumbariFollowUpVisit): void {
  if (visit.hasSymptoms !== MUMBARI_YES) {
    MUMBARI_SYMPTOM_KEYS.forEach((key) => (visit[key] = false));
  }
}

export function hasAnySymptom(visit: MumbariFollowUpVisit): boolean {
  return MUMBARI_SYMPTOM_KEYS.some((key) => visit[key]);
}

export function serializeMumbariContactFollowUps(rows: MumbariContactFollowUp[]): string | null {
  return rows.length ? JSON.stringify(rows) : null;
}

export function parseMumbariContactFollowUps(json: string | null | undefined): MumbariContactFollowUp[] {
  if (!json) return [];
  try {
    const rows = JSON.parse(json);
    if (!Array.isArray(rows)) return [];
    const visit = (v: any): MumbariFollowUpVisit => {
      const parsed = newVisit();
      parsed.hasSymptoms = v?.hasSymptoms ?? null;
      MUMBARI_SYMPTOM_KEYS.forEach((key) => (parsed[key] = !!v?.[key]));
      clearSymptomsIfNone(parsed);
      return parsed;
    };
    return rows.map((r: any) => ({
      name: r?.name ?? null,
      age: r?.age ?? null,
      telephone: r?.telephone ?? null,
      sharedFood: r?.sharedFood ?? null,
      relationship: r?.relationship ?? null,
      day2: visit(r?.day2),
      day5: visit(r?.day5),
      day10: visit(r?.day10),
    }));
  } catch {
    return [];
  }
}
