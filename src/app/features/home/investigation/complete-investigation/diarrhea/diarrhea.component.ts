import { Component, OnInit } from '@angular/core';
import {
  AnswerOptions,
  Gender,
  contactType,
  distanceWaterSourcesSewage,
} from 'src/app/core/constants';
import { UserMessageService } from 'src/app/core/services/user.message.service';
import { InvestigationService } from '../../services/investigation.service';
import { TranslateService } from '@ngx-translate/core';
import { DatePipe } from '@angular/common';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-diarrhea',
  templateUrl: './diarrhea.component.html',
  styleUrls: ['./diarrhea.component.css'],
})
export class DiarrheaComponent implements OnInit {
  private readonly summaryExcludedFields = [
    'id',
    'patientID',
    'investigationCompletePercentage',
    'diseaseGroupId',
    'createdDate',
  ];
  private readonly dateFields = [
    'dateOnsetSymptomsDay1',
    'dateSampleTakenDay1',
    'dateOnsetSymptomsDay2',
    'dateSampleTakenDay2',
    'dateOnsetSymptomsDay7',
    'dateSampleTakenDay7',
    'dateOnsetSymptomsDay14',
    'dateSampleTakenDay14',
    'dateHealthCertificate',
    'investigationDate',
  ];

  currentLang =
    localStorage.getItem('ls.currentLang') !== 'undefined'
      ? (localStorage.getItem('ls.currentLang') ?? 'ar')
      : 'ar';

  allFilledControlsCount: number = 0;
  allControllesCount: number = 0;
  patientName: string = '';

  constructor(
    private investigationService: InvestigationService,
    private translateService: TranslateService,
    private userMsg: UserMessageService,
    private datePipe: DatePipe,
    private route: ActivatedRoute,
  ) {
    this.patientName = this.getPatientName();
  }

  diarrheaData = {
    diseaseGroupId: this.investigationService.diseaseGroupID,
    patientID: null,
    id: null,
    contactSuspectedCase: null,
    epidemicOutbreak: null,
    contactConfirmedCase: null,
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

    otherSeafood: null,
    otherSeafoodSource: null,
    milk: null,
    milkSource: null,
    cheese: null,
    cheeseSource: null,
    otherCheese: null,
    otherCheeseSource: null,
    iceCream: null,
    iceCreamSource: null,
    otherDairyProducts: null,
    otherDairyProductsSource: null,
    uncookedFruitsVegetables: null,
    uncookedFruitsVegetablesSource: null,
    rawEggs: null,
    rawEggsSource: null,
    foodsNotHome: null,
    foodsNotHomeType: null,
    foodsNotHomeSource: null,
    otherFoods: null,
    otherFoodsSource: null,
    isFoodHandler: null,
    isFoodHandlerJob: null,
    isHealthCertificate: null,
    dateHealthCertificate: null,

    waterSourceHouse: null,
    otherWaterSource: null,
    isWaterStored: null,
    tankType: null,
    sewageSystemHome: null,
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
    other: null,
    filteredWater: null,
    wells: null,
    ethiopianPump: null,
    canal: null,
    storedWater: null,
    sampledSewerSystemTaken: null,
    sampleResult: null,
    investigationDate: null,
    administrationDirectorName: null,
    healthObserverName: null,
    surveillanceOfficerName: null,
    investigationCompletePercentage: null,
  };
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
  distanceWaterSourcesSewages = distanceWaterSourcesSewage;
  currentId: number | null = null;

  ngOnInit(): void {
    this.calculateCompletionPercentage();
    this.currentId = this.resolveCurrentId();
    this.diarrheaData.patientID = this.currentId;
    this.diarrheaData.diseaseGroupId = this.resolveDiseaseGroupId();
    this.investigationService.getByIdDiarrhea(this.currentId).subscribe(
      (res) => {
        const v = res.data;
        if (v != null) {
          this.diarrheaData = { ...this.diarrheaData, ...v };
          this.normalizeDateFields();
        }

        this.calculateCompletionPercentage();
      },
      () => {
        this.calculateCompletionPercentage();
        this.showMessage('NEDSS.COMMON.SENT_FAILD', 'error');
      },
    );
  }

  save() {
    this.currentId = this.resolveCurrentId();
    this.diarrheaData.patientID = this.currentId;
    this.diarrheaData.diseaseGroupId = this.resolveDiseaseGroupId();

    if (this.diarrheaData.patientID == null) {
      this.showMessage('NEDSS.COMMON.SENT_FAILD', 'error');
      return;
    }

    this.calculateCompletionPercentage();
    this.diarrheaData.investigationCompletePercentage =
      this.getCompletionPercentage();

    const request =
      this.diarrheaData.id != null
        ? this.investigationService.updateSevereDiarrhea(
            this.diarrheaData,
          )
        : this.investigationService.addInvestigationDiarrhea(
            this.diarrheaData,
          );

    request.subscribe(
      (response: any) => {
        if (response) {
          this.showMessage('NEDSS.COMMON.SENT_SUCESSFULLY', 'success');
        }
      },
      () => {
        this.showMessage('NEDSS.COMMON.SENT_FAILD', 'error');
      },
    );
  }

  calculateCompletionPercentage() {
    const data = this.diarrheaData as Record<string, any>;
    const trackedFields = Object.keys(data).filter(
      (key) => !this.summaryExcludedFields.includes(key),
    );

    this.allControllesCount = trackedFields.length;
    this.allFilledControlsCount = trackedFields.filter((key) =>
      this.hasValue(data[key]),
    ).length;
  }

  private normalizeDateFields(): void {
    const data = this.diarrheaData as Record<string, any>;

    this.dateFields.forEach((field) => {
      data[field] = this.datePipe.transform(data[field], 'yyyy-MM-dd');
    });
  }

  private getCompletionPercentage(): number {
    if (this.allControllesCount === 0) {
      return 0;
    }

    return parseFloat(
      ((this.allFilledControlsCount / this.allControllesCount) * 100).toFixed(
        2,
      ),
    );
  }

  private hasValue(value: any): boolean {
    return value !== null && value !== '' && value !== 'null';
  }

  private getPatientName(): string {
    const patient = this.investigationService.patient;

    if (patient?.firstName == null) {
      return '';
    }

    return [patient.firstName, patient.secondName, patient.thirdName]
      .filter((name) => name != null && name !== '')
      .join(' ');
  }

  private resolveCurrentId(): number | null {
    const currentId = this.normalizeNumericValue(
      this.investigationService.currentid,
    );
    if (currentId != null) {
      return currentId;
    }

    const routeId = this.normalizeNumericValue(this.route.snapshot.paramMap.get('id'));
    if (routeId != null) {
      this.investigationService.currentid = routeId;
    }

    return routeId;
  }

  private resolveDiseaseGroupId(): number | null {
    const diseaseGroupId = this.normalizeNumericValue(
      this.investigationService.diseaseGroupID,
    );
    if (diseaseGroupId != null) {
      return diseaseGroupId;
    }

    const routeDiseaseGroupId = this.normalizeNumericValue(
      this.route.snapshot.paramMap.get('diseaseId'),
    );
    if (routeDiseaseGroupId != null) {
      this.investigationService.diseaseGroupID = routeDiseaseGroupId;
    }

    return routeDiseaseGroupId;
  }

  private normalizeNumericValue(value: any): number | null {
    if (value == null || value === '') {
      return null;
    }

    const parsedValue = Number(value);
    return Number.isNaN(parsedValue) ? null : parsedValue;
  }

  private showMessage(messageKey: string, type: 'success' | 'error'): void {
    this.translateService.get(messageKey).subscribe((res: string) => {
      this.userMsg[type](res);
    });
  }
}

