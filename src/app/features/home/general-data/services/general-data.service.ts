import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { BaseAPIService } from 'src/app/core/services/BaseAPI.service';
import { UserMessageService } from 'src/app/core/services/user.message.service';
import { environment } from 'src/environments/environment';
import { TranslateService } from '@ngx-translate/core';
import { ActiveUserService } from 'src/app/core/services/active-user.service';
import { NationalityEnum } from '../models/nationality-enum';
import { PatientModel } from '../models/patient-model';
import { DepartmentEnum } from '../models/department-enum';

@Injectable({
  providedIn: 'root',
})
export class GeneralDataService {
  private settingControllerURL: string =
    environment.baseApiUrl + 'SystemSettings/';
  private controllerURL: string = environment.baseApiUrl + 'Patient/';
  private sentinelControllerURL: string =
    environment.baseApiUrl + 'InvistigationForms/';

  constructor(
    private APIs: BaseAPIService,
    private userMsg: UserMessageService,
    private translate: TranslateService,
    private activeUSerService: ActiveUserService
  ) { }

  /**
   * Ensures camelCase fields exist when API returns PascalCase.
   * Mutates the payload in place.
   */
  normalizePatientApiPayload(d: any): any {
    if (d == null || typeof d !== 'object') {
      return d;
    }
    const alias = (target: any, camel: string, pascal: string) => {
      const cur = target[camel];
      if ((cur === null || cur === undefined) && target[pascal] != null) {
        target[camel] = target[pascal];
      }
    };
    const pairs: [string, string][] = [
      ['id', 'Id'],
      ['patientID', 'PatientID'],
      ['incidentGovernmentId', 'IncidentGovernmentId'],
      ['incidentHealthAdministrationId', 'IncidentHealthAdministrationId'],
      ['incidentSourceId', 'IncidentSourceId'],
      ['incidentBranchId', 'IncidentBranchId'],
      ['incidentAreaId', 'IncidentAreaId'],
      ['incidentDepartmentId', 'IncidentDepartmentId'],
      ['nationalityId', 'NationalityId'],
      ['homeGovernmentId', 'HomeGovernmentId'],
      ['homeHealthAdministrationId', 'HomeHealthAdministrationId'],
      ['homeCityId', 'HomeCityId'],
      ['homeHealthOfficeId', 'HomeHealthOfficeId'],
      ['homePrincipalityId', 'HomePrincipalityId'],
      ['livingAddress', 'LivingAddress'],
      ['relationShipDegreeId', 'RelationShipDegreeId'],
      ['genderId', 'GenderId'],
      ['age', 'Age'],
      ['ageTypeId', 'AgeTypeId'],
      ['birthDate', 'BirthDate'],
      ['caseDiscoveryDate', 'CaseDiscoveryDate'],
      ['caseDiscoveryTime', 'CaseDiscoveryTime'],
      ['hospitalEntryDate', 'HospitalEntryDate'],
      ['hospitalLeaveDate', 'HospitalLeaveDate'],
      ['infectionDate', 'InfectionDate'],
      ['incidentDate', 'IncidentDate'],
      ['clinicalSymptomIds', 'ClinicalSymptomIds'],
      ['patientDiseases', 'PatientDiseases'],
      ['finalDiagonisticsData', 'FinalDiagonisticsData'],
      ['feverSymptoms', 'FeverSymptoms'],
      ['chronicDiseasesIds', 'ChronicDiseasesIds'],
      ['finalResultId', 'FinalResultId'],
      ['transferGovernmentId', 'TransferGovernmentId'],
      ['transferHealthAdministrationId', 'TransferHealthAdministrationId'],
      ['transferIncidentSourceId', 'TransferIncidentSourceId'],
      ['specialLabSourceId', 'SpecialLabSourceId'],
      ['isSpecialLabLab', 'IsSpecialLabLab'],
    ];
    for (const [camel, pascal] of pairs) {
      alias(d, camel, pascal);
    }
    const coerceNumericIds = (target: any, keys: string[]) => {
      for (const k of keys) {
        const v = target[k];
        if (typeof v === 'string' && /^\s*\d+\s*$/.test(v)) {
          const n = parseInt(String(v).trim(), 10);
          if (Number.isFinite(n)) {
            target[k] = n;
          }
        }
      }
    };
    coerceNumericIds(d, [
      'id',
      'incidentGovernmentId',
      'incidentHealthAdministrationId',
      'incidentSourceId',
      'incidentBranchId',
      'incidentAreaId',
      'incidentDepartmentId',
      'nationalityId',
      'homeGovernmentId',
      'homeHealthAdministrationId',
      'homeCityId',
      'homeHealthOfficeId',
      'homePrincipalityId',
      'transferGovernmentId',
      'transferHealthAdministrationId',
      'transferIncidentSourceId',
      'specialLabSourceId',
    ]);
    if (d.feverSymptoms && typeof d.feverSymptoms === 'object') {
      const fs = d.feverSymptoms;
      alias(fs, 'id', 'Id');
      alias(fs, 'patientId', 'PatientId');
      alias(fs, 'feverDuration', 'FeverDuration');
      alias(fs, 'feverMaxTemp', 'FeverMaxTemp');
      alias(fs, 'feverDurationType', 'FeverDurationType');
    }
    return d;
  }

  getPatientsDashboard(filter: any) {
    return this.APIs.get(this.controllerURL + 'GetPage', filter);
  }
  getTimePerctenage(filter: any) {
    return this.APIs.create(this.controllerURL + 'getTimePerctenage', filter);
  }
  getTimePerctenageByFilter(filter: any) {
    return this.APIs.create(
      this.controllerURL + 'getTimePerctenageByFilter',
      filter
    );
  }

  getReportedCasesByFilter(filter: any) {
    return this.APIs.create(
      this.controllerURL + 'getReportedCasesByFilter',
      filter
    );
  }

  getInvestigationPercentage() {
    return this.APIs.get(this.settingControllerURL + 'Get');
  }

  getNotInferringCasesByFilter(filter: any) {
    return this.APIs.create(
      this.controllerURL + 'getNotInferringCasesByFilter',
      filter
    );
  }

  saveInvestigationPercentage(value: number) {
    return this.APIs.update(this.settingControllerURL + 'Update', value);
  }
  getExamineCasesByFilter(filter: any) {
    return this.APIs.create(
      this.controllerURL + 'getExamineCasesByFilter',
      filter
    );
  }

  getUnCompletedInvCasesByFilter(filter: any) {
    return this.APIs.create(
      this.controllerURL + 'getUnCompletedInvCasesByFilter',
      filter
    );
  }
  getPageGeneralDataFullPercentage(filter: any) {
    return this.APIs.create(
      this.controllerURL + 'getFollowUpPercentage',
      filter
    );
  }
  getAllDashboard(patientFilter: any) {
    if (navigator.onLine) {
      return this.APIs.create(
        this.controllerURL + 'GetPageDashboard',
        patientFilter
      );
    } else {
      var patients = [];
      if (localStorage.getItem('Temp_DB.Patients') != undefined) {
        patients = patients.concat(
          JSON.parse(localStorage.getItem('Temp_DB.Patients'))
        );
      }
      var nationalites = JSON.parse(
        localStorage.getItem('getAllNationalitys')
      ).data;
      var government = JSON.parse(
        localStorage.getItem('getAllGovernments')
      ).data;
      var lst = [];
      patients[0].patient.totalCount = patients.length;
      for (let i = 0; i < patients.length; i++) {
        var patient = patients[i].patient;
        patient.fullName =
          patient.firstName +
          ' ' +
          patient.secondName +
          ' ' +
          patient.thirdName;

        if (localStorage.getItem('ls.currentLang') == 'ar') {
          patient.nationality = nationalites.filter(
            (a) => a.id == patient.nationalityId
          )[0]?.arabicName;
          patient.homeGovernmentName = government.filter(
            (a) => a.id == patient.homeGovernmentId
          )[0]?.arabicName;
        } else {
          patient.nationality = nationalites.filter(
            (a) => a.id == patient.nationalityId
          )[0]?.englishName;
          patient.homeGovernmentName = government.filter(
            (a) => a.id == patient.homeGovernmentId
          )[0]?.englishName;
        }
        lst.push(patient);
      }
      const data = new Observable((observer) => {
        observer.next({ data: lst });
        observer.complete();
      });
      return data;
    }
  }
  getPageCount(patientFilter: any) {
    return this.APIs.create(this.controllerURL + 'GetPage', {
      ...patientFilter,
      countOnly: true,
    });
  }

  getAll(patientFilter: any) {
    if (navigator.onLine) {
      return this.APIs.create(this.controllerURL + 'GetPage', patientFilter);
    } else {
      var patients = [];
      if (localStorage.getItem('Temp_DB.Patients') != undefined) {
        patients = patients.concat(
          JSON.parse(localStorage.getItem('Temp_DB.Patients'))
        );
      }
      var nationalites = JSON.parse(
        localStorage.getItem('getAllNationalitys')
      ).data;
      var government = JSON.parse(
        localStorage.getItem('getAllGovernments')
      ).data;
      var lst = [];
      patients[0].patient.totalCount = patients.length;
      for (let i = 0; i < patients.length; i++) {
        var patient = patients[i].patient;
        patient.fullName =
          patient.firstName +
          ' ' +
          patient.secondName +
          ' ' +
          patient.thirdName;

        if (localStorage.getItem('ls.currentLang') == 'ar') {
          patient.nationality = nationalites.filter(
            (a) => a.id == patient.nationalityId
          )[0]?.arabicName;
          patient.homeGovernmentName = government.filter(
            (a) => a.id == patient.homeGovernmentId
          )[0]?.arabicName;
        } else {
          patient.nationality = nationalites.filter(
            (a) => a.id == patient.nationalityId
          )[0]?.englishName;
          patient.homeGovernmentName = government.filter(
            (a) => a.id == patient.homeGovernmentId
          )[0]?.englishName;
        }
        lst.push(patient);
      }
      const data = new Observable((observer) => {
        observer.next({ data: lst });
        observer.complete();
      });
      return data;
    }
  }
  delete(id: number) {
    return this.APIs.delete(this.controllerURL + 'Delete?id=' + id);
  }
  deletemultiable(id: string) {
    return this.APIs.delete(this.controllerURL + 'DeleteByIds?ids=' + id);
  }
  getBy(id: number) {
    return this.APIs.get(this.controllerURL + 'GetById?id=' + id);
  }
  getPatientByIdForInvestigation(id: number) {
    return this.APIs.get(this.controllerURL + 'GetPatientByIdForInvestigation?id=' + id);
  }


  update(patient: any) {
    return this.APIs.update(this.controllerURL + 'Update', patient);
  }
  updateInvestigation(patient: any) {
    return this.APIs.update(
      this.controllerURL + 'UpdateNotInvetigation',
      patient
    );
  }
  add(patient: any) {
    if (navigator.onLine) {
      return this.APIs.post(this.controllerURL + 'Add', patient);
    } else {
      var patients = [];
      if (localStorage.getItem('Temp_DB.Patients') != undefined) {
        patients = patients.concat(
          JSON.parse(localStorage.getItem('Temp_DB.Patients'))
        );
      }
      patients.push({
        patient: patient,
      });
      patient.id = patients.length * -1;
      localStorage.setItem('Temp_DB.Patients', JSON.stringify(patients));
      const data = new Observable((observer) => {
        observer.next({
          messages: null,
          statusCode: 200,
          data: patient,
        });
        observer.complete();
      });
      return data;
    }
  }
  getByNationalId(id: string) {
    return this.APIs.get(
      this.controllerURL + 'GetByNationalId?id=' + encodeURIComponent(String(id))
    );
  }
  getAllByNationalId(id: string) {
    if (navigator.onLine) {
      return this.APIs.get(
        this.controllerURL +
        'GetAllByNationalId?id=' +
        encodeURIComponent(String(id))
      );
    } else {
      const data = new Observable((observer) => {
        observer.next();
        observer.complete();
      });
      return data;
    }
  }
  getByPassportNo(id: string) {
    return this.APIs.get(
      this.controllerURL + 'GetByPassportNo?id=' + encodeURIComponent(String(id))
    );
  }
  getAllByPassportNo(id: string) {
    if (navigator.onLine) {
      return this.APIs.get(
        this.controllerURL +
        'GetAllByPassportNo?id=' +
        encodeURIComponent(String(id))
      );
    } else {
      const data = new Observable((observer) => {
        observer.next();
        observer.complete();
      });
      return data;
    }
  }
  addSentinel(sentinel: any) {
    if (navigator.onLine) {
      return this.APIs.post(
        this.sentinelControllerURL + 'AddSentinel',
        sentinel
      );
    } else {
      var patients = [];
      if (localStorage.getItem('Temp_DB.Patients') != undefined) {
        patients = patients.concat(
          JSON.parse(localStorage.getItem('Temp_DB.Patients'))
        );
        patients[patients.length - 1].sentinel = sentinel;
      }
      localStorage.setItem('Temp_DB.Patients', JSON.stringify(patients));
      const data = new Observable((observer) => {
        observer.next({
          messages: null,
          statusCode: 200,
          data: sentinel,
        });
        observer.complete();
      });
      return data;
    }
  }
  updateSentinel(sentinel: any) {
    return this.APIs.update(
      this.sentinelControllerURL + 'UpdateSentinel',
      sentinel
    );
  }
  getSentinelByPID(patientID: number) {
    return this.APIs.get(
      this.sentinelControllerURL + 'GetSentinelByPatientId?id=' + patientID
    );
  }
  getAllSentinels() {
    return this.APIs.get(this.sentinelControllerURL + 'GetAllSentinels');
  }
  syncData() {
    let tempD = JSON.parse(localStorage.getItem('Temp_DB.Patients'));
    let isSending: boolean = false;
    if (tempD != null && tempD != undefined && tempD.length > 0) {
      for (let i = 0; i < tempD.length; i++) {
        if (isSending == false) {
          tempD[0].patient.id = null;
          this.APIs.post(
            this.controllerURL + 'Add',
            tempD[0].patient
          ).subscribe({
            next: (result) => {
              tempD[0].patient.id = result.data.id;
              isSending = true;
            },
            error: (err) => {
              console.error(err);
              isSending = true;
            },
            complete: () => {
              if (tempD[0].sentinel != null && tempD[0].sentinel != undefined) {
                tempD[0].sentinel.patientID = tempD[0].patient.id;
                tempD[0].sentinel.id = null;
                this.APIs.post(
                  this.sentinelControllerURL + 'AddSentinel',
                  tempD[0].sentinel
                ).subscribe({
                  next: () => {
                    isSending = true;
                  },
                  error: () => {
                    isSending = true;
                  },
                  complete: () => {
                    this.userMsg.success('تم اضافة ' + (i + 1) + ' مريض');
                    tempD.splice(0, 1);
                    localStorage.setItem(
                      'Temp_DB.Patients',
                      JSON.stringify(tempD)
                    );
                    isSending = false;
                  },
                });
              } else {
                this.userMsg.success('تم اضافة ' + (i + 1) + ' مريض');
                tempD.splice(0, 1);
                localStorage.setItem('Temp_DB.Patients', JSON.stringify(tempD));
                isSending = false;
              }
            },
          });
        } else {
          i--;
        }
        if (i + 1 == tempD.length) {
          this.userMsg.success(' تم اضافة كل المرضى  ');
        }
      }
    }
  }

  // MARK IMP
  validateRequiredFields(patient) {
    var inc = this.validateIncidentInfo(patient) == -1;
    var dem = this.validateDemographicInfo(patient) == -1;
    var res = this.validateResidenceInfo(patient) == -1;
    var cli = true;
    var dia = this.validateDiagnostics(patient) == -1;

    if (!inc || !dem || !res || !cli || !dia) {
      return false;
    }
    return true;
  }
  validatespecialSymptoms(patient: PatientModel): boolean {
    let result = true;
    for (let index = 0; index < patient?.fields?.length; index++) {
      const element = patient?.fields?.[index];
      const answer = patient.patientDiseaseGroupQuestionAnswers?.find(
        (x) => x?.diseaseGroupQuestionId == element?.diseaseGroupQuestionId
      );
      if (
        element?.diseaseGroupQuestionIsRequired &&
        !answer?.answer &&
        !answer?.diseaseGroupQuestionAnswersIds?.length
      ) {
        result = false;
        break;
      }
    }
    return result;
  }

  //#region "Incidence Info"
  isIncidentGovernmentValid: boolean = true;
  isIncidentHealthAdministrationValid: boolean = true;
  isIncidentSourceValid: boolean = true;
  isIncidentDepartmentValid: boolean = true;
  isCaseDiscoveryDateValid: boolean = true;
  isNationalityValid: boolean = true;
  isCardIdValid: boolean = true;
  isPassportIdValid: boolean = true;
  isUniversityValid: boolean = true;
  isBranchValid: boolean = true;
  isAreaValid: boolean = true;

  cardIdValidationMessage: string;

  validateIncidentInfo(patient): any {
    this.isIncidentGovernmentValid =
      this.checkIncidentGovernmentValid(patient.incidentGovernmentId) ||
      !this.activeUSerService.getAccessibleParts?.showGovernments;

    this.isIncidentHealthAdministrationValid =
      this.checkIncidentHealthAdministrationValid(
        patient.incidentHealthAdministrationId
      ) || !this.activeUSerService.getAccessibleParts?.showDepartments;

    this.isIncidentSourceValid =
      this.checkIncidentSourceValid(patient.incidentSourceId) ||
      !this.activeUSerService.getAccessibleParts?.showSources;

    this.isUniversityValid =
      this.validateField(patient.incidentBranchId) ||
      !this.activeUSerService.getAccessibleParts?.showUniversities;

    this.isBranchValid =
      this.validateField(patient.incidentBranchId) ||
      !this.activeUSerService.getAccessibleParts?.showBranches;

    this.isAreaValid =
      this.validateField(patient.incidentAreaId) ||
      !this.activeUSerService.getAccessibleParts?.enableAreas;

    this.isIncidentDepartmentValid = this.checkIncidentDepartmentValid(
      patient.incidentDepartmentId
    );
    this.isCaseDiscoveryDateValid = this.checkCaseDiscoveryDateValid(
      patient.caseDiscoveryDate
    );
    this.isNationalityValid = this.checkNationalityValid(patient.nationalityId);
    this.isCardIdValid = this.checkCardIdValid(
      patient.incidentDepartmentId,
      patient.nationalityId,
      patient.nationalId
    );
    this.isPassportIdValid = this.checkPassportIdValid(
      patient.nationalityId,
      patient.passportNo,
      patient.incidentDepartmentId == DepartmentEnum.Internal || patient.incidentDepartmentId == DepartmentEnum.ICU
    );

    var validationResults = [
      this.isIncidentGovernmentValid,
      this.isIncidentHealthAdministrationValid,
      this.isIncidentSourceValid,
      this.isIncidentDepartmentValid,
      this.isCaseDiscoveryDateValid,
      this.isNationalityValid,
      this.isCardIdValid,
      this.isPassportIdValid,
      this.isUniversityValid,
      this.isBranchValid,
      this.isAreaValid,
    ];

    return validationResults.findIndex((result) => result == false);

    // return validationResults.every(result => result);
  }

  checkIncidentGovernmentValid = (incidentGovernmentId) =>
    incidentGovernmentId !== null &&
    incidentGovernmentId !== undefined &&
    incidentGovernmentId != -1;
  checkIncidentHealthAdministrationValid = (incidentHealthAdministrationId) =>
    incidentHealthAdministrationId !== null &&
    incidentHealthAdministrationId !== undefined &&
    incidentHealthAdministrationId !== -1;
  checkIncidentSourceValid = (incidentSourceId) =>
    incidentSourceId !== null &&
    incidentSourceId !== undefined &&
    incidentSourceId !== -1;
  checkIncidentDepartmentValid = (incidentDepartmentId) =>
    incidentDepartmentId !== null &&
    incidentDepartmentId !== undefined &&
    incidentDepartmentId !== -1;
  checkCaseDiscoveryDateValid = (caseDiscoveryDate) =>
    caseDiscoveryDate !== null &&
    caseDiscoveryDate !== '' &&
    caseDiscoveryDate !== undefined &&
    caseDiscoveryDate !== -1;
  checkNationalityValid = (nationalityId) =>
    nationalityId !== null &&
    nationalityId !== undefined &&
    nationalityId !== -1;
  checkCardIdValid(incidentDepartmentId, nationalityId, nationalId) {
    if (nationalityId == NationalityEnum.Egyptian) {
      return this.validateNationalID(
        nationalId,
        incidentDepartmentId == DepartmentEnum.Internal || incidentDepartmentId == DepartmentEnum.ICU
      );
    }
    return true;
  }
  checkPassportIdValid(nationalityId, passportNo, isRequired) {
    if (isRequired) {
      if (nationalityId != NationalityEnum.Egyptian && !passportNo) {
        return false;
      }
    }
    return true;
  }
  //#endregion "Incidence Info"

  //#region "Demographic Info"
  isFirstNameValid: boolean = true;
  isSecondNameValid: boolean = true;
  isThirdNameValid: boolean = true;
  isFamilyNameValid: boolean = true;
  isPhoneNumber1Valid: boolean = true;
  livingAddressValid: boolean = true;
  isGenderValid: boolean = true;
  isAgeTypeValid: boolean = true;
  isAgeValid: boolean = true;
  isBirthDateValid: boolean = true;
  isPassportValid: boolean = true;
  isNationalValid: boolean = true;

  firstNameValidationMessage: string;
  secondNameValidationMessage: string;
  thirdNameValidationMessage: string;
  familyNameValidationMessage: string;
  phoneNo1ValidationMessage: string;
  phoneNo2ValidationMessage: string;
  birthDateValidationMessage: string;
  ageValidationMessage: string;

  validateDemographicInfo(patient): any {
    this.isFirstNameValid = this.checkFirstNameValid(patient.firstName, true);
    this.isSecondNameValid = this.checkSecondNameValid(
      patient.secondName,
      true
    );
    this.isThirdNameValid = this.checkThirdNameValid(patient.thirdName, true);
    this.isFamilyNameValid = this.checkFamilyNameValid(
      patient.familyName,
      false
    );
    const phoneRequired = patient.incidentDepartmentId == DepartmentEnum.Internal || patient.incidentDepartmentId == DepartmentEnum.ICU;
    this.isPhoneNumber1Valid = this.validatePhoneNumber1(
      patient.phoneNo1,
      phoneRequired
    );
    this.livingAddressValid = this.validatePhoneNumber1(
      patient.livingAddress,
      false
    );
    this.isGenderValid = this.checkGenderValid(patient.genderId);
    this.isAgeTypeValid = this.checkAgeTypeValid(patient.ageTypeId);
    this.isAgeValid = this.validateAge(patient.age, true);
    this.isBirthDateValid = this.validateBirthDate(patient.birthDate, false);
    this.isPassportValid = this.validateField(patient.passportNo);
    this.isNationalValid = this.validateField(patient.nationalId);
    let validationResults = [
      this.isFirstNameValid,
      this.isSecondNameValid,
      this.isThirdNameValid,
      this.isFamilyNameValid,
      this.isPhoneNumber1Valid,
      //this.livingAddressValid,
      this.isGenderValid,
      this.isAgeValid,
      this.isAgeTypeValid,
      this.isPassportValid ||
      this.isNationalValid ||
      patient.incidentDepartmentId != 1,
    ];

    return validationResults.findIndex((result) => result == false);
    // return validationResults.every(result => result);
  }

  checkFirstNameValid = (firstName, isRequired) =>
    this.validateFirstName(firstName, isRequired);
  checkSecondNameValid = (secondName, isRequired) =>
    this.validateSecondName(secondName, isRequired);
  checkThirdNameValid = (thirdName, isRequired) =>
    this.validateThirdName(thirdName, isRequired);
  checkFamilyNameValid = (familyName, isRequired) =>
    !familyName || this.validateFamilyName(familyName, isRequired);
  checkGenderValid = (genderId) => this.validateField(genderId);
  checkAgeTypeValid = (ageTypeId) => this.validateField(ageTypeId);
  validateAge(age: number, isRequired: boolean = false): boolean {
    if (isRequired && !this.validateEmptyField(age)) {
      this.ageValidationMessage = 'NEDSS.COMMON.FILEDREQUIRED';
      return false;
    }
    if (this.validateEmptyField(age)) {
      if (age < 1 || age > 150) {
        this.ageValidationMessage = 'NEDSS.COMMON.AGE_VALIDATION';
        return false;
      }

      return true;
    }
    return true;
  }
  //#endregion "Demographic Info"

  //#region "Residence Info"
  isHomeGovernmentValid: boolean = true;
  isHomeHealthAdministrationValid: boolean = true;
  isHomeCityValid: boolean = true;
  isHomeHealthOfficeIdValid: boolean = true;
  isAdressValid: boolean = true;

  addressValidationMessage: string;
  notesValidationMessage: string;

  validateResidenceInfo(patient): any {
    this.isHomeGovernmentValid = this.validateField(patient.homeGovernmentId);
    this.isHomeHealthAdministrationValid = this.validateField(
      patient.homeHealthAdministrationId
    );
    this.isHomeCityValid = this.validateField(patient.homeCityId);
    this.isHomeHealthOfficeIdValid = this.validateField(
      patient.homeHealthOfficeId
    );
    this.isAdressValid = this.validateAddress(patient.livingAddress, true);

    var validationResults = [
      this.isHomeGovernmentValid,
      this.isHomeHealthAdministrationValid,
      this.isHomeCityValid,
      this.isHomeHealthOfficeIdValid,
      this.isAdressValid,
    ];

    return validationResults.findIndex((result) => result == false);

    // return validationResults.every(result => result);
  }

  validateAddress(address, isRequired): boolean {
    if (isRequired && !this.validateEmptyField(address)) {
      this.addressValidationMessage = 'NEDSS.COMMON.FILEDREQUIRED';
      return false;
    }

    if (address != undefined) {
      var pattern = '^(?![0-9]+$).{5,100}$';
      var reg = new RegExp(pattern);
      var isValid = reg.test(address);
      if (!isValid) {
        this.addressValidationMessage =
          'NEDSS.LAB_VIEW.ADD_PATIENT.INVALID_Address';
        return false;
      }
    }
    return true;
  }

  validateNotes(notes, isRequired): boolean {
    if (isRequired && !this.validateEmptyField(notes)) {
      this.notesValidationMessage = 'NEDSS.COMMON.FILEDREQUIRED';
      return false;
    }

    if (notes != undefined) {
      var pattern = '^(?![0-9]+$).{3,100}$';
      var reg = new RegExp(pattern);
      var isValid = reg.test(notes);
      if (!isValid) {
        this.notesValidationMessage =
          'NEDSS.LAB_VIEW.ADD_PATIENT.INVALID_Notes';
        return false;
      }
    }
    return true;
  }
  //#endregion "Residence Info"

  //#region "Clinical Symptoms"
  isFeverDurationValid: boolean = true;
  isFeverMaxTemperatureValid: boolean = true;
  isGeneralSymptomsValid: boolean = true;
  isGASTROLINTESTINALSympotomsValid: boolean = true;
  isNervousSystemSymptomValid: boolean = true;
  isRespiratorySystemSymptomValid: boolean = true;
  isFeverDurationTypeValid: boolean = true;
  isChronicDiseaseValid: boolean = true;

  validateClinicalSymptoms(patient): any {
    if (
      patient.feverSymptoms != undefined &&
      patient.feverSymptoms != null
    ) {
      this.isFeverDurationValid = this.isNumberPositiveAndLessThanMax(
        patient.feverSymptoms.feverDuration,
        3
      );
      this.isFeverMaxTemperatureValid =
        this.validateFeverMaxTemperature(
          patient.feverSymptoms.feverMaxTemp
        );
      this.isChronicDiseaseValid = this.validateChronicDisease(
        patient.chronicDiseasesIds,
        patient.anotherChronicDisease,
        patient.haveChronicDisease
      );

      this.isFeverDurationTypeValid =
        Number(patient.feverSymptoms.feverDurationType) > 0 ||
        !patient.feverSymptoms.feverDuration;

      this.isGeneralSymptomsValid = true;
      this.isGASTROLINTESTINALSympotomsValid = true;
      this.isNervousSystemSymptomValid = true;
      this.isRespiratorySystemSymptomValid = true;

      var validationResults = [
        this.isFeverDurationValid,
        this.isFeverMaxTemperatureValid,
        this.isGeneralSymptomsValid,
        this.isGASTROLINTESTINALSympotomsValid,
        this.isNervousSystemSymptomValid,
        this.isRespiratorySystemSymptomValid,
        this.isFeverDurationTypeValid,
        this.isChronicDiseaseValid,
      ];
      return validationResults.findIndex((result) => result == false);
      // return validationResults.every(result => result);
    }
    return -1;
  }

  isNumberPositiveAndLessThanMax(num: number, maxDigits: number): boolean {
    if (this.validateEmptyField(num)) {
      let pattern = `^[0-9]{1,${maxDigits}}$`;
      let regex = new RegExp(pattern);
      let isValid = regex.test(num.toString());
      return isValid && num >= 0;
    }
    return true;
  }

  isValidFax(fax: number): boolean {
    if (this.validateEmptyField(fax)) {
      let pattern = /^\+\d{1,3} \(\d{1,3}\) \d{1,10}$/;
      let isValid = pattern.test(fax.toString());
      return isValid;
    }
    return true;
  }

  validateFeverMaxTemperature(temperature: number): boolean {
    if (this.validateEmptyField(temperature)) {
      return !isNaN(temperature) && temperature >= 37 && temperature <= 42;
    }
    return true;
  }
  validateChronicDisease(
    ChronicDisease: any[],
    anotherChronicDisease,
    haveChronicDisease
  ): boolean {
    if (
      !ChronicDisease?.length &&
      !anotherChronicDisease &&
      haveChronicDisease
    ) {
      return false;
    }
    return true;
  }
  //#endregion "Clinical Symptoms"

  //#region "Diagnostic Info"
  isPatientHospitalNoValid: boolean = true;
  isDoctorNameValid: boolean = true;
  isPatientDiseasesValid: boolean = true;
  isInfectionDateValid: boolean = true;
  isHospitalEntryDateValid: boolean = true;

  doctorNameValidationMessage: string;

  validateDiagnostics(patient): any {
    this.isPatientHospitalNoValid = this.validatePatientHospitalNo(
      patient.patientHospitalNo
    );
    this.isDoctorNameValid = this.validateDoctorName(patient.doctorName, false);
    this.isPatientDiseasesValid = this.validateField(patient.patientDiseases);
    this.isInfectionDateValid =
      this.validateField(patient.infectionDate) ||
      patient.incidentDepartmentId != 1;
    this.isHospitalEntryDateValid =
      this.validateField(patient.hospitalEntryDate) ||
      patient.incidentDepartmentId != 1;

    var validationResults = [
      this.isPatientHospitalNoValid,
      this.isDoctorNameValid,
      this.isPatientDiseasesValid,
      this.isInfectionDateValid,
      this.isHospitalEntryDateValid,
    ];
    return validationResults.findIndex((result) => result == false);
    // return validationResults.every(result => result);
  }

  validatePatientHospitalNo(patientNumber: string): boolean {
    if (this.validateEmptyField(patientNumber)) {
      let pattern = /^[1-9]\d*$/;
      return pattern.test(patientNumber);
    }
    return true;
  }

  validateDoctorName(name: string, isRequired: boolean): boolean {
    this.doctorNameValidationMessage = this.validateNameForDoctor(name, isRequired);
    return this.doctorNameValidationMessage === '';
  }
  //#endregion "Diagnostic Info"

  //#region "Common Validations"
  validateField(field) {
    return (
      field !== 'null' && field !== null && field !== -1 && field !== undefined && field !== ''
    );
  }

  validateArr(field) {
    return field?.length;
  }

  validateEmptyField(field) {
    return this.validateField(field) && field.toString().trim() !== '';
  }

  validateNationalID(nationalId, isRequired = true) {
    if (isRequired && !this.validateEmptyField(nationalId)) {
      this.cardIdValidationMessage = 'NEDSS.COMMON.FILEDREQUIRED';
      return false;
    } else if (
      nationalId?.toString().length > 0 &&
      nationalId?.toString().length < 14
    ) {
      this.cardIdValidationMessage =
        'NEDSS.LAB_VIEW.ADD_PATIENT.NATIONAL_ID_NOT_14';
      return false;
    } else if (
      nationalId?.toString().length > 0 &&
      !this.validateEgyptNational(nationalId?.toString())
    ) {
      this.cardIdValidationMessage =
        'NEDSS.LAB_VIEW.ADD_PATIENT.Invalid_NATIONAL';
      return false;
    }
    return true;
  }

  validateEgyptNational(value) {
    if (value != undefined) {
      let national = value.toString();

      // national id
      let yearAll = 19;
      if (national.slice(0, 1) == '3') yearAll = 20;
      let dateStr =
        yearAll +
        national.slice(1, 3) +
        '-' +
        national.slice(3, 5) +
        '-' +
        national.slice(5, 7);
      var validDate = new Date(dateStr);
      return validDate.toString() != 'Invalid Date' && validDate <= new Date();
    }
    return true;
  }

  pad(num, size) {
    let s = num + '';

    while (s.length < size) s = '0' + s;
    return s;
  }

  getGender(value: any): number {
    let bational = value.toString();
    let number = bational.slice(-2, -1);
    var genderId = null;
    //  gender
    if (number % 2 == 0) genderId = 2;
    else genderId = 1;
    // national id
    return genderId;
  }

  getBirthDate(value: any) {
    let bational = value.toString();
    let number = bational.slice(-2, -1);
    // national id
    var birthDate: string = '';
    let yearAll = 19;
    if (bational.slice(0, 1) == '3') yearAll = 20;
    let dateStr =
      yearAll +
      bational.slice(1, 3) +
      '-' +
      bational.slice(3, 5) +
      '-' +
      this.pad(Number(bational.slice(5, 7)), 2);
    birthDate = dateStr;

    return birthDate;
  }

  getAge(value: any): number {
    let bational = value.toString();

    var age = null;
    var birthDate: string = '';
    let yearAll = 19;
    if (bational.slice(0, 1) == '3') yearAll = 20;
    let dateStr =
      yearAll +
      bational.slice(1, 3) +
      '-' +
      bational.slice(3, 5) +
      '-' +
      this.pad(Number(bational.slice(5, 7)), 2);
    birthDate = dateStr;
    let timeDiff = Math.abs(Date.now() - new Date(dateStr).getTime());
    var days = timeDiff / (1000 * 3600 * 24);
    var monthes = timeDiff / (1000 * 3600 * 24) / 30;
    var years = timeDiff / (1000 * 3600 * 24) / 365.25;
    if (years >= 1) {
      age = Math.floor(years);
    } else if (monthes >= 1) {
      age = Math.floor(monthes);
    } else {
      age = Math.floor(days);
    }
    return age;
  }

  getAgeTypeId(value: any): number {
    let bational = value.toString();

    var ageTypeId = null;
    var birthDate: string = '';
    let yearAll = 19;
    if (bational.slice(0, 1) == '3') yearAll = 20;
    let dateStr =
      yearAll +
      bational.slice(1, 3) +
      '-' +
      bational.slice(3, 5) +
      '-' +
      this.pad(Number(bational.slice(5, 7)), 2);
    birthDate = dateStr;
    let timeDiff = Math.abs(Date.now() - new Date(dateStr).getTime());
    var days = timeDiff / (1000 * 3600 * 24);
    var monthes = timeDiff / (1000 * 3600 * 24) / 30;
    var years = timeDiff / (1000 * 3600 * 24) / 365.25;
    if (years >= 1) {
      ageTypeId = 3;
    } else if (monthes >= 1) {
      ageTypeId = 2;
    } else {
      ageTypeId = 1;
    }
    return ageTypeId;
  }
  onIdentityCardKeyPress(event: KeyboardEvent): void {
    let inputKey = event.key;
    if (
      (inputKey !== 'Backspace' && isNaN(Number(inputKey))) ||
      (event.target as HTMLInputElement).value.length >= 14
    ) {
      event.preventDefault();
    }
  }

  validatePhoneNumber1(phoneNo, isRequired) {
    this.phoneNo1ValidationMessage = this.validatePhoneNumber(
      phoneNo,
      isRequired
    );
    return this.phoneNo1ValidationMessage === '';
  }

  validatePhoneNumber2(phoneNo, isRequired) {
    this.phoneNo2ValidationMessage = this.validatePhoneNumber(
      phoneNo,
      isRequired
    );
    return this.phoneNo2ValidationMessage === '';
  }

  validatePhoneNumber(phoneNo: string, isRequired: boolean): string {
    if (!this.validateEmptyField(phoneNo)) {
      if (isRequired) {
        return 'NEDSS.COMMON.FILEDREQUIRED';
      }
      return '';
    }

    let phonePattern = /^(\+201|01|00201)[0-2,5]{1}[0-9]{8}/;
    if (!phonePattern.test(phoneNo)) {
      if (phoneNo.trim().replace(/^(\+2|002)/, '').length < 11) {
        return 'NEDSS.LAB_VIEW.ADD_PATIENT.PHONE_NO_NOT_11';
      }

      return 'NEDSS.COMMON.INVALID_PHONE_FORMAT';
    }

    return '';
  }

  onPhoneNumberKeyPress(event: KeyboardEvent): void {
    let inputKey = event.key;
    if (
      inputKey !== '+' &&
      inputKey !== 'Backspace' &&
      isNaN(Number(inputKey))
    ) {
      event.preventDefault();
    }

    let trimmedPhoneNumber = (event.target as HTMLInputElement).value
      .trim()
      .replace(/^(\+2|002)/, '');
    if (trimmedPhoneNumber.length >= 11) {
      event.preventDefault();
    }
  }

  validateFirstName(name: string, isRequired: boolean): boolean {
    this.firstNameValidationMessage = this.validateFirstNamePattern(name, isRequired);
    return this.firstNameValidationMessage === '';
  }
  validateBirthDate(birthDate: string, isRequired: boolean): boolean {
    this.birthDateValidationMessage = this.validBirthDate(
      birthDate,
      isRequired
    );
    return this.birthDateValidationMessage === '';
  }

  validateSecondName(name: string, isRequired: boolean): boolean {
    this.secondNameValidationMessage = this.validateFirstNamePattern(name, isRequired);
    return this.secondNameValidationMessage === '';
  }

  validateThirdName(name: string, isRequired: boolean): boolean {
    this.thirdNameValidationMessage = this.validateFirstNamePattern(name, isRequired);
    return this.thirdNameValidationMessage === '';
  }

  validateFamilyName(name: string, isRequired: boolean): boolean {
    this.familyNameValidationMessage = this.validateTwoCharsPattern(name);
    return this.familyNameValidationMessage === '';
  }

  validateNameForDoctor(name: string, isRequired: boolean): string {
    if (!this.validateEmptyField(name)) {
      if (isRequired) {
        return 'NEDSS.COMMON.FILEDREQUIRED';
      }
      return '';
    }

    let namePattern = /^[A-Za-z\u0600-\u06FF ]{3,30}$/;
    if (!namePattern.test(name)) {
      return this.translate.instant('NEDSS.COMMON.INVALID_NAME_CHARACTERS', {
        maxLength: 30,
      });
    }

    return '';
  }

  validateName(name: string, isRequired: boolean): string {
    if (!this.validateEmptyField(name)) {
      if (isRequired) {
        return 'NEDSS.COMMON.FILEDREQUIRED';
      }
      return '';
    }

    let namePattern = /^[A-Za-z\u0600-\u06FF ]{3,15}$/;
    if (!namePattern.test(name)) {
      return this.translate.instant('NEDSS.COMMON.INVALID_NAME_CHARACTERS', {
        maxLength: 15,
      });
    }

    return '';
  }

  validateFirstNamePattern(name: string, isRequired: boolean): string {
    if (!this.validateEmptyField(name)) {
      if (isRequired) {
        return 'NEDSS.COMMON.FILEDREQUIRED';
      }
      return '';
    }


    return this.validateTwoCharsPattern(name);

  }
  validateTwoCharsPattern(name: string) {
    let namePattern = /^[A-Za-z\u0600-\u06FF ]{2,15}$/;
    if (name) {
      if (!namePattern.test(name) || name.split('')?.filter(x => x != ' ')?.length < 2) {
        return this.translate.instant('NEDSS.COMMON.INVALID_NAME_CHARACTERS_TWO', {
          maxLength: 15,
        });
      }
    }
    return '';
  }

  validBirthDate(birthDate: string, isRequired: boolean): string {
    if (!this.validateEmptyField(birthDate)) {
      if (isRequired) {
        return 'NEDSS.COMMON.FILEDREQUIRED';
      }
      if (birthDate != null) {
        var validDate = new Date(birthDate);
        if (validDate.toString() != 'Invalid Date' && validDate <= new Date()) {
          return 'NEDSS.COMMON.DateNotValid';
        }
      }
      return '';
    }
    return '';
  }

  onNameKeyPress(event: KeyboardEvent): void {
    let inputKey = event.key;
    let namePattern = /^[A-Za-z\u0600-\u06FF ]$/;
    if (!namePattern.test(inputKey)) {
      event.preventDefault();
      return;
    }
    const input = event.target as HTMLInputElement;
    if (inputKey === ' ' && (input.selectionStart === 0 || !input.value)) {
      event.preventDefault();
    }
  }

  normalizeNameInput(event: Event): void {
    const input = event.target as HTMLInputElement;
    let value = input.value;
    value = value.replace(/[\u0623\u0625]/g, '\u0627');
    value = value.replace(/\u0649/g, '\u064A');
    value = value.replace(/^\s+/, '');
    if (value !== input.value) {
      input.value = value;
      input.dispatchEvent(new Event('input'));
    }
  }
  //#endregion "Common Validations"

  getIncidentInfoInvalidFieldLabel(patient: any): string | null {
    const items: Array<[boolean, string]> = [
      [this.isIncidentGovernmentValid, 'NEDSS.HOME.GENERAL_DATA_COMPLETION.GOVERBMENT'],
      [this.isIncidentHealthAdministrationValid, 'NEDSS.HOME.GENERAL_DATA_COMPLETION.HEALTHADMIN'],
      [this.isUniversityValid, 'NEDSS.HOME.CONTROL_PANEL.CODES.LOOKUP_THE_UNIVERSITY'],
      [this.isBranchValid, 'NEDSS.HOME.CONTROL_PANEL.CODES.LOOKUP_THE_BRANCH'],
      [this.isAreaValid, 'NEDSS.HOME.CONTROL_PANEL.CODES.LOOKUP_THE_AREA'],
      [this.isIncidentSourceValid, 'NEDSS.HOME.GENERAL_DATA_COMPLETION.INCIDENT_SOURCE'],
      [this.isIncidentDepartmentValid, 'NEDSS.HOME.GENERAL_DATA_COMPLETION.DEPARTMENT'],
      [this.isCaseDiscoveryDateValid, 'NEDSS.HOME.GENERAL_DATA_COMPLETION.DATE_DISCOVER_STATUS'],
      [this.isNationalityValid, 'NEDSS.HOME.GENERAL_DATA_COMPLETION.NATIONATILY'],
      [this.isCardIdValid, 'NEDSS.HOME.GENERAL_DATA_COMPLETION.NATIONAL_ID'],
      [this.isPassportIdValid, 'NEDSS.HOME.GENERAL_DATA_COMPLETION.PASSPOR_NO'],
    ];
    const failed = items.find(([valid]) => !valid);
    return failed ? failed[1] : null;
  }

  getDemographicInfoInvalidFieldLabel(patient: any): string | null {
    const items: Array<[boolean, string]> = [
      [this.isFirstNameValid, 'NEDSS.HOME.GENERAL_DATA_DEMOGRAPHICINFO.FIRST_NAME'],
      [this.isSecondNameValid, 'NEDSS.HOME.GENERAL_DATA_DEMOGRAPHICINFO.SECOND_NAME'],
      [this.isThirdNameValid, 'NEDSS.HOME.GENERAL_DATA_DEMOGRAPHICINFO.THIRD_NAME'],
      [this.isFamilyNameValid, 'NEDSS.HOME.GENERAL_DATA_DEMOGRAPHICINFO.FAMILY_NAME'],
      [this.isPhoneNumber1Valid, 'NEDSS.HOME.GENERAL_DATA_DEMOGRAPHICINFO.PHONENO1'],
      [this.isGenderValid, 'NEDSS.HOME.GENERAL_DATA_DEMOGRAPHICINFO.GENDER'],
      [this.isAgeValid, 'NEDSS.HOME.GENERAL_DATA_DEMOGRAPHICINFO.AGE'],
      [this.isAgeTypeValid, 'NEDSS.HOME.GENERAL_DATA_DEMOGRAPHICINFO.AGETYPE'],
    ];
    const failed = items.find(([valid]) => !valid);
    if (failed) return failed[1];

    // National ID / Passport requirement is OR-coupled when department is Internal.
    const idsOk =
      this.isPassportValid ||
      this.isNationalValid ||
      patient?.incidentDepartmentId != 1;
    if (!idsOk) {
      return patient?.nationalityId == NationalityEnum.Egyptian
        ? 'NEDSS.HOME.GENERAL_DATA_COMPLETION.NATIONAL_ID'
        : 'NEDSS.HOME.GENERAL_DATA_COMPLETION.PASSPOR_NO';
    }
    return null;
  }

  getResidenceInfoInvalidFieldLabel(patient: any): string | null {
    const items: Array<[boolean, string]> = [
      [this.isHomeGovernmentValid, 'NEDSS.HOME.GENERAL_DATA_RESIDENCEINFO.GOVERNMENT'],
      [this.isHomeHealthAdministrationValid, 'NEDSS.HOME.GENERAL_DATA_RESIDENCEINFO.ADMINISTRATION'],
      [this.isHomeCityValid, 'NEDSS.HOME.GENERAL_DATA_RESIDENCEINFO.STATEANDCITY'],
      [this.isHomeHealthOfficeIdValid, 'NEDSS.HOME.GENERAL_DATA_RESIDENCEINFO.HEALTHOFFICE'],
      [this.isAdressValid, 'NEDSS.HOME.GENERAL_DATA_RESIDENCEINFO.DETAILADDRESS'],
    ];
    const failed = items.find(([valid]) => !valid);
    return failed ? failed[1] : null;
  }

  getClinicalSymptomsInvalidFieldLabel(patient: any): string | null {
    const items: Array<[boolean, string]> = [
      [this.isFeverMaxTemperatureValid, 'NEDSS.HOME.GENERAL_DATA_CLINICAL_SYMPTOMS.FEVER_MAX_TEMP'],
    ];
    const failed = items.find(([valid]) => !valid);
    return failed ? failed[1] : null;
  }

  getDiagnosticsInvalidFieldLabel(patient: any): string | null {
    const items: Array<[boolean, string]> = [
      [this.isPatientDiseasesValid, 'NEDSS.HOME.GENERAL_DATA_DIAGONOSISTIC_INFO.START_DISEASES'],
      [this.isInfectionDateValid, 'NEDSS.HOME.GENERAL_DATA_DIAGONOSISTIC_INFO.INFECTIONDATE'],
      [this.isHospitalEntryDateValid, 'NEDSS.HOME.GENERAL_DATA_DIAGONOSISTIC_INFO.HOSPITALENTRYDATE'],
      [this.isPatientHospitalNoValid, 'NEDSS.HOME.GENERAL_DATA_DIAGONOSISTIC_INFO.PATIENT_HOSPITAL_NO'],
      [this.isDoctorNameValid, 'NEDSS.HOME.GENERAL_DATA_DIAGONOSISTIC_INFO.DOCTOR_NAME'],
    ];
    const failed = items.find(([valid]) => !valid);
    return failed ? failed[1] : null;
  }

  getFirstInvalidFieldLabel(patient: any): string | null {
    this.validateIncidentInfo(patient);
    const incident = this.getIncidentInfoInvalidFieldLabel(patient);
    if (incident) return incident;

    this.validateDemographicInfo(patient);
    const demographic = this.getDemographicInfoInvalidFieldLabel(patient);
    if (demographic) return demographic;

    this.validateResidenceInfo(patient);
    const residence = this.getResidenceInfoInvalidFieldLabel(patient);
    if (residence) return residence;

    this.validateClinicalSymptoms(patient);
    const clinical = this.getClinicalSymptomsInvalidFieldLabel(patient);
    if (clinical) return clinical;

    this.validateDiagnostics(patient);
    const diagnostics = this.getDiagnosticsInvalidFieldLabel(patient);
    if (diagnostics) return diagnostics;

    return null;
  }
}
