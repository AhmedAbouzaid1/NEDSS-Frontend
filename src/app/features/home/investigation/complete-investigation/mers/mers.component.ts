import { Component, OnInit } from '@angular/core';
import { FormArray, FormControl, FormGroup } from '@angular/forms';
import { UserMessageService } from 'src/app/core/services/user.message.service';
import { InvestigationService } from '../../services/investigation.service';
import { TranslateService } from '@ngx-translate/core';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-mers',
  templateUrl: './mers.component.html',
  styleUrls: ['./mers.component.css'],
})
export class MersComponent implements OnInit {
  currentLang =
    localStorage.getItem('ls.currentLang') !== undefined &&
      localStorage.getItem('ls.currentLang') !== 'undefined'
      ? localStorage.getItem('ls.currentLang')
      : 'ar';
  mersForm: FormGroup;
  currentId: any;
  patientName: string;
  allFilledControlsCount: number = 0;
  allControllesCount: number = 0;

  get patientVisitHistory(): FormArray {
    return this.mersForm.get('patientVisitHistory') as FormArray;
  }
  get localTravelHistory(): FormArray {
    return this.mersForm.get('localTravelHistories') as FormArray;
  }
  get internationalTravelHistory(): FormArray {
    return this.mersForm.get('internationalTravelHistories') as FormArray;
  }

  createPatientVisitHistoryGroup(data?: any): FormGroup {
    return new FormGroup({
      id: new FormControl(data?.id || null),
      nameHealthFacility: new FormControl(data?.nameHealthFacility || null),
      healthFacilityBelongs: new FormControl(data?.healthFacilityBelongs || null),
      dateVisit: new FormControl(data?.dateVisit || null),
      initialDiagnosis: new FormControl(data?.initialDiagnosis || null),
      admissionHospital: new FormControl(data?.admissionHospital || null),
      dateEntry: new FormControl(data?.dateEntry || null),
      exitDate: new FormControl(data?.exitDate || null),
    });
  }
  createLocalTravelHistoryGroup(data?: any): FormGroup {
    return new FormGroup({
      id: new FormControl(data?.id || null),
      placeCityVillage: new FormControl(data?.placeCityVillage || null),
      departureDate: new FormControl(data?.departureDate || null),
      returnDate: new FormControl(data?.returnDate || null),
    });
  }
  createInternationalTravelHistoryGroup(data?: any): FormGroup {
    return new FormGroup({
      id: new FormControl(data?.id || null),
      countryName: new FormControl(data?.countryName || null),
      departureDate: new FormControl(data?.departureDate || null),
      returnDate: new FormControl(data?.returnDate || null),
      affectedArea: new FormControl(data?.affectedArea || null),
    });
  }
  constructor(
    private investigationService: InvestigationService,
    private translateService: TranslateService,
    private userMsg: UserMessageService,
    private datePipe: DatePipe
  ) { }
  ngOnInit() {
    this.patientName =
      (this.investigationService.patient?.firstName || '') + ' ' +
      (this.investigationService.patient?.secondName || '') + ' ' +
      (this.investigationService.patient?.thirdName || '');
    this.mersForm = new FormGroup({
      id: new FormControl(),
      patientID: new FormControl(),

      // Clinical Data
      caseClassification: new FormControl(),
      conditionAssessment: new FormControl(),
      diagnosisPneumonia: new FormControl(),
      dateDiagnosisPneumonia: new FormControl(),
      diagnosisWasMade: new FormControl(),
      pneumonia: new FormControl(),
      intensiveCareUnit: new FormControl(),
      dateReservation: new FormControl(),
      numberDaysCustody: new FormControl(),
      needsRespiratoryDevice: new FormControl(),
      respiratoryDeviceType: new FormControl(),
      historyDevice: new FormControl(),
      numberDaysPlacementDevice: new FormControl(),

      // Patient Visit History
      patientVisitHistory: new FormArray([]),
      comments: new FormControl(),

      // Lab Tests
      sampleType: new FormControl(),
      sampleTypeOther: new FormControl(),
      sampleCollectionDate: new FormControl(),
      sampleSendDate: new FormControl(),

      // Exposure Data - Travel
      localTravelHistories: new FormArray([]),
      internationalTravelHistories: new FormArray([]),
      travelingWithinEgypt: new FormControl(),
      travelingOutsideEgypt: new FormControl(),
      entryPointType: new FormControl(),
      entryPointName: new FormControl(),
      dateArrivalRepublic: new FormControl(),

      // Exposure Data - Human Contact
      contactSuspectedCase: new FormControl(),
      contactConfirmedCase: new FormControl(),
      epidemicOutbreak: new FormControl(),
      contactDeceasedPersonRespiratory: new FormControl(),
      contactHumanGatherings: new FormControl(),

      // Exposure Data - Animal Exposure
      animalExposure: new FormControl(),
      camal: new FormControl(false),
      cattle: new FormControl(false),
      sheep: new FormControl(false),
      dog: new FormControl(false),
      cats: new FormControl(false),
      bats: new FormControl(false),
      mentionName: new FormControl(),
      camelExposureType: new FormControl(),
      camelExposureTypeOther: new FormControl(),
      camelUnpasteurizedMilk: new FormControl(),
      camelBlood: new FormControl(),
      camelUrine: new FormControl(),
      camelUndercookedMeat: new FormControl(),
      otherCamelProducts: new FormControl(),

      // Investigation Footer
      investigationDate: new FormControl(),
      healthInspectorName: new FormControl(),
      surveillanceOfficer: new FormControl(),
      directorName: new FormControl(),

      investigationCompletePercentage: new FormControl(),
      diseaseGroupId: new FormControl(this.investigationService.diseaseGroupID),
    });
    this.patientVisitHistory.push(this.createPatientVisitHistoryGroup());
    this.localTravelHistory.push(this.createLocalTravelHistoryGroup());
    this.internationalTravelHistory.push(this.createInternationalTravelHistoryGroup());
    this.mersForm.valueChanges.subscribe(() => this.calculateCompletionPercentage());
    this.currentId = this.investigationService.currentid;
    this.mersForm.controls['patientID'].setValue(this.currentId);
    this.investigationService.getByIdmers(this.currentId, this.investigationService.diseaseGroupID).subscribe(
      (res) => {
        console.log(res);
        var v = res.data;
        this.mersForm.patchValue(v);

        // Convert int (1/0) from API to boolean for checkboxes
        ['camal', 'cattle', 'sheep', 'dog', 'cats', 'bats'].forEach(field => {
          this.mersForm.controls[field].setValue(!!v[field]);
        });

        this.mersForm.controls['dateDiagnosisPneumonia'].setValue(
          this.datePipe.transform(
            this.mersForm.value.dateDiagnosisPneumonia,
            'yyyy-MM-dd'
          )
        );
        this.mersForm.controls['dateReservation'].setValue(
          this.datePipe.transform(
            this.mersForm.value.dateReservation,
            'yyyy-MM-dd'
          )
        );
        this.mersForm.controls['historyDevice'].setValue(
          this.datePipe.transform(
            this.mersForm.value.historyDevice,
            'yyyy-MM-dd'
          )
        );
        this.mersForm.controls['sampleCollectionDate'].setValue(
          this.datePipe.transform(
            this.mersForm.value.sampleCollectionDate,
            'yyyy-MM-dd'
          )
        );
        this.mersForm.controls['sampleSendDate'].setValue(
          this.datePipe.transform(
            this.mersForm.value.sampleSendDate,
            'yyyy-MM-dd'
          )
        );
        this.mersForm.controls['dateArrivalRepublic'].setValue(
          this.datePipe.transform(
            this.mersForm.value.dateArrivalRepublic,
            'yyyy-MM-dd'
          )
        );
        this.mersForm.controls['investigationDate'].setValue(
          this.datePipe.transform(
            this.mersForm.value.investigationDate,
            'yyyy-MM-dd'
          )
        );

        const apiVisits = v?.PatientVisitHistory ?? v?.patientVisitHistory;
        if (Array.isArray(apiVisits) && apiVisits.length > 0) {
          while (this.patientVisitHistory.length > 0) {
            this.patientVisitHistory.removeAt(0);
          }
          apiVisits.forEach((item) => {
            this.patientVisitHistory.push(this.createPatientVisitHistoryGroup({
              ...item,
              dateVisit: this.datePipe.transform(item?.dateVisit, 'yyyy-MM-dd'),
              dateEntry: this.datePipe.transform(item?.dateEntry, 'yyyy-MM-dd'),
              exitDate: this.datePipe.transform(item?.exitDate, 'yyyy-MM-dd')
            }));
          });
        }
        const apiLocalTravels = v?.LocalTravelHistories ?? v?.localTravelHistories ?? v?.localTravelHistory;
        if (Array.isArray(apiLocalTravels) && apiLocalTravels.length > 0) {
          while (this.localTravelHistory.length > 0) {
            this.localTravelHistory.removeAt(0);
          }
          apiLocalTravels.forEach((item) => {
            this.localTravelHistory.push(this.createLocalTravelHistoryGroup({
              ...item,
              departureDate: this.datePipe.transform(item?.departureDate, 'yyyy-MM-dd'),
              returnDate: this.datePipe.transform(item?.returnDate, 'yyyy-MM-dd')
            }));
          });
        }
        const apiInternationalTravels = v?.InternationalTravelHistories ?? v?.internationalTravelHistories ?? v?.internationalTravelHistory;
        if (Array.isArray(apiInternationalTravels) && apiInternationalTravels.length > 0) {
          while (this.internationalTravelHistory.length > 0) {
            this.internationalTravelHistory.removeAt(0);
          }
          apiInternationalTravels.forEach((item) => {
            this.internationalTravelHistory.push(this.createInternationalTravelHistoryGroup({
              ...item,
              departureDate: this.datePipe.transform(item?.departureDate, 'yyyy-MM-dd'),
              returnDate: this.datePipe.transform(item?.returnDate, 'yyyy-MM-dd')
            }));
          });
        }

        this.calculateCompletionPercentage();
      },
      (error) => {
        this.translateService
          .get('NEDSS.COMMON.SENT_FAILD')
          .subscribe((res: string) => {
            this.userMsg.error(res);
          });
      }
    );
  }
  save() {
    Object.entries(this.mersForm.controls).map(([key, value], index) => {
      if (value.value == 'null')
        value.setValue(null);
    })
    const collectionDate = this.mersForm.value.sampleCollectionDate;
    const sendDate = this.mersForm.value.sampleSendDate;
    if (collectionDate && sendDate && String(sendDate).substring(0, 10) < String(collectionDate).substring(0, 10)) {
      this.translateService
        .get('NEDSS.COMPLETE_INVESTEGATION.MERS.SAMPLE_SEND_BEFORE_COLLECTION')
        .subscribe((res: string) => this.userMsg.error(res));
      return;
    }
    this.mersForm.controls['diseaseGroupId'].setValue(
      this.investigationService.diseaseGroupID
    );
    this.calculateCompletionPercentage();
    this.mersForm.controls['investigationCompletePercentage'].setValue(
      this.allControllesCount === 0
        ? 0
        : parseFloat(((this.allFilledControlsCount / this.allControllesCount) * 100).toFixed(2))
    );

    const animalFields = ['camal', 'cattle', 'sheep', 'dog', 'cats', 'bats'];
    const payload = {
      ...this.mersForm.value,
      localTravelHistories: this.mersForm.value.localTravelHistories,
      internationalTravelHistories: this.mersForm.value.internationalTravelHistories
    };
    animalFields.forEach(field => {
      payload[field] = payload[field] ? 1 : 0;
    });
    console.log(payload);
    if (payload.id != null) {
      this.investigationService.updateSeveremers(payload).subscribe(
        (response: any) => {
          if (response) {
            this.translateService
              .get('NEDSS.COMMON.SENT_SUCESSFULLY')
              .subscribe((res: string) => {
                this.userMsg.success(res);
              });
          }
        },
        (error) => {
        }
      );
    } else {
      this.investigationService
        .addInvestigationmers(payload)
        .subscribe(
          (response: any) => {
            if (response) {
              this.translateService
                .get('NEDSS.COMMON.SENT_SUCESSFULLY')
                .subscribe((res: string) => {
                  this.userMsg.success(res);
                });
            }
          },
          (error) => {
          }
        );
    }
  }

  calculateCompletionPercentage(): void {
    this.allFilledControlsCount = 0;
    const data = this.mersForm?.value ?? {};
    const excludedFields = ['id', 'patientID', 'investigationCompletePercentage', 'diseaseGroupId', 'createdDate'];

    const baseFields = Object.keys(data).filter((key) =>
      !excludedFields.includes(key) &&
      key !== 'patientVisitHistory' &&
      key !== 'localTravelHistories' &&
      key !== 'internationalTravelHistories');
    let totalFields = baseFields.length;
    let filled = baseFields.reduce((acc, key) => {
      const value = data[key];
      if (value !== null && value !== '' && value !== 'null') {
        return acc + 1;
      }
      return acc;
    }, 0);

    const visitStats = this.countFormArrayCompletion(this.patientVisitHistory);
    totalFields += visitStats.totalFields;
    filled += visitStats.filledFields;
    const localTravelStats = this.countFormArrayCompletion(this.localTravelHistory);
    totalFields += localTravelStats.totalFields;
    filled += localTravelStats.filledFields;
    const internationalTravelStats = this.countFormArrayCompletion(this.internationalTravelHistory);
    totalFields += internationalTravelStats.totalFields;
    filled += internationalTravelStats.filledFields;

    this.allControllesCount = totalFields;
    this.allFilledControlsCount = filled;
  }

  private countFormArrayCompletion(formArray: FormArray | null | undefined): { totalFields: number; filledFields: number } {
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
        const v = rowValue[key];
        if (v !== null && v !== '' && v !== 'null') {
          filledFields += 1;
        }
      });
    });

    return { totalFields, filledFields };
  }
}
