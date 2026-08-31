import { Component, EventEmitter, Input, OnDestroy, Output } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { SingleDropdownSettings } from 'src/app/core/constants';
import { LookupsGetterService } from 'src/app/core/services/lookups-getter.service';
import { UserMessageService } from 'src/app/core/services/user.message.service';
import { PreparationsService } from '../../../Services/preparations.service';
import { Router } from '@angular/router';
import { SharedDataService } from '../../../Services/shared-data.service';
import { GeneralDataService } from '../../../../general-data/services/general-data.service';
import { ActiveUserService } from 'src/app/core/services/active-user.service';

@Component({
  selector: 'app-preparations-data',
  templateUrl: './preparations-data.component.html',
  styleUrls: ['./preparations-data.component.css'],
})
export class PreparationsDataComponent implements OnDestroy {
  @Input() disableTab: boolean;
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
  underDeleting = {
    govenmentNamw: '',
    id: null,
  };
  preparationsData = {
    id: null,
    govenmentId: null,
    healthAdministrationId: null,
    incidentSourceId: null,
    address: null,
    phoneNo1: null,
    phoneNo2: null,
    fax: null,
    officesCount: null,
    chairsCount: null,
    shanonCount: null,
    hasRoom: false,
    isRoomPrepared: false,
    hasAirConditioner: false,
    notes: null,
  };
  govenments: any[];
  healthAdministrations: any[];
  incidentSources: any[];
  selectedincidentSourceId: number = -1;
  selectedGovernment: number = -1;
  loadingPanel: boolean = false;
  govenmentsLoading: boolean = false;
  healthAdministrationsLoading: boolean = false;
  incidentSourcesLoading: boolean = false;
  currentLang: string;
  dir: string;
  delay: boolean = false;
  timer: any;
  messageService: any;
  unitId: number;
  pleaseComplete: boolean;
  levelId: any;
  selectedhealthAdministrationId: number = -1;
  singleDropdownSettings = SingleDropdownSettings;
  disableAddBtn:boolean = false;
  showTable:boolean = false;
  preparations:any;
  first:number = 0;
  last: number = 0;
  pages: number = 0;
  noData: boolean = true;
  @Output() notifyChange = new EventEmitter<void>();

  constructor(
    private lookupsGetterService: LookupsGetterService,
    private translateService: TranslateService,
    private userMsg: UserMessageService,
    private preparationsService: PreparationsService,
    private data: SharedDataService,
    private router: Router,
    public generalDataService: GeneralDataService,
    public activeUSerService: ActiveUserService
  ) {}

  ngOnDestroy(): void {
    this.data.setUnitId(null);
  } 

  ngOnInit() {
    this.generalDataService.addressValidationMessage = '';

    this.getGovenments();
    this.data.getUnitId().subscribe((UnitID) => {
      this.unitId = UnitID;
    });
    this.currentLang =
      localStorage.getItem('ls.currentLang') !== undefined &&
      localStorage.getItem('ls.currentLang') !== 'undefined'
        ? localStorage.getItem('ls.currentLang')
        : 'ar';

    this.levelId = JSON.parse(
      localStorage.getItem('ls.authorizationData')
    )?.user?.levelId;

    if (this.unitId != null && this.unitId > 0) {
      this.getById(this.unitId);
    }
  }

  getGovenments() {
    this.govenmentsLoading = true;
    this.lookupsGetterService.getAllGovernments().subscribe(
      (result: any) => {
        this.govenmentsLoading = false;
        if (result != null && result != undefined) {
          this.govenments = [
            { id: -1, arabicName: 'إختر', englishName: 'Select' },
          ];
          result.data.forEach((gov) => {
            this.govenments.push(gov);
          });
          if (result.data.length > 0) {
            this.selectedGovernment = JSON.parse(
              localStorage.getItem('ls.authorizationData')
            ).user.govenmentId;
            if (this.selectedGovernment != null) {
              this.govenmentSelected();
            } else {
              this.selectedGovernment = -1;
            }
          }
        }
        this.loadingPanel = false;
      },
      (error) => {
        this.govenmentsLoading = false;
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
    this.preparationsData.incidentSourceId = this.selectedincidentSourceId;
    this.isIncidentSourceValid = this.generalDataService.validateField(
      this.preparationsData.incidentSourceId
    );
    
    //Get Monitor Unit 
    this.checkMonitorUnit();
  }
  govenmentSelected() {
    this.preparationsData.govenmentId = this.selectedGovernment;
    this.isGovernmentValid = this.generalDataService.validateField(
      this.preparationsData.govenmentId
    );

    this.getHealthAdministrations(this.preparationsData.govenmentId);
  }
  govenmentDeSelected() {
    this.selectedGovernment = null;
    this.healthAdministrations = null;
    this.preparationsData.healthAdministrationId = null;
    this.selectedhealthAdministrationId = null;
    this.incidentSources = null;
    this.preparationsData.incidentSourceId = null;
    this.selectedincidentSourceId = null;
    this.isGovernmentValid = this.generalDataService.validateField(
      this.preparationsData.govenmentId
    );
  }
  getHealthAdministrations(govenmentId) {
    this.healthAdministrationsLoading = true;
    this.lookupsGetterService
      .getPageHealthAdministrations({
        GovernmentID: govenmentId,
      })
      .subscribe(
        (result: any) => {
          this.healthAdministrationsLoading = false;
          if (result != null && result != undefined) {
            this.healthAdministrations = [
              { id: -1, arabicName: 'إختر', englishName: 'Select' },
            ];
            result.data.forEach((gov) => {
              this.healthAdministrations.push(gov);
            });

            this.selectedhealthAdministrationId = JSON.parse(
              localStorage.getItem('ls.authorizationData')
            ).user.healthAdministrationId;
            if (this.selectedhealthAdministrationId != null) {
              this.HealthAdministrationSelected();
            } else {
              this.selectedhealthAdministrationId = -1;
            }
            if (this.preparationsData.govenmentId) {
              this.selectedhealthAdministrationId =
                this.preparationsData.healthAdministrationId;
              this.HealthAdministrationSelected();
            }
          }
          this.loadingPanel = false;
        },
        (error) => {
          this.healthAdministrationsLoading = false;
          this.loadingPanel = false;
          this.translateService
            .get('NEDSS.COMMON.INTERNAL_SERVER_ERROR')
            .subscribe((res: string) => {
              this.userMsg.error(res);
            });
        }
      );
  }

  HealthAdministrationSelected() {
    this.preparationsData.healthAdministrationId =
      this.selectedhealthAdministrationId;
    this.isHealthAdministrationValid = this.generalDataService.validateField(
      this.preparationsData.healthAdministrationId
    );
    this.getIncidentSources(this.preparationsData.healthAdministrationId);
  }
  HealthAdministrationDSelected() {
    this.selectedhealthAdministrationId = null;
    this.incidentSources = null;
    this.preparationsData.incidentSourceId = null;
    this.selectedincidentSourceId = null;
    this.isHealthAdministrationValid = this.generalDataService.validateField(
      this.preparationsData.healthAdministrationId
    );
  }
  getIncidentSources(healthAdministrationId) {
    this.incidentSourcesLoading = true;
    this.lookupsGetterService
      .getPageIncidentSourceHospitals({
        healthAdministrationId: healthAdministrationId,
      })
      .subscribe(
        (result: any) => {
          this.incidentSourcesLoading = false;
          if (result != null && result != undefined) {
            this.incidentSources = [
              { id: -1, arabicName: 'إختر', englishName: 'Select' },
            ];
            result.data.forEach((gov) => {
              this.incidentSources.push(gov);
            });
            this.selectedincidentSourceId = JSON.parse(
              localStorage.getItem('ls.authorizationData')
            ).user.incidentSourceId;
            if (this.selectedincidentSourceId != null) {
              this.incidentSourcesSelected();
            } else {
              this.selectedincidentSourceId = -1;
            }
            if (this.preparationsData.healthAdministrationId) {
              this.selectedincidentSourceId =
                this.preparationsData.incidentSourceId;
            }
          }
          this.loadingPanel = false;
        },
        (error) => {
          this.incidentSourcesLoading = false;
          this.loadingPanel = false;
          this.translateService
            .get('NEDSS.COMMON.INTERNAL_SERVER_ERROR')
            .subscribe((res: string) => {
              this.userMsg.error(res);
            });
        }
      );
  }

  getById(id) {
    this.data.setUnitId(id);
    this.notifyChange.emit();
    this.disableAddBtn = false;
    this.preparationsService.getPreparationById(id).subscribe(
      (result: any) => {
        if (result != null && result != undefined) {
          this.preparationsData = result.data;
          setTimeout(() => {
            this.selectedGovernment = result.data.govenmentId;

            this.getHealthAdministrations(this.preparationsData.govenmentId);
          }, 500);
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

  isGovernmentValid: boolean = true;
  isHealthAdministrationValid: boolean = true;
  isIncidentSourceValid: boolean = true;
  isAddressValid: boolean = true;
  isPhone1Valid: boolean = true;
  isPhone2Valid: boolean = true;
  isFaxValid: boolean = true;
  isOfficeCountValid: boolean = true;
  isChairCountValid: boolean = true;
  isShanonCountValid: boolean = true;
  isHasRoomValid: boolean = true;
  isRoomPreparedValid: boolean = true;
  isHasAirconditionerValid: boolean = true;

  chairCountValidationMsg: string = '';
  officeCountValidationMsg: string = '';
  shannonCountValidationMsg: string = '';
  faxValidationMsg: string = '';
  isNotesValid: boolean = true;
  validateChairCount() {
    if (
      !this.generalDataService.validateEmptyField(
        this.preparationsData.chairsCount
      )
    ) {
      this.chairCountValidationMsg = 'NEDSS.COMMON.FILEDREQUIRED';
      return false;
    } else if (
      !this.generalDataService.isNumberPositiveAndLessThanMax(
        this.preparationsData.chairsCount,
        7
      )
    ) {
      let fieldName;
      this.translateService
        .get(
          'NEDSS.HOME.PREPARATION.MONITOR_UNIT_ADD.PREPARATION_DATA.CHAIR_COUNT'
        )
        .subscribe((res) => (fieldName = res));
      this.chairCountValidationMsg = this.translateService.instant(
        'NEDSS.COMMON.MAX_DIGITS_VALIDATION',
        {
          fieldName: fieldName,
          maxDigits: 7,
        }
      );
      return false;
    }

    this.chairCountValidationMsg = '';
    return true;
  }

  validateFax() {
    if (
      !this.generalDataService.validateEmptyField(this.preparationsData.fax)
    ) {
      this.faxValidationMsg = 'NEDSS.COMMON.FILEDREQUIRED';
      return false;
    } else if (!this.generalDataService.isValidFax(this.preparationsData.fax)) {
      this.faxValidationMsg = this.translateService.instant(
        'NEDSS.COMMON.FAX_VALIDATION'
      );
      return false;
    }

    this.chairCountValidationMsg = '';
    return true;
  }
  validateOfficeCount() {
    if (
      !this.generalDataService.validateEmptyField(
        this.preparationsData.officesCount
      )
    ) {
      this.officeCountValidationMsg = 'NEDSS.COMMON.FILEDREQUIRED';
      return false;
    } else if (
      !this.generalDataService.isNumberPositiveAndLessThanMax(
        this.preparationsData.officesCount,
        7
      )
    ) {
      let fieldName;
      this.translateService
        .get(
          'NEDSS.HOME.PREPARATION.MONITOR_UNIT_ADD.PREPARATION_DATA.OFFICE_COUNT'
        )
        .subscribe((res) => (fieldName = res));
      this.officeCountValidationMsg = this.translateService.instant(
        'NEDSS.COMMON.MAX_DIGITS_VALIDATION',
        {
          fieldName: fieldName,
          maxDigits: 7,
        }
      );
      return false;
    }

    this.officeCountValidationMsg = '';
    return true;
  }

  validateShannonCount() {
    if (
      !this.generalDataService.validateEmptyField(
        this.preparationsData.shanonCount
      )
    ) {
      this.shannonCountValidationMsg = 'NEDSS.COMMON.FILEDREQUIRED';
      return false;
    } else if (
      !this.generalDataService.isNumberPositiveAndLessThanMax(
        this.preparationsData.shanonCount,
        7
      )
    ) {
      let fieldName;
      this.translateService
        .get('NEDSS.PREPARATION.SHANON_COUNT')
        .subscribe((res) => (fieldName = res));
      this.shannonCountValidationMsg = this.translateService.instant(
        'NEDSS.COMMON.MAX_DIGITS_VALIDATION',
        {
          fieldName: fieldName,
          maxDigits: 7,
        }
      );
      return false;
    }

    this.shannonCountValidationMsg = '';
    return true;
  }

  validateRequiredData(): boolean {
    this.isGovernmentValid = this.generalDataService.validateField(
      this.preparationsData.govenmentId
    );
    this.isHealthAdministrationValid = this.generalDataService.validateField(
      this.preparationsData.healthAdministrationId
    );
    this.isIncidentSourceValid = this.generalDataService.validateField(
      this.preparationsData.incidentSourceId
    );
    this.isAddressValid = this.generalDataService.validateAddress(
      this.preparationsData.address,
      true
    );
    this.isPhone1Valid = this.generalDataService.validatePhoneNumber1(
      this.preparationsData.phoneNo1,
      true
    );
    //this.isPhone2Valid = this.generalDataService.validatePhoneNumber2(this.preparationsData.phoneNo2, true);
    //this.isFaxValid = this.generalDataService.validateField(this.preparationsData.fax);
    this.isOfficeCountValid = this.validateOfficeCount();
    this.isChairCountValid = this.validateChairCount();
    //this.isFaxValid = this.validateFax();
    this.isShanonCountValid = this.validateShannonCount();
    this.isHasRoomValid = this.generalDataService.validateField(
      this.preparationsData.hasRoom
    );
    this.isRoomPreparedValid = this.generalDataService.validateField(
      this.preparationsData.isRoomPrepared
    );
    this.isHasAirconditionerValid = this.generalDataService.validateField(
      this.preparationsData.hasAirConditioner
    );
    this.isNotesValid = this.generalDataService.validateNotes(
      this.preparationsData.notes,
      false
    );
    if (
      !this.isGovernmentValid ||
      !this.isHealthAdministrationValid ||
      // || !this.isIncidentSourceValid
      !this.isAddressValid ||
      !this.isPhone1Valid || //!this.isPhone2Valid || //!this.isFaxValid ||
      !this.isOfficeCountValid ||
      !this.isChairCountValid ||
      !this.isShanonCountValid ||
      !this.isHasRoomValid ||
      !this.isRoomPreparedValid ||
      !this.isHasAirconditionerValid
    ) {
      return false;
    }

    return true;
  }

  save() {
    if (!this.validateRequiredData()) {
      this.pleaseComplete = true;
    } else {
      if(this.preparationsData.fax != null){
        this.preparationsData.fax = this.preparationsData.fax.toString();
      }
      this.pleaseComplete = false;
      if (this.preparationsData.id == null) {
        this.preparationsService
          .addPreparationData(this.preparationsData)
          .subscribe(
            (response: any) => {
              if (response) {
                this.translateService
                  .get('NEDSS.COMMON.SENT_SUCESSFULLY')
                  .subscribe((res: string) => {
                    this.userMsg.success(res);
                  });

                this.data.setUnitId(response.data.id);
                this.router.navigate([
                  'home/preparations/add-preparations/preparations-teem',
                ]);
              }
            },
            (error) => {
              this.translateService
                .get('NEDSS.COMMON.SENT_FAILD')
                .subscribe((res: string) => {
                  this.userMsg.error(res);
                });
            }
          );
      } else {
        this.update();
      }
    }
  }

  update() {
    this.preparationsService
      .updatePreparationData(this.preparationsData)
      .subscribe(
        (response: any) => {
          if (response) {
            this.translateService
              .get('NEDSS.COMMON.UPDATE_SUCESSFULLY')
              .subscribe((res: string) => {
                this.userMsg.success(res);
              });
          }
        },
        (error) => {
          this.translateService
            .get('NEDSS.COMMON.UPDATE_FAILD')
            .subscribe((res: string) => {
              this.userMsg.error(res);
            });
        },
      );
  }

  checkMonitorUnit(){
    this.disableAddBtn = false;
    this.preparationsService.getPagePreparations({
      govenmentId:this.selectedGovernment,
      healthAdministrationId:this.selectedhealthAdministrationId,
      incidentSourceId:this.selectedincidentSourceId
    }).subscribe({
      next:(data) => {
        if(data !== undefined || data != null){
          if(data?.data?.length > 0){
            this.disableAddBtn = true;

            this.translateService
            .get('NEDSS.PREPARATION.MONITORS_EXISTED')
            .subscribe((res: string) => {
              this.userMsg.warn(res);
            });

            this.showTable = true;

            this.getPreparation();



          }
        }
      }
    })
  }

  changeRoom() {
    if(!this.preparationsData.hasRoom){
      this.preparationsData.hasAirConditioner = false;
      this.preparationsData.isRoomPrepared = false;
    }
  }

  getPreparation() {
    this.loadingPanel = true;
    this.delay = true;
    this.timer = setTimeout(() => {
      if (this.delay) {
        this.translateService
          .get('NOUR.WaitPlease')
          .subscribe((msg) => this.userMsg.info(msg));
      }
    }, 500);
    this.preparationsFilter.govenmentId = this.selectedGovernment;
    this.preparationsFilter.healthAdministrationId = this.selectedhealthAdministrationId;
    this.preparationsFilter.incidentSourceId = this.selectedincidentSourceId;
    this.preparationsService
      .getPagePreparations(this.preparationsFilter)
      .subscribe(
        (result: any) => {
          if (result != null && result != undefined) {
            this.preparations = result.data;
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


  paginate(event: any) {
    this.first = event.first;
    this.last = event.last;
    this.preparationsFilter.pageIndex = event.page;
    this.preparationsFilter.pageSize = event.rows;
    this.getPreparation();
  }

  nameToDelete(ele) {
    this.underDeleting.id = ele.id;
    this.underDeleting.govenmentNamw = ele.govenmentNamw;
  }

  delete(id: number) {
    this.preparationsService.deletePreparation(id).subscribe(
      (result: any) => {
        this.getPreparation();
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

}
  
