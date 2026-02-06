import { CustomeService } from './custome.service';
import { Component, OnInit } from '@angular/core';
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
@Component({
  selector: 'app-residence-info',
  templateUrl: './residence-info.component.html',
  styleUrls: ['./residence-info.component.css'],
})
export class ResidenceInfoComponent implements OnInit {
  patient: PatientModel = new PatientModel();
  governments!: any[];
  selectedGovernment: any;
  selectedGovernmentId: number;

  healthAdministrations!: any[];
  selectedHealthAdministration: any;
  selectedHealthAdministrationId: number;

  cities!: any[];
  selectedCity: any;
  selectedCityId: any;

  healthOffices!: any[];
  selectedHealthOffice: any;
  selectedHealthOfficeId: number;

  principalities!: any[];
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
    public generalDataService: GeneralDataService
  ) {}

  ngOnInit() {
    this.loadingPanel = true;
    this.currentLang =
      localStorage.getItem('ls.currentLang') !== undefined &&
      localStorage.getItem('ls.currentLang') !== 'undefined'
        ? localStorage.getItem('ls.currentLang')
        : 'ar';
    this.sharedDataService.getPatientObject().subscribe((patientObject) => {
      this.patient = patientObject;
      console.log(this.patient.newLivingAddress);
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
  onItemSelect(item: any) {}
  onSelectAll(items: any) {}

  onGovernmentChanged() {
    if (this.selectedGovernmentId != -1) {
      this.patient.homeGovernmentId = this.selectedGovernmentId;
      this.getCities(this.patient.homeGovernmentId);
      this.getHealthAdministration(this.patient.homeGovernmentId);
    } else {
      this.patient.homeGovernmentId = null;
      this.healthAdministrations = [];
      this.selectedHealthAdministration = null;
      this.cities = [];
      this.selectedCity = null;
      this.selectedCityId = -1;
      this.healthOffices = [];
      this.selectedHealthOffice = null;
      this.selectedHealthOfficeId = -1;
      this.principalities = [];
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
      this.healthOffices = [];
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
      this.principalities = [];
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
      this.principalities = [];
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

  getGovernments() {
    this.lookupsService.getAllGovernments().subscribe(
      (result: any) => {
        if (result != null && result != undefined) {
          this.governments = [
            { id: -1, arabicName: 'إختر', englishName: 'Select' },
          ];
          result.data.forEach((gov) => {
            this.governments.push(gov);
          });
          setTimeout(() => {
            if (this.patient.homeGovernmentId > 0) {
              this.selectedGovernmentId = this.patient.homeGovernmentId;
              this.getHealthAdministration(this.patient.homeGovernmentId);
              this.getCities(this.patient.homeGovernmentId);
            } else {
              this.selectedGovernmentId = -1;
            }
          }, 200);
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
    //;
    this.lookupsService
      .getPageHealthAdministrations({ governmentID: governmentID })
      .subscribe(
        (result: any) => {
          if (result != null && result != undefined) {
            this.healthAdministrations = [
              { id: -1, arabicName: 'إختر', englishName: 'Select' },
            ];
            result.data.forEach((health) => {
              this.healthAdministrations.push(health);
            });
            setTimeout(() => {
              if (this.patient.homeHealthAdministrationId > 0) {
                this.selectedHealthAdministrationId =
                  this.patient.homeHealthAdministrationId;
                // this.patient.homeCityId=this.collectedObj?.cityID;
                this.getHealthOffices(this.patient.homeHealthAdministrationId);
              } else {
                this.selectedHealthAdministrationId = -1;
              }
            }, 200);
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
          this.cities = [{ id: -1, arabicName: 'إختر', englishName: 'Select' }];
          result.data.forEach((job) => {
            this.cities.push(job);
          });
          this.selectedCityId = -1;
          setTimeout(() => {
            if (this.patient.homeCityId > 0) {
              this.selectedCityId = this.patient.homeCityId;
              this.getPrincipalities(this.patient.homeCityId);
            }
            if (this.collectedObj?.cityID) {
              this.selectedCityId = this.collectedObj.cityID;
            }
          }, 200);
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
            this.healthOffices = [
              { id: -1, arabicName: 'إختر', englishName: 'Select' },
            ];
            result.data.forEach((job) => {
              this.healthOffices.push(job);
            });
            setTimeout(() => {
              if (this.patient.homeHealthOfficeId > 0) {
                this.selectedHealthOfficeId = this.patient.homeHealthOfficeId;
                // this.getPrincipalities(this.patient.homeHealthOfficeId);
              } else {
                this.selectedHealthOfficeId = -1;
              }
            }, 200);
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
    this.lookupsService.getPagePrincipalitys({ cityID: cityID }).subscribe(
      (result: any) => {
        if (result != null && result != undefined) {
          this.principalities = [
            { id: -1, arabicName: 'إختر', englishName: 'Select' },
          ];
          result.data.forEach((job) => {
            this.principalities.push(job);
          });
          setTimeout(() => {
            if (this.patient.homePrincipalityId > 0) {
              this.selectedPrincipalityId = this.patient.homePrincipalityId;
            } else {
              this.selectedPrincipalityId = -1;
            }
          }, 200);
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
