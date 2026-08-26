import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { UserMessageService } from 'src/app/core/services/user.message.service';
import { InvestigationService } from '../../services/investigation.service';
import { TranslateService } from '@ngx-translate/core';
import { DatePipe } from '@angular/common';
import { Router } from '@angular/router';
import { GeneralDataService } from '../../../general-data/services/general-data.service';

@Component({
  selector: 'app-tuberculosis',
  templateUrl: './tuberculosis.component.html',
  styleUrls: ['./tuberculosis.component.css']
})
export class TuberculosisComponent implements OnInit {
  currentLang =
    localStorage.getItem('ls.currentLang') !== undefined &&
      localStorage.getItem('ls.currentLang') !== 'undefined'
      ? localStorage.getItem('ls.currentLang')
      : 'ar';
  tuberculosisForm: FormGroup;
  currentId: any;
  allFilledControlsCount: number = 0;
  allControllesCount: number = 0;
  patientName: string;
  diseaseGroupID: any;
  tuberculosisTypeOptions: { label: string; value: number }[] = [];
  treatmentPatientUsingOptions: { label: string; value: number }[] = [];

  private readonly tbOptionKeys = {
    types: [
      'TYPE_PULMONARY',
      'TYPE_EXTRAPULMONARY',
      'TYPE_PLEURAL_EFFUSION',
      'TYPE_LYMPH_NODES',
      'TYPE_URINARY',
      'TYPE_BONE',
      'TYPE_MENINGEAL',
      'TYPE_INTESTINAL',
      'TYPE_GENITAL',
      'TYPE_OTHER',
    ] as const,
    treatments: ['TREATMENT_INH', 'TREATMENT_RIFAMPICIN', 'TREATMENT_PZA', 'TREATMENT_ETHAMBUTOL'] as const,
  };

  constructor(
    private investigationService: InvestigationService,
    private datePipe: DatePipe,
    public generalDataService: GeneralDataService,
    private translateService: TranslateService,
    private router: Router,
    private userMsg: UserMessageService
  ) {
    if (this.currentId == null) {
      this.currentId = this.investigationService.currentid;
    }
    if (this.diseaseGroupID == null || this.diseaseGroupID === undefined) {
      this.diseaseGroupID = this.investigationService.diseaseGroupID;
    }
    if (
      this.investigationService.patient.firstName != null &&
      this.investigationService.patient.firstName !== undefined
    ) {
      this.patientName =
        this.investigationService.patient.firstName +
        ' ' +
        this.investigationService.patient.secondName +
        ' ' +
        this.investigationService.patient.thirdName;
    }
    this.tuberculosisForm = new FormGroup({
      id: new FormControl(),
      investigationCompletePercentage: new FormControl(),
      patientID: new FormControl(),

      diagnosisPneumonia: new FormControl(),
      dateDiagnosisPneumonia: new FormControl(),
      diagnosisWasMade: new FormControl(),
      pneumonia: new FormControl(),
      reservationIntensiveCareUnit: new FormControl(),
      dateReservation: new FormControl(),
      numberdaysCustody: new FormControl(),
      oxygenUse: new FormControl(),
      typeOxygen: new FormControl(),
      useRespirator: new FormControl(),
      typeRespirator: new FormControl(),
      statusHistoryDevice: new FormControl(),
      noDaysPlacementDevice: new FormControl(),
      conditionAssessment: new FormControl(),

      clinicalExaminationPerformed: new FormControl(),
      diagnoseCondition: new FormControl(),
      tuberculosisType: new FormControl<number[]>([]),
      anotherCaseTuberculosis: new FormControl(),
      resultSputumPositive: new FormControl(),
      dateLastPositiveAfb: new FormControl(),
      resultPositiveXpert: new FormControl(),
      dateLastSampleXpert: new FormControl(),
      farmSentPatient: new FormControl(),
      dateLastSamplefarm: new FormControl(),
      treatmentPatientUsing: new FormControl<number[]>([]),
      treatmentStartDate: new FormControl(),
      durationTreatment: new FormControl(),
      followUpPlace: new FormControl(),
      patientSmoke: new FormControl(),
      durationSmoking: new FormControl(),
      smokingType: new FormControl(),
      numberSmokingTimes: new FormControl(),
      patientTestedAids: new FormControl(),
      resultAids: new FormControl(),
      isPatientTuberculosis: new FormControl(),
      vaccinationStatusBcg: new FormControl(),
      tuberculosisInformed: new FormControl(),
      epidemiologicalSurveyContacts: new FormControl(),
      isTuberculosisPatientRecord: new FormControl(),
      resultPatientRecord: new FormControl(),
      surveyDate: new FormControl(),
      nameHealthMonitor: new FormControl(),
      monitoringOfficer: new FormControl(),
      directorAdministration: new FormControl(),
      diseaseGroupId: new FormControl(this.diseaseGroupID),
    });
    this.calculateCompletionPercentage();
    this.rebuildTbTranslatedOptions();
    this.translateService.onLangChange.subscribe(() => this.rebuildTbTranslatedOptions());
  }

  ngOnInit(): void {
    this.rebuildTbTranslatedOptions();
    if (this.currentId != null) {
      this.tuberculosisForm.controls['patientID'].setValue(this.currentId);
      this.getById();
    } else {
      this.router.navigateByUrl('/home/investigations');
    }
  }

  getById(): void {
    this.investigationService.getByIdTuberculosis(this.currentId).subscribe(
      (res) => {
        const v = res.data;

        this.tuberculosisForm.patchValue(v);
        this.applyMultiSelectFromApi(v?.tuberculosisType, 'tuberculosisType');
        this.applyMultiSelectFromApi(v?.treatmentPatientUsing, 'treatmentPatientUsing');
        if (
          this.tuberculosisForm.value.clinicalExaminationPerformed != null &&
          this.tuberculosisForm.value.clinicalExaminationPerformed !== ''
        ) {
          this.tuberculosisForm.patchValue({
            clinicalExaminationPerformed: this.tuberculosisForm.value.clinicalExaminationPerformed + '',
          });
        }
        this.tuberculosisForm.controls['dateDiagnosisPneumonia'].setValue(
          this.datePipe.transform(this.tuberculosisForm.value.dateDiagnosisPneumonia, 'yyyy-MM-dd')
        );
        this.tuberculosisForm.controls['dateReservation'].setValue(
          this.datePipe.transform(this.tuberculosisForm.value.dateReservation, 'yyyy-MM-dd')
        );
        this.tuberculosisForm.controls['statusHistoryDevice'].setValue(
          this.datePipe.transform(this.tuberculosisForm.value.statusHistoryDevice, 'yyyy-MM-dd')
        );
        this.tuberculosisForm.controls['dateLastPositiveAfb'].setValue(
          this.datePipe.transform(this.tuberculosisForm.value.dateLastPositiveAfb, 'yyyy-MM-dd')
        );
        this.tuberculosisForm.controls['dateLastSampleXpert'].setValue(
          this.datePipe.transform(this.tuberculosisForm.value.dateLastSampleXpert, 'yyyy-MM-dd')
        );
        this.tuberculosisForm.controls['dateLastSamplefarm'].setValue(
          this.datePipe.transform(this.tuberculosisForm.value.dateLastSamplefarm, 'yyyy-MM-dd')
        );
        this.tuberculosisForm.controls['treatmentStartDate'].setValue(
          this.datePipe.transform(this.tuberculosisForm.value.treatmentStartDate, 'yyyy-MM-dd')
        );
        this.tuberculosisForm.controls['surveyDate'].setValue(
          this.datePipe.transform(this.tuberculosisForm.value.surveyDate, 'yyyy-MM-dd')
        );

        Object.entries(this.tuberculosisForm.controls).forEach(([, value]) => {
          if (value.value === 'null') {
            value.setValue(null);
          }
        });

        this.calculateCompletionPercentage();
      },
      () => {
        this.translateService.get('NEDSS.COMMON.SENT_FAILD').subscribe((res: string) => {
          this.userMsg.error(res);
        });
      }
    );
  }

  save(): void {
    Object.entries(this.tuberculosisForm.controls).forEach(([, value]) => {
      if (value.value === 'null') {
        value.setValue(null);
      }
    });
    this.tuberculosisForm.controls['diseaseGroupId'].setValue(this.diseaseGroupID);
    this.calculateCompletionPercentage();
    this.tuberculosisForm.controls['investigationCompletePercentage'].setValue(
      parseFloat(((this.allFilledControlsCount / this.allControllesCount) * 100).toFixed(2))
    );
    if (this.tuberculosisForm.value.id != null) {
      this.investigationService.updateSevereTuberculosis(this.toApiPayload()).subscribe(
        (response: any) => {
          if (response) {
            document.getElementById('jump_to_this_location')?.scrollIntoView({ behavior: 'smooth' });
            this.calculateCompletionPercentage();
            this.getById();
            this.translateService.get('NEDSS.COMMON.SENT_SUCESSFULLY').subscribe((res: string) => {
              this.userMsg.success(res);
            });
          }
        },
        () => {
        }
      );
    } else {
      this.investigationService.addInvestigationTuberculosis(this.toApiPayload()).subscribe(
        (response: any) => {
          if (response) {
            document.getElementById('jump_to_this_location')?.scrollIntoView({ behavior: 'smooth' });
            this.tuberculosisForm.value.id = response.data.id;
            this.currentId = response.data.patientID;
            this.getById();
            this.calculateCompletionPercentage();
            this.translateService.get('NEDSS.COMMON.SENT_SUCESSFULLY').subscribe((res: string) => {
              this.userMsg.success(res);
            });
          }
        },
        () => {
        }
      );
    }
  }

  calculateCompletionPercentage(): void {
    this.allFilledControlsCount = 0;
    const data = this.tuberculosisForm.value;
    const excludedFields = ['id', 'patientID', 'investigationCompletePercentage', 'diseaseGroupId', 'createdDate'];
    const totalFields = Object.keys(data).filter((key) => !excludedFields.includes(key)).length;

    this.allControllesCount = totalFields;

    Object.keys(data).forEach((key) => {
      if (excludedFields.includes(key)) {
        return;
      }
      const val = data[key];
      if (val === null || val === undefined || val === '') {
        return;
      }
      if (Array.isArray(val) && val.length === 0) {
        return;
      }
      this.allFilledControlsCount++;
    });
  }

  private rebuildTbTranslatedOptions(): void {
    const p = 'NEDSS.COMPLETE_INVESTEGATION.TUBERCULOSIS';
    const t = (key: string) => this.translateService.instant(`${p}.${key}`);
    this.tuberculosisTypeOptions = this.tbOptionKeys.types.map((key, i) => ({
      label: t(key),
      value: i + 1,
    }));
    this.treatmentPatientUsingOptions = this.tbOptionKeys.treatments.map((key, i) => ({
      label: t(key),
      value: i + 1,
    }));
  }

  private applyMultiSelectFromApi(raw: unknown, controlName: string): void {
    const ctrl = this.tuberculosisForm.get(controlName);
    if (!ctrl) {
      return;
    }
    if (raw == null || raw === '') {
      ctrl.setValue([]);
      return;
    }
    if (Array.isArray(raw)) {
      ctrl.setValue(raw.map((x) => parseInt(String(x), 10)).filter((n) => !isNaN(n)));
      return;
    }
    if (typeof raw === 'string') {
      ctrl.setValue(
        raw
          .split(',')
          .map((s) => parseInt(s.trim(), 10))
          .filter((n) => !isNaN(n))
      );
      return;
    }
    if (typeof raw === 'number' && !isNaN(raw)) {
      ctrl.setValue([raw]);
    }
  }

  private toApiPayload(): Record<string, unknown> {
    const v = { ...this.tuberculosisForm.value } as Record<string, unknown>;
    const serializeCsv = (key: string) => {
      const t = v[key];
      if (Array.isArray(t)) {
        v[key] = t.length ? (t as number[]).join(',') : null;
      }
    };
    serializeCsv('tuberculosisType');
    serializeCsv('treatmentPatientUsing');
    return v;
  }
}
