import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { InvestigationService } from '../../services/investigation.service';
import { __values } from 'tslib';
import { TranslateService } from '@ngx-translate/core';
import { UserMessageService } from 'src/app/core/services/user.message.service';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-malaria',
  host: { class: 'investigation-form' },
  templateUrl: './malaria.component.html',
  styleUrls: ['./malaria.component.css'],
})
export class MalariaComponent implements OnInit {
  private readonly visitFieldBases = [
    'healthCareFacilityName',
    'healthUnitBelongs',
    'dateVisit',
    'initialdiagnosis',
    'hospitalization',
    'entryDate',
    'exitDate'
  ];
  currentLang =
    localStorage.getItem('ls.currentLang') !== undefined &&
      localStorage.getItem('ls.currentLang') !== 'undefined'
      ? localStorage.getItem('ls.currentLang')
      : 'ar';
  malariaForm: FormGroup;
  currentId: any;
  allFilledControlsCount: number = 0;
  allControllesCount: number = 0;
  patientName: string;
  diseaseGroupId: any;

  constructor(
    private formBuilder: FormBuilder,
    private investigationService: InvestigationService,
    private translateService: TranslateService,
    private userMsg: UserMessageService,
    private datePipe: DatePipe
  ) {
    if (this.investigationService.patient.firstName != null && this.investigationService.patient.firstName != undefined) {
      this.patientName = this.investigationService.patient.firstName + " " + this.investigationService.patient.secondName + " " + this.investigationService.patient.thirdName;
    }
  }

  get patientVisitHistory(): FormArray {
    return this.malariaForm.get('patientVisitHistory') as FormArray;
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

  private syncPatientVisitHistoryFromApi(data: any): void {
    const apiVisits = data?.PatientVisitHistory ?? data?.patientVisitHistory;
    while (this.patientVisitHistory.length > 0) {
      this.patientVisitHistory.removeAt(0);
    }

    if (!Array.isArray(apiVisits) || apiVisits.length === 0) {
      return;
    }

    apiVisits.forEach((item: any) => {
      this.patientVisitHistory.push(this.createPatientVisitHistoryGroup({
        id: item?.id ?? null,
        nameHealthFacility: item?.nameHealthFacility ?? null,
        healthFacilityBelongs: item?.healthFacilityBelongs ?? null,
        dateVisit: this.datePipe.transform(item?.dateVisit, 'yyyy-MM-dd') ?? null,
        initialDiagnosis: item?.initialDiagnosis ?? null,
        admissionHospital: item?.admissionHospital ?? null,
        dateEntry: this.datePipe.transform(item?.dateEntry, 'yyyy-MM-dd') ?? null,
        exitDate: this.datePipe.transform(item?.exitDate, 'yyyy-MM-dd') ?? null,
      }));
    });
  }

  private normalizeNullishValue(value: any): any {
    return value === '' || value === 'null' || value === undefined ? null : value;
  }

  private normalizeNumericValue(value: any): number | null | any {
    const normalizedValue = this.normalizeNullishValue(value);
    if (normalizedValue === null || typeof normalizedValue === 'number') {
      return normalizedValue;
    }

    const numericValue = Number(normalizedValue);
    return Number.isNaN(numericValue) ? normalizedValue : numericValue;
  }

  private normalizePatientVisitPayload(visit: any): any {
    return {
      id: this.normalizeNumericValue(visit?.id),
      patientID: this.normalizeNumericValue(this.currentId),
      nameHealthFacility: this.normalizeNullishValue(visit?.nameHealthFacility),
      healthFacilityBelongs: this.normalizeNullishValue(visit?.healthFacilityBelongs),
      dateVisit: this.normalizeNullishValue(visit?.dateVisit),
      initialDiagnosis: this.normalizeNullishValue(visit?.initialDiagnosis),
      admissionHospital: this.normalizeNumericValue(visit?.admissionHospital),
      dateEntry: this.normalizeNullishValue(visit?.dateEntry),
      exitDate: this.normalizeNullishValue(visit?.exitDate)
    };
  }

  private getFlatVisitFieldNames(): string[] {
    return Array.from({ length: 5 }, (_, index) => index + 1)
      .flatMap((visitIndex) => this.visitFieldBases.map((field) => `${field}${visitIndex}`));
  }

  private buildSavePayload(): any {
    const payload = { ...this.malariaForm.getRawValue() };
    const stringOnlyFields = new Set([
      'followD1Phone',
      'followD2Phone',
      'followD7Phone',
      'followD14Phone'
    ]);
    payload.investigationCompletePercentage = parseFloat(
      ((this.allFilledControlsCount / this.allControllesCount) * 100).toFixed(2)
    );
    payload.diseaseGroupId = this.normalizeNumericValue(this.diseaseGroupId);
    payload.patientID = this.normalizeNumericValue(payload.patientID);

    Object.keys(payload).forEach((key) => {
      if (key === 'patientVisitHistory') {
        payload.PatientVisitHistory = Array.isArray(payload[key])
          ? payload[key].map((item: any) => this.normalizePatientVisitPayload(item))
          : [];
        delete payload[key];
        return;
      }

      payload[key] = stringOnlyFields.has(key)
        ? this.normalizeNullishValue(payload[key])
        : this.normalizeNumericValue(payload[key]);
    });

    return payload;
  }

  ngOnInit() {
    this.malariaForm = new FormGroup({
      transfusedBlood: new FormControl(),
      placeName: new FormControl(),
      date: new FormControl(),
      hadMalaria: new FormControl(),
      hadMalariaplaceName: new FormControl(),
      hadMalariaDate: new FormControl(),
      hadMalariaPlasmodiumType: new FormControl(),
      hadMalariaTherapy: new FormControl(),
      admissionIntensiveUnit: new FormControl(),
      bookingDate: new FormControl(),
      exitDate: new FormControl(),
      ventilator: new FormControl(),
      placementDevice: new FormControl(),
      malariaTreatmentApplied: new FormControl(),
      treatmentStartDate: new FormControl(),
      typeTreatment: new FormControl(),
      dosage: new FormControl(),
      caseAssessment: new FormControl(),
      result: new FormControl(),
      patientVisitHistory: this.formBuilder.array([]),
      routineSurveillance: new FormControl(),
      contactFollowUp: new FormControl(),
      travelOutsideEgypt: new FormControl(),
      fromMedicalTeam: new FormControl(),
      placeConfirmedCases: new FormControl(),

      contactWithSuspectedCase: new FormControl(),
      partEpidemicOutbreakOrSimilarSituation: new FormControl(),
      contactWithConfirmedCase: new FormControl(),
      theNumberDirectContacts: new FormControl(),
      theNumberIndirectContacts: new FormControl(),
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
      // followD1SampleTaken: new FormControl('3'),
      followD1SampleTaken: new FormControl(),
      followD1DateSampleTaken: new FormControl(),
      followD1SampleResult: new FormControl(),
      // followD1SampleResult: new FormControl('3'),
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
      // followD2SampleTaken: new FormControl('3'),
      followD2SampleTaken: new FormControl(),
      followD2DateSampleTaken: new FormControl(),
      // followD2SampleResult: new FormControl('3'),
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
      // followD7SampleTaken: new FormControl('3'),
      followD7SampleTaken: new FormControl(),
      followD7DateSampleTaken: new FormControl(),
      // followD7SampleResult: new FormControl('3'),
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
      // followD14SampleTaken: new FormControl('3'),
      followD14SampleTaken: new FormControl(),
      followD14DateSampleTaken: new FormControl(),
      // followD14SampleResult: new FormControl('3'),
      followD14SampleResult: new FormControl(),

      investigationDone: new FormControl(),
      resultInvestigation: new FormControl(),
      controlMosquitoesDone: new FormControl(),
      procedures: new FormControl(),
      traveledAbroad: new FormControl(),
      travelPlace: new FormControl(),
      travelHistoryEgyptians: new FormControl(),
      entryIntoEgypt: new FormControl(),
      prophylacticDrug: new FormControl(),
      propertyType: new FormControl(),
      propertydate: new FormControl(),
      id: new FormControl(),
      patientID: new FormControl(),
      diseaseGroupId: new FormControl(),
      investigationCompletePercentage: new FormControl(),
    });
    this.currentId = this.investigationService.currentid;

    this.malariaForm.controls['patientID'].setValue(this.currentId);

    if (this.diseaseGroupId == null || this.diseaseGroupId == undefined) {
      this.diseaseGroupId = this.investigationService.diseaseGroupID;
    }

    this.investigationService.getByIdMalaria(this.currentId).subscribe(
      (res) => {
        console.log(res);
        var v = res.data;
        console.log('v1', v);
        // if (v.followD1SampleTaken == null) { v.followD1SampleTaken = 2; }
        // if (v.followD2SampleTaken == null) { v.followD2SampleTaken = 2; }
        // if (v.followD7SampleTaken == null) { v.followD7SampleTaken = 2; }
        // if (v.followD14SampleTaken == null) { v.followD14SampleTaken = 2; }
        // //followD1SampleResult
        // if (v.followD1SampleResult == null) { v.followD1SampleResult = 2; }
        // if (v.followD2SampleResult == null) { v.followD2SampleResult = 2; }
        // if (v.followD7SampleResult == null) { v.followD7SampleResult = 2; }
        // if (v.followD14SampleResult == null) { v.followD14SampleResult = 2; }
        this.malariaForm.patchValue(v);

        //date
        this.malariaForm.controls['date'].setValue(
          this.datePipe.transform(this.malariaForm.value.date, 'yyyy-MM-dd')
        );
        //hadMalariaDate
        this.malariaForm.controls['hadMalariaDate'].setValue(
          this.datePipe.transform(
            this.malariaForm.value.hadMalariaDate,
            'yyyy-MM-dd'
          )
        );

        this.malariaForm.controls['bookingDate'].setValue(
          this.datePipe.transform(
            this.malariaForm.value.bookingDate,
            'yyyy-MM-dd'
          )
        );
        this.malariaForm.controls['exitDate'].setValue(
          this.datePipe.transform(this.malariaForm.value.exitDate, 'yyyy-MM-dd')
        );
        //placementDevice
        this.malariaForm.controls['placementDevice'].setValue(
          this.datePipe.transform(
            this.malariaForm.value.placementDevice,
            'yyyy-MM-dd'
          )
        );
        //treatmentStartDate
        this.malariaForm.controls['treatmentStartDate'].setValue(
          this.datePipe.transform(
            this.malariaForm.value.treatmentStartDate,
            'yyyy-MM-dd'
          )
        );
        this.syncPatientVisitHistoryFromApi(v);

        //days
        //followD1DateOfSymptoms
        this.malariaForm.controls['followD1DateOfSymptoms'].setValue(
          this.datePipe.transform(
            this.malariaForm.value.followD1DateOfSymptoms,
            'yyyy-MM-dd'
          )
        );
        this.malariaForm.patchValue({
          followD1SampleTaken: this.malariaForm.value.followD1SampleTaken + '',
          tc: true,
        });
        this.malariaForm.controls['followD1DateSampleTaken'].setValue(
          this.datePipe.transform(
            this.malariaForm.value.followD1DateSampleTaken,
            'yyyy-MM-dd'
          )
        );
        this.malariaForm.patchValue({
          followD1SampleResult:
            this.malariaForm.value.followD1SampleResult + '',
          tc: true,
        });
        //
        this.malariaForm.controls['followD2DateOfSymptoms'].setValue(
          this.datePipe.transform(
            this.malariaForm.value.followD2DateOfSymptoms,
            'yyyy-MM-dd'
          )
        );
        this.malariaForm.patchValue({
          followD2SampleTaken: this.malariaForm.value.followD2SampleTaken + '',
          tc: true,
        });
        this.malariaForm.controls['followD2DateSampleTaken'].setValue(
          this.datePipe.transform(
            this.malariaForm.value.followD2DateSampleTaken,
            'yyyy-MM-dd'
          )
        );
        this.malariaForm.patchValue({
          followD2SampleResult:
            this.malariaForm.value.followD2SampleResult + '',
          tc: true,
        });

        //
        this.malariaForm.controls['followD7DateOfSymptoms'].setValue(
          this.datePipe.transform(
            this.malariaForm.value.followD7DateOfSymptoms,
            'yyyy-MM-dd'
          )
        );
        this.malariaForm.patchValue({
          followD7SampleTaken: this.malariaForm.value.followD7SampleTaken + '',
          tc: true,
        });
        this.malariaForm.controls['followD7DateSampleTaken'].setValue(
          this.datePipe.transform(
            this.malariaForm.value.followD7DateSampleTaken,
            'yyyy-MM-dd'
          )
        );
        this.malariaForm.patchValue({
          followD7SampleResult:
            this.malariaForm.value.followD7SampleResult + '',
          tc: true,
        });
        //
        this.malariaForm.controls['followD14DateOfSymptoms'].setValue(
          this.datePipe.transform(
            this.malariaForm.value.followD14DateOfSymptoms,
            'yyyy-MM-dd'
          )
        );
        this.malariaForm.patchValue({
          followD14SampleTaken:
            this.malariaForm.value.followD14SampleTaken + '',
          tc: true,
        });
        this.malariaForm.controls['followD14DateSampleTaken'].setValue(
          this.datePipe.transform(
            this.malariaForm.value.followD14DateSampleTaken,
            'yyyy-MM-dd'
          )
        );
        this.malariaForm.patchValue({
          followD14SampleResult:
            this.malariaForm.value.followD14SampleResult + '',
          tc: true,
        });

        //travelHistoryEgyptians
        this.malariaForm.controls['travelHistoryEgyptians'].setValue(
          this.datePipe.transform(
            this.malariaForm.value.travelHistoryEgyptians,
            'yyyy-MM-dd'
          )
        );
        this.malariaForm.controls['travelHistoryEgyptians'].setValue(
          this.datePipe.transform(
            this.malariaForm.value.travelHistoryEgyptians,
            'yyyy-MM-dd'
          )
        );
        //entryIntoEgypt
        this.malariaForm.controls['entryIntoEgypt'].setValue(
          this.datePipe.transform(
            this.malariaForm.value.entryIntoEgypt,
            'yyyy-MM-dd'
          )
        );
        //propertydate
        this.malariaForm.controls['propertydate'].setValue(
          this.datePipe.transform(
            this.malariaForm.value.propertydate,
            'yyyy-MM-dd'
          )
        );
        console.log('v2', v);

        this.calculateCompletionPercentage();
        console.log('v3', v);

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
    Object.entries(this.malariaForm.controls).map(([key, value], index) => {
      if (value.value == 'null')
        value.setValue(null);
    })
    const payload = this.buildSavePayload();

    if (this.malariaForm.value.id != null) {
      this.investigationService.updateMalaria(payload).subscribe(
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
        }
      );
    } else {
      this.investigationService
        .addInvestigationMalaria(payload)
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
          }
        );
    }
  }

  //BL
  calculateCompletionPercentage() {
    this.allFilledControlsCount = 0;
    const data = this.malariaForm.value;
    console.log(data);
    //Exclude fields you don't want to count (like 'id')
    const excludedFields = [
      'id',
      'patientID',
      'investigationCompletePercentage',
      'diseaseGroupId',
      'createdDate',
      'patientVisitHistory',
      ...this.getFlatVisitFieldNames()
    ];
    const totalFields = Object.keys(data).filter(key => !excludedFields.includes(key)).length;

    let patientVisitTotalFields = 0;
    let patientVisitFilledFields = 0;

    this.patientVisitHistory.controls.forEach((control) => {
      const visitData = control.value;
      Object.keys(visitData).forEach((key) => {
        if (key === 'id') {
          return;
        }
        patientVisitTotalFields++;
        if (visitData[key] !== null && visitData[key] !== '' && visitData[key] !== 'null') {
          patientVisitFilledFields++;
        }
      });
    });

    this.allControllesCount = totalFields + patientVisitTotalFields;

    Object.keys(data).forEach((key) => {
      if (!excludedFields.includes(key) && data[key] !== null && data[key] !== '' && data[key] !== 'null') {
        this.allFilledControlsCount++;
      }
    });

    this.allFilledControlsCount += patientVisitFilledFields;
  }

}
