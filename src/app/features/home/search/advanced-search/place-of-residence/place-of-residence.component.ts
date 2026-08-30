import { Component, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { PatientModel } from '../../../general-data/models/patient-model';
import { SharedDataService } from '../../../general-data/services/shared-data.service';
import { Patient } from '../../models/patient';
import { SearchSharedDataService } from '../../services/search-shared-data.service';
import { TranslateService } from '@ngx-translate/core';
import { LookupsGetterService } from 'src/app/core/services/lookups-getter.service';
import { UserMessageService } from 'src/app/core/services/user.message.service';
import { SingleDropdownSettings } from 'src/app/core/constants';
import { GeneralDataService } from '../../../general-data/services/general-data.service';

@Component({
  selector: 'app-place-of-residence',
  templateUrl: './place-of-residence.component.html',
  styleUrls: ['./place-of-residence.component.css'],
})
export class PlaceOfResidenceComponent implements OnInit {
  patient: Patient;
  placeResidenceForm: FormGroup;
  governments: any;
  loadingPanel: boolean;
  healthAdministration: any;
  Principalities: any;
  healthOfficcies: any;
  cities: any;
  selectedgovernment: number = -1;
  selectedhealthAdministration: number = -1;
  selectedhealthOfficcie: number = -1;
  Selectedcity: number = -1;
  selectedhomePrincipaly: number = -1;
  levelId: any;
  currentLang: string;
  dir: string;
  delay: boolean = false;
  timer: any;
  governmentsLoading: boolean = false;
  healthAdministrationLoading: boolean = false;
  healthOfficciesLoading: boolean = false;
  citiesLoading: boolean = false;
  PrincipalitiesLoading: boolean = false;
  singleDropdownSettings = SingleDropdownSettings;
  constructor(
    private sharedDataService: SearchSharedDataService,
    private lookupsService: LookupsGetterService,
    private translateService: TranslateService,
    public generalDataService: GeneralDataService,
    private userMsg: UserMessageService
  ) {}

  ngOnInit() {
    this.currentLang =
      localStorage.getItem('ls.currentLang') !== undefined &&
      localStorage.getItem('ls.currentLang') !== 'undefined'
        ? localStorage.getItem('ls.currentLang')
        : 'ar';

    this.sharedDataService.getPatientObject().subscribe((patientObject) => {
      this.patient = patientObject;
    });
    this.levelId = JSON.parse(
      localStorage.getItem('ls.authorizationData')
    )?.user?.levelId;
    let link = document.getElementById('fastSearch') as HTMLElement;
    link.classList.add('active');
    this.getLookUps();
  }

  ngOnDestroy() {
    let link = document.getElementById('fastSearch') as HTMLElement;
    link.classList.remove('active');
  }

  getLookUps() {
    this.getGovernments();
    // this.getHealthAdministration();
    // this.getPrincipality();
    // this.getHealthOffice();
    // this.gethomeCity();
  }

  getGovernments() {
    this.governmentsLoading = true;
    this.lookupsService.getAllGovernments().subscribe(
      (result: any) => {
        if (result != null && result != undefined) {
          this.governments = [
            { id: -1, arabicName: 'إختر', englishName: 'Select' },
          ];
          result.data.forEach((he) => {
            this.governments.push(he);
          });
          if (this.patient.homeGovernmentId > 0) {
            this.selectedgovernment = this.patient.homeGovernmentId;
            this.getHealthAdministration(this.patient.homeGovernmentId);
            this.gethomeCity(this.patient.homeGovernmentId);
          } else {
            this.selectedgovernment = -1;
          }
        }
        this.governmentsLoading = false;
        this.loadingPanel = false;
      },
      (error) => {
        this.governmentsLoading = false;
        this.loadingPanel = false;
        this.translateService
          .get('NEDSS.COMMON.INTERNAL_SERVER_ERROR')
          .subscribe((res: string) => {
            this.userMsg.error(res);
          });
      }
    );
  }

  governmentSelected() {
    this.patient.homeGovernmentId = this.selectedgovernment;
    if (
      this.patient.homeGovernmentId != null &&
      this.patient.homeGovernmentId != -1
    ) {
      this.getHealthAdministration(this.patient.homeGovernmentId);
      this.gethomeCity(this.patient.homeGovernmentId);
    }
  }

  governmentDSelected() {
    this.patient.homeGovernmentId = null;
    this.healthAdministration = null;
    this.selectedhealthAdministration = null;
    //city
    this.cities = null;
    this.patient.homeCityId = null;
    this.Selectedcity = null;
    this.healthOfficcies = null;
    this.selectedhealthOfficcie = null;
    this.homeCityDeselected();
  }

  getHealthAdministration(governmentID: any) {
    this.healthAdministrationLoading = true;
    this.lookupsService
      .getPageHealthAdministrations({ governmentID: governmentID })
      .subscribe(
        (result: any) => {
          if (result != null && result != undefined) {
            this.healthAdministration = [
              { id: -1, arabicName: 'إختر', englishName: 'Select' },
            ];
            result.data.forEach((nat) => {
              this.healthAdministration.push(nat);
            });
            if (this.patient.homeHealthAdministrationId > 0) {
              this.selectedhealthAdministration =
                this.patient.homeHealthAdministrationId;
              // this.patient.homeCityId=this.collectedObj?.cityID;
              this.getIncidentSources(this.patient.homeHealthAdministrationId);
            } else {
              this.selectedhealthAdministration = -1;
            }
          }
          this.healthAdministrationLoading = false;
          this.loadingPanel = false;
        },
        (error) => {
          this.healthAdministrationLoading = false;
          this.loadingPanel = false;
          this.translateService
            .get('NEDSS.COMMON.INTERNAL_SERVER_ERROR')
            .subscribe((res: string) => {
              this.userMsg.error(res);
            });
        }
      );
  }

  healthAdministrationSelected() {
    this.patient.homeHealthAdministrationId =
      this.selectedhealthAdministration != -1
        ? this.selectedhealthAdministration
        : null;
    if (
      this.patient.homeHealthAdministrationId != null &&
      this.patient.homeHealthAdministrationId != -1
    ) {
      this.getIncidentSources(this.patient.homeHealthAdministrationId);
    }
  }
  healthAdministrationDSelected() {
    this.patient.homeHealthAdministrationId = null;
    this.selectedhealthOfficcie = null;
    this.healthOfficcies = null;
    // this.getIncidentSources(this.patient.homeHealthAdministrationId);
  }
  getIncidentSources(healthAdministrationID: any) {
    //, reportingOrResidence: 2
    this.healthOfficciesLoading = true;
    this.lookupsService
      .getPageIncidentSourceHospitals({
        healthAdministrationID: healthAdministrationID,
      })
      .subscribe(
        (result: any) => {
          if (result != null && result != undefined) {
            this.healthOfficcies = [
              { id: -1, arabicName: 'إختر', englishName: 'Select' },
            ];
            result.data.forEach((nat) => {
              this.healthOfficcies.push(nat);
            });

            if (this.patient.homeHealthOfficeId > 0) {
              this.selectedhealthOfficcie = this.patient.homeHealthOfficeId;
              // this.patient.homeCityId=this.collectedObj?.cityID;
            } else {
              this.selectedhealthOfficcie = -1;
            }
          }
          this.healthOfficciesLoading = false;
          this.loadingPanel = false;
        },
        (error) => {
          this.healthOfficciesLoading = false;
          this.loadingPanel = false;
          this.translateService
            .get('NEDSS.COMMON.INTERNAL_SERVER_ERROR')
            .subscribe((res: string) => {
              this.userMsg.error(res);
            });
        }
      );
  }

  gethomeCity(governmentID: any) {
    this.citiesLoading = true;
    this.lookupsService.getPageCitys({ governmentID: governmentID }).subscribe(
      (result: any) => {
        if (result != null && result != undefined) {
          this.cities = [{ id: -1, arabicName: 'إختر', englishName: 'Select' }];
          result.data.forEach((nat) => {
            this.cities.push(nat);
          });

          if (this.patient.homeCityId > 0) {
            this.Selectedcity = this.patient.homeCityId;
            // this.patient.homeCityId=this.collectedObj?.cityID;
            this.getPrincipality(this.patient.homeCityId);
          } else {
            this.Selectedcity = -1;
          }
        }
        this.citiesLoading = false;
        this.loadingPanel = false;
      },
      (error) => {
        this.citiesLoading = false;
        this.loadingPanel = false;
        this.translateService
          .get('NEDSS.COMMON.INTERNAL_SERVER_ERROR')
          .subscribe((res: string) => {
            this.userMsg.error(res);
          });
      }
    );
  }
  healthAdministrationDeSelected() {
    this.cities = null;
    this.patient.homeCityId = null;
    this.Selectedcity = null;
    this.healthOfficcies = null;
    this.selectedhealthOfficcie = null;
    this.homeCityDeselected();
  }
  homeCitySelected() {
    this.patient.homeCityId =
      this.Selectedcity != -1 ? this.Selectedcity : null;
    this.getPrincipality(this.patient.homeCityId);
  }
  homeCityDeselected() {
    this.patient.homeCityId = null;

    this.Principalities = null;
    this.patient.homePrincipalityId = null;
    this.selectedhomePrincipaly = null;
  }
  homeHealthOfficeSelected() {
    this.patient.homeHealthOfficeId =
      this.selectedhealthOfficcie != -1 ? this.selectedhealthOfficcie : null;
    // this.getPrincipality(this.patient.homeHealthOfficeId);
  }
  clearAll() {
    this.patient = {};
    this.patient.pageIndex = 0;
    this.patient.pageSize = 10;
    this.patient.filterType = 1;
    this.sharedDataService.setPatientObject(this.patient);
    this.selectedgovernment = null;
    this.selectedhealthAdministration = null;
    this.Selectedcity = null;
    this.selectedhealthOfficcie = null;
    this.selectedhomePrincipaly = null;
  }
  homeHealthOfficeDeSelected() {
    this.Principalities = null;
    this.patient.homePrincipalityId = null;
    this.selectedhomePrincipaly = null;
  }
  homePrincipalitySelected() {
    this.patient.homePrincipalityId =
      this.selectedhomePrincipaly != -1 ? this.selectedhomePrincipaly : null;
  }
  getPrincipality(homeCityId: any) {
    this.PrincipalitiesLoading = true;
    this.lookupsService.getPagePrincipalitys({ cityID: homeCityId }).subscribe(
      (result: any) => {
        if (result != null && result != undefined) {
          this.Principalities = [
            { id: -1, arabicName: 'إختر', englishName: 'Select' },
          ];
          result.data.forEach((nat) => {
            this.Principalities.push(nat);
          });

          if (this.patient.homePrincipalityId > 0) {
            this.selectedhomePrincipaly = this.patient.homePrincipalityId;
          } else {
            this.selectedhomePrincipaly = -1;
          }
        }
        this.PrincipalitiesLoading = false;
        this.loadingPanel = false;
      },
      (error) => {
        this.PrincipalitiesLoading = false;
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
