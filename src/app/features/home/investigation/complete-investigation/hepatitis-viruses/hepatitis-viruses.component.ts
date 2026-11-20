import { Component, OnInit } from '@angular/core';
import {
  AnswerOptions2,
  distanceWaterSourcesSewage,
  sewageSystem,
  typeChronicDiseases,
  typeEstablishment,
  typeHepatitis,
} from 'src/app/core/constants';
import {
  AnswerOptions,
  contactType,
  waterSource,
} from 'src/app/core/constants';
import { UserMessageService } from 'src/app/core/services/user.message.service';
import { InvestigationService } from '../../services/investigation.service';
import { TranslateService } from '@ngx-translate/core';
import { DatePipe } from '@angular/common';
import {
  HepatitisContactFollowUp,
  HepatitisFollowUpVisit,
  clearHepatitisSymptomsIfNone,
  hasAnyHepatitisSymptom,
  newHepatitisContactFollowUp,
  parseHepatitisContactFollowUps,
  serializeHepatitisContactFollowUps,
} from './hepatitis-contact-follow-up';
@Component({
  selector: 'app-hepatitis-viruses',
  host: { class: 'investigation-form' },
  templateUrl: './hepatitis-viruses.component.html',
  styleUrls: ['./hepatitis-viruses.component.css'],
})
export class HepatitisVirusesComponent implements OnInit {
  private readonly dateFormat = 'yyyy-MM-dd';
  readonly yesNoUnknownOptions = [
    { id: null, arabicName: '--', englishName: '--' },
    { id: 0, arabicName: 'نعم', englishName: 'Yes' },
    { id: 1, arabicName: 'لا', englishName: 'No' },
    { id: 2, arabicName: 'غير معروف', englishName: 'Unknown' },
  ];
  readonly hepatitisTypeOptions = [
    { id: 1, arabicName: 'الإلتهاب الكبدى A او E' },
    { id: 2, arabicName: 'الإلتهاب الكبدى B او C او D' },
  ];
  hepatitisTypeTouched = false;

  currentLang =
    localStorage.getItem('ls.currentLang') !== undefined &&
    localStorage.getItem('ls.currentLang') !== 'undefined'
      ? localStorage.getItem('ls.currentLang')
      : 'ar';

  allFilledControlsCount: number = 0;
  allControllesCount: number = 0;
  patientName: string;
  constructor(
    private investigationService: InvestigationService,
    private translateService: TranslateService,
    private userMsg: UserMessageService,
    private datePipe: DatePipe
  ) {
    if (
      this.investigationService.patient.firstName != null &&
      this.investigationService.patient.firstName != undefined
    ) {
      this.patientName =
        this.investigationService.patient.firstName +
        ' ' +
        this.investigationService.patient.secondName +
        ' ' +
        this.investigationService.patient.thirdName;
    }
  }

  hepatitisVirusesData = {
    id: null,
    patientID: null,
    hepatitisTypes: [] as number[],
    patientHospitalized: null,
    bookedIntensiveCare: null,
    dateAdmissionHospital: null,

    contactSuspectedCase: null,
    contactConfirmedCase: null,
    epidemicOutbreak: null,
    contactDeceasedPersonRespiratory: null,
    numberDirectContacts: null,
    numberNonDirectContacts: null,
    contactFollowUpsJson: null as string | null,

    childOrEmployee: null,
    stateNameAddress: null,
    foodProvider: null,
    similarCasessimilarPlaces: null,
    mealsOutside: null,
    typeFood: null,
    exposedToAnimals: null,
    typeOfAnimal: null,
    dealDirectlySewageWaste: null,

    waterSourceHouse: null,
    anotherCase: null,
    waterStored: null,
    tankType: null,
    sewageSystem: null,
    distanceWaterSourcesSewage: null,
    maintenanceSewerSystem: null,
    breakPipesDrinkingWater: null,
    overflowSewerSystem: null,
    changeTasteColorSmellwater: null,
    reportsContaminationWater: null,
    samplesAnalysisPatienhome: null,

    entamoebaHistolytica: null,
    shigellaSpecies: null,
    campylobacter: null,
    salmonellaSpecies: null,
    pathogenicColi: null,
    salmonellaTyphi: null,
    vibrioCholera: null,
    otherSamplesAnalysisPatienhome: null,

    filteredWater: null,
    wells: null,
    ethiopianPump: null,
    canal: null,
    storedWater: null,
    sampledSewerSystemTaken: null,
    sampleResult: null,

    enteringHospital: null,
    typeEstablishmentH: null,
    facilityNameH: null,
    visitClinic: null,
    typeEstablishmentC: null,
    facilityNameC: null,
    bloodTransfusion: null,
    typeEstablishmentB: null,
    facilityNameB: null,
    surgerySutures: null,
    typeEstablishmentS: null,
    facilityNameS: null,
    binoculars: null,
    typeEstablishmentBin: null,
    facilityNameBin: null,
    urinaryCatheterization: null,
    typeEstablishmentU: null,
    facilityNameU: null,
    ivDrip: null,
    typeEstablishmentIv: null,
    facilityNameIv: null,
    dialysis: null,
    typeEstablishmentD: null,
    facilityNameD: null,
    dentalProcedures: null,
    typeEstablishmentDen: null,
    facilityNameDen: null,

    chineseNeedles: null,
    purity: null,
    tattoo: null,
    cupping: null,
    earPiercing: null,
    visitBeautyShop: null,
    shareToothbrush: null,
    shareSharpTools: null,
    contactHepatitis: null,
    typeHepatitis: null,
    exposedBloodOutside: null,
    inMilitaryService: null,

    pregnancy: null,
    experiencedChildbirth: null,
    typeFacility: null,
    facilityNameW: null,
    inPrison: null,
    injectDrugs: null,
    sharedSameSyringe: null,
    chronicDiseases: null,
    typeChronicDiseases: null,
    anotherCaseChronicDiseases: null,

    infectionHcv: null,
    treatmentTaken: null,
    consecutiveDoses: null,
    investigationDate: null,
    healthObserverName: null,
    surveillanceOfficerName: null,
    administrationDirectorName: null,
    investigationCompletePercentage:null,
    diseaseGroupId: this.investigationService.diseaseGroupID,
  };

  contactSuspectedCases = AnswerOptions;
  contactConfirmedCases = AnswerOptions;
  epidemicOutbreaks = AnswerOptions;
  contactDeceasedPersonRespiratorys = AnswerOptions;

  childOrEmployees = AnswerOptions;
  foodProviders = AnswerOptions;
  similarCasessimilarPlacess = AnswerOptions;
  mealsOutsides = AnswerOptions;
  exposedToAnimalss = AnswerOptions;
  dealDirectlySewageWastes = AnswerOptions;

  waterSourceHouses = waterSource;
  waterStoreds = AnswerOptions2;

  sewageSystems = sewageSystem;
  distanceWaterSourcesSewages = distanceWaterSourcesSewage;
  maintenanceSewerSystems = AnswerOptions;
  breakPipesDrinkingWaters = AnswerOptions;
  overflowSewerSystems = AnswerOptions;
  changeTasteColorSmellwaters = AnswerOptions;
  reportsContaminationWaters = AnswerOptions;
  samplesAnalysisPatienhomes = AnswerOptions;

  enteringHospitals = AnswerOptions;
  typeEstablishmentHs = typeEstablishment;
  visitClinics = AnswerOptions;
  typeEstablishmentCs = typeEstablishment;
  bloodTransfusions = AnswerOptions;
  typeEstablishmentBs = typeEstablishment;
  surgerySuturess = AnswerOptions;
  typeEstablishmentSs = typeEstablishment;
  binocularss = AnswerOptions;
  typeEstablishmentBins = typeEstablishment;
  urinaryCatheterizations = AnswerOptions;
  typeEstablishmentUs = typeEstablishment;
  ivDrips = AnswerOptions;
  typeEstablishmentIvs = typeEstablishment;
  dialysiss = AnswerOptions;
  typeEstablishmentDs = typeEstablishment;
  dentalProceduress = AnswerOptions;
  typeEstablishmentDens = typeEstablishment;

  ChineseNeedless = AnswerOptions;
  puritys = AnswerOptions;
  tattoos = AnswerOptions;
  cuppings = AnswerOptions;
  earPiercings = AnswerOptions;
  visitBeautyShops = AnswerOptions;
  shareToothbrushs = AnswerOptions;
  shareSharpToolss = AnswerOptions;
  contactHepatitiss = AnswerOptions;
  typeHepatitiss = typeHepatitis;
  exposedBloodOutsides = AnswerOptions;
  inMilitaryServices = AnswerOptions;
  pregnancys = AnswerOptions;
  experiencedChildbirths = AnswerOptions;
  typeFacilitys = typeEstablishment;
  inPrisons = AnswerOptions;
  injectDrugss = AnswerOptions;
  sharedSameSyringes = AnswerOptions;
  chronicDiseasess = AnswerOptions;
  typeChronicDiseasess = typeChronicDiseases;
  infectionHcvs = AnswerOptions;
  treatmentTakens = AnswerOptions;
  consecutiveDosess = AnswerOptions;
  patientHospitalizeds = AnswerOptions;
  bookedIntensiveCares = AnswerOptions;
  currentId: any;
  contactTypes = contactType;
  contactFollowUps: HepatitisContactFollowUp[] = [];

  ngOnInit() {
    // this.currentId=this.investigationService.currentid
    // this.meningealForm.controls['patientID'].setValue(this.currentId)
    //    this.investigationService.getByIdMeningeal(this.currentId).subscribe(
    //  res =>{console.log(res);
    //    var v=res.data;
    this.currentId = this.investigationService.currentid;
    this.hepatitisVirusesData.patientID = this.currentId;
    this.GetById();
  }
  GetById() {
    this.investigationService.getByIdhepatitis(this.currentId).subscribe(
      (res) => {
        console.log("result");
        console.log(res);
        var v = res.data;
        if (v != null) {

          this.hepatitisVirusesData = v;
          this.hepatitisVirusesData.hepatitisTypes = this.parseHepatitisTypes(v.hepatitisTypes);
          this.contactFollowUps = parseHepatitisContactFollowUps(v.contactFollowUpsJson);

          console.log("hepatitisVirusesData", this.hepatitisVirusesData )
          this.hepatitisVirusesData.dateAdmissionHospital =
            this.datePipe.transform(
              this.hepatitisVirusesData.dateAdmissionHospital,
              this.dateFormat
            );

        }
      },
      (error) => {
        this.translateService
          .get('NEDSS.COMMON.SENT_FAILD')
          .subscribe((res: string) => {
            this.userMsg.error(res);
          });
      }, () => {
        this.calculateCompletionPercentage();
      }
    );
  }

  hasHepatitisType(id: number): boolean {
    return (this.hepatitisVirusesData.hepatitisTypes || []).includes(id);
  }

  private parseHepatitisTypes(value: any): number[] {
    if (value === null || value === undefined || value === '') {
      return [];
    }
    return String(value).split(',').map((code) => Number(code.trim())).filter((code) => !Number.isNaN(code));
  }

  save() {
    this.hepatitisTypeTouched = true;
    if (!this.hepatitisVirusesData.hepatitisTypes?.length) {
      this.userMsg.error('يجب اختيار نوع الالتهاب الكبدى');
      return;
    }
    this.hepatitisVirusesData.contactFollowUpsJson = serializeHepatitisContactFollowUps(this.contactFollowUps);
    this.calculateCompletionPercentage();
    this.hepatitisVirusesData.investigationCompletePercentage = parseFloat(((this.allFilledControlsCount / this.allControllesCount) * 100).toFixed(2));
    this.hepatitisVirusesData.diseaseGroupId = this.investigationService.diseaseGroupID;
    if (
      this.hepatitisVirusesData != null &&
      this.hepatitisVirusesData.id != null
    ) {
      this.investigationService
        .updatehepatitis(this.buildSavePayload())
        .subscribe(
          (response: any) => {
            if (response) {
              this.translateService
                .get('NEDSS.COMMON.SENT_SUCESSFULLY')
                .subscribe((res: string) => {
                  this.userMsg.success(res);
                });
            }
          },
          (error) => {
          }
        );
    } else {
      this.investigationService
        .addInvestigationhepatitis(this.buildSavePayload())
        .subscribe(
          (response: any) => {
            if (response) {
              this.translateService
                .get('NEDSS.COMMON.SENT_SUCESSFULLY')
                .subscribe((res: string) => {
                  this.userMsg.success(res);
                });
            }
          },
          (error) => {
          }
        );
    }
  }

  private buildSavePayload(): any {
    return {
      ...this.hepatitisVirusesData,
      hepatitisTypes: [...this.hepatitisVirusesData.hepatitisTypes].sort().join(','),
    };
  }

  addContactFollowUp(): void {
    this.contactFollowUps.push(newHepatitisContactFollowUp());
    this.syncContactFollowUps();
  }

  removeContactFollowUp(index: number): void {
    this.contactFollowUps.splice(index, 1);
    this.syncContactFollowUps();
  }

  onHasSymptomsChanged(visit: HepatitisFollowUpVisit): void {
    clearHepatitisSymptomsIfNone(visit);
    this.syncContactFollowUps();
  }

  hasAnySymptom(visit: HepatitisFollowUpVisit): boolean {
    return hasAnyHepatitisSymptom(visit);
  }

  syncContactFollowUps(): void {
    this.hepatitisVirusesData.contactFollowUpsJson = serializeHepatitisContactFollowUps(this.contactFollowUps);
    this.calculateCompletionPercentage();
  }

  //BL
  calculateCompletionPercentage() {
    this.allFilledControlsCount = 0;
    const data = this.hepatitisVirusesData;
    
    // Exclude fields you don't want to count (like 'id')
    const excludedFields = ['id','patientID','investigationCompletePercentage' , 'diseaseGroupId' , 'createdDate'];
    const totalFields = Object.keys(data).filter(key => !excludedFields.includes(key)).length;
    
    this.allControllesCount = totalFields;

    Object.keys(data).forEach((key) => {
        if (!excludedFields.includes(key) && data[key] !== null && data[key] !== '' && !(Array.isArray(data[key]) && !data[key].length)) {
            this.allFilledControlsCount++;
        }
    });
  }

}
