import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { UserMessageService } from 'src/app/core/services/user.message.service';
import { InvestigationService } from '../../services/investigation.service';
import { TranslateService } from '@ngx-translate/core';
import { DatePipe } from '@angular/common';
@Component({
  selector: 'app-whooping-cough',
  templateUrl: './whooping-cough.component.html',
  styleUrls: ['./whooping-cough.component.css'],
})
export class WhoopingCoughComponent implements OnInit {
  whoopingForm: FormGroup;
  currentLang =
    localStorage.getItem('ls.currentLang') !== undefined &&
      localStorage.getItem('ls.currentLang') !== 'undefined'
      ? localStorage.getItem('ls.currentLang')
      : 'ar';

  allFilledControlsCount: number = 0;
  allControllesCount: number = 0;
  patientName: string;
  diseaseGroupId: number;
  constructor(
    private investigationService: InvestigationService,
    private translateService: TranslateService,
    private userMsg: UserMessageService,
    private datePipe: DatePipe) {
    if (this.investigationService.patient.firstName != null && this.investigationService.patient.firstName != undefined) {
      this.patientName = this.investigationService.patient.firstName + " " + this.investigationService.patient.secondName + " " + this.investigationService.patient.thirdName;
    }
  }
  currentId: any;
  ngOnInit() {
    this.whoopingForm = new FormGroup({
      fever: new FormControl(),
      feverDays: new FormControl(),
      maxTemperature: new FormControl(),
      investigationCompletePercentage: new FormControl(),
      // conjunctivalCongestion: new FormControl('5'),
      // shock: new FormControl('5'),
      // enlargedNodes: new FormControl('5'),
      // lossConsciousness: new FormControl('5'),
      // skinRash: new FormControl('5'),
      // pressureDrop: new FormControl('5'),
      // blurredVision: new FormControl('5'),
      // itching: new FormControl('5'),
      // other: new FormControl('5'),
      otherSymptoms: new FormControl(),
      conjunctivalCongestion: new FormControl(),
      shock: new FormControl(),
      enlargedNodes: new FormControl(),
      lossConsciousness: new FormControl(),
      skinRash: new FormControl(),
      pressureDrop: new FormControl(),
      blurredVision: new FormControl(),
      itching: new FormControl(),
      other: new FormControl(),
      //pertussis: new FormControl('5'),
      pertussis: new FormControl(),
      //stopBreathing: new FormControl('5'),
      stopBreathing: new FormControl(),
      dateInception: new FormControl(),
      duration: new FormControl(),

      followD1Name: new FormControl(),
      followD1Age: new FormControl(),
      followD1Phone: new FormControl(),
      followD1Type: new FormControl(),
      followD1MixingType: new FormControl(),
      followD1RelationshipSituation: new FormControl(),
      followD1DateOfSymptoms: new FormControl(),
      followD1Fever: new FormControl(),
      followD1DryCough: new FormControl(),
      followD1CoughingWithSpitting: new FormControl(),
      followD1SoreThroat: new FormControl(),
      followD1DifficultyBreathing: new FormControl(),
      followD1JointPain: new FormControl(),
      followD1vomit: new FormControl(),
      followD1Diarrhea: new FormControl(),
      followD1Other: new FormControl(),
      followD1OtherSymptoms: new FormControl(),
      followD1SampleTaken: new FormControl(),
      followD1DateSampleTaken: new FormControl(),
      followD1SampleResult: new FormControl(),
      followD2Name: new FormControl(),
      followD2Age: new FormControl(),
      followD2Phone: new FormControl(),
      followD2Type: new FormControl(),
      followD2MixingType: new FormControl(),
      followD2RelationshipSituation: new FormControl(),
      followD2DateOfSymptoms: new FormControl(),
      followD2Fever: new FormControl(),
      followD2DryCough: new FormControl(),
      followD2CoughingWithSpitting: new FormControl(),
      followD2SoreThroat: new FormControl(),
      followD2DifficultyBreathing: new FormControl(),
      followD2JointPain: new FormControl(),
      followD2vomit: new FormControl(),
      followD2Diarrhea: new FormControl(),
      followD2Other: new FormControl(),
      followD2OtherSymptoms: new FormControl(),
      followD2SampleTaken: new FormControl(),
      followD2DateSampleTaken: new FormControl(),
      followD2SampleResult: new FormControl(),
      followD7Name: new FormControl(),
      followD7Age: new FormControl(),
      followD7Phone: new FormControl(),
      followD7Type: new FormControl(),
      followD7MixingType: new FormControl(),
      followD7RelationshipSituation: new FormControl(),
      followD7DateOfSymptoms: new FormControl(),
      followD7Fever: new FormControl(),
      followD7DryCough: new FormControl(),
      followD7CoughingWithSpitting: new FormControl(),
      followD7SoreThroat: new FormControl(),
      followD7DifficultyBreathing: new FormControl(),
      followD7JointPain: new FormControl(),
      followD7vomit: new FormControl(),
      followD7Diarrhea: new FormControl(),
      followD7Other: new FormControl(),
      followD7OtherSymptoms: new FormControl(),
      followD7SampleTaken: new FormControl(),
      followD7DateSampleTaken: new FormControl(),
      followD7SampleResult: new FormControl(),
      followD14Name: new FormControl(),
      followD14Age: new FormControl(),
      followD14Phone: new FormControl(),
      followD14Type: new FormControl(),
      followD14MixingType: new FormControl(),
      followD14RelationshipSituation: new FormControl(),
      followD14DateOfSymptoms: new FormControl(),
      followD14Fever: new FormControl(),
      followD14DryCough: new FormControl(),
      followD14CoughingWithSpitting: new FormControl(),
      followD14SoreThroat: new FormControl(),
      followD14DifficultyBreathing: new FormControl(),
      followD14JointPain: new FormControl(),
      followD14vomit: new FormControl(),
      followD14Diarrhea: new FormControl(),
      followD14Other: new FormControl(),
      followD14OtherSymptoms: new FormControl(),
      followD14SampleTaken: new FormControl(),
      followD14DateSampleTaken: new FormControl(),
      followD14SampleResult: new FormControl(),
      firstDose: new FormControl(),
      firstDoseDate: new FormControl(),
      secondDose: new FormControl(),
      secondDoseDate: new FormControl(),
      thirdDose: new FormControl(),
      thirdDoseDate: new FormControl(),
      boosterDose: new FormControl(),
      boosterDoseDate: new FormControl(),
      patientID: new FormControl(),
      //incidentGovernmentName: new FormControl(),
      id: new FormControl(),
    });
    this.currentId = this.investigationService.currentid;
    this.whoopingForm.controls['patientID'].setValue(this.currentId);
    // if (this.diseaseGroupId == null || this.diseaseGroupId == undefined) {
    //   this.diseaseGroupId = this.investigationService.diseaseGroupID;
    // }
    this.investigationService.getByIdWhoopingCough(this.currentId).subscribe(
      (res) => {
        console.log(res);

        var v = res.data;
        // if (v.followD1SampleTaken == null) { v.followD1SampleTaken = 5; }
        // if (v.followD2SampleTaken == null) { v.followD2SampleTaken = 5; }
        // if (v.followD7SampleTaken == null) { v.followD7SampleTaken = 5; }
        // if (v.followD14SampleTaken == null) { v.followD14SampleTaken = 5; }
        // //followD1SampleResult
        // if (v.followD1SampleResult == null) { v.followD1SampleResult = 5; }
        // if (v.followD2SampleResult == null) { v.followD2SampleResult = 5; }
        // if (v.followD7SampleResult == null) { v.followD7SampleResult = 5; }
        // if (v.followD14SampleResult == null) { v.followD14SampleResult = 5; }
        this.whoopingForm.patchValue(v);
        this.whoopingForm.patchValue({
          fever: this.whoopingForm.value.fever + '', tc: true,
        });
        //
        this.whoopingForm.patchValue({
          conjunctivalCongestion:
            this.whoopingForm.value.conjunctivalCongestion + '', tc: true,
        });
        this.whoopingForm.patchValue({
          enlargedNodes: this.whoopingForm.value.enlargedNodes + '', tc: true,
        });
        this.whoopingForm.patchValue({
          skinRash: this.whoopingForm.value.skinRash + '',
          tc: true,
        });
        this.whoopingForm.patchValue({
          blurredVision: this.whoopingForm.value.blurredVision + '',
          tc: true,
        });
        this.whoopingForm.patchValue({
          other: this.whoopingForm.value.other + '',
          tc: true,
        });
        /* this.whoopingForm.patchValue({
          shock: this.whoopingForm.value.shock + '',
          tc: true,
        });*/
        this.whoopingForm.patchValue({
          lossConsciousness: this.whoopingForm.value.lossConsciousness + '',
          tc: true,
        });
        this.whoopingForm.patchValue({
          pressureDrop: this.whoopingForm.value.pressureDrop + '',
          tc: true,
        });
        this.whoopingForm.patchValue({
          itching: this.whoopingForm.value.itching + '',
          tc: true,
        });
        //pertussis
        this.whoopingForm.patchValue({
          pertussis: this.whoopingForm.value.pertussis + '',
          tc: true,
        });
        //stopBreathing
        this.whoopingForm.patchValue({
          stopBreathing: this.whoopingForm.value.stopBreathing + '',
          tc: true,
        });
        //dateInception
        this.whoopingForm.controls['dateInception'].setValue(this.datePipe.transform(this.whoopingForm.value.dateInception, 'yyyy-MM-dd'));

        this.whoopingForm.controls['followD1DateOfSymptoms'].setValue(this.datePipe.transform(this.whoopingForm.value.followD1DateOfSymptoms, 'yyyy-MM-dd'));
        this.whoopingForm.patchValue({ followD1SampleTaken: this.whoopingForm.value.followD1SampleTaken + "", tc: true });
        this.whoopingForm.controls['followD1DateSampleTaken'].setValue(this.datePipe.transform(this.whoopingForm.value.followD1DateSampleTaken, 'yyyy-MM-dd'));
        this.whoopingForm.patchValue({ followD1SampleResult: this.whoopingForm.value.followD1SampleResult + "", tc: true });
        //
        this.whoopingForm.controls['followD2DateOfSymptoms'].setValue(this.datePipe.transform(this.whoopingForm.value.followD2DateOfSymptoms, 'yyyy-MM-dd'));
        this.whoopingForm.patchValue({ followD2SampleTaken: this.whoopingForm.value.followD2SampleTaken + "", tc: true });
        this.whoopingForm.controls['followD2DateSampleTaken'].setValue(this.datePipe.transform(this.whoopingForm.value.followD2DateSampleTaken, 'yyyy-MM-dd'));
        this.whoopingForm.patchValue({ followD2SampleResult: this.whoopingForm.value.followD2SampleResult + "", tc: true });

        //
        this.whoopingForm.controls['followD7DateOfSymptoms'].setValue(this.datePipe.transform(this.whoopingForm.value.followD7DateOfSymptoms, 'yyyy-MM-dd'));
        this.whoopingForm.patchValue({ followD7SampleTaken: this.whoopingForm.value.followD7SampleTaken + "", tc: true });
        this.whoopingForm.controls['followD7DateSampleTaken'].setValue(this.datePipe.transform(this.whoopingForm.value.followD7DateSampleTaken, 'yyyy-MM-dd'));
        this.whoopingForm.patchValue({ followD7SampleResult: this.whoopingForm.value.followD7SampleResult + "", tc: true });
        //
        this.whoopingForm.controls['followD14DateOfSymptoms'].setValue(this.datePipe.transform(this.whoopingForm.value.followD14DateOfSymptoms, 'yyyy-MM-dd'));
        this.whoopingForm.patchValue({ followD14SampleTaken: this.whoopingForm.value.followD14SampleTaken + "", tc: true });
        this.whoopingForm.controls['followD14DateSampleTaken'].setValue(this.datePipe.transform(this.whoopingForm.value.followD14DateSampleTaken, 'yyyy-MM-dd'));
        this.whoopingForm.patchValue({ followD14SampleResult: this.whoopingForm.value.followD14SampleResult + "", tc: true });

        //firstDose
        this.whoopingForm.patchValue({ firstDose: this.whoopingForm.value.firstDose + "", tc: true });
        this.whoopingForm.patchValue({ secondDose: this.whoopingForm.value.secondDose + "", tc: true });
        this.whoopingForm.patchValue({ thirdDose: this.whoopingForm.value.thirdDose + "", tc: true });
        this.whoopingForm.patchValue({ boosterDose: this.whoopingForm.value.boosterDose + "", tc: true });
        //firstDoseDate
        this.whoopingForm.controls['firstDoseDate'].setValue(this.datePipe.transform(this.whoopingForm.value.firstDoseDate, 'yyyy-MM-dd'));

        this.whoopingForm.controls['secondDoseDate'].setValue(this.datePipe.transform(this.whoopingForm.value.secondDoseDate, 'yyyy-MM-dd'));
        this.whoopingForm.controls['thirdDoseDate'].setValue(this.datePipe.transform(this.whoopingForm.value.thirdDoseDate, 'yyyy-MM-dd'));
        this.whoopingForm.controls['boosterDoseDate'].setValue(this.datePipe.transform(this.whoopingForm.value.boosterDoseDate, 'yyyy-MM-dd'));

        this.calculateCompletionPercentage();
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
    Object.entries(this.whoopingForm.controls).map(([key, value], index) => {
      if (value.value == 'null')
        value.setValue(null);
    })
    this.whoopingForm.controls['investigationCompletePercentage'].setValue(parseFloat(((this.allFilledControlsCount / this.allControllesCount) * 100).toFixed(2)));
    //this.whoopingForm.controls['diseaseGroupId'].setValue(this.diseaseGroupId);
    this.calculateCompletionPercentage();
    if (this.whoopingForm.value.id != null) {
      this.investigationService
        .updateWhoopingCough(this.whoopingForm.value)
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
            this.translateService
              .get('NEDSS.COMMON.SENT_FAILD')
              .subscribe((res: string) => {
                this.userMsg.error(res);
              });
          }
        );
    } else {
      this.investigationService
        .addInvestigationWhoopingCough(this.whoopingForm.value)
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
            this.translateService
              .get('NEDSS.COMMON.SENT_FAILD')
              .subscribe((res: string) => {
                this.userMsg.error(res);
              });
          }
        );
    }
  }

  //BL
  calculateCompletionPercentage() {
    this.allFilledControlsCount = 0;
    const data = this.whoopingForm.value;
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
