import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { UserMessageService } from 'src/app/core/services/user.message.service';
import { InvestigationService } from '../../services/investigation.service';
import { TranslateService } from '@ngx-translate/core';
import { DatePipe } from '@angular/common';
@Component({
  selector: 'app-hemorrhagic-fevers',
  templateUrl: './hemorrhagic-fevers.component.html',
  styleUrls: ['./hemorrhagic-fevers.component.css']
})
export class HemorrhagicFeversComponent implements OnInit {
    currentLang =
      localStorage.getItem('ls.currentLang') !== undefined &&
        localStorage.getItem('ls.currentLang') !== 'undefined'
        ? localStorage.getItem('ls.currentLang')
        : 'ar';
  hemorrhagicForm: FormGroup;
  allFilledControlsCount: number = 0;
  allControllesCount: number = 0;
  patientName: string = '';
  constructor(private investigationService: InvestigationService, private datePipe: DatePipe,
    private translateService: TranslateService,
    private userMsg: UserMessageService) { }
  currentId: any;
  ngOnInit() {
    this.hemorrhagicForm = new FormGroup({
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
      // followD1SampleTaken: new FormControl(2),
      followD1SampleTaken: new FormControl(),
      followD1DateSampleTaken: new FormControl(),
      // followD1SampleResult: new FormControl(2),
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
      // followD2SampleTaken: new FormControl(2),
      followD2SampleTaken: new FormControl(),
      followD2DateSampleTaken: new FormControl(),
      // followD2SampleResult: new FormControl(2),
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
      // followD14SampleTaken: new FormControl(2),
      followD14SampleTaken: new FormControl(),
      followD14DateSampleTaken: new FormControl(),
      // followD14SampleResult: new FormControl(2),
      followD14SampleResult: new FormControl(),

      mosquitoBittenInjury: new FormControl(),
      exposedBloodSecretionsExcretions: new FormControl(),
      exposedGorillasChimpanzees: new FormControl(),
      bittenTick: new FormControl(),
      cattleExposed: new FormControl(),
      batExposed: new FormControl(),
      outCountry: new FormControl(),
      nameCountry: new FormControl(),
      reasonTraveling: new FormControl(),
      departureDate: new FormControl(),
      returnDate: new FormControl(),
      yellowFeverVaccine: new FormControl(),
      vaccinationHistory: new FormControl(),
      ebolaVaccine: new FormControl(),
      date: new FormControl(),
      healthCareExposedCondition: new FormControl(),
      placeExposure: new FormControl(),
      employedResearchLaboratories: new FormControl(),
      contactInfectedCountry: new FormControl(),
      nationality: new FormControl(),
      hemorrhagicFever: new FormControl(),
      hemorrhagicFeverdate: new FormControl(),
      patientID: new FormControl(),
      id: new FormControl(),
      diseaseGroupId: new FormControl(this.investigationService.diseaseGroupID),
      investigationCompletePercentage:new FormControl()
    })
    this.currentId = this.investigationService.currentid
    this.patientName =
      (this.investigationService.patient?.firstName || '') + ' ' +
      (this.investigationService.patient?.secondName || '') + ' ' +
      (this.investigationService.patient?.thirdName || '');
    this.hemorrhagicForm.controls['patientID'].setValue(this.currentId)
    this.investigationService.getByIdHemorrhagicFever(this.currentId).subscribe(
      res => {
        console.log(res);
        var v = res.data;


        // if (v.followD1SampleTaken == null) { v.followD1SampleTaken = 2; }
        // if (v.followD2SampleTaken == null) { v.followD2SampleTaken = 2; }
        // if (v.followD7SampleTaken == null) { v.followD7SampleTaken = 2; }
        // if (v.followD14SampleTaken == null) { v.followD14SampleTaken = 2; }
        // //followD1SampleResult
        // if (v.followD1SampleResult == null) { v.followD1SampleResult = 2; }
        // if (v.followD2SampleResult == null) { v.followD2SampleResult = 2; }
        // if (v.followD7SampleResult == null) { v.followD7SampleResult = 2; }
        // if (v.followD14SampleResult == null) { v.followD14SampleResult = 2; }
        this.hemorrhagicForm.patchValue(v)
        this.hemorrhagicForm.patchValue({ followD1SampleTaken: this.hemorrhagicForm.value.followD1SampleTaken + "", tc: true });
        // this.hemorrhagicForm.controls['dateDiagnosisPneumonia'].setValue(this.datePipe.transform(this.hemorrhagicForm.value.dateDiagnosisPneumonia, 'yyyy-MM-dd'));
        this.hemorrhagicForm.patchValue({ followD1SampleResult: this.hemorrhagicForm.value.followD1SampleResult + "", tc: true });
        this.hemorrhagicForm.patchValue({ followD2SampleResult: this.hemorrhagicForm.value.followD2SampleResult + "", tc: true });
        this.hemorrhagicForm.patchValue({ followD7SampleResult: this.hemorrhagicForm.value.followD7SampleResult + "", tc: true });
        this.hemorrhagicForm.patchValue({ followD14SampleResult: this.hemorrhagicForm.value.followD14SampleResult + "", tc: true });
        this.hemorrhagicForm.patchValue({ followD2SampleTaken: this.hemorrhagicForm.value.followD2SampleTaken + "", tc: true });
        this.hemorrhagicForm.patchValue({ followD7SampleTaken: this.hemorrhagicForm.value.followD7SampleTaken + "", tc: true });
        this.hemorrhagicForm.patchValue({ followD14SampleTaken: this.hemorrhagicForm.value.followD14SampleTaken + "", tc: true });
        this.hemorrhagicForm.controls['followD1DateSampleTaken'].setValue(this.datePipe.transform(this.hemorrhagicForm.value.followD1DateSampleTaken, 'yyyy-MM-dd'));
        this.hemorrhagicForm.controls['followD2DateSampleTaken'].setValue(this.datePipe.transform(this.hemorrhagicForm.value.followD2DateSampleTaken, 'yyyy-MM-dd'));
        this.hemorrhagicForm.controls['followD7DateSampleTaken'].setValue(this.datePipe.transform(this.hemorrhagicForm.value.followD7DateSampleTaken, 'yyyy-MM-dd'));
        this.hemorrhagicForm.controls['followD14DateSampleTaken'].setValue(this.datePipe.transform(this.hemorrhagicForm.value.followD14DateSampleTaken, 'yyyy-MM-dd'));
        this.hemorrhagicForm.controls['returnDate'].setValue(this.datePipe.transform(this.hemorrhagicForm.value.returnDate, 'yyyy-MM-dd'));
        this.hemorrhagicForm.controls['departureDate'].setValue(this.datePipe.transform(this.hemorrhagicForm.value.departureDate, 'yyyy-MM-dd'));
        this.hemorrhagicForm.controls['vaccinationHistory'].setValue(this.datePipe.transform(this.hemorrhagicForm.value.vaccinationHistory, 'yyyy-MM-dd'));
        this.hemorrhagicForm.controls['date'].setValue(this.datePipe.transform(this.hemorrhagicForm.value.date, 'yyyy-MM-dd'));
        this.hemorrhagicForm.controls['hemorrhagicFeverdate'].setValue(this.datePipe.transform(this.hemorrhagicForm.value.hemorrhagicFeverdate, 'yyyy-MM-dd'));
        this.hemorrhagicForm.controls['followD1DateOfSymptoms'].setValue(this.datePipe.transform(this.hemorrhagicForm.value.followD1DateOfSymptoms, 'yyyy-MM-dd'));
        this.hemorrhagicForm.controls['followD2DateOfSymptoms'].setValue(this.datePipe.transform(this.hemorrhagicForm.value.followD2DateOfSymptoms, 'yyyy-MM-dd'));
        this.hemorrhagicForm.controls['followD7DateOfSymptoms'].setValue(this.datePipe.transform(this.hemorrhagicForm.value.followD7DateOfSymptoms, 'yyyy-MM-dd'));
        this.hemorrhagicForm.controls['followD14DateOfSymptoms'].setValue(this.datePipe.transform(this.hemorrhagicForm.value.followD14DateOfSymptoms, 'yyyy-MM-dd'));
        console.log('model',this.hemorrhagicForm.value);
      }
      , (error) => {
        this.translateService
          .get('NEDSS.COMMON.SENT_FAILD')
          .subscribe((res: string) => {
            this.userMsg.error(res);
          });
      }, () => {
        this.calculateCompletionPercentage();
      }
    )

  }
  save() {
    Object.entries(this.hemorrhagicForm.controls).map(([key, value], index) => {
      if (value.value == 'null')
        value.setValue(null);
    })
    this.calculateCompletionPercentage();
    this.hemorrhagicForm.controls['investigationCompletePercentage'].setValue(parseFloat(((this.allFilledControlsCount / this.allControllesCount) * 100).toFixed(2)));
    this.hemorrhagicForm.controls['diseaseGroupId'].setValue(this.investigationService.diseaseGroupID);
    console.log("Look here" , this.hemorrhagicForm.value);
    if (this.hemorrhagicForm.value.id != null) {
      this.investigationService.updateHemorrhagicFever(this.hemorrhagicForm.value).subscribe(
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
      this.investigationService.addInvestigationHemorrhagicFever(this.hemorrhagicForm.value).subscribe(
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
  calculateCompletionPercentage() {
    this.allFilledControlsCount = 0;
    const data = this.hemorrhagicForm.value;
    // Exclude fields you don't want to count (like 'id')
    const excludedFields = ['id','patientID','diseaseGroupId','investigationCompletePercentage'];
    const totalFields = Object.keys(data).filter(key => !excludedFields.includes(key)).length;
    this.allControllesCount = totalFields;
    Object.keys(data).forEach((key) => {
        if (!excludedFields.includes(key) && data[key] !== null && data[key] !== '' && data[key] !== 'null') {
            console.log('data');
            console.log(data);
            this.allFilledControlsCount++;
        }
    });
  }
}
