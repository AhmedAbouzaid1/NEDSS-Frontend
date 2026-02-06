import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { UserMessageService } from 'src/app/core/services/user.message.service';
import { InvestigationService } from '../../services/investigation.service';
import { TranslateService } from '@ngx-translate/core';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-false-chickenpox',
  templateUrl: './false-chickenpox.component.html',
  styleUrls: ['./false-chickenpox.component.css']
})
export class FalseChickenpoxComponent implements OnInit {
  currentLang =
    localStorage.getItem('ls.currentLang') !== undefined &&
      localStorage.getItem('ls.currentLang') !== 'undefined'
      ? localStorage.getItem('ls.currentLang')
      : 'ar';

  allFilledControlsCount: number = 0;
  allControllesCount: number = 0;
  patientName: string;
  falseChickenpoxForm: FormGroup
  currentId: any;
  constructor(private investigationService: InvestigationService,
    private translateService: TranslateService,
    private userMsg: UserMessageService,
    public datePipe: DatePipe) {
    if (this.investigationService.patient.firstName != null && this.investigationService.patient.firstName != undefined) {
      this.patientName = this.investigationService.patient.firstName + " " + this.investigationService.patient.secondName + " " + this.investigationService.patient.thirdName;
    }
  }

  ngOnInit() {

    this.falseChickenpoxForm = new FormGroup({
      fever: new FormControl(),
      feverDays: new FormControl(),
      maxTemperature: new FormControl(),
      presenceVesicularRash: new FormControl(),
      onsetRash: new FormControl(),

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
      patientID: new FormControl(),
      id: new FormControl(),
      diseaseGroupId: new FormControl(this.investigationService.diseaseGroupID),
      investigationCompletePercentage: new FormControl(),
    })
    this.currentId = this.investigationService.currentid
    this.falseChickenpoxForm.controls['patientID'].setValue(this.currentId)
    this.investigationService.getByIdFalseChickenpox(this.currentId).subscribe(
      res => {
        console.log(res);
        var v = res.data;
        // if (v.isSampleTakenDay1 == null) { v.isSampleTakenDay1 = 2; }
        // if (v.isSampleTakenDay2 == null) { v.isSampleTakenDay2 = 2; }
        // if (v.isSampleTakenDay7 == null) { v.isSampleTakenDay7 = 2; }
        // if (v.isSampleTakenDay14 == null) { v.isSampleTakenDay14 = 2; }
        // //followD1SampleResult
        // if (v.sampleResultDay1 == null) { v.sampleResultDay1 = 2; }
        // if (v.sampleResultDay2 == null) { v.sampleResultDay2 = 2; }
        // if (v.sampleResultDay7 == null) { v.sampleResultDay7 = 2; }
        // if (v.sampleResultDay14 == null) { v.sampleResultDay14 = 2; }
        this.falseChickenpoxForm.patchValue(v)
        this.falseChickenpoxForm.patchValue({ fever: this.falseChickenpoxForm.value.fever + "", tc: true });
        this.falseChickenpoxForm.patchValue({ presenceVesicularRash: this.falseChickenpoxForm.value.presenceVesicularRash + "", tc: true });

        this.falseChickenpoxForm.controls['onsetRash'].setValue(this.datePipe.transform(this.falseChickenpoxForm.value.onsetRash, 'yyyy-MM-dd'));
        this.falseChickenpoxForm.patchValue({ contactSuspectedCase: this.falseChickenpoxForm.value.presenceVesicularRash + "", tc: true });
        this.falseChickenpoxForm.patchValue({ epidemicOutbreak: this.falseChickenpoxForm.value.epidemicOutbreak + "", tc: true });
        this.falseChickenpoxForm.patchValue({ contactConfirmedCase: this.falseChickenpoxForm.value.contactConfirmedCase + "", tc: true });
        this.falseChickenpoxForm.patchValue({ contactDeceasedPersonRespiratory: this.falseChickenpoxForm.value.contactDeceasedPersonRespiratory + "", tc: true });
        //d1

        this.falseChickenpoxForm.controls['dateOnsetSymptomsDay1'].setValue(this.datePipe.transform(this.falseChickenpoxForm.value.dateOnsetSymptomsDay1, 'yyyy-MM-dd'));
        this.falseChickenpoxForm.patchValue({ isSampleTakenDay1: this.falseChickenpoxForm.value.isSampleTakenDay1 + "", tc: true });
        this.falseChickenpoxForm.controls['dateSampleTakenDay1'].setValue(this.datePipe.transform(this.falseChickenpoxForm.value.dateSampleTakenDay1, 'yyyy-MM-dd'));
        this.falseChickenpoxForm.patchValue({ sampleResultDay1: this.falseChickenpoxForm.value.sampleResultDay1 + "", tc: true });
        //
        //d2

        this.falseChickenpoxForm.controls['dateOnsetSymptomsDay2'].setValue(this.datePipe.transform(this.falseChickenpoxForm.value.dateOnsetSymptomsDay2, 'yyyy-MM-dd'));
        this.falseChickenpoxForm.patchValue({ isSampleTakenDay2: this.falseChickenpoxForm.value.isSampleTakenDay2 + "", tc: true });
        this.falseChickenpoxForm.controls['dateSampleTakenDay2'].setValue(this.datePipe.transform(this.falseChickenpoxForm.value.dateSampleTakenDay2, 'yyyy-MM-dd'));
        this.falseChickenpoxForm.patchValue({ sampleResultDay2: this.falseChickenpoxForm.value.sampleResultDay2 + "", tc: true });
        //d3

        this.falseChickenpoxForm.controls['dateOnsetSymptomsDay7'].setValue(this.datePipe.transform(this.falseChickenpoxForm.value.dateOnsetSymptomsDay7, 'yyyy-MM-dd'));
        this.falseChickenpoxForm.patchValue({ isSampleTakenDay7: this.falseChickenpoxForm.value.isSampleTakenDay7 + "", tc: true });
        this.falseChickenpoxForm.controls['dateSampleTakenDay7'].setValue(this.datePipe.transform(this.falseChickenpoxForm.value.dateSampleTakenDay7, 'yyyy-MM-dd'));
        this.falseChickenpoxForm.patchValue({ sampleResultDay7: this.falseChickenpoxForm.value.sampleResultDay7 + "", tc: true });
        // this.falseChickenpoxForm.patchValue({sampleResultDay7:this.falseChickenpoxForm.value.sampleResultDay3+"", tc:true});
        //d3

        this.falseChickenpoxForm.controls['dateOnsetSymptomsDay14'].setValue(this.datePipe.transform(this.falseChickenpoxForm.value.dateOnsetSymptomsDay14, 'yyyy-MM-dd'));
        this.falseChickenpoxForm.patchValue({ isSampleTakenDay14: this.falseChickenpoxForm.value.isSampleTakenDay14 + "", tc: true });
        this.falseChickenpoxForm.controls['dateSampleTakenDay14'].setValue(this.datePipe.transform(this.falseChickenpoxForm.value.dateSampleTakenDay14, 'yyyy-MM-dd'));
        this.falseChickenpoxForm.patchValue({ sampleResultDay14: this.falseChickenpoxForm.value.sampleResultDay14 + "", tc: true });

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
    Object.entries(this.falseChickenpoxForm.controls).map(([key, value], index) => {
      if (value.value == 'null')
        value.setValue(null);
    })
    this.falseChickenpoxForm.controls['diseaseGroupId'].setValue(this.investigationService.diseaseGroupID);
    this.calculateCompletionPercentage();
    this.falseChickenpoxForm.controls['investigationCompletePercentage'].setValue(parseFloat(((this.allFilledControlsCount / this.allControllesCount) * 100).toFixed(2)));

    //console.log(this.rabiesForm.value);
    if (this.falseChickenpoxForm.value.id != null) {
      this.investigationService.updateFalseChickenpox(this.falseChickenpoxForm.value).subscribe(
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
      this.investigationService.addInvestigationFalseChickenpox(this.falseChickenpoxForm.value).subscribe(
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


  calculateCompletionPercentage() {
    this.allFilledControlsCount = 0;
    const data = this.falseChickenpoxForm.value;
    console.log(data);
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
