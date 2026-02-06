import { Component, OnInit } from '@angular/core';
import { AnswerOptions, Gender, contactType } from 'src/app/core/constants';
import { UserMessageService } from 'src/app/core/services/user.message.service';
import { InvestigationService } from '../../services/investigation.service';
import { TranslateService } from '@ngx-translate/core';
import { DatePipe } from '@angular/common';
@Component({
  selector: 'app-mumps',
  templateUrl: './mumps.component.html',
  styleUrls: ['./mumps.component.css']
})
export class MumpsComponent implements OnInit {

  allFilledControlsCount: number = 0;
  allControllesCount: number = 0;
  patientName:string;
  constructor(private investigationService: InvestigationService,
    private translateService: TranslateService,
    private userMsg: UserMessageService,
    private datePipe: DatePipe) 
    { 
      if (this.investigationService.patient.firstName != null && this.investigationService.patient.firstName != undefined) {
        this.patientName = this.investigationService.patient.firstName + " " + this.investigationService.patient.secondName + " " + this.investigationService.patient.thirdName;
      }
    }

    currentLang =
    localStorage.getItem('ls.currentLang') !== undefined &&
      localStorage.getItem('ls.currentLang') !== 'undefined'
      ? localStorage.getItem('ls.currentLang')
      : 'ar';
      
  MumpsData = {
    fever: null,
    inflammationParotidGland: null,
    epidemicOutbreak: null,
    contactSuspectedCase: null,
    contactConfirmedCase: null,
    contactDeceasedPersonRespiratory: null,
    feverDurationDay: null,
    maxTemperature: null,
    startDate: null,
    inflammationTesticle: null,
    enlargementSalivaryGlands: null,
    numberDirectContacts: null,
    numberNonDirectContacts: null,
    mmrVaccine: null,
    dateMmrVaccine: null,
    mmrVaccine2: null,
    dateMmrVaccine2: null,
    otherMmrVaccine: null,
    dateOtherMmrVaccine: null,
    investigationCompletePercentage:null,
    nameDay1: null,
    ageDay1: null,
    telephoneDay1: null,
    relationshipPatientDay1: null,
    dateOnsetSymptomsDay1: null,
    otherSymptomsDay1: null,
    dateSampleTakenDay1: null,
    genderDay1: null,
    contactTypeDay1: null,
    feverDay1: null,
    dryCoughDay1: null,
    coughingWithSpittingDay1: null,
    soreThroatDay1: null,
    breathingDifficultyDay1: null,
    jointPainDay1: null,
    vomitDay1: null,
    diarrheaDay1: null,
    otherDay1: null,
    isSampleTakenDay1: null,
    sampleResultDay1: null,

    nameDay2: null,
    ageDay2: null,
    telephoneDay2: null,
    relationshipPatientDay2: null,
    dateOnsetSymptomsDay2: null,
    otherSymptomsDay2: null,
    dateSampleTakenDay2: null,
    genderDay2: null,
    contactTypeDay2: null,
    feverDay2: null,
    dryCoughDay2: null,
    coughingWithSpittingDay2: null,
    soreThroatDay2: null,
    breathingDifficultyDay2: null,
    jointPainDay2: null,
    vomitDay2: null,
    diarrheaDay2: null,
    otherDay2: null,
    isSampleTakenDay2: null,
    sampleResultDay2: null,

    nameDay7: null,
    ageDay7: null,
    telephoneDay7: null,
    relationshipPatientDay7: null,
    dateOnsetSymptomsDay7: null,
    otherSymptomsDay7: null,
    dateSampleTakenDay7: null,
    genderDay7: null,
    contactTypeDay7: null,
    feverDay7: null,
    dryCoughDay7: null,
    coughingWithSpittingDay7: null,
    soreThroatDay7: null,
    breathingDifficultyDay7: null,
    jointPainDay7: null,
    vomitDay7: null,
    diarrheaDay7: null,
    otherDay7: null,
    isSampleTakenDay7: null,
    sampleResultDay7: null,


    nameDay14: null,
    ageDay14: null,
    telephoneDay14: null,
    relationshipPatientDay14: null,
    dateOnsetSymptomsDay14: null,
    otherSymptomsDay14: null,
    dateSampleTakenDay14: null,
    genderDay14: null,
    contactTypeDay14: null,
    feverDay14: null,
    dryCoughDay14: null,
    coughingWithSpittingDay14: null,
    soreThroatDay14: null,
    breathingDifficultyDay14: null,
    jointPainDay14: null,
    vomitDay14: null,
    diarrheaDay14: null,
    otherDay14: null,
    isSampleTakenDay14: null,
    sampleResultDay14: null,
    diseaseGroupId: this.investigationService.diseaseGroupID,
    patientID: null,
    id: null,
  }
  currentId: null;
  inflammationTesticles = AnswerOptions;
  enlargementSalivaryGlandss = AnswerOptions;
  mmrVaccines = AnswerOptions;
  mmrVaccines2 = AnswerOptions;
  otherMmrVaccines = AnswerOptions;

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
  ngOnInit(): void {
    this.MumpsData.diseaseGroupId = this.investigationService.diseaseGroupID
    console.log(this.MumpsData);
    this.currentId = this.investigationService.currentid
    this.MumpsData.patientID = this.currentId;
    this.investigationService.getByIdmumbs(this.currentId).subscribe(
      res => {
        console.log(res);
        var v = res.data;
        if (v != null) {
          this.MumpsData = v;
          this.MumpsData.dateOnsetSymptomsDay1 = this.datePipe.transform(this.MumpsData.dateOnsetSymptomsDay1, 'yyyy-MM-dd');
          this.MumpsData.dateSampleTakenDay1 = this.datePipe.transform(this.MumpsData.dateSampleTakenDay1, 'yyyy-MM-dd');
          this.MumpsData.dateOnsetSymptomsDay2 = this.datePipe.transform(this.MumpsData.dateOnsetSymptomsDay2, 'yyyy-MM-dd');
          this.MumpsData.dateSampleTakenDay2 = this.datePipe.transform(this.MumpsData.dateSampleTakenDay2, 'yyyy-MM-dd');
          this.MumpsData.dateOnsetSymptomsDay7 = this.datePipe.transform(this.MumpsData.dateOnsetSymptomsDay7, 'yyyy-MM-dd');

          this.MumpsData.dateSampleTakenDay7 = this.datePipe.transform(this.MumpsData.dateSampleTakenDay7, 'yyyy-MM-dd');
          this.MumpsData.dateOnsetSymptomsDay14 = this.datePipe.transform(this.MumpsData.dateOnsetSymptomsDay14, 'yyyy-MM-dd');
          this.MumpsData.dateSampleTakenDay14 = this.datePipe.transform(this.MumpsData.dateSampleTakenDay14, 'yyyy-MM-dd');


          this.MumpsData.startDate = this.datePipe.transform(this.MumpsData.startDate, 'yyyy-MM-dd');
          this.MumpsData.dateMmrVaccine = this.datePipe.transform(this.MumpsData.dateMmrVaccine, 'yyyy-MM-dd');
          this.MumpsData.dateOtherMmrVaccine = this.datePipe.transform(this.MumpsData.dateOtherMmrVaccine, 'yyyy-MM-dd');
          this.MumpsData.dateMmrVaccine2 = this.datePipe.transform(this.MumpsData.dateMmrVaccine2, 'yyyy-MM-dd');

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
    this.MumpsData.patientID = this.currentId;
    this.MumpsData.diseaseGroupId = this.investigationService.diseaseGroupID;
    this.calculateCompletionPercentage();
    this.MumpsData.investigationCompletePercentage = parseFloat(((this.allFilledControlsCount / this.allControllesCount) * 100).toFixed(2));
    if (this.MumpsData != null && this.MumpsData.id !== null) {
      this.investigationService.updatemumbs(this.MumpsData).subscribe(
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
      this.investigationService.addInvestigationmumbs(this.MumpsData).subscribe(
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
      const data = this.MumpsData;
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
