import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormArray, FormControl, FormGroup } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import { UserMessageService } from 'src/app/core/services/user.message.service';
import { InvestigationService } from '../../services/investigation.service';

@Component({
  selector: 'app-ari',
  templateUrl: './ari.component.html',
  styleUrls: ['./ari.component.css'],
})
export class AriComponent implements OnInit {
  currentLang =
    localStorage.getItem('ls.currentLang') !== undefined &&
      localStorage.getItem('ls.currentLang') !== 'undefined'
      ? localStorage.getItem('ls.currentLang')
      : 'ar';

  ariForm: FormGroup;
  currentId: any;
  diseaseGroupID: any;
  patientName = '';

  allFilledControlsCount = 0;
  allControllesCount = 0;

  constructor(
    private investigationService: InvestigationService,
    private translateService: TranslateService,
    private userMsg: UserMessageService,
    private datePipe: DatePipe
  ) {}

  get labSamples(): FormArray {
    return this.ariForm.get('labSamples') as FormArray;
  }

  createLabSampleGroup(data?: any): FormGroup {
    return new FormGroup({
      id: new FormControl(data?.id || null),
      sampleType: new FormControl(data?.sampleType || null),
      sampleNumber: new FormControl(data?.sampleNumber || null),
      sampleCollectionDate: new FormControl(data?.sampleCollectionDate || null),
      sampleTestDate: new FormControl(data?.sampleTestDate || null),
      labResult: new FormControl(data?.labResult || null),
    });
  }

  ngOnInit(): void {
    this.patientName =
      (this.investigationService.patient?.firstName || '') +
      ' ' +
      (this.investigationService.patient?.secondName || '') +
      ' ' +
      (this.investigationService.patient?.thirdName || '');

    this.currentId = this.investigationService.currentid;
    this.diseaseGroupID = this.investigationService.diseaseGroupID;

    this.ariForm = new FormGroup({
      id: new FormControl(),
      patientID: new FormControl(this.currentId),
      diseaseGroupId: new FormControl(this.diseaseGroupID),
      investigationCompletePercentage: new FormControl(),

      seasonalInfluenza: new FormControl(false),
      avianInfluenza: new FormControl(false),
      mersCov: new FormControl(false),
      ncov: new FormControl(false),

      icuAdmission: new FormControl(),
      mechanicalVentilatorUse: new FormControl(),
      icuAdmissionDate: new FormControl(),
      icuDischargeDate: new FormControl(),

      travelOutsideEgypt: new FormControl(),
      travelCountryName: new FormControl(),
      travelReason: new FormControl(),
      travelReturnDate: new FormControl(),

      directContactPositiveCase: new FormControl(),
      positiveCaseDiagnosis: new FormControl(),
      positiveCaseName: new FormControl(),

      directContactBirds: new FormControl(false),
      directContactPigs: new FormControl(false),
      directContactBats: new FormControl(false),
      directContactCamels: new FormControl(false),
      directContactOther: new FormControl(false),
      directContactOtherText: new FormControl(),

      visitedAnimalMarkets: new FormControl(),
      visitedHealthcareFacility: new FormControl(),
      healthcareVisitReason: new FormControl(),
      caseOutcome: new FormControl(),

      covid19VaccineTaken: new FormControl(),
      covid19DoseCount: new FormControl(),
      covid19LastDoseDate: new FormControl(),
      seasonalFluVaccineTaken: new FormControl(),
      seasonalFluVaccineDate: new FormControl(),

      labSamples: new FormArray([]),
    });

    this.labSamples.push(this.createLabSampleGroup());
    this.ariForm.valueChanges.subscribe(() => this.calculateCompletionPercentage());

    this.investigationService.getByIdari(this.currentId).subscribe(
      (res) => {
        const v = res?.data;
        if (!v) {
          this.calculateCompletionPercentage();
          return;
        }

        this.ariForm.patchValue({
          ...v,
          travelCountryName: v.travelCountryName ?? v.countryName ?? null,
          icuAdmissionDate: this.datePipe.transform(v.icuAdmissionDate, 'yyyy-MM-dd'),
          icuDischargeDate: this.datePipe.transform(v.icuDischargeDate, 'yyyy-MM-dd'),
          travelReturnDate: this.datePipe.transform(v.travelReturnDate, 'yyyy-MM-dd'),
          covid19LastDoseDate: this.datePipe.transform(v.covid19LastDoseDate, 'yyyy-MM-dd'),
          seasonalFluVaccineDate: this.datePipe.transform(v.seasonalFluVaccineDate, 'yyyy-MM-dd'),
        });

        const samples = v.labSamples || v.LabSamples || v.investigationLabSamples || v.InvestigationLabSamples || [];
        if (Array.isArray(samples) && samples.length > 0) {
          while (this.labSamples.length > 0) {
            this.labSamples.removeAt(0);
          }
          samples.forEach((item: any) =>
            this.labSamples.push(
              this.createLabSampleGroup({
                ...item,
                sampleCollectionDate: this.datePipe.transform(item?.sampleCollectionDate, 'yyyy-MM-dd'),
                sampleTestDate: this.datePipe.transform(item?.sampleTestDate, 'yyyy-MM-dd'),
              })
            )
          );
        }

        this.calculateCompletionPercentage();
      },
      () => {
        this.translateService.get('NEDSS.COMMON.SENT_FAILD').subscribe((msg: string) => this.userMsg.error(msg));
      }
    );
  }

  save(): void {
    this.ariForm.controls['diseaseGroupId'].setValue(this.diseaseGroupID);
    this.calculateCompletionPercentage();
    this.ariForm.controls['investigationCompletePercentage'].setValue(
      this.allControllesCount === 0
        ? 0
        : parseFloat(((this.allFilledControlsCount / this.allControllesCount) * 100).toFixed(2))
    );

    const payload = { ...this.ariForm.value };

    if (payload.id != null) {
      this.investigationService.updateSevereari(payload).subscribe(
        () => {
          this.translateService
            .get('NEDSS.COMMON.SENT_SUCESSFULLY')
            .subscribe((resMsg: string) => this.userMsg.success(resMsg));
        },
        () => {
          this.translateService.get('NEDSS.COMMON.SENT_FAILD').subscribe((msg: string) => this.userMsg.error(msg));
        }
      );
      return;
    }

    this.investigationService.addInvestigationari(payload).subscribe(
          (response: any) => {
        if (response?.data?.id != null) {
          this.ariForm.controls['id'].setValue(response.data.id);
        }
              this.translateService
                .get('NEDSS.COMMON.SENT_SUCESSFULLY')
          .subscribe((resMsg: string) => this.userMsg.success(resMsg));
      },
      () => {
        this.translateService.get('NEDSS.COMMON.SENT_FAILD').subscribe((msg: string) => this.userMsg.error(msg));
      }
    );
  }

  calculateCompletionPercentage(): void {
    const data = this.ariForm?.value ?? {};
    const excludedFields = ['id', 'patientID', 'diseaseGroupId', 'investigationCompletePercentage', 'createdDate'];
    const baseFields = Object.keys(data).filter((key) => !excludedFields.includes(key) && key !== 'labSamples');

    let totalFields = baseFields.length;
    let filledFields = baseFields.reduce((acc, key) => {
      const value = data[key];
      if (this.isFieldFilled(value)) {
        return acc + 1;
      }
      return acc;
    }, 0);

    const samplesStats = this.countFormArrayCompletion(this.labSamples);
    totalFields += samplesStats.totalFields;
    filledFields += samplesStats.filledFields;
      
      this.allControllesCount = totalFields;
    this.allFilledControlsCount = filledFields;
  }

  private countFormArrayCompletion(formArray: FormArray | null | undefined): {
    totalFields: number;
    filledFields: number;
  } {
    if (!formArray || !Array.isArray(formArray.controls) || formArray.controls.length === 0) {
      return { totalFields: 0, filledFields: 0 };
    }

    let totalFields = 0;
    let filledFields = 0;
    formArray.controls.forEach((row) => {
      const rowValue = (row as FormGroup).value;
      const rowKeys = Object.keys(rowValue).filter((key) => key !== 'id');
      totalFields += rowKeys.length;
      rowKeys.forEach((key) => {
        const value = rowValue[key];
        if (this.isFieldFilled(value)) {
          filledFields += 1;
        }
      });
    });

    return { totalFields, filledFields };
  }

  private isFieldFilled(value: any): boolean {
    if (value === null || value === undefined || value === '' || value === 'null') {
      return false;
    }

    if (typeof value === 'boolean') {
      return value;
    }

    return true;
  }
}
