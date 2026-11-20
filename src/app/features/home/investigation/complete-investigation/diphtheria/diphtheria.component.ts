import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { InvestigationService } from '../../services/investigation.service';
import { UserMessageService } from 'src/app/core/services/user.message.service';
import { TranslateService } from '@ngx-translate/core';
import { DatePipe } from '@angular/common';
import { calculateCompletionStats } from '../shared/investigation-summary.utils';
import {
  DIPHTHERIA_DOSE_KEYS,
  DiphtheriaContact,
  newDiphtheriaContact,
  parseDiphtheriaContacts,
  serializeDiphtheriaContacts,
} from './diphtheria-contact';
@Component({
  selector: 'app-diphtheria',
  host: { class: 'investigation-form' },
  templateUrl: './diphtheria.component.html',
  styleUrls: ['./diphtheria.component.css'],
})
export class DiphtheriaComponent implements OnInit {
  private static readonly DATE_FORMAT = 'yyyy-MM-dd';
  currentLang =
    localStorage.getItem('ls.currentLang') !== undefined &&
    localStorage.getItem('ls.currentLang') !== 'undefined'
      ? localStorage.getItem('ls.currentLang')
      : 'ar';
  diphtriaForm: FormGroup;
  currentId: any;
  allFilledControlsCount: number = 0;
  allControllesCount: number = 0;
  patientName: string;
  diseaseGroupID: any;
  contacts: DiphtheriaContact[] = [];
  readonly doseKeys = DIPHTHERIA_DOSE_KEYS;
  constructor(
    private investigationService: InvestigationService,
    private translateService: TranslateService,
    private userMsg: UserMessageService,
    private datePipe: DatePipe
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
    if (this.currentId == null) {
      this.currentId = this.investigationService.currentid;
    }
    if (this.diseaseGroupID == null || this.diseaseGroupID == undefined) {
      this.diseaseGroupID = this.investigationService.diseaseGroupID;
    }
  }

  ngOnInit() {
    this.diphtriaForm = new FormGroup({
      investigationCompletePercentage: new FormControl(),
      contactSuspectedCase: new FormControl(),
      contactConfirmedCase: new FormControl(),
      numberDirectContacts: new FormControl(),
      numberIndirectContacts: new FormControl(),
      contactUnknownDisease: new FormControl(),
      casePartEpidemic: new FormControl(),
      contactFollowUpsJson: new FormControl(null),

      firstDose: new FormControl(),
      firstDoseDate: new FormControl(),
      secondDose: new FormControl(),
      secondDoseDate: new FormControl(),
      otherDose: new FormControl(),
      otherDoseDate: new FormControl(),
      firstBoosterDose: new FormControl(),
      firstBoosterDoseDate: new FormControl(),
      secondBoosterDose: new FormControl(),
      secondBoosterDoseDate: new FormControl(),
      otherBoosterDose: new FormControl(),
      otherBoosterDoseDate: new FormControl(),
      investigationDate: new FormControl(),
      healthObserverName: new FormControl(),
      surveillanceOfficerName: new FormControl(),
      administrationDirectorName: new FormControl(),
      diseaseGroupId: new FormControl(this.diseaseGroupID),
      id: new FormControl(),
      patientID: new FormControl(),
    });
    this.currentId = this.investigationService.currentid;
    this.diphtriaForm.controls['patientID'].setValue(this.currentId);
    this.diphtriaForm.valueChanges.subscribe(() => this.calculateCompletionPercentage());
    this.GetById();
  }
  GetById() {
    this.investigationService.getByIdDiphtheria(this.currentId).subscribe(
      (res) => {
        console.log(res);
        var v = res.data;

        if (!v) {
          this.calculateCompletionPercentage();
          return;
        }

        this.diphtriaForm.patchValue(v);
        this.contacts = parseDiphtheriaContacts(v.contactFollowUpsJson);
        console.log(v);
        this.diphtriaForm.controls['firstDoseDate'].setValue(
          this.datePipe.transform(
            this.diphtriaForm.value.firstDoseDate,
            DiphtheriaComponent.DATE_FORMAT
          )
        );
        this.diphtriaForm.controls['secondDoseDate'].setValue(
          this.datePipe.transform(
            this.diphtriaForm.value.secondDoseDate,
            DiphtheriaComponent.DATE_FORMAT
          )
        );
        this.diphtriaForm.controls['otherDoseDate'].setValue(
          this.datePipe.transform(
            this.diphtriaForm.value.otherDoseDate,
            DiphtheriaComponent.DATE_FORMAT
          )
        );
        this.diphtriaForm.controls['firstBoosterDoseDate'].setValue(
          this.datePipe.transform(
            this.diphtriaForm.value.firstBoosterDoseDate,
            DiphtheriaComponent.DATE_FORMAT
          )
        );
        this.diphtriaForm.controls['secondBoosterDoseDate'].setValue(
          this.datePipe.transform(
            this.diphtriaForm.value.secondBoosterDoseDate,
            DiphtheriaComponent.DATE_FORMAT
          )
        );
        this.diphtriaForm.controls['otherBoosterDoseDate'].setValue(
          this.datePipe.transform(
            this.diphtriaForm.value.otherBoosterDoseDate,
            DiphtheriaComponent.DATE_FORMAT
          )
        );
        this.diphtriaForm.controls['investigationDate'].setValue(
          this.datePipe.transform(
            this.diphtriaForm.value.investigationDate,
            DiphtheriaComponent.DATE_FORMAT
          )
        );

        Object.entries(this.diphtriaForm.controls).map(
          ([key, value]) => {
            if (value.value == 'null') value.setValue(null);
          }
        );

        this.calculateCompletionPercentage();
      },
      (error) => {
        if (error?.status === 404) {
          this.calculateCompletionPercentage();
          return;
        }

        this.translateService
          .get('NEDSS.COMMON.SENT_FAILD')
          .subscribe((res: string) => {
            this.userMsg.error(res);
          });
      }
    );
  }
  save() {
    Object.entries(this.diphtriaForm.controls).map(([key, value]) => {
      if (value.value == 'null') value.setValue(null);
    });

    this.diphtriaForm.controls['diseaseGroupId'].setValue(this.diseaseGroupID);
    this.diphtriaForm.controls['contactFollowUpsJson'].setValue(serializeDiphtheriaContacts(this.contacts));
    this.calculateCompletionPercentage();
    this.diphtriaForm.controls['investigationCompletePercentage'].setValue(
      this.allControllesCount === 0
        ? 0
        : parseFloat(((this.allFilledControlsCount / this.allControllesCount) * 100).toFixed(2))
    );
    if (this.diphtriaForm.value.id != null) {
      this.investigationService
        .updateDiphtheria(this.diphtriaForm.value)
        .subscribe(
          (response: any) => {
            if (response) {
              document
                .getElementById('jump_to_this_location')
                .scrollIntoView({ behavior: 'smooth' });
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
        .addInvestigationDiphtheria(this.diphtriaForm.value)
        .subscribe(
          (response: any) => {
            if (response) {
              document.getElementById('jump_to_this_location').scrollIntoView({ behavior: 'smooth' });
              this.diphtriaForm.value.id = response.data.id;
              this.currentId = response.data.patientID;
              this.GetById();
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
    this.contacts.push(newDiphtheriaContact());
    this.syncContacts();
  }

  removeContact(index: number): void {
    this.contacts.splice(index, 1);
    this.syncContacts();
  }

  syncContacts(): void {
    this.diphtriaForm.controls['contactFollowUpsJson'].setValue(serializeDiphtheriaContacts(this.contacts));
  }

  calculateCompletionPercentage() {
    const stats = calculateCompletionStats(this.diphtriaForm.value, {
      excludedFields: ['id', 'patientID', 'investigationCompletePercentage', 'diseaseGroupId', 'createdDate']
    });

    this.allControllesCount = stats.totalFields;
    this.allFilledControlsCount = stats.filledFields;
  }
}
