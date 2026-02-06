import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { PrimeNGConfig, SortEvent } from 'primeng/api';
import { SingleDropdownSettings, SortOrder } from 'src/app/core/constants';
import { LookupsGetterService } from 'src/app/core/services/lookups-getter.service';
import { UserMessageService } from 'src/app/core/services/user.message.service';
import { PreparationsService } from '../../Services/preparations.service';
import { SharedDataService } from '../../Services/shared-data.service';
import { Router } from '@angular/router';
import { ExportService } from '../../../../../core/services/export.service';
import { GeneralDataService } from '../../../general-data/services/general-data.service';
import { ExportAsConfig } from 'ngx-export-as';
import { ActiveUserService } from 'src/app/core/services/active-user.service';

@Component({
  selector: 'app-list-preparations',
  templateUrl: './list-preparations.component.html',
  styleUrls: ['./list-preparations.component.css'],
})
export class ListPreparationsComponent implements OnInit {
  @ViewChild('myTableElementId', { static: false }) tableElement: ElementRef;
  screenName: string;
  underDeleting = {
    govenmentNamw: '',
    id: null,
  };
  singleDropdownSettings = SingleDropdownSettings;
  unitId: number;
  preparations!: any[];
  governments!: any[];

  healthAdministrations!: any[];
  incidentSources!: any[];
  preparationsFilter = {
    pageSize: 10,
    pageIndex: 0,
    sortColumn: '',
    sortOrder: '',
    searchText: '',
    govenmentId: -1,
    healthAdministrationId: null,
    incidentSourceId: -1,
  };
  SelectedhealthAdministrationId: any;
  SelectedincidentSourceId: any;
  selectedgovenmentId: number = -1;
  noData: boolean = true;
  loadingPanel: boolean = false;
  first: number = 0;
  last: number = 0;
  pages: number = 0;
  levelId: any;

  currentConfig: string = 'myTableElementId';
  exportAsPdfConfig: ExportAsConfig = {
    type: 'pdf', // the type you want to download
    elementIdOrContent: this.currentConfig, // the id of html/table element
  };

  @ViewChild('searchInput', { static: true }) searchInput!: ElementRef;
  messageService: any;
  currentLang: string;
  dir: string;
  delay: boolean = false;
  timer: any;

  constructor(
    private lookupsGetterService: LookupsGetterService,
    private translateService: TranslateService,
    private userMsg: UserMessageService,
    private preparationsService: PreparationsService,
    private primengConfig: PrimeNGConfig,
    private data: SharedDataService,
    private router: Router,
    public generalDataService: GeneralDataService,
    private exportService: ExportService,
    public activeUSerService: ActiveUserService
  ) {}
  BasicShow: boolean = false;

  showDialog() {
    this.BasicShow = true;
  }
  ngOnInit() {
    this.currentLang =
      localStorage.getItem('ls.currentLang') !== undefined &&
      localStorage.getItem('ls.currentLang') !== 'undefined'
        ? localStorage.getItem('ls.currentLang')
        : 'ar';

    this.dir = this.currentLang == 'ar' ? 'rtl' : 'ltr';
    this.getGovernment();
    setTimeout(() => {
      this.levelId = JSON.parse(
        localStorage.getItem('ls.authorizationData')
      )?.user?.levelId;

      this.selectedgovenmentId = JSON.parse(
        localStorage.getItem('ls.authorizationData')
      ).user?.govenmentId;

      this.SelectedhealthAdministrationId = JSON.parse(
        localStorage.getItem('ls.authorizationData')
      ).user?.healthAdministrationId;

      this.SelectedincidentSourceId = JSON.parse(
        localStorage.getItem('ls.authorizationData')
      ).user?.incidentSourceId;
    }, 500);

    this.levelId = JSON.parse(
      localStorage.getItem('ls.authorizationData')
    )?.user?.levelId;

    this.data.getUnitId().subscribe((UnitID) => {
      this.unitId = UnitID;
    });
    this.primengConfig.ripple = true;

    this.translateService
      .get('NEDSS.HOME.PREPARATION.MONITOR_UNIT_LIST.PREPARATIONS')
      .subscribe((res) => {
        this.screenName = res;
      });
  }
  getGovernment() {
    this.lookupsGetterService.getAllGovernments().subscribe(
      (result: any) => {
        if (result != null && result != undefined) {
          this.governments = [
            { id: -1, arabicName: 'إختر', englishName: 'Select' },
          ];
          result.data.forEach((gov) => {
            this.governments.push(gov);
          });
          if (result.data.length > 0) {
            this.selectedgovenmentId = JSON.parse(
              localStorage.getItem('ls.authorizationData')
            ).user.govenmentId;
            if (this.selectedgovenmentId != null) {
              this.governmentSelected();
            } else {
              this.selectedgovenmentId = -1;
            }
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

  governmentSelected() {
    this.preparationsFilter.govenmentId = null;
    this.healthAdministrations = [];
    this.incidentSources = [];
    if (this.selectedgovenmentId != -1) {
      this.preparationsFilter.govenmentId = this.selectedgovenmentId;
      this.getHealthAdministrations(this.preparationsFilter.govenmentId);
    }
  }
  getHealthAdministrations(governmentID: any) {
    this.lookupsGetterService
      .getPageHealthAdministrations({
        governmentID: governmentID,
      })
      .subscribe(
        (result: any) => {
          if (result != null && result != undefined) {
            this.healthAdministrations = [
              { id: -1, arabicName: 'إختر', englishName: 'Select' },
            ];
            result.data.forEach((gov) => {
              this.healthAdministrations.push(gov);
            });
            this.SelectedhealthAdministrationId = JSON.parse(
              localStorage.getItem('ls.authorizationData')
            ).user.healthAdministrationId;
            if (this.SelectedhealthAdministrationId != null) {
              this.healthAdministrationSelected();
            } else {
              this.SelectedhealthAdministrationId = -1;
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

  healthAdministrationSelected() {
    if (this.SelectedhealthAdministrationId != -1) {
      this.preparationsFilter.healthAdministrationId =
        this.SelectedhealthAdministrationId;
      this.getIncidentSources(this.SelectedhealthAdministrationId);
    }
  }
  getIncidentSources(healthAdministrationID: any) {
    this.lookupsGetterService
      .getPageIncidentSourceHospitals({
        healthAdministrationID: healthAdministrationID,
      })
      .subscribe(
        (result: any) => {
          if (result != null && result != undefined) {
            this.incidentSources = [
              { id: -1, arabicName: 'إختر', englishName: 'Select' },
            ];
            result.data.forEach((gov) => {
              this.incidentSources.push(gov);
            });
            this.SelectedincidentSourceId = JSON.parse(
              localStorage.getItem('ls.authorizationData')
            ).user.incidentSourceId;
            if (this.SelectedincidentSourceId != null) {
              this.incidentSourceSelected();
            } else {
              this.SelectedincidentSourceId = -1;
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

  search() {
    this.first = 0;
    this.preparationsFilter.pageIndex = 0;
    this.last =
      this.preparationsFilter.pageIndex * this.preparationsFilter.pageSize;
    this.getPreparationss();
  }

  getPreparationss() {
    this.loadingPanel = true;
    // this.generalDataService.isIncidentGovernmentValid =
    //   this.generalDataService.checkIncidentGovernmentValid(
    //     this.selectedgovenmentId
    //   );
    // this.generalDataService.isIncidentHealthAdministrationValid =
    //   this.generalDataService.checkIncidentHealthAdministrationValid(
    //     this.SelectedhealthAdministrationId
    //   );
    // this.generalDataService.isIncidentSourceValid =
    //   this.generalDataService.checkIncidentSourceValid(
    //     this.SelectedincidentSourceId
    //   );
    // let isValid =
    //   this.generalDataService.isIncidentGovernmentValid &&
    //   this.generalDataService.isIncidentHealthAdministrationValid &&
    //   this.generalDataService.isIncidentSourceValid;
    // if (isValid) {
    this.delay = true;
    this.timer = setTimeout(() => {
      if (this.delay) {
        this.translateService
          .get('NOUR.WaitPlease')
          .subscribe((msg) => this.userMsg.info(msg));
      }
    }, 500);
    this.preparationsService
      .getPagePreparations(this.preparationsFilter)
      .subscribe(
        (result: any) => {
          if (result != null && result != undefined) {
            this.preparations = result.data;
            // ?.filter((p: any) => this.lookupsGetterService.incidentsForOrg.includes(p.incidentSourceId));
            if (
              this.preparations != undefined &&
              this.preparations.length == 0
            ) {
              setTimeout(() => {
                this.delay = false;
                clearTimeout(this.timer);
              }, 0);
              this.noData = true;
              this.pages = 0;
              this.translateService
                .get('NOUR.NO_RESULTS')
                .subscribe((msg) => this.userMsg.warn(msg));
            } else {
              setTimeout(() => {
                this.delay = false;
                clearTimeout(this.timer);
              }, 0);
              this.noData = false;
              this.pages = result.data[0].totalCount;
              this.last =
                this.preparationsFilter.pageIndex *
                this.preparationsFilter.pageSize;
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
    // }
  }

  sort(event: SortEvent) {
    if (
      event.order == -1 &&
      this.preparationsFilter.sortOrder != SortOrder.desc
    ) {
      this.preparationsFilter.sortOrder = SortOrder.desc;
      if (typeof event.field === 'string')
        this.preparationsFilter.sortColumn = event.field;
      this.getPreparationss();
    } else if (
      event.order == 1 &&
      this.preparationsFilter.sortOrder != SortOrder.asc
    ) {
      this.preparationsFilter.sortOrder = SortOrder.asc;
      if (typeof event.field === 'string')
        this.preparationsFilter.sortColumn = event.field;
      this.getPreparationss();
    }
  }
  paginate(event: any) {
    this.first = event.first;
    this.last = event.last;
    this.preparationsFilter.pageIndex = event.page;
    this.preparationsFilter.pageSize = event.rows;
    this.getPreparationss();
  }

  clearSearch() {
    this.preparationsFilter.searchText = '';
    this.search();
  }

  getById(id: number) {
    this.data.setUnitId(id);
    this.router.navigateByUrl(
      '/home/preparations/add-preparations/preparations-data'
    );
  }

  delete(id: number) {
    this.preparationsService.deletePreparation(id).subscribe(
      (result: any) => {
        this.getPreparationss();
        this.translateService
          .get('NEDSS.COMMON.DELETED_SUCESSFULLY')
          .subscribe((res: string) => {
            this.userMsg.success(res);
          });
      },
      (error) => {
        this.translateService
          .get('NEDSS.COMMON.DELETED_FAILED')
          .subscribe((res: string) => {
            this.userMsg.error(res);
          });
      }
    );
  }

  exportPatiantsAsExcel() {
    this.exportService.exportTableAsExcel(this.tableElement, this.screenName);
  }

  // exportPatientsAsPdf() {
  //   this.exportService.exportTableAsPdf(this.tableElement, this.screenName);
  // }

  exportPatientsAsPdf() {
    let selectedGov = this.governments.filter(
      (g) => g.id == this.selectedgovenmentId
    );

    // let tempSelectedAdm = [this.SelectedhealthAdministrationId];
    let tempSelectedAdm = this.healthAdministrations.map((g) => g.id);
    let selectedAdm = this.healthAdministrations?.filter((g) =>
      tempSelectedAdm.includes(g.id)
    );
    let sa = selectedAdm.filter(
      (g) => g.id == this.SelectedhealthAdministrationId
    );
    let selectedAdmNam = sa.map((g) => g.arabicName);
    console.log(selectedAdmNam);

    let tempSelectedIncs = this.incidentSources.map((g) => g.id);
    let selectedIncs = this.incidentSources?.filter((g) =>
      tempSelectedIncs.includes(g.id)
    );
    let s = selectedIncs.filter((g) => g.id == this.SelectedincidentSourceId);
    let as = s.map((g) => g.arabicName);

    this.exportService.exportTemplateAsPdf(
      document.getElementById(this.currentConfig),
      'التجهيزات',
      [
        selectedGov,
        selectedAdmNam,
        as,
        // selectedIncs,
        // selectedDep
      ]
      //  [sDate, eDate]
    );
  }

  governmentsSelected(event) {
    this.preparationsFilter.govenmentId = event.id;
    this.getHealthAdministrations(this.preparationsFilter.govenmentId);
    this.preparationsFilter.healthAdministrationId = -1;
  }
  governmentDSelected() {
    this.preparationsFilter.govenmentId = null;
    this.healthAdministrations = null;
    this.SelectedhealthAdministrationId = -1;
    this.preparationsFilter.healthAdministrationId = null;
    this.SelectedincidentSourceId = null;
    this.incidentSources = null;
  }

  healthAdministrationDSelected() {
    this.preparationsFilter.healthAdministrationId = null;
    this.SelectedincidentSourceId = -1;
    this.incidentSources = null;
  }
  incidentSourceSelected() {
    if (this.SelectedincidentSourceId != -1) {
      this.preparationsFilter.incidentSourceId = this.SelectedincidentSourceId;
    }
  }

  incidentSourceDSelected() {
    this.preparationsFilter.incidentSourceId = -1;
  }
  nameToDelete(ele) {
    this.underDeleting.id = ele.id;
    this.underDeleting.govenmentNamw = ele.govenmentNamw;
  }
}
