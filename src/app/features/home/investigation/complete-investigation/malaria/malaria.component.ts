import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { InvestigationService } from '../../services/investigation.service';
import { __values } from 'tslib';
import { TranslateService } from '@ngx-translate/core';
import { UserMessageService } from 'src/app/core/services/user.message.service';
import { DatePipe } from '@angular/common';
import { GeneralDataService } from '../../../general-data/services/general-data.service';
import { LabService } from '../../../../lab/services/lab.service';

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
  activeTab: 'investigation' | 'contactSamples' = 'investigation';
  tabs = [
    { key: 'investigation', label: 'NEDSS.MALARIA.TAB_INVESTIGATION' },
    { key: 'contactSamples', label: 'NEDSS.MALARIA.TAB_CONTACT_SAMPLES' },
  ];
  private readonly contactSamplesFields = [
    'contactSamplesPatientName',
    'contactSamplesMalariaUnit',
    'contactSamplesInfectionDate',
    'contactSamplesPlasmodiumType',
    'contactSamplesPatientAddress',
    'contactSamplesSampleDate',
    'contactSamplesCollectorName',
    'contactSamplesUnitManagerName',
  ];
  private readonly otherDrugCode = 99;
  private readonly drugListFields = ['firstLineTreatmentDrugs', 'secondLineTreatmentDrugs'];
  firstLineDrugOptions = [
    { value: 1, label: 'كوارتم (Coartem)' },
    { value: 2, label: 'أرتيسونات (Artesunate)' },
    { value: 99, label: 'أخرى' },
  ];
  secondLineDrugOptions = [
    { value: 1, label: 'كينين أمبول' },
    { value: 2, label: 'كينين أقراص' },
    { value: 3, label: 'كليندامايسين (Clindamycin)' },
    { value: 4, label: 'دوكسيسيكلين (Doxycycline)' },
    { value: 5, label: 'بريماكين (Primaquine)' },
    { value: 99, label: 'أخرى' },
  ];

  constructor(
    private formBuilder: FormBuilder,
    private investigationService: InvestigationService,
    private translateService: TranslateService,
    private userMsg: UserMessageService,
    private datePipe: DatePipe,
    private generalDataService: GeneralDataService,
    private labService: LabService
  ) {
    if (this.investigationService.patient.firstName != null && this.investigationService.patient.firstName != undefined) {
      this.patientName = this.investigationService.patient.firstName + " " + this.investigationService.patient.secondName + " " + this.investigationService.patient.thirdName;
    }
  }

  get patientVisitHistory(): FormArray {
    return this.malariaForm.get('patientVisitHistory') as FormArray;
  }

  get contactSamples(): FormArray {
    return this.malariaForm.get('contactSamples') as FormArray;
  }

  setTab(tab: 'investigation' | 'contactSamples') {
    this.activeTab = tab;
    if (tab === 'contactSamples') {
      this.fillIfEmpty('contactSamplesPlasmodiumType', this.malariaForm.value.hadMalariaPlasmodiumType);
    }
  }

  createContactSampleGroup(data?: any): FormGroup {
    return new FormGroup({
      name: new FormControl(data?.name ?? null),
      age: new FormControl(data?.age ?? null),
      genderId: new FormControl(data?.genderId ?? null),
      address: new FormControl(data?.address ?? null),
      nationality: new FormControl(data?.nationality ?? null),
      result: new FormControl(data?.result ?? null),
      phone: new FormControl(data?.phone ?? null),
    });
  }

  addContactSample() {
    this.contactSamples.push(this.createContactSampleGroup());
  }

  removeContactSample(index: number) {
    this.contactSamples.removeAt(index);
    if (this.contactSamples.length === 0) {
      this.addContactSample();
    }
  }

  private syncContactSamplesFromApi(json: any): void {
    this.contactSamples.clear();
    let rows: any[] = [];
    try {
      rows = json ? JSON.parse(json) : [];
    } catch {
      rows = [];
    }
    (Array.isArray(rows) ? rows : []).forEach((row) => this.contactSamples.push(this.createContactSampleGroup(row)));
    if (this.contactSamples.length === 0) {
      this.addContactSample();
    }
  }

  private serializeContactSamples(rows: any[]): string | null {
    const filled = (Array.isArray(rows) ? rows : []).filter((row) =>
      Object.values(row ?? {}).some((value) => value !== null && value !== undefined && `${value}`.trim() !== '' && value !== 'null')
    );
    return filled.length ? JSON.stringify(filled) : null;
  }

  private fillIfEmpty(controlName: string, value: any): void {
    const control = this.malariaForm.get(controlName);
    const current = control?.value;
    const isEmpty = current === null || current === undefined || `${current}`.trim() === '' || current === 'null';
    if (control && isEmpty && value !== null && value !== undefined && `${value}`.trim() !== '') {
      control.setValue(value);
    }
  }

  private prefillContactSamplesHeader(): void {
    this.fillIfEmpty('contactSamplesPlasmodiumType', this.malariaForm.value.hadMalariaPlasmodiumType);
    if (!this.currentId) {
      return;
    }
    this.generalDataService.getBy(this.currentId).subscribe((res: any) => {
      const p = res?.data;
      if (!p) {
        return;
      }
      const fullName = [p.firstName, p.secondName, p.thirdName, p.familyName].filter((x: any) => !!x).join(' ');
      const address = [p.livingAddress || p.newLivingAddress, p.homeCityName, p.homeGovernmentName].filter((x: any) => !!x).join(' - ');
      this.fillIfEmpty('contactSamplesPatientName', fullName);
      this.fillIfEmpty('contactSamplesPatientAddress', address);
      this.fillIfEmpty('contactSamplesInfectionDate', this.datePipe.transform(p.infectionDate ?? p.incidentDate, 'yyyy-MM-dd'));
    });
    this.labService.getPagePatientLabChecks({ patientId: this.currentId, pageIndex: 0, pageSize: 100 }).subscribe((res: any) => {
      const checks: any[] = res?.data?.patientLabChecks ?? [];
      const malariaChecks = checks.filter((c) => /ملاريا|malaria/i.test(c?.diseaseName ?? ''));
      const latest = (malariaChecks.length ? malariaChecks : checks)
        .filter((c) => !!c?.getSampleDate)
        .sort((a, b) => new Date(b.getSampleDate).getTime() - new Date(a.getSampleDate).getTime())[0];
      if (latest) {
        this.fillIfEmpty('contactSamplesSampleDate', this.datePipe.transform(latest.getSampleDate, 'yyyy-MM-dd'));
      }
    });
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

  hasOtherDrug(field: string): boolean {
    const value = this.malariaForm.get(field)?.value;
    return Array.isArray(value) && value.includes(this.otherDrugCode);
  }

  private parseDrugList(value: any): number[] | null {
    if (value === null || value === undefined || value === '') {
      return null;
    }
    const codes = String(value).split(',').map((code) => Number(code.trim())).filter((code) => !Number.isNaN(code));
    return codes.length ? codes : null;
  }

  private applyDiscoveryMethod(method: any): void {
    const routine = method == 1 ? 1 : method == 2 ? 2 : null;
    const contacts = method == 2 ? 1 : method == 1 ? 2 : null;
    this.malariaForm.patchValue({ routineSurveillance: routine, contactFollowUp: contacts }, { emitEvent: false });
  }

  private buildSavePayload(): any {
    const payload = { ...this.malariaForm.getRawValue() };
    delete payload.discoveryMethod;
    payload.contactSamplesJson = this.serializeContactSamples(payload.contactSamples);
    delete payload.contactSamples;
    this.drugListFields.forEach((field) => {
      payload[field] = Array.isArray(payload[field]) && payload[field].length ? payload[field].join(',') : null;
    });
    const stringOnlyFields = new Set([
      'followD1Phone',
      'followD2Phone',
      'followD7Phone',
      'followD14Phone',
      'followD28Phone',
      ...this.drugListFields,
      'firstLineTreatmentOther',
      'secondLineTreatmentOther',
      'contactSamplesPatientName',
      'contactSamplesMalariaUnit',
      'contactSamplesPlasmodiumType',
      'contactSamplesPatientAddress',
      'contactSamplesJson',
      'contactSamplesCollectorName',
      'contactSamplesUnitManagerName'
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
      firstLineTreatmentReceived: new FormControl(),
      firstLineTreatmentDrugs: new FormControl(),
      firstLineTreatmentOther: new FormControl(),
      secondLineTreatmentReceived: new FormControl(),
      secondLineTreatmentDrugs: new FormControl(),
      secondLineTreatmentOther: new FormControl(),
      caseAssessment: new FormControl(),
      result: new FormControl(),
      patientVisitHistory: this.formBuilder.array([]),
      contactSamplesPatientName: new FormControl(),
      contactSamplesMalariaUnit: new FormControl(),
      contactSamplesInfectionDate: new FormControl(),
      contactSamplesPlasmodiumType: new FormControl(),
      contactSamplesPatientAddress: new FormControl(),
      contactSamplesSampleDate: new FormControl(),
      contactSamples: this.formBuilder.array([]),
      contactSamplesCollectorName: new FormControl(),
      contactSamplesUnitManagerName: new FormControl(),
      discoveryMethod: new FormControl(),
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
      followD28Name: new FormControl(),
      followD28Age: new FormControl(),
      followD28Phone: new FormControl(),
      followD28Type: new FormControl(),
      followD28MixingType: new FormControl(),
      followD28RelationshipSituation: new FormControl(),
      followD28DateOfSymptoms: new FormControl(),
      followD28Fever: new FormControl(),
      followD28DryCough: new FormControl(),
      followD28CoughingWithSpitting: new FormControl(),
      followD28SoreThroat: new FormControl(),
      followD28DifficultyBreathing: new FormControl(),
      followD28JointPain: new FormControl(),
      followD28vomit: new FormControl(),
      followD28Diarrhea: new FormControl(),
      followD28Other: new FormControl(),
      followD28OtherSymptoms: new FormControl(),
      followD28SampleTaken: new FormControl(),
      followD28DateSampleTaken: new FormControl(),
      followD28SampleResult: new FormControl(),

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
    this.malariaForm.controls['discoveryMethod'].valueChanges.subscribe((method) => this.applyDiscoveryMethod(method));

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
        this.malariaForm.patchValue({
          discoveryMethod: v?.routineSurveillance == 1 ? 1 : v?.contactFollowUp == 1 ? 2 : null,
          firstLineTreatmentDrugs: this.parseDrugList(v?.firstLineTreatmentDrugs),
          secondLineTreatmentDrugs: this.parseDrugList(v?.secondLineTreatmentDrugs),
          caseAssessment: v?.caseAssessment == 2 ? 1 : v?.caseAssessment,
        }, { emitEvent: false });

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
        this.syncContactSamplesFromApi(v?.contactSamplesJson);
        ['contactSamplesInfectionDate', 'contactSamplesSampleDate'].forEach((field) =>
          this.malariaForm.controls[field].setValue(this.datePipe.transform(this.malariaForm.value[field], 'yyyy-MM-dd'))
        );
        this.prefillContactSamplesHeader();

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
        //
        this.malariaForm.controls['followD28DateOfSymptoms'].setValue(
          this.datePipe.transform(
            this.malariaForm.value.followD28DateOfSymptoms,
            'yyyy-MM-dd'
          )
        );
        this.malariaForm.patchValue({
          followD28SampleTaken:
            this.malariaForm.value.followD28SampleTaken + '',
          tc: true,
        });
        this.malariaForm.controls['followD28DateSampleTaken'].setValue(
          this.datePipe.transform(
            this.malariaForm.value.followD28DateSampleTaken,
            'yyyy-MM-dd'
          )
        );
        this.malariaForm.patchValue({
          followD28SampleResult:
            this.malariaForm.value.followD28SampleResult + '',
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
        this.syncContactSamplesFromApi(null);
        this.prefillContactSamplesHeader();
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
      'routineSurveillance',
      'contactFollowUp',
      'typeTreatment',
      'travelHistoryEgyptians',
      'travelOutsideEgypt',
      'contactSamples',
      ...this.contactSamplesFields,
      ...this.getFlatVisitFieldNames()
    ];
    const isFilled = (value: any) =>
      Array.isArray(value) ? value.length > 0 : value !== null && value !== '' && value !== 'null';
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
      if (!excludedFields.includes(key) && isFilled(data[key])) {
        this.allFilledControlsCount++;
      }
    });

    this.allFilledControlsCount += patientVisitFilledFields;
  }

}
