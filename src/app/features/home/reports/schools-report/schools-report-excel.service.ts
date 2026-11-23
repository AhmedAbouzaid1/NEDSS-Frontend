import { Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import * as XLSX from 'xlsx-js-style';
import { SchoolsReportData, schoolsReportRowSpans } from './schools-report.model';

const MAX_CELL_LENGTH = 32000;

@Injectable({ providedIn: 'root' })
export class SchoolsReportExcelService {
  constructor(private translate: TranslateService) {}

  export(report: SchoolsReportData, filters: [string, string][]): void {
    const headerRow = ['#', ...report.columns.map((c) => c.header)];
    const rows = report.items.map((item, i) => [i + 1, ...report.columns.map((c) => this.clip(item[c.key]))]);
    const aoa = [headerRow, ...rows];

    const ws = XLSX.utils.aoa_to_sheet(aoa);
    ws['!merges'] = this.groupMerges(report);
    ws['!cols'] = headerRow.map((header, i) => ({ wch: this.columnWidth(`${header}`, rows.map((r) => r[i])) }));
    ws['!rows'] = [{ hpt: 40 }];
    ws['!freeze'] = { xSplit: 0, ySplit: 1 } as any;
    this.styleSheet(ws, aoa.length, headerRow.length);

    const wb = XLSX.utils.book_new();
    wb.Workbook = { Views: [{ RTL: this.isArabic }] } as any;
    XLSX.utils.book_append_sheet(wb, ws, this.isArabic ? 'المدارس' : 'Schools');
    XLSX.utils.book_append_sheet(wb, this.infoSheet(report, filters), this.isArabic ? 'معايير البحث' : 'Criteria');

    const stamp = new Date().toISOString().slice(0, 10);
    XLSX.writeFile(wb, `schools-report-${stamp}.xlsx`);
  }

  private get isArabic(): boolean {
    return (this.translate.currentLang || localStorage.getItem('ls.currentLang') || 'ar') === 'ar';
  }

  private t(key: string, params?: object): string {
    return this.translate.instant(`NEDSS.SCHOOLS_REPORT.${key}`, params);
  }

  private infoSheet(report: SchoolsReportData, filters: [string, string][]): XLSX.WorkSheet {
    const rows: (string | number)[][] = [[this.t('TITLE'), ''], ...filters, [this.t('TOTAL'), report.totalCount]];
    if (report.items.length < report.totalCount) {
      rows.push(['', this.t('EXPORT_TRUNCATED', { count: report.items.length, total: report.totalCount })]);
    }
    const ws = XLSX.utils.aoa_to_sheet(rows);
    ws['!cols'] = [{ wch: 34 }, { wch: 60 }];
    rows.forEach((_, r) => {
      const cell = ws[XLSX.utils.encode_cell({ r, c: 0 })];
      if (cell) cell.s = { font: { bold: true } };
    });
    return ws;
  }

  private styleSheet(ws: XLSX.WorkSheet, rowCount: number, colCount: number) {
    const border = { style: 'thin', color: { rgb: 'BFBFBF' } };
    const borders = { top: border, bottom: border, left: border, right: border };
    for (let r = 0; r < rowCount; r++) {
      for (let c = 0; c < colCount; c++) {
        const ref = XLSX.utils.encode_cell({ r, c });
        const cell = ws[ref] ?? (ws[ref] = { t: 's', v: '' });
        cell.s =
          r === 0
            ? { font: { bold: true }, fill: { fgColor: { rgb: 'DDEBF7' } }, alignment: { horizontal: 'center', vertical: 'center', wrapText: true }, border: borders }
            : { alignment: { vertical: 'center', wrapText: true }, border: borders };
      }
    }
  }

  private groupMerges(report: SchoolsReportData): XLSX.Range[] {
    const spans = schoolsReportRowSpans(report.items);
    const merges: XLSX.Range[] = [];
    report.columns.forEach((column, index) => {
      spans.forEach((rowSpans, row) => {
        const span = rowSpans[column.key];
        if (span > 1) merges.push({ s: { r: row + 1, c: index + 1 }, e: { r: row + span, c: index + 1 } });
      });
    });
    return merges;
  }

  private columnWidth(header: string, values: (string | number)[]): number {
    const longest = values.reduce<number>((max, v) => Math.max(max, `${v ?? ''}`.split('\n')[0].length), 0);
    return Math.min(50, Math.max(10, Math.ceil(header.length * 0.6), longest + 2));
  }

  private clip(value: string | number | null | undefined): string | number {
    if (value === null || value === undefined) return '';
    if (typeof value === 'number') return value;
    return value.length > MAX_CELL_LENGTH ? value.slice(0, MAX_CELL_LENGTH) + '…' : value;
  }
}
