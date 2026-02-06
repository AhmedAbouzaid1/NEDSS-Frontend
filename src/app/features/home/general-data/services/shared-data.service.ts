import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs/internal/BehaviorSubject';
import { PatientModel, SentinelData } from '../models/patient-model';
import { LookupsGetterService } from './../../../../core/services/lookups-getter.service';
@Injectable({
  providedIn: 'root',
})
export class SharedDataService {
  constructor(private lookupsService: LookupsGetterService) { }
  ngOnInit() { }
  getDiseases() { }
  updateSentinelN(pd: any) {
    if (pd == undefined || pd.length == 0) return;
    alert('will get disease from the sahred service update fn');

    this.lookupsService.getAllDiseaseGroups().subscribe(
      (result: any) => {
        if (result != null && result != undefined) {
          this.diseases = result.data;
          if (pd.length > 0) {
            // alert("i got disease in my patient");
            pd.forEach((element) => {
              // alert("will filter " + element.diseaseId);

              if (
                this.diseases.filter(
                  (o) => o.diseaseId == element.id && o.isSentinel
                ).length > 0
              ) {
                // alert("will show sentinel");
                this.ShowSentinel = true;
              }
            });
          }

          // if (this.patient.patientDiseases !=null && this.patient.patientDiseases.length > 0) {
          //   this.selectedDiseases = this.diseases.filter(
          //     item => this.patient.patientDiseases.map(function(a) {return a.diseaseId;}).includes( item.id )
          //   )

          // }
        }
      },
      (error) => { }
    );
  }
  diseases!: any[];
  patientId: number;
  isEditMode: boolean;

  ShowSentinel = false;
  inSential = false;
  private sentinelData = new BehaviorSubject<SentinelData>({
    id: 0,
    patientName: '',
    patientID: 0,
    sariCaseDefinition: 0,
    patientMeetSARI: 0,
    patientMeetExtendedSARI: 0,
    pneumoniaCaseDefinition: 0,
    causesPneumonia: 0,
    doesCase: 0,
    wardAdmission: 0,
    vapOrHap: 0,
    otherPneumonia: '',
    patientReceiveInfluenzaAntiviral: 0,
    antibioticsTakenWithInLastWeek: 0,
    antibioticsIsTaken: 0,
    antibioticsName: '',
    dateFirstDose: null,
    dateLastDose: null,
    dateSpecimenCollection: null,
    dateSpecimenShipment: null,
    surveyDate: null,
  });
  private patientObject = new BehaviorSubject<PatientModel>({
    id: null,
    incidentGovernmentId: null,
    incidentHealthAdministrationId: null,
    incidentSourceId: null,
    incidentDepartmentId: null,
    nationalityId: null,
    patientJobCategoryId: null,
    patientJobId: null,
    homeGovernmentId: null,
    homeHealthAdministrationId: null,
    homeCityId: null,
    homeHealthOfficeId: null,
    homePrincipalityId: null,
    newHomeGovernment: null,
    newHomeHealthAdministration: null,
    newHomeCity: null,
    newHomeHealthOffice: null,
    newLivingAddress: null,
    finalResultId: null,
    transferGovernmentId: null,
    transferHealthAdministrationId: null,
    transferIncidentSourceId: null,
    labPlaceId: null,
    caseResultCategoryId: null,
    diseaseSeverityId: null,
    labPrimaryDiagonistics: null,
    caseDiscoveryDate: null,
    firstName: null,
    secondName: null,
    thirdName: null,
    familyName: null,
    nationalId: null,
    passportNo: null,
    phoneNo1: null,
    phoneNo2: null,
    newPhoneNo1: null,
    genderId: null,
    birthDate: null,
    age: null,
    ageTypeId: null,
    maritalStatusId: null,
    patientJobName: null,
    educationPhaseId: null,
    schoolCategoryId: null,
    workAddress: null,
    livingAddress: null,
    patientHospitalNo: null,
    doctorName: null,
    hospitalEntryDate: null,
    hospitalLeaveDate: null,
    infectionDate: null,
    incidentDate: null,
    insertedByLab: false,
    relationShipDegreeId: null,
    isHospitalLab: false,
    isCentralLabLab: false,
    isGovernmentLab: false,
    isRegionalLab: false,
    regionalLabId: null,
    isSpecialLabLab: false,
    specialLabSourceId: null,
    finalResult: null,
    caseResultCategory: null,
    caseDiscoveryTime: null,
    haveChronicDisease: null,
    anotherChronicDisease: null,
    chronicDiseasesIds: [],
    patientDiseases: [
      {
        id: null,
        diseaseGroupId: null,
        patientId: null,
        finalResult: null,
        caseResultCategory: null,
        isSentinel: null,
        router: null,
      },
    ],
    clinicalAsymptoms: {
      id: null,
      patientId: null,
      hasFever: '',
      feverDuration: 0,
      feverMaxTemp: 0,
      skinDisColoration: '',
      jerk: '',
      headache: '',
      overworkStress: '',
      nausea: '',
      vomit: '',
      diarrhea: '',
      materyDiarrhea: '',
      colic_Intestinal_Distress_Abdominal_Pain: '',
      mucusInStool: '',
      constipation: '',
      lossOfAppetite: '',
      jointPain: '',
      backPain: '',
      musclePain: '',
      encephalitis: '',
      difficultySwallowing: '',
      cramps: '',
      impairedMentalState: '',
      soreThroat: '',
      pneumonia: '',
      runnyNose: '',
      cough: '',
      shortnessOfBreath: '',
      dryCough: '',
      rapidBreathing: '',
      frequentCoughingSpells: '',
      coughByVomiting: '',
      chestPain: '',
      others: null,
    },
    fields: [],
    questionAnswers: [],
    hiddenInsideDepartment: null,
    answerQuuetionForm: {},

    finalDiagonisticsData: [
      {
        finalResult: null,
        caseResultCategory: null,
      },
    ],
  });

  getPatientObject() {
    this.inSential = false;
    return this.patientObject.asObservable();
  }

  setPatientObject(value: PatientModel) {
    this.patientObject.next(value);
  }

  getSentinelDataObject() {
    if (this.sentinelData != null || this.sentinelData != undefined) {
      this.inSential = true;
      return this.sentinelData.asObservable();
    } else {
      return new BehaviorSubject<SentinelData>({
        id: 0,
        patientName: '',
        patientID: 0,
        sariCaseDefinition: 0,
        patientMeetSARI: 0,
        patientMeetExtendedSARI: 0,
        pneumoniaCaseDefinition: 0,
        causesPneumonia: 0,
        doesCase: 0,
        wardAdmission: 0,
        vapOrHap: 0,
        otherPneumonia: '',
        patientReceiveInfluenzaAntiviral: 0,
        antibioticsTakenWithInLastWeek: 0,
        antibioticsIsTaken: 0,
        antibioticsName: '',
        dateFirstDose: new Date(),
        dateLastDose: new Date(),
        dateSpecimenCollection: new Date(),
        dateSpecimenShipment: new Date(),
        surveyDate: new Date(),
        nameHealthMonitor: 0,
        monitoringOfficer: 0,
        managerDirector: 0,
      }).asObservable();
    }
  }

  setSentinelDataObject(value: SentinelData) {
    this.sentinelData.next(value);
    console.log(this.sentinelData);
  }
}
