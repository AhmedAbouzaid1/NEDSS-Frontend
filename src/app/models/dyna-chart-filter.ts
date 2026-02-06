export interface DynaChartFilter {
  diseaseIDs?: number[];
  startDate?: Date;
  endDate?: Date;
  finalResultID?: number;
  homeGovIDs?: number[];
  incidentGovIDS?: number[];
  incidentAdminIDs?: number[];
  incidentSourceIDS?: number[];
  departmentIDS?: number[];
  nationalityIDs?: number[];
  jobID?: number[];
  labResultIDS?: number[];
  incidentSourceTypeIDS?: number[];

  caseResultCategoryID?: number[];
  reportingRate?: ReportingRate;

  groupBy?: GroupBy;
}

export enum ReportingRate {
  Weeks = 1,
  Months = 2,
  Quarter = 3,
}
export enum GroupBy {
  IncGovernment = 1,
  HealthAdmin = 2,
  IncidentSource = 3,
  Year = 4,
  Weak = 5,
  Month = 6,
  Department = 7,
  CaseResultCategory = 8,
  JobID = 9,
  HomeGovernment = 10,
  Disease = 11
}
