import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { UserMessageService } from 'src/app/core/services/user.message.service';
import { InvestigationService } from '../../services/investigation.service';
import { TranslateService } from '@ngx-translate/core';
import { DatePipe } from '@angular/common';
import {
  WHOOPING_COUGH_DOSE_KEYS,
  WhoopingCoughContact,
  newWhoopingCoughContact,
  parseWhoopingCoughContacts,
  serializeWhoopingCoughContacts,
} from './whooping-cough-contact';
@Component({
  selector: 'app-whooping-cough',
  host: { class: 'investigation-form' },
  templateUrl: './whooping-cough.component.html',
  styleUrls: ['./whooping-cough.component.css'],
})
export class WhoopingCoughComponent implements OnInit {
  whoopingForm: FormGroup;
  currentLang =
    localStorage.getItem('ls.currentLang') !== undefined &&
      localStorage.getItem('ls.currentLang') !== 'undefined'
      ? localStorage.getItem('ls.currentLang')
      : 'ar';

  allFilledControlsCount: number = 0;
  allControllesCount: number = 0;
  patientName: string;
  contacts: WhoopingCoughContact[] = [];
  readonly doseKeys = WHOOPING_COUGH_DOSE_KEYS;
  constructor(
    private investigationService: InvestigationService,
    private translateService: TranslateService,
    private userMsg: UserMessageService,
    private datePipe: DatePipe) {
    if (this.investigationService.patient.firstName != null && this.investigationService.patient.firstName != undefined) {
      this.patientName = this.investigationService.patient.firstName + " " + this.investigationService.patient.secondName + " " + this.investigationService.patient.thirdName;
    }
  }
  currentId: any;
  ngOnInit() {
    this.whoopingForm = new FormGroup({
      investigationCompletePercentage: new FormControl(),
      contactSuspectedCase: new FormControl(),
      epidemicOutbreak: new FormControl(),
      contactConfirmedCase: new FormControl(),
      contactDeceasedPersonRespiratory: new FormControl(),
      numberDirectContacts: new FormControl(),
      numberNonDirectContacts: new FormControl(),
      contactFollowUpsJson: new FormControl(null),
      firstDose: new FormControl(),
      firstDoseDate: new FormControl(),
      secondDose: new FormControl(),
      secondDoseDate: new FormControl(),
      thirdDose: new FormControl(),
      thirdDoseDate: new FormControl(),
      boosterDose: new FormControl(),
      boosterDoseDate: new FormControl(),
      patientID: new FormControl(),
      id: new FormControl(),
    });
    this.currentId = this.investigationService.currentid;
    this.whoopingForm.controls['patientID'].setValue(this.currentId);
    this.investigationService.getByIdWhoopingCough(this.currentId).subscribe(
      (res) => {
        const data = res.data;
        this.whoopingForm.patchValue(data);
        this.contacts = parseWhoopingCoughContacts(data?.contactFollowUpsJson);
        this.whoopingForm.patchValue({
          contactSuspectedCase: this.whoopingForm.value.contactSuspectedCase + '',
          tc: true,
        });
        this.whoopingForm.patchValue({
          epidemicOutbreak: this.whoopingForm.value.epidemicOutbreak + '',
          tc: true,
        });
        this.whoopingForm.patchValue({
          contactConfirmedCase: this.whoopingForm.value.contactConfirmedCase + '',
          tc: true,
        });
        this.whoopingForm.patchValue({
          contactDeceasedPersonRespiratory:
            this.whoopingForm.value.contactDeceasedPersonRespiratory + '',
          tc: true,
        });

        //firstDose
        this.whoopingForm.patchValue({ firstDose: this.whoopingForm.value.firstDose + "", tc: true });
        this.whoopingForm.patchValue({ secondDose: this.whoopingForm.value.secondDose + "", tc: true });
        this.whoopingForm.patchValue({ thirdDose: this.whoopingForm.value.thirdDose + "", tc: true });
        this.whoopingForm.patchValue({ boosterDose: this.whoopingForm.value.boosterDose + "", tc: true });
        //firstDoseDate
        this.whoopingForm.controls['firstDoseDate'].setValue(this.datePipe.transform(this.whoopingForm.value.firstDoseDate, 'yyyy-MM-dd'));

        this.whoopingForm.controls['secondDoseDate'].setValue(this.datePipe.transform(this.whoopingForm.value.secondDoseDate, 'yyyy-MM-dd'));
        this.whoopingForm.controls['thirdDoseDate'].setValue(this.datePipe.transform(this.whoopingForm.value.thirdDoseDate, 'yyyy-MM-dd'));
        this.whoopingForm.controls['boosterDoseDate'].setValue(this.datePipe.transform(this.whoopingForm.value.boosterDoseDate, 'yyyy-MM-dd'));

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
    Object.values(this.whoopingForm.controls).forEach((control) => {
      if (control.value == 'null') {
        control.setValue(null);
      }
    });
    this.whoopingForm.controls['contactFollowUpsJson'].setValue(serializeWhoopingCoughContacts(this.contacts));
    this.whoopingForm.controls['investigationCompletePercentage'].setValue(parseFloat(((this.allFilledControlsCount / this.allControllesCount) * 100).toFixed(2)));
    this.calculateCompletionPercentage();
    if (this.whoopingForm.value.id != null) {
      this.investigationService
        .updateWhoopingCough(this.whoopingForm.value)
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
          (error) => { }
        );
    } else {
      this.investigationService
        .addInvestigationWhoopingCough(this.whoopingForm.value)
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
          (error) => { }
        );
    }
  }

  addContact(): void {
    this.contacts.push(newWhoopingCoughContact());
    this.syncContacts();
  }

  removeContact(index: number): void {
    this.contacts.splice(index, 1);
    this.syncContacts();
  }

  syncContacts(): void {
    this.whoopingForm.controls['contactFollowUpsJson'].setValue(serializeWhoopingCoughContacts(this.contacts));
    this.calculateCompletionPercentage();
  }

  //BL
  calculateCompletionPercentage() {
    this.allFilledControlsCount = 0;
    const data = this.whoopingForm.value;
    const excludedFields = ['id', 'patientID', 'investigationCompletePercentage', 'createdDate'];
    const totalFields = Object.keys(data).filter(key => !excludedFields.includes(key)).length;

    this.allControllesCount = totalFields;

    Object.keys(data).forEach((key) => {
      if (!excludedFields.includes(key) && data[key] !== null && data[key] !== '' && data[key] !== 'null') {
        this.allFilledControlsCount++;
      }
    });
  }
}
