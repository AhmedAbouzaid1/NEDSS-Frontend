import { Component, OnDestroy, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { Subject } from 'rxjs';
import { finalize, takeUntil } from 'rxjs/operators';
import { LookupsGetterService } from 'src/app/core/services/lookups-getter.service';
import { UserMessageService } from 'src/app/core/services/user.message.service';
import { SearchSharedDataService } from '../../services/search-shared-data.service';
import { Patient } from '../../models/patient';
import { GeneralDataService } from '../../../general-data/services/general-data.service';

type LookupOption = { id: number | null; arabicName: string; englishName: string };

@Component({
  selector: 'app-place-of-residence',
  templateUrl: './place-of-residence.component.html',
  styleUrls: ['./place-of-residence.component.css'],
})
export class PlaceOfResidenceComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();

  currentLang: string = 'ar';
  patient: Patient = {};

  governments: LookupOption[] = [this.placeholder()];
  healthAdministrations: LookupOption[] = [this.placeholder()];
  healthOffices: LookupOption[] = [this.placeholder()];
  cities: LookupOption[] = [this.placeholder()];
  principalities: LookupOption[] = [this.placeholder()];

  governmentsLoading = false;
  healthAdministrationsLoading = false;
  healthOfficesLoading = false;
  citiesLoading = false;
  principalitiesLoading = false;

  constructor(
    private sharedDataService: SearchSharedDataService,
    private lookupsService: LookupsGetterService,
    private translateService: TranslateService,
    public generalDataService: GeneralDataService,
    private userMsg: UserMessageService
  ) {}

  ngOnInit() {
    const savedLang = localStorage.getItem('ls.currentLang');
    this.currentLang = savedLang && savedLang !== 'undefined' ? savedLang : 'ar';
    const link = document.getElementById('fastSearch') as HTMLElement;
    link?.classList.add('active');

    this.sharedDataService
      .getPatientObject()
      .pipe(takeUntil(this.destroy$))
      .subscribe((patientObject) => {
        this.patient = patientObject;
      });

    this.generalDataService.isAdressValid = true;
    this.getGovernments();
  }

  ngOnDestroy() {
    const link = document.getElementById('fastSearch') as HTMLElement;
    link?.classList.remove('active');
    this.destroy$.next();
    this.destroy$.complete();
  }

  private placeholder(): LookupOption {
    return { id: null, arabicName: 'إختر', englishName: 'Select' };
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
          arabicName: String(row?.arabicName ?? row?.ArabicName ?? ''),
          englishName: String(row?.englishName ?? row?.EnglishName ?? ''),
        };
      })
      .filter((o): o is LookupOption => o != null);
    return [this.placeholder(), ...mapped];
  }

  private keepIfPresent(list: LookupOption[], id: number | null | undefined): number | null {
    return id != null && list.some((o) => o.id === id) ? id : null;
  }

  private showError() {
    this.translateService
      .get('NEDSS.COMMON.INTERNAL_SERVER_ERROR')
      .subscribe((res: string) => this.userMsg.error(res));
  }

  getGovernments() {
    this.governmentsLoading = true;
    this.lookupsService.getAllGovernmentsExplicit(false, 'residence-home').subscribe(
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
    if (this.patient.homeGovernmentId != null) {
      this.getHealthAdministration(this.patient.homeGovernmentId);
      this.getCities(this.patient.homeGovernmentId);
    }
  }

  onGovernmentChanged() {
    this.patient.homeHealthAdministrationId = null;
    this.patient.homeHealthOfficeId = null;
    this.patient.homeCityId = null;
    this.patient.homePrincipalityId = null;
    this.healthAdministrations = [this.placeholder()];
    this.healthOffices = [this.placeholder()];
    this.cities = [this.placeholder()];
    this.principalities = [this.placeholder()];
    if (this.patient.homeGovernmentId != null) {
      this.getCities(this.patient.homeGovernmentId);
      this.getHealthAdministration(this.patient.homeGovernmentId);
    }
  }

  getHealthAdministration(governmentID: number) {
    this.healthAdministrationsLoading = true;
    this.lookupsService
      .getPageHealthAdministrations({ governmentID: governmentID })
      .pipe(finalize(() => (this.healthAdministrationsLoading = false)))
      .subscribe(
        (result: any) => {
          this.healthAdministrations = this.toOptions(result);
          this.patient.homeHealthAdministrationId = this.keepIfPresent(
            this.healthAdministrations,
            this.patient.homeHealthAdministrationId
          );
          if (this.patient.homeHealthAdministrationId != null) {
            this.getHealthOffices(this.patient.homeHealthAdministrationId);
          }
        },
        () => this.showError()
      );
  }

  onHealthAdministrationChanged() {
    this.patient.homeHealthOfficeId = null;
    this.healthOffices = [this.placeholder()];
    if (this.patient.homeHealthAdministrationId != null) {
      this.getHealthOffices(this.patient.homeHealthAdministrationId);
    }
  }

  getHealthOffices(healthAdministrationId: number) {
    this.healthOfficesLoading = true;
    this.lookupsService
      .getPageIncidentSourceHospitals({
        healthAdministrationID: healthAdministrationId,
        forHome: true,
      })
      .pipe(finalize(() => (this.healthOfficesLoading = false)))
      .subscribe(
        (result: any) => {
          this.healthOffices = this.toOptions(result);
          this.patient.homeHealthOfficeId = this.keepIfPresent(
            this.healthOffices,
            this.patient.homeHealthOfficeId
          );
        },
        () => this.showError()
      );
  }

  getCities(governmentID: number) {
    this.citiesLoading = true;
    this.lookupsService
      .getPageCitys({ governmentID: governmentID })
      .pipe(finalize(() => (this.citiesLoading = false)))
      .subscribe(
        (result: any) => {
          this.cities = this.toOptions(result);
          this.patient.homeCityId = this.keepIfPresent(this.cities, this.patient.homeCityId);
          if (this.patient.homeCityId != null) {
            this.getPrincipalities(this.patient.homeCityId);
          }
        },
        () => this.showError()
      );
  }

  onCityChanged() {
    this.patient.homePrincipalityId = null;
    this.principalities = [this.placeholder()];
    if (this.patient.homeCityId != null) {
      this.getPrincipalities(this.patient.homeCityId);
    }
  }

  getPrincipalities(cityID: number) {
    this.principalitiesLoading = true;
    this.lookupsService
      .getPagePrincipalitys({ cityID: cityID })
      .pipe(finalize(() => (this.principalitiesLoading = false)))
      .subscribe(
        (result: any) => {
          this.principalities = this.toOptions(result);
          this.patient.homePrincipalityId = this.keepIfPresent(
            this.principalities,
            this.patient.homePrincipalityId
          );
        },
        () => this.showError()
      );
  }

  onLivingAddressChanged(value: string) {
    const trimmed = (value ?? '').trim();
    this.patient.livingAddress = trimmed ? value : null;
  }

  clearAll() {
    this.patient = { pageIndex: 0, pageSize: 10, filterType: 1 };
    this.sharedDataService.setPatientObject(this.patient);
    this.healthAdministrations = [this.placeholder()];
    this.healthOffices = [this.placeholder()];
    this.cities = [this.placeholder()];
    this.principalities = [this.placeholder()];
    this.generalDataService.isAdressValid = true;
  }
}
