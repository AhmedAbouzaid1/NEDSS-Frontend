import {
  Component,
  EventEmitter,
  Input,
  Output,
  forwardRef,
} from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

@Component({
  selector: 'app-date-field',
  templateUrl: './date-field.component.html',
  styleUrls: ['./date-field.component.css'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => DateFieldComponent),
      multi: true,
    },
  ],
})
export class DateFieldComponent implements ControlValueAccessor {
  @Input() label?: string;
  @Input() required = false;
  @Input() tabindex?: number | string;

  @Input() set min(value: string | Date | null | undefined) {
    this.minDate = this.toDate(value);
  }
  @Input() set max(value: string | Date | null | undefined) {
    this.maxDate = value == null ? new Date() : this.toDate(value);
  }

  @Output() blurred = new EventEmitter<void>();
  @Output() changed = new EventEmitter<string | null>();

  value: Date | null = null;
  minDate: Date | null = null;
  maxDate: Date | null = new Date();
  disabled = false;

  private onChange: (value: string | null) => void = () => {};
  private onTouched: () => void = () => {};

  writeValue(value: string | Date | null): void {
    this.value = this.toDate(value);
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

  onPickerChange(event: { value: Date | null }): void {
    let date = event.value;
    if (date && this.maxDate && date > this.maxDate) {
      date = null;
    }
    if (date && this.minDate && date < this.minDate) {
      date = null;
    }
    this.value = date;
    const iso = this.toIso(date);
    this.onChange(iso);
    this.changed.emit(iso);
  }

  onBlur(): void {
    this.onTouched();
    this.blurred.emit();
  }

  private toDate(value: string | Date | null | undefined): Date | null {
    if (!value) {
      return null;
    }
    if (value instanceof Date) {
      return value;
    }
    const match = /^(\d{4})-(\d{2})-(\d{2})/.exec(value);
    if (match) {
      return new Date(+match[1], +match[2] - 1, +match[3]);
    }
    const parsed = new Date(value);
    return isNaN(parsed.getTime()) ? null : parsed;
  }

  private toIso(date: Date | null): string | null {
    if (!date) {
      return null;
    }
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    return `${year}-${month}-${day}`;
  }
}
