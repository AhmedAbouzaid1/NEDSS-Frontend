import { Component } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { UserMessageService } from 'src/app/core/services/user.message.service';
import { LookupsGetterService } from 'src/app/core/services/lookups-getter.service';

@Component({
  selector: 'app-notifications-settings',
  templateUrl: './notifications-settings.component.html',
  styleUrls: ['./notifications-settings.component.css'],
})
export class NotificationsSettingsComponent {
  enabled: boolean = true;

  constructor(
    private translateService: TranslateService,
    private userMsg: UserMessageService,
    private lookupsService: LookupsGetterService
  ) {}

  ngOnInit() {
    this.lookupsService.getNotificationsEnabled().subscribe(
      (result: any) => {
        const value = result != null ? result.data : null;
        const normalized =
          typeof value === 'string' ? value.toLowerCase() : value;
        this.enabled = !(normalized === false || normalized === 'false');
      },
      () => {
        this.translateService
          .get('NEDSS.COMMON.INTERNAL_SERVER_ERROR')
          .subscribe((res: string) => this.userMsg.error(res));
      }
    );
  }

  save() {
    this.lookupsService
      .updateNotificationsEnabled({ enabled: this.enabled })
      .subscribe(
        (response: any) => {
          if (response) {
            this.translateService
              .get('NEDSS.COMMON.SENT_SUCESSFULLY')
              .subscribe((res: string) => this.userMsg.success(res));
          }
        },
        () => {
          this.translateService
            .get('NEDSS.COMMON.SENT_FAILD')
            .subscribe((res: string) => this.userMsg.error(res));
        }
      );
  }
}
