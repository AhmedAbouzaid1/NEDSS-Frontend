import { Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import * as XLSX from 'xlsx-js-style';

@Injectable({ providedIn: 'root' })
export class FormTemplateExportService {
  constructor(private translate: TranslateService) { }

  exportFormTemplate(root: HTMLElement, fileName: string, sheetName = 'Investigation') {
    if (!root) return;

    const sections = this.extractSections(root);
    const labels = this.getHeaderLabels();
    const hasSections = sections.some(s => s.title?.trim());
    const { rows, merges } = this.buildRows(sections, labels, hasSections);

    const ws = XLSX.utils.aoa_to_sheet(rows);
    if (hasSections && merges.length) ws['!merges'] = merges;
    ws['!cols'] = this.autoSizeColumns(rows);
    this.applyStyles(ws, rows, hasSections);

    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, sheetName);
    XLSX.writeFile(wb, fileName);
  }

  private extractSections(root: HTMLElement) {
    const sections: any[] = [{ title: '', fields: [] }];
    const seen = new Set<string>();
    let current = sections[0];

    const nodes = Array.from(root.querySelectorAll<HTMLElement>('*'));

    nodes.forEach((node, idx) => {
      if (this.isSectionTitle(node)) {
        const title = this.normalizeLabel(node.textContent);
        if (title) { current = { title, fields: [] }; sections.push(current); }
        return;
      }

      if (!this.isFieldNode(node)) return;
      if (node instanceof HTMLInputElement && node.type === 'hidden') return;

      const fc = node.getAttribute('formcontrolname') || '';
      const name = node.getAttribute('name') || '';
      const id = node.getAttribute('id') || '';
      const keyBase = fc || name || id;
      if (!keyBase) return;

      if (node instanceof HTMLInputElement && node.type.toLowerCase() === 'radio') {
        const radioField = this.extractRadioField(root, node, keyBase);
        if (!radioField) return;

        const key = `radio|${keyBase}`;
        if (seen.has(key)) return;
        seen.add(key);
        current.fields.push(radioField);
        return;
      }

      const key = this.getControlKey(node, keyBase, idx);
      if (seen.has(key)) return;
      seen.add(key);

      const label = this.getFieldLabel(root, node, fc, name, id);

      current.fields.push({ label: this.normalizeLabel(label) || fc, value: this.getValue(node) });
    });

    return sections;
  }

  private isFieldNode(node: HTMLElement) {
    return /^(INPUT|SELECT|TEXTAREA)$/.test(node.tagName)
      || node.hasAttribute('formcontrolname')
      || node.hasAttribute('ngModel')
      || node.hasAttribute('formControl');
  }

  private getControlKey(node: HTMLElement, keyBase: string, idx: number) {
    const row = node.closest('tr');
    if (row && row.rowIndex >= 0) {
      return `${keyBase}|tr:${row.rowIndex}`;
    }

    const group = node.closest('[formGroup]');
    if (group) {
      const parent = group.parentElement;
      if (parent) {
        const index = Array.from(parent.children).indexOf(group);
        if (index >= 0) {
          return `${keyBase}|group:${index}`;
        }
      }
      return `${keyBase}|group:${group.nodeName}`;
    }

    return `${keyBase}|idx:${idx}`;
  }

  private extractRadioField(root: HTMLElement, node: HTMLInputElement, keyBase: string) {
    const group = this.getRadioGroup(root, node, keyBase);
    const checked = group.find(radio => radio.checked);
    const label = this.getRadioGroupLabel(root, node, keyBase);
    const value = checked ? (this.getRadioOptionLabel(checked) || checked.value || '') : '';

    return label ? { label, value } : null;
  }

  private getRadioGroup(root: HTMLElement, node: HTMLInputElement, keyBase: string) {
    if (node.name) {
      return Array.from(root.querySelectorAll<HTMLInputElement>('input[type="radio"]'))
        .filter(radio => radio.name === node.name);
    }

    return Array.from(root.querySelectorAll<HTMLInputElement>('input[type="radio"]'))
      .filter(radio =>
        (radio.getAttribute('formcontrolname') || radio.getAttribute('name') || radio.getAttribute('id') || '') === keyBase
      );
  }

  private getFieldLabel(root: HTMLElement, node: HTMLElement, fc: string, name: string, id: string) {
    return node.closest('label')?.textContent
      || this.findLabelByFor(root, node)
      || this.getTableHeaderLabel(node)
      || node.closest('.form-group')?.querySelector('label')?.textContent
      || node.getAttribute('aria-label')
      || (node as HTMLInputElement).placeholder
      || this.getPreviousPromptText(node)
      || name
      || id
      || fc;
  }

  private getRadioGroupLabel(root: HTMLElement, node: HTMLInputElement, keyBase: string) {
    return this.findLabelByFor(root, node)
      || node.closest('.form-group')?.querySelector('label')?.textContent
      || this.getPreviousPromptText(node.closest('.has-labels') as HTMLElement | null || node)
      || node.getAttribute('aria-label')
      || node.name
      || node.id
      || keyBase;
  }

  private getPreviousPromptText(node: HTMLElement | null) {
    let sibling = node?.previousElementSibling as HTMLElement | null;
    while (sibling) {
      const text = this.normalizeLabel(sibling.textContent);
      if (text) return text;
      sibling = sibling.previousElementSibling as HTMLElement | null;
    }
    return null;
  }

  private getRadioOptionLabel(node: HTMLInputElement) {
    const wrapperLabel = node.closest('label');
    if (!wrapperLabel) return '';

    const clone = wrapperLabel.cloneNode(true) as HTMLElement;
    clone.querySelectorAll('input').forEach(input => input.remove());
    return this.normalizeLabel(clone.textContent);
  }

  private getHeaderLabels() {
    return {
      section: this.translate.instant('NEDSS.COMMON.SECTION'),
      field: this.translate.instant('NEDSS.COMMON.FIELD'),
      value: this.translate.instant('NEDSS.COMMON.VALUE'),
    };
  }

  private buildRows(sections: any[], labels: any, hasSections: boolean) {
    const rows: any[][] = [];
    const merges: XLSX.Range[] = [];
    const total = sections.reduce((s, x) => s + x.fields.length, 0);

    if (!total) return { rows: [[labels.field, labels.value], ['', '']], merges };
    rows.push(hasSections ? [labels.section, labels.field, labels.value] : [labels.field, labels.value]);

    let rowIndex = 1;
    sections.forEach(s => {
      if (!s.fields.length) return;
      s.fields.forEach(f => rows.push(hasSections ? [s.title || '', f.label, f.value] : [f.label, f.value]));
      if (hasSections && s.fields.length > 1) merges.push({ s: { r: rowIndex, c: 0 }, e: { r: rowIndex + s.fields.length - 1, c: 0 } });
      rowIndex += s.fields.length;
    });

    return { rows, merges };
  }

  private applyStyles(ws: XLSX.WorkSheet, rows: any[][], hasSections: boolean) {
    const border = (style: 'thin' | 'medium') => ({ top: { style, color: { rgb: '000' } }, bottom: { style, color: { rgb: '000' } }, left: { style, color: { rgb: '000' } }, right: { style, color: { rgb: '000' } } });
    const thin = border('thin'), thick = border('medium');

    rows.forEach((row, r) => row.forEach((_, c) => {
      const cell = ws[XLSX.utils.encode_cell({ r, c })]; if (!cell) return;
      cell.s = cell.s || {};
      cell.s.border = { ...(cell.s.border || {}), ...(r === 0 ? thick : thin) };
      if (r === 0) cell.s.font = { bold: true }, cell.s.alignment = { horizontal: 'center' };
      if (hasSections && c === 0 && r > 0) cell.s.font = { bold: true };
    }));
  }

  private autoSizeColumns(rows: any[][]) {
    const cols = rows[0]?.length || 0;
    return Array.from({ length: cols }, (_, c) => ({ wch: Math.min(60, Math.max(10, ...rows.map(r => String(r[c] || '').length)) + 2) }));
  }

  private isSectionTitle(node: HTMLElement) {
    return /^H[1-6]$/.test(node.tagName) || ['title', 'accordion-header', 'card-header'].some(cls => node.classList.contains(cls));
  }

  private findLabelByFor(root: HTMLElement, el: HTMLElement) {
    const id = el.getAttribute('id');
    return id ? root.querySelector(`label[for="${id}"]`)?.textContent || null : null;
  }

  private getTableHeaderLabel(node: HTMLElement) {
    const cell = node.closest('td, th') as HTMLTableCellElement | null;
    if (!cell) return null;

    const table = cell.closest('table');
    if (!table) return null;

    const headerRow = table.querySelector('thead tr') as HTMLTableRowElement | null || table.querySelector('tr') as HTMLTableRowElement | null;
    if (!headerRow) return null;

    const targetHeader = headerRow.cells[cell.cellIndex] as HTMLElement | undefined;
    return targetHeader ? this.normalizeLabel(targetHeader.textContent) : null;
  }

  private normalizeLabel(label: string | null) {
    return label?.replace(/\{\{|\}\}/g, '').replace(/\s+/g, ' ').replace(/\s*:\s*$/, '').trim() || '';
  }

  private getValue(el: HTMLElement) {
    if (el instanceof HTMLInputElement) return ['checkbox', 'radio'].includes(el.type.toLowerCase()) ? (el.checked ? el.value || 'Yes' : '') : el.value || '';
    if (el instanceof HTMLSelectElement) return el.selectedOptions?.[0]?.textContent?.trim() || '';
    if (el instanceof HTMLTextAreaElement) return el.value || '';
    return (el as any).value || '';
  }
}
