import { FormArray, FormGroup } from '@angular/forms';

export interface CompletionStats {
  totalFields: number;
  filledFields: number;
  percentage: number;
}

export interface CompletionArrayConfig {
  value: FormArray | FormGroup[] | any[] | null | undefined;
  excludedFields?: string[];
}

export interface CompletionOptions {
  excludedFields?: string[];
  formArrays?: CompletionArrayConfig[];
}

const DEFAULT_ROW_EXCLUDED = ['id'];

function isFilled(value: any): boolean {
  return value !== null && value !== '' && value !== 'null';
}

function resolveArray(value: CompletionArrayConfig['value']): any[] {
  if (!value) {
    return [];
  }
  if (value instanceof FormArray) {
    return value.controls ?? [];
  }
  if (Array.isArray(value)) {
    return value;
  }
  return [];
}

function isArrayValue(value: any): boolean {
  if (!value) {
    return false;
  }
  if (value instanceof FormArray) {
    return true;
  }
  return Array.isArray(value);
}

function resolveRowValue(row: any): any {
  if (row instanceof FormGroup) {
    return row.value;
  }
  if (row && typeof row === 'object' && 'value' in row) {
    return row.value;
  }
  return row ?? {};
}

export function calculateCompletionStats(data: any, options: CompletionOptions = {}): CompletionStats {
  const excluded = new Set(options.excludedFields ?? []);
  const baseData = data instanceof FormGroup ? data.value : (data ?? {});

  const baseKeys = Object.keys(baseData).filter((key) => {
    if (excluded.has(key)) {
      return false;
    }
    // Avoid double counting arrays that will be handled via formArrays.
    return !isArrayValue(baseData[key]);
  });
  let totalFields = baseKeys.length;
  let filledFields = baseKeys.reduce((acc, key) => {
    return isFilled(baseData[key]) ? acc + 1 : acc;
  }, 0);

  (options.formArrays ?? []).forEach((config) => {
    const rows = resolveArray(config.value);
    if (rows.length === 0) {
      return;
    }
    const rowExcluded = new Set(config.excludedFields ?? DEFAULT_ROW_EXCLUDED);
    rows.forEach((row) => {
      const rowValue = resolveRowValue(row);
      const rowKeys = Object.keys(rowValue).filter((key) => !rowExcluded.has(key));
      totalFields += rowKeys.length;
      rowKeys.forEach((key) => {
        if (isFilled(rowValue[key])) {
          filledFields += 1;
        }
      });
    });
  });

  const percentage = totalFields ? (filledFields / totalFields) * 100 : 0;
  return { totalFields, filledFields, percentage };
}
