import { Component, OnDestroy, OnInit } from '@angular/core';
import { InvestigationService } from '../services/investigation.service';
import { InvestigationComponent } from '../investigation.component';
import { ActivatedRoute, Route, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { UserMessageService } from 'src/app/core/services/user.message.service';
import { GeneralDataService } from '../../general-data/services/general-data.service';
import { FormControl, FormGroup } from '@angular/forms';
import { PatientModel } from '../../general-data/models/patient-model';
import { LookupsGetterService } from 'src/app/core/services/lookups-getter.service';
import { SingleDropdownSettings } from 'src/app/core/constants';
import { firstValueFrom } from 'rxjs';

@Component({
  selector: 'app-investigation-detailes',
  templateUrl: './investigation-detailes.component.html',
  styleUrls: ['./investigation-detailes.component.css'],
})
export class InvestigationDetailesComponent implements OnInit, OnDestroy {
  currentId: any;
  data: any = {};
  notFoundForm: FormGroup;
  singleDropdownSettings = SingleDropdownSettings;
  patient: PatientModel = new PatientModel();
  phone;
  Address;

  selectedGovernment;
  selectedGovernmentId;
  selectedHealthAdministrationId;
  selectedCityId;
  selectedHealthOfficeId;

  selectedHealthAdministration;
  selectedCity;
  selectedHealthOffice;
  healthAdministration: any[];

  loadingPanel: boolean;
  governments: any;
  healthOffices: any[];
  healthAdministrations: any[];
  cities: any[];
  collectedObj: {
    cityID: number;
    healthAdministrationID: number;
    governmentID: number;
  };
  ObjToUpdate: any;
  currentLang: string;
  dir: string;
  constructor(
    public investigation: InvestigationService,
    private router: ActivatedRoute,
    private translateService: TranslateService,
    private Router: Router,
    private userMsg: UserMessageService,
    public generalDataService: GeneralDataService,
    private lookupsService: LookupsGetterService,
    private invetigationService: InvestigationService
  ) { }

  ngOnInit() {
    this.generalDataService.phoneNo1ValidationMessage = '';
    this.generalDataService.addressValidationMessage = '';

    this.currentId = this.router.snapshot.paramMap.get('id');
    if (this.currentId != null) {
      this.invetigationService.currentid = this.currentId;
    }

    this.currentLang =
      localStorage.getItem('ls.currentLang') !== undefined &&
        localStorage.getItem('ls.currentLang') !== 'undefined'
        ? localStorage.getItem('ls.currentLang')
        : 'ar';

    this.dir = this.currentLang == 'ar' ? 'rtl' : 'ltr';

    this.loadData()

  }
  async loadData() {
    this.notFoundForm = new FormGroup({
      patientId: new FormControl(),
      notInvestigationType: new FormControl(),
      notInvestigationReason: new FormControl(),
      homeGovernmentId: new FormControl(),
      homeCityId: new FormControl(),
      homeHealthAdministration: new FormControl(),
      homeHealthOffice: new FormControl(),
      phoneNo1: new FormControl(),
      livingAddress: new FormControl(),
    });

    await this.getById(this.currentId);


    this.getGovernments();
    this.getHealthAdministration(this.notFoundForm.value.homeGovernmentId);
    this.getCities(this.notFoundForm.value.homeGovernmentId);
  }

  async getById(id) {
    try {
      let result = await firstValueFrom(this.generalDataService.getPatientByIdForInvestigation(id))
      if (result != null && result != undefined) {
        this.data = result.data;
        this.phone = result.data.phoneNo1;
        this.Address = result.data.livingAddress;
        this.selectedGovernmentId = result.data.homeGovernmentId;
        this.selectedHealthAdministrationId =
          result.data.homeHealthAdministrationId;
        this.selectedHealthOfficeId = result.data.homeHealthOfficeId;
        this.selectedCityId = result.data.homeCityId;

        this.investigation.patient.firstName = this.data.firstName;
        this.investigation.patient.secondName = this.data.secondName;
        this.investigation.patient.thirdName = this.data.thirdName;
        this.investigation.patient.familyName = this.data.familyName;
        this.investigation.patient.phoneNo1 = this.data.phoneNo1;
        this.investigation.patient.livingAddress = this.data.livingAddress;
        this.invetigationService.patientDiseases = this.data.patientDiseasesGroups;
      }
    } catch (error) {
      this.translateService
        .get('NEDSS.COMMON.INTERNAL_SERVER_ERROR')
        .subscribe((res: string) => {
          this.userMsg.error(res);
        });
    }
  }

  getGovernments() {
    this.lookupsService.getAllGovernments().subscribe(
      (result: any) => {
        if (result != null && result != undefined) {
          this.governments = result.data;
          this.governments = [
            { id: -1, arabicName: 'إختر', englishName: 'Select' },
          ];
          result.data.forEach((gov) => {
            this.governments.push(gov);
          });
          if (this.selectedGovernmentId > 0) {
            this.patient.homeGovernmentId = this.selectedGovernmentId;
            this.selectedGovernment = this.governments.filter(
              (item) => item.id === this.patient.homeGovernmentId
            );
            this.getHealthAdministration(this.patient.homeGovernmentId);
            this.getCities(this.patient.homeGovernmentId);
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
  getHealthAdministration(governmentID: any) {
    this.lookupsService
      .getPageHealthAdministrations({ governmentID: governmentID })
      .subscribe(
        (result: any) => {
          if (result != null && result != undefined) {
            this.healthAdministrations = result.data;
            if (this.selectedHealthAdministrationId > 0) {
              this.selectedHealthAdministration =
                this.healthAdministrations.filter(
                  (item) => item.id === this.patient.homeHealthAdministrationId
                );
              // this.patient.homeCityId=this.collectedObj?.cityID;
              this.getHealthOffices(this.selectedHealthAdministrationId);
            }
            // if(this.collectedObj.healthAdministrationID>0){
            //   this.selectedHealthAdministration = this.healthAdministrations.filter(
            //     item => item.id === this.collectedObj.healthAdministrationID);
            //     this.patient.homeHealthAdministrationId=this.collectedObj.healthAdministrationID;
            //     this.getCities(this.collectedObj.healthAdministrationID);
            // }
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
  getCities(governmentID: any) {
    this.lookupsService.getPageCitys({ governmentID: governmentID }).subscribe(
      (result: any) => {
        if (result != null && result != undefined) {
          this.cities = result.data;
          if (this.patient.homeCityId > 0) {
            this.selectedCity = this.cities.filter(
              (item) => item.id === this.patient.homeCityId
            );
          }
          if (this.collectedObj?.cityID) {
            this.selectedCity = this.cities.filter(
              (item) => item.id === this.collectedObj?.cityID
            );
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
  getHealthOffices(healthAdministrationId: any) {
    //, reportingOrResidence: 2
    this.lookupsService
      .getPageIncidentSourceHospitals({
        healthAdministrationID: healthAdministrationId,
      })
      .subscribe(
        (result: any) => {
          if (result != null && result != undefined) {
            this.healthOffices = result.data;

            if (this.selectedHealthOfficeId > 0) {
              this.selectedHealthOffice = this.healthOffices.find(
                (item) => item.id == this.selectedHealthOfficeId
              );
              this.notFoundForm.patchValue({
                homeHealthOffice: this.selectedHealthOffice
              })
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
  onGovernmentChanged() {
    if (this.selectedGovernmentId > 0) {
      this.patient.homeGovernmentId = this.selectedGovernmentId;
      this.getHealthAdministration(this.patient.homeGovernmentId);
      this.getCities(this.patient.homeGovernmentId);
    } else {
      this.patient.homeGovernmentId = null;
      this.healthAdministrations = [];
      this.selectedHealthAdministration = null;
    }
  }

  onHealthAdministrationChanged() {
    if (this.selectedHealthAdministration) {
      this.patient.homeHealthAdministrationId =
        this.selectedHealthAdministration;
      this.getHealthOffices(this.patient.homeHealthAdministrationId);
    } else {
      this.patient.homeHealthAdministrationId = null;
      // this.cities = [];
      // this.selectedCity = null;
    }
  }

  onCityChanged() {
    if (this.selectedCity > 0) {
      this.patient.homeCityId = this.selectedCity;
    } else {
      this.patient.homeCityId = null;
      this.healthOffices = [];
      this.selectedHealthOffice = null;
    }
  }

  updateInvestigatio() {
    // this.patient.phoneNo1= this.phone;
    // this.patient.livingAddress=this.Address;
    this.notFoundForm.value.patientId = this.currentId;
    this.ObjToUpdate = this.notFoundForm.value;
    if (this.notFoundForm.value.homeGovernmentId != null) {
      this.ObjToUpdate.homeGovernmentId =
        this.notFoundForm.value.homeGovernmentId;
    }
    if (this.notFoundForm.value.homeCityId != null) {
      this.ObjToUpdate.homeCityId = this.notFoundForm.value.homeCityId;
    }
    if (this.notFoundForm.value.homeHealthAdministration != null) {
      this.ObjToUpdate.homeHealthAdministration =
        this.notFoundForm.value.homeHealthAdministration;
    }
    if (this.notFoundForm.value.homeHealthOffice != null) {
      this.ObjToUpdate.homeHealthOffice =
        this.notFoundForm.value.homeHealthOffice;
    }
    if (this.notFoundForm.value.phoneNo1 != null) {
      this.ObjToUpdate.phoneNo1 = this.notFoundForm.value.phoneNo1;
    }
    if (this.notFoundForm.value.livingAddress != null) {
      this.ObjToUpdate.livingAddress = this.notFoundForm.value.livingAddress;
    }

    this.generalDataService.updateInvestigation(this.ObjToUpdate).subscribe(
      (res: any) => {
        if (res != null) {
          this.loadingPanel = false;
          this.notFoundForm.patchValue({
            notInvestigationType: null,
          });

          this.userMsg.success('تم تحديث البيانات بنجاح');
        } else {
          this.loadingPanel = false;
          this.userMsg.error('حدث خطأ اثناء تحديث البيانات');
        }
      },
      (err) => console.error(err)
    );
  }
  ngOnDestroy(): void {
    if (
      this.Router.url.includes(
        '/home/investigations/compelete-investigation'
      ) ||
      this.Router.url.includes('/home/investigations')
    ) {
      this.investigation.view = true;
    } else {
      this.investigation.view = false;
    }
  }
}
