import { Component } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { UserMessageService } from 'src/app/core/services/user.message.service';
import { GeneralDataService } from '../../../../general-data/services/general-data.service';

@Component({
  selector: 'app-system-settings',
  templateUrl: './system-settings.component.html',
  styleUrls: ['./system-settings.component.css']
})
export class SystemSettingsComponent {
  loaded: boolean = false;
  setting = {
    id: null,
    percentage: null
  };
  isValid: boolean = true;
  messageService: any;
  percentage: number;
  currentLang: string = 'ar';

  constructor(
    private translateService: TranslateService,
    private userMsg: UserMessageService,
    public generalDataService: GeneralDataService
  ) { }
  id: any;
  ngOnInit() {
    this.currentLang =
      localStorage.getItem('ls.currentLang') !== undefined &&
        localStorage.getItem('ls.currentLang') !== 'undefined'
        ? localStorage.getItem('ls.currentLang')
        : 'ar';
    // //;
    this.getInvestigationPercentageById();

  }
  save() {

    if (this.validate()) {
      this.generalDataService.saveInvestigationPercentage(this.percentage).subscribe(
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

  getInvestigationPercentageById() {
    this.generalDataService
      .getInvestigationPercentage()
      .subscribe(
        (result: any) => {
          if (result != null && result != undefined) {
            this.percentage = result.data;

          }
        },
        (error) => {
          this.translateService
            .get('NEDSS.COMMON.INTERNAL_SERVER_ERROR')
            .subscribe((res: string) => {
              this.userMsg.error(res);
            });
        }
      );
  }
  onNumberKeyPress(event: KeyboardEvent): void {
    let inputKey = event.key;
    if (inputKey !== '+' && inputKey !== 'Backspace' && isNaN(Number(inputKey))) {
      event.preventDefault();
    }
  }
  validate(): boolean {
    this.percentage = parseInt(this.percentage.toString());
    if (this.percentage < 0 || this.percentage > 100) {
      this.isValid = false;
      return false;
    }
    this.isValid = true;
    return true;
  }

}
