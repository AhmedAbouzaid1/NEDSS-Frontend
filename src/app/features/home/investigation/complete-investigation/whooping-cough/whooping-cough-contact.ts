export interface WhoopingCoughContact {
  name: string | null;
  age: number | null;
  relationship: string | null;
  persistentCough: boolean;
  breathingDifficulty: boolean;
  cyanosisApnea: boolean;
  vomiting: boolean;
  dose1: number | null;
  dose2: number | null;
  dose3: number | null;
  booster: number | null;
  actionsTaken: string | null;
}

export const WHOOPING_COUGH_SYMPTOM_KEYS = ['persistentCough', 'breathingDifficulty', 'cyanosisApnea', 'vomiting'] as const;

export const WHOOPING_COUGH_DOSE_KEYS = ['dose1', 'dose2', 'dose3', 'booster'] as const;

export function newWhoopingCoughContact(): WhoopingCoughContact {
  return {
    name: null,
    age: null,
    relationship: null,
    persistentCough: false,
    breathingDifficulty: false,
    cyanosisApnea: false,
    vomiting: false,
    dose1: null,
    dose2: null,
    dose3: null,
    booster: null,
    actionsTaken: null,
  };
}

export function serializeWhoopingCoughContacts(rows: WhoopingCoughContact[]): string | null {
  return rows.length ? JSON.stringify(rows) : null;
}

export function parseWhoopingCoughContacts(json: string | null | undefined): WhoopingCoughContact[] {
  if (!json) return [];
  try {
    const rows = JSON.parse(json);
    if (!Array.isArray(rows)) return [];
    return rows.map((r: any) => {
      const contact = newWhoopingCoughContact();
      contact.name = r?.name ?? null;
      contact.age = r?.age ?? null;
      contact.relationship = r?.relationship ?? null;
      contact.actionsTaken = r?.actionsTaken ?? null;
      WHOOPING_COUGH_SYMPTOM_KEYS.forEach((key) => (contact[key] = !!r?.[key]));
      WHOOPING_COUGH_DOSE_KEYS.forEach((key) => (contact[key] = r?.[key] ?? null));
      return contact;
    });
  } catch {
    return [];
  }
}
