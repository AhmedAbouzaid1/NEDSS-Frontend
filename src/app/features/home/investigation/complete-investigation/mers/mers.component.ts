import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
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
  constructor(
    private investigationService: InvestigationService,
    private translateService: TranslateService,
    private userMsg: UserMessageService,
    private datePipe: DatePipe
  ) { }
  ngOnInit() {
    this.mersForm = new FormGroup({
      id: new FormControl(),
      patientID: new FormControl(),

      fever: new FormControl(),
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
      //
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
      exitDate3: new FormControl(),

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
      durationEcmo: new FormControl(),
      kidneyFailure: new FormControl(),
      havingPregnancy: new FormControl(),
      pregnancyProduct: new FormControl(),
      travelingOutsideEgypt: new FormControl(),
      nameCountry: new FormControl(),
      dateTravelOutsideEgypt: new FormControl(),
      returnDateOutsideEgypt: new FormControl(),
      affectedArea: new FormControl(),
      dateArrivalRepublic: new FormControl(),
      airportPlaceArrivalFlightNumberPortTrain: new FormControl(),
      closeContact: new FormControl(),

      contactSuspectedCase: new FormControl(),
      epidemicOutbreak: new FormControl(),
      contactConfirmedCase: new FormControl(),
      contactDeceasedPersonRespiratory: new FormControl(),
      numberNonDirectContacts: new FormControl(),
      numberDirectContacts: new FormControl(),

      travelingWithinEgypt: new FormControl(),
      governorateWithinEgypt: new FormControl(),
      dateTravelWithinEgypt: new FormControl(),
      returnDateWithinEgypt: new FormControl(),

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
      isSampleTakenDay1: new FormControl('2'),
      dateSampleTakenDay1: new FormControl(),
      sampleResultDay1: new FormControl('2'),

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
      isSampleTakenDay2: new FormControl('2'),
      dateSampleTakenDay2: new FormControl(),
      sampleResultDay2: new FormControl('2'),

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
      isSampleTakenDay7: new FormControl('2'),
      dateSampleTakenDay7: new FormControl(),
      sampleResultDay7: new FormControl('2'),

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
      isSampleTakenDay14: new FormControl('2'),
      dateSampleTakenDay14: new FormControl(),
      sampleResultDay14: new FormControl('2'),

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
      diseaseGroupId: new FormControl(this.investigationService.diseaseGroupID),
    });
    this.currentId = this.investigationService.currentid;
    this.mersForm.controls['patientID'].setValue(this.currentId);
    this.investigationService.getByIdmers(this.currentId).subscribe(
      (res) => {
        console.log(res);
        var v = res.data;
        this.mersForm.patchValue(v);
        this.mersForm.patchValue({
          fever: this.mersForm.value.fever + '',
          tc: true,
        });

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
        //ribavirinStartingDate
        //dates onsetSymptomsDates
        // this.mersForm.value.onsetSymptomsDates=v.onsetSymptomsDates;

        this.mersForm.controls['onsetSymptomsDates'].setValue(
          this.datePipe.transform(
            this.mersForm.value.onsetSymptomsDates,
            'yyyy-MM-dd'
          )
        );

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
        this.mersForm.controls['dateVisit1'].setValue(
          this.datePipe.transform(this.mersForm.value.dateVisit1, 'yyyy-MM-dd')
        );
        this.mersForm.controls['dateEntry1'].setValue(
          this.datePipe.transform(this.mersForm.value.dateEntry1, 'yyyy-MM-dd')
        );
        this.mersForm.controls['dateVisit2'].setValue(
          this.datePipe.transform(this.mersForm.value.dateVisit2, 'yyyy-MM-dd')
        );
        this.mersForm.controls['dateEntry2'].setValue(
          this.datePipe.transform(this.mersForm.value.dateEntry2, 'yyyy-MM-dd')
        );
        this.mersForm.controls['dateVisit3'].setValue(
          this.datePipe.transform(this.mersForm.value.dateVisit3, 'yyyy-MM-dd')
        );
        this.mersForm.controls['dateEntry3'].setValue(
          this.datePipe.transform(this.mersForm.value.dateEntry3, 'yyyy-MM-dd')
        );
        this.mersForm.controls['dateVisit4'].setValue(
          this.datePipe.transform(this.mersForm.value.dateVisit4, 'yyyy-MM-dd')
        );
        this.mersForm.controls['dateEntry4'].setValue(
          this.datePipe.transform(this.mersForm.value.dateEntry4, 'yyyy-MM-dd')
        );
        this.mersForm.controls['dateVisit5'].setValue(
          this.datePipe.transform(this.mersForm.value.dateVisit5, 'yyyy-MM-dd')
        );
        this.mersForm.controls['dateEntry5'].setValue(
          this.datePipe.transform(this.mersForm.value.dateEntry5, 'yyyy-MM-dd')
        );
        this.mersForm.controls['exitDate1'].setValue(
          this.datePipe.transform(this.mersForm.value.exitDate1, 'yyyy-MM-dd')
        );
        this.mersForm.controls['exitDate2'].setValue(
          this.datePipe.transform(this.mersForm.value.exitDate2, 'yyyy-MM-dd')
        );
        this.mersForm.controls['exitDate3'].setValue(
          this.datePipe.transform(this.mersForm.value.exitDate3, 'yyyy-MM-dd')
        );
        this.mersForm.controls['exitDate4'].setValue(
          this.datePipe.transform(this.mersForm.value.exitDate4, 'yyyy-MM-dd')
        );
        this.mersForm.controls['exitDate5'].setValue(
          this.datePipe.transform(this.mersForm.value.exitDate5, 'yyyy-MM-dd')
        );
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
        this.mersForm.controls['dateTravelOutsideEgypt'].setValue(
          this.datePipe.transform(
            this.mersForm.value.dateTravelOutsideEgypt,
            'yyyy-MM-dd'
          )
        );
        this.mersForm.controls['returnDateOutsideEgypt'].setValue(
          this.datePipe.transform(
            this.mersForm.value.returnDateOutsideEgypt,
            'yyyy-MM-dd'
          )
        );
        this.mersForm.controls['dateTravelWithinEgypt'].setValue(
          this.datePipe.transform(
            this.mersForm.value.dateTravelWithinEgypt,
            'yyyy-MM-dd'
          )
        );
        this.mersForm.controls['returnDateWithinEgypt'].setValue(
          this.datePipe.transform(
            this.mersForm.value.dateTravelWithinEgypt,
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

        //
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

    console.log(this.mersForm.value);
    if (this.mersForm.value.id != null) {
      this.investigationService.updateSeveremers(this.mersForm.value).subscribe(
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
        .addInvestigationmers(this.mersForm.value)
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
}
