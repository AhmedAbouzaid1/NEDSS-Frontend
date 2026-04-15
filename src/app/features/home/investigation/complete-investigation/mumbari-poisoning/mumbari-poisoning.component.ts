import { Component, OnInit } from '@angular/core';
import { AnswerOptions, Gender, contactType } from 'src/app/core/constants';
import { UserMessageService } from 'src/app/core/services/user.message.service';
import { InvestigationService } from '../../services/investigation.service';
import { TranslateService } from '@ngx-translate/core';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-mumbari-poisoning',
  templateUrl: './mumbari-poisoning.component.html',
  styleUrls: ['./mumbari-poisoning.component.css']
})
export class MumbariPoisoningComponent implements OnInit {


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
    private userMsg: UserMessageService,
    private datePipe: DatePipe) { 
      if (this.investigationService.patient.firstName != null && this.investigationService.patient.firstName != undefined) {
        this.patientName = this.investigationService.patient.firstName + " " + this.investigationService.patient.secondName + " " + this.investigationService.patient.thirdName;
      }
    }
  mumbariPoisoningData = {
    patientID: null,
    id: null,
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
    vomitDay14: null,
    diarrheaDay14: null,
    otherDay14: null,
    otherSymptomsDay14: null,
    isSampleTakenDay14: null,
    dateSampleTakenDay14: null,
    sampleResultDay14: null,

    patientEatCanned: null,
    foodType: null,
    patientEatsaltedFish: null,
    manufacturingSource: null,
    addressShop: null,
    honeyForInfants: null,
    rawMeat: null,
    bodyWounds: null,
    bodyBurns: null,
    areOtherCasesInfectedFamily: null,
    numberInfectedMembers: null,
    infectedMember1: null,
    confinedHospital: null,
    numberCasesBooked: null,
    patientDoseAntiBotulismSerum: null,
    numberBottlesDosages: null,

    history1: null,
    history2: null,
    history3: null,
    intensiveCareReservation: null,
    intensiveCareReservationDate: null,
    therapeuticInjectionPlace: null,
    productOperationalNumber: null,
    therapeuticInjectionDate: null,
    therapeuticDosesCount: null,
    diseaseGroupId: this.investigationService.diseaseGroupID,
    investigationCompletePercentage:null
  }

  genderDay1s = Gender;
  contactTypeDay1s = contactType;
  feverDay1s = AnswerOptions;
  dryCoughDay1s = AnswerOptions;
  coughingWithSpittingDay1s = AnswerOptions;
  soreThroatDay1s = AnswerOptions;
  breathingDifficultyDay1s = AnswerOptions;
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
  vomitDay14s = AnswerOptions;
  diarrheaDay14s = AnswerOptions;
  otherDay14s = AnswerOptions;

  patientEatCanneds = AnswerOptions;
  patientEatsaltedFishs = AnswerOptions;
  areOtherCasesInfectedFamilys = AnswerOptions;
  confinedHospitals = AnswerOptions;
  patientDoseAntiBotulismSerums = AnswerOptions;
  currentId: any;

  ngOnInit(): void {
    this.currentId = this.investigationService.currentid
    this.mumbariPoisoningData.patientID = this.currentId;
    this.investigationService.getByIdmumbariPoisoning(this.currentId).subscribe(
      res => {
        console.log(res);
        var v = res.data;
        if (v != null) {
          this.mumbariPoisoningData = v;
          this.mumbariPoisoningData.dateOnsetSymptomsDay1 = this.datePipe.transform(this.mumbariPoisoningData.dateOnsetSymptomsDay1, 'yyyy-MM-dd');
          this.mumbariPoisoningData.dateSampleTakenDay1 = this.datePipe.transform(this.mumbariPoisoningData.dateSampleTakenDay1, 'yyyy-MM-dd');
          this.mumbariPoisoningData.dateOnsetSymptomsDay2 = this.datePipe.transform(this.mumbariPoisoningData.dateOnsetSymptomsDay2, 'yyyy-MM-dd');
          this.mumbariPoisoningData.dateSampleTakenDay2 = this.datePipe.transform(this.mumbariPoisoningData.dateSampleTakenDay2, 'yyyy-MM-dd');
          this.mumbariPoisoningData.dateOnsetSymptomsDay7 = this.datePipe.transform(this.mumbariPoisoningData.dateOnsetSymptomsDay7, 'yyyy-MM-dd');

          this.mumbariPoisoningData.dateSampleTakenDay7 = this.datePipe.transform(this.mumbariPoisoningData.dateSampleTakenDay7, 'yyyy-MM-dd');
          this.mumbariPoisoningData.dateOnsetSymptomsDay14 = this.datePipe.transform(this.mumbariPoisoningData.dateOnsetSymptomsDay14, 'yyyy-MM-dd');
          this.mumbariPoisoningData.dateSampleTakenDay14 = this.datePipe.transform(this.mumbariPoisoningData.dateSampleTakenDay14, 'yyyy-MM-dd');
          //history1
          this.mumbariPoisoningData.history1 = this.datePipe.transform(this.mumbariPoisoningData.history1, 'yyyy-MM-dd');
          this.mumbariPoisoningData.history2 = this.datePipe.transform(this.mumbariPoisoningData.history2, 'yyyy-MM-dd');
          this.mumbariPoisoningData.history3 = this.datePipe.transform(this.mumbariPoisoningData.history3, 'yyyy-MM-dd');
          this.sanitizeOtherSymptomsFields();
          this.calculateCompletionPercentage();
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

  save() {
    //console.log(this.rabiesForm.value);
    this.normalizeNullLikeValues();
    this.sanitizeOtherSymptomsFields();
    this.calculateCompletionPercentage();
    this.mumbariPoisoningData.diseaseGroupId = this.investigationService.diseaseGroupID;
    this.mumbariPoisoningData.investigationCompletePercentage= parseFloat(((this.allFilledControlsCount / this.allControllesCount) * 100).toFixed(2));
    if (this.mumbariPoisoningData != null && this.mumbariPoisoningData.id != null) {
      this.investigationService.updateSeveremumbariPoisoning(this.mumbariPoisoningData).subscribe(
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
      this.investigationService.addInvestigationmumbariPoisoning(this.mumbariPoisoningData).subscribe(
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

  isOtherSelected(otherValue: any): boolean {
    return otherValue === 1 || otherValue === '1' || otherValue === 0 || otherValue === '0';
  }

  onOtherSelectionChange(day: 1 | 2 | 7 | 14): void {
    switch (day) {
      case 1:
        if (!this.isOtherSelected(this.mumbariPoisoningData.otherDay1)) {
          this.mumbariPoisoningData.otherSymptomsDay1 = null;
        }
        break;
      case 2:
        if (!this.isOtherSelected(this.mumbariPoisoningData.otherDay2)) {
          this.mumbariPoisoningData.otherSymptomsDay2 = null;
        }
        break;
      case 7:
        if (!this.isOtherSelected(this.mumbariPoisoningData.otherDay7)) {
          this.mumbariPoisoningData.otherSymptomsDay7 = null;
        }
        break;
      case 14:
        if (!this.isOtherSelected(this.mumbariPoisoningData.otherDay14)) {
          this.mumbariPoisoningData.otherSymptomsDay14 = null;
        }
        break;
    }
    this.calculateCompletionPercentage();
  }

  private sanitizeOtherSymptomsFields(): void {
    if (!this.isOtherSelected(this.mumbariPoisoningData.otherDay1)) {
      this.mumbariPoisoningData.otherSymptomsDay1 = null;
    }
    if (!this.isOtherSelected(this.mumbariPoisoningData.otherDay2)) {
      this.mumbariPoisoningData.otherSymptomsDay2 = null;
    }
    if (!this.isOtherSelected(this.mumbariPoisoningData.otherDay7)) {
      this.mumbariPoisoningData.otherSymptomsDay7 = null;
    }
    if (!this.isOtherSelected(this.mumbariPoisoningData.otherDay14)) {
      this.mumbariPoisoningData.otherSymptomsDay14 = null;
    }
  }

  private normalizeNullLikeValues(): void {
    Object.keys(this.mumbariPoisoningData).forEach((key) => {
      const value = this.mumbariPoisoningData[key];
      if (value === 'null' || value === 'undefined' || value === '') {
        this.mumbariPoisoningData[key] = null;
      }
    });
  }


  //BL
  calculateCompletionPercentage() {
    this.allFilledControlsCount = 0;
    const data = this.mumbariPoisoningData;
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
