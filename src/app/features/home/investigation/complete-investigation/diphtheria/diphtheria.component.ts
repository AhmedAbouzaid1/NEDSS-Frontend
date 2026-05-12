import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { InvestigationService } from '../../services/investigation.service';
import { UserMessageService } from 'src/app/core/services/user.message.service';
import { TranslateService } from '@ngx-translate/core';
import { DatePipe } from '@angular/common';
import { calculateCompletionStats } from '../shared/investigation-summary.utils';
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
      investigationCompletePercentage: new FormControl(),
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
    this.diphtriaForm.valueChanges.subscribe(() => this.calculateCompletionPercentage());
    this.GetById();
  }
  GetById() {
    this.investigationService.getByIdDiphtheria(this.currentId).subscribe(
      (res) => {
        console.log(res);
        var v = res.data;

        if (!v) {
          this.calculateCompletionPercentage();
          return;
        }

        this.diphtriaForm.patchValue(v);
        console.log(v);
        this.diphtriaForm.controls['followD1DateOfSymptoms'].setValue(
          this.datePipe.transform(
            this.diphtriaForm.value.followD1DateOfSymptoms,
            'yyyy-MM-dd'
          )
        );
        this.diphtriaForm.controls['followD1SampleTaken'].setValue(this.toStringOrNull(this.diphtriaForm.value.followD1SampleTaken));
        this.diphtriaForm.controls['followD1DateSampleTaken'].setValue(
          this.datePipe.transform(
            this.diphtriaForm.value.followD1DateSampleTaken,
            'yyyy-MM-dd'
          )
        );
        this.diphtriaForm.controls['followD1SampleResult'].setValue(this.toStringOrNull(this.diphtriaForm.value.followD1SampleResult));
        this.diphtriaForm.controls['followD2DateOfSymptoms'].setValue(
          this.datePipe.transform(
            this.diphtriaForm.value.followD2DateOfSymptoms,
            'yyyy-MM-dd'
          )
        );
        this.diphtriaForm.controls['followD2SampleTaken'].setValue(this.toStringOrNull(this.diphtriaForm.value.followD2SampleTaken));
        this.diphtriaForm.controls['followD2DateSampleTaken'].setValue(
          this.datePipe.transform(
            this.diphtriaForm.value.followD2DateSampleTaken,
            'yyyy-MM-dd'
          )
        );
        this.diphtriaForm.controls['followD2SampleResult'].setValue(this.toStringOrNull(this.diphtriaForm.value.followD2SampleResult));

        this.diphtriaForm.controls['followD7DateOfSymptoms'].setValue(
          this.datePipe.transform(
            this.diphtriaForm.value.followD7DateOfSymptoms,
            'yyyy-MM-dd'
          )
        );
        this.diphtriaForm.controls['followD7SampleTaken'].setValue(this.toStringOrNull(this.diphtriaForm.value.followD7SampleTaken));
        this.diphtriaForm.controls['followD7DateSampleTaken'].setValue(
          this.datePipe.transform(
            this.diphtriaForm.value.followD7DateSampleTaken,
            'yyyy-MM-dd'
          )
        );
        this.diphtriaForm.controls['followD7SampleResult'].setValue(this.toStringOrNull(this.diphtriaForm.value.followD7SampleResult));
        this.diphtriaForm.controls['followD14DateOfSymptoms'].setValue(
          this.datePipe.transform(
            this.diphtriaForm.value.followD14DateOfSymptoms,
            'yyyy-MM-dd'
          )
        );
        this.diphtriaForm.controls['followD14SampleTaken'].setValue(this.toStringOrNull(this.diphtriaForm.value.followD14SampleTaken));
        this.diphtriaForm.controls['followD14DateSampleTaken'].setValue(
          this.datePipe.transform(
            this.diphtriaForm.value.followD14DateSampleTaken,
            'yyyy-MM-dd'
          )
        );
        this.diphtriaForm.controls['followD14SampleResult'].setValue(this.toStringOrNull(this.diphtriaForm.value.followD14SampleResult));
        this.diphtriaForm.controls['firstDoseDate'].setValue(
          this.datePipe.transform(
            this.diphtriaForm.value.firstDoseDate,
            'yyyy-MM-dd'
          )
        );
        this.diphtriaForm.controls['secondDoseDate'].setValue(
          this.datePipe.transform(
            this.diphtriaForm.value.secondDoseDate,
            'yyyy-MM-dd'
          )
        );
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

        Object.entries(this.diphtriaForm.controls).map(
          ([key, value]) => {
            if (value.value == 'null') value.setValue(null);
          }
        );

        this.calculateCompletionPercentage();
      },
      (error) => {
        if (error?.status === 404) {
          this.calculateCompletionPercentage();
          return;
        }

        this.translateService
          .get('NEDSS.COMMON.SENT_FAILD')
          .subscribe((res: string) => {
            this.userMsg.error(res);
          });
      }
    );
  }
  save() {
    Object.entries(this.diphtriaForm.controls).map(([key, value]) => {
      if (value.value == 'null') value.setValue(null);
    });

    this.diphtriaForm.controls['diseaseGroupId'].setValue(this.diseaseGroupID);
    this.calculateCompletionPercentage();
    this.diphtriaForm.controls['investigationCompletePercentage'].setValue(
      this.allControllesCount === 0
        ? 0
        : parseFloat(((this.allFilledControlsCount / this.allControllesCount) * 100).toFixed(2))
    );
    if (this.diphtriaForm.value.id != null) {
      this.investigationService
        .updateDiphtheria(this.diphtriaForm.value)
        .subscribe(
          (response: any) => {
            if (response) {
              document
                .getElementById('jump_to_this_location')
                .scrollIntoView({ behavior: 'smooth' });
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
              document.getElementById('jump_to_this_location').scrollIntoView({ behavior: 'smooth' });
              this.diphtriaForm.value.id = response.data.id;
              this.currentId = response.data.patientID;
              this.GetById();
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

  private toStringOrNull(value: any): string | null {
    return value == null ? null : value + '';
  }

  calculateCompletionPercentage() {
    const stats = calculateCompletionStats(this.diphtriaForm.value, {
      excludedFields: ['id', 'patientID', 'investigationCompletePercentage', 'diseaseGroupId', 'createdDate']
    });

    this.allControllesCount = stats.totalFields;
    this.allFilledControlsCount = stats.filledFields;
  }
}
