import { Component, OnInit } from '@angular/core';
import { FormArray, FormControl, FormGroup } from '@angular/forms';
import { InvestigationService } from '../../services/investigation.service';
import { UserMessageService } from 'src/app/core/services/user.message.service';
import { TranslateService } from '@ngx-translate/core';
import { DatePipe } from '@angular/common';
@Component({
  selector: 'app-diphtheria',
  templateUrl: './diphtheria.component.html',
  styleUrls: ['./diphtheria.component.css'],
})
export class DiphtheriaComponent implements OnInit {
  currentLang =
    localStorage.getItem('ls.currentLang') !== undefined &&
    localStorage.getItem('ls.currentLang') !== 'undefined'
      ? localStorage.getItem('ls.currentLang')
      : 'ar';
  diphtriaForm: FormGroup;
  currentId: any;
  fev: any;
  controlsCount: number = 0;
  allFilledControlsCount: number = 0;
  allControllesCount: number = 0;
  patientName: string;
  diseaseGroupID: any;
  constructor(
    private investigationService: InvestigationService,
    private translateService: TranslateService,
    private userMsg: UserMessageService,
    private datePipe: DatePipe
  ) {
    if (
      this.investigationService.patient.firstName != null &&
      this.investigationService.patient.firstName != undefined
    ) {
      this.patientName =
        this.investigationService.patient.firstName +
        ' ' +
        this.investigationService.patient.secondName +
        ' ' +
        this.investigationService.patient.thirdName;
    }
    if (this.currentId == null) {
      this.currentId = this.investigationService.currentid;
    }
    if (this.diseaseGroupID == null || this.diseaseGroupID == undefined) {
      this.diseaseGroupID = this.investigationService.diseaseGroupID;
    }
  }

  ngOnInit() {
    this.diphtriaForm = new FormGroup({
      // fever: new FormControl('1'),
      fever: new FormControl(),
      //completePercentage: new FormControl(),
      investigationCompletePercentage: new FormControl(),
      feverDays: new FormControl(),
      maxTemperature: new FormControl(),
      grayMembrane: new FormControl(),
      tonsillitis: new FormControl(),
      pharyngitis: new FormControl(),
      laryngitis: new FormControl(),
      kinUlcers: new FormControl(),
      hoarseness: new FormControl(),
      stuffyThroatChoking: new FormControl(),
      endomembranousRhinitis: new FormControl(),
      septicemia: new FormControl(),
      statusCode: new FormControl(),
      contactSuspectedCase: new FormControl(),
      contactConfirmedCase: new FormControl(),
      numberDirectContacts: new FormControl(),
      numberIndirectContacts: new FormControl(),
      contactUnknownDisease: new FormControl(),
      casePartEpidemic: new FormControl(),

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
      otherDose: new FormControl(),
      otherDoseDate: new FormControl(),
      firstBoosterDose: new FormControl(),
      firstBoosterDoseDate: new FormControl(),
      secondBoosterDose: new FormControl(),
      secondBoosterDoseDate: new FormControl(),
      otherBoosterDose: new FormControl(),
      otherBoosterDoseDate: new FormControl(),
      diseaseGroupId: new FormControl(this.diseaseGroupID),
      id: new FormControl(),
      patientID: new FormControl(),
    });
    this.currentId = this.investigationService.currentid;
    this.diphtriaForm.controls['patientID'].setValue(this.currentId);
    this.diphtriaForm.controls['patientID'].setValue(this.currentId);
    this.GetById();
  }
  GetById() {
    this.investigationService.getByIdDiphtheria(this.currentId).subscribe(
      (res) => {
        console.log(res);
        var v = res.data;

        // if (v.followD1SampleTaken == null) {
        //   v.followD1SampleTaken = 3;
        // }
        // if (v.followD2SampleTaken == null) {
        //   v.followD2SampleTaken = 3;
        // }
        // if (v.followD7SampleTaken == null) {
        //   v.followD7SampleTaken = 3;
        // }
        // if (v.followD14SampleTaken == null) {
        //   v.followD14SampleTaken = 3;
        // }
        // //followD1SampleResult
        // if (v.followD1SampleResult == null) {
        //   v.followD1SampleResult = 3;
        // }
        // if (v.followD2SampleResult == null) {
        //   v.followD2SampleResult = 3;
        // }
        // if (v.followD7SampleResult == null) {
        //   v.followD7SampleResult = 3;
        // }
        // if (v.followD14SampleResult == null) {
        //   v.followD14SampleResult = 3;
        // }

        this.diphtriaForm.patchValue(v);
        console.log(v);
        this.fev = this.diphtriaForm.controls['fever'].setValue(
          res.data.fever.toString()
        );
        // this.diphtriaForm.patchValue({

        // //fever: this.diphtriaForm.value.fever+'',

        //   tc: true,
        // });

        //followD1DateOfSymptoms
        this.diphtriaForm.controls['followD1DateOfSymptoms'].setValue(
          this.datePipe.transform(
            this.diphtriaForm.value.followD1DateOfSymptoms,
            'yyyy-MM-dd'
          )
        );
        this.diphtriaForm.patchValue({
          followD1SampleTaken: this.diphtriaForm.value.followD1SampleTaken + '',
          tc: true,
        });
        this.diphtriaForm.controls['followD1DateSampleTaken'].setValue(
          this.datePipe.transform(
            this.diphtriaForm.value.followD1DateSampleTaken,
            'yyyy-MM-dd'
          )
        );
        this.diphtriaForm.patchValue({
          followD1SampleResult:
            this.diphtriaForm.value.followD1SampleResult + '',
          tc: true,
        });
        //
        this.diphtriaForm.controls['followD2DateOfSymptoms'].setValue(
          this.datePipe.transform(
            this.diphtriaForm.value.followD2DateOfSymptoms,
            'yyyy-MM-dd'
          )
        );
        this.diphtriaForm.patchValue({
          followD2SampleTaken: this.diphtriaForm.value.followD2SampleTaken + '',
          tc: true,
        });
        this.diphtriaForm.controls['followD2DateSampleTaken'].setValue(
          this.datePipe.transform(
            this.diphtriaForm.value.followD2DateSampleTaken,
            'yyyy-MM-dd'
          )
        );
        this.diphtriaForm.patchValue({
          followD2SampleResult:
            this.diphtriaForm.value.followD2SampleResult + '',
          tc: true,
        });

        //
        this.diphtriaForm.controls['followD7DateOfSymptoms'].setValue(
          this.datePipe.transform(
            this.diphtriaForm.value.followD7DateOfSymptoms,
            'yyyy-MM-dd'
          )
        );
        this.diphtriaForm.patchValue({
          followD7SampleTaken: this.diphtriaForm.value.followD7SampleTaken + '',
          tc: true,
        });
        this.diphtriaForm.controls['followD7DateSampleTaken'].setValue(
          this.datePipe.transform(
            this.diphtriaForm.value.followD7DateSampleTaken,
            'yyyy-MM-dd'
          )
        );
        this.diphtriaForm.patchValue({
          followD7SampleResult:
            this.diphtriaForm.value.followD7SampleResult + '',
          tc: true,
        });
        //
        this.diphtriaForm.controls['followD14DateOfSymptoms'].setValue(
          this.datePipe.transform(
            this.diphtriaForm.value.followD14DateOfSymptoms,
            'yyyy-MM-dd'
          )
        );
        this.diphtriaForm.patchValue({
          followD14SampleTaken:
            this.diphtriaForm.value.followD14SampleTaken + '',
          tc: true,
        });
        this.diphtriaForm.controls['followD14DateSampleTaken'].setValue(
          this.datePipe.transform(
            this.diphtriaForm.value.followD14DateSampleTaken,
            'yyyy-MM-dd'
          )
        );
        this.diphtriaForm.patchValue({
          followD14SampleResult:
            this.diphtriaForm.value.followD14SampleResult + '',
          tc: true,
        });
        //firstDoseDate
        this.diphtriaForm.controls['firstDoseDate'].setValue(
          this.datePipe.transform(
            this.diphtriaForm.value.firstDoseDate,
            'yyyy-MM-dd'
          )
        );
        //secondDoseDate
        this.diphtriaForm.controls['secondDoseDate'].setValue(
          this.datePipe.transform(
            this.diphtriaForm.value.secondDoseDate,
            'yyyy-MM-dd'
          )
        );
        //secondDoseDate
        this.diphtriaForm.controls['otherDoseDate'].setValue(
          this.datePipe.transform(
            this.diphtriaForm.value.otherDoseDate,
            'yyyy-MM-dd'
          )
        );
        this.diphtriaForm.controls['firstBoosterDoseDate'].setValue(
          this.datePipe.transform(
            this.diphtriaForm.value.firstBoosterDoseDate,
            'yyyy-MM-dd'
          )
        );
        this.diphtriaForm.controls['secondBoosterDoseDate'].setValue(
          this.datePipe.transform(
            this.diphtriaForm.value.secondBoosterDoseDate,
            'yyyy-MM-dd'
          )
        );
        this.diphtriaForm.controls['otherBoosterDoseDate'].setValue(
          this.datePipe.transform(
            this.diphtriaForm.value.otherBoosterDoseDate,
            'yyyy-MM-dd'
          )
        );
        //this.controlsCount = this.calculateCompletePercentage();
        //this.diphtriaForm.value.completePercentage = this.controlsCount;

        Object.entries(this.diphtriaForm.controls).map(
          ([key, value], index) => {
            if (value.value == 'null') value.setValue(null);
          }
        );

        //this.controlsCount = this.calculateCompletePercentage();
        //this.diphtriaForm.value.completePercentage = this.controlsCount;
        this.fev = this.diphtriaForm.controls['fever'].setValue(
          res.data.fever.toString()
        );
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
  // /**
  //  * Calculate the percentage
  //  * @returns
  //  */
  // calculateCompletePercentage(): number {
  //   Object.entries(this.diphtriaForm.controls).map(([key, value], index) => {
  //     if (value.value == 'null') value.setValue(null);
  //     else if (value.value != null && !isNaN(+value.value)) {
  //       value.setValue(parseInt(value.value.toString()));
  //     }
  //   });

  //   // this.allControllesCount = this.countAllControls(this.diphtriaForm);
  //   // if (this.diphtriaForm.value.id != null) {
  //   //   this.allFilledControlsCount = this.countFilledControls(this.diphtriaForm);
  //   // } else {
  //   //   this.allFilledControlsCount = 0;
  //   // }
  //   // this.controlsCount =
  //   //   this.allControllesCount != 0
  //   //     ? parseInt(
  //   //         (
  //   //           (this.allFilledControlsCount / this.allControllesCount) *
  //   //           100
  //   //         ).toString()
  //   //       )
  //   //     : 0;
  //   this.fev = this.diphtriaForm.controls['fever'].setValue(
  //     this.diphtriaForm.value.fever.toString()
  //   );
  //   return this.controlsCount;
  // }
  // /**
  //  * Count all fields
  //  * @param control
  //  * @returns
  //  */
  // countFilledControls(control: any): number {
  //   if (control instanceof FormControl) {
  //     if (control.value != null) return 1;
  //     else return 0;
  //   }

  //   if (control instanceof FormArray) {
  //     return control.controls.reduce(
  //       (acc, curr) => acc + this.countFilledControls(curr),
  //       1
  //     );
  //   }

  //   if (control instanceof FormGroup) {
  //     return Object.keys(control.controls)
  //       .map((key) => control.controls[key])
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
  //     return control.controls.reduce(
  //       (acc, curr) => acc + this.countAllControls(curr),
  //       1
  //     );
  //   }

  //   if (control instanceof FormGroup) {
  //     return Object.keys(control.controls)
  //       .map((key) => control.controls[key])
  //       .reduce((acc, curr) => acc + this.countAllControls(curr), 1);
  //   }
  //   return 0;
  // }
  save() {
    //this.controlsCount = this.calculateCompletePercentage();

    Object.entries(this.diphtriaForm.controls).map(([key, value], index) => {
      if (value.value == 'null') value.setValue(null);
    });

    //this.diphtriaForm.controls['completePercentage'].enable();
    this.diphtriaForm.controls['diseaseGroupId'].setValue(this.diseaseGroupID);
    this.calculateCompletionPercentage();
    this.diphtriaForm.controls['investigationCompletePercentage'].setValue(parseFloat(((this.allFilledControlsCount / this.allControllesCount) * 100).toFixed(2)));
    if (this.diphtriaForm.value.id != null) {
      this.investigationService
        .updateDiphtheria(this.diphtriaForm.value)
        .subscribe(
          (response: any) => {
            if (response) {
              //this.diphtriaForm.controls['completePercentage'].disable();
              document
                .getElementById('jump_to_this_location')
                .scrollIntoView({ behavior: 'smooth' });

              //this.controlsCount = this.calculateCompletePercentage();
              //this.diphtriaForm.value.completePercentage = this.controlsCount;
              //this.diphtriaForm.controls['fever'].setValue(response.data.fever.toString())
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
        .addInvestigationDiphtheria(this.diphtriaForm.value)
        .subscribe(
          (response: any) => {
            if (response) {
              //this.diphtriaForm.controls['completePercentage'].disable();
              document.getElementById('jump_to_this_location').scrollIntoView({ behavior: 'smooth' });
              this.diphtriaForm.value.id = response.data.id;
              this.currentId = response.data.patientID;
              this.GetById();
              //this.controlsCount = this.calculateCompletePercentage();
              // this.diphtriaForm.value.completePercentage = this.controlsCount;
              this.translateService
                .get('NEDSS.COMMON.SENT_SUCESSFULLY')
                .subscribe((res: string) => {
                  this.userMsg.success(res);
                });
              this.fev = this.diphtriaForm.controls['fever'].setValue(
                response.data.fever.toString()
              );
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
        const data = this.diphtriaForm.value;
        
        //Exclude fields you don't want to count (like 'id')
        const excludedFields = ['id','patientID','investigationCompletePercentage' , 'diseaseGroupId' , 'createdDate'];
        const totalFields = Object.keys(data).filter(key => !excludedFields.includes(key)).length;
        
        this.allControllesCount = totalFields;
    
        Object.keys(data).forEach((key) => {
            if (!excludedFields.includes(key) && data[key] !== null && data[key] !== '') {
                this.allFilledControlsCount++;
            }
        });
      }
}
