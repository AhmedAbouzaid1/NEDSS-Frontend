import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { forkJoin, of } from 'rxjs';
import { catchError, finalize, switchMap } from 'rxjs/operators';
import { LookupsGetterService } from 'src/app/core/services/lookups-getter.service';
import { UserMessageService } from 'src/app/core/services/user.message.service';
import { GeneralDataService } from '../../../general-data/services/general-data.service';
import { DepartmentEnum } from '../../../general-data/models/department-enum';
import { InvestigationService } from '../../services/investigation.service';

const TRAVEL_WINDOW_DAYS = 14;

const SYMPTOM_FIELDS = [
  'symptomFever', 'symptomHeadache', 'symptomAbdominalPain', 'symptomSkinRash', 'symptomMusclePain',
  'symptomJointPain', 'symptomArthritis', 'symptomDiarrhea', 'symptomRetroOrbitalPain', 'symptomVomiting',
  'symptomConsciousnessDisturbance', 'symptomJaundice', 'symptomConjunctivalCongestion', 'symptomSuddenBlindness',
  'bleedingHematemesis', 'bleedingSkinSpots', 'bleedingHematuria', 'bleedingStool', 'bleedingNose',
  'bleedingGums', 'bleedingVaginal', 'capillaryLeakAscites', 'capillaryLeakPleuralEffusion', 'capillaryLeakOther',
];

const RISK_FIELDS = [
  'riskBloodTransfusion', 'riskHeartDisease', 'riskChestDisease', 'riskKidneyDisease', 'riskOtherChronicDisease', 'riskIcuAdmission',
  'riskDiabetes', 'riskImmuneDisease', 'riskMechanicalVentilation', 'riskPregnancy',
];

const CHECKBOX_FIELDS = [...SYMPTOM_FIELDS, ...RISK_FIELDS];

const GENERAL_CHRONIC_NAMES: Record<string, string> = {
  riskHeartDisease: 'امراض القلب',
  riskChestDisease: 'امراض الصدر المزمنه',
  riskKidneyDisease: 'امراض الكلي',
  riskDiabetes: 'مرض السكري',
  riskImmuneDisease: 'نقص المناعه',
  riskPregnancy: 'سيدات حوامل',
};

const GENERAL_DATA_FIELDS = ['hospitalEntryDate', 'hospitalLeaveDate', 'infectionDate', 'finalResultId'];

const DISCHARGE_STATUS_NAMES = ['شفاء', 'تحويل', 'هروب', 'وفاه'];

const EXPOSURE_QUESTIONS = [
  'animalExposure14Days', 'sickAnimalsAtHome', 'animalActivityCamels', 'animalActivityGoats', 'animalActivitySheep',
  'animalActivityCattle', 'animalActivityAnimalWaste', 'animalAbortionsNearHome', 'livesNearAnimalFarm',
  'mosquitoBites2Weeks', 'foreignerWithHemorrhagicSymptomsContact', 'exposedToHemorrhagicPatientFluids',
  'rodentExposure', 'primateExposure', 'tickExposure', 'batExposure', 'healthcareProviderForSuspectedCases',
  'hemorrhagicFeverLabWorker', 'researchLabRodentsBatsWorker',
];

const FOLLOW_UPS: { parent: string; value: any; fields: string[] }[] = [
  { parent: 'hospitalized', value: 1, fields: ['hospitalEntryDate', 'hospitalLeaveDate', 'transferredFromHospital'] },
  { parent: 'capillaryLeakOther', value: true, fields: ['capillaryLeakOtherDetails'] },
  { parent: 'riskOtherChronicDisease', value: true, fields: ['riskOtherChronicDiseaseDetails'] },
  { parent: 'riskPregnancy', value: true, fields: ['pregnancyMonths'] },
  { parent: 'yellowFeverVaccinated', value: 1, fields: ['yellowFeverVaccinationDate'] },
  { parent: 'hasTravelHistory', value: 1, fields: ['travelledAbroad', 'travelledInsideEgypt'] },
  { parent: 'travelledAbroad', value: 1, fields: ['abroadCountryId', 'abroadReturnDate', 'abroadTravelReason'] },
  { parent: 'travelledInsideEgypt', value: 1, fields: ['insideGovernorateId', 'insideReturnDate', 'insideTravelReason'] },
  { parent: 'sickAnimalsAtHome', value: 1, fields: ['sickAnimalsDetails'] },
  { parent: 'animalAbortionsNearHome', value: 1, fields: ['touchedAbortionProducts'] },
  { parent: 'touchedAbortionProducts', value: 1, fields: ['touchedAbortionProductsDate'] },
  { parent: 'foreignerWithHemorrhagicSymptomsContact', value: 1, fields: ['foreignerNationalityId'] },
  { parent: 'exposedToHemorrhagicPatientFluids', value: 1, fields: ['exposedToFluidsDate'] },
];

@Component({
  selector: 'app-hemorrhagic-fevers',
  host: { class: 'investigation-form' },
  templateUrl: './hemorrhagic-fevers.component.html',
  styleUrls: ['./hemorrhagic-fevers.component.css'],
})
export class HemorrhagicFeversComponent implements OnInit {
  currentLang =
    localStorage.getItem('ls.currentLang') !== undefined &&
    localStorage.getItem('ls.currentLang') !== 'undefined'
      ? localStorage.getItem('ls.currentLang')
      : 'ar';
  allFilledControlsCount = 0;
  allControllesCount = 0;
  patientName = '';
  currentId: any;
  diseaseGroupID: any;
  patient: any = {};
  countries: any[] = [];
  governorates: any[] = [];
  finalResults: any[] = [];
  countriesLoading = false;
  governoratesLoading = false;
  finalResultsLoading = false;
  private chronicDiseases: any[] = [];
  private otherChronicPrefix = '';
  private generalDataSnapshot = '';

  readonly yesNoOptions = [
    { value: 1, label: 'نعم', labelEn: 'Yes' },
    { value: 2, label: 'لا', labelEn: 'No' },
  ];
  readonly yesNoUnknownOptions = [
    { value: 1, label: 'نعم', labelEn: 'Yes' },
    { value: 2, label: 'لا', labelEn: 'No' },
    { value: 3, label: 'غير معروف', labelEn: 'Unknown' },
  ];
  readonly yesNoDontKnowOptions = [
    { value: 1, label: 'نعم', labelEn: 'Yes' },
    { value: 2, label: 'لا', labelEn: 'No' },
    { value: 3, label: 'لا أعلم', labelEn: "Don't know" },
  ];
  readonly rdtResultOptions = [
    { value: 1, label: 'Negative', labelEn: 'Negative' },
    { value: 2, label: 'Positive', labelEn: 'Positive' },
  ];

  hemorrhagicForm: FormGroup;

  constructor(
    private investigationService: InvestigationService,
    private generalDataService: GeneralDataService,
    private lookupsService: LookupsGetterService,
    private datePipe: DatePipe,
    private translateService: TranslateService,
    private route: ActivatedRoute,
    private router: Router,
    private userMsg: UserMessageService
  ) {
    this.currentId = this.route.snapshot.paramMap.get('id') ?? this.investigationService.currentid;
    this.diseaseGroupID = this.route.snapshot.paramMap.get('diseaseId') ?? this.investigationService.diseaseGroupID;
    const cached = this.investigationService.patient;
    if (cached?.firstName != null) {
      this.patientName = [cached.firstName, cached.secondName, cached.thirdName].filter((x) => !!x).join(' ');
    }

    const controls: Record<string, FormControl> = {
      id: new FormControl(null),
      patientID: new FormControl(this.currentId),
      diseaseGroupId: new FormControl(this.diseaseGroupID),
      investigationCompletePercentage: new FormControl(0),
      createdDate: new FormControl(null),
      hospitalPhoneFax: new FormControl(null),
      formDate: new FormControl(null),
      hospitalized: new FormControl(null),
      hospitalEntryDate: new FormControl(null),
      hospitalLeaveDate: new FormControl(null),
      transferredFromHospital: new FormControl(null),
      infectionDate: new FormControl(null),
      finalResultId: new FormControl(null),
      capillaryLeakOtherDetails: new FormControl(null),
      riskOtherChronicDiseaseDetails: new FormControl(null),
      pregnancyMonths: new FormControl(null),
      yellowFeverVaccinated: new FormControl(null),
      yellowFeverVaccinationDate: new FormControl(null),
      hasTravelHistory: new FormControl(null),
      travelledAbroad: new FormControl(null),
      abroadCountryId: new FormControl(null),
      abroadReturnDate: new FormControl(null),
      abroadTravelReason: new FormControl(null),
      travelledInsideEgypt: new FormControl(null),
      insideGovernorateId: new FormControl(null),
      insideReturnDate: new FormControl(null),
      insideTravelReason: new FormControl(null),
      sickAnimalsDetails: new FormControl(null),
      animalActivityOther: new FormControl(null),
      touchedAbortionProducts: new FormControl(null),
      touchedAbortionProductsDate: new FormControl(null),
      foreignerNationalityId: new FormControl(null),
      exposedToFluidsDate: new FormControl(null),
      malariaRdtResult: new FormControl(null),
      surveillanceOfficerName: new FormControl(null),
    };
    CHECKBOX_FIELDS.forEach((name) => (controls[name] = new FormControl(false)));
    EXPOSURE_QUESTIONS.forEach((name) => (controls[name] = new FormControl(null)));
    this.hemorrhagicForm = new FormGroup(controls);
  }

  ngOnInit(): void {
    if (this.currentId == null) {
      this.router.navigateByUrl('/home/investigations');
      return;
    }
    this.loadCountries();
    this.loadGovernorates();
    this.loadFinalResults();
    this.loadData();
  }

  get showFemaleFields(): boolean {
    return Number(this.patient?.genderId) !== 1;
  }

  get caseDiscoveryLabel(): string {
    return this.formatDate(this.patient?.caseDiscoveryDate);
  }

  get onsetDate(): string | null {
    return this.dateValue('infectionDate');
  }

  get dischargeStatusOptions(): any[] {
    const current = this.hemorrhagicForm.get('finalResultId')?.value;
    const allowed = DISCHARGE_STATUS_NAMES.map((name) =>
      this.finalResults.find((r) => this.normalize(r.arabicName) === this.normalize(name))
    ).filter((r) => !!r);
    const currentItem = this.finalResults.find((r) => r.id === current);
    return currentItem && !allowed.includes(currentItem) ? [...allowed, currentItem] : allowed;
  }

  get travelWindowStart(): string | null {
    return this.addDays(this.onsetDate, -TRAVEL_WINDOW_DAYS);
  }

  formatDate(value: any): string {
    return this.datePipe.transform(value, 'dd/MM/yyyy') ?? '';
  }

  label(ar: string, en: string): string {
    return this.currentLang === 'ar' ? ar : en;
  }

  optionLabel(option: { label: string; labelEn: string }): string {
    return this.label(option.label, option.labelEn);
  }

  lookupName(item: any): string {
    return this.currentLang === 'ar' ? item?.arabicName : item?.englishName;
  }

  get formDateError(): string {
    const date = this.dateValue('formDate');
    const discovery = this.toDateInput(this.patient?.caseDiscoveryDate);
    if (date && discovery && date < discovery) {
      return this.label(
        `تاريخ تحرير الاستمارة لا يمكن أن يكون قبل تاريخ اكتشاف الحالة (${this.formatDate(discovery)})`,
        `Form date cannot be before the case discovery date (${this.formatDate(discovery)})`
      );
    }
    return '';
  }

  get onsetDateError(): string {
    const onset = this.onsetDate;
    if (!onset) {
      return '';
    }
    const birth = this.toDateInput(this.patient?.birthDate);
    if (birth && onset < birth) {
      return this.label(
        `تاريخ ظهور الأعراض لا يمكن أن يكون قبل تاريخ الميلاد (${this.formatDate(birth)})`,
        `Symptom onset cannot be before the birth date (${this.formatDate(birth)})`
      );
    }
    const discovery = this.toDateInput(this.patient?.caseDiscoveryDate);
    if (discovery && onset > discovery) {
      return this.label(
        `تاريخ بداية الأعراض يجب أن يكون قبل أو في نفس يوم تاريخ اكتشاف الحالة (${this.formatDate(discovery)})`,
        `Symptom onset cannot be after the case discovery date (${this.formatDate(discovery)})`
      );
    }
    const fever = this.toDateInput(this.patient?.feverSymptoms?.feverDate);
    if (fever && onset > fever) {
      return this.label(
        `تاريخ ظهور الأعراض لا يمكن أن يكون بعد تاريخ الحمى في البيانات العامة (${this.formatDate(fever)})`,
        `Symptom onset cannot be after the General Data fever date (${this.formatDate(fever)})`
      );
    }
    return '';
  }

  get admissionDateError(): string {
    const admission = this.dateValue('hospitalEntryDate');
    if (!admission) {
      return '';
    }
    const birth = this.toDateInput(this.patient?.birthDate);
    if (birth && admission < birth) {
      return this.label(
        `تاريخ الحجز لا يمكن أن يكون قبل تاريخ الميلاد (${this.formatDate(birth)})`,
        `Admission date cannot be before the birth date (${this.formatDate(birth)})`
      );
    }
    const discovery = this.toDateInput(this.patient?.caseDiscoveryDate);
    if (discovery && admission < discovery) {
      return this.label(
        `تاريخ الحجز يجب أن يكون بعد أو في نفس يوم تاريخ اكتشاف الحالة (${this.formatDate(discovery)})`,
        `Admission date must be on or after the case discovery date (${this.formatDate(discovery)})`
      );
    }
    return '';
  }

  get dischargeDateError(): string {
    const discharge = this.dateValue('hospitalLeaveDate');
    const admission = this.dateValue('hospitalEntryDate');
    if (discharge && admission && discharge < admission) {
      return this.label(
        `تاريخ الخروج يجب أن يكون بعد أو في نفس يوم تاريخ الحجز (${this.formatDate(admission)})`,
        `Discharge date cannot be before the admission date (${this.formatDate(admission)})`
      );
    }
    return '';
  }

  get vaccinationDateError(): string {
    const date = this.dateValue('yellowFeverVaccinationDate');
    const birth = this.toDateInput(this.patient?.birthDate);
    if (date && birth && date < birth) {
      return this.label(
        `تاريخ التطعيم لا يمكن أن يكون قبل تاريخ الميلاد (${this.formatDate(birth)})`,
        `Vaccination date cannot be before the birth date (${this.formatDate(birth)})`
      );
    }
    return '';
  }

  returnDateError(field: 'abroadReturnDate' | 'insideReturnDate'): string {
    const date = this.dateValue(field);
    const windowStart = this.travelWindowStart;
    if (date && windowStart && date < windowStart) {
      return this.label(
        `تاريخ العودة يجب أن يكون خلال أسبوعين قبل ظهور الأعراض (من ${this.formatDate(windowStart)})`,
        `Return date must be within 2 weeks before symptom onset (from ${this.formatDate(windowStart)})`
      );
    }
    return '';
  }

  exposureDateError(field: 'touchedAbortionProductsDate' | 'exposedToFluidsDate'): string {
    const date = this.dateValue(field);
    if (!date) {
      return '';
    }
    const birth = this.toDateInput(this.patient?.birthDate);
    if (birth && date < birth) {
      return this.label(
        `التاريخ لا يمكن أن يكون قبل تاريخ الميلاد (${this.formatDate(birth)})`,
        `Date cannot be before the birth date (${this.formatDate(birth)})`
      );
    }
    const onset = this.onsetDate;
    if (onset && date > onset) {
      return this.label(
        `تاريخ التعرض لا يمكن أن يكون بعد تاريخ ظهور الأعراض (${this.formatDate(onset)})`,
        `Exposure date cannot be after symptom onset (${this.formatDate(onset)})`
      );
    }
    return '';
  }

  get pregnancyMonthsError(): string {
    const months = this.hemorrhagicForm.get('pregnancyMonths')?.value;
    if (months === null || months === undefined || months === '') {
      return '';
    }
    const value = Number(months);
    return Number.isInteger(value) && value >= 1 && value <= 9
      ? ''
      : this.label('عدد شهور الحمل يجب أن يكون من 1 إلى 9', 'Pregnancy months must be between 1 and 9');
  }

  private validationErrors(): string[] {
    return [
      this.formDateError,
      this.onsetDateError,
      this.admissionDateError,
      this.dischargeDateError,
      this.vaccinationDateError,
      this.returnDateError('abroadReturnDate'),
      this.returnDateError('insideReturnDate'),
      this.exposureDateError('touchedAbortionProductsDate'),
      this.exposureDateError('exposedToFluidsDate'),
      this.pregnancyMonthsError,
    ].filter((e) => !!e);
  }

  private loadData(): void {
    forkJoin({
      patient: this.generalDataService.getPatientByIdForInvestigation(this.currentId),
      chronic: this.lookupsService.getChronicDiseases().pipe(catchError(() => of(null))),
      investigation: this.investigationService.getByIdHemorrhagicFever(this.currentId),
    }).subscribe(
      ({ patient, chronic, investigation }: any) => {
        this.patient = patient?.data ?? {};
        this.chronicDiseases = chronic?.data ?? [];
        if (this.patient?.firstName) {
          this.patientName = [this.patient.firstName, this.patient.secondName, this.patient.thirdName]
            .filter((x) => !!x)
            .join(' ');
        }
        this.applyInvestigation(investigation?.data);
        this.applyGeneralData(!investigation?.data?.id);
        this.generalDataSnapshot = JSON.stringify(this.buildGeneralDataPayload());
        this.calculateCompletionPercentage();
      },
      () => {
        this.translateService.get('NEDSS.COMMON.SENT_FAILD').subscribe((msg: string) => this.userMsg.error(msg));
      }
    );
  }

  private applyInvestigation(data: any): void {
    if (!data) {
      return;
    }
    const patch: any = {};
    Object.keys(this.hemorrhagicForm.controls).forEach((key) => {
      if (data[key] === undefined || GENERAL_DATA_FIELDS.includes(key)) {
        return;
      }
      patch[key] = CHECKBOX_FIELDS.includes(key) ? data[key] === true : data[key];
    });
    ['formDate', 'yellowFeverVaccinationDate', 'abroadReturnDate', 'insideReturnDate', 'touchedAbortionProductsDate', 'exposedToFluidsDate'].forEach(
      (key) => (patch[key] = this.toDateInput(data[key]))
    );
    this.hemorrhagicForm.patchValue(patch);
  }

  private applyGeneralData(isNewInvestigation: boolean): void {
    const p = this.patient ?? {};
    const chronicIds = new Set<number>((p.chronicDiseasesIds ?? []).map((x: any) => Number(x)));
    const selectedChronic = this.chronicDiseases.filter((c) => chronicIds.has(Number(c.id)));
    const selectedNames = selectedChronic.map((c) => this.normalize(c.arabicName));
    const knownNames = Object.values(GENERAL_CHRONIC_NAMES);
    const patch: any = {
      hospitalEntryDate: this.toDateInput(p.hospitalEntryDate),
      hospitalLeaveDate: this.toDateInput(p.hospitalLeaveDate),
      infectionDate: this.toDateInput(p.infectionDate),
      finalResultId: p.finalResultId ?? null,
    };
    Object.entries(GENERAL_CHRONIC_NAMES).forEach(([field, name]) => (patch[field] = selectedNames.includes(name)));

    const otherNames = selectedChronic
      .filter((c) => !knownNames.includes(this.normalize(c.arabicName)))
      .map((c) => this.lookupName(c));
    this.otherChronicPrefix = otherNames.join('، ');
    const anotherText = p.anotherChronicDisease?.trim() || '';
    const details = [this.otherChronicPrefix, anotherText].filter((x) => !!x).join('، ');
    patch.riskOtherChronicDisease = !!details;
    patch.riskOtherChronicDiseaseDetails = details || null;

    const department = Number(p.incidentDepartmentId);
    if (isNewInvestigation) {
      if (department === DepartmentEnum.Internal || department === DepartmentEnum.ICU || p.hospitalEntryDate) {
        patch.hospitalized = 1;
      }
      if (department === DepartmentEnum.ICU) {
        patch.riskIcuAdmission = true;
      }
    } else if (this.hemorrhagicForm.get('hospitalized')?.value == null && p.hospitalEntryDate) {
      patch.hospitalized = 1;
    }
    this.hemorrhagicForm.patchValue(patch);
    ['bleedingVaginal', 'riskPregnancy', 'pregnancyMonths'].forEach((name) => {
      const control = this.hemorrhagicForm.get(name);
      this.showFemaleFields ? control?.enable({ emitEvent: false }) : control?.disable({ emitEvent: false });
    });
  }

  private buildGeneralDataPayload(): any {
    const v = this.hemorrhagicForm.getRawValue();
    const hospitalized = v.hospitalized === 1;
    const otherChronic = v.riskOtherChronicDisease === true;
    const knownNames = Object.values(GENERAL_CHRONIC_NAMES);
    const chronicIds: number[] = Object.entries(GENERAL_CHRONIC_NAMES)
      .filter(([field]) => v[field] === true && (field !== 'riskPregnancy' || this.showFemaleFields))
      .map(([, name]) => this.chronicDiseases.find((c) => this.normalize(c.arabicName) === name)?.id)
      .filter((id) => id != null);
    if (otherChronic) {
      const existingIds = new Set<number>((this.patient?.chronicDiseasesIds ?? []).map((x: any) => Number(x)));
      this.chronicDiseases
        .filter((c) => existingIds.has(Number(c.id)) && !knownNames.includes(this.normalize(c.arabicName)))
        .forEach((c) => chronicIds.push(c.id));
    }
    let another: string = otherChronic ? (v.riskOtherChronicDiseaseDetails ?? '').trim() : '';
    if (another && this.otherChronicPrefix && another.startsWith(this.otherChronicPrefix)) {
      another = another.slice(this.otherChronicPrefix.length).replace(/^[\s،,]+/, '').trim();
    }
    return {
      patientId: Number(this.currentId),
      hospitalEntryDate: hospitalized ? v.hospitalEntryDate : null,
      hospitalLeaveDate: hospitalized ? v.hospitalLeaveDate : null,
      infectionDate: v.infectionDate,
      finalResultId: v.finalResultId,
      chronicDiseasesIds: chronicIds.sort((x, y) => x - y),
      anotherChronicDisease: another || null,
    };
  }

  save(): void {
    const errors = this.validationErrors();
    if (errors.length) {
      this.userMsg.error(errors[0]);
      return;
    }
    const payload: any = { ...this.hemorrhagicForm.getRawValue() };
    payload.patientID = this.currentId;
    payload.diseaseGroupId = this.diseaseGroupID;
    this.clearInapplicable(payload);
    GENERAL_DATA_FIELDS.forEach((field) => delete payload[field]);
    if (!this.showFemaleFields) {
      payload.bleedingVaginal = false;
      payload.riskPregnancy = false;
      payload.pregnancyMonths = null;
    }
    this.calculateCompletionPercentage();
    payload.investigationCompletePercentage = parseFloat(
      ((this.allFilledControlsCount / (this.allControllesCount || 1)) * 100).toFixed(2)
    );

    const generalData = this.buildGeneralDataPayload();
    const generalDataJson = JSON.stringify(generalData);
    const generalData$ =
      generalDataJson !== this.generalDataSnapshot
        ? this.generalDataService.updateClinicalFromInvestigation(generalData)
        : of(null);
    generalData$
      .pipe(
        switchMap(() => {
          this.generalDataSnapshot = generalDataJson;
          return payload.id
            ? this.investigationService.updateHemorrhagicFever(payload)
            : this.investigationService.addInvestigationHemorrhagicFever(payload);
        })
      )
      .subscribe((response: any) => {
        if (!payload.id && response?.data?.id) {
          this.hemorrhagicForm.controls['id'].setValue(response.data.id);
        }
        this.translateService.get('NEDSS.COMMON.SENT_SUCESSFULLY').subscribe((msg: string) => this.userMsg.success(msg));
      });
  }

  private clearInapplicable(payload: any): void {
    FOLLOW_UPS.forEach(({ parent, value, fields }) => {
      if (payload[parent] !== value) {
        fields.forEach((field) => (payload[field] = CHECKBOX_FIELDS.includes(field) ? false : null));
      }
    });
    if (payload.hasTravelHistory !== 1) {
      ['abroadCountryId', 'abroadReturnDate', 'abroadTravelReason', 'insideGovernorateId', 'insideReturnDate', 'insideTravelReason'].forEach(
        (field) => (payload[field] = null)
      );
    }
    if (payload.touchedAbortionProducts !== 1) {
      payload.touchedAbortionProductsDate = null;
    }
  }

  calculateCompletionPercentage(): void {
    const v = this.hemorrhagicForm.getRawValue();
    const applicable = ['formDate', 'hospitalPhoneFax', 'hospitalized', 'infectionDate', 'finalResultId', 'yellowFeverVaccinated', 'hasTravelHistory', ...EXPOSURE_QUESTIONS, 'animalActivityOther', 'malariaRdtResult', 'surveillanceOfficerName'];
    FOLLOW_UPS.forEach(({ parent, value, fields }) => {
      if (v[parent] === value && !CHECKBOX_FIELDS.includes(parent)) {
        applicable.push(...fields.filter((field) => field !== 'transferredFromHospital'));
      }
    });
    const filled = applicable.filter((key) => v[key] !== null && v[key] !== undefined && v[key] !== '').length;
    this.allControllesCount = applicable.length;
    this.allFilledControlsCount = filled;
  }

  private loadCountries(): void {
    this.countriesLoading = true;
    this.lookupsService
      .getAllNationalitys()
      .pipe(finalize(() => (this.countriesLoading = false)))
      .subscribe((result: any) => (this.countries = result?.data ?? []));
  }

  private loadFinalResults(): void {
    this.finalResultsLoading = true;
    this.lookupsService
      .getAllFinalResults()
      .pipe(finalize(() => (this.finalResultsLoading = false)))
      .subscribe((result: any) => (this.finalResults = (result?.data ?? []).filter((x: any) => x?.id > 0)));
  }

  private loadGovernorates(): void {
    this.governoratesLoading = true;
    this.lookupsService
      .getAllGovernments()
      .pipe(finalize(() => (this.governoratesLoading = false)))
      .subscribe((result: any) => (this.governorates = result?.data ?? []));
  }

  private normalize(value: any): string {
    return String(value ?? '')
      .trim()
      .replace(/[أإآ]/g, 'ا')
      .replace(/ى/g, 'ي')
      .replace(/ة/g, 'ه')
      .replace(/\s+/g, ' ');
  }

  private dateValue(name: string): string | null {
    return this.toDateInput(this.hemorrhagicForm.get(name)?.value);
  }

  private toDateInput(value: any): string | null {
    return value ? this.datePipe.transform(value, 'yyyy-MM-dd') : null;
  }

  private addDays(date: string | null, days: number): string | null {
    if (!date) {
      return null;
    }
    const dt = new Date(date + 'T00:00:00');
    dt.setDate(dt.getDate() + days);
    return this.toDateInput(dt);
  }
}
