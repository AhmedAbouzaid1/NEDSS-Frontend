export interface IncidentSourceHospitalDTO {
  id?: number;
  code?: string;
  arabicName: string;
  englishName: string;
  governmentID: number;
  healthAdministrationID: number;
  incidentSourceTypeID: number;
  organizationID: number;
  dependencyID: number;
  reportingOrResidence: number;
  totalCount: number;
}
