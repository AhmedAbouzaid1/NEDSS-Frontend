import { Directive, EventEmitter, HostListener, Output } from '@angular/core';

const TEXT_INPUT_TYPES = ['', 'text', 'search', 'number', 'tel', 'email'];

@Directive({
  selector: '[appEnterSearch]',
})
export class EnterSearchDirective {
  @Output('appEnterSearch') enterSearch = new EventEmitter<void>();

  @HostListener('keydown.enter', ['$event'])
  onEnter(event: KeyboardEvent): void {
    const target = event.target as HTMLElement;
    if (!(target instanceof HTMLInputElement)) return;
    if (!TEXT_INPUT_TYPES.includes(target.type) || target.readOnly) return;
    if (target.closest('.p-dropdown, .p-multiselect, .p-autocomplete, .mat-datepicker-content')) return;
    event.preventDefault();
    this.enterSearch.emit();
  }
}
