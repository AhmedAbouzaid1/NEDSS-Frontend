import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, FormArray } from '@angular/forms';
import { AnswerOptions, Gender, contactType } from 'src/app/core/constants';
import { UserMessageService } from 'src/app/core/services/user.message.service';
import { InvestigationService } from '../../services/investigation.service';
import { TranslateService } from '@ngx-translate/core';
import { DatePipe } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { GeneralDataService } from '../../../general-data/services/general-data.service';

@Component({
  selector: 'app-tuberculosis',
  templateUrl: './tuberculosis.component.html',
  styleUrls: ['./tuberculosis.component.css']
})
export class TuberculosisComponent implements OnInit {
  currentLang =
    localStorage.getItem('ls.currentLang') !== undefined &&
      localStorage.getItem('ls.currentLang') !== 'undefined'
      ? localStorage.getItem('ls.currentLang')
      : 'ar';
  tuberculosisForm: FormGroup
  currentId: any;
  controlsCount: number = 0;
  allFilledControlsCount: number = 0;
  allControllesCount: number = 0;
  patientName: string;
  diseaseGroupID: any;
  constructor(private investigationService: InvestigationService, private datePipe: DatePipe, public generalDataService: GeneralDataService,
    private translateService: TranslateService,
    private route: ActivatedRoute, private router: Router,
    private userMsg: UserMessageService) {
    //Useless call 
    //this.currentId = this.route.snapshot.paramMap.get('id');
    if (this.currentId == null) {
      this.currentId = this.investigationService.currentid;
    }
    if (this.diseaseGroupID == null || this.diseaseGroupID == undefined) {
      this.diseaseGroupID = this.investigationService.diseaseGroupID;
    }
    if (this.investigationService.patient.firstName != null && this.investigationService.patient.firstName != undefined) {
      this.patientName = this.investigationService.patient.firstName + " " + this.investigationService.patient.secondName + " " + this.investigationService.patient.thirdName;
    }
    this.tuberculosisForm = new FormGroup({
      //completePercentage: new FormControl(),
      id: new FormControl(),
      investigationCompletePercentage:new FormControl(),
      patientID: new FormControl(),
      fever: new FormControl(),
      feverDurationDay: new FormControl(),
      maxTemperature: new FormControl(),
      dateOnsetSymptoms: new FormControl(),

      diagnosisPneumonia: new FormControl(),
      dateDiagnosisPneumonia: new FormControl(),
      diagnosisWasMade: new FormControl(),
      pneumonia: new FormControl(),
      reservationIntensiveCareUnit: new FormControl(),
      dateReservation: new FormControl(),
      numberdaysCustody: new FormControl(),
      oxygenUse: new FormControl(),
      typeOxygen: new FormControl(),
      useRespirator: new FormControl(),
      typeRespirator: new FormControl(),
      statusHistoryDevice: new FormControl(),
      noDaysPlacementDevice: new FormControl(),
      conditionAssessment: new FormControl(),
      finalResult: new FormControl(),

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


      diagnoseCondition: new FormControl(),
      tuberculosisType: new FormControl(),
      anotherCaseTuberculosis: new FormControl(),
      resultSputumPositive: new FormControl(),
      dateLastPositiveAfb: new FormControl(),
      resultPositiveXpert: new FormControl(),
      dateLastSampleXpert: new FormControl(),
      farmSentPatient: new FormControl(),
      dateLastSamplefarm: new FormControl(),
      treatmentPatientUsing: new FormControl(),
      treatmentStartDate: new FormControl(),
      durationTreatment: new FormControl(),
      followUpPlace: new FormControl(),
      patientSmoke: new FormControl(),
      durationSmoking: new FormControl(),
      smokingType: new FormControl(),
      numberSmokingTimes: new FormControl(),
      patientTestedAids: new FormControl(),
      resultAids: new FormControl(),
      isPatientTuberculosis: new FormControl(),
      vaccinationStatusBcg: new FormControl(),
      tuberculosisInformed: new FormControl(),
      epidemiologicalSurveyContacts: new FormControl(),
      isTuberculosisPatientRecord: new FormControl(),
      resultPatientRecord: new FormControl(),
      surveyDate: new FormControl(),
      nameHealthMonitor: new FormControl(),
      monitoringOfficer: new FormControl(),
      directorAdministration: new FormControl(),
      diseaseGroupId: new FormControl(this.diseaseGroupID),
    });
    //this.tuberculosisForm.controls['completePercentage'].disable();
    //this.controlsCount = this.calculateCompletePercentage();
    this.calculateCompletionPercentage();
  }
  ngOnInit() {
    // this.tuberculosisForm.controls['completePercentage'].setValue(
    //   this.controlsCount
    // );
    if (this.currentId != null) {
      this.tuberculosisForm.controls['patientID'].setValue(this.currentId)
      this.getById();
    } else {
      this.router.navigateByUrl("/home/investigations");
    }
  }
  getById() {
    this.investigationService.getByIdTuberculosis(this.currentId).subscribe(
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
        //
        this.tuberculosisForm.patchValue(v)
        this.tuberculosisForm.patchValue({ fever: this.tuberculosisForm.value.fever + "", tc: true });
        this.tuberculosisForm.controls['dateOnsetSymptoms'].setValue(this.datePipe.transform(this.tuberculosisForm.value.dateOnsetSymptoms, 'yyyy-MM-dd'));
        this.tuberculosisForm.controls['dateDiagnosisPneumonia'].setValue(this.datePipe.transform(this.tuberculosisForm.value.dateDiagnosisPneumonia, 'yyyy-MM-dd'));
        this.tuberculosisForm.controls['dateReservation'].setValue(this.datePipe.transform(this.tuberculosisForm.value.dateReservation, 'yyyy-MM-dd'));
        this.tuberculosisForm.controls['statusHistoryDevice'].setValue(this.datePipe.transform(this.tuberculosisForm.value.statusHistoryDevice, 'yyyy-MM-dd'));
        this.tuberculosisForm.controls['dateOnsetSymptomsDay1'].setValue(this.datePipe.transform(this.tuberculosisForm.value.dateOnsetSymptomsDay1, 'yyyy-MM-dd'));
        this.tuberculosisForm.controls['dateOnsetSymptomsDay2'].setValue(this.datePipe.transform(this.tuberculosisForm.value.dateOnsetSymptomsDay2, 'yyyy-MM-dd'));
        this.tuberculosisForm.controls['dateOnsetSymptomsDay7'].setValue(this.datePipe.transform(this.tuberculosisForm.value.dateOnsetSymptomsDay7, 'yyyy-MM-dd'));
        this.tuberculosisForm.controls['dateOnsetSymptomsDay14'].setValue(this.datePipe.transform(this.tuberculosisForm.value.dateOnsetSymptomsDay14, 'yyyy-MM-dd'));
        this.tuberculosisForm.controls['dateSampleTakenDay1'].setValue(this.datePipe.transform(this.tuberculosisForm.value.dateSampleTakenDay1, 'yyyy-MM-dd'));
        this.tuberculosisForm.controls['dateSampleTakenDay2'].setValue(this.datePipe.transform(this.tuberculosisForm.value.dateSampleTakenDay2, 'yyyy-MM-dd'));
        this.tuberculosisForm.controls['dateSampleTakenDay7'].setValue(this.datePipe.transform(this.tuberculosisForm.value.dateSampleTakenDay7, 'yyyy-MM-dd'));
        this.tuberculosisForm.controls['dateSampleTakenDay14'].setValue(this.datePipe.transform(this.tuberculosisForm.value.dateSampleTakenDay14, 'yyyy-MM-dd'));
        this.tuberculosisForm.controls['dateLastPositiveAfb'].setValue(this.datePipe.transform(this.tuberculosisForm.value.dateLastPositiveAfb, 'yyyy-MM-dd'));
        this.tuberculosisForm.controls['dateLastSampleXpert'].setValue(this.datePipe.transform(this.tuberculosisForm.value.dateLastSampleXpert, 'yyyy-MM-dd'));
        this.tuberculosisForm.controls['dateLastSamplefarm'].setValue(this.datePipe.transform(this.tuberculosisForm.value.dateLastSamplefarm, 'yyyy-MM-dd'));
        this.tuberculosisForm.controls['treatmentStartDate'].setValue(this.datePipe.transform(this.tuberculosisForm.value.treatmentStartDate, 'yyyy-MM-dd'));
        this.tuberculosisForm.controls['surveyDate'].setValue(this.datePipe.transform(this.tuberculosisForm.value.surveyDate, 'yyyy-MM-dd'));
        this.tuberculosisForm.patchValue({ isSampleTakenDay1: this.tuberculosisForm.value.isSampleTakenDay1 + "", tc: true });
        this.tuberculosisForm.patchValue({ isSampleTakenDay2: this.tuberculosisForm.value.isSampleTakenDay2 + "", tc: true });
        this.tuberculosisForm.patchValue({ isSampleTakenDay7: this.tuberculosisForm.value.isSampleTakenDay7 + "", tc: true });
        this.tuberculosisForm.patchValue({ isSampleTakenDay14: this.tuberculosisForm.value.isSampleTakenDay14 + "", tc: true });
        this.tuberculosisForm.patchValue({ sampleResultDay1: this.tuberculosisForm.value.sampleResultDay1 + "", tc: true });
        this.tuberculosisForm.patchValue({ sampleResultDay2: this.tuberculosisForm.value.sampleResultDay2 + "", tc: true });
        this.tuberculosisForm.patchValue({ sampleResultDay7: this.tuberculosisForm.value.sampleResultDay7 + "", tc: true });
        this.tuberculosisForm.patchValue({ sampleResultDay14: this.tuberculosisForm.value.sampleResultDay14 + "", tc: true });
       // this.controlsCount = this.calculateCompletePercentage();
        //this.tuberculosisForm.value.completePercentage = this.controlsCount;

        Object.entries(this.tuberculosisForm.controls).map(
          ([key, value], index) => {
            if (value.value == 'null')
              value.setValue(null);
          });

        //this.controlsCount = this.calculateCompletionPercentage();
       // this.tuberculosisForm.value.completePercentage = this.controlsCount;
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
  /**
   * Calculate the percentage
   * @returns
   */

  // calculateCompletePercentage(): number {
  //   Object.entries(this.tuberculosisForm.controls).map(([key, value], index) => {
  //     if (value.value == 'null')
  //       value.setValue(null);
  //     else if (value.value != null && !isNaN(+value.value)) {
  //       value.setValue(parseInt(value.value.toString()));
  //     }
  //   });
  //   this.allControllesCount = this.countAllControls(this.tuberculosisForm);
  //   if (this.tuberculosisForm.value.id != null) {
  //     this.allFilledControlsCount = this.countFilledControls(this.tuberculosisForm);
  //   } else {
  //     this.allFilledControlsCount = 0;
  //   }
  //   this.controlsCount = this.allControllesCount != 0 ? parseInt(((this.allFilledControlsCount / this.allControllesCount) * 100).toString()) : 0;

  //   return this.controlsCount;
  // }
  // /**
  //  * Count all fields
  //  * @param control
  //  * @returns
  //  */
  // countFilledControls(control: any): number {
  //   if (control instanceof FormControl) {
  //     if (control.value != null)
  //       return 1;
  //     else return 0;
  //   }

  //   if (control instanceof FormArray) {
  //     return control.controls.reduce((acc, curr) => acc + this.countFilledControls(curr), 1)
  //   }

  //   if (control instanceof FormGroup) {
  //     return Object.keys(control.controls)
  //       .map(key => control.controls[key])
  //       .reduce((acc, curr) => acc + this.countFilledControls(curr), 1);
  //   }
  //   return 0;
  // }
  // /**
  //  * Count all filled fields
  //  * @param control
  //  * @returns
  //  */
  // countAllControls(control: any): number {
  //   if (control instanceof FormControl) {
  //     return 1;
  //   }

  //   if (control instanceof FormArray) {
  //     return control.controls.reduce((acc, curr) => acc + this.countAllControls(curr), 1)
  //   }

  //   if (control instanceof FormGroup) {
  //     return Object.keys(control.controls)
  //       .map(key => control.controls[key])
  //       .reduce((acc, curr) => acc + this.countAllControls(curr), 1);
  //   }
  //   return 0;
  // }
  save() {
    //this.tuberculosisForm.controls['completePercentage'].enable();
    //this.controlsCount = this.calculateCompletePercentage();

    Object.entries(this.tuberculosisForm.controls).map(([key, value], index) => {
      if (value.value == 'null')
        value.setValue(null);
    });
    //this.tuberculosisForm.controls['completePercentage'].setValue(this.controlsCount);
    this.tuberculosisForm.controls['diseaseGroupId'].setValue(this.diseaseGroupID);
    //this.tuberculosisForm.controls['patientID'].setValue(this.currentId);
    this.calculateCompletionPercentage();
    this.tuberculosisForm.controls['investigationCompletePercentage'].setValue(parseFloat(((this.allFilledControlsCount / this.allControllesCount) * 100).toFixed(2)));
    if (this.tuberculosisForm.value.id != null) {
      this.investigationService.updateSevereTuberculosis(this.tuberculosisForm.value).subscribe(
        (response: any) => {
          if (response) {
            //this.tuberculosisForm.controls['completePercentage'].disable();
            document.getElementById("jump_to_this_location").scrollIntoView({ behavior: 'smooth' });;

            //this.controlsCount = this.calculateCompletePercentage();
            this.calculateCompletionPercentage();
            //this.tuberculosisForm.value.completePercentage = this.controlsCount;
            this.getById();

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
      this.investigationService.addInvestigationTuberculosis(this.tuberculosisForm.value).subscribe(
        (response: any) => {
          if (response) {
            //this.tuberculosisForm.controls['completePercentage'].disable();
            document.getElementById("jump_to_this_location").scrollIntoView({ behavior: 'smooth' });

            this.tuberculosisForm.value.id = response.data.id;
            this.currentId = response.data.patientID;
            this.getById();
            this.calculateCompletionPercentage();
            //this.controlsCount = this.calculateCompletePercentage();
            //this.tuberculosisForm.value.completePercentage = this.controlsCount;

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
    const data = this.tuberculosisForm.value;
    //Exclude fields you don't want to count (like 'id')
    const excludedFields = ['id', 'patientID', 'investigationCompletePercentage', 'diseaseGroupId', 'createdDate'];
    const totalFields = Object.keys(data).filter(key => !excludedFields.includes(key)).length;

    this.allControllesCount = totalFields;

    Object.keys(data).forEach((key) => {
      if (!excludedFields.includes(key) && data[key] !== null && data[key] !== '') {
        this.allFilledControlsCount++;
      }
    });
  }

}

