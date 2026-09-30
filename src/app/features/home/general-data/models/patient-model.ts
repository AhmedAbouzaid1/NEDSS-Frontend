import { Patient } from './../../search/models/patient';
export class PatientModel {
  id!: number;
  incidentGovernmentId?: number;
  incidentHealthAdministrationId?: number;
  incidentSourceId?: number;
  incidentBranchId?: number;
  incidentAreaId?: number;
  incidentDepartmentId!: number;
  nationalityId!: number;
  patientJobCategoryId!: number;
  patientJobId!: number;
  homeGovernmentId!: number;
  homeHealthAdministrationId!: number;
  homeCityId!: number;
  homeHealthOfficeId!: number;
  homePrincipalityId!: number;
  newHomeGovernment!: string;
  newHomeHealthAdministration!: string;
  newHomeCity!: string;
  newHomeHealthOffice!: string;
  newLivingAddress!: string;
  finalResultId!: number;
  transferGovernmentId!: number;
  transferHealthAdministrationId:number;
  transferIncidentSourceId!: number;
  labPlaceId!: number;
  caseResultCategoryId!: number;
  diseaseSeverityId!: number;
  labPrimaryDiagonistics!: number;
  caseDiscoveryDate!: string;
  caseDiscoveryTime!: string;
  firstName!: string;
  secondName!: string;
  thirdName!: string;
  familyName!: string;
  nationalId!: string;
  passportNo!: string;
  phoneNo1!: string;
  phoneNo2!: string;
  isPhoneNo1International?: boolean;
  isPhoneNo2International?: boolean;
  newPhoneNo1!: string;
  genderId!: number;
  birthDate!: string;
  age!: number;
  ageTypeId!: number;
  maritalStatusId!: number;
  patientJobName!: string; // set
  educationPhaseId!: number;
  schoolCategoryId!: number;
  workAddress!: string;
  livingAddress!: string;
  patientHospitalNo!: string;
  doctorName!: string;
  hospitalEntryDate!: string;
  hospitalLeaveDate!: string;
  infectionDate!: string;
  incidentDate!: string;
  insertedByLab!: boolean;
  isHospitalLab!: boolean;
  hospitalLabSelection?: number | null;
  otherHospitalLabName?: string | null;
  isCentralLabLab!: boolean;
  isGovernmentLab!: boolean;
  isRegionalLab!: boolean;
  regionalLabId!: number;
  isSpecialLabLab!: boolean;
  specialLabSourceId!: number;
  specialLabName?: string | null;
  specialLabGovernmentId?: number | null;
  specialLabHealthAdministrationId?: number | null;
  relationShipDegreeId!: number;
  patientDiseases!: PatientDiseases[];
  finalDiagonisticsData!: FinalDiagonistics[];
  finalDiagonistics?: string;
  finalDiagonisticsByTicket?: string;
  feverSymptoms?: FeverSymptoms;
  clinicalSymptomIds?: number[];

  fields!: any[];
  questionAnswers!: any[];
  patientDiseaseGroupQuestionAnswers?: any[];
  hiddenInsideDepartment!: boolean;
  answerQuuetionForm!: any;
  finalResult!: any;
  caseResultCategory!: any;
  anotherChronicDisease!: any;
  haveChronicDisease?: Boolean;
  chronicDiseasesIds?: any = [];
  constructor() {
    this.feverSymptoms = new FeverSymptoms();
    this.clinicalSymptomIds = [];
    this.patientDiseases = [];
    this.chronicDiseasesIds = [];
  }
}

export class FeverSymptoms {
  id?: number;
  patientId?: number;
  feverDate?: string;
  feverDuration?: number;
  feverDurationType?: number = 3;
  feverMaxTemp?: number;
}

export class PatientDiseases {
  id!: number;
  patientId!: number;
  diseaseGroupId!: number;
  finalResult!: any;
  caseResultCategory!: any;
  router!: any;
  isSentinel!: any;
  constructor() {}
}
export class FinalDiagonistics {
  finalResult!: any;
  caseResultCategory!: any;
  constructor() {}
}

export class SentinelData {
  id?: number;
  patientName?: string;
  patientID?: number;
  sariCaseDefinition?: number;
  patientMeetSARI?: number;
  patientMeetExtendedSARI?: number;
  pneumoniaCaseDefinition?: number;
  causesPneumonia?: any;
  doesCase?: number;
  wardAdmission?: number;
  vapOrHap?: number;
  otherPneumonia?: string;
  patientReceiveInfluenzaAntiviral?: number;
  antibioticsTakenWithInLastWeek?: number;
  antibioticsIsTaken?: number;
  antibioticsName?: string;
  dateFirstDose?: Date;
  dateLastDose?: Date;
  dateSpecimenCollection?: Date;
  dateSpecimenShipment?: Date;
  surveyDate?: Date;
  nameHealthMonitor?: number;
  monitoringOfficer?: number;
  managerDirector?: number;
}
