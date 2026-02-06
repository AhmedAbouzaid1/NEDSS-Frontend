import { AnswerOptions } from './../../../../../core/constants';
import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormArray, FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { InvestigationService } from '../../services/investigation.service';
import { InvestigationDetailesComponent } from '../../investigation-detailes/investigation-detailes.component';
import { ActivatedRoute, Router } from '@angular/router';
import { DatePipe } from '@angular/common';
import { UserMessageService } from 'src/app/core/services/user.message.service';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-h5n1',
  templateUrl: './h5n1.component.html',
  styleUrls: ['./h5n1.component.css'],
})
export class H5n1Component implements OnInit {
  currentLang =
    localStorage.getItem('ls.currentLang') !== undefined &&
      localStorage.getItem('ls.currentLang') !== 'undefined'
      ? localStorage.getItem('ls.currentLang')
      : 'ar';
  birdFluForm: FormGroup;
  answerOptions = AnswerOptions;

  healthFacilitiesData = [{}, {}, {}, {}, {}];
  treatmentAndDosingData = [{}, {}, {}, {}, {}, {}];
  newEmp: boolean;
  currentId: any;
  controlsCount: number = 0;
  allFilledControlsCount: number = 0;
  allControllesCount: number = 0;
  patientName: string;
  diseaseGroupID: any;
  constructor(
    private formBuilder: FormBuilder,
    private investigationService: InvestigationService,
    private route: ActivatedRoute,
    private router: Router,
    private translateService: TranslateService,
    private userMsg: UserMessageService,
    private datePipe: DatePipe
  ) {
    this.newEmployee();
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
      fever: new FormControl(2),
      feverDurationInDays: new FormControl(),
      maxTemp: new FormControl(),
      lossOfSenseOfSmellAndTaste: new FormControl(),
      coughingUpBlood: new FormControl(),
      chronicChestDiseases: new FormControl(),
      chronicHeartDisease: new FormControl(),
      onlyHighBloodPressure: new FormControl(),
      excessiveObesity: new FormControl(),
      immuneDisease: new FormControl(),
      aids: new FormControl(),
      pregnantWomen: new FormControl(),
      diabetes: new FormControl(),
      liverDiseases: new FormControl(),
      kidneyDisease: new FormControl(),
      diseasesOfTheNervous: new FormControl(),
      bloodDiseases: new FormControl(),
      remember: new FormControl(),
      onsetOfSymptoms: new FormControl(),
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
      healthFacilities: this.formBuilder.array([]),
      routineMonitoring: new FormControl(),
      followUpOfContacts: new FormControl(),
      medicalTeamIsTrue: new FormControl(),
      placeOfResidence: new FormControl(),
      contactWitAaSuspectedCase: new FormControl(),
      contactWithAConfirmedCase: new FormControl(),
      contactOfADeceasedPersonWithAnUnknownRespiratoryDisease:
        new FormControl(),
      theNumberOfDirectContacts: new FormControl(),
      theNumberOfInDirectContacts: new FormControl(),
      // public IEnumerable<Vaccination> Vaccinations : new FormControl(null),
      hasCoronaMusle: new FormControl(),
      numberOfDoses: new FormControl(),
      firstDoseDate: new FormControl(),
      firstDoseName: new FormControl(),
      secondDoseDate: new FormControl(),
      secondDoseName: new FormControl(),
      thirdDoseDate: new FormControl(),
      thirdDoseName: new FormControl(),
      fourthDoseDate: new FormControl(),
      fourthDoseName: new FormControl(),
      haveYouHadSeasonalFluVaccine: new FormControl(),
      seasonalFluVaccineDate: new FormControl(),
      hasPneumococcalVaccineBeenTaken: new FormControl(),
      pneumococcalVaccineBeenTakenStartDate: new FormControl(),
      followD1Name: new FormControl(),
      followD1Age: new FormControl(),
      followD1PhoneNumber: new FormControl(),
      followD1Gender: new FormControl(),
      followD1MixingType: new FormControl(),
      followD1Relationship: new FormControl(),
      followD1DateOfOnsetOfSymptoms: new FormControl(),
      followD1FeverSymptoms: new FormControl(),
      followD1DryCoughSymptoms: new FormControl(),
      followD1CoughingWithSpittingSymptoms: new FormControl(),
      followD1SoreThroatSymptoms: new FormControl(),
      followD1DifficultyBreathingSymptoms: new FormControl(),
      followD1JointPainSymptoms: new FormControl(),
      followD1VomitSymptoms: new FormControl(),
      followD1DiarrheaSymptoms: new FormControl(),
      followD1OtherSymptomsSelect: new FormControl(),
      followD1OtherSymptom: new FormControl(),
      followD1SampleTakenLab: new FormControl('2'),
      followD1DateSampleTaken: new FormControl(),
      followD1SampleResult: new FormControl('2'),
      followD2Name: new FormControl(),
      followD2Age: new FormControl(),
      followD2PhoneNumber: new FormControl(),
      followD2Gender: new FormControl(),
      followD2MixingType: new FormControl(),
      followD2Relationship: new FormControl(),
      followD2DateOfOnsetOfSymptoms: new FormControl(),
      followD2FeverSymptoms: new FormControl(),
      followD2DryCoughSymptoms: new FormControl(),
      followD2CoughingWithSpittingSymptoms: new FormControl(),
      followD2SoreThroatSymptoms: new FormControl(),
      followD2DifficultyBreathingSymptoms: new FormControl(),
      followD2JointPainSymptoms: new FormControl(),
      followD2VomitSymptoms: new FormControl(),
      followD2DiarrheaSymptoms: new FormControl(),
      followD2OtherSymptomsSelect: new FormControl(),
      followD2OtherSymptom: new FormControl(),
      followD2SampleTakenLab: new FormControl('2'),
      followD2DateSampleTaken: new FormControl(),
      followD2SampleResult: new FormControl('2'),
      followD7Name: new FormControl(),
      followD7Age: new FormControl(),
      followD7PhoneNumber: new FormControl(),
      followD7Gender: new FormControl(),
      followD7MixingType: new FormControl(),
      followD7Relationship: new FormControl(),
      followD7DateOfOnsetOfSymptoms: new FormControl(),
      followD7FeverSymptoms: new FormControl(),
      followD7DryCoughSymptoms: new FormControl(),
      followD7CoughingWithSpittingSymptoms: new FormControl(),
      followD7SoreThroatSymptoms: new FormControl(),
      followD7DifficultyBreathingSymptoms: new FormControl(),
      followD7JointPainSymptoms: new FormControl(),
      followD7VomitSymptoms: new FormControl(),
      followD7DiarrheaSymptoms: new FormControl(),
      followD7OtherSymptomsSelect: new FormControl(),
      followD7OtherSymptom: new FormControl(),
      followD7SampleTakenLab: new FormControl('2'),
      followD7DateSampleTaken: new FormControl(),
      followD7SampleResult: new FormControl('2'),
      followD14Name: new FormControl(),
      followD14Age: new FormControl(),
      followD14PhoneNumber: new FormControl(),
      followD14Gender: new FormControl(),
      followD14MixingType: new FormControl(),
      followD14Relationship: new FormControl(),
      followD14DateOfOnsetOfSymptoms: new FormControl(),
      followD14FeverSymptoms: new FormControl(),
      followD14DryCoughSymptoms: new FormControl(),
      followD14CoughingWithSpittingSymptoms: new FormControl(),
      followD14SoreThroatSymptoms: new FormControl(),
      followD14DifficultyBreathingSymptoms: new FormControl(),
      followD14JointPainSymptoms: new FormControl(),
      followD14VomitSymptoms: new FormControl(),
      followD14DiarrheaSymptoms: new FormControl(),
      followD14OtherSymptomsSelect: new FormControl(),
      followD14OtherSymptom: new FormControl(),
      followD14SampleTakenLab: new FormControl('2'),
      followD14DateSampleTaken: new FormControl(),
      followD14SampleResult: new FormControl('2'),
      treatmentAndDosing: this.formBuilder.array([]),
      travelingOutsideEgypt: new FormControl(),
      nameOfCountry: new FormControl(),
      dateOfTraveloutside: new FormControl(),
      returnDateoutside: new FormControl(),
      travelingwithinEgypt: new FormControl(),
      governorate: new FormControl(),
      dateOfTravelInside: new FormControl(),
      returnDateInside: new FormControl(),
      exposureToBirds: new FormControl(),
      caseDealingWithBirds: new FormControl(),
      exposureDataState: new FormControl(),

      chicken: new FormControl('1'),
      chickensExposureMethodSlaughter: new FormControl('0'),
      chickensExposureMethodEquip: new FormControl('0'),
      chickensExposureMethodExistence: new FormControl('0'),
      chickensExposureMethodHunt: new FormControl('0'),
      chickensHomePlaceExposure: new FormControl('0'),
      chickensMarketPlaceExposure: new FormControl('0'),
      chickensSlaughterhousePlaceExposure: new FormControl('0'),
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
      duckSlaughterhousePlaceExposure: new FormControl('0'),
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
      geeseSlaughterhousePlaceExposure: new FormControl('0'),
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
      rummySlaughterhousePlaceExposure: new FormControl('0'),
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
      pigeonSlaughterhousePlaceExposure: new FormControl('0'),
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
      quailSlaughterhousePlaceExposure: new FormControl('0'),
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
      migratoryBirdsSlaughterhousePlaceExposure: new FormControl('0'),
      migratoryBirdsShopPlaceExposure: new FormControl('0'),
      migratoryBirdsFarmPlaceExposure: new FormControl('0'),
      migratoryBirdsGoodAnimalCondition: new FormControl('0'),
      migratoryBirdsSickAnimalCondition: new FormControl('0'),
      migratoryBirdsCantAnimalCondition: new FormControl('0'),

      camel: new FormControl('0'),
      camelExposureMethodSlaughter: new FormControl('0'),
      camelExposureMethodEquip: new FormControl('0'),
      camelExposureMethodExistence: new FormControl('0'),
      camelExposureMethodHunt: new FormControl('0'),
      camelHomePlaceExposure: new FormControl('0'),
      camelMarketPlaceExposure: new FormControl('0'),
      camelSlaughterhousePlaceExposure: new FormControl('0'),
      camelShopPlaceExposure: new FormControl('0'),
      camelFarmPlaceExposure: new FormControl('0'),
      camelGoodAnimalCondition: new FormControl('0'),
      camelSickAnimalCondition: new FormControl('0'),
      camelCantAnimalCondition: new FormControl('0'),

      bats: new FormControl('0'),
      batsExposureMethodSlaughter: new FormControl('0'),
      batsExposureMethodEquip: new FormControl('0'),
      batsExposureMethodExistence: new FormControl('0'),
      batsExposureMethodHunt: new FormControl('0'),
      batsHomePlaceExposure: new FormControl('0'),
      batsMarketPlaceExposure: new FormControl('0'),
      batsSlaughterhousePlaceExposure: new FormControl('0'),
      batsShopPlaceExposure: new FormControl('0'),
      batsFarmPlaceExposure: new FormControl('0'),
      batsGoodAnimalCondition: new FormControl('0'),
      batsSickAnimalCondition: new FormControl('0'),
      batsCantAnimalCondition: new FormControl('0'),

      sheeps: new FormControl('0'),
      sheepsExposureMethodSlaughter: new FormControl('0'),
      sheepsExposureMethodEquip: new FormControl('0'),
      sheepsExposureMethodExistence: new FormControl('0'),
      sheepsExposureMethodHunt: new FormControl('0'),
      sheepsHomePlaceExposure: new FormControl('0'),
      sheepsMarketPlaceExposure: new FormControl('0'),
      sheepsSlaughterhousePlaceExposure: new FormControl('0'),
      sheepsShopPlaceExposure: new FormControl('0'),
      sheepsFarmPlaceExposure: new FormControl('0'),
      sheepsGoodAnimalCondition: new FormControl('0'),
      sheepsSickAnimalCondition: new FormControl('0'),
      sheepsCantAnimalCondition: new FormControl('0'),

      wildCat: new FormControl('0'),
      wildCatExposureMethodSlaughter: new FormControl('0'),
      wildCatExposureMethodEquip: new FormControl('0'),
      wildCatExposureMethodExistence: new FormControl('0'),
      wildCatExposureMethodHunt: new FormControl('0'),
      wildCatHomePlaceExposure: new FormControl('0'),
      wildCatMarketPlaceExposure: new FormControl('0'),
      wildCatSlaughterhousePlaceExposure: new FormControl('0'),
      wildCatShopPlaceExposure: new FormControl('0'),
      wildCatFarmPlaceExposure: new FormControl('0'),
      wildCatGoodAnimalCondition: new FormControl('0'),
      wildCatSickAnimalCondition: new FormControl('0'),
      wildCatCantAnimalCondition: new FormControl('0'),

      pig: new FormControl('0'),
      pigExposureMethodSlaughter: new FormControl('0'),
      pigExposureMethodEquip: new FormControl('0'),
      pigExposureMethodExistence: new FormControl('0'),
      pigExposureMethodHunt: new FormControl('0'),
      pigHomePlaceExposure: new FormControl('0'),
      pigMarketPlaceExposure: new FormControl('0'),
      pigSlaughterhousePlaceExposure: new FormControl('0'),
      pigShopPlaceExposure: new FormControl('0'),
      pigFarmPlaceExposure: new FormControl('0'),
      pigGoodAnimalCondition: new FormControl('0'),
      pigSickAnimalCondition: new FormControl('0'),
      pigCantAnimalCondition: new FormControl('0'),

      otherAnimal: new FormControl(),
      otherExposureMethodEquip: new FormControl('0'),
      otherEquipMethodSlaughter: new FormControl('0'),
      otherExposureMethodExistence: new FormControl('0'),
      otherExposureMethodHunt: new FormControl('0'),
      otherHomePlaceExposure: new FormControl('0'),
      otherMarketPlaceExposure: new FormControl('0'),
      otherSlaughterhousePlaceExposure: new FormControl('0'),
      otherShopPlaceExposure: new FormControl('0'),
      otherFarmPlaceExposure: new FormControl('0'),
      otherGoodAnimalCondition: new FormControl('0'),
      otherSickAnimalCondition: new FormControl('0'),
      otherCantAnimalCondition: new FormControl('0'),

      // inAnotherCase : new FormControl(null),
      fieldOfWorkHumanCasesOrSamples: new FormControl(),
      workIsInFieldOfHealthServices: new FormControl(),
      exposureToAConfirmedCaseOfH5N1AvianInfluenza: new FormControl(),
      patientinContactWithAConfirmedCaseOfSevereRespiratoryDisease:
        new FormControl(),
      patientInContactWithACaseThatDiedOfSevereRespiratoryDisease:
        new FormControl(),
      stateFollowingCaseName: new FormControl(),
      relativeRelation: new FormControl(),
      address: new FormControl(),
      caseAmongAGroupOfOtherSimilarCases: new FormControl(),
      groupLocated: new FormControl(),
      otherExposure: new FormControl(),
      descriptionProperty: new FormControl(),
      anotherEnvironmentalFactors: new FormControl(),
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
      id: new FormControl(),
      diseaseGroupId: new FormControl(this.diseaseGroupID),
      dataContactsAvianInfluenza: this.formBuilder.array([]),
      healthCareFacilityName1: new FormControl(),
      healthUnitBelongs1: new FormControl(),
      dateVisit1: new FormControl(),
      initialdiagnosis1: new FormControl(),
      hospitalization1: new FormControl(),
      entryDate1: new FormControl(),
      exitDate1: new FormControl(),
      healthCareFacilityName2: new FormControl(),
      healthUnitBelongs2: new FormControl(),
      dateVisit2: new FormControl(),
      initialdiagnosis2: new FormControl(),
      hospitalization2: new FormControl(),
      entryDate2: new FormControl(),
      exitDate2: new FormControl(),
      healthCareFacilityName3: new FormControl(),
      healthUnitBelongs3: new FormControl(),
      dateVisit3: new FormControl(),
      initialdiagnosis3: new FormControl(),
      hospitalization3: new FormControl(),
      entryDate3: new FormControl(),
      exitDate3: new FormControl(),
      healthCareFacilityName4: new FormControl(),
      healthUnitBelongs4: new FormControl(),
      dateVisit4: new FormControl(),
      initialdiagnosis4: new FormControl(),
      hospitalization4: new FormControl(),
      entryDate4: new FormControl(),
      exitDate4: new FormControl(),
      healthCareFacilityName5: new FormControl(),
      healthUnitBelongs5: new FormControl(),
      dateVisit5: new FormControl(),
      initialdiagnosis5: new FormControl(),
      hospitalization5: new FormControl(),
      entryDate5: new FormControl(),
      exitDate5: new FormControl(),
      notes: new FormControl(),
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
      inAnotherCase: new FormControl(),
    });
    this.buildForm();
    this.birdFluForm.controls['completePercentage'].disable();
    this.controlsCount = this.calculateCompletePercentage();
  }

  ngOnInit() {
    this.birdFluForm.controls['completePercentage'].setValue(
      this.controlsCount
    );
    if (this.currentId != null) {
      this.getById();
    }
    else {
      this.router.navigateByUrl("/home/investigations");
    }
    // this.currentId=this.InvestigationService.currentid
  }

  getById() {

    this.investigationService.getById(this.currentId).subscribe(
      (res) => {
        console.log(res);
        var v = res.data;

        if (v.followD1SampleTakenLab == null) {
          v.followD1SampleTakenLab = 2;
        }
        if (v.followD2SampleTakenLab == null) {
          v.followD2SampleTakenLab = 2;
        }
        if (v.followD7SampleTakenLab == null) {
          v.followD7SampleTakenLab = 2;
        }
        if (v.followD14SampleTakenLab == null) {
          v.followD14SampleTakenLab = 2;
        }
        if (v.followD1SampleResult == null) {
          v.followD1SampleResult = 2;
        }
        if (v.followD2SampleResult == null) {
          v.followD2SampleResult = 2;
        }
        if (v.followD7SampleResult == null) {
          v.followD7SampleResult = 2;
        }
        if (v.followD14SampleResult == null) {
          v.followD14SampleResult = 2;
        }
        if (v.fever == null) {
          v.fever = 2;
        }
        // this.birdFluForm.patchValue(v);
        this.birdFluForm.patchValue(v);
        this.birdFluForm.patchValue({
          fever: this.birdFluForm.value.fever + '',
          tc: true,
        });
        this.birdFluForm.patchValue({
          followD1SampleTakenLab:
            this.birdFluForm.value.followD1SampleTakenLab + '',
          tc: true,
        });
        this.birdFluForm.patchValue({
          followD2SampleTakenLab:
            this.birdFluForm.value.followD2SampleTakenLab + '',
          tc: true,
        });
        this.birdFluForm.patchValue({
          followD7SampleTakenLab:
            this.birdFluForm.value.followD7SampleTakenLab + '',
          tc: true,
        });
        this.birdFluForm.patchValue({
          followD14SampleTakenLab:
            this.birdFluForm.value.followD14SampleTakenLab + '',
          tc: true,
        });
        this.birdFluForm.patchValue({
          followD1SampleResult:
            this.birdFluForm.value.followD1SampleResult + '',
          tc: true,
        });
        this.birdFluForm.patchValue({
          followD2SampleResult:
            this.birdFluForm.value.followD2SampleResult + '',
          tc: true,
        });
        this.birdFluForm.patchValue({
          followD7SampleResult:
            this.birdFluForm.value.followD7SampleResult + '',
          tc: true,
        });
        this.birdFluForm.patchValue({
          followD14SampleResult:
            this.birdFluForm.value.followD14SampleResult + '',
          tc: true,
        });

        this.birdFluForm.controls['onsetOfSymptoms'].setValue(
          this.datePipe.transform(
            this.birdFluForm.value.onsetOfSymptoms,
            'yyyy-MM-dd'
          )
        );
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

        this.birdFluForm.controls['firstDoseDate'].setValue(
          this.datePipe.transform(
            this.birdFluForm.value.firstDoseName,
            'yyyy-MM-dd'
          )
        );
        this.birdFluForm.controls['secondDoseDate'].setValue(
          this.datePipe.transform(
            this.birdFluForm.value.secondDoseDate,
            'yyyy-MM-dd'
          )
        );
        this.birdFluForm.controls['thirdDoseDate'].setValue(
          this.datePipe.transform(
            this.birdFluForm.value.thirdDoseDate,
            'yyyy-MM-dd'
          )
        );
        this.birdFluForm.controls['fourthDoseDate'].setValue(
          this.datePipe.transform(
            this.birdFluForm.value.fourthDoseDate,
            'yyyy-MM-dd'
          )
        );
        this.birdFluForm.controls['seasonalFluVaccineDate'].setValue(
          this.datePipe.transform(
            this.birdFluForm.value.seasonalFluVaccineDate,
            'yyyy-MM-dd'
          )
        );
        this.birdFluForm.controls[
          'pneumococcalVaccineBeenTakenStartDate'
        ].setValue(
          this.datePipe.transform(
            this.birdFluForm.value.pneumococcalVaccineBeenTakenStartDate,
            'yyyy-MM-dd'
          )
        );
        this.birdFluForm.controls['followD1DateOfOnsetOfSymptoms'].setValue(
          this.datePipe.transform(
            this.birdFluForm.value.followD1DateOfOnsetOfSymptoms,
            'yyyy-MM-dd'
          )
        );
        this.birdFluForm.controls['followD2DateOfOnsetOfSymptoms'].setValue(
          this.datePipe.transform(
            this.birdFluForm.value.followD2DateOfOnsetOfSymptoms,
            'yyyy-MM-dd'
          )
        );
        //this.birdFluForm.controls['followD4DateOfOnsetOfSymptoms'].setValue(
        //  this.datePipe.transform(
        //    this.birdFluForm.value.followD4DateOfOnsetOfSymptoms,
        //    'yyyy-MM-dd'
        //  )
        //);
        this.birdFluForm.controls['followD14DateOfOnsetOfSymptoms'].setValue(
          this.datePipe.transform(
            this.birdFluForm.value.followD14DateOfOnsetOfSymptoms,
            'yyyy-MM-dd'
          )
        );
        this.birdFluForm.controls['followD1DateSampleTaken'].setValue(
          this.datePipe.transform(
            this.birdFluForm.value.followD1DateSampleTaken,
            'yyyy-MM-dd'
          )
        );
        this.birdFluForm.controls['followD2DateSampleTaken'].setValue(
          this.datePipe.transform(
            this.birdFluForm.value.followD2DateSampleTaken,
            'yyyy-MM-dd'
          )
        );
        this.birdFluForm.controls['followD7DateSampleTaken'].setValue(
          this.datePipe.transform(
            this.birdFluForm.value.followD7DateSampleTaken,
            'yyyy-MM-dd'
          )
        );
        this.birdFluForm.controls['followD14DateSampleTaken'].setValue(
          this.datePipe.transform(
            this.birdFluForm.value.followD14DateSampleTaken,
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
        this.birdFluForm.controls['returnDateoutside'].setValue(
          this.datePipe.transform(
            this.birdFluForm.value.returnDateoutside,
            'yyyy-MM-dd'
          )
        );
        this.birdFluForm.controls['returnDateInside'].setValue(
          this.datePipe.transform(
            this.birdFluForm.value.returnDateInside,
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

        this.birdFluForm.controls['dateVisit1'].setValue(
          this.datePipe.transform(
            this.birdFluForm.value.dateVisit1,
            'yyyy-MM-dd'
          )
        );
        this.birdFluForm.controls['dateVisit2'].setValue(
          this.datePipe.transform(
            this.birdFluForm.value.dateVisit2,
            'yyyy-MM-dd'
          )
        );
        this.birdFluForm.controls['dateVisit3'].setValue(
          this.datePipe.transform(
            this.birdFluForm.value.dateVisit3,
            'yyyy-MM-dd'
          )
        );
        this.birdFluForm.controls['dateVisit4'].setValue(
          this.datePipe.transform(
            this.birdFluForm.value.dateVisit4,
            'yyyy-MM-dd'
          )
        );
        this.birdFluForm.controls['dateVisit5'].setValue(
          this.datePipe.transform(
            this.birdFluForm.value.dateVisit5,
            'yyyy-MM-dd'
          )
        );

        this.birdFluForm.controls['entryDate3'].setValue(
          this.datePipe.transform(
            this.birdFluForm.value.entryDate1,
            'yyyy-MM-dd'
          )
        );
        this.birdFluForm.controls['entryDate3'].setValue(
          this.datePipe.transform(
            this.birdFluForm.value.entryDate2,
            'yyyy-MM-dd'
          )
        );
        this.birdFluForm.controls['entryDate3'].setValue(
          this.datePipe.transform(
            this.birdFluForm.value.entryDate3,
            'yyyy-MM-dd'
          )
        );
        this.birdFluForm.controls['entryDate3'].setValue(
          this.datePipe.transform(
            this.birdFluForm.value.entryDate4,
            'yyyy-MM-dd'
          )
        );
        this.birdFluForm.controls['entryDate3'].setValue(
          this.datePipe.transform(
            this.birdFluForm.value.entryDate5,
            'yyyy-MM-dd'
          )
        );

        this.birdFluForm.controls['exitDate1'].setValue(
          this.datePipe.transform(
            this.birdFluForm.value.exitDate1,
            'yyyy-MM-dd'
          )
        );
        this.birdFluForm.controls['exitDate2'].setValue(
          this.datePipe.transform(
            this.birdFluForm.value.exitDate2,
            'yyyy-MM-dd'
          )
        );
        this.birdFluForm.controls['exitDate3'].setValue(
          this.datePipe.transform(
            this.birdFluForm.value.exitDate3,
            'yyyy-MM-dd'
          )
        );
        this.birdFluForm.controls['exitDate4'].setValue(
          this.datePipe.transform(
            this.birdFluForm.value.exitDate4,
            'yyyy-MM-dd'
          )
        );
        this.birdFluForm.controls['exitDate5'].setValue(
          this.datePipe.transform(
            this.birdFluForm.value.exitDate5,
            'yyyy-MM-dd'
          )
        );
        this.birdFluForm.controls['statusHistoryOnDevice'].setValue(
          this.datePipe.transform(
            this.birdFluForm.value.statusHistoryOnDevice,
            'yyyy-MM-dd'
          )
        );

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
    Object.entries(this.birdFluForm.controls).map(([key, value], index) => {
      if (value.value == 'null')
        value.setValue(null);
      else if (value.value != null && !isNaN(+value.value)) {
        value.setValue(parseInt(value.value.toString()));
      }
    });
    this.allControllesCount = this.countAllControls(this.birdFluForm);
    if (this.birdFluForm.value.id != null) {
      this.allFilledControlsCount = this.countFilledControls(this.birdFluForm);
    } else {
      this.allFilledControlsCount = 0;
    }
    this.controlsCount = this.allControllesCount != 0 ? parseInt(((this.allFilledControlsCount / this.allControllesCount) * 100).toString()) : 0;

    return this.controlsCount;
  }
  /**
   * Count all fields
   * @param control
   * @returns
   */
  countFilledControls(control: any): number {
    if (control instanceof FormControl) {
      if (control.value != null)
        return 1;
      else return 0;
    }

    if (control instanceof FormArray) {
      return control.controls.reduce((acc, curr) => acc + this.countFilledControls(curr), 1)
    }

    if (control instanceof FormGroup) {
      return Object.keys(control.controls)
        .map(key => control.controls[key])
        .reduce((acc, curr) => acc + this.countFilledControls(curr), 1);
    }
    return 0;
  }
  /**
   * Count all filled fields
   * @param control
   * @returns
   */
  countAllControls(control: any): number {
    if (control instanceof FormControl) {
      return 1;
    }

    if (control instanceof FormArray) {
      return control.controls.reduce((acc, curr) => acc + this.countAllControls(curr), 1)
    }

    if (control instanceof FormGroup) {
      return Object.keys(control.controls)
        .map(key => control.controls[key])
        .reduce((acc, curr) => acc + this.countAllControls(curr), 1);
    }
    return 0;
  }

  buildForm() {
    if (this.birdFluForm != null) {
      const controlArray = this.birdFluForm.get(
        'healthFacilities'
      ) as FormArray;
      for (let index = 0; index < 5; index++) {
        controlArray.push(
          this.formBuilder.group({
            name: new FormControl(null),
            healthUnit: new FormControl(null),
            dateOfVisit: new FormControl(null),
            initialDiagnosis: new FormControl(null),
            admissionToHospital: new FormControl(null),
            dateOfEntry: new FormControl(null),
            exitDate: new FormControl(),
          })
        );
      }
      const controlArray2 = this.birdFluForm.get(
        'treatmentAndDosing'
      ) as FormArray;
      for (let index = 0; index < 6; index++) {
        controlArray2.push(
          this.formBuilder.group({
            typeOfTreatment: new FormControl(null),
            treatmentStartDate: new FormControl(null),
            dose: new FormControl(),
          })
        );
      }
    }
  }
  employees(): FormArray {
    return this.birdFluForm.get('dataContactsAvianInfluenza') as FormArray;
  }

  newEmployee(): FormGroup {
    return this.formBuilder.group({
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
    if (this.birdFluForm.value.id != null) {
      console.log(this.birdFluForm.value);
      this.investigationService.update(this.birdFluForm.value).subscribe(
        (res) => {
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
        (err) => console.log(err)
      );
    } else {
      console.log(this.birdFluForm.value);
      this.investigationService
        .addInvestigation(this.birdFluForm.value)
        .subscribe(
          (res) => {
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
          (err) => console.log(err)
        );
    }
  }
}
