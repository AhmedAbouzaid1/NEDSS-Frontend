import { TranslateService } from '@ngx-translate/core';
import { SortEvent } from 'primeng/api';
import { SingleDropdownSettings, SortOrder } from 'src/app/core/constants';
import { LookupsGetterService } from 'src/app/core/services/lookups-getter.service';
import { UserMessageService } from 'src/app/core/services/user.message.service';
import { PreparationsService } from '../../../Services/preparations.service';
import { Component, ElementRef, ViewChild } from '@angular/core';
import { SharedDataService } from '../../../Services/shared-data.service';
import { GeneralDataService } from '../../../../general-data/services/general-data.service';
import { ExportService } from '../../../../../../core/services/export.service';
import { ExportAsConfig } from 'ngx-export-as';

@Component({
  selector: 'app-preparations-team',
  templateUrl: './preparations-team.component.html',
  styleUrls: ['./preparations-team.component.css']
})
export class PreparationsTeamComponent {
  @ViewChild('myTableElementId', { static: false }) tableElement: ElementRef;
  screenName: string;
  dir: string;
  delay: boolean = false;
  timer: any;

  healthAdministration: any[];
  selectedGovernmentId: number = -1;
  governments: any;
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

  preparationsTeam = {
    id: null,
    monitorUnitId: null,
    unitResponsibilityLevelId: null,
    name: null,
    phoneNo1: null,
    phoneNo2: null,
    nationalId: null,
  };
  preparationsTeams!: any[];
  unitResponsibilityLevels!: any[];
  selectedunitResponsibilityLevel: any;
  preparationsTeamFilter = {
    pageSize: 10,
    pageIndex: 0,
    sortColumn: '',
    sortOrder: '',
    searchText: '',
    monitorUnitId: null,
  };
  singleDropdownSettings = SingleDropdownSettings;
  noData: boolean = true;
  loadingPanel: boolean = false;
  unitResponsibilityLevelsLoading: boolean = false;
  first: number = 0;
  last: number = 0;
  pages: number = 0;
  unitId: number;
  pleaseComplete: boolean;
  currentLang: string;
  underDeleting2 = {
    name: '',
    id: null,

  };

  constructor(
    private lookupsGetterService: LookupsGetterService,
    private translateService: TranslateService,
    private userMsg: UserMessageService,
    private preparationsService: PreparationsService,
    private data: SharedDataService,
    private exportService: ExportService,
    public generalDataService: GeneralDataService
  ) { }

  ngOnInit() {

    this.data.getUnitId().subscribe((UnitID) => {
      this.unitId = UnitID;
    });

    this.currentLang =
      localStorage.getItem('ls.currentLang') !== undefined &&
        localStorage.getItem('ls.currentLang') !== 'undefined'
        ? localStorage.getItem('ls.currentLang')
        : 'ar';
    this.dir = this.currentLang == 'ar' ? 'rtl' : 'ltr';
    this.preparationsTeam.monitorUnitId = this.unitId;
    this.preparationsTeamFilter.monitorUnitId = this.unitId;
    this.getPreparationsTeams();
    this.getAllUnitResponsibilityLevels();
    this.translateService.get('NEDSS.PREPARATION.MONITOR_UNIT_LIST.PREPARATIONS').subscribe(res => {
      this.screenName = res;
    });
    this.generalDataService.cardIdValidationMessage = '';
  }
  getAllUnitResponsibilityLevels() {
    this.unitResponsibilityLevelsLoading = true;
    this.lookupsGetterService.getAllUnitResponsibilityLevels().subscribe(
      (result: any) => {
        this.unitResponsibilityLevelsLoading = false;
        if (result != null && result != undefined) {
          this.unitResponsibilityLevels = result.data;
          this.unitResponsibilityLevels.unshift(
            {
              "id": null,
              "code": null,
              "arabicName": "أختر",
              "englishName": "select",
              "totalCount": null
          }
          );
        }
        this.loadingPanel = false;
      },
      (error) => {
        this.unitResponsibilityLevelsLoading = false;
        this.loadingPanel = false;
        this.translateService
          .get('NEDSS.COMMON.INTERNAL_SERVER_ERROR')
          .subscribe((res: string) => {
            this.userMsg.error(res);
          });
      }
    );
  }
  // unitResponsibilityLevelIdSelected(event) {
  //   console.log('event',event);
  //   this.preparationsTeam.unitResponsibilityLevelId = event.id;
  //   console.log('model',this.preparationsTeam);
  //   this.isUnitRespLevelValid = this.generalDataService.validateField(this.preparationsTeam.unitResponsibilityLevelId);
  // }
  getPreparationsTeams() {
    this.loadingPanel = true;
    this.delay= true;
    this.timer= setTimeout(() => {
      if (this.delay)
      {
        this.translateService.get('NOUR.WaitPlease').subscribe(msg => this.userMsg.info(msg));
      }
      
    }, 500);
    this.preparationsService
      .getPagePreparationsTeam(this.preparationsTeamFilter)
      .subscribe(
        (result: any) => {
          if (result != null && result != undefined) {
            this.preparationsTeams = result.data;
            if (
              this.preparationsTeams != undefined &&
              this.preparationsTeams.length == 0
            ) {
              setTimeout(() => {
                this.delay= false;
                clearTimeout(this.timer);
              },0);
              this.noData = true;
              this.pages = 0;
            } else {
              setTimeout(() => {
                this.delay= false;
                clearTimeout(this.timer);
              },0);
              this.noData = false;
              this.pages = result.data[0].totalCount;
              this.last =
                this.preparationsTeamFilter.pageIndex *
                this.preparationsTeamFilter.pageSize;
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
    this.preparationsService.getPreparationTeamById(id).subscribe(
      (result: any) => {
        this.preparationsTeam = result.data;
        this.selectedunitResponsibilityLevel = this.unitResponsibilityLevels.filter(
          item => item.id === this.preparationsTeam.unitResponsibilityLevelId);
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

  isUnitRespLevelValid: boolean = true;
  isNameValid: boolean = true;
  isPhone1Valid: boolean = true;
  isPhone2Valid: boolean = true;
  isNationalIdValid: boolean = true;

  validateRequiredData() {
    this.isUnitRespLevelValid = this.generalDataService.validateField(this.preparationsTeam.unitResponsibilityLevelId);
    this.isNameValid = this.generalDataService.validateEmptyField(this.preparationsTeam.name);
    this.isPhone1Valid = this.generalDataService.validatePhoneNumber1(this.preparationsTeam.phoneNo1, true);
    this.isPhone2Valid = this.generalDataService.validatePhoneNumber2(this.preparationsTeam.phoneNo2, true);
    this.isNationalIdValid = this.generalDataService.validateNationalID(this.preparationsTeam.nationalId, true);

    if (!this.isUnitRespLevelValid || !this.isNameValid || !this.isPhone1Valid || !this.isPhone2Valid || !this.isNationalIdValid)
      return false;
    return true;
  }

  save() {
    if (!this.validateRequiredData()) {
      this.pleaseComplete = true
    } else {
      this.preparationsTeam.nationalId = this.preparationsTeam.nationalId.toString();
      if (this.preparationsTeam.nationalId.length != 14) {
        this.userMsg.warn("الرقم القومي لا بد ان يكون 14 رقم");
        return;
      }
      this.pleaseComplete = false;
      if (this.preparationsTeam.id == null) {
        this.preparationsService.addPreparationTeam(this.preparationsTeam).subscribe(
          (response: any) => {
            if (response) {
              this.translateService
                .get('NEDSS.COMMON.SENT_SUCESSFULLY')
                .subscribe((res: string) => {
                  this.userMsg.success(res);
                });
              this.getPreparationsTeams();
              this.preparationsTeam = {
                id: null,
                monitorUnitId: this.unitId,
                unitResponsibilityLevelId: null,
                name: null,
                phoneNo1: null,
                phoneNo2: null,
                nationalId: null,
              };
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
      } else this.update();
    }


  }

  update() {
    this.preparationsService.updatePreparationTeam(this.preparationsTeam).subscribe(
      (response: any) => {
        if (response) {
          this.translateService
            .get('NEDSS.COMMON.UPDATE_SUCESSFULLY')
            .subscribe((res: string) => {
              this.userMsg.success(res);
            });
          this.getPreparationsTeams();
          this.preparationsTeam = {
            id: null,
            monitorUnitId: this.unitId,
            unitResponsibilityLevelId: null,
            name: null,
            phoneNo1: null,
            phoneNo2: null,
            nationalId: null,
          };
        }
      },
      (error) => {
        this.translateService
          .get('NEDSS.COMMON.UPDATE_FAILD')
          .subscribe((res: string) => {
            this.userMsg.error(res);
          });
      }
    );
  }

  sort(event: SortEvent) {
    if (
      event.order == -1 &&
      this.preparationsTeamFilter.sortOrder != SortOrder.desc
    ) {
      this.preparationsTeamFilter.sortOrder = SortOrder.desc;
      if (typeof event.field === 'string')
        this.preparationsTeamFilter.sortColumn = event.field;
      this.getPreparationsTeams();
    } else if (
      event.order == 1 &&
      this.preparationsTeamFilter.sortOrder != SortOrder.asc
    ) {
      this.preparationsTeamFilter.sortOrder = SortOrder.asc;
      if (typeof event.field === 'string')
        this.preparationsTeamFilter.sortColumn = event.field;
      this.getPreparationsTeams();
    }
  }
  paginate(event: any) {
    this.first = event.first;
    this.last = event.last;
    this.preparationsTeamFilter.pageIndex = event.page;
    this.preparationsTeamFilter.pageSize = event.rows;
    this.getPreparationsTeams();
  }

  delete(id: number) {
    this.preparationsService.deletePreparationTeam(id).subscribe(
      (result: any) => {
        this.getPreparationsTeams();
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

  // exportPatientsAsPdf() {

  //   let selectedGov = this.governments?.filter(g => g.id == this.selectedGovernmentId)

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
  //   this.exportService.exportTemplateAsPdf(document.getElementById(this.currentConfig), 'عدد بيانات فريق الترصد', [selectedGov, 
  //     selectedAdm, 
  //     //selectedIncs, 
  //     //selectedDep
  // ],
  //  [sDate, eDate]);
  // }

  exportPatientsAsPdf() {
    this.exportService.exportTemplateAsPdfLogoTitle(document.getElementById(this.currentConfig),
      'بيانات فريق الترصد'
    );
  }

  nameToDelete(ele) {

    this.underDeleting2.id = ele.id;
    this.underDeleting2.name = ele.name;



  }
}


