import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import { UserMessageService } from 'src/app/core/services/user.message.service';
import { InvestigationService } from '../../services/investigation.service';

@Component({
  selector: 'app-rift-valley',
  templateUrl: './rift-valley.component.html',
  styleUrls: ['./rift-valley.component.css']
})
export class RiftValleyComponent implements OnInit {
  riftValley: FormGroup;
  allFilledControlsCount = 0;
  allControllesCount = 0;
  patientName = '';
  currentId: any;

  constructor(
    private investigationService: InvestigationService,
    private translateService: TranslateService,
    private userMsg: UserMessageService
  ) { }

  ngOnInit() {
    this.patientName = [
      this.investigationService.patient.firstName,
      this.investigationService.patient.secondName,
      this.investigationService.patient.thirdName,
    ]
      .filter((name) => name != null && name !== '')
      .join(' ');

    this.riftValley = new FormGroup({
      contactSuspectedCase: new FormControl(),
      contactConfirmedCase: new FormControl(),
      contactDeceasedUnknownDisease: new FormControl(),
      followD1Type: new FormControl(),
      followD1MixingType: new FormControl(),
      painEyeSocket: new FormControl(),
      veterinaryServices: new FormControl(),
      neighboringHouses: new FormControl(),
      hemorrhagicRash: new FormControl(),
      bloodyVomiting: new FormControl(),
      followD1RelationshipSituation: new FormControl(),
      patientID: new FormControl(),
      diseaseGroupId: new FormControl(this.investigationService.diseaseGroupID),
      investigationCompletePercentage: new FormControl(),
      id: new FormControl(),
    });

    this.riftValley.valueChanges.subscribe(() => this.calculateCompletionPercentage());
    this.currentId = this.investigationService.currentid;
    this.riftValley.controls['patientID'].setValue(this.currentId);
    this.riftValley.controls['diseaseGroupId'].setValue(this.investigationService.diseaseGroupID);

    this.investigationService.getByIdRiftValley(this.currentId).subscribe(
      (res) => {
        const data = res.data;
        this.riftValley.patchValue(data || {});
        this.riftValley.controls['diseaseGroupId'].setValue(
          data?.diseaseGroupId ?? this.investigationService.diseaseGroupID
        );
        this.calculateCompletionPercentage();
      },
      () => {
        this.translateService
          .get('NEDSS.COMMON.SENT_FAILD')
          .subscribe((message: string) => {
            this.userMsg.error(message);
          });
      }
    );
  }

  save() {
    Object.values(this.riftValley.controls).forEach((control) => {
      if (control.value === 'null') {
        control.setValue(null);
      }
    });

    this.calculateCompletionPercentage();
    this.riftValley.controls['diseaseGroupId'].setValue(this.investigationService.diseaseGroupID);
    this.riftValley.controls['investigationCompletePercentage'].setValue(
      this.allControllesCount === 0
        ? 0
        : parseFloat(((this.allFilledControlsCount / this.allControllesCount) * 100).toFixed(2))
    );

    if (this.riftValley.value.id != null) {
      this.investigationService.updateRiftValley(this.riftValley.value).subscribe(
        () => {
          this.translateService
            .get('NEDSS.COMMON.SENT_SUCESSFULLY')
            .subscribe((message: string) => {
              this.userMsg.success(message);
            });
        },
        () => {
          this.translateService
            .get('NEDSS.COMMON.SENT_FAILD')
            .subscribe((message: string) => {
              this.userMsg.error(message);
            });
        }
      );
    } else {
      this.investigationService.addInvestigationRiftValley(this.riftValley.value).subscribe(
        () => {
          this.translateService
            .get('NEDSS.COMMON.SENT_SUCESSFULLY')
            .subscribe((message: string) => {
              this.userMsg.success(message);
            });
        },
        () => {
          this.translateService
            .get('NEDSS.COMMON.SENT_FAILD')
            .subscribe((message: string) => {
              this.userMsg.error(message);
            });
        }
      );
    }
  }

  calculateCompletionPercentage() {
    this.allFilledControlsCount = 0;
    const data = this.riftValley?.value ?? {};
    const excludedFields = ['id', 'patientID', 'diseaseGroupId', 'investigationCompletePercentage', 'createdDate'];
    this.allControllesCount = Object.keys(data).filter((key) => !excludedFields.includes(key)).length;

    Object.keys(data).forEach((key) => {
      if (
        !excludedFields.includes(key) &&
        data[key] !== null &&
        data[key] !== '' &&
        data[key] !== 'null'
      ) {
        this.allFilledControlsCount++;
      }
    });
  }
}
