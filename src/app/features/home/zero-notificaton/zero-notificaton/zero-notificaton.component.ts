import { Component } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { UserMessageService } from 'src/app/core/services/user.message.service';
import { PatientModel } from '../../general-data/models/patient-model';
import { GeneralDataService } from '../../general-data/services/general-data.service';
import { SharedDataService } from '../../general-data/services/shared-data.service';

@Component({
  selector: 'app-zero-notificaton',
  templateUrl: './zero-notificaton.component.html',
  styleUrls: ['./zero-notificaton.component.css'],
})
export class ZeroNotificatonComponent {
  loadingPanel: boolean = false;
  patient: PatientModel;
  constructor(
    private generalDataService: GeneralDataService,
    private translateService: TranslateService,
    private userMsg: UserMessageService,
    private sharedDataService: SharedDataService
  ) {}

  ngOnInit() {
    this.loadingPanel = true;
    this.sharedDataService.getPatientObject().subscribe((patientObject) => {
      this.patient = patientObject;
    });

    this.loadingPanel = false;
  }

  addPatient() {
    this.loadingPanel = true;
    this.generalDataService.add(this.patient).subscribe(
      (response: any) => {
        if (response) {
          this.translateService
            .get('NEDSS.HOME.CONTROL_PANEL.CODES.SENT_SUCESSFULLY')
            .subscribe((res: string) => {
              this.userMsg.success(res);
            });
        }

        this.loadingPanel = false;
      },
      (error) => {
        this.translateService
          .get('NEDSS.COMMON.SENT_FAILD')
          .subscribe((res: string) => {
            this.userMsg.error(res);
          });

        this.loadingPanel = false;
      }
    );
  }
}
