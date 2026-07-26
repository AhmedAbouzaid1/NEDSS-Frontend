import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { MenuItem } from 'primeng/api';
import { SharedDataService } from '../../general-data/services/shared-data.service';
import { Patient } from '../models/patient';
import { SearchSharedDataService } from '../services/search-shared-data.service';
import {
  trigger,
  state,
  style,
  transition,
  animate,
} from '@angular/animations';
import { TranslateService } from '@ngx-translate/core';
import {
  Relations,
  SingleDropdownSettings,
  SortOptions,
  SortOrder,
} from 'src/app/core/constants';
import { UserMessageService } from 'src/app/core/services/user.message.service';
import { GeneralDataService } from '../../general-data/services/general-data.service';
import { Router } from '@angular/router';
import { ExportService } from 'src/app/core/services/export.service';
import { LookupsGetterService } from 'src/app/core/services/lookups-getter.service';
import { ExportAsConfig } from 'ngx-export-as';
import { SortEvent } from 'primeng/api';

@Component({
  selector: 'app-advanced-search',
  templateUrl: './advanced-search.component.html',
  styleUrls: ['./advanced-search.component.css'],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({ height: '0px', minHeight: '0' })),
      state('expanded', style({ height: '*' })),
      transition(
        'expanded <=> collapsed',
        animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')
      ),
    ]),
  ],
})
export class AdvancedSearchComponent implements OnInit {
  @ViewChild('myTableElementId', { static: false }) tableElement: ElementRef;
  screenName: string;

  patient: Patient;
  items: MenuItem[];
  items2: MenuItem[];
  activeItem: MenuItem;
  patients: any;
  fullName: string;
  columnsToDisplay = [];
  dataToShow = [];
  expandedElement: Patient | null;
  governments: any;
  selectedGovernmentId: number = -1;
  selectedAdministrationId: number;
  healthAdministration: any[];
  incidentSources: any[];
  selectedDepartment: any[] = [];
  departments: any;
  startDate: any;
  endDate: any;
  currentConfig: string = 'myTableElementId';
  exportAsPdfConfig: ExportAsConfig = {
    type: 'pdf', // the type you want to download
    elementIdOrContent: this.currentConfig, // the id of html/table element
  };

  noData: boolean = true;
  loadingPanel: boolean = false;
  first: number = 0;
  last: number = 0;
  pages: number = 0;
  hasNextPage: boolean = false;
  totalCount: number | null = null;
  countLoading: boolean = false;
  underDeleting: Patient = {};
  currentLang: string;
  dir: string;
  delay: boolean = false;
  timer: any;

  constructor(
    private sharedDataService: SearchSharedDataService,
    private searchService: GeneralDataService,
    private lookupsService: LookupsGetterService,
    private translateService: TranslateService,
    private userMsg: UserMessageService,
    private data: SharedDataService,
    private router: Router,
    private exportService: ExportService,
    private translate: TranslateService
  ) {
    this.translate.setDefaultLang('ar');
  }

  ngOnInit() {
    this.sharedDataService
      .getPatientObject()
      .subscribe((patientObject: any) => {
        this.patient = patientObject;
      });
    this.currentLang = localStorage.getItem('ls.currentLang');
    this.dir = this.currentLang == 'ar' ? 'rtl' : 'ltr';

    this.underDeleting.id = 0;
    this.underDeleting.fullName = '';
    this.underDeleting.filterType = 1;
    this.items = [
      {
        label: 'نموذج الإبلاغ العام ',
        icon: 'pi pi-fw pi-user',
        routerLink: ['./general-report'],
      },
      {
        label: 'البيانات الديموجرافية ',
        icon: 'pi pi-fw pi-id-card',
        routerLink: ['./search-demograth'],
      },
      {
        label: 'محل الاقامة',
        icon: 'pi pi-fw pi-building',
        routerLink: ['./place-residence'],
      },
    ];
    this.items2 = [
      {
        label: 'General reporting form',
        icon: 'pi pi-fw pi-user',
        routerLink: ['./general-report'],
      },
      {
        label: 'Demographic data ',
        icon: 'pi pi-fw pi-id-card',
        routerLink: ['./search-demograth'],
      },
      {
        label: 'residence',
        icon: 'pi pi-fw pi-building',
        routerLink: ['./place-residence'],
      },
    ];

    this.activeItem = this.items[0];

    this.patient.pageIndex = 0;
    this.patient.pageSize = 10;
    this.patient.filterType = 1;

    this.translateService
      .get('NEDSS.SEARCH.ADVANCED_SEARCH')
      .subscribe((res) => {
        this.screenName = res;
      });

    if (this.currentLang == 'en') {
      this.columnsToDisplay = [
        'fullName',
        'nationality',
        'nationalId',
        'homeGovernmentName',
        'phoneNo1',
        'caseDiscoveryDate',
        'diseaseGroupArabicName',
        'Procedures',
      ];
    } else {
      this.columnsToDisplay = [
        'الاسم',
        'الجنسية',
        'الرقم القومي',
        'محافظه السكن',
        'رقم التليفون',
        'التشخيص الابتدائي',
        'الاجراءات',
      ];
    }
    this.dataToShow = [
      'fullName',
      'nationality',
      'nationalId',
      'homeGovernmentName',
      'phoneNo1',
      'caseDiscoveryDate',
      'diseaseGroupArabicName',
      'Procedures',
    ];
  }

  onActiveItemChange(event) {
    this.activeItem = event;
  }

  firemodal(patient) {
    document.getElementById('confName').innerText = patient.firstName;
  }
  clearAll() {
    this.patient = {};
  }
  sort(event: SortEvent) {
    if (
      event.order == -1 &&
      (this.patient.sortOrder != SortOrder.desc ||
        this.patient.sortColumn != event.field)
    ) {
      this.patient.sortOrder = SortOrder.desc;
      this.patient.sortColumn = event.field;
      this.search(false, true);
    } else if (
      event.order == 1 &&
      (this.patient.sortOrder != SortOrder.asc ||
        this.patient.sortColumn != event.field)
    ) {
      this.patient.sortOrder = SortOrder.asc;
      this.patient.sortColumn = event.field;
      this.search(false, true);
    }
  }
  search(firstTime?: boolean, skipCount?: boolean) {
    this.loadingPanel = true;

    if (this.isValidPatient()) {
      this.delay = true;
      this.timer = setTimeout(() => {
        if (this.delay) {
          this.translateService
            .get('NOUR.WaitPlease')
            .subscribe((msg) => this.userMsg.info(msg));
        }
      }, 500);
      this.searchService.getAll(this.patient).subscribe(
        (result: any) => {
          if (result != null && result != undefined) {
            this.patients = result.data;
            // ?.filter((p: any) =>
            //   this.lookupsService.incidentsForOrg.includes(p.incidentSourceId)
            // );
            if (this.patients != undefined && this.patients.length == 0) {
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
              this.hasNextPage = result.data[0].hasNextPage === true;
              this.last = this.patient.pageIndex * this.patient.pageSize;
              if (!skipCount) this.fetchCount(this.patient);
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
  }

  isValidPatient() {
    if (
      this.searchService.validateFirstName(this.patient.firstName, false) &&
      this.searchService.validateSecondName(this.patient.secondName, false) &&
      this.searchService.validateThirdName(this.patient.thirdName, false) &&
      this.searchService.validateFamilyName(this.patient.familyName, false) &&
      this.searchService.validatePhoneNumber1(this.patient.phoneNo1, false) &&
      this.searchService.validatePhoneNumber2(this.patient.phoneNo2, false) &&
      this.searchService.validateNationalID(this.patient.nationalId, false) &&
      this.searchService.validateAddress(this.patient.livingAddress, false)
    ) {
      return true;
    }
    return false;
  }

  previousPage() {
    if (this.patient.pageIndex > 0) {
      this.patient.pageIndex--;
      this.first = this.patient.pageIndex * this.patient.pageSize;
      this.search(false, true);
    }
  }

  nextPage() {
    if (this.hasNextPage) {
      this.patient.pageIndex++;
      this.first = this.patient.pageIndex * this.patient.pageSize;
      this.search(false, true);
    }
  }

  onPageSizeChange(newSize: number) {
    this.patient.pageSize = newSize;
    this.patient.pageIndex = 0;
    this.first = 0;
    this.search(false);
  }
  private fetchCount(filter: any) {
    const skip = ['pageSize', 'pageIndex', 'sortColumn', 'sortOrder', 'searchText', 'filterType'];
    const hasFilter = Object.keys(filter).some(k => !skip.includes(k) && filter[k] != null && filter[k] !== '' && filter[k] !== false);
    if (!hasFilter) {
      this.totalCount = null;
      return;
    }
    this.countLoading = true;
    this.totalCount = null;
    this.searchService.getPageCount({ ...filter }).subscribe(
      (res: any) => {
        this.countLoading = false;
        if (res?.data?.length > 0) {
          this.totalCount = res.data[0].totalCount;
        }
      },
      () => { this.countLoading = false; }
    );
  }

  GetById(id: number) {
    this.data.patientId = id;
    this.router.navigateByUrl('/home/general-data');
  }
  nameToDelete(ele) {
    this.underDeleting.id = ele.id;
    this.underDeleting.fullName = ele.fullName;
  }
  delete(id) {
    this.searchService.delete(id).subscribe(
      (result: any) => {
        if (result != null && result != undefined) {
          this.loadingPanel = false;
          this.translateService
            .get('NEDSS.COMMON.DELETED_SUCESSFULLY')
            .subscribe((res: string) => {
              this.userMsg.success(res);
              this.search();
            });
        }
      },
      (error) => {
        this.loadingPanel = false;
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
    this.exportService.exportTemplateAsPdfLogoTitle(
      document.getElementById(this.currentConfig),
      'البحث المتقدم'
    );
  }

  // exportPatientsAsPdf() {

  //   let selectedGov = this.governments?.filter(g => g?.id == this.selectedGovernmentId)
  //   // let selectedGov = this.governments.find(g => g.id == this.selectedGovernmentId) || {};

  //   let tempSelectedAdm = [this.selectedAdministrationId];
  //   let selectedAdm = this.healthAdministration?.filter(g => tempSelectedAdm.includes(g.id))
  //   selectedAdm = selectedAdm?.map(g => g.arabicName)

  //   let tempSelectedIncs = this.incidentSources?.map(g => g.id);
  //   let selectedIncs = this.incidentSources?.filter(g => tempSelectedIncs.includes(g.id))
  //   selectedIncs = selectedIncs?.map(g => g.arabicName)

  //   let tempSelectedDeps = this.selectedDepartment?.map(g => g.id);
  //   let selectedDep = this.departments?.filter(g => tempSelectedDeps.includes(g.id))
  //   selectedDep = selectedDep?.map(g => g.arabicName)

  //   let sDate, eDate

  //   try {
  //     sDate = (((new Date(this.startDate))?.toISOString())?.split('T'))[0]
  //     eDate = (((new Date(this.endDate))?.toISOString())?.split('T'))[0]
  //   } catch (error) {
  //     sDate = ''; eDate = '';
  //   }
  //   this.exportService.exportTemplateAsPdf(document.getElementById(this.currentConfig),
  //    'عدد الحالات حسب مصادر الابلاغ',
  //    [
  //     selectedGov,
  //     selectedAdm,
  //     //selectedIncs,
  //     //selectedDep
  // ], [sDate, eDate]);
  // }
}
