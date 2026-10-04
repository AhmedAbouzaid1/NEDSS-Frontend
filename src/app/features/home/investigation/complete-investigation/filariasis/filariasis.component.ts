import { calculateCompletionStats } from '../shared/investigation-summary.utils';
import { Component, OnInit } from '@angular/core';
import { FormArray, FormControl, FormGroup } from '@angular/forms';
import { DatePipe } from '@angular/common';
import { TranslateService } from '@ngx-translate/core';
import { UserMessageService } from 'src/app/core/services/user.message.service';
import { InvestigationService } from '../../services/investigation.service';

@Component({
  selector: 'app-filariasis',
  host: { class: 'investigation-form' },
  templateUrl: './filariasis.component.html',
  styleUrls: ['./filariasis.component.css']
})
export class FilariasisComponent implements OnInit {
  private readonly dateFields = [
    'treatmentStartDate',
    'dateSampleTakenDay1',
    'dateSampleTakenDay2',
    'dateSampleTakenDay7',
    'dateSampleTakenDay14',
    'dateOnsetSymptomsDay1',
    'dateOnsetSymptomsDay2',
    'dateOnsetSymptomsDay7',
    'dateOnsetSymptomsDay14',
    'historyTravel',
    'historyTravelInsideEgypt',
    'dateEntryEgypt',
    'investigationDate'
  ];
  private readonly stringifiedFields = [
    'isSampleTakenDay1',
    'sampleResultDay1',
    'isSampleTakenDay2',
    'sampleResultDay2',
    'isSampleTakenDay7',
    'sampleResultDay7',
    'isSampleTakenDay14',
    'sampleResultDay14'
  ];

  currentLang =
    localStorage.getItem('ls.currentLang') !== undefined &&
      localStorage.getItem('ls.currentLang') !== 'undefined'
      ? localStorage.getItem('ls.currentLang')
      : 'ar';

  filariasisForm: FormGroup;
  currentId: any;
  allFilledControlsCount: number = 0;
  allControllesCount: number = 0;
  patientName: string;

  get patientVisitHistory(): FormArray {
    return this.filariasisForm.get('patientVisitHistory') as FormArray;
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
    const visits = Array.isArray(apiVisits) && apiVisits.length > 0
      ? apiVisits
      : this.mapLegacyPatientVisits(data);

    while (this.patientVisitHistory.length > 0) {
      this.patientVisitHistory.removeAt(0);
    }

    visits.forEach((item: any) => {
      this.patientVisitHistory.push(this.createPatientVisitHistoryGroup({
        ...item,
        dateVisit: this.datePipe.transform(item?.dateVisit, 'yyyy-MM-dd'),
        dateEntry: this.datePipe.transform(item?.dateEntry, 'yyyy-MM-dd'),
        exitDate: this.datePipe.transform(item?.exitDate, 'yyyy-MM-dd')
      }));
    });
  }

  private mapLegacyPatientVisits(data: any): any[] {
    return Array.from({ length: 5 }, (_, index) => index + 1)
      .map((visitIndex) => ({
        nameHealthFacility: data?.[`nameHealthFacility${visitIndex}`] ?? null,
        healthFacilityBelongs: data?.[`healthFacilityBelongs${visitIndex}`] ?? null,
        dateVisit: data?.[`dateVisit${visitIndex}`] ?? null,
        initialDiagnosis: data?.[`initialDiagnosis${visitIndex}`] ?? null,
        admissionHospital: data?.[`admissionHospital${visitIndex}`] ?? null,
        dateEntry: data?.[`dateEntry${visitIndex}`] ?? null,
        exitDate: data?.[`exitDate${visitIndex}`] ?? null
      }))
      .filter((visit) => Object.values(visit).some((value) => value !== null && value !== '' && value !== 'null'));
  }

  constructor(private investigationService: InvestigationService,
    private translateService: TranslateService,
    private userMsg: UserMessageService,
    private datePipe: DatePipe) {
    if (this.investigationService.patient.firstName != null && this.investigationService.patient.firstName != undefined) {
      this.patientName = this.investigationService.patient.firstName + " " + this.investigationService.patient.secondName + " " + this.investigationService.patient.thirdName;
    }
  }

  private normalizeNullishValue(value: any): any {
    return value === '' || value === 'null' || value === undefined ? null : value;
  }

  private normalizeDateField(controlName: string): void {
    const control = this.filariasisForm.get(controlName);
    if (!control) {
      return;
    }

    control.setValue(this.datePipe.transform(control.value, 'yyyy-MM-dd'));
  }

  private stringifyField(controlName: string): void {
    const control = this.filariasisForm.get(controlName);
    if (!control || control.value === null || control.value === undefined) {
      return;
    }

    control.setValue(`${control.value}`);
  }

  private normalizePatientVisitPayload(visit: any): any {
    return {
      id: this.normalizeNullishValue(visit?.id),
      patientID: this.normalizeNullishValue(this.currentId),
      nameHealthFacility: this.normalizeNullishValue(visit?.nameHealthFacility),
      healthFacilityBelongs: this.normalizeNullishValue(visit?.healthFacilityBelongs),
      dateVisit: this.normalizeNullishValue(visit?.dateVisit),
      initialDiagnosis: this.normalizeNullishValue(visit?.initialDiagnosis),
      admissionHospital: this.normalizeNullishValue(visit?.admissionHospital),
      dateEntry: this.normalizeNullishValue(visit?.dateEntry),
      exitDate: this.normalizeNullishValue(visit?.exitDate)
    };
  }

  private buildSavePayload(): any {
    const payload = { ...this.filariasisForm.getRawValue() };

    Object.keys(payload).forEach((key) => {
      if (key === 'patientVisitHistory') {
        payload.PatientVisitHistory = Array.isArray(payload[key])
          ? payload[key].map((item: any) => this.normalizePatientVisitPayload(item))
          : [];
        delete payload[key];
        return;
      }

      payload[key] = this.normalizeNullishValue(payload[key]);
    });

    payload.diseaseGroupId = this.investigationService.diseaseGroupID;
    payload.patientID = this.currentId;
    payload.investigationCompletePercentage = parseFloat(
      ((this.allFilledControlsCount / this.allControllesCount) * 100).toFixed(2)
    );

    return payload;
  }

  ngOnInit() {
    this.filariasisForm = new FormGroup({
      id: new FormControl(),
      patientID: new FormControl(),
      filariasisTreatmentProtocolImplemented: new FormControl(),
      treatmentStartDate: new FormControl(),
      typeTreatment: new FormControl(),
      dose: new FormControl(),
      conditionAssessment: new FormControl(),
      result: new FormControl(),
      patientVisitHistory: new FormArray([]),
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
      traveledInsideEgypt: new FormControl(),
      whereToTravelInsideEgypt: new FormControl(),
      historyTravelInsideEgypt: new FormControl(),
      dateEntryEgypt: new FormControl(),
      investigationDate: new FormControl(),
      healthObserverName: new FormControl(),
      surveillanceOfficerName: new FormControl(),
      administrationDirectorName: new FormControl(),
      diseaseGroupId: new FormControl(this.investigationService.diseaseGroupID),
      investigationCompletePercentage: new FormControl(),
    })
    this.currentId = this.investigationService.currentid
    this.filariasisForm.controls['patientID'].setValue(this.currentId)
    this.investigationService.getByIdfilarisis(this.currentId, this.investigationService.diseaseGroupID).subscribe(
      res => {
        const v = res.data ?? {};
        this.filariasisForm.patchValue(v);
        this.stringifiedFields.forEach((field) => this.stringifyField(field));
        this.dateFields.forEach((field) => this.normalizeDateField(field));
        this.syncPatientVisitHistoryFromApi(v);
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
    this.calculateCompletionPercentage();
    const payload = this.buildSavePayload();

    if (this.filariasisForm.value.id != null) {
      this.investigationService.updateSeverefilarisis(payload).subscribe(
        (response: any) => {
          if (response) {
            this.translateService
              .get('NEDSS.COMMON.SENT_SUCESSFULLY')
              .subscribe((res: string) => {
                this.userMsg.success(res);
              });
          }
        }
        , (error) => { }
      )
    } else {
      this.investigationService.addInvestigationfilarisis(payload).subscribe(
        (response: any) => {
          if (response) {
            this.translateService
              .get('NEDSS.COMMON.SENT_SUCESSFULLY')
              .subscribe((res: string) => {
                this.userMsg.success(res);
              });
          }
        }
        , (error) => { }
      )
    }
  }

  //BL
  calculateCompletionPercentage() {
    const stats = calculateCompletionStats(this.filariasisForm.value, {
      excludedFields: ['id', 'patientID', 'investigationCompletePercentage', 'diseaseGroupId', 'createdDate'],
      formArrays: [{ value: this.patientVisitHistory, excludedFields: ['id'] }]
    });

    this.allControllesCount = stats.totalFields;
    this.allFilledControlsCount = stats.filledFields;
  }

  calculateCompletePercentage() {
    this.calculateCompletionPercentage();
  }
}
