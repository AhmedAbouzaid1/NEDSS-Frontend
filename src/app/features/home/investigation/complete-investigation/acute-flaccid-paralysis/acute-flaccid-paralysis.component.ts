import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormArray, FormControl, FormGroup } from '@angular/forms';
import { UserMessageService } from 'src/app/core/services/user.message.service';
import { InvestigationService } from '../../services/investigation.service';
import { TranslateService } from '@ngx-translate/core';
import { DatePipe } from '@angular/common';
import { GeneralDataService } from '../../../general-data/services/general-data.service';
import { AgeType } from 'src/app/core/constants';

@Component({
  selector: 'app-acute-flaccid-paralysis',
  host: { class: 'investigation-form' },
  templateUrl: './acute-flaccid-paralysis.component.html',
  styleUrls: ['./acute-flaccid-paralysis.component.css'],
})
export class AcuteFlaccidParalysisComponent implements OnInit {
  currentLang =
    localStorage.getItem('ls.currentLang') !== undefined &&
      localStorage.getItem('ls.currentLang') !== 'undefined'
      ? localStorage.getItem('ls.currentLang')
      : 'ar';

  form: FormGroup;
  currentId: any;
  userName: string = '';

  allFilledControlsCount = 0;
  allControllesCount = 0;
  patientName: string = '';

  activeTab: 'clinical' | 'field' | 'vaccination' | 'survey' | 'aggregation' | 'followup' | 'contactSamples' = 'clinical';
  tabs = [
    { key: 'clinical', label: 'الفحص الاكلينيكي' },
    { key: 'field', label: 'التقصي الميداني للحالة' },
    { key: 'vaccination', label: 'موقف التطعيمات' },
    { key: 'survey', label: 'المسح الميداني' },
    { key: 'aggregation', label: 'تجمع الحالات' },
    { key: 'followup', label: 'المتابعة' },
    { key: 'contactSamples', label: 'عينات المخالطين' },
  ];

  routineDoseLabels = ['الصفرية', 'الأولى', 'الثانية', 'الثالثة', 'الرابعة', 'الخامسة', 'المنشطة'];

  // Dropdown option lists for the vaccination tab
  vaccineTypes = ['سابين', 'سولك', 'سابين+سولك', 'نوفل'];
  sources = ['سجلات', 'أقوال أم', 'ميكنة'];
  campaignTypes = ['قومية', 'محدودة', 'جرعة منشطة'];
  ageTypes = AgeType;
  labResults = ['سلبى', 'فيروس شلل أطفال شرس', 'فيروس سابين', 'فيروس معوي آخر'];

  contactSampleReasons = [
    { value: 1, label: 'عدم كفاية العينات' },
    { value: 2, label: 'حالة خطرة' },
    { value: 3, label: 'محافظة حدودية' },
  ];
  contactPeriods = [
    { value: 1, label: 'خلال أسبوع قبل الإصابة بالشلل' },
    { value: 2, label: 'بعد أسبوعين من الإصابة بالشلل' },
  ];
  labChecklist = [
    { key: 'labSampleQuantityOk', label: 'كمية العينة 8 جم' },
    { key: 'labCoolingOk', label: 'درجة التبريد 4-8 درجة مئوية' },
    { key: 'labNoLeakage', label: 'عدم وجود تسرب في انابيب جمع العينات' },
    { key: 'labColemanUsed', label: 'استخدام الكولمان الخاص بجمع العينات' },
    { key: 'labSpecialTubesUsed', label: 'استخدام الانابيب الخاصة بجمع العينات' },
    { key: 'labTempMonitorUsed', label: 'استخدام راصد للحرارة' },
    { key: 'labSamplesValid', label: 'اعتمادا على ما سبق هل العينات صالحة' },
  ];
  private contactSamplesKeys = [
    'contactSamplesCollectorName', 'contactSamplesDelivererName',
    'labSampleQuantityOk', 'labCoolingOk', 'labNoLeakage', 'labColemanUsed', 'labSpecialTubesUsed',
    'labTempMonitorUsed', 'labSamplesValid', 'labReceiverName', 'labReceiveDate', 'labReceiveTime', 'labNotes',
  ];

  initialClinicalDiagnoses = [
    { value: 1, label: 'متلازمة جيليان باري' },
    { value: 2, label: 'التهاب سحائي فيروسي' },
    { value: 3, label: 'التهاب النخاع المستعرض' },
    { value: 4, label: 'أمراض الوصلات العصبية العضلية' },
    { value: 5, label: 'التهاب فيروسي بالمخ' },
    { value: 6, label: 'التهاب العضلات الفيروسي' },
    { value: 7, label: 'نزلة معوية مع نقص البوتاسيوم' },
    { value: 8, label: 'الإصابة بفيروسات معوية أخرى' },
    { value: 9, label: 'التهاب الأعصاب الطرفية' },
    { value: 10, label: 'إصابة العصب الوركي نتيجة الحقن' },
    { value: 11, label: 'تشخيصات أخرى' },
  ];

  dangerousCaseReasons = [
    { value: 1, label: 'وجود احساس بالأعضاء المصابة' },
    { value: 2, label: 'اكتمال الشلل خلال 4 ايام' },
    { value: 3, label: 'وجود حرارة' },
    { value: 4, label: 'عدم تناظر الأعضاء المصابة' },
    { value: 5, label: 'أخرى' },
  ];

  readonly dangerousCaseOtherCode = 5;

  private arrayKeys = [
    'caseMovements', 'previousCases', 'highRiskAreas', 'healthFacilityVisits', 'visitors', 'residenceAfpCases', 'facilityActions',
    'routineVaccinations', 'campaigns', 'surveyChildren', 'aggregatedCases', 'followupCommittee',
    'selectedDangerousCaseReasons', 'contactSamples',
  ];
  private coreKeys = ['id', 'patientID', 'diseaseGroupID', 'investigationCompletePercentage', 'caseCodeDisplay'];

  private dateFields = new Set([
    'homeVisitDate', 'entryDate', 'paralysisOnsetDate', 'paralysisCompletionDate', 'investigationDate',
    'onsetFeverDate', 'onsetDiarrheaDate', 'onsetVomitingDate', 'onsetCoryzaDate',
    'behaviorDose1Date', 'behaviorDose2Date', 'surveyVisitDate',
    'followupDate', 'deathDate', 'labReceiveDate',
  ]);

  constructor(
    private investigationService: InvestigationService,
    private translateService: TranslateService,
    private userMsg: UserMessageService,
    private datePipe: DatePipe,
    private generalDataService: GeneralDataService
  ) { }

  ngOnInit() {
    try {
      this.userName = JSON.parse(localStorage.getItem('ls.authorizationData'))?.userName || '';
    } catch { this.userName = ''; }

    this.form = new FormGroup({
      // Core
      id: new FormControl(),
      patientID: new FormControl(),
      diseaseGroupID: new FormControl(this.investigationService.diseaseGroupID),
      investigationCompletePercentage: new FormControl(),

      // Header
      caseCodeDisplay: new FormControl(),
      homeVisitDate: new FormControl(),
      entryDate: new FormControl(),

      // Tab 0 - clinical examination
      paralysisOnsetDate: new FormControl(),
      paralysisCompletionDate: new FormControl(),
      paralysisCompletedWithin4Days: new FormControl(),
      paralysisSinceBirth: new FormControl(),
      paralysisDueToAccident: new FormControl(),
      paralysisAccidentCause: new FormControl(),
      injectionBeforeParalysis: new FormControl(),
      injectionBodySite: new FormControl(),
      injectionFacility: new FormControl(),
      injectionFacilityAwareness: new FormControl(),
      paralysisSiteRightArm: new FormControl(false),
      paralysisSiteRightLeg: new FormControl(false),
      paralysisSiteLeftArm: new FormControl(false),
      paralysisSiteLeftLeg: new FormControl(false),
      paralysisSiteOther: new FormControl(),
      asymmetry: new FormControl(),
      paralyzedPartFlaccid: new FormControl(),
      intactSensation: new FormControl(),
      musclePain: new FormControl(),
      onsetFever: new FormControl(),
      onsetFeverDate: new FormControl(),
      onsetDiarrhea: new FormControl(),
      onsetDiarrheaDate: new FormControl(),
      onsetVomiting: new FormControl(),
      onsetVomitingDate: new FormControl(),
      onsetCoryza: new FormControl(),
      onsetCoryzaDate: new FormControl(),
      sphincterControl: new FormControl(),
      neckStiffness: new FormControl(),
      convulsions: new FormControl(),
      babinskiSign: new FormControl(),
      reflexes: new FormControl(),
      muscleTone: new FormControl(),
      otherClinicalSigns: new FormControl(),
      initialClinicalDiagnosis: new FormControl(),
      otherInitialClinicalDiagnosis: new FormControl(),

      // Tab 1 - field investigation
      investigationDate: new FormControl(),
      investigatingPhysicianName: new FormControl(),
      isDangerousCase: new FormControl(),
      selectedDangerousCaseReasons: new FormControl([]),
      otherDangerousCaseReason: new FormControl(),
      caseMovements: new FormArray([]),
      hasPreviousAfpCases: new FormControl(),
      previousCases: new FormArray([]),
      hasHighRiskAreas: new FormControl(),
      highRiskAreas: new FormArray([]),
      visitedHealthFacility: new FormControl(),
      healthFacilityVisits: new FormArray([]),
      visitors: new FormArray([]),
      residenceAfpCases: new FormArray([]),
      facilityActions: new FormArray([]),

      // Tab 2 - vaccination
      routineVaccinations: new FormArray([]),
      campaigns: new FormArray([]),
      behaviorDose1Date: new FormControl(),
      behaviorDose1Source: new FormControl(),
      behaviorDose2Date: new FormControl(),
      behaviorDose2Source: new FormControl(),

      // Tab 3 - field survey
      surveyVisitDate: new FormControl(),
      surveySquareNumber: new FormControl(),
      surveyMonth: new FormControl(),
      surveyChildren: new FormArray([]),
      covUnitDose3Target: new FormControl(),
      covUnitDose3Vaccinated: new FormControl(),
      covUnitDose4Target: new FormControl(),
      covUnitDose4Vaccinated: new FormControl(),
      covUnitBoosterTarget: new FormControl(),
      covUnitBoosterVaccinated: new FormControl(),
      covAdminDose3Target: new FormControl(),
      covAdminDose3Vaccinated: new FormControl(),
      covAdminDose4Target: new FormControl(),
      covAdminDose4Vaccinated: new FormControl(),
      covAdminBoosterTarget: new FormControl(),
      covAdminBoosterVaccinated: new FormControl(),

      // Tab 4 - case aggregation
      aggregatedCases: new FormArray([]),

      // Tab 5 - follow-up
      followupDate: new FormControl(),
      labResult: new FormControl(),
      patientStatus: new FormControl(),
      hasResidualParalysis: new FormControl(false),
      hasMuscleAtrophy: new FormControl(false),
      hasSensationInAffected: new FormControl(false),
      deathDate: new FormControl(),
      ctMri: new FormControl(),
      myelographEmg: new FormControl(),
      csf: new FormControl(),
      followupCommittee: new FormArray([]),

      // Tab 6 - contact samples
      contactSamples: new FormArray([]),
      contactSamplesCollectorName: new FormControl(),
      contactSamplesDelivererName: new FormControl(),
      labSampleQuantityOk: new FormControl(),
      labCoolingOk: new FormControl(),
      labNoLeakage: new FormControl(),
      labColemanUsed: new FormControl(),
      labSpecialTubesUsed: new FormControl(),
      labTempMonitorUsed: new FormControl(),
      labSamplesValid: new FormControl(),
      labReceiverName: new FormControl(),
      labReceiveDate: new FormControl(),
      labReceiveTime: new FormControl(),
      labNotes: new FormControl(),
    });

    this.form.valueChanges.subscribe(() => this.calculateCompletionPercentage());
    this.form.controls['initialClinicalDiagnosis'].valueChanges.subscribe((value) => {
      if (Number(value) !== 11) {
        this.form.controls['otherInitialClinicalDiagnosis'].setValue(null, { emitEvent: false });
      }
    });
    this.form.controls['paralysisOnsetDate'].valueChanges.subscribe(() => this.updateCompletedWithin4Days());
    this.form.controls['paralysisCompletionDate'].valueChanges.subscribe(() => this.updateCompletedWithin4Days());
    this.form.controls['isDangerousCase'].valueChanges.subscribe((value) => {
      if (Number(value) !== 1) {
        this.form.controls['selectedDangerousCaseReasons'].setValue([], { emitEvent: false });
        this.form.controls['otherDangerousCaseReason'].setValue(null, { emitEvent: false });
      }
    });
    this.form.controls['selectedDangerousCaseReasons'].valueChanges.subscribe((value) => {
      if (!(value || []).includes(this.dangerousCaseOtherCode)) {
        this.form.controls['otherDangerousCaseReason'].setValue(null, { emitEvent: false });
      }
    });

    this.currentId = this.investigationService.currentid;
    this.patientName =
      (this.investigationService.patient?.firstName || '') + ' ' +
      (this.investigationService.patient?.secondName || '') + ' ' +
      (this.investigationService.patient?.thirdName || '');
    this.form.controls['patientID'].setValue(this.currentId);

    this.loadPatientHeader();
    this.loadExistingRecord();
  }

  // ===================== Header =====================
  private loadPatientHeader() {
    if (!this.currentId) return;
    this.generalDataService.getBy(this.currentId).subscribe((res: any) => {
      const p = res?.data;
      if (p?.homeVisitDate && !this.form.value.homeVisitDate) {
        this.form.controls['homeVisitDate'].setValue(this.d(p.homeVisitDate));
      }
    });
  }

  private updateCompletedWithin4Days() {
    const onset = this.form.controls['paralysisOnsetDate'].value;
    const completion = this.form.controls['paralysisCompletionDate'].value;
    if (!onset || !completion) return;
    const days = (new Date(completion).getTime() - new Date(onset).getTime()) / 86400000;
    if (days < 0) return;
    this.form.controls['paralysisCompletedWithin4Days'].setValue(days <= 4 ? 1 : 2);
  }

  private todayStr(): string { return this.datePipe.transform(new Date(), 'yyyy-MM-dd') as string; }
  private d(x: any) { return x ? this.datePipe.transform(x, 'yyyy-MM-dd') : null; }

  // ===================== Load =====================
  private loadExistingRecord() {
    this.investigationService.getByIdAcuteFlaccidParalysis(this.currentId).subscribe(
      (res) => {
        const v = res?.data;
        if (v) this.patchFromRecord(v);
        if (!this.form.value.entryDate) this.form.controls['entryDate'].setValue(this.todayStr());
        this.ensureDefaultRows();
        this.calculateCompletionPercentage();
      },
      () => {
        if (!this.form.value.entryDate) this.form.controls['entryDate'].setValue(this.todayStr());
        this.ensureDefaultRows();
      }
    );
  }

  private patchFromRecord(v: any) {
    const patch: any = {};
    Object.keys(this.form.controls).forEach((key) => {
      if (this.arrayKeys.includes(key)) return;
      if (v[key] === undefined) return;
      patch[key] = this.dateFields.has(key) && v[key] ? this.d(v[key]) : v[key];
    });
    if (!patch.paralysisOnsetDate && v.paralysisStartDate) patch.paralysisOnsetDate = this.d(v.paralysisStartDate);
    this.form.patchValue(patch);
    this.form.controls['caseCodeDisplay'].setValue(v.caseCode ?? null);
    this.form.controls['selectedDangerousCaseReasons'].setValue(
      Number(v.isDangerousCase) === 1
        ? this.parseJsonArray(v.dangerousCaseReasonsJson)
        : []
    );

    this.parseInto(v.caseMovementsJson, (x) => this.caseMovements.push(this.buildCaseMovement(x)));
    this.parseInto(v.previousCasesJson, (x) => this.previousCases.push(this.buildPreviousCase(x)));
    this.parseInto(v.highRiskAreasJson, (x) => this.highRiskAreas.push(this.buildHighRiskArea(x)));
    this.parseInto(v.healthFacilityVisitsJson, (x) => this.healthFacilityVisits.push(this.buildFacilityVisit(x)));
    this.parseInto(v.visitorsJson, (x) => this.visitors.push(this.buildVisitor(x)));
    this.parseInto(v.residenceAfpCasesJson, (x) => this.residenceAfpCases.push(this.buildPreviousCase(x)));
    this.parseInto(v.facilityActionsJson, (x) => this.facilityActions.push(this.buildFacilityAction(x)));
    if (this.facilityActions.length === 0) {
      this.parseInto(v.healthFacilityVisitsJson, (x) => {
        if (x?.actions || x?.inspectionDate) {
          this.facilityActions.push(this.buildFacilityAction({ facilityName: x.facilityName, actions: x.actions, date: x.inspectionDate }));
        }
      });
    }
    this.parseInto(v.routineVaccinationsJson, (x) => this.routineVaccinations.push(this.buildRoutine(x.doseLabel, x)));
    this.parseInto(v.campaignsJson, (x) => this.campaigns.push(this.buildCampaign(x)));
    this.parseInto(v.surveyChildrenJson, (x) => this.surveyChildren.push(this.buildSurveyChild(x)));
    this.parseInto(v.aggregatedCasesJson, (x) => this.aggregatedCases.push(this.buildAggregatedCase(x)));
    this.parseInto(v.followupCommitteeJson, (x) => this.followupCommittee.push(this.buildCommittee(x)));
    this.parseInto(v.contactSamplesJson, (x) => this.contactSamples.push(this.buildContactSample(x)));
  }

  private parseInto(json: string, push: (item: any) => void) {
    if (!json) return;
    try { (JSON.parse(json) || []).forEach((it: any) => push(it)); } catch (e) { }
  }

  private parseJsonArray(json: string): any[] {
    if (!json) return [];
    try {
      const value = JSON.parse(json);
      return Array.isArray(value) ? value : [];
    } catch {
      return [];
    }
  }

  // ===================== FormArray accessors =====================
  get caseMovements(): FormArray { return this.form.get('caseMovements') as FormArray; }
  get previousCases(): FormArray { return this.form.get('previousCases') as FormArray; }
  get highRiskAreas(): FormArray { return this.form.get('highRiskAreas') as FormArray; }
  get healthFacilityVisits(): FormArray { return this.form.get('healthFacilityVisits') as FormArray; }
  get visitors(): FormArray { return this.form.get('visitors') as FormArray; }
  get residenceAfpCases(): FormArray { return this.form.get('residenceAfpCases') as FormArray; }
  get facilityActions(): FormArray { return this.form.get('facilityActions') as FormArray; }
  get routineVaccinations(): FormArray { return this.form.get('routineVaccinations') as FormArray; }
  get campaigns(): FormArray { return this.form.get('campaigns') as FormArray; }
  get surveyChildren(): FormArray { return this.form.get('surveyChildren') as FormArray; }
  get aggregatedCases(): FormArray { return this.form.get('aggregatedCases') as FormArray; }
  get followupCommittee(): FormArray { return this.form.get('followupCommittee') as FormArray; }
  get contactSamples(): FormArray { return this.form.get('contactSamples') as FormArray; }

  private legacySurveyAge(s: any): { age: any; ageTypeId: number | null } {
    if (s.age !== undefined || s.ageTypeId !== undefined) {
      return { age: s.age ?? null, ageTypeId: s.ageTypeId ?? null };
    }
    const has = (x: any) => x !== null && x !== undefined && x !== '';
    const years = has(s.ageYear) ? Number(s.ageYear) : null;
    const months = has(s.ageMonth) ? Number(s.ageMonth) : null;
    if (years && months) return { age: years * 12 + months, ageTypeId: 2 };
    if (years !== null && !months) return { age: years, ageTypeId: 3 };
    if (months !== null) return { age: months, ageTypeId: 2 };
    return { age: null, ageTypeId: null };
  }

  // ===================== Card expand / collapse =====================
  setTab(tab: any) { this.activeTab = tab; }

  // ===================== Row builders =====================
  private buildCaseMovement(m: any = {}): FormGroup {
    const group = new FormGroup<any>({
      address: new FormControl(m.address ?? null),
      fromDate: new FormControl(this.d(m.fromDate ?? m.visitDate)),
      toDate: new FormControl(this.d(m.toDate)),
    });
    ['contactPlace', 'hasCases', 'caseData'].forEach((key) => {
      if (m[key] != null) group.addControl(key, new FormControl(m[key]));
    });
    return group;
  }
  private buildPreviousCase(p: any = {}): FormGroup {
    const group = new FormGroup<any>({
      contactName: new FormControl(p.contactName ?? null),
      address: new FormControl(p.address ?? null),
      paralysisOnsetDate: new FormControl(this.d(p.paralysisOnsetDate)),
    });
    this.keepLegacy(group, p, ['residenceScope', 'caseCode']);
    return group;
  }
  private buildVisitor(v: any = {}): FormGroup {
    return new FormGroup({
      visitorNameRelation: new FormControl(v.visitorNameRelation ?? null),
      residenceArea: new FormControl(v.residenceArea ?? null),
      fromDate: new FormControl(this.d(v.fromDate)),
      toDate: new FormControl(this.d(v.toDate)),
    });
  }
  private buildFacilityAction(x: any = {}): FormGroup {
    return new FormGroup({
      facilityName: new FormControl(x.facilityName ?? null),
      actions: new FormControl(x.actions ?? null),
      date: new FormControl(this.d(x.date)),
    });
  }
  private keepLegacy(group: FormGroup, source: any, keys: string[]) {
    keys.forEach((key) => {
      if (source[key] != null) group.addControl(key, new FormControl(source[key]));
    });
  }
  private buildHighRiskArea(a: any = {}): FormGroup {
    return new FormGroup({
      visitDate: new FormControl(this.d(a.visitDate)),
      areaDescription: new FormControl(a.areaDescription ?? null),
      classificationReason: new FormControl(a.classificationReason ?? null),
      address: new FormControl(a.address ?? null),
      hasCases: new FormControl(a.hasCases ?? null),
      caseData: new FormControl(a.caseData ?? null),
    });
  }
  private buildFacilityVisit(f: any = {}): FormGroup {
    const facilityName = [f.facilityName, f.doctor].filter((x) => x != null && `${x}`.trim() !== '').join(' - ');
    const group = new FormGroup<any>({
      facilityName: new FormControl(facilityName || null),
      address: new FormControl(f.address ?? null),
      visitDate: new FormControl(this.d(f.visitDate)),
      visitToDate: new FormControl(this.d(f.visitToDate)),
      immediateReport: new FormControl(f.immediateReport ?? null),
    });
    this.keepLegacy(group, f, ['facilityType']);
    return group;
  }
  private buildRoutine(label: string, r: any = {}): FormGroup {
    return new FormGroup({
      doseLabel: new FormControl(label),
      vaccineType: new FormControl(r.vaccineType ?? null),
      date: new FormControl(this.d(r.date)),
      source: new FormControl(r.source ?? null),
    });
  }
  private buildCampaign(c: any = {}): FormGroup {
    return new FormGroup({
      campaignDate: new FormControl(this.d(c.campaignDate)),
      campaignType: new FormControl(c.campaignType ?? null),
      vaccineType: new FormControl(c.vaccineType ?? null),
      source: new FormControl(c.source ?? null),
    });
  }
  private buildSurveyChild(s: any = {}): FormGroup {
    const age = this.legacySurveyAge(s);
    return new FormGroup({
      name: new FormControl(s.name ?? null),
      age: new FormControl(age.age),
      ageTypeId: new FormControl(age.ageTypeId),
      dose0: new FormControl(!!s.dose0),
      dose1: new FormControl(!!s.dose1),
      dose2: new FormControl(!!s.dose2),
      dose3: new FormControl(!!s.dose3),
      dose4: new FormControl(!!s.dose4),
      dose5: new FormControl(!!s.dose5),
      booster: new FormControl(!!s.booster),
      feverRash: new FormControl(s.feverRash ?? null),
      date: new FormControl(this.d(s.date)),
      phone: new FormControl(s.phone ?? null),
      long: new FormControl(s.long ?? null),
      lat: new FormControl(s.lat ?? null),
    });
  }
  private buildAggregatedCase(a: any = {}): FormGroup {
    return new FormGroup({
      caseCode: new FormControl(a.caseCode ?? null),
      name: new FormControl(a.name ?? null),
      unit: new FormControl(a.unit ?? null),
      age: new FormControl(a.age ?? null),
      ageTypeId: new FormControl(a.ageTypeId ?? null),
    });
  }
  private buildContactSample(c: any = {}): FormGroup {
    return new FormGroup({
      sampleReason: new FormControl(c.sampleReason ?? null),
      name: new FormControl(c.name ?? null),
      age: new FormControl(c.age ?? null),
      ageTypeId: new FormControl(c.ageTypeId ?? null),
      genderId: new FormControl(c.genderId ?? null),
      relationship: new FormControl(c.relationship ?? null),
      contactPeriod: new FormControl(c.contactPeriod ?? null),
      routineDoses: new FormControl(c.routineDoses ?? null),
      campaignDoses: new FormControl(c.campaignDoses ?? null),
      ipvDoses: new FormControl(c.ipvDoses ?? null),
      lastDoseDate: new FormControl(this.d(c.lastDoseDate)),
      sampleCollectionDate: new FormControl(this.d(c.sampleCollectionDate)),
      sampleSendDate: new FormControl(this.d(c.sampleSendDate)),
    });
  }
  private buildCommittee(c: any = {}): FormGroup {
    return new FormGroup({
      name: new FormControl(c.name ?? null),
      position: new FormControl(c.position ?? null),
      date: new FormControl(this.d(c.date)),
    });
  }

  // ===================== Defaults =====================
  private ensureDefaultRows() {
    if (this.routineVaccinations.length === 0) {
      this.routineDoseLabels.forEach((l) => this.routineVaccinations.push(this.buildRoutine(l)));
    }
    if (this.caseMovements.length === 0) this.addCaseMovement();
    if (this.previousCases.length === 0) this.addPreviousCase();
    if (this.visitors.length === 0) this.addVisitor();
    if (this.residenceAfpCases.length === 0) this.addResidenceAfpCase();
    if (this.facilityActions.length === 0) this.addFacilityAction();
    if (this.healthFacilityVisits.length === 0) this.addFacilityVisit();
    if (this.campaigns.length === 0) this.addCampaign();
    if (this.surveyChildren.length === 0) this.addSurveyChild();
    if (this.aggregatedCases.length === 0) this.addAggregatedCase();
    if (this.followupCommittee.length === 0) this.addCommittee();
    if (this.contactSamples.length === 0) this.addContactSample();
  }

  private removeAt(arr: FormArray, i: number) { arr.removeAt(i); }

  addCaseMovement() { this.caseMovements.push(this.buildCaseMovement()); }
  removeCaseMovement(i: number) { this.removeAt(this.caseMovements, i); }
  addPreviousCase() { this.previousCases.push(this.buildPreviousCase()); }
  removePreviousCase(i: number) { this.removeAt(this.previousCases, i); }
  addVisitor() { this.visitors.push(this.buildVisitor()); }
  removeVisitor(i: number) { this.removeAt(this.visitors, i); }
  addResidenceAfpCase() { this.residenceAfpCases.push(this.buildPreviousCase()); }
  removeResidenceAfpCase(i: number) { this.removeAt(this.residenceAfpCases, i); }
  addFacilityAction() { this.facilityActions.push(this.buildFacilityAction()); }
  removeFacilityAction(i: number) { this.removeAt(this.facilityActions, i); }
  addFacilityVisit() { this.healthFacilityVisits.push(this.buildFacilityVisit()); }
  removeFacilityVisit(i: number) { this.removeAt(this.healthFacilityVisits, i); }
  addCampaign() { this.campaigns.push(this.buildCampaign()); }
  removeCampaign(i: number) { this.removeAt(this.campaigns, i); }
  addSurveyChild() { this.surveyChildren.push(this.buildSurveyChild()); }
  removeSurveyChild(i: number) { this.removeAt(this.surveyChildren, i); }
  addAggregatedCase() { this.aggregatedCases.push(this.buildAggregatedCase()); }
  removeAggregatedCase(i: number) { this.removeAt(this.aggregatedCases, i); }
  copyAggregatedCase() {
    const last = this.aggregatedCases.at(this.aggregatedCases.length - 1);
    this.aggregatedCases.push(this.buildAggregatedCase(last ? last.value : {}));
  }
  addCommittee() { this.followupCommittee.push(this.buildCommittee()); }
  removeCommittee(i: number) { this.removeAt(this.followupCommittee, i); }
  addContactSample() { this.contactSamples.push(this.buildContactSample()); }
  removeContactSample(i: number) {
    this.removeAt(this.contactSamples, i);
    if (this.contactSamples.length === 0) this.addContactSample();
  }

  // ===================== Save =====================
  save() {
    this.form.controls['diseaseGroupID'].setValue(this.investigationService.diseaseGroupID);
    this.calculateCompletionPercentage();
    this.form.controls['investigationCompletePercentage'].setValue(
      this.allControllesCount === 0
        ? 0
        : parseFloat(((this.allFilledControlsCount / this.allControllesCount) * 100).toFixed(2))
    );

    const value = this.form.value;
    const payload: any = {};
    Object.keys(value).forEach((key) => {
      if (this.arrayKeys.includes(key)) return;
      payload[key] = value[key] === '' ? null : value[key];
    });
    payload.paralysisStartDate = payload.paralysisOnsetDate;
    payload.caseMovementsJson = JSON.stringify(value.caseMovements || []);
    payload.previousCasesJson = JSON.stringify(value.previousCases || []);
    payload.highRiskAreasJson = JSON.stringify(value.highRiskAreas || []);
    payload.healthFacilityVisitsJson = JSON.stringify(value.healthFacilityVisits || []);
    payload.facilityActionsJson = JSON.stringify(value.facilityActions || []);
    payload.visitorsJson = JSON.stringify(value.visitors || []);
    payload.residenceAfpCasesJson = JSON.stringify(value.residenceAfpCases || []);
    payload.routineVaccinationsJson = JSON.stringify(value.routineVaccinations || []);
    payload.campaignsJson = JSON.stringify(value.campaigns || []);
    payload.surveyChildrenJson = JSON.stringify(value.surveyChildren || []);
    payload.aggregatedCasesJson = JSON.stringify(value.aggregatedCases || []);
    payload.followupCommitteeJson = JSON.stringify(value.followupCommittee || []);
    payload.contactSamplesJson = JSON.stringify(
      (value.contactSamples || []).filter((row: any) =>
        Object.values(row || {}).some((x) => x !== null && x !== undefined && `${x}`.trim() !== '')
      )
    );
    payload.dangerousCaseReasonsJson = JSON.stringify(
      Number(value.isDangerousCase) === 1
        ? value.selectedDangerousCaseReasons || []
        : []
    );

    const ok = () =>
      this.translateService.get('NEDSS.COMMON.SENT_SUCESSFULLY').subscribe((r: string) => this.userMsg.success(r));

    if (payload.id != null) {
      this.investigationService.updateAcuteFlaccidParalysis(payload).subscribe((r: any) => r && ok(), () => { });
    } else {
      this.investigationService.addInvestigationAcuteFlaccidParalysis(payload).subscribe((r: any) => r && ok(), () => { });
    }
  }

  calculateCompletionPercentage(): void {
    const data = this.form?.value ?? {};
    const excluded = new Set([...this.coreKeys, ...this.arrayKeys, ...this.contactSamplesKeys, 'createdDate']);
    const baseFields = Object.keys(data).filter((k) => !excluded.has(k));
    const filled = baseFields.reduce((acc, k) => {
      const val = data[k];
      return (val !== null && val !== '' && val !== 'null' && val !== false && val !== undefined) ? acc + 1 : acc;
    }, 0);
    this.allControllesCount = baseFields.length;
    this.allFilledControlsCount = filled;
  }
}
