import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import { UserMessageService } from 'src/app/core/services/user.message.service';
import { InvestigationService } from '../../services/investigation.service';
import { calculateCompletionStats } from '../shared/investigation-summary.utils';

@Component({
  selector: 'app-visceral-leishmania',
  host: { class: 'investigation-form' },
  templateUrl: './visceral-leishmania.component.html',
  styleUrls: ['./visceral-leishmania.component.css'],
})
export class VisceralLeishmaniaComponent implements OnInit {
  visceralLeishmaniaForm: FormGroup;
  allFilledControlsCount = 0;
  allControllesCount = 0;
  patientName: string;
  currentId: any;

  constructor(
    private investigationService: InvestigationService,
    private translateService: TranslateService,
    private userMsg: UserMessageService
  ) {
    const patient = this.investigationService.patient;
    if (patient?.firstName != null) {
      this.patientName = `${patient.firstName} ${patient.secondName} ${patient.thirdName}`;
    }
  }

  ngOnInit() {
    this.visceralLeishmaniaForm = new FormGroup({
      id: new FormControl(),
      patientID: new FormControl(),
      chronicChestDiseases: new FormControl(),
      chronicHeartDisease: new FormControl(),
      highBloodPressure: new FormControl(),
      excessiveObesity: new FormControl(),
      immuneDisease: new FormControl(),
      aids: new FormControl(),
      pregnantWomen: new FormControl(),
      diabetes: new FormControl(),
      liverDiseases: new FormControl(),
      kidneyDisease: new FormControl(),
      diseasesNervousMuscular: new FormControl(),
      bloodBiseases: new FormControl(),
      other: new FormControl(),
      diseaseGroupId: new FormControl(this.investigationService.diseaseGroupID),
      investigationCompletePercentage: new FormControl(),
    });

    this.currentId = this.investigationService.currentid;
    this.visceralLeishmaniaForm.controls['patientID'].setValue(this.currentId);
    this.investigationService
      .getByIdVisceralLeishmania(this.currentId, this.investigationService.diseaseGroupID)
      .subscribe(
        (res: any) => {
          if (res?.data) {
            this.visceralLeishmaniaForm.patchValue(res.data);
          }
          this.calculateCompletionPercentage();
        },
        () => {
          this.translateService.get('NEDSS.COMMON.SENT_FAILD').subscribe((msg: string) => this.userMsg.error(msg));
        }
      );
  }

  save() {
    Object.values(this.visceralLeishmaniaForm.controls).forEach((control) => {
      if (control.value == 'null') control.setValue(null);
    });
    this.calculateCompletionPercentage();
    this.visceralLeishmaniaForm.controls['investigationCompletePercentage'].setValue(
      this.allControllesCount ? parseFloat(((this.allFilledControlsCount / this.allControllesCount) * 100).toFixed(2)) : 0
    );
    this.visceralLeishmaniaForm.controls['diseaseGroupId'].setValue(this.investigationService.diseaseGroupID);
    const value = this.visceralLeishmaniaForm.value;
    const request = value.id != null
      ? this.investigationService.updateVisceralLeishmania(value)
      : this.investigationService.addInvestigationVisceralLeishmania(value);
    request.subscribe((response: any) => {
      if (response) {
        if (response?.data?.id != null) {
          this.visceralLeishmaniaForm.controls['id'].setValue(response.data.id);
        }
        this.translateService.get('NEDSS.COMMON.SENT_SUCESSFULLY').subscribe((msg: string) => this.userMsg.success(msg));
      }
    });
  }

  calculateCompletionPercentage() {
    const stats = calculateCompletionStats(this.visceralLeishmaniaForm.value, {
      excludedFields: ['id', 'patientID', 'investigationCompletePercentage', 'diseaseGroupId', 'createdDate'],
    });
    this.allControllesCount = stats.totalFields;
    this.allFilledControlsCount = stats.filledFields;
  }
}
