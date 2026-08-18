import { Component } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { UserMessageService } from 'src/app/core/services/user.message.service';
import { LookupsGetterService } from 'src/app/core/services/lookups-getter.service';

@Component({
  selector: 'app-charts-tab-visibility',
  templateUrl: './charts-tab-visibility.component.html',
  styleUrls: ['./charts-tab-visibility.component.css'],
})
export class ChartsTabVisibilityComponent {
  enabled: boolean = true;
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
    this.getChartsTabEnabled();
  }

  getChartsTabEnabled() {
    this.lookupsService.getChartsTabEnabled().subscribe(
      (result: any) => {
        const value = result != null ? result.data : null;
        const normalized =
          typeof value === 'string' ? value.toLowerCase() : value;
        this.enabled = !(normalized === false || normalized === 'false');
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
    this.lookupsService
      .updateChartsTabEnabled({ enabled: this.enabled })
      .subscribe(
        (response: any) => {
          if (response) {
            this.translateService
              .get('NEDSS.COMMON.SENT_SUCESSFULLY')
              .subscribe((res: string) => {
                this.userMsg.success(res);
              });
            // Reload so the sidebar/charts guard pick up the new visibility.
            setTimeout(() => window.location.reload(), 800);
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
