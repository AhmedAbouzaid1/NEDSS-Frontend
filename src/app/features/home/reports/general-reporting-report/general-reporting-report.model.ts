import { ReportLocationType } from '../enums/ReportLocationType';

export interface GeneralReportingReportFilter {
  diseaseGroupsIds: number[];
  reportLocationType: ReportLocationType;
  governmentsIds: number[];
  healthAdministrationsIds: number[];
  incidentSourcesIds: number[];
  fromDate: string | null;
  toDate: string | null;
  pageIndex: number;
  pageSize: number;
}

export interface GeneralReportingColumn {
  key: string;
  group: string;
  header: string;
}

export interface GeneralReportingReportData {
  totalCount: number;
  columns: GeneralReportingColumn[];
  items: Record<string, string | number | null>[];
}

export interface GeneralReportingDiseaseGroup {
  id: number;
  arabicName: string;
  englishName: string;
}
