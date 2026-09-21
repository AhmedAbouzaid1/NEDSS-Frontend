import { Component } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { UserMessageService } from 'src/app/core/services/user.message.service';
import { LookupsGetterService } from 'src/app/core/services/lookups-getter.service';

@Component({
  selector: 'app-password-expiry-days',
  templateUrl: './password-expiry-days.component.html',
  styleUrls: ['./password-expiry-days.component.css'],
})
export class PasswordExpiryDaysComponent {
  isValid: boolean = true;
  expiryDays: number = 15;
  enabled: boolean = false;
  currentLang: string = 'ar';

  constructor(
    private translateService: TranslateService,
    private userMsg: UserMessageService,
    private lookupsService: LookupsGetterService
  ) {}

  ngOnInit() {
    this.currentLang =
      localStorage.getItem('ls.currentLang') !== undefined &&
      localStorage.getItem('ls.currentLang') !== 'undefined'
        ? localStorage.getItem('ls.currentLang')
        : 'ar';
    this.getPasswordExpiryDays();
    this.getPasswordExpiryEnabled();
  }

  getPasswordExpiryEnabled() {
    this.lookupsService.getPasswordExpiryEnabled().subscribe(
      (result: any) => {
        if (result != null && result != undefined && result.data != null) {
          this.enabled = String(result.data).toLowerCase() === 'true';
        }
      },
      () => {}
    );
  }

  getPasswordExpiryDays() {
    this.lookupsService.getPasswordExpiryDays().subscribe(
      (result: any) => {
        if (result != null && result != undefined && result.data != null) {
          const parsed = parseInt(result.data);
          if (!isNaN(parsed) && parsed >= 0) {
            this.expiryDays = parsed;
          }
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

  save() {
    if (this.enabled && !this.validate()) {
      return;
    }
    this.isValid = true;
    this.lookupsService
      .updatePasswordExpiryEnabled({ enabled: this.enabled })
      .subscribe(
        () => {
          if (this.enabled) {
            this.lookupsService
              .updatePasswordExpiryDays({ daysLimit: this.expiryDays })
              .subscribe(
                () => this.showSaveSuccess(),
                () => this.showSaveError()
              );
          } else {
            this.showSaveSuccess();
          }
        },
        () => this.showSaveError()
      );
  }

  private showSaveSuccess() {
    this.translateService
      .get('NEDSS.COMMON.SENT_SUCESSFULLY')
      .subscribe((res: string) => {
        this.userMsg.success(res);
      });
  }

  private showSaveError() {
    this.translateService
      .get('NEDSS.COMMON.SENT_FAILD')
      .subscribe((res: string) => {
        this.userMsg.error(res);
      });
  }

  onNumberKeyPress(event: KeyboardEvent): void {
    let inputKey = event.key;
    if (inputKey !== 'Backspace' && isNaN(Number(inputKey))) {
      event.preventDefault();
    }
  }

  validate(): boolean {
    this.expiryDays = parseInt(this.expiryDays.toString());
    if (isNaN(this.expiryDays) || this.expiryDays < 5) {
      this.isValid = false;
      return false;
    }
    this.isValid = true;
    return true;
  }
}
