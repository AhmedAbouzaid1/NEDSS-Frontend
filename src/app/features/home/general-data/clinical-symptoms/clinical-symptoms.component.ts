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
  GENERALDESIEASE: boolean = false;
  SYMPTOMS: boolean = false;
  muscular: boolean = false;
  Respiratory: boolean = false;
  otherdieases: boolean = false;

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
  sectionSearchTerm: string = '';
  selectedSectionIds: string[] = [];

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
  ) {}

  sectionOptions: {
    id: string;
    titleKey: string;
    label: string;
    questionKeys: string[];
    questionLabels: string[];
  }[] = [
    {
      id: 'general',
      titleKey: 'NEDSS.HOME.GENERAL_DATA_CLINICAL_SYMPTOMS.GENERALDESIEASE',
      label: '',
      questionKeys: [
        'NEDSS.HOME.GENERAL_DATA_CLINICAL_SYMPTOMS.YELLOW',
        'NEDSS.HOME.GENERAL_DATA_CLINICAL_SYMPTOMS.BLUE',
        'NEDSS.HOME.GENERAL_DATA_CLINICAL_SYMPTOMS.SKINDISCOLORATION2',
        'NEDSS.HOME.GENERAL_DATA_CLINICAL_SYMPTOMS.JERK',
        'NEDSS.HOME.GENERAL_DATA_CLINICAL_SYMPTOMS.HEADACHE',
        'NEDSS.HOME.GENERAL_DATA_CLINICAL_SYMPTOMS.EXHAUSTION',
      ],
      questionLabels: [],
    },
    {
      id: 'gastro',
      titleKey:
        'NEDSS.HOME.GENERAL_DATA_CLINICAL_SYMPTOMS.GASTROLINTESTINAL_SYMPTOMS',
      label: '',
      questionKeys: [
        'NEDSS.HOME.GENERAL_DATA_CLINICAL_SYMPTOMS.NAUSEA',
        'NEDSS.HOME.GENERAL_DATA_CLINICAL_SYMPTOMS.VOMIT',
        'NEDSS.HOME.GENERAL_DATA_CLINICAL_SYMPTOMS.DIARRHEA',
        'NEDSS.HOME.GENERAL_DATA_CLINICAL_SYMPTOMS.MATERYDIARRHEA',
        'NEDSS.HOME.GENERAL_DATA_CLINICAL_SYMPTOMS.colic_Intestinal_Distress_Abdominal_Pain',
        'NEDSS.HOME.GENERAL_DATA_CLINICAL_SYMPTOMS.MUSCUS_STOLL',
        'NEDSS.HOME.GENERAL_DATA_CLINICAL_SYMPTOMS.CONSTIPATION',
        'NEDSS.HOME.GENERAL_DATA_CLINICAL_SYMPTOMS.lossOfAppetite',
      ],
      questionLabels: [],
    },
    {
      id: 'muscular',
      titleKey:
        'NEDSS.HOME.GENERAL_DATA_CLINICAL_SYMPTOMS.Symptoms_of_the_nervous_and_muscular_system',
      label: '',
      questionKeys: [
        'NEDSS.HOME.GENERAL_DATA_CLINICAL_SYMPTOMS.jointPain',
        'NEDSS.HOME.GENERAL_DATA_CLINICAL_SYMPTOMS.backPain',
        'NEDSS.HOME.GENERAL_DATA_CLINICAL_SYMPTOMS.musclePain',
        'NEDSS.HOME.GENERAL_DATA_CLINICAL_SYMPTOMS.encephalitis',
        'NEDSS.HOME.GENERAL_DATA_CLINICAL_SYMPTOMS.difficultySwallowing',
        'NEDSS.HOME.GENERAL_DATA_CLINICAL_SYMPTOMS.cramps',
        'NEDSS.HOME.GENERAL_DATA_CLINICAL_SYMPTOMS.impairedMentalState',
      ],
      questionLabels: [],
    },
    {
      id: 'respiratory',
      titleKey:
        'NEDSS.HOME.GENERAL_DATA_CLINICAL_SYMPTOMS.Respiratory_Symptoms',
      label: '',
      questionKeys: [
        'NEDSS.HOME.GENERAL_DATA_CLINICAL_SYMPTOMS.soreThroat',
        'NEDSS.HOME.GENERAL_DATA_CLINICAL_SYMPTOMS.pneumonia',
        'NEDSS.HOME.GENERAL_DATA_CLINICAL_SYMPTOMS.runnyNose',
        'NEDSS.HOME.GENERAL_DATA_CLINICAL_SYMPTOMS.cough',
        'NEDSS.HOME.GENERAL_DATA_CLINICAL_SYMPTOMS.shortnessOfBreath',
        'NEDSS.HOME.GENERAL_DATA_CLINICAL_SYMPTOMS.dryCough',
        'NEDSS.HOME.GENERAL_DATA_CLINICAL_SYMPTOMS.rapidBreathing',
        'NEDSS.HOME.GENERAL_DATA_CLINICAL_SYMPTOMS.frequentCoughingSpells',
        'NEDSS.HOME.GENERAL_DATA_CLINICAL_SYMPTOMS.coughByVomiting',
        'NEDSS.HOME.GENERAL_DATA_CLINICAL_SYMPTOMS.chestPain',
      ],
      questionLabels: [],
    },
    {
      id: 'chronic',
      titleKey: 'NEDSS.HOME.GENERAL_DATA_CLINICAL_SYMPTOMS.ChronicDiseases',
      label: '',
      questionKeys: [
        'NEDSS.HOME.GENERAL_DATA_CLINICAL_SYMPTOMS.AreThereChronicDiseases',
        'NEDSS.HOME.GENERAL_DATA_CLINICAL_SYMPTOMS.AnotherChronicDiseases',
      ],
      questionLabels: [],
    },
  ];

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
    this.updateSectionLabels();
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

              // Fallback for old payloads that still send symptomKey.
              if (!id && m?.symptomKey) {
                const option = (this.clinicalSymptomsOptions || []).find(
                  (o) => o.code === String(m?.symptomKey),
                );
                id = option?.id ? Number(option.id) : 0;
              }

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

  updateSectionLabels() {
    this.sectionOptions = this.sectionOptions.map((x) => ({
      ...x,
      label: this.translateService.instant(x.titleKey),
      questionLabels: (x.questionKeys || []).map((q) =>
        this.translateService.instant(q),
      ),
    }));
  }

  get filteredSectionOptions() {
    const search = this.sectionSearchTerm?.trim().toLowerCase();
    return this.sectionOptions.filter((section) => {
      if (this.selectedSectionIds.includes(section.id)) {
        return false;
      }

      if (!search) {
        return true;
      }

      const inSection = section.label?.toLowerCase().includes(search);
      const inQuestions = (section.questionLabels || []).some((q) =>
        q?.toLowerCase().includes(search),
      );
      return inSection || inQuestions;
    });
  }

  addSection(sectionId: string) {
    if (!this.selectedSectionIds.includes(sectionId)) {
      this.selectedSectionIds.push(sectionId);
    }
    this.openSection(sectionId);
    this.sectionSearchTerm = '';
  }

  removeSection(sectionId: string) {
    this.selectedSectionIds = this.selectedSectionIds.filter(
      (id) => id !== sectionId,
    );
  }

  showAllSections() {
    this.selectedSectionIds = this.sectionOptions.map((x) => x.id);
    this.FEVERStatus = true;
    this.GENERALDESIEASE = true;
    this.SYMPTOMS = true;
    this.muscular = true;
    this.Respiratory = true;
    this.otherdieases = true;
  }

  hideAllSections() {
    this.selectedSectionIds = [];
    this.GENERALDESIEASE = false;
    this.SYMPTOMS = false;
    this.muscular = false;
    this.Respiratory = false;
    this.otherdieases = false;
  }

  isSectionVisible(sectionId: string) {
    return this.selectedSectionIds.includes(sectionId);
  }

  getSectionTitleKey(sectionId: string) {
    return (
      this.sectionOptions.find((section) => section.id === sectionId)
        ?.titleKey || ''
    );
  }

  toggleSection(sectionId: string) {
    switch (sectionId) {
      case 'fever':
        this.FEVERStatus = !this.FEVERStatus;
        break;
      case 'general':
        this.GENERALDESIEASE = !this.GENERALDESIEASE;
        break;
      case 'gastro':
        this.SYMPTOMS = !this.SYMPTOMS;
        break;
      case 'muscular':
        this.muscular = !this.muscular;
        break;
      case 'respiratory':
        this.Respiratory = !this.Respiratory;
        break;
      case 'chronic':
        this.otherdieases = !this.otherdieases;
        break;
    }
  }

  isSectionOpen(sectionId: string) {
    switch (sectionId) {
      case 'fever':
        return this.FEVERStatus;
      case 'general':
        return this.GENERALDESIEASE;
      case 'gastro':
        return this.SYMPTOMS;
      case 'muscular':
        return this.muscular;
      case 'respiratory':
        return this.Respiratory;
      case 'chronic':
        return this.otherdieases;
      default:
        return false;
    }
  }

  private openSection(sectionId: string) {
    switch (sectionId) {
      case 'fever':
        this.FEVERStatus = true;
        break;
      case 'general':
        this.GENERALDESIEASE = true;
        break;
      case 'gastro':
        this.SYMPTOMS = true;
        break;
      case 'muscular':
        this.muscular = true;
        break;
      case 'respiratory':
        this.Respiratory = true;
        break;
      case 'chronic':
        this.otherdieases = true;
        break;
    }
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
