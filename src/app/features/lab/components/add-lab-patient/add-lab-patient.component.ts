import { Component, ViewChild } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { UserMessageService } from 'src/app/core/services/user.message.service';
import { PatientModel } from '../../models/labPatient-model';
import { LookupsGetterService } from 'src/app/core/services/lookups-getter.service';
import { DatePipe } from '@angular/common';
import { LabService } from '../../services/lab.service';
import { NationalityEnum } from '../../models/nationality-enum';

import {
  SingleDropdownSettings,
  MultipleDropdownSettings,
  SortOrder,
} from 'src/app/core/constants';
import { GeneralDataService } from '../../../home/general-data/services/general-data.service';
import { NotificationService } from '../../../../core/services/notificationService.service';
import { LazyLoadEvent, SortEvent } from 'primeng/api';
import { Table } from 'primeng/table';
import { RepeatedService } from 'src/app/features/home/repeated-records/Repeated.service';
import { Patient } from 'src/app/features/home/search/models/patient';

@Component({
  selector: 'app-add-lab-patient',
  templateUrl: './add-lab-patient.component.html',
  styleUrls: ['./add-lab-patient.component.css'],
})
export class AddLabPatientComponent {
  maxDate = new Date();
  minDate = new Date(1900, 0, 1);
  noData: boolean = true;
  currentLang =
    localStorage.getItem('ls.currentLang') !== undefined &&
      localStorage.getItem('ls.currentLang') !== 'undefined'
      ? localStorage.getItem('ls.currentLang')
      : 'ar';

  patient: PatientModel = new PatientModel();
  patientGridCheck = {
    id: null,
    sNo: null,
    checkDate: null,
    checkSample: null,
    checkLabTest: null,
    checkLabTestResult: null,
    resultDate: null,
    diseaseGroupId: null,
    diseaseCheckId: null,
    dieaseLabTestId: null,
  };
  patientAddCheck = {
    id: null,
    sNo: null,
    diseaseGroupId: null,
    diseaseCheckId: null,
    dieaseLabTestId: null,
    diseaseLabTestResultId: null,
    getSampleDate: null,
    labResultDate: null,
  };
  patientAddChecks: {
    id: number,
    sNo: number;
    diseaseGroupId: number;
    diseaseCheckId: number;
    dieaseLabTestId: number;
    diseaseLabTestResultId: number;
    getSampleDate: string;
    labResultDate: string;
  }[] = [];

  patientGridChecks:
    {
      id: number;
      sNo: number;
      checkDate: string;
      checkSample: string;
      checkLabTest: string;
      checkLabTestResult: string;
      resultDate: string;
      diseaseGroupId: number;
      diseaseCheckId: number;
      dieaseLabTestId: number;
    }[] = [];

  patientsFromLab: {
    id: number,
    fullName: string,
    createdDate: string,
    caseDiscoveryDate: string,
    homeGovernmentId: number,
    homeGovernmentName: string,
    incidentGovernmentId: number,
    incidentGovernmentName: string,
    homeHealthAdministrationId: number,
    homeHealthAdministrationName: string,
    governmentId: number,
    governmentName: string,
    healthAdministrationId: number,
    healthAdministrationName: string,
    incidentHealthAdministrationId: number,
    incidentHealthAdministrationName: string,
    incidentBranchId: number,
    incidentBranchName: string,
    incidentAreaId: number,
    incidentAreaName: string,
    nationalityId: number,
    homeHealthOfficeId: number,
    homeHealthOfficeName: string,
    incidentDepartmentId: number,
    incidentDepartmentName: string,
    homeCityId: number,
    homeCityName: string,
    incidentSourceId: number,
    incidentSourceName: string,
    nationality: string,
    nationalId: string,
    passportNo: string,
    phoneNo1: string,
    phoneNo2: string,
    labChecksExistance: boolean,
    totalCount: number,
    diseaseGroupId: number,
    diseaseGroupEnglishName: string,
    diseaseGroupArabicName: string
  }[] = []

  levelId: any;
  userId: any;

  nationalities!: any[];
  selectedNationality: number = NationalityEnum.Egyptian;

  governments!: any[];

  selectedGovernment: number = -1;

  healthAdministrations!: any[];
  selectedHealthAdministration: number;

  cities!: any[];
  selectedCity: number;
  selectedpatientDiseases;
  healthOffices!: any[];
  selectedHealthOffice: number;

  labChecks!: any[];
  selectedLabCheck: any;

  checkSamples!: any[];
  selectedCheckSample: any;

  labCheckResults!: any[];
  selectedLabCheckResult: any;

  loadingPanel: boolean = false;
  isForeign: boolean = false;

  singleDropdownSettings = {};
  multipleDropdownSettings = {};
  underDeleting2 = {
    checkSample: '',
    sNo: null,
  };
  labChecksCount: number;
  Diseasies: any;
  NationalityEnum = NationalityEnum;

  ///Patient from Lab table
  filter = {
    incidentGovernmentId: null,
    incidentHealthAdministrationId: null,
    incidentSourceId: null,
    IncidentBranchId: null,
    incidentDepartmentId: null,
    incidentAreaId: null,
    startDate: null,
    fullName: null,
    endDate: null,
    passportNo: null,
    relativeTypeId: null,
    pageIndex: 1,
    pageSize: 10,
    filterType: 1,
    diseaseGroupId: null,
    diseaseId: null,
    areaId: null,
    sortOrder: SortOrder.asc,
    sortColumn: 'fullName',
    searchText: null,
  };

  @ViewChild('pTable', { static: false }) pTable: Table; // Reference to the table component
  dir: string;
  delay: boolean = false;
  timer: any;
  noPatientData: boolean = true;
  first: number = 0;
  last: number = 0;
  pages: number = 0;
  pageIndex: number = 1;
  pageSize: number = 10;
  visible: boolean = false;
  constructor(
    private translateService: TranslateService,
    private userMsg: UserMessageService,
    private lookupsService: LookupsGetterService,
    private datePipe: DatePipe,
    private labService: LabService,
    private notificationService: NotificationService,
    public generalDataService: GeneralDataService,
    private repeatedService: RepeatedService,
  ) {
  }

  ngOnInit() {
    this.levelId = JSON.parse(
      localStorage.getItem('ls.authorizationData')
    )?.user?.levelId;

    this.userId = JSON.parse(
      localStorage.getItem('ls.authorizationData')
    )?.user?.id;
    let incidentInfoLink = document.getElementById(
      'incidentInfo'
    ) as HTMLElement;
    incidentInfoLink.classList.remove('active');
    this.loadingPanel = true;
    this.labChecksCount = 0;
    this.getLookups();
    this.singleDropdownSettings = SingleDropdownSettings;
    this.multipleDropdownSettings = MultipleDropdownSettings;
    this.loadingPanel = false;
    this.generalDataService.cardIdValidationMessage = '';
    this.patient.nationalityId = this.selectedNationality;
    this.dir = this.currentLang == 'ar' ? 'rtl' : 'ltr';
    this.search(false);
  }


  getLookups() {
    this.getNationalities();
    this.getGovernments();
    this.getAllDiseases();
  }

  onItemSelect(item: any) { }
  onSelectAll(items: any) { }

  onNationalityChanged() {
    if (this.selectedNationality > 0) {
      this.patient.nationalityId = this.selectedNationality;
      if (this.selectedNationality != NationalityEnum.Egyptian) {
        this.isForeign = true;
        this.patient.nationalId = null;
      } else {
        this.isForeign = false;
        this.patient.passportNo = null;
      }

    } else {
      this.patient.nationalityId = null;
      this.patient.passportNo = null;
      this.isForeign = false;
    }
    this.isNationalityValid = this.generalDataService.validateField(
      this.patient.nationalityId
    );
  }

  onGovernmentChanged() {
    if (this.selectedGovernment > 0) {
      this.patient.homeGovernmentId = this.selectedGovernment;
      this.getCities(this.patient.homeGovernmentId);

      this.getHealthAdministration(this.patient.homeGovernmentId);

    } else {
      this.patient.homeGovernmentId = null;
      this.healthAdministrations = [];
      this.selectedHealthAdministration = -1;
    }
    this.isHomeGovernmentValid = this.generalDataService.validateField(
      this.patient.homeGovernmentId
    );
  }
  getAllDiseases() {
    this.lookupsService.getAllDiseaseGroups().subscribe(
      (result: any) => {
        if (result != null && result != undefined) {
          this.Diseasies = result.data;
          this.Diseasies.unshift({
            id: null,
            arabicName: 'إختر',
            englishName: 'Select',
          });
          if (this.patientAddCheck.diseaseGroupId > 0) {
            this.getLabSamples(this.patientAddCheck.diseaseGroupId);
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
  filterdDiseaseChange() {
    this.selectedCheckSample = [];
    this.selectedLabCheck = null;
    this.selectedLabCheckResult = null;
    this.labChecks = [];
    this.labCheckResults = [];
    this.patientAddCheck.diseaseCheckId = null;
    this.patientAddCheck.dieaseLabTestId = null;
    this.patientAddCheck.diseaseLabTestResultId = null;
    this.isDiseaseGroupValid = this.generalDataService.validateField(
      this.patientAddCheck.diseaseGroupId
    );
    this.getLabSamples(this.patientAddCheck.diseaseGroupId);
  }
  onHealthAdministrationChanged() {
    if (this.selectedHealthAdministration > 0) {
      this.patient.homeHealthAdministrationId =
        this.selectedHealthAdministration;
      this.getHealthOffices(this.patient.homeHealthAdministrationId);
    } else {
      this.patient.homeHealthAdministrationId = null;
      this.cities = [];
      this.selectedCity = -1;
    }
    this.isHomeHealthAdminValid = this.generalDataService.validateField(
      this.patient.homeHealthAdministrationId
    );
  }

  onCityChanged() {
    //  alert(this.selectedCity);
    if (this.selectedCity > 0) {
      this.patient.homeCityId = this.selectedCity;
    } else {
      this.patient.homeCityId = null;
      this.healthOffices = [];
      this.selectedHealthOffice = null;
    }
    this.isHomeCityValid = this.generalDataService.validateField(
      this.patient.homeCityId
    );
  }

  onHealthOfficeChanged() {
    if (this.selectedHealthOffice > 0) {
      this.patient.homeHealthOfficeId = this.selectedHealthOffice;
    } else {
      this.patient.homeHealthOfficeId = null;
    }
    this.isHomeHealthOfficeValid = this.generalDataService.validateField(
      this.patient.homeHealthOfficeId
    );
  }

  onSampleChanged() {
    if (this.selectedCheckSample.length > 0) {
      this.patientAddCheck.diseaseCheckId = this.selectedCheckSample[0].id;
      if (this.currentLang == 'ar') {
        this.patientGridCheck.checkSample =
          this.selectedCheckSample[0].arabicName;
      } else {
        this.patientGridCheck.checkSample =
          this.selectedCheckSample[0].englishName;
      }


      // if (this.currentLang == 'ar') {
      //   this.patientGridCheck.diseaseCheckId = this.checkSamples.find(
      //     (item) => item.id === this.patientAddCheck.diseaseCheckId
      //   )?.arabicName;
      // } else {
      //   this.patientGridCheck.diseaseCheckId = this.checkSamples.find(
      //     (item) => item.id === this.patientAddCheck.diseaseCheckId
      //   )?.englishName;
      // }


      this.labChecks = [];
      this.labCheckResults = [];
      this.selectedLabCheck = null;
      this.selectedLabCheckResult = null;
      this.getLabChecks();
    } else {
      this.patientAddCheck.diseaseCheckId = null;
      this.patientGridCheck.checkSample = null;
    }
    this.isDiseaseCheckValid = this.generalDataService.validateField(
      this.patientAddCheck.diseaseCheckId
    );
  }

  onLabCheckChanged() {
    if (this.selectedLabCheck > 0) {
      // this.patientAddCheck.dieaseLabTestId = this.selectedLabCheck[0].id;
      this.patientAddCheck.dieaseLabTestId = this.selectedLabCheck;
      if (this.currentLang == 'ar') {
        this.patientGridCheck.checkLabTest = this.labChecks.find(
          (item) => item.id === this.patientAddCheck.dieaseLabTestId
        )?.arabicName;
      } else {
        this.patientGridCheck.checkLabTest = this.labChecks.find(
          (item) => item.id === this.patientAddCheck.dieaseLabTestId
        )?.englishName;
      }
      this.getLabCheckResults();
    } else {
      this.patientAddCheck.dieaseLabTestId = null;
      this.patientGridCheck.checkLabTest = null;
      this.labCheckResults = [];
      this.selectedLabCheckResult = null;
    }
    this.isDiseaseLabTestValid = this.generalDataService.validateField(
      this.patientAddCheck.dieaseLabTestId
    );
  }

  onLabCheckResultChanged() {
    if (this.selectedLabCheckResult > 0) {
      this.patientAddCheck.diseaseLabTestResultId = this.selectedLabCheckResult;
      // if (this.currentLang == 'ar') {
      //   this.patientGridCheck.checkLabTestResult =
      //     this.selectedLabCheckResult.arabicName;
      // } else {
      //   this.patientGridCheck.checkLabTestResult =
      //     this.selectedLabCheckResult.englishName;
      // }
      if (this.currentLang == 'ar') {
        this.patientGridCheck.checkLabTestResult = this.labCheckResults.find(
          (item) => item.id === this.patientAddCheck.diseaseLabTestResultId
        )?.arabicName;
      } else {
        this.patientGridCheck.checkLabTestResult = this.labCheckResults.find(
          (item) => item.id === this.patientAddCheck.diseaseLabTestResultId
        )?.englishName;
      }
    } else {
      this.patientAddCheck.diseaseLabTestResultId = null;
      this.patientGridCheck.checkLabTestResult = null;
    }
    // this.isDiseaseLabTestResultValid = this.generalDataService.validateField(this.patientAddCheck.diseaseLabTestResultId);
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
          this.governments = result.data;
          this.governments = [
            { id: -1, arabicName: 'إختر', englishName: 'Select' },
          ];
          result.data.forEach((nat) => {
            this.governments.push(nat);
          });

          if (this.levelId != 1) {
            this.selectedGovernment = JSON.parse(
              localStorage.getItem('ls.authorizationData')
            ).user.govenmentId;
            this.onGovernmentChanged();
          }

          this.selectedHealthAdministration = -1;
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
    this.lookupsService
      .getPageHealthAdministrations({ governmentID: governmentID })
      .subscribe(
        (result: any) => {
          if (result != null && result != undefined) {
            this.healthAdministrations = [
              { id: -1, arabicName: 'إختر', englishName: 'Select' },
            ];
            result.data.forEach((nat) => {
              this.healthAdministrations.push(nat);
            });
          }

          if (this.levelId != 1 && this.levelId != 2) {
            this.selectedHealthAdministration = JSON.parse(
              localStorage.getItem('ls.authorizationData')
            ).user.healthAdministrationId;
            this.onHealthAdministrationChanged();
          }

          this.selectedCity = -1;
          this.selectedHealthOffice = -1;
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

  getCities(governmentID: any) {
    this.lookupsService.getPageCitys({ governmentID: governmentID }).subscribe(
      (result: any) => {
        if (result != null && result != undefined) {
          this.cities = [{ id: -1, arabicName: 'إختر', englishName: 'Select' }];
          result.data.forEach((nat) => {
            this.cities.push(nat);
          });
        }
        if (this.levelId != 1 && this.levelId != 2 && this.levelId != 3) {
          this.selectedCity = JSON.parse(
            localStorage.getItem('ls.authorizationData')
          ).user.cityId;
          this.onHealthOfficeChanged();
        }

        this.selectedHealthOffice = -1;
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

  getHealthOffices(healthAdministrationid: any) {
    //, reportingOrResidence: 2
    this.lookupsService
      .getPageIncidentSourceHospitals({
        healthAdministrationID: healthAdministrationid,
      })
      .subscribe(
        (result: any) => {
          if (result != null && result != undefined) {
            this.healthOffices = [
              { id: -1, arabicName: 'إختر', englishName: 'Select' },
            ];
            result.data.forEach((nat) => {
              this.healthOffices.push(nat);
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

  async getLabChecks() {
    this.lookupsService
      .GetDiseaseLabTestByPatientId(
        this.patientAddCheck.diseaseGroupId,
        this.patientAddCheck.diseaseCheckId
      )
      .subscribe(
        (result: any) => {
          if (result != null && result != undefined) {
            this.labChecks = result.data;
            this.labChecks.unshift({
              id: null,
              arabicName: 'إختر',
              englishName: 'Select',
            });
            if (this.patientAddCheck.dieaseLabTestId > 0) {
              this.selectedLabCheck = this.labChecks?.find(
                (item) => item.id === this.patientAddCheck.dieaseLabTestId
              )?.id;
            }
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

  async getLabCheckResults() {
    this.lookupsService
      .GetDiseaseLabTestResultByPatientId(
        this.patientAddCheck.diseaseGroupId,
        this.patientAddCheck.diseaseCheckId,
        this.patientAddCheck.dieaseLabTestId
      )
      .subscribe(
        (result: any) => {
          if (result != null && result != undefined) {
            this.labCheckResults = result.data;
            this.labCheckResults.unshift({
              id: null,
              arabicName: 'إختر',
              englishName: 'Select',
            });
            if (this.patientAddCheck.diseaseLabTestResultId > 0) {
              this.selectedLabCheckResult = this.labCheckResults.find(
                (item) =>
                  item.id === this.patientAddCheck.diseaseLabTestResultId
              )?.id;
            }
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

  async getLabSamples(id: number) {
    this.lookupsService
      .GetByPatientId(id)
      .subscribe(
        (result: any) => {
          if (result != null && result != undefined) {
            this.checkSamples = result.data;
            // this.checkSamples.unshift({
            //   id: null,
            //   arabicName: 'إختر',
            //   englishName: 'Select',
            // });
            if (this.patientAddCheck.diseaseCheckId > 0) {
              this.selectedCheckSample = this.checkSamples.filter(
                (item) => item.id === this.patientAddCheck.diseaseCheckId
              );
            }
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

  addSample() {
    if (this.validateSampleRequiredData()) {
      if (
        this.patientAddCheck.id == null &&
        this.patientGridCheck.id == null
      ) {
        //this.labChecksCount++;
        // this.patientAddCheck.sNo = this.labChecksCount;
        // this.patientGridCheck.sNo = this.labChecksCount;
        this.patientAddCheck.getSampleDate = this.patientGridCheck.checkDate;
        this.patientAddCheck.labResultDate = this.patientGridCheck.resultDate;
        this.patientAddCheck.diseaseGroupId = parseInt(
          this.patientAddCheck.diseaseGroupId
        );
        this.patientAddChecks.push(this.patientAddCheck);
        this.patientGridChecks.push(this.patientGridCheck);
        this.patientGridChecks.reverse();
      }
      else {
        this.patientAddChecks = this.patientAddChecks.filter(
          (obj) => obj !== this.patientAddCheck
        );
        this.patientAddChecks.push(this.patientAddCheck);

        this.patientGridChecks = this.patientGridChecks.filter(
          (obj) => obj !== this.patientGridCheck
        );
        this.patientGridChecks.push(this.patientGridCheck);
      }
      this.resetLabCheck();
      this.noData = true;
    } else {
      if (this.currentLang == 'ar') {
        this.userMsg.error('يجب ادخال كل الحقول');
      } else {
        this.userMsg.error('Please add all required fields');
      }
      this.noData = false;
    }
  }

  async getSample(sampleId: number) {
    // this.patientAddCheck.diseaseGroupId = diseaseGroupId;
    // this.patientAddCheck.diseaseCheckId = diseaseCheckId;
    // this.patientAddCheck.dieaseLabTestId = dieaseLabTestId;
    this.patientGridCheck = this.patientGridChecks.filter(
      (item) => item.id === sampleId
    )[0];

    this.patientAddCheck = this.patientAddChecks.filter(
      (item) => item.id === sampleId
    )[0];

    await this.getLabSamples(this.patientGridCheck.diseaseGroupId);
    await this.getLabChecks();
    await this.getLabCheckResults();




    this.patientAddCheck.getSampleDate = this.datePipe.transform(
      this.patientAddCheck.getSampleDate,
      'yyyy-MM-dd'
    );
    this.patientAddCheck.labResultDate = this.datePipe.transform(
      this.patientAddCheck.labResultDate,
      'yyyy-MM-dd'
    );
    this.patientGridCheck.checkDate = this.datePipe.transform(
      this.patientGridCheck.checkDate,
      'yyyy-MM-dd'
    );
    this.patientGridCheck.resultDate = this.datePipe.transform(
      this.patientGridCheck.resultDate,
      'yyyy-MM-dd'
    );

    this.selectedCheckSample = this.checkSamples?.filter(
      (item) => item.id === this.patientAddCheck.diseaseCheckId
    );
    this.selectedLabCheck = this.labChecks?.find(
      (item) => item.id === this.patientAddCheck.dieaseLabTestId
    )?.id;
    this.selectedLabCheckResult = this.labCheckResults?.find(
      (item) => item.id === this.patientAddCheck.diseaseLabTestResultId
    )?.id;
  }



  delete(sNo: number) {
    this.patientAddChecks = this.patientAddChecks.filter(
      (obj) => obj.sNo !== sNo
    );
    this.patientGridChecks = this.patientGridChecks.filter(
      (obj) => obj.sNo !== sNo
    );
    this.labChecksCount--;
  }

  saveLabPatient() {
    // if (this.validateLabPatientSample()) {
    //   if (this.validateLabPatient()) {
    //     this.patient.patientLabChecks = this.patientAddChecks;
    //     this.patient.nationalId = this.patient.nationalId != null ? this.patient.nationalId.toString() : null;
    //     this.patient.passportNo = this.patient.passportNo != null ? this.patient.passportNo.toString() : null;
    //     this.loadingPanel = true;
    //     this.labService.addLabPatient(this.patient).subscribe((response: any) => {
    //       if (response) {
    //         this.translateService.get('NEDSS.COMMON.SENT_SUCESSFULLY').subscribe((res: string) => {
    //           this.userMsg.success(res);
    //         });
    //       }
    //       this.resetPage();
    //       this.loadingPanel = false;
    //     }, (error) => {
    //       this.translateService.get('NEDSS.COMMON.SENT_FAILD').subscribe((res: string) => {
    //         this.userMsg.error(res);
    //       });
    //       this.loadingPanel = false;
    //     });
    //   } else {
    //     if (this.currentLang == 'ar') {
    //       this.userMsg.error("يجب اضافة كل حقول المريض وتكون صحيحه");
    //     }
    //     else {
    //       this.userMsg.error("Please Add all required fields with valid data");
    //     }
    //   }
    // } else {
    //   if (this.currentLang == 'ar') {
    //     this.userMsg.error("يجب اضافة عينة واحدة علي الاقل");
    //   } else {
    //     this.userMsg.error("Please add at least one Sample");
    //   }
    // }
    if (this.validateLabPatientSample()) {
      if(!this.generalDataService.isPhoneNumber1Valid){
        this.translateService.get('NEDSS.COMMON.INVALID_PHONE_FORMAT').subscribe((res: string) => {
          this.userMsg.error(res);
        });
        return;
      }
      if(!this.generalDataService.isCardIdValid){
        this.translateService.get('NEDSS.LAB_VIEW.ADD_PATIENT.Invalid_NATIONAL').subscribe((res: string) => {
          this.userMsg.error(res);
        });
        return;
      }
      if (this.validateLabPatient()) {
        this.patient.patientLabChecks = this.patientAddChecks;
        this.patient.nationalId =
          this.patient.nationalId != null
            ? this.patient.nationalId.toString()
            : null;
        this.patient.passportNo =
          this.patient.passportNo != null
            ? this.patient.passportNo.toString()
            : null;


        this.patient.insertedByLabId = this.userId;
        this.loadingPanel = true;
        if (this.patient.id) {
          this.repeatedService.editLabPatient(this.patient).subscribe(
            (response: any) => {
              if (response) {
                this.translateService
                  .get('NEDSS.COMMON.SENT_SUCESSFULLY')
                  .subscribe((res: string) => {
                    this.userMsg.success(res);
                  });
              }
              this.resetPage();
              this.loadingPanel = false;

              //send notification here
              response.messages.forEach((msg) => {
                this.notificationService.sendNotification([], JSON.parse(msg));
              });
            },
            (error) => {
              console.error('Error in subscribe:', error); // Log the error to the console
              this.translateService
                .get('NEDSS.COMMON.SENT_FAILD')
                .subscribe((res: string) => {
                  this.userMsg.error(res);
                });
              this.loadingPanel = false;
            },
            () => {
              this.search(false);
            }
          )
        }
        // Add
        else {
          this.labService.addLabPatient(this.patient).subscribe(
            (response: any) => {
              if (response) {
                this.translateService
                  .get('NEDSS.COMMON.SENT_SUCESSFULLY')
                  .subscribe((res: string) => {
                    this.userMsg.success(res);
                  });
              }
              this.resetPage();
              this.loadingPanel = false;

              //send notification here
              response.messages.forEach((msg) => {
                this.notificationService.sendNotification([], JSON.parse(msg));
              });
            },
            (error) => {
              console.error('Error in subscribe:', error); // Log the error to the console
              this.translateService
                .get('NEDSS.COMMON.SENT_FAILD')
                .subscribe((res: string) => {
                  this.userMsg.error(res);
                });
              this.loadingPanel = false;
            }, () => {
              this.search(false);
            }
          );
        }

      } else {
        if (this.currentLang == 'ar') {
          this.userMsg.error('يجب اضافة كل حقول المريض وتكون صحيحه');
        } else {
          this.userMsg.error('Please Add all required fields with valid data');
        }
      }
    } else {
      if (this.currentLang == 'ar') {
        this.userMsg.error('يجب اضافة عينة واحدة علي الاقل');
      } else {
        this.userMsg.error('Please add at least one Sample');
      }
    }
  }

  resetPage() {
    this.resetLabCheck();
    this.patient = new PatientModel();
    this.selectedGovernment = -1;
    this.selectedHealthAdministration = -1;
    this.selectedHealthOffice = -1;
    this.selectedCity = -1;
    this.selectedNationality = NationalityEnum.Egyptian;
    this.patient.nationalityId = this.selectedNationality;
    this.patientAddChecks = [];
    this.patientGridChecks = [];
    this.labChecksCount = 0;
  }

  resetLabCheck() {

    this.patientGridCheck = {
      id: null,
      sNo: null,
      checkDate: null,
      checkSample: null,
      checkLabTest: null,
      checkLabTestResult: null,
      resultDate: null,
      diseaseGroupId: null,
      diseaseCheckId: null,
      dieaseLabTestId: null,

    };

    this.patientAddCheck = {
      id: null,
      sNo: null,
      diseaseGroupId: null,
      diseaseCheckId: null,
      dieaseLabTestId: null,
      diseaseLabTestResultId: null,
      getSampleDate: null,
      labResultDate: null,
    };
    this.selectedCheckSample = null;
    this.selectedLabCheck = null;
    this.selectedLabCheckResult = null;
  }

  validateLabPatientSample(): boolean {
    if (this.patientAddChecks.length > 0) return true;
    else return false;
  }

  // Validate Lab Patient
  isFirstNameValid: boolean = true;
  isSecondNameValid: boolean = true;
  isThirdNameValid: boolean = true;
  // isFamilyNameValid: boolean = true;
  isNationalityValid: boolean = true;
  // isNationalIdValid: boolean = true;
  // isPassportValid: boolean = true;
  isPhone1Valid: boolean = true;
  livingAddressValid: boolean = true;
  isHomeGovernmentValid: boolean = true;
  isHomeHealthAdminValid: boolean = true;
  isHomeCityValid: boolean = true;
  isHomeHealthOfficeValid: boolean = true;
  isValidCardNumber: boolean = true;
  isCaseDiscoveryDateValid: boolean = true;

  validateLabPatient(): boolean {
    this.isFirstNameValid = this.generalDataService.validateField(
      this.patient.firstName
    );
    this.isSecondNameValid = this.generalDataService.validateField(
      this.patient.secondName
    );
    this.isThirdNameValid = this.generalDataService.validateField(
      this.patient.thirdName
    );
    // this.isFamilyNameValid = this.generalDataService.validateField(this.patient.familyName);
    this.isNationalityValid = this.generalDataService.validateField(
      this.patient.nationalityId
    );
    // this.isNationalIdValid = this.patient.nationalityId != 1 || this.generalDataService.validateNationalID(this.patient.nationalId, true);
    // this.isPassportValid = this.patient.nationalityId != 2 || this.generalDataService.validateEmptyField(this.patient.passportNo);
    this.isPhone1Valid = this.generalDataService.validateField(
      this.patient.phoneNo1
    );
    this.isHomeGovernmentValid = this.generalDataService.validateField(
      this.patient.homeGovernmentId
    );
    this.isHomeHealthAdminValid = this.generalDataService.validateField(
      this.patient.homeHealthAdministrationId
    );
    this.isHomeCityValid = this.generalDataService.validateField(
      this.patient.homeCityId
    );
    this.isHomeHealthOfficeValid = this.generalDataService.validateField(
      this.patient.homeHealthOfficeId
    );
    this.isValidCardNumber = this.generalDataService.validateNationalID(
      this.patient.nationalId,
      true
    );

    this.livingAddressValid = this.generalDataService.validateField(
      this.patient.livingAddress
    );

    this.isCaseDiscoveryDateValid = this.generalDataService.validateField(
      this.patient.caseDiscoveryDate
    );

    const validations = {
      firstName: this.isFirstNameValid,
      secondName: this.isSecondNameValid,
      thirdName: this.isThirdNameValid,
      nationality: this.isNationalityValid,
      homeGovernment: this.isHomeGovernmentValid,
      homeHealthAdmin: this.isHomeHealthAdminValid,
      homeCity: this.isHomeCityValid,
      homeHealthOffice: this.isHomeHealthOfficeValid,
      livingAddress: this.livingAddressValid,
      caseDiscoveryDate: this.isCaseDiscoveryDateValid,
    };
    if (Object.values(validations).some(v => !v)) return false;
    return true;
  }

  // Validate Sample
  isDiseaseGroupValid: boolean = true;
  isDiseaseLabTestValid: boolean = true;
  isDiseaseCheckValid: boolean = true;
  // isDiseaseLabTestResultValid: boolean = true;
  isCheckDateValid: boolean = true;
  // isResultDateValid: boolean = true;

  validateSampleRequiredData(): boolean {
    this.isDiseaseGroupValid = this.generalDataService.validateField(
      this.patientAddCheck.diseaseGroupId
    );
    this.isDiseaseLabTestValid = this.generalDataService.validateField(
      this.patientAddCheck.dieaseLabTestId
    );
    this.isDiseaseCheckValid = this.generalDataService.validateField(
      this.patientAddCheck.diseaseCheckId
    );
    // this.isDiseaseLabTestResultValid = this.generalDataService.validateField(this.patientAddCheck.diseaseLabTestResultId);
    this.isCheckDateValid = this.generalDataService.validateField(
      this.patientGridCheck.checkDate
    );
    // this.isResultDateValid = this.generalDataService.validateField(this.patientGridCheck.resultDate);

    if (
      !this.isDiseaseGroupValid ||
      !this.isDiseaseLabTestValid ||
      !this.isDiseaseCheckValid ||
      // || !this.isDiseaseLabTestResultValid
      !this.isCheckDateValid
      // || !this.isResultDateValid
    )
      return false;
    return true;
  }

  nameToDelete(ele) {
    this.underDeleting2.sNo = ele.sNo;
    this.underDeleting2.checkSample = ele.checkSample;
  }

  sort(event: SortEvent) {
    if (
      event.order == -1 &&
      (this.filter.sortOrder != SortOrder.desc ||
        this.filter.sortColumn != event.field)
    ) {
      this.filter.sortOrder = SortOrder.desc;
      this.filter.sortColumn = event.field;
      this.search(false);
    } else if (
      event.order == 1 &&
      (this.filter.sortOrder != SortOrder.asc ||
        this.filter.sortColumn != event.field)
    ) {
      this.filter.sortOrder = SortOrder.asc;
      this.filter.sortColumn = event.field;
      this.search(false);
    }
  }


  search(firstTime?: boolean) {
    this.loadingPanel = true;
    this.Delay();
    this.labService.getPatientsFromLab(this.filter)
      .subscribe((response: any) => {
        this.RemoveDelay();
        this.delay = false;
        this.loadingPanel = false;

        this.patientsFromLab = response?.data ?? [];
        if (this.patientsFromLab.length == 0) {
          this.noPatientData = true;
          this.pages = 0;
          this.translateService
            .get('NOUR.NO_RESULTS')
            .subscribe((msg) => this.userMsg.warn(msg));
        } else {
          this.noPatientData = false;
          this.pageSize = this.filter.pageSize;
          this.pages = response.data[0].totalCount;
          this.last = this.pageIndex * this.pageSize;
        }
      },
        (error) => {
          this.loadingPanel = false;
          this.delay = false;
          this.translateService
            .get('NEDSS.COMMON.INTERNAL_SERVER_ERROR')
            .subscribe((res: string) => {
              this.userMsg.error(res);
            });
        });
  }


  paginate(event: any) {
    this.first = event.first;
    this.last = event.last;
    //add one as primeng pagination is zero based ,so we convert it to one based to fit with the API
    this.pageIndex = event.page + 1;
    this.pageSize = event.rows;
    this.filter.pageIndex = event.page + 1;
    this.filter.pageSize = event.rows;
    this.search(false);
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
  onPaginatorClick(event: MouseEvent) {
    event.preventDefault(); // Prevent the default behavior
  }


  getPatientById(patientId: number) {
    this.repeatedService.getPatientAddedFromLabById(patientId).subscribe(response => {
      if (response) {
        this.selectedHealthAdministration = response.data.homeHealthAdministrationId;
        this.selectedCity = response.data.homeCityId;
        this.selectedHealthOffice = response.data.homeHealthOfficeId;
        this.selectedGovernment = response.data.homeGovernmentId;
        this.selectedNationality = response.data.nationalityId;
        this.onNationalityChanged();
        this.onEditableGovernmentChanged();
        this.onHealthAdministrationChanged();
        this.patient.id = response.data.id;
        this.patient.caseDiscoveryDate = response.data.caseDiscoveryDate;
        this.patient.familyName = response.data.familyName;
        this.patient.homeCityId = response.data.homeCityId;
        this.patient.homeGovernmentId = response.data.homeGovernmentId;
        this.patient.homeHealthAdministrationId = response.data.homeHealthAdministrationId;
        this.patient.homeHealthOfficeId = response.data.homeHealthOfficeId;
        this.patient.insertedByLabId = response.data.insertedByLabId;
        this.patient.livingAddress = response.data.livingAddress;
        this.patient.nationalId = response.data.nationalId;
        this.patient.nationalityId = response.data.nationalityId;
        this.patient.passportNo = response.data.passportNo;
        this.patient.phoneNo1 = response.data.phoneNo1;
        this.patient.phoneNo2 = response.data.phoneNo2;
        this.patient.secondName = response.data.secondName;
        this.patient.thirdName = response.data.thirdName;
        this.patient.firstName = response.data.firstName;
        this.patient.caseDiscoveryDate = this.datePipe.transform(
          this.patient.caseDiscoveryDate,
          'yyyy-MM-dd'
        );

        this.selectedHealthAdministration = response.data.homeHealthAdministrationId;
        this.selectedCity = response.data.homeCityId;
        this.selectedHealthOffice = response.data.homeHealthOfficeId;
        this.selectedGovernment = response.data.homeGovernmentId;
        this.selectedNationality = response.data.nationalityId;

        this.patientGridChecks = [];
        this.patientAddChecks = [];

        // Map patientLabChecks to patientGridChecks
        for (let i = 0; i < response.data.patientLabChecks.length; i++) {
          const element = response.data.patientLabChecks[i];
          this.patientAddCheck.id = element.id;
          this.patientAddCheck.sNo = i + 1;
          this.patientAddCheck.diseaseGroupId = element.diseaseGroupId;
          this.patientAddCheck.diseaseCheckId = element.diseaseCheckId;
          this.patientAddCheck.dieaseLabTestId = element.dieaseLabTestId;
          this.patientAddCheck.diseaseLabTestResultId = element.diseaseLabTestResultId;
          this.patientAddCheck.getSampleDate = element.getSampleDate;
          this.patientAddCheck.labResultDate = element.labResultDate;

          this.patientGridCheck.checkDate = element.getSampleDate;
          this.patientGridCheck.checkSample = element.diseaseCheckName;
          this.patientGridCheck.checkLabTest = element.dieaseLabTestName;
          this.patientGridCheck.checkLabTestResult = element.diseaseLabTestResultName;
          this.patientGridCheck.resultDate = element.labResultDate;
          this.patientGridCheck.sNo = i + 1;
          //this.getLabSamples();

          // this.getLabSamples()
          // this.getLabCheckResults();

          // Create a new instance of the objects for each iteration
          const newPatientAddCheck = {
            id: element.id,
            sNo: i + 1,
            diseaseGroupId: element.diseaseGroupId,
            diseaseCheckId: element.diseaseCheckId,
            dieaseLabTestId: element.dieaseLabTestId,
            diseaseLabTestResultId: element.diseaseLabTestResultId,
            getSampleDate: element.getSampleDate,
            labResultDate: element.labResultDate
          };


          const newPatientGridCheck = {
            id: element.id,
            sNo: i + 1,
            checkDate: element.getSampleDate,
            checkSample: element.diseaseCheckName,
            checkLabTest: element.dieaseLabTestName,
            checkLabTestResult: element.diseaseLabTestResultName,
            resultDate: element.labResultDate,
            diseaseGroupId: element.diseaseGroupId,
            diseaseCheckId: element.diseaseCheckId,
            dieaseLabTestId: element.dieaseLabTestId,
          };
          // Push the new objects into the arrays
          this.patientAddChecks.push(newPatientAddCheck);
          this.patientGridChecks.push(newPatientGridCheck);
        }
      }

      this.patientAddCheck = {
        id: null,
        sNo: null,
        diseaseGroupId: null,
        diseaseCheckId: null,
        dieaseLabTestId: null,
        diseaseLabTestResultId: null,
        getSampleDate: null,
        labResultDate: null,
      };

      this.patientGridCheck = {
        id: null,
        sNo: null,
        checkDate: null,
        checkSample: null,
        checkLabTest: null,
        checkLabTestResult: null,
        resultDate: null,
        diseaseGroupId: null,
        diseaseCheckId: null,
        dieaseLabTestId: null,
      };
    }, () => {
      this.translateService
        .get('NEDSS.COMMON.INTERNAL_SERVER_ERROR')
        .subscribe((res: string) => this.userMsg.error(res));
    });
  }


  getEditableCities(governmentID: any) {
    this.lookupsService.getPageCitys({ governmentID: governmentID }).subscribe(
      (result: any) => {
        if (result != null && result != undefined) {
          this.cities = [{ id: -1, arabicName: 'إختر', englishName: 'Select' }];
          result.data.forEach((nat) => {
            this.cities.push(nat);
          });
        }
        if (this.levelId != 1 && this.levelId != 2 && this.levelId != 3) {
          this.selectedCity = JSON.parse(
            localStorage.getItem('ls.authorizationData')
          ).user.cityId;
          this.onHealthOfficeChanged();
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

  getEditableHealthAdministration(governmentID: any) {
    this.lookupsService
      .getPageHealthAdministrations({ governmentID: governmentID })
      .subscribe(
        (result: any) => {
          if (result != null && result != undefined) {
            this.healthAdministrations = [
              { id: -1, arabicName: 'إختر', englishName: 'Select' },
            ];
            result.data.forEach((nat) => {
              this.healthAdministrations.push(nat);
            });
          }

          if (this.levelId != 1 && this.levelId != 2) {
            this.selectedHealthAdministration = JSON.parse(
              localStorage.getItem('ls.authorizationData')
            ).user.healthAdministrationId;
            this.onHealthAdministrationChanged();
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

  onEditableGovernmentChanged() {
    if (this.selectedGovernment > 0) {
      this.patient.homeGovernmentId = this.selectedGovernment;
      this.getEditableCities(this.patient.homeGovernmentId);

      this.getEditableHealthAdministration(this.patient.homeGovernmentId);

    } else {
      this.patient.homeGovernmentId = null;
      this.healthAdministrations = [];
      this.selectedHealthAdministration = -1;
    }
    this.isHomeGovernmentValid = this.generalDataService.validateField(
      this.patient.homeGovernmentId
    );
  }

  deletePatient() {
    if (this.patientDeleteId <= 0) {
      return;
    }
    const id = this.patientDeleteId;
    this.repeatedService.deletePatientLab(id).subscribe(
      (result: any) => {
        this.search(false);
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
      }, () => {
        this.patientDeleteId = 0;
      })
  }

  patientDeleteId: number = 0;
  patientDeleteName: string = '';

  patientIdToDelete(id: number, name: string) {
    if (id > 0) {
      this.patientDeleteId = id;
      this.patientDeleteName = name;
    }
  }

  validateNationalID(){
    this.generalDataService.isCardIdValid = this.generalDataService.validateNationalID(this.patient.nationalId,true);
  }

}
