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

  private checkboxFields = [
    'worksWithPoultry', 'worksInLab', 'worksInHealthcare', 'worksAsVet',
    'directContactBirds', 'directContactPigs', 'directContactBats',
    'directContactCamels', 'directContactNone', 'directContactOther'
  ];

  constructor(
    private investigationService: InvestigationService,
    private translateService: TranslateService,
    private userMsg: UserMessageService,
    private datePipe: DatePipe
  ) {}

  get healthFacilityTimeline(): FormArray {
    return this.ariForm.get('healthFacilityTimeline') as FormArray;
  }

  get domesticTravelEntries(): FormArray {
    return this.ariForm.get('domesticTravelEntries') as FormArray;
  }

  get internationalTravelEntries(): FormArray {
    return this.ariForm.get('internationalTravelEntries') as FormArray;
  }

  createHealthFacilityRow(data?: any): FormGroup {
    return new FormGroup({
      facilityName: new FormControl(data?.facilityName || null),
      administration: new FormControl(data?.administration || null),
      visitDate: new FormControl(data?.visitDate || null),
      initialDiagnosis: new FormControl(data?.initialDiagnosis || null),
      hospitalAdmission: new FormControl(data?.hospitalAdmission || null),
      entryDate: new FormControl(data?.entryDate || null),
      exitDate: new FormControl(data?.exitDate || null),
    });
  }

  createDomesticTravelRow(data?: any): FormGroup {
    return new FormGroup({
      dateFrom: new FormControl(data?.dateFrom || null),
      dateTo: new FormControl(data?.dateTo || null),
      place: new FormControl(data?.place || null),
    });
  }

  createInternationalTravelRow(data?: any): FormGroup {
    return new FormGroup({
      dateFrom: new FormControl(data?.dateFrom || null),
      dateTo: new FormControl(data?.dateTo || null),
      country: new FormControl(data?.country || null),
    });
  }

  addHealthFacilityRow(): void {
    this.healthFacilityTimeline.push(this.createHealthFacilityRow());
  }

  removeHealthFacilityRow(index: number): void {
    this.healthFacilityTimeline.removeAt(index);
  }

  addDomesticTravelRow(): void {
    this.domesticTravelEntries.push(this.createDomesticTravelRow());
  }

  removeDomesticTravelRow(index: number): void {
    this.domesticTravelEntries.removeAt(index);
  }

  addInternationalTravelRow(): void {
    this.internationalTravelEntries.push(this.createInternationalTravelRow());
  }

  removeInternationalTravelRow(index: number): void {
    this.internationalTravelEntries.removeAt(index);
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

      // Clinical Data
      virusType: new FormControl(),
      virusTypeOther: new FormControl(),
      caseAssessment: new FormControl(),
      pneumoniaDiagnosis: new FormControl(),
      pneumoniaDiagnosisMethod: new FormControl(),
      pneumoniaDiagnosisDate: new FormControl(),
      pneumoniaType: new FormControl(),
      hospitalizationDate: new FormControl(),
      icuAdmission: new FormControl(),
      needsRespiratoryDevice: new FormControl(),
      icuAdmissionDate: new FormControl(),
      icuDaysCount: new FormControl(),
      respiratoryDeviceType: new FormControl(),
      respiratoryDeviceDate: new FormControl(),

      // Health Facility Timeline (FormArray, serialized to JSON)
      healthFacilityTimeline: new FormArray([]),
      healthFacilityNotes: new FormControl(),

      // Vaccination Data
      seasonalFluVaccineTaken: new FormControl(),
      seasonalFluVaccineDate: new FormControl(),
      pneumococcalVaccineTaken: new FormControl(),
      pneumococcalVaccineDate: new FormControl(),

      // Treatment
      oseltamivirGiven: new FormControl(),
      oseltamivirFirstDoseDate: new FormControl(),
      oseltamivirRepeatedOver5Days: new FormControl(),
      otherAntiviralGiven: new FormControl(),
      otherAntiviralName: new FormControl(),

      // Exposure - Occupational
      occupationalContact: new FormControl(),
      worksWithPoultry: new FormControl(false),
      worksInLab: new FormControl(false),
      worksInHealthcare: new FormControl(false),
      worksAsVet: new FormControl(false),
      occupationalOther: new FormControl(),
      healthcareDirectCare: new FormControl(),

      // Exposure - Animal Contact
      directContactBirds: new FormControl(false),
      directContactPigs: new FormControl(false),
      directContactBats: new FormControl(false),
      directContactCamels: new FormControl(false),
      directContactNone: new FormControl(false),
      directContactOther: new FormControl(false),
      directContactOtherText: new FormControl(),
      visitedAnimalMarkets: new FormControl(),

      // Exposure - Human Contact
      contactSevereRespiratoryCase: new FormControl(),
      partOfOutbreak: new FormControl(),
      contactDeceasedRespiratoryCase: new FormControl(),
      contactCrowds: new FormControl(),

      // Travel
      domesticTravel: new FormControl(),
      domesticTravelEntries: new FormArray([]),
      internationalTravel: new FormControl(),
      internationalTravelEntries: new FormArray([]),
      arrivalPointType: new FormControl(),
      arrivalPointName: new FormControl(),
      arrivalDate: new FormControl(),

      // Footer
      investigationDate: new FormControl(),
      healthInspectorName: new FormControl(),
      surveillanceOfficer: new FormControl(),
      directorName: new FormControl(),

    });

    // Initialize 1 health facility row
    this.healthFacilityTimeline.push(this.createHealthFacilityRow());

    this.domesticTravelEntries.push(this.createDomesticTravelRow());
    this.internationalTravelEntries.push(this.createInternationalTravelRow());

    this.ariForm.valueChanges.subscribe(() => this.calculateCompletionPercentage());

    this.investigationService.getByIdari(this.currentId).subscribe(
      (res) => {
        const v = res?.data;
        if (!v) {
          this.calculateCompletionPercentage();
          return;
        }

        // Convert checkbox int→bool for patching
        const patchData: any = { ...v };
        this.checkboxFields.forEach(field => {
          if (patchData[field] !== undefined && patchData[field] !== null) {
            patchData[field] = !!patchData[field];
          }
        });

        // Format dates
        const dateFields = [
          'pneumoniaDiagnosisDate', 'hospitalizationDate', 'icuAdmissionDate',
          'respiratoryDeviceDate', 'seasonalFluVaccineDate', 'pneumococcalVaccineDate',
          'oseltamivirFirstDoseDate', 'arrivalDate', 'investigationDate'
        ];
        dateFields.forEach(field => {
          if (patchData[field]) {
            patchData[field] = this.datePipe.transform(patchData[field], 'yyyy-MM-dd');
          }
        });

        this.ariForm.patchValue(patchData);

        // Deserialize health facility timeline
        if (v.healthFacilityTimelineJson) {
          try {
            const items = JSON.parse(v.healthFacilityTimelineJson);
            if (Array.isArray(items) && items.length > 0) {
              while (this.healthFacilityTimeline.length > 0) {
                this.healthFacilityTimeline.removeAt(0);
              }
              items.forEach((item: any) => this.healthFacilityTimeline.push(this.createHealthFacilityRow(item)));
            }
          } catch (e) {}
        }

        // Deserialize domestic travel
        if (v.domesticTravelJson) {
          try {
            const items = JSON.parse(v.domesticTravelJson);
            if (Array.isArray(items) && items.length > 0) {
              while (this.domesticTravelEntries.length > 0) {
                this.domesticTravelEntries.removeAt(0);
              }
              items.forEach((item: any) => this.domesticTravelEntries.push(this.createDomesticTravelRow(item)));
            }
          } catch (e) {}
        }

        // Deserialize international travel
        if (v.internationalTravelJson) {
          try {
            const items = JSON.parse(v.internationalTravelJson);
            if (Array.isArray(items) && items.length > 0) {
              while (this.internationalTravelEntries.length > 0) {
                this.internationalTravelEntries.removeAt(0);
              }
              items.forEach((item: any) => this.internationalTravelEntries.push(this.createInternationalTravelRow(item)));
            }
          } catch (e) {}
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

    const payload: any = { ...this.ariForm.value };

    // Serialize FormArrays to JSON
    payload.healthFacilityTimelineJson = JSON.stringify(this.healthFacilityTimeline.value);
    payload.domesticTravelJson = JSON.stringify(this.domesticTravelEntries.value);
    payload.internationalTravelJson = JSON.stringify(this.internationalTravelEntries.value);

    // Remove FormArray fields that don't exist on backend
    delete payload.healthFacilityTimeline;
    delete payload.domesticTravelEntries;
    delete payload.internationalTravelEntries;

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
    const excludedFields = [
      'id', 'patientID', 'diseaseGroupId', 'investigationCompletePercentage', 'createdDate',
      'healthFacilityTimeline', 'domesticTravelEntries', 'internationalTravelEntries'
    ];
    const baseFields = Object.keys(data).filter((key) => !excludedFields.includes(key));

    let totalFields = baseFields.length;
    let filledFields = baseFields.reduce((acc, key) => {
      const value = data[key];
      if (this.isFieldFilled(value)) {
        return acc + 1;
      }
      return acc;
    }, 0);

    const arrays = [this.healthFacilityTimeline, this.domesticTravelEntries, this.internationalTravelEntries];
    arrays.forEach(arr => {
      const stats = this.countFormArrayCompletion(arr);
      totalFields += stats.totalFields;
      filledFields += stats.filledFields;
    });

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
        if (this.isFieldFilled(rowValue[key])) {
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
