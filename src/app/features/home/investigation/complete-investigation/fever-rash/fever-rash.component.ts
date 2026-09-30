import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormArray, FormControl, FormGroup, Validators } from '@angular/forms';
import { UserMessageService } from 'src/app/core/services/user.message.service';
import { InvestigationService } from '../../services/investigation.service';
import { TranslateService } from '@ngx-translate/core';
import { DatePipe } from '@angular/common';
import { GeneralDataService } from '../../../general-data/services/general-data.service';
import { PagePermissionService } from '../../../../../core/services/page-permission.service';
import { AttachemntApiService } from 'src/app/core/services/attachemnt-api.service';
import { firstValueFrom } from 'rxjs';
import { downloadSurveyTemplate, readSurveyFile } from './fever-rash-survey-excel';

@Component({
  selector: 'app-fever-rash',
  templateUrl: './fever-rash.component.html',
  styleUrls: ['./fever-rash.component.css'],
})
export class FeverRashComponent implements OnInit {
  currentLang =
    localStorage.getItem('ls.currentLang') !== undefined &&
      localStorage.getItem('ls.currentLang') !== 'undefined'
      ? localStorage.getItem('ls.currentLang')
      : 'ar';

  feverRashForm: FormGroup;
  currentId: any;
  patientName: string;

  // Fever date from the general report (الابلاغ العام); rash date must be after it.
  feverDate: string | null = null;
  caseDiscoveryDate: string | null = null;
  rashMinDate: string | null = null;
  rashMaxDate: string = '';
  // Upper bound for date inputs: rash date cannot be in the future.
  today: string = '';
  patientAgeLabel: string = '';
  private patientAgeInMonths: number | null = null;
  patientSexLabel: string = '';

  allFilledControlsCount: number = 0;
  allControllesCount: number = 0;

  // True when the case final diagnosis is confirmed measles / rubella; unlocks the 400-children survey tab.
  confirmedMeasles = false;

  // Tabs (order matches the paper form / attached images)
  activeTab: 'field' | 'contacts' | 'unit' | 'survey' | 'survey400' | 'followup' | 'notes' = 'field';
  tabs = [
    { key: 'field', label: 'التقصى الميدانى للحالة' },
    { key: 'contacts', label: 'حصر المخالطين' },
    { key: 'unit', label: 'التقصى على مستوى الوحدة الصحية' },
    { key: 'survey', label: 'المسح الميدانى 30 طفل' },
    { key: 'survey400', label: 'المسح الميداني 400 طفل' },
    { key: 'followup', label: 'متابعة الحالة بعد 21 يوم' },
    { key: 'notes', label: 'ملاحظات عامة' },
  ];

  savedAttachmentUrls: string[] = [];
  pendingAttachments: File[] = [];

  // Each field-survey tab needs the investigations permission or its own dedicated permission.
  private readonly INVESTIGATION_PAGE_ID = 10;
  private readonly SURVEY30_PAGE_ID = 200;
  private readonly SURVEY400_PAGE_ID = 201;
  canAccessSurvey30 = false;
  canAccessSurvey400 = false;
  // A user granted only the survey permission(s) (no full investigations permission) sees just the survey tabs.
  surveyOnly = false;

  // The 400-children tab only appears for confirmed measles / rubella cases.
  get visibleTabs() {
    return this.tabs.filter((t) => {
      if (t.key === 'survey') return this.canAccessSurvey30;
      if (t.key === 'survey400') return this.canAccessSurvey400 && this.confirmedMeasles;
      return !this.surveyOnly;
    });
  }

  // Expand/collapse state for the card-based grids (case movements, previous cases).
  private openRows = new Set<AbstractControl>();

  private readonly finalDiagnosisLabels = [
    'حصبة',
    'حصبة ألمانى',
    'التهاب بالجلد "فيروسى"',
    'اثر جانبى بعد التطعيم',
    'حمى قرمزية',
    'نقص المناعة',
    'داء الفطط',
    'طفيلية وردية',
    'عدوى بكتيرية',
    'كواساكى',
    'متلازمة جونسون',
    'حمى الدنج',
    'متلازمة الفم واليد والقدم',
    'حمرة',
    'حمى موسمية',
    'التهاب بالمخ',
    'حساسية جلدية',
    'حساسية طعام',
    'حساسية حشرية',
  ];

  get isLegacyFinalDiagnosis(): boolean {
    const v = this.feverRashForm?.value?.finalDiagnosis;
    return !!v && !this.finalDiagnosisLabels.includes(v);
  }

  private arrayKeys = ['caseMovements', 'previousCases', 'generalContacts', 'pregnantContacts', 'surveyChildren', 'survey400Children'];
  private coreKeys = ['id', 'patientID', 'diseaseGroupID', 'investigationCompletePercentage', 'caseCodeDisplay'];

  // Scalar date controls (formatted to yyyy-MM-dd on load).
  private dateFields = new Set([
    'reportDate', 'homeVisitDate', 'rashDate', 'measlesLastDoseDate', 'mmrLastDoseDate', 'mrLastDoseDate',
    'coverageVisitDate', 'lastCaseDateAdmin', 'lastCaseDateDirectorate', 'fieldVisitDate',
    'field400VisitDate',
    'committeeSpecialistDate', 'adminOfficerDate', 'directorateOfficerDate',
  ]);

  constructor(
    private investigationService: InvestigationService,
    private datePipe: DatePipe,
    private translateService: TranslateService,
    private userMsg: UserMessageService,
    private generalDataService: GeneralDataService,
    private pagePermission: PagePermissionService,
    private attachmentApi: AttachemntApiService
  ) { }

  ngOnInit() {
    this.today = this.todayStr();
    this.rashMaxDate = this.today;
    this.canAccessSurvey30 = this.pagePermission.canAccessPage([
      this.INVESTIGATION_PAGE_ID,
      this.SURVEY30_PAGE_ID,
    ]);
    this.canAccessSurvey400 = this.pagePermission.canAccessPage([
      this.INVESTIGATION_PAGE_ID,
      this.SURVEY400_PAGE_ID,
    ]);
    this.surveyOnly =
      !this.pagePermission.isAdmin() &&
      this.pagePermission.hasExplicitPage([this.SURVEY30_PAGE_ID, this.SURVEY400_PAGE_ID]) &&
      !this.pagePermission.hasExplicitPage(this.INVESTIGATION_PAGE_ID);
    if (this.surveyOnly) {
      this.activeTab = this.canAccessSurvey30 ? 'survey' : 'survey400';
    }

    this.patientName =
      (this.investigationService.patient?.firstName || '') + ' ' +
      (this.investigationService.patient?.secondName || '') + ' ' +
      (this.investigationService.patient?.thirdName || '');

    this.feverRashForm = new FormGroup({
      // Core
      id: new FormControl(),
      patientID: new FormControl(),
      diseaseGroupID: new FormControl(this.investigationService.diseaseGroupID),
      investigationCompletePercentage: new FormControl(),

      // Header
      caseCodeDisplay: new FormControl(),
      reportDate: new FormControl(),
      homeVisitDate: new FormControl(),

      // Tab 1 - case field investigation
      differentialDiagnosis: new FormControl(),
      caseAgeMonths: new FormControl(null, [Validators.min(0), Validators.pattern(/^[0-9]+$/)]),
      rashDate: new FormControl(null, this.rashDateNotBeforeFever),
      epiLinked: new FormControl(),
      linkedCaseConfirmation: new FormControl(),
      linkedCaseCode: new FormControl(),
      linkedCaseName: new FormControl(),
      linkedCaseKinship: new FormControl(),
      caseVaccinationStatus: new FormControl(),
      measlesRoutineDoses: new FormControl(),
      measlesCampaignDoses: new FormControl(),
      measlesLastDoseDate: new FormControl(),
      mmrRoutineDoses: new FormControl(),
      mmrCampaignDoses: new FormControl(),
      mmrLastDoseDate: new FormControl(),
      mrRoutineDoses: new FormControl(),
      mrCampaignDoses: new FormControl(),
      mrLastDoseDate: new FormControl(),
      noCaseMovements: new FormControl(false),
      caseMovements: new FormArray([]),
      hasPreviousCases: new FormControl(),
      previousCases: new FormArray([]),
      hasInfectionSource: new FormControl(),
      infectionSourceText: new FormControl(),

      // Tab 2 - contacts
      generalContacts: new FormArray([]),
      hasPregnantContacts: new FormControl(),
      pregnantContacts: new FormArray([]),

      // Tab 3 - health unit level
      coverageVisitDate: new FormControl(),
      coverageMonth: new FormControl(),
      covUnitRoutineMmr1Target: new FormControl(),
      covUnitRoutineMmr1Vaccinated: new FormControl(),
      covUnitRoutineMmr1Rate: new FormControl(),
      covUnitRoutineMmr2Target: new FormControl(),
      covUnitRoutineMmr2Vaccinated: new FormControl(),
      covUnitRoutineMmr2Rate: new FormControl(),
      covUnitCampaignMmr1Target: new FormControl(),
      covUnitCampaignMmr1Vaccinated: new FormControl(),
      covUnitCampaignMmr1Rate: new FormControl(),
      covUnitCampaignMmr2Target: new FormControl(),
      covUnitCampaignMmr2Vaccinated: new FormControl(),
      covUnitCampaignMmr2Rate: new FormControl(),
      covAdminRoutineMmr1Target: new FormControl(),
      covAdminRoutineMmr1Vaccinated: new FormControl(),
      covAdminRoutineMmr1Rate: new FormControl(),
      covAdminRoutineMmr2Target: new FormControl(),
      covAdminRoutineMmr2Vaccinated: new FormControl(),
      covAdminRoutineMmr2Rate: new FormControl(),
      covAdminCampaignMmr1Target: new FormControl(),
      covAdminCampaignMmr1Vaccinated: new FormControl(),
      covAdminCampaignMmr1Rate: new FormControl(),
      covAdminCampaignMmr2Target: new FormControl(),
      covAdminCampaignMmr2Vaccinated: new FormControl(),
      covAdminCampaignMmr2Rate: new FormControl(),
      lastCaseDateAdmin: new FormControl(),
      lastCaseDateDirectorate: new FormControl(),
      confirmedCasesLastMonth: new FormControl(),
      confirmedCasesCount: new FormControl(),
      feverRashCasesLastMonth: new FormControl(),
      feverRashCasesCount: new FormControl(),
      movedToOutbreak: new FormControl(),
      movedToOutbreakPlace: new FormControl(),

      // Tab 4 - field survey (30 children)
      fieldVisitDate: new FormControl(),
      fieldSquareNumber: new FormControl(),
      surveyChildren: new FormArray([]),
      survey30ExecutorName: new FormControl(),
      survey30SupervisorName: new FormControl(),
      survey30VaccinationOfficerName: new FormControl(),

      // Tab 4b - field survey (400 children) - positive cases only
      field400VisitDate: new FormControl(),
      field400SquareNumber: new FormControl(),
      survey400Children: new FormArray([]),
      survey400ExecutorName: new FormControl(),
      survey400SupervisorName: new FormControl(),
      survey400VaccinationOfficerName: new FormControl(),

      // Tab 5 - follow-up after 28 days
      diseaseOutcome: new FormControl(),
      hasComplications: new FormControl(),
      complications: new FormControl(),
      finalDiagnosis: new FormControl(),
      committeeComments: new FormControl(),
      committeeSpecialistName: new FormControl(),
      committeeSpecialistSignature: new FormControl(),
      committeeSpecialistDate: new FormControl(),
      adminOfficerName: new FormControl(),
      adminOfficerSignature: new FormControl(),
      adminOfficerDate: new FormControl(),
      directorateOfficerName: new FormControl(),
      directorateOfficerSignature: new FormControl(),
      directorateOfficerDate: new FormControl(),
      finalClassification: new FormControl(),

      // Tab 7
      generalNotes: new FormControl(),
    });

    this.feverRashForm.valueChanges.subscribe(() => this.calculateCompletionPercentage());

    this.currentId = this.investigationService.currentid;
    this.feverRashForm.controls['patientID'].setValue(this.currentId);

    this.loadPatientHeader();
    this.loadExistingRecord();
  }

  // Rash date (تاريخ الطفح) must be after the fever date (تاريخ الحمى) and on or before the case
  // discovery date (تاريخ اكتشاف الحالة) from the general report, and not a future date.
  private rashDateNotBeforeFever = (control: AbstractControl) => {
    const rash = control.value;
    if (!rash) return null;
    if (rash > this.todayStr()) return { rashInFuture: true };
    if (this.feverDate && rash <= this.feverDate) return { rashBeforeFever: true };
    if (this.caseDiscoveryDate && rash > this.caseDiscoveryDate) return { rashAfterDiscovery: true };
    return null;
  };

  private updateRashDateBounds() {
    if (this.feverDate) {
      const next = new Date(this.feverDate + 'T00:00:00');
      next.setDate(next.getDate() + 1);
      this.rashMinDate = this.datePipe.transform(next, 'yyyy-MM-dd');
    } else {
      this.rashMinDate = null;
    }
    const today = this.todayStr();
    this.rashMaxDate = this.caseDiscoveryDate && this.caseDiscoveryDate < today ? this.caseDiscoveryDate : today;
  }

  // ===================== Header from patient data =====================
  private loadPatientHeader() {
    if (!this.currentId) return;
    this.generalDataService.getBy(this.currentId).subscribe((res: any) => {
      const p = res?.data;
      if (!p) return;
      const fullName = [p.firstName, p.secondName, p.thirdName].filter((x: any) => !!x).join(' ');
      if (fullName) this.patientName = fullName;
      this.patientSexLabel = p.genderId === 1 ? 'ذكر' : p.genderId === 2 ? 'أنثى' : '';
      this.patientAgeLabel = p.age != null ? `${p.age} ${this.ageUnit(p.ageTypeId)}` : '';
      this.patientAgeInMonths = this.toMonths(p.age, p.ageTypeId);
      this.applyPatientAgeMonths();
      if (p.homeVisitDate && !this.feverRashForm.value.homeVisitDate) {
        this.feverRashForm.controls['homeVisitDate'].setValue(this.d(p.homeVisitDate));
      }
      this.feverDate = this.d(p.feverSymptoms?.feverDate);
      this.caseDiscoveryDate = this.d(p.caseDiscoveryDate);
      this.updateRashDateBounds();
      this.feverRashForm.controls['rashDate'].updateValueAndValidity();
      this.evaluateConfirmedMeasles(p);
    });
  }

  // Show the 400-children tab when the final diagnosis is confirmed measles / rubella
  // (e.g. "حصبة مؤكدة" or "حصبة الماني مؤكدة").
  private evaluateConfirmedMeasles(p: any) {
    const texts: string[] = [];
    if (p?.finalDiagonistics) texts.push(String(p.finalDiagonistics));
    (p?.finalDiagonisticsData || []).forEach((d: any) => {
      texts.push(`${d?.caseResultCategory ?? ''} ${d?.finalResult ?? ''}`);
    });
    this.confirmedMeasles = texts.some((t) => t.includes('حصبة') && t.includes('مؤكد'));
    if (!this.confirmedMeasles && this.activeTab === 'survey400') {
      this.activeTab = this.surveyOnly
        ? (this.canAccessSurvey30 ? 'survey' : 'survey400')
        : 'field';
    }
  }

  private toMonths(age: any, ageTypeId: any): number | null {
    if (age === null || age === undefined || age === '') return null;
    const n = Number(age);
    if (isNaN(n) || n < 0) return null;
    switch (Number(ageTypeId)) {
      case 1: return Math.floor(n / 30);
      case 2: return Math.floor(n);
      case 3: return Math.floor(n * 12);
      default: return null;
    }
  }

  private applyPatientAgeMonths() {
    const ctrl = this.feverRashForm?.controls['caseAgeMonths'];
    if (!ctrl || this.patientAgeInMonths === null) return;
    if (ctrl.value === null || ctrl.value === undefined || ctrl.value === '') {
      ctrl.setValue(this.patientAgeInMonths, { emitEvent: false });
      this.calculateCompletionPercentage();
    }
  }

  private ageUnit(ageTypeId: number): string {
    switch (ageTypeId) {
      case 1: return 'يوم';
      case 2: return 'شهر';
      case 3: return 'سنة';
      default: return '';
    }
  }

  private todayStr(): string {
    return this.datePipe.transform(new Date(), 'yyyy-MM-dd') as string;
  }

  // ===================== Load existing record =====================
  private loadExistingRecord() {
    this.investigationService.getByIdFeverRash(this.currentId).subscribe(
      (res) => {
        const v = res?.data;
        if (v) this.patchFromRecord(v);
        this.applyPatientAgeMonths();
        if (!this.feverRashForm.value.reportDate) {
          this.feverRashForm.controls['reportDate'].setValue(this.todayStr());
        }
        this.ensureDefaultRows();
        this.calculateCompletionPercentage();
        this.loadUnitSummary();
      },
      () => {
        if (!this.feverRashForm.value.reportDate) {
          this.feverRashForm.controls['reportDate'].setValue(this.todayStr());
        }
        this.ensureDefaultRows();
        this.loadUnitSummary();
      }
    );
  }

  private loadUnitSummary() {
    const groupId = this.investigationService.diseaseGroupID;
    if (!this.currentId || !groupId) return;
    const f = this.feverRashForm.controls;
    const needDate = !f['lastCaseDateAdmin'].value;
    const needDirDate = !f['lastCaseDateDirectorate'].value;
    const needConfirmed = f['confirmedCasesLastMonth'].value == null;
    const needFeverRash = f['feverRashCasesLastMonth'].value == null;
    if (!needDate && !needDirDate && !needConfirmed && !needFeverRash) return;
    this.investigationService.getFeverRashUnitSummary(this.currentId, groupId).subscribe((res: any) => {
      const s = res?.data;
      if (!s) return;
      if (needDate && !f['lastCaseDateAdmin'].value && s.lastCaseDate) {
        f['lastCaseDateAdmin'].setValue(this.d(s.lastCaseDate));
      }
      if (needDirDate && !f['lastCaseDateDirectorate'].value && s.lastCaseDateDirectorate) {
        f['lastCaseDateDirectorate'].setValue(this.d(s.lastCaseDateDirectorate));
      }
      if (needConfirmed && f['confirmedCasesLastMonth'].value == null) {
        this.applyCaseCount('confirmedCasesLastMonth', 'confirmedCasesCount', s.confirmedCasesLastMonth);
      }
      if (needFeverRash && f['feverRashCasesLastMonth'].value == null) {
        this.applyCaseCount('feverRashCasesLastMonth', 'feverRashCasesCount', s.feverRashCasesLastMonth);
      }
      this.calculateCompletionPercentage();
    });
  }

  private applyCaseCount(flagKey: string, countKey: string, count: number) {
    const n = Number(count) || 0;
    this.feverRashForm.controls[flagKey].setValue(n > 0 ? 1 : 2);
    this.feverRashForm.controls[countKey].setValue(n > 0 ? n : null);
  }

  // Start each card grid with one empty record when none were loaded.
  private ensureDefaultRows() {
    if (!this.feverRashForm.get('noCaseMovements')?.value && this.caseMovements.length === 0) this.addCaseMovement();
    if (this.previousCases.length === 0) this.addPreviousCase();
    if (this.generalContacts.length === 0) this.addGeneralContact();
    if (this.surveyChildren.length === 0) this.addSurveyChild();
    if (this.survey400Children.length === 0) this.addSurvey400Child();
  }

  private patchFromRecord(v: any) {
    const patch: any = {};
    Object.keys(this.feverRashForm.controls).forEach((key) => {
      if (this.arrayKeys.includes(key)) return;
      if (v[key] === undefined) return;
      patch[key] = this.dateFields.has(key) && v[key] ? this.d(v[key]) : v[key];
    });
    this.feverRashForm.patchValue(patch);
    this.feverRashForm.controls['caseCodeDisplay'].setValue(v.caseCode ?? null);

    this.parseJsonInto(v.caseMovementsJson, (m) => this.caseMovements.push(this.buildCaseMovement(m)));
    this.parseJsonInto(v.previousCasesJson, (p) => this.previousCases.push(this.buildPreviousCase(p)));
    this.parseJsonInto(v.generalContactsJson, (c) => this.generalContacts.push(this.buildContact(c)));
    this.parseJsonInto(v.pregnantContactsJson, (p) => this.pregnantContacts.push(this.buildPregnant(p)));
    this.parseJsonInto(v.surveyChildrenJson, (s) => this.surveyChildren.push(this.buildSurveyChild(s)));
    this.parseJsonInto(v.survey400ChildrenJson, (s) => this.survey400Children.push(this.buildSurveyChild(s)));
    this.savedAttachmentUrls = [];
    this.parseJsonInto(v.generalAttachmentUrlsJson, (url) => url && this.savedAttachmentUrls.push(url));
  }

  // ===================== General notes attachments =====================
  private isPdf(file: File): boolean {
    return file.type === 'application/pdf' || /\.pdf$/i.test(file.name);
  }

  onAttachmentsSelected(input: EventTarget | null) {
    const el = input as HTMLInputElement;
    if (!el?.files?.length) return;
    let rejected = 0;
    for (let i = 0; i < el.files.length; i++) {
      const file = el.files[i];
      if (!this.isPdf(file)) { rejected++; continue; }
      if (this.pendingAttachments.some((p) => p.name === file.name && p.size === file.size)) continue;
      this.pendingAttachments.push(file);
    }
    if (rejected) this.userMsg.error('يُسمح بملفات PDF فقط');
    el.value = '';
  }

  attachmentName(url: string): string {
    const last = decodeURIComponent((url || '').split('/').pop() || '');
    const idx = last.indexOf('--');
    return idx >= 0 ? last.substring(idx + 2) : last;
  }

  openSavedAttachment(url: string) {
    if (url) window.open(url, '_blank');
  }

  openPendingAttachment(i: number) {
    const file = this.pendingAttachments[i];
    if (file) window.open(URL.createObjectURL(file), '_blank');
  }

  removeSavedAttachment(i: number) {
    this.savedAttachmentUrls.splice(i, 1);
  }

  removePendingAttachment(i: number) {
    this.pendingAttachments.splice(i, 1);
  }

  private async uploadPendingAttachments(): Promise<string[] | null> {
    if (!this.pendingAttachments.length) return [];
    try {
      const fd = new FormData();
      this.pendingAttachments.forEach((f) => fd.append('files', f));
      const res: any = await firstValueFrom(this.attachmentApi.upload(fd));
      const urls: string[] = res?.data || res?.Data || [];
      if (!urls.length) {
        this.userMsg.error('لم يتم رفع المرفقات. حاول مرة أخرى.');
        return null;
      }
      return urls;
    } catch {
      this.userMsg.error('لم يتم رفع المرفقات. حاول مرة أخرى.');
      return null;
    }
  }

  private parseJsonInto(json: string, push: (item: any) => void) {
    if (!json) return;
    try {
      (JSON.parse(json) || []).forEach((item: any) => push(item));
    } catch (e) { }
  }

  // ===================== Tab switching =====================
  setTab(tab: any) {
    this.activeTab = tab;
  }

  // ===================== FormArray accessors =====================
  get caseMovements(): FormArray { return this.feverRashForm.get('caseMovements') as FormArray; }
  get previousCases(): FormArray { return this.feverRashForm.get('previousCases') as FormArray; }
  get generalContacts(): FormArray { return this.feverRashForm.get('generalContacts') as FormArray; }
  get pregnantContacts(): FormArray { return this.feverRashForm.get('pregnantContacts') as FormArray; }
  get surveyChildren(): FormArray { return this.feverRashForm.get('surveyChildren') as FormArray; }
  get survey400Children(): FormArray { return this.feverRashForm.get('survey400Children') as FormArray; }

  // ===================== Card expand / collapse (edit toggle) =====================
  toggleRow(ctrl: AbstractControl) {
    if (this.openRows.has(ctrl)) this.openRows.delete(ctrl);
    else this.openRows.add(ctrl);
  }
  isRowOpen(ctrl: AbstractControl): boolean {
    return this.openRows.has(ctrl);
  }

  // ===================== Row builders =====================
  private d(x: any) { return x ? this.datePipe.transform(x, 'yyyy-MM-dd') : null; }

  private readonly movementCountKeys = [
    'directContactsCount', 'symptomaticCount', 'noSymptomsCount',
    'vaccinatedCount', 'notVaccinatedCount', 'notEligibleCount', 'unknownCount',
  ];
  private readonly movementVaccinationKeys = ['vaccinatedCount', 'notVaccinatedCount', 'notEligibleCount', 'unknownCount'];

  private buildCaseMovement(m: any = {}): FormGroup {
    const count = (v: any) => new FormControl(v ?? null, [Validators.min(0), Validators.pattern(/^[0-9]+$/)]);
    const g = new FormGroup({
      visitDate: new FormControl(this.d(m.visitDate)),
      contactPlace: new FormControl(m.contactPlace ?? null),
      address: new FormControl(m.address ?? null),
      directContactsCount: count(m.directContactsCount),
      symptomaticCount: count(m.symptomaticCount),
      noSymptomsCount: count(m.noSymptomsCount),
      vaccinatedCount: count(m.vaccinatedCount),
      notVaccinatedCount: count(m.notVaccinatedCount),
      notEligibleCount: count(m.notEligibleCount),
      unknownCount: count(m.unknownCount),
    });
    const syncDirect = () => {
      const s = this.countValue(g.get('symptomaticCount')?.value);
      const n = this.countValue(g.get('noSymptomsCount')?.value);
      const total = s === null && n === null ? null : (s ?? 0) + (n ?? 0);
      if (g.get('directContactsCount')!.value !== total) {
        g.get('directContactsCount')!.setValue(total, { emitEvent: false });
      }
    };
    syncDirect();
    g.get('symptomaticCount')!.valueChanges.subscribe(syncDirect);
    g.get('noSymptomsCount')!.valueChanges.subscribe(syncDirect);
    return g;
  }

  private countValue(v: any): number | null {
    if (v === null || v === undefined || v === '') return null;
    const n = Number(v);
    return isNaN(n) ? null : n;
  }

  movementCountInvalid(m: AbstractControl, key: string): boolean {
    return !!m.get(key)?.invalid;
  }

  movementVaccinationTotal(m: AbstractControl): number | null {
    const values = this.movementVaccinationKeys.map((k) => this.countValue(m.get(k)?.value));
    if (values.every((v) => v === null)) return null;
    return values.reduce<number>((sum, v) => sum + (v ?? 0), 0);
  }

  movementVaccinationMismatch(m: AbstractControl): boolean {
    const direct = this.countValue(m.get('directContactsCount')?.value);
    const vaccTotal = this.movementVaccinationTotal(m);
    if (direct === null || vaccTotal === null) return false;
    return direct !== vaccTotal;
  }

  private hasInvalidCaseMovementCounts(): 'negative' | 'mismatch' | null {
    if (this.feverRashForm.get('noCaseMovements')?.value) return null;
    if (this.caseMovements.controls.some((m) => this.movementCountKeys.some((k) => m.get(k)?.invalid))) return 'negative';
    if (this.caseMovements.controls.some((m) => this.movementVaccinationMismatch(m))) return 'mismatch';
    return null;
  }
  private buildPreviousCase(p: any = {}): FormGroup {
    return new FormGroup({
      contactName: new FormControl(p.contactName ?? null),
      rashOnsetDate: new FormControl(this.d(p.rashOnsetDate)),
      kinship: new FormControl(p.kinship ?? null),
      vaccinationStatus: new FormControl(p.vaccinationStatus ?? null),
      contactDate: new FormControl(this.d(p.contactDate)),
    });
  }
  private buildContact(c: any = {}): FormGroup {
    const ageMonths = c.ageMonths ?? (c.ageYears != null && c.ageYears !== '' ? Number(c.ageYears) * 12 : null);
    const g = new FormGroup({
      name: new FormControl(c.name ?? null),
      ageMonths: new FormControl(ageMonths),
      vaccinationStatus: new FormControl(c.vaccinationStatus ?? null),
      contactPlace: new FormControl(c.contactPlace ?? null),
      visitWeek1: new FormControl(this.d(c.visitWeek1)),
      visitWeek2: new FormControl(this.d(c.visitWeek2)),
      visitWeek3: new FormControl(this.d(c.visitWeek3)),
      visitWeek4: new FormControl(this.d(c.visitWeek4)),
      symptomsWeek1: new FormControl(!!c.symptomsWeek1),
      symptomsWeek2: new FormControl(!!c.symptomsWeek2),
      symptomsWeek3: new FormControl(!!c.symptomsWeek3),
      symptomsWeek4: new FormControl(!!c.symptomsWeek4),
    });
    const vaccination = g.get('vaccinationStatus')!;
    let wasTooYoung = this.isContactTooYoungForVaccine(g);
    if (wasTooYoung) vaccination.setValue(this.NOT_ELIGIBLE);
    g.get('ageMonths')!.valueChanges.subscribe(() => {
      const tooYoung = this.isContactTooYoungForVaccine(g);
      if (tooYoung) {
        if (vaccination.value !== this.NOT_ELIGIBLE) vaccination.setValue(this.NOT_ELIGIBLE);
      } else if (wasTooYoung && vaccination.value === this.NOT_ELIGIBLE) {
        vaccination.setValue(null);
      }
      wasTooYoung = tooYoung;
    });
    return g;
  }
  private readonly NOT_ELIGIBLE = 3;
  isContactTooYoungForVaccine(c: AbstractControl): boolean {
    const age = c.get('ageMonths')?.value;
    return age !== null && age !== undefined && age !== '' && Number(age) < 9;
  }
  private hasInvalidContactVaccination(): boolean {
    return this.generalContacts.controls.some(
      (c) => this.isContactTooYoungForVaccine(c) && c.get('vaccinationStatus')?.value !== this.NOT_ELIGIBLE
    );
  }
  private buildPregnant(p: any = {}): FormGroup {
    return new FormGroup({
      name: new FormControl(p.name ?? null),
      age: new FormControl(p.age ?? null),
      kinship: new FormControl(p.kinship ?? null),
      rashOnsetDate: new FormControl(this.d(p.rashOnsetDate)),
      vaccinationStatus: new FormControl(p.vaccinationStatus ?? null),
      contactDate: new FormControl(this.d(p.contactDate)),
      pregnancyWeeks: new FormControl(p.pregnancyWeeks ?? null),
      sample1Date: new FormControl(this.d(p.sample1Date)),
      sample1Result: new FormControl(p.sample1Result ?? null),
      sample2Date: new FormControl(this.d(p.sample2Date)),
      sample2Result: new FormControl(p.sample2Result ?? null),
      newbornSampleDate: new FormControl(this.d(p.newbornSampleDate)),
      newbornSampleResult: new FormControl(p.newbornSampleResult ?? null),
      visitWeek1: new FormControl(this.d(p.visitWeek1)),
      visitWeek2: new FormControl(this.d(p.visitWeek2)),
      visitWeek3: new FormControl(this.d(p.visitWeek3)),
      visitWeek4: new FormControl(this.d(p.visitWeek4)),
      symptomsWeek1: new FormControl(!!p.symptomsWeek1),
      symptomsWeek2: new FormControl(!!p.symptomsWeek2),
      symptomsWeek3: new FormControl(!!p.symptomsWeek3),
      symptomsWeek4: new FormControl(!!p.symptomsWeek4),
    });
  }
  private readonly surveyDoseKeys = ['zero', 'bcg', 'first', 'second', 'third', 'fourth', 'fifth', 'booster'];

  private buildSurveyChild(s: any = {}): FormGroup {
    const controls: { [key: string]: FormControl } = {
      street: new FormControl(s.street ?? null),
      house: new FormControl(s.house ?? null),
      apartment: new FormControl(s.apartment ?? null),
      childName: new FormControl(s.childName ?? null),
      birthCertSeen: new FormControl(s.birthCertSeen ?? null),
      birthCertComplete: new FormControl(s.birthCertComplete ?? null),
    };
    this.surveyDoseKeys.forEach((k) => {
      controls[k + 'Status'] = new FormControl(s[k + 'Status'] ?? null);
      controls[k + 'Review'] = new FormControl(s[k + 'Review'] ?? null);
    });
    return new FormGroup(controls);
  }

  surveyTotal(rows: FormArray, key: string): number {
    return rows.controls.filter((c) => {
      const v = c.get(key)?.value;
      if (key === 'birthCertComplete') return v === 'yes';
      if (key.endsWith('Status')) return v === 1 || v === 2;
      return v === 1;
    }).length;
  }

  // ===================== Card grids (add new section + edit/delete) =====================
  addCaseMovement() {
    const g = this.buildCaseMovement();
    this.caseMovements.push(g);
    this.openRows.add(g); // new card starts expanded for editing
  }
  removeCaseMovement(i: number) {
    this.openRows.delete(this.caseMovements.at(i));
    this.caseMovements.removeAt(i);
  }
  onNoMovementsChange() {
    if (this.feverRashForm.get('noCaseMovements')?.value) {
      this.caseMovements.controls.forEach((c) => this.openRows.delete(c));
      this.caseMovements.clear();
    } else if (this.caseMovements.length === 0) {
      this.addCaseMovement();
    }
  }

  addPreviousCase() {
    const g = this.buildPreviousCase();
    this.previousCases.push(g);
    this.openRows.add(g);
  }
  removePreviousCase(i: number) {
    this.openRows.delete(this.previousCases.at(i));
    this.previousCases.removeAt(i);
  }

  // ===================== Card grids for tab 2 (add new section + edit/delete) =====================
  addGeneralContact() {
    const g = this.buildContact();
    this.generalContacts.push(g);
    this.openRows.add(g);
  }
  removeGeneralContact(i: number) {
    this.openRows.delete(this.generalContacts.at(i));
    this.generalContacts.removeAt(i);
  }

  addPregnantContact() {
    const g = this.buildPregnant();
    this.pregnantContacts.push(g);
    this.openRows.add(g);
  }
  // When the user answers "نعم" to pregnant contacts, seed one empty record.
  onHasPregnantChange() {
    if (this.feverRashForm.value.hasPregnantContacts === 1 && this.pregnantContacts.length === 0) {
      this.addPregnantContact();
    }
  }
  removePregnantContact(i: number) {
    this.openRows.delete(this.pregnantContacts.at(i));
    this.pregnantContacts.removeAt(i);
  }

  downloadSurveyExcel(kind: '30' | '400') {
    const rows = kind === '30' ? this.surveyChildren : this.survey400Children;
    const title = kind === '30' ? 'المسح الميداني - 30 طفل' : 'المسح الميداني - 400 طفل';
    const code = this.feverRashForm.get('caseCodeDisplay')?.value;
    const fileName = `المسح الميداني ${kind} طفل${code ? ' - ' + code : ''}`;
    downloadSurveyTemplate(title, rows.getRawValue(), kind === '30' ? 30 : 400, fileName);
  }

  async onSurveyExcelSelected(kind: '30' | '400', input: EventTarget | null) {
    const el = input as HTMLInputElement;
    const file = el?.files?.[0];
    if (el) el.value = '';
    if (!file) return;
    if (!/\.(xlsx|xls)$/i.test(file.name)) {
      this.userMsg.error('يُسمح بملفات Excel فقط (xlsx)');
      return;
    }
    try {
      const { rows, errors } = await readSurveyFile(file);
      if (!rows.length) {
        this.userMsg.error(errors[0] || 'لا توجد بيانات أطفال في الملف');
        return;
      }
      const arr = kind === '30' ? this.surveyChildren : this.survey400Children;
      arr.clear();
      rows.forEach((r) => arr.push(this.buildSurveyChild(r)));
      this.calculateCompletionPercentage();
      if (errors.length) {
        const shown = errors.slice(0, 3).join(' | ');
        this.userMsg.error(`تم تحميل ${rows.length} طفل مع ${errors.length} قيمة غير معروفة تُركت فارغة: ${shown}${errors.length > 3 ? ' ...' : ''}`);
      } else {
        this.userMsg.success(`تم تحميل ${rows.length} طفل من الملف. اضغط "حفظ البيانات" للحفظ.`);
      }
    } catch {
      this.userMsg.error('تعذر قراءة الملف. تأكد أنه ملف Excel صحيح.');
    }
  }

  addSurveyChild() {
    this.surveyChildren.push(this.buildSurveyChild());
  }
  removeSurveyChild(i: number) {
    this.surveyChildren.removeAt(i);
  }

  addSurvey400Child() {
    this.survey400Children.push(this.buildSurveyChild());
  }
  removeSurvey400Child(i: number) {
    this.survey400Children.removeAt(i);
  }

  // ===================== Statistics =====================
  vaccinationLabel(v: any): string {
    switch (String(v)) {
      case '1': return 'مطعم';
      case '2': return 'غير مطعم';
      case '3': return 'غير مستحق';
      case '4': return 'غير معروف';
      default: return '';
    }
  }
  placeLabel(v: any): string {
    switch (String(v)) {
      case '1': return 'أماكن عامة أخرى';
      case '2': return 'السوق';
      case '3': return 'المدرسة';
      case '4': return 'المستشفى';
      case '5': return 'المنزل';
      case '6': return 'مكان العمل';
      case '7': return 'وسائل النقل';
      default: return '';
    }
  }
  kinshipLabel(v: any): string {
    switch (String(v)) {
      case '1': return 'أخ';
      case '2': return 'أخت';
      case '3': return 'آخر';
      case '4': return 'ابن';
      case '5': return 'ابنة';
      case '6': return 'جار';
      case '7': return 'جد';
      case '8': return 'جدة';
      case '9': return 'خال';
      case '10': return 'خالة';
      case '11': return 'زوج';
      case '12': return 'زوجة';
      case '13': return 'صديق';
      case '14': return 'عم';
      case '15': return 'عمة';
      case '16': return 'والد';
      case '17': return 'والدة';
      default: return v || '';
    }
  }
  mark(v: any): string {
    return v ? '✓' : '';
  }
  // A record only counts once at least one of its cells is populated.
  private isRowFilled(ctrl: AbstractControl): boolean {
    const v = ctrl.value || {};
    return Object.keys(v).some((k) => {
      const val = v[k];
      return val !== null && val !== '' && val !== false && val !== undefined;
    });
  }

  get contactsCount(): number {
    return this.generalContacts.controls.filter((c) => this.isRowFilled(c)).length;
  }
  get contactsByVaccination() { return this.groupCounts(this.generalContacts, 'vaccinationStatus', (v) => this.vaccinationLabel(v)); }
  get contactsByPlace() { return this.groupCounts(this.generalContacts, 'contactPlace', (v) => this.placeLabel(v)); }
  private groupCounts(arr: FormArray, field: string, labelFn: (v: any) => string) {
    const map = new Map<string, number>();
    arr.controls.forEach((c) => {
      if (!this.isRowFilled(c)) return;
      const label = labelFn(c.get(field)?.value);
      map.set(label, (map.get(label) || 0) + 1);
    });
    return Array.from(map.entries()).map(([label, count]) => ({ label, count }));
  }

  updateCoverageRate(targetKey: string, vaccinatedKey: string, rateKey: string): void {
    const form = this.feverRashForm;
    const targetRaw = form.get(targetKey)?.value;
    const vaccinatedRaw = form.get(vaccinatedKey)?.value;
    const target = targetRaw === null || targetRaw === '' ? NaN : Number(targetRaw);
    let vaccinated = vaccinatedRaw === null || vaccinatedRaw === '' ? NaN : Number(vaccinatedRaw);

    if (!isNaN(vaccinated) && !isNaN(target) && vaccinated > target) {
      vaccinated = target;
      form.get(vaccinatedKey)?.setValue(target, { emitEvent: false });
    }

    if (!isNaN(vaccinated) && !isNaN(target) && target > 0) {
      form.get(rateKey)?.setValue(Math.round((vaccinated / target) * 100), { emitEvent: false });
    } else {
      form.get(rateKey)?.setValue(null, { emitEvent: false });
    }
  }

  get caseRashDate(): string | null {
    return this.d(this.feverRashForm?.get('rashDate')?.value);
  }

  get previousCaseMaxDate(): string | null {
    const rash = this.caseRashDate;
    if (!rash) return null;
    const prev = new Date(rash + 'T00:00:00');
    prev.setDate(prev.getDate() - 1);
    return this.d(prev);
  }

  get followupMinDate(): string | null {
    const rash = this.caseRashDate;
    if (!rash) return null;
    const dt = new Date(rash + 'T00:00:00');
    dt.setDate(dt.getDate() + 21);
    return this.datePipe.transform(dt, 'yyyy-MM-dd');
  }

  isBeforeFollowupMin(value: any): boolean {
    const date = this.d(value);
    const min = this.followupMinDate;
    return !!date && !!min && date < min;
  }

  private readonly followupDateKeys = ['committeeSpecialistDate', 'adminOfficerDate', 'directorateOfficerDate'];

  private hasInvalidFollowupDates(): boolean {
    return this.followupDateKeys.some((k) => this.isBeforeFollowupMin(this.feverRashForm.value[k]));
  }

  isBeforeCaseRashInvalid(value: any): boolean {
    const date = this.d(value);
    const rash = this.caseRashDate;
    return !!date && !!rash && date >= rash;
  }

  isBeforeDiscoveryInvalid(value: any): boolean {
    const date = this.d(value);
    return !!date && !!this.caseDiscoveryDate && date < this.caseDiscoveryDate;
  }

  private hasInvalidPregnantSampleDates(): boolean {
    if (this.feverRashForm.value.hasPregnantContacts !== 1) return false;
    return this.pregnantContacts.controls.some(
      (c) => this.isBeforeDiscoveryInvalid(c.value.sample1Date) || this.isBeforeDiscoveryInvalid(c.value.sample2Date)
    );
  }

  visitWeekMin(row: AbstractControl, week: number): string | null {
    for (let w = week - 1; w >= 1; w--) {
      const prev = this.d(row.get('visitWeek' + w)?.value);
      if (prev) return prev;
    }
    return this.caseDiscoveryDate;
  }

  visitWeekError(row: AbstractControl, week: number): string | null {
    const date = this.d(row.get('visitWeek' + week)?.value);
    const min = this.visitWeekMin(row, week);
    if (!date || !min || date >= min) return null;
    for (let w = week - 1; w >= 1; w--) {
      if (this.d(row.get('visitWeek' + w)?.value)) return `لا يمكن أن يكون قبل زيارة أسبوع${w} (${min})`;
    }
    return `لا يمكن أن يكون قبل تاريخ اكتشاف الحالة (${min})`;
  }

  private hasInvalidVisitWeeks(rows: FormArray): boolean {
    return rows.controls.some((r) => [1, 2, 3, 4].some((w) => !!this.visitWeekError(r, w)));
  }

  private hasInvalidPreviousCaseDates(): boolean {
    if (this.feverRashForm.value.hasPreviousCases !== 1) return false;
    return this.previousCases.controls.some(
      (c) => this.isBeforeCaseRashInvalid(c.value.rashOnsetDate) || this.isBeforeCaseRashInvalid(c.value.contactDate)
    );
  }

  // ===================== Save =====================
  async save() {
    const rashCtrl = this.feverRashForm.controls['rashDate'];
    rashCtrl.markAsTouched();
    if (rashCtrl.hasError('rashInFuture')) {
      this.userMsg.error('تاريخ الطفح لا يمكن أن يكون في المستقبل');
      return;
    }
    if (rashCtrl.hasError('rashBeforeFever')) {
      this.userMsg.error(`تاريخ الطفح يجب أن يكون بعد تاريخ الحمى (${this.feverDate})`);
      return;
    }
    if (rashCtrl.hasError('rashAfterDiscovery')) {
      this.userMsg.error(`تاريخ الطفح يجب أن يكون قبل أو في نفس يوم تاريخ اكتشاف الحالة (${this.caseDiscoveryDate})`);
      return;
    }
    const ageCtrl = this.feverRashForm.controls['caseAgeMonths'];
    ageCtrl.markAsTouched();
    if (ageCtrl.invalid) {
      this.userMsg.error('العمر بالشهور يجب أن يكون رقماً صحيحاً (0 أو أكثر)');
      return;
    }
    if (this.hasInvalidPregnantSampleDates()) {
      this.userMsg.error(`في حصر المخالطين: تاريخ عينة المخالطة الحامل لا يمكن أن يكون قبل تاريخ اكتشاف الحالة (${this.caseDiscoveryDate})`);
      return;
    }
    const movementIssue = this.hasInvalidCaseMovementCounts();
    if (movementIssue === 'negative') {
      this.userMsg.error('في خط سير الحالة: أعداد المخالطين يجب أن تكون أرقاماً صحيحة (0 أو أكثر) ولا تقبل السالب');
      return;
    }
    if (movementIssue === 'mismatch') {
      this.userMsg.error('في خط سير الحالة: مجموع (متطعم + غير متطعم + غير مستحق + غير معروف) يجب أن يساوي عدد المخالطين المباشرين');
      return;
    }
    if (this.isBeforeDiscoveryInvalid(this.feverRashForm.value.homeVisitDate)) {
      this.userMsg.error(`تاريخ زيارة منزل الحالة لا يمكن أن يكون قبل تاريخ اكتشاف الحالة (${this.caseDiscoveryDate})`);
      return;
    }
    if (this.isBeforeDiscoveryInvalid(this.feverRashForm.value.coverageVisitDate)) {
      this.userMsg.error(`في التقصي على مستوى الوحدة الصحية: تاريخ زيارة الوحدة لا يمكن أن يكون قبل تاريخ اكتشاف الحالة (${this.caseDiscoveryDate})`);
      return;
    }
    if (this.isBeforeDiscoveryInvalid(this.feverRashForm.value.fieldVisitDate)) {
      this.userMsg.error(`في المسح الميداني 30 طفل: تاريخ الزيارة الميدانية لا يمكن أن يكون قبل تاريخ اكتشاف الحالة (${this.caseDiscoveryDate})`);
      return;
    }
    if (this.isBeforeDiscoveryInvalid(this.feverRashForm.value.field400VisitDate)) {
      this.userMsg.error(`في المسح الميداني 400 طفل: تاريخ الزيارة الميدانية لا يمكن أن يكون قبل تاريخ اكتشاف الحالة (${this.caseDiscoveryDate})`);
      return;
    }
    if (this.hasInvalidFollowupDates()) {
      this.userMsg.error(`في متابعة الحالة بعد 21 يوم: تاريخ اللجنة لا يمكن أن يكون قبل مرور 21 يوم من تاريخ طفح الحالة (${this.followupMinDate})`);
      return;
    }
    if (this.hasInvalidVisitWeeks(this.generalContacts)) {
      this.userMsg.error('في حصر المخالطين: تاريخ زيارة الأسبوع الأول لا يمكن أن يكون قبل تاريخ اكتشاف الحالة، وكل أسبوع لا يمكن أن يكون قبل الأسبوع السابق');
      return;
    }
    if (this.feverRashForm.value.hasPregnantContacts === 1 && this.hasInvalidVisitWeeks(this.pregnantContacts)) {
      this.userMsg.error('في المخالطين الحوامل: تاريخ زيارة الأسبوع الأول لا يمكن أن يكون قبل تاريخ اكتشاف الحالة، وكل أسبوع لا يمكن أن يكون قبل الأسبوع السابق');
      return;
    }
    if (this.hasInvalidContactVaccination()) {
      this.userMsg.error('في حصر المخالطين: المخالط الذي عمره أقل من 9 شهور حالته التطعيمية "غير مستحق"');
      return;
    }
    if (this.hasInvalidPreviousCaseDates()) {
      this.userMsg.error(`في خط سير الحالات السابقة: تاريخ ظهور الطفح وتاريخ المخالطة يجب أن يكونا قبل تاريخ طفح الحالة (${this.caseRashDate})`);
      return;
    }
    const uploaded = await this.uploadPendingAttachments();
    if (uploaded === null) return;
    const attachmentUrls = [...this.savedAttachmentUrls, ...uploaded];

    this.feverRashForm.controls['diseaseGroupID'].setValue(this.investigationService.diseaseGroupID);
    this.calculateCompletionPercentage();
    this.feverRashForm.controls['investigationCompletePercentage'].setValue(
      this.allControllesCount === 0
        ? 0
        : parseFloat(((this.allFilledControlsCount / this.allControllesCount) * 100).toFixed(2))
    );

    const value = this.feverRashForm.value;
    const payload: any = {};
    Object.keys(value).forEach((key) => {
      if (this.arrayKeys.includes(key)) return;
      payload[key] = value[key] === '' ? null : value[key];
    });
    payload.caseMovementsJson = JSON.stringify(value.caseMovements || []);
    payload.previousCasesJson = JSON.stringify(value.previousCases || []);
    payload.generalContactsJson = JSON.stringify(value.generalContacts || []);
    payload.pregnantContactsJson = JSON.stringify(value.pregnantContacts || []);
    payload.surveyChildrenJson = JSON.stringify(value.surveyChildren || []);
    payload.survey400ChildrenJson = JSON.stringify(value.survey400Children || []);
    payload.generalAttachmentUrlsJson = JSON.stringify(attachmentUrls);
    const ageValue = payload.caseAgeMonths === null || payload.caseAgeMonths === undefined || payload.caseAgeMonths === '' ? null : Number(payload.caseAgeMonths);
    payload.caseAgeMonths = ageValue !== null && ageValue !== this.patientAgeInMonths ? ageValue : null;

    const ok = () => {
      if (payload.caseAgeMonths !== null && payload.caseAgeMonths !== undefined) {
        this.patientAgeInMonths = Number(payload.caseAgeMonths);
        this.patientAgeLabel = `${payload.caseAgeMonths} ${this.ageUnit(2)}`;
        this.investigationService.patient.age = Number(payload.caseAgeMonths);
        this.investigationService.patient.ageTypeId = 2;
      }
      this.savedAttachmentUrls = attachmentUrls;
      this.pendingAttachments = [];
      this.translateService.get('NEDSS.COMMON.SENT_SUCESSFULLY').subscribe((r: string) => this.userMsg.success(r));
    };

    if (payload.id != null) {
      this.investigationService.updateFeverRash(payload).subscribe((r: any) => r && ok(), () => { });
    } else {
      this.investigationService.addInvestigationFeverRash(payload).subscribe((r: any) => r && ok(), () => { });
    }
  }

  // ===================== Completion percentage =====================
  calculateCompletionPercentage(): void {
    const data = this.feverRashForm?.value ?? {};
    const excluded = new Set([...this.coreKeys, ...this.arrayKeys, 'createdDate']);
    const baseFields = Object.keys(data).filter((key) => !excluded.has(key));
    const filled = baseFields.reduce((acc, key) => {
      const value = data[key];
      if (value !== null && value !== '' && value !== 'null' && value !== false && value !== undefined) {
        return acc + 1;
      }
      return acc;
    }, 0);
    this.allControllesCount = baseFields.length;
    this.allFilledControlsCount = filled;
  }
}
