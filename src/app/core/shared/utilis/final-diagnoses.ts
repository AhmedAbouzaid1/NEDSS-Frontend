export const OTHER_FINAL_DIAGNOSIS_ID = -2;
export const FINAL_DIAGNOSIS_RESULT_TYPE = 2;

export function isFinalDiagnosisResult(resultType: { id?: number }[] | null | undefined): boolean {
  return resultType?.[0]?.id === FINAL_DIAGNOSIS_RESULT_TYPE;
}

export interface FinalDiagnosisOption {
  id: number;
  code?: string | null;
  diseaseGroupId?: number | null;
  arabicName?: string | null;
  englishName?: string | null;
  [key: string]: any;
}

const SUBTYPE_PREFIX = '— ';

const SUBTYPES_BY_MAIN: Record<string, string[]> = {
  'meningitis': ['bacterial meningitis', 'fungal meningitis', 'tuberculous meningitis'],
  'bacterial meningitis': [
    'non-epidemic bacterial meningitis - probable',
    'non-epidemic bacterial meningitis - confirmed',
    'epidemic bacterial meningitis - probable',
    'epidemic bacterial meningitis - confirmed',
    'unclassified bacterial meningitis - probable',
  ],
  'viral encephalitis': ['viral encephalitis - probable', 'viral encephalitis - confirmed'],
};

const nameKey = (d: FinalDiagnosisOption): string => (d.englishName ?? '').trim().toLowerCase();

const codeOf = (d: FinalDiagnosisOption): number => {
  const code = Number(d.code);
  return Number.isFinite(code) && String(d.code ?? '').trim() !== '' ? code : Number.MAX_SAFE_INTEGER;
};

const byCode = (a: FinalDiagnosisOption, b: FinalDiagnosisOption) => codeOf(a) - codeOf(b) || a.id - b.id;

export function orderFinalDiagnoses<T extends FinalDiagnosisOption>(list: T[] | null | undefined): T[] {
  const items = [...(list ?? [])].sort(byCode);
  const byName = new Map<string, T[]>();
  for (const item of items) {
    const members = byName.get(nameKey(item)) ?? [];
    members.push(item);
    byName.set(nameKey(item), members);
  }

  const childIds = new Set<number>();
  Object.entries(SUBTYPES_BY_MAIN).forEach(([main, subtypes]) => {
    if (!byName.has(main)) return;
    subtypes.forEach((name) => (byName.get(name) ?? []).forEach((c) => childIds.add(c.id)));
  });

  const result: T[] = [];
  const append = (item: T, depth: number) => {
    const prefix = SUBTYPE_PREFIX.repeat(depth);
    result.push(
      depth === 0
        ? item
        : { ...item, arabicName: prefix + (item.arabicName ?? ''), englishName: prefix + (item.englishName ?? '') }
    );
    for (const name of SUBTYPES_BY_MAIN[nameKey(item)] ?? []) {
      (byName.get(name) ?? []).forEach((child) => append(child, depth + 1));
    }
  };
  items.filter((d) => !childIds.has(d.id)).forEach((d) => append(d, 0));
  return result;
}

export function otherFinalDiagnosisOption(): FinalDiagnosisOption {
  return { id: OTHER_FINAL_DIAGNOSIS_ID, arabicName: 'أخرى (تشخيص نصي)', englishName: 'Other (text diagnosis)' };
}

export function finalDiagnosisOptionsWithOther<T extends FinalDiagnosisOption>(list: T[] | null | undefined): FinalDiagnosisOption[] {
  return [...orderFinalDiagnoses(list), otherFinalDiagnosisOption()];
}
