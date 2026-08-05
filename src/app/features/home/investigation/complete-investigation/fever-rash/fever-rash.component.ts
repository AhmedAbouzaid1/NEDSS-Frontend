import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormArray, FormControl, FormGroup } from '@angular/forms';
import { UserMessageService } from 'src/app/core/services/user.message.service';
import { InvestigationService } from '../../services/investigation.service';
import { TranslateService } from '@ngx-translate/core';
import { DatePipe } from '@angular/common';
import { GeneralDataService } from '../../../general-data/services/general-data.service';

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
  patientAgeLabel: string = '';
  patientSexLabel: string = '';

  allFilledControlsCount: number = 0;
  allControllesCount: number = 0;

  // Tabs (order matches the paper form / attached images)
  activeTab: 'field' | 'contacts' | 'unit' | 'survey' | 'followup' = 'field';
  tabs = [
    { key: 'field', label: 'التقصى الميدانى للحالة' },
    { key: 'contacts', label: 'حصر المخالطين' },
    { key: 'unit', label: 'التقصى على مستوى الوحدة الصحية' },
    { key: 'survey', label: 'المسح الميدانى 30 طفل' },
    { key: 'followup', label: 'متابعة الحالة بعد 28 يوم' },
  ];

  // Expand/collapse state for the card-based grids (case movements, previous cases).
  private openRows = new Set<AbstractControl>();

  private arrayKeys = ['caseMovements', 'previousCases', 'generalContacts', 'pregnantContacts', 'surveyChildren'];
  private coreKeys = ['id', 'patientID', 'diseaseGroupID', 'investigationCompletePercentage'];

  // Scalar date controls (formatted to yyyy-MM-dd on load).
  private dateFields = new Set([
    'reportDate', 'homeVisitDate', 'measlesLastDoseDate', 'mmrLastDoseDate', 'mrLastDoseDate',
    'coverageVisitDate', 'lastCaseDateAdmin', 'lastCaseDateDirectorate', 'fieldVisitDate',
    'committeeSpecialistDate', 'adminOfficerDate', 'directorateOfficerDate',
  ]);

  constructor(
    private investigationService: InvestigationService,
    private datePipe: DatePipe,
    private translateService: TranslateService,
    private userMsg: UserMessageService,
    private generalDataService: GeneralDataService
  ) { }

  ngOnInit() {
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
      reportDate: new FormControl(),
      homeVisitDate: new FormControl(),

      // Tab 1 - case field investigation
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
      covUnitRoutineMmr1Rate: new FormControl(),
      covUnitRoutineMmr2Target: new FormControl(),
      covUnitRoutineMmr2Rate: new FormControl(),
      covUnitCampaignMmr1Target: new FormControl(),
      covUnitCampaignMmr1Rate: new FormControl(),
      covUnitCampaignMmr2Target: new FormControl(),
      covUnitCampaignMmr2Rate: new FormControl(),
      covAdminRoutineMmr1Target: new FormControl(),
      covAdminRoutineMmr1Rate: new FormControl(),
      covAdminRoutineMmr2Target: new FormControl(),
      covAdminRoutineMmr2Rate: new FormControl(),
      covAdminCampaignMmr1Target: new FormControl(),
      covAdminCampaignMmr1Rate: new FormControl(),
      covAdminCampaignMmr2Target: new FormControl(),
      covAdminCampaignMmr2Rate: new FormControl(),
      lastCaseDateAdmin: new FormControl(),
      lastCaseDateDirectorate: new FormControl(),
      confirmedCasesLastMonth: new FormControl(),
      confirmedCasesCount: new FormControl(),
      feverRashCasesLastMonth: new FormControl(),
      feverRashCasesCount: new FormControl(),
      movedToOutbreak: new FormControl(),

      // Tab 4 - field survey (30 children)
      fieldVisitDate: new FormControl(),
      fieldSquareNumber: new FormControl(),
      surveyChildren: new FormArray([]),

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
    });
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
    if (this.caseMovements.length === 0) this.addCaseMovement();
    if (this.previousCases.length === 0) this.addPreviousCase();
    if (this.generalContacts.length === 0) this.addGeneralContact();
    if (this.surveyChildren.length === 0) this.addSurveyChild();
  }

  private patchFromRecord(v: any) {
    const patch: any = {};
    Object.keys(this.feverRashForm.controls).forEach((key) => {
      if (this.arrayKeys.includes(key)) return;
      if (v[key] === undefined) return;
      patch[key] = this.dateFields.has(key) && v[key] ? this.d(v[key]) : v[key];
    });
    this.feverRashForm.patchValue(patch);

    this.parseJsonInto(v.caseMovementsJson, (m) => this.caseMovements.push(this.buildCaseMovement(m)));
    this.parseJsonInto(v.previousCasesJson, (p) => this.previousCases.push(this.buildPreviousCase(p)));
    this.parseJsonInto(v.generalContactsJson, (c) => this.generalContacts.push(this.buildContact(c)));
    this.parseJsonInto(v.pregnantContactsJson, (p) => this.pregnantContacts.push(this.buildPregnant(p)));
    this.parseJsonInto(v.surveyChildrenJson, (s) => this.surveyChildren.push(this.buildSurveyChild(s)));
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
    return new FormGroup({
      name: new FormControl(c.name ?? null),
      ageYears: new FormControl(c.ageYears ?? null),
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
  }
  private buildPregnant(p: any = {}): FormGroup {
    return new FormGroup({
      name: new FormControl(p.name ?? null),
      age: new FormControl(p.age ?? null),
      contactLocation: new FormControl(p.contactLocation ?? null),
      vaccinated: new FormControl(!!p.vaccinated),
      pregnancyWeeks: new FormControl(p.pregnancyWeeks ?? null),
      symptomAppearanceDate: new FormControl(this.d(p.symptomAppearanceDate)),
      expectedDeliveryDate: new FormControl(this.d(p.expectedDeliveryDate)),
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
      case '1': return 'المنزل';
      case '2': return 'المدرسة';
      case '3': return 'العمل';
      case '4': return 'أخرى';
      default: return '';
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

  // ===================== Save =====================
  save() {
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

    const ok = () =>
      this.translateService.get('NEDSS.COMMON.SENT_SUCESSFULLY').subscribe((r: string) => this.userMsg.success(r));
    const fail = () =>
      this.translateService.get('NEDSS.COMMON.SENT_FAILD').subscribe((r: string) => this.userMsg.error(r));

    if (payload.id != null) {
      this.investigationService.updateFeverRash(payload).subscribe((r: any) => r && ok(), () => fail());
    } else {
      this.investigationService.addInvestigationFeverRash(payload).subscribe((r: any) => r && ok(), () => fail());
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
