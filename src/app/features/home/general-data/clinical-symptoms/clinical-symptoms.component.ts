import { Component, OnDestroy, OnInit } from '@angular/core';
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
export class ClinicalSymptomsComponent implements OnInit, OnDestroy {
  patient: PatientModel = new PatientModel();
  currentLang: string;
  isfeverDurationTypeChanged: boolean;

  FEVERStatus: boolean = true;

  FEVER_DURATION_DAYS: string;

  feverDurationTypes: any[] = [
    { id: null, arabicName: 'إختر', englishName: 'Select' },
    { id: 1, arabicName: 'دقيقة', englishName: 'Minute' },
    { id: 2, arabicName: 'ساعة', englishName: 'Hour' },
    { id: 3, arabicName: 'يوم', englishName: 'Day' },
  ];
  multipleDropdownSettings = {};
  chronicDiseases!: any[];
  selectedChronicDiseases: any = {};
  loadingPanel: boolean = false;

  private lastDiseaseAndDeptKey: string = '';
  private diseaseMappingRequestSeq = 0;
  private destroy$ = new Subject<void>();
  private diseasesByGroupId = new Map<number, any[]>();

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
            this.patient?.incidentDepartmentId === DepartmentEnum.External;

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

  onfeverDurationTypeChange() {
    this.isfeverDurationTypeChanged = true;
  }

  // ----- Clinical symptoms (normalized) -----

  private syncSymptomsWithSelections() {
    if (!this.patient) return;
    const ids = (this.existingSymptomsSelection || [])
      .map((x: any) => Number(x?.id))
      .filter((x: number) => !Number.isNaN(x));
    this.patient.clinicalSymptomIds = Array.from(new Set(ids));
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
