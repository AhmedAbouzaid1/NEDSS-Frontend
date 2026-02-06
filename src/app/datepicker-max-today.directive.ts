import { Directive, ElementRef, OnInit, Renderer2 } from '@angular/core';

@Directive({
  selector: '[appDatepickerMaxToday]'
})
export class DatepickerMaxTodayDirective implements OnInit {

  constructor(private el: ElementRef, private renderer: Renderer2) { }

  ngOnInit() {
    let today = new Date();

    let datepickerInputs = this.el.nativeElement.querySelectorAll('input.mat-datepicker-input');

    datepickerInputs.forEach((input: HTMLInputElement) => {
      this.renderer.setAttribute(input, 'max', this.formatDate(today));
    });
  }

  private formatDate(date: Date): string {
    let year = date.getFullYear();
    let month = (date.getMonth() + 1).toString().padStart(2, '0');
    let day = date.getDate().toString().padStart(2, '0');
    return `${year}/${month}/${day}`;

  }

}
