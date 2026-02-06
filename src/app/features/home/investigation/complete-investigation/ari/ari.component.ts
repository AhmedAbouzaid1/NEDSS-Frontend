import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormArray, FormControl, FormGroup } from '@angular/forms';
import { UserMessageService } from 'src/app/core/services/user.message.service';
import { InvestigationService } from '../../services/investigation.service';
import { TranslateService } from '@ngx-translate/core';
import { ActivatedRoute, Router } from '@angular/router';
import { isNumber } from '@ng-bootstrap/ng-bootstrap/util/util';
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
  fev:any;
  controlsCount: number = 0;
  allFilledControlsCount: number = 0;
  allControllesCount: number = 0;
  patientName: string;
  diseaseGroupID: any;
  constructor(
    private investigationService: InvestigationService,
    private translateService: TranslateService,
    private route: ActivatedRoute,
    private userMsg: UserMessageService,
    private datePipe: DatePipe,
    private router: Router
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
    this.ariForm = new FormGroup({
      id: new FormControl(),
      //completePercentage: new FormControl(),
      investigationCompletePercentage:new FormControl(),
      patientID: new FormControl(this.currentId),
      fever: new FormControl(),
      //fever: new FormControl('3'),
      feverDurationDay: new FormControl(),
      maxTemperature: new FormControl(),

      lossSenseSmellTaste: new FormControl(),
      coughingUpBlood: new FormControl(),

      chronicChestDiseases: new FormControl(),
      chronicHeartDisease: new FormControl(),
      highBloodPressure: new FormControl(),
      excessiveObesity: new FormControl(),
      immuneDisease: new FormControl(),
      aids: new FormControl(),
      pregnantWomen: new FormControl(),
      diabetes: new FormControl(),
      liverDiseases: new FormControl(),
      kidneyDisease: new FormControl(),
      diseasesNervousMuscular: new FormControl(),
      bloodBiseases: new FormControl(),
      other: new FormControl(),

      onsetSymptomsDates: new FormControl(),
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

      nameHealthFacility1: new FormControl(),
      healthFacilityBelongs1: new FormControl(),
      dateVisit1: new FormControl(),
      initialDiagnosis1: new FormControl(),
      admissionHospital1: new FormControl(),
      dateEntry1: new FormControl(),
      exitDate1: new FormControl(),

      nameHealthFacility2: new FormControl(),
      healthFacilityBelongs2: new FormControl(),
      dateVisit2: new FormControl(),
      initialDiagnosis2: new FormControl(),
      admissionHospital2: new FormControl(),
      dateEntry2: new FormControl(),
      exitDate2: new FormControl(),

      nameHealthFacility3: new FormControl(),
      healthFacilityBelongs3: new FormControl(),
      dateVisit3: new FormControl(),
      initialDiagnosis3: new FormControl(),
      admissionHospital3: new FormControl(),
      dateEntry3: new FormControl(),
      //exitDate3: new FormControl(),

      nameHealthFacility4: new FormControl(),
      healthFacilityBelongs4: new FormControl(),
      dateVisit4: new FormControl(),
      initialDiagnosis4: new FormControl(),
      admissionHospital4: new FormControl(),
      dateEntry4: new FormControl(),
      exitDate4: new FormControl(),

      nameHealthFacility5: new FormControl(),
      healthFacilityBelongs5: new FormControl(),
      dateVisit5: new FormControl(),
      initialDiagnosis5: new FormControl(),
      admissionHospital5: new FormControl(),
      dateEntry5: new FormControl(),
      exitDate5: new FormControl(),

      comments: new FormControl(),

      routineMonitoring: new FormControl(),
      followUpContacts: new FormControl(),
      medicalTeam: new FormControl(),
      placeConfirmedCase: new FormControl(),

      contactSuspectedCase: new FormControl(),
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
      // isSampleTakenDay1: new FormControl('2'),
      isSampleTakenDay1: new FormControl(),
      dateSampleTakenDay1: new FormControl(),
      // sampleResultDay1: new FormControl('2'),
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
      // isSampleTakenDay2: new FormControl('2'),
      isSampleTakenDay2: new FormControl(),
      dateSampleTakenDay2: new FormControl(),
      // sampleResultDay2: new FormControl('2'),
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
      // isSampleTakenDay7: new FormControl('2'),
      isSampleTakenDay7: new FormControl(),
      dateSampleTakenDay7: new FormControl(),
      // sampleResultDay7: new FormControl('2'),
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
      //isSampleTakenDay14: new FormControl('2'),
      dateSampleTakenDay14: new FormControl(),
      //sampleResultDay14: new FormControl('2'),
      sampleResultDay14: new FormControl(),

      // chickensExposureMethod: new FormControl('0'),
      // chickensplaceOfExposure: new FormControl('0'),
      // chickensAnimalCondition: new FormControl('0'),
      // duckExposureMethod: new FormControl('0'),
      // duckplaceOfExposure: new FormControl('0'),
      // duckAnimalCondition: new FormControl('0'),
      // geeseExposureMethod: new FormControl('0'),
      // geeseplaceOfExposure: new FormControl('0'),
      // geeseAnimalCondition: new FormControl('0'),
      // rummyExposureMethod: new FormControl('0'),
      // rummyplaceOfExposure: new FormControl('0'),
      // rummyAnimalCondition: new FormControl('0'),
      // bathroomExposureMethod: new FormControl('0'),
      // bathroomplaceOfExposure: new FormControl('0'),
      // bathroomAnimalCondition: new FormControl('0'),
      // quailExposureMethod: new FormControl('0'),
      // quailplaceOfExposure: new FormControl('0'),
      // quailAnimalCondition: new FormControl('0'),
      // migratoryBirdsExposureMethod: new FormControl('0'),
      // migratoryBirdsplaceOfExposure: new FormControl('0'),
      // migratoryBirdsAnimalCondition: new FormControl('0'),
      // beautyExposureMethod: new FormControl('0'),
      // beautyplaceOfExposure: new FormControl('0'),
      // beautyAnimalCondition: new FormControl('0'),
      // batsExposureMethod: new FormControl('0'),
      // batsplaceOfExposure: new FormControl('0'),
      // batsAnimalCondition: new FormControl('0'),
      // sheepExposureMethod: new FormControl('0'),
      // sheepplaceOfExposure: new FormControl('0'),
      // sheepAnimalCondition: new FormControl('0'),
      // wildCatsExposureMethod: new FormControl(false),
      // wildCatsplaceOfExposure: new FormControl(false),
      // wildCatsAnimalCondition: new FormControl(false),
      // pigsExposureMethod: new FormControl('0'),
      // pigsplaceOfExposure: new FormControl('0'),
      // pigsAnimalCondition: new FormControl('0'),

      
      // chicken: new FormControl(false),
      // chickensExposureMethodSlaughter: new FormControl(true),
      // chickensExposureMethodEquip: new FormControl(true),
      // chickensExposureMethodExistence: new FormControl(true),
      // chickensExposureMethodHunt: new FormControl(true),
      // chickensHomePlaceExposure: new FormControl(false),
      // chickensMarketPlaceExposure: new FormControl(false),
      // chickensSlaughterhousePlaceExposure: new FormControl(false),
      // chickensShopPlaceExposure: new FormControl(false),
      // chickensFarmPlaceExposure: new FormControl(false),
      // chickensGoodAnimalCondition: new FormControl(false),
      // chickensSickAnimalCondition: new FormControl(false),
      // chickensCantAnimalCondition: new FormControl(false),
      chicken: new FormControl(),
      chickensExposureMethodSlaughter: new FormControl(),
      chickensExposureMethodEquip: new FormControl(),
      chickensExposureMethodExistence: new FormControl(),
      chickensExposureMethodHunt: new FormControl(),
      chickensHomePlaceExposure: new FormControl(),
      chickensMarketPlaceExposure: new FormControl(),
      chickensSlaughterhousePlaceExposure: new FormControl(),
      chickensShopPlaceExposure: new FormControl(),
      chickensFarmPlaceExposure: new FormControl(),
      chickensGoodAnimalCondition: new FormControl(),
      chickensSickAnimalCondition: new FormControl(),
      chickensCantAnimalCondition: new FormControl(),


      
      // duck: new FormControl(false),
      // duckExposureMethodSlaughter: new FormControl(false),
      // duckExposureMethodEquip: new FormControl(false),
      // duckExposureMethodExistence: new FormControl(false),
      // duckExposureMethodHunt: new FormControl(false),
      // duckHomePlaceExposure: new FormControl(false),
      // duckMarketPlaceExposure: new FormControl(false),
      // duckSlaughterhousePlaceExposure: new FormControl(false),
      // duckShopPlaceExposure: new FormControl(false),
      // duckFarmPlaceExposure: new FormControl(false),
      // duckGoodAnimalCondition: new FormControl(false),
      // duckSickAnimalCondition: new FormControl(false),
      // duckCantAnimalCondition: new FormControl(false),

            
      duck: new FormControl(),
      duckExposureMethodSlaughter: new FormControl(),
      duckExposureMethodEquip: new FormControl(),
      duckExposureMethodExistence: new FormControl(),
      duckExposureMethodHunt: new FormControl(),
      duckHomePlaceExposure: new FormControl(),
      duckMarketPlaceExposure: new FormControl(),
      duckSlaughterhousePlaceExposure: new FormControl(),
      duckShopPlaceExposure: new FormControl(),
      duckFarmPlaceExposure: new FormControl(),
      duckGoodAnimalCondition: new FormControl(),
      duckSickAnimalCondition: new FormControl(),
      duckCantAnimalCondition: new FormControl(),

      // geese: new FormControl(false),
      // geeseExposureMethodSlaughter: new FormControl(false),
      // geeseExposureMethodEquip: new FormControl(false),
      // geeseExposureMethodExistence: new FormControl(false),
      // geeseExposureMethodHunt: new FormControl(false),
      // geeseHomePlaceExposure: new FormControl(false),
      // geeseMarketPlaceExposure: new FormControl(false),
      // geeseSlaughterhousePlaceExposure: new FormControl(false),
      // geeseShopPlaceExposure: new FormControl(false),
      // geeseFarmPlaceExposure: new FormControl(false),
      // geeseGoodAnimalCondition: new FormControl(false),
      // geeseSickAnimalCondition: new FormControl(false),
      // geeseCantAnimalCondition: new FormControl(false),

      geese: new FormControl(),
      geeseExposureMethodSlaughter: new FormControl(),
      geeseExposureMethodEquip: new FormControl(),
      geeseExposureMethodExistence: new FormControl(),
      geeseExposureMethodHunt: new FormControl(),
      geeseHomePlaceExposure: new FormControl(),
      geeseMarketPlaceExposure: new FormControl(),
      geeseSlaughterhousePlaceExposure: new FormControl(),
      geeseShopPlaceExposure: new FormControl(),
      geeseFarmPlaceExposure: new FormControl(),
      geeseGoodAnimalCondition: new FormControl(),
      geeseSickAnimalCondition: new FormControl(),
      geeseCantAnimalCondition: new FormControl(),

      //All was false
      rummy: new FormControl(),
      rummyExposureMethodSlaughter: new FormControl(),
      rummyExposureMethodEquip: new FormControl(),
      rummyExposureMethodExistence: new FormControl(),
      rummyExposureMethodHunt: new FormControl(),
      rummyHomePlaceExposure: new FormControl(),
      rummyMarketPlaceExposure: new FormControl(),
      rummySlaughterhousePlaceExposure: new FormControl(),
      rummyShopPlaceExposure: new FormControl(),
      rummyFarmPlaceExposure: new FormControl(),
      rummyGoodAnimalCondition: new FormControl(),
      rummySickAnimalCondition: new FormControl(),
      rummyCantAnimalCondition: new FormControl(),

      //All was false
      pigeon: new FormControl(),
      pigeonExposureMethodSlaughter: new FormControl(),
      pigeonExposureMethodEquip: new FormControl(),
      pigeonExposureMethodExistence: new FormControl(),
      pigeonExposureMethodHunt: new FormControl(),
      pigeonHomePlaceExposure: new FormControl(),
      pigeonMarketPlaceExposure: new FormControl(),
      pigeonSlaughterhousePlaceExposure: new FormControl(),
      pigeonShopPlaceExposure: new FormControl(),
      pigeonFarmPlaceExposure: new FormControl(),
      pigeonGoodAnimalCondition: new FormControl(),
      pigeonSickAnimalCondition: new FormControl(),
      pigeonCantAnimalCondition: new FormControl(),

      //All was false
      quail: new FormControl(),
      quailExposureMethodSlaughter: new FormControl(),
      quailExposureMethodEquip: new FormControl(),
      quailExposureMethodExistence: new FormControl(),
      quailExposureMethodHunt: new FormControl(),
      quailHomePlaceExposure: new FormControl(),
      quailMarketPlaceExposure: new FormControl(),
      quailSlaughterhousePlaceExposure: new FormControl(),
      quailShopPlaceExposure: new FormControl(),
      quailFarmPlaceExposure: new FormControl(),
      quailGoodAnimalCondition: new FormControl(),
      quailSickAnimalCondition: new FormControl(),
      quailCantAnimalCondition: new FormControl(),


      //all was false
      migratoryBird: new FormControl(),
      migratoryBirdsExposureMethodSlaughter: new FormControl(),
      migratoryBirdsExposureMethodEquip: new FormControl(),
      migratoryBirdsExposureMethodExistence: new FormControl(),
      migratoryBirdsExposureMethodHunt: new FormControl(),
      migratoryBirdsHomePlaceExposure: new FormControl(),
      migratoryBirdsMarketPlaceExposure: new FormControl(),
      migratoryBirdsSlaughterhousePlaceExposure: new FormControl(),
      migratoryBirdsShopPlaceExposure: new FormControl(),
      migratoryBirdsFarmPlaceExposure: new FormControl(),
      migratoryBirdsGoodAnimalCondition: new FormControl(),
      migratoryBirdsSickAnimalCondition: new FormControl(),
      migratoryBirdsCantAnimalCondition: new FormControl(),

      //all was false
      camel: new FormControl(),
      camelExposureMethodSlaughter: new FormControl(),
      camelExposureMethodEquip: new FormControl(),
      camelExposureMethodExistence: new FormControl(),
      camelExposureMethodHunt: new FormControl(),
      camelHomePlaceExposure: new FormControl(),
      camelMarketPlaceExposure: new FormControl(),
      camelSlaughterhousePlaceExposure: new FormControl(),
      camelShopPlaceExposure: new FormControl(),
      camelFarmPlaceExposure: new FormControl(),
      camelGoodAnimalCondition: new FormControl(),
      camelSickAnimalCondition: new FormControl(),
      camelCantAnimalCondition: new FormControl(),

      //all was false
      bats: new FormControl(),
      batsExposureMethodSlaughter: new FormControl(),
      batsExposureMethodEquip: new FormControl(),
      batsExposureMethodExistence: new FormControl(),
      batsExposureMethodHunt: new FormControl(),
      batsHomePlaceExposure: new FormControl(),
      batsMarketPlaceExposure: new FormControl(),
      batsSlaughterhousePlaceExposure: new FormControl(),
      batsShopPlaceExposure: new FormControl(),
      batsFarmPlaceExposure: new FormControl(),
      batsGoodAnimalCondition: new FormControl(),
      batsSickAnimalCondition: new FormControl(),
      batsCantAnimalCondition: new FormControl(),

      //all was false
      sheeps: new FormControl(),
      sheepsExposureMethodSlaughter: new FormControl(),
      sheepsExposureMethodEquip: new FormControl(),
      sheepsExposureMethodExistence: new FormControl(),
      sheepsExposureMethodHunt: new FormControl(),
      sheepsHomePlaceExposure: new FormControl(),
      sheepsMarketPlaceExposure: new FormControl(),
      sheepsSlaughterhousePlaceExposure: new FormControl(),
      sheepsShopPlaceExposure: new FormControl(),
      sheepsFarmPlaceExposure: new FormControl(),
      sheepsGoodAnimalCondition: new FormControl(),
      sheepsSickAnimalCondition: new FormControl(),
      sheepsCantAnimalCondition: new FormControl(),

      wildCat: new FormControl(),
      wildCatExposureMethodSlaughter: new FormControl(),
      wildCatExposureMethodEquip: new FormControl(),
      wildCatExposureMethodExistence: new FormControl(),
      wildCatExposureMethodHunt: new FormControl(),
      wildCatHomePlaceExposure: new FormControl(),
      wildCatMarketPlaceExposure: new FormControl(),
      wildCatSlaughterhousePlaceExposure: new FormControl(),
      wildCatShopPlaceExposure: new FormControl(),
      wildCatFarmPlaceExposure: new FormControl(),
      wildCatGoodAnimalCondition: new FormControl(),
      wildCatSickAnimalCondition: new FormControl(),
      wildCatCantAnimalCondition: new FormControl(),

      pig: new FormControl(),
      pigExposureMethodSlaughter: new FormControl(),
      pigExposureMethodEquip: new FormControl(),
      pigExposureMethodExistence: new FormControl(),
      pigExposureMethodHunt: new FormControl(),
      pigHomePlaceExposure: new FormControl(),
      pigMarketPlaceExposure: new FormControl(),
      pigSlaughterhousePlaceExposure: new FormControl(),
      pigShopPlaceExposure: new FormControl(),
      pigFarmPlaceExposure: new FormControl(),
      pigGoodAnimalCondition: new FormControl(),
      pigSickAnimalCondition: new FormControl(),
      pigCantAnimalCondition: new FormControl(),

      otherAnimal: new FormControl(),
      //all was false
      otherExposureMethodEquip: new FormControl(),
      otherEquipMethodSlaughter: new FormControl(),
      otherExposureMethodExistence: new FormControl(),
      otherExposureMethodHunt: new FormControl(),
      otherHomePlaceExposure: new FormControl(),
      otherMarketPlaceExposure: new FormControl(),
      otherSlaughterhousePlaceExposure: new FormControl(),
      otherShopPlaceExposure: new FormControl(),
      otherFarmPlaceExposure: new FormControl(),
      otherGoodAnimalCondition: new FormControl(),
      otherSickAnimalCondition: new FormControl(),
      otherCantAnimalCondition: new FormControl(),

      exposureBirdsAnimals: new FormControl(),
      otherExposure: new FormControl(),
      exposureHumanSamples: new FormControl(),
      healthCarePatients: new FormControl(),

      travelOutsideEgypt: new FormControl(),
      outsideCountryName: new FormControl(),
      dateTravelOutside: new FormControl(),
      dateReturnFromOutside: new FormControl(),
      travelInsideEgypt: new FormControl(),
      government: new FormControl(),
      dateTravelInside: new FormControl(),
      dateReturnFromInside: new FormControl(),

      
      patientContactConfirmedCaseSevereRespiratory: new FormControl(),
      //extraone
      //patientCaseDeadCaseSevereRespiratory: new FormControl(),
      caesName: new FormControl(''),
      relationName: new FormControl(),
      address: new FormControl(),
      caseAmongGroupSimilarCases: new FormControl(),
      groupLocated: new FormControl(),
      otherRemember: new FormControl(),

      //startDate
      startDate: new FormControl(),
      dateFluVaccination: new FormControl(),
      coronaVaccineTaken: new FormControl(),
      numberDoses: new FormControl(),
      dosageDate1: new FormControl(),
      dosageDate2: new FormControl(),
      dosageDate3: new FormControl(),
      dosageDate4: new FormControl(),
      vaccine1: new FormControl(),
      vaccine2: new FormControl(),
      vaccine3: new FormControl(),
      vaccine4: new FormControl(),
      isSeasonalFluVaccine: new FormControl(),
      pneumococcalVaccineTaken: new FormControl(),
      exposureToBirds: new FormControl(),
      isdealWithBirds: new FormControl(),
      birdsMethods: new FormControl(),
      //healthCarePatientsConfirmed: new FormControl(1),
      healthCarePatientsConfirmed: new FormControl(),
      diseaseGroupId: new FormControl(this.diseaseGroupID),
    });

    //this.ariForm.controls['completePercentage'].disable();

    //here
    //this.controlsCount = this.calculateCompletePercentage();
  }
  ngOnInit() {
    this.ariForm.controls['investigationCompletePercentage'].setValue(
      this.allFilledControlsCount
    );
    if (this.currentId != null) {
      this.ariForm.controls['patientID'].setValue(this.currentId);
      this.getById();
    }
    else {
      this.router.navigateByUrl("/home/investigations");
    }
  }
  getById() {
    this.investigationService.getByIdari(this.currentId).subscribe(
      (res) => {
        console.log(res);

        var v = res.data;
        // if (v.sampleResultDay1 == null) {
        //   v.sampleResultDay1 = 2;
        // }
        // if (v.sampleResultDay2 == null) {
        //   v.sampleResultDay2 = 2;
        // }
        // if (v.sampleResultDay7 == null) {
        //   v.sampleResultDay7 = 2;
        // }
        // if (v.sampleResultDay14 == null) {
        //   v.sampleResultDay14 = 2;
        // }

        this.ariForm.patchValue(v);
        this.ariForm.patchValue({
          fever: this.ariForm.value.fever + '',
          tc: true,
        });
        this.ariForm.controls['onsetSymptomsDates'].setValue(
          this.datePipe.transform(
            this.ariForm.value.onsetSymptomsDates,
            'yyyy-MM-dd'
          )
        );
        this.ariForm.controls['dateDiagnosisPneumonia'].setValue(
          this.datePipe.transform(
            this.ariForm.value.dateDiagnosisPneumonia,
            'yyyy-MM-dd'
          )
        );
        this.ariForm.controls['dateReservation'].setValue(
          this.datePipe.transform(
            this.ariForm.value.dateReservation,
            'yyyy-MM-dd'
          )
        );
        this.ariForm.controls['historyDevice'].setValue(
          this.datePipe.transform(
            this.ariForm.value.historyDevice,
            'yyyy-MM-dd'
          )
        );

        //
        this.ariForm.controls['dateVisit1'].setValue(
          this.datePipe.transform(this.ariForm.value.dateVisit1, 'yyyy-MM-dd')
        );
        this.ariForm.controls['dateEntry1'].setValue(
          this.datePipe.transform(this.ariForm.value.dateEntry1, 'yyyy-MM-dd')
        );
        this.ariForm.controls['dateVisit2'].setValue(
          this.datePipe.transform(this.ariForm.value.dateVisit2, 'yyyy-MM-dd')
        );
        this.ariForm.controls['dateEntry2'].setValue(
          this.datePipe.transform(this.ariForm.value.dateEntry2, 'yyyy-MM-dd')
        );
        this.ariForm.controls['dateVisit3'].setValue(
          this.datePipe.transform(this.ariForm.value.dateVisit3, 'yyyy-MM-dd')
        );
        this.ariForm.controls['dateEntry3'].setValue(
          this.datePipe.transform(this.ariForm.value.dateEntry3, 'yyyy-MM-dd')
        );
        this.ariForm.controls['dateVisit4'].setValue(
          this.datePipe.transform(this.ariForm.value.dateVisit4, 'yyyy-MM-dd')
        );
        this.ariForm.controls['dateEntry4'].setValue(
          this.datePipe.transform(this.ariForm.value.dateEntry4, 'yyyy-MM-dd')
        );
        this.ariForm.controls['dateVisit5'].setValue(
          this.datePipe.transform(this.ariForm.value.dateVisit5, 'yyyy-MM-dd')
        );
        this.ariForm.controls['dateEntry5'].setValue(
          this.datePipe.transform(this.ariForm.value.dateEntry5, 'yyyy-MM-dd')
        );
        this.ariForm.controls['exitDate1'].setValue(
          this.datePipe.transform(this.ariForm.value.exitDate1, 'yyyy-MM-dd')
        );
        this.ariForm.controls['exitDate2'].setValue(
          this.datePipe.transform(this.ariForm.value.exitDate2, 'yyyy-MM-dd')
        );
        // this.ariForm.controls['exitDate3'].setValue(
        //   this.datePipe.transform(this.ariForm.value.exitDate3, 'yyyy-MM-dd')
        // );
        this.ariForm.controls['exitDate4'].setValue(
          this.datePipe.transform(this.ariForm.value.exitDate4, 'yyyy-MM-dd')
        );
        this.ariForm.controls['exitDate5'].setValue(
          this.datePipe.transform(this.ariForm.value.exitDate5, 'yyyy-MM-dd')
        );

        ///
        this.ariForm.controls['dosageDate1'].setValue(
          this.datePipe.transform(this.ariForm.value.dosageDate1, 'yyyy-MM-dd')
        );
        this.ariForm.controls['dosageDate2'].setValue(
          this.datePipe.transform(this.ariForm.value.dosageDate2, 'yyyy-MM-dd')
        );
        this.ariForm.controls['dosageDate3'].setValue(
          this.datePipe.transform(this.ariForm.value.dosageDate3, 'yyyy-MM-dd')
        );
        this.ariForm.controls['dosageDate4'].setValue(
          this.datePipe.transform(this.ariForm.value.dosageDate4, 'yyyy-MM-dd')
        );
        this.ariForm.controls['dateFluVaccination'].setValue(
          this.datePipe.transform(
            this.ariForm.value.dateFluVaccination,
            'yyyy-MM-dd'
          )
        );
        this.ariForm.controls['startDate'].setValue(
          this.datePipe.transform(this.ariForm.value.startDate, 'yyyy-MM-dd')
        );

        //firstDay

        this.ariForm.controls['dateOnsetSymptomsDay1'].setValue(
          this.datePipe.transform(
            this.ariForm.value.dateOnsetSymptomsDay1,
            'yyyy-MM-dd'
          )
        );
        this.ariForm.patchValue({
          isSampleTakenDay1: this.ariForm.value.isSampleTakenDay1 + '',
          tc: true,
        });
        this.ariForm.controls['dateSampleTakenDay1'].setValue(
          this.datePipe.transform(
            this.ariForm.value.dateSampleTakenDay1,
            'yyyy-MM-dd'
          )
        );
        this.ariForm.patchValue({
          sampleResultDay1: this.ariForm.value.sampleResultDay1 + '',
          tc: true,
        });
        //day2
        this.ariForm.controls['dateOnsetSymptomsDay2'].setValue(
          this.datePipe.transform(
            this.ariForm.value.dateOnsetSymptomsDay2,
            'yyyy-MM-dd'
          )
        );
        this.ariForm.patchValue({
          isSampleTakenDay2: this.ariForm.value.isSampleTakenDay2 + '',
          tc: true,
        });
        this.ariForm.controls['dateSampleTakenDay2'].setValue(
          this.datePipe.transform(
            this.ariForm.value.dateSampleTakenDay2,
            'yyyy-MM-dd'
          )
        );
        this.ariForm.patchValue({
          sampleResultDay2: this.ariForm.value.sampleResultDay2 + '',
          tc: true,
        });
        //day7
        this.ariForm.controls['dateOnsetSymptomsDay7'].setValue(
          this.datePipe.transform(
            this.ariForm.value.dateOnsetSymptomsDay7,
            'yyyy-MM-dd'
          )
        );
        this.ariForm.patchValue({
          isSampleTakenDay7: this.ariForm.value.isSampleTakenDay7 + '',
          tc: true,
        });
        this.ariForm.controls['dateSampleTakenDay7'].setValue(
          this.datePipe.transform(
            this.ariForm.value.dateSampleTakenDay7,
            'yyyy-MM-dd'
          )
        );
        this.ariForm.patchValue({
          sampleResultDay7: this.ariForm.value.sampleResultDay7 + '',
          tc: true,
        });
        //day14
        this.ariForm.controls['dateOnsetSymptomsDay14'].setValue(
          this.datePipe.transform(
            this.ariForm.value.dateOnsetSymptomsDay14,
            'yyyy-MM-dd'
          )
        );
        this.ariForm.patchValue({
          isSampleTakenDay14: this.ariForm.value.isSampleTakenDay14 + '',
          tc: true,
        });
        this.ariForm.controls['dateSampleTakenDay14'].setValue(
          this.datePipe.transform(
            this.ariForm.value.dateSampleTakenDay14,
            'yyyy-MM-dd'
          )
        );
        this.ariForm.patchValue({
          sampleResultDay14: this.ariForm.value.sampleResultDay14 + '',
          tc: true,
        });
        //
        //dateTravelOutside
        this.ariForm.controls['dateTravelOutside'].setValue(
          this.datePipe.transform(
            this.ariForm.value.dateTravelOutside,
            'yyyy-MM-dd'
          )
        );
        this.ariForm.controls['dateReturnFromOutside'].setValue(
          this.datePipe.transform(
            this.ariForm.value.dateReturnFromOutside,
            'yyyy-MM-dd'
          )
        );
        this.ariForm.controls['dateTravelInside'].setValue(
          this.datePipe.transform(
            this.ariForm.value.dateTravelInside,
            'yyyy-MM-dd'
          )
        );
        this.ariForm.controls['dateReturnFromInside'].setValue(
          this.datePipe.transform(
            this.ariForm.value.dateReturnFromInside,
            'yyyy-MM-dd'
          )
        );
        //here
        //this.controlsCount = this.calculateCompletePercentage();
        this.calculateCompletionPercentage();
        //this.ariForm.value.completePercentage = this.controlsCount;

        Object.entries(this.ariForm.controls).map(
          ([key, value], index) => {
            if (value.value == 'null')
              value.setValue(null);
          });

        //here
        //this.controlsCount = this.calculateCompletePercentage();
        this.calculateCompletionPercentage();
        //this.ariForm.value.completePercentage = this.controlsCount;
        this.fev=this.ariForm.controls['fever'].setValue(res.data.fever.toString())

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
  /**
   * Calculate the percentage
   * @returns
   */
  // calculateCompletePercentage(): number {
  //   Object.entries(this.ariForm.controls).map(([key, value], index) => {
  //     if (value.value == 'null')
  //       value.setValue(null);
  //     else if (value.value != null && !isNaN(+value.value)) {
  //       value.setValue(parseInt(value.value.toString()));
  //     }
  //   });
  //   this.allControllesCount = this.countAllControls(this.ariForm);
  //   if (this.ariForm.value.id != null) {
  //     this.allFilledControlsCount = this.countFilledControls(this.ariForm);
  //   } else {
  //     this.allFilledControlsCount = 0;
  //   }
  //   this.controlsCount = this.allControllesCount != 0 ? parseInt(((this.allFilledControlsCount / this.allControllesCount) * 100).toString()) : 0;
  //   this.fev=this.ariForm.controls['fever'].setValue(this.ariForm.value.fever.toString())
  //   return this.controlsCount;
  // }
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

  save() {
    //this.ariForm.controls['completePercentage'].enable();
    //here
    this.calculateCompletionPercentage();
    //this.controlsCount = this.calculateCompletePercentage();
    Object.entries(this.ariForm.controls).map(([key, value], index) => {
      if (value.value == 'null')
        value.setValue(null);
      else if (typeof value.value === 'boolean' || key == 'telephoneDay1' || key == 'telephoneDay2' || key == 'telephoneDay7' || key == 'telephoneDay14'){
        value.value.toString();
      }
      else if (value.value != null && !isNaN(+value.value) && typeof value.value !== 'boolean') {
        value.setValue(parseInt(value.value.toString()));
      }
    });

    //this.ariForm.controls['completePercentage'].setValue(this.controlsCount);
    this.ariForm.controls['investigationCompletePercentage'].setValue(parseFloat(((this.allFilledControlsCount / this.allControllesCount) * 100).toFixed(2)));
    this.ariForm.controls['diseaseGroupId'].setValue(
      this.diseaseGroupID
    );
    if (this.ariForm.value.id != null) {
      const result = this.ariForm.value;
      this.investigationService.updateSevereari(this.ariForm.value).subscribe(
        (response: any) => {
          if (response) {
            document.getElementById("jump_to_this_location").scrollIntoView({ behavior: 'smooth' });
            //this.ariForm.controls['completePercentage'].disable();
            //here
            //this.controlsCount = this.calculateCompletePercentage();
            //this.ariForm.value.completePercentage = this.controlsCount;            
            this.translateService
              .get('NEDSS.COMMON.SENT_SUCESSFULLY')
              .subscribe((res: string) => {
                this.userMsg.success(res);
              });
            this.getById();

          }
        },
        (error) => {
          this.translateService
            .get('NEDSS.COMMON.SENT_FAILD')
            .subscribe((res: string) => {
              this.userMsg.error(res);
            });
        },
      );
    } else {
      this.investigationService
        .addInvestigationari(this.ariForm.value)
        .subscribe(
          (response: any) => {
            if (response) {
              document.getElementById("jump_to_this_location").scrollIntoView({ behavior: 'smooth' });
              this.ariForm.value.id = response.data.id;
              this.currentId = response.data.patientID;
              this.getById();
              //this.ariForm.controls['completePercentage'].disable();
              //here
              //this.controlsCount = this.calculateCompletePercentage();
              //this.ariForm.value.completePercentage = this.controlsCount;    
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

    //BL
    calculateCompletionPercentage() {
      this.allFilledControlsCount = 0;
      const data = this.ariForm.value;
      
      //Exclude fields you don't want to count (like 'id')
      const excludedFields = ['id','patientID','investigationCompletePercentage' , 'diseaseGroupId' , 'createdDate'];
      const totalFields = Object.keys(data).filter(key => !excludedFields.includes(key)).length;
      
      this.allControllesCount = totalFields;
  
      Object.keys(data).forEach((key) => {
          if (!excludedFields.includes(key) && data[key] !== null && data[key] !== '') {
              this.allFilledControlsCount++;
          }
      });
    }
}
