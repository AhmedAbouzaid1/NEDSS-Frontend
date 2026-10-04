import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { UserMessageService } from 'src/app/core/services/user.message.service';
import { InvestigationService } from '../../services/investigation.service';
import { TranslateService } from '@ngx-translate/core';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-tetanus',
  host: { class: 'investigation-form' },
  templateUrl: './tetanus.component.html',
  styleUrls: ['./tetanus.component.css'],
})
export class TetanusComponent implements OnInit {
  private static readonly DATE_FORMAT = 'yyyy-MM-dd';

  currentLang =
    localStorage.getItem('ls.currentLang') !== undefined &&
      localStorage.getItem('ls.currentLang') !== 'undefined'
      ? localStorage.getItem('ls.currentLang')
      : 'ar';
  tetanusForm: FormGroup;
  currentId: any;
  allFilledControlsCount: number = 0;
  allControllesCount: number = 0;
  patientName: string;
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
      typeBirth: new FormControl(),
      deliveryAttendant: new FormControl(),
      dateBirth: new FormControl(),
      statusMother: new FormControl(),
      motherVaccinated: new FormControl(),
      numberServings: new FormControl(),
      placeBirth: new FormControl(),
      placeBirthOther: new FormControl(),
      cordCuttingMethod: new FormControl(),
      cordTyingType: new FormControl(),
      investigationDate: new FormControl(),
      healthObserverName: new FormControl(),
      surveillanceOfficerName: new FormControl(),
      administrationDirectorName: new FormControl(),
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
            TetanusComponent.DATE_FORMAT
          )
        );
        this.tetanusForm.controls['investigationDate'].setValue(
          this.datePipe.transform(
            this.tetanusForm.value.investigationDate,
            TetanusComponent.DATE_FORMAT
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
    Object.entries(this.tetanusForm.controls).map(([key, value], index) => {
      if (value.value == 'null')
        value.setValue(null);
    })
    this.currentId = this.investigationService.currentid;
    this.tetanusForm.controls['diseaseGroupId'].setValue(this.investigationService.diseaseGroupID);
    this.calculateCompletionPercentage();
    this.tetanusForm.controls['investigationCompletePercentage'].setValue(parseFloat(((this.allFilledControlsCount / this.allControllesCount) * 100).toFixed(2)));

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
        }
      );
    } else {
      this.investigationService
        .addInvestigationtetanus(this.tetanusForm.value)
        .subscribe(
          (response: any) => {
            if (response) {
              this.tetanusForm.controls['id'].setValue(response.data.id);
              this.currentId = response.data.patientID;
              this.translateService
                .get('NEDSS.COMMON.SENT_SUCESSFULLY')
                .subscribe((res: string) => {
                  this.userMsg.success(res);
                });
            }
          },
          (error) => {
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
