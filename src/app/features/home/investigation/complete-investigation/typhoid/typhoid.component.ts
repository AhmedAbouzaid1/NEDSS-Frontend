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
@Component({
  selector: 'app-typhoid',
  host: { class: 'investigation-form' },
  templateUrl: './typhoid.component.html',
  styleUrls: ['./typhoid.component.css'],
})

export class TyphoidComponent implements OnInit {
  private static readonly DATE_FORMAT = 'yyyy-MM-dd';
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
    if (this.investigationService.patient.firstName != null && this.investigationService.patient.firstName != undefined) {
      this.patientName = [
        this.investigationService.patient.firstName,
        this.investigationService.patient.secondName,
        this.investigationService.patient.thirdName,
      ]
        .filter((name) => name != null && name !== '')
        .join(' ');
    }
  }

  typhoidData = {
    patientID: null,
    id: null,
    contactSuspectedCase: null,
    epidemicOutbreak: null,
    contactConfirmedCase: null,
    contactDeceasedPersonRespiratory: null,
    numberNonDirectContacts: null,
    numberDirectContacts: null,

    nameDay1: null,
    ageDay1: null,
    telephoneDay1: null,
    genderDay1: null,
    contactTypeDay1: null,
    relationshipPatientDay1: null,
    dateOnsetSymptomsDay1: null,
    feverDay1: null,
    dryCoughDay1: null,
    coughingWithSpittingDay1: null,
    soreThroatDay1: null,
    breathingDifficultyDay1: null,
    jointPainDay1: null,
    vomitDay1: null,
    diarrheaDay1: null,
    headacheDay1: null,
    abdominalPainDay1: null,
    constipationDay1: null,
    bradycardiaDay1: null,
    lossOfAppetiteDay1: null,
    otherDay1: null,
    otherSymptomsDay1: null,
    // isSampleTakenDay1: 1,
    isSampleTakenDay1: null,
    dateSampleTakenDay1: null,
    // sampleResultDay1: 1,
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
    headacheDay2: null,
    abdominalPainDay2: null,
    constipationDay2: null,
    bradycardiaDay2: null,
    lossOfAppetiteDay2: null,
    otherDay2: null,
    otherSymptomsDay2: null,
    // isSampleTakenDay2: 1,
    isSampleTakenDay2: null,
    dateSampleTakenDay2: null,
    // sampleResultDay2: 1,
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
    headacheDay7: null,
    abdominalPainDay7: null,
    constipationDay7: null,
    bradycardiaDay7: null,
    lossOfAppetiteDay7: null,
    otherDay7: null,
    otherSymptomsDay7: null,
    // isSampleTakenDay7: 1,
    isSampleTakenDay7: null,
    dateSampleTakenDay7: null,
    // sampleResultDay7: 1,
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
    headacheDay14: null,
    abdominalPainDay14: null,
    constipationDay14: null,
    bradycardiaDay14: null,
    lossOfAppetiteDay14: null,
    otherDay14: null,
    otherSymptomsDay14: null,
    // isSampleTakenDay14: '5',
    isSampleTakenDay14: null,
    dateSampleTakenDay14: null,
    // sampleResultDay14: '5',
    sampleResultDay14: null,

    crab: null,
    crabSource: null,
    marineCrustaceans: null,
    marineCrustaceansSource: null,
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
    UncookedFruitsVegetables: null,
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

    filteredWater: null,
    wells: null,
    ethiopianPump: null,
    waterSampleResult: null,
    diseaseGroupId: this.investigationService.diseaseGroupID,
    samplesAnalysisPatienhome1: null,
    investigationCompletePercentage: null,
  };

  distanceWaterSourcesSewages = distanceWaterSourcesSewage;

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
  headacheDay1s = AnswerOptions;
  abdominalPainDay1s = AnswerOptions;
  constipationDay1s = AnswerOptions;
  bradycardiaDay1s = AnswerOptions;
  lossOfAppetiteDay1s = AnswerOptions;
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
  headacheDay2s = AnswerOptions;
  abdominalPainDay2s = AnswerOptions;
  constipationDay2s = AnswerOptions;
  bradycardiaDay2s = AnswerOptions;
  lossOfAppetiteDay2s = AnswerOptions;
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
  headacheDay7s = AnswerOptions;
  abdominalPainDay7s = AnswerOptions;
  constipationDay7s = AnswerOptions;
  bradycardiaDay7s = AnswerOptions;
  lossOfAppetiteDay7s = AnswerOptions;
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
  headacheDay14s = AnswerOptions;
  abdominalPainDay14s = AnswerOptions;
  constipationDay14s = AnswerOptions;
  bradycardiaDay14s = AnswerOptions;
  lossOfAppetiteDay14s = AnswerOptions;
  otherDay14s = AnswerOptions;
  currentId: any;
  ngOnInit(): void {
    this.currentId = this.investigationService.currentid;
    this.typhoidData.patientID = this.currentId;
    this.investigationService.getByIdtyphoid(this.currentId).subscribe(
      (res) => {
        const data = res.data;

        if (data != null) {
          this.typhoidData = data;
          this.typhoidData.dateOnsetSymptomsDay1 = this.datePipe.transform(
            this.typhoidData.dateOnsetSymptomsDay1,
            TyphoidComponent.DATE_FORMAT
          );
          this.typhoidData.dateSampleTakenDay1 = this.datePipe.transform(
            this.typhoidData.dateSampleTakenDay1,
            TyphoidComponent.DATE_FORMAT
          );
          this.typhoidData.dateOnsetSymptomsDay2 = this.datePipe.transform(
            this.typhoidData.dateOnsetSymptomsDay2,
            TyphoidComponent.DATE_FORMAT
          );
          this.typhoidData.dateSampleTakenDay2 = this.datePipe.transform(
            this.typhoidData.dateSampleTakenDay2,
            TyphoidComponent.DATE_FORMAT
          );
          this.typhoidData.dateOnsetSymptomsDay7 = this.datePipe.transform(
            this.typhoidData.dateOnsetSymptomsDay7,
            TyphoidComponent.DATE_FORMAT
          );
          this.typhoidData.dateSampleTakenDay7 = this.datePipe.transform(
            this.typhoidData.dateSampleTakenDay7,
            TyphoidComponent.DATE_FORMAT
          );
          this.typhoidData.dateOnsetSymptomsDay14 = this.datePipe.transform(
            this.typhoidData.dateOnsetSymptomsDay14,
            TyphoidComponent.DATE_FORMAT
          );
          this.typhoidData.dateSampleTakenDay14 = this.datePipe.transform(
            this.typhoidData.dateSampleTakenDay14,
            TyphoidComponent.DATE_FORMAT
          );
          this.typhoidData.dateHealthCertificate = this.datePipe.transform(
            this.typhoidData.dateHealthCertificate,
            TyphoidComponent.DATE_FORMAT
          );
          this.calculateCompletionPercentage();
        }
      },
      (error) => {
        this.translateService
          .get('NEDSS.COMMON.SENT_FAILD')
          .subscribe((res: string) => {
            this.userMsg.error(res);
          });
      }
    );
  }

  save() {
    this.typhoidData.diseaseGroupId = this.investigationService.diseaseGroupID;
    this.calculateCompletionPercentage();
    this.typhoidData.investigationCompletePercentage = parseFloat(((this.allFilledControlsCount / this.allControllesCount) * 100).toFixed(2));

    if (this.typhoidData.id != null) {
      this.investigationService.updatetyphoid(this.typhoidData).subscribe(
        (response: any) => {
          if (response) {
            this.translateService
              .get('NEDSS.COMMON.SENT_SUCESSFULLY')
              .subscribe((res: string) => {
                this.userMsg.success(res);
              });
          }
        },
        (error) => { }
      );
    } else {
      this.investigationService
        .addInvestigationtyphoid(this.typhoidData)
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
          (error) => { }
        );
    }
  }

  //BL
  calculateCompletionPercentage() {
    this.allFilledControlsCount = 0;
    const data = this.typhoidData;
    //Exclude fields you don't want to count (like 'id')
    const hiddenSymptomFields = ['coughingWithSpitting', 'soreThroat', 'breathingDifficulty', 'jointPain', 'vomit']
      .flatMap(f => ['Day1', 'Day2', 'Day7', 'Day14'].map(d => f + d));
    const excludedFields = ['id', 'patientID', 'investigationCompletePercentage', 'diseaseGroupId', 'createdDate', 'contactDeceasedPersonRespiratory', ...hiddenSymptomFields];
    const totalFields = Object.keys(data).filter(key => !excludedFields.includes(key)).length;

    this.allControllesCount = totalFields;

    Object.keys(data).forEach((key) => {
      if (!excludedFields.includes(key) && data[key] !== null && data[key] !== '' && data[key] !== 'null') {
        this.allFilledControlsCount++;
      }
    });
  }
}
