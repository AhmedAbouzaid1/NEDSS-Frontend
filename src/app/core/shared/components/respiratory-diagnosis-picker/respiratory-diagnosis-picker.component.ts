import { Component, forwardRef } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import {
  RESPIRATORY_DIAGNOSIS_OPTIONS,
  RespiratoryDiagnosisType,
  parseRespiratoryDiagnosisTypes,
  serializeRespiratoryDiagnosisTypes,
} from '../../utilis/respiratory-diagnosis';

@Component({
  selector: 'app-respiratory-diagnosis-picker',
  templateUrl: './respiratory-diagnosis-picker.component.html',
  styleUrls: ['./respiratory-diagnosis-picker.component.css'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => RespiratoryDiagnosisPickerComponent),
      multi: true,
    },
  ],
})
export class RespiratoryDiagnosisPickerComponent implements ControlValueAccessor {
  readonly options = RESPIRATORY_DIAGNOSIS_OPTIONS;
  readonly lang = localStorage.getItem('ls.currentLang') === 'en' ? 'en' : 'ar';
  selected: RespiratoryDiagnosisType[] = [];
  disabled = false;

  private onChange: (value: string | null) => void = () => {};
  private onTouched: () => void = () => {};

  writeValue(value: string | null): void {
    this.selected = parseRespiratoryDiagnosisTypes(value);
  }

  registerOnChange(fn: (value: string | null) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.disabled = isDisabled;
  }

  isSelected(id: RespiratoryDiagnosisType): boolean {
    return this.selected.includes(id);
  }

  get allSelected(): boolean {
    return this.options.every((option) => this.isSelected(option.id));
  }

  toggle(id: RespiratoryDiagnosisType): void {
    if (this.disabled) {
      return;
    }
    this.emit(this.isSelected(id) ? this.selected.filter((x) => x !== id) : [...this.selected, id]);
  }

  toggleAll(): void {
    if (this.disabled) {
      return;
    }
    this.emit(this.allSelected ? [] : this.options.map((option) => option.id));
  }

  private emit(ids: RespiratoryDiagnosisType[]): void {
    this.selected = parseRespiratoryDiagnosisTypes(ids.join(','));
    this.onChange(serializeRespiratoryDiagnosisTypes(this.selected));
    this.onTouched();
  }
}
