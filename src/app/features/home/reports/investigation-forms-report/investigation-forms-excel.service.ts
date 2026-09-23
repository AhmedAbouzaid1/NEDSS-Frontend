import { Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import * as XLSX from 'xlsx-js-style';
import * as Constants from 'src/app/core/constants';
import { InvestigationFormField, InvestigationFormsReportData, InvestigationFormsReportItem } from './investigation-form-field.model';
import { INVESTIGATION_FORM_BY_ROUTER, INVESTIGATION_FORM_FIELDS } from './investigation-form-fields.generated';

export interface ExportColumn {
  key: string;
  group: string;
  header: string;
  value: (item: InvestigationFormsReportItem) => string | number;
}

export interface InvestigationFormsExportMeta {
  filters: [string, string][];
}

const MAX_CELL_LENGTH = 32000;
const IGNORED_FORM_KEYS = new Set(['investigationcompletepercentage', 'patient', 'diseasegroup']);
const ISO_DATE = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}/;

@Injectable({ providedIn: 'root' })
export class InvestigationFormsExcelService {
  constructor(private translate: TranslateService) {}

  static formFolderFor(router: string | null | undefined): string | undefined {
    if (!router) return undefined;
    const match = Object.keys(INVESTIGATION_FORM_BY_ROUTER).find((r) => r.toLowerCase() === router.trim().toLowerCase());
    return match ? INVESTIGATION_FORM_BY_ROUTER[match] : undefined;
  }

  buildColumns(report: InvestigationFormsReportData): ExportColumn[] {
    return [...this.patientColumns(), ...this.buildFormColumns(report)];
  }

  buildFormColumns(report: InvestigationFormsReportData): ExportColumn[] {
    const fields = INVESTIGATION_FORM_FIELDS[InvestigationFormsExcelService.formFolderFor(report.router) ?? ''] ?? [];
    return this.formColumns(report.items, fields, this.buildLookup(fields));
  }

  patientColumns(): ExportColumn[] {
    const group = this.t('PATIENT_DATA');
    const col = (key: string, value: (item: InvestigationFormsReportItem) => string | number): ExportColumn => ({
      key: `patient.${key}`,
      group,
      header: this.t(key),
      value,
    });
    return [
      col('NAME', (i) => i.fullName ?? ''),
      col('NATIONAL_ID', (i) => i.nationalId ?? ''),
      col('GENDER', (i) => i.gender ?? ''),
      col('AGE', (i) => (i.age != null ? `${i.age} ${i.ageType ?? ''}`.trim() : '')),
      col('PHONE', (i) => i.phoneNo ?? ''),
      col('INCIDENT_GOVERNMENT', (i) => i.incidentGovernmentName ?? ''),
      col('INCIDENT_ADMINISTRATION', (i) => i.incidentHealthAdministrationName ?? ''),
      col('INCIDENT_SOURCE', (i) => i.incidentSourceName ?? ''),
      col('HOME_GOVERNMENT', (i) => i.homeGovernmentName ?? ''),
      col('HOME_ADMINISTRATION', (i) => i.homeHealthAdministrationName ?? ''),
      col('HOME_OFFICE', (i) => i.homeHealthOfficeName ?? ''),
      col('DISCOVERY_DATE', (i) => this.formatDate(i.caseDiscoveryDate ?? i.createdDate)),
      col('FINAL_RESULT', (i) => i.finalResult ?? ''),
      col('FINAL_DIAGNOSIS', (i) => i.finalDiagnosis ?? ''),
      col('INVESTIGATION_STATUS', (i) => this.t(i.isInvestigationDone ? 'STATUS_DONE' : 'STATUS_NOT_DONE')),
      col('INVESTIGATION_DONE_DATE', (i) => this.formatDate(i.investigationDoneDate)),
      col('COMPLETE_PERCENTAGE', (i) => (i.investigationCompletePercentage != null ? `${Math.round(i.investigationCompletePercentage)}%` : '')),
    ];
  }

  groupSpans(columns: ExportColumn[]): { label: string; span: number }[] {
    const spans: { label: string; span: number }[] = [];
    for (const column of columns) {
      const last = spans[spans.length - 1];
      if (last && last.label === column.group) last.span++;
      else spans.push({ label: column.group, span: 1 });
    }
    return spans;
  }

  export(report: InvestigationFormsReportData, meta: InvestigationFormsExportMeta): void {
    const isAr = this.isArabic;
    let index = 0;
    const columns: ExportColumn[] = [{ key: '#', group: '', header: '#', value: () => ++index }, ...this.buildColumns(report)];

    const groupRow = columns.map((c) => c.group);
    const headerRow = columns.map((c) => c.header);
    const rows = report.items.map((item) => columns.map((c) => c.value(item)));
    const aoa = [groupRow, headerRow, ...rows];

    const ws = XLSX.utils.aoa_to_sheet(aoa);
    ws['!merges'] = this.groupMerges(groupRow);
    ws['!cols'] = columns.map((c, i) => ({ wch: this.columnWidth(c.header, rows.map((r) => r[i])) }));
    ws['!rows'] = [{ hpt: 22 }, { hpt: 48 }];
    this.styleSheet(ws, aoa.length, columns.length);

    const info = this.infoSheet(report, meta);

    const wb = XLSX.utils.book_new();
    wb.Workbook = { Views: [{ RTL: isAr }] } as any;
    XLSX.utils.book_append_sheet(wb, ws, this.sheetName(report.diseaseGroupName || 'Forms'));
    XLSX.utils.book_append_sheet(wb, info, isAr ? 'معايير البحث' : 'Criteria');

    const stamp = new Date().toISOString().slice(0, 10);
    XLSX.writeFile(wb, `investigation-forms-${this.fileSlug(report.router)}-${stamp}.xlsx`);
  }

  private get isArabic(): boolean {
    return (this.translate.currentLang || localStorage.getItem('ls.currentLang') || 'ar') === 'ar';
  }

  private t(key: string, params?: object): string {
    return this.translate.instant(`NEDSS.INVESTIGATION_FORMS_REPORT.${key}`, params);
  }

  private tokens(tokens: string[] | undefined): string {
    return (tokens ?? []).map((token) => this.translate.instant(token)).filter((text) => !!text && `${text}`.trim()).join(' - ');
  }

  private formColumns(items: InvestigationFormsReportItem[], fields: InvestigationFormField[], lookup: (key: string) => InvestigationFormField | undefined): ExportColumn[] {
    const dataKeys: string[] = [];
    const seen = new Set<string>();
    const nonEmpty = new Set<string>();
    for (const item of items) {
      for (const [key, value] of Object.entries(item.form ?? {})) {
        if (IGNORED_FORM_KEYS.has(key.toLowerCase())) continue;
        if (!seen.has(key)) {
          seen.add(key);
          dataKeys.push(key);
        }
        if (!this.isEmpty(value)) nonEmpty.add(key);
      }
    }

    const fieldOrder = new Map(fields.map((f, i) => [f, i]));
    const mapped = dataKeys
      .map((key, i) => ({ key, field: lookup(key), i }))
      .filter((x) => x.field || nonEmpty.has(x.key))
      .sort((a, b) => {
        const fa = a.field ? fieldOrder.get(a.field)! : Number.MAX_SAFE_INTEGER;
        const fb = b.field ? fieldOrder.get(b.field)! : Number.MAX_SAFE_INTEGER;
        return fa - fb || a.i - b.i;
      });

    const formGroup = this.t('FORM_DATA');
    return mapped.map(({ key, field }) => ({
      key,
      group: field?.section?.length ? this.tokens(field.section) : formGroup,
      header: (field && this.tokens(field.label)) || this.humanize(key),
      value: (item: InvestigationFormsReportItem) => this.clip(this.formatValue(item.form?.[key], field, lookup)),
    }));
  }

  private buildLookup(fields: InvestigationFormField[]) {
    const exact = new Map<string, InvestigationFormField>();
    const lower = new Map<string, InvestigationFormField>();
    for (const f of fields) {
      if (!exact.has(f.key)) exact.set(f.key, f);
      if (!lower.has(f.key.toLowerCase())) lower.set(f.key.toLowerCase(), f);
    }
    return (key: string): InvestigationFormField | undefined => {
      const candidates = [key, key.replace(/Json$/i, '')];
      for (const c of candidates) {
        const hit = exact.get(c) ?? lower.get(c.toLowerCase());
        if (hit) return hit;
      }
      return undefined;
    };
  }

  private formatValue(value: any, field: InvestigationFormField | undefined, lookup: (key: string) => InvestigationFormField | undefined): string {
    if (this.isEmpty(value)) return '';

    if (typeof value === 'string') {
      const trimmed = value.trim();
      if ((trimmed.startsWith('[') && trimmed.endsWith(']')) || (trimmed.startsWith('{') && trimmed.endsWith('}'))) {
        try {
          return this.formatStructured(JSON.parse(trimmed), lookup);
        } catch {
          return trimmed;
        }
      }
    }

    if (Array.isArray(value) || (value && typeof value === 'object')) {
      return this.formatStructured(value, lookup);
    }

    const option = this.optionText(value, field);
    if (option !== undefined) return option;

    if (typeof value === 'boolean') {
      return this.translate.instant(value ? 'NEDSS.COMMON.YES' : 'NEDSS.COMMON.NO');
    }
    if (typeof value === 'string' && ISO_DATE.test(value)) {
      return this.formatDate(value);
    }
    return `${value}`;
  }

  private formatStructured(value: any, lookup: (key: string) => InvestigationFormField | undefined): string {
    const describe = (obj: any): string => {
      if (obj == null) return '';
      if (typeof obj !== 'object') return this.formatValue(obj, undefined, lookup);
      if (Array.isArray(obj)) return obj.map((v) => describe(v)).filter(Boolean).join('، ');
      return Object.entries(obj)
        .filter(([k, v]) => !this.isEmpty(v) && !/^(id|index|seq|isOpen|expanded)$/i.test(k))
        .map(([k, v]) => {
          const sub = lookup(k);
          const label = (sub && this.tokens(sub.label)) || this.humanize(k);
          return `${label}: ${this.formatValue(v, sub, lookup)}`;
        })
        .join(' | ');
    };

    if (Array.isArray(value)) {
      const lines = value.map((entry) => describe(entry)).filter((line) => !!line);
      return lines.length > 1 ? lines.map((line, i) => `${i + 1}) ${line}`).join('\n') : lines.join('');
    }
    return describe(value);
  }

  private optionText(value: any, field: InvestigationFormField | undefined): string | undefined {
    if (!field) return undefined;
    const key = `${value}`;
    if (field.options && field.options[key]) {
      return this.tokens(field.options[key]);
    }
    if (field.optionsRef) {
      const list = (Constants as any)[field.optionsRef];
      if (Array.isArray(list)) {
        const hit = list.find((o: any) => o && o.id != null && `${o.id}` === key);
        if (hit) return this.isArabic ? hit.arabicName ?? hit.englishName : hit.englishName ?? hit.arabicName;
      }
    }
    return undefined;
  }

  private infoSheet(report: InvestigationFormsReportData, meta: InvestigationFormsExportMeta): XLSX.WorkSheet {
    const rows: (string | number)[][] = [
      [this.t('TITLE'), report.diseaseGroupName ?? ''],
      ...meta.filters,
      [this.t('TOTAL'), report.totalCount],
      [this.t('DONE_COUNT'), report.doneCount],
      [this.t('NOT_DONE_COUNT'), report.totalCount - report.doneCount],
    ];
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
          cell.s = { font: { bold: true, color: { rgb: 'FFFFFF' } }, fill: { fgColor: { rgb: '1F6F5C' } }, alignment: { horizontal: 'center', vertical: 'center', wrapText: true }, border: borders };
        } else if (r === 1) {
          cell.s = { font: { bold: true }, fill: { fgColor: { rgb: 'E2EFEA' } }, alignment: { horizontal: 'center', vertical: 'center', wrapText: true }, border: borders };
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
    const longest = values.reduce<number>((max, v) => {
      const firstLine = `${v ?? ''}`.split('\n')[0];
      return Math.max(max, firstLine.length);
    }, 0);
    return Math.min(60, Math.max(12, Math.ceil(header.length * 0.6), longest + 2));
  }

  private formatDate(value: string | null | undefined): string {
    if (!value) return '';
    const date = new Date(value);
    if (isNaN(date.getTime())) return `${value}`;
    const dd = `${date.getDate()}`.padStart(2, '0');
    const mm = `${date.getMonth() + 1}`.padStart(2, '0');
    return `${dd}/${mm}/${date.getFullYear()}`;
  }

  private humanize(key: string): string {
    return key
      .replace(/Json$/i, '')
      .replace(/([a-z0-9])([A-Z])/g, '$1 $2')
      .replace(/^./, (c) => c.toUpperCase());
  }

  private isEmpty(value: any): boolean {
    if (value === null || value === undefined) return true;
    if (typeof value === 'string') {
      const t = value.trim();
      return t === '' || t === '[]' || t === '{}' || t === 'null';
    }
    if (Array.isArray(value)) return value.length === 0;
    return false;
  }

  private clip(text: string): string {
    return text.length > MAX_CELL_LENGTH ? text.slice(0, MAX_CELL_LENGTH) + '…' : text;
  }

  private sheetName(name: string): string {
    return name.replace(/[\[\]\*\?\/\\:]/g, ' ').slice(0, 31).trim() || 'Forms';
  }

  private fileSlug(router: string | null | undefined): string {
    return (router || 'forms').replace(/[^A-Za-z0-9-]+/g, '-').toLowerCase();
  }
}
