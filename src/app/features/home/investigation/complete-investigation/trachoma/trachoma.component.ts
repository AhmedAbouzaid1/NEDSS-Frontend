import { calculateCompletionStats } from '../shared/investigation-summary.utils';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import { UserMessageService } from 'src/app/core/services/user.message.service';
import { InvestigationService } from '../../services/investigation.service';

@Component({
  selector: 'app-trachoma',
  templateUrl: './trachoma.component.html',
  styleUrls: ['./trachoma.component.css']
})
export class TrachomaComponent implements OnInit {
  currentLang =
    localStorage.getItem('ls.currentLang') !== undefined &&
      localStorage.getItem('ls.currentLang') !== 'undefined'
      ? localStorage.getItem('ls.currentLang')
      : 'ar';

  trachomaForm: FormGroup;
  currentId: any;
  allFilledControlsCount = 0;
  allControllesCount = 0;
  patientName: string;

  constructor(
    private investigationService: InvestigationService,
    private translateService: TranslateService,
    private userMsg: UserMessageService
  ) {
    if (
      this.investigationService.patient.firstName != null &&
      this.investigationService.patient.firstName != undefined
    ) {
      this.patientName =
        this.investigationService.patient.firstName +
        ' ' +
        this.investigationService.patient.secondName +
        ' ' +
        this.investigationService.patient.thirdName;
    }
  }

  ngOnInit(): void {
    this.trachomaForm = new FormGroup({
      id: new FormControl(),
      patientID: new FormControl(),
      folliclesPresenceTf: new FormControl(),
      folliclesCount: new FormControl(),
      trachomatousTrichiasisTt: new FormControl(),
      infectionLocation: new FormControl(),
      infectionClassification: new FormControl(),
      actionTaken: new FormControl(),
      actionTakenOther: new FormControl(),
      examiningDoctorName: new FormControl(),
      surveillanceOfficerName: new FormControl(),
      approvedBy: new FormControl(),
      diseaseGroupId: new FormControl(this.investigationService.diseaseGroupID),
      investigationCompletePercentage: new FormControl()
    });

    this.currentId = this.investigationService.currentid;
    this.trachomaForm.controls['patientID'].setValue(this.currentId);

    this.investigationService
      .getByIdTrachoma(this.currentId, this.investigationService.diseaseGroupID)
      .subscribe(
        (res) => {
          const v = res.data ?? {};
          this.trachomaForm.patchValue(v);
          this.calculateCompletionPercentage();
        },
        () => {
          this.translateService
            .get('NEDSS.COMMON.SENT_FAILD')
            .subscribe((msg: string) => this.userMsg.error(msg));
        }
      );
  }

  save(): void {
    this.calculateCompletionPercentage();
    const payload = { ...this.trachomaForm.getRawValue() };
    payload.diseaseGroupId = this.investigationService.diseaseGroupID;
    payload.patientID = this.currentId;
    payload.investigationCompletePercentage = parseFloat(
      ((this.allFilledControlsCount / this.allControllesCount) * 100).toFixed(2)
    );

    const request$ =
      this.trachomaForm.value.id != null
        ? this.investigationService.updateTrachoma(payload)
        : this.investigationService.addInvestigationTrachoma(payload);

    request$.subscribe(
      (response: any) => {
        if (response) {
          if (response.data?.id) {
            this.trachomaForm.patchValue({ id: response.data.id });
          }
          this.translateService
            .get('NEDSS.COMMON.SENT_SUCESSFULLY')
            .subscribe((msg: string) => this.userMsg.success(msg));
        }
      },
      () => {
      }
    );
  }

  calculateCompletionPercentage(): void {
    const stats = calculateCompletionStats(this.trachomaForm.value, {
      excludedFields: [
        'id',
        'patientID',
        'investigationCompletePercentage',
        'diseaseGroupId',
        'createdDate'
      ]
    });
    this.allControllesCount = stats.totalFields;
    this.allFilledControlsCount = stats.filledFields;
  }
}
