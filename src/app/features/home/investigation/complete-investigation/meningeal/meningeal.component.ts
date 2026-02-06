import { AnswerOptions, Gender, cerebrospinalFluidPressure, cerebrospinalFluidbloodfarm, contactType, gramStain, reasonEffort, statusExit, virtualExamination } from './../../../../../core/constants';
import { Component, Input, OnInit } from '@angular/core';
import { AbstractControl, FormArray, FormBuilder, FormControl, FormGroup, FormsModule }
  from '@angular/forms';
import { UserMessageService } from 'src/app/core/services/user.message.service';
import { InvestigationService } from '../../services/investigation.service';
import { TranslateService } from '@ngx-translate/core';
import { DatePipe } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
@Component({
  selector: 'app-meningeal',
  templateUrl: './meningeal.component.html',
  styleUrls: ['./meningeal.component.css']
})
export class MeningealComponent implements OnInit {
  currentLang =
    localStorage.getItem('ls.currentLang') !== undefined &&
      localStorage.getItem('ls.currentLang') !== 'undefined'
      ? localStorage.getItem('ls.currentLang')
      : 'ar';
  controlsCount: number = 0;
  allFilledControlsCount: number = 0;
  allControllesCount: number = 0;
  patientName: string;
  @Input() formTest?: any = {};
  @Input() projectFileds: any = {};
  @Input() answerDefault: any = {};
  meningealForm: FormGroup
  currentId: any;
  diseaseGroupID: any;
  constructor(private investigationService: InvestigationService,
    private datePipe: DatePipe,
    private formBuilder: FormBuilder,
    private translateService: TranslateService,
    private route: ActivatedRoute,
    private router: Router,
    private userMsg: UserMessageService) {
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
    this.meningealForm = new FormGroup({
      investigationCompletePercentage: new FormControl(),
      patientID: new FormControl(),
      id: new FormControl(),
      fever: new FormControl(),
      maxTemperature: new FormControl(),
      feverDurationDay: new FormControl(),
      impulsiveVomiting: new FormControl(),
      unexplainedHeadache: new FormControl(),
      highIncidenceKid: new FormControl(),
      purpuraSkin: new FormControl(),
      photosensitivity: new FormControl(),
      paralysisSides: new FormControl(),
      stiffNeck: new FormControl(),
      hallucination: new FormControl(),
      fractureSkull: new FormControl(),
      cerebrospinalFluidLeakage: new FormControl(),
      cerebrospinalFluidBypassValve: new FormControl(),
      purulentDischargeEar: new FormControl(),
      splenectomy: new FormControl(),
      immunodeficiency: new FormControl(),
      frequentBloodTransfusion: new FormControl(),
      immunosuppressant: new FormControl(),
      brainSurgery: new FormControl(),

      contactSuspectedCase: new FormControl(),
      epidemicOutbreak: new FormControl(),
      contactConfirmedCase: new FormControl(),
      deceasedPersonUnknownRespiratory: new FormControl(),
      numberDirectContacts: new FormControl(),
      numberNonDirectContacts: new FormControl(),

      //تم الحذف
      // traveledEndemicMeningiti: new FormControl(),
      // meningealGraft: new FormControl(),
      // performHajjUmrah: new FormControl(),
      // meningococcalVaccination: new FormControl(),
      // vaccinatePatientMeningococcal: new FormControl(),


      nameDay1: new FormControl(),
      ageDay1: new FormControl(),
      telephoneDay1: new FormControl(),
      relationshipPatientDay1: new FormControl(),
      dateOnsetSymptomsDay1: new FormControl(),
      genderDay1: new FormControl(),
      contactTypeDay1: new FormControl(),
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
      relationshipPatientDay7: new FormControl(),
      dateOnsetSymptomsDay7: new FormControl(),
      contactTypeDay7: new FormControl(),
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
      relationshipPatientDay14: new FormControl(),
      contactTypeDay14: new FormControl(),
      dateOnsetSymptomsDay14: new FormControl(),
      genderDay14: new FormControl(),
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

      givingCondition: new FormControl(),
      placeSacrifice: new FormControl(),
      dateSacrifice: new FormControl(),
      reasonEffort: new FormControl(),
      otherEffort: new FormControl(),

      studentCSFSampleTaken: new FormControl(),
      sendingDateEffort: new FormControl(),
      reason: new FormControl(),
      bloodGlucose: new FormControl(),
      virtualExamination: new FormControl(),
      cerebrospinalFluidPressure: new FormControl(),
      chemicalProtien: new FormControl(),
      chemicalGlucose: new FormControl(),
      chemicalLdh: new FormControl(),
      cytologicalNoCells: new FormControl(),
      cytologicalLymphocyte: new FormControl(),
      cytologicalneutrophils: new FormControl(),

      gramStain: new FormControl(),
      gramStainOther: new FormControl(),
      cerebrospinalFluid: new FormControl(),
      cerebrospinalFluidOther: new FormControl(),
      bloodFarm: new FormControl(),
      bloodFarmOther: new FormControl(),
      resultPcr: new FormControl(),
      //تم اضافة
      isTravel: new FormControl(),
      dateTravel: new FormControl(),
      //تم اضافة
      isTravelEndemicArea: new FormControl(),
      dateTravelEndemicArea: new FormControl(),
      countryName: new FormControl(),
      //تم اضافة
      meningococcalVaccine: new FormControl(),
      vaccinationDate: new FormControl(),
      //تم اضافة
      studentMeningococcalVaccine: new FormControl(),
      vaccinationDate2: new FormControl(),
      //تم اضافة
      travellerMeningococcalVaccine: new FormControl(),
      vaccinationDate3: new FormControl(),

      dateLastVisit: new FormControl(),
      vaccinationStatus: new FormControl(),
      numberVaccinated: new FormControl(),
      percentageVaccinated: new FormControl(),

      homeNumberContacts: new FormControl(),
      homeNumberPeopleRecievedChemoprophylaxis: new FormControl(),
      homeNumberVaccinated: new FormControl(),

      classNumberContacts: new FormControl(),
      classNumberPeopleRecievedChemoprophylaxis: new FormControl(),
      classNumberVaccinated: new FormControl(),

      campNumberContacts: new FormControl(),
      campNumberPeopleRecievedChemoprophylaxis: new FormControl(),
      campNumberVaccinated: new FormControl(),

      prisonNumberContacts: new FormControl(),
      prisonNumberPeopleRecievedChemoprophylaxis: new FormControl(),
      prisonNumberVaccinated: new FormControl(),

      otherNumberContacts: new FormControl(),
      otherNumberPeopleRecievedChemoprophylaxis: new FormControl(),
      otherNumberVaccinated: new FormControl(),

      statusExit: new FormControl(),
      finalDiagnosis: new FormControl(),
      diseaseGroupId: new FormControl(this.diseaseGroupID),

    });
    //this.meningealForm.controls['completePercentage'].disable();
    //this.controlsCount = this.calculateCompletePercentage();
    this.calculateCompletionPercentage();
  }
  ngOnInit() {
    // this.meningealForm.controls['completePercentage'].setValue(
    //   this.controlsCount
    // );
    if (this.currentId != null) {
      this.meningealForm.controls['patientID'].setValue(this.currentId);
      this.getById();
    }
    else {
      this.router.navigateByUrl("/home/investigations");
    }
  }
  getById() {

    this.investigationService.getByIdMeningeal(this.currentId).subscribe(
      res => {
        console.log(res);
        var v = res.data;
        this.meningealForm.patchValue(v);
        this.meningealForm.patchValue({ fever: this.meningealForm.value.fever + "", tc: true });
        this.meningealForm.patchValue({ isSampleTakenDay1: this.meningealForm.value.isSampleTakenDay1 + "", tc: true });
        this.meningealForm.patchValue({ sampleResultDay1: this.meningealForm.value.sampleResultDay1 + "", tc: true });
        this.meningealForm.controls['dateOnsetSymptomsDay1'].setValue(this.datePipe.transform(this.meningealForm.value.dateOnsetSymptomsDay1, 'yyyy-MM-dd'));
        this.meningealForm.controls['dateSampleTakenDay1'].setValue(this.datePipe.transform(this.meningealForm.value.dateSampleTakenDay1, 'yyyy-MM-dd'));
        this.meningealForm.patchValue({ isSampleTakenDay2: this.meningealForm.value.isSampleTakenDay2 + "", tc: true });
        this.meningealForm.patchValue({ sampleResultDay2: this.meningealForm.value.sampleResultDay2 + "", tc: true });
        this.meningealForm.controls['dateOnsetSymptomsDay2'].setValue(this.datePipe.transform(this.meningealForm.value.dateOnsetSymptomsDay2, 'yyyy-MM-dd'));
        this.meningealForm.controls['dateSampleTakenDay2'].setValue(this.datePipe.transform(this.meningealForm.value.dateSampleTakenDay2, 'yyyy-MM-dd'));
        this.meningealForm.patchValue({ isSampleTakenDay7: this.meningealForm.value.isSampleTakenDay7 + "", tc: true });
        this.meningealForm.patchValue({ sampleResultDay7: this.meningealForm.value.sampleResultDay7 + "", tc: true });
        this.meningealForm.controls['dateOnsetSymptomsDay7'].setValue(this.datePipe.transform(this.meningealForm.value.dateOnsetSymptomsDay7, 'yyyy-MM-dd'));
        this.meningealForm.controls['dateSampleTakenDay7'].setValue(this.datePipe.transform(this.meningealForm.value.dateSampleTakenDay7, 'yyyy-MM-dd'));
        this.meningealForm.patchValue({ isSampleTakenDay14: this.meningealForm.value.isSampleTakenDay14 + "", tc: true });
        this.meningealForm.patchValue({ sampleResultDay14: this.meningealForm.value.sampleResultDay14 + "", tc: true });
        this.meningealForm.controls['dateOnsetSymptomsDay14'].setValue(this.datePipe.transform(this.meningealForm.value.dateOnsetSymptomsDay14, 'yyyy-MM-dd'));
        this.meningealForm.controls['dateSampleTakenDay14'].setValue(this.datePipe.transform(this.meningealForm.value.dateSampleTakenDay14, 'yyyy-MM-dd'));
        this.meningealForm.patchValue({ givingCondition: this.meningealForm.value.givingCondition + "", tc: true });
        this.meningealForm.controls['dateSacrifice'].setValue(this.datePipe.transform(this.meningealForm.value.dateSacrifice, 'yyyy-MM-dd'));
        this.meningealForm.controls['sendingDateEffort'].setValue(this.datePipe.transform(this.meningealForm.value.sendingDateEffort, 'yyyy-MM-dd'));
        this.meningealForm.patchValue({ studentCSFSampleTaken: this.meningealForm.value.studentCSFSampleTaken + "", tc: true });
        this.meningealForm.controls['dateTravel'].setValue(this.datePipe.transform(this.meningealForm.value.dateTravel, 'yyyy-MM-dd'));
        this.meningealForm.controls['dateTravelEndemicArea'].setValue(this.datePipe.transform(this.meningealForm.value.dateTravelEndemicArea, 'yyyy-MM-dd'));
        this.meningealForm.controls['vaccinationDate'].setValue(this.datePipe.transform(this.meningealForm.value.vaccinationDate, 'yyyy-MM-dd'));
        this.meningealForm.controls['vaccinationDate2'].setValue(this.datePipe.transform(this.meningealForm.value.vaccinationDate2, 'yyyy-MM-dd'));
        this.meningealForm.controls['vaccinationDate3'].setValue(this.datePipe.transform(this.meningealForm.value.vaccinationDate3, 'yyyy-MM-dd'));
        this.meningealForm.controls['dateLastVisit'].setValue(this.datePipe.transform(this.meningealForm.value.dateLastVisit, 'yyyy-MM-dd'));

        //this.controlsCount = this.calculateCompletePercentage();
        //this.meningealForm.value.completePercentage = this.controlsCount;

        Object.entries(this.meningealForm.controls).map(
          ([key, value], index) => {
            if (value.value == 'null')
              value.setValue(null);
          });

        //this.controlsCount = this.calculateCompletePercentage();
        this.calculateCompletionPercentage();
        //this.meningealForm.value.completePercentage = this.controlsCount;
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
  // /**
  //  * Calculate the percentage
  //  * @returns
  //  */

  // calculateCompletePercentage(): number {
  //   Object.entries(this.meningealForm.controls).map(([key, value], index) => {
  //     if (value.value == 'null')
  //       value.setValue(null);
  //     else if (value.value != null && !isNaN(+value.value)) {
  //       value.setValue(parseInt(value.value.toString()));
  //     }
  //   });
  //   this.allControllesCount = this.countAllControls(this.meningealForm);
  //   if (this.meningealForm.value.id != null) {
  //     this.allFilledControlsCount = this.countFilledControls(this.meningealForm);
  //   } else {
  //     this.allFilledControlsCount = 0;
  //   }
  //   this.controlsCount = this.allControllesCount != 0 ? parseInt(((this.allFilledControlsCount / this.allControllesCount) * 100).toString()) : 0;

  //   return this.controlsCount;
  // }

  // /**
  //  * Count all fields
  //  * @param control
  //  * @returns
  //  */
  // countFilledControls(control: any): number {
  //   if (control instanceof FormControl) {
  //     if (control.value != null)
  //       return 1;
  //     else return 0;
  //   }

  //   if (control instanceof FormArray) {
  //     return control.controls.reduce((acc, curr) => acc + this.countFilledControls(curr), 1)
  //   }

  //   if (control instanceof FormGroup) {
  //     return Object.keys(control.controls)
  //       .map(key => control.controls[key])
  //       .reduce((acc, curr) => acc + this.countFilledControls(curr), 1);
  //   }
  //   return 0;
  // }
  // /**
  //  * Count all filled fields
  //  * @param control
  //  * @returns
  //  */
  // countAllControls(control: any): number {
  //   if (control instanceof FormControl) {
  //     return 1;
  //   }

  //   if (control instanceof FormArray) {
  //     return control.controls.reduce((acc, curr) => acc + this.countAllControls(curr), 1)
  //   }

  //   if (control instanceof FormGroup) {
  //     return Object.keys(control.controls)
  //       .map(key => control.controls[key])
  //       .reduce((acc, curr) => acc + this.countAllControls(curr), 1);
  //   }
  //   return 0;
  // }


  save() {

    //this.meningealForm.controls['completePercentage'].enable();
    //this.controlsCount = this.calculateCompletePercentage();
    Object.entries(this.meningealForm.controls).map(
      ([key, value], index) => {
        if (value.value == 'null')
          value.setValue(null);
      });
    this.meningealForm.controls['diseaseGroupId'].setValue(this.diseaseGroupID);
    //this.meningealForm.controls['completePercentage'].setValue(this.controlsCount);
    this.meningealForm.controls['investigationCompletePercentage'].setValue(parseFloat(((this.allFilledControlsCount / this.allControllesCount) * 100).toFixed(2)));

    if (this.meningealForm.value.id != null) {
      this.investigationService.updateSevereMeningeal(this.meningealForm.value).subscribe(
        (response: any) => {
          if (response) {
            //this.meningealForm.controls['completePercentage'].disable();
            document.getElementById("jump_to_this_location").scrollIntoView({ behavior: 'smooth' });
            this.calculateCompletionPercentage();
            //this.controlsCount = this.calculateCompletePercentage();
            this.meningealForm.value.completePercentage = this.controlsCount; 
            this.translateService
              .get('NEDSS.COMMON.SENT_SUCESSFULLY')
              .subscribe((res: string) => {
                this.userMsg.success(res);
              });
            //this.router.navigateByUrl('/home/investigations');
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
      this.investigationService.addInvestigationMeningeal(this.meningealForm.value).subscribe(
        (response: any) => {
          if (response) {
            //this.meningealForm.controls['completePercentage'].disable();
            document.getElementById("jump_to_this_location").scrollIntoView({ behavior: 'smooth' });
            this.calculateCompletionPercentage();
            this.meningealForm.value.id = response.data.id;
            this.currentId = response.data.patientID;
            this.getById();
            //this.controlsCount = this.calculateCompletePercentage();
            this.meningealForm.value.completePercentage = this.controlsCount; 
            this.translateService
              .get('NEDSS.COMMON.SENT_SUCESSFULLY')
              .subscribe((res: string) => {
                this.userMsg.success(res);
              });
           // this.router.navigateByUrl('/home/investigations');
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
      const data = this.meningealForm.value;
      //Exclude fields you don't want to count (like 'id')
      const excludedFields = ['id','patientID','investigationCompletePercentage' , 'diseaseGroupId' , 'createdDate' , 'completePercentage'];
      const totalFields = Object.keys(data).filter(key => !excludedFields.includes(key)).length;
      
      this.allControllesCount = totalFields;
  
      Object.keys(data).forEach((key) => {
          if (!excludedFields.includes(key) && data[key] !== null && data[key] !== '') {
              this.allFilledControlsCount++;
          }
      });
    }
}
