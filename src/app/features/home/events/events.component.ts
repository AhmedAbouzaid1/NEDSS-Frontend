import { Component, ElementRef, ViewChild } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import {
  Relations,
  SingleDropdownSettings,
  MultipleDropdownSettings,
  SortOrder,
} from 'src/app/core/constants';
import { LookupsGetterService } from 'src/app/core/services/lookups-getter.service';
import { UserMessageService } from 'src/app/core/services/user.message.service';
import { Patient } from '../search/models/patient';
import {
  trigger,
  state,
  style,
  transition,
  animate,
} from '@angular/animations';
import { EventService } from './services/event.service';
import { ExportService } from '../../../core/services/export.service';
import { GeneralDataService } from '../general-data/services/general-data.service';
import { DatePipe } from '@angular/common';
import { ExportAsConfig } from 'ngx-export-as';
import { ActiveUserService } from 'src/app/core/services/active-user.service';
import { EventRadio } from '../chat/Models/event-radio';
import { map } from 'rxjs';
import { SortEvent } from 'primeng/api';

@Component({
  selector: 'app-events',
  templateUrl: './events.component.html',
  styleUrls: ['./events.component.css'],
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
export class EventsComponent {
  maxDate = new Date();
  minDate = new Date(1900, 0, 1);

  maxDateE: any = new Date();
  minDateE: any = new Date(1900, 0, 1);
  startDDate: any;
  levelId: any;
  organizationId: any;
  currentLang: string;
  dir: string;
  delay: boolean = false;
  timer: any;
  AlreadyExist: boolean = false;
  notadded: any[] = [];
  eventPatientsadd: any[] = [];
  // eventStartDate: any;
  selectedAdministrationId: number;
  selectedEventId: number;
  // incidentSources: any[];
  // departments: any;
  selectedDepartment: any[] = [];
  startDat: any;
  endDate: any;
  currentConfig: string = 'myTableElementId';
  exportAsPdfConfig: ExportAsConfig = {
    type: 'pdf', // the type you want to download
    elementIdOrContent: this.currentConfig, // the id of html/table element
  };

  noData: boolean = true;
  noDatap: boolean = true;
  noDatae: boolean = true;
  loadError: boolean = false;
  first: number = 0;
  last: number = 0;
  pages: number = 0;
  hasNextPage: boolean = false;
  totalCount: number | null = null;
  countLoading: boolean = false;
  FilterType: number = 2;
  Selectedgovernment: any;
  addSelectedgovernment: any;
  addSelectedhealthAdministration: any;
  singleDropdownSettings = SingleDropdownSettings;
  multipleDropdownSettings = MultipleDropdownSettings;
  @ViewChild('myTableElementId', { static: false }) tableElement: ElementRef;
  screenName: string;
  events;
  event: boolean = false;
  periods = [
    {
      name: 1,
      id: 1,
    },
    {
      name: 2,
      id: 2,
    },
  ];
  columnsToDisplay = [
    ' ',
    'الاسم الاول ',
    'اسم العائلة',
    'التشخيص',
    'الرقم القومي',
    'رقم التليفون',
    'الاجراءات',
  ];
  dataToShow = [
    '',
    'firstName',
    'familyName',
    'finalResult',
    'nationalId',
    'phoneNo1',
    '',
  ];
  expandedElement: Patient | null;
  governments: any;
  multiGovernments: any;
  selectedGovernment: number = -1;
  homeHealthOffice: any;
  addhomeHealthOffice: any;
  cities: any;
  isFormValid: boolean = true;
  diseases: any;
  caseResultCategory: any;
  DiseasiesCat: any;
  loadingPanel: boolean = false;
  generalReportForm: FormGroup;
  relations = Relations;
  healthAdministration: any;
  addhealthAdministrationId: any;
  incidentSources: any;
  departments: any;
  dataSource: any[] = [];
  relational: any = null;
  nationalty: any = 1;
  nationalities: any;
  Categories: any;
  selectedCategoryId: number;
  Diseasies: any;
  DiseasiesCategoris: any;
  selectedDiseaseCategoryId: number;
  healthOfficcies: any;
  AddEventForm: FormGroup;
  patientToEventForm: FormGroup;
  ViewEventPatientForm: FormGroup;
  EventShow: any;
  eventPatients: any;
  updatingEvent: boolean = false;
  viewEventPatient: boolean = false;
  curruntId: any;
  addGovernments: any;
  addHealthAdministration: any;
  addSelectedBranch: any;
  addSelectedArea: any;
  addSelectedIncidentSource: any;
  addCities: any;
  addHealthOfficcies: any;
  underDeleting = {
    pname: '',
    name: '',
    id: null,
  };
  eventRadio = EventRadio;
  selectedhealthAdministration: number;
  healthCitySelected: number;
  generalReportFormfilter: any;
  AddEventFormfilter: any;
  SelectedhealthOfficcieId: number;
  startDate: any;
  eventName: string;
  eventCode: string;
  selectedDiseaseGroupId: number;
  eventCodePatient: string = null;
  addtoEventValid: boolean;
  radioGovernment: 1;
  radiohealthAdministration: 2;
  radioIncidentSource: 3;
  radioEventCheck: string = null;
  eventCheckResult: any;
  checkHealthAdministration: any;
  checkIncidentSource: any;
  checkBranches: any[];
  checkAreas: any[];
  eventGovernment: any = [];
  eventHealthAdministration: any = [];
  eventBranch: any = [];
  eventArea: any = [];
  eventIncidentSource: any = [];
  searchText: string;
  primaryDiseases: any[];
  constructor(
    private lookupsService: LookupsGetterService,
    private translateService: TranslateService,
    private userMsg: UserMessageService,
    public generalDataService: GeneralDataService,
    public datepipe: DatePipe,
    private eventService: EventService,
    private exportService: ExportService,
    public activeUSerService: ActiveUserService,
    private lookupsGetterService: LookupsGetterService
  ) {}

  ngOnInit() {
    this.maxDateE = this.datepipe
      .transform(this.maxDateE, 'yyyy-MM-dd')
      .toString();
    this.minDateE = this.datepipe
      .transform(this.minDateE, 'yyyy-MM-dd')
      .toString();
    this.generalDataService.firstNameValidationMessage = '';
    this.generalDataService.secondNameValidationMessage = '';
    this.currentLang =
      localStorage.getItem('ls.currentLang') !== undefined &&
      localStorage.getItem('ls.currentLang') !== 'undefined'
        ? localStorage.getItem('ls.currentLang')
        : 'ar';

    this.dir = this.currentLang == 'ar' ? 'rtl' : 'ltr';

    this.levelId = JSON.parse(
      localStorage.getItem('ls.authorizationData')
    )?.user?.levelId;
    this.organizationId = JSON.parse(
      localStorage.getItem('ls.authorizationData')
    )?.user?.organizationId;
    // this.addSelectedgovernment = JSON.parse(
    //   localStorage.getItem('ls.authorizationData')
    // ).user.govenmentId;

    // this.addhealthAdministrationId = JSON.parse(
    //   localStorage.getItem('ls.authorizationData')
    // ).user.healthAdministrationId;

    let incidentInfoLink = document.getElementById(
      'incidentInfo'
    ) as HTMLElement;
    incidentInfoLink.classList.remove('active');
    this.generalReportForm = new FormGroup({
      homeGovernmentId: new FormControl(),
      homeHealthAdministrationId: new FormControl(),
      homeHealthOfficeId: new FormControl(),
      homeCityId: new FormControl(),
      patientDiseases: new FormControl([]),
      caseResultCategoryId: new FormControl(),
      diseaseSeverityId: new FormControl(),
      startDate: new FormControl(),
      endDate: new FormControl(),
      pageSize: new FormControl(10),
      pageIndex: new FormControl(0),
      sortColumn: new FormControl('FullName'),
      sortOrder: new FormControl(SortOrder.asc),
      searchText: new FormControl(''),
      FilterType: new FormControl(2),
      IsEventEnded: new FormControl(''),
    });
    this.generalReportFormfilter = {
      homeGovernmentId: null,
      homeHealthAdministrationId: null,
      homeHealthOfficeId: null,
      homeCityId: null,
      patientDiseases: null,
      caseResultCategoryId: null,
      diseaseSeverityId: null,
      startDate: null,
      endDate: null,
      pageSize: null,
      pageIndex: null,
      sortColumn: 'FullName',
      sortOrder: SortOrder.asc,
      searchText: null,
      FilterType: 2,
      isEventEnded: null,
    };
    this.AddEventForm = new FormGroup({
      governmentId: new FormControl(null, [Validators.required]),
      healthAdministrationId: new FormControl(null, [Validators.required]),
      description: new FormControl(null, [Validators.required]),
      name: new FormControl(null, [Validators.required]),
      code: new FormControl(null, [Validators.required]),
      eventDiscoveryDate: new FormControl(null, [Validators.required]),
      eventDiscoveryTime: new FormControl(null, [Validators.required]),
      eventStartDate: new FormControl(null, [Validators.required]),
      eventEndDate: new FormControl(null),
      healthOfficeId: new FormControl(null, [Validators.required]),
      branchId: new FormControl(null, [Validators.required]),
      UniversityId: new FormControl(null, [Validators.required]),
      AreaId: new FormControl(null, [Validators.required]),
      address: new FormControl(null),
      CheckEvent: new FormControl(),
      diseaseGroupId: new FormControl(null, [Validators.required]),
      // FilterType: new FormControl(),
    });

    this.ViewEventPatientForm = new FormGroup({
      governmentName: new FormControl(null, [Validators.required]),
    });

    this.AddEventFormfilter = {
      governmentId: null,
      healthAdministrationId: null,
      description: null,
      name: null,
      code: null,
      eventDiscoveryDate: null,
      eventDiscoveryTime: null,
      eventStartDate: null,
      eventEndDate: null,
      healthOfficeId: null,
      address: null,
    };

    this.patientToEventForm = new FormGroup({
      eventId: new FormControl(null, [Validators.required]),
      patientId: new FormControl(null, [Validators.required]),
    });

    this.loadingPanel = true;
    this.addSelectedgovernment = JSON.parse(
      localStorage.getItem('ls.authorizationData')
    ).user.govenmentId;
    this.getLookups();
    this.loadingPanel = false;
    this.disableControls();
    this.translateService
      .get('NEDSS.EVENTS.EVENTS')
      .subscribe((res) => (this.screenName = res));

    this.getPrimaryDiagnosis();
  }

  disableControls() {
    if (!this.activeUSerService.getAccessibleParts?.enableGovernments)
      this.AddEventForm.controls?.governmentId?.disable();

    if (!this.activeUSerService.getAccessibleParts?.enableDepartments)
      this.AddEventForm.controls?.healthAdministrationId?.disable();

    if (!this.activeUSerService.getAccessibleParts?.enableSources)
      this.AddEventForm.controls?.healthOfficeId?.disable();
  }

  showSelectedValues() {
    this.addSelectedgovernment = [
      JSON.parse(localStorage.getItem('ls.authorizationData')).user.govenmentId,
    ];
  }

  previousPage() {
    if (this.generalReportFormfilter.pageIndex > 0) {
      this.generalReportFormfilter.pageIndex--;
      this.generalReportForm.value.pageIndex = this.generalReportFormfilter.pageIndex;
      this.first = this.generalReportFormfilter.pageIndex * this.generalReportFormfilter.pageSize;
      this.search(true);
    }
  }

  nextPage() {
    if (this.hasNextPage) {
      this.generalReportFormfilter.pageIndex++;
      this.generalReportForm.value.pageIndex = this.generalReportFormfilter.pageIndex;
      this.first = this.generalReportFormfilter.pageIndex * this.generalReportFormfilter.pageSize;
      this.search(true);
    }
  }

  onPageSizeChange(newSize: number) {
    this.generalReportFormfilter.pageSize = newSize;
    this.generalReportForm.value.pageSize = newSize;
    this.generalReportFormfilter.pageIndex = 0;
    this.generalReportForm.value.pageIndex = 0;
    this.first = 0;
    this.search();
  }

  findPatient(formObj?: any, skipCount?: boolean) {
    if (formObj) {
      if (this.generalReportFormfilter.homeGovernmentId == -1) {
        this.generalReportFormfilter.homeGovernmentId = null;
      }
      formObj = this.generalReportForm.value;
    } else {
      formObj = {
        pageSize: 10,
        pageIndex: 0,
        searchText: this.searchText,
      };
    }
    formObj.searchText = this.searchText;
    // this.AddEventFormfilter.eventStartDate = this.AddEventForm.value.eventStartDate;
    //  this.AddEventFormfilter.eventEndDate = this.AddEventForm.value.eventEndDate;
    this.generalReportFormfilter.startDate =
      this.generalReportForm.value.startDate;
    this.generalReportFormfilter.endDate = this.generalReportForm.value.endDate;
    this.generalReportFormfilter.homeGovernmentId =
      this.generalReportForm.value.homeGovernmentId;
    if (this.generalReportFormfilter.homeGovernmentId == -1) {
      this.generalReportFormfilter.homeGovernmentId = null;
    }
    if (this.generalReportFormfilter.caseResultCategoryId == -1) {
      this.generalReportFormfilter.caseResultCategoryId = null;
    }
    this.delay = true;
    this.timer = setTimeout(() => {
      if (this.delay) {
        this.translateService
          .get('NOUR.WaitPlease')
          .subscribe((msg) => this.userMsg.info(msg));
      }
    }, 500);
    this.generalReportForm.value.FilterType = 2;
    this.loadError = false;
    this.generalDataService.getAll(formObj).subscribe(
      (res: any) => {
      if (res != null) {
        this.loadError = false;
        this.dataSource = res?.data ?? [];
        // ?.filter((p: any) =>
        //   this.lookupsService.incidentsForOrg.includes(p.incidentSourceId)
        // );

        if (this.dataSource != undefined && this.dataSource.length == 0) {
          setTimeout(() => {
            this.delay = false;
            clearTimeout(this.timer);
          }, 0);

          this.noData = true;
          this.noDatap = true;
          this.pages = 0;
          this.event = true;
          this.findEvent(this.generalReportForm.value);
          if (this.noDatap == true && this.noDatae == false) {
            this.translateService
              .get('NOUR.NO_RESULTS')
              .subscribe((msg) => this.userMsg.warn(msg));
          }
        } else {
          setTimeout(() => {
            this.delay = false;
            clearTimeout(this.timer);
          }, 0);

          this.noData = false;
          this.noDatap = false;
          this.event = false;
          this.hasNextPage =
            res.data[0].hasNextPage === true &&
            res.data.length >= this.generalReportFormfilter.pageSize;

          this.last =
            this.generalReportForm.value.pageIndex *
            this.generalReportForm.value.pageSize;
          if (!skipCount) this.fetchCount(formObj);
        }
      }
      },
      (error) => {
        this.delay = false;
        clearTimeout(this.timer);
        this.loadError = true;
        this.noData = true;
        this.noDatap = false;
        this.dataSource = [];
        this.pages = 0;
        this.totalCount = null;
        this.hasNextPage = false;
        this.translateService
          .get('NEDSS.COMMON.COULD_NOT_LOAD_RESULTS')
          .subscribe((msg: string) => this.userMsg.error(msg));
      }
    );
    this.columnsToDisplay = [
      ' ',
      'الاسم الاول ',
      'اسم العائلة',
      'التشخيص',
      'الرقم القومي',
      'رقم التليفون',
      'الاجراءات',
    ];
    this.dataToShow = [
      '',
      'firstName',
      'familyName',
      'finalResult',
      'nationalId',
      'phoneNo1',
      '',
    ];
  }

  private fetchCount(filter: any) {
    const skip = ['pageSize', 'pageIndex', 'sortColumn', 'sortOrder', 'filterType'];
    const hasFilter = Object.keys(filter).some(k => !skip.includes(k) && filter[k] != null && filter[k] !== '' && filter[k] !== false);
    if (!hasFilter) {
      this.totalCount = null;
      return;
    }
    this.countLoading = true;
    this.totalCount = null;
    this.generalDataService.getPageCount({ ...filter }).subscribe(
      (res: any) => {
        this.countLoading = false;
        if (res?.data?.length > 0) {
          this.totalCount = res.data[0].totalCount;
        }
      },
      () => { this.countLoading = false; }
    );
  }

  showAddEventModal() {
    this.updatingEvent = false;
    this.AddEventForm.reset();
    this.eventCheckResult = null;
    const localStorageGovernment = JSON.parse(
      localStorage.getItem('ls.authorizationData')
    ).user.govenmentId;
    // this.addSelectedgovernment = this.governments.filter((x) =>
    //   JSON.parse(
    //     localStorage.getItem('ls.authorizationData')
    //   ).user.govenmentId.includes(x.id)
    // );
    setTimeout(() => {
      this.addSelectedgovernment = this.multiGovernments.filter(
        (x) => localStorageGovernment == x.id
      );
      if (this.addSelectedgovernment) {
        this.getHealthAdministrationByGovernment(this.eventGovernment);
        this.addhealthAdministrationId = [
          JSON.parse(localStorage.getItem('ls.authorizationData')).user
            .healthAdministrationId,
        ];
        this.addhomeHealthOffice = [
          JSON.parse(localStorage.getItem('ls.authorizationData')).user
            .incidentSourceId,
        ];
      }
      if (this.addSelectedhealthAdministration) {
        this.getIncidentSourceHospitalsByGovernment();
      }
    }, 500);
  }

  findEvent(formObj?: any) {
    if (formObj) {
      // this.generalReportForm.value.governmentId =
      //   this.generalReportForm.value.homeGovernmentId;
      // delete this.generalReportForm.value.homeGovernmentId;
      this.generalReportForm.value.FilterType = null;
      formObj = this.generalReportForm.value;
    } else {
      formObj = {
        pageSize: 10,
        pageIndex: 0,
        sortColumn: this.generalReportFormfilter.sortColumn,
        sortOrder: this.generalReportFormfilter.sortOrder,
        searchText: this.searchText,
      };
    }
    // delete this.generalReportForm.value.FilterType;
    formObj.sortColumn = this.generalReportFormfilter.sortColumn;
    formObj.sortOrder = this.generalReportFormfilter.sortOrder;
    formObj.searchText = this.searchText;
    //  this.generalReportFormfilter.startDate = this.generalReportForm.value.startDate;
    //  this.generalReportFormfilter.endDate = this.generalReportForm.value.endDate;
    this.AddEventFormfilter.eventStartDate =
      this.AddEventForm.value.eventStartDate;
    this.AddEventFormfilter.eventEndDate = this.AddEventForm.value.eventEndDate;

    this.delay = true;
    this.timer = setTimeout(() => {
      if (this.delay) {
        this.translateService
          .get('NOUR.WaitPlease')
          .subscribe((msg) => this.userMsg.info(msg));
      }
    }, 500);

    this.loadError = false;
    this.eventService.getAll(formObj).subscribe(
      (res: any) => {
        if (res != null) {
          this.loadError = false;
          this.dataSource = res?.data ?? [];

          //TODO BACK TO EVENTS
          if (this.dataSource != undefined && this.dataSource.length == 0) {
            setTimeout(() => {
              this.delay = false;
              clearTimeout(this.timer);
            }, 0);

            this.noData = true;
            this.noDatae = true;
            this.event = false;
            this.pages = 0;
            this.hasNextPage = false;
            if (this.noDatae == true && this.noDatap == false) {
              this.translateService
                .get('NOUR.NO_RESULTSEvent')
                .subscribe((msg) => this.userMsg.warn(msg));
            }
            if (this.noDatae == true && this.noDatap == true) {
              this.translateService
                .get('NOUR.NO_RESULTS')
                .subscribe((msg) => this.userMsg.warn(msg));
              this.translateService
                .get('NOUR.NO_RESULTSEvent')
                .subscribe((msg) => this.userMsg.warn(msg));
            }
          } else {
            setTimeout(() => {
              this.delay = false;
              clearTimeout(this.timer);
            }, 0);

            this.noData = false;
            this.noDatae = false;
            this.event = true;
            this.pages = res.data[0].totalCount;
            this.hasNextPage =
              (this.generalReportFormfilter.pageIndex + 1) *
                this.generalReportFormfilter.pageSize <
              this.pages;
            this.last =
              this.generalReportForm.value.pageIndex *
              this.generalReportForm.value.pageSize;
          }
        }
      },
      (error) => {
        this.delay = false;
        clearTimeout(this.timer);
        this.loadError = true;
        this.noData = true;
        this.noDatae = false;
        this.dataSource = [];
        this.pages = 0;
        this.totalCount = null;
        this.hasNextPage = false;
        this.translateService
          .get('NEDSS.COMMON.COULD_NOT_LOAD_RESULTS')
          .subscribe((msg: string) => this.userMsg.error(msg));
      }
    );
    this.columnsToDisplay = [
      ' ',
      'اسم الحدث ',
      ' محافظة الحدث',
      'الادارة الصحية',
      ' تاريخ الحدث',
      'وقت الحدث ',
      'الاجراءات',
    ];
    this.dataToShow = [
      '',
      'description',
      'governmentId',
      'healthAdministrationId',
      'eventDiscoveryDate',
      'eventDiscoveryTime',
      '',
    ];
  }

  updatedObject: any;

  editEvent(obj) {
    console.log(obj);
    this.generalDataService.addressValidationMessage = '';
    this.isFormValid = true;
    this.generalDataService.isIncidentSourceValid = true;
    this.generalDataService.isFirstNameValid = true;
    this.generalDataService.isFamilyNameValid = true;
    this.generalDataService.isHomeGovernmentValid = true;
    this.generalDataService.isHomeHealthAdministrationValid = true;

    this.addSelectedgovernment = obj.governmentId;

    this.eventService
      .getById(obj.id)
      .pipe(map((res) => res.data))
      .subscribe((res) => {
        this.updatingEvent = true;

        this.eventName = res.name;
        this.eventCode = res.code;
        this.updatedObject = res;
        console.log('time here before', res.eventDiscoveryTime);
        this.AddEventForm.patchValue({
          name: res.name,
          governmentId: res.governmentId,
          healthAdministrationId: res.healthAdministrationId,
          description: res.description,
          code: res.code,
          eventDiscoveryDate: res.eventDiscoveryDate,
          eventDiscoveryTime: res.eventDiscoveryTime,
          eventStartDate: res.eventStartDate,
          // eventEndDate: res.eventEndDate,
          eventEndDate: res.eventEndDate ? new Date(res.eventEndDate) : null,
          healthOfficeId: res.healthOfficeId,
          address: res.address,
          diseaseGroupId: res.diseaseGroupId,
        });
        this.curruntId = res.id;
        console.log(
          'time here after',
          this.AddEventForm.value.eventDiscoveryTime
        );

        this.AddEventForm.controls['eventDiscoveryDate'].setValue(
          this.AddEventForm.value.eventDiscoveryDate?.split('T')[0]
        );
        this.AddEventForm.controls['eventStartDate'].setValue(
          this.AddEventForm.value.eventStartDate?.split('T')[0]
        );

        // this.AddEventForm.controls['eventEndDate'].setValue(this.AddEventForm.value.eventEndDate?.split('T')[0]);
        this.AddEventForm.controls['eventEndDate'].setValue(
          this.AddEventForm.value.eventEndDate
            ? this.AddEventForm.value.eventEndDate.toISOString().split('T')[0]
            : null
        );

        this.radioEventCheck = res.eventLevel;
        this.changeEventRadio();
        this.getLookups();
      });
  }

  viewEventPatientClick(event) {
    this.ViewEventPatientForm.controls['governmentName'].setValue(
      event.governmentName
    );

    this.viewEventPatient = true;
    this.eventPatients = event.eventPatients;
  }

  changeHealthAdministrationOnForm() {
    this.AddEventForm.value.healthAdministrationId =
      this.healthAdministration.filter(
        (x) => x.id == this.AddEventForm.value.healthAdministrationId
      );
    this.AddEventForm.controls['healthAdministrationId'].setValue(
      this.AddEventForm.value.healthAdministrationId
    );
  }

  isDiscoveryTimeValid(): boolean {
    let now = new Date();

    let discoveredDate = new Date(
      (this.AddEventForm.value.eventDiscoveryDate += 'T00:00:00')
    );
    let isToday =
      discoveredDate.getDate() === now.getDate() &&
      discoveredDate.getMonth() === now.getMonth() &&
      discoveredDate.getFullYear() === now.getFullYear();

    if (isToday) {
      let discoveredTime = new Date(discoveredDate);
      let time = (this.AddEventForm.value.eventDiscoveryTime += ':00');
      if (time != undefined && time != null) {
        let [hours, minutes] = time.split(':');
        discoveredTime.setHours(Number(hours), Number(minutes));
      }
      return discoveredTime <= now;
    }

    return true;
  }

  updateEvent() {
    this.isFormValid = true;
    let isValid = this.validateAddEvent();
    // this.generalDataService.checkIncidentSourceValid(
    //   this.addhomeHealthOffice
    // ) &&
    // this.generalDataService.checkIncidentHealthAdministrationValid(
    //   this.addhealthAdministrationId
    // ) &&
    // this.generalDataService.checkIncidentGovernmentValid(
    //   this.addSelectedgovernment
    // ) &&
    // this.generalDataService.validateFirstName(this.eventName, false);
    this.isFormValid = isValid;

    if (this.isFormValid) {
      this.AddEventForm.value.governmentId =
        this.addSelectedgovernment != -1 ? this.addSelectedgovernment : null;
      this.AddEventForm.value.healthAdministrationId =
        this.addhealthAdministrationId != -1
          ? this.addhealthAdministrationId
          : null;
      this.AddEventForm.value.healthOfficeId =
        this.addhomeHealthOffice != -1 ? this.addhomeHealthOffice : null;
      this.AddEventForm.value.eventDiscoveryDate += 'T00:00:00';

      this.AddEventForm.value.eventStartDate += 'T00:00:00';

      if (this.AddEventForm.value.eventEndDate != null) {
        this.AddEventForm.value.eventEndDate += 'T00:00:00';
      } else {
        this.AddEventForm.value.eventEndDate = null;
      }

      this.AddEventForm.value.diseaseGroupId = this.selectedDiseaseGroupId;

      this.AddEventForm.value.eventDiscoveryTime;
      this.eventService
        .update({
          id: this.updatedObject.id,
          eventLevel: this.radioEventCheck,
          governmentsIds: this.eventCheckResult.needGovernments
            ? this.eventGovernment
            : [],
          healthAdministrationsIds: this.eventCheckResult
            .needHealthAdministrations
            ? this.eventHealthAdministration
            : [],
          branchsIds: this.eventCheckResult.needBranchs ? this.eventBranch : [],
          areasIds: this.eventCheckResult.needAreas ? this.eventArea : [],
          incidentSourcesIds: this.eventCheckResult.needIncidentSources
            ? this.eventIncidentSource
            : [],
          name: this.eventName,
          code: this.eventCode,
          eventDiscoveryTime: this.AddEventForm.value.eventDiscoveryTime,
          eventDiscoveryDate: this.AddEventForm.value.eventDiscoveryDate,
          eventStartDate: this.AddEventForm.value.eventStartDate,
          eventEndDate: this.AddEventForm.value.eventEndDate,
          description: this.AddEventForm.value.description,
          address: this.AddEventForm.value.address,
          diseaseGroupId: this.AddEventForm.value.diseaseGroupId,
        })
        .subscribe(
          (result: any) => {
            if (result != null && result != undefined) {
              this.translateService
                .get('NEDSS.COMMON.UPDATE_SUCESSFULLY')
                .subscribe((res: string) => {
                  this.userMsg.success(res);
                });
              this.getAllEvents();
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

      let cancelButton = document.getElementById(
        'cancelEventButton'
      ) as HTMLElement;
      //     addButton.setAttribute("data-bs-dismiss", "model");
      cancelButton.click();
    }
  }

  deleteEvent(id) {
    this.eventService.delete(id).subscribe(
      (result: any) => {
        if (result != null && result != undefined) {
          this.translateService
            .get('NEDSS.COMMON.DELETED_SUCESSFULLY')
            .subscribe((res: string) => {
              this.userMsg.success(res);
            });
          this.getAllEvents();
          this.findEvent(true);
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
    this.getAllDiseases();
    this.getAllDiseaseCategorys();
    this.getCaseCategories();
    this.getAddHealthAdministration();
    this.getAddHealthOffice();
    this.getBranches();

    // this.findEvent();
    // this.findPatient()
  }

  getGovernments() {
    this.lookupsService.getAllGovernmentsForUser(true).subscribe(
      (result: any) => {
        if (result != null && result != undefined) {
          this.governments = result.data;
          this.multiGovernments = JSON.parse(JSON.stringify(result.data));
          this.governments.unshift({
            id: null,
            arabicName: 'إختر',
            englishName: 'Select',
          });
        }
        if (this.updatedObject?.governmentsIds?.length) {
          this.addSelectedgovernment = this.multiGovernments?.filter(
            (x) =>
              !!(this.updatedObject?.governmentsIds as any[]).find(
                (y) => y == x.id
              )
          );
          this.onGovernmentEventChanged();
        }
        if (!this.activeUSerService.getAccessibleParts?.enableGovernments) {
          this.addSelectedgovernment = this.multiGovernments.filter(
            (x) =>
              x.id ==
              JSON.parse(localStorage.getItem('ls.authorizationData')).user
                .govenmentId
          );
          this.eventGovernment = [
            JSON.parse(localStorage.getItem('ls.authorizationData')).user
              .govenmentId,
          ];
          this.governmentSelected(false);
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

  getHealthAdministration(currentGovernmentId?: number) {
    this.lookupsService
      .getPageHealthAdministrations({
        governmentID:
          currentGovernmentId ?? this.generalReportForm.value.homeGovernmentId,
        forSystemUser: true,
      })
      .subscribe(
        (result: any) => {
          if (result != null && result != undefined) {
            this.healthAdministration = [
              { id: -1, arabicName: 'إختر', englishName: 'Select' },
            ];
            result.data.forEach((nat) => {
              this.healthAdministration.push(nat);
            });
          }
          setTimeout(() => {
            if (!this.activeUSerService.getAccessibleParts?.enableDepartments) {
              this.addSelectedhealthAdministration =
                this.healthAdministration.filter(
                  (x) =>
                    x.id ==
                    JSON.parse(localStorage.getItem('ls.authorizationData'))
                      .user.healthAdministrationId
                );
              this.onHealthAdministrationEventChanged();
            }
          }, 500);

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

  getCaseCategories() {
    this.lookupsService.getAllCaseResultCategorys().subscribe(
      (result: any) => {
        if (result != null && result != undefined) {
          this.Categories = [
            { id: -1, arabicName: 'إختر', englishName: 'Select' },
          ];
          result.data.forEach((nat) => {
            this.Categories.push(nat);
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

  getAllDiseases() {
    this.lookupsService.getAllDiseases().subscribe(
      (result: any) => {
        if (result != null && result != undefined) {
          this.Diseasies = result.data;
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

  getAllDiseaseCategorys() {
    this.lookupsService.getAllDiseaseCategorys().subscribe(
      (result: any) => {
        if (result != null && result != undefined) {
          this.DiseasiesCategoris = [
            { id: -1, arabicName: 'إختر', englishName: 'Select' },
          ];
          result.data.forEach((nat) => {
            this.DiseasiesCategoris.push(nat);
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

  getHealthOffice() {
    this.lookupsService
      .getPageIncidentSourceHospitals({
        healthAdministrationID:
          this.generalReportForm.value.homeHealthAdministrationId,
        forHome: true,
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

  gethomeCity() {
    this.lookupsService
      .getPageCitys({
        governmentID: this.generalReportForm.value.homeGovernmentId,
      })
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

  governmentSelected(isDeleselct = true) {
    if (isDeleselct) this.governmentDSelected();
    this.generalReportForm.value.homeGovernmentId = this.selectedGovernment;

    this.getHealthAdministration();
    this.gethomeCity();
  }
  governmentDSelected() {
    this.generalReportForm.value.homeGovernmentId = null;
    this.selectedhealthAdministration = -1;
    this.healthCitySelected = -1;
    this.cities = null;
    // this.healthAdministrationDSelected();
  }

  healthAdministrationSelected() {
    this.healthAdministrationDSelected();
    this.generalReportForm.value.homeHealthAdministrationId =
      this.selectedhealthAdministration;
    this.getHealthOffice();
    this.gethomeCity();
  }
  healthAdministrationDSelected() {
    this.generalReportForm.value.homeHealthAdministrationId = null;
    this.healthOfficcies = null;
    this.SelectedhealthOfficcieId = -1;
  }

  homeHealthOfficeSelected() {
    this.generalReportForm.value.homeHealthOfficeId =
      this.SelectedhealthOfficcieId;
    this.getHealthOffice();
    this.getHealthAdministration();
  }
  homeHealthOfficeDSelected() {
    this.generalReportForm.value.homeHealthOfficeId = null;
  }

  homeCitySelected() {
    this.generalReportForm.value.homeCityId = this.healthCitySelected;
    this.gethomeCity();
  }
  homeCityDSelected() {
    this.generalReportForm.value.homeCityId = null;
  }

  patientDiseasesSelected(event) {
    // alert(event.id);
    // alert(this.generalReportForm.value.patientDiseases.length);
    this.generalReportForm.value.patientDiseases = event.id;
    this.getAllDiseases();
    this.getAllDiseaseCategorys();
  }
  patientDiseasesDSelected() {
    this.generalReportForm.value.patientDiseases = null;
    this.getAllDiseases();
    this.getAllDiseaseCategorys();
  }

  caseResultCategorySelected() {
    this.selectedDiseaseCategoryId = -1;
    this.generalReportForm.value.caseResultCategoryId = this.selectedCategoryId;
    this.getCaseCategories();
  }
  caseResultCategoryDSelected() {
    this.generalReportForm.value.caseResultCategoryId = null;
    this.getCaseCategories();
  }
  DiseasiesCateSelected() {
    this.generalReportForm.value.caseResultCategoryId =
      this.selectedDiseaseCategoryId;
    this.getAllDiseaseCategorys();
  }
  DiseasiesCateDSelected() {
    this.generalReportForm.value.caseResultCategoryId = null;
    this.getCaseCategories();
  }
  //region add

  getAddHealthAdministration() {
    this.lookupsService
      .getPageHealthAdministrations({
        governmentID: this.addSelectedgovernment,
      })
      .subscribe(
        (result: any) => {
          if (result != null && result != undefined) {
            this.addHealthAdministration = [
              { id: -1, arabicName: 'إختر', englishName: 'Select' },
            ];
            result.data.forEach((nat) => {
              this.addHealthAdministration.push(nat);
            });
            if (this.updatedObject?.healthAdministrationsIds?.length) {
              this.addSelectedhealthAdministration =
                this.addHealthAdministration?.filter(
                  (x) =>
                    !!(
                      this.updatedObject?.healthAdministrationsIds as any[]
                    ).find((y) => y == x.id)
                );
              this.onHealthAdministrationEventChanged();
            } else {
              this.addhealthAdministrationId = -1;
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

  getAddHealthOffice() {
    //,reportingOrResidence: 2
    this.lookupsService
      .getPageIncidentSourceHospitals({
        healthAdministrationID: this.addhealthAdministrationId,
      })
      .subscribe(
        (result: any) => {
          if (result != null && result != undefined) {
            this.addHealthOfficcies = [
              { id: -1, arabicName: 'إختر', englishName: 'Select' },
            ];
            result.data.forEach((nat) => {
              this.addHealthOfficcies.push(nat);
            });
            if (
              this.updatedObject != null &&
              this.updatedObject.healthOfficeId != null
            ) {
              this.addhomeHealthOffice = this.updatedObject.healthOfficeId;
              // this.getAddHealthOffice();
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
  addGovernmentSelected() {
    this.addGovernmentDeSelected();
    this.getAddHealthAdministration();
  }
  addGovernmentDeSelected() {
    this.addHealthAdministrationDeSelected();
    this.addHealthAdministration = null;
    this.addhealthAdministrationId = null;
  }
  addHealthAdministrationSelected() {
    this.addHealthAdministrationDeSelected();
    this.getAddHealthOffice();
  }
  addHealthAdministrationDeSelected() {
    this.addHealthOfficcies = null;
    this.addhomeHealthOffice = null;
  }

  EventsShow() {
    this.notadded = [];
    this.eventService.getAll({}).subscribe((res: any) => {
      if (res != null) {
        this.EventShow = res.data;
        this.patientToEventForm.reset();
        if (this.AlreadyExist == true) {
          this.AlreadyExist = false;
        }
      }
    });
  }

  getAllEvents() {
    // if (this.generalReportForm.value != null) {
    //   this.findEvent(this.generalReportForm.value);
    // }
    // else {
    //   this.findEvent();
    // }
    // this.event = true;
    this.generalReportForm.patchValue({ sortColumn: 'Name' });
    this.generalReportFormfilter.sortColumn = 'Name';
    if (this.generalReportForm.value.homeGovernmentId != null) {
      if (this.generalReportForm.value.homeGovernmentId != -1) {
        this.generalReportForm.value.pageIndex = 0;
        this.findEvent(this.generalReportForm.value);
      } else {
        this.findEvent();
      }
    } else {
      this.findEvent();
    }
  }

  getAllPaitents() {
    this.generalReportForm.patchValue({ sortColumn: 'FullName' });
    this.generalReportFormfilter.sortColumn = 'FullName';
    this.governmentSelected();

    if (
      this.generalReportForm.value.homeGovernmentId != null ||
      this.generalReportForm.value.homeGovernmentId != -1
    ) {
      this.generalReportForm.value.pageIndex = 0;
      this.findPatient(this.generalReportForm.value);
    } else {
      this.findPatient();
    }

    //this.event = false;
  }

  sort(event: SortEvent) {
    if (
      event.order == -1 &&
      (this.generalReportFormfilter.sortOrder != SortOrder.desc ||
        this.generalReportFormfilter.sortColumn != event.field)
    ) {
      this.generalReportFormfilter.sortOrder = SortOrder.desc;
      this.generalReportFormfilter.sortColumn = event.field;
      this.search(true);
    } else if (
      event.order == 1 &&
      (this.generalReportFormfilter.sortOrder != SortOrder.asc ||
        this.generalReportFormfilter.sortColumn != event.field)
    ) {
      this.generalReportFormfilter.sortOrder = SortOrder.asc;
      this.generalReportFormfilter.sortColumn = event.field;
      this.search(true);
    }
  }

  search(skipCount?: boolean) {
    // this.governmentSelected();
    if (this.event == false) {
      this.findPatient(this.generalReportForm.value, skipCount);
      // if (this.generalReportForm.value.homeGovernmentId != null) {
      //   if (this.generalReportForm.value.homeGovernmentId == -1) {
      //     this.generalReportForm.value.homeGovernmentId = null;
      //     this.findPatient(this.generalReportForm.value);
      //   } else {
      //     this.findPatient(this.generalReportForm.value);
      //   }
      // } else {
      //   this.findPatient();
      // }
    } else {
      this.findEvent(true);
    }
  }

  addEvent() {
    this.updatingEvent = false;
    this.isFormValid = true;
    let isValid = this.validateAddEvent();
    // this.generalDataService.checkIncidentSourceValid(
    //   this.addhomeHealthOffice
    // ) &&
    // this.generalDataService.checkIncidentHealthAdministrationValid(
    //   this.addhealthAdministrationId
    // ) &&
    // this.generalDataService.checkIncidentGovernmentValid(
    //   this.addSelectedgovernment
    // ) &&
    // this.generalDataService.validateFirstName(this.eventName, false);
    this.isFormValid = isValid;

    if (this.isFormValid) {
      this.AddEventForm.value.governmentId =
        this.addSelectedgovernment != -1 ? this.addSelectedgovernment : null;
      this.AddEventForm.value.healthAdministrationId =
        this.addhealthAdministrationId != -1
          ? this.addhealthAdministrationId
          : null;
      this.AddEventForm.value.healthOfficeId =
        this.addhomeHealthOffice != -1 ? this.addhomeHealthOffice : null;
      this.AddEventForm.value.eventDiscoveryDate += 'T00:00:00';

      this.AddEventForm.value.eventStartDate += 'T00:00:00';

      if (this.AddEventForm.value.eventEndDate != null) {
        this.AddEventForm.value.eventEndDate += 'T00:00:00';
      } else {
        this.AddEventForm.value.eventEndDate = null;
      }

      this.AddEventForm.value.eventDiscoveryTime += ':00';
      this.AddEventForm.value.diseaseGroupId = this.selectedDiseaseGroupId;

      this.eventService
        .add({
          eventLevel: this.radioEventCheck,
          governmentsIds: this.eventCheckResult.needGovernments
            ? this.eventGovernment
            : [],
          healthAdministrationsIds: this.eventCheckResult
            .needHealthAdministrations
            ? this.eventHealthAdministration
            : [],
          branchsIds: this.eventCheckResult.needBranchs ? this.eventBranch : [],
          areasIds: this.eventCheckResult.needAreas ? this.eventArea : [],
          incidentSourcesIds: this.eventCheckResult.needIncidentSources
            ? this.eventIncidentSource
            : [],
          name: this.eventName,
          code: this.eventCode,
          eventDiscoveryTime: this.AddEventForm.value.eventDiscoveryTime,
          eventDiscoveryDate: this.AddEventForm.value.eventDiscoveryDate,
          eventStartDate: this.AddEventForm.value.eventStartDate,
          eventEndDate: this.AddEventForm.value.eventEndDate,
          description: this.AddEventForm.value.description,
          address: this.AddEventForm.value.address,
          diseaseGroupId: this.AddEventForm.value.diseaseGroupId,
        })
        .subscribe(
          (result: any) => {
            if (result != null && result != undefined) {
              this.findEvent(true);
              this.translateService
                .get('NEDSS.COMMON.UPDATE_SUCESSFULLY')
                .subscribe((res: string) => {
                  this.userMsg.success(res);
                });
              this.AddEventForm.reset();
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

      let cancelButton = document.getElementById(
        'cancelEventButton'
      ) as HTMLElement;
      //     addButton.setAttribute("data-bs-dismiss", "model");
      cancelButton.click();
    }
  }
  select_all = false;
  disAbledAddToEvent = true;
  onSelectAll(e: any): void {
    this.disAbledAddToEvent = !e;
    this.select_all = e;
    this.notadded = [];
  }

  patientsIdsToAdd: any[] = [];
  onSelected(obj) {
    this.notadded = [];
    if (this.patientsIdsToAdd.includes(obj.id)) {
      const index = this.patientsIdsToAdd.indexOf(obj.id);
      if (index > -1) {
        // only splice array when item is found
        this.patientsIdsToAdd.splice(index, 1); // 2nd parameter means remove one item only
      }
      if (this.patientsIdsToAdd.length == 0) {
        this.disAbledAddToEvent = true;
      }
    } else {
      this.patientsIdsToAdd.push(obj.id);
      this.disAbledAddToEvent = false;
    }
  }

  AddpatientToEvent() {
    // if(this.eventCodePatient == null || this.selectedEventId == null)
    // {
    //   this.addtoEventValid= false
    // }
    // else{
    //   this.addtoEventValid= true;
    // }

    if (this.select_all) {
      if (!this.patientToEventForm.valid && false) {
        this.translateService
          .get('NEDSS.COMMON.PLEASE_FILL_NEEDED_DATA')
          .subscribe((res: string) => {
            this.userMsg.error(res);
          });
      } else {
        this.dataSource.forEach((element) => {
          this.patientToEventForm.value.patientId = element.id;
          this.eventService
            .addPAtientToEvent(this.patientToEventForm.value)
            .subscribe((res) => {});
        });
      }
    } else {
      if (!this.patientToEventForm.valid && false) {
        this.translateService
          .get('NEDSS.COMMON.PLEASE_FILL_NEEDED_DATA')
          .subscribe((res: string) => {
            this.userMsg.error(res);
          });
      } else {
        this.EventsShow();
        var Event = this.EventShow.find((s) => s.id == this.selectedEventId);
        var Eventp = Event.eventPatients;

        if (Eventp.length > 0) {
          Eventp.forEach((x) => {
            this.patientsIdsToAdd.forEach((element) => {
              if (element == x.patientId) {
                this.notadded.push(x);
              }
            });
          });

          var eventPatients = [];
          this.patientsIdsToAdd.forEach((x) => {
            var eventPatient = {
              id: 0,
              patientId: x,
              eventId: this.selectedEventId,
              totalCount: 0,
              patientName: '',
            };

            eventPatients.push(eventPatient);
          });

          function findArrayDifference(array1, array2, key) {
            return array1.filter(
              (item1) => !array2.some((item2) => item1[key] === item2[key])
            );
          }

          this.eventPatientsadd = findArrayDifference(
            eventPatients,
            this.notadded,
            'patientId'
          );

          if (this.eventPatientsadd.length > 0) {
            this.eventService
              .addAllPatientToEvent(this.eventPatientsadd)
              .subscribe((res) => {
                this.userMsg.success('added successfully');
              });
            if (this.notadded.length <= 0) {
              let cancelButton = document.getElementById(
                'cancelEventButton2'
              ) as HTMLElement;
              //     addButton.setAttribute("data-bs-dismiss", "model");
              cancelButton.click();
            }

            this.AlreadyExist = true;
            this.patientToEventForm.reset();
          }

          // this.notadded=[]
        }
        // }
        else {
          // var eventPatients = [];
          this.patientsIdsToAdd.forEach((x) => {
            var eventPatient = {
              id: 0,
              patientId: x,
              eventId: this.selectedEventId,
              totalCount: 0,
              patientName: '',
            };

            this.eventPatientsadd.push(eventPatient);
          });
          this.patientToEventForm.reset();
          this.eventService
            .addAllPatientToEvent(this.eventPatientsadd)
            .subscribe((res) => {
              this.userMsg.success('added successfully');
            });
          this.patientToEventForm.reset();
          this.notadded = [];
          let cancelButton = document.getElementById(
            'cancelEventButton2'
          ) as HTMLElement;
          //     addButton.setAttribute("data-bs-dismiss", "model");
          cancelButton.click();
        }
      }
    }
  }

  exportEventsAsExcel() {
    this.exportService.exportTableAsExcel(this.tableElement, this.screenName);
  }
  // exportEventsAsPdf() {
  //   this.exportService.exportTableAsPdf(this.tableElement, this.screenName);
  // }
  exportEventsAsPdf() {
    let selectedGov = this.governments.filter(
      (g) => g.id == this.selectedGovernment
    );

    let tempSelectedAdm = [this.selectedhealthAdministration];
    let selectedAdm = this.healthAdministration?.filter((g) =>
      tempSelectedAdm.includes(g.id)
    );
    selectedAdm = selectedAdm?.map((g) => g.arabicName);

    let tempSelectedIncs = this.incidentSources?.map((g) => g.id);
    let selectedIncs = this.incidentSources?.filter((g) =>
      tempSelectedIncs.includes(g.id)
    );
    selectedIncs = selectedIncs?.map((g) => g.arabicName);

    let tempSelectedDeps = this.selectedDepartment?.map((g) => g.id);
    let selectedDep = this.departments?.filter((g) =>
      tempSelectedDeps.includes(g.id)
    );
    selectedDep = selectedDep?.map((g) => g.arabicName);

    let sDate, eDate;

    try {
      sDate =
        this.generalReportFormfilter.startDate &&
        new Date(this.generalReportFormfilter.startDate).toLocaleDateString(
          'en-GB'
        );
      eDate =
        this.generalReportFormfilter.endDate &&
        new Date(this.generalReportFormfilter.endDate).toLocaleDateString(
          'en-GB'
        );
    } catch (error) {
      sDate = '';
      eDate = '';
    }
    this.exportService.exportTemplateAsPdf(
      document.getElementById(this.currentConfig),
      'الاحداث ( كل الاحداث )',
      [selectedGov, selectedAdm, selectedIncs, selectedDep],
      [sDate, eDate]
    );
  }
  exportPatiantsAsExcel() {
    this.exportService.exportTableAsExcel(this.tableElement, 'Patients');
  }
  // exportPatientsAsPdf() {
  //   this.exportService.exportTableAsPdf(this.tableElement, 'Patients');
  // }

  exportPatientsAsPdf() {
    let selectedGov = this.governments.filter(
      (g) => g.id == this.selectedGovernment
    );

    let tempSelectedAdm = [this.selectedhealthAdministration];
    let selectedAdm = this.healthAdministration?.filter((g) =>
      tempSelectedAdm.includes(g.id)
    );
    selectedAdm = selectedAdm?.map((g) => g.arabicName);

    let tempSelectedIncs = this.incidentSources?.map((g) => g.id);
    let selectedIncs = this.incidentSources?.filter((g) =>
      tempSelectedIncs.includes(g.id)
    );
    selectedIncs = selectedIncs?.map((g) => g.arabicName);

    let tempSelectedDeps = this.selectedDepartment?.map((g) => g.id);
    let selectedDep = this.departments?.filter((g) =>
      tempSelectedDeps.includes(g.id)
    );
    selectedDep = selectedDep?.map((g) => g.arabicName);

    let sDate, eDate;
    try {
      // sDate = (this.AddEventFormfilter.eventStartDate && new Date(this.AddEventFormfilter.eventStartDate).toLocaleDateString('en-GB'))
      // eDate = (this.AddEventFormfilter.eventEndDate && new Date(this.AddEventFormfilter.eventEndDate).toLocaleDateString('en-GB'))
      sDate =
        this.generalReportFormfilter.startDate &&
        new Date(this.generalReportFormfilter.startDate).toLocaleDateString(
          'en-GB'
        );
      eDate =
        this.generalReportFormfilter.endDate &&
        new Date(this.generalReportFormfilter.endDate).toLocaleDateString(
          'en-GB'
        );
    } catch (error) {
      sDate = '';
      eDate = '';
    }
    this.exportService.exportTemplateAsPdf(
      document.getElementById(this.currentConfig),
      'الاحداث ( كل المرضي )',
      [
        selectedGov,
        selectedAdm,
        //selectedIncs,
        //selectedDep
      ],
      [sDate, eDate]
    );
  }

  nameToDelete(ele) {
    this.underDeleting.id = ele.id;
    this.underDeleting.name = ele.name;
    this.underDeleting.pname = ele.patientName;
  }

  Tablesearch(e) {
    this.searchText = e.target.value;
    this.search();
    // if (e.target.value.toLowerCase()?.length ) {
    //   this.search();
    // }
    // if (this.event) {
    //   this.dataSource = this.dataSource.filter((m) =>
    //     m.name.toLowerCase().includes(e.target.value.toLowerCase())
    //   );
    // } else {
    //   this.dataSource = this.dataSource.filter((m) =>
    //     m.fullName.toLowerCase().includes(e.target.value.toLowerCase())
    //   );
    // }
  }

  getHealthAdministrationByGovId(x: any) {
    this.healthAdministration = [];
    this.lookupsService
      .getPageHealthAdministrations({ governmentID: x })
      .subscribe(
        (result: any) => {
          if (result != null && result != undefined) {
            this.healthAdministration = [
              { id: -1, arabicName: 'إختر', englishName: 'Select' },
            ];
            result.data.forEach((nat) => {
              this.healthAdministration.push(nat);
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
  getRelatedIncidentSources(x: any) {
    this.incidentSources = [];

    this.lookupsService
      .getPageIncidentSourceHospitals({ healthAdministrationID: x })
      .subscribe(
        (result: any) => {
          if (result != null && result != undefined) {
            this.incidentSources = [
              { id: -1, arabicName: 'إختر', englishName: 'Select' },
            ];
            result.data.forEach((nat) => {
              this.incidentSources.push(nat);
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

  onStartDateChange(selectedStartDate: Date) {
    this.startDate = selectedStartDate;
  }

  onEventChanged() {
    this.notadded = [];
  }

  changeEventRadio() {
    this.eventService.updateEventLevel(this.radioEventCheck).subscribe(
      (result: any) => {
        if (result != null && result != undefined) {
          this.eventCheckResult = result.data;
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

  //Government
  onAllGovernmentEventChanged($event) {
    this.addSelectedgovernment = $event;
    this.eventGovernment = [];
    this.addSelectedgovernment.forEach((x) => {
      this.eventGovernment.push(x.id);
    });
    this.getHealthAdministrationByGovernment(this.eventGovernment);
  }
  onAllGovernmentEventDisChanged($event) {
    this.addSelectedgovernment = $event;
    this.eventGovernment = this.addSelectedgovernment.map((x) => x.id);
    this.getHealthAdministrationByGovernment(this.eventGovernment);
  }
  onGovernmentEventChanged() {
    this.eventGovernment = [];
    this.addSelectedgovernment.forEach((x) => {
      this.eventGovernment.push(x.id);
    });
    this.getHealthAdministrationByGovernment(this.eventGovernment);
  }
  onGovernmentEventDisChanged() {
    this.eventGovernment = this.addSelectedgovernment.map((x) => x.id);
    this.getHealthAdministrationByGovernment(this.eventGovernment);
  }

  //HealthAdministration
  getHealthAdministrationByGovernment(addSelectedgovernment?: any) {
    this.lookupsService
      .getHealthAdministrationsByGovernmentsIds(addSelectedgovernment)
      .subscribe(
        (result: any) => {
          if (result != null && result != undefined) {
            this.checkHealthAdministration = result.data;
            this.addHealthAdministration = [
              { id: -1, arabicName: 'إختر', englishName: 'Select' },
            ];
            result.data.forEach((nat) => {
              this.addHealthAdministration.push(nat);
            });
            if (this.updatedObject?.healthAdministrationsIds?.length) {
              this.addSelectedhealthAdministration =
                this.addHealthAdministration?.filter(
                  (x) =>
                    !!(
                      this.updatedObject?.healthAdministrationsIds as any[]
                    ).find((y) => y == x.id)
                );
              this.onHealthAdministrationEventChanged();
            } else {
              this.addhealthAdministrationId = -1;
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

  onHealthAdministrationEventChanged() {
    this.eventHealthAdministration = [];
    this.addSelectedhealthAdministration.forEach((x) => {
      this.eventHealthAdministration.push(x.id);
    });
    this.getIncidentSourceHospitalsByGovernment();
  }

  onHealthAdministrationEventDisChanged() {
    this.eventHealthAdministration = this.addSelectedhealthAdministration.map(
      (x) => x.id
    );
    this.getIncidentSourceHospitalsByGovernment();
  }

  onAllHealthAdministrationEventChanged($event) {
    this.addSelectedhealthAdministration = $event;
    this.eventHealthAdministration = [];
    this.addSelectedhealthAdministration.forEach((x) => {
      this.eventHealthAdministration.push(x.id);
    });
    this.getIncidentSourceHospitalsByGovernment();
  }

  onAllHealthAdministrationEventDisChanged($event) {
    this.addSelectedhealthAdministration = $event;
    this.eventHealthAdministration = this.addSelectedhealthAdministration.map(
      (x) => x.id
    );
    this.getIncidentSourceHospitalsByGovernment();
  }

  //IncidentSource
  getIncidentSourceHospitalsByGovernment() {
    this.lookupsService
      .getIncidentSourceHospitalsByGovernmentsIds({
        governmentsIds: this.eventCheckResult?.displayHealthAdministrations
          ? []
          : this.eventGovernment,
        healthAdministrationsIds: this.eventHealthAdministration,
        branchsIds: this.eventCheckResult?.displayAreas ? [] : this.eventBranch,
        areasIds: this.eventArea,
      })
      .subscribe(
        (result: any) => {
          if (result != null && result != undefined) {
            this.checkIncidentSource = result.data;
          }
          if (this.updatedObject?.incidentSourcesIds?.length) {
            this.addhomeHealthOffice = this.checkIncidentSource?.filter(
              (x) =>
                !!(this.updatedObject?.incidentSourcesIds as any[]).find(
                  (y) => y == x.id
                )
            );
            this.onIncidentSourceChanged();
          }

          if (!this.activeUSerService.getAccessibleParts?.enableSources) {
            this.addhomeHealthOffice = this.checkIncidentSource.filter(
              (x) =>
                x.id ==
                JSON.parse(localStorage.getItem('ls.authorizationData')).user
                  .incidentSourceId
            );
            this.eventIncidentSource = [
              JSON.parse(localStorage.getItem('ls.authorizationData')).user
                .incidentSourceId,
            ];
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

  onIncidentSourceChanged() {
    this.eventIncidentSource = [];
    this.addhomeHealthOffice.forEach((x) => {
      this.eventIncidentSource.push(x.id);
    });
  }

  onIncidentSourceDisChanged() {
    this.eventIncidentSource = this.addhomeHealthOffice.map((x) => x.id);
  }

  onAllIncidentSourceEventChanged($event) {
    this.addhomeHealthOffice = $event;
    this.eventIncidentSource = [];
    this.addhomeHealthOffice.forEach((x) => {
      this.eventIncidentSource.push(x.id);
    });
  }

  onAllIncidentSourceDisChanged($event) {
    this.addhomeHealthOffice = $event;
    this.eventIncidentSource = this.addhomeHealthOffice.map((x) => x.id);
  }

  //Branches
  getBranches() {
    this.lookupsGetterService.getAllBranches(this.organizationId).subscribe(
      (result: any) => {
        if (result != null && result != undefined) {
          this.checkBranches = result.data;
        }
        if (this.updatedObject?.branchsIds?.length) {
          this.addSelectedBranch = this.checkBranches?.filter(
            (x) =>
              !!(this.updatedObject?.branchsIds as any[]).find((y) => y == x.id)
          );
          this.onBranchEventChanged();
        }
        if (!this.activeUSerService.getAccessibleParts?.enableBranches) {
          this.addSelectedBranch = this.checkBranches.filter(
            (x) =>
              x.id ==
              JSON.parse(localStorage.getItem('ls.authorizationData')).user
                .branchId
          );
          this.onBranchEventChanged();
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

  onBranchEventChanged() {
    this.eventBranch = [];
    this.addSelectedBranch.forEach((x) => {
      this.eventBranch.push(x.id);
    });
    this.getAreasByBranch(this.eventBranch);
  }

  onBranchEventDisChanged() {
    this.eventBranch = this.addSelectedBranch.map((x) => x.id);
    this.getAreasByBranch(this.eventBranch);
  }

  onAllBranchEventChanged($event) {
    this.addSelectedBranch = $event;
    this.eventBranch = [];
    this.addSelectedBranch.forEach((x) => {
      this.eventBranch.push(x.id);
    });
    this.getAreasByBranch(this.eventBranch);
  }

  onAllBranchEventDisChanged($event) {
    this.addSelectedBranch = $event;
    this.eventBranch = this.addSelectedBranch.map((x) => x.id);
    this.getAreasByBranch(this.eventBranch);
  }

  //Area
  getAreasByBranch(addSelectedBranch?: any) {
    this.lookupsService.getAreasByBranches(addSelectedBranch).subscribe(
      (result: any) => {
        if (result != null && result != undefined) {
          this.checkAreas = result.data;
        }
        if (this.updatedObject?.areasIds?.length) {
          this.addSelectedArea = this.checkAreas?.filter(
            (x) =>
              !!(this.updatedObject?.areasIds as any[]).find((y) => y == x.id)
          );
          this.onAreaEventChanged();
        }
        if (!this.activeUSerService.getAccessibleParts?.enableAreas) {
          this.addSelectedArea = this.checkAreas.filter(
            (x) =>
              x.id ==
              JSON.parse(localStorage.getItem('ls.authorizationData')).user
                .areaId
          );
          this.onAreaEventChanged();
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

  onAreaEventChanged() {
    this.eventArea = [];
    this.addSelectedArea.forEach((x) => {
      this.eventArea.push(x.id);
    });
    this.getIncidentSourceHospitalsByGovernment();
  }

  onAreaEventDisChanged() {
    this.eventArea = this.addSelectedArea.map((x) => x.id);
    this.getIncidentSourceHospitalsByGovernment();
  }

  onAllAreaEventChanged($event) {
    this.addSelectedArea = $event;
    this.eventArea = [];
    this.addSelectedArea.forEach((x) => {
      this.eventArea.push(x.id);
    });
    this.getIncidentSourceHospitalsByGovernment();
  }

  onAllAreaEventDisChanged($event) {
    this.addSelectedArea = $event;
    this.eventArea = this.addSelectedArea.map((x) => x.id);
    this.getIncidentSourceHospitalsByGovernment();
  }

  //Add Event Validate
  validateAddEvent() {
    return (
      this.eventCheckResult &&
      ((this.eventCheckResult.needGovernments &&
        this.addSelectedgovernment?.length) ||
        !this.eventCheckResult.needGovernments) &&
      ((this.eventCheckResult.needHealthAdministrations &&
        this.addSelectedhealthAdministration?.length) ||
        !this.eventCheckResult.needHealthAdministrations) &&
      ((this.eventCheckResult.needBranchs && this.addSelectedBranch?.length) ||
        !this.eventCheckResult.needBranchs) &&
      ((this.eventCheckResult.needUniversities &&
        this.addSelectedBranch?.length) ||
        !this.eventCheckResult.needUniversities) &&
      ((this.eventCheckResult.needAreas && this.addSelectedArea?.length) ||
        !this.eventCheckResult.needAreas) &&
      ((this.eventCheckResult.needIncidentSources &&
        this.addhomeHealthOffice?.length) ||
        !this.eventCheckResult.needIncidentSources) &&
      this.eventName &&
      this.isValidateEventName() &&
      this.eventCode &&
      this.AddEventForm.get('eventDiscoveryTime').value &&
      this.AddEventForm.get('eventDiscoveryDate').value &&
      this.AddEventForm.get('eventStartDate').value &&
      this.AddEventForm.get('address').value &&
      this.AddEventForm.get('description').value &&
      this.selectedDiseaseGroupId != -1
    );
  }

  isValidateEventName() {
    let namePattern = /^[A-Za-z\u0600-\u06FF ]{3,15}$/;
    if (!namePattern.test(this.eventName)) {
      return false;
    }
    return true;
  }

  delete(id) {
    this.eventService.deletepatient(id).subscribe(
      (result: any) => {
        if (result != null && result != undefined) {
          this.loadingPanel = false;
          this.translateService
            .get('NEDSS.COMMON.DELETED_SUCESSFULLY')
            .subscribe((res: string) => {
              this.userMsg.success(res);
            });
        }
        this.getAllEvents();
        this.findEvent(true);
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

  getPrimaryDiagnosis() {
    this.lookupsService.getAllDiseaseGroups().subscribe(
      (result: any) => {
        if (result != null && result != undefined) {
          this.primaryDiseases = [
            { id: -1, arabicName: 'إختر', englishName: 'Select' },
          ];
          result.data.forEach((nat) => {
            this.primaryDiseases.push(nat);
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
  get diseaseGroupIdControl() {
    return this.AddEventForm.get('diseaseGroupId');
  }
}
