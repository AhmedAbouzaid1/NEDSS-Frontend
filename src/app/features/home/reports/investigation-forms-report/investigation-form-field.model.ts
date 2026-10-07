export interface InvestigationFormField {
  key: string;
  label: string[];
  section: string[];
  options?: Record<string, string[]>;
  optionsRef?: string;
  array?: boolean;
  aliases?: string[];
}

export interface InvestigationFormsReportFilter {
  diseaseGroupId: number;
  reportLocationType: number;
  governmentsIds: number[];
  healthAdministrationsIds: number[];
  incidentSourcesIds: number[];
  fromDate: string | null;
  toDate: string | null;
  isInvestigationDone: boolean | null;
  pageIndex: number;
  pageSize: number;
}

export interface InvestigationFormsReportItem {
  patientId: number;
  fullName: string;
  nationalId: string;
  gender: string;
  age: number;
  ageType: string;
  phoneNo: string;
  incidentGovernmentName: string;
  incidentHealthAdministrationName: string;
  incidentSourceName: string;
  homeGovernmentName: string;
  homeHealthAdministrationName: string;
  homeHealthOfficeName: string;
  caseDiscoveryDate: string;
  createdDate: string;
  finalResult: string;
  finalDiagnosis: string;
  isInvestigationDone: boolean;
  investigationDoneDate: string;
  investigationCompletePercentage: number | null;
  hasForm: boolean;
  form?: Record<string, any> | null;
}

export interface InvestigationFormsReportData {
  diseaseGroupId: number;
  diseaseGroupName: string;
  router: string;
  totalCount: number;
  doneCount: number;
  items: InvestigationFormsReportItem[];
}

export interface InvestigationFormsDiseaseGroup {
  id: number;
  arabicName: string;
  englishName: string;
  router: string;
}
