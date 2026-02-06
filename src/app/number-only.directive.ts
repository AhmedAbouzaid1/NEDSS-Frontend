import { Directive, ElementRef, HostListener } from '@angular/core';

@Directive({
    selector: '[numberOnlyDirective]'
})
export class NumberOnlyDirective {

    constructor(private elementRef: ElementRef) { }

    @HostListener('input', ['$event'])
    onInputChange(event: Event) {
        const inputElement = event.target as HTMLInputElement;
        const inputValue = inputElement.value;
        inputElement.value = inputValue.replace(/[^0-9]/g, ''); // Remove non-numeric characters
    }
}