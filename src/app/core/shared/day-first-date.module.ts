import { Injectable, NgModule } from '@angular/core';
import { DateAdapter, MatNativeDateModule, NativeDateAdapter } from '@angular/material/core';

const DAY_FIRST = /^\s*(\d{1,2})[\/\-.](\d{1,2})[\/\-.](\d{4})\s*$/;
const ISO_DATE = /^\s*(\d{4})-(\d{1,2})-(\d{1,2})\s*$/;

@Injectable()
export class DayFirstDateAdapter extends NativeDateAdapter {
  override parse(value: any, parseFormat?: any): Date | null {
    if (typeof value === 'string') {
      const dayFirst = DAY_FIRST.exec(value);
      if (dayFirst) {
        return this.build(+dayFirst[3], +dayFirst[2], +dayFirst[1]);
      }
      const iso = ISO_DATE.exec(value);
      if (iso) {
        return this.build(+iso[1], +iso[2], +iso[3]);
      }
      return value.trim() ? this.invalid() : null;
    }
    return super.parse(value, parseFormat);
  }

  private build(year: number, month: number, day: number): Date {
    const date = new Date(year, month - 1, day);
    return date.getFullYear() === year && date.getMonth() === month - 1 && date.getDate() === day
      ? date
      : this.invalid();
  }
}

@NgModule({
  imports: [MatNativeDateModule],
  exports: [MatNativeDateModule],
  providers: [{ provide: DateAdapter, useClass: DayFirstDateAdapter }],
})
export class DayFirstDateModule {}
