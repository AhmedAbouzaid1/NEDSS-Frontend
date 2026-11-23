import { ReportLocationType } from '../enums/ReportLocationType';

export interface SchoolsReportFilter {
  diseaseGroupsIds: number[];
  finalDiseasesIds: number[];
  reportLocationType: ReportLocationType;
  governmentsIds: number[];
  healthAdministrationsIds: number[];
  incidentSourcesIds: number[];
  fromDate: string | null;
  toDate: string | null;
  pageIndex: number;
  pageSize: number;
}

export interface SchoolsReportColumn {
  key: string;
  header: string;
}

export interface SchoolsReportData {
  totalCount: number;
  columns: SchoolsReportColumn[];
  items: Record<string, string | number | null>[];
}

export const SCHOOLS_REPORT_GROUP_KEYS = ['disease', 'homeGovernment', 'homeHealthAdministration', 'incidentSource'];

export function schoolsReportRowSpans(items: Record<string, string | number | null>[]): Record<string, number>[] {
  const spans = items.map(() => ({} as Record<string, number>));
  const keys = SCHOOLS_REPORT_GROUP_KEYS;
  keys.forEach((key, level) => {
    let start = 0;
    for (let i = 1; i <= items.length; i++) {
      const sameGroup = i < items.length && keys.slice(0, level + 1).every((k) => (items[i][k] ?? '') === (items[start][k] ?? ''));
      if (sameGroup) continue;
      spans[start][key] = i - start;
      for (let j = start + 1; j < i; j++) spans[j][key] = 0;
      start = i;
    }
  });
  return spans;
}

export interface SchoolsReportDiseaseGroup {
  id: number;
  arabicName: string;
  englishName: string;
}
