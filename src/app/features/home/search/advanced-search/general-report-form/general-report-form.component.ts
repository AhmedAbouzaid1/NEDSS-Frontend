import { Component, OnDestroy, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { Subject } from 'rxjs';
import { finalize, takeUntil } from 'rxjs/operators';
import { LookupsGetterService } from 'src/app/core/services/lookups-getter.service';
import { UserMessageService } from 'src/app/core/services/user.message.service';
import { ActiveUserService } from 'src/app/core/services/active-user.service';
import { Relations } from 'src/app/core/constants';
import { SearchSharedDataService } from '../../services/search-shared-data.service';
import { Patient } from '../../models/patient';
import { GeneralDataService } from '../../../general-data/services/general-data.service';
import { isInternalLikeDepartment } from '../../../general-data/models/department-enum';

type LookupOption = { id: number | null; arabicName: string; englishName: string };
type IncidentFilter = Patient;

@Component({
  selector: 'app-general-report-form',
  templateUrl: './general-report-form.component.html',
  styleUrls: ['./general-report-form.component.css'],
})
export class generalreportFormComponent implements OnInit, OnDestroy {
  private static defaultsApplied = false;
  private destroy$ = new Subject<void>();

  currentLang: string = 'ar';
  patient: IncidentFilter = {};

  governments: LookupOption[] = [this.placeholder()];
  healthAdministration: LookupOption[] = [this.placeholder()];
  branches: LookupOption[] = [this.placeholder()];
  areas: LookupOption[] = [this.placeholder()];
  incidentSources: LookupOption[] = [this.placeholder()];
  departments: LookupOption[] = [this.placeholder()];
  nationalities: LookupOption[] = [this.placeholder()];
  relations: LookupOption[] = [this.placeholder(), ...Relations];

  governmentsLoading = false;
  healthAdministrationLoading = false;
  branchesLoading = false;
  areasLoading = false;
  incidentSourcesLoading = false;
  departmentsLoading = false;
  nationalitiesLoading = false;

  private user: any = {};

  constructor(
    private lookupsService: LookupsGetterService,
    private translateService: TranslateService,
    private userMsg: UserMessageService,
    public generalDataService: GeneralDataService,
    private sharedDataService: SearchSharedDataService,
    public activeUSerService: ActiveUserService
  ) {}

  get parts() {
    return this.activeUSerService.getAccessibleParts;
  }

  ngOnInit() {
    const savedLang = localStorage.getItem('ls.currentLang');
    this.currentLang = savedLang && savedLang !== 'undefined' ? savedLang : 'ar';
    const link = document.getElementById('fastSearch') as HTMLElement;
    link?.classList.add('active');

    this.user = this.readUser();

    this.sharedDataService
      .getPatientObject()
      .pipe(takeUntil(this.destroy$))
      .subscribe((patientObject) => {
        this.patient = patientObject;
      });

    this.applyUserDefaults(!generalreportFormComponent.defaultsApplied);
    generalreportFormComponent.defaultsApplied = true;

    this.generalDataService.cardIdValidationMessage = '';
    this.loadLookups();
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private placeholder(): LookupOption {
    return { id: null, arabicName: 'إختر', englishName: 'Select' };
  }

  private readUser(): any {
    try {
      const data =
        JSON.parse(localStorage.getItem('ls.authorizationData')) ??
        JSON.parse(localStorage.getItem('lsOffline.authorizationData'));
      return data?.user ?? {};
    } catch {
      return {};
    }
  }

  private toPositiveInt(v: unknown): number | null {
    if (v === null || v === undefined || v === '') {
      return null;
    }
    const n = Number(v);
    return Number.isFinite(n) && n > 0 ? n : null;
  }

  private extractApiDataArray(result: any): any[] {
    if (!result) {
      return [];
    }
    const tryArray = (d: any): any[] | null => {
      if (Array.isArray(d)) return d;
      if (d && typeof d === 'object') {
        if (Array.isArray(d.items)) return d.items;
        if (Array.isArray(d.data)) return d.data;
        if (Array.isArray(d.Data)) return d.Data;
        if (Array.isArray(d.records)) return d.records;
      }
      return null;
    };
    for (const d of [result.data, result.Data, result.result, result.items]) {
      const arr = tryArray(d);
      if (arr) return arr;
    }
    if (Array.isArray(result)) return result;
    return [];
  }

  private toOptions(result: any): LookupOption[] {
    const mapped = this.extractApiDataArray(result)
      .map((row) => {
        const n = Number(row?.id ?? row?.Id);
        if (!Number.isFinite(n) || n <= 0) return null;
        return {
          id: n,
          arabicName: String(row?.arabicName ?? row?.ArabicName ?? row?.name ?? row?.Name ?? ''),
          englishName: String(row?.englishName ?? row?.EnglishName ?? row?.name ?? row?.Name ?? ''),
        };
      })
      .filter((o): o is LookupOption => o != null);
    return [this.placeholder(), ...mapped];
  }

  private hasOption(list: LookupOption[], id: number | null | undefined): boolean {
    return id != null && list.some((o) => o.id === id);
  }

  private showError() {
    this.translateService
      .get('NEDSS.COMMON.INTERNAL_SERVER_ERROR')
      .subscribe((res: string) => this.userMsg.error(res));
  }

  private applyUserDefaults(initial: boolean) {
    const p = this.patient;
    const u = this.user;
    const gov = this.toPositiveInt(u?.govenmentId);
    const admin = this.toPositiveInt(u?.healthAdministrationId);
    const source = this.toPositiveInt(u?.incidentSourceId);
    const branch = this.toPositiveInt(u?.branchId);
    const area = this.toPositiveInt(u?.areaId);

    if (initial && p.incidentGovernmentId == null) {
      p.incidentGovernmentId = gov;
      p.incidentHealthAdministrationId = p.incidentHealthAdministrationId ?? admin;
      p.incidentSourceId = p.incidentSourceId ?? source;
    }
    if (initial && this.showsBranches) {
      p.incidentBranchId = p.incidentBranchId ?? branch;
    }
    if (initial && this.parts?.showAreas) {
      p.incidentAreaId = p.incidentAreaId ?? area;
    }

    if (!this.parts?.enableGovernments && gov != null) p.incidentGovernmentId = gov;
    if (!this.parts?.enableDepartments && admin != null) p.incidentHealthAdministrationId = admin;
    if (!this.parts?.enableSources && source != null) p.incidentSourceId = source;
    if (branch != null && this.branchLocked) p.incidentBranchId = branch;
    if (area != null && this.parts?.showAreas && !this.parts?.enableAreas) p.incidentAreaId = area;
  }

  get showsBranches(): boolean {
    return !!(this.parts?.showBranches || this.parts?.showUniversities);
  }

  private get branchLocked(): boolean {
    return !!(
      (this.parts?.showBranches && !this.parts?.enableBranches) ||
      (this.parts?.showUniversities && !this.parts?.enableUniversities)
    );
  }

  private get lookupBranchId(): number | null {
    return this.showsBranches ? this.patient.incidentBranchId : this.toPositiveInt(this.user?.branchId);
  }

  private get lookupAreaId(): number | null {
    return this.parts?.showAreas ? this.patient.incidentAreaId : this.toPositiveInt(this.user?.areaId);
  }

  private loadLookups() {
    this.getGovernments();
    this.getDepartments();
    this.getNationalities();
    if (this.showsBranches) {
      this.getBranches();
    }
  }

  getGovernments() {
    this.governmentsLoading = true;
    this.lookupsService.getAllGovernmentsExplicit(false, 'incident-gov').subscribe(
      (result: any) => this.applyGovernments(result, true),
      () => {
        this.governmentsLoading = false;
        this.showError();
      }
    );
  }

  private applyGovernments(result: any, allowUserScopeFallback: boolean) {
    const options = this.toOptions(result);
    if (options.length === 1 && allowUserScopeFallback) {
      this.lookupsService.getAllGovernmentsForUser(true).subscribe(
        (r2: any) => this.applyGovernments(r2, false),
        () => {
          this.governmentsLoading = false;
          this.showError();
        }
      );
      return;
    }
    this.governments = options;
    this.governmentsLoading = false;
    if (this.patient.incidentGovernmentId != null) {
      this.loadGovernmentChildren();
    }
  }

  onGovernmentChanged() {
    this.patient.incidentHealthAdministrationId = null;
    this.patient.incidentSourceId = null;
    this.healthAdministration = [this.placeholder()];
    this.incidentSources = [this.placeholder()];
    if (this.patient.incidentGovernmentId != null) {
      this.loadGovernmentChildren();
    }
  }

  private loadGovernmentChildren() {
    if (this.parts?.showDepartments) {
      this.getHealthAdministration(this.patient.incidentGovernmentId);
    } else {
      this.getIncidentSources(
        this.patient.incidentHealthAdministrationId,
        this.patient.incidentGovernmentId
      );
    }
  }

  getHealthAdministration(governmentID: number) {
    if (governmentID == null) {
      return;
    }
    this.healthAdministrationLoading = true;
    this.lookupsService
      .getPageHealthAdministrations({ governmentID: governmentID })
      .pipe(finalize(() => (this.healthAdministrationLoading = false)))
      .subscribe(
        (result: any) => {
          this.healthAdministration = this.toOptions(result);
          if (
            this.patient.incidentHealthAdministrationId != null &&
            !this.hasOption(this.healthAdministration, this.patient.incidentHealthAdministrationId) &&
            this.parts?.enableDepartments
          ) {
            this.patient.incidentHealthAdministrationId = null;
          }
          if (this.patient.incidentHealthAdministrationId != null) {
            this.getIncidentSources(this.patient.incidentHealthAdministrationId);
          }
        },
        () => this.showError()
      );
  }

  onHealthAdministrationChanged() {
    this.patient.incidentSourceId = null;
    this.incidentSources = [this.placeholder()];
    if (this.patient.incidentHealthAdministrationId != null) {
      this.getIncidentSources(this.patient.incidentHealthAdministrationId);
    } else {
      this.getIncidentSources(-1);
    }
  }

  getBranches() {
    this.branchesLoading = true;
    this.lookupsService
      .getAllBranches(this.user?.organizationId)
      .pipe(finalize(() => (this.branchesLoading = false)))
      .subscribe(
        (result: any) => {
          this.branches = this.toOptions(result);
          if (this.patient.incidentBranchId != null) {
            this.getAreas();
            this.getIncidentSources(this.patient.incidentAreaId ?? this.patient.incidentBranchId);
          }
        },
        () => this.showError()
      );
  }

  branchSelected() {
    this.patient.incidentAreaId = null;
    this.areas = [this.placeholder()];
    if (this.patient.incidentBranchId != null) {
      this.getAreas();
      this.getIncidentSources(this.patient.incidentBranchId);
    }
  }

  getAreas() {
    this.areasLoading = true;
    this.lookupsService
      .getAllAreas(this.patient.incidentBranchId)
      .pipe(finalize(() => (this.areasLoading = false)))
      .subscribe(
        (result: any) => {
          this.areas = this.toOptions(result);
        },
        () => this.showError()
      );
  }

  areaSelected() {
    this.getIncidentSources(this.patient.incidentAreaId);
  }

  getIncidentSources(healthAdministrationID: any, governmentID: number | null = null) {
    const resolvedHealthAdminId =
      this.toPositiveInt(healthAdministrationID) ??
      this.toPositiveInt(this.patient.incidentHealthAdministrationId) ??
      -1;
    this.incidentSourcesLoading = true;
    this.lookupsService
      .getPageIncidentSourceHospitals({
        healthAdministrationID: resolvedHealthAdminId,
        branchId: this.parts?.showAreas ? null : this.lookupBranchId,
        areaId: this.lookupAreaId,
        governmentID: governmentID,
        forSystemUser: governmentID ? true : null,
        forHome: false,
      })
      .pipe(finalize(() => (this.incidentSourcesLoading = false)))
      .subscribe(
        (result: any) => {
          this.incidentSources = this.toOptions(result);
          if (
            this.patient.incidentSourceId != null &&
            !this.hasOption(this.incidentSources, this.patient.incidentSourceId) &&
            this.parts?.enableSources
          ) {
            this.patient.incidentSourceId = null;
          }
        },
        () => this.showError()
      );
  }

  onDepartmentChanged() {
    const departmentId = Number(this.patient.incidentDepartmentId);
    if (departmentId > 0 && !isInternalLikeDepartment(departmentId)) this.patient.finalResultId = null;
  }

  getDepartments() {
    this.departmentsLoading = true;
    this.lookupsService
      .getAllDepartments()
      .pipe(finalize(() => (this.departmentsLoading = false)))
      .subscribe(
        (result: any) => {
          this.departments = this.toOptions(result);
        },
        () => this.showError()
      );
  }

  getNationalities() {
    this.nationalitiesLoading = true;
    this.lookupsService
      .getAllNationalitys()
      .pipe(finalize(() => (this.nationalitiesLoading = false)))
      .subscribe(
        (result: any) => {
          this.nationalities = this.toOptions(result);
        },
        () => this.showError()
      );
  }

  onCaseDiscoveryTimeChanged(value: string) {
    this.patient.caseDiscoveryTime = value ? (value.length === 5 ? `${value}:00` : value) : null;
  }

  onNationalIdChanged(value: string) {
    this.patient.nationalId = value ? value : null;
    this.generalDataService.isCardIdValid = this.generalDataService.validateNationalID(
      this.patient.nationalId,
      false
    );
  }

  onPassportNoChanged(value: string) {
    const trimmed = (value ?? '').trim();
    this.patient.passportNo = trimmed ? trimmed : null;
  }

  clearAll() {
    this.patient = { pageIndex: 0, pageSize: 10, filterType: 1 };
    this.sharedDataService.setPatientObject(this.patient);
    this.healthAdministration = [this.placeholder()];
    this.areas = [this.placeholder()];
    this.incidentSources = [this.placeholder()];
    this.generalDataService.isCardIdValid = true;
    this.applyUserDefaults(true);
    if (this.patient.incidentGovernmentId != null) {
      this.loadGovernmentChildren();
    }
    if (this.patient.incidentBranchId != null && this.showsBranches) {
      this.getAreas();
      this.getIncidentSources(this.patient.incidentAreaId ?? this.patient.incidentBranchId);
    }
  }
}
