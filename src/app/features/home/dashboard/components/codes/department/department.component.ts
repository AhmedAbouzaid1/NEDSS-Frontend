import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { SortEvent } from 'primeng/api';
import { fromEvent, map, debounceTime, distinctUntilChanged } from 'rxjs';
import { SortOrder } from 'src/app/core/constants';
import { LookupsGetterService } from 'src/app/core/services/lookups-getter.service';
import { UserMessageService } from 'src/app/core/services/user.message.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-department',
  templateUrl: './department.component.html',
  styleUrls: ['./department.component.css'],
})
export class DepartmentComponent implements OnInit {
  governments: any;
  healthAdministration: any;
  selectedIncidentSource: any;
  selectedHealthAdministration: any;
  underDeleting = {
    arabicName: '',
    id: null
  };
  department = {
    id: null,
    code: null,
    arabicName: null,
    englishName: null,
    governmentID: null,
    healthAdministrationID: null,
    incidentSourceID: null,
    hideParams: false
  };
  departments!: any[];
  incidentSources!: any[];
  departmentFilter = {
    pageSize: 10,
    pageIndex: 0,
    sortColumn: 'code',
    sortOrder: 'desc',
    searchText: '',
    code: "",
    arabicName: "",
    englishName: "",
    incidentSourceID: null,
    governmentID: null,
    healthAdministrationID: null,
  };
  noData: boolean = true;
  loadingPanel: boolean = false;
  first: number = 0;
  last: number = 0;
  pages: number = 0;
  codeValidationMsg: string = '';
  ArabicValidationMsg: string = '';
  EnglishNameValidationMsg: string = '';

  private searchWired = false;
  @ViewChild('searchInput') set searchInput(el: ElementRef) {
    if (el && !this.searchWired) {
      this.searchWired = true;
      fromEvent(el.nativeElement, 'keyup')
        .pipe(
          map((event: any) => {
            return event.target.value;
          }),
          debounceTime(environment.DebounceWaiting),
          distinctUntilChanged()
        )
        .subscribe(() => {
          this.search();
        });
    }
  }

  constructor(
    private departmentService: LookupsGetterService,
    private translateService: TranslateService,
    private userMsg: UserMessageService,
    private lookupsService: LookupsGetterService
  ) { }

  ngOnInit() {
    this.getDepartments();
    this.getGovernments();
  }
  singleDropdownSettings = {
    singleSelection: true,
    idField: 'id',
    textField: 'arabicName',
    placeholder: "Choose",
    searchPlaceholderText: "Search Items",
    noDataAvailablePlaceholderText: "No Data",
    itemsShowLimit: 3,
    allowSearchFilter: true,
    enableCheckAll: false,

  };
  selectedGovernment: any;
  IncidentSourceSelected(event) {
    this.department.incidentSourceID = event.id;
  }
  onHealthAdministrationChanged(event) {
    this.department.healthAdministrationID = event.id;
    this.getIncidentSourcesById(event.id);
  }
  onHealthAdministrationDeChanged() {
    this.incidentSources = null;
    this.department.healthAdministrationID = null;
  }
  onIncidentSourceDeSelect() {
    this.department.incidentSourceID = null;
  }
  onGovernmentChanged(event) {

    this.department.governmentID = event.id;
    this.getHealthAdministration(event.id);
  }
  onGovernmentDeChanged() {
    this.department.governmentID = null;
    this.healthAdministration = [];
    this.onHealthAdministrationDeChanged();
  }
  search() {

    this.first = 0;
    this.departmentFilter.pageIndex = 0;
    this.last =
      this.departmentFilter.pageIndex * this.departmentFilter.pageSize;
    this.departmentFilter.code = this.department.code;
    this.departmentFilter.arabicName = this.department.arabicName;
    this.departmentFilter.englishName = this.department.englishName;
    this.departmentFilter.incidentSourceID = this.department.incidentSourceID;
    this.departmentFilter.governmentID = this.department.governmentID;
    this.departmentFilter.healthAdministrationID = this.department.healthAdministrationID;
    this.getDepartments();
  }

  getDepartments() {

    this.loadingPanel = true;
    this.departmentService.getPageDepartments(this.departmentFilter).subscribe(
      (result: any) => {
        if (result != null && result != undefined) {

          this.departments = result.data;
          if (this.departments != undefined && this.departments.length == 0) {
            this.noData = true;
            this.pages = 0;
          } else {
            this.noData = false;
            this.pages = result.data[0].totalCount;
            this.last =
              this.departmentFilter.pageIndex * this.departmentFilter.pageSize;
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

  getById(id: number) {
    this.departmentService.getDepartmentById(id).subscribe(
      (result: any) => {
        document.getElementById("depart").scrollIntoView({ behavior: 'smooth' });
        this.department = result.data;

        if (this.department.governmentID > 0) {
          this.selectedGovernment = this.governments.filter(
            item => item.id === this.department.governmentID);
          this.getHealthAdministration(this.department.governmentID);
        }
      },
      () => {
        this.translateService
          .get('NEDSS.COMMON.INTERNAL_SERVER_ERROR')
          .subscribe((res: string) => {
            this.userMsg.error(res);
          });
      }
    );
  }

  save() {

    if (this.department.id == null) {
      this.departmentService.addDepartment(this.department).subscribe(
        (response: any) => {
          if (response) {
            this.translateService
              .get('NEDSS.COMMON.SENT_SUCESSFULLY')
              .subscribe((res: string) => {
                this.userMsg.success(res);
              });
            this.getDepartments();
            this.clearSelections();
          }
        },
        (error) => {
          if (error.error?.messages?.includes("DuplicatedCode") || error?.error?.messages?.includes("DuplicatedEnglishName")
            || error.error?.messages?.includes("DuplicatedArabicName")) {
            // this.translateService
            //   .get('NEDSS.COMMON.' + error.error.messages[0])
            //   .subscribe((res: string) => {
            //     this.userMsg.error(res);
            //     if (res.includes("Code")) {
            //       this.codeValidationMsg = res;
            //     }
            //     if (res.includes("Arabic")) {
            //       this.ArabicValidationMsg = res;
            //     }

            //     if (res.includes("English")) {
            //       this.EnglishNameValidationMsg = res;
            //     }

            //   });

            error.error.messages.forEach(msg => {

              if (msg.includes("Code")) {
                this.codeValidationMsg = msg;
                this.translateService.get('NEDSS.COMMON.CODEVALIDATEMSG').subscribe((res: string) => {
                  this.userMsg.error(res);
                });
              }
              if (msg.includes("Arabic")) {
                this.ArabicValidationMsg = msg;
                this.translateService.get('NEDSS.COMMON.ARABICNAMEVALIDATEMSG').subscribe((res: string) => {
                  this.userMsg.error(res);
                });
              }

              if (msg.includes("English")) {
                this.EnglishNameValidationMsg = msg;
                this.translateService.get('NEDSS.COMMON.ENGLISHNAMEVALIDATEMSG').subscribe((res: string) => {
                  this.userMsg.error(res);
                });
              }

              // this.userMsg.error('NEDSS.COMMO.' + msg);


            });
          } else {
            this.translateService
              .get('NEDSS.COMMON.SENT_FAILD')
              .subscribe((res: string) => {
                this.userMsg.error(res);
              });
          }
        }
      );
    } else this.update();
  }

  update() {
    this.departmentService.updateDepartment(this.department).subscribe(
      (response: any) => {
        if (response?.statusCode == 500) {
          //this.userMsg.error(res);

          // this.translateService
          //   .get('NEDSS.COMMON.' + response.messages[0])
          //   .subscribe((res: string) => {
          //     this.userMsg.error(res);
          //   });
          // this.translateService
          //   .get('NEDSS.COMMON.SENT_FAILD')
          //   .subscribe((res: string) => {
          //     this.userMsg.error(res);
          //   });
          response.messages.forEach(msg => {
            this.translateService.get('NEDSS.HOME.USERS.ADD_USER.' + msg).subscribe(res => {
              if (msg.includes("Code")) {
                this.codeValidationMsg = msg;
                this.translateService.get('NEDSS.COMMON.CODEVALIDATEMSG').subscribe((res: string) => {
                  this.userMsg.error(res);
                });
              }
              if (msg.includes("Arabic")) {
                this.ArabicValidationMsg = msg;
                this.translateService.get('NEDSS.COMMON.ARABICNAMEVALIDATEMSG').subscribe((res: string) => {
                  this.userMsg.error(res);
                });
              }

              if (msg.includes("English")) {
                this.EnglishNameValidationMsg = msg;
                this.translateService.get('NEDSS.COMMON.ENGLISHNAMEVALIDATEMSG').subscribe((res: string) => {
                  this.userMsg.error(res);
                });
              }

              // this.userMsg.error('NEDSS.COMMO.' + msg);

            });
          });

          return;
        }
        if (response) {
          this.translateService
            .get('NEDSS.COMMON.UPDATE_SUCESSFULLY')
            .subscribe((res: string) => {
              this.userMsg.success(res);
            });
          this.getDepartments();
          this.clearSelections();
        }
      },
      (error) => {
        if (error.error?.messages?.includes("DuplicatedCode") || error?.error?.messages?.includes("DuplicatedEnglishName")
          || error.error?.messages?.includes("DuplicatedArabicName")) {
          // this.translateService
          //   .get('NEDSS.COMMON.' + error.error.messages[0])
          //   .subscribe((res: string) => {
          //     this.userMsg.error(res);
          //   });
          error.error.messages.forEach(msg => {

            if (msg.includes("Code")) {
              this.codeValidationMsg = msg;
              this.translateService.get('NEDSS.COMMON.CODEVALIDATEMSG').subscribe((res: string) => {
                this.userMsg.error(res);
              });
            }
            if (msg.includes("Arabic")) {
              this.ArabicValidationMsg = msg;
              this.translateService.get('NEDSS.COMMON.ARABICNAMEVALIDATEMSG').subscribe((res: string) => {
                this.userMsg.error(res);
              });
            }

            if (msg.includes("English")) {
              this.EnglishNameValidationMsg = msg;
              this.translateService.get('NEDSS.COMMON.ENGLISHNAMEVALIDATEMSG').subscribe((res: string) => {
                this.userMsg.error(res);
              });
            }

            // this.userMsg.error('NEDSS.COMMO.' + msg);


          });
        } else {
          this.translateService
            .get('NEDSS.COMMON.SENT_FAILD')
            .subscribe((res: string) => {
              this.userMsg.error(res);
            });
        }
      }
    );
  }

  sort(event: SortEvent) {
    if (
      event.order == -1 &&
      this.departmentFilter.sortOrder != SortOrder.desc
    ) {
      this.departmentFilter.sortOrder = SortOrder.desc;
      if (typeof event.field === 'string')
        this.departmentFilter.sortColumn = event.field;
      this.getDepartments();
    } else if (
      event.order == 1 &&
      this.departmentFilter.sortOrder != SortOrder.asc
    ) {
      this.departmentFilter.sortOrder = SortOrder.asc;
      if (typeof event.field === 'string')
        this.departmentFilter.sortColumn = event.field;
      this.getDepartments();
    }
  }
  paginate(event: any) {
    this.first = event.first;
    this.last = event.last;
    this.departmentFilter.pageIndex = event.page;
    this.departmentFilter.pageSize = event.rows;
    this.getDepartments();
  }

  delete(id: number) {
    this.departmentService.deleteDepartment(id).subscribe(
      (result: any) => {
        this.getDepartments();
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
  clearSelections() {
    this.department = {
      id: null,
      code: null,
      arabicName: null,
      englishName: null,
      governmentID: null,
      healthAdministrationID: null,
      incidentSourceID: null,
      hideParams: false,
    };
    this.selectedGovernment = null;
    this.selectedHealthAdministration = null;
    this.selectedIncidentSource = null;
  }

  clearSearch() {
    this.departmentFilter.searchText = '';
    this.search();
  }
  nameToDelete(ele) {
    this.underDeleting.id = ele.id;
    this.underDeleting.arabicName = ele.arabicName;
  }

  //lookUps
  getGovernments() {
    this.lookupsService.getAllGovernments().subscribe((result: any) => {
      if (result != null && result != undefined) {
        this.governments = result.data;

        if (this.department.governmentID > 0) {
          this.selectedGovernment = this.governments.filter(
            item => item.id === this.department.governmentID);
        }
      }
      this.loadingPanel = false;
    }, error => {
      this.loadingPanel = false;
      this.translateService.get('NEDSS.COMMON.INTERNAL_SERVER_ERROR').subscribe((res: string) => {
        this.userMsg.error(res);
      });
    });
  }

  getHealthAdministration(governmentID: any) {
    this.lookupsService.getPageHealthAdministrations({ governmentID: governmentID }).subscribe((result: any) => {
      if (result != null && result != undefined) {
        this.healthAdministration = result.data;
        if (this.department.healthAdministrationID > 0) {
          this.selectedHealthAdministration = this.healthAdministration.filter(
            item => item.id === this.department.healthAdministrationID);
          this.getIncidentSourcesById(this.department.healthAdministrationID);
        }
      }
      this.loadingPanel = false;
    }, error => {
      this.loadingPanel = false;
      this.translateService.get('NEDSS.COMMON.INTERNAL_SERVER_ERROR').subscribe((res: string) => {
        this.userMsg.error(res);
      });
    });
  }

  getIncidentSourcesById(healthAdministrationID: any) {
    //reportingOrResidence: 1 
    this.lookupsService.getPageIncidentSourceHospitals({ healthAdministrationID: healthAdministrationID }).subscribe((result: any) => {
      if (result != null && result != undefined) {
        this.incidentSources = result.data;
        if (this.department.incidentSourceID > 0) {
          this.selectedIncidentSource = this.incidentSources.filter(
            item => item.id === this.department.incidentSourceID);
        }
      }
      this.loadingPanel = false;
    }, error => {
      this.loadingPanel = false;
      this.translateService.get('NEDSS.COMMON.INTERNAL_SERVER_ERROR').subscribe((res: string) => {
        this.userMsg.error(res);
      });
    });
  }

  codeChange() {

    this.codeValidationMsg = '';
  }
  arabicNameChange() {

    this.ArabicValidationMsg = '';
  }
  englishNameChange() {

    this.EnglishNameValidationMsg = '';
  }
}
