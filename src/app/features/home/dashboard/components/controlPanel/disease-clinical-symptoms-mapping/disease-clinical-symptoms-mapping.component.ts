import { Component, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { forkJoin } from 'rxjs';
import { LookupsGetterService } from 'src/app/core/services/lookups-getter.service';
import { UserMessageService } from 'src/app/core/services/user.message.service';

type SymptomRow = {
  clinicalSymptomId: number;
  label: string;
  mapped: boolean;
};

@Component({
  selector: 'app-disease-clinical-symptoms-mapping',
  templateUrl: './disease-clinical-symptoms-mapping.component.html',
  styleUrls: ['./disease-clinical-symptoms-mapping.component.css'],
})
export class DiseaseClinicalSymptomsMappingComponent implements OnInit {
  loading = false;
  currentLang: string = 'ar';

  diseases: any[] = [];
  allDiseases: any[] = [];
  selectedDiseaseGroupId: number | null = null;
  disableClinicalSymptomsAutoFillWhenExternal = false;

  searchTerm: string = '';

  rows: SymptomRow[] = [];

  get filteredRows(): SymptomRow[] {
    const term = (this.searchTerm || '').toLowerCase().trim();
    return (this.rows || []).filter((r) => {
      if (!term) {
        return true;
      }
      return r.label.toLowerCase().includes(term);
    });
  }

  private clinicalSymptoms: any[] = [];

  private loadClinicalSymptomsForRows() {
    this.loading = true;
    this.lookupsService.getAllClinicalSymptoms().subscribe(
      (res: any) => {
        this.clinicalSymptoms = Array.isArray(res?.data) ? res.data : [];
        this.rows = this.clinicalSymptoms.map((cs: any) => ({
          clinicalSymptomId: Number(cs.id),
          label:
            this.currentLang === 'ar' ? cs.arabicName : cs.englishName,
          mapped: false,
        }));
        this.loading = false;
      },
      () => {
        this.loading = false;
      }
    );
  }

  private refreshRowLabels() {
    if (!this.rows?.length || !this.clinicalSymptoms?.length) {
      return;
    }

    this.rows = this.rows.map((r) => {
      const cs = this.clinicalSymptoms.find(
        (x) => Number(x.id) === r.clinicalSymptomId
      );
      if (!cs) return r;

      return {
        ...r,
        label: this.currentLang === 'ar' ? cs.arabicName : cs.englishName,
      };
    });
  }

  constructor(
    private lookupsService: LookupsGetterService,
    private translateService: TranslateService,
    private userMsg: UserMessageService
  ) {}

  ngOnInit(): void {
    this.currentLang =
      localStorage.getItem('ls.currentLang') !== undefined &&
      localStorage.getItem('ls.currentLang') !== 'undefined'
        ? (localStorage.getItem('ls.currentLang') as string)
        : 'ar';

    this.loadClinicalSymptomsForRows();
    this.translateService.onLangChange.subscribe(() => {
      this.currentLang =
        localStorage.getItem('ls.currentLang') !== undefined &&
        localStorage.getItem('ls.currentLang') !== 'undefined'
          ? (localStorage.getItem('ls.currentLang') as string)
          : 'ar';
      this.refreshRowLabels();
    });

    this.loadDiseases();
  }

  private loadDiseases() {
    this.loading = true;
    this.lookupsService.getAllDiseaseGroups().subscribe(
      (res: any) => {
        this.diseases = Array.isArray(res?.data) ? res.data : [];
        this.lookupsService.getAllDiseases().subscribe(
          (diseaseRes: any) => {
            this.allDiseases = Array.isArray(diseaseRes?.data)
              ? diseaseRes.data
              : [];
            this.loading = false;
          },
          () => {
            this.loading = false;
            this.userMsg.error(
              this.translateService.instant('NEDSS.COMMON.INTERNAL_SERVER_ERROR')
            );
          }
        );
      },
      () => {
        this.loading = false;
        this.userMsg.error(
          this.translateService.instant('NEDSS.COMMON.INTERNAL_SERVER_ERROR')
        );
      }
    );
  }

  onDiseaseChanged() {
    if (!this.selectedDiseaseGroupId) {
      this.rows = this.rows.map((r) => ({
        ...r,
        mapped: false,
      }));
      this.disableClinicalSymptomsAutoFillWhenExternal = false;
      return;
    }
    this.syncDisableAutofillFlagFromDisease();
    this.loadMappings(this.selectedDiseaseGroupId);
  }

  setMapped(row: SymptomRow, checked: boolean) {
    row.mapped = checked;
  }

  private syncDisableAutofillFlagFromDisease() {
    if (!this.selectedDiseaseGroupId) {
      this.disableClinicalSymptomsAutoFillWhenExternal = false;
      return;
    }

    const relatedDiseases = (this.allDiseases || []).filter(
      (d: any) => Number(d?.diseaseGroupId) === Number(this.selectedDiseaseGroupId)
    );

    this.disableClinicalSymptomsAutoFillWhenExternal = relatedDiseases.some(
      (d: any) =>
        !!(
          d?.disableAutoFillWhenExternal ?? d?.DisableAutoFillWhenExternal
        )
    );
  }

  private loadMappings(diseaseGroupId: number) {
    this.loading = true;
    this.lookupsService
      .getDiseaseClinicalSymptomsByDiseaseGroupId(diseaseGroupId)
      .subscribe(
        (res: any) => {
          const mappings = Array.isArray(res?.data) ? res.data : [];
          const mappedIds = new Set<number>();
          mappings.forEach((m: any) => {
            const symptomId = m?.clinicalSymptomId ?? m?.ClinicalSymptomId;
            if (symptomId !== null && symptomId !== undefined) {
              mappedIds.add(Number(symptomId));
            }
          });
          this.rows = this.rows.map((r) => ({
            ...r,
            mapped: mappedIds.has(r.clinicalSymptomId),
          }));
          this.loading = false;
        },
        () => {
          this.loading = false;
          this.userMsg.error(
            this.translateService.instant(
              'NEDSS.COMMON.INTERNAL_SERVER_ERROR'
            )
          );
        }
      );
  }

  save() {
    if (!this.selectedDiseaseGroupId) {
      this.userMsg.error(
        this.translateService.instant('NEDSS.COMMON.SELECTVALUE')
      );
      return;
    }

    const payload = (this.rows || [])
      .filter(
        (r) =>
          r.mapped &&
          r.clinicalSymptomId !== null &&
          r.clinicalSymptomId !== undefined &&
          !Number.isNaN(r.clinicalSymptomId)
      )
      .map((r) => ({
        diseaseGroupId: this.selectedDiseaseGroupId,
        clinicalSymptomId: r.clinicalSymptomId,
      }));

    this.loading = true;
    this.lookupsService.saveDiseaseClinicalSymptomMappings(
      this.selectedDiseaseGroupId!,
      payload
    ).subscribe(
      () => {
        const relatedDiseases = (this.allDiseases || []).filter(
          (d: any) =>
            Number(d?.diseaseGroupId) === Number(this.selectedDiseaseGroupId)
        );

        if (!relatedDiseases.length) {
          this.loading = false;
          this.userMsg.success(
            this.translateService.instant('NEDSS.COMMON.SENT_SUCESSFULLY')
          );
          return;
        }

        const updateRequests = relatedDiseases.map((d: any) =>
          this.lookupsService.updateDisease({
            ...d,
            disableAutoFillWhenExternal:
              this.disableClinicalSymptomsAutoFillWhenExternal,
          })
        );

        forkJoin(updateRequests).subscribe(
          () => {
            this.allDiseases = this.allDiseases.map((d: any) =>
              Number(d?.diseaseGroupId) === Number(this.selectedDiseaseGroupId)
                ? {
                    ...d,
                    disableAutoFillWhenExternal:
                      this.disableClinicalSymptomsAutoFillWhenExternal,
                  }
                : d
            );
            this.loading = false;
            this.userMsg.success(
              this.translateService.instant('NEDSS.COMMON.SENT_SUCESSFULLY')
            );
          },
          () => {
            this.loading = false;
            this.userMsg.error(
              this.translateService.instant('NEDSS.COMMON.SENT_FAILD')
            );
          }
        );
      },
      () => {
        this.loading = false;
        this.userMsg.error(
          this.translateService.instant('NEDSS.COMMON.SENT_FAILD')
        );
      }
    );
  }
}
