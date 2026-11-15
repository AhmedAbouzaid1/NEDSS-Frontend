import { Component } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { UserMessageService } from 'src/app/core/services/user.message.service';
import { LookupsGetterService } from 'src/app/core/services/lookups-getter.service';
import { DEFAULT_REPORTS_MAX_RANGE_DAYS, ReportDateRangeService } from 'src/app/core/services/report-date-range.service';

@Component({
  selector: 'app-data-fetch-days',
  templateUrl: './data-fetch-days.component.html',
  styleUrls: ['./data-fetch-days.component.css'],
})
export class DataFetchDaysComponent {
  isValid: boolean = true;
  daysLimit: number = 90;
  nationalIdDaysLimit: number = 90;
  isNationalIdValid: boolean = true;
  reportsMaxRangeDays: number = DEFAULT_REPORTS_MAX_RANGE_DAYS;
  isReportsRangeValid: boolean = true;
  auditRetentionDays: number = 7;
  isAuditRetentionValid: boolean = true;
  currentLang: string = 'ar';

  constructor(
    private translateService: TranslateService,
    private userMsg: UserMessageService,
    private lookupsService: LookupsGetterService,
    private reportDateRange: ReportDateRangeService
  ) {}

  ngOnInit() {
    this.currentLang =
      localStorage.getItem('ls.currentLang') !== undefined &&
      localStorage.getItem('ls.currentLang') !== 'undefined'
        ? localStorage.getItem('ls.currentLang')
        : 'ar';
    this.getDataDaysLimit();
    this.getNationalIdSearchDaysLimit();
    this.getReportsMaxRangeDays();
    this.getAuditRetentionDays();
  }

  getAuditRetentionDays() {
    this.lookupsService.getAuditRetentionDays().subscribe(
      (result: any) => {
        const parsed = parseInt(result?.data);
        if (!isNaN(parsed) && parsed > 0) {
          this.auditRetentionDays = parsed;
        }
      },
      () => this.showLoadError()
    );
  }

  getReportsMaxRangeDays() {
    this.lookupsService.getReportsMaxDateRangeDays().subscribe(
      (result: any) => {
        const parsed = parseInt(result?.data);
        if (!isNaN(parsed) && parsed > 0) {
          this.reportsMaxRangeDays = parsed;
        }
      },
      () => this.showLoadError()
    );
  }

  private showLoadError() {
    this.translateService
      .get('NEDSS.COMMON.INTERNAL_SERVER_ERROR')
      .subscribe((res: string) => {
        this.userMsg.error(res);
      });
  }

  getDataDaysLimit() {
    this.lookupsService.getDataDaysLimit().subscribe(
      (result: any) => {
        if (result != null && result != undefined && result.data != null) {
          const parsed = parseInt(result.data);
          if (!isNaN(parsed) && parsed > 0) {
            this.daysLimit = parsed;
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

  getNationalIdSearchDaysLimit() {
    this.lookupsService.getNationalIdSearchDaysLimit().subscribe(
      (result: any) => {
        if (result != null && result != undefined && result.data != null) {
          const parsed = parseInt(result.data);
          if (!isNaN(parsed) && parsed > 0) {
            this.nationalIdDaysLimit = parsed;
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
    const dataValid = this.validate();
    const nationalIdValid = this.validateNationalId();
    const reportsRangeValid = this.validateReportsRange();
    const auditRetentionValid = this.validateAuditRetention();
    if (!dataValid || !nationalIdValid || !reportsRangeValid || !auditRetentionValid) {
      return;
    }

    this.lookupsService
      .updateDataDaysLimit({ daysLimit: this.daysLimit })
      .subscribe(
        () => {
          this.lookupsService
            .updateNationalIdSearchDaysLimit({ daysLimit: this.nationalIdDaysLimit })
            .subscribe(
              () => {
                this.lookupsService
                  .updateReportsMaxDateRangeDays({ daysLimit: this.reportsMaxRangeDays })
                  .subscribe(
                    () => {
                      this.reportDateRange.setMaxDays(this.reportsMaxRangeDays);
                      this.lookupsService
                        .updateAuditRetentionDays({ daysLimit: this.auditRetentionDays })
                        .subscribe(
                          () => {
                            this.translateService
                              .get('NEDSS.COMMON.SENT_SUCESSFULLY')
                              .subscribe((res: string) => {
                                this.userMsg.success(res);
                              });
                          },
                          () => this.showSaveError()
                        );
                    },
                    () => this.showSaveError()
                  );
              },
              () => this.showSaveError()
            );
        },
        () => this.showSaveError()
      );
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
    this.daysLimit = parseInt(this.daysLimit.toString());
    if (isNaN(this.daysLimit) || this.daysLimit < 1) {
      this.isValid = false;
      return false;
    }
    this.isValid = true;
    return true;
  }

  validateNationalId(): boolean {
    this.nationalIdDaysLimit = parseInt(this.nationalIdDaysLimit.toString());
    if (isNaN(this.nationalIdDaysLimit) || this.nationalIdDaysLimit < 1) {
      this.isNationalIdValid = false;
      return false;
    }
    this.isNationalIdValid = true;
    return true;
  }

  validateReportsRange(): boolean {
    this.reportsMaxRangeDays = parseInt(this.reportsMaxRangeDays.toString());
    if (isNaN(this.reportsMaxRangeDays) || this.reportsMaxRangeDays < 1) {
      this.isReportsRangeValid = false;
      return false;
    }
    this.isReportsRangeValid = true;
    return true;
  }

  validateAuditRetention(): boolean {
    this.auditRetentionDays = parseInt(this.auditRetentionDays.toString());
    if (isNaN(this.auditRetentionDays) || this.auditRetentionDays < 7) {
      this.isAuditRetentionValid = false;
      return false;
    }
    this.isAuditRetentionValid = true;
    return true;
  }
}
