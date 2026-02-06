import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { UserMessageService } from 'src/app/core/services/user.message.service';
import { InvestigationService } from '../../services/investigation.service'; import { TranslateService } from '@ngx-translate/core';
import { DatePipe } from '@angular/common';
@Component({
  selector: 'app-filariasis',
  templateUrl: './filariasis.component.html',
  styleUrls: ['./filariasis.component.css']
})
export class FilariasisComponent implements OnInit {
  currentLang =
    localStorage.getItem('ls.currentLang') !== undefined &&
      localStorage.getItem('ls.currentLang') !== 'undefined'
      ? localStorage.getItem('ls.currentLang')
      : 'ar';


  diseaseGroupId: any;
  filariasisForm: FormGroup
  currentId: any;
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
  ngOnInit() {
    this.filariasisForm = new FormGroup({
      id: new FormControl(),
      patientID: new FormControl(),
      // fever: new FormControl(0),
      fever: new FormControl(),
      feverDurationDay: new FormControl(),
      maxTemperature: new FormControl(),
      lymphaticEnlargement: new FormControl(),
      hydrocele: new FormControl(),
      milkyUrine: new FormControl(),
      elephantiasis: new FormControl(),
      dateOnsetSymptoms: new FormControl(),
      filariasisTreatmentProtocolImplemented: new FormControl(),
      treatmentStartDate: new FormControl(),
      typeTreatment: new FormControl(),
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

      routineMonitoring: new FormControl(),
      followUpContacts: new FormControl(),
      // historyTravelOutsideEgypt: new FormControl(2),
      historyTravelOutsideEgypt: new FormControl(),
      // medicalTeam: new FormControl(2),
      medicalTeam: new FormControl(),
      placeconfirmedCases: new FormControl(),

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

      insectInvestigationRadius: new FormControl(),
      resultEntomologicalInvestigation: new FormControl(),
      proceduresUsedControlMosquitoes: new FormControl(),
      mentionProcedures: new FormControl(),
      traveledAbroad: new FormControl(),
      whereToTravel: new FormControl(),
      historyTravel: new FormControl(),
      dateEntryEgypt: new FormControl(),
      getNecessaryDose: new FormControl(),
      typeProperty: new FormControl(),
      history: new FormControl(),
      diseaseGroupId: new FormControl(this.investigationService.diseaseGroupID),
      investigationCompletePercentage: new FormControl(),
    })
    this.currentId = this.investigationService.currentid
    this.filariasisForm.controls['patientID'].setValue(this.currentId)
    this.investigationService.getByIdfilarisis(this.currentId).subscribe(
      res => {
        console.log(res);
        var v = res.data;
        // if (v.fever == null) { v.fever = 0; }
        // if (v.isSampleTakenDay1 == null) { v.isSampleTakenDay1 = 2; }
        // if (v.isSampleTakenDay2 == null) { v.isSampleTakenDay2 = 2; }
        // if (v.isSampleTakenDay7 == null) { v.isSampleTakenDay7 = 2; }
        // if (v.isSampleTakenDay14 == null) { v.isSampleTakenDay14 = 2; }
        // //followD1SampleResult
        // if (v.sampleResultDay1 == null) { v.sampleResultDay1 = 2; }
        // if (v.sampleResultDay2 == null) { v.sampleResultDay2 = 2; }
        // if (v.sampleResultDay7 == null) { v.sampleResultDay7 = 2; }
        // if (v.sampleResultDay14 == null) { v.sampleResultDay14 = 2; }
        this.filariasisForm.patchValue(v)
        this.filariasisForm.patchValue({ fever: this.filariasisForm.value.fever + "", tc: true });
        //dateOnsetSymptoms
        this.filariasisForm.controls['dateOnsetSymptoms'].setValue(this.datePipe.transform(this.filariasisForm.value.dateOnsetSymptoms, 'yyyy-MM-dd'));
        //treatmentStartDate
        this.filariasisForm.controls['treatmentStartDate'].setValue(this.datePipe.transform(this.filariasisForm.value.treatmentStartDate, 'yyyy-MM-dd'));
        //
        this.filariasisForm.patchValue({ isSampleTakenDay1: this.filariasisForm.value.isSampleTakenDay1 + "", tc: true });
        this.filariasisForm.patchValue({ sampleResultDay1: this.filariasisForm.value.sampleResultDay1 + "", tc: true });
        this.filariasisForm.controls['dateSampleTakenDay1'].setValue(this.datePipe.transform(this.filariasisForm.value.dateSampleTakenDay1, 'yyyy-MM-dd'));
        this.filariasisForm.patchValue({ isSampleTakenDay2: this.filariasisForm.value.isSampleTakenDay2 + "", tc: true });
        this.filariasisForm.patchValue({ sampleResultDay2: this.filariasisForm.value.sampleResultDay2 + "", tc: true });
        this.filariasisForm.controls['dateSampleTakenDay2'].setValue(this.datePipe.transform(this.filariasisForm.value.dateSampleTakenDay2, 'yyyy-MM-dd'));
        this.filariasisForm.patchValue({ isSampleTakenDay7: this.filariasisForm.value.isSampleTakenDay7 + "", tc: true });
        this.filariasisForm.patchValue({ sampleResultDay7: this.filariasisForm.value.sampleResultDay7 + "", tc: true });
        this.filariasisForm.controls['dateSampleTakenDay7'].setValue(this.datePipe.transform(this.filariasisForm.value.dateSampleTakenDay7, 'yyyy-MM-dd'));
        this.filariasisForm.patchValue({ isSampleTakenDay14: this.filariasisForm.value.isSampleTakenDay14 + "", tc: true });
        this.filariasisForm.patchValue({ sampleResultDay14: this.filariasisForm.value.sampleResultDay14 + "", tc: true });
        this.filariasisForm.controls['dateSampleTakenDay14'].setValue(this.datePipe.transform(this.filariasisForm.value.dateSampleTakenDay14, 'yyyy-MM-dd'));
        //dateOnsetSymptomsDay1
        this.filariasisForm.controls['dateOnsetSymptomsDay1'].setValue(this.datePipe.transform(this.filariasisForm.value.dateOnsetSymptomsDay1, 'yyyy-MM-dd'));
        this.filariasisForm.controls['dateOnsetSymptomsDay2'].setValue(this.datePipe.transform(this.filariasisForm.value.dateOnsetSymptomsDay2, 'yyyy-MM-dd'));
        this.filariasisForm.controls['dateOnsetSymptomsDay7'].setValue(this.datePipe.transform(this.filariasisForm.value.dateOnsetSymptomsDay7, 'yyyy-MM-dd'));
        this.filariasisForm.controls['dateOnsetSymptomsDay14'].setValue(this.datePipe.transform(this.filariasisForm.value.dateOnsetSymptomsDay14, 'yyyy-MM-dd'));




        this.filariasisForm.controls['dateVisit1'].setValue(this.datePipe.transform(this.filariasisForm.value.dateVisit1, 'yyyy-MM-dd'));
        this.filariasisForm.controls['dateEntry1'].setValue(this.datePipe.transform(this.filariasisForm.value.dateEntry1, 'yyyy-MM-dd'));
        this.filariasisForm.controls['dateVisit2'].setValue(this.datePipe.transform(this.filariasisForm.value.dateVisit2, 'yyyy-MM-dd'));
        this.filariasisForm.controls['dateEntry2'].setValue(this.datePipe.transform(this.filariasisForm.value.dateEntry2, 'yyyy-MM-dd'));
        this.filariasisForm.controls['dateVisit3'].setValue(this.datePipe.transform(this.filariasisForm.value.dateVisit3, 'yyyy-MM-dd'));
        this.filariasisForm.controls['dateEntry3'].setValue(this.datePipe.transform(this.filariasisForm.value.dateEntry3, 'yyyy-MM-dd'));
        this.filariasisForm.controls['dateVisit4'].setValue(this.datePipe.transform(this.filariasisForm.value.dateVisit4, 'yyyy-MM-dd'));
        this.filariasisForm.controls['dateEntry4'].setValue(this.datePipe.transform(this.filariasisForm.value.dateEntry4, 'yyyy-MM-dd'));
        this.filariasisForm.controls['dateVisit5'].setValue(this.datePipe.transform(this.filariasisForm.value.dateVisit5, 'yyyy-MM-dd'));
        this.filariasisForm.controls['dateEntry5'].setValue(this.datePipe.transform(this.filariasisForm.value.dateEntry5, 'yyyy-MM-dd'));
        this.filariasisForm.controls['exitDate1'].setValue(this.datePipe.transform(this.filariasisForm.value.exitDate1, 'yyyy-MM-dd'));
        this.filariasisForm.controls['exitDate2'].setValue(this.datePipe.transform(this.filariasisForm.value.exitDate2, 'yyyy-MM-dd'));
        this.filariasisForm.controls['exitDate3'].setValue(this.datePipe.transform(this.filariasisForm.value.exitDate3, 'yyyy-MM-dd'));
        this.filariasisForm.controls['exitDate4'].setValue(this.datePipe.transform(this.filariasisForm.value.exitDate4, 'yyyy-MM-dd'));
        this.filariasisForm.controls['exitDate5'].setValue(this.datePipe.transform(this.filariasisForm.value.exitDate5, 'yyyy-MM-dd'));

        //HistoryTravel
        this.filariasisForm.controls['historyTravel'].setValue(this.datePipe.transform(this.filariasisForm.value.historyTravel, 'yyyy-MM-dd'));
        //DateEntryEgypt
        this.filariasisForm.controls['dateEntryEgypt'].setValue(this.datePipe.transform(this.filariasisForm.value.dateEntryEgypt, 'yyyy-MM-dd'));
        //history
        this.filariasisForm.controls['history'].setValue(this.datePipe.transform(this.filariasisForm.value.history, 'yyyy-MM-dd'));

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
    Object.entries(this.filariasisForm.controls).map(([key, value], index) => {
      if (value.value == 'null')
        value.setValue(null);
    })
    this.filariasisForm.controls['diseaseGroupId'].setValue(this.investigationService.diseaseGroupID);
    this.calculateCompletionPercentage();
    this.filariasisForm.controls['investigationCompletePercentage'].setValue(parseFloat(((this.allFilledControlsCount / this.allControllesCount) * 100).toFixed(2)));
    if (this.filariasisForm.value.id != null) {
      this.investigationService.updateSeverefilarisis(this.filariasisForm.value).subscribe(
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
      this.investigationService.addInvestigationfilarisis(this.filariasisForm.value).subscribe(
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
    const data = this.filariasisForm.value;
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
