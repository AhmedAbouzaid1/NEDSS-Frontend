import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { UserMessageService } from 'src/app/core/services/user.message.service';
import { InvestigationService } from '../../services/investigation.service';
import { TranslateService } from '@ngx-translate/core';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-tetanus',
  templateUrl: './tetanus.component.html',
  styleUrls: ['./tetanus.component.css'],
})
export class TetanusComponent implements OnInit {
    currentLang =
      localStorage.getItem('ls.currentLang') !== undefined &&
        localStorage.getItem('ls.currentLang') !== 'undefined'
        ? localStorage.getItem('ls.currentLang')
        : 'ar';
  tetanusForm: FormGroup;
  currentId: any;
  allFilledControlsCount: number = 0;
  allControllesCount: number = 0;
  patientName:string;
  constructor(
    private investigationService: InvestigationService,
    private translateService: TranslateService,
    private userMsg: UserMessageService,
    private datePipe: DatePipe
  ) { 
    if (this.investigationService.patient.firstName != null && this.investigationService.patient.firstName != undefined) {
      this.patientName = this.investigationService.patient.firstName + " " + this.investigationService.patient.secondName + " " + this.investigationService.patient.thirdName;
    }
  }

  ngOnInit() {
    this.tetanusForm = new FormGroup({
      fever: new FormControl(),
      feverDays: new FormControl(),
      maxTemperature: new FormControl(),
      inabilityOpenMouth: new FormControl(),
      headache: new FormControl(),
      muscleCramps: new FormControl(),
      constantCrying: new FormControl(),
      difficultySwallowing: new FormControl(),
      smiley: new FormControl(),
      typeBirth: new FormControl(),
      deliveryAttendant: new FormControl(),
      dateBirth: new FormControl(),
      statusMother: new FormControl(),
      motherVaccinated: new FormControl(),
      numberServings: new FormControl(),
      placeBirth: new FormControl(),
      cordCuttingMethod: new FormControl(),
      cordTyingType: new FormControl(),
      patientID: new FormControl(),
      id: new FormControl(),
      diseaseGroupId: new FormControl(this.investigationService.diseaseGroupID),
      investigationCompletePercentage: new FormControl(),
    });
    this.currentId = this.investigationService.currentid;
    this.tetanusForm.controls['patientID'].setValue(this.currentId);
    this.investigationService.getByIdtetanus(this.currentId).subscribe(
      (res) => {
        console.log(res);
        var v = res.data;
        this.tetanusForm.patchValue(v);
        this.tetanusForm.controls['dateBirth'].setValue(
          this.datePipe.transform(
            this.tetanusForm.value.dateBirth,
            'yyyy-MM-dd'
          )
        );
        this.tetanusForm.patchValue({
          fever: this.tetanusForm.value.fever + '',
          tc: true,
        });

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
    Object.entries(this.tetanusForm.controls).map(([key, value], index) => {
      if (value.value == 'null')
        value.setValue(null);
    })
    this.currentId = this.investigationService.currentid;
    this.tetanusForm.controls['diseaseGroupId'].setValue(this.investigationService.diseaseGroupID);
    this.tetanusForm.controls['investigationCompletePercentage'].setValue(parseFloat(((this.allFilledControlsCount / this.allControllesCount) * 100).toFixed(2)));
    this.calculateCompletionPercentage();

    console.log(this.tetanusForm.value);
    if (this.tetanusForm.value.id != null) {
      this.investigationService.updatetetanus(this.tetanusForm.value).subscribe(
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
        }
      );
    } else {
      this.investigationService
        .addInvestigationtetanus(this.tetanusForm.value)
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
          }
        );
    }
  }

         //BL
         calculateCompletionPercentage() {
          this.allFilledControlsCount = 0;
          const data = this.tetanusForm.value;
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
