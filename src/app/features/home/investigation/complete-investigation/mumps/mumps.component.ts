import { Component, OnInit } from '@angular/core';
import { UserMessageService } from 'src/app/core/services/user.message.service';
import { InvestigationService } from '../../services/investigation.service';
import { TranslateService } from '@ngx-translate/core';
import { DatePipe } from '@angular/common';

export interface MumpsInvestigation {
  id: number | null;
  patientID: number | null;
  diseaseGroupId: number | null;
  investigationCompletePercentage: number | null;
  contactSuspectedCase: number | null;
  contactConfirmedCase: number | null;
  numberDirectContacts: number | null;
  epidemicOutbreak: number | null;
  contactDeceasedPersonRespiratory: number | null;
  numberNonDirectContacts: number | null;
  mmrVaccine: number | null;
  dateMmrVaccine: string | null;
  mmrVaccine2: number | null;
  dateMmrVaccine2: string | null;
  investigationDate: string | null;
  healthObserverName: string | null;
  surveillanceOfficerName: string | null;
  administrationDirectorName: string | null;
}

@Component({
  selector: 'app-mumps',
  host: { class: 'investigation-form' },
  templateUrl: './mumps.component.html',
  styleUrls: ['./mumps.component.css']
})
export class MumpsComponent implements OnInit {

  allFilledControlsCount: number = 0;
  allControllesCount: number = 0;
  patientName: string;
  currentId: number;

  currentLang =
    localStorage.getItem('ls.currentLang') !== undefined &&
      localStorage.getItem('ls.currentLang') !== 'undefined'
      ? localStorage.getItem('ls.currentLang')
      : 'ar';

  private readonly trackedFields: (keyof MumpsInvestigation)[] = [
    'contactSuspectedCase',
    'contactConfirmedCase',
    'numberDirectContacts',
    'epidemicOutbreak',
    'contactDeceasedPersonRespiratory',
    'numberNonDirectContacts',
    'mmrVaccine',
    'dateMmrVaccine',
    'mmrVaccine2',
    'dateMmrVaccine2',
    'investigationDate',
    'healthObserverName',
    'surveillanceOfficerName',
    'administrationDirectorName',
  ];

  MumpsData: MumpsInvestigation = this.createEmptyMumpsData();

  constructor(
    private investigationService: InvestigationService,
    private translateService: TranslateService,
    private userMsg: UserMessageService,
    private datePipe: DatePipe
  ) {
    if (this.investigationService.patient.firstName != null && this.investigationService.patient.firstName != undefined) {
      this.patientName = this.investigationService.patient.firstName + ' ' + this.investigationService.patient.secondName + ' ' + this.investigationService.patient.thirdName;
    }
  }

  ngOnInit(): void {
    this.MumpsData.diseaseGroupId = this.investigationService.diseaseGroupID;
    this.currentId = this.investigationService.currentid;
    this.MumpsData.patientID = this.currentId;

    this.investigationService.getByIdmumbs(this.currentId).subscribe(
      res => {
        const v = res.data;
        if (v != null) {
          this.mapFromApi(v);
          this.MumpsData.dateMmrVaccine = this.datePipe.transform(this.MumpsData.dateMmrVaccine, 'yyyy-MM-dd');
          this.MumpsData.dateMmrVaccine2 = this.datePipe.transform(this.MumpsData.dateMmrVaccine2, 'yyyy-MM-dd');
          this.MumpsData.investigationDate = this.datePipe.transform(this.MumpsData.investigationDate, 'yyyy-MM-dd');
          this.calculateCompletionPercentage();
        }
      },
      () => {
        this.translateService
          .get('NEDSS.COMMON.SENT_FAILD')
          .subscribe((res: string) => {
            this.userMsg.error(res);
          });
      }
    );
  }

  save() {
    this.MumpsData.patientID = this.currentId;
    this.MumpsData.diseaseGroupId = this.investigationService.diseaseGroupID;
    this.calculateCompletionPercentage();
    this.MumpsData.investigationCompletePercentage = parseFloat(
      ((this.allFilledControlsCount / this.allControllesCount) * 100).toFixed(2)
    );

    const payload = this.buildSavePayload();

    if (this.MumpsData.id !== null) {
      this.investigationService.updatemumbs(payload).subscribe(
        (response: any) => {
          if (response) {
            this.translateService
              .get('NEDSS.COMMON.SENT_SUCESSFULLY')
              .subscribe((res: string) => {
                this.userMsg.success(res);
              });
          }
        },
        () => {
        }
      );
    } else {
      this.investigationService.addInvestigationmumbs(payload).subscribe(
        (response: any) => {
          if (response) {
            this.translateService
              .get('NEDSS.COMMON.SENT_SUCESSFULLY')
              .subscribe((res: string) => {
                this.userMsg.success(res);
              });
          }
        },
        () => {
        }
      );
    }
  }

  calculateCompletionPercentage() {
    this.allFilledControlsCount = 0;
    this.allControllesCount = this.trackedFields.length;

    this.trackedFields.forEach((key) => {
      const value = this.MumpsData[key];
      if (value !== null && value !== '' && value !== 'null' && value !== undefined) {
        this.allFilledControlsCount++;
      }
    });
  }

  private createEmptyMumpsData(): MumpsInvestigation {
    return {
      id: null,
      patientID: null,
      diseaseGroupId: null,
      investigationCompletePercentage: null,
      contactSuspectedCase: null,
      contactConfirmedCase: null,
      numberDirectContacts: null,
      epidemicOutbreak: null,
      contactDeceasedPersonRespiratory: null,
      numberNonDirectContacts: null,
      mmrVaccine: null,
      dateMmrVaccine: null,
      mmrVaccine2: null,
      dateMmrVaccine2: null,
      investigationDate: null,
      healthObserverName: null,
      surveillanceOfficerName: null,
      administrationDirectorName: null,
    };
  }

  private mapFromApi(data: Partial<MumpsInvestigation>): void {
    const empty = this.createEmptyMumpsData();
    const keys = Object.keys(empty) as (keyof MumpsInvestigation)[];
    keys.forEach((key) => {
      if (data[key] !== undefined) {
        this.MumpsData[key] = data[key] as never;
      }
    });
  }

  private buildSavePayload(): MumpsInvestigation {
    return {
      id: this.MumpsData.id,
      patientID: this.MumpsData.patientID,
      diseaseGroupId: this.MumpsData.diseaseGroupId,
      investigationCompletePercentage: this.MumpsData.investigationCompletePercentage,
      contactSuspectedCase: this.MumpsData.contactSuspectedCase,
      contactConfirmedCase: this.MumpsData.contactConfirmedCase,
      numberDirectContacts: this.MumpsData.numberDirectContacts,
      epidemicOutbreak: this.MumpsData.epidemicOutbreak,
      contactDeceasedPersonRespiratory: this.MumpsData.contactDeceasedPersonRespiratory,
      numberNonDirectContacts: this.MumpsData.numberNonDirectContacts,
      mmrVaccine: this.MumpsData.mmrVaccine,
      dateMmrVaccine: this.MumpsData.dateMmrVaccine,
      mmrVaccine2: this.MumpsData.mmrVaccine2,
      dateMmrVaccine2: this.MumpsData.dateMmrVaccine2,
      investigationDate: this.MumpsData.investigationDate,
      healthObserverName: this.MumpsData.healthObserverName,
      surveillanceOfficerName: this.MumpsData.surveillanceOfficerName,
      administrationDirectorName: this.MumpsData.administrationDirectorName,
    };
  }
}
