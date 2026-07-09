import { AnswerOptions, AnswerOptions2 } from './../../../../../core/constants';
import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { InvestigationService } from '../../services/investigation.service';
import { ActivatedRoute, Router } from '@angular/router';
import { DatePipe } from '@angular/common';
import { UserMessageService } from 'src/app/core/services/user.message.service';
import { TranslateService } from '@ngx-translate/core';
import { calculateCompletionStats } from '../shared/investigation-summary.utils';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-h5n1',
  templateUrl: './h5n1.component.html',
  styleUrls: ['./h5n1.component.css'],
})
export class H5n1Component implements OnInit {
  private readonly DATE_FORMAT = 'yyyy-MM-dd';
  private readonly summaryMetaFields = ['id', 'patientID', 'completePercentage', 'diseaseGroupId', 'createdDate'];
  private readonly datePayloadFields = new Set([
    'dateOfDiagnosisOfPneumonia',
    'dateOfReservation',
    'statusHistoryOnDevice',
    'dateOfTakingOseltamivir',
    'dateOfTraveloutside',
    'dateOfTraveloutsideTo',
    'dateOfTraveloutside2',
    'dateOfTraveloutsideTo2',
    'dateOfTravelInside',
    'dateOfTravelInsideTo',
    'dateOfTravelInside2',
    'dateOfTravelInsideTo2',
    'dateOfTravelInside3',
    'dateOfTravelInsideTo3',
    'arrivalDateToEgypt',
    'investigationDate',
  ]);
  private readonly stringPayloadFields = new Set([
    'nameOfCountry',
    'nameOfCountry2',
    'governorate',
    'governorate2',
    'governorate3',
    'entryPointPlaceName',
    'healthObserverName',
    'surveillanceOfficerName',
    'administrationDirectorName',
    'nameOfAntiviral',
    'notes'
  ]);
  private readonly visitFieldBases = [
    'healthCareFacilityName',
    'healthUnitBelongs',
    'dateVisit',
    'initialdiagnosis',
    'hospitalization',
    'entryDate',
    'exitDate'
  ];
  private readonly exposureAnimalToggleFields = [
    'chicken',
    'duck',
    'geese',
    'rummy',
    'pigeon',
    'quail',
    'migratoryBird'
  ];
  private readonly exposureCheckboxPatterns = ['ExposureMethod', 'PlaceExposure', 'AnimalCondition'];
  private readonly explicitExposureCheckboxFields = [
    'protectiveEquipmentPersonal',
    'protectiveEquipmentDisinfectants',
    'protectiveEquipmentPlasticBags'
  ];
  private readonly protectiveEquipmentCheckboxes = [
    'protectiveEquipmentPersonal',
    'protectiveEquipmentDisinfectants',
    'protectiveEquipmentPlasticBags'
  ];

  currentLang =
    localStorage.getItem('ls.currentLang') !== undefined &&
      localStorage.getItem('ls.currentLang') !== 'undefined'
      ? localStorage.getItem('ls.currentLang')
      : 'ar';
  birdFluForm: FormGroup;
  answerOptions = AnswerOptions;
  answerOptions2 = AnswerOptions2;
  currentId: any;
  controlsCount: number = 0;
  allFilledControlsCount: number = 0;
  allControllesCount: number = 0;
  patientName: string;
  diseaseGroupID: any;
  private exposureCheckboxSubs: Subscription[] = [];
  private isSaving = false;

  get patientVisitHistory(): FormArray {
    return this.birdFluForm.get('patientVisitHistory') as FormArray;
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
      exitDate: new FormControl(data?.exitDate || null)
    });
  }

  private syncPatientVisitHistoryFromApi(data: any): void {
    const apiVisits = data?.PatientVisitHistory ?? data?.patientVisitHistory;

    if (!Array.isArray(apiVisits) || apiVisits.length === 0) {
      while (this.patientVisitHistory.length > 0) {
        this.patientVisitHistory.removeAt(0);
      }
      return;
    }

    while (this.patientVisitHistory.length > 0) {
      this.patientVisitHistory.removeAt(0);
    }

    apiVisits.forEach((item: any) => {
      this.patientVisitHistory.push(this.createPatientVisitHistoryGroup({
        id: item?.id ?? null,
        nameHealthFacility: item?.nameHealthFacility ?? null,
        healthFacilityBelongs: item?.healthFacilityBelongs ?? null,
        dateVisit: this.datePipe.transform(item?.dateVisit, this.DATE_FORMAT) ?? null,
        initialDiagnosis: item?.initialDiagnosis ?? null,
        admissionHospital: item?.admissionHospital ?? null,
        dateEntry: this.datePipe.transform(item?.dateEntry, this.DATE_FORMAT) ?? null,
        exitDate: this.datePipe.transform(item?.exitDate, this.DATE_FORMAT) ?? null,
      }));
    });
  }

  private getFlatVisitFieldNames(): string[] {
    return Array.from({ length: 5 }, (_, index) => index + 1)
      .flatMap((visitIndex) => this.visitFieldBases.map((field) => `${field}${visitIndex}`));
  }

  private getCompletionExcludedFields(): string[] {
    return [
      ...this.summaryMetaFields,
      ...this.getFlatVisitFieldNames(),
      ...this.protectiveEquipmentCheckboxes
    ];
  }

  private getExposureCheckboxFields(): string[] {
    const checkboxFields = Object.keys(this.birdFluForm.controls).filter((key) =>
      this.exposureAnimalToggleFields.includes(key) ||
      this.exposureCheckboxPatterns.some((pattern) => key.includes(pattern)) ||
      this.explicitExposureCheckboxFields.includes(key)
    );

    return [...new Set(checkboxFields)];
  }

  private normalizeExposureCheckboxValues(): void {
    const truthyValues = new Set([true, 1, '1', 'true']);
    this.getExposureCheckboxFields().forEach((field) => {
      const control = this.birdFluForm.get(field);
      if (!control) {
        return;
      }
      control.setValue(truthyValues.has(control.value) ? true : null, { emitEvent: false });
    });
  }

  private setupExposureCheckboxNormalization(): void {
    this.exposureCheckboxSubs.forEach((sub) => sub.unsubscribe());
    this.exposureCheckboxSubs = [];

    this.getExposureCheckboxFields().forEach((field) => {
      const control = this.birdFluForm.get(field);
      if (!control) {
        return;
      }

      this.exposureCheckboxSubs.push(
        control.valueChanges.subscribe((value) => {
          const normalized = value === true ? true : null;
          if (value !== normalized) {
            control.setValue(normalized, { emitEvent: false });
            this.controlsCount = this.calculateCompletePercentage();
          }
        })
      );
    });
  }

  private normalizeNullishValue(value: any): any {
    return value === '' || value === 'null' || value === undefined ? null : value;
  }

  private normalizeNumericValue(value: any): number | null | any {
    const normalizedValue = this.normalizeNullishValue(value);
    if (normalizedValue === null || typeof normalizedValue === 'number') {
      return normalizedValue;
    }

    const numericValue = Number(normalizedValue);
    return Number.isNaN(numericValue) ? normalizedValue : numericValue;
  }

  private normalizePatientVisitPayload(visit: any): any {
    return {
      id: this.normalizeNumericValue(visit?.id),
      patientID: this.normalizeNumericValue(this.currentId),
      nameHealthFacility: this.normalizeNullishValue(visit?.nameHealthFacility),
      healthFacilityBelongs: this.normalizeNullishValue(visit?.healthFacilityBelongs),
      dateVisit: this.normalizeNullishValue(visit?.dateVisit),
      initialDiagnosis: this.normalizeNullishValue(visit?.initialDiagnosis),
      admissionHospital: this.normalizeNumericValue(visit?.admissionHospital),
      dateEntry: this.normalizeNullishValue(visit?.dateEntry),
      exitDate: this.normalizeNullishValue(visit?.exitDate)
    };
  }

  private buildSavePayload(): any {
    const payload = { ...this.birdFluForm.getRawValue() };
    payload.completePercentage = Math.round(this.controlsCount);
    payload.investigationCompletePercentage = this.controlsCount;
    payload.patientID = this.normalizeNumericValue(payload.patientID);
    payload.diseaseGroupId = this.normalizeNumericValue(this.diseaseGroupID);

    Object.keys(payload).forEach((key) => {
      if (key === 'patientVisitHistory') {
        payload.PatientVisitHistory = Array.isArray(payload[key])
          ? payload[key].map((item: any) => this.normalizePatientVisitPayload(item))
          : [];
        delete payload[key];
        return;
      }

      if (this.getExposureCheckboxFields().includes(key)) {
        payload[key] = payload[key] === true ? true : null;
        return;
      }

      if (this.datePayloadFields.has(key) || this.stringPayloadFields.has(key)) {
        payload[key] = this.normalizeNullishValue(payload[key]);
        return;
      }

      payload[key] = this.normalizeNumericValue(payload[key]);
    });

    return payload;
  }

  private logSaveError(err: any): void {
    console.error('H5N1 save failed', {
      status: err?.status,
      message: err?.message,
      error: err?.error
    });
  }

  constructor(
    private formBuilder: FormBuilder,
    private investigationService: InvestigationService,
    private route: ActivatedRoute,
    private router: Router,
    private translateService: TranslateService,
    private userMsg: UserMessageService,
    private datePipe: DatePipe
  ) {
    this.currentId = this.route.snapshot.paramMap.get('id');
    this.diseaseGroupID = this.route.snapshot.paramMap.get('diseaseId');

    if (this.currentId == null) {
      this.currentId = this.investigationService.currentid;
    }
    if (this.diseaseGroupID == null || this.diseaseGroupID == undefined) {
      this.diseaseGroupID = this.investigationService.diseaseGroupID;
    }
    if (this.investigationService.patient.firstName != null && this.investigationService.patient.firstName != undefined) {
      this.patientName = this.investigationService.patient.firstName + " " + this.investigationService.patient.secondName + " " + this.investigationService.patient.thirdName;
    }
    this.birdFluForm = new FormGroup({
      completePercentage: new FormControl(),
      patientID: new FormControl(this.currentId),
      conditionClassification: new FormControl(),
      diagnosisOfPneumonia: new FormControl(),
      dateOfDiagnosisOfPneumonia: new FormControl(),
      diagnosisWasMade: new FormControl(),
      pneumonia: new FormControl(),
      reservationintheintensiveCareUnit: new FormControl(),
      dateOfReservation: new FormControl(),
      numberOfDaysOfCustody: new FormControl(),
      maskType: new FormControl(),
      useOfARespirator: new FormControl(),
      statusHistoryOnDevice: new FormControl(),
      numberOfDaysOfPlacementOnDevice: new FormControl(),
      conditionAssessment: new FormControl(),
      patientVisitHistory: this.formBuilder.array([]),
      notes: new FormControl(),
      diagnoseOseltamivir: new FormControl(),
      dateOfTakingOseltamivir: new FormControl(),
      repeatedOseltamivir: new FormControl(),
      diagnoseAntiviral: new FormControl(),
      nameOfAntiviral: new FormControl(),
      travelingOutsideEgypt: new FormControl(),
      nameOfCountry: new FormControl(),
      dateOfTraveloutside: new FormControl(),
      dateOfTraveloutsideTo: new FormControl(),
      nameOfCountry2: new FormControl(),
      dateOfTraveloutside2: new FormControl(),
      dateOfTraveloutsideTo2: new FormControl(),
      travelingwithinEgypt: new FormControl(),
      governorate: new FormControl(),
      dateOfTravelInside: new FormControl(),
      dateOfTravelInsideTo: new FormControl(),
      governorate2: new FormControl(),
      dateOfTravelInside2: new FormControl(),
      dateOfTravelInsideTo2: new FormControl(),
      governorate3: new FormControl(),
      dateOfTravelInside3: new FormControl(),
      dateOfTravelInsideTo3: new FormControl(),
      countryReportedBirdFlu: new FormControl(),
      countryReportedBirdFlu2: new FormControl(),
      entryPointToEgypt: new FormControl(),
      entryPointPlaceName: new FormControl(),
      arrivalDateToEgypt: new FormControl(),
      usedProtectiveEquipmentWithBirds: new FormControl(),
      birdWasteExposure: new FormControl(),
      protectiveEquipmentPersonal: new FormControl('0'),
      protectiveEquipmentDisinfectants: new FormControl('0'),
      protectiveEquipmentPlasticBags: new FormControl('0'),
      chicken: new FormControl('0'),
      chickensExposureMethodSlaughter: new FormControl('0'),
      chickensExposureMethodEquip: new FormControl('0'),
      chickensExposureMethodExistence: new FormControl('0'),
      chickensExposureMethodHunt: new FormControl('0'),
      chickensHomePlaceExposure: new FormControl('0'),
      chickensMarketPlaceExposure: new FormControl('0'),
      chickensShopPlaceExposure: new FormControl('0'),
      chickensFarmPlaceExposure: new FormControl('0'),
      chickensGoodAnimalCondition: new FormControl('0'),
      chickensSickAnimalCondition: new FormControl('0'),
      chickensCantAnimalCondition: new FormControl('0'),

      duck: new FormControl('0'),
      duckExposureMethodSlaughter: new FormControl('0'),
      duckExposureMethodEquip: new FormControl('0'),
      duckExposureMethodExistence: new FormControl('0'),
      duckExposureMethodHunt: new FormControl('0'),
      duckHomePlaceExposure: new FormControl('0'),
      duckMarketPlaceExposure: new FormControl('0'),
      duckShopPlaceExposure: new FormControl('0'),
      duckFarmPlaceExposure: new FormControl('0'),
      duckGoodAnimalCondition: new FormControl('0'),
      duckSickAnimalCondition: new FormControl('0'),
      duckCantAnimalCondition: new FormControl('0'),

      geese: new FormControl('0'),
      geeseExposureMethodSlaughter: new FormControl('0'),
      geeseExposureMethodEquip: new FormControl('0'),
      geeseExposureMethodExistence: new FormControl('0'),
      geeseExposureMethodHunt: new FormControl('0'),
      geeseHomePlaceExposure: new FormControl('0'),
      geeseMarketPlaceExposure: new FormControl('0'),
      geeseShopPlaceExposure: new FormControl('0'),
      geeseFarmPlaceExposure: new FormControl('0'),
      geeseGoodAnimalCondition: new FormControl('0'),
      geeseSickAnimalCondition: new FormControl('0'),
      geeseCantAnimalCondition: new FormControl('0'),

      rummy: new FormControl('0'),
      rummyExposureMethodSlaughter: new FormControl('0'),
      rummyExposureMethodEquip: new FormControl('0'),
      rummyExposureMethodExistence: new FormControl('0'),
      rummyExposureMethodHunt: new FormControl('0'),
      rummyHomePlaceExposure: new FormControl('0'),
      rummyMarketPlaceExposure: new FormControl('0'),
      rummyShopPlaceExposure: new FormControl('0'),
      rummyFarmPlaceExposure: new FormControl('0'),
      rummyGoodAnimalCondition: new FormControl('0'),
      rummySickAnimalCondition: new FormControl('0'),
      rummyCantAnimalCondition: new FormControl('0'),

      pigeon: new FormControl('0'),
      pigeonExposureMethodSlaughter: new FormControl('0'),
      pigeonExposureMethodEquip: new FormControl('0'),
      pigeonExposureMethodExistence: new FormControl('0'),
      pigeonExposureMethodHunt: new FormControl('0'),
      pigeonHomePlaceExposure: new FormControl('0'),
      pigeonMarketPlaceExposure: new FormControl('0'),
      pigeonShopPlaceExposure: new FormControl('0'),
      pigeonFarmPlaceExposure: new FormControl('0'),
      pigeonGoodAnimalCondition: new FormControl('0'),
      pigeonSickAnimalCondition: new FormControl('0'),
      pigeonCantAnimalCondition: new FormControl('0'),

      quail: new FormControl('0'),
      quailExposureMethodSlaughter: new FormControl('0'),
      quailExposureMethodEquip: new FormControl('0'),
      quailExposureMethodExistence: new FormControl('0'),
      quailExposureMethodHunt: new FormControl('0'),
      quailHomePlaceExposure: new FormControl('0'),
      quailMarketPlaceExposure: new FormControl('0'),
      quailShopPlaceExposure: new FormControl('0'),
      quailFarmPlaceExposure: new FormControl('0'),
      quailGoodAnimalCondition: new FormControl('0'),
      quailSickAnimalCondition: new FormControl('0'),
      quailCantAnimalCondition: new FormControl('0'),

      migratoryBird: new FormControl('0'),
      migratoryBirdsExposureMethodSlaughter: new FormControl('0'),
      migratoryBirdsExposureMethodEquip: new FormControl('0'),
      migratoryBirdsExposureMethodExistence: new FormControl('0'),
      migratoryBirdsExposureMethodHunt: new FormControl('0'),
      migratoryBirdsHomePlaceExposure: new FormControl('0'),
      migratoryBirdsMarketPlaceExposure: new FormControl('0'),
      migratoryBirdsShopPlaceExposure: new FormControl('0'),
      migratoryBirdsFarmPlaceExposure: new FormControl('0'),
      migratoryBirdsGoodAnimalCondition: new FormControl('0'),
      migratoryBirdsSickAnimalCondition: new FormControl('0'),
      migratoryBirdsCantAnimalCondition: new FormControl('0'),

      // inAnotherCase : new FormControl(null),
      occupationalExposureWorkplace: new FormControl(),
      workIsInFieldOfHealthServices: new FormControl(),
      exposureToAConfirmedCaseOfH5N1AvianInfluenza: new FormControl(),
      contactSevereRespiratorySymptoms: new FormControl(),
      patientInContactWithACaseThatDiedOfSevereRespiratoryDisease:
        new FormControl(),
      caseAmongAGroupOfOtherSimilarCases: new FormControl(),
      contactHumanGatherings: new FormControl(),
      investigationDate: new FormControl(),
      healthObserverName: new FormControl(),
      surveillanceOfficerName: new FormControl(),
      administrationDirectorName: new FormControl(),
      id: new FormControl(),
      diseaseGroupId: new FormControl(this.diseaseGroupID),
      fieldOfWorkBirdsAnimals: new FormControl(),
    });
    this.setupExposureCheckboxNormalization();
    this.normalizeExposureCheckboxValues();
    this.birdFluForm.controls['completePercentage'].disable();
    this.controlsCount = this.calculateCompletePercentage();
  }

  ngOnInit() {
    this.birdFluForm.controls['completePercentage'].setValue(
      this.controlsCount
    );
    this.birdFluForm.valueChanges.subscribe(() => {
      this.controlsCount = this.calculateCompletePercentage();
    });
    if (this.currentId != null) {
      this.getById();
    }
    else {
      this.router.navigateByUrl("/home/investigations");
    }
    // this.currentId=this.InvestigationService.currentid
  }

  getById() {

    this.investigationService.getById(this.currentId, this.diseaseGroupID).subscribe(
      (res) => {
        console.log(res);
        var v = res.data;

        this.birdFluForm.patchValue(v);
        this.normalizeExposureCheckboxValues();

        this.birdFluForm.controls['dateOfDiagnosisOfPneumonia'].setValue(
          this.datePipe.transform(
            this.birdFluForm.value.dateOfDiagnosisOfPneumonia,
            this.DATE_FORMAT
          )
        );
        this.birdFluForm.controls['dateOfReservation'].setValue(
          this.datePipe.transform(
            this.birdFluForm.value.dateOfReservation,
            this.DATE_FORMAT
          )
        );
        this.birdFluForm.controls['dateOfTakingOseltamivir'].setValue(
          this.datePipe.transform(
            this.birdFluForm.value.dateOfTakingOseltamivir,
            this.DATE_FORMAT
          )
        );
        this.birdFluForm.controls['dateOfTraveloutside'].setValue(
          this.datePipe.transform(
            this.birdFluForm.value.dateOfTraveloutside,
            this.DATE_FORMAT
          )
        );
        this.birdFluForm.controls['dateOfTraveloutsideTo'].setValue(
          this.datePipe.transform(
            this.birdFluForm.value.dateOfTraveloutsideTo,
            this.DATE_FORMAT
          )
        );
        this.birdFluForm.controls['dateOfTraveloutside2'].setValue(
          this.datePipe.transform(
            this.birdFluForm.value.dateOfTraveloutside2,
            this.DATE_FORMAT
          )
        );
        this.birdFluForm.controls['dateOfTraveloutsideTo2'].setValue(
          this.datePipe.transform(
            this.birdFluForm.value.dateOfTraveloutsideTo2,
            this.DATE_FORMAT
          )
        );
        this.birdFluForm.controls['dateOfTravelInside'].setValue(
          this.datePipe.transform(
            this.birdFluForm.value.dateOfTravelInside,
            this.DATE_FORMAT
          )
        );
        this.birdFluForm.controls['dateOfTravelInsideTo'].setValue(
          this.datePipe.transform(
            this.birdFluForm.value.dateOfTravelInsideTo,
            this.DATE_FORMAT
          )
        );
        this.birdFluForm.controls['dateOfTravelInside2'].setValue(
          this.datePipe.transform(
            this.birdFluForm.value.dateOfTravelInside2,
            this.DATE_FORMAT
          )
        );
        this.birdFluForm.controls['dateOfTravelInsideTo2'].setValue(
          this.datePipe.transform(
            this.birdFluForm.value.dateOfTravelInsideTo2,
            this.DATE_FORMAT
          )
        );
        this.birdFluForm.controls['dateOfTravelInside3'].setValue(
          this.datePipe.transform(
            this.birdFluForm.value.dateOfTravelInside3,
            this.DATE_FORMAT
          )
        );
        this.birdFluForm.controls['dateOfTravelInsideTo3'].setValue(
          this.datePipe.transform(
            this.birdFluForm.value.dateOfTravelInsideTo3,
            this.DATE_FORMAT
          )
        );
        this.birdFluForm.controls['arrivalDateToEgypt'].setValue(
          this.datePipe.transform(
            this.birdFluForm.value.arrivalDateToEgypt,
            this.DATE_FORMAT
          )
        );
        //this.birdFluForm.controls['dateOfVisit'].setValue(
        //  this.datePipe.transform(
        //    this.birdFluForm.value.dateOfVisit,
        //    this.DATE_FORMAT
        //  )
        //);
        //this.birdFluForm.controls['dateOfEntry'].setValue(
        //  this.datePipe.transform(
        //    this.birdFluForm.value.dateOfEntry,
        //    this.DATE_FORMAT
        //  )
        //);
        //this.birdFluForm.controls['exitDate'].setValue(
        //  this.datePipe.transform(this.birdFluForm.value.exitDate, this.DATE_FORMAT)
        //);
        this.birdFluForm.controls['investigationDate'].setValue(
          this.datePipe.transform(
            this.birdFluForm.value.investigationDate,
            this.DATE_FORMAT
          )
        );
        this.birdFluForm.controls['statusHistoryOnDevice'].setValue(
          this.datePipe.transform(
            this.birdFluForm.value.statusHistoryOnDevice,
            this.DATE_FORMAT
          )
        );
        this.syncPatientVisitHistoryFromApi(v);

        this.controlsCount = this.calculateCompletePercentage();
        this.birdFluForm.value.completePercentage = this.controlsCount;


        Object.entries(this.birdFluForm.controls).map(
          ([key, value], index) => {
            if (value.value == 'null')
              value.setValue(null);
          });

        this.controlsCount = this.calculateCompletePercentage();
        this.birdFluForm.value.completePercentage = this.controlsCount;

      },
      (err) => console.log(err)
    );
  }

  /**
   * Calculate the percentage
   * @returns
   */
  calculateCompletePercentage(): number {
    const excludedFields = this.getCompletionExcludedFields();

    const stats = calculateCompletionStats(this.birdFluForm.value, {
      excludedFields,
      formArrays: [
        { value: this.patientVisitHistory, excludedFields: ['id'] }
      ]
    });

    const anyProtectiveChecked = this.protectiveEquipmentCheckboxes
      .some(f => this.birdFluForm.get(f)?.value === true);
    const totalFields = stats.totalFields + 1;
    const filledFields = stats.filledFields + (anyProtectiveChecked ? 1 : 0);
    const percentage = totalFields > 0 ? (filledFields / totalFields) * 100 : 0;

    this.allControllesCount = totalFields;
    this.allFilledControlsCount = filledFields;
    this.controlsCount = parseFloat(percentage.toFixed(2));
    this.birdFluForm.get('completePercentage')?.setValue(this.controlsCount, { emitEvent: false });
    return this.controlsCount;
  }
  save() {
    if (this.isSaving) {
      return;
    }

    this.controlsCount = this.calculateCompletePercentage();
    let willSend = false;
    Object.entries(this.birdFluForm.controls).map(([key, value], index) => {
      if (value.value == 'null')
        value.setValue(null);
      if (value.value != null)
        willSend = true;
    });
    if (!willSend) {
      // alert("برجاء مليء الحقول");
      this.router.navigateByUrl('/home/investigations')
    }

    /*
        for (let i = 0; i < Object.values(this.birdFluForm.value).length; i++) {
          if (i > 1 && Object.values(this.birdFluForm.value)[i] == null) {
            // alert("برجاء ملىء حقول المواقع المختارة");
            return;
          }
        } */

    this.birdFluForm.controls['completePercentage'].enable();
    this.birdFluForm.controls['diseaseGroupId'].setValue(
      this.diseaseGroupID
    );
    const payload = this.buildSavePayload();
    this.isSaving = true;
    if (payload.id != null) {
      console.log(payload);
      this.investigationService.update(payload).subscribe(
        (res) => {
          this.isSaving = false;
          this.birdFluForm.controls['completePercentage'].disable();
          document.getElementById("jump_to_this_location").scrollIntoView({ behavior: 'smooth' });

          this.controlsCount = this.calculateCompletePercentage();
          this.birdFluForm.value.completePercentage = this.controlsCount;
          this.translateService
            .get('NEDSS.COMMON.SENT_SUCESSFULLY')
            .subscribe((res: string) => {
              this.userMsg.success(res);
            });

        },
        (err) => {
          this.isSaving = false;
          this.logSaveError(err);
        }
      );
    } else {
      console.log(payload);
      this.investigationService
        .addInvestigation(payload)
        .subscribe(
          (res) => {
            this.isSaving = false;
            this.birdFluForm.controls['completePercentage'].disable();
            document.getElementById("jump_to_this_location").scrollIntoView({ behavior: 'smooth' });

            this.birdFluForm.value.id = res.data.id;
            this.currentId = res.data.patientID;
            this.getById();
            this.controlsCount = this.calculateCompletePercentage();
            this.birdFluForm.value.completePercentage = this.controlsCount;
            this.translateService
              .get('NEDSS.COMMON.SENT_SUCESSFULLY')
              .subscribe((res: string) => {
                this.userMsg.success(res);
              });
          },
          (err) => {
            this.isSaving = false;
            this.logSaveError(err);
          }
        );
    }
  }
}
