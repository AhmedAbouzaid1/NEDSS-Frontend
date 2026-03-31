import { TranslateService } from '@ngx-translate/core';
import { LookupsGetterService } from './../../../../core/services/lookups-getter.service';
import {
  Component,
  OnInit,
  ViewEncapsulation,
  ContentChildren,
  HostListener,
  QueryList,
} from '@angular/core';
import { PatientModel, FeverSymptoms } from '../models/patient-model';
import { SharedDataService } from '../services/shared-data.service';
import { UserMessageService } from 'src/app/core/services/user.message.service';
import {
  MultipleDropdownSettings,
  Relations,
  SingleDropdownSettings,
} from 'src/app/core/constants';
import { GeneralDataService } from '../services/general-data.service';
import { ActivatedRoute, Router } from '@angular/router';
import { NgControl } from '@angular/forms';
import { ActiveUserService } from 'src/app/core/services/active-user.service';
import { NationalityEnum } from '../models/nationality-enum';
import { take } from 'rxjs';
import { DepartmentEnum } from '../models/department-enum';
import { RelativeEnum } from '../models/relative-enum';
@Component({
  selector: 'app-incident-info',
  templateUrl: './incident-info.component.html',
  styleUrls: ['./incident-info.component.css'],
  encapsulation: ViewEncapsulation.None,
})
export class IncidentInfoComponent implements OnInit {
  @ContentChildren(NgControl) formControls: QueryList<NgControl>;

  @HostListener('submit')
  check() {
    const controls = this.formControls.toArray();

    for (let field of controls) {
      if (field.invalid) {
        (field.valueAccessor as any)._elementRef.nativeElement.focus();
        break;
      }
    }
  }
  delay: boolean = false;
  timer: any;
  patient: PatientModel = new PatientModel();
  levelId: any;
  diseases!: any[];
  nationalities!: any[];
  selectedNationality: any;
  selectedNationalityId: number;
  ogPatient: PatientModel = new PatientModel();
  governments!: any[];
  selectedGovernment: any;
  selectedGovernmentId: number = -1;

  healthAdministration!: any[];
  selectedHealthAdministration: any;
  selectedHealthAdministrationId: number;

  incidentSources!: any[];
  selectedIncidentSource: any;
  selectedIncidentSourceId: number;

  departments!: any[];
  selectedDepartment: any;
  selectedDepartmentId: number;

  relations = Relations;
  loadingPanel: boolean = false;
  isForeign: boolean = false;
  currentLang: string = 'ar';
  singleDropdownSettings = {};
  multipleDropdownSettings = {};
  Allpatients: any;
  maxDate = new Date();
  minDate = new Date(1900, 0, 1);
  defaultGovernmentId = null;
  defaultHealthAdministrationId = null;
  defaultIncidentSourceId = null;
  organizationId = null;
  SelectedbranchId: number;
  branches: any[];
  SelectedareaId: number;
  areas: any[];
  NationalityEnum = NationalityEnum;
  constructor(
    private sharedDataService: SharedDataService,
    private lookupsService: LookupsGetterService,
    private translateService: TranslateService,
    private userMsg: UserMessageService,
    public generalDataService: GeneralDataService,
    private router: Router,
    private route: ActivatedRoute,
    public activeUSerService: ActiveUserService,
  ) { }

  public get departmentEnum(): typeof DepartmentEnum {
    return DepartmentEnum;
  }

  ngOnInit() {
    setTimeout(() => {
      let link = document.getElementById('incidentInfo') as HTMLElement;

      link.classList.add('active');
      this.currentLang =
        localStorage.getItem('ls.currentLang') !== undefined &&
          localStorage.getItem('ls.currentLang') !== 'undefined'
          ? localStorage.getItem('ls.currentLang')
          : 'ar';
      this.getDiseases();

      let userData =
        JSON.parse(localStorage.getItem('ls.authorizationData')) ??
        JSON.parse(localStorage.getItem('lsOffline.authorizationData'));
      this.defaultGovernmentId =
        this.selectedGovernmentId =
        this.patient.incidentGovernmentId =
        userData.user.govenmentId;
      this.defaultHealthAdministrationId =
        userData?.user?.healthAdministrationId;
      this.levelId = userData?.user?.levelId;
      this.defaultIncidentSourceId = userData?.user?.incidentSourceId;
      switch (userData.user.levelId) {
        case 4:
          this.selectedIncidentSourceId = this.defaultIncidentSourceId =
            userData.user.incidentSourceId;
        case 3:
          this.selectedHealthAdministrationId =
            this.defaultHealthAdministrationId =
            userData.user.healthAdministrationId;
        case 2:
          this.selectedGovernmentId = this.defaultGovernmentId =
            userData.user.govenmentId;
        case 1:
        default:
          break;
      }

      this.getLookups();

      this.sharedDataService.getPatientObject().subscribe((patientObject) => {
        this.patient = patientObject;
        this.ogPatient = patientObject;
        this.patient.caseDiscoveryDate;

        this.selectedDepartment = [];
        if (this.departments != null && this.departments?.length > 0) {
          this.selectedDepartment.push(
            this.departments.filter(
              (o) => o.id == this.patient.incidentDepartmentId
            )[0]
          );
          this.selectedDepartmentId = this.patient.incidentDepartmentId;
        }
        this.selectedNationality = [];
        if (this.nationalities != null && this.nationalities?.length > 0) {
          this.selectedNationality.push(
            this.nationalities.filter(
              (o) => o.id == this.patient.nationalityId
            )[0]
          );
          this.selectedNationalityId = this.patient.nationalityId;
        }

        if (this.patient.relationShipDegreeId == null)
          this.patient.relationShipDegreeId = 0;
        if (this.patient.nationalId != null) {
          this.getGender(this.patient.nationalId);
        }
        this.levelId = JSON.parse(
          localStorage.getItem('ls.authorizationData')
        )?.user?.levelId;
        let healthAdministrationId = JSON.parse(
          localStorage.getItem('ls.authorizationData')
        ).user.healthAdministrationId;
        let govenmentId = JSON.parse(
          localStorage.getItem('ls.authorizationData')
        ).user.govenmentId;

        let incidentSourceId;

        if (patientObject.incidentGovernmentId) {
          govenmentId = this.selectedGovernmentId =
            patientObject.incidentGovernmentId;
        } else {
          incidentSourceId = JSON.parse(
            localStorage.getItem('ls.authorizationData')
          ).user.incidentSourceId;
        }

        if (patientObject.incidentSourceId) {
          incidentSourceId = this.selectedIncidentSourceId =
            patientObject.incidentSourceId;
        } else {
          incidentSourceId = JSON.parse(
            localStorage.getItem('ls.authorizationData')
          ).user.incidentSourceId;
        }

        if (
          this.patient.incidentGovernmentId == undefined ||
          this.patient.incidentGovernmentId == null
        ) {
          //alert("10-patiet gov id set to " + govenmentId + " from " + this.patient.incidentGovernmentId);
          this.patient.incidentGovernmentId = govenmentId;
          this.patient.incidentHealthAdministrationId = healthAdministrationId;
          this.patient.incidentSourceId = incidentSourceId;
        }

        this.organizationId = JSON.parse(
          localStorage.getItem('ls.authorizationData')
        ).user?.organizationId;

        this.SelectedbranchId = JSON.parse(
          localStorage.getItem('ls.authorizationData')
        ).user?.branchId;
        if (
          this.activeUSerService.getAccessibleParts?.showBranches ||
          this.activeUSerService.getAccessibleParts?.showUniversities
        ) {
          this.getBranches();
        }
        if (patientObject.incidentAreaId) {
          this.SelectedareaId = this.patient.incidentAreaId;
        } else {
          this.SelectedareaId = JSON.parse(
            localStorage.getItem('ls.authorizationData')
          ).user?.areaId;
        }
      });

      const routeParams = this.route.snapshot.paramMap;
      var tokenText = routeParams.get('clear');
      this.router.routerState.root.queryParams.subscribe((params) => {
        if (params.clear == 1) {
          this.patient = new PatientModel();
          this.sharedDataService.setPatientObject(new PatientModel());
          this.sharedDataService.ShowSentinel = false;
          this.selectedDepartment = [];
          this.selectedNationality = [];
          this.patient.relationShipDegreeId = 0;
          let healthAdministrationId = JSON.parse(
            localStorage.getItem('ls.authorizationData')
          ).user.healthAdministrationId;
          let govenmentId = JSON.parse(
            localStorage.getItem('ls.authorizationData')
          ).user.govenmentId;
          let incidentSourceId = JSON.parse(
            localStorage.getItem('ls.authorizationData')
          ).user.incidentSourceId;

          if (this.governments?.length > 0)
            this.selectedGovernmentId = govenmentId != null ? govenmentId : -1;
          this.patient.incidentGovernmentId = govenmentId;
          if (this.healthAdministration?.length > 0)
            this.selectedHealthAdministration =
              this.healthAdministration?.filter(
                (o) => o.id == healthAdministrationId
              );
          this.patient.incidentHealthAdministrationId = healthAdministrationId;
          if (this.incidentSources?.length > 0)
            this.selectedIncidentSource = this.incidentSources?.filter(
              (o) => o.id == incidentSourceId
            );
          this.patient.incidentSourceId = incidentSourceId;
          this.onGovernmentChanged();
        }
      });

      this.singleDropdownSettings = SingleDropdownSettings;
      this.multipleDropdownSettings = MultipleDropdownSettings;
      this.loadingPanel = false;
      this.checkInitNationality();
      if (this.patient.nationalityId != NationalityEnum.Egyptian) {
        this.onNationalIdChanged(this.patient.nationalityId);
      }

      this.generalDataService.cardIdValidationMessage = '';
    }, 600);
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
          if (this.patient.incidentBranchId) {
            this.SelectedbranchId = this.patient.incidentBranchId;
          }
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
      this.getIncidentSources(this.SelectedbranchId);
    }
  }

  getAreas() {
    this.lookupsService.getAllAreas(this.SelectedbranchId).subscribe(
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
  areaSelected() {
    // this.governmentDeSelected();
    this.patient.incidentAreaId = this.SelectedareaId;
    this.getIncidentSources(this.SelectedareaId);
    // if (this.SelectedareaId) {
    // this.getIncidentSources(
    //   this.user.healthAdministrationId,
    //   this.user.organizationId
    // );
    // }
  }

  getDiseases() {
    this.lookupsService.getAllDiseaseGroups().subscribe(
      (result: any) => { },
      (error) => { }
    );
    this.lookupsService.getAllDiseaseGroups().subscribe(
      (result: any) => {
        if (result != null && result != undefined) {
          this.diseases = result.data;
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

  onItemSelect(item: any) { }
  onSelectAll(items: any) { }
  onNationalityChanged() {
    if (this.selectedNationalityId != NationalityEnum.NotSelected) {
      this.patient.nationalityId = this.selectedNationalityId;
      if (this.selectedNationalityId != NationalityEnum.Egyptian) {
        this.isForeign = true;
        this.patient.nationalId = '';
        this.onNationalIdChanged(null);
      } else {
        this.isForeign = false;
      }
    } else {
      this.patient.nationalityId = NationalityEnum.NotSelected;
      this.isForeign = false;
    }
  }

  checkInitNationality() {
    if (this.patient.nationalityId == 0 || this.patient.nationalityId == null) {
      this.isForeign = false;
    } else if (this.patient.nationalityId != NationalityEnum.Egyptian) {
      this.onNationalIdChanged(this.patient.nationalityId);
      this.isForeign = true;
    } else {
      this.isForeign = false;
    }
  }
  onGovernmentChanged() {
    setTimeout(() => {
      if (
        this.selectedGovernmentId != null &&
        this.selectedGovernmentId != -1
      ) {
        this.patient.incidentGovernmentId = this.selectedGovernmentId;
        this.selectedIncidentSourceId = -1;
        if (this.activeUSerService.getAccessibleParts?.showDepartments) {
          this.getHealthAdministration(this.patient.incidentGovernmentId);
        } else {
          this.getIncidentSources(
            this.patient.incidentHealthAdministrationId,
            this.selectedGovernmentId
          );
        }
      } else {
        this.patient.incidentGovernmentId = null;
        this.healthAdministration = [];
        this.selectedHealthAdministration = null;
        this.selectedHealthAdministrationId = -1;
        this.patient.incidentHealthAdministrationId = null;
        this.incidentSources = [];
        this.patient.incidentSourceId = null;
        this.selectedIncidentSource = null;
        this.selectedIncidentSourceId = -1;
      }
    }, 1000);
  }
  onHealthAdministrationChanged() {
    if (this.selectedHealthAdministrationId != -1) {
      this.patient.incidentHealthAdministrationId =
        this.selectedHealthAdministrationId;
      this.getIncidentSources(this.patient.incidentHealthAdministrationId);
    } else {
      this.patient.incidentHealthAdministrationId = null;
      this.incidentSources = [];
      this.patient.incidentSourceId = null;
      this.selectedIncidentSource = null;
      this.selectedIncidentSourceId = -1;
      this.getIncidentSources(-1);
      this.incidentSources = [];
    }
  }
  onIncidentSourceChanged() {
    if (this.selectedIncidentSourceId != -1) {
      this.patient.incidentSourceId = this.selectedIncidentSourceId;
    } else {
      this.patient.incidentSourceId = null;
    }
  }
  onDepartmentChanged() {
    this.patient.hiddenInsideDepartment = false;
    if (this.selectedDepartmentId != -1) {
      this.patient.incidentDepartmentId = this.selectedDepartmentId;
      if (this.selectedDepartment?.length > 0) {
        this.patient.incidentDepartmentId = this.selectedDepartmentId;
      }
      this.patient.hiddenInsideDepartment =
        this.selectedDepartmentId == DepartmentEnum.External ? true : false;
    } else this.patient.incidentDepartmentId = null;
    if (this.patient.nationalId == null) {
      this.patient.age = null;
      this.patient.birthDate = null;
      this.patient.genderId = null;
      this.patient.ageTypeId = null;
    } else {
      this.getGender(this.patient.nationalId);
    }
    this.generalDataService.isIncidentDepartmentValid =
      this.generalDataService.checkIncidentDepartmentValid(
        this.patient.incidentDepartmentId
      );
    this.sharedDataService.setPatientObject({ ...this.patient });
  }

  getLookups() {
    this.getGovernments();
    this.getDepartments();
    this.getNationalities();
  }

  getNationalities() {
    this.lookupsService.getAllNationalitys().subscribe(
      (result: any) => {
        if (result != null && result != undefined) {
          this.nationalities = [
            { id: -1, arabicName: 'إختر', englishName: 'Select' },
          ];
          result.data.forEach((nat) => {
            this.nationalities.push(nat);
          });
          if (this.patient.nationalityId > 0) {
            let filteredNationality = this.nationalities.filter(
              (item) => item.id === this.patient.nationalityId
            );
            setTimeout(() => {
              this.selectedNationalityId = this.patient.nationalityId;
            }, 500);
          } else {
            setTimeout(() => {
              this.selectedNationalityId = NationalityEnum.Egyptian;
              this.onNationalityChanged();
            }, 500);
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
  getGovernments() {
    this.lookupsService.getAllGovernments().subscribe(
      (result: any) => {
        if (result != null && result != undefined) {
          this.governments = [
            { id: -1, arabicName: 'إختر', englishName: 'Select' },
          ];
          result.data.forEach((gov) => {
            this.governments.push(gov);
          });
          //;
          //here if there is no patient , incidentGovernmentId will be null or indefined so we need to get incidentGovernmentId from localStorage
          if (this.patient.incidentGovernmentId > 0) {
            // alert("1-selected gov set to " + this.patient.incidentGovernmentId);
            setTimeout(() => {
              this.selectedGovernmentId = this.patient.incidentGovernmentId;
              if (this.activeUSerService.getAccessibleParts?.showDepartments) {
                this.getHealthAdministration(this.patient.incidentGovernmentId);
              } else {
                this.getIncidentSources(
                  this.patient.incidentHealthAdministrationId,
                  this.selectedGovernmentId
                );
              }
            }, 100);
          } else {
            // alert("2-selected gov set to " + JSON.parse(localStorage.getItem('ls.authorizationData')).user.govenmentId);
            this.selectedGovernment = this.governments.filter(
              (item) => item.id === this.selectedGovernmentId
            );
            if (this.activeUSerService.getAccessibleParts?.showDepartments) {
              this.getHealthAdministration(this.selectedGovernmentId);
            } else {
              this.getIncidentSources(
                this.patient.incidentHealthAdministrationId,
                this.selectedGovernmentId
              );
            }
            if (this.selectedGovernmentId == null)
              this.selectedGovernmentId = -1;
          }
          if (this.selectedGovernmentId != -1) {
            this.onGovernmentChanged();
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
  getHealthAdministration(governmentID: any) {
    if (governmentID != null && governmentID != -1) {
      // this.Delay();
      this.loadingPanel = true;
      this.lookupsService
        .getPageHealthAdministrations({ governmentID: governmentID })
        .subscribe(
          (result: any) => {
            if (result != null && result != undefined) {
              this.healthAdministration = [
                { id: -1, arabicName: 'إختر', englishName: 'Select' },
              ];
              // this.RemoveDelay();
              result.data.forEach((he) => {
                this.healthAdministration.push(he);
              });
              //;
              setTimeout(() => {
                if (this.patient.incidentHealthAdministrationId > 0) {
                  this.selectedHealthAdministrationId =
                    this.patient.incidentHealthAdministrationId;
                  this.getIncidentSources(
                    this.patient.incidentHealthAdministrationId
                  );
                } else {
                  // this.getIncidentSources(this.selectedHealthAdministrationId);

                  if (this.selectedHealthAdministrationId == null)
                    this.selectedHealthAdministrationId = -1;
                }
                if (this.selectedHealthAdministrationId != -1) {
                  // ;
                  this.onHealthAdministrationChanged();
                }
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
  }

  getIncidentSources(healthAdministrationID: any, governmentID = null) {
    this.lookupsService
      .getPageIncidentSourceHospitals({
        // healthAdministrationID: healthAdministrationID,
        healthAdministrationID: this.selectedHealthAdministrationId,
        branchId: this.activeUSerService.getAccessibleParts?.showAreas
          ? null
          : this.SelectedbranchId,
        areaId: this.SelectedareaId,
        governmentID: governmentID,
        forSystemUser: governmentID ? true : null,
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
            //
            //     this.incidentSources = [{ id: -1, arabicName: 'إختر', englishName: 'Select' }];
            //     result.data.forEach(inc => {
            //       this.incidentSources.push(inc);
            //     });

            if (this.patient.incidentSourceId > 0) {
              this.selectedIncidentSource = this.incidentSources.filter(
                (item) => item.id === this.patient.incidentSourceId
              );
              this.selectedIncidentSourceId = this.patient.incidentSourceId;
            } else {
              this.selectedIncidentSource = this.incidentSources.filter(
                (item) =>
                  item.id ===
                  JSON.parse(localStorage.getItem('ls.authorizationData')).user
                    .incidentSourceId
              );
              this.selectedIncidentSourceId = JSON.parse(
                localStorage.getItem('ls.authorizationData')
              ).user.incidentSourceId;
              if (this.selectedIncidentSourceId == null)
                this.selectedIncidentSourceId = -1;
            }
            if (this.selectedIncidentSourceId != -1) {
              this.onIncidentSourceChanged();
            }
            //this.selectedIncidentSourceId = JSON.parse(localStorage.getItem('ls.authorizationData')).user.incidentSourceId;
            //if (this.selectedIncidentSourceId != null && this.levelId != 1 && this.levelId != 2 && this.levelId!=3) {
            //  this.onIncidentSourceChanged();
            //}
            //else { this.selectedIncidentSourceId = -1; }
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
    this.lookupsService.getAllDepartments().subscribe(
      (result: any) => {
        if (result != null && result != undefined) {
          this.departments = [
            { id: -1, arabicName: 'إختر', englishName: 'Select' },
          ];
          result.data.forEach((dep) => {
            this.departments.push(dep);
          });
          if (this.patient.incidentDepartmentId > 0) {
            setTimeout(() => {
              this.selectedDepartmentId = this.patient.incidentDepartmentId;
            }, 800);
          } else {
            this.selectedDepartmentId = -1;
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
  onNationalIdChanged(value: any, isManualChange = false) {
    if (
      value != null &&
      value.toString().length === 14 &&
      this.generalDataService.validateEgyptNational(value)
    ) {
      this.getGender(value);
      this.getAllByNationalId(parseInt(value.toString()));
    } else {
      this.Allpatients = [];
      this.patient.age = null;
      this.patient.birthDate = null;
      this.patient.genderId = null;
      this.patient.ageTypeId = null;
    }
    if (isManualChange) {
      this.sharedDataService.setPatientObject({
        ...this.patient,
        firstName: this.sharedDataService.isEditMode
          ? this.patient.firstName
          : null,
        secondName: this.sharedDataService.isEditMode
          ? this.patient.secondName
          : null,
        thirdName: this.sharedDataService.isEditMode
          ? this.patient.thirdName
          : null,
        familyName: this.sharedDataService.isEditMode
          ? this.patient.familyName
          : null,
        phoneNo1: this.sharedDataService.isEditMode
          ? this.patient.phoneNo1
          : null,
        phoneNo2: this.sharedDataService.isEditMode
          ? this.patient.phoneNo2
          : null,
        newPhoneNo1: this.sharedDataService.isEditMode
          ? this.patient.newPhoneNo1
          : null,
        genderId: null,
        birthDate: null,
        age: null,
        ageTypeId: null,
        maritalStatusId: this.sharedDataService.isEditMode
          ? this.patient.maritalStatusId
          : null,
        patientJobCategoryId: this.sharedDataService.isEditMode
          ? this.patient.patientJobCategoryId
          : null,
        patientJobId: this.sharedDataService.isEditMode
          ? this.patient.patientJobId
          : null,
        educationPhaseId: this.sharedDataService.isEditMode
          ? this.patient.educationPhaseId
          : null,
        schoolCategoryId: this.sharedDataService.isEditMode
          ? this.patient.schoolCategoryId
          : null,
        workAddress: this.sharedDataService.isEditMode
          ? this.patient.workAddress
          : null,
        patientJobName: this.sharedDataService.isEditMode
          ? this.patient.patientJobName
          : null,
      });
    }
  }

  getAllByNationalId(nationalId) {
    this.generalDataService.getAllByNationalId(nationalId.toString()).subscribe(
      (res) => {
        let date = res?.data;
        this.Allpatients = date;
        if (date?.length > 0) {
          this.userMsg.success('المريض موجود مسبقا');
        } else this.userMsg.info('المريض غير موجود مسبقا');
      },
      (err) => { }
    );
  }
  onRelationShipDegreeIdChange() {
    if (this.patient.nationalId != null) {
      this.getGender(this.patient.nationalId);
    } else {
      this.patient.age = null;
      this.patient.birthDate = null;
      this.patient.genderId = null;
      this.patient.ageTypeId = null;
    }
    if (this.patient.nationalityId == NationalityEnum.Egyptian) {
      this.onNationalIdChanged(this.patient.nationalId);
    } else if (this.patient.nationalityId >= 20) {
      //Q HERE
      this.onPassportNoChanged(this.patient.passportNo);
    }
  }
  pad(num, size) {
    let s = num + '';

    while (s?.length < size) s = '0' + s;
    return s;
  }
  getGender(value: any) {
    if (this.patient.relationShipDegreeId != RelativeEnum.Himself) {
      this.patient.genderId = null;
      this.patient.age = null;
      this.patient.ageTypeId = null;
      this.patient.birthDate = null;
      return;
    }
    let bational = value.toString();
    let number = bational.slice(-2, -1);
    //  gender
    if (number % 2 == 0) this.patient.genderId = 2;
    else this.patient.genderId = 1;
    // national id

    let yearAll = 19;
    if (bational.slice(0, 1) == '3') yearAll = 20;
    let dateStr =
      yearAll +
      bational.slice(1, 3) +
      '-' +
      bational.slice(3, 5) +
      '-' +
      this.pad(Number(bational.slice(5, 7)), 2);
    this.patient.birthDate = new Date(dateStr).toISOString();

    let timeDiff = Math.abs(Date.now() - new Date(dateStr).getTime());
    var days = timeDiff / (1000 * 3600 * 24);
    var monthes = timeDiff / (1000 * 3600 * 24) / 30;
    var years = timeDiff / (1000 * 3600 * 24) / 365.25;
    if (years >= 1) {
      this.patient.age = Math.floor(years);
      this.patient.ageTypeId = 3;
    } else if (monthes >= 1) {
      this.patient.age = Math.floor(monthes);
      this.patient.ageTypeId = 2;
    } else {
      this.patient.age = Math.floor(days);
      this.patient.ageTypeId = 1;
    }
  }

  onPassportNoChanged(value: any) {
    if (this.patient.nationalId != null) {
      this.getGender(this.patient.nationalId);
    } else {
      this.patient.age = null;
      this.patient.birthDate = null;
      this.patient.genderId = null;
      this.patient.ageTypeId = null;
    }
    if (
      this.patient.passportNo != null &&
      this.patient.passportNo?.length >= 20
    ) {
      this.generalDataService
        .getAllByPassportNo(parseInt(this.patient.passportNo))
        .subscribe(
          (res) => {
            let date = res?.data;
            this.Allpatients = date;
            if (date?.length > 0) {
              this.userMsg.success('المريض موجود مسبقا');
            } else this.userMsg.info('المريض غير موجود مسبقا');
          },
          (err) => { }
        );
    } else {
      this.Allpatients = [];
    }
  }
  editPationt(op) {
    this.setPatient(op);
  }
  setPatient(data: any) {
    let patient = new PatientModel();

    patient.incidentGovernmentId = data.incidentGovernmentId;

    patient.incidentHealthAdministrationId =
      data.incidentHealthAdministrationId;
    patient.incidentSourceId = data.incidentSourceId;
    patient.nationalityId = data.nationalityId;
    patient.incidentDepartmentId = data.incidentDepartmentId;

    patient.nationalId = data.nationalId;
    patient.nationalityId = data.nationalityId;

    patient.relationShipDegreeId = data.relationShipDegreeId;
    patient.caseDiscoveryDate = data.caseDiscoveryDate;
    patient.caseDiscoveryTime = data.caseDiscoveryTime;

    patient.passportNo = data.passportNo;
    patient.firstName = data.firstName;
    patient.secondName = data.secondName;
    patient.thirdName = data.thirdName;
    patient.familyName = data.familyName;
    patient.phoneNo1 = data.phoneNo1;
    patient.phoneNo2 = data.phoneNo2;
    patient.newPhoneNo1 = data.newPhoneNo1;
    patient.genderId = data.genderId;
    patient.birthDate = data.birthDate;
    patient.age = data.age;
    patient.patientJobCategoryId = data.patientJobCategoryId;

    patient.maritalStatusId = data.maritalStatusId;
    patient.educationPhaseId = data.educationPhaseId;
    patient.schoolCategoryId = data.schoolCategoryId;
    patient.workAddress = data.workAddress;
    patient.homeGovernmentId = data.homeGovernmentId;
    patient.homeHealthAdministrationId = data.homeHealthAdministrationId;
    patient.homeCityId = data.homeCityId;
    patient.homeHealthOfficeId = data.homeHealthOfficeId;
    patient.homePrincipalityId = data.homePrincipalityId;
    patient.livingAddress = data.livingAddress;
    patient.homeGovernmentId = data.homeGovernmentId;
    patient.clinicalSymptomIds =
      data?.clinicalSymptomIds ?? data?.ClinicalSymptomIds ?? [];
    if (patient.feverSymptoms == undefined || patient.feverSymptoms == null) {
      patient.feverSymptoms = new FeverSymptoms();
    }
    patient.incidentBranchId = data.SelectedbranchId;
    this.sharedDataService.setPatientObject(patient);

    this.selectedGovernment = this.governments.filter(
      (x) => x.id == patient.incidentGovernmentId
    );
    this.selectedGovernmentId = patient.incidentGovernmentId;
    this.onGovernmentChanged();
    this.selectedDepartment = this.departments.filter(
      (x) => x.id == patient.incidentDepartmentId
    );
    this.selectedDepartmentId = patient.incidentDepartmentId;
    this.selectedNationality = this.nationalities.filter(
      (x) => x.id == patient.nationalityId
    );
    this.selectedNationalityId = patient.nationalityId;
  }

  isDiscoveryTimeValid(): boolean {
    let now = new Date();

    let discoveredDate = new Date(this.patient.caseDiscoveryDate);
    let isToday =
      discoveredDate.getDate() === now.getDate() &&
      discoveredDate.getMonth() === now.getMonth() &&
      discoveredDate.getFullYear() === now.getFullYear();

    if (isToday) {
      let discoveredTime = new Date(discoveredDate);
      if (
        this.patient.caseDiscoveryTime != undefined &&
        this.patient.caseDiscoveryTime != null
      ) {
        let [hours, minutes] = this.patient.caseDiscoveryTime.split(':');
        discoveredTime.setHours(Number(hours), Number(minutes));
      }
      return discoveredTime <= now;
    }

    return true;
  }
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
}
