import { Component, OnDestroy, OnInit } from '@angular/core';
import { EMPTY, Observable, Subject } from 'rxjs';
import { catchError, finalize, takeUntil } from 'rxjs/operators';
import { LookupsGetterService } from 'src/app/core/services/lookups-getter.service';
import { finalDiagnosisOptionsWithOther } from 'src/app/core/shared/utilis/final-diagnoses';
import { Patient } from '../../models/patient';
import { SearchSharedDataService } from '../../services/search-shared-data.service';
import { isInternalLikeDepartment } from '../../../general-data/models/department-enum';

interface LookupOption {
  id: number;
  arabicName: string;
  englishName: string;
}

@Component({
  selector: 'app-search-diagnostics',
  templateUrl: './search-diagnostics.component.html',
  styleUrls: ['./search-diagnostics.component.css'],
})
export class SearchDiagnosticsComponent implements OnInit, OnDestroy {
  readonly hospitalLabOptions: LookupOption[] = [
    { id: 1, arabicName: 'محل الإبلاغ', englishName: 'Reporting place' },
    { id: 2, arabicName: 'أخرى', englishName: 'Other' },
  ];
  private static readonly EXCLUDED_FINAL_RESULT_NAMES = ['Blank', 'غير معروف', 'Unknown'];

  patient: Patient;
  currentLang = 'ar';

  diseaseGroups: LookupOption[] = [];
  finalDiseases: any[] = [];
  caseResultCategories: LookupOption[] = [];
  finalResults: LookupOption[] = [];
  transferGovernments: LookupOption[] = [];
  transferHealthAdmins: LookupOption[] = [];
  transferIncidentSources: LookupOption[] = [];
  regionalLabs: LookupOption[] = [];
  specialGovernments: LookupOption[] = [];
  specialHealthAdmins: LookupOption[] = [];

  diseaseGroupsLoading = false;
  finalDiseasesLoading = false;
  caseResultCategoriesLoading = false;
  finalResultsLoading = false;
  transferGovernmentsLoading = false;
  transferHealthAdminsLoading = false;
  transferIncidentSourcesLoading = false;
  regionalLabsLoading = false;
  specialGovernmentsLoading = false;
  specialHealthAdminsLoading = false;

  private destroy$ = new Subject<void>();

  constructor(
    private sharedDataService: SearchSharedDataService,
    private lookupsService: LookupsGetterService
  ) {}

  get optionLabel(): string {
    return this.currentLang === 'ar' ? 'arabicName' : 'englishName';
  }

  get showFinalResult(): boolean {
    const departmentId = Number((this.patient as any)?.incidentDepartmentId);
    return !(departmentId > 0) || isInternalLikeDepartment(departmentId);
  }

  get selectPlaceholder(): string {
    return this.currentLang === 'ar' ? 'إختر' : 'Select';
  }

  ngOnInit() {
    const savedLang = localStorage.getItem('ls.currentLang');
    this.currentLang = savedLang && savedLang !== 'undefined' ? savedLang : 'ar';

    this.sharedDataService
      .getPatientObject()
      .pipe(takeUntil(this.destroy$))
      .subscribe((patientObject) => {
        if (patientObject === this.patient) return;
        this.patient = patientObject;
        if (!this.showFinalResult && this.patient) this.patient.finalResultId = null;
        this.hydrateCascades();
      });

    this.loadDiseaseGroups();
    this.loadFinalDiseases();
    this.loadCaseResultCategories();
    this.loadFinalResults();
    this.loadTransferGovernments(false);
    this.loadRegionalLabs();
    this.loadSpecialGovernments();
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  onLabFlagChange(key: keyof Patient, checked: boolean) {
    (this.patient as any)[key] = checked ? true : null;
  }

  onTransferGovernmentChange() {
    this.patient.transferHealthAdministrationId = null;
    this.patient.transferIncidentSourceId = null;
    this.transferHealthAdmins = [];
    this.transferIncidentSources = [];
    this.loadTransferHealthAdmins();
  }

  onTransferHealthAdminChange() {
    this.patient.transferIncidentSourceId = null;
    this.transferIncidentSources = [];
    this.loadTransferIncidentSources();
  }

  onSpecialGovernmentChange() {
    this.patient.specialLabHealthAdministrationId = null;
    this.specialHealthAdmins = [];
    this.loadSpecialHealthAdmins();
  }

  private hydrateCascades() {
    this.transferHealthAdmins = [];
    this.transferIncidentSources = [];
    this.specialHealthAdmins = [];
    this.loadTransferHealthAdmins();
    this.loadTransferIncidentSources();
    this.loadSpecialHealthAdmins();
  }

  private loadDiseaseGroups() {
    this.diseaseGroupsLoading = true;
    this.fetch(this.lookupsService.getAllDiseaseGroups(), () => (this.diseaseGroupsLoading = false))
      .subscribe((result) => (this.diseaseGroups = this.toOptions(result)));
  }

  private loadFinalDiseases() {
    this.finalDiseasesLoading = true;
    this.fetch(this.lookupsService.getAllDiseases(), () => (this.finalDiseasesLoading = false))
      .subscribe((result) => (this.finalDiseases = finalDiagnosisOptionsWithOther(this.extractList(result))));
  }

  private loadCaseResultCategories() {
    this.caseResultCategoriesLoading = true;
    this.fetch(this.lookupsService.getAllCaseResultCategorys(), () => (this.caseResultCategoriesLoading = false))
      .subscribe((result) => (this.caseResultCategories = this.toOptions(result)));
  }

  private loadFinalResults() {
    this.finalResultsLoading = true;
    this.fetch(this.lookupsService.getAllFinalResults(), () => (this.finalResultsLoading = false))
      .subscribe((result) => {
        const excluded = SearchDiagnosticsComponent.EXCLUDED_FINAL_RESULT_NAMES;
        this.finalResults = this.toOptions(result).filter(
          (r) => !excluded.includes(r.arabicName) && !excluded.includes(r.englishName)
        );
      });
  }

  private loadTransferGovernments(userScoped: boolean) {
    this.transferGovernmentsLoading = true;
    const request$ = userScoped
      ? this.lookupsService.getAllGovernmentsForUser(true)
      : this.lookupsService.getAllGovernmentsExplicit(false, 'diag-transfer');
    this.fetch(request$, () => (this.transferGovernmentsLoading = false)).subscribe((result) => {
      const options = this.toOptions(result);
      if (!options.length && !userScoped) {
        this.loadTransferGovernments(true);
        return;
      }
      this.transferGovernments = options;
    });
  }

  private loadTransferHealthAdmins() {
    const govId = this.toPositiveId(this.patient?.transferGovernmentId);
    if (!govId) return;
    this.transferHealthAdminsLoading = true;
    this.fetch(
      this.lookupsService.getPageHealthAdministrations({ governmentID: govId, forSystemUser: false }),
      () => (this.transferHealthAdminsLoading = false)
    ).subscribe((result) => {
      if (this.toPositiveId(this.patient?.transferGovernmentId) !== govId) return;
      this.transferHealthAdmins = this.toOptions(result);
    });
  }

  private loadTransferIncidentSources() {
    const healthAdminId = this.toPositiveId(this.patient?.transferHealthAdministrationId);
    if (!healthAdminId) return;
    this.transferIncidentSourcesLoading = true;
    this.fetch(
      this.lookupsService.GetTransferedIncidentSources(healthAdminId),
      () => (this.transferIncidentSourcesLoading = false)
    ).subscribe((result) => {
      if (this.toPositiveId(this.patient?.transferHealthAdministrationId) !== healthAdminId) return;
      this.transferIncidentSources = this.toOptions(result);
    });
  }

  private loadRegionalLabs() {
    const userGovernmentId = this.toPositiveId(
      JSON.parse(localStorage.getItem('ls.authorizationData') ?? '{}')?.user?.govenmentId
    );
    const filter: Record<string, unknown> = {};
    if (userGovernmentId) filter.governmentID = userGovernmentId;
    this.regionalLabsLoading = true;
    this.fetch(this.lookupsService.getPageIncidentSourceHospitals(filter), () => (this.regionalLabsLoading = false))
      .subscribe((result) => (this.regionalLabs = this.toOptions(result)));
  }

  private loadSpecialGovernments() {
    this.specialGovernmentsLoading = true;
    this.fetch(
      this.lookupsService.getAllGovernmentsExplicit(false, 'diag-special'),
      () => (this.specialGovernmentsLoading = false)
    ).subscribe((result) => (this.specialGovernments = this.toOptions(result)));
  }

  private loadSpecialHealthAdmins() {
    const govId = this.toPositiveId(this.patient?.specialLabGovernmentId);
    if (!govId) return;
    this.specialHealthAdminsLoading = true;
    this.fetch(
      this.lookupsService.getPageHealthAdministrations({ governmentID: govId }),
      () => (this.specialHealthAdminsLoading = false)
    ).subscribe((result) => {
      if (this.toPositiveId(this.patient?.specialLabGovernmentId) !== govId) return;
      this.specialHealthAdmins = this.toOptions(result);
    });
  }

  private fetch(request$: Observable<any>, done: () => void): Observable<any> {
    return request$.pipe(
      takeUntil(this.destroy$),
      catchError(() => EMPTY),
      finalize(done)
    );
  }

  private extractList(result: any): any[] {
    for (const candidate of [result?.data, result?.Data, result]) {
      if (Array.isArray(candidate)) return candidate;
      if (Array.isArray(candidate?.items)) return candidate.items;
      if (Array.isArray(candidate?.data)) return candidate.data;
    }
    return [];
  }

  private toOptions(result: any): LookupOption[] {
    return this.extractList(result)
      .map((row) => {
        const id = this.toPositiveId(row?.id ?? row?.Id);
        if (!id) return null;
        const fallbackName = row?.name ?? row?.Name ?? '';
        return {
          id,
          arabicName: String(row?.arabicName || row?.ArabicName || fallbackName),
          englishName: String(row?.englishName || row?.EnglishName || fallbackName),
        };
      })
      .filter((row): row is LookupOption => row != null);
  }

  private toPositiveId(value: unknown): number | null {
    if (value == null || value === '') return null;
    const n = Number(value);
    return Number.isFinite(n) && n > 0 ? n : null;
  }
}
