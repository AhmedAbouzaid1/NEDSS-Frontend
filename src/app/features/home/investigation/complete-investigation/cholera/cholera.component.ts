import { Component, OnInit } from '@angular/core';
import { AnswerOptions, Gender, contactType, distanceWaterSourcesSewage } from 'src/app/core/constants';
import { UserMessageService } from 'src/app/core/services/user.message.service';
import { InvestigationService } from '../../services/investigation.service';
import { TranslateService } from '@ngx-translate/core';
import { DatePipe } from '@angular/common';
@Component({
  selector: 'app-cholera',
  templateUrl: './cholera.component.html',
  styleUrls: ['./cholera.component.css']
})
export class CholeraComponent implements OnInit {
  currentLang =
    localStorage.getItem('ls.currentLang') !== undefined &&
      localStorage.getItem('ls.currentLang') !== 'undefined'
      ? localStorage.getItem('ls.currentLang')
      : 'ar';
  // choleraData:any;
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

  choleraData = {
    id: null,
    patientID: null,

    // fever: 0,
    // feverDurationDay: 0,
    // maxTemperature: 0,

    // darkUrine: 0,
    // yellowEyeColor: 0,
    // painRightSideAbdomen: 0,
    // patientHospitalized: 0,
    // bookedIntensiveCare: 0,

    // dateAdmissionHospital: null,

    // contactSuspectedCase: 0,
    // contactConfirmedCase: 0,
    // epidemicOutbreak: 0,
    // contactDeceasedPersonRespiratory: 0,
    // numberDirectContacts: 0,
    fever: null,
    feverDurationDay: null,
    maxTemperature: null,

    // darkUrine: null,
    // yellowEyeColor: null,
    // painRightSideAbdomen: null,
    // patientHospitalized: null,
    // bookedIntensiveCare: null,
    // dateAdmissionHospital: null,

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
    UncookedFruitsVegetablesSource: null,
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

    patientOutsideCountry: null,
    country: null,
    travelReason: null,
    travelDate: null,
    travelBackDate: null,

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
    otherSamplesAnalysisPatienhome: null,
    filteredWater: null,
    wells: null,
    ethiopianPump: null,
    canal: null,
    storedWater: null,
    sampledSewerSystemTaken: null,
    sampleResult: null,
    diseaseGroupId: this.investigationService.diseaseGroupID,
    investigationCompletePercentage: null,

  }

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

  patientOutsideCountrys = AnswerOptions;
  distanceWaterSourcesSewages = distanceWaterSourcesSewage;
  currentId: any;
  ngOnInit(): void {
    this.currentId = this.investigationService.currentid
    this.choleraData.patientID = this.currentId
    this.investigationService.getByIdcholera(this.currentId).subscribe(
      res => {
        console.log(res);
        var v = res.data;
        if (v != null) {
          this.choleraData = v
          this.choleraData.dateOnsetSymptomsDay1 = this.datePipe.transform(this.choleraData.dateOnsetSymptomsDay1, 'yyyy-MM-dd');
          this.choleraData.dateSampleTakenDay1 = this.datePipe.transform(this.choleraData.dateSampleTakenDay1, 'yyyy-MM-dd');
          this.choleraData.dateOnsetSymptomsDay2 = this.datePipe.transform(this.choleraData.dateOnsetSymptomsDay2, 'yyyy-MM-dd');
          this.choleraData.dateSampleTakenDay2 = this.datePipe.transform(this.choleraData.dateSampleTakenDay2, 'yyyy-MM-dd');
          this.choleraData.dateOnsetSymptomsDay7 = this.datePipe.transform(this.choleraData.dateOnsetSymptomsDay7, 'yyyy-MM-dd');

          this.choleraData.dateSampleTakenDay7 = this.datePipe.transform(this.choleraData.dateSampleTakenDay7, 'yyyy-MM-dd');
          this.choleraData.dateOnsetSymptomsDay14 = this.datePipe.transform(this.choleraData.dateOnsetSymptomsDay14, 'yyyy-MM-dd');
          this.choleraData.dateSampleTakenDay14 = this.datePipe.transform(this.choleraData.dateSampleTakenDay14, 'yyyy-MM-dd');
          //dateHealthCertificate
          this.choleraData.dateHealthCertificate = this.datePipe.transform(this.choleraData.dateHealthCertificate, 'yyyy-MM-dd');
          //travelDate
          this.choleraData.travelDate = this.datePipe.transform(this.choleraData.travelDate, 'yyyy-MM-dd');
          this.choleraData.travelBackDate = this.datePipe.transform(this.choleraData.travelBackDate, 'yyyy-MM-dd');
          
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
    this.calculateCompletionPercentage();
    this.choleraData.diseaseGroupId = this.investigationService.diseaseGroupID;
    this.choleraData.investigationCompletePercentage= parseFloat(((this.allFilledControlsCount / this.allControllesCount) * 100).toFixed(2));
    if (this.choleraData != null && this.choleraData.id != null) {
      this.investigationService.updatecholera(this.choleraData).subscribe(
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
      this.investigationService.addInvestigationcholera(this.choleraData).subscribe(
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
    const data = this.choleraData;
    console.log(data);
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
