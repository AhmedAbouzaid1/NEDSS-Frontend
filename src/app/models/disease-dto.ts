export interface DiseaseDTO {
  id?: number;
  code?: string;
  arabicName?: string;
  englishName?: string;
  icd10?: string;
  treatmentPeriodInDays?: number;
  diseaseCategoryId?: number;
  diseaseGroupId?: number;
  infectionAllowncePeriod?: boolean;
  infictionAgeLimit?: number;
  ageTypeId?: number;
  hasTrackingForm?: boolean;
  openFormExamination?: boolean;
  totalCount?: number;
}
