import { Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { LookupsGetterService } from './lookups-getter.service';
import { UserMessageService } from './user.message.service';

export const DEFAULT_REPORTS_MAX_RANGE_DAYS = 31;

const DAY_MS = 24 * 60 * 60 * 1000;

@Injectable({ providedIn: 'root' })
export class ReportDateRangeService {
  maxDays = DEFAULT_REPORTS_MAX_RANGE_DAYS;

  constructor(
    private lookups: LookupsGetterService,
    private translate: TranslateService,
    private userMsg: UserMessageService
  ) {
    this.refresh();
  }

  refresh(): void {
    this.lookups.getReportsMaxDateRangeDays().subscribe({
      next: (result: any) => this.setMaxDays(parseInt(result?.data)),
      error: () => {},
    });
  }

  setMaxDays(days: number): void {
    this.maxDays = !isNaN(days) && days > 0 ? days : DEFAULT_REPORTS_MAX_RANGE_DAYS;
  }

  validate(from: string | number | Date | null | undefined, to: string | number | Date | null | undefined): boolean {
    const fromDay = this.toDay(from);
    const toDay = this.toDay(to);
    if (fromDay == null || toDay == null) {
      this.warn('NEDSS.COMMON.ReportDateRangeRequired');
      return false;
    }
    if (fromDay > toDay) {
      this.warn('NEDSS.COMMON.ReportDateRangeInvalid');
      return false;
    }
    if (Math.round((toDay - fromDay) / DAY_MS) + 1 > this.maxDays) {
      this.warn('NEDSS.COMMON.ReportDateRangeExceededDays', { days: this.maxDays });
      return false;
    }
    return true;
  }

  private toDay(value: string | number | Date | null | undefined): number | null {
    if (value == null || value === '') return null;
    const date = value instanceof Date ? value : new Date(value);
    if (isNaN(date.getTime())) return null;
    return Date.UTC(date.getFullYear(), date.getMonth(), date.getDate());
  }

  private warn(key: string, params?: object): void {
    this.userMsg.warn(this.translate.instant(key, params));
  }
}
