export interface HepatitisFollowUpVisit {
  hasSymptoms: number | null;
  lossOfAppetite: boolean;
  jaundice: boolean;
  darkUrine: boolean;
  rightUpperQuadrantPain: boolean;
}

export interface HepatitisContactFollowUp {
  name: string | null;
  age: number | null;
  telephone: string | null;
  contactType: number | null;
  relationship: string | null;
  day1: HepatitisFollowUpVisit;
  day2: HepatitisFollowUpVisit;
  day7: HepatitisFollowUpVisit;
  day14: HepatitisFollowUpVisit;
  day21: HepatitisFollowUpVisit;
}

export const HEPATITIS_SYMPTOM_KEYS = ['lossOfAppetite', 'jaundice', 'darkUrine', 'rightUpperQuadrantPain'] as const;

export const HEPATITIS_VISIT_KEYS = ['day1', 'day2', 'day7', 'day14', 'day21'] as const;

const HEPATITIS_YES = 0;

function newVisit(): HepatitisFollowUpVisit {
  return { hasSymptoms: null, lossOfAppetite: false, jaundice: false, darkUrine: false, rightUpperQuadrantPain: false };
}

export function newHepatitisContactFollowUp(): HepatitisContactFollowUp {
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
    day21: newVisit(),
  };
}

export function clearHepatitisSymptomsIfNone(visit: HepatitisFollowUpVisit): void {
  if (visit.hasSymptoms !== HEPATITIS_YES) {
    HEPATITIS_SYMPTOM_KEYS.forEach((key) => (visit[key] = false));
  }
}

export function hasAnyHepatitisSymptom(visit: HepatitisFollowUpVisit): boolean {
  return HEPATITIS_SYMPTOM_KEYS.some((key) => visit[key]);
}

export function serializeHepatitisContactFollowUps(rows: HepatitisContactFollowUp[]): string | null {
  return rows.length ? JSON.stringify(rows) : null;
}

export function parseHepatitisContactFollowUps(json: string | null | undefined): HepatitisContactFollowUp[] {
  if (!json) return [];
  try {
    const rows = JSON.parse(json);
    if (!Array.isArray(rows)) return [];
    const visit = (v: any): HepatitisFollowUpVisit => {
      const parsed = newVisit();
      parsed.hasSymptoms = v?.hasSymptoms ?? null;
      HEPATITIS_SYMPTOM_KEYS.forEach((key) => (parsed[key] = !!v?.[key]));
      clearHepatitisSymptomsIfNone(parsed);
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
      day21: visit(r?.day21),
    }));
  } catch {
    return [];
  }
}
