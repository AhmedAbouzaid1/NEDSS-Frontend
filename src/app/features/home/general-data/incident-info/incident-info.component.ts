import { TranslateService } from '@ngx-translate/core';
import { LookupsGetterService } from './../../../../core/services/lookups-getter.service';
import {
  ChangeDetectorRef,
  Component,
  OnInit,
  OnDestroy,
  ViewEncapsulation,
  ContentChildren,
  HostListener,
  QueryList,
} from '@angular/core';
import { PatientModel, FeverSymptoms } from '../models/patient-model';
import { SharedDataService } from '../services/shared-data.service';
import { UserMessageService } from 'src/app/core/services/user.message.service';
import {
  MultipleDropdownSettings,
  Relations,
  SingleDropdownSettings,
} from 'src/app/core/constants';
import { GeneralDataService } from '../services/general-data.service';
import { ActivatedRoute, Router } from '@angular/router';
import { NgControl } from '@angular/forms';
import { ActiveUserService } from 'src/app/core/services/active-user.service';
import { NationalityEnum } from '../models/nationality-enum';
import { DepartmentEnum } from '../models/department-enum';
import { RelativeEnum } from '../models/relative-enum';
import { environment } from 'src/environments/environment';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
@Component({
  selector: 'app-incident-info',
  templateUrl: './incident-info.component.html',
  styleUrls: ['./incident-info.component.css'],
  encapsulation: ViewEncapsulation.None,
})
export class IncidentInfoComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();
  @ContentChildren(NgControl) formControls: QueryList<NgControl>;

  @HostListener('submit')
  check() {
    const controls = this.formControls.toArray();

    for (let field of controls) {
      if (field.invalid) {
        (field.valueAccessor as any)._elementRef.nativeElement.focus();
        break;
      }
    }
  }
  delay: boolean = false;
  timer: any;
  patient: PatientModel = new PatientModel();
  levelId: any;
  diseases!: any[];
  nationalities!: any[];
  selectedNationality: any;
  selectedNationalityId: number;
  ogPatient: PatientModel = new PatientModel();
  governments!: any[];
  selectedGovernment: any;
  selectedGovernmentId: number = -1;

  healthAdministration: any[] = [
    { id: -1, arabicName: 'إختر', englishName: 'Select' },
  ];
  selectedHealthAdministration: any;
  selectedHealthAdministrationId: number;

  incidentSources: any[] = [
    { id: -1, arabicName: 'إختر', englishName: 'Select' },
  ];
  selectedIncidentSource: any;
  selectedIncidentSourceId: number;

  /** Prevents p-dropdown from receiving undefined options before GetAll returns. */
  departments: any[] = [
    { id: -1, arabicName: 'إختر', englishName: 'Select' },
  ];
  selectedDepartment: any;
  selectedDepartmentId: number;

  relations = Relations;
  loadingPanel: boolean = false;
  isForeign: boolean = false;
  currentLang: string = 'ar';
  singleDropdownSettings = {};
  multipleDropdownSettings = {};
  Allpatients: any;
  maxDate = new Date();
  minDate = new Date(1900, 0, 1);
  defaultGovernmentId = null;
  defaultHealthAdministrationId = null;
  defaultIncidentSourceId = null;
  organizationId = null;
  SelectedbranchId: number;
  branches: any[];
  SelectedareaId: number;
  areas: any[];
  NationalityEnum = NationalityEnum;
  constructor(
    private sharedDataService: SharedDataService,
    private lookupsService: LookupsGetterService,
    private translateService: TranslateService,
    private userMsg: UserMessageService,
    public generalDataService: GeneralDataService,
    private router: Router,
    private route: ActivatedRoute,
    public activeUSerService: ActiveUserService,
    private cdr: ChangeDetectorRef,
  ) { }

  private incidentGovFetchRetries = 0;
  private healthAdminFetchRetries = 0;
  private incidentSourceFetchRetries = 0;
  private departmentFetchRetries = 0;
  /** Avoid re-running governorate cascade on every patient emission for the same record. */
  private incidentLocationHydratedForPatientId: number | null = null;
  private lastSeenPatientIdForIncidentHydrate: number | null = null;
  private isSettingPatientLocally = false;

  private toPositiveInt(v: unknown): number | null {
    if (v === null || v === undefined || v === '') {
      return null;
    }
    const n = Number(v);
    return Number.isFinite(n) && n > 0 ? n : null;
  }

  private extractApiDataArray(result: any): any[] {
    if (!result || result.status === environment.DUPLICATED_REQUEST_STATUS_CODE) {
      return [];
    }
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

  private mapLookupRowToOption(row: any): { id: number; arabicName: string; englishName: string } | null {
    const id = row?.id ?? row?.Id;
    const n = Number(id);
    if (!Number.isFinite(n) || n <= 0) return null;
    return {
      id: n,
      arabicName: String(row?.arabicName ?? row?.ArabicName ?? ''),
      englishName: String(row?.englishName ?? row?.EnglishName ?? ''),
    };
  }

  private mapIncidentSourceRow(row: any): { id: number; arabicName: string; englishName: string } | null {
    const id = row?.id ?? row?.Id;
    const n = Number(id);
    if (!Number.isFinite(n) || n <= 0) return null;
    const ar = String(
      row?.arabicName ?? row?.ArabicName ?? row?.name ?? row?.Name ?? '',
    );
    const en = String(
      row?.englishName ?? row?.EnglishName ?? row?.name ?? row?.Name ?? '',
    );
    return { id: n, arabicName: ar, englishName: en };
  }

  private scheduleIncidentBind(fn: () => void): void {
    queueMicrotask(() => {
      fn();
      this.cdr.detectChanges();
    });
  }

  /**
   * When opening an existing patient (e.g. from fast search), governorate HTTP may finish
   * before getById populates the shared patient — applyIncidentGovernmentsFromApi then runs
   * with empty incident ids. Call this after patient load and after governorate list load.
   */
  private maybeHydrateIncidentLocationFromPatient(): void {
    if (!this.sharedDataService.isEditMode) {
      return;
    }
    const pid =
      this.toPositiveInt(this.patient?.id) ??
      this.toPositiveInt(this.sharedDataService.patientId);
    if (pid !== this.lastSeenPatientIdForIncidentHydrate) {
      this.lastSeenPatientIdForIncidentHydrate = pid;
      this.incidentLocationHydratedForPatientId = null;
    }
    if (pid == null) {
      return;
    }
    if (!(this.governments?.length > 1)) {
      return;
    }
    const g = this.toPositiveInt(this.patient.incidentGovernmentId);
    if (g == null) {
      return;
    }
    if (this.incidentLocationHydratedForPatientId === pid) {
      return;
    }
    this.incidentLocationHydratedForPatientId = pid;
    this.scheduleIncidentBind(() => {
      this.selectedGovernmentId = g;
      this.onGovernmentChanged();
    });
  }

  public get departmentEnum(): typeof DepartmentEnum {
    return DepartmentEnum;
  }

  ngOnInit() {
    queueMicrotask(() => {
      const link = document.getElementById('incidentInfo') as HTMLElement;
      if (link) {
        link.classList.add('active');
      }
    });
    const savedLang = localStorage.getItem('ls.currentLang');
    this.currentLang =
      savedLang && savedLang !== 'undefined' ? savedLang : 'ar';
    this.getDiseases();

    const userData =
      JSON.parse(localStorage.getItem('ls.authorizationData')) ??
      JSON.parse(localStorage.getItem('lsOffline.authorizationData'));
    this.defaultGovernmentId = userData.user.govenmentId;
    this.defaultHealthAdministrationId =
      userData?.user?.healthAdministrationId;
    this.levelId = userData?.user?.levelId;
    this.defaultIncidentSourceId = userData?.user?.incidentSourceId;

    if (!this.sharedDataService.isEditMode) {
      this.selectedGovernmentId =
        this.patient.incidentGovernmentId =
        userData.user.govenmentId;
      switch (userData.user.levelId) {
        case 4:
          this.selectedIncidentSourceId = this.defaultIncidentSourceId =
            userData.user.incidentSourceId;
        case 3:
          this.selectedHealthAdministrationId =
            this.defaultHealthAdministrationId =
              userData.user.healthAdministrationId;
        case 2:
          this.selectedGovernmentId = this.defaultGovernmentId =
            userData.user.govenmentId;
        case 1:
        default:
          break;
      }
    } else {
      this.selectedGovernmentId = -1;
      this.selectedHealthAdministrationId = -1;
      this.selectedIncidentSourceId = -1;
    }

    this.getLookups();

    this.sharedDataService.getPatientObject().pipe(takeUntil(this.destroy$)).subscribe((patientObject) => {
        if (this.isSettingPatientLocally) return;
        this.patient = patientObject;
        this.generalDataService.normalizePatientApiPayload(this.patient);
        this.ogPatient = patientObject;
        this.patient.caseDiscoveryDate;

        this.syncDepartmentSelectionFromPatient();
        this.selectedNationality = [];
        if (this.nationalities != null && this.nationalities?.length > 0) {
          this.selectedNationality.push(
            this.nationalities.filter(
              (o) => o.id == this.patient.nationalityId
            )[0]
          );
          this.selectedNationalityId = this.patient.nationalityId;
        }

        if (this.patient.relationShipDegreeId == null)
          this.patient.relationShipDegreeId = 0;
        if (this.patient.nationalId != null) {
          this.getGender(this.patient.nationalId);
        }
        this.levelId = JSON.parse(
          localStorage.getItem('ls.authorizationData')
        )?.user?.levelId;
        let healthAdministrationId = JSON.parse(
          localStorage.getItem('ls.authorizationData')
        ).user.healthAdministrationId;
        let govenmentId = JSON.parse(
          localStorage.getItem('ls.authorizationData')
        ).user.govenmentId;

        let incidentSourceId;

        const incidentGov = this.toPositiveInt(this.patient.incidentGovernmentId);
        if (incidentGov != null) {
          govenmentId = incidentGov;
          this.selectedGovernmentId = incidentGov;
        } else {
          incidentSourceId = JSON.parse(
            localStorage.getItem('ls.authorizationData')
          ).user.incidentSourceId;
        }

        const incidentSrc = this.toPositiveInt(this.patient.incidentSourceId);
        if (incidentSrc != null) {
          incidentSourceId = incidentSrc;
          this.selectedIncidentSourceId = incidentSrc;
        } else {
          incidentSourceId = JSON.parse(
            localStorage.getItem('ls.authorizationData')
          ).user.incidentSourceId;
        }

        if (
          (this.patient.incidentGovernmentId == undefined ||
            this.patient.incidentGovernmentId == null) &&
          !this.sharedDataService.isEditMode
        ) {
          // New record only: default incident location from logged-in user.
          this.patient.incidentGovernmentId = govenmentId;
          this.patient.incidentHealthAdministrationId = healthAdministrationId;
          this.patient.incidentSourceId = incidentSourceId;
        }

        this.organizationId = JSON.parse(
          localStorage.getItem('ls.authorizationData')
        ).user?.organizationId;

        this.SelectedbranchId = JSON.parse(
          localStorage.getItem('ls.authorizationData')
        ).user?.branchId;
        if (
          this.activeUSerService.getAccessibleParts?.showBranches ||
          this.activeUSerService.getAccessibleParts?.showUniversities
        ) {
          this.getBranches();
        }
        if (patientObject.incidentAreaId) {
          this.SelectedareaId = this.patient.incidentAreaId;
        } else {
          this.SelectedareaId = JSON.parse(
            localStorage.getItem('ls.authorizationData')
          ).user?.areaId;
        }
        this.maybeHydrateIncidentLocationFromPatient();
      });

    const routeParams = this.route.snapshot.paramMap;
    var tokenText = routeParams.get('clear');
    this.router.routerState.root.queryParams.pipe(takeUntil(this.destroy$)).subscribe((params) => {
      if (params.clear == 1) {
        this.incidentLocationHydratedForPatientId = null;
        this.lastSeenPatientIdForIncidentHydrate = null;
        this.patient = new PatientModel();
        this.sharedDataService.setPatientObject(new PatientModel());
        this.sharedDataService.ShowSentinel = false;
        this.selectedDepartment = [];
        this.selectedNationality = [];
        this.patient.relationShipDegreeId = 0;
        let healthAdministrationId = JSON.parse(
          localStorage.getItem('ls.authorizationData')
        ).user.healthAdministrationId;
        let govenmentId = JSON.parse(
          localStorage.getItem('ls.authorizationData')
        ).user.govenmentId;
        let incidentSourceId = JSON.parse(
          localStorage.getItem('ls.authorizationData')
        ).user.incidentSourceId;

        if (this.governments?.length > 0)
          this.selectedGovernmentId = govenmentId != null ? govenmentId : -1;
        this.patient.incidentGovernmentId = govenmentId;
        if (this.healthAdministration?.length > 0)
          this.selectedHealthAdministration =
            this.healthAdministration?.filter(
              (o) => o.id == healthAdministrationId
            );
        this.patient.incidentHealthAdministrationId = healthAdministrationId;
        if (this.incidentSources?.length > 0)
          this.selectedIncidentSource = this.incidentSources?.filter(
            (o) => o.id == incidentSourceId
          );
        this.patient.incidentSourceId = incidentSourceId;
        this.onGovernmentChanged();
      }
    });

    this.singleDropdownSettings = SingleDropdownSettings;
    this.multipleDropdownSettings = MultipleDropdownSettings;
    this.loadingPanel = false;
    queueMicrotask(() => {
      this.checkInitNationality();
      if (
        this.patient?.nationalityId != null &&
        this.patient.nationalityId != NationalityEnum.Egyptian
      ) {
        this.onNationalIdChanged(this.patient.nationalityId);
      }
    });

    this.generalDataService.cardIdValidationMessage = '';
  }

  getBranches() {
    this.lookupsService.getAllBranches(this.organizationId).subscribe(
      (result: any) => {
        if (result != null && result != undefined) {
          this.branches = result.data;
          this.branches.unshift({
            id: null,
            arabicName: 'إختر',
            englishName: 'Select',
          });
          if (this.patient.incidentBranchId) {
            this.SelectedbranchId = this.patient.incidentBranchId;
          }
          if (this.SelectedbranchId > 0) {
            this.branchSelected();
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

  branchSelected() {
    // this.governmentDeSelected();
    this.patient.incidentBranchId = this.SelectedbranchId;
    if (this.SelectedbranchId) {
      // this.healthAdministrations = [];
      // this.getHealthAdministrationsForUsers(this.user.branchId);
      this.getAreas();
      this.getIncidentSources(this.SelectedbranchId);
    }
  }

  getAreas() {
    this.lookupsService.getAllAreas(this.SelectedbranchId).subscribe(
      (result: any) => {
        if (result != null && result != undefined) {
          this.areas = result.data;
          this.areas.unshift({
            id: null,
            arabicName: 'إختر',
            englishName: 'Select',
          });
          if (this.SelectedareaId) {
            this.areaSelected();
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
  areaSelected() {
    // this.governmentDeSelected();
    this.patient.incidentAreaId = this.SelectedareaId;
    this.getIncidentSources(this.SelectedareaId);
    // if (this.SelectedareaId) {
    // this.getIncidentSources(
    //   this.user.healthAdministrationId,
    //   this.user.organizationId
    // );
    // }
  }

  getDiseases() {
    this.lookupsService.getAllDiseaseGroups().subscribe(
      (result: any) => {
        if (result != null && result != undefined) {
          this.diseases = result.data;
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

  onItemSelect(item: any) { }
  onSelectAll(items: any) { }
  onNationalityChanged() {
    if (this.selectedNationalityId != NationalityEnum.NotSelected) {
      this.patient.nationalityId = this.selectedNationalityId;
      if (this.selectedNationalityId != NationalityEnum.Egyptian) {
        this.isForeign = true;
        this.patient.nationalId = '';
        this.onNationalIdChanged(null);
      } else {
        this.isForeign = false;
      }
    } else {
      this.patient.nationalityId = NationalityEnum.NotSelected;
      this.isForeign = false;
    }
  }

  checkInitNationality() {
    if (this.patient.nationalityId == 0 || this.patient.nationalityId == null) {
      this.isForeign = false;
    } else if (this.patient.nationalityId != NationalityEnum.Egyptian) {
      this.onNationalIdChanged(this.patient.nationalityId);
      this.isForeign = true;
    } else {
      this.isForeign = false;
    }
  }
  onGovernmentChanged() {
    queueMicrotask(() => {
      if (
        this.selectedGovernmentId != null &&
        this.selectedGovernmentId != -1
      ) {
        this.patient.incidentGovernmentId = this.selectedGovernmentId;
        this.selectedIncidentSourceId = -1;
        if (this.activeUSerService.getAccessibleParts?.showDepartments) {
          this.getHealthAdministration(this.patient.incidentGovernmentId);
        } else {
          this.getIncidentSources(
            this.patient.incidentHealthAdministrationId,
            this.selectedGovernmentId,
          );
        }
      } else {
        this.patient.incidentGovernmentId = null;
        this.healthAdministration = [
          { id: -1, arabicName: 'إختر', englishName: 'Select' },
        ];
        this.selectedHealthAdministration = null;
        this.selectedHealthAdministrationId = -1;
        this.patient.incidentHealthAdministrationId = null;
        this.incidentSources = [
          { id: -1, arabicName: 'إختر', englishName: 'Select' },
        ];
        this.patient.incidentSourceId = null;
        this.selectedIncidentSource = null;
        this.selectedIncidentSourceId = -1;
      }
      this.cdr.detectChanges();
    });
  }
  onHealthAdministrationChanged() {
    if (this.selectedHealthAdministrationId != -1) {
      this.patient.incidentHealthAdministrationId =
        this.selectedHealthAdministrationId;
      this.getIncidentSources(this.patient.incidentHealthAdministrationId);
    } else {
      this.patient.incidentHealthAdministrationId = null;
      this.incidentSources = [
        { id: -1, arabicName: 'إختر', englishName: 'Select' },
      ];
      this.patient.incidentSourceId = null;
      this.selectedIncidentSource = null;
      this.selectedIncidentSourceId = -1;
      this.getIncidentSources(-1);
    }
  }
  onIncidentSourceChanged() {
    if (this.selectedIncidentSourceId != -1) {
      this.patient.incidentSourceId = this.selectedIncidentSourceId;
    } else {
      this.patient.incidentSourceId = null;
    }
  }
  onDepartmentChanged() {
    this.patient.hiddenInsideDepartment = false;
    if (this.selectedDepartmentId != -1) {
      this.patient.incidentDepartmentId = this.selectedDepartmentId;
      if (this.selectedDepartment?.length > 0) {
        this.patient.incidentDepartmentId = this.selectedDepartmentId;
      }
      this.patient.hiddenInsideDepartment =
        this.selectedDepartmentId == DepartmentEnum.External ? true : false;
    } else this.patient.incidentDepartmentId = null;
    if (this.patient.nationalId == null) {
      this.patient.age = null;
      this.patient.birthDate = null;
      this.patient.genderId = null;
      this.patient.ageTypeId = null;
    } else {
      this.getGender(this.patient.nationalId);
    }
    this.generalDataService.isIncidentDepartmentValid =
      this.generalDataService.checkIncidentDepartmentValid(
        this.patient.incidentDepartmentId
      );
    this.sharedDataService.setPatientObject({ ...this.patient });
  }

  getLookups() {
    this.getGovernments();
    this.getDepartments();
    this.getNationalities();
  }

  getNationalities() {
    this.lookupsService.getAllNationalitys().subscribe(
      (result: any) => {
        if (result != null && result != undefined) {
          this.nationalities = [
            { id: -1, arabicName: 'إختر', englishName: 'Select' },
          ];
          result.data.forEach((nat) => {
            this.nationalities.push(nat);
          });
          if (this.patient.nationalityId > 0) {
            this.selectedNationalityId = this.patient.nationalityId;
          } else {
            this.selectedNationalityId = NationalityEnum.Egyptian;
            this.onNationalityChanged();
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
  private applyIncidentGovernmentsFromApi(
    result: any,
    allowUserScopeFallback: boolean,
  ): void {
    if (result == null || result === undefined) {
      this.loadingPanel = false;
      return;
    }
    const raw = this.extractApiDataArray(result);
    const mapped = raw
      .map((r) => this.mapLookupRowToOption(r))
      .filter(
        (r): r is { id: number; arabicName: string; englishName: string } =>
          r != null,
      );
    if (mapped.length === 0 && allowUserScopeFallback) {
      this.lookupsService.getAllGovernmentsForUser(true).subscribe(
        (r2) => this.applyIncidentGovernmentsFromApi(r2, false),
        () => {
          this.loadingPanel = false;
          this.translateService
            .get('NEDSS.COMMON.INTERNAL_SERVER_ERROR')
            .subscribe((res: string) => {
              this.userMsg.error(res);
            });
        },
      );
      return;
    }
    this.governments = [
      { id: -1, arabicName: 'إختر', englishName: 'Select' },
      ...mapped,
    ];
    this.scheduleIncidentBind(() => {
      const persistedPatientId =
        this.toPositiveInt(this.patient?.id) ??
        this.toPositiveInt(this.sharedDataService.patientId);
      const openingExisting =
        this.sharedDataService.isEditMode && persistedPatientId != null;
      const govFromPatient = this.toPositiveInt(this.patient.incidentGovernmentId);
      if (govFromPatient != null) {
        this.selectedGovernmentId = govFromPatient;
      } else if (!openingExisting) {
        this.selectedGovernment = this.governments.filter(
          (item) => item.id === this.selectedGovernmentId,
        );
        if (this.selectedGovernmentId == null) {
          this.selectedGovernmentId = -1;
        }
      }
      if (
        this.selectedGovernmentId != -1 &&
        (!openingExisting || govFromPatient != null)
      ) {
        if (openingExisting && govFromPatient != null) {
          this.lastSeenPatientIdForIncidentHydrate = persistedPatientId;
          this.incidentLocationHydratedForPatientId = persistedPatientId;
        }
        this.onGovernmentChanged();
      }
    });
    this.loadingPanel = false;
    this.maybeHydrateIncidentLocationFromPatient();
  }

  getGovernments() {
    this.lookupsService.getAllGovernmentsExplicit(false, 'incident-gov').subscribe(
      (result: any) => {
        if (result?.status === environment.DUPLICATED_REQUEST_STATUS_CODE) {
          if (this.incidentGovFetchRetries < 3) {
            this.incidentGovFetchRetries++;
            setTimeout(() => this.getGovernments(), 250);
          }
          this.loadingPanel = false;
          return;
        }
        this.incidentGovFetchRetries = 0;
        this.applyIncidentGovernmentsFromApi(result, true);
      },
      (error) => {
        this.loadingPanel = false;
        this.translateService
          .get('NEDSS.COMMON.INTERNAL_SERVER_ERROR')
          .subscribe((res: string) => {
            this.userMsg.error(res);
          });
      },
    );
  }
  getHealthAdministration(governmentID: any) {
    if (governmentID != null && governmentID != -1) {
      // this.Delay();
      this.loadingPanel = true;
      this.lookupsService
        .getPageHealthAdministrations({
          governmentID: governmentID,
          /** PendingRequestsService dedupes url+body; residence uses same shape — avoid starving this tab. */
          _clientScope: 'incident-info-ha',
        })
        .subscribe(
          (result: any) => {
            if (result?.status === environment.DUPLICATED_REQUEST_STATUS_CODE) {
              if (this.healthAdminFetchRetries < 4) {
                this.healthAdminFetchRetries++;
                setTimeout(() => this.getHealthAdministration(governmentID), 280);
              }
              this.loadingPanel = false;
              return;
            }
            this.healthAdminFetchRetries = 0;
            if (result != null && result != undefined) {
              const raw = this.extractApiDataArray(result);
              const mapped = raw
                .map((r) => this.mapLookupRowToOption(r))
                .filter(
                  (r): r is { id: number; arabicName: string; englishName: string } =>
                    r != null,
                );
              this.healthAdministration = [
                { id: -1, arabicName: 'إختر', englishName: 'Select' },
                ...mapped,
              ];
              this.scheduleIncidentBind(() => {
                const hid = this.toPositiveInt(
                  this.patient.incidentHealthAdministrationId,
                );
                if (hid != null) {
                  this.selectedHealthAdministrationId = hid;
                } else if (this.selectedHealthAdministrationId == null) {
                  this.selectedHealthAdministrationId = -1;
                }
                if (this.selectedHealthAdministrationId != -1) {
                  this.onHealthAdministrationChanged();
                }
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
  }

  getIncidentSources(healthAdministrationID: any, governmentID = null) {
    const resolvedHealthAdminId =
      this.toPositiveInt(healthAdministrationID) ??
      this.toPositiveInt(this.selectedHealthAdministrationId) ??
      -1;
    this.lookupsService
      .getPageIncidentSourceHospitals({
        healthAdministrationID: resolvedHealthAdminId,
        branchId: this.activeUSerService.getAccessibleParts?.showAreas
          ? null
          : this.SelectedbranchId,
        areaId: this.SelectedareaId,
        governmentID: governmentID,
        forSystemUser: governmentID ? true : null,
        _clientScope: 'incident-info-is',
      })
      .subscribe(
        (result: any) => {
          if (result?.status === environment.DUPLICATED_REQUEST_STATUS_CODE) {
            if (this.incidentSourceFetchRetries < 4) {
              this.incidentSourceFetchRetries++;
              setTimeout(
                () =>
                  this.getIncidentSources(healthAdministrationID, governmentID),
                280,
              );
            }
            this.loadingPanel = false;
            return;
          }
          this.incidentSourceFetchRetries = 0;
          if (result != null && result != undefined) {
            const raw = this.extractApiDataArray(result);
            const mapped = raw
              .map((r) => this.mapIncidentSourceRow(r))
              .filter(
                (r): r is { id: number; arabicName: string; englishName: string } =>
                  r != null,
              );
            this.incidentSources = [
              { id: -1, arabicName: 'إختر', englishName: 'Select' },
              ...mapped,
            ];

            const patientSourceId = this.toPositiveInt(
              this.patient.incidentSourceId,
            );
            if (patientSourceId != null) {
              this.selectedIncidentSource = this.incidentSources.filter(
                (item) => item.id === patientSourceId,
              );
              this.selectedIncidentSourceId = patientSourceId;
            } else {
              let defaultSource: number | null = null;
              try {
                defaultSource = this.toPositiveInt(
                  JSON.parse(localStorage.getItem('ls.authorizationData')).user
                    .incidentSourceId,
                );
              } catch {
                defaultSource = null;
              }
              this.selectedIncidentSource = this.incidentSources.filter(
                (item) => item.id === defaultSource,
              );
              this.selectedIncidentSourceId =
                defaultSource != null ? defaultSource : -1;
            }
            if (this.selectedIncidentSourceId != -1) {
              this.onIncidentSourceChanged();
            }
            this.cdr.detectChanges();
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
  getDepartments() {
    this.lookupsService.getAllDepartments().subscribe(
      (result: any) => {
        if (result?.status === environment.DUPLICATED_REQUEST_STATUS_CODE) {
          if (this.departmentFetchRetries < 3) {
            this.departmentFetchRetries++;
            setTimeout(() => this.getDepartments(), 250);
            return;
          }
          this.departmentFetchRetries = 0;
          this.loadingPanel = false;
          return;
        }
        this.departmentFetchRetries = 0;
        if (result != null && result != undefined) {
          const raw = this.extractApiDataArray(result);
          this.departments = [
            { id: -1, arabicName: 'إختر', englishName: 'Select' },
          ];
          for (const row of raw) {
            const opt = this.mapLookupRowToOption(row);
            if (opt) {
              this.departments.push(opt);
            }
          }
          this.syncDepartmentSelectionFromPatient();
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

  private syncDepartmentSelectionFromPatient(): void {
    if (!this.departments?.length) {
      return;
    }
    const deptId = this.toPositiveInt(this.patient?.incidentDepartmentId);
    if (deptId == null) {
      this.selectedDepartmentId = -1;
      this.selectedDepartment = [];
      this.cdr.markForCheck();
      return;
    }
    const found = this.departments.find(
      (d) => this.toPositiveInt(d?.id ?? d?.Id) === deptId,
    );
    if (found) {
      const resolvedId = this.toPositiveInt(found.id ?? found.Id) ?? -1;
      this.selectedDepartmentId = resolvedId;
      this.selectedDepartment = [found];
    } else {
      this.selectedDepartmentId = deptId;
      this.selectedDepartment = [];
    }
    this.cdr.markForCheck();
  }
  onNationalIdChanged(value: any, isManualChange = false) {
    const isEgyptianNationality =
      this.patient.nationalityId == NationalityEnum.Egyptian;

    if (
      value != null &&
      value.toString().length === 14 &&
      this.generalDataService.validateEgyptNational(value)
    ) {
      this.getGender(value);
      this.getAllByNationalId(value.toString());
    } else {
      this.Allpatients = [];
      this.sharedDataService.duplicateNationalIdMatchCount = 0;
      // Only clear derived demographic fields for Egyptian-ID flow.
      if (isEgyptianNationality) {
        this.patient.age = null;
        this.patient.birthDate = null;
        this.patient.genderId = null;
        this.patient.ageTypeId = null;
      }
    }
    if (isManualChange) {
      this.sharedDataService.setPatientObject(this.patient);
    }
  }

  getAllByNationalId(nationalId: string) {
    this.generalDataService.getAllByNationalId(nationalId).subscribe({
      next: (res) => this.applyExistingPatientRecordsFromLookup(res?.data),
      error: () => {
        this.Allpatients = [];
        this.sharedDataService.duplicateNationalIdMatchCount = 0;
        this.translateService
          .get('NEDSS.COMMON.INTERNAL_SERVER_ERROR')
          .subscribe((res: string) => {
            this.userMsg.error(res);
          });
      },
    });
  }

  private applyExistingPatientRecordsFromLookup(list: unknown): void {
    const arr = Array.isArray(list) ? list : [];
    this.Allpatients = arr;
    this.sharedDataService.duplicateNationalIdMatchCount = arr.length;
    if (arr.length > 0) {
      this.translateService
        .get(
          'NEDSS.HOME.GENERAL_DATA_COMPLETION.EXISTING_PATIENT_RECORDS_FOUND',
        )
        .subscribe((msg: string) => this.userMsg.success(msg));
    } else {
      this.translateService
        .get(
          'NEDSS.HOME.GENERAL_DATA_COMPLETION.NO_PRIOR_PATIENT_WITH_NATIONAL_ID',
        )
        .subscribe((msg: string) => this.userMsg.info(msg));
    }
  }
  onRelationShipDegreeIdChange() {
    if (this.patient.nationalId != null) {
      this.getGender(this.patient.nationalId);
    } else {
      this.patient.age = null;
      this.patient.birthDate = null;
      this.patient.genderId = null;
      this.patient.ageTypeId = null;
    }
    if (this.patient.nationalityId == NationalityEnum.Egyptian) {
      this.onNationalIdChanged(this.patient.nationalId);
    } else if (this.patient.nationalityId >= 20) {
      //Q HERE
      this.onPassportNoChanged(this.patient.passportNo);
    }
  }
  pad(num, size) {
    let s = num + '';

    while (s?.length < size) s = '0' + s;
    return s;
  }
  getGender(value: any) {
    if (this.patient.relationShipDegreeId != RelativeEnum.Himself) {
      this.patient.genderId = null;
      this.patient.age = null;
      this.patient.ageTypeId = null;
      this.patient.birthDate = null;
      return;
    }
    let bational = value.toString();
    let number = bational.slice(-2, -1);
    //  gender
    if (number % 2 == 0) this.patient.genderId = 2;
    else this.patient.genderId = 1;
    // national id

    let yearAll = 19;
    if (bational.slice(0, 1) == '3') yearAll = 20;
    let dateStr =
      yearAll +
      bational.slice(1, 3) +
      '-' +
      bational.slice(3, 5) +
      '-' +
      this.pad(Number(bational.slice(5, 7)), 2);
    this.patient.birthDate = new Date(dateStr).toISOString();

    let timeDiff = Math.abs(Date.now() - new Date(dateStr).getTime());
    var days = timeDiff / (1000 * 3600 * 24);
    var monthes = timeDiff / (1000 * 3600 * 24) / 30;
    var years = timeDiff / (1000 * 3600 * 24) / 365.25;
    if (years >= 1) {
      this.patient.age = Math.floor(years);
      this.patient.ageTypeId = 3;
    } else if (monthes >= 1) {
      this.patient.age = Math.floor(monthes);
      this.patient.ageTypeId = 2;
    } else {
      this.patient.age = Math.floor(days);
      this.patient.ageTypeId = 1;
    }
  }

  onPassportNoChanged(value: any) {
    if (this.patient.nationalId != null) {
      this.getGender(this.patient.nationalId);
    } else {
      this.patient.age = null;
      this.patient.birthDate = null;
      this.patient.genderId = null;
      this.patient.ageTypeId = null;
    }
    if (
      this.patient.passportNo != null &&
      String(this.patient.passportNo).trim().length >= 8
    ) {
      this.generalDataService
        .getAllByPassportNo(String(this.patient.passportNo).trim())
        .subscribe({
          next: (res) => this.applyExistingPatientRecordsFromLookup(res?.data),
          error: () => {
            this.Allpatients = [];
            this.sharedDataService.duplicateNationalIdMatchCount = 0;
            this.translateService
              .get('NEDSS.COMMON.INTERNAL_SERVER_ERROR')
              .subscribe((res: string) => {
                this.userMsg.error(res);
              });
          },
        });
    } else {
      this.Allpatients = [];
      this.sharedDataService.duplicateNationalIdMatchCount = 0;
    }
  }

  formatPatientName(op: any): string {
    const parts = [
      op?.firstName,
      op?.secondName,
      op?.thirdName,
      op?.familyName,
    ]
      .map((p) => (p == null ? '' : String(p).trim()))
      .filter((p) => p.length > 0);
    return parts.length > 0 ? parts.join(' ') : '-';
  }

  editPationt(op) {
    if (op?.id == null) {
      return;
    }
    this.loadingPanel = true;
    this.generalDataService.getBy(op.id).subscribe(
      (result: any) => {
        this.loadingPanel = false;
        if (result?.data) {
          this.generalDataService.normalizePatientApiPayload(result.data);
          this.setPatient(this.normalizePatientDates(result.data));
          this.sharedDataService.duplicateNationalIdMatchCount = 0;
        }
      },
      () => {
        this.loadingPanel = false;
        this.translateService
          .get('NEDSS.COMMON.INTERNAL_SERVER_ERROR')
          .subscribe((res: string) => {
            this.userMsg.error(res);
          });
      },
    );
  }

  private normalizePatientDates(data: any): any {
    const toYmd = (value: any): string | null => {
      if (value == null || value === '') return null;
      const d = new Date(value);
      if (isNaN(d.getTime())) return null;
      const yyyy = d.getFullYear();
      const mm = String(d.getMonth() + 1).padStart(2, '0');
      const dd = String(d.getDate()).padStart(2, '0');
      return `${yyyy}-${mm}-${dd}`;
    };
    data.caseDiscoveryDate = toYmd(data.caseDiscoveryDate);
    data.hospitalEntryDate = toYmd(data.hospitalEntryDate);
    data.hospitalLeaveDate = toYmd(data.hospitalLeaveDate);
    data.incidentDate = toYmd(data.incidentDate);
    data.infectionDate = toYmd(data.infectionDate);
    return data;
  }

  setPatient(data: any) {
    this.generalDataService.normalizePatientApiPayload(data);
    const patient: PatientModel = Object.assign(new PatientModel(), data);
    patient.clinicalSymptomIds =
      data?.clinicalSymptomIds ?? data?.ClinicalSymptomIds ?? [];

    if (patient.feverSymptoms == undefined || patient.feverSymptoms == null) {
      patient.feverSymptoms = new FeverSymptoms();
    }

    this.sharedDataService.isEditMode = true;
    if (patient.id != null) {
      this.sharedDataService.patientId = patient.id;
      localStorage.setItem('patientId', patient.id.toString());
    }

    this.incidentLocationHydratedForPatientId = null;
    this.lastSeenPatientIdForIncidentHydrate = null;

    this.isSettingPatientLocally = true;
    this.patient = patient;
    this.sharedDataService.setPatientObject(patient);
    this.isSettingPatientLocally = false;

    if (this.governments?.length > 0) {
      this.selectedGovernment = this.governments.filter(
        (x) => x.id == patient.incidentGovernmentId,
      );
      this.selectedGovernmentId = patient.incidentGovernmentId;
      this.incidentLocationHydratedForPatientId = patient.id;
      this.lastSeenPatientIdForIncidentHydrate = patient.id;
      this.onGovernmentChanged();
    }
    this.syncDepartmentSelectionFromPatient();
    if (this.nationalities?.length > 0) {
      this.selectedNationality = this.nationalities.filter(
        (x) => x.id == patient.nationalityId,
      );
      this.selectedNationalityId = patient.nationalityId;
    }
  }

  isDiscoveryTimeValid(): boolean {
    let now = new Date();

    let discoveredDate = new Date(this.patient.caseDiscoveryDate);
    let isToday =
      discoveredDate.getDate() === now.getDate() &&
      discoveredDate.getMonth() === now.getMonth() &&
      discoveredDate.getFullYear() === now.getFullYear();

    if (isToday) {
      let discoveredTime = new Date(discoveredDate);
      if (
        this.patient.caseDiscoveryTime != undefined &&
        this.patient.caseDiscoveryTime != null
      ) {
        let [hours, minutes] = this.patient.caseDiscoveryTime.split(':');
        discoveredTime.setHours(Number(hours), Number(minutes));
      }
      return discoveredTime <= now;
    }

    return true;
  }
  Delay() {
    this.delay = true;
    this.timer = setTimeout(() => {
      if (this.delay) {
        this.translateService
          .get('NOUR.WaitPlease')
          .subscribe((msg) => this.userMsg.info(msg));
      }
    }, 500);
  }
  RemoveDelay() {
    setTimeout(() => {
      this.delay = false;
      clearTimeout(this.timer);
    }, 0);
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
