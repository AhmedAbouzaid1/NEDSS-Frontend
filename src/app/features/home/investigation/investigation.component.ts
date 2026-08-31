import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { InvestigationService } from './services/investigation.service';
import { ActivatedRoute, Router } from '@angular/router';
import { PatientModel } from '../general-data/models/patient-model';
import { GeneralDataService } from '../general-data/services/general-data.service';
import { LookupsGetterService } from 'src/app/core/services/lookups-getter.service';
import { TranslateService } from '@ngx-translate/core';
import { UserMessageService } from 'src/app/core/services/user.message.service';
import { FormControl, FormGroup } from '@angular/forms';
import { SortEvent } from 'primeng/api';
import {
  MultipleDropdownSettings,
  SingleDropdownSettings,
  SortOrder,
} from 'src/app/core/constants';
import { ExportService } from '../../../core/services/export.service';
import { ExportAsConfig } from 'ngx-export-as';
import { ActiveUserService } from 'src/app/core/services/active-user.service';
import { finalize } from 'rxjs/operators';

@Component({
  selector: 'app-investigation',
  templateUrl: './investigation.component.html',
  styleUrls: ['./investigation.component.css'],
})
export class InvestigationComponent implements OnInit {
  currentLang: string;
  dir: string;
  delay: boolean = false;
  timer: any;

  selectedAdministrationId: number;
  incidentSources: any[];
  selectedDepartments: any[] = [];
  startDate: any;
  endDate: any;
  currentConfig: string = 'myTableElementId';
  exportAsPdfConfig: ExportAsConfig = {
    type: 'pdf', // the type you want to download
    elementIdOrContent: this.currentConfig, // the id of html/table element
  };

  maxDate = new Date();
  minDate = new Date(1900, 0, 1);
  investigationForm: FormGroup;
  singleDropdownSettings = SingleDropdownSettings;
  multipleDropdownSettings = MultipleDropdownSettings;

  @ViewChild('myTableElementId', { static: false }) tableElement: ElementRef;
  screenName: string;

  governments!: any[];
  selectedGovernment: number = -1;

  healthAdministration!: any[];
  selectedHealthAdministration: number;
  departments!: any[];
  selectedDepartment: number;
  diseases!: any[];
  finalDiagnostics!: any[];
  selectedDiseaseId: number = -1;
  selectedDiseaseGroupId: number = -1;
  finalResuls!: any[];
  selectedFinalResult: number = -1;
  selectedCaseCategory: number = -1;
  CaseCategory;
  patient: PatientModel = new PatientModel();
  isPatientTransfered: boolean;
  dataSource: any;
  generalReportForm: any;

  investigationFormfilter: any;
  notInferringFilter = {
    pageSize: 10,
    pageIndex: 0,
    sortColumn: '',
    sortOrder: '',
    searchText: '',
  };
  noData: boolean = true;
  loadError: boolean = false;
  loadingPanel: boolean = false;
  governmentsLoading: boolean = false;
  healthAdministrationLoading: boolean = false;
  departmentsLoading: boolean = false;
  diseasesLoading: boolean = false;
  finalDiagnosticsLoading: boolean = false;
  caseCategoryLoading: boolean = false;
  finalResulsLoading: boolean = false;
  first: number = 0;
  last: number = 0;
  pages: number = 0;
  hasNextPage: boolean = false;
  totalCount: number | null = null;
  countLoading: boolean = false;
  levelId: any;

  constructor(
    private router: Router,
    route: ActivatedRoute,
    private lookupsService: LookupsGetterService,
    private translateService: TranslateService,
    private userMsg: UserMessageService,
    public generalDataService: GeneralDataService,
    private exportService: ExportService,
    public investigation: InvestigationService,
    public activeUSerService: ActiveUserService
  ) {
    // route.url.subscribe(() => {
    //   console.log(route.snapshot.firstChild.data);
    // });
  }

  ngOnInit(): void {
    this.generalDataService.isFirstNameValid = true;
    this.generalDataService.isCardIdValid = true;
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

    if (
      this.router.url.includes('/home/investigations/investigation-detailes')
      ||
      this.router.url.includes('/home/investigations/compelete-investigation')
    ) {
      this.investigation.view = false;
    } else {
      this.investigation.view = true;
    }
    this.getLookups();
    this.levelId = JSON.parse(
      localStorage.getItem('ls.authorizationData')
    )?.user?.levelId;

    this.investigationForm = new FormGroup({
      homeGovernmentId: new FormControl(),
      homeHealthAdministrationId: new FormControl(),
      department: new FormControl(),
      fullName: new FormControl(),
      nationalId: new FormControl(),
      patientDiseases: new FormControl(),
      //
      patientDiseasesGroup: new FormControl(),
      caseResultCategoryId: new FormControl(),
      finalResultId: new FormControl(),
      startDate: new FormControl(),
      endDate: new FormControl(),
      pageSize: new FormControl(10),
      pageIndex: new FormControl(0),
      sortColumn: new FormControl(''),
      sortOrder: new FormControl(''),
      searchText: new FormControl(''),
      isInvistegationDone: new FormControl(null),
      filterType: new FormControl(2),
      InvestigationStatus: new FormControl(),
      firstTime: new FormControl(false),
    });
    this.investigationFormfilter = {
      homeGovernmentId: null,
      homeHealthAdministrationId: null,
      department: null,
      fullName: null,
      nationalId: null,
      patientDiseases: null,
      //
      patientDiseasesGroup: null,
      caseResultCategoryId: null,
      finalResultId: null,
      startDate: null,
      endDate: null,
      pageSize: null,
      pageIndex: null,
      sortColumn: null,
      sortOrder: null,
      searchText: null,
      isInvistegationDone: null,
      filterType: null,
      InvestigationStatus: null,
      firstTime: null,
    };

    this.translateService
      .get('NEDSS.INVESTIGATIONS.ITEM_INVESTIGATIONS')
      .subscribe((res) => (this.screenName = res));

    this.generalDataService.cardIdValidationMessage = '';
    this.disableControls();
  }

  getLookups() {
    this.getGovernments();
    this.getDepartments();
    this.getPrimaryDiagnosis();
    this.getFinalResults();
    this.getCaseCategory();
    this.getFinalDiagonistics();
    // this.findPatient();
  }

  disableControls() {
    if (!this.activeUSerService.getAccessibleParts?.enableGovernments)
      this.investigationForm.controls?.homeGovernmentId?.disable();

    if (!this.activeUSerService.getAccessibleParts?.enableDepartments)
      this.investigationForm.controls?.homeHealthAdministrationId?.disable();
  }

  validate(): boolean {
    return (
      this.generalDataService.validateFirstName(
        this.investigationForm.controls.fullName.value,
        false
      ) &&
      this.generalDataService.validateNationalID(
        this.investigationForm.controls.nationalId.value,
        false
      )
    );
  }

  search() {
    if (!this.validate()) {
      this.translateService
        .get('NEDSS.COMMON.FILL_INVALID')
        .subscribe((res: string) => {
          this.userMsg.warn(res);
        });
      return;
    }
    this.investigationFormfilter.startDate =
      this.investigationForm.value.startDate;
    this.investigationFormfilter.endDate = this.investigationForm.value.endDate;
    this.first = 0;
    this.notInferringFilter.pageIndex = 0;
    this.last =
      this.notInferringFilter.pageIndex * this.notInferringFilter.pageSize;
    this.findPatient(this.investigationForm.value);
  }

  findPatient(formObj?: any, skipCount?: boolean) {
    if (formObj) {
      if (
        this.investigationForm.value.patientDiseases != null &&
        this.investigationForm.value.patientDiseases.length > 0
      ) {
        this.investigationForm.value.patientDiseases[0] =
          this.investigationForm.value.patientDiseases[0];
        delete this.investigationForm.value.patientDiseases[0];
      }

      formObj = this.investigationForm.value;
      if (this.selectedDiseaseId != null && this.selectedDiseaseId != -1) {
        formObj.diseaseId = this.selectedDiseaseId;
      }
      ////
      if (this.selectedDiseaseGroupId != null && this.selectedDiseaseGroupId != -1) {
        formObj.diseaseGroupId = this.selectedDiseaseGroupId;
      }

      if (this.selectedGovernment != null && this.selectedGovernment != -1) {
        formObj.homeGovernmentId = this.selectedGovernment;
      } else {
        formObj.homeGovernmentId = null;
      }
      if (
        this.selectedHealthAdministration != null &&
        this.selectedHealthAdministration != -1
      ) {
        formObj.homeHealthAdministrationId = this.selectedHealthAdministration;
      } else {
        formObj.homeHealthAdministrationId = null;
      }

      if (this.selectedDepartment != null && this.selectedDepartment != -1) {
        formObj.department = this.selectedDepartment;
      } else {
        formObj.department = null;
      }

      if (this.selectedDiseaseId != null && this.selectedDiseaseId != -1) {
        formObj.patientDiseases = [this.selectedDiseaseId];
      } else {
        formObj.patientDiseases = [];
      }
      if (
        this.selectedCaseCategory != null &&
        this.selectedCaseCategory != -1
      ) {
        formObj.caseResultCategoryId = this.selectedCaseCategory;
      } else {
        formObj.caseResultCategoryId = null;
      }
      if (this.selectedFinalResult != null && this.selectedFinalResult != -1) {
        formObj.finalResultId = this.selectedFinalResult;
      } else {
        formObj.finalResultId = null;
      }

    } else {
      formObj = {
        homeGovernmentId: null,
        caseResultCategoryId: null,
        selectedDiseaseId: null,
        selectedDiseaseGroupId: null,
        selectedDepartment: null,
        homeHealthAdministrationId: null,
        finalResultId: null,
        patientDiseases: [],
        pageSize: 10,
        pageIndex: 0,
        sortColumn: '',
        sortOrder: '',
        searchText: '',
        filterType: 2,
        InvestigationStatus: 1,
        isInvistegationDone: true,
      };
      this.router.routerState.root.queryParams.subscribe((params) => {
        //alert(JSON.stringify(params)); // { orderby: "price" }
        if (params.done == null || params.done == undefined) {
          formObj = {
            pageSize: 10,
            pageIndex: 0,
            sortColumn: '',
            sortOrder: '',
            searchText: '',
            filterType: 2,
            InvestigationStatus: '1',
            isInvistegationDone: false,
            //firstTime: true
          };
          if (this.investigationForm != undefined) {
            //&&this.investigationForm.value.InvestigationStatus.setValue != undefined) {
            this.investigationForm.value.InvestigationStatus = 1;
          }
        }
        if (params.done == 2 || params.done == 1)
          if (this.investigationForm.value.InvestigationStatus != undefined) {
            this.investigationForm.value.InvestigationStatus = params.done;
          }
        formObj = {
          pageSize: 10,
          pageIndex: 0,
          sortColumn: '',
          sortOrder: '',
          searchText: '',
          filterType: 2,
          InvestigationStatus: formObj.InvestigationStatus,
          isInvistegationDone: formObj.InvestigationStatus == 1,
          //firstTime: true
        };
        if (this.investigationForm != undefined) {
          //&& this.investigationForm.value.InvestigationStatus.setValue != undefined) {
          this.investigationForm.value.InvestigationStatus = params.done;
        }
      });
    }
    if (formObj.InvestigationStatus == 1) {
      formObj.isInvistegationDone = true;
      formObj.InvestigationStatus = 1;
    } else if (formObj.InvestigationStatus == 2) {
      formObj.isInvistegationDone = false;
      formObj.InvestigationStatus = 2;
    } else if (
      formObj.InvestigationStatus == 0 ||
      formObj.InvestigationStatus == undefined
    ) {
      formObj.InvestigationStatus = null;
      formObj.isInvistegationDone = null;
    }

    formObj.pageSize = this.notInferringFilter.pageSize;
    formObj.pageIndex = this.notInferringFilter.pageIndex;

    this.delay = true;
    this.timer = setTimeout(() => {
      if (this.delay) {
        this.translateService
          .get('NOUR.WaitPlease')
          .subscribe((msg) => this.userMsg.info(msg));
      }
    }, 500);

    this.loadError = false;
    this.generalDataService.getAll(formObj).subscribe(
      (res: any) => {
        this.delay = false;
        clearTimeout(this.timer);
        this.loadError = false;
        this.dataSource = res?.data ?? [];
        if (this.dataSource.length == 0) {
          this.noData = true;
          this.pages = 0;
          this.translateService
            .get('NOUR.NO_RESULTS')
            .subscribe((msg) => this.userMsg.warn(msg));
        } else {
          this.noData = false;
          this.hasNextPage =
            res.data[0].hasNextPage === true &&
            res.data.length >= this.notInferringFilter.pageSize;
          this.last =
            this.notInferringFilter.pageIndex *
            this.notInferringFilter.pageSize;
          if (!skipCount) this.fetchCount(formObj);
        }
      },
      () => {
        this.delay = false;
        clearTimeout(this.timer);
        this.noData = false;
        this.loadError = true;
        this.dataSource = [];
        this.pages = 0;
        this.totalCount = null;
        this.translateService
          .get('NEDSS.COMMON.COULD_NOT_LOAD_RESULTS')
          .subscribe((msg) => this.userMsg.error(msg));
      }
    );
  }

  private fetchCount(filter: any) {
    const skip = ['pageSize', 'pageIndex', 'sortColumn', 'sortOrder', 'searchText', 'filterType', 'InvestigationStatus', 'isInvistegationDone'];
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
  onGovernmentChanged() {
    if (this.selectedGovernment > 0) {
      this.patient.incidentGovernmentId = this.selectedGovernment;
      this.getHealthAdministration(this.patient.incidentGovernmentId);
    } else {
      this.patient.incidentGovernmentId = null;
      this.healthAdministration = [];
      this.selectedHealthAdministration = -1;
    }
  }

  onHealthAdministrationChanged() {
    if (this.selectedHealthAdministration > 0) {
      this.patient.incidentHealthAdministrationId =
        this.selectedHealthAdministration;
      // this.getIncidentSources(this.patient.incidentHealthAdministrationId);
    } else {
      this.patient.incidentHealthAdministrationId = null;
    }
  }

  onDepartmentChanged() {
    this.patient.hiddenInsideDepartment = false;
    if (this.selectedDepartment > 0) {
      this.patient.incidentDepartmentId = this.selectedDepartment;
      if (this.selectedDepartment != 1)
        this.patient.hiddenInsideDepartment = true;
    } else this.patient.incidentDepartmentId = null;
  }

  onDiseasesChanged() {
    if (this.selectedDiseaseId > 0) {
      this.patient.patientDiseases = this.diseases.filter(
        (d) => d.id == this.selectedDiseaseId
      );
    } else {
      this.patient.patientDiseases = null;
    }
  }


  onFinalResultChanged() {
    if (this.selectedFinalResult > 0) {
      this.patient.finalResultId = this.selectedFinalResult;
      if (this.selectedFinalResult == 1) this.isPatientTransfered = true;
      else this.isPatientTransfered = false;
    } else {
      this.patient.finalResultId = null;
      this.isPatientTransfered = false;
    }
  }
  getGovernments() {
    this.governmentsLoading = true;
    this.lookupsService
      .getAllGovernments()
      .pipe(finalize(() => (this.governmentsLoading = false)))
      .subscribe(
      (result: any) => {
        if (result != null && result != undefined) {
          this.governments = result.data;
          this.governments = [
            { id: -1, arabicName: 'إختر', englishName: 'Select' },
          ];
          result.data.forEach((nat) => {
            this.governments.push(nat);
          });
          //if (this.patient.incidentGovernmentId > 0) {
          //  this.selectedGovernment = this.patient.incidentGovernmentId;
          //  this.getHealthAdministration(this.patient.incidentGovernmentId);
          //}
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

  getCaseCategory() {
    this.caseCategoryLoading = true;
    this.lookupsService
      .getAllCaseResultCategorys()
      .pipe(finalize(() => (this.caseCategoryLoading = false)))
      .subscribe(
      (result: any) => {
        if (result != null && result != undefined) {
          this.CaseCategory = [
            { id: -1, arabicName: 'إختر', englishName: 'Select' },
          ];
          result.data.forEach((nat) => {
            this.CaseCategory.push(nat);
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

  getHealthAdministration(governmentID: any) {
    this.healthAdministrationLoading = true;
    this.lookupsService
      .getPageHealthAdministrations({ governmentID: governmentID })
      .pipe(finalize(() => (this.healthAdministrationLoading = false)))
      .subscribe(
        (result: any) => {
          if (result != null && result != undefined) {
            this.healthAdministration = [
              { id: -1, arabicName: 'إختر', englishName: 'Select' },
            ];
            result.data.forEach((nat) => {
              this.healthAdministration.push(nat);
            });
            //if (this.patient.incidentHealthAdministrationId > 0) {
            //  this.selectedHealthAdministration = this.patient.incidentHealthAdministrationId;
            //  // this.getIncidentSources(this.patient.incidentHealthAdministrationId);
            //} else {
            //  this.selectedHealthAdministration = -1;
            //}
            setTimeout(() => {
              this.selectedHealthAdministration = JSON.parse(
                localStorage.getItem('ls.authorizationData')
              ).user.healthAdministrationId;

              if (this.selectedHealthAdministration != null) {
                this.onHealthAdministrationChanged();
              } else {
                this.selectedHealthAdministration = -1;
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

  getDepartments() {
    this.departmentsLoading = true;
    this.lookupsService
      .getAllDepartments()
      .pipe(finalize(() => (this.departmentsLoading = false)))
      .subscribe(
      (result: any) => {
        if (result != null && result != undefined) {
          this.departments = [
            { id: -1, arabicName: 'إختر', englishName: 'Select' },
          ];
          result.data.forEach((nat) => {
            this.departments.push(nat);
          });
          if (this.patient.incidentDepartmentId > 0) {
            this.selectedDepartment = this.patient.incidentDepartmentId;
          } else {
            this.selectedDepartment = -1;
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

  sort(event: SortEvent) {
    if (
      event.order == -1 &&
      this.notInferringFilter.sortOrder != SortOrder.desc
    ) {
      this.notInferringFilter.sortOrder = SortOrder.desc;
      if (typeof event.field === 'string')
        this.notInferringFilter.sortColumn = event.field;
      this.findPatient(this.investigationForm.value, true);
    } else if (
      event.order == 1 &&
      this.notInferringFilter.sortOrder != SortOrder.asc
    ) {
      this.notInferringFilter.sortOrder = SortOrder.asc;
      if (typeof event.field === 'string')
        this.notInferringFilter.sortColumn = event.field;
      this.findPatient(this.investigationForm.value, true);
    }
  }

  getPrimaryDiagnosis() {
    this.diseasesLoading = true;
    this.lookupsService
      .getAllDiseaseGroups()
      .pipe(finalize(() => (this.diseasesLoading = false)))
      .subscribe(
      (result: any) => {
        if (result != null && result != undefined) {
          this.diseases = [
            { id: -1, arabicName: 'إختر', englishName: 'Select' },
          ];
          result.data.forEach((nat) => {
            this.diseases.push(nat);
          });
          if (
            this.patient.patientDiseases != null &&
            this.patient.patientDiseases.length > 0
          ) {
            this.selectedDiseaseId = this.diseases.filter((item) =>
              this.patient.patientDiseases
                .map(function (a) {
                  return a.diseaseGroupId;
                })
                .includes(item.id)
            )[0].id;
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

  getFinalDiagonistics() {
    this.finalDiagnosticsLoading = true;
    this.lookupsService
      .getAllDiseases()
      .pipe(finalize(() => (this.finalDiagnosticsLoading = false)))
      .subscribe(
      (result: any) => {
        if (result != null && result != undefined) {
          this.finalDiagnostics = [
            { id: -1, arabicName: 'إختر', englishName: 'Select' },
          ];
          result.data.forEach((nat) => {
            this.finalDiagnostics.push(nat);
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

  getFinalResults() {
    this.finalResulsLoading = true;
    this.lookupsService
      .getAllFinalResults()
      .pipe(finalize(() => (this.finalResulsLoading = false)))
      .subscribe(
      (result: any) => {
        if (result != null && result != undefined) {
          this.finalResuls = [
            { id: -1, arabicName: 'إختر', englishName: 'Select' },
          ];
          result.data.forEach((nat) => {
            this.finalResuls.push(nat);
          });
          if (this.patient.finalResultId > 0) {
            this.selectedFinalResult = this.patient.finalResultId;
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

  previousPage() {
    if (this.notInferringFilter.pageIndex > 0) {
      this.notInferringFilter.pageIndex--;
      this.first = this.notInferringFilter.pageIndex * this.notInferringFilter.pageSize;
      this.findPatient(this.investigationForm.value, true);
    }
  }

  nextPage() {
    if (this.hasNextPage) {
      this.notInferringFilter.pageIndex++;
      this.first = this.notInferringFilter.pageIndex * this.notInferringFilter.pageSize;
      this.findPatient(this.investigationForm.value, true);
    }
  }

  onPageSizeChange(newSize: number) {
    this.notInferringFilter.pageSize = newSize;
    this.notInferringFilter.pageIndex = 0;
    this.first = 0;
    this.findPatient(this.investigationForm.value);
  }

  exportPatiantsAsExcel() {
    this.exportService.exportTableAsExcel(this.tableElement, this.screenName);
  }
  // exportPatientsAsPdf() {
  //   this.exportService.exportTableAsPdf(this.tableElement, this.screenName);
  // }

  exportPatientsAsPdf() {
    let selectedGov = this.governments?.filter(
      (g) => g.id == this.selectedGovernment
    );

    let tempSelectedAdm = [this.selectedHealthAdministration];
    let selectedAdm = this.healthAdministration?.filter((g) =>
      tempSelectedAdm.includes(g.id)
    );
    selectedAdm = selectedAdm?.map((g) => g.arabicName);

    let tempSelectedIncs = this.incidentSources?.map((g) => g.id);
    let selectedIncs = this.incidentSources?.filter((g) =>
      tempSelectedIncs.includes(g.id)
    );
    selectedIncs = selectedIncs?.map((g) => g.arabicName);

    let tempSelectedDeps = this.selectedDepartments?.map((g) => g.id);
    let selectedDep = this.departments?.filter((g) =>
      tempSelectedDeps.includes(g.id)
    );
    selectedDep = selectedDep?.map((g) => g.arabicName);

    let sDate, eDate;
    // this.investigationFormfilter.startDate = this.investigationFormfilter.value.startDate;
    // this.investigationFormfilter.endDate = this.investigationFormfilter.value.endDate;

    try {
      sDate =
        this.investigationFormfilter.startDate &&
        new Date(this.investigationFormfilter.startDate).toLocaleDateString(
          'en-GB'
        );
      eDate =
        this.investigationFormfilter.endDate &&
        new Date(this.investigationFormfilter.endDate).toLocaleDateString(
          'en-GB'
        );
    } catch (error) {
      sDate = '';
      eDate = '';
    }
    this.exportService.exportTemplateAsPdf(
      document.getElementById(this.currentConfig),
      'حالات خارجية و تقصيات',
      [
        selectedGov,
        selectedAdm,
        //selectedIncs,
        //selectedDep
      ],
      [sDate, eDate]
    );
  }
}
