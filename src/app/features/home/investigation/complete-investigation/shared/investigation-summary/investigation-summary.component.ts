import { Component, Input, OnChanges, OnDestroy } from '@angular/core';
import { FormArray, FormGroup } from '@angular/forms';
import { Subscription } from 'rxjs';

export interface InvestigationSummaryConditionalExclude {
  controlName: string;
  excludeFields: string[];
  includeValues?: any[];
  excludeValues?: any[];
}

const DEFAULT_EXCLUDED_FIELDS = [
  'id',
  'patientID',
  'investigationCompletePercentage',
  'diseaseGroupId',
  'createdDate',
];

@Component({
  selector: 'app-investigation-summary',
  templateUrl: './investigation-summary.component.html',
  styleUrls: ['./investigation-summary.component.css'],
})
export class InvestigationSummaryComponent implements OnChanges, OnDestroy {
  @Input() formGroup!: FormGroup;
  @Input() patientName: string | null = null;
  @Input() excludedFields: string[] = [];
  @Input() conditionalExcludes: InvestigationSummaryConditionalExclude[] = [];
  @Input() includeFormArrays?: string[];
  @Input() percentageControlName = 'investigationCompletePercentage';

  allFilledControlsCount = 0;
  allControllesCount = 0;
  percentage = 0;

  private formSub?: Subscription;

  ngOnChanges(): void {
    this.bindForm();
    this.recalculate();
  }

  ngOnDestroy(): void {
    this.formSub?.unsubscribe();
  }

  recalculate(): void {
    if (!this.formGroup) {
      this.resetCounts();
      return;
    }

    const data = this.formGroup.value ?? {};
    const excluded = new Set<string>([
      ...DEFAULT_EXCLUDED_FIELDS,
      ...(this.excludedFields || []),
    ]);

    const conditional = this.conditionalExcludes || [];
    conditional.forEach((rule) => {
      if (!rule || !rule.excludeFields || rule.excludeFields.length === 0) {
        return;
      }
      const value = this.formGroup.get(rule.controlName)?.value;
      if (rule.includeValues && rule.includeValues.length > 0) {
        if (!this.valueInList(value, rule.includeValues)) {
          rule.excludeFields.forEach((field) => excluded.add(field));
        }
        return;
      }
      if (rule.excludeValues && rule.excludeValues.length > 0) {
        if (this.valueInList(value, rule.excludeValues)) {
          rule.excludeFields.forEach((field) => excluded.add(field));
        }
      }
    });

    const formArrayNames = this.resolveFormArrayNames();
    let totalFields = 0;
    let filledFields = 0;

    Object.keys(data).forEach((key) => {
      if (excluded.has(key) || formArrayNames.includes(key)) {
        return;
      }
      totalFields += 1;
      const value = data[key];
      if (value !== null && value !== '' && value !== 'null') {
        filledFields += 1;
      }
    });

    formArrayNames.forEach((name) => {
      if (excluded.has(name)) {
        return;
      }
      const control = this.formGroup.get(name);
      if (control instanceof FormArray) {
        const stats = this.countFormArrayCompletion(control);
        totalFields += stats.totalFields;
        filledFields += stats.filledFields;
      }
    });

    this.allControllesCount = totalFields;
    this.allFilledControlsCount = filledFields;
    this.percentage =
      totalFields === 0
        ? 0
        : parseFloat(((filledFields / totalFields) * 100).toFixed(2));

    const percentControl = this.formGroup.get(this.percentageControlName);
    if (percentControl) {
      percentControl.setValue(this.percentage, { emitEvent: false });
    }
  }

  private bindForm(): void {
    this.formSub?.unsubscribe();
    if (!this.formGroup) {
      return;
    }
    this.formSub = this.formGroup.valueChanges.subscribe(() => {
      this.recalculate();
    });
  }

  private resolveFormArrayNames(): string[] {
    if (Array.isArray(this.includeFormArrays) && this.includeFormArrays.length > 0) {
      return this.includeFormArrays;
    }
    if (!this.formGroup || !this.formGroup.controls) {
      return [];
    }
    return Object.keys(this.formGroup.controls).filter(
      (key) => this.formGroup.get(key) instanceof FormArray
    );
  }

  private countFormArrayCompletion(
    formArray: FormArray
  ): { totalFields: number; filledFields: number } {
    if (!formArray || !Array.isArray(formArray.controls) || formArray.controls.length === 0) {
      return { totalFields: 0, filledFields: 0 };
    }

    let totalFields = 0;
    let filledFields = 0;

    formArray.controls.forEach((row) => {
      const rowValue = (row as FormGroup).value;
      const rowKeys = Object.keys(rowValue).filter((key) => key !== 'id');
      totalFields += rowKeys.length;

      rowKeys.forEach((key) => {
        const v = rowValue[key];
        if (v !== null && v !== '' && v !== 'null') {
          filledFields += 1;
        }
      });
    });

    return { totalFields, filledFields };
  }

  private resetCounts(): void {
    this.allControllesCount = 0;
    this.allFilledControlsCount = 0;
    this.percentage = 0;
  }

  private valueInList(value: any, list: any[]): boolean {
    return list.some((item) => item == value);
  }
}
