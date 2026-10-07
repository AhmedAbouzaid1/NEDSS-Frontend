import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { AnswerOptions, contactsBeenDosed } from 'src/app/core/constants';
import { UserMessageService } from 'src/app/core/services/user.message.service';
import { InvestigationService } from '../../services/investigation.service';
import { TranslateService } from '@ngx-translate/core';
import { calculateCompletionStats } from '../shared/investigation-summary.utils';
@Component({
  selector: 'app-leper',
  host: { class: 'investigation-form' },
  templateUrl: './leper.component.html',
  styleUrls: ['./leper.component.css']
})
export class LeperComponent implements OnInit {
  currentLang =
    localStorage.getItem('ls.currentLang') !== undefined &&
      localStorage.getItem('ls.currentLang') !== 'undefined'
      ? localStorage.getItem('ls.currentLang')
      : 'ar';
  allFilledControlsCount: number = 0;
  allControllesCount: number = 0;
  patientName: string;
  constructor(private investigationService: InvestigationService,
    private translateService: TranslateService,
    private userMsg: UserMessageService,
    private datePipe: DatePipe
  ) {
    if (this.investigationService.patient.firstName != null && this.investigationService.patient.firstName != undefined) {
      this.patientName = this.investigationService.patient.firstName + " " + this.investigationService.patient.secondName + " " + this.investigationService.patient.thirdName;
    }
  }

  leperData = {
    diseaseGroupId: this.investigationService.diseaseGroupID,
    patientID: null,
    id: null,
    investigationCompletePercentage: null,
    numberContacts: null,
    contactsBeenDosed: null,
    dateDoseContacts: null,
    vaccinatedBcgVaccine: null,
  }

  vaccinatedBcgVaccines = AnswerOptions;
  contactsBeenDoseds = contactsBeenDosed.map((item) => ({
    ...item,
    englishName: item.arabicName,
  }));
  currentId: any;
  ngOnInit(): void {
    this.currentId = this.investigationService.currentid
    this.leperData.patientID = this.currentId
    this.investigationService.getByIdleper(this.currentId).subscribe(
      res => {
        console.log(res);
        var v = res.data;
        if (v != null) {
          this.leperData = {
            diseaseGroupId: v.diseaseGroupId ?? this.investigationService.diseaseGroupID,
            patientID: v.patientID ?? this.currentId,
            id: v.id ?? null,
            investigationCompletePercentage: v.investigationCompletePercentage ?? null,
            numberContacts: v.numberContacts ?? 0,
            contactsBeenDosed: v.contactsBeenDosed ?? 1,
            dateDoseContacts: this.datePipe.transform(v.dateDoseContacts, 'yyyy-MM-dd'),
            vaccinatedBcgVaccine: v.vaccinatedBcgVaccine ?? null,
          };
        }

        this.calculateCompletionPercentage();

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
    this.calculateCompletionPercentage();

    const payload = {
      diseaseGroupId: this.investigationService.diseaseGroupID,
      patientID: this.leperData.patientID,
      id: this.leperData.id,
      investigationCompletePercentage: this.allControllesCount === 0
        ? 0
        : parseFloat(((this.allFilledControlsCount / this.allControllesCount) * 100).toFixed(2)),
      numberContacts: this.leperData.numberContacts,
      contactsBeenDosed: this.leperData.contactsBeenDosed,
      dateDoseContacts: this.leperData.dateDoseContacts,
      vaccinatedBcgVaccine: this.leperData.vaccinatedBcgVaccine,
    };

    (Object.keys(payload) as Array<keyof typeof payload>).forEach((key) => {
      if (payload[key] === 'null') {
        payload[key] = null;
      }
    });

    this.leperData.investigationCompletePercentage = payload.investigationCompletePercentage;
    this.leperData.diseaseGroupId = payload.diseaseGroupId
    if (payload.id != null) {
      this.investigationService.updateSevereleper(payload).subscribe(
        () => {
          this.translateService
            .get('NEDSS.COMMON.SENT_SUCESSFULLY')
            .subscribe((res: string) => {
              this.userMsg.success(res);
            });
        }
        , (error) => {
        }
      )
    } else {
      this.investigationService.addInvestigationleper(payload).subscribe(
        (response: any) => {
          if (response) {
            if (response?.data?.id != null) {
              this.leperData.id = response.data.id;
              this.currentId = response.data.patientID ?? this.currentId;
            }
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

  calculateCompletionPercentage() {
    const stats = calculateCompletionStats(this.leperData, {
      excludedFields: ['id', 'patientID', 'investigationCompletePercentage', 'diseaseGroupId', 'createdDate']
    });

    this.allControllesCount = stats.totalFields;
    this.allFilledControlsCount = stats.filledFields;
  }

}
