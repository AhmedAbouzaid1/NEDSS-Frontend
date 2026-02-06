import {
  Component,
  OnInit,
  ViewChildren,
  QueryList,
  ElementRef,
} from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import {
  AgeType,
  EducationPhase,
  Gender,
  MaritalStatus,
  MultipleDropdownSettings,
  Relations,
  SchoolCategory,
  SingleDropdownSettings,
} from 'src/app/core/constants';
import { LookupsGetterService } from 'src/app/core/services/lookups-getter.service';
import { UserMessageService } from 'src/app/core/services/user.message.service';
import { PatientModel } from '../models/patient-model';
import { SharedDataService } from '../services/shared-data.service';
import { GeneralDataService } from '../services/general-data.service';
import { RelativeEnum } from '../models/relative-enum';
import { NationalityEnum } from '../models/nationality-enum';

@Component({
  selector: 'app-demographic-data',
  templateUrl: './demographic-data.component.html',
  styleUrls: ['./demographic-data.component.css'],
})
export class DemographicDataComponent implements OnInit {
  showPatientJobName: boolean = false;
  patient: PatientModel = new PatientModel();
  jobCategories!: any[];
  selectedJobCategory: any;
  selectedJobCategoryId: number;
  jobs!: any[];
  selectedJob: any;
  selectedJobId: number;
  gender = Gender;
  ageType = AgeType;
  maritalStatus = MaritalStatus;
  educationalPhase = EducationPhase;
  schoolCategory = SchoolCategory;
  loadingPanel: boolean = false;
  isStudent: boolean = false;
  isOthers: boolean = false;
  singleDropdownSettings = {};
  multipleDropdownSettings = {};
  currentLang: string = 'ar';
  maxDate = new Date();
  // minDate = new Date(1900, 0, 1);

  // test1: string;
  // test2: string;
  // // Define more input properties as needed

  // @ViewChildren('ngModelInputs') ngModelInputs: QueryList<ElementRef>;

  // onSubmitTest() {
  //   const invalidInput = this.ngModelInputs.find(input => input.nativeElement.invalid);

  //   if (invalidInput) return invalidInput.nativeElement.focus();
  // }

  constructor(
    private sharedDataService: SharedDataService,
    private lookupsService: LookupsGetterService,
    private translateService: TranslateService,
    private userMsg: UserMessageService,
    public generalDataService: GeneralDataService
  ) { }


  public get relativeEnum(): typeof RelativeEnum {
    return RelativeEnum
  }

  public get nationalityEnum(): typeof NationalityEnum {
    return NationalityEnum
  }



  ngOnInit() {
    this.generalDataService.firstNameValidationMessage = '';
    this.generalDataService.secondNameValidationMessage = '';
    this.generalDataService.thirdNameValidationMessage = '';
    this.generalDataService.familyNameValidationMessage = '';
    this.generalDataService.phoneNo1ValidationMessage = '';
    this.generalDataService.phoneNo2ValidationMessage = '';

    this.loadingPanel = true;
    this.currentLang =
      localStorage.getItem('ls.currentLang') !== undefined &&
        localStorage.getItem('ls.currentLang') !== 'undefined'
        ? localStorage.getItem('ls.currentLang')
        : 'ar';
    this.sharedDataService.getPatientObject().subscribe((patientObject) => {
      this.patient = patientObject;
    });
    this.getJobCategories();

    this.singleDropdownSettings = SingleDropdownSettings;
    this.multipleDropdownSettings = MultipleDropdownSettings;
    this.loadingPanel = false;
  }

  onItemSelect(item: any) { }
  onSelectAll(items: any) { }
  onNumberKeyPress(event: KeyboardEvent): void {
    let inputKey = event.key;
    if (
      inputKey !== '+' &&
      inputKey !== 'Backspace' &&
      isNaN(Number(inputKey))
    ) {
      event.preventDefault();
    }
  }

  onJobCategoryChanged() {
    if (this.selectedJobCategoryId != -1) {
      this.patient.patientJobCategoryId = this.selectedJobCategoryId;
      this.getJobs(this.patient.patientJobCategoryId);

      if (this.selectedJobCategoryId == 1) this.isStudent = true;
      else this.isStudent = false;

      this.isOthers = this.selectedJobCategoryId == 4 ? true : false;
    } else {
      this.patient.patientJobCategoryId = null;
      this.jobs = [];
      this.pushJobOther();

      this.selectedJob = null;
      this.selectedJobId = -1;
    }
  }
  onJobChanged() {
    this.showPatientJobName = false;

    if (this.selectedJobId != -1) {
      this.patient.patientJobId = this.selectedJobId;
      if (this.patient.patientJobId === 0) {
        this.patient.patientJobId = null;
        this.showPatientJobName = true;
      }
    } else this.patient.patientJobId = null;
  }

  getJobCategories() {
    this.lookupsService.getAllPatientJobCategorys().subscribe(
      (result: any) => {
        if (result != null && result != undefined) {
          this.jobCategories = [
            { id: -1, arabicName: 'إختر', englishName: 'Select' },
          ];
          result.data.forEach((job) => {
            this.jobCategories.push(job);
          });
          setTimeout(() => {
            if (this.patient.patientJobCategoryId > 0) {
              this.selectedJobCategoryId = this.patient.patientJobCategoryId;
            } else {
              this.selectedJobCategoryId = -1;
            }
            this.onJobCategoryChanged();
          }, 200);

          // this.getJobs(this.patient.patientJobCategoryId);
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

  getJobs(jobCategoryId: any) {
    this.lookupsService
      .getPagePatientJobs({ patientJobCategoryID: jobCategoryId })
      .subscribe(
        (result: any) => {
          if (result != null && result != undefined) {
            this.jobs = [{ id: -1, arabicName: 'إختر', englishName: 'Select' }];
            result.data.forEach((job) => {
              this.jobs.push(job);
            });
            if (this.patient.patientJobId > 0) {
              this.selectedJobId = this.patient.patientJobId;
              this.onJobChanged();
            } else {
              this.selectedJobId = -1;
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
  pushJobOther() {
    this.jobs.push({ id: 0, arabicName: 'أخرى' });
  }

  disableFieldsDueToNationalId(): boolean {
    return (
      this.patient.nationalityId == 1 &&
      this.patient.relationShipDegreeId == 0 &&
      this.patient.incidentDepartmentId == 1 &&
      this.generalDataService.validateEmptyField(this.patient.nationalId) &&
      this.generalDataService.isCardIdValid
    );
  }
  onBirthDateChanged() {
    if (this.patient.birthDate != null) {
      this.patient.birthDate = (new Date(this.patient.birthDate)
        ?.toISOString()
        ?.split('T'))[0];
      this.getAge(this.patient.birthDate);
    } else {
      this.patient.age = null;
      this.patient.birthDate = '';
    }
  }

  getAge(value: any) {
    let timeDiff = Math.abs(Date.now() - new Date(value).getTime());
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
  // checkInput(inputElement:HTMLInputElement){
  //   if(inputElement.value){
  //     inputElement.focus();
  //   }else{}
  // }
}
