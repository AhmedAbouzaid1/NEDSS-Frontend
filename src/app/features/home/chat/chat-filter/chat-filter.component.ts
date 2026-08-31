import { Organiztion } from './../Models/organiztion';
import { HealthAdministrationDTO } from './../../../Models/health-administration';
import { Component, Input, OnInit, Output, EventEmitter, OnChanges } from '@angular/core';
import { ChatDto } from '../Models/ChatDto';
import { UserService } from '../../users/Services/user.service';
import { ChatService } from '../Service/ChatService.service';
import { HttpClient, HttpEventType, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { TranslateService } from '@ngx-translate/core';
import { UserMessageService } from 'src/app/core/services/user.message.service';
import { LookupsGetterService } from 'src/app/core/services/lookups-getter.service';
import { environment } from 'src/environments/environment';
import { Result } from 'src/app/features/Result';
import { GovernmentDTO } from '../Models/government-dto';
import { IncidentSourceHospitalDTO } from '../Models/incident-source-hospital-dto';
import { SystemUser, SystemUserDTO, SystemUserDataDto } from '../Models/UserDto';
import { FilterSystemUserDTO } from '../Models/filter-system-user-dto';
import { UserLevel } from '../Models/user-level';
import { IncidentSourceTypeDTO } from 'src/app/models/incident-source-type-dto';
import { ChatFilter } from 'src/app/models/chat-filter';

@Component({
  selector: 'app-chat-filter',
  templateUrl: './chat-filter.component.html',
  styleUrls: ['./chat-filter.component.css']
})
export class ChatFilterComponent implements OnInit, OnChanges {
  @Input() update: number = -1;
  @Input() currentUsers: SystemUser[] = [];
  @Input() userID: number = 0;
  @Input() user: SystemUserDTO = {};
  @Input() selectedUsers: any = [];
  @Output() usersOut = new EventEmitter<SystemUserDataDto[]>();
  @Output() chatNameOut = new EventEmitter<string>();
  chatName: string = "";
  chatFilter: ChatFilter = {};
  _chatFilter: ChatFilter = {};
  firstRun: boolean = true;
  newChat: ChatDto = {};
  organizations: Organiztion[] = [];
  governments: GovernmentDTO[] = [];
  healthAdmins: HealthAdministrationDTO[] = [];
  healthAdminsBak: HealthAdministrationDTO[] = [];
  incidentSources: IncidentSourceHospitalDTO[] = [];
  incidentSourceTypes: IncidentSourceTypeDTO[] = [];
  usersAvailableForChat: SystemUserDataDto[] = [];
  usersFilter: FilterSystemUserDTO = {};
  organizationID: number = -1;
  govID: number = -1;
  adminID: number = -1;
  incidentSourceID: number = -1;
  incidentSourceTypeIDs: IncidentSourceTypeDTO[] = [];
  organizationIDs: Organiztion[] = [];
  governmentIDs: GovernmentDTO[] = [];
  healthAdminIDs: HealthAdministrationDTO[] = [];
  incidentSourceIDs: IncidentSourceHospitalDTO[] = [];
  chosenUsers: SystemUserDataDto[] = [];
  tempUsers: SystemUserDataDto[] = [];
  filePath: string = "";
  imageUploaded: boolean = false;
  attachUploaded: boolean = false;
  loadingPanel: boolean = false;
  organizationsLoading = false;
  governmentsLoading = false;
  healthAdminsLoading = false;
  incidentSourcesLoading = false;
  incidentSourceTypesLoading = false;
  usersLoading = false;

  singleDropdownSettings = {
    singleSelection: true,
    idField: 'id',
    textField: 'arabicName',
    placeholder: "Choose",
    searchPlaceholderText: "Search Items",
    noDataAvailablePlaceholderText: "No Data",
    allowSearchFilter: true,
    enableCheckAll: false,
  };
  multipleDropdownSettings = {
    singleSelection: false,
    idField: 'id',
    textField: 'arabicName',
    selectAllText: 'Select All',
    unSelectAllText: 'UnSelect All',
    placeholder: "Choose",
    searchPlaceholderText: "Search Items",
    noDataAvailablePlaceholderText: "No Data",
    itemsShowLimit: 3,
    allowSearchFilter: true,
    enableCheckAll: true,
  };
  multipleUserSettings = {
    singleSelection: false,
    idField: 'id',
    textField: 'fullName',
    selectAllText: 'Select All',
    unSelectAllText: 'UnSelect All',
    placeholder: "Choose",
    searchPlaceholderText: "Search Items",
    noDataAvailablePlaceholderText: "No Data",
    itemsShowLimit: 3,
    allowSearchFilter: true,
    enableCheckAll: true,
  };

  constructor(private userService: UserService, private chatService: ChatService, private http: HttpClient,
    private lookupsService: LookupsGetterService, private userMsg: UserMessageService,
    private translateService: TranslateService) { }
  ngOnInit() {
    this.chatFilter.currentUserLevelID = 0;
    this.chatFilter.departmentId = [];
    this.chatFilter.govenmentId = [];
    this.chatFilter.healthAdministrationId = [];
    this.chatFilter.incidentSourceId = [];
    this.chatFilter.levelId = [];
    this.chatFilter.organizationId = [];
    this.chatFilter.positionId = [];
    this.chatFilter.roleId = [];

    if (this.selectedUsers.length > 0)
      this.chosenUsers = this.selectedUsers;
  }
  ngOnChanges() {
    console.log(this.user);
  }
  loadGovsAdmins() {
    if (this.selectedUsers.length > 0)
      this.chosenUsers = this.selectedUsers;
    //console.log(this.governments);
    //console.log(this.governments.length);
    this.usersAvailableForChat = [];
    if (this.governments.length < 1) {
      //this.user = this.currentUsers.filter(x => x.id == this.userID)[0];
      this.getOrganizations()
      this.getGovernments();
      this.getHealthAdministration();
      this.GetIncidentSourceTypes();
      //this.getAllUsersForChat();
    }
    switch (this.user.levelId) {
      case UserLevel.Ministry:
        this.govID = -1;
        this.adminID = -1;
        this.incidentSourceID = -1;
        break;
      case UserLevel.Government:
        this.govID = this.user.govenmentId;
        this.adminID = -1;
        this.incidentSourceID = -1;
        // this.governments = this.governments.filter(x => x.id == this.govID);
        // this.healthAdmins = this.healthAdmins.filter(x => x.governmentID == this.govID);
        break;
      case UserLevel.HealthAdministration:
        this.govID = this.user.govenmentId;
        this.adminID = this.user.healthAdministrationId;
        this.incidentSourceID = -1;
        // this.governments = this.governments.filter(x => x.id == this.govID);
        // this.healthAdmins = this.healthAdmins.filter(x => x.id == this.adminID);
        break;
      case UserLevel.IncidentSources:
        this.govID = this.user.govenmentId;
        this.adminID = this.user.healthAdministrationId;
        this.incidentSourceID = this.user.incidentSourceId;
        // this.governments = this.governments.filter(x => x.id == this.govID);
        // this.healthAdmins = this.healthAdmins.filter(x => x.id == this.adminID);

        // this.incidentSourceID = this.user.incidentSourceId;
        // this.incidentSources = this.incidentSources.filter(x => x.id == this.user.incidentSourceId);
        break;
    }
  }
  getOrganizations() {
    this.organizationsLoading = true;
    this.lookupsService.getAllOrganizations().subscribe({
      next: (r: Result<Organiztion[]>) => {
        this.organizations = r.data;
        this.organizationsLoading = false;
        this.loadingPanel = false;
      },
      error: error => {
        this.organizationsLoading = false;
        this.loadingPanel = false;
        this.translateService.get('NEDSS.COMMON.INTERNAL_SERVER_ERROR').subscribe((res: string) => {
          this.userMsg.error(res);
        });
      },
      complete: () => this.loadingPanel = false
    })
  }
  getGovernments() {
    this.governmentsLoading = true;
    this.lookupsService.getAllGovernments().subscribe({
      next: (result: Result<GovernmentDTO[]>) => {
        if (result != null && result != undefined) {
          this.governments = result.data;
        }
        this.governmentsLoading = false;
        this.loadingPanel = false;
      },
      error: error => {
        this.governmentsLoading = false;
        this.loadingPanel = false;
        this.translateService.get('NEDSS.COMMON.INTERNAL_SERVER_ERROR').subscribe((res: string) => {
          this.userMsg.error(res);
        });
      },
      complete: () => {
        if (this.user.levelId == UserLevel.Government || this.user.levelId == UserLevel.HealthAdministration
          || this.user.levelId == UserLevel.IncidentSources) {
          this.governments = this.governments.filter(x => x.id == this.user.govenmentId);
          this.govID = this.user.govenmentId;
        }
      }
    });
  }
  getHealthAdministration() {
    this.healthAdminsLoading = true;
    this.lookupsService.getAllHealthAdministrations().subscribe({
      next: (result: Result<HealthAdministrationDTO[]>) => {
        if (result != null && result != undefined) {
          //this.healthAdmins = result.data;
          this.healthAdminsBak = result.data;
        }
        this.healthAdminsLoading = false;
        this.loadingPanel = false;
      },
      error: error => {
        this.healthAdminsLoading = false;
        this.loadingPanel = false;
        this.translateService.get('NEDSS.COMMON.INTERNAL_SERVER_ERROR').subscribe((res: string) => {
          this.userMsg.error(res);
        });
      },
      complete: () => {
        this.healthAdmins = this.healthAdminsBak;
        //console.log("Before filter");
        //console.log(this.healthAdmins);

        if (this.user.levelId == UserLevel.HealthAdministration || this.user.levelId == UserLevel.IncidentSources) {
          this.healthAdmins = this.healthAdminsBak.filter(x => x.id == this.user.healthAdministrationId);
          this.adminID = this.user.healthAdministrationId;
        }
        //console.log("After filter");
        //console.log(this.healthAdmins);
      }
    });
  }

  FilterAdministrations() {
    if (this.govID == 0) {
      this.healthAdmins = this.healthAdminsBak;
      //this.getAllUsersForChat();
    }
    else {
      this.healthAdmins = this.healthAdminsBak.filter(x => x.governmentID === this.govID);
      //this.getAllUsersForChat();
    }
  }
  FilterIncidentSources() {
    if (this.adminID == 0 && this.govID == 0 && this.organizationID == 0) {
      this.GetAllIncidentSources();
    }
    else if (this.adminID == 0 && this.govID > 0) {
      this.incidentSourcesLoading = true;
      this.lookupsService.getIncidentSourceHospitalsByGovID(this.govID).subscribe({
        next: (result: Result<IncidentSourceHospitalDTO[]>) => {
          if (result != null && result != undefined) {
            this.incidentSources = result.data;
          }
          this.incidentSourcesLoading = false;
          this.loadingPanel = false;
        },
        error: error => {
          this.incidentSourcesLoading = false;
          this.loadingPanel = false;
          this.translateService.get('NEDSS.COMMON.INTERNAL_SERVER_ERROR').subscribe((res: string) => {
            this.userMsg.error(res);
          });
        },
        complete: () => {
          if (this.organizationID > 0) {
            this.incidentSources = this.incidentSources.filter(x => x.organizationID == this.organizationID);
          }
        }
      });
    }
    else {
      this.incidentSourcesLoading = true;
      this.lookupsService.getIncidentSourceHospitalsByAdminID(this.adminID).subscribe({
        next: (result: Result<IncidentSourceHospitalDTO[]>) => {
          if (result != null && result != undefined) {
            this.incidentSources = result.data;
          }
          this.incidentSourcesLoading = false;
          this.loadingPanel = false;
        },
        error: error => {
          this.incidentSourcesLoading = false;
          this.loadingPanel = false;
          this.translateService.get('NEDSS.COMMON.INTERNAL_SERVER_ERROR').subscribe((res: string) => {
            this.userMsg.error(res);
          });
        },
        complete: () => {
          if (this.organizationID > 0) {
            this.incidentSources = this.incidentSources.filter(x => x.organizationID == this.organizationID);
          }
        }
      });
    }

  }
  GetAllIncidentSources() {
    this.incidentSourcesLoading = true;
    this.lookupsService.getAllIncidentSourceHospitals().subscribe({
      next: (result: Result<IncidentSourceHospitalDTO[]>) => {
        if (result != null && result != undefined) {
          this.incidentSources = result.data;
        }
        this.incidentSourcesLoading = false;
        this.loadingPanel = false;
      },
      error: error => {
        this.incidentSourcesLoading = false;
        this.loadingPanel = false;
        this.translateService.get('NEDSS.COMMON.INTERNAL_SERVER_ERROR').subscribe((res: string) => {
          this.userMsg.error(res);
        });
      },
      complete: () => {
        if (this.user.levelId == UserLevel.IncidentSources) {
          this.incidentSources = this.incidentSources.filter(x => x.id == this.user.incidentSourceId);
        }
      }
    });
  }
  getAllUsersForChat() {
    this.usersFilter.organizationId = (this.organizationID > 0) ? this.organizationID : null;
    this.usersFilter.govenmentId = (this.govID > 0) ? this.govID : null;
    this.usersFilter.healthAdministrationId = (this.adminID > 0) ? this.adminID : null;
    this.usersFilter.incidentSourceId = (this.incidentSourceID > 0) ? this.incidentSourceID : null;
    //this.usersFilter.pageSize = 50;
    //this.usersFilter.pageIndex = 1;
    console.log(this.usersFilter);
    this.usersLoading = true;
    this.userService.getPageUsers(this.usersFilter).subscribe({
      next: (res: Result<SystemUserDataDto[]>) => {
        //console.log("Get page users");
        //console.log(res.data);
        if (res.data.length == 0) {
          this.usersLoading = false;
          return;
        }

        this.usersAvailableForChat = res.data;
        this.usersAvailableForChat = this.usersAvailableForChat.filter(item => !(item?.id == this.userID));
        this.usersAvailableForChat = this.usersAvailableForChat.filter(item =>
          (item?.levelId != null) && (item?.levelId != undefined) && (item?.levelId > this.user.levelId));
        this.usersAvailableForChat.forEach(el => {
          el.isSelected = (this.currentUsers.find(x => x.id == el.id) == undefined) ? false : true;
        });
        this.usersLoading = false;
      },
      error: err => { this.usersLoading = false; console.log(err); },
      complete: () => { this.usersLoading = false; }
    }

    );
  }
  GetIncidentSourceTypes() {
    this.incidentSourceTypesLoading = true;
    this.loadingPanel = true;
    this.lookupsService.getAllIncidentSourceHospitalTypes().subscribe({
      next: (result: Result<IncidentSourceTypeDTO[]>) => {
        this.incidentSourceTypes = result.data;
      },
      error: err => { this.incidentSourceTypesLoading = false; console.error(err); },
      complete: () => {
        console.log(this.incidentSourceTypes);
        this.incidentSourceTypesLoading = false;
        this.loadingPanel = false;
      }
    });
  }
  FilterUsers() {
    this.usersOut.emit(this.chosenUsers);
    this.chatNameOut.emit(this.chatName);
  }
  uploadFile(files: any, chatAttach: boolean = false) {
    //alert("hello");
    if (files.length === 0) {
      return;
    }

    let fileToUpload = <File>files.target.files[0];
    const formData = new FormData();
    let headers = new HttpHeaders();
    //headers = headers.set('Content-Type', 'application/json');
    var authData = JSON.parse(localStorage.getItem('ls.authorizationData'));
    // console.log(authData);
    if (authData != null) {
      headers = headers.set('Authorization', ` Bearer ${authData.token}`);
    }
    formData.append('file', fileToUpload, fileToUpload.name);
    formData.append('uploadType', "0");
    this.http.post(`${environment.baseApiUrl}file/Upload`, formData, { reportProgress: true, observe: 'events', headers: headers })
      .subscribe({
        next: (event) => {
          this.filePath =/*environment.baseApiUrl+*/"wwwroot/files/" + fileToUpload.name;
          this.imageUploaded = !chatAttach;
          this.attachUploaded = chatAttach;
        },
        error: (err: HttpErrorResponse) => console.log(err)
      });

    console.log(`file uploaded with path : ${this.filePath}`);
  }
  SetIncidentSourceTypes(event) {
    this.chatFilter.incidentSourceTypeId = [];
    if (Array.isArray(event)) {
      this.incidentSourceTypeIDs = event;
    }
    this.incidentSourceTypeIDs.forEach(el => {
      this.chatFilter.incidentSourceTypeId.push(el.id);
    });
    // console.log("******************************************");
    // console.log(this.chatFilter.incidentSourceTypeId);
  }
  SetOrganizations(event) {
    this.chatFilter.organizationId = [];
    if (Array.isArray(event)) {
      this.organizationIDs = event;
    }

    this.organizationIDs.forEach(el => {
      this.chatFilter.organizationId.push(el.id);
    });
    // console.log("******************************************");
    // console.log(this.organizationIDs);
    // console.log(event);
    // console.log(this.chatFilter.organizationId);
  }
  SetGovernments(event) {
    this.chatFilter.govenmentId = [];
    if (Array.isArray(event)) {
      this.governmentIDs = event;
    }
    this.governmentIDs.forEach(el => {
      this.chatFilter.govenmentId.push(el.id);
    });
    if (this.chatFilter.govenmentId.length > 0) {
      this.healthAdmins = this.healthAdminsBak.filter(x => this.chatFilter.govenmentId.find(y => y == x.governmentID) != undefined);
    } else {
      this.healthAdmins = this.healthAdminsBak;
    }
    // console.log("******************************************");
    // console.log(this.governmentIDs);
    // console.log(event);
    // console.log(this.chatFilter.govenmentId);
  }
  SetAdmins(event) {
    this.chatFilter.healthAdministrationId = [];
    if (Array.isArray(event)) {
      this.healthAdminIDs = event;
    }
    this.healthAdminIDs.forEach(el => {
      this.chatFilter.healthAdministrationId.push(el.id);
    });
    console.log("******************************************");
    console.log(this.healthAdminIDs);
    console.log(event);
    console.log(this.chatFilter.healthAdministrationId);
  }
  getFilteredIncidentSources() {
    if (this._chatFilter == this.chatFilter) return;
    this.incidentSourcesLoading = true;
    this.lookupsService.getFilteredSourceHospitals(this.chatFilter).subscribe({
      next: (result: Result<IncidentSourceHospitalDTO[]>) => {
        this.incidentSources = result.data;
      },
      error: err => { this.incidentSourcesLoading = false; console.error(err); },
      complete: () => {
        this.incidentSourcesLoading = false;
        this._chatFilter = this.chatFilter;
      }
    });
  }
  setIncidentSources(event) {
    this.chatFilter.incidentSourceId = [];
    if (Array.isArray(event)) {
      this.incidentSourceIDs = event;
    }
    this.incidentSourceIDs.forEach(el => {
      this.chatFilter.incidentSourceId.push(el.id);
    });
  }
  getFilteredUsers() {
    console.log(this.chatFilter);

    //if (this._chatFilter == this.chatFilter) return;
    this.usersLoading = true;
    this.userService.getFilteredUsers(this.chatFilter).subscribe({
      next: (result: Result<SystemUserDataDto[]>) => {
        this.usersAvailableForChat = result.data
      },
      error: err => { this.usersLoading = false; console.error(err); },
      complete: () => {
        this.usersLoading = false;
        this._chatFilter = this.chatFilter;
      }
    });
  }
  selectUsers(event) {
    if (Array.isArray(event)) {
      this.tempUsers = event;
    }
    // this.chosenUsers = this.tempUsers.filter(x => this.chosenUsers.find(y => y.id == x.id) == undefined);
    this.tempUsers.forEach(el => {
      if (this.currentUsers.find(x => x.id == el.id) !== undefined) return;
      if (this.chosenUsers.find(x => x.id == el.id) == undefined) {
        this.chosenUsers.push(el);
      }
    });
    this.FilterUsers();
  }
  deselectUsers(event) {
    if (Array.isArray(event)) {
      this.tempUsers = event;
    }
    this.tempUsers.forEach(el => {
      this.chosenUsers = this.chosenUsers.filter(x => x.id != el.id);
    });
    this.FilterUsers();
  }
  deleteUser(i: number) {
    this.chosenUsers.splice(i, 1);
    this.FilterUsers();
  }

}
