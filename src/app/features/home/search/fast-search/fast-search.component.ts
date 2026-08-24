import {
  Component,
  ElementRef,
  HostListener,
  OnInit,
  Renderer2,
  ViewChild,
} from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import {
  Relations,
  SingleDropdownSettings,
  SortOptions,
  SortOrder,
} from 'src/app/core/constants';
import { LookupsGetterService } from 'src/app/core/services/lookups-getter.service';
import { UserMessageService } from 'src/app/core/services/user.message.service';
import {
  animate,
  state,
  style,
  transition,
  trigger,
} from '@angular/animations';
import { Patient } from '../models/patient';
import { Router } from '@angular/router';
import { GeneralDataService } from '../../general-data/services/general-data.service';
import { SharedDataService } from '../../general-data/services/shared-data.service';
// import { ExportService } from '../../../../core/services/export.service';
import { ExportService } from 'src/app/core/services/export.service';
import { ExportAsConfig } from 'ngx-export-as';
// import * as jsPDF from 'jspdf';
import { jsPDF } from 'jspdf';
import { ActiveUserService } from 'src/app/core/services/active-user.service';
import { SortEvent } from 'primeng/api';
import { NationalityEnum } from '../../general-data/models/nationality-enum';

@Component({
  selector: 'app-fast-search',
  templateUrl: './fast-search.component.html',
  styleUrls: ['./fast-search.component.css'],
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
export class FastSearchComponent implements OnInit {
  @ViewChild('myTableElementId', { static: false }) tableElement: ElementRef;

  load: boolean = false;

  screenName: string;
  minDate = new Date(1900, 0, 1);
  maxDate = new Date();
  singleDropdownSettings = SingleDropdownSettings;
  selectedIncidentDepartmentId: number = -1;
  AdministrationId: any;
  selectedAdministrationId: number;
  selectedNationalityId: number = -1;
  selectedRelationId: number = 0;
  SelectedbranchId: number = 0;
  governments: any;
  loadingPanel: boolean = false;
  fullName: string;
  levelId: any;
  organizationId: any;
  defaultGovernmentId = null;
  defaultHealthAdministrationId = null;
  defaultIncidentSourceId = null;
  defaultBranchId = null;
  generalReportForm: FormGroup;
  filter: any;
  relations = Relations;
  healthAdministration: any[];
  incidentSources: any[];
  branches: any[];
  departments: any;
  patients: Patient[];
  relational: any = null;
  nationalty: any = 1;
  nationalities: any;
  deleteString: string;
  patient: Patient = {};
  incidentSourcesselected: any;
  selectedIncidentSourcesId: number;

  columnsToDisplay = [];
  dataToShow = [];
  expandedElement: Patient | null;
  selectedDiseaseId: number = -1;
  selectedFinalDiseaseId: number = -1;
  selectedCaseResultCategoryId: number = -1;
  noData: boolean = true;
  loadError: boolean = false;
  first: number = 0;
  last: number = 0;
  pages: number = 0;
  hasNextPage: boolean = false;
  totalCount: number | null = null;
  countLoading: boolean = false;
  underDeleting: Patient = {};
  selectedGovId: any;
  selectedGovernmentId: number = -1;
  currentLang: string = 'ar';
  dir: string;
  delay: boolean = false;
  timer: any;
  // time: any;
  // co : string = 'red !important'
  selectedDepartment: any[] = [];
  startDate: any;
  endDate: any;
  currentConfig: string = 'myTableElementId';
  exportAsPdfConfig: ExportAsConfig = {
    type: 'pdf', // the type you want to download
    elementIdOrContent: this.currentConfig, // the id of html/table element
  };
  // selectedHealthAdministration: number;
  // isLoading: boolean = true;

  diseases: any;
  finalDiseases: any;
  caseResultCategories: any;
  areas: any[];
  SelectedareaId: number;
  defaultAreaId: number;
  NationalityEnum = NationalityEnum;
  constructor(
    private searchService: GeneralDataService,
    private translateService: TranslateService,
    private lookupsService: LookupsGetterService,
    private userMsg: UserMessageService,
    private data: SharedDataService,
    private router: Router,
    public generalDataService: GeneralDataService,
    public exportService: ExportService,
    private elementRef: ElementRef,
    private renderer: Renderer2,
    public activeUSerService: ActiveUserService,
    private lookupsGetterService: LookupsGetterService
  ) {
    this.translateService.setDefaultLang(this.currentLang);
  }

  ngOnInit() {
    this.currentLang =
      localStorage.getItem('ls.currentLang') !== undefined &&
      localStorage.getItem('ls.currentLang') !== 'undefined'
        ? localStorage.getItem('ls.currentLang')
        : 'ar';
    this.dir = this.currentLang == 'ar' ? 'rtl' : 'ltr';
    this.generalDataService.firstNameValidationMessage = '';

    this.translateService.setDefaultLang(this.currentLang);
    this.translateService
      .get('NEDSS.SEARCH.SEARCH')
      .subscribe((res: string) => {
        this.screenName = res;
      });

    let diseaseGroupName;
    if (this.currentLang == 'en') {
      this.columnsToDisplay = [
        'Name',
        'Nationality',
        'National Id',
        'Government',
        'Health Administration',
        'Incident Source',
        'Phone No1',
        'Case Discovery Date',
        'Start Disease',
        'Operations',
      ];
      diseaseGroupName = 'diseaseGroupEnglishName';
    } else {
      this.columnsToDisplay = [
        'الاسم',
        'الجنسية',
        'الرقم القومي',
        'محافظة',
        'إدارة',
        'مصدر إبلاغ',
        'رقم التليفون',
        'تاريخ إكتشاف الحالة',
        'التشخيص الابتدائي',
        'الاجراءات',
      ];
      diseaseGroupName = 'diseaseGroupArabicName';
    }

    this.dataToShow = [
      'fullName',
      'nationality',
      'nationalId',
      'incidentGovernmentName',
      'incidentHealthAdministrationName',
      'incidentSourceName',
      'phoneNo1',
      'caseDiscoveryDate',
      diseaseGroupName,
      '',
    ];

    this.generalReportForm = new FormGroup({
      incidentGovernmentId: new FormControl(),
      incidentHealthAdministrationId: new FormControl(),
      incidentSourceId: new FormControl(),
      branchId: new FormControl(),
      incidentDepartmentId: new FormControl(),
      startDate: new FormControl(),
      fullName: new FormControl(''),
      endDate: new FormControl(),
      nationalityId: new FormControl(1),
      nationalId: new FormControl(),
      passportNo: new FormControl(),
      relativeTypeId: new FormControl(null),
      pageIndex: new FormControl(0),
      pageSize: new FormControl(10),
      filterType: new FormControl(1),
      diseaseGroupId: new FormControl(null),
      diseaseId: new FormControl(null),
      areaId: new FormControl(null),
      caseResultCategoryId: new FormControl(null),
    });
    this.disableControls();
    this.filter = {
      incidentGovernmentId: null,
      incidentHealthAdministrationId: null,
      incidentSourceId: null,
      IncidentBranchId: null,
      incidentDepartmentId: null,
      incidentAreaId: null,
      startDate: null,
      fullName: this.fullName,
      endDate: null,
      nationalityId: null,
      nationalId: null,
      passportNo: null,
      relativeTypeId: null,
      pageIndex: 0,
      pageSize: 10,
      filterType: 1,
      diseaseGroupId: null,
      diseaseId: null,
      areaId: null,
      caseResultCategoryId: null,
      sortOrder: SortOrder.desc,
      sortColumn: 'createdDate',
    };

    this.underDeleting.id = 0;
    this.underDeleting.fullName = '';

    this.loadingPanel = true;
    this.getLookups();
    this.lookupsService
      .getPageIncidentSourceHospitals({
        healthAdministrationID: -1,
        reportingOrResidence: -1,
      })
      .subscribe((result: any) => {});
    this.loadingPanel = false;

    this.generalDataService.cardIdValidationMessage = '';
    this.generalDataService.firstNameValidationMessage = '';
    setTimeout(() => {
      this.levelId = JSON.parse(
        localStorage.getItem('ls.authorizationData')
      )?.user?.levelId;

      this.organizationId = JSON.parse(
        localStorage.getItem('ls.authorizationData')
      )?.user?.organizationId;

      this.defaultGovernmentId = JSON.parse(
        localStorage.getItem('ls.authorizationData')
      ).user?.govenmentId;

      this.defaultHealthAdministrationId = JSON.parse(
        localStorage.getItem('ls.authorizationData')
      ).user?.healthAdministrationId;

      this.defaultBranchId = JSON.parse(
        localStorage.getItem('ls.authorizationData')
      ).user?.branchId;

      if (
        this.activeUSerService.getAccessibleParts?.showBranches ||
        this.activeUSerService.getAccessibleParts?.showUniversities
      ) {
        this.getBranches();
      }
      this.SelectedbranchId = JSON.parse(
        localStorage.getItem('ls.authorizationData')
      ).user?.branchId;

      this.defaultAreaId = this.SelectedareaId = JSON.parse(
        localStorage.getItem('ls.authorizationData')
      ).user?.areaId;

      this.selectedIncidentSourcesId = this.defaultIncidentSourceId =
        JSON.parse(
          localStorage.getItem('ls.authorizationData')
        ).user?.incidentSourceId;
    }, 500);
  }

  disableControls() {
    if (!this.activeUSerService.getAccessibleParts?.enableGovernments)
      this.generalReportForm.controls?.incidentGovernmentId?.disable();

    if (!this.activeUSerService.getAccessibleParts?.enableDepartments)
      this.generalReportForm.controls?.incidentHealthAdministrationId?.disable();

    if (
      !this.activeUSerService.getAccessibleParts?.enableUniversities &&
      this.activeUSerService.getAccessibleParts?.showUniversities
    )
      this.generalReportForm.controls?.branchId?.disable();

    if (
      !this.activeUSerService.getAccessibleParts?.enableBranches &&
      this.activeUSerService.getAccessibleParts?.showBranches
    )
      this.generalReportForm.controls?.branchId?.disable();

    if (!this.activeUSerService.getAccessibleParts?.enableAreas)
      this.generalReportForm.controls?.areaId?.disable();

    if (!this.activeUSerService.getAccessibleParts?.enableSources)
      this.generalReportForm.controls?.incidentSourceId?.disable();
  }

  setNationalityValue() {
    this.generalReportForm.value.nationalityId = this.selectedNationalityId;
    this.filter.nationalityId =
      this.selectedNationalityId == -1 ? null : this.selectedNationalityId;
  }
  setNationalityDValue() {
    this.generalReportForm.value.nationalityId = null;
    this.filter.nationalityId = null;
  }
  SetRelative() {
    this.generalReportForm.value.relativeTypeId = this.selectedRelationId;
    this.filter.relativeTypeId =
      this.selectedRelationId == 0 ? null : this.selectedRelationId;
  }
  SetDRelative() {
    this.generalReportForm.value.relativeTypeId = null;
    this.filter.relativeTypeId = null;
  }
  setValue() {
    this.nationalty = (
      document.getElementById('nationalty') as HTMLInputElement
    ).value;
    this.relational = (
      document.getElementById('relational') as HTMLInputElement
    ).value;
  }

  getLookups() {
    this.getGovernments();
    this.getDepartments();
    this.getAllDiseases();
    this.getFinalDiseases();
    this.getNationalties();
    this.getCaseResultCategories();
  }
  getGovernments() {
    this.lookupsService.getAllGovernments().subscribe(
      (result: any) => {
        if (result != null && result != undefined) {
          // this.governments = [
          //   { id: -1, arabicName: 'إختر', englishName: 'Select' },
          // ];
          // result.data.forEach((he) => {
          //   this.governments.push(he);
          // });
          this.governments = result.data;
          this.governments.unshift({
            id: -1,
            arabicName: 'إختر',
            englishName: 'Select',
          });
          if (result.data.length > 0) {
            this.selectedGovernmentId = JSON.parse(
              localStorage.getItem('ls.authorizationData')
            ).user.govenmentId;
            if (this.selectedGovernmentId != null) {
              this.governmentSelected();
            } else {
              this.selectedGovernmentId = -1;
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
    this.selectedAdministrationId = -1;
    this.incidentSources = [];
    this.generalReportForm.value.incidentGovernmentId =
      this.selectedGovernmentId;
    this.filter.incidentGovernmentId =
      this.selectedGovernmentId == -1 ? null : this.selectedGovernmentId;
    if (
      this.generalReportForm.value.incidentGovernmentId != null &&
      this.generalReportForm.value.incidentGovernmentId != -1
    )
      this.getHealthAdministration(
        this.generalReportForm.value.incidentGovernmentId
      );

      if(this.organizationId == 4 || this.organizationId == 5) {
        this.getIncidentSourceHospital({
          organizationId:this.organizationId,
          governmentsIds:[this.selectedGovernmentId],
          forSystemUser:true
        })
      }
    //this.getAreas()
  }
  governmentDSelected() {
    this.generalReportForm.value.incidentGovernmentId = null;
    this.filter.incidentGovernmentId = null;
    this.healthAdministration = null;
    this.selectedAdministrationId = -1;
    this.generalReportForm.value.incidentHealthAdministrationId = null;
    this.filter.incidentHealthAdministrationId = null;
    this.incidentSourcesselected = null;
    this.selectedIncidentSourcesId = -1;
    this.incidentSources = null;
  }

  getHealthAdministration(governmentID: any) {
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
            if (result.data.length > 0) {
              this.selectedAdministrationId = JSON.parse(
                localStorage.getItem('ls.authorizationData')
              )?.user?.healthAdministrationId;
              if (this.selectedAdministrationId != null) {
                this.healthAdministrationSelected();
              } else {
                this.selectedAdministrationId = -1;
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
  healthAdministrationSelected() {
    this.generalReportForm.value.incidentHealthAdministrationId =
      this.selectedAdministrationId;
    this.filter.incidentHealthAdministrationId =
      this.selectedAdministrationId == -1
        ? null
        : this.selectedAdministrationId;
    if (
      this.generalReportForm.value.incidentHealthAdministrationId != null &&
      this.generalReportForm.value.incidentHealthAdministrationId != -1
    ) {
      this.getIncidentSources(
        this.generalReportForm.value.incidentHealthAdministrationId
      );
    }
  }
  healthAdministrationDSelected() {
    this.generalReportForm.value.incidentHealthAdministrationId = null;
    this.filter.incidentHealthAdministrationId = null;
    this.incidentSourcesselected = null;
    this.selectedIncidentSourcesId = -1;
    this.incidentSources = null;
  }
  getIncidentSources(healthAdministrationID: any) {
    this.lookupsService
      .getPageIncidentSourceHospitals({
        healthAdministrationID: this.selectedAdministrationId,
        branchId: this.activeUSerService.getAccessibleParts?.showAreas
          ? null
          : this.SelectedbranchId,
        areaId: this.SelectedareaId,
      })
      .subscribe(
        (result: any) => {
          if (result != null && result != undefined) {
            this.incidentSources = [
              { id: -1, arabicName: 'إختر', englishName: 'Select' },
            ];
            result.data.forEach((nat) => {
              this.incidentSources.push(nat);
            });
            // this.lookupsService.getPageIncidentSourceHospitals({ healthAdministrationID: healthAdministrationID, reportingOrResidence: 1 }).subscribe((result: any) => {
            //   if (result != null && result != undefined) {
            //     this.incidentSources = [{ id: -1, arabicName: 'إختر', englishName: 'Select' }];
            //     result.data.forEach(nat => {
            //       this.incidentSources.push(nat);
            //     });
            setTimeout(() => {
              if (result.data.length > 0) {
                this.selectedIncidentSourcesId = JSON.parse(
                  localStorage.getItem('ls.authorizationData')
                )?.user?.incidentSourceId;
                if (this.selectedIncidentSourcesId != null) {
                  this.incidentSourcesSelected();
                } else {
                  this.selectedIncidentSourcesId = -1;
                }
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
  incidentSourcesSelected() {
    this.generalReportForm.value.incidentSourceId =
      this.selectedIncidentSourcesId != -1
        ? this.selectedIncidentSourcesId
        : null;
    this.filter.incidentSourceId =
      this.selectedIncidentSourcesId == -1
        ? null
        : this.selectedIncidentSourcesId;
  }
  incidentSourcesDeSelected() {
    this.generalReportForm.value.incidentSourceId = null;
    this.filter.incidentSourceId = null;
  }
  incidentDepartmentSelected() {
    this.generalReportForm.value.incidentDepartmentId =
      this.selectedIncidentDepartmentId;
    this.filter.incidentDepartmentId =
      this.selectedIncidentDepartmentId == -1
        ? null
        : this.selectedIncidentDepartmentId;
  }
  incidentDepartmentDSelected() {
    this.generalReportForm.value.incidentDepartmentId = null;
    this.filter.incidentDepartmentId = null;
  }

  getBranches() {
    this.lookupsService.getAllBranches(this.organizationId).subscribe(
      (result: any) => {
        if (result != null && result != undefined) {
          this.branches = result.data;
          this.branches.unshift({
            id: null,
            arabicName: 'إختر',
            englishName: 'Select',
          });
          if (this.defaultBranchId > 0) {
            this.SelectedbranchId = this.branches.find(
              (item) => item.id === this.defaultBranchId
            )?.id;
            this.branchSelected();
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

  branchSelected() {
    // this.governmentDeSelected();
    if (this.SelectedbranchId) {
      this.defaultBranchId = this.SelectedbranchId;
      // this.healthAdministrations = [];
      // this.getHealthAdministrationsForUsers(this.user.branchId);
      this.getAreas();
      this.getIncidentSources(this.SelectedbranchId);
    }
  }

  getDepartments() {
    this.lookupsService.getAllDepartments().subscribe(
      (result: any) => {
        if (result != null && result != undefined) {
          this.departments = [
            { id: -1, arabicName: 'إختر', englishName: 'Select' },
          ];
          result.data.forEach((nat) => {
            this.departments.push(nat);
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

  getNationalties() {
    this.lookupsService.getAllNationalitys().subscribe(
      (result: any) => {
        if (result != null && result != undefined) {
          this.nationalities = [
            { id: -1, arabicName: 'إختر', englishName: 'select' },
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

  validate() {
    return (
      this.generalDataService.validateFirstName(
        this.generalReportForm.value.fullName,
        false
      ) &&
      this.generalDataService.validateNationalID(
        this.generalReportForm.value.nationalId,
        false
      )
    );
  }
  sort(event: SortEvent) {
    if (
      event.order == -1 &&
      (this.filter.sortOrder != SortOrder.desc ||
        this.filter.sortColumn != event.field)
    ) {
      this.filter.sortOrder = SortOrder.desc;
      this.filter.sortColumn = event.field;
      this.search(false, true);
    } else if (
      event.order == 1 &&
      (this.filter.sortOrder != SortOrder.asc ||
        this.filter.sortColumn != event.field)
    ) {
      this.filter.sortOrder = SortOrder.asc;
      this.filter.sortColumn = event.field;
      this.search(false, true);
    }
  }

  search(firstTime?: boolean, skipCount?: boolean) {
    //console.log((this.startDate).toString());
    if (!this.validate()) {
      this.translateService
        .get('NEDSS.COMMON.FILL_INVALID')
        .subscribe((res: string) => {
          this.userMsg.warn(res);
        });

      return;
    }

    this.loadingPanel = true;
    this.filter.fullName = this.generalReportForm.value.fullName;
    this.filter.startDate = this.generalReportForm.value.startDate;
    this.filter.endDate = this.generalReportForm.value.endDate;
    this.filter.nationalId = this.generalReportForm.value.nationalId;
    this.levelId = JSON.parse(
      localStorage.getItem('ls.authorizationData')
    )?.user?.levelId;

    if (this.selectedGovernmentId == -1) {
      this.selectedGovernmentId = null;
    }
    let governmentId = this.selectedGovernmentId;

    if (this.selectedIncidentSourcesId == -1) {
      this.selectedIncidentSourcesId = null;
    }
    let incidentSourceId = this.selectedIncidentSourcesId;

    if (this.selectedAdministrationId == -1) {
      this.selectedAdministrationId = null;
    }
    let healthAdministrationId = this.selectedAdministrationId;

    if (this.SelectedbranchId == null) {
      this.SelectedbranchId = null;
    }
    let IncidentBranchId = this.SelectedbranchId;

    this.filter.incidentGovernmentId = governmentId;
    this.filter.incidentSourceId = incidentSourceId;
    this.filter.incidentHealthAdministrationId = healthAdministrationId;
    this.filter.IncidentBranchId = IncidentBranchId;

    var dts = this.filter;
    if (firstTime != null && firstTime != undefined && firstTime != false) {
      dts = {
        incidentGovernmentId: null,
        incidentHealthAdministrationId: null,
        incidentSourceId: null,
        IncidentBranchId: null,
        incidentDepartmentId: null,
        incidentAreaId: null,
        startDate: null,
        fullName: '',
        endDate: null,
        nationalityId: 1,
        nationalId: null,
        passportNo: null,
        relativeTypeId: null,
        firstTime: true,
        HomeGovernmentId: governmentId,
        HomeHealthAdministrationId: healthAdministrationId,
        HomeHealthOfficeId: incidentSourceId,
        pageIndex: 0,
        pageSize: 10,
        filterType: 1,
        sortOrder: this.filter.sortOrder,
        sortColumn: this.filter.sortColumn,
      };
    }

    dts.incidentAreaId = this.SelectedareaId;

    this.Delay();
    this.loadError = false;
    this.searchService.getAll(dts).subscribe(
      (result: any) => {
        this.loadError = false;
        if (result != null && result != undefined) {
          this.patients = result?.data ?? [];
          // ?.filter((p: any) =>
          //   this.lookupsService.incidentsForOrg.includes(p.incidentSourceId)
          // );
          if (this.patients != undefined && this.patients.length == 0) {
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
            this.hasNextPage = this.getHasNextPage(result.data[0]);
            this.last = this.patient.pageIndex * this.patient.pageSize;
            if (!skipCount) this.fetchCount(dts);
          }
        }
        this.delay = false;
        this.loadingPanel = false;
      },
      (error) => {
        this.loadingPanel = false;
        this.delay = false;
        this.RemoveDelay();
        this.loadError = true;
        this.noData = false;
        this.patients = [];
        this.pages = 0;
        this.hasNextPage = false;
        this.totalCount = null;
        this.translateService
          .get('NEDSS.COMMON.COULD_NOT_LOAD_RESULTS')
          .subscribe((res: string) => {
            this.userMsg.error(res);
          });
      }
    );
  }

  previousPage() {
    if (this.filter.pageIndex > 0) {
      this.filter.pageIndex--;
      this.patient.pageIndex = this.filter.pageIndex;
      this.first = this.filter.pageIndex * this.filter.pageSize;
      this.search(false, true);
    }
  }

  nextPage() {
    if (this.hasNextPage) {
      this.filter.pageIndex++;
      this.patient.pageIndex = this.filter.pageIndex;
      this.first = this.filter.pageIndex * this.filter.pageSize;
      this.search(false, true);
    }
  }

  onPageSizeChange(newSize: number) {
    this.filter.pageSize = newSize;
    this.patient.pageSize = newSize;
    this.filter.pageIndex = 0;
    this.patient.pageIndex = 0;
    this.first = 0;
    this.search(false);
  }

  private getHasNextPage(firstRow: Patient): boolean {
    return firstRow?.['hasNextPage'] === true;
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
    // window.open('/home/general-data', '_blank');
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
              this.search(false);
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
    let selectedGov = this.governments.filter(
      (g) => g.id == this.selectedGovernmentId
    );

    let tempSelectedAdm = [this.selectedAdministrationId];
    let selectedAdm = this.healthAdministration?.filter((g) =>
      tempSelectedAdm.includes(g.id)
    );
    selectedAdm = selectedAdm?.map((g) => g.arabicName);

    let tempSelectedIncs = this.incidentSources?.map((g) => g.id);
    let selectedIncs = this.incidentSources?.filter((g) =>
      tempSelectedIncs?.includes(g.id)
    );
    let s = selectedIncs?.filter((g) => g.id == this.selectedIncidentSourcesId);
    let as = s?.map((g) => g.arabicName);

    let tempSelectedDeps = this.selectedDepartment?.map((g) => g.id);
    let selectedDep = this.departments?.filter((g) =>
      tempSelectedDeps?.includes(g.id)
    );
    selectedDep = selectedDep?.map((g) => g.arabicName);

    let sDate, eDate;

    try {
      sDate =
        this.filter.startDate &&
        new Date(this.filter.startDate).toLocaleDateString('en-GB');
      eDate =
        this.filter.endDate &&
        new Date(this.filter.endDate).toLocaleDateString('en-GB');
    } catch (error) {
      sDate = '';
      eDate = '';
    }

    // console.log(this.pages = result.data[0].totalCount);
    // this.pages = 0;
    // let co = this.pages = 0;
    // const pageCount = 1;
    // for (let i = 1; i <= co; i++) {
    //   i++
    //   // console.log(i++);
    // }

    // console.log(co);

    // const pdf = new jsPDF();
    // const totalPages = pdf.getNumberOfPages();

    // for (let i = 1; i <= totalPages; i++) {
    //     pdf.setPage(i);

    //     pdf.text(`Page ${i} of ${totalPages}`, 14, pdf.internal.pageSize.height - 10);

    //     console.log(i);
    //     console.log(totalPages);
    // }

    this.exportService.exportTemplateAsPdf(
      document.getElementById(this.currentConfig),
      'البحث',
      [selectedGov, selectedAdm, as, selectedDep],
      [sDate, eDate]
    );
  }

  isDate(value: any): boolean {
    let datePattern = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}$/;
    return datePattern.test(value);
  }

  getAllDiseases() {
    this.lookupsService.getAllDiseaseGroups().subscribe(
      (result: any) => {
        if (result != null && result != undefined) {
          this.diseases = [
            { id: -1, arabicName: 'إختر', englishName: 'select' },
          ];
          result.data.forEach((nat) => {
            this.diseases.push(nat);
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

  getFinalDiseases() {
    this.lookupsService.getAllDiseases().subscribe(
      (result: any) => {
        if (result != null && result != undefined) {
          this.finalDiseases = [
            { id: -1, arabicName: 'إختر', englishName: 'select' },
          ];
          result.data.forEach((nat) => {
            this.finalDiseases.push(nat);
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

  setDiseaseValue() {
    this.generalReportForm.value.diseaseGroupId =
      this.selectedDiseaseId == -1 ? null : this.selectedDiseaseId;
    this.filter.diseaseGroupId =
      this.selectedDiseaseId == -1 ? null : this.selectedDiseaseId;
  }

  getCaseResultCategories() {
    this.lookupsService.getAllCaseResultCategorys().subscribe(
      (result: any) => {
        if (result != null && result != undefined) {
          this.caseResultCategories = [
            { id: -1, arabicName: 'إختر', englishName: 'select' },
          ];
          result.data.forEach((cat) => {
            this.caseResultCategories.push(cat);
          });
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

  setCaseResultCategoryValue() {
    this.generalReportForm.value.caseResultCategoryId =
      this.selectedCaseResultCategoryId == -1
        ? null
        : this.selectedCaseResultCategoryId;
    this.filter.caseResultCategoryId =
      this.selectedCaseResultCategoryId == -1
        ? null
        : this.selectedCaseResultCategoryId;
  }

  setDiseaseDValue() {
    this.generalReportForm.value.diseaseGroupId = null;
    this.filter.diseaseGroupId = null;
  }
  setFinalDiseaseValue() {
    this.generalReportForm.value.diseaseId =
      this.selectedFinalDiseaseId == -1 ? null : this.selectedFinalDiseaseId;
    this.filter.diseaseId =
      this.selectedFinalDiseaseId == -1 ? null : this.selectedFinalDiseaseId;
  }

  setFinalDiseaseDValue() {
    this.generalReportForm.value.diseaseId = null;
    this.filter.diseaseId = null;
  }
  public key: KeyboardEvent;

  // @HostListener('keydown', ['$event'])

  // onKeyDown(event: KeyboardEvent) {
  //   event.preventDefault(); // Prevent the default keyboard event
  //   // this.key.preventDefault();
  // }

  onPaginatorClick(event: MouseEvent) {
    event.preventDefault(); // Prevent the default behavior
    // this.onKeyDown(this.key);
  }
  // ngAfterViewInit() {
  //   const paginatorElement = this.elementRef.nativeElement.querySelector('p-paginator');
  //   this.renderer.addClass(paginatorElement, 'disable-pointer-events');
  //   this.renderer.listen(paginatorElement, 'click', this.onPaginatorClick.bind(this));
  // }

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

  getAreas() {
    this.lookupsGetterService.getAllAreas(this.SelectedbranchId).subscribe(
      (result: any) => {
        if (result != null && result != undefined) {
          this.areas = result.data;
          this.areas.unshift({
            id: null,
            arabicName: 'إختر',
            englishName: 'Select',
          });
          if (this.defaultAreaId) {
            this.SelectedareaId = this.areas.find(
              (item) => item.id === this.defaultAreaId
            )?.id;
            this.areaSelected();
          }
        }
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
  areaSelected() {
    this.getIncidentSources(this.SelectedareaId);
    // this.governmentDeSelected();
    // if (this.SelectedareaId) {
    //   this.user.areaId = this.SelectedareaId;
    // this.isAreaValid = this.checkAreaValid();
    // this.getIncidentSources(
    //   this.user.healthAdministrationId,
    //   this.user.organizationId
    // );
    // }
  }

    //Start of Incident Source مصدر إبلاغ
    getIncidentSourceHospital(filter: any) {
      this.lookupsService.getIncidentSourceHospitalsByIncidentGovernmentsIds(filter).subscribe({
        next: (response) => {
          this.incidentSources = response.data;
          if((response.data.length > 0)){
            this.incidentSources.unshift({
              "id": -1,
              "arabicName": "إختر",
              "englishName": "Select",
            })
          }
        }, error: (error) => {
          this.loadingPanel = false;
          this.translateService.get('NEDSS.COMMON.INTERNAL_SERVER_ERROR').subscribe((res: string) => {
            this.userMsg.error(res);
          })
        }, complete: () => {
  
        }
      })
    }
  
}
