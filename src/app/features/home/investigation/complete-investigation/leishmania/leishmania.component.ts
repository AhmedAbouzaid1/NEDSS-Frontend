import { virtualExamination } from './../../../../../core/constants';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { UserMessageService } from 'src/app/core/services/user.message.service';
import { InvestigationService } from '../../services/investigation.service';
import { TranslateService } from '@ngx-translate/core';
import { DatePipe } from '@angular/common';
@Component({
  selector: 'app-leishmania',
  templateUrl: './leishmania.component.html',
  styleUrls: ['./leishmania.component.css']
})
export class LeishmaniaComponent implements OnInit {
  currentLang =
    localStorage.getItem('ls.currentLang') !== undefined &&
      localStorage.getItem('ls.currentLang') !== 'undefined'
      ? localStorage.getItem('ls.currentLang')
      : 'ar';
  leishmaniaForm: FormGroup;
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
  currentId: any;
  ngOnInit() {
    this.leishmaniaForm = new FormGroup({
      id: new FormControl(),
      patientID: new FormControl(),
      fever: new FormControl(),
      feverDurationDay: new FormControl(),
      maxTemperature: new FormControl(),

      presenceVesicularRash: new FormControl(),
      startDate: new FormControl(),
      skinSores: new FormControl(),
      enlargedLiver: new FormControl(),
      enlargedSpleen: new FormControl(),
      weightLoss: new FormControl(),
      lowPlateletCount: new FormControl(),
      dateOnsetSymptoms: new FormControl(),
      numberUlcers: new FormControl(),
      ulcerType: new FormControl(),
      ulcerStage: new FormControl(),
      leishmaniaTreatmentProtocolImplemented: new FormControl(),
      treatmentStartDate: new FormControl(),
      typeTreatment: new FormControl(),
      numberSessions: new FormControl(),
      dose: new FormControl(),
      conditionAssessment: new FormControl(),
      result: new FormControl(),


      nameHealthFacility1: new FormControl(),
      healthFacilityBelongs1: new FormControl(),
      dateVisit1: new FormControl(),
      initialDiagnosis1: new FormControl(),
      admissionHospital1: new FormControl(),
      dateEntry1: new FormControl(),
      exitDate1: new FormControl(),

      nameHealthFacility2: new FormControl(),
      healthFacilityBelongs2: new FormControl(),
      dateVisit2: new FormControl(),
      initialDiagnosis2: new FormControl(),
      admissionHospital2: new FormControl(),
      dateEntry2: new FormControl(),
      exitDate2: new FormControl(),

      nameHealthFacility3: new FormControl(),
      healthFacilityBelongs3: new FormControl(),
      dateVisit3: new FormControl(),
      initialDiagnosis3: new FormControl(),
      admissionHospital3: new FormControl(),
      dateEntry3: new FormControl(),
      exitDate3: new FormControl(),

      nameHealthFacility4: new FormControl(),
      healthFacilityBelongs4: new FormControl(),
      dateVisit4: new FormControl(),
      initialDiagnosis4: new FormControl(),
      admissionHospital4: new FormControl(),
      dateEntry4: new FormControl(),
      exitDate4: new FormControl(),

      nameHealthFacility5: new FormControl(),
      healthFacilityBelongs5: new FormControl(),
      dateVisit5: new FormControl(),
      initialDiagnosis5: new FormControl(),
      admissionHospital5: new FormControl(),
      dateEntry5: new FormControl(),
      exitDate5: new FormControl(),

      comments: new FormControl(),

      chronicChestDiseases: new FormControl(),
      chronicHeartDisease: new FormControl(),
      highBloodPressure: new FormControl(),
      excessiveObesity: new FormControl(),
      immuneDisease: new FormControl(),
      aids: new FormControl(),
      pregnantWomen: new FormControl(),
      diabetes: new FormControl(),
      liverDiseases: new FormControl(),
      kidneyDisease: new FormControl(),
      diseasesNervousMuscular: new FormControl(),
      bloodBiseases: new FormControl(),
      other: new FormControl(),

      routineMonitoring: new FormControl(),
      followUpContacts: new FormControl(),
      historyTravelOutsideEgypt: new FormControl(),
      medicalTeam: new FormControl(),
      placeConfirmedCases: new FormControl(),


      contactSuspectedCase: new FormControl(),
      epidemicOutbreak: new FormControl(),
      contactConfirmedCase: new FormControl(),
      contactDeceasedPersonRespiratory: new FormControl(),
      numberNonDirectContacts: new FormControl(),
      numberDirectContacts: new FormControl(),

      nameDay1: new FormControl(),
      ageDay1: new FormControl(),
      telephoneDay1: new FormControl(),
      genderDay1: new FormControl(),
      contactTypeDay1: new FormControl(),
      relationshipPatientDay1: new FormControl(),
      dateOnsetSymptomsDay1: new FormControl(),
      feverDay1: new FormControl(),
      dryCoughDay1: new FormControl(),
      coughingWithSpittingDay1: new FormControl(),
      soreThroatDay1: new FormControl(),
      breathingDifficultyDay1: new FormControl(),
      jointPainDay1: new FormControl(),
      vomitDay1: new FormControl(),
      diarrheaDay1: new FormControl(),
      otherDay1: new FormControl(),
      otherSymptomsDay1: new FormControl(),
      isSampleTakenDay1: new FormControl(),
      dateSampleTakenDay1: new FormControl(),
      sampleResultDay1: new FormControl(),

      nameDay2: new FormControl(),
      ageDay2: new FormControl(),
      telephoneDay2: new FormControl(),
      genderDay2: new FormControl(),
      contactTypeDay2: new FormControl(),
      relationshipPatientDay2: new FormControl(),
      dateOnsetSymptomsDay2: new FormControl(),
      feverDay2: new FormControl(),
      dryCoughDay2: new FormControl(),
      coughingWithSpittingDay2: new FormControl(),
      soreThroatDay2: new FormControl(),
      breathingDifficultyDay2: new FormControl(),
      jointPainDay2: new FormControl(),
      vomitDay2: new FormControl(),
      diarrheaDay2: new FormControl(),
      otherDay2: new FormControl(),
      otherSymptomsDay2: new FormControl(),
      isSampleTakenDay2: new FormControl(),
      dateSampleTakenDay2: new FormControl(),
      sampleResultDay2: new FormControl(),

      nameDay7: new FormControl(),
      ageDay7: new FormControl(),
      telephoneDay7: new FormControl(),
      genderDay7: new FormControl(),
      contactTypeDay7: new FormControl(),
      relationshipPatientDay7: new FormControl(),
      dateOnsetSymptomsDay7: new FormControl(),
      feverDay7: new FormControl(),
      dryCoughDay7: new FormControl(),
      coughingWithSpittingDay7: new FormControl(),
      soreThroatDay7: new FormControl(),
      breathingDifficultyDay7: new FormControl(),
      jointPainDay7: new FormControl(),
      vomitDay7: new FormControl(),
      diarrheaDay7: new FormControl(),
      otherDay7: new FormControl(),
      otherSymptomsDay7: new FormControl(),
      isSampleTakenDay7: new FormControl(),
      dateSampleTakenDay7: new FormControl(),
      sampleResultDay7: new FormControl(),


      nameDay14: new FormControl(),
      ageDay14: new FormControl(),
      telephoneDay14: new FormControl(),
      genderDay14: new FormControl(),
      contactTypeDay14: new FormControl(),
      relationshipPatientDay14: new FormControl(),
      dateOnsetSymptomsDay14: new FormControl(),
      feverDay14: new FormControl(),
      dryCoughDay14: new FormControl(),
      coughingWithSpittingDay14: new FormControl(),
      soreThroatDay14: new FormControl(),
      breathingDifficultyDay14: new FormControl(),
      jointPainDay14: new FormControl(),
      vomitDay14: new FormControl(),
      diarrheaDay14: new FormControl(),
      otherDay14: new FormControl(),
      otherSymptomsDay14: new FormControl(),
      isSampleTakenDay14: new FormControl(),
      dateSampleTakenDay14: new FormControl(),
      sampleResultDay14: new FormControl(),


      isInsectInvestigation: new FormControl(),
      resultEntomologicalInvestigation: new FormControl(),
      proceduresControlMosquitoes: new FormControl(),
      mentionProcedures: new FormControl(),
      traveledAbroad: new FormControl(),
      whereToTravel: new FormControl(),
      historyTravel: new FormControl(),
      dateEntry: new FormControl(),
      patientGetNecessaryDose: new FormControl(),
      typeProperty: new FormControl(),
      history: new FormControl(),
      diseaseGroupId: new FormControl(this.investigationService.diseaseGroupID),
      investigationCompletePercentage: new FormControl(),
    })
    this.currentId = this.investigationService.currentid
    this.leishmaniaForm.controls['patientID'].setValue(this.currentId)
    this.investigationService.getByIdleishmania(this.currentId).subscribe(
      res => {
        console.log(res);
        var v = res.data;
        // if (v.isSampleTakenDay1 == null) { v.isSampleTakenDay1 = 2; }
        // if (v.isSampleTakenDay2 == null) { v.isSampleTakenDay2 = 2; }
        // if (v.isSampleTakenDay7 == null) { v.isSampleTakenDay7 = 2; }
        // if (v.isSampleTakenDay14 == null) { v.isSampleTakenDay14 = 2; }
        // //followD1SampleResult
        // if (v.sampleResultDay1 == null) { v.sampleResultDay1 = 2; }
        // if (v.sampleResultDay2 == null) { v.sampleResultDay2 = 2; }
        // if (v.sampleResultDay7 == null) { v.sampleResultDay7 = 2; }
        // if (v.sampleResultDay14 == null) { v.sampleResultDay14 = 2; }
        this.leishmaniaForm.patchValue(v)
        this.leishmaniaForm.patchValue({ fever: this.leishmaniaForm.value.fever + "", tc: true });
        this.leishmaniaForm.controls['startDate'].setValue(this.datePipe.transform(this.leishmaniaForm.value.startDate, 'yyyy-MM-dd'));
        this.leishmaniaForm.controls['dateOnsetSymptoms'].setValue(this.datePipe.transform(this.leishmaniaForm.value.dateOnsetSymptoms, 'yyyy-MM-dd'));
        this.leishmaniaForm.controls['treatmentStartDate'].setValue(this.datePipe.transform(this.leishmaniaForm.value.treatmentStartDate, 'yyyy-MM-dd'));

        //treatmentStartDate
        //
        this.leishmaniaForm.controls['dateVisit1'].setValue(this.datePipe.transform(this.leishmaniaForm.value.dateVisit1, 'yyyy-MM-dd'));
        this.leishmaniaForm.controls['dateEntry1'].setValue(this.datePipe.transform(this.leishmaniaForm.value.dateEntry1, 'yyyy-MM-dd'));
        this.leishmaniaForm.controls['dateVisit2'].setValue(this.datePipe.transform(this.leishmaniaForm.value.dateVisit2, 'yyyy-MM-dd'));
        this.leishmaniaForm.controls['dateEntry2'].setValue(this.datePipe.transform(this.leishmaniaForm.value.dateEntry2, 'yyyy-MM-dd'));
        this.leishmaniaForm.controls['dateVisit3'].setValue(this.datePipe.transform(this.leishmaniaForm.value.dateVisit3, 'yyyy-MM-dd'));
        this.leishmaniaForm.controls['dateEntry3'].setValue(this.datePipe.transform(this.leishmaniaForm.value.dateEntry3, 'yyyy-MM-dd'));
        this.leishmaniaForm.controls['dateVisit4'].setValue(this.datePipe.transform(this.leishmaniaForm.value.dateVisit4, 'yyyy-MM-dd'));
        this.leishmaniaForm.controls['dateEntry4'].setValue(this.datePipe.transform(this.leishmaniaForm.value.dateEntry4, 'yyyy-MM-dd'));
        this.leishmaniaForm.controls['dateVisit5'].setValue(this.datePipe.transform(this.leishmaniaForm.value.dateVisit5, 'yyyy-MM-dd'));
        this.leishmaniaForm.controls['dateEntry5'].setValue(this.datePipe.transform(this.leishmaniaForm.value.dateEntry5, 'yyyy-MM-dd'));
        this.leishmaniaForm.controls['exitDate1'].setValue(this.datePipe.transform(this.leishmaniaForm.value.exitDate1, 'yyyy-MM-dd'));
        this.leishmaniaForm.controls['exitDate2'].setValue(this.datePipe.transform(this.leishmaniaForm.value.exitDate2, 'yyyy-MM-dd'));
        this.leishmaniaForm.controls['exitDate3'].setValue(this.datePipe.transform(this.leishmaniaForm.value.exitDate3, 'yyyy-MM-dd'));
        this.leishmaniaForm.controls['exitDate4'].setValue(this.datePipe.transform(this.leishmaniaForm.value.exitDate4, 'yyyy-MM-dd'));
        this.leishmaniaForm.controls['exitDate5'].setValue(this.datePipe.transform(this.leishmaniaForm.value.exitDate5, 'yyyy-MM-dd'));
        //

        //
        this.leishmaniaForm.controls['dateOnsetSymptomsDay1'].setValue(this.datePipe.transform(this.leishmaniaForm.value.dateOnsetSymptomsDay1, 'yyyy-MM-dd'));
        this.leishmaniaForm.controls['dateOnsetSymptomsDay2'].setValue(this.datePipe.transform(this.leishmaniaForm.value.dateOnsetSymptomsDay2, 'yyyy-MM-dd'));
        this.leishmaniaForm.controls['dateOnsetSymptomsDay7'].setValue(this.datePipe.transform(this.leishmaniaForm.value.dateOnsetSymptomsDay7, 'yyyy-MM-dd'));
        this.leishmaniaForm.controls['dateOnsetSymptomsDay14'].setValue(this.datePipe.transform(this.leishmaniaForm.value.dateOnsetSymptomsDay14, 'yyyy-MM-dd'));



        //
        this.leishmaniaForm.patchValue({ isSampleTakenDay1: this.leishmaniaForm.value.isSampleTakenDay1 + "", tc: true });
        this.leishmaniaForm.patchValue({ sampleResultDay1: this.leishmaniaForm.value.sampleResultDay1 + "", tc: true });
        this.leishmaniaForm.controls['dateSampleTakenDay1'].setValue(this.datePipe.transform(this.leishmaniaForm.value.dateSampleTakenDay1, 'yyyy-MM-dd'));
        this.leishmaniaForm.patchValue({ isSampleTakenDay2: this.leishmaniaForm.value.isSampleTakenDay2 + "", tc: true });
        this.leishmaniaForm.patchValue({ sampleResultDay2: this.leishmaniaForm.value.sampleResultDay2 + "", tc: true });
        this.leishmaniaForm.controls['dateSampleTakenDay2'].setValue(this.datePipe.transform(this.leishmaniaForm.value.dateSampleTakenDay2, 'yyyy-MM-dd'));
        this.leishmaniaForm.patchValue({ isSampleTakenDay7: this.leishmaniaForm.value.isSampleTakenDay7 + "", tc: true });
        this.leishmaniaForm.patchValue({ sampleResultDay7: this.leishmaniaForm.value.sampleResultDay7 + "", tc: true });
        this.leishmaniaForm.controls['dateSampleTakenDay7'].setValue(this.datePipe.transform(this.leishmaniaForm.value.dateSampleTakenDay7, 'yyyy-MM-dd'));
        this.leishmaniaForm.patchValue({ isSampleTakenDay14: this.leishmaniaForm.value.isSampleTakenDay14 + "", tc: true });
        this.leishmaniaForm.patchValue({ sampleResultDay14: this.leishmaniaForm.value.sampleResultDay14 + "", tc: true });
        this.leishmaniaForm.controls['dateSampleTakenDay14'].setValue(this.datePipe.transform(this.leishmaniaForm.value.dateSampleTakenDay14, 'yyyy-MM-dd'));
        //historyTravel
        this.leishmaniaForm.controls['historyTravel'].setValue(this.datePipe.transform(this.leishmaniaForm.value.historyTravel, 'yyyy-MM-dd'));
        this.leishmaniaForm.controls['dateEntry'].setValue(this.datePipe.transform(this.leishmaniaForm.value.dateEntry, 'yyyy-MM-dd'));
        this.leishmaniaForm.controls['history'].setValue(this.datePipe.transform(this.leishmaniaForm.value.history, 'yyyy-MM-dd'));

        this.calculateCompletionPercentage();

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
    Object.entries(this.leishmaniaForm.controls).map(([key, value], index) => {
      if (value.value == 'null')
        value.setValue(null);
    })
    this.calculateCompletionPercentage();
    this.leishmaniaForm.controls['investigationCompletePercentage'].setValue(parseFloat(((this.allFilledControlsCount / this.allControllesCount) * 100).toFixed(2)));
    this.leishmaniaForm.controls['diseaseGroupId'].setValue(this.investigationService.diseaseGroupID);
    if (this.leishmaniaForm.value.id != null) {
      this.investigationService.updateSevereleishmania(this.leishmaniaForm.value).subscribe(
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
      this.investigationService.addInvestigationleishmania(this.leishmaniaForm.value).subscribe(
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

  calculateCompletionPercentage() {
    this.allFilledControlsCount = 0;
    const data = this.leishmaniaForm.value;
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
