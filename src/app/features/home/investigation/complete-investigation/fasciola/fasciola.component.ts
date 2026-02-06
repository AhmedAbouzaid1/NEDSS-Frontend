import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { UserMessageService } from 'src/app/core/services/user.message.service';
import { InvestigationService } from '../../services/investigation.service';
import { TranslateService } from '@ngx-translate/core';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-fasciola',
  templateUrl: './fasciola.component.html',
  styleUrls: ['./fasciola.component.css']
})
export class FasciolaComponent implements OnInit{
  fasciolaForm: FormGroup;
  currentLang: string;
  //dir: string;
  //delay: boolean = false;
  //timer: any;
  allFilledControlsCount: number = 0;
  allControllesCount: number = 0;
  patientName: string;
  constructor(private investigationService: InvestigationService,
    private translateService: TranslateService,
    private userMsg: UserMessageService,
    private datePipe: DatePipe
  ) { 
    if (this.investigationService.patient.firstName != null && this.investigationService.patient.firstName != undefined) {
      this.patientName = this.investigationService.patient.firstName + " " + this.investigationService.patient.secondName + " " + this.investigationService.patient.thirdName;
    }
  }
  currentId: any;
  ngOnInit() {
    this.currentLang =
      localStorage.getItem('ls.currentLang') !== undefined &&
        localStorage.getItem('ls.currentLang') !== 'undefined'
        ? localStorage.getItem('ls.currentLang')
        : 'ar';

    this.fasciolaForm = new FormGroup({
      fever: new FormControl(),
      feverDays: new FormControl(),
      maxTemperature: new FormControl(),
      bloodyStools: new FormControl(),
      bloodyUrine: new FormControl(),
      painUrinating: new FormControl(),
      frequentUrinate: new FormControl(),
      obstructionducts: new FormControl(),
      esophagealVarices: new FormControl(),
      severeAirway: new FormControl(),
      enlargedliver: new FormControl(),
      enlargedSpleen: new FormControl(),
      painAbdomen: new FormControl(),
      acuteFailure: new FormControl(),
      bileColic: new FormControl(),
      portalHypertension: new FormControl(),
      difficultySwallowing: new FormControl(),
      bathingSwimming: new FormControl(),
      swimmingPlace: new FormControl(),
      drinkingCanalWater: new FormControl(),
      drinkingCanalWaterPlace: new FormControl(),
      washingUtensils: new FormControl(),
      washingUtensilsPlace: new FormControl(),
      workAgriculture: new FormControl(),
      workAgriculturePlace: new FormControl(),
      urinateCanal: new FormControl(),
      urinateCanalPlace: new FormControl(),
      drinkingCanalHome: new FormControl(),
      drinkingCanalHomePlace: new FormControl(),
      livestockToHouse: new FormControl(),
      canalsNearLivestockHouse: new FormControl(),
      animalsSlaughteredOutside: new FormControl(),
      animalsSlaughteredOutsidePlace: new FormControl(),
      placesDisposalResidues: new FormControl(),
      leafyVegetables: new FormControl(),
      sourceVegetables: new FormControl(),
      eatVegetables: new FormControl(),
      eatVegetablesMention: new FormControl(),
      source: new FormControl(),
      hadSchistosomiasis: new FormControl(),
      hadSchistosomiasisDate: new FormControl(),
      treatmentSchistosomiasis: new FormControl(),
      dateDose: new FormControl(),
      propertyName: new FormControl(),
      dosage: new FormControl(),
      followUpTreatment: new FormControl(),
      vegetablesWashedLemon: new FormControl(),
      locationDirectContact: new FormControl(),
      nameCanal: new FormControl(),
      lengthStream: new FormControl(),
      possibleDirect: new FormControl(),
      mentionTest: new FormControl(),
      numberPolynesque: new FormControl(),
      numberBiomflaria: new FormControl(),
      numberYemeni: new FormControl(),
      snailsPositive: new FormControl(),
      mentionPesticide: new FormControl(),
      pesticideConcentration: new FormControl(),
      patientID: new FormControl(),
      id: new FormControl(),
      diseaseGroupId: new FormControl(this.investigationService.diseaseGroupID),
      investigationCompletePercentage:new FormControl(),

    })

    this.currentId = this.investigationService.currentid
    this.fasciolaForm.controls['patientID'].setValue(this.currentId)
    this.investigationService.getByIdSchistosomiasisFasciola(this.currentId,this.investigationService.diseaseGroupID).subscribe(
      res => {
        console.log(res);
        var v = res.data;
        this.fasciolaForm.patchValue(v)
        this.fasciolaForm.patchValue({ fever: this.fasciolaForm.value.fever + "", tc: true });
        console.log('feveeeeeeeer',this.fasciolaForm.value.fever);
        //hadSchistosomiasisDate
        this.fasciolaForm.controls['hadSchistosomiasisDate'].setValue(this.datePipe.transform(this.fasciolaForm.value.hadSchistosomiasisDate, 'yyyy-MM-dd'));
        this.fasciolaForm.controls['dateDose'].setValue(this.datePipe.transform(this.fasciolaForm.value.dateDose, 'yyyy-MM-dd'));
        this.fasciolaForm.controls['followUpTreatment'].setValue(this.datePipe.transform(this.fasciolaForm.value.followUpTreatment, 'yyyy-MM-dd'));
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
    Object.entries(this.fasciolaForm.controls).map(([key, value], index) => {
      if (value.value == 'null')
        value.setValue(null);
    })
    this.fasciolaForm.controls['diseaseGroupId'].setValue(this.investigationService.diseaseGroupID);
    this.calculateCompletionPercentage();
    this.fasciolaForm.controls['investigationCompletePercentage'].setValue(parseFloat(((this.allFilledControlsCount / this.allControllesCount) * 100).toFixed(2)));
    if (this.fasciolaForm.value.id != null) {
      this.investigationService.updateSchistosomiasisFasciola(this.fasciolaForm.value).subscribe(
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
      this.investigationService.addInvestigationSchistosomiasisFasciola(this.fasciolaForm.value).subscribe(
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
      const data = this.fasciolaForm.value;
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
