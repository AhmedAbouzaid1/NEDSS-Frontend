import { LookupsGetterService } from './../../../../../../core/services/lookups-getter.service';
import { UserMessageService } from './../../../../../../core/services/user.message.service';
import { TranslateService } from '@ngx-translate/core';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { fromEvent } from 'rxjs/internal/observable/fromEvent';
import { map } from 'rxjs/internal/operators/map';
import { environment } from 'src/environments/environment';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { SortEvent } from 'primeng/api';
import { CHARTS, DASHBOARDCaRDS, SortOrder } from 'src/app/core/constants';

@Component({
  selector: 'app-dashBoard-Controlers',
  templateUrl: './dashBoard-Controlers.component.html',
  styleUrls: ['./dashBoard-Controlers.component.css'],
})
export class DashBoardControlersComponent implements OnInit {
  disableGovernment: boolean;
  disableAdmin: boolean;
  disableIncidentSrc: boolean;
  requiredField: boolean = false;
  requiredField2: boolean = false;
  dashBoardCards = DASHBOARDCaRDS;
  selectedDashBoardCards;
  underDeleting = {
    arabicName: '',
    id: null,
  };
  deviceCategory = {
    id: null,
    code: null,
    arabicName: null,
    englishName: null,
  };
  deviceCategorys!: any[];
  selectedCharts: any[] = [];
  deviceCategoryFilter = {
    pageSize: 10,
    pageIndex: 0,
    sortColumn: '',
    sortOrder: '',
    searchText: '',
    code: '',
    arabicName: '',
    englishName: '',
  };
  multipleuserSettings = {
    singleSelection: false,
    idField: 'id',
    textField: 'fullName',
    selectAllText: 'Select All',
    unSelectAllText: 'UnSelect All',
    enableCheckAll: true,
    placeholder: 'Choose',
    searchPlaceholderText: 'Search Items',
    noDataAvailablePlaceholderText: 'No Data',
    itemsShowLimit: 3,
    allowSearchFilter: true,
  };
  multipleDropdownSettings = {
    singleSelection: false,
    idField: 'id',
    textField: 'arabicName',
    selectAllText: 'Select All',
    unSelectAllText: 'UnSelect All',
    placeholder: 'Choose',
    searchPlaceholderText: 'Search Items',
    noDataAvailablePlaceholderText: 'No Data',
    itemsShowLimit: 3,
    allowSearchFilter: true,
    enableCheckAll: true,
  };
  singleDropdownSettings = {
    singleSelection: true,
    idField: 'id',
    textField: 'arabicName',
    placeholder: 'Choose',
    searchPlaceholderText: 'Search Items',
    noDataAvailablePlaceholderText: 'No Data',
    itemsShowLimit: 3,
    allowSearchFilter: true,
    enableCheckAll: false,
  };
  loadingPanel: boolean;
  governmentsLoading: boolean = false;
  healthAdministrationLoading: boolean = false;
  incidentSourcesLoading: boolean = false;
  organizationsLoading: boolean = false;
  usersLoading: boolean = false;
  governments!: any[];
  selectedGovernment: any[];
  incidentSources!: any[];
  selectedIncidentSource: any[];
  healthAdministration: any;
  selectedHealthAdministration: any[];
  noData: boolean = true;
  filterdData: any[] = [];
  myDatalength = this.filterdData.length;

  first: number = 0;
  last: number = 0;
  pages: number = 0;
  charts = CHARTS;
  arabicName;
  englishName;
  @ViewChild('searchInput', { static: true }) searchInput!: ElementRef;
  organizations: any;
  users: any;

  selectedLevel: any;
  selectedOrganization: any;
  selectedUsers: any[] = [];
  userFilter: any = {
    organizationId: null,
    levelId: null,
    govenmentId: null,
    healthAdministrationId: null,
    incidentSourceId: null,
  };
  AllDashBoards: any[] = [];
  Dashslength = this.AllDashBoards.length;
  DashBoardFilter: any;
  charsIds: any[] = [];
  cardsIds: any[] = [];
  UsersIds: any[] = [];
  isUpdating: boolean = false;
  currentId: any;
  updateFilter: any;
  constructor(
    private deviceCategoryService: LookupsGetterService,
    private translateService: TranslateService,
    private userMsg: UserMessageService
  ) { }

  ngOnInit() {
    this.disableGovernment = true;
    this.disableAdmin = true;
    this.disableIncidentSrc = true;

    this.getOrganization();
    this.getGovernments();
    this.getAllDashBoards();
    fromEvent(this.searchInput.nativeElement, 'keyup')
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

  search() {
    this.first = 0;
    this.deviceCategoryFilter.pageIndex = 0;
    this.last =
      this.deviceCategoryFilter.pageIndex * this.deviceCategoryFilter.pageSize;
    this.deviceCategoryFilter.code = this.deviceCategory.code;
    this.deviceCategoryFilter.arabicName = this.deviceCategory.arabicName;
    this.deviceCategoryFilter.englishName = this.deviceCategory.englishName;
  }

  getGovernments() {
    this.governmentsLoading = true;
    this.deviceCategoryService.getAllGovernments().subscribe(
      (result: any) => {
        if (result != null && result != undefined) {
          this.governments = result.data;
        }
        this.loadingPanel = false;
        this.governmentsLoading = false;
      },
      (error) => {
        this.loadingPanel = false;
        this.governmentsLoading = false;
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
    this.deviceCategoryService
      .getPageHealthAdministrations({ governmentID: governmentID })
      .subscribe(
        (result: any) => {
          if (result != null && result != undefined) {
            this.healthAdministration = result.data;
          }
          this.loadingPanel = false;
          this.healthAdministrationLoading = false;
        },
        (error) => {
          this.loadingPanel = false;
          this.healthAdministrationLoading = false;
          this.translateService
            .get('NEDSS.COMMON.INTERNAL_SERVER_ERROR')
            .subscribe((res: string) => {
              this.userMsg.error(res);
            });
        }
      );
  }
  getIncidentSources(healthAdministrationID: any) {
    this.incidentSourcesLoading = true;
    this.deviceCategoryService
      .getPageIncidentSourceHospitals({
        healthAdministrationID: healthAdministrationID,
        reportingOrResidence: 1,
      })
      .subscribe(
        (result: any) => {
          if (result != null && result != undefined) {
            this.incidentSources = result.data;
          }
          this.loadingPanel = false;
          this.incidentSourcesLoading = false;
        },
        (error) => {
          this.loadingPanel = false;
          this.incidentSourcesLoading = false;
          this.translateService
            .get('NEDSS.COMMON.INTERNAL_SERVER_ERROR')
            .subscribe((res: string) => {
              this.userMsg.error(res);
            });
        }
      );
  }
  onGovernmentChanged() {
    if (this.selectedGovernment.length > 0) {
      this.getHealthAdministration(this.selectedGovernment[0].id);
      this.onincidentSourcesChanged();
    } else {
      this.healthAdministration = [];
    }
  }
  onHealthAdministrationChanged() {
    if (this.selectedHealthAdministration.length > 0) {
      this.getIncidentSources(this.selectedHealthAdministration[0].id);
      this.onincidentSourcesChanged();
    } else {
      this.incidentSources = [];
    }
  }
  getOrganization() {
    this.organizationsLoading = true;
    this.deviceCategoryService.getAllOrganizations().subscribe(
      (result: any) => {
        if (result != null && result != undefined) {
          this.organizations = result.data;
        }
        this.loadingPanel = false;
        this.organizationsLoading = false;
      },
      (error) => {
        this.loadingPanel = false;
        this.organizationsLoading = false;
        this.translateService
          .get('NEDSS.COMMON.INTERNAL_SERVER_ERROR')
          .subscribe((res: string) => {
            this.userMsg.error(res);
          });
      }
    );
  }

  getById(id: number) {
    this.deviceCategoryService.getDeviceCategoryById(id).subscribe(
      (result: any) => {
        this.deviceCategory = result.data;
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
    if (this.deviceCategory.id == null) {
      this.deviceCategoryService
        .addDeviceCategory(this.deviceCategory)
        .subscribe(
          (response: any) => {
            if (response) {
              this.translateService
                .get('NEDSS.COMMON.SENT_SUCESSFULLY')
                .subscribe((res: string) => {
                  this.userMsg.success(res);
                });

              this.deviceCategory = {
                id: null,
                code: null,
                arabicName: null,
                englishName: null,
              };
            }
          },
          (error) => {
            if (error.error?.messages?.includes("DuplicatedCode") || error?.error?.messages?.includes("DuplicatedEnglishName")
              || error.error?.messages?.includes("DuplicatedArabicName")) {
              this.translateService
                .get('NEDSS.COMMON.' + error.error.messages[0])
                .subscribe((res: string) => {
                  this.userMsg.error(res);
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
    this.deviceCategoryService
      .updateDeviceCategory(this.deviceCategory)
      .subscribe(
        (response: any) => {
          if (response) {
            this.translateService
              .get('NEDSS.COMMON.UPDATE_SUCESSFULLY')
              .subscribe((res: string) => {
                this.userMsg.success(res);
              });

            this.deviceCategory = {
              id: null,
              code: null,
              arabicName: null,
              englishName: null,
            };
          }
        },
        (error) => {
          if (error.error?.messages?.includes("DuplicatedCode") || error?.error?.messages?.includes("DuplicatedEnglishName")
            || error.error?.messages?.includes("DuplicatedArabicName")) {
            this.translateService
              .get('NEDSS.COMMON.' + error.error.messages[0])
              .subscribe((res: string) => {
                this.userMsg.error(res);
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
      this.deviceCategoryFilter.sortOrder != SortOrder.desc
    ) {
      this.deviceCategoryFilter.sortOrder = SortOrder.desc;
      if (typeof event.field === 'string')
        this.deviceCategoryFilter.sortColumn = event.field;
    } else if (
      event.order == 1 &&
      this.deviceCategoryFilter.sortOrder != SortOrder.asc
    ) {
      this.deviceCategoryFilter.sortOrder = SortOrder.asc;
      if (typeof event.field === 'string')
        this.deviceCategoryFilter.sortColumn = event.field;
    }
  }
  paginate(event: any) {
    this.first = event.first;
    this.last = event.last;
    //add one as primeng pagination is zero based ,so we convert it to one based to fit with the API
    this.deviceCategoryFilter.pageIndex = event.page;
    this.deviceCategoryFilter.pageSize = event.rows;
  }

  delete(id: number) {
    this.deviceCategoryService.deleteDeviceCategory(id).subscribe(
      (result: any) => {
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
  onincidentSourcesChanged() {
    if (this.selectedOrganization) {
      this.userFilter.organizationId = this.selectedOrganization;
    }
    if (this.selectedLevel) {
      this.userFilter.levelId = this.selectedLevel;
      this.disableGovernment = true;
      this.disableAdmin = true;
      this.disableIncidentSrc = true;

      if (this.userFilter.levelId == 2) {
        this.disableGovernment = false;
      }
      else if (this.userFilter.levelId == 3) {
        this.disableGovernment = false;
        this.disableAdmin = false;
      }
      else if (this.userFilter.levelId != 1) {
        this.disableGovernment = false;
        this.disableAdmin = false;
        this.disableIncidentSrc = false;
      }
    }
    if (this.selectedGovernment) {
      this.userFilter.govenmentId = this.selectedGovernment[0].id;
    }
    if (this.selectedHealthAdministration) {
      this.userFilter.healthAdministrationId =
        this.selectedHealthAdministration[0].id;
    }
    if (this.selectedIncidentSource) {
      this.userFilter.incidentSourceId = this.selectedIncidentSource[0].id;
    }

    this.usersLoading = true;
    this.deviceCategoryService.getPageUsers(this.userFilter).subscribe(
      (result: any) => {
        this.users = result.data;
        this.usersLoading = false;
      },
      (error) => {
        this.usersLoading = false;
        console.log(error);
      }
    );
  }

  onUserChanged(x): void {
    if (Array.isArray(x)) {
      x.forEach((element) => {
        if (!this.filterdData.find((e) => e.id === element.id)) {
          this.filterdData.push(element);
        }
      });
    } else {
      if (!this.filterdData.find((e) => e.id === x.id)) {
        this.filterdData.push(x);
      }
    }

    this.myDatalength = this.filterdData.length;
    this.selectedOrganization = null;

    this.selectedLevel = null;

    this.selectedGovernment = null;

    this.selectedHealthAdministration = null;
    this.selectedIncidentSource = null;
    setTimeout(() => {
      this.selectedUsers = [];
    }, 200);
  }
  DeleteUser(item) {
    this.filterdData = this.filterdData.filter((m) => m.id != item.id);
    this.myDatalength = this.filterdData.length;
  }
  clearSearch() {
    this.deviceCategoryFilter.searchText = '';
    this.search();
  }

  nameToDelete(ele) {
    this.underDeleting.id = ele.id;
    this.underDeleting.arabicName = ele.arabicName;
  }

  getAllDashBoards() {
    this.deviceCategoryService.getAllDashBoards().subscribe(
      (result: any) => {
        this.AllDashBoards = result.data;
        this.Dashslength = this.AllDashBoards.length;
      },
      (error) => {
        console.log(error);
      }
    );
  }
  AddDashBoard() {

    if (this.isUpdating && this.currentId) {
      this.updateChart();
    } else {
      this.selectedCharts.forEach((el) => {
        this.charsIds.push(el.id);
      });
      this.selectedDashBoardCards.forEach((el) => {
        this.cardsIds.push(el.id);
      });
      this.filterdData.forEach((el) => {
        this.UsersIds.push(el.id);
      });
      this.DashBoardFilter = {
        arabicName: this.arabicName,
        englishName: this.englishName,
        chartNumbers: this.charsIds,
        cardNumbers: this.cardsIds,
        user_Id: this.UsersIds,
      };
      this.deviceCategoryService.addDashBoard(this.DashBoardFilter).subscribe(
        (result: any) => {
          console.log(result);
          this.getAllDashBoards();
          this.arabicName = '';
          this.englishName = '';
          this.charsIds = [];
          this.cardsIds = [];
          this.UsersIds = [];
          this.filterdData = [];
          this.selectedUsers = [];
          this.selectedCharts = [];
          this.selectedDashBoardCards = [];
        },
        (error) => {
          console.log(error);
        }
      );
    }
  }

  // scrollToTop():void {
  //   window.scroll({
  //     top:0,
  //     behavior: 'smooth'
  //   });
  // }

  editDashBoard(item) {
    this.isUpdating = true;
    this.currentId = item.id;
    this.deviceCategoryService.getDashBoardById(item.id).subscribe(
      (result: any) => {
        this.arabicName = result.data.arabicName;
        this.englishName = result.data.englishName;
        this.selectedCharts = this.charts.filter((m) =>
          result.data.chartNumbers.includes(m.id)
        );
        this.filterdData = result.data.systemUserDtos;
        this.selectedDashBoardCards = this.dashBoardCards.filter((m) =>
          result.data.cardNumbers.includes(m.id)
        );

      },
      (error) => {
        console.log(error);
      }
    );
    window.scroll({
      top: 0,
      behavior: 'smooth'
    });

  }

  updateChart() {
    this.selectedCharts.forEach((el) => {
      this.charsIds.push(el.id);
    });
    this.selectedDashBoardCards.forEach((el) => {
      this.cardsIds.push(el.id);
    });
    this.filterdData.forEach((el) => {
      this.UsersIds.push(el.id);
    });
    this.updateFilter = {
      id: this.currentId,
      arabicName: this.arabicName,
      englishName: this.englishName,
      chartNumbers: this.charsIds,
      cardNumbers: this.cardsIds,
      user_Id: this.UsersIds,
    };
    this.deviceCategoryService.UpdateDashBoardById(this.updateFilter).subscribe(
      (result: any) => {
        console.log(result);
        this.getAllDashBoards();
        this.currentId = null;
        this.isUpdating = false;
        this.arabicName = '';
        this.englishName = '';
        this.charsIds = [];
        this.cardsIds = [];
        this.filterdData = [];
        this.UsersIds = [];
        this.selectedUsers = [];
        this.selectedCharts = [];
        this.selectedDashBoardCards = [];
      },
      (error) => {
        console.log(error);
      }
    );
  }
  deleteChart(id) {
    this.deviceCategoryService.DeleteDashBoardById(id).subscribe(
      (result: any) => {
        console.log(result);
        this.getAllDashBoards();
      },
      (error) => {
        console.log(error);
      }
    );
  }
  setStatus() {

    (this.selectedDashBoardCards.length > 0) ? this.requiredField = true : this.requiredField = false;
  }

  onItemSelect(item: any) {
    //Do something if required
    this.setClass();
  }
  onSelectAll(items: any) {
    //Do something if required
    this.setClass();
  }

  setClass() {
    this.setStatus();
    if (this.selectedDashBoardCards.length > 0) { return 'validField' }
    else { return 'invalidField' }
  }




  setStatus2() {

    (this.selectedCharts.length > 0) ? this.requiredField2 = true : this.requiredField2 = false;
  }

  onItemSelect2(item: any) {
    //Do something if required
    this.setClass2();
  }
  onSelectAll2(items: any) {
    //Do something if required
    this.setClass2();
  }

  setClass2() {
    this.setStatus2();
    if (this.selectedCharts.length > 0) { return 'validField' }
    else { return 'invalidField' }
  }
}
