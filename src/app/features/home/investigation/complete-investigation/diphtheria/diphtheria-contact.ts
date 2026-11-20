export interface DiphtheriaContact {
  name: string | null;
  age: number | null;
  relationship: string | null;
  fever: boolean;
  throatInflammation: boolean;
  grayMembrane: boolean;
  dose1: number | null;
  dose2: number | null;
  dose3: number | null;
  booster: number | null;
  actionsTaken: string | null;
}

export const DIPHTHERIA_SYMPTOM_KEYS = ['fever', 'throatInflammation', 'grayMembrane'] as const;

export const DIPHTHERIA_DOSE_KEYS = ['dose1', 'dose2', 'dose3', 'booster'] as const;

export function newDiphtheriaContact(): DiphtheriaContact {
  return {
    name: null,
    age: null,
    relationship: null,
    fever: false,
    throatInflammation: false,
    grayMembrane: false,
    dose1: null,
    dose2: null,
    dose3: null,
    booster: null,
    actionsTaken: null,
  };
}

export function serializeDiphtheriaContacts(rows: DiphtheriaContact[]): string | null {
  return rows.length ? JSON.stringify(rows) : null;
}

export function parseDiphtheriaContacts(json: string | null | undefined): DiphtheriaContact[] {
  if (!json) return [];
  try {
    const rows = JSON.parse(json);
    if (!Array.isArray(rows)) return [];
    return rows.map((r: any) => {
      const contact = newDiphtheriaContact();
      contact.name = r?.name ?? null;
      contact.age = r?.age ?? null;
      contact.relationship = r?.relationship ?? null;
      contact.actionsTaken = r?.actionsTaken ?? null;
      DIPHTHERIA_SYMPTOM_KEYS.forEach((key) => (contact[key] = !!r?.[key]));
      DIPHTHERIA_DOSE_KEYS.forEach((key) => (contact[key] = r?.[key] ?? null));
      return contact;
    });
  } catch {
    return [];
  }
}
