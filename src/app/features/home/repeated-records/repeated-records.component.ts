import { Router } from '@angular/router';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormArray, FormControl, FormGroup, FormBuilder } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import { LookupsGetterService } from 'src/app/core/services/lookups-getter.service';
import { UserMessageService } from 'src/app/core/services/user.message.service';
import { RepeatedService } from './Repeated.service';
import {
  MultipleDropdownSettings,
  SingleDropdownSettings,
} from 'src/app/core/constants';
import { ExportService } from '../../../core/services/export.service';
import { GeneralDataCompletionServiceService } from '../general-data-completion/services/general-data-completion-service.service';
import { ExportAsConfig } from 'ngx-export-as';
import { ActiveUserService } from 'src/app/core/services/active-user.service';

@Component({
  selector: 'app-repeated-records',
  templateUrl: './repeated-records.component.html',
  styleUrls: ['./repeated-records.component.css'],
})
export class RepeatedRecordsComponent implements OnInit {
  @ViewChild('myTableElementId', { static: false }) tableElement: ElementRef;
  screenName: string;
  maxDate = new Date();
  minDate = new Date(1900, 0, 1);
  levelId: any;
  currentLang: string;
  dir: string;
  delay: boolean = false;
  timer: any;
  departments: any;
  selectedDepartment: any[] = [];
  startDate: any;
  endDate: any;
  currentConfig: string = 'myTableElementId';
  exportAsPdfConfig: ExportAsConfig = {
    type: 'pdf', // the type you want to download
    elementIdOrContent: this.currentConfig, // the id of html/table element
  };

  noData: boolean = true;
  isSubmitted = false;
  pleaseComplete: boolean = false;
  repeatedRecordsForm: FormGroup;
  generalDataCompletionFilter = {
    isNullName: false,
    isNullBarentName: false,
    isNullGrandPa: false,
    isNullFamaly: false,
    isNullNationalId: false,
    isNullAge: false,
    isNullAgeType: false,
    isNullAddressGroup: false,
    diseaseIds: null,
  };
  // repeatedRecordsForm = this.fb.group({
  //   areaType: [''],
  // });
  public checks: any[] = [
    { description: 'الاسم', value: 'name' },
    { description: 'اسم الاب', value: 'seconName' },
    { description: 'اسم الجد', value: 'thirdName' },
    { description: 'اسم العائلة', value: 'familyName' },
    { description: ' الرقم القومي', value: 'nationalId' },
    { description: ' السن ', value: 'age' },
    { description: ' الفئة العمرية ', value: 'ageCategory' },
    { description: 'محل السكن ', value: 'homeCityId' },
  ];
  governments: any;
  branches: any;
  loadingPanel: boolean;
  healthAdministration: any[];
  incidentSources: any[];
  Diseasies: any;
  repeatedData: any[] = [];
  healthAdministrationId: number;
  incidentSourcesId: number;
  selectGovernmentId: number = -1;
  SelectedbranchId: number = -1;
  defaultBranchId = null;
  areas: any[];
  SelectedareaId: number;
  defaultAreaId: number;
  organizationId: any;
  singleDropdownSettings = SingleDropdownSettings;
  multiDropdownSettings = MultipleDropdownSettings;
  fromDate?: Date = null;
  // fromDate: any;
  toDate?: Date = null;
  filteration: any;

  constructor(
    private lookupsService: LookupsGetterService,
    private lookupsGetterService: LookupsGetterService,
    private translateService: TranslateService,
    private userMsg: UserMessageService,
    private repearedService: RepeatedService,
    private router: Router,
    private generalDataCompletionServiceService: GeneralDataCompletionServiceService,
    private exportService: ExportService,
    public fb: FormBuilder,
    public activeUSerService: ActiveUserService
  ) { }

  ngOnInit(): void {
    this.currentLang =
      localStorage.getItem('ls.currentLang') !== undefined &&
        localStorage.getItem('ls.currentLang') !== 'undefined'
        ? localStorage.getItem('ls.currentLang')
        : 'ar';

    this.dir = this.currentLang == 'ar' ? 'rtl' : 'ltr';

    setTimeout(() => {
      console.log(this.repeatedRecordsForm);
      this.levelId = JSON.parse(
        localStorage.getItem('ls.authorizationData')
      )?.user?.levelId;

      this.organizationId = JSON.parse(
        localStorage.getItem('ls.authorizationData')
      )?.user?.organizationId;

      this.selectGovernmentId = JSON.parse(
        localStorage.getItem('ls.authorizationData')
      ).user?.govenmentId;

      this.healthAdministrationId = JSON.parse(
        localStorage.getItem('ls.authorizationData')
      ).user?.healthAdministrationId;

      this.SelectedbranchId = JSON.parse(
        localStorage.getItem('ls.authorizationData')
      ).user?.branchId;

      this.defaultBranchId = JSON.parse(
        localStorage.getItem('ls.authorizationData')
      ).user?.branchId;

      if (
        this.activeUSerService.getAccessibleParts?.showBranches ||
        this.activeUSerService.getAccessibleParts?.showUniversities
      ) {
        this.getBranches();
      }

      this.defaultAreaId = this.SelectedareaId = JSON.parse(
        localStorage.getItem('ls.authorizationData')
      ).user?.areaId;

      this.incidentSourcesId = JSON.parse(
        localStorage.getItem('ls.authorizationData')
      ).user?.incidentSourceId;
    }, 500);

    let incidentInfoLink = document.getElementById(
      'incidentInfo'
    ) as HTMLElement;
    incidentInfoLink.classList.remove('active');

    this.repeatedRecordsForm = this.fb.group({
      fromDate: [
        {
          value: null,
          disabled: false,
        },
      ],
      toDate: [
        {
          value: null,
          disabled: false,
        },
      ],
      governmentId: [
        {
          value: '',
          disabled: this.activeUSerService.getAccessibleParts?.enableGovernments
            ? false
            : true,
        },
      ],
      diseaseId: [
        {
          value: '',
          disabled: false,
        },
      ],
      healthAdminId: [
        {
          value: '',
          disabled: this.activeUSerService.getAccessibleParts?.enableDepartments
            ? false
            : true,
        },
      ],
      sourceId: [
        {
          value: '',
          disabled: this.activeUSerService.getAccessibleParts?.enableGovernments
            ? false
            : true,
        },
      ],
      branchId: [
        {
          value: '',
          disabled:
            this.activeUSerService.getAccessibleParts?.enableBranches &&
              !this.activeUSerService.getAccessibleParts?.showBranches
              ? false
              : true,
        },
      ],
      areaId: [
        {
          value: '',
          disabled: this.activeUSerService.getAccessibleParts?.enableAreas
            ? false
            : true,
        },
      ],
      firstnameGroup: [
        {
          value: true,
          disabled: false,
        },
      ],
      secoundGroup: [
        {
          value: true,
          disabled: false,
        },
      ],
      thirdNameGroup: [
        {
          value: false,
          disabled: false,
        },
      ],
      familyNameGroup: [
        {
          value: false,
          disabled: false,
        },
      ],
      addressGroup: [
        {
          value: false,
          disabled: false,
        },
      ],
      nationalId: [
        {
          value: false,
          disabled: false,
        },
      ],
      age: [
        {
          value: false,
          disabled: false,
        },
      ],
      ageType: [
        {
          value: false,
          disabled: false,
        },
      ],
      reportSource: [
        {
          value: null,
          disabled: this.activeUSerService.getAccessibleParts?.enableSources
            ? false
            : true,
        },
      ],
      diseaseIds: [
        {
          value: null,
          disabled: false,
        },
      ],
    });
    // this.repeatedRecordsForm = new FormGroup({
    //   fromDate: new FormControl(),
    //   toDate: new FormControl(),
    //   diseaseId: new FormControl(),
    //   // areaType: new FormControl(),
    //   governmentId: new FormControl(),
    //   healthAdminId: new FormControl(),
    //   sourceId: new FormControl(),
    //   branchId: new FormControl(),
    //   areaId: new FormControl(),
    //   firstnameGroup: new FormControl(true),
    //   secoundGroup: new FormControl(true),
    //   thirdNameGroup: new FormControl(),
    //   familyNameGroup: new FormControl(),
    //   addressGroup: new FormControl(),
    //   nationalId: new FormControl(),
    //   age: new FormControl(),
    //   ageType: new FormControl(),
    //   reportSource: new FormControl(),
    //   diseaseIds: new FormControl(),
    // });
    this.filteration = {
      fromDate: null,
      toDate: null,
      diseaseId: null,
      // areaType: null,
      governmentId: null,
      healthAdminId: null,
      sourceId: null,
      branchId: null,
      areaId: null,
      firstnameGroup: null,
      secoundGroup: null,
      thirdNameGroup: null,
      familyNameGroup: null,
      addressGroup: null,
      nationalId: null,
      age: null,
      ageType: null,
      reportSource: null,
      diseaseIds: null,
    };
    // this.disableControls();

    this.getlookups();

    this.router.routerState.root.queryParams.subscribe((params) => {
      if (params.def == null || params.def == undefined) {
        this.generalDataCompletionFilter = {
          isNullName: false,
          isNullBarentName: false,
          isNullGrandPa: false,
          isNullFamaly: false,
          isNullNationalId: false,
          isNullAge: false,
          isNullAgeType: false,
          isNullAddressGroup: false,
          diseaseIds: null,
        };
      } else {
        this.generalDataCompletionFilter = {
          isNullName: true,
          isNullBarentName: true,
          isNullGrandPa: true,
          isNullFamaly: true,
          isNullNationalId: true,
          isNullAge: true,
          isNullAgeType: true,
          isNullAddressGroup: true,
          diseaseIds: null,
        };
        this.GetPatientRepetedData();
      }
    });

    this.translateService
      .get('NEDSS.REPEATED_RECORDS.FIND_AND_DELETE')
      .subscribe((res) => {
        this.screenName = res;
      });
  }
  getlookups() {
    this.getGovernments();
    this.getAllDiseases();
    // this.getRepeatedData();
  }

  disableControls() {
    // if (!this.activeUSerService.getAccessibleParts?.enableGovernments)
    //   this.repeatedRecordsForm.get('governmentId')?.disable();
    // if (!this.activeUSerService.getAccessibleParts?.enableDepartments)
    //   this.repeatedRecordsForm.controls?.healthAdminId?.disable();
    // if (
    //   !this.activeUSerService.getAccessibleParts?.enableUniversities &&
    //   this.activeUSerService.getAccessibleParts?.showUniversities
    // )
    //   this.repeatedRecordsForm.controls?.branchId?.disable();
    // if (
    //   !this.activeUSerService.getAccessibleParts?.enableBranches &&
    //   this.activeUSerService.getAccessibleParts?.showBranches
    // )
    //   this.repeatedRecordsForm.controls?.branchId?.disable();
    // if (!this.activeUSerService.getAccessibleParts?.enableAreas)
    //   this.repeatedRecordsForm.controls?.areaId?.disable();
    // if (!this.activeUSerService.getAccessibleParts?.enableSources)
    //   this.repeatedRecordsForm.controls?.reportSource?.disable();
  }

  onCheckChange(event) {
    const formArray: FormArray = this.repeatedRecordsForm.get(
      'searchKey'
    ) as FormArray;

    /* Selected */
    if (event.target.checked) {
      // Add a new control in the arrayForm
      formArray.push(new FormControl(event.target.value));
    } else {
      /* unselected */
      // find the unselected element
      let i: number = 0;

      formArray.controls.forEach((ctrl: FormControl) => {
        if (ctrl.value == event.target.value) {
          // Remove the unselected element from the arrayForm
          formArray.removeAt(i);
          return;
        }

        i++;
      });
    }
    let length: any[] = this.repeatedRecordsForm.value.searchKey;
    if (length.length >= 2) {
      this.pleaseComplete = false;
    }
  }

  getGovernments() {
    this.lookupsService.getAllGovernments().subscribe(
      (result: any) => {
        if (result != null && result != undefined) {
          this.governments = [
            { id: -1, arabicName: 'إختر', englishName: 'Select' },
          ];
          result.data.forEach((nat) => {
            this.governments.push(nat);
          });
          if (result.data.length > 0) {
            this.selectGovernmentId = JSON.parse(
              localStorage.getItem('ls.authorizationData')
            ).user.govenmentId;
            if (this.selectGovernmentId != null) {
              this.governmentSelected();
            } else {
              this.selectGovernmentId = -1;
            }
          }

          // if (this.levelId != 1) {
          //   this.selectGovernmentId = JSON.parse(
          //     localStorage.getItem('ls.authorizationData')
          //   ).user.govenmentId;
          //   this.governmentSelected();
          // }
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
    // this.healthAdministrationId = -1;
    // this.repeatedRecordsForm.controls['governmentId'].setValue(
    //   this.selectGovernmentId
    // );
    // this.getHealthAdministration(this.repeatedRecordsForm.value.governmentId);
    this.healthAdministrationId = -1;
    this.incidentSources = [];
    this.repeatedRecordsForm.value.governmentId = this.selectGovernmentId;
    this.filteration.governmentId =
      this.selectGovernmentId == -1 ? null : this.selectGovernmentId;
    if (
      this.repeatedRecordsForm.value.governmentId != null &&
      this.repeatedRecordsForm.value.governmentId != -1
    )
      this.getHealthAdministration(this.repeatedRecordsForm.value.governmentId);
  }

  governmentdSelected() {
    this.repeatedRecordsForm.controls['governmentId'].setValue(null);
    this.repeatedRecordsForm.controls['healthAdminId'].setValue(null);
    this.healthAdministrationId = -1;
    this.healthAdministration = null;
    this.healthAdministrationdSelected();
  }

  getHealthAdministration(governmentID: any) {
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
              this.healthAdministrationId = JSON.parse(
                localStorage.getItem('ls.authorizationData')
              )?.user?.healthAdministrationId;
              if (this.healthAdministrationId != null) {
                this.healthAdministrationSelected();
              } else {
                this.healthAdministrationId = -1;
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

  healthAdministrationSelected() {
    this.incidentSourcesId = -1;
    this.repeatedRecordsForm.controls['healthAdminId'].setValue(
      this.healthAdministrationId
    );
    this.getIncidentSources(this.repeatedRecordsForm.value.healthAdminId);
  }

  healthAdministrationdSelected() {
    this.repeatedRecordsForm.controls['healthAdminId'].setValue(null);
    this.incidentSources = null;
    this.incidentSourcesId = -1;
  }

  setreportSourceValue() {
    this.repeatedRecordsForm.controls['reportSource'].setValue(
      this.incidentSourcesId
    );
  }

  setreportSourcedValue() {
    this.repeatedRecordsForm.controls['reportSource'].setValue(null);
  }

  getIncidentSources(healthAdministrationID: any) {
    //, reportingOrResidence: 1
    this.lookupsService
      .getPageIncidentSourceHospitals({
        healthAdministrationID: healthAdministrationID,
        branchId: this.activeUSerService.getAccessibleParts?.showAreas
          ? null
          : this.SelectedbranchId,
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

            setTimeout(() => {
              if (result.data.length > 0) {
                this.incidentSourcesId = JSON.parse(
                  localStorage.getItem('ls.authorizationData')
                )?.user?.incidentSourceId;
                if (this.incidentSourcesId != null) {
                  this.setreportSourceValue();
                } else {
                  this.incidentSourcesId = -1;
                }
              }
            }, 200);

            // if (this.levelId != 1 && this.levelId != 2 && this.levelId != 3) {
            //   this.incidentSourcesId = JSON.parse(
            //     localStorage.getItem('ls.authorizationData')
            //   ).user.incidentSourceId;
            //   this.setreportSourceValue();
            // }
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
          if (this.defaultBranchId > 0) {
            this.SelectedbranchId = this.branches.find(
              (item) => item.id === this.defaultBranchId
            )?.id;
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
    if (this.SelectedbranchId) {
      this.defaultBranchId = this.SelectedbranchId;
      // this.healthAdministrations = [];
      // this.getHealthAdministrationsForUsers(this.user.branchId);
      this.getAreas();
      this.getIncidentSources(this.SelectedbranchId);
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
          if (this.defaultAreaId) {
            this.SelectedareaId = this.areas.find(
              (item) => item.id === this.defaultAreaId
            )?.id;
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
    this.getIncidentSources(this.SelectedareaId);
    // this.governmentDeSelected();
    // if (this.SelectedareaId) {
    //   this.user.areaId = this.SelectedareaId;
    // this.isAreaValid = this.checkAreaValid();
    // this.getIncidentSources(
    //   this.user.healthAdministrationId,
    //   this.user.organizationId
    // );
    // }
  }

  getAllDiseases() {
    this.lookupsService.getAllDiseaseGroups().subscribe(
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

  // requerd

  get myForm() {
    return this.repeatedRecordsForm.get('areaType');
  }

  GetPatientRepetedData() {
    let length: any[] = this.repeatedRecordsForm.value.searchKey;

    var selectedDeseaiesIds = [];
    this.selectedDeseaiesIds.forEach((element) => {
      selectedDeseaiesIds.push(element.id);
    });
    this.generalDataCompletionFilter.diseaseIds = selectedDeseaiesIds;

    this.loadingPanel = true;

    this.generalDataCompletionServiceService
      .getPageGeneralDataCompletions2(this.generalDataCompletionFilter)
      .subscribe(
        (result: any) => {
          if (result != null && result != undefined) {
            if (
              !this.repeatedRecordsForm.value.addressGroup &&
              !this.repeatedRecordsForm.value.age &&
              !this.repeatedRecordsForm.value.ageType &&
              !this.repeatedRecordsForm.value.familyNameGroup &&
              !this.repeatedRecordsForm.value.firstnameGroup &&
              !this.repeatedRecordsForm.value.nationalId &&
              !this.repeatedRecordsForm.value.secoundGroup &&
              !this.repeatedRecordsForm.value.thirdNameGroup
            ) {
              this.pleaseComplete = true;
            } else {
              this.getRepeatedData();
              this.pleaseComplete = false;
            }
          }
          this.filteration.fromDate = this.repeatedRecordsForm.value.fromDate;
          this.filteration.toDate = this.repeatedRecordsForm.value.toDate;
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

    // const diverr = document.getElementById("smallMess");
    // this.isSubmitted  = true;
    // if (this.repeatedRecordsForm.valid) {
    //   return false;
    // } else {
    //   // return alert(JSON.stringify(this.repeatedRecordsForm.value));
    //   return diverr.style.display="block !important";
    //   // return true;
    //   // diverr.style.display="block";
    // }
  }

  complete() {
    if (this.pleaseComplete) {
      this.pleaseComplete = false;
    }
  }

  selectedDeseaiesIds: any[] = [];

  desieasesSelected(event) {
    if (Array.isArray(event)) {
      event.forEach((element) => {
        if (!this.selectedDeseaiesIds.find((e) => e.id === element.id)) {
          this.selectedDeseaiesIds.push(element);
        }
      });
    } else {
      if (!this.selectedDeseaiesIds.find((e) => e.id === event.id)) {
        this.selectedDeseaiesIds.push(event);
      }
    }
  }
  desieasesdSelected(event) {
    this.selectedDeseaiesIds = this.selectedDeseaiesIds.filter(
      (m) => m.id != event.id
    );
  }

  public repeatedDataCount = 0;

  getRepeatedData() {
    var selectedDeseaiesIds = [];
    this.selectedDeseaiesIds.forEach((element) => {
      selectedDeseaiesIds.push(element.id);
    });
    // this.repeatedRecordsForm.controls.governmentId.value ==
    //   this.selectGovernmentId;
    let obj = {
      fromDate: this.fromDate,
      toDate: this.toDate,
      governmentId: this.selectGovernmentId,
      healthAdminId: this.healthAdministrationId,
      branchId: this.SelectedbranchId,
      universityId: this.activeUSerService.getAccessibleParts?.showUniversities ? this.SelectedbranchId : null,
      areaId: this.SelectedareaId,
      reportSource: this.incidentSourcesId,
      diseaseIds: this.selectedDeseaiesIds,
      firstnameGroup: this.repeatedRecordsForm.controls?.["firstnameGroup"]?.value,
      secoundGroup: this.repeatedRecordsForm.controls?.["secoundGroup"]?.value,
      thirdNameGroup: this.repeatedRecordsForm.controls?.["thirdNameGroup"]?.value,
      familyNameGroup: this.repeatedRecordsForm.controls?.["familyNameGroup"]?.value,
      addressGroup: this.repeatedRecordsForm.controls?.["addressGroup"]?.value,
      nationalId: this.repeatedRecordsForm.controls?.["nationalId"]?.value,
      age: this.repeatedRecordsForm.controls?.["age"]?.value,
      ageType: this.repeatedRecordsForm.controls?.["ageType"]?.value,
    }
    this.delay = true;
    this.timer = setTimeout(() => {
      if (this.delay) {
        this.translateService
          .get('NOUR.WaitPlease')
          .subscribe((msg) => this.userMsg.info(msg));
      }
    }, 2000);
    this.repearedService.getRepeated(obj).subscribe(
      (result: any) => {
        if (result != null && result != undefined && result.data.length > 0) {
          this.repeatedDataCount = 0;
          this.repeatedData = result.data;
          // ?.filter((p: any) =>
          //   this.lookupsService.incidentsForOrg.includes(p.incidentSourceId)
          // );
          this.repeatedData.forEach((r) => {
            this.repeatedDataCount += r.totalRepeatedRecourds;
          });
          setTimeout(() => {
            this.delay = false;
            clearTimeout(this.timer);
          }, 0);
          this.noData = this.repeatedData.length == 0;
        } else {
          setTimeout(() => {
            this.delay = false;
            clearTimeout(this.timer);
          }, 0);
          this.noData = true;
          this.translateService
            .get('NOUR.NO_RESULTS')
            .subscribe((msg) => this.userMsg.warn(msg));
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

  RutingToDuplication(id) {
    this.repeatedRecordsForm.value.id = id;
    this.repearedService.objTORoute = this.repeatedRecordsForm.value;
    this.router.navigate(['/home/duplication-view', id]);
  }

  exportPatiantsAsExcel() {
    this.exportService.exportTableAsExcel(this.tableElement, this.screenName);
  }

  // exportPatientsAsPdf() {
  //   this.exportService.exportTableAsPdf(this.tableElement, this.screenName);
  // }
  exportPatientsAsPdf() {
    let selectedGov = this.governments.filter(
      (g) => g.id == this.selectGovernmentId
    );

    let tempSelectedAdm = [this.healthAdministrationId];
    let selectedAdm = this.healthAdministration?.filter((g) =>
      tempSelectedAdm.includes(g.id)
    );
    selectedAdm = selectedAdm?.map((g) => g.arabicName);

    let tempSelectedIncs = this.incidentSources?.map((g) => g.id);
    let selectedIncs = this.incidentSources?.filter((g) =>
      tempSelectedIncs.includes(g.id)
    );
    let s = selectedIncs.filter((g) => g.id == this.incidentSourcesId);
    selectedIncs = s.map((g) => g.arabicName);

    let tempSelectedDeps = this.selectedDepartment?.map((g) => g.id);
    let selectedDep = this.departments?.filter((g) =>
      tempSelectedDeps.includes(g.id)
    );
    selectedDep = selectedDep?.map((g) => g.arabicName);

    let sDate, eDate;
    // console.log(this.filteration.value.fromDate);

    // console.log((this.filteration.fromDate && new Date(this.filteration.fromDate).toLocaleDateString('en-GB')))
    try {
      // sDate =
      // sDate = (this.repeatedRecordsForm. && new Date(this.repeatedRecordsForm.fromDate).toLocaleDateString('en-GB'));
      sDate =
        this.filteration.fromDate &&
        new Date(this.filteration.fromDate).toLocaleDateString('en-GB');

      eDate =
        this.filteration.toDate &&
        new Date(this.filteration.toDate).toLocaleDateString('en-GB');
    } catch (error) {
      sDate = '';
      eDate = '';
    }
    this.exportService.exportTemplateAsPdf(
      document.getElementById(this.currentConfig),
      'الحالات والسجلات المكرره',
      [selectedGov, selectedAdm, selectedIncs, selectedDep],
      [sDate, eDate]
    );
  }

  Tablesearch(e) {
    if (e.target.value.toLowerCase().length == 0) {
      this.getRepeatedData();
    }
    this.repeatedData = this.repeatedData.filter((m) =>
      m.firstName.toLowerCase().includes(e.target.value.toLowerCase())
    );
  }

  // passRepeated(item) {
  //   console.log('selected Ids',item.repeatedPatientIds);
  //   //this.repearedService.passedObj = this.repeatedRecordsForm.value;
  // }

  hidColCount: boolean = false;
  hidColNAME: boolean = false;
  hidColFATHERNAME: boolean = false;
  hidColNATIONALID: boolean = false;
  hidColGOVERNMENT: boolean = false;
  hidColHEALTHADMINISTRATION: boolean = false;
  hidColDISEASECATEGORY: boolean = false;
  hidColDISEASE: boolean = false;
  hidColAGE: boolean = false;
  hidColAGECATEGORY: boolean = false;

  toHidColCount() {
    this.hidColCount = !this.hidColCount;
  }
  toHhidColNAME() {
    this.hidColNAME = !this.hidColNAME;
  }
  toHidColFATHERNAME() {
    this.hidColFATHERNAME = !this.hidColFATHERNAME;
  }
  toHidColNATIONALID() {
    this.hidColNATIONALID = !this.hidColNATIONALID;
  }
  toHidColGOVERNMENT() {
    this.hidColGOVERNMENT = !this.hidColGOVERNMENT;
  }
  toHidColHEALTHADMINISTRATION() {
    this.hidColHEALTHADMINISTRATION = !this.hidColHEALTHADMINISTRATION;
  }
  toHidColDISEASECATEGORY() {
    this.hidColDISEASECATEGORY = !this.hidColDISEASECATEGORY;
  }
  toHidColDISEASE() {
    this.hidColDISEASE = !this.hidColDISEASE;
  }
  toHidColAGE() {
    this.hidColAGE = !this.hidColAGE;
  }
  toHidColAGECATEGORY() {
    this.hidColAGECATEGORY = !this.hidColAGECATEGORY;
  }
}
