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

      diagnosisPneumonia: new FormControl(),
      dateDiagnosisPneumonia: new FormControl(),
      diagnosisWasMade: new FormControl(),
      pneumonia: new FormControl(),
      intensiveCareUnit: new FormControl(),
      dateReservation: new FormControl(),
      numberDaysCustody: new FormControl(),
      oxygenUse: new FormControl(),
      oxygenType: new FormControl(),
      useRespirator: new FormControl(),
      respiratorType: new FormControl(),
      historyDevice: new FormControl(),
      numberDaysPlacementDevice: new FormControl(),
      conditionAssessment: new FormControl(),
      comments: new FormControl(),
      patientVisitHistory: new FormArray([]),
      localTravelHistories: new FormArray([]),
      internationalTravelHistories: new FormArray([]),

      coronaVaccineTaken: new FormControl(),
      numberDoses: new FormControl(),
      dosageDate1: new FormControl(),
      vaccine1: new FormControl(),
      dosageDate2: new FormControl(),
      vaccine2: new FormControl(),
      dosageDate3: new FormControl(),
      vaccine3: new FormControl(),
      dosageDate4: new FormControl(),
      vaccine4: new FormControl(),

      isSeasonalFluVaccine: new FormControl(),
      dateFluVaccination: new FormControl(),
      pneumococcalVaccineTaken: new FormControl(),
      startDate: new FormControl(),
      respiratoryDistressSyndrome: new FormControl(),
      dateonsetSyndrome: new FormControl(),
      heartFailure: new FormControl(),
      isAntihypertensiveMedication: new FormControl(),
      ecmoProcessUsed: new FormControl(),
      ecmoStartDate: new FormControl(),
      durationEcmo: new FormControl(),
      kidneyFailure: new FormControl(),
      havingPregnancy: new FormControl(),
      pregnancyProduct: new FormControl(),
      travelingOutsideEgypt: new FormControl(),
      travelingWithinEgypt: new FormControl(),
      dateArrivalRepublic: new FormControl(),
      airportPlaceArrivalFlightNumberPortTrain: new FormControl(),
      closeContact: new FormControl(),
      contactDataNotes: new FormControl(),

      contactSuspectedCase: new FormControl(),
      epidemicOutbreak: new FormControl(),
      contactConfirmedCase: new FormControl(),
      contactDeceasedPersonRespiratory: new FormControl(),
      numberNonDirectContacts: new FormControl(),
      numberDirectContacts: new FormControl(),

      nameDay1: new FormControl(),
      ageDay1: new FormControl(),
      telephoneDay1: new FormControl(),
      genderDay1: new FormControl(),
      contactTypeDay1: new FormControl(),
      relationshipPatientDay1: new FormControl(),
      dateOnsetSymptomsDay1: new FormControl(),
      feverDay1: new FormControl(),
      dryCoughDay1: new FormControl(),
      coughingWithSpittingDay1: new FormControl(),
      soreThroatDay1: new FormControl(),
      breathingDifficultyDay1: new FormControl(),
      jointPainDay1: new FormControl(),
      vomitDay1: new FormControl(),
      diarrheaDay1: new FormControl(),
      otherDay1: new FormControl(),
      otherSymptomsDay1: new FormControl(),
      isSampleTakenDay1: new FormControl(),
      dateSampleTakenDay1: new FormControl(),
      sampleResultDay1: new FormControl(),

      nameDay2: new FormControl(),
      ageDay2: new FormControl(),
      telephoneDay2: new FormControl(),
      genderDay2: new FormControl(),
      contactTypeDay2: new FormControl(),
      relationshipPatientDay2: new FormControl(),
      dateOnsetSymptomsDay2: new FormControl(),
      feverDay2: new FormControl(),
      dryCoughDay2: new FormControl(),
      coughingWithSpittingDay2: new FormControl(),
      soreThroatDay2: new FormControl(),
      breathingDifficultyDay2: new FormControl(),
      jointPainDay2: new FormControl(),
      vomitDay2: new FormControl(),
      diarrheaDay2: new FormControl(),
      otherDay2: new FormControl(),
      otherSymptomsDay2: new FormControl(),
      isSampleTakenDay2: new FormControl(),
      dateSampleTakenDay2: new FormControl(),
      sampleResultDay2: new FormControl(),

      nameDay7: new FormControl(),
      ageDay7: new FormControl(),
      telephoneDay7: new FormControl(),
      genderDay7: new FormControl(),
      contactTypeDay7: new FormControl(),
      relationshipPatientDay7: new FormControl(),
      dateOnsetSymptomsDay7: new FormControl(),
      feverDay7: new FormControl(),
      dryCoughDay7: new FormControl(),
      coughingWithSpittingDay7: new FormControl(),
      soreThroatDay7: new FormControl(),
      breathingDifficultyDay7: new FormControl(),
      jointPainDay7: new FormControl(),
      vomitDay7: new FormControl(),
      diarrheaDay7: new FormControl(),
      otherDay7: new FormControl(),
      otherSymptomsDay7: new FormControl(),
      isSampleTakenDay7: new FormControl(),
      dateSampleTakenDay7: new FormControl(),
      sampleResultDay7: new FormControl(),

      nameDay14: new FormControl(),
      ageDay14: new FormControl(),
      telephoneDay14: new FormControl(),
      genderDay14: new FormControl(),
      contactTypeDay14: new FormControl(),
      relationshipPatientDay14: new FormControl(),
      dateOnsetSymptomsDay14: new FormControl(),
      feverDay14: new FormControl(),
      dryCoughDay14: new FormControl(),
      coughingWithSpittingDay14: new FormControl(),
      soreThroatDay14: new FormControl(),
      breathingDifficultyDay14: new FormControl(),
      jointPainDay14: new FormControl(),
      vomitDay14: new FormControl(),
      diarrheaDay14: new FormControl(),
      otherDay14: new FormControl(),
      otherSymptomsDay14: new FormControl(),
      isSampleTakenDay14: new FormControl(),
      dateSampleTakenDay14: new FormControl(),
      sampleResultDay14: new FormControl(),

      cats: new FormControl(),
      bats: new FormControl(),
      dog: new FormControl(),
      camal: new FormControl(),
      sheep: new FormControl(),
      civetCats: new FormControl(),
      otherAnimals: new FormControl(),
      mentionName: new FormControl(),
      caseTakeAntivirals: new FormControl(),
      ribavirin: new FormControl(),
      ribavirinStartingDate: new FormControl(),
      antiviralsOther: new FormControl(),
      otherstartingDate: new FormControl(),
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

        this.mersForm.patchValue({
          isSampleTakenDay1: this.mersForm.value.isSampleTakenDay1 + '',
          tc: true,
        });
        this.mersForm.patchValue({
          sampleResultDay1: this.mersForm.value.sampleResultDay1 + '',
          tc: true,
        });
        this.mersForm.controls['dateSampleTakenDay1'].setValue(
          this.datePipe.transform(
            this.mersForm.value.dateSampleTakenDay1,
            'yyyy-MM-dd'
          )
        );
        this.mersForm.patchValue({
          isSampleTakenDay2: this.mersForm.value.isSampleTakenDay2 + '',
          tc: true,
        });
        this.mersForm.patchValue({
          sampleResultDay2: this.mersForm.value.sampleResultDay2 + '',
          tc: true,
        });
        this.mersForm.controls['dateSampleTakenDay2'].setValue(
          this.datePipe.transform(
            this.mersForm.value.dateSampleTakenDay2,
            'yyyy-MM-dd'
          )
        );
        this.mersForm.patchValue({
          isSampleTakenDay7: this.mersForm.value.isSampleTakenDay7 + '',
          tc: true,
        });
        this.mersForm.patchValue({
          sampleResultDay7: this.mersForm.value.sampleResultDay7 + '',
          tc: true,
        });
        this.mersForm.controls['dateSampleTakenDay7'].setValue(
          this.datePipe.transform(
            this.mersForm.value.dateSampleTakenDay7,
            'yyyy-MM-dd'
          )
        );
        this.mersForm.patchValue({
          isSampleTakenDay14: this.mersForm.value.isSampleTakenDay14 + '',
          tc: true,
        });
        this.mersForm.patchValue({
          sampleResultDay14: this.mersForm.value.sampleResultDay14 + '',
          tc: true,
        });
        this.mersForm.controls['dateSampleTakenDay14'].setValue(
          this.datePipe.transform(
            this.mersForm.value.dateSampleTakenDay14,
            'yyyy-MM-dd'
          )
        );
        this.mersForm.controls['dateOnsetSymptomsDay1'].setValue(
          this.datePipe.transform(
            this.mersForm.value.dateOnsetSymptomsDay1,
            'yyyy-MM-dd'
          )
        );
        this.mersForm.controls['dateOnsetSymptomsDay2'].setValue(
          this.datePipe.transform(
            this.mersForm.value.dateOnsetSymptomsDay2,
            'yyyy-MM-dd'
          )
        );
        this.mersForm.controls['dateOnsetSymptomsDay7'].setValue(
          this.datePipe.transform(
            this.mersForm.value.dateOnsetSymptomsDay7,
            'yyyy-MM-dd'
          )
        );
        this.mersForm.controls['dateOnsetSymptomsDay14'].setValue(
          this.datePipe.transform(
            this.mersForm.value.dateOnsetSymptomsDay14,
            'yyyy-MM-dd'
          )
        );
        //ribavirinStartingDate
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
        //
        this.mersForm.controls['dosageDate1'].setValue(
          this.datePipe.transform(this.mersForm.value.dosageDate1, 'yyyy-MM-dd')
        );
        this.mersForm.controls['dosageDate2'].setValue(
          this.datePipe.transform(this.mersForm.value.dosageDate2, 'yyyy-MM-dd')
        );
        this.mersForm.controls['dosageDate3'].setValue(
          this.datePipe.transform(this.mersForm.value.dosageDate3, 'yyyy-MM-dd')
        );
        this.mersForm.controls['dosageDate4'].setValue(
          this.datePipe.transform(this.mersForm.value.dosageDate4, 'yyyy-MM-dd')
        );
        this.mersForm.controls['dateFluVaccination'].setValue(
          this.datePipe.transform(
            this.mersForm.value.dateFluVaccination,
            'yyyy-MM-dd'
          )
        );
        this.mersForm.controls['startDate'].setValue(
          this.datePipe.transform(this.mersForm.value.startDate, 'yyyy-MM-dd')
        );
        this.mersForm.controls['dateonsetSyndrome'].setValue(
          this.datePipe.transform(
            this.mersForm.value.dateonsetSyndrome,
            'yyyy-MM-dd'
          )
        );
        this.mersForm.controls['ecmoStartDate'].setValue(
          this.datePipe.transform(this.mersForm.value.ecmoStartDate, 'yyyy-MM-dd')
        );
        this.mersForm.controls['dateArrivalRepublic'].setValue(
          this.datePipe.transform(
            this.mersForm.value.dateArrivalRepublic,
            'yyyy-MM-dd'
          )
        );
        this.mersForm.controls['ribavirinStartingDate'].setValue(
          this.datePipe.transform(
            this.mersForm.value.ribavirinStartingDate,
            'yyyy-MM-dd'
          )
        );
        this.mersForm.controls['otherstartingDate'].setValue(
          this.datePipe.transform(
            this.mersForm.value.otherstartingDate,
            'yyyy-MM-dd'
          )
        );

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
    this.mersForm.controls['diseaseGroupId'].setValue(
      this.investigationService.diseaseGroupID
    );
    this.calculateCompletionPercentage();
    this.mersForm.controls['investigationCompletePercentage'].setValue(
      this.allControllesCount === 0
        ? 0
        : parseFloat(((this.allFilledControlsCount / this.allControllesCount) * 100).toFixed(2))
    );

    const payload = {
      ...this.mersForm.value,
      localTravelHistories: this.mersForm.value.localTravelHistories,
      internationalTravelHistories: this.mersForm.value.internationalTravelHistories
    };
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
          this.translateService
            .get('NEDSS.COMMON.SENT_FAILD')
            .subscribe((res: string) => {
              this.userMsg.error(res);
            });
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
            this.translateService
              .get('NEDSS.COMMON.SENT_FAILD')
              .subscribe((res: string) => {
                this.userMsg.error(res);
              });
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
