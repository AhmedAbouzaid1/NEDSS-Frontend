import { AnswerOptions } from './../../../../../core/constants';
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
  private readonly summaryMetaFields = ['id', 'patientID', 'completePercentage', 'diseaseGroupId', 'createdDate'];
  private readonly datePayloadFields = new Set([
    'dateOfDiagnosisOfPneumonia',
    'dateOfReservation',
    'statusHistoryOnDevice',
    'dateOfTraveloutside',
    'dateOfTravelInside',
    'theStartDateOfTheDeath',
    'investigationDate',
    'treatmentStartDate1',
    'treatmentStartDate2',
    'treatmentStartDate3',
    'treatmentStartDate4',
    'treatmentStartDate5',
    'treatmentStartDate6'
  ]);
  private readonly stringPayloadFields = new Set([
    'nameOfCountry',
    'governorate',
    'protectiveEquipmentDetails',
    'stateFollowingCaseName',
    'relativeRelation',
    'address',
    'otherExposure',
    'anotherWallsCase',
    'anotherRoofsCase',
    'environmentalFactorsComments',
    'whoIsPerson',
    'placeImmunization',
    'otherAnimal',
    'healthObserverName',
    'surveillanceOfficerName',
    'administrationDirectorName',
    'typeOfTreatment1',
    'dose1',
    'typeOfTreatment2',
    'dose2',
    'typeOfTreatment3',
    'dose3',
    'typeOfTreatment4',
    'dose4',
    'typeOfTreatment5',
    'dose5',
    'typeOfTreatment6',
    'dose6'
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
  private readonly explicitExposureCheckboxFields = ['otherEquipMethodSlaughter'];

  currentLang =
    localStorage.getItem('ls.currentLang') !== undefined &&
      localStorage.getItem('ls.currentLang') !== 'undefined'
      ? localStorage.getItem('ls.currentLang')
      : 'ar';
  birdFluForm: FormGroup;
  answerOptions = AnswerOptions;
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
        dateVisit: this.datePipe.transform(item?.dateVisit, 'yyyy-MM-dd') ?? null,
        initialDiagnosis: item?.initialDiagnosis ?? null,
        admissionHospital: item?.admissionHospital ?? null,
        dateEntry: this.datePipe.transform(item?.dateEntry, 'yyyy-MM-dd') ?? null,
        exitDate: this.datePipe.transform(item?.exitDate, 'yyyy-MM-dd') ?? null,
      }));
    });
  }

  private syncDataContactsFromApi(data: any): void {
    const apiContacts = data?.DataContactsAvianInfluenzas ?? data?.dataContactsAvianInfluenzas;

    while (this.employees().length > 0) {
      this.employees().removeAt(0);
    }

    if (!Array.isArray(apiContacts) || apiContacts.length === 0) {
      return;
    }

    apiContacts.forEach((item: any) => {
      this.employees().push(this.formBuilder.group({
        id: item?.id ?? null,
        birdFluID: item?.birdFluID ?? null,
        name: item?.name ?? '',
        type: item?.type ?? '',
        age: item?.age ?? '',
        address: item?.address ?? '',
        phoneNumber: item?.phoneNumber ?? '',
        mixingType: item?.mixingType ?? '',
        dateLastContact: this.datePipe.transform(item?.dateLastContact, 'yyyy-MM-dd') ?? '',
        fluSymptoms: item?.fluSymptoms ?? '',
        dateSymptoms: this.datePipe.transform(item?.dateSymptoms, 'yyyy-MM-dd') ?? '',
      }));
    });
  }

  private getFlatVisitFieldNames(): string[] {
    return Array.from({ length: 5 }, (_, index) => index + 1)
      .flatMap((visitIndex) => this.visitFieldBases.map((field) => `${field}${visitIndex}`));
  }

  private getCompletionExcludedFields(): string[] {
    const exactFields = [
      ...this.summaryMetaFields,
      ...this.getFlatVisitFieldNames()
    ];

    return exactFields;
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

  private normalizeContactPayload(contact: any): any {
    const normalizedPhoneNumber = this.normalizeNullishValue(contact?.phoneNumber);

    return {
      ...contact,
      id: this.normalizeNumericValue(contact?.id),
      birdFluID: this.normalizeNumericValue(contact?.birdFluID),
      name: this.normalizeNullishValue(contact?.name),
      type: this.normalizeNumericValue(contact?.type),
      age: this.normalizeNumericValue(contact?.age),
      address: this.normalizeNullishValue(contact?.address),
      phoneNumber: normalizedPhoneNumber == null ? null : String(normalizedPhoneNumber),
      mixingType: this.normalizeNumericValue(contact?.mixingType),
      dateLastContact: this.normalizeNullishValue(contact?.dateLastContact),
      fluSymptoms: this.normalizeNumericValue(contact?.fluSymptoms),
      dateSymptoms: this.normalizeNullishValue(contact?.dateSymptoms)
    };
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

      if (key === 'dataContactsAvianInfluenza') {
        payload.DataContactsAvianInfluenzas = Array.isArray(payload[key])
          ? payload[key].map((item: any) => this.normalizeContactPayload(item))
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
      diagnosisOfPneumonia: new FormControl(),
      dateOfDiagnosisOfPneumonia: new FormControl(),
      diagnosisWasMade: new FormControl(),
      pneumonia: new FormControl(),
      reservationintheintensiveCareUnit: new FormControl(),
      dateOfReservation: new FormControl(),
      numberOfDaysOfCustody: new FormControl(),
      oxygenUse: new FormControl(),
      maskType: new FormControl(),
      useOfARespirator: new FormControl(),
      useOfARespiratorIsTrue: new FormControl(),
      statusHistoryOnDevice: new FormControl(),
      numberOfDaysOfPlacementOnDevice: new FormControl(),
      conditionAssessment: new FormControl(),
      patientVisitHistory: this.formBuilder.array([]),
      travelingOutsideEgypt: new FormControl(),
      nameOfCountry: new FormControl(),
      dateOfTraveloutside: new FormControl(),
      travelingwithinEgypt: new FormControl(),
      governorate: new FormControl(),
      dateOfTravelInside: new FormControl(),
      usedProtectiveEquipmentWithBirds: new FormControl(),
      protectiveEquipmentDetails: new FormControl(),
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

      otherAnimal: new FormControl(),
      otherExposureMethodEquip: new FormControl('0'),
      otherEquipMethodSlaughter: new FormControl('0'),
      otherExposureMethodExistence: new FormControl('0'),
      otherExposureMethodHunt: new FormControl('0'),
      otherHomePlaceExposure: new FormControl('0'),
      otherMarketPlaceExposure: new FormControl('0'),
      otherShopPlaceExposure: new FormControl('0'),
      otherFarmPlaceExposure: new FormControl('0'),
      otherGoodAnimalCondition: new FormControl('0'),
      otherSickAnimalCondition: new FormControl('0'),
      otherCantAnimalCondition: new FormControl('0'),

      // inAnotherCase : new FormControl(null),
      workIsInFieldOfHealthServices: new FormControl(),
      exposureToAConfirmedCaseOfH5N1AvianInfluenza: new FormControl(),
      patientInContactWithACaseThatDiedOfSevereRespiratoryDisease:
        new FormControl(),
      stateFollowingCaseName: new FormControl(),
      relativeRelation: new FormControl(),
      address: new FormControl(),
      caseAmongAGroupOfOtherSimilarCases: new FormControl(),
      groupLocated: new FormControl(),
      otherExposure: new FormControl(),
      descriptionProperty: new FormControl(),
      walls: new FormControl(),
      anotherWallsCase: new FormControl(),
      roof: new FormControl(),
      anotherRoofsCase: new FormControl(),
      birdskeptAtHome: new FormControl(),
      placeWhereBirdsAreRaisedInHouse: new FormControl(),
      specificationsPlaceEducation: new FormControl(),
      environmentalFactorsComments: new FormControl(),
      chickensCountHistory: new FormControl(),
      chickensStatusHistory: new FormControl(),
      duckCountHistory: new FormControl(),
      duckStatusHistory: new FormControl(),
      geesesCountHistory: new FormControl(),
      geeseStatusHistory: new FormControl(),
      rummyCountHistory: new FormControl(),
      rummytatusHistory: new FormControl(),
      bathroomCountHistory: new FormControl(),
      bathroomStatusHistory: new FormControl(),
      quailCountHistory: new FormControl(),
      quailStatusHistory: new FormControl(),
      otherCountHistory: new FormControl(),
      otherStatusHistory: new FormControl(),
      thereABirdMortality: new FormControl(),
      deadBirdsCount: new FormControl(),
      theStartDateOfTheDeath: new FormControl(),
      samplesVet: new FormControl(),
      disposalDeadBirds: new FormControl(),
      otherDeadBirds: new FormControl(),
      thereASpecificPersonWhoTakesCareBirds: new FormControl(),
      whoIsPerson: new FormControl(),
      birdsVaccinated: new FormControl(),
      placeImmunization: new FormControl(),
      thereSlaughteredBirdsInHomeRefrigerator: new FormControl(),
      numberHomesVisite: new FormControl(),
      numberHousesWithBirds: new FormControl(),
      ratioBirds: new FormControl(),
      numberHousesWithDeadBirds: new FormControl(),
      ratioDeadBirds: new FormControl(),
      investigationDate: new FormControl(),
      healthObserverName: new FormControl(),
      surveillanceOfficerName: new FormControl(),
      administrationDirectorName: new FormControl(),
      id: new FormControl(),
      diseaseGroupId: new FormControl(this.diseaseGroupID),
      dataContactsAvianInfluenza: this.formBuilder.array([]),
      typeOfTreatment1: new FormControl(),
      treatmentStartDate1: new FormControl(),
      dose1: new FormControl(),
      typeOfTreatment2: new FormControl(),
      treatmentStartDate2: new FormControl(),
      dose2: new FormControl(),
      typeOfTreatment3: new FormControl(),
      treatmentStartDate3: new FormControl(),
      dose3: new FormControl(),
      typeOfTreatment4: new FormControl(),
      treatmentStartDate4: new FormControl(),
      dose4: new FormControl(),
      typeOfTreatment5: new FormControl(),
      treatmentStartDate5: new FormControl(),
      dose5: new FormControl(),
      typeOfTreatment6: new FormControl(),
      treatmentStartDate6: new FormControl(),
      dose6: new FormControl(),
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
        this.syncDataContactsFromApi(v);

        this.birdFluForm.controls['dateOfDiagnosisOfPneumonia'].setValue(
          this.datePipe.transform(
            this.birdFluForm.value.dateOfDiagnosisOfPneumonia,
            'yyyy-MM-dd'
          )
        );
        this.birdFluForm.controls['dateOfReservation'].setValue(
          this.datePipe.transform(
            this.birdFluForm.value.dateOfReservation,
            'yyyy-MM-dd'
          )
        );
        this.birdFluForm.controls['dateOfTraveloutside'].setValue(
          this.datePipe.transform(
            this.birdFluForm.value.dateOfTraveloutside,
            'yyyy-MM-dd'
          )
        );
        this.birdFluForm.controls['dateOfTravelInside'].setValue(
          this.datePipe.transform(
            this.birdFluForm.value.dateOfTravelInside,
            'yyyy-MM-dd'
          )
        );
        this.birdFluForm.controls['theStartDateOfTheDeath'].setValue(
          this.datePipe.transform(
            this.birdFluForm.value.theStartDateOfTheDeath,
            'yyyy-MM-dd'
          )
        );
        //this.birdFluForm.controls['dateOfVisit'].setValue(
        //  this.datePipe.transform(
        //    this.birdFluForm.value.dateOfVisit,
        //    'yyyy-MM-dd'
        //  )
        //);
        //this.birdFluForm.controls['dateOfEntry'].setValue(
        //  this.datePipe.transform(
        //    this.birdFluForm.value.dateOfEntry,
        //    'yyyy-MM-dd'
        //  )
        //);
        //this.birdFluForm.controls['exitDate'].setValue(
        //  this.datePipe.transform(this.birdFluForm.value.exitDate, 'yyyy-MM-dd')
        //);
        this.birdFluForm.controls['treatmentStartDate1'].setValue(
          this.datePipe.transform(
            this.birdFluForm.value.treatmentStartDate1,
            'yyyy-MM-dd'
          )
        );
        this.birdFluForm.controls['treatmentStartDate2'].setValue(
          this.datePipe.transform(
            this.birdFluForm.value.treatmentStartDate2,
            'yyyy-MM-dd'
          )
        );
        this.birdFluForm.controls['treatmentStartDate3'].setValue(
          this.datePipe.transform(
            this.birdFluForm.value.treatmentStartDate3,
            'yyyy-MM-dd'
          )
        );
        this.birdFluForm.controls['treatmentStartDate4'].setValue(
          this.datePipe.transform(
            this.birdFluForm.value.treatmentStartDate4,
            'yyyy-MM-dd'
          )
        );
        this.birdFluForm.controls['treatmentStartDate5'].setValue(
          this.datePipe.transform(
            this.birdFluForm.value.treatmentStartDate5,
            'yyyy-MM-dd'
          )
        );
        this.birdFluForm.controls['treatmentStartDate6'].setValue(
          this.datePipe.transform(
            this.birdFluForm.value.treatmentStartDate6,
            'yyyy-MM-dd'
          )
        );

        this.birdFluForm.controls['investigationDate'].setValue(
          this.datePipe.transform(
            this.birdFluForm.value.investigationDate,
            'yyyy-MM-dd'
          )
        );
        this.birdFluForm.controls['statusHistoryOnDevice'].setValue(
          this.datePipe.transform(
            this.birdFluForm.value.statusHistoryOnDevice,
            'yyyy-MM-dd'
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
        { value: this.patientVisitHistory, excludedFields: ['id'] },
        { value: this.employees(), excludedFields: ['id', 'birdFluID'] }
      ]
    });

    this.allControllesCount = stats.totalFields;
    this.allFilledControlsCount = stats.filledFields;
    this.controlsCount = parseFloat(stats.percentage.toFixed(2));
    this.birdFluForm.get('completePercentage')?.setValue(this.controlsCount, { emitEvent: false });
    return this.controlsCount;
  }
  /**
   * Count all fields
   * @param control
   * @returns
   */
  employees(): FormArray {
    return this.birdFluForm.get('dataContactsAvianInfluenza') as FormArray;
  }

  newEmployee(): FormGroup {
    return this.formBuilder.group({
      id: null,
      birdFluID: null,
      name: '',
      type: '',
      age: '',
      address: '',
      phoneNumber: '',
      mixingType: '',
      dateLastContact: '',
      fluSymptoms: '',
      dateSymptoms: '',
    });
  }

  addEmployee() {
    console.log('Adding an employee');

    this.employees().push(this.newEmployee());
  }

  removeEmployee(empIndex: number) {
    this.employees().removeAt(empIndex);
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
