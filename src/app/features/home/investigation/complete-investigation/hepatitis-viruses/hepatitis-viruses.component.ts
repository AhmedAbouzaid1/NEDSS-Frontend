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
  Gender,
  contactType,
  waterSource,
} from 'src/app/core/constants';
import { UserMessageService } from 'src/app/core/services/user.message.service';
import { InvestigationService } from '../../services/investigation.service';
import { TranslateService } from '@ngx-translate/core';
import { DatePipe } from '@angular/common';
@Component({
  selector: 'app-hepatitis-viruses',
  templateUrl: './hepatitis-viruses.component.html',
  styleUrls: ['./hepatitis-viruses.component.css'],
})
export class HepatitisVirusesComponent implements OnInit {
  private readonly dateFormat = 'yyyy-MM-dd';

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
    patientHospitalized: null,
    bookedIntensiveCare: null,
    dateAdmissionHospital: null,

    contactSuspectedCase: null,
    contactConfirmedCase: null,
    epidemicOutbreak: null,
    contactDeceasedPersonRespiratory: null,
    numberDirectContacts: null,
    numberNonDirectContacts: null,

    nameDay1: null,
    ageDay1: null,
    telephoneDay1: null,
    genderDay1: null,
    dateOnsetSymptomsDay1: null,
    contactTypeDay1: null,
    relationshipPatientDay1: null,
    feverDay1: null,
    dryCoughDay1: null,
    coughingWithSpittingDay1: null,
    soreThroatDay1: null,
    breathingDifficultyDay1: null,
    jointPainDay1: null,
    vomitDay1: null,
    diarrheaDay1: null,
    otherDay1: null,
    otherSymptomsDay1: null,
    isSampleTakenDay1: null,
    dateSampleTakenDay1: null,
    sampleResultDay1: null,

    nameDay2: null,
    ageDay2: null,
    telephoneDay2: null,
    genderDay2: null,
    contactTypeDay2: null,
    relationshipPatientDay2: null,
    dateOnsetSymptomsDay2: null,
    feverDay2: null,
    dryCoughDay2: null,
    coughingWithSpittingDay2: null,
    soreThroatDay2: null,
    breathingDifficultyDay2: null,
    jointPainDay2: null,
    vomitDay2: null,
    diarrheaDay2: null,
    otherDay2: null,
    otherSymptomsDay2: null,
    isSampleTakenDay2: null,
    dateSampleTakenDay2: null,
    sampleResultDay2: null,

    nameDay7: null,
    ageDay7: null,
    telephoneDay7: null,
    genderDay7: null,
    contactTypeDay7: null,
    relationshipPatientDay7: null,
    dateOnsetSymptomsDay7: null,
    feverDay7: null,
    dryCoughDay7: null,
    coughingWithSpittingDay7: null,
    soreThroatDay7: null,
    breathingDifficultyDay7: null,
    jointPainDay7: null,
    vomitDay7: null,
    diarrheaDay7: null,
    otherDay7: null,
    otherSymptomsDay7: null,
    isSampleTakenDay7: null,
    dateSampleTakenDay7: null,
    sampleResultDay7: null,

    nameDay14: null,
    ageDay14: null,
    telephoneDay14: null,
    genderDay14: null,
    contactTypeDay14: null,
    relationshipPatientDay14: null,
    dateOnsetSymptomsDay14: null,
    feverDay14: null,
    dryCoughDay14: null,
    coughingWithSpittingDay14: null,
    soreThroatDay14: null,
    breathingDifficultyDay14: null,
    jointPainDay14: null,
    vomitDay14: null,
    diarrheaDay14: null,
    otherDay14: null,
    otherSymptomsDay14: null,
    isSampleTakenDay14: null,
    dateSampleTakenDay14: null,
    sampleResultDay14: null,

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

  dateOnsetSymptomsDay1s = AnswerOptions;
  contactSuspectedCases = AnswerOptions;
  contactConfirmedCases = AnswerOptions;
  epidemicOutbreaks = AnswerOptions;
  contactDeceasedPersonRespiratorys = AnswerOptions;

  genderDay1s = Gender;
  contactTypeDay1s = contactType;
  feverDay1s = AnswerOptions;
  dryCoughDay1s = AnswerOptions;
  coughingWithSpittingDay1s = AnswerOptions;
  soreThroatDay1s = AnswerOptions;
  breathingDifficultyDay1s = AnswerOptions;
  jointPainDay1s = AnswerOptions;
  vomitDay1s = AnswerOptions;
  diarrheaDay1s = AnswerOptions;
  otherDay1s = AnswerOptions;

  genderDay2s = Gender;
  contactTypeDay2s = contactType;
  feverDay2s = AnswerOptions;
  dryCoughDay2s = AnswerOptions;
  coughingWithSpittingDay2s = AnswerOptions;
  soreThroatDay2s = AnswerOptions;
  breathingDifficultyDay2s = AnswerOptions;
  jointPainDay2s = AnswerOptions;
  vomitDay2s = AnswerOptions;
  diarrheaDay2s = AnswerOptions;
  otherDay2s = AnswerOptions;

  genderDay7s = Gender;
  contactTypeDay7s = contactType;
  feverDay7s = AnswerOptions;
  dryCoughDay7s = AnswerOptions;
  coughingWithSpittingDay7s = AnswerOptions;
  soreThroatDay7s = AnswerOptions;
  breathingDifficultyDay7s = AnswerOptions;
  jointPainDay7s = AnswerOptions;
  vomitDay7s = AnswerOptions;
  diarrheaDay7s = AnswerOptions;
  otherDay7s = AnswerOptions;

  genderDay14s = Gender;
  contactTypeDay14s = contactType;
  feverDay14s = AnswerOptions;
  dryCoughDay14s = AnswerOptions;
  coughingWithSpittingDay14s = AnswerOptions;
  soreThroatDay14s = AnswerOptions;
  breathingDifficultyDay14s = AnswerOptions;
  jointPainDay14s = AnswerOptions;
  vomitDay14s = AnswerOptions;
  diarrheaDay14s = AnswerOptions;
  otherDay14s = AnswerOptions;

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

          console.log("hepatitisVirusesData", this.hepatitisVirusesData )
          this.hepatitisVirusesData.dateAdmissionHospital =
            this.datePipe.transform(
              this.hepatitisVirusesData.dateAdmissionHospital,
              this.dateFormat
            );
          this.hepatitisVirusesData.dateOnsetSymptomsDay1 =
            this.datePipe.transform(
              this.hepatitisVirusesData.dateOnsetSymptomsDay1,
              this.dateFormat
            );
          this.hepatitisVirusesData.dateSampleTakenDay1 =
            this.datePipe.transform(
              this.hepatitisVirusesData.dateSampleTakenDay1,
              this.dateFormat
            );
          this.hepatitisVirusesData.dateOnsetSymptomsDay2 =
            this.datePipe.transform(
              this.hepatitisVirusesData.dateOnsetSymptomsDay2,
              this.dateFormat
            );
          this.hepatitisVirusesData.dateSampleTakenDay2 =
            this.datePipe.transform(
              this.hepatitisVirusesData.dateSampleTakenDay2,
              this.dateFormat
            );
          this.hepatitisVirusesData.dateOnsetSymptomsDay7 =
            this.datePipe.transform(
              this.hepatitisVirusesData.dateOnsetSymptomsDay7,
              this.dateFormat
            );

          this.hepatitisVirusesData.dateSampleTakenDay7 =
            this.datePipe.transform(
              this.hepatitisVirusesData.dateSampleTakenDay7,
              this.dateFormat
            );
          this.hepatitisVirusesData.dateOnsetSymptomsDay14 =
            this.datePipe.transform(
              this.hepatitisVirusesData.dateOnsetSymptomsDay14,
              this.dateFormat
            );
          this.hepatitisVirusesData.dateSampleTakenDay14 =
            this.datePipe.transform(
              this.hepatitisVirusesData.dateSampleTakenDay14,
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

  save() {
    this.calculateCompletionPercentage();
    this.hepatitisVirusesData.investigationCompletePercentage = parseFloat(((this.allFilledControlsCount / this.allControllesCount) * 100).toFixed(2));
    this.hepatitisVirusesData.diseaseGroupId = this.investigationService.diseaseGroupID;
    if (
      this.hepatitisVirusesData != null &&
      this.hepatitisVirusesData.id != null
    ) {
      this.investigationService
        .updatehepatitis(this.hepatitisVirusesData)
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
        .addInvestigationhepatitis(this.hepatitisVirusesData)
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

  //BL
  calculateCompletionPercentage() {
    this.allFilledControlsCount = 0;
    const data = this.hepatitisVirusesData;
    
    // Exclude fields you don't want to count (like 'id')
    const excludedFields = ['id','patientID','investigationCompletePercentage' , 'diseaseGroupId' , 'createdDate'];
    const totalFields = Object.keys(data).filter(key => !excludedFields.includes(key)).length;
    
    this.allControllesCount = totalFields;

    Object.keys(data).forEach((key) => {
        if (!excludedFields.includes(key) && data[key] !== null && data[key] !== '') {
            this.allFilledControlsCount++;
        }
    });
  }

}
