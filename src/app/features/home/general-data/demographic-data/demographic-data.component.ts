import {
  Component,
  OnInit,
  OnDestroy,
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
import { DepartmentEnum } from '../models/department-enum';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-demographic-data',
  templateUrl: './demographic-data.component.html',
  styleUrls: ['./demographic-data.component.css'],
})
export class DemographicDataComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();
  showPatientJobName: boolean = false;
  patient: PatientModel = new PatientModel();
  jobCategories!: any[];
  jobCategoriesLoading: boolean = false;
  jobsLoading: boolean = false;
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
  isConscriptOrPrisoner: boolean = false;
  singleDropdownSettings = {};
  multipleDropdownSettings = {};
  currentLang: string = 'ar';
  maxDate = new Date();

  get birthDateMaxDate(): Date {
    return this.generalDataService.birthDateUpperBound(this.patient) ?? this.maxDate;
  }

  get birthDateMaxLabel(): string | null {
    return this.generalDataService.formatDateLabel(this.birthDateMaxDate);
  }

  get isBirthDateAfterLaterDates(): boolean {
    return !this.generalDataService.checkBirthDateOrder(this.patient);
  }
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

  public get departmentEnum(): typeof DepartmentEnum {
    return DepartmentEnum;
  }

  get isPhoneRequired(): boolean {
    return this.patient?.incidentDepartmentId == DepartmentEnum.Internal;
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
    this.sharedDataService.getPatientObject().pipe(takeUntil(this.destroy$)).subscribe((patientObject) => {
      this.normalizePatientForDisplay(patientObject);
      this.patient = patientObject;
      this.syncJobCategoryFromPatient();
    });
    this.getJobCategories();

    this.singleDropdownSettings = SingleDropdownSettings;
    this.multipleDropdownSettings = MultipleDropdownSettings;
    this.loadingPanel = false;
  }

  private normalizePatientForDisplay(patient: PatientModel): void {
    if (!patient) return;

    patient.genderId = this.toNumberOrNull(patient.genderId);
    patient.age = this.toNumberOrNull(patient.age);
    patient.ageTypeId = this.toNumberOrNull(patient.ageTypeId);

    if (patient.birthDate) {
      const parsedDate = new Date(patient.birthDate as any);
      if (!isNaN(parsedDate.getTime())) {
        patient.birthDate = parsedDate as any;
      }
    }
  }

  private toNumberOrNull(value: any): number | null {
    if (value === null || value === undefined || value === '') {
      return null;
    }

    const numberValue = Number(value);
    return Number.isNaN(numberValue) ? null : numberValue;
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

      this.isConscriptOrPrisoner =
        this.selectedJobCategoryId == 6 || this.selectedJobCategoryId == 7;
      if (this.isConscriptOrPrisoner) {
        this.patient.patientJobId = null;
        this.selectedJobId = -1;
        this.patient.workAddress = null;
      }
    } else {
      this.patient.patientJobCategoryId = null;
      this.jobs = [];
      this.pushJobOther();

      this.selectedJob = null;
      this.selectedJobId = -1;
      this.isConscriptOrPrisoner = false;
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
    this.jobCategoriesLoading = true;
    this.lookupsService.getAllPatientJobCategorys().subscribe(
      (result: any) => {
        if (result != null && result != undefined) {
          this.jobCategories = [
            { id: -1, arabicName: 'إختر', englishName: 'Select' },
          ];
          result.data.forEach((job) => {
            this.jobCategories.push(job);
          });
          this.syncJobCategoryFromPatient();
        }
        this.jobCategoriesLoading = false;
        this.loadingPanel = false;
      },
      (error) => {
        this.jobCategoriesLoading = false;
        this.loadingPanel = false;
        this.translateService
          .get('NEDSS.COMMON.INTERNAL_SERVER_ERROR')
          .subscribe((res: string) => {
            this.userMsg.error(res);
          });
      }
    );
  }

  private syncJobCategoryFromPatient(): void {
    if (!this.jobCategories?.length) return;
    if (this.patient.patientJobCategoryId > 0) {
      this.selectedJobCategoryId = this.patient.patientJobCategoryId;
    } else {
      this.selectedJobCategoryId = -1;
    }
    this.onJobCategoryChanged();
  }

  getJobs(jobCategoryId: any) {
    this.jobsLoading = true;
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
      this.patient.birthDate = this.generalDataService.toYmdDate(this.patient.birthDate);
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
  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
