import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { UserMessageService } from 'src/app/core/services/user.message.service';
import { InvestigationService } from '../../services/investigation.service';
import { TranslateService } from '@ngx-translate/core';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-schistosomiasis-fasciola',
  templateUrl: './schistosomiasis-fasciola.component.html',
  styleUrls: ['./schistosomiasis-fasciola.component.css']
})
export class SchistosomiasisFasciolaComponent implements OnInit {
  belharisyaForm: FormGroup;
  currentLang: string;
  dir: string;
  delay: boolean = false;
  timer: any;

  constructor(private investigationService: InvestigationService,
    private translateService: TranslateService,
    private userMsg: UserMessageService,
    private datePipe: DatePipe
  ) { }
  currentId: any;
  ngOnInit() {
    this.currentLang =
      localStorage.getItem('ls.currentLang') !== undefined &&
        localStorage.getItem('ls.currentLang') !== 'undefined'
        ? localStorage.getItem('ls.currentLang')
        : 'ar';

    this.belharisyaForm = new FormGroup({
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
    })

    this.currentId = this.investigationService.currentid
    this.belharisyaForm.controls['patientID'].setValue(this.currentId)
    this.investigationService.getByIdSchistosomiasisFasciola(this.currentId,this.investigationService.diseaseGroupID).subscribe(
      res => {
        console.log(res);
        var v = res.data;
        this.belharisyaForm.patchValue(v)
        this.belharisyaForm.patchValue({ fever: this.belharisyaForm.value.fever + "", tc: true });
        //hadSchistosomiasisDate
        this.belharisyaForm.controls['hadSchistosomiasisDate'].setValue(this.datePipe.transform(this.belharisyaForm.value.hadSchistosomiasisDate, 'yyyy-MM-dd'));
        this.belharisyaForm.controls['dateDose'].setValue(this.datePipe.transform(this.belharisyaForm.value.dateDose, 'yyyy-MM-dd'));
        this.belharisyaForm.controls['followUpTreatment'].setValue(this.datePipe.transform(this.belharisyaForm.value.followUpTreatment, 'yyyy-MM-dd'));

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
    Object.entries(this.belharisyaForm.controls).map(([key, value], index) => {
      if (value.value == 'null')
        value.setValue(null);
    })
    this.belharisyaForm.controls['diseaseGroupId'].setValue(this.investigationService.diseaseGroupID);

    if (this.belharisyaForm.value.id != null) {
      this.investigationService.updateSchistosomiasisFasciola(this.belharisyaForm.value).subscribe(
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
      this.investigationService.addInvestigationSchistosomiasisFasciola(this.belharisyaForm.value).subscribe(
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
}
