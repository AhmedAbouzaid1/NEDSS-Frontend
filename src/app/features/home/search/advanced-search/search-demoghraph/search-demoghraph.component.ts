import { Component, OnDestroy, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { Subject } from 'rxjs';
import { finalize, takeUntil } from 'rxjs/operators';
import {
  AgeType,
  EducationPhase,
  Gender,
  MaritalStatus,
  SchoolCategory,
} from 'src/app/core/constants';
import { LookupsGetterService } from 'src/app/core/services/lookups-getter.service';
import { UserMessageService } from 'src/app/core/services/user.message.service';
import { SearchSharedDataService } from '../../services/search-shared-data.service';
import { Patient } from '../../models/patient';
import { GeneralDataService } from '../../../general-data/services/general-data.service';

type LookupOption = { id: number | null; arabicName: string; englishName?: string };

@Component({
  selector: 'app-search-demoghraph',
  templateUrl: './search-demoghraph.component.html',
  styleUrls: ['./search-demoghraph.component.css'],
})
export class SearchDemoghraphComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();

  currentLang: string = 'ar';
  patient: Patient = {};

  genders = this.withPlaceholder(Gender);
  ageTypes = this.withPlaceholder(AgeType);
  maritalStatus = this.withPlaceholder(MaritalStatus);
  educationPhases = this.withPlaceholder(EducationPhase);
  schoolCategories = this.withPlaceholder(SchoolCategory);

  jobCategories: LookupOption[] = [this.placeholder()];
  jobs: LookupOption[] = [this.placeholder()];
  jobCategoriesLoading = false;
  jobsLoading = false;

  constructor(
    private sharedDataService: SearchSharedDataService,
    private lookupsService: LookupsGetterService,
    private translateService: TranslateService,
    private userMsg: UserMessageService,
    public generalDataService: GeneralDataService
  ) {}

  ngOnInit() {
    const savedLang = localStorage.getItem('ls.currentLang');
    this.currentLang = savedLang && savedLang !== 'undefined' ? savedLang : 'ar';
    const link = document.getElementById('fastSearch') as HTMLElement;
    link?.classList.add('active');

    this.sharedDataService
      .getPatientObject()
      .pipe(takeUntil(this.destroy$))
      .subscribe((patientObject) => {
        this.patient = patientObject;
      });

    this.generalDataService.isFirstNameValid = true;
    this.generalDataService.isSecondNameValid = true;
    this.generalDataService.isThirdNameValid = true;
    this.generalDataService.isFamilyNameValid = true;
    this.generalDataService.isPhoneNumber1Valid = true;
    this.generalDataService.isPhoneNumber2Valid = true;
    this.generalDataService.isAgeValid = true;

    this.getJobCategories();
    if (this.patient.patientJobCategoryId != null) {
      this.getJobs(this.patient.patientJobCategoryId);
    }
  }

  ngOnDestroy() {
    const link = document.getElementById('fastSearch') as HTMLElement;
    link?.classList.remove('active');
    this.destroy$.next();
    this.destroy$.complete();
  }

  private placeholder(): LookupOption {
    return { id: null, arabicName: 'إختر', englishName: 'Select' };
  }

  private withPlaceholder(list: LookupOption[]): LookupOption[] {
    return [this.placeholder(), ...list.filter((o) => o.id != null)];
  }

  private toOptions(result: any): LookupOption[] {
    const rows: any[] = Array.isArray(result?.data) ? result.data : [];
    return [
      this.placeholder(),
      ...rows
        .filter((r) => Number(r?.id) > 0)
        .map((r) => ({
          id: Number(r.id),
          arabicName: String(r.arabicName ?? ''),
          englishName: String(r.englishName ?? ''),
        })),
    ];
  }

  private showError() {
    this.translateService
      .get('NEDSS.COMMON.INTERNAL_SERVER_ERROR')
      .subscribe((res: string) => this.userMsg.error(res));
  }

  getJobCategories() {
    this.jobCategoriesLoading = true;
    this.lookupsService
      .getAllPatientJobCategorys()
      .pipe(finalize(() => (this.jobCategoriesLoading = false)))
      .subscribe(
        (result: any) => {
          this.jobCategories = this.toOptions(result);
        },
        () => this.showError()
      );
  }

  onJobCategoryChanged() {
    this.patient.patientJobId = null;
    this.jobs = [this.placeholder()];
    if (this.patient.patientJobCategoryId != null) {
      this.getJobs(this.patient.patientJobCategoryId);
    }
  }

  getJobs(jobCategoryId: number) {
    this.jobsLoading = true;
    this.lookupsService
      .getPagePatientJobs({ patientJobCategoryID: jobCategoryId })
      .pipe(finalize(() => (this.jobsLoading = false)))
      .subscribe(
        (result: any) => {
          this.jobs = this.toOptions(result);
          if (
            this.patient.patientJobId != null &&
            !this.jobs.some((j) => j.id === this.patient.patientJobId)
          ) {
            this.patient.patientJobId = null;
          }
        },
        () => this.showError()
      );
  }

  onTextChanged(field: 'patientJobName' | 'workAddress', value: string) {
    const trimmed = (value ?? '').trim();
    this.patient[field] = trimmed ? value : null;
  }

  onPhoneChanged(field: 'phoneNo1' | 'phoneNo2', value: string) {
    const cleaned = (value ?? '').replace(/(?!^\+)[^\d]/g, '');
    this.patient[field] = cleaned ? cleaned : null;
  }

  onAgeChanged(value: string) {
    const n = value === '' || value == null ? null : Number(value);
    this.patient.age = n != null && Number.isFinite(n) ? n : null;
  }

  onNumberKeyPress(event: KeyboardEvent): void {
    if (event.key === 'Enter') return;
    if (event.key !== 'Backspace' && isNaN(Number(event.key))) {
      event.preventDefault();
    }
  }

  clearAll() {
    this.patient = { pageIndex: 0, pageSize: 10, filterType: 1 };
    this.sharedDataService.setPatientObject(this.patient);
    this.jobs = [this.placeholder()];
    this.generalDataService.isFirstNameValid = true;
    this.generalDataService.isSecondNameValid = true;
    this.generalDataService.isThirdNameValid = true;
    this.generalDataService.isFamilyNameValid = true;
    this.generalDataService.isPhoneNumber1Valid = true;
    this.generalDataService.isPhoneNumber2Valid = true;
    this.generalDataService.isAgeValid = true;
  }
}
