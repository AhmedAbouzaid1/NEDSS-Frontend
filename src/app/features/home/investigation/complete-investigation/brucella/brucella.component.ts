import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormArray, FormControl, FormGroup, NgModel, Validators } from '@angular/forms';
import { FormsModule } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import { LookupsGetterService } from 'src/app/core/services/lookups-getter.service';
import { UserMessageService } from 'src/app/core/services/user.message.service';
import { GeneralDataService } from '../../../general-data/services/general-data.service';
import { ExportAsService } from 'ngx-export-as';
import { EventService } from '../../../events/services/event.service';
import { AnswerOptions, Gender, Relations, contactType, place, placeOrLab } from 'src/app/core/constants';
import { InvestigationService } from '../../services/investigation.service';
import { DatePipe } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-brucella',
  templateUrl: './brucella.component.html',
  styleUrls: ['./brucella.component.css']
})
export class BrucellaComponent implements OnInit {
  currentLang =
    localStorage.getItem('ls.currentLang') !== undefined &&
      localStorage.getItem('ls.currentLang') !== 'undefined'
      ? localStorage.getItem('ls.currentLang')
      : 'ar';
  @Input() formTest?: any = {};
  @Input() projectFileds: any = {};
  @Input() answerDefault: any = {};
  @Output() OnReturnForm = new EventEmitter<any>(); // output create  Change
  @Output() OnValidForm = new EventEmitter<any>(); // output create  Change
  @Input() isEdit: any = false;

  fileList: any = [];
  listOfFiles: any[] = [];
  file: FormData = new FormData();
  brucellaData: FormGroup;
  /*brucellaForm: FormGroup<{ id: FormControl<any>;
    epidemicOutbreak: FormControl<any>;
    //contactSuspectedCase: FormControl<any>; similarCase: FormControl<any>; contactConfirmedCase: FormControl<any>; deceasedUnknownRespiratoryDisease: FormControl<any>; noDirectContacts: FormControl<any>; noIndirectContacts: FormControl<any>; nameDay1: FormControl<any>; genderDay1: FormControl<any>; ageDay1: FormControl<any>; telephoneDay1: FormControl<any>; dateOnsetSymptomsDay1: FormControl<any>; contactTypeDay1: FormControl<any>; feverDay1: FormControl<any>; dryCoughDay1: FormControl<any>; coughingWithSpittingDay1: FormControl<any>; soreThroatDay1: FormControl<any>; breathingDifficultyDay1: FormControl<any>; jointPainDay1: FormControl<any>; vomitDay1: FormControl<any>; diarrheaDay1: FormControl<any>; otherDay1: FormControl<any>; otherSymptomsDay1: FormControl<any>; dateSampleTakenDay1: FormControl<any>; isSampleTakenDay1: FormControl<any>; sampleResultDay1: FormControl<any>; relationshipWithPatientDay1: FormControl<any>; nameDay2: FormControl<any>; genderDay2: FormControl<any>; ageDay2: FormControl<any>; telephoneDay2: FormControl<any>; dateOnsetSymptomsDay2: FormControl<any>; feverDay2: FormControl<any>; dryCoughDay2: FormControl<any>; coughingWithSpittingDay2: FormControl<any>; soreThroatDay2: FormControl<any>; breathingDifficultyDay2: FormControl<any>; jointPainDay2: FormControl<any>; vomitDay2: FormControl<any>; diarrheaDay2: FormControl<any>; otherDay2: FormControl<any>; otherSymptomsDay2: FormControl<any>; contactTypeDay2: FormControl<any>; relationshipWithPatientDay2: FormControl<any>; dateSampleTakenDay2: FormControl<any>; isSampleTakenDay2: FormControl<any>; sampleResultDay2: FormControl<any>; nameDay7: FormControl<any>; genderDay7: FormControl<any>; ageDay7: FormControl<any>; telephoneDay7: FormControl<any>; dateOnsetSymptomsDay7: FormControl<any>; feverDay7: FormControl<any>; dryCoughDay7: FormControl<any>; coughingWithSpittingDay7: FormControl<any>; soreThroatDay7: FormControl<any>; breathingDifficultyDay7: FormControl<any>; jointPainDay7: FormControl<any>; vomitDay7: FormControl<any>; diarrheaDay7: FormControl<any>; otherDay7: FormControl<any>; otherSymptomsDay7: FormControl<any>; contactTypeDay7: FormControl<any>; relationshipWithPatientDay7: FormControl<any>; dateSampleTakenDay7: FormControl<any>; isSampleTakenDay7: FormControl<any>; sampleResultDay7: FormControl<any>; nameDay14: FormControl<any>; genderDay14: FormControl<any>; ageDay14: FormControl<any>; telephoneDay14: FormControl<any>; dateOnsetSymptomsDay14: FormControl<any>; contactTypeDay14: FormControl<any>; feverDay14: FormControl<any>; dryCoughDay14: FormControl<any>; coughingWithSpittingDay14: FormControl<any>; soreThroatDay14: FormControl<any>; breathingDifficultyDay14: FormControl<any>; jointPainDay14: FormControl<any>; vomitDay14: FormControl<any>; diarrheaDay14: FormControl<any>; otherDay14: FormControl<any>; otherSymptomsDay14: FormControl<any>; relationshipWithPatientDay14: FormControl<any>; dateSampleTakenDay14: FormControl<any>; isSampleTakenDay14: FormControl<any>; sampleResultDay14: FormControl<any>; dealWithAnimals: FormControl<any>; animalType: FormControl<any>; place: FormControl<any>; anotherPlace: FormControl<any>; abortionInfectedAnimals: FormControl<any>; veterinarianInformed: FormControl<any>; eatingUndercookedMeat: FormControl<any>; consumingUnpasteurizedDairy: FormControl<any>; exposedToBrucellosis: FormControl<any>; labName: FormControl<any>; labPlace: FormControl<any>; laboratoryExposureBrucella: FormControl<any>; exposureDetails: FormControl<any>; casesSameSymptoms: FormControl<any>; placeOrLab: FormControl<any>; patientID: FormControl<any>; }>;*/
  onFileSelect(input) {

    for (var i = 0; i <= input.files.length - 1; i++) {
      var selectedFile = input.files[i];
      if (this.listOfFiles.indexOf(selectedFile.name) === -1) {
        this.fileList.push(selectedFile);
        this.listOfFiles.push(selectedFile.name);
      }
      console.log(this.fileList);
    }
  }

  fields: any[] = [];
  delimiter: any = '-';
  contactSuspectedCases = AnswerOptions;
  //SimilarCases = AnswerOptions;
  contactConfirmedCases = AnswerOptions;
  deceasedUnknownRespiratoryDiseases = AnswerOptions;

  contact = [
    { id: null, arabicName: "--" },
    { id: 1, arabicName: "إقامة بالمنزل" },
    { id: 2, arabicName: "مخالطة بالعمل" },
    { id: 3, arabicName: "شخص قام بزيارة المريض أ, العكس" },
    { id: 4, arabicName: "طرق مخالطة أخري" },
  ]
  FeverDay1s = AnswerOptions;
  dryCoughDay1s = AnswerOptions;
  CoughingWithSpittingDay1s = AnswerOptions;
  SoreThroatDay1s = AnswerOptions;
  BreathingDifficultyDay1s = AnswerOptions;
  jointPainDay1s = AnswerOptions;
  vomitDay1s = AnswerOptions;
  DiarrheaDay1s = AnswerOptions;
  otherDay1s = AnswerOptions;
  genderDay1s = Gender;
  contactTypeDay1s = contactType;


  FeverDay2s = AnswerOptions;
  dryCoughDay2s = AnswerOptions;
  CoughingWithSpittingDay2s = AnswerOptions;
  SoreThroatDay2s = AnswerOptions;
  BreathingDifficultyDay2s = AnswerOptions;
  jointPainDay2s = AnswerOptions;
  vomitDay2s = AnswerOptions;
  DiarrheaDay2s = AnswerOptions;
  otherDay2s = AnswerOptions;
  genderDay2s = Gender;
  contactTypeDay2s = contactType;


  FeverDay7s = AnswerOptions;
  dryCoughDay7s = AnswerOptions;
  CoughingWithSpittingDay7s = AnswerOptions;
  SoreThroatDay7s = AnswerOptions;
  BreathingDifficultyDay7s = AnswerOptions;
  jointPainDay7s = AnswerOptions;
  vomitDay7s = AnswerOptions;
  DiarrheaDay7s = AnswerOptions;
  otherDay7s = AnswerOptions;
  genderDay7s = Gender;
  contactTypeDay7s = contactType;

  FeverDay14s = AnswerOptions;
  dryCoughDay14s = AnswerOptions;
  CoughingWithSpittingDay14s = AnswerOptions;
  SoreThroatDay14s = AnswerOptions;
  BreathingDifficultyDay14s = AnswerOptions;
  jointPainDay14s = AnswerOptions;
  vomitDay14s = AnswerOptions;
  DiarrheaDay14s = AnswerOptions;
  otherDay14s = AnswerOptions;
  genderDay14s = Gender;
  contactTypeDay14s = contactType;

  DealWithAnimals = AnswerOptions;
  AbortionInfectedAnimals = AnswerOptions;
  EatingUndercookedMeat = AnswerOptions;
  LaboratoryExposureBrucella = AnswerOptions;
  exposedToBrucellosis = AnswerOptions;
  casesSameSymptoms = AnswerOptions;
  consumingUnpasteurizedDairy = AnswerOptions;
  veterinarianInformed = AnswerOptions;
  Places = place;
  placeOrLabs = placeOrLab;

  currentId: any;
  controlsCount: number = 0;
  allFilledControlsCount: number = 0;
  allControllesCount: number = 0;
  patientName: string;
  diseaseGroupID: any;
  constructor(private lookupsService: LookupsGetterService, private translateService: TranslateService,
    private userMsg: UserMessageService, private generalDataService: GeneralDataService
    , private Router: Router, private exportAsService: ExportAsService, private investigationService: InvestigationService
    
   , private route: ActivatedRoute , private datePipe: DatePipe
  ) {
    //useless
    // this.currentId = this.route.snapshot.paramMap.get('id');
    // this.diseaseGroupID = this.route.snapshot.paramMap.get('diseaseId');
    if (this.currentId == null) {
      this.currentId = this.investigationService.currentid;
    }
    if (this.diseaseGroupID == null || this.diseaseGroupID == undefined) {
      this.diseaseGroupID = this.investigationService.diseaseGroupID;
    }
    if (this.investigationService.patient.firstName != null && this.investigationService.patient.firstName != undefined) {
      this.patientName = this.investigationService.patient.firstName + " " + this.investigationService.patient.secondName + " " + this.investigationService.patient.thirdName;
    }
    this.brucellaData = new FormGroup({
      id: new FormControl(),
      //completePercentage: new FormControl(),
      investigationCompletePercentage: new FormControl(),
      contactSuspectedCase: new FormControl(),
      //similarCase: new FormControl(),
      contactConfirmedCase: new FormControl(),
      deceasedUnknownRespiratoryDisease: new FormControl(),
      noDirectContacts: new FormControl(),
      noIndirectContacts: new FormControl(),
      nameDay1: new FormControl(),
      genderDay1: new FormControl(),
      ageDay1: new FormControl(),
      telephoneDay1: new FormControl(),
      dateOnsetSymptomsDay1: new FormControl(),
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
      dateSampleTakenDay1: new FormControl(),
      isSampleTakenDay1: new FormControl(),
      sampleResultDay1: new FormControl(),
      relationshipWithPatientDay1: new FormControl(),
      nameDay2: new FormControl(),
      genderDay2: new FormControl(),
      ageDay2: new FormControl(),
      telephoneDay2: new FormControl(),
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
      contactTypeDay2: new FormControl(),
      relationshipWithPatientDay2: new FormControl(),
      dateSampleTakenDay2: new FormControl(),
      isSampleTakenDay2: new FormControl(),
      sampleResultDay2: new FormControl(),
      nameDay7: new FormControl(),
      genderDay7: new FormControl(),
      ageDay7: new FormControl(),
      telephoneDay7: new FormControl(),
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
      contactTypeDay7: new FormControl(),
      relationshipWithPatientDay7: new FormControl(),
      dateSampleTakenDay7: new FormControl(),
      isSampleTakenDay7: new FormControl(),
      sampleResultDay7: new FormControl(),
      nameDay14: new FormControl(),
      genderDay14: new FormControl(),
      ageDay14: new FormControl(),
      telephoneDay14: new FormControl(),
      dateOnsetSymptomsDay14: new FormControl(),
      contactTypeDay14: new FormControl(),
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
      relationshipWithPatientDay14: new FormControl(),
      dateSampleTakenDay14: new FormControl(),
      isSampleTakenDay14: new FormControl(),
      sampleResultDay14: new FormControl(),
      dealWithAnimals: new FormControl(),
      animalType: new FormControl(),
      place: new FormControl(),
      anotherPlace: new FormControl(),
      abortionInfectedAnimals: new FormControl(),
      veterinarianInformed: new FormControl(),
      eatingUndercookedMeat: new FormControl(),
      consumingUnpasteurizedDairy: new FormControl(),
      exposedToBrucellosis: new FormControl(),
      labName: new FormControl(),
      labPlace: new FormControl(),
      laboratoryExposureBrucella: new FormControl(),
      exposureDetails: new FormControl(),
      casesSameSymptoms: new FormControl(),
      placeOrLab: new FormControl(),
      patientID: new FormControl(this.currentId),
      diseaseGroupId: new FormControl(this.diseaseGroupID),
      epidemicOutbreak: new FormControl(),
    })

    //this.brucellaData.controls['completePercentage'].disable();
    //this.controlsCount = this.calculateCompletePercentage();
  }

  ngOnInit() {
    //this.brucellaData.controls['completePercentage'].setValue(
    //   this.controlsCount
    // );
    this.calculateCompletionPercentage();

    if (this.currentId != null) {
      this.brucellaData.controls['patientID'].setValue(this.currentId);
      this.getById();
    } else {
      this.Router.navigateByUrl("/home/investigations");
    }
  }
  getById() {
    this.investigationService.getByIdBrucella(this.currentId).subscribe(
      res => {
        console.log(res);
        if (res.data != null) {
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
          this.brucellaData.patchValue(res.data);
          this.brucellaData.patchValue({ isSampleTakenDay1: this.brucellaData.value.isSampleTakenDay1 + "", tc: true });
          this.brucellaData.patchValue({ sampleResultDay1: this.brucellaData.value.sampleResultDay1 + "", tc: true });
          this.brucellaData.controls['dateSampleTakenDay1'].setValue(this.datePipe.transform(this.brucellaData.value.dateSampleTakenDay1, 'yyyy-MM-dd'));
          this.brucellaData.patchValue({ isSampleTakenDay2: this.brucellaData.value.isSampleTakenDay2 + "", tc: true });
          this.brucellaData.patchValue({ sampleResultDay2: this.brucellaData.value.sampleResultDay2 + "", tc: true });
          this.brucellaData.controls['dateSampleTakenDay2'].setValue(this.datePipe.transform(this.brucellaData.value.dateSampleTakenDay2, 'yyyy-MM-dd'));
          this.brucellaData.patchValue({ isSampleTakenDay7: this.brucellaData.value.isSampleTakenDay7 + "", tc: true });
          this.brucellaData.patchValue({ sampleResultDay7: this.brucellaData.value.sampleResultDay7 + "", tc: true });
          this.brucellaData.controls['dateSampleTakenDay7'].setValue(this.datePipe.transform(this.brucellaData.value.dateSampleTakenDay7, 'yyyy-MM-dd'));
          this.brucellaData.patchValue({ isSampleTakenDay14: this.brucellaData.value.isSampleTakenDay14 + "", tc: true });
          this.brucellaData.patchValue({ sampleResultDay14: this.brucellaData.value.sampleResultDay14 + "", tc: true });
          this.brucellaData.controls['dateSampleTakenDay14'].setValue(this.datePipe.transform(this.brucellaData.value.dateSampleTakenDay14, 'yyyy-MM-dd'));
          this.brucellaData.controls['dateOnsetSymptomsDay1'].setValue(this.datePipe.transform(this.brucellaData.value.dateOnsetSymptomsDay1, 'yyyy-MM-dd'));
          this.brucellaData.controls['dateOnsetSymptomsDay2'].setValue(this.datePipe.transform(this.brucellaData.value.dateOnsetSymptomsDay2, 'yyyy-MM-dd'));
          this.brucellaData.controls['dateOnsetSymptomsDay7'].setValue(this.datePipe.transform(this.brucellaData.value.dateOnsetSymptomsDay7, 'yyyy-MM-dd'));
          this.brucellaData.controls['dateOnsetSymptomsDay14'].setValue(this.datePipe.transform(this.brucellaData.value.dateOnsetSymptomsDay14, 'yyyy-MM-dd'));
          //this.controlsCount = this.calculateCompletePercentage();
          //this.brucellaData.value.completePercentage = this.controlsCount;

          Object.entries(this.brucellaData.controls).map(
            ([key, value], index) => {
              if (value.value == 'null')
                value.setValue(null);
            });

          //this.controlsCount = this.calculateCompletePercentage();
          //this.brucellaData.value.completePercentage = this.controlsCount;
          this.calculateCompletionPercentage();
          //
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
  // /**
  //  * Calculate the percentage
  //  * @returns
  //  */

  // calculateCompletePercentage(): number {
  //   Object.entries(this.brucellaData.controls).map(([key, value], index) => {
  //     if (value.value == 'null')
  //       value.setValue(null);
  //     else if (value.value != null && !isNaN(+value.value)) {
  //       value.setValue(parseInt(value.value.toString()));
  //     }
  //   });
  //   this.allControllesCount = this.countAllControls(this.brucellaData);
  //   if (this.brucellaData.value.id != null) {
  //     this.allFilledControlsCount = this.countFilledControls(this.brucellaData);
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

  savetest() {
    console.log(this.brucellaData.value);
  }

  save() {
    // this.brucellaData.controls['completePercentage'].enable();
    // this.controlsCount = this.calculateCompletePercentage();
    Object.entries(this.brucellaData.controls).map(([key, value], index) => {
      if (value.value == 'null')
        value.setValue(null);
      else if (typeof value.value === 'boolean' || key == 'telephoneDay1' || key == 'telephoneDay2' || key == 'telephoneDay7' || key == 'telephoneDay14'){
        value.value.toString();
      }
      else if (value.value != null && !isNaN(+value.value) && typeof value.value !== 'boolean') {
        value.setValue(parseInt(value.value.toString()));
      }
    });
    //this.brucellaData.controls['completePercentage'].setValue(this.controlsCount);
    this.calculateCompletionPercentage();
    this.brucellaData.controls['diseaseGroupId'].setValue(this.diseaseGroupID);
    this.brucellaData.controls['investigationCompletePercentage'].setValue(parseFloat(((this.allFilledControlsCount / this.allControllesCount) * 100).toFixed(2)));
    if (this.brucellaData.value.id != null) {
      this.investigationService.updateBrucella(this.brucellaData.value).subscribe(
        (response: any) => {
          if (response) {
            //this.brucellaData.controls['completePercentage'].disable();
            document.getElementById("jump_to_this_location").scrollIntoView({ behavior: 'smooth' });

            //this.controlsCount = this.calculateCompletePercentage();
            //this.brucellaData.value.completePercentage = this.controlsCount;
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
      this.investigationService.addInvestigationBrucella(this.brucellaData.value).subscribe(
        (response: any) => {
          if (response) {
            //this.brucellaData.controls['completePercentage'].disable();
            document.getElementById("jump_to_this_location").scrollIntoView({ behavior: 'smooth' });

            this.brucellaData.value.id = response.data.id;
            this.currentId = response.data.patientID;
            this.getById();
            //this.controlsCount = this.calculateCompletePercentage();
            //this.brucellaData.value.completePercentage = this.controlsCount;
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
        const data = this.brucellaData.value;
        
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
