import { Component, OnInit } from '@angular/core';
import { AnswerOptions, distanceWaterSourcesSewage, waterSource } from 'src/app/core/constants';
import { UserMessageService } from 'src/app/core/services/user.message.service';
import { InvestigationService } from '../../services/investigation.service';
import { TranslateService } from '@ngx-translate/core';
import { DatePipe } from '@angular/common';
@Component({
  selector: 'app-severe-food-poisoning',
  templateUrl: './severe-food-poisoning.component.html',
  styleUrls: ['./severe-food-poisoning.component.css']
})
export class SevereFoodPoisoningComponent implements OnInit {
  currentLang =
    localStorage.getItem('ls.currentLang') !== undefined &&
      localStorage.getItem('ls.currentLang') !== 'undefined'
      ? localStorage.getItem('ls.currentLang')
      : 'ar';

      
  allFilledControlsCount: number = 0;
  allControllesCount: number = 0;
  patientName: string;
  constructor(private investigationService: InvestigationService,
    private translateService: TranslateService,
    private userMsg: UserMessageService
    , public datePipe: DatePipe) {
      if (this.investigationService.patient.firstName != null && this.investigationService.patient.firstName != undefined) {
        this.patientName = this.investigationService.patient.firstName + " " + this.investigationService.patient.secondName + " " + this.investigationService.patient.thirdName;
      }
     }

  SevereFoodPoisoningData = {
    patientID: null,
    id: null,
    referralPartOutbreak: null,
    patientFoodHandler: null,
    patientHealthCertificate: null,
    foodsNotPreparedHome: null,
    mucusAccompanyingStool: null,
    mucusAccompaniedBlood: null,
    stoolWatery: null,
    vomit: null,
    urgeVomit: null,
    meaning: null,
    cough: null,
    jointPain: null,
    colic: null,
    headache: null,
    muscleAches: null,
    rednessSkin: null,
    jerk: null,
    soreThroat: null,
    cramp: null,
    waterStored: null,
    changeInDrinkingWater: null,
    dateLastCertificate: null,
    food: null,
    source: null,
    feverDurationDay: null,
    maxTemperature: null,
    numberStoolsDay: null,
    other: null,
    other2: null,
    tankType: null,
    fever: null,
    waterSource: null,
    distanceWaterSourcesSewage: null,
    diseaseGroupId: this.investigationService.diseaseGroupID,
    investigationCompletePercentage:null
  }
  referralPartOutbreaks = AnswerOptions;
  patientFoodHandlers = AnswerOptions;
  patientHealthCertificates = AnswerOptions;
  foodsNotPreparedHomes = AnswerOptions;
  mucusAccompanyingStools = AnswerOptions;
  mucusAccompaniedBloods = AnswerOptions;
  stoolWaterys = AnswerOptions;
  vomits = AnswerOptions;
  urgeVomits = AnswerOptions;
  meanings = AnswerOptions;
  coughs = AnswerOptions;
  jointPains = AnswerOptions;
  colics = AnswerOptions;
  headaches = AnswerOptions;
  muscleAchess = AnswerOptions;
  rednessSkins = AnswerOptions;
  jerks = AnswerOptions;
  SoreThroats = AnswerOptions;
  cramps = AnswerOptions;
  waterStoreds = AnswerOptions;
  changeInDrinkingWaters = AnswerOptions;
  waterSources = waterSource;
  distanceWaterSourcesSewages = distanceWaterSourcesSewage;
  currentId: any;
  ngOnInit(): void {

    this.currentId = this.investigationService.currentid
    this.SevereFoodPoisoningData.patientID = this.currentId;
    this.investigationService.getByIdSevereFoodPoisoning(this.currentId).subscribe(
      res => {
        console.log(res);
        var v = res.data;
        if (v != null) {

          this.SevereFoodPoisoningData = v;
          this.SevereFoodPoisoningData.dateLastCertificate = this.datePipe.transform(this.SevereFoodPoisoningData.dateLastCertificate, 'yyyy-MM-dd');


          this.calculateCompletionPercentage();
        }

        //this.rabiesForm.patchValue(v)
      }
      , (error) => {
        this.translateService
          .get('NEDSS.COMMON.SENT_FAILD')
          .subscribe((res: string) => {
            this.userMsg.error(res);
          });
      }
    )
  }

  save() {

    this.SevereFoodPoisoningData.diseaseGroupId = this.investigationService.diseaseGroupID;
    this.calculateCompletionPercentage();
    this.SevereFoodPoisoningData.investigationCompletePercentage = parseFloat(((this.allFilledControlsCount / this.allControllesCount) * 100).toFixed(2));
    //console.log(this.rabiesForm.value);
    if (this.SevereFoodPoisoningData != null && this.SevereFoodPoisoningData.id != null) {
      this.investigationService.updateSevereFoodPoisoning(this.SevereFoodPoisoningData).subscribe(
        (response: any) => {
          if (response) {
            this.translateService
              .get('NEDSS.COMMON.SENT_SUCESSFULLY')
              .subscribe((res: string) => {
                this.userMsg.success(res);
              });
          }
        }
        , (error) => {
          this.translateService
            .get('NEDSS.COMMON.SENT_FAILD')
            .subscribe((res: string) => {
              this.userMsg.error(res);
            });
        }
      )
    } else {
      this.investigationService.addInvestigationSevereFoodPoisoning(this.SevereFoodPoisoningData).subscribe(
        (response: any) => {

          if (response) {
            this.translateService
              .get('NEDSS.COMMON.SENT_SUCESSFULLY')
              .subscribe((res: string) => {
                this.userMsg.success(res);
              });
          }
        }
        , (error) => {
          this.translateService
            .get('NEDSS.COMMON.SENT_FAILD')
            .subscribe((res: string) => {
              this.userMsg.error(res);
            });
        }
      )
    }
  }

  //BL
  calculateCompletionPercentage() {
    this.allFilledControlsCount = 0;
    const data = this.SevereFoodPoisoningData;
    //Exclude fields you don't want to count (like 'id')
    const excludedFields = ['id', 'patientID', 'investigationCompletePercentage', 'diseaseGroupId', 'createdDate'];
    const totalFields = Object.keys(data).filter(key => !excludedFields.includes(key)).length;

    this.allControllesCount = totalFields;

    Object.keys(data).forEach((key) => {
      if (!excludedFields.includes(key) && data[key] !== null && data[key] !== '' && data[key] !== 'null') {
        this.allFilledControlsCount++;
      }
    });
  }
}

