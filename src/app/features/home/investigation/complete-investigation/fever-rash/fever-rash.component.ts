import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { UserMessageService } from 'src/app/core/services/user.message.service';
import { InvestigationService } from '../../services/investigation.service';
import { TranslateService } from '@ngx-translate/core';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-fever-rash',
  templateUrl: './fever-rash.component.html',
  styleUrls: ['./fever-rash.component.css'],
})
export class FeverRashComponent implements OnInit {
  currentLang =
    localStorage.getItem('ls.currentLang') !== undefined &&
      localStorage.getItem('ls.currentLang') !== 'undefined'
      ? localStorage.getItem('ls.currentLang')
      : 'ar';
  feverRashForm: FormGroup;
  currentId: any;
  allFilledControlsCount: number = 0;
  allControllesCount: number = 0;
  constructor(
    private investigationService: InvestigationService,
    private datePipe: DatePipe,
    private translateService: TranslateService,
    private userMsg: UserMessageService
  ) { }

  ngOnInit() {
    this.feverRashForm = new FormGroup({
      fever: new FormControl(),
      feverDays: new FormControl(),
      maxTemperature: new FormControl(),
      koplikSpots: new FormControl(),
      vesicularRash: new FormControl(),
      reportingDate: new FormControl(),
      historyRash: new FormControl(),
      historyFever: new FormControl(),
      comingCarry: new FormControl(),
      pregnancyWeek: new FormControl(),
      pregnant: new FormControl(),
      femaleChildbearingAge: new FormControl(),
      skinAllergies: new FormControl(),
      foodAllergy: new FormControl(),
      insectAllergy: new FormControl(null),
      drugAllergy: new FormControl(),
      scarletfever: new FormControl(),
      coronaSuspicion: new FormControl(null),
      suspicionDengueFever: new FormControl(null),
      mouthHandFootSyndrome: new FormControl(null),
      red: new FormControl(null),
      seasonalFever: new FormControl(null),
      encephalitis: new FormControl(null),
      felineDisease: new FormControl(null),
      babyPink: new FormControl(null),
      bacterialInfection: new FormControl(null),
      kawasaki: new FormControl(null),
      johnsonSyndrome: new FormControl(null),
      suspectedMeasles: new FormControl(null),
      suspicionGermanMeasles: new FormControl(null),
      viralDermatitis: new FormControl(null),
      sideEffectAfterVaccination: new FormControl(null),
      suspicionImmunodeficiency: new FormControl(null),
      bloodCollectingDate: new FormControl(),
      bloodSendDate: new FormControl(),
      bloodSample: new FormControl(),
      throatSwabCollectingDate: new FormControl(),
      throatSwabSendDate: new FormControl(),
      throatSwabSample: new FormControl(),
      contactbloodCollectingDate: new FormControl(),
      contactbloodSendDate: new FormControl(),
      contactbloodSample: new FormControl(),
      contactthroatSwabCollectingDate: new FormControl(),
      contactthroatSwabSendDate: new FormControl(),
      contactthroatSwabSample: new FormControl(),
      statusCode: new FormControl(),
      confirmedCasesDuringPreviousMonth: new FormControl(),
      contactWithCase: new FormControl(),
      caseFeverRash: new FormControl(),
      rashContactWithCase: new FormControl(),
      measlesInfestedArea: new FormControl(),
      dateVisit: new FormControl(),
      importedCase: new FormControl(),
      caseName: new FormControl(),
      countryOfCase: new FormControl(),
      epidemicOutbreak: new FormControl(),
      sourceInfection: new FormControl(),
      statusCodCase: new FormControl(),
      historyRashSource: new FormControl(),
      finalClassification: new FormControl(),
      vaccinationStatus: new FormControl(),
      mmr1Unit: new FormControl(),
      mmr2Unit: new FormControl(),
      campaign2015Unit: new FormControl(),
      campaign2020Unit: new FormControl(),
      otherUnit: new FormControl(),
      mmr1Management: new FormControl(),
      mmr2Management: new FormControl(),
      campaign2015Management: new FormControl(),
      campaign2020Management: new FormControl(),
      otherManagement: new FormControl(),
      numberIndirectContacts: new FormControl(),
      numberDirectContacts: new FormControl(),
      patientID: new FormControl(),
      diseaseGroupID: new FormControl(this.investigationService.diseaseGroupID),
      id: new FormControl(),
      investigationCompletePercentage:new FormControl(),
    });
    this.currentId = this.investigationService.currentid;
    this.feverRashForm.controls['patientID'].setValue(this.currentId);
    this.investigationService.getByIdFeverRash(this.currentId).subscribe(
      (res) => {
        console.log(res);
        var v = res.data;
        // if (v.bloodSample == null) {
        //   v.bloodSample = 2;
        // }
        // if (v.throatSwabSample == null) {
        //   v.throatSwabSample = 2;
        // }
        // if (v.contactbloodSample == null) {
        //   v.contactbloodSample = 2;
        // }
        // if (v.contactthroatSwabSample == null) {
        //   v.contactthroatSwabSample = 2;
        // }

        /*   coronaSuspicion:new FormControl(),
      suspicionDengueFever:new FormControl(),
      mouthHandFootSyndrome:new FormControl(),
      red:new FormControl(),
      seasonalFever:new FormControl(),
      encephalitis:new FormControl(),
      felineDisease:new FormControl(),
      babyPink:new FormControl(),
      bacterialInfection:new FormControl(),
      kawasaki:new FormControl(),
      johnsonSyndrome:new FormControl(),
      suspectedMeasles:new FormControl(), */
        this.feverRashForm.patchValue(v);

        this.feverRashForm.patchValue({
          fever: this.feverRashForm.value.fever + '',
          tc: true,
        });
        this.feverRashForm.controls['historyFever'].setValue(
          this.datePipe.transform(
            this.feverRashForm.value.historyFever,
            'yyyy-MM-dd'
          )
        );
        this.feverRashForm.controls['historyRash'].setValue(
          this.datePipe.transform(
            this.feverRashForm.value.historyRash,
            'yyyy-MM-dd'
          )
        );
        this.feverRashForm.controls['reportingDate'].setValue(
          this.datePipe.transform(
            this.feverRashForm.value.reportingDate,
            'yyyy-MM-dd'
          )
        );
        this.feverRashForm.controls['bloodCollectingDate'].setValue(
          this.datePipe.transform(
            this.feverRashForm.value.bloodCollectingDate,
            'yyyy-MM-dd'
          )
        );
        this.feverRashForm.controls['bloodSendDate'].setValue(
          this.datePipe.transform(
            this.feverRashForm.value.bloodSendDate,
            'yyyy-MM-dd'
          )
        );
        this.feverRashForm.controls['throatSwabCollectingDate'].setValue(
          this.datePipe.transform(
            this.feverRashForm.value.throatSwabCollectingDate,
            'yyyy-MM-dd'
          )
        );
        this.feverRashForm.controls['throatSwabSendDate'].setValue(
          this.datePipe.transform(
            this.feverRashForm.value.throatSwabSendDate,
            'yyyy-MM-dd'
          )
        );
        this.feverRashForm.controls['contactbloodCollectingDate'].setValue(
          this.datePipe.transform(
            this.feverRashForm.value.contactbloodCollectingDate,
            'yyyy-MM-dd'
          )
        );
        this.feverRashForm.controls['contactbloodSendDate'].setValue(
          this.datePipe.transform(
            this.feverRashForm.value.contactbloodSendDate,
            'yyyy-MM-dd'
          )
        );
        this.feverRashForm.controls['contactthroatSwabCollectingDate'].setValue(
          this.datePipe.transform(
            this.feverRashForm.value.contactthroatSwabCollectingDate,
            'yyyy-MM-dd'
          )
        );
        this.feverRashForm.controls['contactthroatSwabSendDate'].setValue(
          this.datePipe.transform(
            this.feverRashForm.value.contactthroatSwabSendDate,
            'yyyy-MM-dd'
          )
        );
        this.feverRashForm.patchValue({
          bloodSample: this.feverRashForm.value.bloodSample + '',
          tc: true,
        });
        this.feverRashForm.patchValue({
          throatSwabSample: this.feverRashForm.value.throatSwabSample + '',
          tc: true,
        });
        this.feverRashForm.patchValue({
          contactbloodSample: this.feverRashForm.value.contactbloodSample + '',
          tc: true,
        });
        this.feverRashForm.patchValue({
          contactthroatSwabSample:
            this.feverRashForm.value.contactthroatSwabSample + '',
          tc: true,
        });

        this.feverRashForm.controls['contactWithCase'].setValue(
          this.datePipe.transform(
            this.feverRashForm.value.contactWithCase,
            'yyyy-MM-dd'
          )
        );
        this.feverRashForm.controls['rashContactWithCase'].setValue(
          this.datePipe.transform(
            this.feverRashForm.value.rashContactWithCase,
            'yyyy-MM-dd'
          )
        );
        this.feverRashForm.controls['dateVisit'].setValue(
          this.datePipe.transform(
            this.feverRashForm.value.dateVisit,
            'yyyy-MM-dd'
          )
        );
        this.feverRashForm.controls['historyRashSource'].setValue(
          this.datePipe.transform(
            this.feverRashForm.value.historyRashSource,
            'yyyy-MM-dd'
          )
        );
        this.calculateCompletionPercentage();
      },
      (error) => {
        this.translateService
          .get('NEDSS.COMMON.SENT_FAILD')
          .subscribe((res: string) => {
            this.userMsg.error(res);
          });
      }
    );
  }

  save() {
    Object.entries(this.feverRashForm.controls).map(([key, value], index) => {
      if (value.value == 'null')
        value.setValue(null);
    })
    //console.log(this.feverRashForm.value);
    // this.feverRashForm.controls['diseaseGroupID'].setValue(this.investigationService.diseaseGroupID);
    this.calculateCompletionPercentage();
    this.feverRashForm.controls['investigationCompletePercentage'].setValue(parseFloat(((this.allFilledControlsCount / this.allControllesCount) * 100).toFixed(2)));
    //investigationCompletePercentage
    if (this.feverRashForm.value.id != null) {
      this.investigationService
        .updateFeverRash(this.feverRashForm.value)
        .subscribe(
          (response: any) => {
            if (response) {
              this.translateService
                .get('NEDSS.COMMON.SENT_SUCESSFULLY')
                .subscribe((res: string) => {
                  this.userMsg.success(res);
                });
            }
          },
          (error) => {
            this.translateService
              .get('NEDSS.COMMON.SENT_FAILD')
              .subscribe((res: string) => {
                this.userMsg.error(res);
              });
          }, () =>{
              this.calculateCompletionPercentage();
          }
        );
    } else {
      this.investigationService
        .addInvestigationFeverRash(this.feverRashForm.value)
        .subscribe(
          (response: any) => {
            if (response) {
              this.translateService
                .get('NEDSS.COMMON.SENT_SUCESSFULLY')
                .subscribe((res: string) => {
                  this.userMsg.success(res);
                });
            }
          },
          (error) => {
            this.translateService
              .get('NEDSS.COMMON.SENT_FAILD')
              .subscribe((res: string) => {
                this.userMsg.error(res);
              });
          }, () => {
            this.calculateCompletionPercentage();
          }
        );
    }
  }

  calculateCompletionPercentage() {
    this.allFilledControlsCount = 0;
    const data = this.feverRashForm.value;
    // Exclude fields you don't want to count (like 'id')
    const excludedFields = ['id','patientID','diseaseGroupID','investigationCompletePercentage'];
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
