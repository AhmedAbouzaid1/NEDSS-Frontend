import { Component, OnDestroy, OnInit } from '@angular/core';
import { EMPTY, Observable, Subject } from 'rxjs';
import { catchError, finalize, takeUntil } from 'rxjs/operators';
import { LookupsGetterService } from 'src/app/core/services/lookups-getter.service';
import { Patient } from '../../models/patient';
import { SearchSharedDataService } from '../../services/search-shared-data.service';

interface LookupOption {
  id: number;
  arabicName: string;
  englishName: string;
}

@Component({
  selector: 'app-search-clinical',
  templateUrl: './search-clinical.component.html',
  styleUrls: ['./search-clinical.component.css'],
})
export class SearchClinicalComponent implements OnInit, OnDestroy {
  readonly yesNoOptions = [
    { value: true, arabicName: 'نعم', englishName: 'Yes' },
    { value: false, arabicName: 'لا', englishName: 'No' },
  ];

  patient: Patient;
  currentLang = 'ar';

  clinicalSymptoms: LookupOption[] = [];
  chronicDiseases: LookupOption[] = [];
  clinicalSymptomsLoading = false;
  chronicDiseasesLoading = false;

  private destroy$ = new Subject<void>();

  constructor(
    private sharedDataService: SearchSharedDataService,
    private lookupsService: LookupsGetterService
  ) {}

  get optionLabel(): string {
    return this.currentLang === 'ar' ? 'arabicName' : 'englishName';
  }

  get selectPlaceholder(): string {
    return this.currentLang === 'ar' ? 'إختر' : 'Select';
  }

  ngOnInit() {
    const savedLang = localStorage.getItem('ls.currentLang');
    this.currentLang = savedLang && savedLang !== 'undefined' ? savedLang : 'ar';

    this.sharedDataService
      .getPatientObject()
      .pipe(takeUntil(this.destroy$))
      .subscribe((patientObject) => (this.patient = patientObject));

    this.clinicalSymptomsLoading = true;
    this.fetch(this.lookupsService.getAllClinicalSymptoms(), () => (this.clinicalSymptomsLoading = false))
      .subscribe((result) => (this.clinicalSymptoms = this.toOptions(result)));

    this.chronicDiseasesLoading = true;
    this.fetch(this.lookupsService.getChronicDiseases(), () => (this.chronicDiseasesLoading = false))
      .subscribe((result) => (this.chronicDiseases = this.toOptions(result)));
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private fetch(request$: Observable<any>, done: () => void): Observable<any> {
    return request$.pipe(
      takeUntil(this.destroy$),
      catchError(() => EMPTY),
      finalize(done)
    );
  }

  private toOptions(result: any): LookupOption[] {
    const rows = Array.isArray(result?.data) ? result.data : Array.isArray(result) ? result : [];
    return rows
      .map((row: any) => {
        const id = Number(row?.id ?? row?.Id);
        if (!Number.isFinite(id) || id <= 0) return null;
        const fallbackName = row?.name ?? row?.Name ?? '';
        return {
          id,
          arabicName: String(row?.arabicName || row?.ArabicName || fallbackName),
          englishName: String(row?.englishName || row?.EnglishName || fallbackName),
        };
      })
      .filter((row: LookupOption | null): row is LookupOption => row != null);
  }
}
