import { DatePipe } from '@angular/common';
import { Component, ElementRef, ViewChild } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { LookupsGetterService } from 'src/app/core/services/lookups-getter.service';
import { UserMessageService } from 'src/app/core/services/user.message.service';
import { LabService } from '../../lab/services/lab.service';
import { Router } from '@angular/router';
import { SharedDataService } from '../general-data/services/shared-data.service';
import {
  MultipleDropdownSettings,
  SingleDropdownSettings,
} from 'src/app/core/constants';
import { ExportService } from '../../../core/services/export.service';
import { GeneralDataService } from '../general-data/services/general-data.service';
import { ExportAsConfig } from 'ngx-export-as';
@Component({
  selector: 'app-lab-cases',
  templateUrl: './lab-cases.component.html',
  styleUrls: ['./lab-cases.component.css'],
})
export class LabCasesComponent {
  currentLang: string;
  dir: string;
  delay: boolean = false;
  timer: any;

  selectedAdministrationId: number;
  incidentSources: any[];
  departments: any;
  selectedDepartment: any[] = [];
  startDate: any;
  endDate: any;
  currentConfig: string = 'myTableElementId';
  exportAsPdfConfig: ExportAsConfig = {
    type: 'pdf', // the type you want to download
    elementIdOrContent: this.currentConfig, // the id of html/table element
  };

  @ViewChild('myTableElementId', { static: false }) tableElement: ElementRef;
  screenName: string;
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
    insertedByLab: true,
    mandatoryDataCompleted: null,
  };
  levelId: any;
  nationalities!: any[];
  selectedNationality: number = -1;

  governments!: any[];
  selectedGovernment: number = -1;

  healthAdministrations!: any[];
  selectedHealthAdministration: any;

  cities!: any[];
  selectedCity: number;

  healthOffices!: any[];
  selectedHealthOffice: number = -1;

  loadingPanel: boolean = false;
  isForeign: boolean = false;

  singleDropdownSettings = {};
  multipleDropdownSettings = {};

  patientsForLab: [];
  noData: boolean = true;
  first: number = 0;
  last: number = 0;
  pages: number = 0;
  hasNextPage: boolean = false;
  totalCount: number | null = null;
  countLoading: boolean = false;

  constructor(
    private translateService: TranslateService,
    private userMsg: UserMessageService,
    private lookupsService: LookupsGetterService,
    private datePipe: DatePipe,
    private labService: LabService,
    private router: Router,
    private data: SharedDataService,
    private exportService: ExportService,
    public generalDataService: GeneralDataService
  ) {}

  ngOnInit() {
    this.currentLang =
      localStorage.getItem('ls.currentLang') !== undefined &&
      localStorage.getItem('ls.currentLang') !== 'undefined'
        ? localStorage.getItem('ls.currentLang')
        : 'ar';

    this.dir = this.currentLang == 'ar' ? 'rtl' : 'ltr';

    let incidentInfoLink = document.getElementById(
      'incidentInfo'
    ) as HTMLElement;
    incidentInfoLink.classList.remove('active');
    this.loadingPanel = true;
    this.levelId = JSON.parse(
      localStorage.getItem('ls.authorizationData')
    )?.user?.levelId;
    this.getLookups();
    this.singleDropdownSettings = SingleDropdownSettings;
    this.multipleDropdownSettings = MultipleDropdownSettings;
    this.loadingPanel = false;
    this.translateService
      .get('NEDSS.LAB_VIEW.PATIENT_CHECKS.PATIENT_CHECKS')
      .subscribe((res) => (this.screenName = res));
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
    this.patientsFilter.homeGovernmentId = this.selectedGovernment;
    this.getHealthAdministration(this.patientsFilter.homeGovernmentId);
    this.getCities(this.patientsFilter.homeGovernmentId);
  }
  onGovernmentDChanged() {
    this.patientsFilter.homeGovernmentId = null;
    this.healthAdministrations = [];
    this.selectedHealthAdministration = null;
    this.selectedCity = -1;
    this.cities = null;

    this.onHealthAdministrationChanged();
    this.selectedHealthOffice = -1;
  }

  onHealthAdministrationChanged() {
    this.selectedCity = -1;
    if (this.selectedHealthAdministration > 0) {
      this.patientsFilter.homeHealthAdministrationId =
        this.selectedHealthAdministration;
      this.getHealthOffices(this.patientsFilter.homeHealthAdministrationId);
    } else {
      this.patientsFilter.homeHealthAdministrationId = null;
      this.cities = [];
      this.selectedCity = -1;
      this.selectedHealthOffice = -1;
    }
  }

  onCityChanged() {
    if (this.selectedCity > 0) {
      this.patientsFilter.homeCityId = this.selectedCity;
    } else {
      this.patientsFilter.homeCityId = null;
      this.healthOffices = [];
      this.selectedHealthOffice = null;
    }
  }

  onHealthOfficeChanged() {
    if (this.selectedHealthOffice > 0) {
      this.patientsFilter.homeHealthOfficeId = this.selectedHealthOffice;
    } else {
      this.patientsFilter.homeHealthOfficeId = null;
    }
  }

  getPatients(skipCount?: boolean) {
    this.patientsFilter.mandatoryDataCompleted =
      this.patientsFilter.mandatoryDataCompleted === 'true'
        ? true
        : this.patientsFilter.mandatoryDataCompleted === 'false'
        ? false
        : null;
    this.Delay();
    this.labService.getPatientsFromLab(this.patientsFilter).subscribe(
      (result: any) => {
        if (result != null && result != undefined) {
          this.patientsForLab = result.data;
          // ?.filter((p: any) =>
          //   this.lookupsService.incidentsForOrg.includes(p.homeHealthOfficeId)
          // );
          if (
            this.patientsForLab != undefined &&
            this.patientsForLab.length == 0
          ) {
            this.RemoveDelay();
            this.noData = true;
            this.pages = 0;
            this.hasNextPage = false;
            this.translateService
              .get('NOUR.NO_RESULTS')
              .subscribe((msg) => this.userMsg.warn(msg));
          } else {
            this.RemoveDelay();
            this.noData = false;
            this.hasNextPage =
              result.data[0].hasNextPage === true &&
              result.data.length >= this.patientsFilter.pageSize;
            this.last =
              this.patientsFilter.pageIndex * this.patientsFilter.pageSize;
            if (!skipCount) this.fetchCount(this.patientsFilter);
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

  previousPage() {
    if (this.patientsFilter.pageIndex > 0) {
      this.patientsFilter.pageIndex--;
      this.first = this.patientsFilter.pageIndex * this.patientsFilter.pageSize;
      this.getPatients(true);
    }
  }

  nextPage() {
    if (this.hasNextPage) {
      this.patientsFilter.pageIndex++;
      this.first = this.patientsFilter.pageIndex * this.patientsFilter.pageSize;
      this.getPatients(true);
    }
  }

  onPageSizeChange(newSize: number) {
    this.patientsFilter.pageSize = newSize;
    this.patientsFilter.pageIndex = 0;
    this.first = 0;
    this.getPatients();
  }

  private fetchCount(filter: any) {
    const skip = ['pageSize', 'pageIndex', 'sortColumn', 'sortOrder', 'searchText', 'filterType', 'insertedByLab'];
    const hasFilter = Object.keys(filter).some(k => !skip.includes(k) && filter[k] != null && filter[k] !== '' && filter[k] !== false);
    if (!hasFilter) {
      this.totalCount = null;
      return;
    }
    this.countLoading = true;
    this.totalCount = null;
    this.labService.getPatientsFromLabCount({ ...filter }).subscribe(
      (res: any) => {
        this.countLoading = false;
        if (res?.data?.length > 0) {
          this.totalCount = res.data[0].totalCount;
        }
      },
      () => { this.countLoading = false; }
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
          if (result.data.length > 0) {
            this.selectedGovernment = JSON.parse(
              localStorage.getItem('ls.authorizationData')
            ).user.govenmentId;
            if (this.selectedGovernment != null) {
              this.onGovernmentChanged();
            } else {
              this.selectedGovernment = -1;
            }
          }
          this.selectedHealthAdministration = -1;
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

            this.selectedHealthAdministration = JSON.parse(
              localStorage.getItem('ls.authorizationData')
            ).user.healthAdministrationId;
            if (this.selectedHealthAdministration != null) {
              this.onHealthAdministrationChanged();
            } else {
              this.selectedHealthAdministration = -1;
            }
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

  getCities(healthAdministrationID: any) {
    this.lookupsService
      .getPageCitys({ healthAdministrationID: healthAdministrationID })
      .subscribe(
        (result: any) => {
          if (result != null && result != undefined) {
            this.cities = [
              { id: -1, arabicName: 'إختر', englishName: 'Select' },
            ];
            result.data.forEach((nat) => {
              this.cities.push(nat);
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

  getHealthOffices(healthAdministrationid: any) {
    this.lookupsService
      .getPageIncidentSourceHospitals({
        healthAdministrationid: healthAdministrationid,
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

  GetById(id: number) {
    this.data.patientId = id;
    this.router.navigateByUrl('/home/general-data');
  }

  exportPatiantsAsExcel() {
    this.exportService.exportTableAsExcel(this.tableElement, this.screenName);
  }
  // exportPatientsAsPdf() {
  //   this.exportService.exportTableAsPdf(this.tableElement, this.screenName);
  // }

  exportPatientsAsPdf() {
    let selectedGov = this.governments.filter(
      (g) => g.id == this.selectedGovernment
    );

    let tempSelectedAdm = [this.selectedHealthAdministration];
    let selectedAdm = this.healthAdministrations?.filter((g) =>
      tempSelectedAdm.includes(g.id)
    );
    selectedAdm = selectedAdm?.map((g) => g.arabicName);
    console.log(selectedAdm);

    let tempSelectedIncs = this.incidentSources?.map((g) => g.id);
    let selectedIncs = this.incidentSources?.filter((g) =>
      tempSelectedIncs.includes(g.id)
    );
    selectedIncs = selectedIncs?.map((g) => g.arabicName);
    console.log(selectedIncs);

    let tempSelectedDeps = this.selectedDepartment?.map((g) => g.id);
    let selectedDep = this.departments?.filter((g) =>
      tempSelectedDeps.includes(g.id)
    );
    selectedDep = selectedDep?.map((g) => g.arabicName);

    let sDate, eDate;

    // console.log((this.patientsFilter.fromDate && new Date(this.patientsFilter.fromDate).toLocaleDateString('en-GB')));

    // patientsFilter
    try {
      // sDate = (((new Date(this.startDate))?.toISOString())?.split('T'))[0]
      // eDate = (((new Date(this.endDate))?.toISOString())?.split('T'))[0]
      sDate =
        this.patientsFilter.fromDate &&
        new Date(this.patientsFilter.fromDate).toLocaleDateString('en-GB');
      eDate =
        this.patientsFilter.toDate &&
        new Date(this.patientsFilter.toDate).toLocaleDateString('en-GB');
    } catch (error) {
      sDate = '';
      eDate = '';
    }
    this.exportService.exportTemplateAsPdf(
      document.getElementById(this.currentConfig),
      'حالات المعمل',
      [selectedGov, selectedAdm, selectedIncs, selectedDep],
      [sDate, eDate]
    );
  }

  clearSearch() {
    this.patientsFilter.searchText = '';
    this.getPatients();
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
}
