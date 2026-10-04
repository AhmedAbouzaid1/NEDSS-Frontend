import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { UserMessageService } from 'src/app/core/services/user.message.service';
import { InvestigationService } from '../../services/investigation.service';
import { TranslateService } from '@ngx-translate/core';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-schistosomiasis',
  host: { class: 'investigation-form' },
  templateUrl: './schistosomiasis.component.html',
  styleUrls: ['./schistosomiasis.component.css']
})
export class SchistosomiasisComponent implements OnInit {
  belharisyaForm: FormGroup;
  currentLang: string;
  dir: string;
  delay: boolean = false;
  timer: any;
  patientName: string = '';
  allControllesCount: number = 0;
  allFilledControlsCount: number = 0;

  constructor(private investigationService: InvestigationService,
    private translateService: TranslateService,
    private userMsg: UserMessageService,
    private datePipe: DatePipe
  ) { }
  currentId: any;
  ngOnInit() {
    this.patientName =
      (this.investigationService.patient?.firstName || '') +
      ' ' +
      (this.investigationService.patient?.secondName || '') +
      ' ' +
      (this.investigationService.patient?.thirdName || '');

    this.currentLang =
      localStorage.getItem('ls.currentLang') !== undefined &&
        localStorage.getItem('ls.currentLang') !== 'undefined'
        ? localStorage.getItem('ls.currentLang')
        : 'ar';

    this.belharisyaForm = new FormGroup({
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
      livestockAnimalType: new FormControl(),
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
      investigationCompletePercentage: new FormControl(),
    })

    this.currentId = this.investigationService.currentid
    this.belharisyaForm.controls['patientID'].setValue(this.currentId)
    this.calculateCompletionPercentage();
    this.belharisyaForm.valueChanges.subscribe(() => {
      this.calculateCompletionPercentage();
    });
    this.investigationService.getByIdSchistosomiasis(this.currentId,this.investigationService.diseaseGroupID).subscribe(
      res => {
        console.log(res);
        var v = res.data;
        this.belharisyaForm.patchValue(v)
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
      if (value.value == 'null' || value.value === '')
        value.setValue(null);
    })
    this.belharisyaForm.controls['diseaseGroupId'].setValue(this.investigationService.diseaseGroupID);
    this.calculateCompletionPercentage();
    this.belharisyaForm.controls['investigationCompletePercentage'].setValue(
      this.allControllesCount === 0
        ? 0
        : parseFloat(((this.allFilledControlsCount / this.allControllesCount) * 100).toFixed(2))
    );

    if (this.belharisyaForm.value.id != null) {
      this.investigationService.updateSchistosomiasis(this.belharisyaForm.value).subscribe(
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
      this.investigationService.addInvestigationSchistosomiasis(this.belharisyaForm.value).subscribe(
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

  calculateCompletionPercentage(): void {
    const data = this.belharisyaForm?.value ?? {};
    const excludedFields = [
      'id', 'patientID', 'diseaseGroupId', 'investigationCompletePercentage', 'createdDate'
    ];
    const fields = Object.keys(data).filter((key) => !excludedFields.includes(key));

    this.allControllesCount = fields.length;
    this.allFilledControlsCount = fields.reduce((acc, key) => {
      return this.isFieldFilled(data[key]) ? acc + 1 : acc;
    }, 0);
  }

  private isFieldFilled(value: any): boolean {
    if (value === null || value === undefined || value === '' || value === 'null') {
      return false;
    }
    if (typeof value === 'boolean') {
      return value;
    }
    return true;
  }
}
