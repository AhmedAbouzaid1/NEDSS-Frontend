export interface TyphoidFollowUpVisit {
  hasSymptoms: number | null;
  fever: boolean;
  intestinalUpset: boolean;
}

export interface TyphoidContactFollowUp {
  name: string | null;
  age: number | null;
  telephone: string | null;
  contactType: number | null;
  relationship: string | null;
  day1: TyphoidFollowUpVisit;
  day2: TyphoidFollowUpVisit;
  day7: TyphoidFollowUpVisit;
  day14: TyphoidFollowUpVisit;
}

export const TYPHOID_SYMPTOM_KEYS = ['fever', 'intestinalUpset'] as const;

const TYPHOID_YES = 0;

function newVisit(): TyphoidFollowUpVisit {
  return { hasSymptoms: null, fever: false, intestinalUpset: false };
}

export function newTyphoidContactFollowUp(): TyphoidContactFollowUp {
  return {
    name: null,
    age: null,
    telephone: null,
    contactType: null,
    relationship: null,
    day1: newVisit(),
    day2: newVisit(),
    day7: newVisit(),
    day14: newVisit(),
  };
}

export function clearTyphoidSymptomsIfNone(visit: TyphoidFollowUpVisit): void {
  if (visit.hasSymptoms !== TYPHOID_YES) {
    TYPHOID_SYMPTOM_KEYS.forEach((key) => (visit[key] = false));
  }
}

export function hasAnyTyphoidSymptom(visit: TyphoidFollowUpVisit): boolean {
  return TYPHOID_SYMPTOM_KEYS.some((key) => visit[key]);
}

export function serializeTyphoidContactFollowUps(rows: TyphoidContactFollowUp[]): string | null {
  return rows.length ? JSON.stringify(rows) : null;
}

export function parseTyphoidContactFollowUps(json: string | null | undefined): TyphoidContactFollowUp[] {
  if (!json) return [];
  try {
    const rows = JSON.parse(json);
    if (!Array.isArray(rows)) return [];
    const visit = (v: any): TyphoidFollowUpVisit => {
      const parsed = newVisit();
      parsed.hasSymptoms = v?.hasSymptoms ?? null;
      TYPHOID_SYMPTOM_KEYS.forEach((key) => (parsed[key] = !!v?.[key]));
      clearTyphoidSymptomsIfNone(parsed);
      return parsed;
    };
    return rows.map((r: any) => ({
      name: r?.name ?? null,
      age: r?.age ?? null,
      telephone: r?.telephone ?? null,
      contactType: r?.contactType ?? null,
      relationship: r?.relationship ?? null,
      day1: visit(r?.day1),
      day2: visit(r?.day2),
      day7: visit(r?.day7),
      day14: visit(r?.day14),
    }));
  } catch {
    return [];
  }
}
