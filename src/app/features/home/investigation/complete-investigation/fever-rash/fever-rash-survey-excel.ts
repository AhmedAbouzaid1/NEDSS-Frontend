import * as XLSX from 'xlsx-js-style';

export const SURVEY_DOSES: { key: string; label: string }[] = [
  { key: 'zero', label: 'صفرية' },
  { key: 'bcg', label: 'BCG' },
  { key: 'first', label: 'أولى' },
  { key: 'second', label: 'ثانية' },
  { key: 'third', label: 'ثالثة' },
  { key: 'fourth', label: 'رابعة' },
  { key: 'fifth', label: 'خامسة' },
  { key: 'booster', label: 'منشطة' },
];

const SHEET_NAME = 'المسح الميداني';
const HEADER_ROWS = 2;
const TEXT_KEYS = ['street', 'house', 'apartment', 'childName'];
const COLUMN_KEYS = [
  ...TEXT_KEYS,
  'birthCertSeen',
  'birthCertComplete',
  ...SURVEY_DOSES.flatMap((d) => [d.key + 'Status', d.key + 'Review']),
];

const YES = '✓';
const NO = '✗';
const BY_PARENT = '(✓)';

const norm = (v: any) =>
  String(v ?? '')
    .trim()
    .toLowerCase()
    .replace(/[ً-ْ]/g, '')
    .replace(/[أإآ]/g, 'ا')
    .replace(/ى/g, 'ي')
    .replace(/ة/g, 'ه')
    .replace(/\s+/g, ' ');

const YES_TOKENS = ['✓', '✔', '√', 'صح', 'نعم', 'yes', 'y', '1', 'true', 'v'];
const NO_TOKENS = ['✗', '✘', 'x', '×', 'خطا', 'لا', 'no', 'n', '0', 'false'];
const PARENT_TOKENS = ['(✓)', '(✔)', '(√)', '(صح)', 'اقوال', 'حسب الاقوال', 'حسب اقوال الاب او الام', 'دائره', '2'];

function isAny(v: string, tokens: string[]) {
  return tokens.some((t) => norm(t) === v);
}

function parseMark(raw: any): number | null {
  const v = norm(raw);
  if (!v) return null;
  if (isAny(v, YES_TOKENS)) return 1;
  if (isAny(v, NO_TOKENS) || v === '2') return 2;
  return undefined as any;
}

function parseStatus(raw: any): number | null {
  const v = norm(raw);
  if (!v) return null;
  if (isAny(v, PARENT_TOKENS)) return 2;
  if (isAny(v, YES_TOKENS)) return 1;
  if (isAny(v, NO_TOKENS) || v === '3') return 3;
  return undefined as any;
}

function parseComplete(raw: any): string | null {
  const v = norm(raw);
  if (!v) return null;
  if (isAny(v, YES_TOKENS)) return 'yes';
  if (isAny(v, NO_TOKENS)) return 'no';
  const dose = SURVEY_DOSES.find((d) => norm(d.label) === v || d.key === v);
  return dose ? dose.key : (undefined as any);
}

function markText(v: any) {
  return v === 1 ? YES : v === 2 ? NO : '';
}

function statusText(v: any) {
  return v === 1 ? YES : v === 2 ? BY_PARENT : v === 3 ? NO : '';
}

function completeText(v: any) {
  if (v === 'yes') return YES;
  if (v === 'no') return NO;
  return SURVEY_DOSES.find((d) => d.key === v)?.label ?? '';
}

function cellText(key: string, value: any): string {
  if (TEXT_KEYS.includes(key)) return value == null ? '' : String(value);
  if (key === 'birthCertComplete') return completeText(value);
  if (key.endsWith('Status')) return statusText(value);
  return markText(value);
}

const border = {
  top: { style: 'thin', color: { rgb: '999999' } },
  bottom: { style: 'thin', color: { rgb: '999999' } },
  left: { style: 'thin', color: { rgb: '999999' } },
  right: { style: 'thin', color: { rgb: '999999' } },
};
const headStyle = {
  font: { bold: true },
  alignment: { horizontal: 'center', vertical: 'center', wrapText: true },
  fill: { fgColor: { rgb: 'E9ECEF' } },
  border,
};
const vHeadStyle = { ...headStyle, alignment: { ...headStyle.alignment, textRotation: 90 } };
const bodyStyle = { alignment: { horizontal: 'center', vertical: 'center' }, border };

export function downloadSurveyTemplate(title: string, rows: any[], minRows: number, fileName: string) {
  const head1: any[] = ['#', 'شارع 1', 'منزل 2', 'شقة 3', 'اسم الطفل', 'الاطلاع على شهادة الميلاد 4', 'شهادة الميلاد مستوفاه 5'];
  const head2: any[] = ['', '', '', '', '', '', ''];
  SURVEY_DOSES.forEach((d, i) => {
    head1.push(d.label, '');
    head2.push('حالة تطعيمية' + (i === 0 ? ' 6' : ''), 'مراجعة الميكنة' + (i === 0 ? ' 7' : ''));
  });

  const filled = rows.filter((r) => COLUMN_KEYS.some((k) => r?.[k] !== null && r?.[k] !== undefined && r?.[k] !== ''));
  const count = Math.max(minRows, filled.length);
  const body: any[][] = [];
  for (let i = 0; i < count; i++) {
    const r = filled[i] || {};
    body.push([i + 1, ...COLUMN_KEYS.map((k) => cellText(k, r[k]))]);
  }

  const ws: any = XLSX.utils.aoa_to_sheet([head1, head2, ...body]);
  const merges: any[] = [];
  for (let c = 0; c < 7; c++) merges.push({ s: { r: 0, c }, e: { r: 1, c } });
  SURVEY_DOSES.forEach((_, i) => {
    const c = 7 + i * 2;
    merges.push({ s: { r: 0, c }, e: { r: 0, c: c + 1 } });
  });
  ws['!merges'] = merges;
  ws['!cols'] = [
    { wch: 5 }, { wch: 14 }, { wch: 10 }, { wch: 10 }, { wch: 26 }, { wch: 8 }, { wch: 10 },
    ...SURVEY_DOSES.flatMap(() => [{ wch: 7 }, { wch: 7 }]),
  ];
  ws['!rows'] = [{ hpt: 24 }, { hpt: 95 }];

  const totalCols = head1.length;
  const totalRows = HEADER_ROWS + body.length;
  for (let r = 0; r < totalRows; r++) {
    for (let c = 0; c < totalCols; c++) {
      const ref = XLSX.utils.encode_cell({ r, c });
      if (!ws[ref]) ws[ref] = { t: 's', v: '' };
      if (r === 0) ws[ref].s = c >= 1 && c <= 6 && c !== 4 ? vHeadStyle : headStyle;
      else if (r === 1) ws[ref].s = c >= 7 ? vHeadStyle : headStyle;
      else ws[ref].s = bodyStyle;
    }
  }

  const help = [
    [title],
    [''],
    ['طريقة التعبئة'],
    ['اكتب البيانات في ورقة "' + SHEET_NAME + '" بدءاً من الصف الثالث، صف لكل طفل. لا تغيّر ترتيب الأعمدة أو صفي العناوين.'],
    ['أعمدة الاختيارات تحتوي على قائمة منسدلة: اضغط على الخلية ثم على السهم واختر القيمة.'],
    ['الاطلاع على شهادة الميلاد (4) ومراجعة الميكنة (7): ✓ أو ✗.'],
    ['شهادة الميلاد مستوفاه (5): ✓ إذا كانت مستوفاة، ✗ إذا لم تسجل بها التطعيمات، أو اسم الجرعة (صفرية، BCG، أولى، ثانية، ثالثة، رابعة، خامسة، منشطة).'],
    ['حالة تطعيمية (6): ✓ إذا كان مسجلاً على الشهادة، (✓) إذا كان مطعماً حسب أقوال الأب أو الأم، ✗ إذا كان غير مطعم.'],
    ['عند رفع الملف يتم استبدال سجل الأطفال في الشاشة بمحتوى الملف، ثم اضغط "حفظ البيانات".'],
    [''],
    ['١. شارع: اسم الشارع أو أشهر علامة مميزة في حالة عدم وجود اسم. ٢. منزل: رقم المنزل أو اسم صاحبه أو أي علامة مميزة.'],
    ['٣. شقة: رقم الشقة أو الطابق في حالة عدم وجود أرقام. ٤. يتم وضع علامة صح إذا اطلع الفريق على شهادة ميلاد الطفل أو البطاقة الصحية له وخطأ إذا لم تتواجد.'],
    ['٥. يتم وضع علامات خطأ إذا كانت شهادة الميلاد لم يتم تسجيل التطعيمات بها أو صح إذا كانت مستوفاة بالكامل حتى آخر جرعة أو يتم كتابة الجرعة في حالة عدم استيفاء جميع الجرعات التي تم تطعيم الطفل بها.'],
    ['٦. حالة تطعيمية: توضع علامة صح إذا كان التطعيم مسجل على شهادة الميلاد أو علامة صح داخل دائرة إذا كان الطفل مطعم حسب أقوال الأب أو الأم وخطأ إذا كان الطفل غير مطعم.'],
    ['٧. مراجعات الحالة التطعيمية للطفل بمنظومة الميكنة بعد العودة للوحدة: تسجيل صح أمام الجرعة في حالة الحصول عليها أو خطأ في حالة عدم الحصول عليها.'],
  ];
  const hs: any = XLSX.utils.aoa_to_sheet(help);
  hs['!cols'] = [{ wch: 140 }];
  ['A1', 'A3'].forEach((ref) => hs[ref] && (hs[ref].s = { font: { bold: true, sz: 13 } }));

  const wb: any = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, SHEET_NAME);
  XLSX.utils.book_append_sheet(wb, hs, 'تعليمات');
  wb.Workbook = { Views: [{ RTL: true }] };

  const lastRow = HEADER_ROWS + body.length + 200;
  const data = addDropdowns(XLSX.write(wb, { type: 'array', bookType: 'xlsx' }), lastRow);
  saveFile(data, fileName + '.xlsx');
}

const MARK_LIST = [YES, NO];
const STATUS_LIST = [YES, BY_PARENT, NO];
const COMPLETE_LIST = [YES, NO, ...SURVEY_DOSES.map((d) => d.label)];

function columnLetter(index: number): string {
  return XLSX.utils.encode_col(index);
}

function validationXml(firstRow: number, lastRow: number): string {
  const rule = (cols: number[], list: string[], title: string) => {
    const sqref = cols.map((c) => `${columnLetter(c)}${firstRow}:${columnLetter(c)}${lastRow}`).join(' ');
    const formula = `"${list.join(',')}"`.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
    const msg = `اختر من القائمة: ${list.join(' ، ')}`.replace(/&/g, '&amp;').replace(/"/g, '&quot;');
    return `<dataValidation type="list" allowBlank="1" showInputMessage="1" showErrorMessage="1" errorStyle="stop"` +
      ` errorTitle="قيمة غير صحيحة" error="${msg}" promptTitle="${title}" prompt="${msg}" sqref="${sqref}">` +
      `<formula1>${formula}</formula1></dataValidation>`;
  };
  const firstDoseCol = 7;
  const statusCols = SURVEY_DOSES.map((_, i) => firstDoseCol + i * 2);
  const reviewCols = SURVEY_DOSES.map((_, i) => firstDoseCol + i * 2 + 1);
  const rules = [
    rule([5], MARK_LIST, 'الاطلاع على شهادة الميلاد'),
    rule([6], COMPLETE_LIST, 'شهادة الميلاد مستوفاه'),
    rule(statusCols, STATUS_LIST, 'حالة تطعيمية'),
    rule(reviewCols, MARK_LIST, 'مراجعة الميكنة'),
  ];
  return `<dataValidations count="${rules.length}">${rules.join('')}</dataValidations>`;
}

function addDropdowns(xlsxData: any, lastRow: number): Uint8Array {
  const bytes = xlsxData instanceof Uint8Array ? xlsxData : new Uint8Array(xlsxData);
  const cfb: any = XLSX.CFB.read(bytes, { type: 'array' });
  const entry: any = XLSX.CFB.find(cfb, '/xl/worksheets/sheet1.xml');
  if (!entry?.content) return bytes;
  let xml = new TextDecoder('utf-8').decode(entry.content);
  const block = validationXml(HEADER_ROWS + 1, lastRow);
  if (xml.includes('</mergeCells>')) xml = xml.replace('</mergeCells>', '</mergeCells>' + block);
  else xml = xml.replace('</sheetData>', '</sheetData>' + block);
  entry.content = new TextEncoder().encode(xml);
  entry.size = entry.content.length;
  const out: any = XLSX.CFB.write(cfb, { fileType: 'zip', type: 'array', compression: true } as any);
  return out instanceof Uint8Array ? out : new Uint8Array(out);
}

function saveFile(data: Uint8Array, name: string) {
  const blob = new Blob([data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = name;
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

export interface SurveyImportResult {
  rows: any[];
  errors: string[];
}

export async function readSurveyFile(file: File): Promise<SurveyImportResult> {
  const buf = await file.arrayBuffer();
  const wb = XLSX.read(buf, { type: 'array' });
  const ws = wb.Sheets[SHEET_NAME] || wb.Sheets[wb.SheetNames[0]];
  if (!ws) return { rows: [], errors: ['الملف لا يحتوي على بيانات'] };

  const aoa: any[][] = XLSX.utils.sheet_to_json(ws, { header: 1, defval: '', raw: false });
  const header = (aoa[0] || []).map((h) => norm(h));
  if (header[4] !== norm('اسم الطفل') || !header.includes(norm('منشطة'))) {
    return { rows: [], errors: ['الملف غير مطابق لنموذج المسح الميداني. قم بتنزيل النموذج واستخدمه.'] };
  }

  const rows: any[] = [];
  const errors: string[] = [];
  aoa.slice(HEADER_ROWS).forEach((line, idx) => {
    const cells = COLUMN_KEYS.map((_, i) => line[i + 1]);
    if (cells.every((c) => String(c ?? '').trim() === '')) return;
    const excelRow = idx + HEADER_ROWS + 1;
    const row: any = {};
    COLUMN_KEYS.forEach((key, i) => {
      const raw = cells[i];
      let val: any;
      if (TEXT_KEYS.includes(key)) val = String(raw ?? '').trim() || null;
      else if (key === 'birthCertComplete') val = parseComplete(raw);
      else if (key.endsWith('Status')) val = parseStatus(raw);
      else val = parseMark(raw);
      if (val === undefined) {
        errors.push(`الصف ${excelRow}: قيمة غير معروفة "${raw}" في عمود ${colLabel(key)}`);
        val = null;
      }
      row[key] = val;
    });
    rows.push(row);
  });
  return { rows, errors };
}

function colLabel(key: string): string {
  const fixed: Record<string, string> = {
    birthCertSeen: 'الاطلاع على شهادة الميلاد',
    birthCertComplete: 'شهادة الميلاد مستوفاه',
  };
  if (fixed[key]) return fixed[key];
  const dose = SURVEY_DOSES.find((d) => key.startsWith(d.key));
  if (!dose) return key;
  return `${dose.label} - ${key.endsWith('Status') ? 'حالة تطعيمية' : 'مراجعة الميكنة'}`;
}
