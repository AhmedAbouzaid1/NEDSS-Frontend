import { Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import * as XLSX from 'xlsx-js-style';
import { GeneralReportingReportData } from './general-reporting-report.model';

const MAX_CELL_LENGTH = 32000;

@Injectable({ providedIn: 'root' })
export class GeneralReportingExcelService {
  constructor(private translate: TranslateService) {}

  export(report: GeneralReportingReportData, filters: [string, string][]): void {
    const columns = report.columns;
    const groupRow = ['', ...columns.map((c) => c.group)];
    const headerRow = ['#', ...columns.map((c) => c.header)];
    const rows = report.items.map((item, i) => [i + 1, ...columns.map((c) => this.clip(item[c.key]))]);
    const aoa = [groupRow, headerRow, ...rows];

    const ws = XLSX.utils.aoa_to_sheet(aoa);
    ws['!merges'] = this.groupMerges(groupRow);
    ws['!cols'] = headerRow.map((header, i) => ({ wch: this.columnWidth(`${header}`, rows.map((r) => r[i])) }));
    ws['!rows'] = [{ hpt: 22 }, { hpt: 40 }];
    ws['!freeze'] = { xSplit: 0, ySplit: 2 } as any;
    this.styleSheet(ws, aoa.length, headerRow.length);

    const wb = XLSX.utils.book_new();
    wb.Workbook = { Views: [{ RTL: this.isArabic }] } as any;
    XLSX.utils.book_append_sheet(wb, ws, this.isArabic ? 'الإبلاغ العام' : 'General Reporting');
    XLSX.utils.book_append_sheet(wb, this.infoSheet(report, filters), this.isArabic ? 'معايير البحث' : 'Criteria');

    const stamp = new Date().toISOString().slice(0, 10);
    XLSX.writeFile(wb, `general-reporting-${stamp}.xlsx`);
  }

  private get isArabic(): boolean {
    return (this.translate.currentLang || localStorage.getItem('ls.currentLang') || 'ar') === 'ar';
  }

  private t(key: string, params?: object): string {
    return this.translate.instant(`NEDSS.GENERAL_REPORTING_REPORT.${key}`, params);
  }

  private infoSheet(report: GeneralReportingReportData, filters: [string, string][]): XLSX.WorkSheet {
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
        if (r === 0) {
          cell.s = { font: { bold: true, color: { rgb: 'FFFFFF' } }, fill: { fgColor: { rgb: '1F4E79' } }, alignment: { horizontal: 'center', vertical: 'center', wrapText: true }, border: borders };
        } else if (r === 1) {
          cell.s = { font: { bold: true }, fill: { fgColor: { rgb: 'DDEBF7' } }, alignment: { horizontal: 'center', vertical: 'center', wrapText: true }, border: borders };
        } else {
          cell.s = { alignment: { vertical: 'top', wrapText: true }, border: borders };
        }
      }
    }
  }

  private groupMerges(groupRow: string[]): XLSX.Range[] {
    const merges: XLSX.Range[] = [];
    let start = 0;
    for (let c = 1; c <= groupRow.length; c++) {
      if (c === groupRow.length || groupRow[c] !== groupRow[start]) {
        if (c - 1 > start) merges.push({ s: { r: 0, c: start }, e: { r: 0, c: c - 1 } });
        start = c;
      }
    }
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
