import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import { UserMessageService } from 'src/app/core/services/user.message.service';
import { LookupsGetterService } from 'src/app/core/services/lookups-getter.service';
import { GeneralDataService } from '../services/general-data.service';
import { finalize } from 'rxjs/operators';

/**
 * عدم الاستدلال (Not Inferring) modal.
 * Reusable: pass the current patient; records the non-inference reason and
 * lets the user correct the case's phone/address/location, then saves via
 * GeneralDataService.updateInvestigation (PUT Patient/UpdateNotInvetigation).
 * Mirrors the inline modal in investigation-detailes.
 */
@Component({
  selector: 'app-not-inferring-modal',
  templateUrl: './not-inferring-modal.component.html',
  styles: [
    `
      .ni-warning-btn {
        background-color: #ffc107 !important;
        border-color: #ffc107 !important;
        color: #212529 !important;
      }
      .ni-warning-btn:hover,
      .ni-warning-btn:focus,
      .ni-warning-btn:active {
        background-color: #e0a800 !important;
        border-color: #d39e00 !important;
        color: #212529 !important;
      }
    `,
  ],
})
export class NotInferringModalComponent implements OnChanges {
  @Input() patient: any;

  notFoundForm: FormGroup;
  currentLang: string;
  governments: any;
  healthAdministrations: any[];
  cities: any[];
  healthOffices: any[];
  effectiveGovernmentId: any;
  ObjToUpdate: any;

  // Set when the case already carries a recorded عدم الاستدلال (not-inferring)
  // reason, so the trigger button can render distinctly.
  hasNotInferringData: boolean = false;
  notInferringReasonKey: string = '';

  private readonly reasonKeys: { [key: number]: string } = {
    1: 'NEDSS.HOME.USERS.EPIDEMIOLOGICAL-THRESHOLDS.NUMBER',
    2: 'NEDSS.HOME.USERS.EPIDEMIOLOGICAL-THRESHOLDS.ADDRESS',
    3: 'NEDSS.HOME.USERS.EPIDEMIOLOGICAL-THRESHOLDS.OTHER',
    4: 'NEDSS.HOME.USERS.EPIDEMIOLOGICAL-THRESHOLDS.EDITGOVERNMENT',
    5: 'NEDSS.HOME.USERS.EPIDEMIOLOGICAL-THRESHOLDS.EDITOTHERADMININSAMEGOVR',
  };
  governmentsLoading: boolean = false;
  healthAdministrationsLoading: boolean = false;
  citiesLoading: boolean = false;
  healthOfficesLoading: boolean = false;

  constructor(
    public generalDataService: GeneralDataService,
    private lookupsService: LookupsGetterService,
    private translateService: TranslateService,
    private userMsg: UserMessageService
  ) {}

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['patient'] && this.patient?.id != null) {
      this.init();
    }
  }

  private init() {
    this.currentLang =
      localStorage.getItem('ls.currentLang') !== undefined &&
      localStorage.getItem('ls.currentLang') !== 'undefined'
        ? localStorage.getItem('ls.currentLang')
        : 'ar';

    const p: any = this.patient ?? {};

    // Surface any previously recorded عدم الاستدلال reason on the trigger button.
    this.hasNotInferringData = p.misInvistegationType > 0;
    this.notInferringReasonKey = this.hasNotInferringData
      ? this.reasonKeys[p.misInvistegationType] ?? ''
      : '';

    // Prefer the corrected (New*) values recorded during a prior not-inferring
    // save so the modal shows what was actually saved; fall back to the case's
    // current values otherwise.
    const savedType =
      p.misInvistegationType > 0 ? String(p.misInvistegationType) : null;
    const homeGovernmentId =
      p.newHomeGovernmentId > 0 ? p.newHomeGovernmentId : p.homeGovernmentId;
    const homeHealthAdministrationId =
      p.newHomeHealthAdministrationId > 0
        ? p.newHomeHealthAdministrationId
        : p.homeHealthAdministrationId;
    const homeCityId = p.newHomeCityId > 0 ? p.newHomeCityId : p.homeCityId;
    const homeHealthOfficeId =
      p.newHomeHealthOfficeId > 0
        ? p.newHomeHealthOfficeId
        : p.homeHealthOfficeId;

    // For "same governorate, other administration" (type 5) the government
    // dropdown is hidden, so fall back to the case's incident governorate when
    // the home governorate isn't set - otherwise the administrations list would
    // stay empty and the user couldn't pick another administration.
    this.effectiveGovernmentId =
      homeGovernmentId > 0 ? homeGovernmentId : p.incidentGovernmentId;

    this.notFoundForm = new FormGroup({
      patientId: new FormControl(p.id),
      notInvestigationType: new FormControl(savedType),
      notInvestigationReason: new FormControl(p.misInvistegationReason),
      homeGovernmentId: new FormControl(this.effectiveGovernmentId),
      homeCityId: new FormControl(homeCityId),
      homeHealthAdministration: new FormControl(homeHealthAdministrationId),
      homeHealthOffice: new FormControl(homeHealthOfficeId),
      phoneNo1: new FormControl(p.newPhoneNo1 ?? p.phoneNo1),
      livingAddress: new FormControl(p.newLivingAddress ?? p.livingAddress),
    });

    this.getGovernments();
    if (this.effectiveGovernmentId > 0) {
      this.getHealthAdministration(this.effectiveGovernmentId);
      this.getCities(this.effectiveGovernmentId);
    }
    if (homeHealthAdministrationId > 0) {
      this.getHealthOffices(homeHealthAdministrationId);
    }
  }

  private serverError() {
    this.translateService
      .get('NEDSS.COMMON.INTERNAL_SERVER_ERROR')
      .subscribe((res: string) => {
        this.userMsg.error(res);
      });
  }

  getGovernments() {
    this.governmentsLoading = true;
    this.lookupsService
      .getAllGovernments()
      .pipe(finalize(() => (this.governmentsLoading = false)))
      .subscribe(
      (result: any) => {
        if (result != null && result.data != null) {
          this.governments = [
            { id: -1, arabicName: 'إختر', englishName: 'Select' },
            ...result.data,
          ];
        }
      },
      () => this.serverError()
    );
  }

  getHealthAdministration(governmentID: any) {
    this.healthAdministrationsLoading = true;
    this.lookupsService
      .getPageHealthAdministrations({ governmentID: governmentID })
      .pipe(finalize(() => (this.healthAdministrationsLoading = false)))
      .subscribe(
        (result: any) => {
          if (result != null && result.data != null) {
            this.healthAdministrations = result.data;
          }
        },
        () => this.serverError()
      );
  }

  getCities(governmentID: any) {
    this.citiesLoading = true;
    this.lookupsService
      .getPageCitys({ governmentID: governmentID })
      .pipe(finalize(() => (this.citiesLoading = false)))
      .subscribe(
      (result: any) => {
        if (result != null && result.data != null) {
          this.cities = result.data;
        }
      },
      () => this.serverError()
    );
  }

  getHealthOffices(healthAdministrationId: any) {
    this.healthOfficesLoading = true;
    this.lookupsService
      .getPageIncidentSourceHospitals({
        healthAdministrationID: healthAdministrationId,
      })
      .pipe(finalize(() => (this.healthOfficesLoading = false)))
      .subscribe(
        (result: any) => {
          if (result != null && result.data != null) {
            this.healthOffices = result.data;
          }
        },
        () => this.serverError()
      );
  }

  onGovernmentChanged() {
    const governmentId = this.notFoundForm.value.homeGovernmentId;
    this.notFoundForm.patchValue({
      homeHealthAdministration: null,
      homeCityId: null,
      homeHealthOffice: null,
    });
    this.healthOffices = [];
    if (governmentId > 0) {
      this.effectiveGovernmentId = governmentId;
      this.getHealthAdministration(governmentId);
      this.getCities(governmentId);
    } else {
      this.healthAdministrations = [];
      this.cities = [];
    }
  }

  onHealthAdministrationChanged() {
    const healthAdministrationId =
      this.notFoundForm.value.homeHealthAdministration;
    this.notFoundForm.patchValue({ homeHealthOffice: null });
    if (healthAdministrationId > 0) {
      this.getHealthOffices(healthAdministrationId);
    } else {
      this.healthOffices = [];
    }
  }

  onCityChanged() {}

  updateInvestigatio() {
    const value = this.notFoundForm.value;
    const type = Number(value.notInvestigationType);

    // Only send the fields relevant to the chosen reason so an unrelated field
    // never overwrites the case's stored data (the backend keeps existing
    // values for any field it receives as null).
    this.ObjToUpdate = {
      patientId: this.patient?.id,
      notInvestigationType: type,
      notInvestigationReason: value.notInvestigationReason,
    };

    if (type === 1) {
      this.ObjToUpdate.phoneNo1 = value.phoneNo1;
    } else if (type === 2) {
      this.ObjToUpdate.livingAddress = value.livingAddress;
    } else if (type === 4 || type === 5) {
      this.ObjToUpdate.homeGovernmentId =
        type === 5 ? this.effectiveGovernmentId : value.homeGovernmentId;
      this.ObjToUpdate.homeHealthAdministration = value.homeHealthAdministration;
      this.ObjToUpdate.homeCityId = value.homeCityId;
      this.ObjToUpdate.homeHealthOffice = value.homeHealthOffice;
    }

    this.generalDataService.updateInvestigation(this.ObjToUpdate).subscribe(
      (res: any) => {
        if (res != null) {
          this.hasNotInferringData = type > 0;
          this.notInferringReasonKey = this.reasonKeys[type] ?? '';
          if (this.patient) {
            this.patient.misInvistegationType = type;
          }
          this.userMsg.success('تم تحديث البيانات بنجاح');
        } else {
          this.userMsg.error('حدث خطأ اثناء تحديث البيانات');
        }
      },
      (err) => console.error(err)
    );
  }
}
