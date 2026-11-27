import { ReportLocationType } from '../enums/ReportLocationType';

export enum ReportedCasesReportLevel {
  Government = 1,
  HealthAdministration = 2,
  IncidentSource = 3,
}

export interface ReportedCasesReportFilter {
  diseaseGroupsIds: number[];
  reportLocationType: ReportLocationType;
  governmentsIds: number[];
  healthAdministrationsIds: number[];
  incidentSourcesIds: number[];
  fromDate: string | null;
  toDate: string | null;
}

export interface ReportedCasesReportItem {
  governmentId: number | null;
  government: string | null;
  healthAdministrationId: number | null;
  healthAdministration: string | null;
  incidentSourceId: number | null;
  incidentSource: string | null;
  count: number;
}

export interface ReportedCasesReportData {
  level: ReportedCasesReportLevel;
  totalCount: number;
  items: ReportedCasesReportItem[];
}

export interface ReportedCasesReportDiseaseGroup {
  id: number;
  arabicName: string;
  englishName: string;
}
