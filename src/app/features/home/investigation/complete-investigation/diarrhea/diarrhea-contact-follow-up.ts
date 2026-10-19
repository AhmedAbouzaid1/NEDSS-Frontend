export interface DiarrheaFollowUpVisit {
  hasSymptoms: number | null;
  diarrhea: number | null;
}

export interface DiarrheaContactFollowUp {
  name: string | null;
  age: number | null;
  telephone: string | null;
  contactType: number | null;
  relationship: string | null;
  day1: DiarrheaFollowUpVisit;
  after48h: DiarrheaFollowUpVisit;
}

export function newDiarrheaContactFollowUp(): DiarrheaContactFollowUp {
  return {
    name: null,
    age: null,
    telephone: null,
    contactType: null,
    relationship: null,
    day1: { hasSymptoms: null, diarrhea: null },
    after48h: { hasSymptoms: null, diarrhea: null },
  };
}

export function clearDiarrheaIfNoSymptoms(visit: DiarrheaFollowUpVisit): void {
  if (visit.hasSymptoms !== 0) {
    visit.diarrhea = null;
  }
}

export function serializeDiarrheaContactFollowUps(rows: DiarrheaContactFollowUp[]): string | null {
  return rows.length ? JSON.stringify(rows) : null;
}

export function parseDiarrheaContactFollowUps(json: string | null | undefined): DiarrheaContactFollowUp[] {
  if (!json) return [];
  try {
    const rows = JSON.parse(json);
    if (!Array.isArray(rows)) return [];
    const visit = (v: any): DiarrheaFollowUpVisit => ({
      hasSymptoms: v?.hasSymptoms ?? null,
      diarrhea: v?.hasSymptoms === 0 ? (v?.diarrhea ?? null) : null,
    });
    return rows.map((r: any) => ({
      name: r?.name ?? null,
      age: r?.age ?? null,
      telephone: r?.telephone ?? null,
      contactType: r?.contactType ?? null,
      relationship: r?.relationship ?? null,
      day1: visit(r?.day1),
      after48h: visit(r?.after48h),
    }));
  } catch {
    return [];
  }
}
