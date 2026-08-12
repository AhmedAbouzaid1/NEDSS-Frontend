import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import { UserMessageService } from 'src/app/core/services/user.message.service';
import { LookupsGetterService } from 'src/app/core/services/lookups-getter.service';
import { GeneralDataService } from '../services/general-data.service';

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
})
export class NotInferringModalComponent implements OnChanges {
  @Input() patient: any;

  notFoundForm: FormGroup;
  currentLang: string;
  phone: any;
  Address: any;
  governments: any;
  healthAdministrations: any[];
  cities: any[];
  healthOffices: any[];
  selectedGovernmentId: any;
  selectedHealthAdministrationId: any;
  selectedCityId: any;
  selectedHealthOfficeId: any;
  selectedHealthAdministration: any;
  selectedCity: any;
  ObjToUpdate: any;

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
    this.notFoundForm = new FormGroup({
      patientId: new FormControl(p.id),
      notInvestigationType: new FormControl(),
      notInvestigationReason: new FormControl(),
      homeGovernmentId: new FormControl(),
      homeCityId: new FormControl(),
      homeHealthAdministration: new FormControl(),
      homeHealthOffice: new FormControl(),
      phoneNo1: new FormControl(),
      livingAddress: new FormControl(),
    });

    this.phone = p.phoneNo1;
    this.Address = p.livingAddress;
    this.selectedGovernmentId = p.homeGovernmentId;
    this.selectedHealthAdministrationId = p.homeHealthAdministrationId;
    this.selectedCityId = p.homeCityId;
    this.selectedHealthOfficeId = p.homeHealthOfficeId;

    this.getGovernments();
    if (this.selectedGovernmentId > 0) {
      this.getHealthAdministration(this.selectedGovernmentId);
      this.getCities(this.selectedGovernmentId);
    }
    if (this.selectedHealthAdministrationId > 0) {
      this.getHealthOffices(this.selectedHealthAdministrationId);
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
    this.lookupsService.getAllGovernments().subscribe(
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
    this.lookupsService
      .getPageHealthAdministrations({ governmentID: governmentID })
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
    this.lookupsService.getPageCitys({ governmentID: governmentID }).subscribe(
      (result: any) => {
        if (result != null && result.data != null) {
          this.cities = result.data;
        }
      },
      () => this.serverError()
    );
  }

  getHealthOffices(healthAdministrationId: any) {
    this.lookupsService
      .getPageIncidentSourceHospitals({
        healthAdministrationID: healthAdministrationId,
      })
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
    if (this.selectedGovernmentId > 0) {
      this.getHealthAdministration(this.selectedGovernmentId);
      this.getCities(this.selectedGovernmentId);
    } else {
      this.healthAdministrations = [];
      this.selectedHealthAdministration = null;
    }
  }

  onHealthAdministrationChanged() {
    if (this.selectedHealthAdministration) {
      this.getHealthOffices(this.selectedHealthAdministration);
    } else {
      this.healthOffices = [];
    }
  }

  onCityChanged() {}

  updateInvestigatio() {
    this.ObjToUpdate = {
      ...this.notFoundForm.value,
      patientId: this.patient?.id,
    };

    this.generalDataService.updateInvestigation(this.ObjToUpdate).subscribe(
      (res: any) => {
        if (res != null) {
          this.notFoundForm.patchValue({ notInvestigationType: null });
          this.userMsg.success('تم تحديث البيانات بنجاح');
        } else {
          this.userMsg.error('حدث خطأ اثناء تحديث البيانات');
        }
      },
      (err) => console.error(err)
    );
  }
}
