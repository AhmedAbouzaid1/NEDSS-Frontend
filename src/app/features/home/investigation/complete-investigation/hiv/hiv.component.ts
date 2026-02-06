import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormArray, FormControl, FormGroup } from '@angular/forms';
import { Gender, MaritalStatus } from 'src/app/core/constants';
import { UserMessageService } from 'src/app/core/services/user.message.service';
import { InvestigationService } from '../../services/investigation.service';
import { TranslateService } from '@ngx-translate/core';
import { ActivatedRoute, Router } from '@angular/router';
import { GeneralDataService } from '../../../general-data/services/general-data.service';
@Component({
  selector: 'app-hiv',
  templateUrl: './hiv.component.html',
  styleUrls: ['./hiv.component.css']
})
export class HivComponent implements OnInit {
  hivForm: FormGroup
  currentId: any;
  controlsCount: number = 0;
  allFilledControlsCount: number = 0;
  allControllesCount: number = 0;
  patientName: string;
  diseaseGroupID: any;
  constructor(private investigationService: InvestigationService, public generalDataService: GeneralDataService,
    private translateService: TranslateService,
    private userMsg: UserMessageService,
    private route: ActivatedRoute, private Router: Router,
    public datePipe: DatePipe) {
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
    this.hivForm = new FormGroup({
      id: new FormControl(),
      patientID: new FormControl(this.currentId),
      completePercentage: new FormControl(),
      fever: new FormControl(),
      feverDurationDay: new FormControl(),
      maxTemperature: new FormControl(),

      name: new FormControl(),
      laboratoryName: new FormControl(),
      positiveCaseHistory: new FormControl(),
      dateEpidemiologicalInvestigation: new FormControl(),


      fourName: new FormControl(),
      age: new FormControl(),
      gender: new FormControl(),
      job: new FormControl(),
      maritalStatus: new FormControl(),
      husbandName: new FormControl(),
      aidsTest: new FormControl(),
      dateIfYes: new FormControl(),
      nationalIdNumber: new FormControl(),
      telephoneNumber: new FormControl(),
      mobileNumber: new FormControl(),
      kidsNumber: new FormControl(),
      pregnancy: new FormControl(),
      homeNumber: new FormControl(),
      streetName: new FormControl(),
      city: new FormControl(),
      district: new FormControl(),
      otherData: new FormControl(),

      suspectedSymptoms: new FormControl(),
      injectionDrugAddict: new FormControl(),
      bloodDonation: new FormControl(),
      tuberculosisPatient: new FormControl(),
      affectedSpousePartner: new FormControl(),
      dialysis: new FormControl(),
      venerealDisease: new FormControl(),
      injuredMother: new FormControl(),
      travelAbroad: new FormControl(),
      FollowUpPregnancy: new FormControl(),
      voluntaryExamination: new FormControl(),
      otherReasons: new FormControl(),

      sexualRelationshipWithAnotherGender: new FormControl(),
      commercialSex: new FormControl(),
      motherOfInjuredChild: new FormControl(),
      sexualRelationshipWithSpouse: new FormControl(),
      drugInjection: new FormControl(),
      undefined: new FormControl(),
      sameSexSexualRelationship: new FormControl(),
      injuredMotherExposure: new FormControl(),
      motherName: new FormControl(),
      diseaseGroupId: new FormControl(this.diseaseGroupID),
    });

    this.hivForm.controls['completePercentage'].disable();
    this.controlsCount = this.calculateCompletePercentage();
  }
  ngOnInit() {
    this.hivForm.controls['completePercentage'].setValue(
      this.controlsCount
    );
    if (this.currentId != null) {
      this.hivForm.controls['patientID'].setValue(this.currentId);
      this.getById();
    } else {
      this.Router.navigateByUrl("/home/investigations");
    }
  }

  getById() {

    this.investigationService.getByIdhiv(this.currentId).subscribe(
      res => {
        console.log(res);
        var v = res.data;
        this.hivForm.patchValue(v)
        //dateEpidemiologicalInvestigation
        this.hivForm.patchValue({ fever: this.hivForm.value.fever + "", tc: true });
        this.hivForm.controls['positiveCaseHistory'].setValue(this.datePipe.transform(this.hivForm.value.positiveCaseHistory, 'yyyy-MM-dd'));
        this.hivForm.controls['dateEpidemiologicalInvestigation'].setValue(this.datePipe.transform(this.hivForm.value.dateEpidemiologicalInvestigation, 'yyyy-MM-dd'));
        //
        this.hivForm.controls['dateIfYes'].setValue(this.datePipe.transform(this.hivForm.value.dateIfYes, 'yyyy-MM-dd'));
        this.controlsCount = this.calculateCompletePercentage();
        this.hivForm.value.completePercentage = this.controlsCount;

        Object.entries(this.hivForm.controls).map(
          ([key, value], index) => {
            if (value.value == 'null')
              value.setValue(null);
          });

        this.controlsCount = this.calculateCompletePercentage();
        this.hivForm.value.completePercentage = this.controlsCount;
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
  /**
   * Calculate the percentage
   * @returns
   */

  calculateCompletePercentage(): number {
    Object.entries(this.hivForm.controls).map(([key, value], index) => {
      if (value.value == 'null')
        value.setValue(null);
      else if (value.value != null && !isNaN(+value.value)) {
        value.setValue(parseInt(value.value.toString()));
      }
    });
    this.allControllesCount = this.countAllControls(this.hivForm);
    if (this.hivForm.value.id != null) {
      this.allFilledControlsCount = this.countFilledControls(this.hivForm);
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
  save() {
    this.hivForm.controls['completePercentage'].enable();
    this.controlsCount = this.calculateCompletePercentage();
    Object.entries(this.hivForm.controls).map(([key, value], index) => {
      if (value.value == 'null')
        value.setValue(null);
    });

    this.hivForm.controls['completePercentage'].setValue(this.controlsCount);
    this.hivForm.controls['diseaseGroupId'].setValue(this.diseaseGroupID);

    if (this.hivForm.value.id != null) {
      this.investigationService.updateSeverehiv(this.hivForm.value).subscribe(
        (response: any) => {
          if (response) {
            this.hivForm.controls['completePercentage'].disable();
            document.getElementById("jump_to_this_location").scrollIntoView({ behavior: 'smooth' });;

            this.controlsCount = this.calculateCompletePercentage();
            this.hivForm.value.completePercentage = this.controlsCount;
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
      this.investigationService.addInvestigationhiv(this.hivForm.value).subscribe(
        (response: any) => {
          if (response) {
            this.hivForm.controls['completePercentage'].disable();
            document.getElementById("jump_to_this_location").scrollIntoView({ behavior: 'smooth' });;

            this.hivForm.value.id = response.data.id;
            this.currentId = response.data.patientID;
            this.getById();
            this.controlsCount = this.calculateCompletePercentage();
            this.hivForm.value.completePercentage = this.controlsCount;
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
}
