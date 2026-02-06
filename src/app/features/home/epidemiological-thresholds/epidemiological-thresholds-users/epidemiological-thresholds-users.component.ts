import { Component, OnInit } from '@angular/core';
import { LookupsGetterService } from 'src/app/core/services/lookups-getter.service';
import { Organiztion } from '../../chat/Models/organiztion';
import { Result } from 'src/app/features/Result';
import { HealthAdministrationDTO } from 'src/app/features/Models/health-administration';
import { GovernmentDTO } from '../../chat/Models/government-dto';
import { UserMessageService } from 'src/app/core/services/user.message.service';
import { TranslateService } from '@ngx-translate/core';
import { UserLevel } from '../../chat/Models/user-level';
import { SystemUserDTO } from '../../chat/Models/UserDto';
import { OrganizationAccessibleParts } from './Model/organization-accessible-parts';
import { FilterHealthAdministrationDto } from './Model/filter-health-administration-dto';
import { FilterIncidentSources } from './Model/filter-incident-sources';
import { filter } from 'rxjs-compat/operator/filter';
import { SystemUserMainDataFilter } from './Model/system-user-main-data-filter';
import { OrganizationEnum } from './Enum/organization-enum';
import { AreaFilter } from './Model/area-filter';
import { ThresholdUser } from './Model/threshold-user';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';

@Component({
  selector: 'app-epidemiological-thresholds-users',
  templateUrl: './epidemiological-thresholds-users.component.html',
  styleUrls: ['./epidemiological-thresholds-users.component.css']
})
export class EpidemiologicalThresholdsUsersComponent implements OnInit {

  organizations: Organiztion[];
  governments: GovernmentDTO[];
  healthAdmins: HealthAdministrationDTO[];
  organizationParts!: OrganizationAccessibleParts;
  loadingPanel: boolean = false;
  currentLang: string = 'ar';
  dir: string = 'rtl';
  incidentSourceHospitalTypes: any;
  incidentSourceHospital: any;
  selecetedincidentSourceHospitalTypesIds: number[];
  selectedOrganizationId: number;
  selectedGovermentIds: number[];
  selectedHealthAdminIds: number[];
  selectedbranchesIds: number[];
  selecteduniversitiesIds: number[];
  selectedAreaIds:number[];
  selectedIncidentSourceIds: number[];
  userIds:number[];
  branches: any;
  universities:any;
  areas: any;
  users: any;
  systemUserMainData: SystemUserMainDataFilter = {} as SystemUserMainDataFilter;
  thresholdUsers:ThresholdUser[];
  constructor(private lookupsService: LookupsGetterService,
    private userMsg: UserMessageService,
    private translateService: TranslateService,
    public ref: DynamicDialogRef,
    public config: DynamicDialogConfig) {
      if(this.config.data){
        this.thresholdUsers = this.config.data;
      }
  }

  ngOnInit(): void {
    this.getLanguageConfiguration();
    this.getOrganizations();
    this.getAllIncidentSourceHospitalTypes();
  }

  getLanguageConfiguration() {
    this.currentLang =
      localStorage.getItem('ls.currentLang') !== undefined &&
        localStorage.getItem('ls.currentLang') !== 'undefined'
        ? localStorage.getItem('ls.currentLang')
        : 'ar';

    this.dir = this.currentLang == 'ar' ? 'rtl' : 'ltr';
  }

  //Start of Organization الهيئات
  getOrganizations() {
    this.lookupsService.getAllOrganizations().subscribe({
      next: (response: Result<Organiztion[]>) => {
        let selectionObject = { id: -1, englishName: '', arabicName: '', code: '', totalCount: -1 };
        this.organizations = response.data;
        this.organizations.unshift(selectionObject);
        this.loadingPanel = false;
      },
      error: (error) => {
        this.loadingPanel = false;
        this.translateService.get('NEDSS.COMMON.INTERNAL_SERVER_ERROR').subscribe((res: string) => {
          this.userMsg.error(res);
        });
      },
      complete: () => this.loadingPanel = false
    })
  }

  onOrganizationChange(event: any) {
    this.selectedOrganizationId = event.value.id;
    this.resetForm();
    if (this.selectedOrganizationId == -1) {
      return;
    }
    this.getOrganizationAccessibleParts(this.selectedOrganizationId);

    this.systemUserMainData.organizationId = this.selectedOrganizationId;
    this.getUsers(this.systemUserMainData);
  }

  getOrganizationAccessibleParts(orginzationId: number) {
    this.lookupsService.getOrganizationAccessibleParts(orginzationId).subscribe({
      next: (response: Result<OrganizationAccessibleParts>) => {
        this.organizationParts = response.data;
      },
      error: (error) => {
        this.loadingPanel = false;
        this.translateService.get('NEDSS.COMMON.INTERNAL_SERVER_ERROR').subscribe((res: string) => {
        this.userMsg.error(res);
        })
      },
      complete: () => {
        this.getPartData(orginzationId);
      }
    })
  }

  getPartData(orginzationId: number) {
    if (orginzationId == OrganizationEnum.ministryOfHealth || 
      OrganizationEnum.generalOrganizationForTeachingHospitalsAndInstitutes ||
      orginzationId == OrganizationEnum.amanHospitals) {
      this.getGovernments();
    };
    if (orginzationId == OrganizationEnum.healthInsurance) {
      this.getAllBranchesForUsers();
    }
    if (orginzationId == OrganizationEnum.universityHospitals) {
      this.getAllUniversitiesForUsers();
    }
    
    if (orginzationId == OrganizationEnum.healthCareAuthority) {
      this.getAllBranchesForUsers();
    }

  }
  //End of Organization الهيئات


  //Start of Government المحافظة
  getGovernments() {
    this.lookupsService.getAllGovernmentsForUser(true).subscribe({
      next: (result: Result<GovernmentDTO[]>) => {
        if (result != null && result != undefined) {
          this.governments = result.data;
        }
        this.loadingPanel = false;
      },
      error: error => {
        this.loadingPanel = false;
        this.translateService.get('NEDSS.COMMON.INTERNAL_SERVER_ERROR').subscribe((res: string) => {
          this.userMsg.error(res);
        });
      },
    });
  }

  onGovernmentSelectionChange(event: any) {
    if (event.value.length > 0) {
      this.healthAdmins = [];
      this.selectedGovermentIds = event.value.map(g => g.id);
      if(this.selectedOrganizationId == 1){
        let filterHealthAdmin = {} as FilterHealthAdministrationDto;
        filterHealthAdmin.forSystemUser = true;
        filterHealthAdmin.governmentsIds = this.selectedGovermentIds;
        this.getHealthAdministrationForGovIds(filterHealthAdmin);
      } 
      if(this.selectedOrganizationId == 4 || this.selectedOrganizationId == 5){
        this.getIncidentSourceHospital({
          organizationId:this.selectedOrganizationId,
          incidentSourcesTypesIds:this.selectedIncidentSourceIds.length == 0 ? null : this.selectedIncidentSourceIds,
          governmentsIds:this.selectedGovermentIds,
          forSystemUser:true
        })
      }

      this.systemUserMainData.governmentsIds = this.selectedGovermentIds;
      this.getUsers(this.systemUserMainData);
    }

  }
  //End of Government المحافظة

  //Start of Health adminstration الإدارة
  getHealthAdministrationForGovIds(filterHealthAdmin: FilterHealthAdministrationDto) {
    this.lookupsService.getHealthAdministrationsIncidentByGovernmentsIds(filterHealthAdmin).subscribe({
      next: (result: Result<HealthAdministrationDTO[]>) => {
        if (result != null && result != undefined) {
          this.healthAdmins = result.data;
        }
        this.loadingPanel = false;
      },
      error: error => {
        this.loadingPanel = false;
        this.translateService.get('NEDSS.COMMON.INTERNAL_SERVER_ERROR').subscribe((res: string) => {
          this.userMsg.error(res);
        });
      },
      complete: () => {
      }
    });
  }

  onHealthAdminSelectionChange(event: any) {
    if (event.value.length > 0) {
      this.selectedHealthAdminIds = event.value.map(g => g.id);
      this.systemUserMainData.healthAdministrationsIds = this.selectedHealthAdminIds;
      this.getUsers(this.systemUserMainData);
      if(this.selectedOrganizationId == 1) {
        this.getIncidentSourceHospital({
          organizationId: this.selectedOrganizationId,
          governmentsIds: this.selectedGovermentIds,
          healthAdministrationsIds: this.selectedHealthAdminIds
        })
      }
    }
  }
  //End of Health adminstration الإدارة

  //Start of Branch الفروع
  getAllBranchesForUsers() {
    this.lookupsService.getAllBranchesForUsers(this.selectedOrganizationId, true).subscribe({
      next: (response) => {
        if (response != null && response != undefined) {
          this.branches = response.data;
        }
        this.loadingPanel = false;
      },
      error: (error) => {
        this.loadingPanel = false;
        this.translateService.get('NEDSS.COMMON.INTERNAL_SERVER_ERROR').subscribe((res: string) => {
          this.userMsg.error(res);
        });
      },
      complete: () => {
      }
    });
  }

  onBranchesSelectionChange(event: any) {
    let isAreaExist:boolean = this.selectedOrganizationId == OrganizationEnum.healthInsurance ? true : false;
    if (event.value.length > 0) {
      this.selectedbranchesIds = event.value.map(g => g.id);
      if(this.selectedOrganizationId == 7){
        this.getIncidentSourceHospital({
          organizationId:this.selectedOrganizationId,
          incidentSourcesTypesIds:this.selectedIncidentSourceIds.length == 0 ? null : this.selectedIncidentSourceIds,
          branchsIds:this.selectedbranchesIds,
          forSystemUser:true
        })
      }
      if(isAreaExist) {
        let areaFilter:AreaFilter = {} as AreaFilter;
        areaFilter.branchsIds = this.selectedbranchesIds;
        areaFilter.forSystemUser = true;
        this.getAreasByBranchFilter(areaFilter);
        this.systemUserMainData.branchsIds = this.selectedbranchesIds;
        this.getUsers(this.systemUserMainData);
      }
    }
  }
  //End of Branch الفروع


  //Start of Area المناطق
  // getAreasByBranchFilter
  getAreasByBranchFilter(areaFilter: any) {
    this.lookupsService.getAreasByBranchFilter(areaFilter).subscribe({
      next: (response) => {
        if (response != null && response != undefined) {
          this.areas = response.data;
        }
        this.loadingPanel = false;
      },
      error: (error) => {
        this.loadingPanel = false;
        this.translateService.get('NEDSS.COMMON.INTERNAL_SERVER_ERROR').subscribe((res: string) => {
          this.userMsg.error(res);
        });
      },
      complete: () => {
      }
    });
  }

  onAreaSelectionChange(event: any) {
    if (event.value.length > 0) {

      this.selectedAreaIds = event.value.map(g => g.id);
      let filterIncidentSources: FilterIncidentSources = {} as FilterIncidentSources;
      if (this.selectedOrganizationId && this.selectedOrganizationId != -1)
        filterIncidentSources.organizationId = this.selectedOrganizationId;

      filterIncidentSources.incidentSourcesTypesIds = this.selecetedincidentSourceHospitalTypesIds.length == 0 ? null : this.selecetedincidentSourceHospitalTypesIds;
      filterIncidentSources.forSystemUser = true;
      filterIncidentSources.areasIds = this.selectedAreaIds;
      this.systemUserMainData.areasIds = this.selectedAreaIds;
      this.getIncidentSourceHospital(filterIncidentSources);
      this.getUsers(this.systemUserMainData);
    }
  }
  //End of Area المناطق

  //Start of Branch الجامعات
  // getAllBranchesForUsers
  getAllUniversitiesForUsers() {
    this.lookupsService.getAllBranchesForUsers(this.selectedOrganizationId, true).subscribe({
      next: (response) => {
        if (response != null && response != undefined) {
          this.universities = response.data;
        }
        this.loadingPanel = false;
      },
      error: (error) => {
        this.loadingPanel = false;
        this.translateService.get('NEDSS.COMMON.INTERNAL_SERVER_ERROR').subscribe((res: string) => {
          this.userMsg.error(res);
        });
      },
      complete: () => {
      }
    });
  }

  onUniversitiesSelectionChange(event: any) {
    if (event.value.length > 0) {
      this.selecteduniversitiesIds = event.value.map(g => g.id);
      this.systemUserMainData.branchsIds = this.selecteduniversitiesIds;
      if(this.selectedOrganizationId == 3) {
        this.getIncidentSourceHospital({
          organizationId: this.selectedOrganizationId,
          branchsIds:this.selecteduniversitiesIds,
          forSystemUser:true,
          incidentSourcesTypesIds:this.selectedIncidentSourceIds.length == 0 ? null : this.selectedIncidentSourceIds.length
        })
        
      }
      this.getUsers(this.systemUserMainData);
    }
  }
  //End of Branch الجامعات





  //Start of Incident Source مصدر إبلاغ
  getIncidentSourceHospital(filter: any) {
    this.lookupsService.getIncidentSourceHospitalsByIncidentGovernmentsIds(filter).subscribe({
      next: (response) => {
        this.incidentSourceHospital = response.data;
      }, error: (error) => {
        this.loadingPanel = false;
        this.translateService.get('NEDSS.COMMON.INTERNAL_SERVER_ERROR').subscribe((res: string) => {
          this.userMsg.error(res);
        })
      }, complete: () => {

      }
    })
  }

  onIncidentSourceHospitalChange(event: any) {
    if (event.value.length > 0) {
      this.selectedIncidentSourceIds = event.value.map(g => g.id);
      this.systemUserMainData.incidentSourcesIds = this.selectedIncidentSourceIds;
      this.getUsers(this.systemUserMainData);
    }
  }
  //End of Incident Source مصدر إبلاغ


  //start of get user
  getUsers(filter: SystemUserMainDataFilter) {
    this.lookupsService.getUsersMainData(filter).subscribe({
      next: (data) => {
        this.users = data.data;
      }, error: () => {
        this.loadingPanel = false;
        this.translateService.get('NEDSS.COMMON.INTERNAL_SERVER_ERROR').subscribe((res: string) => {
          this.userMsg.error(res);
        })
      }, complete: () => {
      }
    })
  }

  //end get user 

    //Start of Incident Source Hospital Types أنواع مصادر الإبلاغ
    getAllIncidentSourceHospitalTypes() {
      this.lookupsService.getAllIncidentSourceHospitalTypes().subscribe({
        next: (response) => {
          this.incidentSourceHospitalTypes = response.data;
        }, error: (error) => {
          this.loadingPanel = false;
          this.translateService.get('NEDSS.COMMON.INTERNAL_SERVER_ERROR').subscribe((res: string) => {
            this.userMsg.error(res);
          });
        }, complete: () => {
  
        }
      })
    }
  
    onIncidentSourceHospitalTypesSelectionChange(event: any) {
      if (event.value.length > 0) {
        this.selecetedincidentSourceHospitalTypesIds = event.value.map(g => g.id);
        let filterIncidentSources: FilterIncidentSources = {} as FilterIncidentSources;
        if (this.selectedOrganizationId && this.selectedOrganizationId != -1)
          filterIncidentSources.organizationId = this.selectedOrganizationId;
        filterIncidentSources.incidentSourcesTypesIds = this.selecetedincidentSourceHospitalTypesIds;
        filterIncidentSources.healthAdministrationsIds = this.selectedHealthAdminIds.length == 0 ? null : this.selectedHealthAdminIds;
        filterIncidentSources.branchsIds = this.selectedbranchesIds.length == 0 ? null : this.selectedbranchesIds;
        filterIncidentSources.areasIds = this.selectedAreaIds.length == 0 ? null : this.selectedAreaIds;
        filterIncidentSources.governmentsIds = this.selectedGovermentIds.length == 0 ? null : this.selectedGovermentIds;
        filterIncidentSources.forSystemUser = true;
        this.getIncidentSourceHospital(filterIncidentSources);
      }
    }
    //End of Incident Source Hospital Types أنواع مصادر الإبلاغ

    onUserChange(event:any){
      this.thresholdUsers  = event.value;
    }


    resetForm(){
      this.governments = [];
      this.incidentSourceHospital = [];
      this.selecetedincidentSourceHospitalTypesIds = [];
      this.selectedGovermentIds = [];
      this.selectedHealthAdminIds = [];
      this.selectedbranchesIds = [];
      this.selecteduniversitiesIds = []
      this.selectedAreaIds = [];
      this.selectedIncidentSourceIds = [];
      this.branches = [];
      this.universities = [];
      this.areas = [];
      this.users = [];
      this.systemUserMainData = {} as SystemUserMainDataFilter;
    }


    addThresholdUser(){
      this.ref.close(this.thresholdUsers);
    }

    delete(userToDelete:ThresholdUser) {
      this.thresholdUsers = this.thresholdUsers.filter(user => user.id != userToDelete.id);
    }
}
