import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormArray, FormControl, FormGroup, NgModel, Validators } from '@angular/forms';
import { FormsModule } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import { LookupsGetterService } from 'src/app/core/services/lookups-getter.service';
import { UserMessageService } from 'src/app/core/services/user.message.service';
import { GeneralDataService } from '../../../general-data/services/general-data.service';
import { ExportAsService } from 'ngx-export-as';
import { EventService } from '../../../events/services/event.service';
import { AnswerOptions, place, placeOrLab, homeOrWork } from 'src/app/core/constants';
import { InvestigationService } from '../../services/investigation.service';
import { ActivatedRoute, Router } from '@angular/router';
import { AttachemntApiService } from 'src/app/core/services/attachemnt-api.service';
import { firstValueFrom } from 'rxjs';

@Component({
  selector: 'app-brucella',
  host: { class: 'investigation-form' },
  templateUrl: './brucella.component.html',
  styleUrls: ['./brucella.component.css']
})
export class BrucellaComponent implements OnInit {
  private readonly maxFilesCount = 3;
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
  oldFiles: any[] = [];
  file: FormData = new FormData();
  brucellaData: FormGroup;
  /*brucellaForm: FormGroup<{ id: FormControl<any>;
    epidemicOutbreak: FormControl<any>;
    //contactSuspectedCase: FormControl<any>; similarCase: FormControl<any>; contactConfirmedCase: FormControl<any>; deceasedUnknownRespiratoryDisease: FormControl<any>; noDirectContacts: FormControl<any>; noIndirectContacts: FormControl<any>; nameDay1: FormControl<any>; genderDay1: FormControl<any>; ageDay1: FormControl<any>; telephoneDay1: FormControl<any>; dateOnsetSymptomsDay1: FormControl<any>; contactTypeDay1: FormControl<any>; feverDay1: FormControl<any>; dryCoughDay1: FormControl<any>; coughingWithSpittingDay1: FormControl<any>; soreThroatDay1: FormControl<any>; breathingDifficultyDay1: FormControl<any>; jointPainDay1: FormControl<any>; vomitDay1: FormControl<any>; diarrheaDay1: FormControl<any>; otherDay1: FormControl<any>; otherSymptomsDay1: FormControl<any>; dateSampleTakenDay1: FormControl<any>; isSampleTakenDay1: FormControl<any>; sampleResultDay1: FormControl<any>; relationshipWithPatientDay1: FormControl<any>; nameDay2: FormControl<any>; genderDay2: FormControl<any>; ageDay2: FormControl<any>; telephoneDay2: FormControl<any>; dateOnsetSymptomsDay2: FormControl<any>; feverDay2: FormControl<any>; dryCoughDay2: FormControl<any>; coughingWithSpittingDay2: FormControl<any>; soreThroatDay2: FormControl<any>; breathingDifficultyDay2: FormControl<any>; jointPainDay2: FormControl<any>; vomitDay2: FormControl<any>; diarrheaDay2: FormControl<any>; otherDay2: FormControl<any>; otherSymptomsDay2: FormControl<any>; contactTypeDay2: FormControl<any>; relationshipWithPatientDay2: FormControl<any>; dateSampleTakenDay2: FormControl<any>; isSampleTakenDay2: FormControl<any>; sampleResultDay2: FormControl<any>; nameDay7: FormControl<any>; genderDay7: FormControl<any>; ageDay7: FormControl<any>; telephoneDay7: FormControl<any>; dateOnsetSymptomsDay7: FormControl<any>; feverDay7: FormControl<any>; dryCoughDay7: FormControl<any>; coughingWithSpittingDay7: FormControl<any>; soreThroatDay7: FormControl<any>; breathingDifficultyDay7: FormControl<any>; jointPainDay7: FormControl<any>; vomitDay7: FormControl<any>; diarrheaDay7: FormControl<any>; otherDay7: FormControl<any>; otherSymptomsDay7: FormControl<any>; contactTypeDay7: FormControl<any>; relationshipWithPatientDay7: FormControl<any>; dateSampleTakenDay7: FormControl<any>; isSampleTakenDay7: FormControl<any>; sampleResultDay7: FormControl<any>; nameDay14: FormControl<any>; genderDay14: FormControl<any>; ageDay14: FormControl<any>; telephoneDay14: FormControl<any>; dateOnsetSymptomsDay14: FormControl<any>; contactTypeDay14: FormControl<any>; feverDay14: FormControl<any>; dryCoughDay14: FormControl<any>; coughingWithSpittingDay14: FormControl<any>; soreThroatDay14: FormControl<any>; breathingDifficultyDay14: FormControl<any>; jointPainDay14: FormControl<any>; vomitDay14: FormControl<any>; diarrheaDay14: FormControl<any>; otherDay14: FormControl<any>; otherSymptomsDay14: FormControl<any>; relationshipWithPatientDay14: FormControl<any>; dateSampleTakenDay14: FormControl<any>; isSampleTakenDay14: FormControl<any>; sampleResultDay14: FormControl<any>; dealWithAnimals: FormControl<any>; animalType: FormControl<any>; place: FormControl<any>; anotherPlace: FormControl<any>; abortionInfectedAnimals: FormControl<any>; veterinarianInformed: FormControl<any>; eatingUndercookedMeat: FormControl<any>; consumingUnpasteurizedDairy: FormControl<any>; exposedToBrucellosis: FormControl<any>; labName: FormControl<any>; labPlace: FormControl<any>; laboratoryExposureBrucella: FormControl<any>; exposureDetails: FormControl<any>; casesSameSymptoms: FormControl<any>; placeOrLab: FormControl<any>; patientID: FormControl<any>; }>;*/
  onFileSelect(input) {
    if (!input.files || input.files.length === 0) {
      return;
    }

    const availableSlots = this.maxFilesCount - (this.oldFiles.length + this.fileList.length);
    if (availableSlots <= 0) {
      this.userMsg.error(`الحد الأقصى ${this.maxFilesCount} ملفات`);
      input.value = '';
      return;
    }

    let addedCount = 0;
    for (var i = 0; i <= input.files.length - 1; i++) {
      if (addedCount >= availableSlots) {
        break;
      }
      var selectedFile = input.files[i];
      if (this.listOfFiles.indexOf(selectedFile.name) === -1) {
        this.fileList.push(selectedFile);
        this.listOfFiles.push(selectedFile.name);
        addedCount++;
      }
      console.log(this.fileList);
    }
    if (input.files.length > availableSlots) {
      this.userMsg.error(`تم قبول ${availableSlots} ملفات فقط (الحد الأقصى ${this.maxFilesCount})`);
    }
    if (this.listOfFiles.length > 0) {
      this.userMsg.success('تم اختيار الملف بنجاح');
    }
    input.value = '';
  }

  openSelectedFile(index: number) {
    const selectedFile = this.fileList[index];
    if (!selectedFile) {
      return;
    }
    const fileUrl = URL.createObjectURL(selectedFile);
    window.open(fileUrl, '_blank');
  }

  openExistingFile(fileUrl: string) {
    if (!fileUrl) {
      return;
    }
    window.open(fileUrl, '_blank');
  }

  removeSelectedFile(index: number) {
    if (index < 0 || index >= this.fileList.length) {
      return;
    }
    this.fileList.splice(index, 1);
    this.listOfFiles.splice(index, 1);
  }

  removeOldSelectedFile(index: number) {
    if (index < 0 || index >= this.oldFiles.length) {
      return;
    }
    this.oldFiles.splice(index, 1);
  }

  fields: any[] = [];
  delimiter: any = '-';
  DealWithAnimals = AnswerOptions;
  AbortionInfectedAnimals = AnswerOptions;
  EatingUndercookedMeat = AnswerOptions;
  LaboratoryExposureBrucella = AnswerOptions;
  exposedToBrucellosis = AnswerOptions;
  previousDiagnosis = AnswerOptions;
  casesSameSymptoms = AnswerOptions;
  antibioticsBeforeReport = AnswerOptions;
  healthFacilitiesBeforeReport = AnswerOptions;
  private readonly freeTextControls = ['labName', 'labPlace', 'exposureDetails', 'antibioticsNames', 'healthFacilitiesDetails'];
  consumingUnpasteurizedDairy = AnswerOptions;
  veterinarianInformed = AnswerOptions;
  Places = place;
  placeOrLabs = placeOrLab;
  homeOrWorkOptions = homeOrWork;

  currentId: any;
  controlsCount: number = 0;
  allFilledControlsCount: number = 0;
  allControllesCount: number = 0;
  patientName: string;
  diseaseGroupID: any;
  constructor(private lookupsService: LookupsGetterService, private translateService: TranslateService,
    private userMsg: UserMessageService, private generalDataService: GeneralDataService
    , private Router: Router, private exportAsService: ExportAsService, private investigationService: InvestigationService
    , private attahcmentService: AttachemntApiService
   , private route: ActivatedRoute
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
      previousDiagnosis: new FormControl(),
      antibioticsBeforeReport: new FormControl(),
      antibioticsNames: new FormControl(),
      healthFacilitiesBeforeReport: new FormControl(),
      healthFacilitiesDetails: new FormControl(),
      casesSameSymptoms: new FormControl(),
      placeOrLab: new FormControl(),
      patientID: new FormControl(this.currentId),
      diseaseGroupId: new FormControl(this.diseaseGroupID),
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
          this.oldFiles = res?.data?.filesUrls ? [...res.data.filesUrls] : [];
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

  async save() {
    // this.brucellaData.controls['completePercentage'].enable();
    // this.controlsCount = this.calculateCompletePercentage();
    Object.entries(this.brucellaData.controls).map(([key, value], index) => {
      if (value.value == 'null')
        value.setValue(null);
      else if (typeof value.value === 'boolean'){
        value.value.toString();
      }
      else if (value.value != null && !isNaN(+value.value) && typeof value.value !== 'boolean' && !this.freeTextControls.includes(key)) {
        value.setValue(parseInt(value.value.toString()));
      }
    });
    //this.brucellaData.controls['completePercentage'].setValue(this.controlsCount);
    this.calculateCompletionPercentage();
    this.brucellaData.controls['diseaseGroupId'].setValue(this.diseaseGroupID);
    this.brucellaData.controls['investigationCompletePercentage'].setValue(parseFloat(((this.allFilledControlsCount / this.allControllesCount) * 100).toFixed(2)));
    if ((this.oldFiles.length + this.fileList.length) > this.maxFilesCount) {
      this.userMsg.error(`الحد الأقصى ${this.maxFilesCount} ملفات`);
      return;
    }

    let files_result: any[] = [];
    if (this.fileList?.length) {
      try {
        this.file = new FormData();
        for (let index = 0; index < this.fileList.length; index++) {
          this.file.append("files", this.fileList[index]);
        }
        let res: any = await firstValueFrom(this.attahcmentService.upload(this.file));
        if (res) {
          files_result = res?.data || res?.Data || [];
        }
        if (!files_result || files_result.length === 0) {
          this.userMsg.error('لم يتم رفع الملفات. حاول مرة أخرى.');
          return;
        }
      } catch (error) {
        this.translateService
          .get('NEDSS.COMMON.SENT_FAILD')
          .subscribe((res: string) => {
            this.userMsg.error(res);
          });
        return;
      }
    }
    let payload = { ...this.brucellaData.value, filesUrls: [...this.oldFiles, ...files_result] };

    if (this.brucellaData.value.id != null) {
      this.investigationService.updateBrucella(payload).subscribe(
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
            this.oldFiles = payload.filesUrls || [];
            this.listOfFiles = [];
            this.fileList = [];
            this.file = new FormData();
          }
        }
        , (error) => {
        }
      )
    } else {
      this.investigationService.addInvestigationBrucella(payload).subscribe(
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
            this.oldFiles = payload.filesUrls || [];
            this.listOfFiles = [];
            this.fileList = [];
            this.file = new FormData();
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
