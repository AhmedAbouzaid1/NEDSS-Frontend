import { Component, DoCheck, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { PatientModel, FeverSymptoms } from '../models/patient-model';
import { DepartmentEnum } from '../models/department-enum';
import { SharedDataService } from '../services/shared-data.service';
import { TranslateService } from '@ngx-translate/core';
import { GeneralDataService } from '../services/general-data.service';
import { MultipleDropdownSettings } from 'src/app/core/constants';
import { LookupsGetterService } from 'src/app/core/services/lookups-getter.service';
import { UserMessageService } from 'src/app/core/services/user.message.service';
import { forkJoin, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-clinical-symptoms',
  templateUrl: './clinical-symptoms.component.html',
  styleUrls: ['./clinical-symptoms.component.css'],
})
export class ClinicalSymptomsComponent implements OnInit, OnDestroy, DoCheck {
  @ViewChild('chronicSection') chronicSection?: ElementRef<HTMLElement>;
  patient: PatientModel = new PatientModel();
  currentLang: string;

  FEVERStatus: boolean = true;
  hasFever: boolean | null = null;
  feverPresenceOptions = [
    { value: true, arabicName: 'نعم', englishName: 'Yes' },
    { value: false, arabicName: 'لا', englishName: 'No' },
  ];

  maxDate: Date = new Date();

  private feverMaxDateKey: string | null = null;
  private feverMaxDateValue: Date = this.maxDate;

  get feverMaxDate(): Date {
    const key = this.generalDataService.toYmdDate(this.patient?.caseDiscoveryDate);
    if (key !== this.feverMaxDateKey) {
      this.feverMaxDateKey = key;
      const discovery = key ? new Date(key + 'T00:00:00') : null;
      this.feverMaxDateValue = discovery && discovery < this.maxDate ? discovery : this.maxDate;
    }
    return this.feverMaxDateValue;
  }

  get caseDiscoveryDateLabel(): string | null {
    return this.generalDataService.toYmdDate(this.patient?.caseDiscoveryDate);
  }

  get feverMinDate(): Date | null {
    return this.generalDataService.latestDateBound(this.patient?.birthDate);
  }

  get birthDateLabel(): string | null {
    return this.generalDataService.formatDateLabel(this.patient?.birthDate);
  }

  get isFeverDateBeforeBirth(): boolean {
    return !this.generalDataService.isDateOnOrAfter(
      this.patient?.feverSymptoms?.feverDate,
      this.patient?.birthDate
    );
  }

  get isFeverDateAfterDiscovery(): boolean {
    return !this.generalDataService.checkFeverDateNotAfterDiscovery(
      this.patient?.feverSymptoms?.feverDate,
      this.patient?.caseDiscoveryDate
    );
  }

  FEVER_DURATION_DAYS: string;

  multipleDropdownSettings = {};
  chronicDiseases!: any[];
  selectedChronicDiseases: any = {};
  loadingPanel: boolean = false;

  private lastDiseaseAndDeptKey: string = '';
  private diseaseMappingRequestSeq = 0;
  private destroy$ = new Subject<void>();
  private diseasesByGroupId = new Map<number, any[]>();
  private previousGenderId: number | null | undefined;

  clinicalSymptomsOptions: {
    id: number;
    code?: string;
    arabicName: string;
    englishName: string;
  }[] = [];
  existingSymptomsSelection: any[] = [];
  existingSymptomsOptions: {
    id: number;
    code?: string;
    arabicName: string;
    englishName: string;
  }[] = [];

  constructor(
    private sharedDataService: SharedDataService,
    private translateService: TranslateService,
    private lookupsService: LookupsGetterService,
    private userMsg: UserMessageService,
    public generalDataService: GeneralDataService,
  ) { }

  ngOnInit() {
    this.multipleDropdownSettings = {
      ...MultipleDropdownSettings,
      closeDropDownOnSelection: false,
    };

    this.sharedDataService
      .getPatientObject()
      .pipe(takeUntil(this.destroy$))
      .subscribe((patientObject: PatientModel) => {
        this.patient = patientObject;
        this.patient.clinicalSymptomIds = this.patient.clinicalSymptomIds ?? [];
        this.patient?.chronicDiseasesIds?.map(
          (x) => (this.selectedChronicDiseases[x] = x),
        );
        if (!this.patient.feverSymptoms) {
          this.patient.feverSymptoms = new FeverSymptoms();
        }
        this.patient.feverSymptoms.feverDurationType = 3;

        const selectedDiseaseGroupIds =
          this.getSelectedDiseaseGroupIdsFromPatient(this.patient);
        const diseaseKey = selectedDiseaseGroupIds.join(',');
        const deptId = this.patient?.incidentDepartmentId ?? '';
        const currentKey = `${diseaseKey}|${deptId}`;

        if (selectedDiseaseGroupIds.length > 0) {
          if (currentKey !== this.lastDiseaseAndDeptKey) {
            // Keep persisted values on initial edit load if they already exist.
            if (
              !this.lastDiseaseAndDeptKey &&
              (this.patient.clinicalSymptomIds ?? []).length > 0
            ) {
              this.initializeExistingSymptomsSelection();
            } else {
              this.loadDefaultSymptomsForDiseases(selectedDiseaseGroupIds);
            }
          } else {
            this.initializeExistingSymptomsSelection();
          }
        } else {
          // If diseases were cleared, clear mapped clinical symptoms.
          if (this.lastDiseaseAndDeptKey) {
            this.clearClinicalSymptoms();
          } else {
            this.initializeExistingSymptomsSelection();
          }
        }

        this.lastDiseaseAndDeptKey = currentKey;
      });
    this.translateService
      .get('NEDSS.HOME.GENERAL_DATA_CLINICAL_SYMPTOMS.FEVERDURATION')
      .pipe(takeUntil(this.destroy$))
      .subscribe((res) => (this.FEVER_DURATION_DAYS = res));
    this.translateService
      .get('NEDSS.HOME.GENERAL_DATA_CLINICAL_SYMPTOMS.DAYS')
      .pipe(takeUntil(this.destroy$))
      .subscribe((res) => (this.FEVER_DURATION_DAYS += ' ' + res));

    this.currentLang =
      localStorage.getItem('ls.currentLang') !== undefined &&
        localStorage.getItem('ls.currentLang') !== 'undefined'
        ? localStorage.getItem('ls.currentLang')
        : 'ar';

    this.loadClinicalSymptomsFromApi();
    this.loadDiseasesForExternalAutofillFlag();
    this.translateService.onLangChange
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => {
        // Labels are already provided by API (arabicName/englishName). Just re-sync selection.
        this.initializeExistingSymptomsSelection();
      });

    this.getChronicDisease();
  }

  ngDoCheck(): void {
    const genderId = this.patient?.genderId == null ? null : Number(this.patient.genderId);
    if (genderId !== this.previousGenderId) {
      this.previousGenderId = genderId;
      if (genderId !== 2) {
        this.removePregnantWomenSelection();
      }
    }
  }

  private loadDiseasesForExternalAutofillFlag() {
    this.lookupsService
      .getAllDiseases()
      .pipe(takeUntil(this.destroy$))
      .subscribe(
        (res: any) => {
          const rows = Array.isArray(res?.data) ? res.data : [];
          this.diseasesByGroupId.clear();
          rows.forEach((d: any) => {
            const groupId = Number(d?.diseaseGroupId);
            if (Number.isNaN(groupId)) {
              return;
            }
            const list = this.diseasesByGroupId.get(groupId) || [];
            list.push(d);
            this.diseasesByGroupId.set(groupId, list);
          });
        },
        () => {
          this.diseasesByGroupId.clear();
        },
      );
  }

  private loadClinicalSymptomsFromApi() {
    this.lookupsService
      .getAllClinicalSymptoms()
      .pipe(takeUntil(this.destroy$))
      .subscribe(
        (res: any) => {
          const rows = Array.isArray(res?.data) ? res.data : [];
          this.applyClinicalSymptomLookupRows(rows);
        },
        () => {
          this.clinicalSymptomsOptions = [];
          this.existingSymptomsOptions = [];
          this.initializeExistingSymptomsSelection();
        },
      );
  }

  private applyClinicalSymptomLookupRows(rows: any[]) {
    this.clinicalSymptomsOptions = rows
      .map((x: any) => ({
        id: Number(x?.id),
        code: x?.code,
        arabicName: x?.arabicName ?? '',
        englishName: x?.englishName ?? '',
      }))
      .filter((x: any) => !Number.isNaN(x.id));

    this.existingSymptomsOptions = this.clinicalSymptomsOptions;
    this.initializeExistingSymptomsSelection();
  }

  private getSelectedDiseaseGroupIdsFromPatient(
    patient: PatientModel,
  ): number[] {
    const ids = (patient?.patientDiseases || [])
      .map((d: any) => Number(d?.diseaseGroupId))
      .filter((x: number) => !Number.isNaN(x));

    return ids.sort((a: number, b: number) => a - b);
  }

  private initializeExistingSymptomsSelection() {
    const selected = new Set<number>(
      (this.patient?.clinicalSymptomIds || []).map((x) => Number(x)),
    );
    this.existingSymptomsSelection = (
      this.existingSymptomsOptions || []
    ).filter((o) => selected.has(Number(o.id)));
    this.hasFever = selected.size
      ? this.existingSymptomsSelection.some((option) => this.isFeverSymptom(option))
      : null;
  }

  private clearClinicalSymptoms() {
    if (!this.patient) return;
    this.patient.clinicalSymptomIds = [];
    this.existingSymptomsSelection = [];
  }

  private loadDefaultSymptomsForDiseases(diseaseGroupIds: number[]) {
    if (!diseaseGroupIds?.length) {
      this.initializeExistingSymptomsSelection();
      return;
    }

    if (!this.clinicalSymptomsOptions?.length) {
      this.lookupsService
        .getAllClinicalSymptoms()
        .pipe(takeUntil(this.destroy$))
        .subscribe(
          (res: any) => {
            const rows = Array.isArray(res?.data) ? res.data : [];
            this.applyClinicalSymptomLookupRows(rows);
            this.loadDefaultSymptomsForDiseasesInner(diseaseGroupIds);
          },
          () => {
            this.loadDefaultSymptomsForDiseasesInner(diseaseGroupIds);
          },
        );
      return;
    }

    this.loadDefaultSymptomsForDiseasesInner(diseaseGroupIds);
  }

  private loadDefaultSymptomsForDiseasesInner(diseaseGroupIds: number[]) {
    const requestSeq = ++this.diseaseMappingRequestSeq;
    const requests = diseaseGroupIds.map((id) =>
      this.lookupsService.getDiseaseClinicalSymptomsByDiseaseGroupId(id),
    );

    forkJoin(requests)
      .pipe(takeUntil(this.destroy$))
      .subscribe(
        (responses: any[]) => {
          if (requestSeq !== this.diseaseMappingRequestSeq) {
            return;
          }

          const selectedIds = new Set<number>();
          const isExternal =
            this.patient?.incidentDepartmentId != null &&
            this.patient?.incidentDepartmentId !== DepartmentEnum.Internal;

          responses.forEach((response: any, index: number) => {
            const mappings = Array.isArray(response?.data) ? response.data : [];
            const diseaseGroupId = Number(diseaseGroupIds[index]);
            const relatedDiseases =
              this.diseasesByGroupId.get(diseaseGroupId) || [];
            const disableAutoFillForExternal = relatedDiseases.some(
              (d: any) =>
                !!(
                  d?.disableAutoFillWhenExternal ??
                  d?.DisableAutoFillWhenExternal
                ),
            );

            if (isExternal && disableAutoFillForExternal) {
              return;
            }
            mappings.forEach((m: any) => {
              let id = Number(
                m?.clinicalSymptomId ?? m?.ClinicalSymptomId ?? 0,
              );

              if (!id || Number.isNaN(id)) {
                return;
              }

              selectedIds.add(id);
            });
          });

          this.patient.clinicalSymptomIds = Array.from(selectedIds);
          this.initializeExistingSymptomsSelection();
        },
        () => {
          if (requestSeq !== this.diseaseMappingRequestSeq) {
            return;
          }
          this.initializeExistingSymptomsSelection();
        },
      );
  }
  change($event: any) {
    this.FEVERStatus = $event.currentTarget.checked;
  }

  getChronicDisease() {
    this.lookupsService
      .getChronicDiseases()
      .pipe(takeUntil(this.destroy$))
      .subscribe(
        (result: any) => {
          if (result != null && result != undefined) {
            this.chronicDiseases = result.data;
            if (Number(this.patient?.genderId) !== 2) {
              this.removePregnantWomenSelection();
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
        },
      );
  }

  scrollToChronicSection() {
    setTimeout(() => {
      this.chronicSection?.nativeElement?.scrollIntoView({
        behavior: 'smooth',
        block: 'center',
      });
    });
  }

  itemsCheck(diseaseId) {
    if (this.selectedChronicDiseases[diseaseId]) {
      if (!this.patient?.chronicDiseasesIds?.find((x) => x == diseaseId)) {
        if (this.patient.chronicDiseasesIds?.length)
          this.patient.chronicDiseasesIds.push(diseaseId);
        else this.patient.chronicDiseasesIds = [diseaseId];
      }
    } else {
      this.patient.chronicDiseasesIds = this.patient.chronicDiseasesIds.filter(
        (x) => x != diseaseId,
      );
    }
  }

  shouldShowChronicDisease(disease: any): boolean {
    return Number(this.patient?.genderId) === 2 || !this.isPregnantWomenFactor(disease);
  }

  private isPregnantWomenFactor(disease: any): boolean {
    const names = [disease?.name, disease?.arabicName, disease?.englishName]
      .filter(Boolean)
      .map((name: string) => name.trim().toLocaleLowerCase());

    return names.includes('سيدات حوامل') || names.includes('pregnant women');
  }

  private removePregnantWomenSelection(): void {
    if (!this.chronicDiseases?.length) return;

    const pregnancyIds = this.chronicDiseases
      .filter((disease) => this.isPregnantWomenFactor(disease))
      .map((disease) => disease.id);

    if (!pregnancyIds.length) return;

    pregnancyIds.forEach((id) => delete this.selectedChronicDiseases[id]);
    this.patient.chronicDiseasesIds = (this.patient.chronicDiseasesIds ?? [])
      .filter((id) => !pregnancyIds.some((pregnancyId) => pregnancyId == id));
    this.generalDataService.isChronicDiseaseValid =
      this.generalDataService.validateChronicDisease(
        this.patient.chronicDiseasesIds,
        this.patient.anotherChronicDisease,
        this.patient.haveChronicDisease,
      );
  }

  // ----- Clinical symptoms (normalized) -----

  private syncSymptomsWithSelections() {
    if (!this.patient) return;
    const ids = (this.existingSymptomsSelection || [])
      .map((x: any) => Number(x?.id))
      .filter((x: number) => !Number.isNaN(x));
    this.patient.clinicalSymptomIds = Array.from(new Set(ids));
    this.syncFeverPresenceFromSelection();
  }

  private isFeverSymptom(option: any): boolean {
    const code = String(option?.code ?? '').trim().toUpperCase();
    const arabicName = String(option?.arabicName ?? '').trim();
    const englishName = String(option?.englishName ?? '').trim().toLowerCase();
    return code === 'FEVER' || arabicName.includes('حمى') ||
      arabicName.includes('حرارة') || englishName.includes('fever');
  }

  private syncFeverPresenceFromSelection(): void {
    this.hasFever = (this.existingSymptomsSelection || []).some((option) =>
      this.isFeverSymptom(option)
    );
  }

  onFeverPresenceChange(hasFever: boolean): void {
    const feverOption = (this.existingSymptomsOptions || []).find((option) =>
      this.isFeverSymptom(option)
    );

    this.hasFever = hasFever;
    if (!hasFever) {
      this.patient.feverSymptoms.feverDate = null;
      this.patient.feverSymptoms.feverDuration = null;
      this.patient.feverSymptoms.feverMaxTemp = null;
      this.patient.feverSymptoms.feverDurationType = 3;
      this.generalDataService.isFeverDateValid = true;
      this.generalDataService.isFeverDateAfterBirthValid = true;
      this.generalDataService.isFeverDurationValid = true;
      this.generalDataService.isFeverMaxTemperatureValid = true;
    }
    if (!feverOption) return;

    if (hasFever) {
      if (!(this.existingSymptomsSelection || []).some((x) => Number(x.id) === Number(feverOption.id))) {
        this.existingSymptomsSelection = [...(this.existingSymptomsSelection || []), feverOption];
      }
    } else {
      this.existingSymptomsSelection = (this.existingSymptomsSelection || []).filter(
        (x) => Number(x.id) !== Number(feverOption.id)
      );
    }
    this.syncSymptomsWithSelections();
  }

  onExistingSymptomSelect(_item: any) {
    this.syncSymptomsWithSelections();
  }

  onExistingSymptomDeSelect(_item: any) {
    this.syncSymptomsWithSelections();
  }

  onExistingSymptomsSelectAll(_items: any[]) {
    this.syncSymptomsWithSelections();
  }

  onExistingSymptomsDeSelectAll() {
    this.syncSymptomsWithSelections();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
