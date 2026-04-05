import { virtualExamination } from './../../../../../core/constants';
import { Component, OnInit } from '@angular/core';
import { FormArray, FormControl, FormGroup } from '@angular/forms';
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

  get patientVisitHistory(): FormArray {
    return this.leishmaniaForm.get('patientVisitHistory') as FormArray;
  }

  createPatientVisitHistoryGroup(data?: any): FormGroup {
    return new FormGroup({
      id: new FormControl(data?.id || null),
      nameHealthFacility: new FormControl(data?.nameHealthFacility || null),
      healthFacilityBelongs: new FormControl(data?.healthFacilityBelongs || null),
      dateVisit: new FormControl(data?.dateVisit || null),
      initialDiagnosis: new FormControl(data?.initialDiagnosis || null),
      admissionHospital: new FormControl(data?.admissionHospital || null),
      dateEntry: new FormControl(data?.dateEntry || null),
      exitDate: new FormControl(data?.exitDate || null)
    });
  }


  addPatientVisit(): void {
    this.patientVisitHistory.push(this.createPatientVisitHistoryGroup());
  }

  removePatientVisit(index: number): void {
    if (this.patientVisitHistory.length > 1) {
      this.patientVisitHistory.removeAt(index);
    }
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
      patientVisitHistory: new FormArray([]),

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

        const apiVisits = v?.PatientVisitHistory ?? v?.patientVisitHistory;
        if (Array.isArray(apiVisits) && apiVisits.length > 0) {
          while (this.patientVisitHistory.length > 0) {
            this.patientVisitHistory.removeAt(0);
          }
          apiVisits.forEach((item) => {
            this.patientVisitHistory.push(this.createPatientVisitHistoryGroup({
              ...item,
              dateVisit: this.datePipe.transform(item?.dateVisit, 'yyyy-MM-dd'),
              dateEntry: this.datePipe.transform(item?.dateEntry, 'yyyy-MM-dd'),
              exitDate: this.datePipe.transform(item?.exitDate, 'yyyy-MM-dd')
            }));
          });
        }
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

    const baseFields = Object.keys(data).filter((key) => !excludedFields.includes(key) && key !== 'patientVisitHistory');
    let totalFields = baseFields.length;

    let filled = baseFields.reduce((acc, key) => {
      const value = data[key];
      if (value !== null && value !== '' && value !== 'null') {
        return acc + 1;
      }
      return acc;
    }, 0);

    if (Array.isArray(this.patientVisitHistory?.controls) && this.patientVisitHistory.controls.length > 0) {
      const caseFields = this.patientVisitHistory.controls.reduce((count, row) => {
        const rowValue = (row as FormGroup).value;
        const rowKeys = Object.keys(rowValue);
        totalFields += rowKeys.length;
        return (
          count +
          rowKeys.reduce((c, key) => {
            const v = rowValue[key];
            if (v !== null && v !== '' && v !== 'null') {
              return c + 1;
            }
            return c;
          }, 0)
        );
      }, 0);

      filled += caseFields;
    }

    this.allControllesCount = totalFields;
    this.allFilledControlsCount = filled;
  }
}
