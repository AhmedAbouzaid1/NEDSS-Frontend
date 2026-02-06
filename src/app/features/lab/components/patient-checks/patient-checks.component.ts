import { Component, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { LookupsGetterService } from 'src/app/core/services/lookups-getter.service';
import { UserMessageService } from 'src/app/core/services/user.message.service';
import { LabService } from '../../services/lab.service';
import {
  SingleDropdownSettings,
  MultipleDropdownSettings,
} from 'src/app/core/constants';
import { Router } from '@angular/router';
import { GeneralDataService } from '../../../home/general-data/services/general-data.service';
import { debounce } from 'rxjs-compat/operator/debounce';
@Component({
  selector: 'app-patient-checks',
  templateUrl: './patient-checks.component.html',
  styleUrls: ['./patient-checks.component.css'],
})
export class PatientChecksComponent implements OnInit {
  currentLang: string;
  dir: string;
  delay: boolean = false;
  timer: any;
  patientsFilter = {
    pageSize: 10,
    pageIndex: 0,
    sortColumn: '',
    sortOrder: '',
    searchText: '',
    id: null,
    nationalityId: null,
    homeGovernmentId: null,
    homeHealthAdministrationId: null,
    homeCityId: null,
    homeHealthOfficeId: null,
    homePrincipalityId: null,
    fullName: null,
    nationalId: null,
    passportNo: null,
    livingAddress: null,
    phoneNo: null,
    fromDate: null,
    toDate: null,
    insertedByLab: null,
    firstTime: false,
    hasLabChecks: null,
  };

  levelId: any;

  nationalities!: any[];
  selectedNationality: number = -1;

  governments!: any[];
  selectedGovernment: number = -1;

  healthAdministrations!: any[];
  selectedHealthAdministration: number;

  cities!: any[];
  selectedCity: -1;

  healthOffices!: any[];
  selectedHealthOffice: number;

  loadingPanel: boolean = false;
  isForeign: boolean = false;

  singleDropdownSettings = {};
  multipleDropdownSettings = {};

  patientsForLab: [];
  noData: boolean = true;
  first: number = 0;
  last: number = 0;
  pages: number = 0;

  maxDate = new Date();
  minDate = new Date(1900, 0, 1);
  constructor(
    private translateService: TranslateService,
    private userMsg: UserMessageService,
    private lookupsService: LookupsGetterService,
    private labService: LabService,
    private router: Router,
    public generalDataService: GeneralDataService
  ) {}

  ngOnInit() {
    this.currentLang =
      localStorage.getItem('ls.currentLang') !== undefined &&
      localStorage.getItem('ls.currentLang') !== 'undefined'
        ? localStorage.getItem('ls.currentLang')
        : 'ar';
    this.dir = this.currentLang == 'ar' ? 'rtl' : 'ltr';

    this.levelId = JSON.parse(
      localStorage.getItem('ls.authorizationData')
    )?.user?.levelId;

    let incidentInfoLink = document.getElementById(
      'incidentInfo'
    ) as HTMLElement;
    incidentInfoLink.classList.remove('active');
    this.loadingPanel = true;
    this.getLookups();
    this.singleDropdownSettings = SingleDropdownSettings;
    this.multipleDropdownSettings = MultipleDropdownSettings;
    this.loadingPanel = false;

    this.router.routerState.root.queryParams.subscribe((params) => {
      //alert(JSON.stringify(params)); // { orderby: "price" }
      if (params.done == null || params.done == undefined) {
        this.patientsFilter = {
          pageSize: 10,
          pageIndex: 0,
          sortColumn: '',
          sortOrder: '',
          searchText: '',
          id: null,
          nationalityId: null,
          homeGovernmentId: null,
          homeHealthAdministrationId: null,
          homeCityId: null,
          homeHealthOfficeId: null,
          homePrincipalityId: null,
          fullName: null,
          nationalId: null,
          passportNo: null,
          livingAddress: null,
          phoneNo: null,
          fromDate: null,
          toDate: null,
          insertedByLab: null,
          hasLabChecks: null,
          firstTime: false,
        };
      } else {
        this.patientsFilter = {
          pageSize: 10,
          pageIndex: 0,
          sortColumn: '',
          sortOrder: '',
          searchText: '',
          id: null,
          nationalityId: null,
          homeGovernmentId: null,
          homeHealthAdministrationId: null,
          homeCityId: null,
          homeHealthOfficeId: null,
          homePrincipalityId: null,
          fullName: null,
          nationalId: null,
          passportNo: null,
          livingAddress: null,
          phoneNo: null,
          fromDate: null,
          toDate: null,
          insertedByLab: null,
          hasLabChecks: params.done,
          firstTime: true,
        };
        //alert("will search becuase filter");
        this.getPatients(true);
      }
    });
  }
  getLookups() {
    // this.getPatients();
    this.getNationalities();
    this.getGovernments();
  }

  onItemSelect(item: any) {}
  onSelectAll(items: any) {}

  onNationalityChanged() {
    if (this.selectedNationality > 0) {
      this.patientsFilter.nationalityId = this.selectedNationality;
      if (this.selectedNationality != 1) this.isForeign = true;
      else this.isForeign = false;
    } else {
      this.patientsFilter.nationalityId = null;
      this.isForeign = false;
    }
  }

  onGovernmentChanged() {
    if (this.selectedGovernment > 0) {
      this.selectedHealthAdministration = -1;
      this.patientsFilter.homeGovernmentId = this.selectedGovernment;
      this.getHealthAdministration(this.patientsFilter.homeGovernmentId);
      this.getCities(this.patientsFilter.homeGovernmentId);
    } else {
      this.patientsFilter.homeGovernmentId = null;
      this.healthAdministrations = [];
      this.selectedHealthAdministration = null;
    }
  }

  onHealthAdministrationChanged() {
    if (this.selectedHealthAdministration > 0) {
      this.selectedCity = -1;
      this.patientsFilter.homeHealthAdministrationId =
        this.selectedHealthAdministration;
      this.getHealthOffices(this.patientsFilter.homeHealthAdministrationId);
    } else {
      this.patientsFilter.homeHealthAdministrationId = null;
      this.cities = [];
      this.selectedCity = null;
    }
  }

  onCityChanged() {
    if (this.selectedCity > 0) {
      this.patientsFilter.homeCityId = this.selectedCity;
    } else {
      this.patientsFilter.homeCityId = null;
      this.healthOffices = [];
      this.selectedHealthOffice = -1;
    }
  }

  onHealthOfficeChanged() {
    if (this.selectedHealthOffice > 0) {
      this.patientsFilter.homeHealthOfficeId = this.selectedHealthOffice;
    } else {
      this.patientsFilter.homeHealthOfficeId = null;
    }
  }

  getPatients(firstTime?: boolean) {
    this.patientsFilter.hasLabChecks =
      this.patientsFilter.hasLabChecks === 'true'
        ? true
        : this.patientsFilter.hasLabChecks === 'false'
        ? false
        : null;
    //alert("has lab checks " + this.patientsFilter.hasLabChecks);
    this.patientsFilter.firstTime = firstTime;
    this.Delay();
    this.labService.getPatients(this.patientsFilter).subscribe(
      (result: any) => {
        if (result != null && result != undefined) {
          // this.patientsForLab = result.data?.filter((p: any) => this.lookupsService.incidentsForOrg.includes(p.incidentSourceId));
          this.patientsForLab = result.data;
          if (
            this.patientsForLab != undefined &&
            this.patientsForLab.length == 0
          ) {
            this.RemoveDelay();
            this.noData = true;
            this.pages = 0;
            this.translateService
              .get('NOUR.NO_RESULTS')
              .subscribe((msg) => this.userMsg.warn(msg));
          } else {
            this.RemoveDelay();
            this.noData = false;
            this.pages = result.data[0].totalCount;
            this.last =
              this.patientsFilter.pageIndex * this.patientsFilter.pageSize;
          }
        }
      },
      (error) => {
        this.translateService
          .get('NEDSS.COMMON.INTERNAL_SERVER_ERROR')
          .subscribe((res: string) => {
            this.userMsg.error(res);
          });
      }
    );
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

  getGovernments() {
    this.lookupsService.getAllGovernments().subscribe(
      (result: any) => {
        if (result != null && result != undefined) {
          this.governments = [
            { id: -1, arabicName: 'إختر', englishName: 'Select' },
          ];
          result.data.forEach((nat) => {
            this.governments.push(nat);
          });

          // if (this.levelId != 1) {
          //   this.selectedGovernment = JSON.parse(localStorage.getItem('ls.authorizationData')).user.govenmentId;
          //   this.onGovernmentChanged();
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

  getHealthAdministration(governmentID: any) {
    this.lookupsService
      .getPageHealthAdministrations({ governmentID: governmentID })
      .subscribe(
        (result: any) => {
          if (result != null && result != undefined) {
            this.healthAdministrations = [
              { id: -1, arabicName: 'إختر', englishName: 'Select' },
            ];
            result.data.forEach((nat) => {
              this.healthAdministrations.push(nat);
            });

            // if (this.levelId != 1 && this.levelId != 2) {
            //   this.selectedHealthAdministration = JSON.parse(localStorage.getItem('ls.authorizationData')).user.healthAdministrationId;
            //   this.onHealthAdministrationChanged();
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
          this.cities = [{ id: -1, arabicName: 'إختر', englishName: 'Select' }];
          result.data.forEach((nat) => {
            this.cities.push(nat);
          });
          this.selectedHealthOffice = -1;
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
            result.data.forEach((nat) => {
              this.healthOffices.push(nat);
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

  paginate(event: any) {
    this.first = event.first;
    this.last = event.last;
    //add one as primeng pagination is zero based ,so we convert it to one based to fit with the API
    this.patientsFilter.pageIndex = event.page;
    this.patientsFilter.pageSize = event.rows;
    this.getPatients();
  }
  addPatientChecks(id: number) {}

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
}
