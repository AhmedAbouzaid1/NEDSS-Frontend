import { virtualExamination } from './../../../../../core/constants';
import { calculateCompletionStats } from '../shared/investigation-summary.utils';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { UserMessageService } from 'src/app/core/services/user.message.service';
import { InvestigationService } from '../../services/investigation.service';
import { TranslateService } from '@ngx-translate/core';
import { DatePipe } from '@angular/common';
@Component({
  selector: 'app-leishmania',
  host: { class: 'investigation-form' },
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
  readonly treatmentTypes = ['موضعي', 'كي بالتبريد', 'كي حراري', 'مضاد فطريات'];
  private readonly legacyRiskFactorFields = [
    'chronicChestDiseases',
    'chronicHeartDisease',
    'highBloodPressure',
    'excessiveObesity',
    'immuneDisease',
    'aids',
    'pregnantWomen',
    'diabetes',
    'liverDiseases',
    'kidneyDisease',
    'diseasesNervousMuscular',
    'bloodBiseases',
    'other',
  ];
  allFilledControlsCount: number = 0;
  allControllesCount: number = 0;
  patientName: string;

  get treatmentTypeOptions(): string[] {
    const current = this.leishmaniaForm?.get('typeTreatment')?.value;
    return current && !this.treatmentTypes.includes(current) ? [...this.treatmentTypes, current] : this.treatmentTypes;
  }

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
      numberUlcers: new FormControl(),
      ulcerType: new FormControl(),
      ulcerPlace: new FormControl(),
      ulcerStage: new FormControl(),
      leishmaniaTreatmentProtocolImplemented: new FormControl(),
      treatmentStartDate: new FormControl(),
      typeTreatment: new FormControl(),
      numberSessions: new FormControl(),
      dose: new FormControl(),
      conditionAssessment: new FormControl(),
      result: new FormControl(),

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
      numberNonDirectContacts: new FormControl(),
      numberDirectContacts: new FormControl(),

      diseaseGroupId: new FormControl(this.investigationService.diseaseGroupID),
      investigationCompletePercentage: new FormControl(),
    });

    this.currentId = this.investigationService.currentid
    this.leishmaniaForm.controls['patientID'].setValue(this.currentId)
    this.leishmaniaForm.controls['leishmaniaTreatmentProtocolImplemented'].valueChanges.subscribe(() => {
      this.calculateCompletionPercentage();
    });
    this.investigationService.getByIdleishmania(this.currentId, this.investigationService.diseaseGroupID).subscribe(
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

        //treatmentStartDate
        this.leishmaniaForm.controls['treatmentStartDate'].setValue(
          this.datePipe.transform(this.leishmaniaForm.value.treatmentStartDate, 'yyyy-MM-dd')
        );

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
        }
      )
    }
  }

  calculateCompletionPercentage() {
    const excludedFields = ['id', 'patientID', 'investigationCompletePercentage', 'diseaseGroupId', 'createdDate', ...this.legacyRiskFactorFields];

    // If treatment protocol is not "Yes", exclude the hidden treatment fields.
    if (!this.isYes('leishmaniaTreatmentProtocolImplemented')) {
      excludedFields.push('treatmentStartDate', 'typeTreatment', 'numberSessions', 'dose');
    }

    const stats = calculateCompletionStats(this.leishmaniaForm.value, {
      excludedFields,
    });

    this.allControllesCount = stats.totalFields;
    this.allFilledControlsCount = stats.filledFields;
  }

  isYes(controlName: string): boolean {
    return this.leishmaniaForm?.get(controlName)?.value == 1;
  }
}
