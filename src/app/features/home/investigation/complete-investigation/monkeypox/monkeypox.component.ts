import { Component, OnInit } from '@angular/core';
import { FormArray, FormControl, FormGroup } from '@angular/forms';
import { SharedDataService } from '../../../general-data/services/shared-data.service';
import { UserMessageService } from 'src/app/core/services/user.message.service';
import { LookupsGetterService } from 'src/app/core/services/lookups-getter.service';
import { TranslateService } from '@ngx-translate/core';
import { InvestigationService } from '../../services/investigation.service';
import { DatePipe } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-monkeypox',
  templateUrl: './monkeypox.component.html',
  styleUrls: ['./monkeypox.component.css']
})
export class MonkeypoxComponent implements OnInit {
  currentLang =
    localStorage.getItem('ls.currentLang') !== undefined &&
      localStorage.getItem('ls.currentLang') !== 'undefined'
      ? localStorage.getItem('ls.currentLang')
      : 'ar';
  monkeypoxForm: FormGroup
  loadingPanel: boolean;
  cities: any;
  governments: any;
  principalities: any; controlsCount: number = 0;
  allFilledControlsCount: number = 0;
  allControllesCount: number = 0;
  patientName: string;
  currentId: any;
  diseaseGroupID: any;
  constructor(private investigationService: InvestigationService, private sharedDataService: SharedDataService, private lookupsService: LookupsGetterService, private translateService: TranslateService,
    private userMsg: UserMessageService,
    private route: ActivatedRoute ,private Router: Router, 
    private datePipe: DatePipe
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
    this.monkeypoxForm = new FormGroup({
      patientName: new FormControl(),
      //completePercentage: new FormControl(),
      investigationCompletePercentage:new FormControl(),
      relationshipWithPatient: new FormControl(),
      dateOfContact: new FormControl(),
      touchingPatient: new FormControl(),
      touchingTheBelongings: new FormControl(),
      patientName2: new FormControl(),
      relationshipWithPatient2: new FormControl(),
      dateOfContact2: new FormControl(),
      touchingPatient2: new FormControl(),
      touchingTheBelongings2: new FormControl(),
      patientName3: new FormControl(),
      relationshipWithPatient3: new FormControl(),
      dateOfContact3: new FormControl(),
      touchingPatient3: new FormControl(),
      touchingTheBelongings3: new FormControl(),
      patientTouchWildAnimal: new FormControl(),
      animal: new FormControl(),
      animalWasNormal: new FormControl(),
      rashOrUlcers: new FormControl(),
      touchedDeadAnimal: new FormControl(),
      nameAnimal: new FormControl(),
      mixingDate: new FormControl(),
      mixingType: new FormControl(),
      animalsForSlaughter: new FormControl(),
      kind: new FormControl(),
      placePurchase: new FormControl(),
      travelOutsideCountry: new FormControl(),
      nameCountry: new FormControl(),
      dateTravel: new FormControl(),
      arrivalDate: new FormControl(),
      threeWeeksPreceding: new FormControl(),
      places: new FormControl(),
      places2: new FormControl(),
      places3: new FormControl(),
      ravelDuringIllness: new FormControl(),
      duringIllnessPlaces: new FormControl(),
      duringIllnessPlaces2: new FormControl(),
      duringIllnessPlaces3: new FormControl(),
      sampleCollected: new FormControl(),
      sampleDate: new FormControl(),
      sampleType: new FormControl(),
      admittedHospital: new FormControl(),
      nameHospital: new FormControl(),
      isolationSection: new FormControl(),
      dateHospitalization: new FormControl(),
      patientCondition: new FormControl(),
      dateDepartureDeath: new FormControl(),
      dateDeath: new FormControl(),
      deathPlace: new FormControl(),
      village: new FormControl(),
      city: new FormControl(),
      governorate: new FormControl(),
      patientID: new FormControl(),
      id: new FormControl(),
      diseaseGroupId: new FormControl(this.diseaseGroupID),
    });

    //this.monkeypoxForm.controls['completePercentage'].disable();
    //this.controlsCount = this.calculateCompletePercentage();
  }


  ngOnInit() {
    this.getGovernments();

    // this.monkeypoxForm.controls['completePercentage'].setValue(
    //   this.controlsCount
    // );
    if (this.currentId != null) {
    this.monkeypoxForm.controls['patientID'].setValue(this.currentId)
    this.getById();
    this.calculateCompletionPercentage();

    } else {
      this.Router.navigateByUrl("/home/investigations");
    }
  }


  getById() {
    this.investigationService.getByIdMonkeypox(this.currentId).subscribe(

      res => {
        console.log(res);
        var v = res.data;
        this.monkeypoxForm.patchValue(v)
        this.monkeypoxForm.controls['dateOfContact'].setValue(this.datePipe.transform(this.monkeypoxForm.value.dateOfContact, 'yyyy-MM-dd'));
        this.monkeypoxForm.controls['dateOfContact2'].setValue(this.datePipe.transform(this.monkeypoxForm.value.dateOfContact2, 'yyyy-MM-dd'));
        this.monkeypoxForm.controls['dateOfContact3'].setValue(this.datePipe.transform(this.monkeypoxForm.value.dateOfContact3, 'yyyy-MM-dd'));
        this.monkeypoxForm.controls['mixingDate'].setValue(this.datePipe.transform(this.monkeypoxForm.value.mixingDate, 'yyyy-MM-dd'));
        this.monkeypoxForm.controls['dateTravel'].setValue(this.datePipe.transform(this.monkeypoxForm.value.dateTravel, 'yyyy-MM-dd'));
        this.monkeypoxForm.controls['arrivalDate'].setValue(this.datePipe.transform(this.monkeypoxForm.value.arrivalDate, 'yyyy-MM-dd'));
        this.monkeypoxForm.controls['sampleDate'].setValue(this.datePipe.transform(this.monkeypoxForm.value.sampleDate, 'yyyy-MM-dd'));
        this.monkeypoxForm.controls['dateHospitalization'].setValue(this.datePipe.transform(this.monkeypoxForm.value.dateHospitalization, 'yyyy-MM-dd'));
        this.monkeypoxForm.controls['dateDepartureDeath'].setValue(this.datePipe.transform(this.monkeypoxForm.value.dateDepartureDeath, 'yyyy-MM-dd'));
        this.monkeypoxForm.controls['dateDeath'].setValue(this.datePipe.transform(this.monkeypoxForm.value.dateDeath, 'yyyy-MM-dd'));
        this.ChangGovernorate();
        //this.controlsCount = this.calculateCompletePercentage();
        //this.monkeypoxForm.value.completePercentage = this.controlsCount;

        Object.entries(this.monkeypoxForm.controls).map(
          ([key, value], index) => {
            if (value.value == 'null')
              value.setValue(null);
          });

        //this.controlsCount = this.calculateCompletePercentage();
        //this.monkeypoxForm.value.completePercentage = this.controlsCount;

          this.calculateCompletionPercentage();
      }
      , (error) => {
        this.translateService
          .get('NEDSS.COMMON.SENT_FAILD')
          .subscribe((res: string) => {
            this.userMsg.error(res);
          });
      }
    );
  }



  // /**
  //  * Calculate the percentage
  //  * @returns
  //  */
  // calculateCompletePercentage(): number {
  //   Object.entries(this.monkeypoxForm.controls).map(([key, value], index) => {
  //     if (value.value == 'null')
  //       value.setValue(null);
  //     else if (value.value != null && !isNaN(+value.value)) {
  //       value.setValue(parseInt(value.value.toString()));
  //     }
  //   });
  //   this.allControllesCount = this.countAllControls(this.monkeypoxForm);
  //   if (this.monkeypoxForm.value.id != null) {
  //     this.allFilledControlsCount = this.countFilledControls(this.monkeypoxForm);
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

  ChangGovernorate() {

    //this.getCities(this.monkeypoxForm.value.governorate);
  }

  
  ChanghomeCity() {
    this.getPrincipalities(this.monkeypoxForm.value.city);
  }



  getGovernments() {
    this.lookupsService.getAllGovernments().subscribe((result: any) => {
      if (result != null && result != undefined) {
        this.governments = result.data;

      }
      this.loadingPanel = false;
    }, error => {
      this.loadingPanel = false;
      this.translateService.get('NEDSS.COMMON.INTERNAL_SERVER_ERROR').subscribe((res: string) => {
        this.userMsg.error(res);
      });
    });
  }
  getCities(healthAdministrationID: any) {
    this.lookupsService.getPageCitys({ healthAdministrationID: healthAdministrationID }).subscribe((result: any) => {
      if (result != null && result != undefined) {
        this.cities = result.data;

      }
      this.loadingPanel = false;
    }, error => {
      this.loadingPanel = false;
      this.translateService.get('NEDSS.COMMON.INTERNAL_SERVER_ERROR').subscribe((res: string) => {
        this.userMsg.error(res);
      });
    });
  }
  getPrincipalities(healthOfficeID: any) {
    this.lookupsService.getPagePrincipalitys({ healthOfficeID: healthOfficeID }).subscribe((result: any) => {
      if (result != null && result != undefined) {
        this.principalities = result.data;

      }
      this.loadingPanel = false;
    }, error => {
      this.loadingPanel = false;
      this.translateService.get('NEDSS.COMMON.INTERNAL_SERVER_ERROR').subscribe((res: string) => {
        this.userMsg.error(res);
      });
    });
  }


  save() {
    //this.monkeypoxForm.controls['completePercentage'].enable();
    //this.controlsCount = this.calculateCompletePercentage();
    Object.entries(this.monkeypoxForm.controls).map(([key, value], index) => {
      if (value.value == 'null')
        value.setValue(null);
    });
    this.calculateCompletionPercentage();
    this.monkeypoxForm.controls['investigationCompletePercentage'].setValue(parseFloat(((this.allFilledControlsCount / this.allControllesCount) * 100).toFixed(2)));

    //this.monkeypoxForm.controls['completePercentage'].setValue(this.controlsCount);
    this.monkeypoxForm.controls['diseaseGroupId'].setValue(this.diseaseGroupID);
    //console.log(this.monkeypoxForm.value);
    //console.log(this.rabiesForm.value);
    if (this.monkeypoxForm.value.id != null) {
      this.investigationService.updateMonkeypox(this.monkeypoxForm.value).subscribe(
        (response: any) => {
          if (response) {
            //this.monkeypoxForm.controls['completePercentage'].disable();
            document.getElementById("jump_to_this_location").scrollIntoView({ behavior: 'smooth' });
            //this.controlsCount = this.calculateCompletePercentage();
            // this.monkeypoxForm.value.completePercentage = this.controlsCount;
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
      this.investigationService.addInvestigationMonkeypox(this.monkeypoxForm.value).subscribe(
        (response: any) => {
          if (response) {
            //this.monkeypoxForm.controls['completePercentage'].disable();
            document.getElementById("jump_to_this_location").scrollIntoView({ behavior: 'smooth' });

            this.monkeypoxForm.value.id = response.data.id;
            this.currentId = response.data.patientID;
            this.getById();
            //this.controlsCount = this.calculateCompletePercentage();
            //this.monkeypoxForm.value.completePercentage = this.controlsCount;            
            this.translateService.get('NEDSS.COMMON.SENT_SUCESSFULLY')
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
    const data = this.monkeypoxForm.value;
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
