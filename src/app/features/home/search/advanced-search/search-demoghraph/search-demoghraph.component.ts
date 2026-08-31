import {
  EducationPhase,
  Gender,
  MaritalStatus,
  SchoolCategory,
  SingleDropdownSettings,
} from 'src/app/core/constants';
import { Component, OnInit } from '@angular/core';
import { SearchSharedDataService } from '../../services/search-shared-data.service';
import { Patient } from '../../models/patient';
import { LookupsGetterService } from 'src/app/core/services/lookups-getter.service';
import { UserMessageService } from 'src/app/core/services/user.message.service';
import { TranslateService } from '@ngx-translate/core';
import { GeneralDataService } from '../../../general-data/services/general-data.service';
import { NationalityEnum } from '../../../general-data/models/nationality-enum';

@Component({
  selector: 'app-search-demoghraph',
  templateUrl: './search-demoghraph.component.html',
  styleUrls: ['./search-demoghraph.component.css'],
})
export class SearchDemoghraphComponent implements OnInit {
  currentLang: string;
  dir: string;
  delay: boolean = false;
  timer: any;

  maxDate: any;
  minDate = new Date(1900, 0, 1);
  patient: Patient;
  nationalities: any;
  loadingPanel: boolean;
  genders = Gender;
  educationPhase = EducationPhase;
  maritalStatus = MaritalStatus;
  schoolCategorys = SchoolCategory;
  jobs: any;
  nationalitiesLoading: boolean = false;
  jobsLoading: boolean = false;
  national: number = -1;
  singleDropdownSettings = SingleDropdownSettings;
  singleDropdownSettingsnationality = SingleDropdownSettings;
  NationalityEnum = NationalityEnum;
  constructor(
    private sharedDataService: SearchSharedDataService,
    private lookupsService: LookupsGetterService,
    private translateService: TranslateService,
    private userMsg: UserMessageService,
    public generalDataService: GeneralDataService
  ) {}

  ngOnInit() {
    this.currentLang =
      localStorage.getItem('ls.currentLang') !== undefined &&
      localStorage.getItem('ls.currentLang') !== 'undefined'
        ? localStorage.getItem('ls.currentLang')
        : 'ar';
    this.maxDate = Date.now;
    let link = document.getElementById('fastSearch') as HTMLElement;
    link.classList.add('active');
    this.getAllLookups();

    this.sharedDataService.getPatientObject().subscribe((patientObject) => {
      this.patient = patientObject;
    });

    this.generalDataService.cardIdValidationMessage = '';
  }

  getAllLookups() {
    this.getNationalties();
    this.getjobNames();
  }

  ngOnDestroy() {
    let link = document.getElementById('fastSearch') as HTMLElement;
    link.classList.remove('active');
  }

  clearAll() {
    this.patient = {};
    this.patient.pageIndex = 0;
    this.patient.pageSize = 10;
    this.patient.filterType = 1;
    this.sharedDataService.setPatientObject(this.patient);
    this.national = -1;
  }

  getNationalties() {
    this.nationalitiesLoading = true;
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
            this.national = this.patient.nationalityId;
          } else {
            this.national = -1;
          }
        }
        this.nationalitiesLoading = false;
        this.loadingPanel = false;
      },
      (error) => {
        this.nationalitiesLoading = false;
        this.loadingPanel = false;
        this.translateService
          .get('NEDSS.COMMON.INTERNAL_SERVER_ERROR')
          .subscribe((res: string) => {
            this.userMsg.error(res);
          });
      }
    );
  }

  getjobNames() {
    this.jobsLoading = true;
    this.lookupsService.getAllPatientJobs().subscribe(
      (result: any) => {
        if (result != null && result != undefined) {
          this.jobs = result.data;
        }
        this.jobsLoading = false;
        this.loadingPanel = false;
      },
      (error) => {
        this.jobsLoading = false;
        this.loadingPanel = false;
        this.translateService
          .get('NEDSS.COMMON.INTERNAL_SERVER_ERROR')
          .subscribe((res: string) => {
            this.userMsg.error(res);
          });
      }
    );
  }

  onNationalIdChanged(value: any) {
    if (value == '') {
      this.patient.age = null;
      this.patient.birthDate == null;
      this.patient.genderId = null;
      this.patient.ageTypeId = null;
    }
  }

  setValue() {
    this.patient.nationalityId = this.national != -1 ? this.national : null;
  }
  setDValue() {
    this.patient.nationalityId = null;
  }
  setgenderValue(event) {
    this.patient.genderId = event.id;
  }
  setgenderDValue() {
    this.patient.genderId = null;
  }
  setmaritalValue(event) {
    this.patient.maritalStatusId = event.id;
  }
  setmaritalDValue() {
    this.patient.maritalStatusId = null;
  }
  seteducationValue(event) {
    this.patient.educationPhaseId = event.id;
  }
  setschoolCategoryValue(event) {
    this.patient.schoolCategoryId = event.id;
  }
  jobSelected(event) {
    this.patient.patientJobName = event.id;
  }
  jobDSelected() {
    this.patient.patientJobName = null;
  }

  disableFieldsDueToNationalId(): boolean {
    var isValid =
      this.patient.nationalityId == 1 &&
      (this.patient.incidentDepartmentId == 1 ||
        (this.generalDataService.validateEmptyField(this.patient.nationalId) &&
          this.generalDataService.isCardIdValid));
    if (isValid) {
      this.patient.birthDate = this.generalDataService.getBirthDate(
        this.patient.nationalId
      );
      this.patient.age = this.generalDataService.getAge(
        this.patient.nationalId
      );
      this.patient.genderId = this.generalDataService.getGender(
        this.patient.nationalId
      );
      this.patient.ageTypeId = this.generalDataService.getAgeTypeId(
        this.patient.nationalId
      );
    }
    return isValid;
  }
}
