import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { SingleDropdownSettings } from 'src/app/core/constants';
import { LookupsGetterService } from 'src/app/core/services/lookups-getter.service';
import { UserMessageService } from 'src/app/core/services/user.message.service';
import { PatientModel } from '../models/patient-model';
import { SharedDataService } from '../services/shared-data.service';
import { DiseaseSpecialSymptomsService } from '../../dashboard/components/disease-special-symptoms/services/disease-special-symptoms.service';
import { GeneralDataService } from '../services/general-data.service';
import { map, Subject } from 'rxjs';
import { finalize, takeUntil } from 'rxjs/operators';
import { DepartmentEnum } from '../models/department-enum';

@Component({
  selector: 'app-diagonistics',
  templateUrl: './diagonistics.component.html',
  styleUrls: ['./diagonistics.component.css'],
})
export class DiagonisticsComponent implements OnInit, OnDestroy {
  minDate = new Date(1900, 0, 1);
  maxDate = new Date();

  patient: PatientModel = new PatientModel();
  private diseasesInitializedFromPatient = false;
  private lastSyncedPatientId: number | null = null;

  get caseStatusDisplay(): string {
    if (this.patient?.caseResultCategory) {
      return this.patient.caseResultCategory;
    }
    const data = this.patient?.finalDiagonisticsData;
    if (data && data.length) {
      return data.map((d) => d.caseResultCategory).filter((x) => !!x).join(' , ');
    }
    return this.selectedInitialDiagnosisNames() ? this.suspectedLabel : '';
  }

  get finalDiagnosisDisplay(): string {
    if (this.patient?.finalDiagonistics) {
      return this.patient.finalDiagonistics;
    }
    const data = this.patient?.finalDiagonisticsData;
    if (data && data.length) {
      return data.map((d) => d.finalResult).filter((x) => !!x).join(' , ');
    }
    return this.selectedInitialDiagnosisNames();
  }

  get suspectedLabel(): string {
    return this.currentLang === 'ar' ? 'مشتبه' : 'Suspected';
  }

  private selectedInitialDiagnosisNames(): string {
    if (!this.selectedDiseases || !this.selectedDiseases.length) {
      return '';
    }
    return this.selectedDiseases
      .map((d: any) =>
        this.currentLang === 'ar' ? d.arabicName : d.englishName
      )
      .filter((x: string) => !!x)
      .join(' , ');
  }

  levelId: any;
  currentLang: string = 'ar';
  governments: any[] = [];
  selectedTransferGovernment: any;
  selectedTransferGovernmentId: number = -1;

  selectedTransferHealthAdmin: any;
  selectedTransferHealthAdminId: number = -1;

  diseases: any[] = [];
  selectedDiseases: any;

  finalResuls!: any[];
  selectedFinalResult: any;
  selectedFinalResultId: number;

  incidentSources: any[] = [];
  selectedTransferIncidentSource: any;
  selectedTransferIncidentSourceId: number = -1;

  selectedResultCategory: any;
  selectedFinalDigonistics: any;
  selectedFinalDigonisticsId: number;

  isRegionalLabSelected: boolean = false;
  isSpecialLabSelected: boolean = false;
  isPatientTransfered: boolean = false;

  regionalLabs!: any[];
  selectedRegionalLab: any;
  selectedRegionalLabId: number;

  specialGovernment!: any[];
  selectedSpecialGovernment!: any[];
  selectedSpecialGovernmentId: number = -1;
  specialHealthAdmin!: any[];
  selectedSpecialHealthAdmin!: any[];
  selectedSpecialHealthAdminId: number = -1;
  specialLabs!: any[];
  selectedSpecialLab: any;
  selectedSpecialLabId: number = -1;

  loadingPanel: boolean = false;
  finalResultsLoading: boolean = false;
  transferGovernmentsLoading: boolean = false;
  healthAdminsLoading: boolean = false;
  incidentSourcesLoading: boolean = false;
  /** Inline loading for special-lab cascade (new patient has no id — full-screen loader is not tied to these calls). */
  loadingSpecialGovernments = false;
  loadingSpecialHealthAdmins = false;
  loadingSpecialLabs = false;

  singleDropdownSettings = {};
  diagnosticsMultipleDropdownSettings = {
    singleSelection: false,
    idField: 'id',
    textField:
      localStorage.getItem('ls.currentLang') == 'ar'
        ? 'arabicName'
        : 'englishName',
    selectAllText:
      localStorage.getItem('ls.currentLang') == 'ar'
        ? 'اختار الكل'
        : 'Select All',
    unSelectAllText:
      localStorage.getItem('ls.currentLang') == 'ar'
        ? 'الغاء الاختيار'
        : 'UnSelect All',
    placeholder:
      localStorage.getItem('ls.currentLang') == 'ar' ? 'اختر' : 'Choose',
    searchPlaceholderText:
      localStorage.getItem('ls.currentLang') == 'ar' ? 'بحث' : 'Search',
    noDataAvailablePlaceholderText:
      localStorage.getItem('ls.currentLang') == 'ar'
        ? 'لا يوجد بيانات'
        : 'No Data',
    itemsShowLimit: 3,
    allowSearchFilter: true,
    enableCheckAll: false,
    limitSelection: 3,
  };
  DepartmentEnum = DepartmentEnum;
  HealthAdmins:any[] = [];
  private governorateUserScopeFallbackDone = false;
  private destroy$ = new Subject<void>();
  constructor(
    private sharedDataService: SharedDataService,
    private lookupsService: LookupsGetterService,
    private translateService: TranslateService,
    private userMsg: UserMessageService,
    private diseaseSpecialSymptomsService: DiseaseSpecialSymptomsService,
    public generalDataService: GeneralDataService,
    private cdr: ChangeDetectorRef,
  ) { }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  ngOnInit() {
    this.loadingPanel = true;
    const savedLang = localStorage.getItem('ls.currentLang');
    this.currentLang =
      savedLang && savedLang !== 'undefined'
        ? savedLang
        : 'ar';

    this.levelId = JSON.parse(
      localStorage.getItem('ls.authorizationData')
    )?.user?.levelId;

    this.sharedDataService.getPatientObject().pipe(takeUntil(this.destroy$)).subscribe((patientObject) => {
      const pid =
        patientObject?.id != null &&
        String(patientObject.id).trim() !== '' &&
        !Number.isNaN(Number(patientObject.id))
          ? Number(patientObject.id)
          : null;
      if (pid !== this.lastSyncedPatientId) {
        this.lastSyncedPatientId = pid;
        this.diseasesInitializedFromPatient = false;
        this.specialLabHydratedForPatientId = null;
      }

      this.patient = patientObject;
      this.generalDataService.normalizePatientApiPayload(this.patient);
      this.selectedFinalResultId = this.patient.finalResultId;
      if (this.selectedFinalResultId == 1) {
        this.isPatientTransfered = true;
      }
      this.tryHydrateTransferLocationFromPatient();
      this.tryHydrateSpecialLabFromPatient();

      if (
        !this.diseasesInitializedFromPatient &&
        this.diseases?.length > 0 &&
        this.patient?.patientDiseases?.length > 0
      ) {
        this.selectedDiseases = this.diseases.filter((item) =>
          this.patient.patientDiseases.map((a) => a.diseaseGroupId).includes(item.id)
        );
        this.diseasesInitializedFromPatient = true;
        this.onDiseasesChanged();
      }
    });
    this.getLookups();
    this.singleDropdownSettings = SingleDropdownSettings;
    this.loadingPanel = false;
 
  }

  getLookups() {
    this.getGovernments();
    this.getDiseases();
    this.getFinalResults();
  }

  private toPositiveId(value: unknown): number | null {
    if (value == null || value === '') return null;
    const n = Number(value);
    return Number.isFinite(n) && n > 0 ? n : null;
  }

  private extractList(result: any): any[] {
    if (Array.isArray(result?.data)) return result.data;
    if (Array.isArray(result?.Data)) return result.Data;
    if (Array.isArray(result)) return result;
    return [];
  }

  /** Governorate API rows (handles camelCase / PascalCase and paged shapes). */
  private extractGovernanceRows(result: any): any[] {
    if (!result) return [];
    const tryArray = (d: any): any[] | null => {
      if (Array.isArray(d)) return d;
      if (d && typeof d === 'object') {
        if (Array.isArray((d as any).items)) return (d as any).items;
        if (Array.isArray((d as any).data)) return (d as any).data;
        if (Array.isArray((d as any).Data)) return (d as any).Data;
        if (Array.isArray((d as any).records)) return (d as any).records;
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

  private normalizeGovernmentRow(row: any): { id: number; arabicName: string; englishName: string } | null {
    const id =
      row?.id ??
      row?.Id ??
      row?.governmentId ??
      row?.GovernmentId ??
      row?.governmentID ??
      row?.GovernmentID;
    const n = Number(id);
    if (!Number.isFinite(n) || n <= 0) return null;
    return {
      id: n,
      arabicName: (row?.arabicName ?? row?.ArabicName ?? '').toString(),
      englishName: (row?.englishName ?? row?.EnglishName ?? '').toString(),
    };
  }

  private realGovernorateOptionCount(): number {
    return (this.governments ?? []).filter((g) => this.toPositiveId(g?.id) != null).length;
  }

  /** When "transferred" result is chosen, ensure governorate + district lists load and defaults apply. */
  private refreshTransferLookupsAfterFinalResult(): void {
    queueMicrotask(() => {
      if (this.realGovernorateOptionCount() <= 1) {
        this.getGovernments();
        return;
      }
      this.applyDefaultTransferGovernmentSelection();
      this.cdr.detectChanges();
    });
  }

  private applyDefaultTransferGovernmentSelection(): void {
    const savedGov = this.transferGovIdFromPatient();
    if (savedGov) {
      this.selectedTransferGovernmentId = savedGov;
      this.patient.transferGovernmentId = savedGov;
      // Do not use onGovernmentChanged() here: it clears transferHealthAdministrationId
      // before reloading, which breaks restoring existing transfer district + source.
      this.getHealthAdmin(this.transferHealthAdminIdFromPatient() != null);
      return;
    }
    if (this.levelId != 1) {
      const userGov = this.toPositiveId(
        JSON.parse(localStorage.getItem('ls.authorizationData') ?? '{}')?.user?.govenmentId,
      );
      if (userGov) {
        this.selectedTransferGovernmentId = userGov;
        this.onGovernmentChanged();
      }
      return;
    }
    const incidentGov = this.toPositiveId(this.patient?.incidentGovernmentId);
    if (incidentGov) {
      this.selectedTransferGovernmentId = incidentGov;
      this.onGovernmentChanged();
    } else {
      this.selectedTransferGovernmentId = -1;
      this.HealthAdmins = [{ id: -1, arabicName: 'إختر', englishName: 'Select' }];
      this.incidentSources = [{ id: -1, arabicName: 'إختر', englishName: 'Select' }];
    }
  }

  /** Read transfer governorate id from patient (camelCase or PascalCase API). */
  private transferGovIdFromPatient(): number | null {
    const p = this.patient as any;
    return this.toPositiveId(
      p?.transferGovernmentId ?? p?.TransferGovernmentId,
    );
  }

  private transferHealthAdminIdFromPatient(): number | null {
    const p = this.patient as any;
    return this.toPositiveId(
      p?.transferHealthAdministrationId ?? p?.TransferHealthAdministrationId,
    );
  }

  private transferIncidentSourceIdFromPatient(): number | null {
    const p = this.patient as any;
    return this.toPositiveId(
      p?.transferIncidentSourceId ?? p?.TransferIncidentSourceId,
    );
  }

  /**
   * After patient load or when governorate list is ready: restore transfer governorate,
   * district (health admin), and incident source from saved patient fields.
   */
  private tryHydrateTransferLocationFromPatient(): void {
    if (!this.patient) return;
    this.generalDataService.normalizePatientApiPayload(this.patient);

    const fr = Number(
      this.patient.finalResultId ?? (this.patient as any).FinalResultId,
    );
    if (fr === 1) {
      this.isPatientTransfered = true;
      this.selectedFinalResultId = 1;
    }

    if (!this.isPatientTransfered) {
      return;
    }

    const govId = this.transferGovIdFromPatient();
    const healthId = this.transferHealthAdminIdFromPatient();
    const srcId = this.transferIncidentSourceIdFromPatient();

    if (govId) {
      this.patient.transferGovernmentId = govId;
    }
    if (healthId) {
      this.patient.transferHealthAdministrationId = healthId;
    }
    if (srcId) {
      this.patient.transferIncidentSourceId = srcId;
    }

    if (!govId) {
      return;
    }

    if (!this.governments?.length || this.governments.length <= 1) {
      return;
    }

    this.selectedTransferGovernmentId = govId;
    this.getHealthAdmin(healthId != null);
  }

  private specialLabHydratedForPatientId: number | null = null;
  private resolvedSpecialLabGovId: number | null = null;
  private resolvedSpecialLabHaId: number | null = null;

  private tryHydrateSpecialLabFromPatient(): void {
    if (!this.patient?.isSpecialLabLab) {
      this.isSpecialLabSelected = false;
      return;
    }

    this.isSpecialLabSelected = true;
    this.resolvedSpecialLabGovId = this.toPositiveId(this.patient.specialLabGovernmentId);
    this.resolvedSpecialLabHaId = this.toPositiveId(this.patient.specialLabHealthAdministrationId);

    if (!(this.specialGovernment?.length > 1)) {
      this.getSpecialGovernments(true);
    } else if (this.resolvedSpecialLabGovId) {
      this.selectedSpecialGovernmentId = this.resolvedSpecialLabGovId;
      this.getSpecialHealthAdmins(true);
    }
  }

  onItemSelect(item: any) { }
  onSelectAll(items: any) { }

  onDiseasesChanged() {
    this.sharedDataService.ShowSentinel = false;
    if (this.selectedDiseases.length > 0) {
      this.selectedDiseases.forEach((element) => {
        if (
          this.diseases.filter((o) => o.id == element.id && o.isSentinel)
            .length > 0
        ) {
          this.sharedDataService.ShowSentinel = true;
        }
      });
    }
    if (this.selectedDiseases.length > 0) {
      this.patient.patientDiseases = this.selectedDiseases.map((p) => ({
        diseaseGroupId: p.id,
      }));
      //add all patient disease properties
      this.patient.patientDiseases.forEach((d) => {
        let des = this.diseases.find((p) => p.id == d.diseaseGroupId);
        d.isSentinel = des.isSentinel;
        d.router = des.router;
      });
      this.sharedDataService.setPatientObject(this.patient);
      this.getAllQuestions();
    } else {
      this.patient.patientDiseases = null;
      this.patient.fields = [];
      this.sharedDataService.setPatientObject(this.patient);
    }
  }

  onDiseasesSelectAll(event: any) {
    this.selectedDiseases = [];

    event.forEach((d) => {
      this.selectedDiseases.push(d);
    });

    this.onDiseasesChanged();
  }

  onDiseasesDSelectAll() {
    this.selectedDiseases = [];
    this.onDiseasesChanged();
  }

  onGovernmentChanged() {
    if (this.selectedTransferGovernmentId != -1) {
      this.patient.transferGovernmentId = this.selectedTransferGovernmentId;
      this.HealthAdmins = [];
      this.selectedTransferHealthAdminId = -1;
      this.patient.transferHealthAdministrationId = null;
      this.incidentSources = [];
      this.selectedTransferIncidentSourceId = -1;
      this.patient.transferIncidentSourceId = null;
      this.getHealthAdmin(false);
    } else {
      this.patient.transferGovernmentId = null;
      this.HealthAdmins = [];
      this.selectedTransferHealthAdminId = -1;
      this.patient.transferHealthAdministrationId = null;
      this.incidentSources = [];
      this.selectedTransferIncidentSourceId = -1;
      this.patient.transferIncidentSourceId = null;
    }
  }

  onHealthAdminChange(preserveIncidentSelection = false) {
    if (this.selectedTransferHealthAdminId != -1) {
      this.patient.transferHealthAdministrationId = this.selectedTransferHealthAdminId;
      if (!preserveIncidentSelection) {
        this.selectedTransferIncidentSourceId = -1;
        this.patient.transferIncidentSourceId = null;
      }
      this.getIncidentSources(
        this.patient.transferHealthAdministrationId,
        preserveIncidentSelection
      );
    } else {
      this.patient.transferHealthAdministrationId = null;
      this.incidentSources = [];
      this.selectedTransferIncidentSourceId = -1;
      this.patient.transferIncidentSourceId = null;
    }
  }

  onIncidentSourceChanged() {
    if (this.selectedTransferIncidentSourceId != -1)
      this.patient.transferIncidentSourceId =
        this.selectedTransferIncidentSourceId;
    else this.patient.transferIncidentSourceId = null;
  }

  onFinalResultChanged() {
    if (this.selectedFinalResultId != -1) {
      this.patient.finalResultId = this.selectedFinalResultId;
      if (this.selectedFinalResultId == 1) {
        this.isPatientTransfered = true;
        this.refreshTransferLookupsAfterFinalResult();
      } else {
        this.isPatientTransfered = false;
        this.HealthAdmins=[];
        this.incidentSources=[];
        this.patient.transferGovernmentId = null;
        this.patient.transferHealthAdministrationId = null;
        this.patient.transferIncidentSourceId = null;
        this.selectedTransferGovernmentId = -1;
        this.selectedTransferHealthAdminId = -1;
        this.selectedTransferIncidentSourceId = -1;
      }
    } else {
      this.isPatientTransfered = false;
        this.HealthAdmins=[];
        this.incidentSources=[];
        this.patient.transferGovernmentId = null;
        this.patient.transferHealthAdministrationId = null;
        this.patient.transferIncidentSourceId = null;
        this.selectedTransferGovernmentId = -1;
        this.selectedTransferHealthAdminId = -1;
        this.selectedTransferIncidentSourceId = -1;
    }
  }

  onRegionalLabChanged() {
    if (this.selectedRegionalLabId != -1)
      this.patient.regionalLabId = this.selectedRegionalLabId;
    else this.patient.regionalLabId = null;
  }

  onSpecialLabChanged() {
    if (this.selectedSpecialLabId != -1)
      this.patient.specialLabSourceId = this.selectedSpecialLabId;
    else this.patient.specialLabSourceId = null;
  }

  onRegionalLabSelected() {
    if (this.isRegionalLabSelected) {
      this.isRegionalLabSelected = false;
      this.patient.regionalLabId = null;
    }
  }

  onSpecialLabSelected() {
    if (!this.patient.isSpecialLabLab) {
      this.isSpecialLabSelected = false;
      this.patient.specialLabSourceId = null;
      this.patient.specialLabName = null;
      this.patient.specialLabGovernmentId = null;
      this.patient.specialLabHealthAdministrationId = null;
      this.generalDataService.isSpecialLabNameValid = true;
      this.resolvedSpecialLabGovId = null;
      this.resolvedSpecialLabHaId = null;
      this.selectedSpecialGovernmentId = -1;
      this.selectedSpecialHealthAdminId = -1;
      this.selectedSpecialLabId = -1;
      this.loadingSpecialGovernments = false;
      this.loadingSpecialHealthAdmins = false;
      this.loadingSpecialLabs = false;
    } else {
      this.isSpecialLabSelected = true;
      this.specialLabHydratedForPatientId = null;
      this.tryHydrateSpecialLabFromPatient();
    }
  }

  getGovernments() {
    this.governorateUserScopeFallbackDone = false;
    this.fetchGovernorateOptionsForTransfer('primary');
  }

  /**
   * Loads transfer governorate list using a URL distinct from `Government/GetAll`
   * (used by incident-info on the same page) so pending-request de-dupe does not
   * swallow this subscription. Falls back to user-scoped list if the full list is empty.
   */
  private fetchGovernorateOptionsForTransfer(phase: 'primary' | 'userScoped'): void {
    this.transferGovernmentsLoading = true;
    const request$ =
      phase === 'primary'
        ? this.lookupsService.getAllGovernmentsExplicit(false, 'diag-transfer')
        : this.lookupsService.getAllGovernmentsForUser(true);

    request$
      .pipe(finalize(() => (this.transferGovernmentsLoading = false)))
      .subscribe(
      (result: any) => {
        if (result != null && result != undefined) {
          const raw = this.extractGovernanceRows(result);
          const normalized = raw
            .map((r) => this.normalizeGovernmentRow(r))
            .filter((r): r is { id: number; arabicName: string; englishName: string } => r != null);

          if (
            normalized.length === 0 &&
            phase === 'primary' &&
            !this.governorateUserScopeFallbackDone
          ) {
            this.governorateUserScopeFallbackDone = true;
            this.fetchGovernorateOptionsForTransfer('userScoped');
            return;
          }

          this.governments = [
            { id: -1, arabicName: 'إختر', englishName: 'Select' },
            ...normalized,
          ];

          if (this.transferGovIdFromPatient()) {
            this.tryHydrateTransferLocationFromPatient();
          } else {
            const openingExistingPatient =
              this.sharedDataService.isEditMode &&
              (this.toPositiveId((this.patient as any)?.id) != null ||
                this.toPositiveId(this.sharedDataService.patientId) != null);
            if (openingExistingPatient) {
              this.tryHydrateTransferLocationFromPatient();
            } else if (this.levelId != 1) {
              this.selectedTransferGovernmentId = JSON.parse(
                localStorage.getItem('ls.authorizationData')
              ).user.govenmentId;
              this.onGovernmentChanged();
            } else if (this.isPatientTransfered) {
              this.applyDefaultTransferGovernmentSelection();
            }
          }
        }
        this.loadingPanel = false;
        this.cdr.detectChanges();
      },
      (error) => {
        this.loadingPanel = false;
        this.translateService
          .get('NEDSS.COMMON.INTERNAL_SERVER_ERROR')
          .subscribe((res: string) => {
            this.userMsg.error(res);
          });
      }
    );
  }
  getDiseases() {
    this.lookupsService.getAllDiseaseGroups().subscribe(
      (result: any) => {
        const list = Array.isArray(result?.data)
          ? result.data
          : Array.isArray(result)
            ? result
            : [];
        this.diseases = list;

        if (
          this.patient?.patientDiseases != null &&
          this.patient.patientDiseases.length > 0 &&
          this.diseases.length > 0
        ) {
          this.selectedDiseases = this.diseases.filter((item) =>
            this.patient.patientDiseases
              .map((a) => a.diseaseGroupId)
              .includes(item.id)
          );
          this.diseasesInitializedFromPatient = true;
          this.onDiseasesChanged();
        }
        this.loadingPanel = false;
      },
      (error) => {
        this.loadingPanel = false;
        this.translateService
          .get('NEDSS.COMMON.INTERNAL_SERVER_ERROR')
          .subscribe((res: string) => {
            this.userMsg.error(res);
          });
      }
    );
  }
  getFinalResults() {
    this.finalResultsLoading = true;
    this.lookupsService
      .getAllFinalResults()
      .pipe(finalize(() => (this.finalResultsLoading = false)))
      .subscribe(
      (result: any) => {
        if (result != null && result != undefined) {
          this.finalResuls = [
            { id: -1, arabicName: 'إختر', englishName: 'Select' },
          ];
          const excludedFinalResultNames = ['Blank', 'غير معروف', 'Unknown'];
          result.data
            .filter(
              (gov) =>
                !excludedFinalResultNames.includes(gov.arabicName) &&
                !excludedFinalResultNames.includes(gov.englishName)
            )
            .forEach((gov) => {
              this.finalResuls.push(gov);
            });
          if (this.patient.finalResultId > 0) {
            this.selectedFinalResultId = this.patient.finalResultId;
          } else {
            this.selectedFinalResultId = -1;
          }
        }
        this.loadingPanel = false;
      },
      (error) => {
        this.loadingPanel = false;
        this.translateService
          .get('NEDSS.COMMON.INTERNAL_SERVER_ERROR')
          .subscribe((res: string) => {
            this.userMsg.error(res);
          });
      }
    );
  }
  getHealthAdmin(restoreSelection = false) {
    const govId = this.toPositiveId(
      this.selectedTransferGovernmentId ?? this.patient.transferGovernmentId
    );
    if (!govId) {
      this.HealthAdmins = [];
      return;
    }
    this.healthAdminsLoading = true;
    this.lookupsService
      .getPageHealthAdministrations({
        governmentID: govId,
        forSystemUser: false,
      })
      .pipe(finalize(() => (this.healthAdminsLoading = false)))
      .subscribe(
        (result: any) => {
          if (result != null && result != undefined) {
            this.HealthAdmins = [
              { id: -1, arabicName: 'إختر', englishName: 'Select' },
            ];
            this.extractList(result).forEach((h) => {
              const id = h?.id ?? h?.Id;
              const pid = this.toPositiveId(id);
              if (!pid) return;
              this.HealthAdmins.push({
                id: pid,
                arabicName: (h?.arabicName ?? h?.ArabicName ?? '').toString(),
                englishName: (h?.englishName ?? h?.EnglishName ?? '').toString(),
              });
            });
            if (restoreSelection) {
              const savedHealthAdminId = this.transferHealthAdminIdFromPatient();
              if (savedHealthAdminId) {
                this.selectedTransferHealthAdminId = savedHealthAdminId;
                this.patient.transferHealthAdministrationId = savedHealthAdminId;
                this.onHealthAdminChange(true);
              }
            }
          }
          this.loadingPanel = false;
          this.cdr.detectChanges();
        },
        (error) => {
          this.loadingPanel = false;
          this.translateService
            .get('NEDSS.COMMON.INTERNAL_SERVER_ERROR')
            .subscribe((res: string) => {
              this.userMsg.error(res);
            });
          })
  }
  
  getIncidentSources(healthAdministrationID: any, preserveSelection = false) {
    this.incidentSourcesLoading = true;
    (!this.isPatientTransfered ?
      this.lookupsService
        .getPageIncidentSourceHospitals({
          healthAdministrationID: healthAdministrationID,
        }) :
      this.lookupsService
        .GetTransferedIncidentSources(healthAdministrationID).pipe(map((res: any) => {
          if (res?.data?.length) {
            res.data = res.data.map(x => {
              return {
                id: x.id ?? x.Id,
                arabicName: x.name ?? x.Name ?? x.arabicName ?? '',
                englishName: x.name ?? x.Name ?? x.englishName ?? '',
              }
            })
          }
          return res;
        }))
    )
      .pipe(finalize(() => (this.incidentSourcesLoading = false)))
      .subscribe(
        (result: any) => {
          if (result != null && result != undefined) {
            this.incidentSources = [
              { id: -1, arabicName: 'إختر', englishName: 'Select' },
            ];
            this.extractList(result).forEach((row) => {
              const id = row?.id ?? row?.Id;
              const pid = this.toPositiveId(id);
              if (!pid) return;
              this.incidentSources.push({
                id: pid,
                arabicName: (row?.arabicName ?? row?.ArabicName ?? '').toString(),
                englishName: (row?.englishName ?? row?.EnglishName ?? '').toString(),
              });
            });

            if (preserveSelection) {
              const savedIncidentSourceId = this.transferIncidentSourceIdFromPatient();
              if (savedIncidentSourceId) {
                this.selectedTransferIncidentSourceId = savedIncidentSourceId;
                this.patient.transferIncidentSourceId = savedIncidentSourceId;
              }
            } else if (this.levelId != 1 && this.levelId != 2 && this.levelId != 3) {
              this.selectedTransferIncidentSourceId = JSON.parse(
                localStorage.getItem('ls.authorizationData')
              ).user.incidentSourceId;
              this.onIncidentSourceChanged();
            }
          }
          this.loadingPanel = false;
          this.cdr.detectChanges();
        },
        (error) => {
          this.loadingPanel = false;
          this.translateService
            .get('NEDSS.COMMON.INTERNAL_SERVER_ERROR')
            .subscribe((res: string) => {
              this.userMsg.error(res);
            });
        }
      );
  }

  getRegionalLabs(governmentID: any) {
    this.lookupsService
      .getPageIncidentSourceHospitals({
        governmentID: governmentID /*, IncidentSourceTypeID:*/,
      })
      .subscribe(
        (result: any) => {
          if (result != null && result != undefined) {
            this.regionalLabs = [
              { id: -1, arabicName: 'إختر', englishName: 'Select' },
            ];
            result.data.forEach((gov) => {
              this.regionalLabs.push(gov);
            });
          }
          this.loadingPanel = false;
        },
        (error) => {
          this.loadingPanel = false;
          this.translateService
            .get('NEDSS.COMMON.INTERNAL_SERVER_ERROR')
            .subscribe((res: string) => {
              this.userMsg.error(res);
            });
        }
      );
  }

  getSpecialGovernments(restoreSelection = false) {
    this.loadingSpecialGovernments = true;
    this.fetchSpecialGovernorateList(restoreSelection);
  }

  private fetchSpecialGovernorateList(restoreSelection: boolean): void {
    this.lookupsService.getAllGovernmentsExplicit(false, 'diag-special').subscribe(
      (result: any) => {
        if (result != null && result != undefined) {
          const raw = this.extractGovernanceRows(result);
          const normalized = raw
            .map((r) => this.normalizeGovernmentRow(r))
            .filter((r): r is { id: number; arabicName: string; englishName: string } => r != null);
          this.specialGovernment = [
            { id: -1, arabicName: 'إختر', englishName: 'Select' },
            ...normalized,
          ];
          if (restoreSelection) {
            const savedGov = this.resolvedSpecialLabGovId;
            if (savedGov) {
              this.selectedSpecialGovernmentId = savedGov;
              this.getSpecialHealthAdmins(true);
            }
          }
        }
        this.loadingSpecialGovernments = false;
        this.loadingPanel = false;
        this.cdr.detectChanges();
      },
      (error) => {
        this.loadingSpecialGovernments = false;
        this.loadingPanel = false;
        this.translateService
          .get('NEDSS.COMMON.INTERNAL_SERVER_ERROR')
          .subscribe((res: string) => {
            this.userMsg.error(res);
          });
      }
    );
  }

  getSpecialHealthAdmins(restoreSelection = false) {
    if (!restoreSelection) {
      this.specialHealthAdmin = [];
      this.specialLabs = [];
      this.selectedSpecialLab = null;
      this.selectedSpecialLabId = -1;
      this.selectedSpecialHealthAdmin = null;
      this.selectedSpecialHealthAdminId = -1;
      this.patient.specialLabSourceId = null;
      this.patient.specialLabGovernmentId = this.toPositiveId(this.selectedSpecialGovernmentId);
      this.patient.specialLabHealthAdministrationId = null;
    }
    const specialGovId = this.toPositiveId(this.selectedSpecialGovernmentId);
    if (specialGovId != null) {
      this.loadingSpecialHealthAdmins = true;
      this.lookupsService
        .getPageHealthAdministrations({
          governmentID: specialGovId,
        })
        .subscribe(
          (result: any) => {
            if (result != null && result != undefined) {
              this.specialHealthAdmin = [
                { id: -1, arabicName: 'إختر', englishName: 'Select' },
              ];
              this.extractList(result).forEach((h) => {
                const id = h?.id ?? h?.Id;
                const hid = this.toPositiveId(id);
                if (!hid) return;
                this.specialHealthAdmin.push({
                  id: hid,
                  arabicName: (h?.arabicName ?? h?.ArabicName ?? '').toString(),
                  englishName: (h?.englishName ?? h?.EnglishName ?? '').toString(),
                });
              });
              if (restoreSelection) {
                const savedHA = this.resolvedSpecialLabHaId;
                if (savedHA) {
                  this.selectedSpecialHealthAdminId = savedHA;
                }
                this.getSpecialLabs(true);
              }
            }
            this.loadingSpecialHealthAdmins = false;
            this.loadingPanel = false;
            this.cdr.detectChanges();
          },
          (error) => {
            this.loadingSpecialHealthAdmins = false;
            this.loadingPanel = false;
            this.translateService
              .get('NEDSS.COMMON.INTERNAL_SERVER_ERROR')
              .subscribe((res: string) => {
                this.userMsg.error(res);
              });
          }
        );
    } else {
      this.loadingSpecialHealthAdmins = false;
    }
  }

  getSpecialLabs(restoreSelection = false) {
    if (!restoreSelection) {
      this.specialLabs = [];
      this.selectedSpecialLab = null;
      this.selectedSpecialLabId = -1;
      this.patient.specialLabSourceId = null;
      this.patient.specialLabHealthAdministrationId = this.toPositiveId(this.selectedSpecialHealthAdminId);
    }
    const labGov = this.toPositiveId(this.selectedSpecialGovernmentId);
    if (labGov == null) {
      this.loadingSpecialLabs = false;
      this.loadingPanel = false;
      return;
    }
    const labHa = this.toPositiveId(this.selectedSpecialHealthAdminId);
    const filter: Record<string, unknown> = {
      reportingOrResidence: 1,
      governmentID: labGov,
    };
    if (labHa != null) {
      filter.healthAdministrationID = labHa;
    }
    this.loadingSpecialLabs = true;
    this.lookupsService
      .getPageIncidentSourceHospitals(filter)
      .subscribe(
        (result: any) => {
          if (result != null && result != undefined) {
            this.specialLabs = [
              { id: -1, arabicName: 'إختر', englishName: 'Select' },
            ];
            this.extractList(result).forEach((row) => {
              const id = row?.id ?? row?.Id;
              const lid = this.toPositiveId(id);
              if (!lid) return;
              this.specialLabs.push({
                id: lid,
                arabicName: (row?.arabicName ?? row?.ArabicName ?? row?.name ?? row?.Name ?? '').toString(),
                englishName: (row?.englishName ?? row?.EnglishName ?? row?.name ?? row?.Name ?? '').toString(),
              });
            });
            if (restoreSelection) {
              const savedLab = this.toPositiveId(this.patient.specialLabSourceId);
              if (savedLab) {
                this.selectedSpecialLabId = savedLab;
              }
            }
          }
          this.loadingSpecialLabs = false;
          this.loadingPanel = false;
          this.cdr.detectChanges();
        },
        (error) => {
          this.loadingSpecialLabs = false;
          this.loadingPanel = false;
          this.translateService
            .get('NEDSS.COMMON.INTERNAL_SERVER_ERROR')
            .subscribe((res: string) => {
              this.userMsg.error(res);
            });
        }
      );
  }

  getAllQuestions() {
    let ids = this.patient.patientDiseases.map((a) => a.diseaseGroupId);

    this.diseaseSpecialSymptomsService
      .getForBuildFormByDiseaseId({
        diseaseGroupIds: ids,
        patientId: this.patient.id,
      })
      .subscribe(
        (res) => {
          this.patient.fields = res.data;
          this.sharedDataService.setPatientObject(this.patient);
        },
        () => { }
      );
  }

}
