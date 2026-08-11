import { CustomeService } from './custome.service';
import { ChangeDetectorRef, Component, OnInit, OnDestroy } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { LookupsGetterService } from 'src/app/core/services/lookups-getter.service';
import { UserMessageService } from 'src/app/core/services/user.message.service';
import { PatientModel } from '../models/patient-model';
import { SharedDataService } from '../services/shared-data.service';
import * as $ from 'jquery';
import {
  MultipleDropdownSettings,
  SingleDropdownSettings,
} from 'src/app/core/constants';
import { GeneralDataService } from '../services/general-data.service';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
@Component({
  selector: 'app-residence-info',
  templateUrl: './residence-info.component.html',
  styleUrls: ['./residence-info.component.css'],
})
export class ResidenceInfoComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();
  patient: PatientModel = new PatientModel();
  private readonly selectPlaceholder = {
    id: -1,
    arabicName: 'إختر',
    englishName: 'Select',
  };

  governments: any[] = [this.selectPlaceholder];
  selectedGovernment: any;
  selectedGovernmentId: number;

  healthAdministrations: any[] = [this.selectPlaceholder];
  selectedHealthAdministration: any;
  selectedHealthAdministrationId: number;

  cities: any[] = [this.selectPlaceholder];
  selectedCity: any;
  selectedCityId: any;

  healthOffices: any[] = [this.selectPlaceholder];
  selectedHealthOffice: any;
  selectedHealthOfficeId: number;

  principalities: any[] = [this.selectPlaceholder];
  selectedPrincipality: any;
  selectedPrincipalityId: number;

  loadingPanel: boolean = false;
  currentLang: string = 'ar';
  levelId: number;
  singleDropdownSettings = {};
  multipleDropdownSettings = {};
  collectedObj: {
    cityID: number;
    healthAdministrationID: number;
    governmentID: number;
  };

  constructor(
    private sharedDataService: SharedDataService,
    private lookupsService: LookupsGetterService,
    private translateService: TranslateService,
    private userMsg: UserMessageService,
    private customService: CustomeService,
    public generalDataService: GeneralDataService,
    private cdr: ChangeDetectorRef,
  ) { }

  ngOnInit() {
    this.loadingPanel = true;
    const savedLang = localStorage.getItem('ls.currentLang');
    this.currentLang =
      savedLang && savedLang !== 'undefined' ? savedLang : 'ar';
    this.sharedDataService.getPatientObject().pipe(takeUntil(this.destroy$)).subscribe((patientObject) => {
      const rawPid = patientObject?.id;
      const pid =
        rawPid != null &&
        String(rawPid).trim() !== '' &&
        !Number.isNaN(Number(rawPid))
          ? Number(rawPid)
          : null;
      if (pid !== this.lastPatientIdForResidence) {
        this.lastPatientIdForResidence = pid;
        this.lastSyncedHomeKey = '';
      }
      this.patient = patientObject;
      this.generalDataService.normalizePatientApiPayload(this.patient);
      this.syncDropdownsFromPatient();
      queueMicrotask(() => this.cdr.detectChanges());
    });
    this.levelId = JSON.parse(
      localStorage.getItem('ls.authorizationData')
    )?.user?.levelId;

    this.getGovernments();
    //this.getHealthOffices(null);
    this.singleDropdownSettings = SingleDropdownSettings;
    this.multipleDropdownSettings = MultipleDropdownSettings;
    this.loadingPanel = false;
  }

  // Tracks the home* id triple we last cascaded for, so we re-fetch the
  // dependent dropdowns only when the patient actually changed.
  private lastSyncedHomeKey: string = '';
  private lastPatientIdForResidence: number | null = null;

  private hasGovernorateListReady(): boolean {
    return (
      Array.isArray(this.governments) &&
      this.governments.some((g) => this.toPositiveInt(g?.id) != null)
    );
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

  private scheduleDropdownBind(fn: () => void): void {
    queueMicrotask(() => {
      fn();
      this.cdr.detectChanges();
    });
  }

  // Re-applies the patient's saved home* ids to the local dropdown state.
  // Safe to call any time: short-circuits if governments haven't loaded
  // (the initial cascade inside getGovernments will pick it up once it
  // returns) or if we already synced for this exact home* id combination.
  private syncDropdownsFromPatient() {
    if (!this.patient || !this.hasGovernorateListReady()) {
      return;
    }

    const govId = this.toPositiveInt(this.patient.homeGovernmentId);
    const adminId = this.toPositiveInt(this.patient.homeHealthAdministrationId);
    const cityId = this.toPositiveInt(this.patient.homeCityId);
    const officeId = this.toPositiveInt(this.patient.homeHealthOfficeId);
    const principalityId = this.toPositiveInt(this.patient.homePrincipalityId);

    if (govId != null) {
      this.patient.homeGovernmentId = govId;
    }
    if (adminId != null) {
      this.patient.homeHealthAdministrationId = adminId;
    }
    if (cityId != null) {
      this.patient.homeCityId = cityId;
    }
    if (officeId != null) {
      this.patient.homeHealthOfficeId = officeId;
    }
    if (principalityId != null) {
      this.patient.homePrincipalityId = principalityId;
    }

    const key = `${govId ?? ''}|${adminId ?? ''}|${cityId ?? ''}|${officeId ?? ''}|${principalityId ?? ''}`;
    if (key === this.lastSyncedHomeKey) {
      return;
    }
    this.lastSyncedHomeKey = key;

    if (govId != null && govId > 0) {
      this.selectedGovernmentId = govId;
      // The child fetches read homeHealthAdministrationId / homeCityId /
      // homeHealthOfficeId / homePrincipalityId off this.patient and set
      // their own selected* vars, so kicking off the two top-level
      // requests cascades the whole tab. We always re-run them when the
      // home* id combination changes (even if the gov id is the same),
      // because the new patient can have a different admin/city/office/
      // principality under that same government.
      this.getHealthAdministration(govId);
      this.getCities(govId, true);
    } else {
      this.selectedGovernmentId = -1;
      this.selectedHealthAdministrationId = -1;
      this.selectedCityId = -1;
      this.selectedHealthOfficeId = -1;
      this.selectedPrincipalityId = -1;
      this.healthAdministrations = [{ ...this.selectPlaceholder }];
      this.cities = [{ ...this.selectPlaceholder }];
      this.healthOffices = [{ ...this.selectPlaceholder }];
      this.principalities = [{ ...this.selectPlaceholder }];
    }
  }
  onItemSelect(item: any) { }
  onSelectAll(items: any) { }

  onGovernmentChanged() {
    if (this.selectedGovernmentId != -1) {
      this.patient.homeGovernmentId = this.selectedGovernmentId;
      this.getCities(this.patient.homeGovernmentId);
      this.getHealthAdministration(this.patient.homeGovernmentId);
    } else {
      this.patient.homeGovernmentId = null;
      this.healthAdministrations = [{ ...this.selectPlaceholder }];
      this.selectedHealthAdministration = null;
      this.cities = [{ ...this.selectPlaceholder }];
      this.selectedCity = null;
      this.selectedCityId = -1;
      this.healthOffices = [{ ...this.selectPlaceholder }];
      this.selectedHealthOffice = null;
      this.selectedHealthOfficeId = -1;
      this.principalities = [{ ...this.selectPlaceholder }];
      this.selectedPrincipality = null;
      this.selectedPrincipalityId = -1;
    }
  }

  onHealthAdministrationChanged() {
    if (this.selectedHealthAdministrationId != -1) {
      this.patient.homeHealthAdministrationId =
        this.selectedHealthAdministrationId;

      this.getHealthOffices(this.patient.homeHealthAdministrationId);
    } else {
      this.patient.homeHealthAdministrationId = null;
      //this.cities = [];
      // this.selectedCity = null;
      this.healthOffices = [{ ...this.selectPlaceholder }];
      this.selectedHealthOffice = null;
      // this.principalities = [];
      //this.selectedPrincipality = null;
      // this.cities = [];
      //this.selectedCity = null;
    }
  }

  onCityChanged() {
    if (this.selectedCityId != -1) {
      this.patient.homeCityId = this.selectedCityId;
      this.getPrincipalities(this.patient.homeCityId);
    } else {
      this.patient.homeCityId = null;
      // this.healthOffices = [];
      // this.selectedHealthOffice = null;
      this.principalities = [{ ...this.selectPlaceholder }];
      this.selectedPrincipalityId = -1;
      // this.healthOffices = [];
      // this.selectedHealthOffice = null;
    }
  }

  onHealthOfficeChanged() {
    this.customService
      .getCustomData(this.selectedHealthOfficeId)
      .subscribe(() => {
        this.collectedObj = this.customService.dataObj;
        if (this.collectedObj.governmentID > 0) {
          this.selectedGovernmentId = this.collectedObj.governmentID;
          // this.patient.homeGovernmentId = this.collectedObj.governmentID;
          //this.patient.homeHealthAdministrationId = this.collectedObj.healthAdministrationID;
          //this.patient.homeCityId = this.collectedObj.cityID;
          //this.getHealthAdministration(this.patient.homeGovernmentId);
        }
      });
    if (this.selectedHealthOfficeId != -1) {
      this.patient.homeHealthOfficeId = this.selectedHealthOfficeId;
    } else {
      this.patient.homeHealthOfficeId = null;
      this.principalities = [{ ...this.selectPlaceholder }];
      this.selectedPrincipalityId = -1;
    }
  }

  onPrincipalityChanged() {
    if (this.selectedPrincipalityId != -1) {
      this.patient.homePrincipalityId = this.selectedPrincipalityId;
    } else {
      this.patient.homePrincipalityId = null;
    }
  }

  private applyResidenceGovernmentsFromApi(
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
        (r2) => this.applyResidenceGovernmentsFromApi(r2, false),
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
    this.scheduleDropdownBind(() => this.syncDropdownsFromPatient());
    this.loadingPanel = false;
  }

  getGovernments() {
    this.lookupsService
      .getAllGovernmentsExplicit(false, 'residence-home')
      .subscribe(
        (result: any) => {
          this.applyResidenceGovernmentsFromApi(result, true);
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
    //;
    this.lookupsService
      .getPageHealthAdministrations({
        governmentID: governmentID,
      })
      .subscribe(
        (result: any) => {
          if (result != null && result != undefined) {
            const raw = this.extractApiDataArray(result);
            const mapped = raw
              .map((r) => this.mapLookupRowToOption(r))
              .filter((r): r is { id: number; arabicName: string; englishName: string } => r != null);
            this.healthAdministrations = [
              { id: -1, arabicName: 'إختر', englishName: 'Select' },
              ...mapped,
            ];
            this.scheduleDropdownBind(() => {
              const hid = this.toPositiveInt(this.patient.homeHealthAdministrationId);
              if (hid != null) {
                this.selectedHealthAdministrationId = hid;
                this.getHealthOffices(hid);
              } else {
                this.selectedHealthAdministrationId = -1;
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
  getCities(governmentID: any, skipInitialCityDeselect = false) {
    this.lookupsService
      .getPageCitys({
        governmentID: governmentID,
      })
      .subscribe(
        (result: any) => {
          if (result != null && result != undefined) {
            const raw = this.extractApiDataArray(result);
            const mapped = raw
              .map((r) => this.mapLookupRowToOption(r))
              .filter((r): r is { id: number; arabicName: string; englishName: string } => r != null);
            this.cities = [{ id: -1, arabicName: 'إختر', englishName: 'Select' }, ...mapped];
            if (!skipInitialCityDeselect) {
              this.selectedCityId = -1;
            }
            this.scheduleDropdownBind(() => {
              const cid = this.toPositiveInt(this.patient.homeCityId);
              if (cid != null) {
                this.selectedCityId = cid;
                this.getPrincipalities(cid);
              }
              if (this.collectedObj?.cityID) {
                this.selectedCityId = this.collectedObj.cityID;
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
        },
      );
  }
  getHealthOffices(healthAdministrationid: any) {
    // this.lookupsService.getPageHealthOffices({ cityID: cityID }).subscribe((result: any) => {
    //, reportingOrResidence: 2
    this.lookupsService
      .getPageIncidentSourceHospitals({
        healthAdministrationID: healthAdministrationid,
        forHome: true,
      })
      .subscribe(
        (result: any) => {
          if (result != null && result != undefined) {
            const raw = this.extractApiDataArray(result);
            const mapped = raw
              .map((r) => this.mapLookupRowToOption(r))
              .filter((r): r is { id: number; arabicName: string; englishName: string } => r != null);
            this.healthOffices = [
              { id: -1, arabicName: 'إختر', englishName: 'Select' },
              ...mapped,
            ];
            this.scheduleDropdownBind(() => {
              const oid = this.toPositiveInt(this.patient.homeHealthOfficeId);
              if (oid != null) {
                this.selectedHealthOfficeId = oid;
              } else {
                this.selectedHealthOfficeId = -1;
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
  getPrincipalities(cityID: any) {
    this.lookupsService
      .getPagePrincipalitys({
        cityID: cityID,
      })
      .subscribe(
        (result: any) => {
          if (result != null && result != undefined) {
            const raw = this.extractApiDataArray(result);
            const mapped = raw
              .map((r) => this.mapLookupRowToOption(r))
              .filter((r): r is { id: number; arabicName: string; englishName: string } => r != null);
            this.principalities = [
              { id: -1, arabicName: 'إختر', englishName: 'Select' },
              ...mapped,
            ];
            this.scheduleDropdownBind(() => {
              const pid = this.toPositiveInt(this.patient.homePrincipalityId);
              if (pid != null) {
                this.selectedPrincipalityId = pid;
              } else {
                this.selectedPrincipalityId = -1;
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
        },
      );
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
