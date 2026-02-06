import { FormControl, FormGroup } from '@angular/forms';
import { Component, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { LookupsGetterService } from 'src/app/core/services/lookups-getter.service';
import { UserMessageService } from 'src/app/core/services/user.message.service';
import { SearchSharedDataService } from '../../services/search-shared-data.service';
import { Patient } from '../../models/patient';
import { SingleDropdownSettings } from 'src/app/core/constants';
import { GeneralDataService } from '../../../general-data/services/general-data.service';
import { ActiveUserService } from 'src/app/core/services/active-user.service';

@Component({
  selector: 'app-general-report-form',
  templateUrl: './general-report-form.component.html',
  styleUrls: ['./general-report-form.component.css'],
})
export class generalreportFormComponent implements OnInit {
  maxDate = new Date();
  minDate = new Date(1900, 0, 1);
  currentLang: string;

  patient: Patient;
  governments: any;
  loadingPanel: boolean = false;
  generalReportForm: FormGroup;
  healthAdministration: any;
  incidentSources: any;
  departments: any;
  governmentselectedId: number = -1;
  selectedincidentSources: number = -1;
  selectedDep: number = -1;
  selectedhealthAdministrationId: number = -1;
  singleDropdownSettings = SingleDropdownSettings;
  levelId: any;

  organizationId: number;
  SelectedbranchId: number;
  branches: any[];
  SelectedareaId: number;
  areas: any[];

  constructor(
    private lookupsService: LookupsGetterService,
    private translateService: TranslateService,
    private userMsg: UserMessageService,
    public generalDataService: GeneralDataService,
    private sharedDataService: SearchSharedDataService,
    public activeUSerService: ActiveUserService,
    private lookupsGetterService: LookupsGetterService
  ) {}

  ngOnInit() {
    this.currentLang =
      localStorage.getItem('ls.currentLang') !== undefined &&
      localStorage.getItem('ls.currentLang') !== 'undefined'
        ? localStorage.getItem('ls.currentLang')
        : 'ar';
    this.levelId = JSON.parse(
      localStorage.getItem('ls.authorizationData')
    )?.user?.levelId;
    let link = document.getElementById('fastSearch') as HTMLElement;
    link.classList.add('active');
    this.generalReportForm = new FormGroup({
      government: new FormControl(),
      healthAdministration: new FormControl(),
      reportSource: new FormControl(),
      section: new FormControl(),
      startDate: new FormControl(),
      endDate: new FormControl(),
      incidentHealthAdministrationId: new FormControl(),
      incidentGovernmentId: new FormControl(),
      branchId: new FormControl(),
      areaId: new FormControl(),
      departmentId: new FormControl(),
      universityId: new FormControl(),
    });
    this.loadingPanel = true;
    this.sharedDataService.getPatientObject().subscribe((patientObject) => {
      this.patient = patientObject;
    });
    this.getLookups();

    this.setDefaultSelectedFromlocalStorage();

    this.loadingPanel = false;
  }
  disableControls() {
    if (!this.activeUSerService.getAccessibleParts?.enableGovernments)
      this.generalReportForm.controls?.government?.disable();

    if (!this.activeUSerService.getAccessibleParts?.enableDepartments)
      this.generalReportForm.controls?.healthAdministration?.disable();

    if (!this.activeUSerService.getAccessibleParts?.enableUniversities)
      this.generalReportForm.controls?.universityId?.disable();

    if (!this.activeUSerService.getAccessibleParts?.enableBranches)
      this.generalReportForm.controls?.branchId?.disable();

    if (!this.activeUSerService.getAccessibleParts?.enableAreas)
      this.generalReportForm.controls?.areaId?.disable();

    if (!this.activeUSerService.getAccessibleParts?.enableSources)
      this.generalReportForm.controls?.reportSource?.disable();
  }
  setDefaultSelectedFromlocalStorage() {
    setTimeout(() => {
      this.organizationId = JSON.parse(
        localStorage.getItem('ls.authorizationData')
      )?.user?.organizationId;
      this.SelectedbranchId = JSON.parse(
        localStorage.getItem('ls.authorizationData')
      ).user?.branchId;
      if (
        this.activeUSerService.getAccessibleParts?.showBranches ||
        this.activeUSerService.getAccessibleParts?.showUniversities
      ) {
        this.getBranches();
      }
      this.SelectedareaId = JSON.parse(
        localStorage.getItem('ls.authorizationData')
      ).user?.areaId;
      this.disableControls();
    }, 500);
  }
  clearAll() {
    this.generalReportForm.reset();
    this.patient = {};
    this.patient.pageIndex = 0;
    this.patient.pageSize = 10;
    this.patient.filterType = 1;
    this.sharedDataService.setPatientObject(this.patient);
    this.governmentselectedId = null;
    this.selectedhealthAdministrationId = null;
    this.selectedincidentSources = null;
    this.SelectedbranchId = null;
    this.SelectedareaId = null;
    this.selectedDep = null;
  }
  logCollected() {
    console.log(this.generalReportForm.value);
  }

  getLookups() {
    this.getGovernments();
    this.getDepartments();
  }
  getGovernments() {
    this.lookupsService.getAllGovernments().subscribe(
      (result: any) => {
        if (result != null && result != undefined) {
          this.governments = [
            { id: -1, arabicName: 'إختر', englishName: 'Select' },
          ];
          result.data.forEach((he) => {
            this.governments.push(he);
          });

          if (this.levelId != 1) {
            this.governmentselectedId = JSON.parse(
              localStorage.getItem('ls.authorizationData')
            ).user.govenmentId;
            this.governmentSelected();
          } else if (
            this.patient.incidentGovernmentId != null &&
            this.patient.incidentGovernmentId != undefined
          ) {
            this.governmentselectedId = this.patient.incidentGovernmentId;
            this.getHealthAdministration(
              this.patient.incidentGovernmentId,
              false
            );
          } else {
            this.patient.incidentGovernmentId = null;
            this.governmentselectedId = -1;
            this.patient.incidentHealthAdministrationId = null;
            this.selectedhealthAdministrationId = -1;
            this.patient.incidentSourceId = null;
            this.selectedincidentSources = -1;
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
    this.patient.incidentGovernmentId =
      this.governmentselectedId == -1 ? null : this.governmentselectedId;
    if (
      this.patient.incidentGovernmentId != null &&
      this.patient.incidentGovernmentId != -1
    ) {
      this.getHealthAdministration(this.patient.incidentGovernmentId, true);
    } else {
      this.patient.incidentHealthAdministrationId = null;
      this.selectedhealthAdministrationId = -1;
      this.patient.incidentSourceId = null;
      this.selectedincidentSources = -1;
    }

    if(this.organizationId == 4 || this.organizationId == 5) {
      this.getIncidentSourceHospital({
        organizationId:this.organizationId,
        governmentsIds:[this.governmentselectedId],
        forSystemUser:true
      })
    }
  }

  getHealthAdministration(governmentID: any, newGovernment: boolean) {
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
              if (newGovernment && this.levelId == 1) {
                this.patient.incidentHealthAdministrationId = null;
                this.selectedhealthAdministrationId = -1;
                this.patient.incidentSourceId = null;
                this.selectedincidentSources = -1;
              } else if (this.levelId != 1 && this.levelId != 2) {
                this.selectedhealthAdministrationId = JSON.parse(
                  localStorage.getItem('ls.authorizationData')
                ).user.healthAdministrationId;
                this.healthAdministrationSelected();
              } else if (
                this.patient.incidentHealthAdministrationId != null &&
                this.patient.incidentHealthAdministrationId != undefined
              ) {
                this.selectedhealthAdministrationId =
                  this.patient.incidentHealthAdministrationId;
                this.getIncidentSources(
                  this.patient.incidentHealthAdministrationId,
                  false
                );
              } else {
                this.patient.incidentHealthAdministrationId = null;
                this.selectedhealthAdministrationId = -1;
                this.patient.incidentSourceId = null;
                this.selectedincidentSources = -1;
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

  fromDateSelected(event) {
    this.patient.startDate = event.value;
  }
  endDateSelected(event) {
    this.patient.endDate = event.value;
  }
  healthAdministrationSelected() {
    this.patient.incidentHealthAdministrationId =
      this.selectedhealthAdministrationId == -1
        ? null
        : this.selectedhealthAdministrationId;
    if (
      this.patient.incidentHealthAdministrationId != null &&
      this.patient.incidentHealthAdministrationId != -1
    ) {
      this.getIncidentSources(
        this.patient.incidentHealthAdministrationId,
        true
      );
    } else {
      this.patient.incidentSourceId = this.selectedincidentSources = -1;
    }
  }

  getIncidentSources(healthAdministrationID: any, newHealthAdmin: boolean) {
    //, reportingOrResidence: 1
    this.lookupsService
      .getPageIncidentSourceHospitals({
        healthAdministrationID: this.selectedhealthAdministrationId,
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
            if (result.data.length > 0) {
              if (newHealthAdmin && this.levelId == 1) {
                this.selectedincidentSources = -1;
              } else if (
                this.levelId != 1 &&
                this.levelId != 2 &&
                this.levelId != 3
              ) {
                this.selectedincidentSources = JSON.parse(
                  localStorage.getItem('ls.authorizationData')
                ).user.incidentSourceId;
                this.incidentSourcesSelected();
              } else if (
                this.patient.incidentSourceId != null &&
                this.patient.incidentSourceId != undefined
              ) {
                this.selectedincidentSources = this.patient.incidentSourceId;
              } else {
                this.selectedincidentSources = -1;
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
  departmentselected() {
    this.patient.incidentDepartmentId =
      this.selectedDep == -1 ? null : this.selectedDep;
  }
  departmentDselected() {
    this.patient.incidentDepartmentId = null;
  }
  incidentSourcesSelected() {
    this.patient.incidentSourceId =
      this.selectedincidentSources == -1 ? null : this.selectedincidentSources;
  }

  setgenderValue(event) {
    this.patient.genderId = event.id;
  }
  getDepartments() {
    this.lookupsService.getAllDepartments().subscribe(
      (result: any) => {
        if (result != null && result != undefined) {
          this.departments = result.data;
            this.departments.unshift({
            id: null,
            arabicName: 'إختر',
            englishName: 'Select',
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
          if (this.SelectedbranchId > 0) {
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
    this.patient.incidentBranchId = this.SelectedbranchId;
    if (this.SelectedbranchId) {
      // this.healthAdministrations = [];
      // this.getHealthAdministrationsForUsers(this.user.branchId);
      this.getAreas();
      this.getIncidentSources(this.SelectedbranchId, true);
    }
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
          if (this.SelectedareaId) {
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
    // this.governmentDeSelected();
    this.patient.incidentAreaId = this.SelectedareaId;
    // if (this.SelectedareaId) {
    // this.isAreaValid = this.checkAreaValid();
    this.getIncidentSources(this.SelectedareaId, true);
    // }
  }

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
