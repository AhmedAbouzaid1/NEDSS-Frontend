export enum RespiratoryDiagnosisType {
  AcuteRespiratoryIllness = 1,
  Pneumonia = 2,
}

export interface RespiratoryDiagnosisOption {
  id: RespiratoryDiagnosisType;
  arabicName: string;
  englishName: string;
  icon: string;
}

export const RESPIRATORY_DIAGNOSIS_OPTIONS: RespiratoryDiagnosisOption[] = [
  {
    id: RespiratoryDiagnosisType.AcuteRespiratoryIllness,
    arabicName: 'الامراض التنفسية الحادة (ARI)',
    englishName: 'Acute Respiratory Illness (ARI)',
    icon: 'bi-wind',
  },
  {
    id: RespiratoryDiagnosisType.Pneumonia,
    arabicName: 'التهاب رئوي',
    englishName: 'Pneumonia',
    icon: 'bi-lungs',
  },
];

export function parseRespiratoryDiagnosisTypes(value: unknown): RespiratoryDiagnosisType[] {
  const allowed = RESPIRATORY_DIAGNOSIS_OPTIONS.map((option) => option.id);
  return String(value ?? '')
    .split(',')
    .map((part) => Number(part.trim()))
    .filter((id, index, all) => allowed.includes(id) && all.indexOf(id) === index)
    .sort((a, b) => a - b);
}

export function serializeRespiratoryDiagnosisTypes(ids: RespiratoryDiagnosisType[]): string | null {
  const parsed = parseRespiratoryDiagnosisTypes((ids ?? []).join(','));
  return parsed.length ? parsed.join(',') : null;
}
