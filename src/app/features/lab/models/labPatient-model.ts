export class PatientModel {
  id:number;
  nationalityId!: number;
  homeGovernmentId!: number;
  homeHealthAdministrationId!: number;
  homeCityId!: number;
  homeHealthOfficeId!: number;
  firstName!: string;
  secondName!: string;
  thirdName!: string;
  familyName!: string;
  nationalId!: string;
  passportNo!: string;
  phoneNo1!: string;
  phoneNo2!: string;
  caseDiscoveryDate!: string;
  insertedByLab!: boolean;
  isHospitalLab!: boolean;
  isCentralLabLab!: boolean;
  isGovernmentLab!: boolean;
  isRegionalLab!: boolean;
  insertedByLabId!: number;
  isSpecialLabLab!: boolean;
  patientLabChecks!: PatientLabCheck[];
  livingAddress!: string;

  constructor() {}
}

export class PatientLabCheck {
  diseaseCheckId!: number;
  dieaseLabTestId!: number;
  diseaseGroupId: number;
  diseaseLabTestResultId!: number;
  getSampleDate!: any;
  labResultDate!: any;
  constructor() {}
}
