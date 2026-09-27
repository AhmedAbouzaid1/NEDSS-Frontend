import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormArray, FormControl, FormGroup } from '@angular/forms';
import { UserMessageService } from 'src/app/core/services/user.message.service';
import { InvestigationService } from '../../services/investigation.service';
import { TranslateService } from '@ngx-translate/core';
import { DatePipe } from '@angular/common';
import { GeneralDataService } from '../../../general-data/services/general-data.service';
import { PagePermissionService } from '../../../../../core/services/page-permission.service';

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
  patientSexLabel: string = '';

  allFilledControlsCount: number = 0;
  allControllesCount: number = 0;

  // True when the case final diagnosis is confirmed measles / rubella; unlocks the 400-children survey tab.
  confirmedMeasles = false;

  // Tabs (order matches the paper form / attached images)
  activeTab: 'field' | 'contacts' | 'unit' | 'survey' | 'survey400' | 'followup' = 'field';
  tabs = [
    { key: 'field', label: 'التقصى الميدانى للحالة' },
    { key: 'contacts', label: 'حصر المخالطين' },
    { key: 'unit', label: 'التقصى على مستوى الوحدة الصحية' },
    { key: 'survey', label: 'المسح الميدانى 30 طفل' },
    { key: 'survey400', label: 'المسح الميداني 400 طفل' },
    { key: 'followup', label: 'متابعة الحالة بعد 21 يوم' },
  ];

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
    private pagePermission: PagePermissionService
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

      // Tab 4b - field survey (400 children) - positive cases only
      field400VisitDate: new FormControl(),
      field400SquareNumber: new FormControl(),
      survey400Children: new FormArray([]),

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
      this.patientSexLabel = p.genderId === 1 ? 'ذكر' : p.genderId === 2 ? 'أنثى' : '';
      this.patientAgeLabel = p.age != null ? `${p.age} ${this.ageUnit(p.ageTypeId)}` : '';
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
        if (!this.feverRashForm.value.reportDate) {
          this.feverRashForm.controls['reportDate'].setValue(this.todayStr());
        }
        this.ensureDefaultRows();
        this.calculateCompletionPercentage();
      },
      () => {
        if (!this.feverRashForm.value.reportDate) {
          this.feverRashForm.controls['reportDate'].setValue(this.todayStr());
        }
        this.ensureDefaultRows();
      }
    );
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

  private buildCaseMovement(m: any = {}): FormGroup {
    return new FormGroup({
      visitDate: new FormControl(this.d(m.visitDate)),
      contactPlace: new FormControl(m.contactPlace ?? null),
      address: new FormControl(m.address ?? null),
      directContactsCount: new FormControl(m.directContactsCount ?? null),
      symptomaticCount: new FormControl(m.symptomaticCount ?? null),
      noSymptomsCount: new FormControl(m.noSymptomsCount ?? null),
      vaccinatedCount: new FormControl(m.vaccinatedCount ?? null),
      notVaccinatedCount: new FormControl(m.notVaccinatedCount ?? null),
      notEligibleCount: new FormControl(m.notEligibleCount ?? null),
      unknownCount: new FormControl(m.unknownCount ?? null),
    });
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
  private buildSurveyChild(s: any = {}): FormGroup {
    return new FormGroup({
      childName: new FormControl(s.childName ?? null),
      mmr1: new FormControl(s.mmr1 ?? null),
      mmr2: new FormControl(s.mmr2 ?? null),
      hasSymptoms: new FormControl(s.hasSymptoms ?? null),
    });
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

  addSurveyChild() {
    const g = this.buildSurveyChild();
    this.surveyChildren.push(g);
    this.openRows.add(g);
  }
  removeSurveyChild(i: number) {
    this.openRows.delete(this.surveyChildren.at(i));
    this.surveyChildren.removeAt(i);
  }

  addSurvey400Child() {
    const g = this.buildSurveyChild();
    this.survey400Children.push(g);
    this.openRows.add(g);
  }
  removeSurvey400Child(i: number) {
    this.openRows.delete(this.survey400Children.at(i));
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
  yesNo(v: any): string {
    return String(v) === '1' ? 'نعم' : String(v) === '2' ? 'لا' : '';
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

  get surveyCount(): number {
    return this.surveyChildren.controls.filter((c) => this.isRowFilled(c)).length;
  }
  private surveyYesNo(field: string) {
    let yes = 0, no = 0;
    this.surveyChildren.controls.forEach((c) => {
      if (!this.isRowFilled(c)) return;
      const val = c.get(field)?.value;
      if (val === 1 || val === '1') yes++;
      else if (val === 2 || val === '2') no++;
    });
    return { yes, no };
  }
  get surveyMmr1() { return this.surveyYesNo('mmr1'); }
  get surveyMmr2() { return this.surveyYesNo('mmr2'); }
  get surveySymptoms() { return this.surveyYesNo('hasSymptoms'); }

  get survey400Count(): number {
    return this.survey400Children.controls.filter((c) => this.isRowFilled(c)).length;
  }
  private survey400YesNo(field: string) {
    let yes = 0, no = 0;
    this.survey400Children.controls.forEach((c) => {
      if (!this.isRowFilled(c)) return;
      const val = c.get(field)?.value;
      if (val === 1 || val === '1') yes++;
      else if (val === 2 || val === '2') no++;
    });
    return { yes, no };
  }
  get survey400Mmr1() { return this.survey400YesNo('mmr1'); }
  get survey400Mmr2() { return this.survey400YesNo('mmr2'); }
  get survey400Symptoms() { return this.survey400YesNo('hasSymptoms'); }

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
  save() {
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
    if (this.hasInvalidPregnantSampleDates()) {
      this.userMsg.error(`في حصر المخالطين: تاريخ عينة المخالطة الحامل لا يمكن أن يكون قبل تاريخ اكتشاف الحالة (${this.caseDiscoveryDate})`);
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

    const ok = () =>
      this.translateService.get('NEDSS.COMMON.SENT_SUCESSFULLY').subscribe((r: string) => this.userMsg.success(r));

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
