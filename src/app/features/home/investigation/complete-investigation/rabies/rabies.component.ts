import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { UserMessageService } from 'src/app/core/services/user.message.service';
import { InvestigationService } from '../../services/investigation.service';
import { TranslateService } from '@ngx-translate/core';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-rabies',
  templateUrl: './rabies.component.html',
  styleUrls: ['./rabies.component.css']
})
export class RabiesComponent implements OnInit {
  currentLang =
    localStorage.getItem('ls.currentLang') !== undefined &&
      localStorage.getItem('ls.currentLang') !== 'undefined'
      ? localStorage.getItem('ls.currentLang')
      : 'ar';
  rabiesForm: FormGroup
  currentId: any;
  allFilledControlsCount: number = 0;
  allControllesCount: number = 0;
  patientName: string;
  diseaseGroupId: any;
  constructor(private investigationService: InvestigationService,
    private translateService: TranslateService,
    private userMsg: UserMessageService, private datePipe:DatePipe) {
    if (this.investigationService.patient.firstName != null && this.investigationService.patient.firstName != undefined) {
      this.patientName = this.investigationService.patient.firstName + " " + this.investigationService.patient.secondName + " " + this.investigationService.patient.thirdName;
    }

    if (this.diseaseGroupId == null || this.diseaseGroupId == undefined) {
      this.diseaseGroupId = this.investigationService.diseaseGroupID;
    }
    if (this.currentId == null) {
      this.currentId = this.investigationService.currentid;
    }
  }

  ngOnInit() {
    this.rabiesForm = new FormGroup({
      fever: new FormControl(),
      feverDays: new FormControl(),
      maxTemperature: new FormControl(),
      hydrophobia: new FormControl(),
      behavioralChanges: new FormControl(),
      aerophobia: new FormControl(),
      numbness: new FormControl(),
      motherSiteOfBite: new FormControl(),
      completeParalysis: new FormControl(),
      increasedSalivation: new FormControl(),
      changeVoice: new FormControl(),
      completeComa: new FormControl(),
      contactSuspectedCase: new FormControl(),
      contactConfirmedCase: new FormControl(),
      numberOfDirectContacts: new FormControl(),
      numberOfIndirectContacts: new FormControl(),
      followD1Name: new FormControl(),
      followD1Age: new FormControl(),
      followD1Phone: new FormControl(),
      followD1Type: new FormControl(),
      followD1MixingType: new FormControl(),
      followD1RelationshipSituation: new FormControl(),
      followD1DateOfSymptoms: new FormControl(),
      followD1Fever: new FormControl(),
      followD1DryCough: new FormControl(),
      followD1CoughingWithSpitting: new FormControl(),
      followD1SoreThroat: new FormControl(),
      followD1DifficultyBreathing: new FormControl(),
      followD1JointPain: new FormControl(),
      followD1vomit: new FormControl(),
      followD1Diarrhea: new FormControl(),
      followD1Other: new FormControl(),
      followD1OtherSymptoms: new FormControl(),
      followD1SampleTaken: new FormControl(),
      followD1DateSampleTaken: new FormControl(),
      followD1SampleResult: new FormControl(),
      followD2Name: new FormControl(),
      followD2Age: new FormControl(),
      followD2Phone: new FormControl(),
      followD2Type: new FormControl(),
      followD2MixingType: new FormControl(),
      followD2RelationshipSituation: new FormControl(),
      followD2DateOfSymptoms: new FormControl(),
      followD2Fever: new FormControl(),
      followD2DryCough: new FormControl(),
      followD2CoughingWithSpitting: new FormControl(),
      followD2SoreThroat: new FormControl(),
      followD2DifficultyBreathing: new FormControl(),
      followD2JointPain: new FormControl(),
      followD2vomit: new FormControl(),
      followD2Diarrhea: new FormControl(),
      followD2Other: new FormControl(),
      followD2OtherSymptoms: new FormControl(),
      followD2SampleTaken: new FormControl(),
      followD2DateSampleTaken: new FormControl(),
      followD2SampleResult: new FormControl(),
      followD7Name: new FormControl(),
      followD7Age: new FormControl(),
      followD7Phone: new FormControl(),
      followD7Type: new FormControl(),
      followD7MixingType: new FormControl(),
      followD7RelationshipSituation: new FormControl(),
      followD7DateOfSymptoms: new FormControl(),
      followD7Fever: new FormControl(),
      followD7DryCough: new FormControl(),
      followD7CoughingWithSpitting: new FormControl(),
      followD7SoreThroat: new FormControl(),
      followD7DifficultyBreathing: new FormControl(),
      followD7JointPain: new FormControl(),
      followD7vomit: new FormControl(),
      followD7Diarrhea: new FormControl(),
      followD7Other: new FormControl(),
      followD7OtherSymptoms: new FormControl(),
      followD7SampleTaken: new FormControl(),
      followD7DateSampleTaken: new FormControl(),
      followD7SampleResult: new FormControl(),
      followD14Name: new FormControl(),
      followD14Age: new FormControl(),
      followD14Phone: new FormControl(),
      followD14Type: new FormControl(),
      followD14MixingType: new FormControl(),
      followD14RelationshipSituation: new FormControl(),
      followD14DateOfSymptoms: new FormControl(),
      followD14Fever: new FormControl(),
      followD14DryCough: new FormControl(),
      followD14CoughingWithSpitting: new FormControl(),
      followD14SoreThroat: new FormControl(),
      followD14DifficultyBreathing: new FormControl(),
      followD14JointPain: new FormControl(),
      followD14vomit: new FormControl(),
      followD14Diarrhea: new FormControl(),
      followD14Other: new FormControl(),
      followD14OtherSymptoms: new FormControl(),
      followD14SampleTaken: new FormControl(),
      followD14DateSampleTaken: new FormControl(),
      followD14SampleResult: new FormControl(),
      patientExposedVenom: new FormControl(),
      kindOfAnimal: new FormControl(),
      incidentDetail: new FormControl(),
      dateIncident: new FormControl(),
      biteInBody: new FormControl(),
      aqarDescription: new FormControl(),
      moreBites: new FormControl(),
      placementsBarren: new FormControl(),
      woundBeenWashed: new FormControl(),
      reasonNotMentioned: new FormControl(),
      woundSuturedDone: new FormControl(),
      reasonIsNotMentioned: new FormControl(),
      vaccinatedAgainstRabies: new FormControl(),
      zeroDose: new FormControl(),
      firstDose: new FormControl(),
      secondDose: new FormControl(),
      thirdDose: new FormControl(),
      fourthDose: new FormControl(),
      fifthDose: new FormControl(),
      healthFacility: new FormControl(),
      reasonNotReceivingDoses: new FormControl(),
      patientReceiveSerum: new FormControl(),
      unitDose: new FormControl(),
      patientWeight: new FormControl(),
      dateTheSerum: new FormControl(),
      nameHealthFacility: new FormControl(),
      barrenAnimal: new FormControl(),
      changeBehavioAnimal: new FormControl(),
      animalReceiveVaccinations: new FormControl(),
      waAnimalExcited: new FormControl(),
      bittenBySameAnimal: new FormControl(),
      attach: new FormControl(),
      veterinaryUnitsNotified: new FormControl(),
      notifiedAttach: new FormControl(),
      barrenAnimalCaptured: new FormControl(),
      testedLaboratory: new FormControl(),
      suffersFromRabies: new FormControl(),
      dateOfDeath: new FormControl(),
      deathPlace: new FormControl(),
      placeMentioned: new FormControl(),
      id: new FormControl(),
      patientID: new FormControl(),
      diseaseGroupId: new FormControl(),
      investigationCompletePercentage: new FormControl(),
    })
    this.currentId = this.investigationService.currentid;
    this.rabiesForm.controls['patientID'].setValue(this.currentId);
    this.rabiesForm.controls['diseaseGroupId'].setValue(this.diseaseGroupId);
    this.investigationService.getByIdRabies(this.currentId).subscribe(
      res => {
        console.log(res);
        var v = res.data;
        this.rabiesForm.patchValue(v);

        //Dates
        this.rabiesForm.controls['followD1DateOfSymptoms'].setValue(this.datePipe.transform(this.rabiesForm.value.followD1DateOfSymptoms, 'yyyy-MM-dd'));
        this.rabiesForm.controls['followD1DateSampleTaken'].setValue(this.datePipe.transform(this.rabiesForm.value.followD1DateSampleTaken, 'yyyy-MM-dd'));
        this.rabiesForm.controls['followD2DateOfSymptoms'].setValue(this.datePipe.transform(this.rabiesForm.value.followD2DateOfSymptoms, 'yyyy-MM-dd'));
        this.rabiesForm.controls['followD2DateSampleTaken'].setValue(this.datePipe.transform(this.rabiesForm.value.followD2DateSampleTaken, 'yyyy-MM-dd'));
        this.rabiesForm.controls['followD7DateOfSymptoms'].setValue(this.datePipe.transform(this.rabiesForm.value.followD7DateOfSymptoms, 'yyyy-MM-dd'));
        this.rabiesForm.controls['followD7DateSampleTaken'].setValue(this.datePipe.transform(this.rabiesForm.value.followD7DateSampleTaken, 'yyyy-MM-dd'));
        this.rabiesForm.controls['followD14DateOfSymptoms'].setValue(this.datePipe.transform(this.rabiesForm.value.followD14DateOfSymptoms, 'yyyy-MM-dd'));
        this.rabiesForm.controls['dateIncident'].setValue(this.datePipe.transform(this.rabiesForm.value.dateIncident, 'yyyy-MM-dd'));
        this.rabiesForm.controls['zeroDose'].setValue(this.datePipe.transform(this.rabiesForm.value.zeroDose, 'yyyy-MM-dd'));
        this.rabiesForm.controls['firstDose'].setValue(this.datePipe.transform(this.rabiesForm.value.firstDose, 'yyyy-MM-dd'));
        this.rabiesForm.controls['secondDose'].setValue(this.datePipe.transform(this.rabiesForm.value.secondDose, 'yyyy-MM-dd'));
        this.rabiesForm.controls['thirdDose'].setValue(this.datePipe.transform(this.rabiesForm.value.thirdDose, 'yyyy-MM-dd'));
        this.rabiesForm.controls['fourthDose'].setValue(this.datePipe.transform(this.rabiesForm.value.fourthDose, 'yyyy-MM-dd'));
        this.rabiesForm.controls['fifthDose'].setValue(this.datePipe.transform(this.rabiesForm.value.fifthDose, 'yyyy-MM-dd'));
        this.rabiesForm.controls['dateTheSerum'].setValue(this.datePipe.transform(this.rabiesForm.value.dateTheSerum, 'yyyy-MM-dd'));
        this.rabiesForm.controls['dateOfDeath'].setValue(this.datePipe.transform(this.rabiesForm.value.dateOfDeath, 'yyyy-MM-dd'));
        
        //Radio Buttons
        this.rabiesForm.patchValue({fever:this.rabiesForm.value.fever + '',tc: true});
        this.rabiesForm.patchValue({hydrophobia:this.rabiesForm.value.hydrophobia + '',tc: true});
        this.rabiesForm.patchValue({behavioralChanges:this.rabiesForm.value.behavioralChanges + '',tc: true});
        this.rabiesForm.patchValue({aerophobia:this.rabiesForm.value.aerophobia + '',tc: true});
        this.rabiesForm.patchValue({numbness:this.rabiesForm.value.numbness + '',tc: true});
        this.rabiesForm.patchValue({motherSiteOfBite:this.rabiesForm.value.motherSiteOfBite + '',tc: true});
        this.rabiesForm.patchValue({completeParalysis:this.rabiesForm.value.completeParalysis + '',tc: true});
        this.rabiesForm.patchValue({increasedSalivation:this.rabiesForm.value.increasedSalivation + '',tc: true});
        this.rabiesForm.patchValue({changeVoice:this.rabiesForm.value.changeVoice + '',tc: true});
        this.rabiesForm.patchValue({completeComa:this.rabiesForm.value.completeComa + '',tc: true});
        this.rabiesForm.patchValue({contactSuspectedCase:this.rabiesForm.value.contactSuspectedCase + '',tc: true});
        this.rabiesForm.patchValue({contactConfirmedCase:this.rabiesForm.value.contactConfirmedCase + '',tc: true});
        this.rabiesForm.patchValue({followD1SampleTaken:this.rabiesForm.value.followD1SampleTaken + '',tc: true});
        this.rabiesForm.patchValue({followD1SampleResult:this.rabiesForm.value.followD1SampleResult + '',tc: true});
        this.rabiesForm.patchValue({followD2SampleTaken:this.rabiesForm.value.followD2SampleTaken + '',tc: true});
        this.rabiesForm.patchValue({followD2SampleResult:this.rabiesForm.value.followD2SampleResult + '',tc: true});
        this.rabiesForm.patchValue({followD7SampleTaken:this.rabiesForm.value.followD7SampleTaken + '',tc: true});
        this.rabiesForm.patchValue({followD7SampleResult:this.rabiesForm.value.followD7SampleResult + '',tc: true});
        this.rabiesForm.patchValue({followD14SampleTaken:this.rabiesForm.value.followD14SampleTaken + '',tc: true});
        this.rabiesForm.patchValue({followD14SampleResult:this.rabiesForm.value.followD14SampleResult + '',tc: true});

        this.calculateCompletionPercentage();
      }
      , (error) => {
        this.translateService
          .get('NEDSS.COMMON.SENT_FAILD')
          .subscribe((res: string) => {
            this.userMsg.error(res);
          });
      }
    )
  }
  save() {
    Object.entries(this.rabiesForm.controls).map(([key, value], index) => {
      if (value.value == 'null')
        value.setValue(null);
    });
    this.calculateCompletionPercentage();
    this.rabiesForm.controls['investigationCompletePercentage'].setValue(parseFloat(((this.allFilledControlsCount / this.allControllesCount) * 100).toFixed(2)));
    this.rabiesForm.controls['diseaseGroupId'].setValue(this.diseaseGroupId);
    if (this.rabiesForm.value.id != null) {
      this.investigationService.updateRabies(this.rabiesForm.value).subscribe(
        (response: any) => {
          if (response) {
            this.translateService
              .get('NEDSS.COMMON.SENT_SUCESSFULLY')
              .subscribe((res: string) => {
                this.userMsg.success(res);
              });
          }
        }
        , (error) => {
          this.translateService
            .get('NEDSS.COMMON.SENT_FAILD')
            .subscribe((res: string) => {
              this.userMsg.error(res);
            });
        }
      )
    } else {
      this.investigationService.addInvestigationRabies(this.rabiesForm.value).subscribe(
        (response: any) => {

          if (response) {
            this.translateService
              .get('NEDSS.COMMON.SENT_SUCESSFULLY')
              .subscribe((res: string) => {
                this.userMsg.success(res);
              });
          }
        }
        , (error) => {
          this.translateService
            .get('NEDSS.COMMON.SENT_FAILD')
            .subscribe((res: string) => {
              this.userMsg.error(res);
            });
        }
      )
    }
  }

  //BL
  calculateCompletionPercentage() {
    this.allFilledControlsCount = 0;
    const data = this.rabiesForm.value;
    //Exclude fields you don't want to count (like 'id')
    const excludedFields = ['id', 'patientID', 'investigationCompletePercentage', 'diseaseGroupId', 'createdDate', 'genderDay1'];
    const totalFields = Object.keys(data).filter(key => !excludedFields.includes(key)).length;

    this.allControllesCount = totalFields;

    Object.keys(data).forEach((key) => {
      if (!excludedFields.includes(key) && data[key] !== null && data[key] !== '' && data[key] !== 'null' && data[key] !== null) {
        this.allFilledControlsCount++;
      }
      else {
        console.log(key);
      }
    });
  }
}
