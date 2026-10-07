import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { UserMessageService } from 'src/app/core/services/user.message.service';
import { InvestigationService } from '../../services/investigation.service';
import { TranslateService } from '@ngx-translate/core';
import { DatePipe } from '@angular/common';
@Component({
  selector: 'app-plague',
  host: { class: 'investigation-form' },
  templateUrl: './plague.component.html',
  styleUrls: ['./plague.component.css']
})
export class PlagueComponent implements OnInit {
  currentLang =
    localStorage.getItem('ls.currentLang') !== undefined &&
      localStorage.getItem('ls.currentLang') !== 'undefined'
      ? localStorage.getItem('ls.currentLang')
      : 'ar';
  plagueForm: FormGroup;
  allFilledControlsCount: number = 0;
  allControllesCount: number = 0;
  patientName: string;
  constructor(private investigationService: InvestigationService,
    private translateService: TranslateService,
    private userMsg: UserMessageService,
    private datePipe: DatePipe) { 
      if (this.investigationService.patient.firstName != null && this.investigationService.patient.firstName != undefined) {
        this.patientName = this.investigationService.patient.firstName + " " + this.investigationService.patient.secondName + " " + this.investigationService.patient.thirdName;
      }
    }
  currentId: any;
  ngOnInit() {
    this.plagueForm = new FormGroup({
      contactWithSuspectedCase: new FormControl(),
      partEpidemicOutbreakOrSimilarSituation: new FormControl(),
      contactWithConfirmedCase: new FormControl(),
      contactDeceasedPersonUnknownRespiratoryDisease: new FormControl(),
      theNumberDirectContacts: new FormControl(),
      theNumberIndirectContacts: new FormControl(),
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

      patientLiveWithRat: new FormControl(),
      infectedRabbits: new FormControl(),
      deadRatsInLargeNumbers: new FormControl(),
      infectedOrDeadDogs: new FormControl(),
      fleasPresence: new FormControl(),
      patientOutsideCountry: new FormControl(),
      stateTheCountry: new FormControl(),
      reasonForTravel: new FormControl(),
      goDate: new FormControl(),
      returnDate: new FormControl(),
      investigationDate: new FormControl(),
      surveillanceOfficer: new FormControl(),
      healthMonitorName: new FormControl(),
      administrationDirector: new FormControl(),
      patientID: new FormControl(),
      id: new FormControl(),
      investigationCompletePercentage: new FormControl(),
      diseaseGroupId: new FormControl(this.investigationService.diseaseGroupID),
    })
    this.currentId = this.investigationService.currentid
    this.plagueForm.controls['patientID'].setValue(this.currentId)
    this.investigationService.getByIdPlague(this.currentId).subscribe(
      res => {
        console.log(res);
        var v = res.data;
        this.plagueForm.patchValue(v)
        this.plagueForm.patchValue({ contactWithSuspectedCase: this.plagueForm.value.contactWithSuspectedCase + "", tc: true });
        this.plagueForm.patchValue({ partEpidemicOutbreakOrSimilarSituation: this.plagueForm.value.partEpidemicOutbreakOrSimilarSituation + "", tc: true });
        this.plagueForm.patchValue({ contactWithConfirmedCase: this.plagueForm.value.contactWithConfirmedCase + "", tc: true });
        this.plagueForm.patchValue({ contactDeceasedPersonUnknownRespiratoryDisease: this.plagueForm.value.contactDeceasedPersonUnknownRespiratoryDisease + "", tc: true });

        //days
        //followD1DateOfSymptoms
        this.plagueForm.controls['followD1DateOfSymptoms'].setValue(this.datePipe.transform(this.plagueForm.value.followD1DateOfSymptoms, 'yyyy-MM-dd'));
        this.plagueForm.patchValue({ followD1SampleTaken: this.plagueForm.value.followD1SampleTaken + "", tc: true });
        this.plagueForm.controls['followD1DateSampleTaken'].setValue(this.datePipe.transform(this.plagueForm.value.followD1DateSampleTaken, 'yyyy-MM-dd'));
        this.plagueForm.patchValue({ followD1SampleResult: this.plagueForm.value.followD1SampleResult + "", tc: true });
        //
        this.plagueForm.controls['followD2DateOfSymptoms'].setValue(this.datePipe.transform(this.plagueForm.value.followD2DateOfSymptoms, 'yyyy-MM-dd'));
        this.plagueForm.patchValue({ followD2SampleTaken: this.plagueForm.value.followD2SampleTaken + "", tc: true });
        this.plagueForm.controls['followD2DateSampleTaken'].setValue(this.datePipe.transform(this.plagueForm.value.followD2DateSampleTaken, 'yyyy-MM-dd'));
        this.plagueForm.patchValue({ followD2SampleResult: this.plagueForm.value.followD2SampleResult + "", tc: true });

        //
        this.plagueForm.controls['followD7DateOfSymptoms'].setValue(this.datePipe.transform(this.plagueForm.value.followD7DateOfSymptoms, 'yyyy-MM-dd'));
        this.plagueForm.patchValue({ followD7SampleTaken: this.plagueForm.value.followD7SampleTaken + "", tc: true });
        this.plagueForm.controls['followD7DateSampleTaken'].setValue(this.datePipe.transform(this.plagueForm.value.followD7DateSampleTaken, 'yyyy-MM-dd'));
        this.plagueForm.patchValue({ followD7SampleResult: this.plagueForm.value.followD7SampleResult + "", tc: true });
        //
        this.plagueForm.controls['followD14DateOfSymptoms'].setValue(this.datePipe.transform(this.plagueForm.value.followD14DateOfSymptoms, 'yyyy-MM-dd'));
        this.plagueForm.patchValue({ followD14SampleTaken: this.plagueForm.value.followD14SampleTaken + "", tc: true });
        this.plagueForm.controls['followD14DateSampleTaken'].setValue(this.datePipe.transform(this.plagueForm.value.followD14DateSampleTaken, 'yyyy-MM-dd'));
        this.plagueForm.patchValue({ followD14SampleResult: this.plagueForm.value.followD14SampleResult + "", tc: true });
        //goDate
        this.plagueForm.controls['goDate'].setValue(this.datePipe.transform(this.plagueForm.value.goDate, 'yyyy-MM-dd'));
        //returnDate
        this.plagueForm.controls['returnDate'].setValue(this.datePipe.transform(this.plagueForm.value.returnDate, 'yyyy-MM-dd'));
        this.plagueForm.controls['investigationDate'].setValue(this.datePipe.transform(this.plagueForm.value.investigationDate, 'yyyy-MM-dd'));


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
    Object.entries(this.plagueForm.controls).map(([key, value], index) => {
      if (value.value == 'null')
        value.setValue(null);
    })
    this.calculateCompletionPercentage();
    this.plagueForm.controls['diseaseGroupId'].setValue(this.investigationService.diseaseGroupID);
    this.plagueForm.controls['investigationCompletePercentage'].setValue(parseFloat(((this.allFilledControlsCount / this.allControllesCount) * 100).toFixed(2)));
    //console.log(this.plagueForm.value);
    if (this.plagueForm.value.id != null) {
      this.investigationService.updatePlague(this.plagueForm.value).subscribe(
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
        }
      )
    } else {
      this.investigationService.addInvestigationPlague(this.plagueForm.value).subscribe(
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
        }
      )
    }
  }

         //BL
         calculateCompletionPercentage() {
          this.allFilledControlsCount = 0;
          const data = this.plagueForm.value;
          //Exclude fields you don't want to count (like 'id')
          const excludedFields = ['id', 'patientID', 'investigationCompletePercentage', 'diseaseGroupId', 'createdDate'];
          const totalFields = Object.keys(data).filter(key => !excludedFields.includes(key)).length;
      
          this.allControllesCount = totalFields;
      
          Object.keys(data).forEach((key) => {
            if (!excludedFields.includes(key) && data[key] !== null && data[key] !== '' && data[key] !== 'null') {
              this.allFilledControlsCount++;
            }
          });
        }
}
