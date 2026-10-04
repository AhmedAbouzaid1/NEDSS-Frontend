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

  activeTab: 'field' | 'vaccination' | 'survey' | 'aggregation' | 'followup' = 'field';
  tabs = [
    { key: 'field', label: 'التقصي الميداني للحالة' },
    { key: 'vaccination', label: 'موقف التطعيمات' },
    { key: 'survey', label: 'المسح الميداني' },
    { key: 'aggregation', label: 'تجمع الحالات' },
    { key: 'followup', label: 'المتابعة' },
  ];

  routineDoseLabels = ['الصفرية', 'الأولى', 'الثانية', 'الثالثة', 'الرابعة', 'الخامسة', 'المنشطة'];

  // Dropdown option lists for the vaccination tab
  vaccineTypes = ['سابين', 'سولك', 'سابين+سولك', 'نوفل'];
  sources = ['سجلات', 'أقوال أم', 'ميكنة'];
  campaignTypes = ['قومية', 'محدودة', 'جرعة منشطة'];
  ageTypes = AgeType;
  labResults = ['سلبى', 'فيروس شلل أطفال شرس', 'فيروس سابين', 'فيروس معوي آخر'];

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
    { value: 1, label: 'وجود إحساس بالأعضاء المصابة' },
    { value: 2, label: 'اكتمال الشلل خلال 4 أيام' },
    { value: 3, label: 'وجود حرارة' },
    { value: 4, label: 'عدم تناظر الأعضاء المصابة' },
  ];

  private openRows = new Set<AbstractControl>();

  private arrayKeys = [
    'caseMovements', 'previousCases', 'highRiskAreas', 'healthFacilityVisits',
    'routineVaccinations', 'campaigns', 'surveyChildren', 'aggregatedCases', 'followupCommittee',
    'selectedDangerousCaseReasons',
  ];
  private coreKeys = ['id', 'patientID', 'diseaseGroupID', 'investigationCompletePercentage', 'caseCodeDisplay'];

  private dateFields = new Set([
    'homeVisitDate', 'entryDate', 'paralysisOnsetDate', 'investigationDate',
    'behaviorDose1Date', 'behaviorDose2Date', 'surveyVisitDate',
    'paralysisStartDate', 'followupDate', 'deathDate',
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

      // Tab 1 - field investigation
      paralysisOnsetDate: new FormControl(),
      investigationDate: new FormControl(),
      investigatingPhysicianName: new FormControl(),
      initialClinicalDiagnosis: new FormControl(),
      otherInitialClinicalDiagnosis: new FormControl(),
      isDangerousCase: new FormControl(),
      selectedDangerousCaseReasons: new FormControl([]),
      caseMovements: new FormArray([]),
      hasPreviousAfpCases: new FormControl(),
      previousCases: new FormArray([]),
      hasHighRiskAreas: new FormControl(),
      highRiskAreas: new FormArray([]),
      visitedHealthFacility: new FormControl(),
      healthFacilityVisits: new FormArray([]),

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
      paralysisStartDate: new FormControl(),
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
    });

    this.form.valueChanges.subscribe(() => this.calculateCompletionPercentage());
    this.form.controls['initialClinicalDiagnosis'].valueChanges.subscribe((value) => {
      if (Number(value) !== 11) {
        this.form.controls['otherInitialClinicalDiagnosis'].setValue(null, { emitEvent: false });
      }
    });
    this.form.controls['isDangerousCase'].valueChanges.subscribe((value) => {
      if (Number(value) !== 1) {
        this.form.controls['selectedDangerousCaseReasons'].setValue([], { emitEvent: false });
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
    this.parseInto(v.routineVaccinationsJson, (x) => this.routineVaccinations.push(this.buildRoutine(x.doseLabel, x)));
    this.parseInto(v.campaignsJson, (x) => this.campaigns.push(this.buildCampaign(x)));
    this.parseInto(v.surveyChildrenJson, (x) => this.surveyChildren.push(this.buildSurveyChild(x)));
    this.parseInto(v.aggregatedCasesJson, (x) => this.aggregatedCases.push(this.buildAggregatedCase(x)));
    this.parseInto(v.followupCommitteeJson, (x) => this.followupCommittee.push(this.buildCommittee(x)));
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
  get routineVaccinations(): FormArray { return this.form.get('routineVaccinations') as FormArray; }
  get campaigns(): FormArray { return this.form.get('campaigns') as FormArray; }
  get surveyChildren(): FormArray { return this.form.get('surveyChildren') as FormArray; }
  get aggregatedCases(): FormArray { return this.form.get('aggregatedCases') as FormArray; }
  get followupCommittee(): FormArray { return this.form.get('followupCommittee') as FormArray; }

  // ===================== Display helpers (summary tables) =====================
  yesNo(v: any): string { return String(v) === '1' ? 'نعم' : String(v) === '2' ? 'لا' : ''; }
  mark(v: any): string { return v ? '✓' : ''; }
  ageLabel(v: any): string {
    if (v?.age === null || v?.age === undefined || v?.age === '') return '';
    const type = AgeType.find((t) => t.id != null && t.id === Number(v.ageTypeId));
    return type ? `${v.age} ${type.arabicName}` : `${v.age}`;
  }

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
  toggleRow(c: AbstractControl) { this.openRows.has(c) ? this.openRows.delete(c) : this.openRows.add(c); }
  isRowOpen(c: AbstractControl): boolean { return this.openRows.has(c); }

  // ===================== Row builders =====================
  private buildCaseMovement(m: any = {}): FormGroup {
    return new FormGroup({
      visitDate: new FormControl(this.d(m.visitDate)),
      contactPlace: new FormControl(m.contactPlace ?? null),
      address: new FormControl(m.address ?? null),
      hasCases: new FormControl(m.hasCases ?? null),
      caseData: new FormControl(m.caseData ?? null),
    });
  }
  private buildPreviousCase(p: any = {}): FormGroup {
    return new FormGroup({
      contactName: new FormControl(p.contactName ?? null),
      paralysisOnsetDate: new FormControl(this.d(p.paralysisOnsetDate)),
      residenceScope: new FormControl(p.residenceScope ?? null),
      address: new FormControl(p.address ?? null),
      caseCode: new FormControl(p.caseCode ?? null),
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
    return new FormGroup({
      visitDate: new FormControl(this.d(f.visitDate)),
      doctor: new FormControl(f.doctor ?? null),
      facilityType: new FormControl(f.facilityType ?? null),
      facilityName: new FormControl(f.facilityName ?? null),
      address: new FormControl(f.address ?? null),
      immediateReport: new FormControl(f.immediateReport ?? null),
      actions: new FormControl(f.actions ?? null),
      inspectionDate: new FormControl(this.d(f.inspectionDate)),
    });
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
    if (this.highRiskAreas.length === 0) this.addHighRiskArea();
    if (this.healthFacilityVisits.length === 0) this.addFacilityVisit();
    if (this.campaigns.length === 0) this.addCampaign();
    if (this.surveyChildren.length === 0) this.addSurveyChild();
    if (this.aggregatedCases.length === 0) this.addAggregatedCase();
    if (this.followupCommittee.length === 0) this.addCommittee();
  }

  private pushOpen(arr: FormArray, g: FormGroup) { arr.push(g); this.openRows.add(g); }
  private removeAt(arr: FormArray, i: number) { this.openRows.delete(arr.at(i)); arr.removeAt(i); }

  addCaseMovement() { this.pushOpen(this.caseMovements, this.buildCaseMovement()); }
  removeCaseMovement(i: number) { this.removeAt(this.caseMovements, i); }
  addPreviousCase() { this.pushOpen(this.previousCases, this.buildPreviousCase()); }
  removePreviousCase(i: number) { this.removeAt(this.previousCases, i); }
  addHighRiskArea() { this.pushOpen(this.highRiskAreas, this.buildHighRiskArea()); }
  removeHighRiskArea(i: number) { this.removeAt(this.highRiskAreas, i); }
  addFacilityVisit() { this.pushOpen(this.healthFacilityVisits, this.buildFacilityVisit()); }
  removeFacilityVisit(i: number) { this.removeAt(this.healthFacilityVisits, i); }
  addCampaign() { this.pushOpen(this.campaigns, this.buildCampaign()); }
  removeCampaign(i: number) { this.removeAt(this.campaigns, i); }
  addSurveyChild() { this.pushOpen(this.surveyChildren, this.buildSurveyChild()); }
  removeSurveyChild(i: number) { this.removeAt(this.surveyChildren, i); }
  addAggregatedCase() { this.pushOpen(this.aggregatedCases, this.buildAggregatedCase()); }
  removeAggregatedCase(i: number) { this.removeAt(this.aggregatedCases, i); }
  copyAggregatedCase() {
    const last = this.aggregatedCases.at(this.aggregatedCases.length - 1);
    this.pushOpen(this.aggregatedCases, this.buildAggregatedCase(last ? last.value : {}));
  }
  addCommittee() { this.pushOpen(this.followupCommittee, this.buildCommittee()); }
  removeCommittee(i: number) { this.removeAt(this.followupCommittee, i); }

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
    payload.caseMovementsJson = JSON.stringify(value.caseMovements || []);
    payload.previousCasesJson = JSON.stringify(value.previousCases || []);
    payload.highRiskAreasJson = JSON.stringify(value.highRiskAreas || []);
    payload.healthFacilityVisitsJson = JSON.stringify(value.healthFacilityVisits || []);
    payload.routineVaccinationsJson = JSON.stringify(value.routineVaccinations || []);
    payload.campaignsJson = JSON.stringify(value.campaigns || []);
    payload.surveyChildrenJson = JSON.stringify(value.surveyChildren || []);
    payload.aggregatedCasesJson = JSON.stringify(value.aggregatedCases || []);
    payload.followupCommitteeJson = JSON.stringify(value.followupCommittee || []);
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
    const excluded = new Set([...this.coreKeys, ...this.arrayKeys, 'createdDate']);
    const baseFields = Object.keys(data).filter((k) => !excluded.has(k));
    const filled = baseFields.reduce((acc, k) => {
      const val = data[k];
      return (val !== null && val !== '' && val !== 'null' && val !== false && val !== undefined) ? acc + 1 : acc;
    }, 0);
    this.allControllesCount = baseFields.length;
    this.allFilledControlsCount = filled;
  }
}
